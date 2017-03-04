/// <reference path="../../Scene.ts"/>
/// <reference path="../../cameras/Camera.ts"/>
/// <reference path="../../Mesh.ts"/>
/// <reference path="../../shader/Program.ts"/>
/// <reference path="../GraphicsUtils.ts"/>
/// <reference path="../IExtension.ts"/>

namespace CanvasToy {
    export class DeferredProcessor implements IProcessor {

        public tile: RectGeometry;
        public readonly tilePixelSize: number = 128;

        public readonly horizontalTileNum;
        public readonly verticalTileNum;
        public readonly tileCount;
        public readonly gBuffer: FrameBuffer;
        public readonly gl: WebGLRenderingContext;
        public readonly ext: WebGLExtension;

        public tilePass: Program;

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
                    for (const material of mesh.materials) {
                        if (material instanceof StandardMaterial) {
                            if (material.dirty) {
                                material.geometryProgram.resetMaterialDefines(material);
                                material.geometryProgram.make(mesh.scene);
                                Graphics.addRootUniformContainer(material.geometryProgram, (object as Mesh));
                                Graphics.addRootUniformContainer(material.geometryProgram, material);
                                material.dirty = false;
                            }
                            material.geometryProgram.pass(mesh, camera, material);
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
                        if (material instanceof StandardMaterial) {
                            geometryProgram.extensionStatements.push("#extension GL_EXT_draw_buffers : require");
                            geometryProgram.make(scene);
                            Graphics.addRootUniformContainer(geometryProgram, (object as Mesh));
                            Graphics.addRootUniformContainer(geometryProgram, material);
                            material.geometryProgram = geometryProgram;
                        }
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

            this.linearLightIndex = [];
            for (let i = 0; i < scene.lights.length; ++i) {
                const light = scene.lights[i];
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
                    this.linearLightIndex.push(index / scene.lights.length);
                }
            }
            // const lightIndexWidth = Math.ceil(Math.sqrt(this.linearLightIndex.length));
            // while(this.linearLightIndex.length < lightIndexWidth * lightIndexWidth) {
            //     this.linearLightIndex.push(0);
            // }
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
            this.tilePass.pass(null, camera, null);
        }

        private initTiledPass(scene: Scene) {

            if (this.tile === undefined) {
                this.tile = new RectGeometry(this.gl).build();
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
                .setType(this.gl.FLOAT)
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
                .setFormat(this.gl.RGBA)
            // .setMinFilter(this.gl.LINEAR)
            // .setMagFilter(this.gl.LINEAR);

            this.lightPositionRadiusMap = new DataTexture(
                this.gl,
                new Float32Array([]))
                .setType(this.gl.FLOAT)
                .setFormat(this.gl.RGBA)
            // .setMinFilter(this.gl.LINEAR)
            // .setMagFilter(this.gl.LINEAR);

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
                        inverseProjection: {
                            type: DataType.mat4,
                            updator: (mesh, camera: Camera) => mat4.invert(mat4.create(), camera.projectionMatrix),
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
                            updator: () => scene.lights.length,
                        },
                    },
                    textures: {
                        uNormalDepthSE: () => this.gBuffer.extras[0].targetTexture,
                        uDiffSpec: () => this.gBuffer.extras[1].targetTexture,
                        uLightOffsetCount: () => this.tileLightOffsetCountMap,
                        uLightPositionRadius: () => this.lightPositionRadiusMap,
                        uLightColorIdensity: () => this.lightColorIdensityMap,
                        uLightIndex: () => this.tileLightIndexMap,
                    },
                    attributes: {
                        position: () => this.tile.attributes.position,
                    },
                },
            );
            Graphics.copyDataToVertexBuffer(this.gl, this.tile);
            this.tilePass.make(scene);
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
}
