/// <reference path="../textures/Texture.ts"/>

module CanvasToy {

    export function setCanvas(canvas: HTMLCanvasElement) {
        engine = new Renderer(canvas);
    }


    export class Renderer {

        gl: WebGLRenderingContext;

        preloadRes: any[] = [];

        usedTextureNum: number = 0;

        renderTargets: Array<RenderTargetTexture> = [];

        vertPrecision: string = "highp";

        fragPrecision: string = "mediump";

        isAnimating: boolean = false;

        renderQueue: Array<Function> = [];

        constructor(public canvas: HTMLCanvasElement) {
            this.gl = initWebwebglContext(canvas);
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            this.renderQueue.push(() => {
                this.gl.viewport(0, 0, canvas.width, canvas.height);
                this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            })
            setInterval(() => {
                for (let renderCommand of this.renderQueue) {
                    renderCommand();
                }
            }, 1000 / 60);
        }

        public renderToTexture(scene: Scene, camera: Camera): RenderTargetTexture {
            let gl = this.gl;
            let rttTexture = new RenderTargetTexture(scene, camera);
            // bind texture
            gl.bindTexture(gl.TEXTURE_2D, rttTexture.glTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, rttTexture.format, this.canvas.width, this.canvas.height, 0, rttTexture.format, gl.UNSIGNED_BYTE, null);
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

            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
                console.log('frame buffer not completed');
            }

            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            this.buildScene(scene, camera);

            this.renderQueue.push(() => {
                gl.bindFramebuffer(gl.FRAMEBUFFER, rttTexture.frameBuffer);
                gl.bindRenderbuffer(gl.RENDERBUFFER, rttTexture.depthBuffer);
                this.gl.clearColor(
                    scene.clearColor[0],
                    scene.clearColor[1],
                    scene.clearColor[2],
                    scene.clearColor[3]
                );
                this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
                for (let object of scene.objects) {
                    this.renderObject(camera, object);
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            })
            return rttTexture;
        }

        public render(scene: Scene, camera: Camera) {
            this.buildScene(scene, camera);
            this.renderQueue.push(() => {
                this.gl.clearColor(
                    scene.clearColor[0],
                    scene.clearColor[1],
                    scene.clearColor[2],
                    scene.clearColor[3]
                );
                for (let object of scene.objects) {
                    this.renderObject(camera, object);
                }
            })
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
            camera.adaptTargetRadio(this.canvas);
            scene.programSetUp = true;
            console.log('make shaders');
        }

        public makeMeshPrograms(scene: Scene, mesh: Mesh, camera: Camera) {

            if (mesh.materials.length > 1) {
                engine.gl.enable(engine.gl.BLEND);
                engine.gl.blendFunc(engine.gl.ONE, engine.gl.DST_COLOR);
            }

            for (let material of mesh.materials) {

                let cameraInScene = false;
                for (let object of scene.objects) {
                    if (object == camera) {
                        cameraInScene = true;
                        break;
                    }
                };

                if (!cameraInScene) {
                    console.error("Camera has not been added in Scene!");
                }

                var prefixVertex = [
                    'precision ' + this.vertPrecision + ' float;',
                    material.map ? '#define USE_TEXTURE ' : '',
                    material.color ? '#define USE_COLOR ' : '',
                    scene.openLight ? '#define OPEN_LIGHT\n#define LIGHT_NUM '
                        + scene.lights.length : ''
                ].join("\n") + '\n';

                var prefixFragment = [
                    'precision ' + this.fragPrecision + ' float;',
                    material.map ? '#define USE_TEXTURE ' : '',
                    material.color ? '#define USE_COLOR ' : '',
                    scene.openLight ? '#define OPEN_LIGHT \n#define LIGHT_NUM '
                        + scene.lights.length : ''
                ].join("\n") + '\n';

                if (debug) {
                    // console.log(prefixVertex + mesh.material.vertexShaderSource);
                    // console.log(prefixFragment + mesh.material.fragShaderSource)
                }

                let program = new Program();
                mesh.programs.push(program);
                program.material = material;
                program.webGlProgram = createEntileShader(this.gl, prefixVertex + material.vertexShaderSource,
                    prefixFragment + material.fragShaderSource);

                this.gl.useProgram(program.webGlProgram);
                program.addUniform("modelViewProjectionMatrix", (mesh, camera) => {
                    let mvpMatrix = mat4.multiply(
                        mat4.create(),
                        camera.projectionMatrix,
                        mat4.multiply(mat4.create(),
                            mat4.invert(mat4.create(), camera.matrix),
                            mesh.matrix)
                    );
                    engine.gl.uniformMatrix4fv(
                        program.uniforms["modelViewProjectionMatrix"],
                        false, new Float32Array(mvpMatrix));
                });
                this.gl.useProgram(program.webGlProgram);
                program.indexBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, program.indexBuffer);
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
                    new Uint16Array(mesh.geometry.faces), program.drawMode);
                program.setAttribute0(new VertexBuffer("position", 3,
                    this.gl.FLOAT)).data = mesh.geometry.positions;

                if (material.color != undefined) {
                    program.addUniform("color", () => {
                        engine.gl.uniform4f(
                            program.uniforms["color"],
                            material.color[0],
                            material.color[1],
                            material.color[2],
                            material.color[3]);
                    })
                }

                if (material.map != undefined) {
                    this.loadTexture(program, 'uTextureSampler', material.map);
                    program.addAttribute(
                        new VertexBuffer("aTextureCoord", 2, this.gl.FLOAT))
                        .data = mesh.geometry.uvs;
                    console.log(mesh.geometry.uvs);
                }

