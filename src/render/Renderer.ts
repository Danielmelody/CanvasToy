/// <reference path="../textures/Texture.ts"/>
/// <reference path="../materials/Material.ts"/>

namespace CanvasToy {

    export function setCanvas(canvas: HTMLCanvasElement) {
        engine = new Renderer(canvas);
    }

    export enum RenderMode {
        Dynamic,
        Static
    }

    export class Renderer {

        public canvas: HTMLCanvasElement = null;

        public renderMode: RenderMode = RenderMode.Dynamic;

        public preloadRes: any[] = [];

        public usedTextureNum: number = 0;

        public renderTargets: Array<RenderTargetTexture> = [];

        public vertPrecision: string = "highp";

        public fragPrecision: string = "mediump";

        public isAnimating: boolean = false;

        public renderQueue: Array<Function> = [];

        public scenes: Array<Scene> = [];

        public cameras: Array<Camera> = [];

        public frameRate: number = 1000 / 60;

        private stopped: boolean = false;

        constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;
            gl = initWebwebglContext(canvas);
            this.initMatrix();
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            this.renderQueue.push(() => {
                // gl.viewport(0, 0, canvas.width, canvas.height);
                // gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            });
            setTimeout(this.main, this.frameRate);
        }

        public renderToTexture(scene: Scene, camera: Camera): RenderTargetTexture {
            let rttTexture = new RenderTargetTexture(scene, camera);
            // bind texture
            gl.bindTexture(gl.TEXTURE_2D, rttTexture.glTexture);
            gl.texImage2D(gl.TEXTURE_2D,
                0, rttTexture.format,
                this.canvas.width,
                this.canvas.height,
                0,
                rttTexture.format,
                gl.UNSIGNED_BYTE,
                null
            );
            gl.texParameteri(rttTexture.type, gl.TEXTURE_WRAP_S, rttTexture.wrapS);
            gl.texParameteri(rttTexture.type, gl.TEXTURE_WRAP_T, rttTexture.wrapT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, rttTexture.magFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, rttTexture.minFilter);

            // create frame buffer, as rendering target
            rttTexture.frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, rttTexture.frameBuffer);

            // create render buffer for depth test
            rttTexture.depthBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, rttTexture.depthBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.canvas.width, this.canvas.height);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture.glTexture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rttTexture.depthBuffer);

            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
                console.log("frame buffer not completed"); // TODO: replace console.log with productive code
            }

            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            this.buildScene(scene, camera);

            this.renderQueue.push(() => {
                gl.bindFramebuffer(gl.FRAMEBUFFER, rttTexture.frameBuffer);
                gl.bindRenderbuffer(gl.RENDERBUFFER, rttTexture.depthBuffer);
                gl.clearColor(
                    scene.clearColor[0],
                    scene.clearColor[1],
                    scene.clearColor[2],
                    scene.clearColor[3]
                );
                gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
                for (let object of scene.objects) {
                    this.renderObject(camera, object);
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            });
            return rttTexture;
        }

        public render(scene: Scene, camera: Camera) {
            if (this.scenes.indexOf(scene) === -1) {
                this.scenes.push(scene);
                this.buildScene(scene, camera);
            }
            if (this.cameras.indexOf(camera) === -1) {
                this.cameras.push(camera);
                camera.adaptTargetRadio(this.canvas);
            }
            switch (this.renderMode) {
                case RenderMode.Static:
                    this.renderQueue = [];
                    gl.clearColor(
                        scene.clearColor[0],
                        scene.clearColor[1],
                        scene.clearColor[2],
                        scene.clearColor[3]
                    );
                    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
                    for (let object of scene.objects) {
                        this.renderObject(camera, object);
                    }
                    break;
                case RenderMode.Dynamic:
                    this.renderQueue.push(() => {
                        gl.clearColor(
                            scene.clearColor[0],
                            scene.clearColor[1],
                            scene.clearColor[2],
                            scene.clearColor[3]
                        );
                        for (let object of scene.objects) {
                            this.renderObject(camera, object);
                        }
                    });
                    break;
                default:
                    break;
            }
        }

        public buildScene(scene: Scene, camera: Camera) {
            if (this.preloadRes.length > 0) {
                return;
            }
            for (let object of scene.objects) {
                if (object instanceof Mesh) {
                    let mesh = <Mesh>object;
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

            for (let material of mesh.materials) {

                let cameraInScene = false;
                for (let object of scene.objects) {
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

                for (let textureName in material.program.textures) {
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
            if (texture instanceof RenderTargetTexture) {
                texture.unit = this.usedTextureNum;
                this.usedTextureNum++;
                program.textures.push(texture);
                gl.useProgram(program.webGlProgram);
                gl.activeTexture(gl.TEXTURE0 + texture.unit);
                gl.bindTexture(texture.type, texture.glTexture);
                return;
            }
            let lastOnload = texture.image.onload;
            if (texture.image.complete) {
                this.addTexture(program, sampler, texture);
                return;
            }
            texture.image.onload = (et: Event) => {
                if (lastOnload) {
                    lastOnload.apply(texture.image, et);
                }
                this.addTexture(program, sampler, texture);
            };

        }

        public addTexture(program: Program, sampler: string, texture: Texture) {
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
            for (let index in scene.lights) {
                if (scene.lights.hasOwnProperty(index)) {
                    let light = scene.lights[index];
                    let diffuse = "lights[" + index + "].diffuse";
                    let specular = "lights[" + index + "].specular";
                    let idensity = "lights[" + index + "].idensity";
                    let position = "lights[" + index + "].position";
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
                }
            }
        }

        private copyDataToVertexBuffer(geometry: Geometry) {
            for (let name in geometry.attributes) {
                if (geometry.attributes.hasOwnProperty(name)) {
                    let attribute: Attribute = geometry.attributes[name];
                    if (attribute !== undefined) {
                        gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attribute.data), gl.STATIC_DRAW);
                        console.log(name + "buffer size:" + gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));
                    }
                }
            }
        };

        private renderObject(camera: Camera, object: Object) {
            if (object instanceof Mesh) {
                let mesh = <Mesh>object;
                for (let material of mesh.materials) {
                    let program = material.program;
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
                    for (let uniformName in program.uniforms) {
                        if (program.uniforms[uniformName] !== undefined) {
                            program.uniforms[uniformName](object, camera);
                        }
                    }
                    for (let attributeName in program.attributes) {
                        if (program.attributes.hasOwnProperty(attributeName)) {
                            gl.bindBuffer(gl.ARRAY_BUFFER, program.attributes[attributeName].buffer);
                            gl.vertexAttribPointer(
                                program.attributeLocations[attributeName],
                                program.attributes[attributeName].size,
                                program.attributes[attributeName].type,
                                false,
                                0,
                                0);
                        }
                    }
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
                    gl.drawElements(gl.TRIANGLES, mesh.geometry.faces.data.length, gl.UNSIGNED_SHORT, 0);
                }
            }
        }

        private main = () => {
            for (let renderCommand of this.renderQueue) {
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
