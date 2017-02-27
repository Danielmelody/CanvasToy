/// <reference path="../../Scene.ts"/>
/// <reference path="../../cameras/Camera.ts"/>
/// <reference path="../../Mesh.ts"/>
/// <reference path="../../shader/Program.ts"/>
/// <reference path="../GraphicsUtils.ts"/>
/// <reference path="../IExtension.ts"/>

namespace CanvasToy {
    export class DeferredProcessor implements IProcessor {

        public tile: RectGeometry;
        public readonly tilePixelSize: number = 32;

        public readonly horizontalTileNum;
        public readonly verticalTileNum;
        public readonly tileCount;
        public readonly gBuffer: FrameBuffer;
        public readonly geometryPasses: {} = {};
        public readonly gl: WebGLRenderingContext;
        public readonly ext: WebGLExtension;

        public tilePass: Program;

        private tileLightIndexMap: DataTexture<Uint8Array>;
        private tileLightOffsetMap: DataTexture<Uint8Array>;
        private tileLightOffMap: DataTexture<Uint8Array>;
        private tileLightCountMap: DataTexture<Uint8Array>;
        private lightPositionRadiusMap: DataTexture<Float32Array>;
        private lightColorIdensityMap: DataTexture<Float32Array>;

        private tileLightIndex: number[][] = [];

        constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene, camera: Camera) {
            this.gl = gl;
            this.ext = ext;
            this.gBuffer = new FrameBuffer(gl);
            this.horizontalTileNum = Math.floor(this.gl.canvas.width / this.tilePixelSize);
            this.verticalTileNum = Math.floor(this.gl.canvas.height / this.tilePixelSize);
            this.tileCount = this.horizontalTileNum * this.verticalTileNum;
            for (const object of scene.objects) {
                if (object instanceof Mesh) {
                    Graphics.copyDataToVertexBuffer(this.gl, (object as Mesh).geometry);
                }
            }
            this.initGeometryProcess(scene);
            this.initTiledPass(scene);
            scene.programSetUp = true;
        }