                if (scene.openLight) {
                    this.setUplights(scene, program, mesh, camera);
                }
                this.copyToVertexBuffer(program);
            }
        }

        loadTexture(program: Program, sampler: string, texture: Texture) {
            if (texture instanceof RenderTargetTexture) {
                let gl = engine.gl;
                texture.unit = this.usedTextureNum;
                this.usedTextureNum++;
                program.textures.push(texture);
                gl.useProgram(program.webGlProgram);
                gl.activeTexture(gl.TEXTURE0 + texture.unit);
                gl.bindTexture(texture.type, texture.glTexture);
                program.addUniform(sampler, (mesh, camera) => {
                    engine.gl.uniform1i(
                        program.uniforms[sampler],
                        texture.unit);
                });
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
            }

        }

        addTexture(program: Program, sampler: string, texture: Texture) {
            texture.unit = this.usedTextureNum;
            this.usedTextureNum++;
            program.textures.push(texture);

            let gl = engine.gl;
            gl.useProgram(program.webGlProgram);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.activeTexture(gl.TEXTURE0 + texture.unit);
            gl.bindTexture(texture.type, texture.glTexture);
            gl.texParameteri(texture.type, gl.TEXTURE_WRAP_S, texture.wrapS);
            gl.texParameteri(texture.type, gl.TEXTURE_WRAP_T, texture.wrapT);
            gl.texParameteri(texture.type, gl.TEXTURE_MAG_FILTER, texture.magFilter);
            gl.texParameteri(texture.type, gl.TEXTURE_MIN_FILTER, texture.minFilter);

            texture.setUpTextureData();

            // the sampler
            program.addUniform(sampler, (mesh, camera) => {
                engine.gl.uniform1i(
                    program.uniforms[sampler],
                    texture.unit);
            })
        }

        public setUplights(scene: Scene, program: Program, mesh: Mesh, camera: Camera) {
            program.addUniform("normalMatrix", (mesh, camera) => {
                engine.gl.uniformMatrix4fv(
                    program.uniforms["normalMatrix"],
                    false, new Float32Array(mesh.normalMatrix));
            });
            program.addUniform("ambient", (mesh, camera) => {
                // alert(scene.ambientLight);
                engine.gl.uniform3f(program.uniforms["ambient"],
                    scene.ambientLight[0],
                    scene.ambientLight[1],
                    scene.ambientLight[2]
                )
            });
            program.addUniform("eyePosition", (mesh, camera) => {
                engine.gl.uniform3f(program.uniforms["eyePosition"],
                    camera.position[0],
                    camera.position[1],
                    camera.position[2]
                )
            });
            switch (program.material.shadingMode) {
                case ShadingMode.flatShading:
                    mesh.geometry.generateFlatNormal();
                    program.addAttribute(
                        new VertexBuffer("aNormal", 3, this.gl.FLOAT))
                        .data = mesh.geometry.flatNormals;
                    break;
                case ShadingMode.smoothShading:
                    program.addAttribute(
                        new VertexBuffer("aNormal", 3, this.gl.FLOAT))
                        .data = mesh.geometry.normals;
                    console.log('addAttribute');
                    break;

            }
            var index: number = 0;
            for (let light of scene.lights) {
                var diffuse = "lights[" + index + "].diffuse";
                var specular = "lights[" + index + "].specular";
                var idensity = "lights[" + index + "].idensity";
                var position = "lights[" + index + "].position";
                program.addUniform(diffuse, (mesh, camera) => {
                    this.gl.uniform3f(program.uniforms[diffuse],
                        light.diffuse[0],
                        light.diffuse[1],
                        light.diffuse[2]
                    );
                });
                program.addUniform(specular, (mesh, camera) => {
                    this.gl.uniform3f(program.uniforms[specular],
                        light.specular[0],
                        light.specular[1],
                        light.specular[2]
                    );
                });
                program.addUniform(position, (mesh, camera) => {
                    this.gl.uniform3f(program.uniforms[position],
                        light.position[0],
                        light.position[1],
                        light.position[2]
                    );
                });
                program.addUniform(idensity, (mesh, camera) => {
                    this.gl.uniform1f(program.uniforms[idensity],
                        light.idensity
                    );
                });
            }
        }

        private copyToVertexBuffer(program: Program) {
            let gl = engine.gl;
            gl.useProgram(program.webGlProgram);
            for (let name in program.vertexBuffers) {
                let vertexBuffer: VertexBuffer = program.vertexBuffers[name];
                gl.enableVertexAttribArray(vertexBuffer.index);
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexBuffer.data), engine.gl.STATIC_DRAW);
            }
        };

        private renderObject(camera: Camera, object: Object) {
            let gl = this.gl;
            if (object instanceof Mesh) {
                let mesh = <Mesh>object;
                for (let program of mesh.programs) {
                    this.gl.useProgram(program.webGlProgram);
                    for (let updaters in program.uniformUpdaters) {
                        program.uniformUpdaters[updaters](object, camera);
                    }
                    for (let bufferName in program.vertexBuffers) {
                        gl.bindBuffer(engine.gl.ARRAY_BUFFER, program.vertexBuffers[bufferName].buffer);
                        engine.gl.vertexAttribPointer(
                            program.vertexBuffers[bufferName].index,
                            program.vertexBuffers[bufferName].size,
                            program.vertexBuffers[bufferName].type,
                            false,
                            0,
                            0);
                    }
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program.indexBuffer);
                    gl.drawElements(gl.TRIANGLES, mesh.geometry.faces.length, gl.UNSIGNED_SHORT, 0);
                }
            }
        }

        private initMatrix() {
            // glMatrix.setMatrixArrayType(Float32Array);
        }
    }
}
