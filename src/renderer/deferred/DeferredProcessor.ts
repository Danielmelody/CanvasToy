import { mat4 } from "gl-matrix";
import { Camera } from "../../cameras/Camera";
import { DataType } from "../../DataTypeEnum";
import { RectGeometry } from "../../geometries/RectGeometry";
import { BoundingBox2D } from "../../Intersections/BoundingBox";
import { Light } from "../../lights/Light";
import { PointLight } from "../../lights/PointLight";
import { IMaterial } from "../../materials/Material";
import { StandardMaterial } from "../../materials/surface/StandardMaterial";
import { Mesh } from "../../Mesh";
import { Object3d } from "../../Object3d";
import { Scene } from "../../Scene";
import { Program } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { DataTexture } from "../../textures/DataTexture";
import { Texture } from "../../textures/Texture";
import { Attachment, FrameBuffer } from "../FrameBuffer";
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

    public pointLightShader: Program;
    public spotLightShader: Program;

    private tileLightIndexMap: DataTexture<Float32Array>;
    private tileLightOffsetCountMap: DataTexture<Float32Array>;
    private lightPositionRadiusMap: DataTexture<Float32Array>;
    private lightColorIdensityMap: DataTexture<Float32Array>;

    private tileLightIndex: number[][] = [];
    private linearLightIndex: number[] = [];

    constructor(
        gl: WebGLRenderingContext,
        ext: WebGLExtension,
        scene: Scene,
        camera: Camera,
    ) {
        this.gl = gl;
        this.ext = ext;
        this.gBuffer = new FrameBuffer(gl);
        this.horizontalTileNum = Math.floor(
            this.gl.canvas.width / this.tilePixelSize,
        );
        this.verticalTileNum = Math.floor(
            this.gl.canvas.height / this.tilePixelSize,
        );
        this.tileCount = this.horizontalTileNum * this.verticalTileNum;
        this.initGeometryProcess(scene);
        this.initTiledPass(scene);
        scene.programSetUp = true;
    }

    public process(scene: Scene, camera: Camera, materials: IMaterial[]) {
        Graphics.logIfFrameBufferInvalid(this.gl, this.gBuffer.glFramebuffer);
        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            this.gBuffer.glFramebuffer,
        );
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.disable(this.gl.BLEND);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        for (const object of scene.objects) {
            if (object instanceof Mesh) {
                const mesh = object as Mesh;
                const standardMaterials = mesh.materials.filter(
                    (mat) => mat instanceof StandardMaterial,
                );
                if (standardMaterials.length > 0) {
                    const material = standardMaterials[0] as StandardMaterial;
                    material.geometryShader.pass({
                        mesh,
                        material,
                        scene,
                        camera,
                    });
                }
            }
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.depthFunc(this.gl.EQUAL);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
        this.tileLightPass(
            scene,
            camera,
            scene.pointLights,
            this.pointLightShader,
        );
    }

    private initGeometryProcess(scene: Scene) {
        this.gBuffer.attachments.color.disable();
        this.gBuffer.attachments.depth
            .asTargetTexture(new Texture(this.gl), this.gl.TEXTURE_2D)
            .targetTexture.setType(this.gl.UNSIGNED_SHORT)
            .setFormat(this.gl.DEPTH_COMPONENT)
            .apply(this.gl);
        this.gBuffer.extras.push(
            //  first for normal, materialRoughness
            new Attachment(
                this.gBuffer,
                (ext: WebGLDrawBuffers) => ext.COLOR_ATTACHMENT0_WEBGL,
            ).asTargetTexture(new Texture(this.gl), this.gl.TEXTURE_2D),
            //  second for materialAlbedo and materialMetallic
            new Attachment(
                this.gBuffer,
                (ext: WebGLDrawBuffers) => ext.COLOR_ATTACHMENT1_WEBGL,
            ).asTargetTexture(new Texture(this.gl), this.gl.TEXTURE_2D),
            //  third for 32-bit depth
            new Attachment(
                this.gBuffer,
                (ext: WebGLDrawBuffers) => ext.COLOR_ATTACHMENT2_WEBGL,
            ).asTargetTexture(new Texture(this.gl), this.gl.TEXTURE_2D),
        );

        this.gBuffer.attach(this.gl, this.ext.draw_buffer);
    }

    private tileLightPass(
        scene: Scene,
        camera: Camera,
        lights: Light[],
        lightShader: Program,
    ) {
        //  TODO: add spot light and dirctional light support
        const lightInfo = [[], []];
        for (const light of lights) {
            lightInfo[0].push(...light.getDeferredInfo(0, camera));
            lightInfo[1].push(...light.getDeferredInfo(1, camera));
        }
        this.lightColorIdensityMap.resetData(
            this.gl,
            new Float32Array(lightInfo[0]),
            lightInfo[0].length / 4,
            1,
        );

        this.lightPositionRadiusMap.resetData(
            this.gl,
            new Float32Array(lightInfo[1]),
            lightInfo[1].length / 4,
            1,
        );

        for (let i = 0; i < this.tileCount; ++i) {
            this.tileLightIndex[i] = [];
        }

        //  TODO: add spot light and dirctional light support
        this.linearLightIndex = [];
        for (let i = 0; i < scene.pointLights.length; ++i) {
            const light = scene.pointLights[i];
            const box = light.getProjecttionBoundingBox2D(camera);
            this.fillTileWithBoundingBox2D(camera, box, i);
        }

        const lightOffsetCount = [];
        let offset = 0;
        for (const indices of this.tileLightIndex) {
            lightOffsetCount.push(offset + 0.5);
            lightOffsetCount.push(indices.length);
            offset += indices.length;
            for (const index of indices) {
                this.linearLightIndex.push(
                    (index + 0.5) / scene.pointLights.length,
                );
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
        lightShader.pass({ mesh: this.tile, camera });
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
        this.tileLightIndexMap = new DataTexture(this.gl, new Float32Array([]))
            .setFormat(this.gl.LUMINANCE)
            .setType(this.gl.FLOAT);
        //  .setMinFilter(this.gl.LINEAR)
        //  .setMagFilter(this.gl.LINEAR);
        this.tileLightOffsetCountMap = new DataTexture(
            this.gl,
            new Float32Array([]),
            this.horizontalTileNum,
            this.verticalTileNum,
        )
            .setFormat(this.gl.LUMINANCE_ALPHA)
            .setType(this.gl.FLOAT);
        //  .setMinFilter(this.gl.LINEAR)
        //  .setMagFilter(this.gl.LINEAR);

        this.lightColorIdensityMap = new DataTexture(
            this.gl,
            new Float32Array([]),
        )
            .setType(this.gl.FLOAT)
            .setFormat(this.gl.RGBA);
        //  .setMinFilter(this.gl.LINEAR)
        //  .setMagFilter(this.gl.LINEAR);

        this.lightPositionRadiusMap = new DataTexture(
            this.gl,
            new Float32Array([]),
        )
            .setType(this.gl.FLOAT)
            .setFormat(this.gl.RGBA);
        //  .setMinFilter(this.gl.LINEAR)
        //  .setMagFilter(this.gl.LINEAR);

        this.pointLightShader = new ShaderBuilder()
            .resetShaderLib()
            .addDefinition(ShaderSource.definitions__material_pbs_glsl)
            .addDefinition(ShaderSource.definitions__light_glsl)
            .setLightModel(ShaderSource.light_model__pbs_ggx_glsl)
            .addShaderLib(ShaderSource.calculators__unpackFloat1x32_glsl)
            .setShadingVert(
                ShaderSource.interploters__deferred__tiledLight_vert,
            )
            .setShadingFrag(
                ShaderSource.interploters__deferred__tiledLightPoint_frag,
            )
            .setExtraRenderParamHolder("lightInfo", {
                uniforms: {
                    inverseProjection: {
                        type: DataType.mat4,
                        updator: ({ camera }) =>
                            mat4.invert(mat4.create(), camera.projectionMatrix),
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
                    normalRoughnessTex: {
                        source: this.gBuffer.extras[0].targetTexture,
                    },
                    albedoMetallicTex: {
                        source: this.gBuffer.extras[1].targetTexture,
                    },
                    depthTex: { source: this.gBuffer.extras[2].targetTexture },
                    uLightOffsetCount: { source: this.tileLightOffsetCountMap },
                    uLightPositionRadius: {
                        source: this.lightPositionRadiusMap,
                    },
                    uLightColorIdensity: { source: this.lightColorIdensityMap },
                    uLightIndex: { source: this.tileLightIndexMap },
                },
            })
            .build(this.gl);
        Graphics.copyDataToVertexBuffer(this.gl, this.tile.geometry);
        this.pointLightShader.make();
    }

    private fillTileWithBoundingBox2D(
        camera: Camera,
        box: BoundingBox2D,
        lightIndex: number,
    ) {
        const leftTile = Math.max(
            Math.floor((box.left / 2.0 + 0.5) * this.horizontalTileNum) - 1,
            0,
        );
        const topTile = Math.min(
            Math.ceil((box.top / 2.0 + 0.5) * this.verticalTileNum) + 1,
            this.verticalTileNum,
        );
        const rightTile = Math.min(
            Math.ceil((box.right / 2.0 + 0.5) * this.horizontalTileNum) + 1,
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
