import { mat4, vec3 } from "gl-matrix";
import { Camera } from "../../cameras/Camera";
import { DataType } from "../../DataTypeEnum";
import { RectGeometry } from "../../geometries/RectGeometry";
import { BoundingBox2D } from "../../Intersections/BoundingBox";
import { Light } from "../../lights/Light";
import { PointLight } from "../../lights/PointLight";
import { ShadowType } from "../../lights/ShadowType";
import { Material } from "../../materials/Material";
import { StandardMaterial } from "../../materials/StandardMaterial";
import { Mesh } from "../../Mesh";
import { Object3d } from "../../Object3d";
import { Scene } from "../../Scene";
import { Program, shaderPassLib } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { DataTexture } from "../../textures/DataTexture";
import { Texture } from "../../textures/Texture";
import { Attachment, AttachmentType, FrameBuffer } from "../FrameBuffer";
import { Graphics } from "../GraphicsUtils";
import { WebGLExtension } from "../IExtension";
import { IProcessor } from "../IProcessor";

export class DeferredProcessor implements IProcessor {

    public tile: Mesh;
    public readonly tilePixelSize: number = 32;

    public readonly horizontalTileNum;
    public readonly verticalTileNum;
    public readonly tileCount;
    public readonly gBuffer: FrameBuffer;
    public readonly gl: WebGLRenderingContext;
    public readonly ext: WebGLExtension;

    public tileProgram: Program;
    private tileLightIndexMap: DataTexture<Uint8Array>;
    private tileLightOffsetCountMap: DataTexture<Float32Array>;
    private tileLightCountMap: DataTexture<Uint8Array>;
    private lightPositionRadiusMap: DataTexture<Float32Array>;
    private lightColorIdensityMap: DataTexture<Float32Array>;

    private tileLightIndex: number[][] = [];
    private linearLightIndex: number[] = [];

    constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene, camera: Camera) {
        this.gl = gl;
        this.ext = ext;
        this.gBuffer = new FrameBuffer(gl);
        this.horizontalTileNum = Math.floor(this.gl.canvas.width / this.tilePixelSize);
        this.verticalTileNum = Math.floor(this.gl.canvas.height / this.tilePixelSize);
        this.tileCount = this.horizontalTileNum * this.verticalTileNum;
        this.initGeometryProcess(scene);
        this.initTiledPass(scene);
        scene.programSetUp = true;
    }

    public process(scene: Scene, camera: Camera, materials: Material[]) {
        Graphics.logIfFrameBufferInvalid(this.gl, this.gBuffer.glFramebuffer);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.gBuffer.glFramebuffer);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.disable(this.gl.BLEND);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        for (const object of scene.objects) {
            if (object instanceof Mesh) {
                const mesh = object as Mesh;
                for (const material of mesh.materials) {
                    if (material instanceof StandardMaterial) {
                        material.geometryShader.pass({ mesh, camera });
                    }
                }
            }
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.depthFunc(this.gl.EQUAL);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
        this.tileLightPass(scene, camera);
    }

    private initGeometryProcess(scene: Scene) {
        this.gBuffer.attachments.color.disable();
        this.gBuffer.attachments.depth
            .setType(this.gl, AttachmentType.Texture)
            .targetTexture
            .setType(this.gl.UNSIGNED_SHORT)
            .setFormat(this.gl.DEPTH_COMPONENT)
            .apply(this.gl);
        this.gBuffer.extras.push(
            // first for normal, depth and materialSpecExp
            new Attachment(this.gBuffer, (ext: WebGLDrawBuffers) => ext.COLOR_ATTACHMENT0_WEBGL)
                .setType(this.gl, AttachmentType.Texture),
            // second for materialDiff and materialSpec
            new Attachment(this.gBuffer, (ext: WebGLDrawBuffers) => ext.COLOR_ATTACHMENT1_WEBGL)
                .setType(this.gl, AttachmentType.Texture),
        );
        for (const colorAttach of this.gBuffer.extras) {
            colorAttach.targetTexture
                .setType(this.gl.FLOAT)
                .setFormat(this.gl.RGBA)
                .setMinFilter(this.gl.NEAREST)
                .setMagFilter(this.gl.NEAREST)
                .apply(this.gl);
        }

        this.gBuffer.attach(this.gl, this.ext.draw_buffer);

        for (const object of scene.objects) {
            if (object instanceof Mesh) {
                const geometryProgram = new ShaderBuilder()
                    .resetShaderLib()
                    .setShadingVert(ShaderSource.interploters__deferred__geometry_vert)
                    .setShadingFrag(ShaderSource.interploters__deferred__geometry_frag)
                    .build(this.gl);
                for (const material of (object as Mesh).materials) {
                    if (material instanceof StandardMaterial) {
                        geometryProgram.extensionStatements.push("#extension GL_EXT_draw_buffers : require");
                        material.geometryShader = geometryProgram;
                    }
                }
            }
        }
    }

    private tileLightPass(scene: Scene, camera: Camera) {

        // TODO: add spot light and dirctional light support
        const lightColors = [];
        const lightPositionRadius = [];
        for (const light of scene.pointLights) {
            lightColors.push(
                light.color[0],
                light.color[1],
                light.color[2],
                light.idensity,
            );
            const lightPosInViewSpace = vec3.transformMat4(
                vec3.create(),
                light.position,
                camera.worldToObjectMatrix,
            );
            lightPositionRadius.push(
                lightPosInViewSpace[0],
                lightPosInViewSpace[1],
                lightPosInViewSpace[2],
                (light as PointLight).radius,
            );
        }
        this.lightColorIdensityMap.resetData(this.gl, new Float32Array(lightColors), lightColors.length / 4, 1);

        this.lightPositionRadiusMap.resetData(
            this.gl,
            new Float32Array(lightPositionRadius),
            lightPositionRadius.length / 4,
            1,
        );

        for (let i = 0; i < this.tileCount; ++i) {
            this.tileLightIndex[i] = [];
        }

        // TODO: add spot light and dirctional light support
        this.linearLightIndex = [];
        for (let i = 0; i < scene.pointLights.length; ++i) {
            const light = scene.pointLights[i];
            const box = light.getProjecttionBoundingBox2D(camera);
            this.fillTileWithBoundingBox2D(camera, box, i);
        }

        const lightOffsetCount = [];
        let offset = 0;
        for (const indices of this.tileLightIndex) {
            lightOffsetCount.push(offset);
            lightOffsetCount.push(indices.length);
            offset += indices.length;
            for (const index of indices) {
                this.linearLightIndex.push(index / scene.pointLights.length);
            }
        }

        this.tileLightIndexMap.resetData(
            this.gl,
            new Float32Array(this.linearLightIndex),
            this.linearLightIndex.length,
            1,
        );
        this.tileLightOffsetCountMap.resetData(
            this.gl,
            new Float32Array(lightOffsetCount),
            this.horizontalTileNum,
            this.verticalTileNum,
        );
        this.tileProgram.pass({ mesh: this.tile, camera });
    }

    private initTiledPass(scene: Scene) {

        if (this.tile === undefined) {
            this.tile = new Mesh(new RectGeometry(this.gl).build(), []);
        }
        for (let i = 0; i < this.horizontalTileNum; ++i) {
            for (let j = 0; j < this.verticalTileNum; ++j) {
                this.tileLightIndex.push([]);
            }
        }
        this.tileLightIndexMap = new DataTexture(
            this.gl,
            new Float32Array([]))
            .setFormat(this.gl.LUMINANCE)
            .setType(this.gl.FLOAT);
        // .setMinFilter(this.gl.LINEAR)
        // .setMagFilter(this.gl.LINEAR);
        this.tileLightOffsetCountMap = new DataTexture(
            this.gl,
            new Float32Array([]),
            this.horizontalTileNum,
            this.verticalTileNum,
        )
            .setFormat(this.gl.LUMINANCE_ALPHA)
            .setType(this.gl.FLOAT);
        // .setMinFilter(this.gl.LINEAR)
        // .setMagFilter(this.gl.LINEAR);
        this.tileLightCountMap = new DataTexture(
            this.gl,
            new Uint8Array([]),
            this.horizontalTileNum,
            this.verticalTileNum,
        ).setFormat(this.gl.LUMINANCE).setType(this.gl.UNSIGNED_BYTE);
        this.lightColorIdensityMap = new DataTexture(
            this.gl,
            new Float32Array([]))
            .setType(this.gl.FLOAT)
            .setFormat(this.gl.RGBA);
        // .setMinFilter(this.gl.LINEAR)
        // .setMagFilter(this.gl.LINEAR);

        this.lightPositionRadiusMap = new DataTexture(
            this.gl,
            new Float32Array([]))
            .setType(this.gl.FLOAT)
            .setFormat(this.gl.RGBA);
        // .setMinFilter(this.gl.LINEAR)
        // .setMagFilter(this.gl.LINEAR);

        this.tileProgram = new ShaderBuilder()
            .resetShaderLib()
            .addShaderLibFrag(ShaderSource.calculators__blinn_phong_glsl)
            .setShadingVert(ShaderSource.interploters__deferred__tiledLight_vert)
            .setShadingFrag(ShaderSource.interploters__deferred__tiledLight_frag)
            .setExtraRenderParamHolder("lightInfo", {
                uniforms: {
                    inverseProjection: {
                        type: DataType.mat4,
                        updator: ({ camera }) => mat4.invert(mat4.create(), camera.projectionMatrix),
                    },
                    uLightListLengthSqrt: {
                        type: DataType.float,
                        updator: () => this.linearLightIndex.length,
                    },
                    uHorizontalTileNum: {
                        type: DataType.float,
                        updator: () => this.horizontalTileNum,
                    },
                    uVerticalTileNum: {
                        type: DataType.float,
                        updator: () => this.verticalTileNum,
                    },
                    uTotalLightNum: {
                        type: DataType.float,
                        updator: () => scene.pointLights.length,
                    },
                },
                textures: {
                    uNormalDepthSE: { source: this.gBuffer.extras[0].targetTexture },
                    uDiffSpec: { source: this.gBuffer.extras[1].targetTexture },
                    uLightOffsetCount: { source: this.tileLightOffsetCountMap },
                    uLightPositionRadius: { source: this.lightPositionRadiusMap },
                    uLightColorIdensity: { source: this.lightColorIdensityMap },
                    uLightIndex: { source: this.tileLightIndexMap },
                },
            })
            .build(this.gl);
        Graphics.copyDataToVertexBuffer(this.gl, this.tile.geometry);
        this.tileProgram.make();
    }

    private fillTileWithBoundingBox2D(camera: Camera, box: BoundingBox2D, lightIndex: number) {
        const leftTile = Math.max(
            Math.floor((box.left / 2.0 + 0.5) * this.horizontalTileNum) - 1,
            0,
        );
        const topTile = Math.min(
            Math.ceil((box.top / 2.0 + 0.5) * this.verticalTileNum) + 1,
            this.verticalTileNum,
        );
        const rightTile = Math.min(
            Math.ceil(
                (box.right / 2.0 + 0.5) * this.horizontalTileNum) + 1,
            this.horizontalTileNum,
        );
        const bottomTile = Math.max(
            Math.floor((box.bottom / 2.0 + 0.5) * this.verticalTileNum) - 1,
            0,
        );
        for (let i = leftTile; i < rightTile; i++) {
            for (let j = bottomTile; j < topTile; j++) {
                const tileIndex = i + j * this.horizontalTileNum;
                if (tileIndex < this.tileCount && tileIndex >= 0) {
                    this.tileLightIndex[tileIndex].push(lightIndex);
                }
            }
        }
    }
}