        public process(scene: Scene, camera: Camera, materials: Material[]) {
            Graphics.logIfFrameBufferInvalid(this.gl, this.gBuffer.glFramebuffer, this.ext);
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
                    this.gl.useProgram(this.geometryPasses[mesh as any].webGlProgram);
                    for (const material of mesh.materials) {
                        if (material.dirty) {
                            this.geometryPasses[mesh as any].resetMaterialDefines(material);
                            this.geometryPasses[mesh as any].make(mesh.scene);
                            Graphics.addRootUniformContainer(this.geometryPasses[mesh as any], (object as Mesh));
                            Graphics.addRootUniformContainer(this.geometryPasses[mesh as any], material);
                            material.dirty = false;
                        }
                        this.geometryPasses[mesh as any].pass(mesh, camera, material);
                        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
                        this.gl.drawElements(
                            this.gl.TRIANGLES,
                            mesh.geometry.faces.data.length,
                            this.gl.UNSIGNED_SHORT,
                            0,
                        );
                    }
                }
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            this.gl.disable(this.gl.DEPTH_TEST);
            this.gl.enable(this.gl.BLEND);
            this.gl.depthFunc(this.gl.EQUAL);
            this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
            this.passLightInfoToTexture(scene, camera);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.tile.faces.buffer);
            this.gl.drawElements(
                this.gl.TRIANGLES,
                this.tile.faces.data.length,
                this.gl.UNSIGNED_SHORT,
                0,
            );
        }

        private initGeometryProcess(scene: Scene) {
            this.gBuffer.attachments.color.disable();
            this.gBuffer.attachments.depth.setType(this.gl, AttachmentType.Texture);
            this.gBuffer.extras.push(
                // first for normal, depth and materialSpecExp
                new Attachment(this.gBuffer, (ext: WebGLDrawBuffers) => ext.COLOR_ATTACHMENT0_WEBGL)
                    .setType(this.gl, AttachmentType.Texture),
                // second for materialDiff and materialSpec
                new Attachment(this.gBuffer, (ext: WebGLDrawBuffers) => ext.COLOR_ATTACHMENT1_WEBGL)
                    .setType(this.gl, AttachmentType.Texture),
            );
            this.gBuffer.attachments.depth.targetTexture
                .setType(this.gl.UNSIGNED_SHORT)
                .setFormat(this.gl.DEPTH_COMPONENT)
                .bindTextureData(this.gl);
            for (const colorAttach of this.gBuffer.extras) {
                colorAttach.targetTexture
                    .setType(this.gl.FLOAT)
                    .setFormat(this.gl.RGBA)
                    .setMinFilter(this.gl.NEAREST)
                    .setMagFilter(this.gl.NEAREST)
                    .bindTextureData(this.gl);
            }

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.gBuffer.glFramebuffer);
            this.gl.bindTexture(
                this.gl.TEXTURE_2D,
                this.gBuffer.attachments.depth.targetTexture.glTexture,
            );
            this.gl.texImage2D(this.gl.TEXTURE_2D,
                0,
                this.gBuffer.attachments.depth.targetTexture.format,
                this.gl.canvas.width,
                this.gl.canvas.height,
                0,
                this.gBuffer.attachments.depth.targetTexture.format,
                this.gBuffer.attachments.depth.targetTexture.type,
                null,
            );
            this.gl.framebufferTexture2D(
                this.gl.FRAMEBUFFER,
                this.gBuffer.attachments.depth.attachmentCode(this.gl),
                this.gl.TEXTURE_2D,
                this.gBuffer.attachments.depth.targetTexture.glTexture,
                0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);

            for (const attachment of this.gBuffer.extras) {
                this.gl.bindTexture(this.gl.TEXTURE_2D, attachment.targetTexture.glTexture);
                this.gl.texImage2D(this.gl.TEXTURE_2D,
                    0,
                    attachment.targetTexture.format,
                    this.gl.canvas.width,
                    this.gl.canvas.height,
                    0,
                    attachment.targetTexture.format,
                    attachment.targetTexture.type,
                    null,
                );
                this.gl.framebufferTexture2D(
                    this.gl.FRAMEBUFFER,
                    attachment.attachmentCode(this.ext.draw_buffer),
                    this.gl.TEXTURE_2D,
                    attachment.targetTexture.glTexture,
                    0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            }
            Graphics.logIfFrameBufferInvalid(this.gl, this.gBuffer.glFramebuffer, this.ext);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.gBuffer.glFramebuffer);
            this.ext.draw_buffer.drawBuffersWEBGL([
                this.ext.draw_buffer.COLOR_ATTACHMENT0_WEBGL,
                this.ext.draw_buffer.COLOR_ATTACHMENT1_WEBGL,
            ]);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            for (const object of scene.objects) {
                if (object instanceof Mesh) {
                    const geometryProgram = new Program(
                        this.gl,
                        {
                            vertexShader: interploters__deferred__geometry_vert,
                            fragmentShader: interploters__deferred__geometry_frag,
                        },
                        defaultProgramPass,
                    );
                    for (const material of (object as Mesh).materials) {
                        geometryProgram.extensionStatements.push("#extension GL_EXT_draw_buffers : require");
                        geometryProgram.make(scene);
                        Graphics.addRootUniformContainer(geometryProgram, (object as Mesh));
                        Graphics.addRootUniformContainer(geometryProgram, material);
                        this.geometryPasses[(object as any)] = geometryProgram;
                    }
                }
            }
        }

        private passLightInfoToTexture(scene: Scene, camera: Camera) {
            const lightColors = [];
            const lightPositionRadius = [];
            for (const light of scene.lights) {
                if (light instanceof PointLight) {
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
            for (let i = 0; i < scene.lights.length; ++i) {
                const light = scene.lights[i];
                const box = light.getProjecttionBoundingBox(camera);
                this.fillTileWithBoundingBox(box, i);
            }
            const linearLightIndex = [];
            const lightOffset = [];
            const lightCount = [];
            let offset = 0;
            for (const indices of this.tileLightIndex) {
                lightOffset.push(offset);
                lightCount.push(indices.length);
                offset += indices.length;
                for (const index of indices) {
                    linearLightIndex.push(index);
                }
            }
            this.tileLightCountMap.resetData(this.gl, new Uint8Array(lightCount), lightCount.length, 1);
            this.tileLightOffsetMap.resetData(this.gl, new Uint8Array(lightOffset), lightOffset.length, 1);
            this.tileLightIndexMap.resetData(this.gl, new Uint8Array(linearLightIndex), linearLightIndex.length, 1);
            this.tilePass.pass(null, camera, null);
        }

        private initTiledPass(scene: Scene) {

            if (this.tile === undefined) {
                this.tile = new RectGeometry(this.gl).build();
            }
            for (let i = 0; i < this.horizontalTileNum; ++i) {
                this.tileLightIndex.push([]);
            }
            this.tileLightIndexMap = new DataTexture(
                this.gl,
                new Uint8Array([]),
            ).setFormat(this.gl.LUMINANCE).setType(this.gl.UNSIGNED_BYTE);
            this.tileLightOffsetMap = new DataTexture(
                this.gl,
                new Uint8Array([]),
                this.horizontalTileNum,
                this.verticalTileNum,
            ).setFormat(this.gl.LUMINANCE).setType(this.gl.UNSIGNED_BYTE);
            this.tileLightCountMap = new DataTexture(
                this.gl,
                new Uint8Array([]),
                this.horizontalTileNum,
                this.verticalTileNum,
            ).setFormat(this.gl.LUMINANCE).setType(this.gl.UNSIGNED_BYTE);
            this.lightColorIdensityMap = new DataTexture(
                this.gl,
                new Float32Array([]),
            ).setType(this.gl.FLOAT).setFormat(this.gl.RGBA);

            this.lightPositionRadiusMap = new DataTexture(
                this.gl,
                new Float32Array([]),
            ).setType(this.gl.FLOAT).setFormat(this.gl.RGBA);

            this.tilePass = new Program(
                this.gl,
                {
                    vertexShader: interploters__deferred__tiledLight_vert,
                    fragmentShader:
                        calculators__blinn_phong_glsl +
                        interploters__deferred__tiledLight_frag,
                },
                {
                    faces: () => this.tile.faces,
                    uniforms: {
                        cameraFar: {
                            type: DataType.float,
                            updator: (mesh, camera: Camera) => camera.far,
                        },
                        cameraNear: {
                            type: DataType.float,
                            updator: (mesh, camera: Camera) => camera.near,
                        },
                        inverseProjection : {
                            type: DataType.mat4,
                            updator: (mesh, camera: Camera) => mat4.invert(mat4.create() ,camera.projectionMatrix),
                        },
                        uHorizontalTileNum:  {
                            type: DataType.float,
                            updator: () => this.horizontalTileNum,
                        },
                        uVerticalTileNum:  {
                            type: DataType.float,
                            updator: () => this.verticalTileNum,
                        },
                    },
                    textures: {
                        uNormalDepthSE : () => this.gBuffer.extras[0].targetTexture,
                        uDiffSpec : () => this.gBuffer.extras[1].targetTexture,
                        uLightIndex : () => this.tileLightIndexMap,
                        uLightCount : () => this.tileLightCountMap,
                        uLightOffset : () => this.tileLightOffsetMap,
                        uLightPositionRadius : () => this.lightPositionRadiusMap,
                        uLightColorIdensity : () => this.lightColorIdensityMap,
                    },
                    attributes : {
                        position : () => this.tile.attributes.position,
                    },
                },
            );
            Graphics.copyDataToVertexBuffer(this.gl, this.tile);
            this.tilePass.make(scene);
        }

        private fillTileWithBoundingBox(box: BoundingBox, lightIndex: number) {
            const leftTile = Math.max(Math.floor(box.left * this.gl.canvas.width / this.tilePixelSize), 0);
            const topTile = Math.min(
                Math.ceil(box.top * this.gl.canvas.height / this.tilePixelSize),
                this.gl.canvas.height / this.tilePixelSize,
            );
            const rightTile = Math.min(
                Math.ceil(box.right * this.gl.canvas.width / this.tilePixelSize),
                this.gl.canvas.width / this.tilePixelSize,
            );
            const bottomTile = Math.max(Math.floor(box.bottom * this.gl.canvas.height / this.tilePixelSize), 0);
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
}
