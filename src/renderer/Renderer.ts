/// <reference path="../textures/Texture.ts"/>
/// <reference path="../materials/Material.ts"/>
/// <reference path="./GraphicsUtils.ts"/>
/// <reference path="./IExtension.ts"/>

namespace CanvasToy {

    export class Renderer {

        public readonly canvas: HTMLCanvasElement = null;

        public readonly gl: WebGLRenderingContext = null;

        public readonly ext: WebGLExtension;

        public debug: boolean = false;

        public preloadRes: any[] = [];

        public usedTextureNum: number = 0;

        public renderTargets: Texture[] = [];

        public vertPrecision: string = "highp";

        public fragPrecision: string = "mediump";

        public isAnimating: boolean = false;

        public renderQueue: Array<(deltaTime: number) => void> = [];

        public fbos: FrameBuffer[] = [];

        public scenes: Scene[] = [];

        public cameras: Camera[] = [];

        public frameRate: number = 1000 / 60;

        private stopped: boolean = false;

        private materials: Material[] = [];

        private isDeferred = false;

        constructor(canvas: HTMLCanvasElement, debug?: boolean) {
            this.canvas = canvas;
            this.debug = debug;
            this.gl = initWebwebglContext(canvas, debug);
            this.ext = {
                depth_texture: this.gl.getExtension("WEBGL_depth_texture"),
                draw_buffer: this.gl.getExtension("WEBGL_draw_buffers"),
                texture_float: this.gl.getExtension("OES_texture_float"),
                texture_float_linear: this.gl.getExtension("OES_texture_float_linear"),
            };
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            setTimeout(this.main, this.frameRate);
        }

        public stop() {
            this.stopped = true;
        }

        public start() {
            this.stopped = false;
            setTimeout(this.main, this.frameRate);
        }

        public createFrameBuffer(): FrameBuffer {
            const fbo = new FrameBuffer(this.gl);
            this.fbos.push(fbo);
            return fbo;
        }

        public renderFBO(
            scene: Scene, camera: Camera) {
            //
            // this.buildSingleRender(scene, camera);
            //
            //
            // for (let frameBuffer of this.fbos) {
            //     frameBuffer = frameBuffer as FrameBuffer;
            //     this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer.glFramebuffer);
            //     for (const atti in frameBuffer.attachments) {
            //         const attachment: Attachment = frameBuffer.attachments[atti];
            //         if (!attachment.isAble) {
            //             continue;
            //         }
            //         switch (attachment.type) {
            //             case AttachmentType.Texture:
            //                 this.gl.bindTexture(this.gl.TEXTURE_2D, attachment.targetTexture.glTexture);
            //                 this.gl.texImage2D(this.gl.TEXTURE_2D,
            //                     0,
            //                     attachment.targetTexture.format,
            //                     this.canvas.width,
            //                     this.canvas.height,
            //                     0,
            //                     attachment.targetTexture.format,
            //                     attachment.targetTexture.type,
            //                     null,
            //                 );
            //                 this.gl.framebufferTexture2D(
            //                     this.gl.FRAMEBUFFER,
            //                     attachment.attachmentCode(this.gl),
            //                     this.gl.TEXTURE_2D,
            //                     attachment.targetTexture.glTexture,
            //                     0);
            //                 this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            //                 break;
            //             case AttachmentType.RenderBuffer:
            //                 this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, attachment.glRenderBuffer);
            //                 this.gl.renderbufferStorage(
            //                     this.gl.RENDERBUFFER,
            //                     attachment.innerFormatForBuffer,
            //                     this.canvas.width,
            //                     this.canvas.height,
            //                 );
            //                 this.gl.framebufferRenderbuffer(
            //                     this.gl.FRAMEBUFFER,
            //                     attachment.attachmentCode(this.gl),
            //                     this.gl.RENDERBUFFER,
            //                     attachment.glRenderBuffer,
            //                 );
            //                 break;
            //             default: console.assert(false);
            //         }
            //
            //     }
            //     if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) !== this.gl.FRAMEBUFFER_COMPLETE) {
            //         console.error("" + this.gl.getError());
            //     }
            //
            //     this.renderQueue.push((deltaTime: number) => {
            //         this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer.glFramebuffer);
            //         scene.update(deltaTime);
            //         this.gl.clearColor(
            //             scene.clearColor[0],
            //             scene.clearColor[1],
            //             scene.clearColor[2],
            //             scene.clearColor[3],
            //         );
            //         this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            //         for (const object of scene.objects) {
            //             this.renderObject(camera, object);
            //         }
            //         this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            //         this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            //     });
            //     if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) !== this.gl.FRAMEBUFFER_COMPLETE) {
            //         console.log("frame buffer not completed"); // TODO: replace console.log with productive code
            //     }
            //     this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            // }
        }

        public handleResource(scene: Scene) {
            const objectPromises = [];
            for (const object of scene.objects) {
                const promise = object.asyncFinished();
                if (!!promise) {
                    objectPromises.push(promise.then(() => {
                        for (const child of object.children) {
                            scene.addObject(child);
                        }
                    }));
                }
            }
            return Promise.all(objectPromises).then(() => {
                const texturePromises = [];
                for (const object of scene.objects) {
                    if (object instanceof Mesh) {
                        for (const material of (object as Mesh).materials) {
                            const _material: any = material;
                            for (const textureGetter of _material.asyncResources) {
                                const promise: Promise<any> = textureGetter(_material);
                                if (!!promise) {
                                    texturePromises.push(promise.then((texture) => {
                                        texture.bindTextureData(this.gl);
                                        return Promise.resolve(texture);
                                    }));
                                }
                            }
                        }
                    }
                }
                return Promise.all(texturePromises);
            });
        }

        public forceDeferred() {
            this.isDeferred = true;
        }

        public render(scene: Scene, camera: Camera) {
            camera.adaptTargetRadio(this.canvas);
            if (this.scenes.indexOf(scene) !== -1 || this.preloadRes.length > 0) {
                return;
            }
            this.scenes.push(scene);

            this.handleResource(scene)
                .then(() => {
                    const materials = [];
                    for (const obj of scene.objects) {
                        if (obj instanceof Mesh) {
                            const mesh = obj as Mesh;
                            for (const material of mesh.materials) {
                                if (materials.indexOf(material) === -1) {
                                    materials.push(material);
                                }
                            }
                        }
                    }

                    for (const object of scene.objects) {
                        if (object instanceof Mesh) {
                            Graphics.copyDataToVertexBuffer(this.gl, (object as Mesh).geometry);
                        }
                    }

                    const shadowPreProcess = new ShadowPreProcess(this.gl, this.ext);

                    let processor;
                    // TODO: Dynamic processor strategy
                    if (this.isDeferred) {
                        processor = new DeferredProcessor(this.gl, this.ext, scene, camera);
                    } else {
                        processor = new ForwardProcessor(this.gl, this.ext, scene, camera);
                    }
                    scene.programSetUp = true;
                    this.renderQueue.push((deltaTime: number) => {
                        scene.update(deltaTime);
                        shadowPreProcess.process(scene, camera, materials);
                        processor.process(scene, camera, materials);
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        }

        private renderLight(light, scene) {
            // Undo
        }

        private main = () => {
            for (const renderCommand of this.renderQueue) {
                renderCommand(this.frameRate);
            }
            if (this.stopped) {
                return;
            }
            setTimeout(this.main, this.frameRate);
        }

        private initMatrix() {
            // this.glMatrix.setMatrixArrayType(Float32Array);
        }
    }
}
