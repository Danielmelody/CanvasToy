/// <reference path="../textures/Texture.ts"/>
/// <reference path="../materials/Material.ts"/>

namespace CanvasToy {

    export class Renderer {

        public readonly canvas: HTMLCanvasElement = null;

        public readonly gl: WebGLRenderingContext = null;

        public readonly ext: {
            depth_texture: WEBGL_depth_texture,
            draw_buffer: WebGLDrawBuffers,
        };

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

        private materials: IMaterial[] = [];

        constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;
            this.gl = initWebwebglContext(canvas);
            this.ext = {
                depth_texture: this.gl.getExtension("WEBGL_depth_texture"),
                draw_buffer: this.gl.getExtension("WEBGL_draw_buffers"),
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

        public render(scene: Scene, camera: Camera) {
            camera.adaptTargetRadio(this.canvas);
            if (this.scenes.indexOf(scene) !== -1 || this.preloadRes.length > 0) {
                return;
            }
            this.scenes.push(scene);

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

            // TODO: Dynamic processor strategy
            const processor = new ForwardProcessor(this.gl, scene, camera);

            for (const material of materials) {
                for (const textureGetter of material.textures) {
                    this.loadTexture(textureGetter(material));
                }
            }

            scene.programSetUp = true;
            this.renderQueue.push((deltaTime: number) => {
                scene.update(deltaTime);
                this.gl.clearColor(
                    scene.clearColor[0],
                    scene.clearColor[1],
                    scene.clearColor[2],
                    scene.clearColor[3],
                );
                processor.process(scene, camera, materials);
            });
        }

        public loadTexture(texture: Texture) {
            // if (texture instanceof RenderTargetTexture) {
            //     texture.unit = this.usedTextureNum;
            //     this.usedTextureNum++;
            //     program.textures.push(texture);
            //     this.gl.useProgram(program.webGlProgram);
            //     this.gl.activeTexture(this.gl.TEXTURE0 + texture.unit);
            //     this.gl.bindTexture(texture.target, texture.glTexture);
            //     return;
            // }
                if (!texture.image) {
                    this.configTexture(texture);
                    return;
                }
                const lastOnload = texture.image.onload;
                if (texture.image.complete) {
                    this.configTexture(texture);
                    return;
                }
                texture.image.onload = (et: Event) => {
                    if (lastOnload) {
                        lastOnload.apply(texture.image, et);
                    }
                    this.configTexture(texture);
                };
        }

        public configTexture(texture: Texture) {
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
            this.gl.bindTexture(texture.target, texture.glTexture);
            this.gl.texParameteri(texture.target, this.gl.TEXTURE_WRAP_S, texture.wrapS);
            this.gl.texParameteri(texture.target, this.gl.TEXTURE_WRAP_T, texture.wrapT);
            this.gl.texParameteri(texture.target, this.gl.TEXTURE_MAG_FILTER, texture.magFilter);
            this.gl.texParameteri(texture.target, this.gl.TEXTURE_MIN_FILTER, texture.minFilter);
            texture.setUpTextureData(this.gl);
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