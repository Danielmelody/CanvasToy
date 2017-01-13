/// <reference path="../textures/Texture.ts"/>
/// <reference path="../materials/Material.ts"/>

namespace CanvasToy {

    export function setCanvas(canvas: HTMLCanvasElement) {
        engine = new Renderer(canvas);
    }

    export enum RenderMode {
        Dynamic,
        Static,
    }

    export class Renderer {

        public canvas: HTMLCanvasElement = null;

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
            gl = initWebwebglContext(canvas);
            this.initMatrix();
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            setTimeout(this.main, this.frameRate);
        }

        public createFrameBuffer(): FrameBuffer {
            const fbo = new FrameBuffer();
            this.fbos.push(fbo);
            return fbo;
        }

        public renderFBO(
            scene: Scene, camera: Camera) {
            this.buildSingleRender(scene, camera);
            for (let frameBuffer of this.fbos) {
                frameBuffer = frameBuffer as FrameBuffer;
                gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer.glFramebuffer);
                for (const rboi in frameBuffer.rbos) {
                    const renderBuffer: RenderBuffer = frameBuffer.rbos[rboi];
                    const rttTexture = renderBuffer.targetTexture;
                    if (rttTexture != null) {
                        gl.bindTexture(gl.TEXTURE_2D, rttTexture.glTexture);
                        gl.texImage2D(gl.TEXTURE_2D,
                            0, rttTexture.format,
                            this.canvas.width,
                            this.canvas.height,
                            0,
                            rttTexture.format,
                            gl.UNSIGNED_BYTE,
                            null,
                        );
                        gl.framebufferTexture2D(
                            gl.FRAMEBUFFER,
                            renderBuffer.attachment,
                            gl.TEXTURE_2D,
                            rttTexture.glTexture,
                            0);
                        gl.bindTexture(gl.TEXTURE_2D, null);
                        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
                    }
                }
                this.renderQueue.push(() => {
                    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer.glFramebuffer);
                    for (const rboi in frameBuffer.rbos) {
                        const renderBuffer: RenderBuffer = frameBuffer.rbos[rboi];
                        gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer.glRenderBuffer);
                        gl.clearColor(
                            scene.clearColor[0],
                            scene.clearColor[1],
                            scene.clearColor[2],
                            scene.clearColor[3],
                        );
                        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
                        for (const object of scene.objects) {
                            this.renderObject(camera, object);
                        }
                        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
                    }
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                });
                if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
                    console.log("frame buffer not completed"); // TODO: replace console.log with productive code
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
        }

        public render(scene: Scene, camera: Camera) {
            this.buildSingleRender(scene, camera);
            switch (this.renderMode) {
                case RenderMode.Static:
                    this.renderQueue = [];
                    gl.clearColor(
                        scene.clearColor[0],
                        scene.clearColor[1],
                        scene.clearColor[2],
                        scene.clearColor[3],
                    );
                    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
                    for (const object of scene.objects) {
                        this.renderObject(camera, object);
                    }
                    break;
                case RenderMode.Dynamic:
                    this.renderQueue.push(() => {
                        gl.clearColor(
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
            if (this.scenes.indexOf(scene) !== -1 || this.preloadRes.length > 0) {
                return;
            }
            this.cameras.push(camera);
            this.scenes.push(scene);
            camera.adaptTargetRadio(this.canvas);
            for (const object of scene.objects) {
                if (object instanceof Mesh) {
                    const mesh = object as Mesh;
                    this.makeMeshPrograms(scene, mesh, camera);
                }
            }
            scene.programSetUp = true;
        }

        public makeMeshPrograms(scene: Scene, mesh: Mesh, camera: Camera) {

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(mesh.geometry.faces.data), gl.STATIC_DRAW);

            this.copyDataToVertexBuffer(mesh.geometry);

            if (mesh.materials.length > 1) {
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_COLOR, gl.ONE_MINUS_SRC_COLOR);
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

                material.program.make(material, mesh, scene, camera);

                gl.useProgram(material.program.webGlProgram);

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
            //     gl.useProgram(program.webGlProgram);
            //     gl.activeTexture(gl.TEXTURE0 + texture.unit);
            //     gl.bindTexture(texture.type, texture.glTexture);
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
            gl.useProgram(program.webGlProgram);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.activeTexture(gl.TEXTURE0 + texture.unit);
            gl.bindTexture(texture.type, texture.glTexture);
            gl.texParameteri(texture.type, gl.TEXTURE_WRAP_S, texture.wrapS);
            gl.texParameteri(texture.type, gl.TEXTURE_WRAP_T, texture.wrapT);
            gl.texParameteri(texture.type, gl.TEXTURE_MAG_FILTER, texture.magFilter);
            gl.texParameteri(texture.type, gl.TEXTURE_MIN_FILTER, texture.minFilter);
            texture.setUpTextureData();
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
                light.shadowRtt = new Texture();
            }
        }

        private copyDataToVertexBuffer(geometry: Geometry) {
            for (const name in geometry.attributes) {
                const attribute: Attribute = geometry.attributes[name];
                if (attribute !== undefined) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attribute.data), gl.STATIC_DRAW);
                    console.log(name + "buffer size:" + gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));

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
                        gl.enable(gl.DEPTH_TEST);
                    } else {
                        gl.disable(gl.DEPTH_TEST);
                    }
                    /*if (program.enableStencilTest) {
                        gl.enable(gl.STENCIL_TEST);
                    } else {
                        gl.disable(gl.STENCIL_TEST);
                    }*/
                    gl.useProgram(program.webGlProgram);
                    for (const uniformName in program.uniforms) {
                        if (program.uniforms[uniformName] !== undefined) {
                            program.uniforms[uniformName](object, camera);
                        }
                    }
                    for (const attributeName in program.attributes) {
                        gl.bindBuffer(gl.ARRAY_BUFFER, program.attributes[attributeName].buffer);
                        gl.vertexAttribPointer(
                            program.attributeLocations[attributeName],
                            program.attributes[attributeName].size,
                            program.attributes[attributeName].type,
                            false,
                            0,
                            0);
                    }
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
                    gl.drawElements(gl.TRIANGLES, mesh.geometry.faces.data.length, gl.UNSIGNED_SHORT, 0);
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
            // glMatrix.setMatrixArrayType(Float32Array);
        }
    }
}
