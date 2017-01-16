/// <reference path="../textures/Texture.ts"/>
/// <reference path="../materials/Material.ts"/>

namespace CanvasToy {

    export enum RenderMode {
        Dynamic,
        Static,
    }

    export class Renderer {

        public readonly canvas: HTMLCanvasElement = null;

        public readonly gl: WebGLRenderingContext = null;

        public renderMode: RenderMode = RenderMode.Dynamic;

        public preloadRes: any[] = [];

        public usedTextureNum: number = 0;

        public renderTargets: Texture[] = [];

        public vertPrecision: string = "highp";

        public fragPrecision: string = "mediump";

        public isAnimating: boolean = false;

        public renderQueue: Function[] = [];

        public fbos: FrameBuffer[] = [];

        public scenes: Scene[] = [];

        public cameras: Camera[] = [];

        public frameRate: number = 1000 / 60;

        private stopped: boolean = false;

        constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;
            this.gl = initWebwebglContext(canvas);
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            setTimeout(this.main, this.frameRate);
        }

        public createFrameBuffer(): FrameBuffer {
            const fbo = new FrameBuffer(this.gl);
            this.fbos.push(fbo);
            return fbo;
        }

        public renderFBO(
            scene: Scene, camera: Camera) {
            this.buildSingleRender(scene, camera);
            for (let frameBuffer of this.fbos) {
                frameBuffer = frameBuffer as FrameBuffer;
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer.glFramebuffer);
                for (const rboi in frameBuffer.rbos) {
                    const renderBuffer: RenderBuffer = frameBuffer.rbos[rboi];
                    const rttTexture = renderBuffer.targetTexture;
                    if (rttTexture != null) {
                        this.gl.bindTexture(this.gl.TEXTURE_2D, rttTexture.glTexture);
                        this.gl.texImage2D(this.gl.TEXTURE_2D,
                            0, rttTexture.format,
                            this.canvas.width,
                            this.canvas.height,
                            0,
                            rttTexture.format,
                            this.gl.UNSIGNED_BYTE,
                            null,
                        );
                        this.gl.framebufferTexture2D(
                            this.gl.FRAMEBUFFER,
                            renderBuffer.attachment,
                            this.gl.TEXTURE_2D,
                            rttTexture.glTexture,
                            0);
                        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
                        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
                    }
                }
                this.renderQueue.push(() => {
                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer.glFramebuffer);
                    for (const rboi in frameBuffer.rbos) {
                        const renderBuffer: RenderBuffer = frameBuffer.rbos[rboi];
                        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderBuffer.glRenderBuffer);
                        this.gl.clearColor(
                            scene.clearColor[0],
                            scene.clearColor[1],
                            scene.clearColor[2],
                            scene.clearColor[3],
                        );
                        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
                        for (const object of scene.objects) {
                            this.renderObject(camera, object);
                        }
                        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
                    }
                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
                });
                if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) !== this.gl.FRAMEBUFFER_COMPLETE) {
                    console.log("frame buffer not completed"); // TODO: replace console.log with productive code
                }
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            }
        }

        public render(scene: Scene, camera: Camera) {
            this.buildSingleRender(scene, camera);
            switch (this.renderMode) {
                case RenderMode.Static:
                    this.renderQueue = [];
                    this.gl.clearColor(
                        scene.clearColor[0],
                        scene.clearColor[1],
                        scene.clearColor[2],
                        scene.clearColor[3],
                    );
                    this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
                    for (const object of scene.objects) {
                        this.renderObject(camera, object);
                    }
                    break;
                case RenderMode.Dynamic:
                    this.renderQueue.push(() => {
                        this.gl.clearColor(
                            scene.clearColor[0],
                            scene.clearColor[1],
                            scene.clearColor[2],
                            scene.clearColor[3],
                        );
                        for (const object of scene.objects) {
                            this.renderObject(camera, object);
                        }
                    });
                    break;
                default:
                    break;
            }
        }

        public buildSingleRender(scene: Scene, camera: Camera) {
            camera.adaptTargetRadio(this.canvas);
            if (this.scenes.indexOf(scene) !== -1 || this.preloadRes.length > 0) {
                return;
            }
            this.scenes.push(scene);
            for (const object of scene.objects) {
                if (object instanceof Mesh) {
                    const mesh = object as Mesh;
                    this.makeMeshPrograms(scene, mesh, camera);
                }
            }
            scene.programSetUp = true;
        }

        public makeMeshPrograms(scene: Scene, mesh: Mesh, camera: Camera) {

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(mesh.geometry.faces.data), this.gl.STATIC_DRAW);

            this.copyDataToVertexBuffer(mesh.geometry);

            if (mesh.materials.length > 1) {
                this.gl.enable(this.gl.BLEND);
                this.gl.blendFunc(this.gl.SRC_COLOR, this.gl.ONE_MINUS_SRC_COLOR);
            }

            for (const material of mesh.materials) {

                let cameraInScene = false;
                for (const object of scene.objects) {
                    if (object === camera) {
                        cameraInScene = true;
                        break;
                    }
                }

                if (!cameraInScene) {
                    console.error("Camera has not been added in Scene. Rendering stopped");
                    return;
                }

                material.program.make(this.gl, mesh, scene, camera, material);

                this.gl.useProgram(material.program.webGlProgram);

                for (const textureName in material.program.textures) {
                    if (material.program.textures[textureName] !== undefined) {
                        this.loadTexture(material.program, textureName, material.program.textures[textureName]);
                    }
                }

                if (scene.openLight) {
                    this.setUplights(scene, material, mesh, camera);
                }
            }
        }

        public loadTexture(program: Program, sampler: string, texture: Texture) {
            // if (texture instanceof RenderTargetTexture) {
            //     texture.unit = this.usedTextureNum;
            //     this.usedTextureNum++;
            //     program.textures.push(texture);
            //     this.gl.useProgram(program.webGlProgram);
            //     this.gl.activeTexture(this.gl.TEXTURE0 + texture.unit);
            //     this.gl.bindTexture(texture.type, texture.glTexture);
            //     return;
            // }
            if (!texture.image) {
                this.addTextureToProgram(program, sampler, texture);
                return;
            }
            const lastOnload = texture.image.onload;
            if (texture.image.complete) {
                this.addTextureToProgram(program, sampler, texture);
                return;
            }
            texture.image.onload = (et: Event) => {
                if (lastOnload) {
                    lastOnload.apply(texture.image, et);
                }
                this.addTextureToProgram(program, sampler, texture);
            };

        }

        public addTextureToProgram(program: Program, sampler: string, texture: Texture) {
            texture.unit = this.usedTextureNum;
            this.usedTextureNum++;
            program.textures.push(texture);
            this.gl.useProgram(program.webGlProgram);
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
            this.gl.activeTexture(this.gl.TEXTURE0 + texture.unit);
            this.gl.bindTexture(texture.type, texture.glTexture);
            this.gl.texParameteri(texture.type, this.gl.TEXTURE_WRAP_S, texture.wrapS);
            this.gl.texParameteri(texture.type, this.gl.TEXTURE_WRAP_T, texture.wrapT);
            this.gl.texParameteri(texture.type, this.gl.TEXTURE_MAG_FILTER, texture.magFilter);
            this.gl.texParameteri(texture.type, this.gl.TEXTURE_MIN_FILTER, texture.minFilter);
            texture.setUpTextureData(this.gl);
            program.addUniform(sampler, { type: DataType.int, updator: () => { return texture.unit; } });
        }

        public setUplights(scene: Scene, material: Material, mesh: Mesh, camera: Camera) {
            for (const index in scene.lights) {
                const light = scene.lights[index];

                // light properties pass
                const diffuse = "lights[" + index + "].diffuse";
                const specular = "lights[" + index + "].specular";
                const idensity = "lights[" + index + "].idensity";
                const position = "lights[" + index + "].position";
                material.program.addUniform(diffuse, {
                    type: DataType.vec3,
                    updator: () => { return light.diffuse; },
                });
                material.program.addUniform(specular, {
                    type: DataType.vec3,
                    updator: () => { return light.specular; },
                });
                material.program.addUniform(position, {
                    type: DataType.vec4,
                    updator: () => { return light.position; },
                });
                material.program.addUniform(idensity, {
                    type: DataType.float,
                    updator: () => { return light.idensity; },
                });

                // shadow map setup
                light.shadowRtt = new Texture(this.gl);
            }
        }

        private copyDataToVertexBuffer(geometry: Geometry) {
            for (const name in geometry.attributes) {
                const attribute: Attribute = geometry.attributes[name];
                if (attribute !== undefined) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(attribute.data), this.gl.STATIC_DRAW);
                    console.log(name + "buffer size:" + this.gl.getBufferParameter(this.gl.ARRAY_BUFFER, this.gl.BUFFER_SIZE));

                }
            }
        }

        private renderLight(light, scene) {
            // Undo
        }

        private renderObject(camera: Camera, object: Object) {
            if (object instanceof Mesh) {
                const mesh = object as Mesh;
                for (const material of mesh.materials) {
                    const program = material.program;
                    if (program.enableDepthTest) {
                        this.gl.enable(this.gl.DEPTH_TEST);
                    } else {
                        this.gl.disable(this.gl.DEPTH_TEST);
                    }
                    if (program.enableStencilTest) {
                        this.gl.enable(this.gl.STENCIL_TEST);
                    } else {
                        this.gl.disable(this.gl.STENCIL_TEST);
                    }
                    this.gl.useProgram(program.webGlProgram);
                    program.pass(mesh, camera, material);
                    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
                    this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.faces.data.length, this.gl.UNSIGNED_SHORT, 0);
                }
            }
        }

        private main = () => {
            for (const renderCommand of this.renderQueue) {
                renderCommand();
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
