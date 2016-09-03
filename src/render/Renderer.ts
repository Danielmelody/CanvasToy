/// <reference path="../textures/Texture.ts"/>

module CanvasToy {

    export function setCanvas(canvas: HTMLCanvasElement) {
        engine = new Renderer(canvas);
    }

    export class Renderer {

        public gl: WebGLRenderingContext;

        public preloadRes: any[] = [];

        textureIndices: {} = {};

        usedTextureNum: number = 0;

        vertPrecision: string = "highp";

        fragPrecision: string = "mediump";

        constructor(public canvas: HTMLCanvasElement) {
            this.gl = initWebwebglContext(canvas);
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }

        public makePrograms(scene: Scene, mesh: Mesh, camera: Camera) {

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
                program.addUniform("modelViewProjectionMatrix", () => {
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
                console.log(mesh.geometry.faces.length);
                console.log('index: ' + this.gl.getBufferParameter(this.gl.ARRAY_BUFFER, this.gl.BUFFER_SIZE));
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
                    program.addTexture('uTextureSampler', material.map);
                    program.addAttribute(
                        new VertexBuffer("aTextureCoord", 2, this.gl.FLOAT))
                        .data = mesh.geometry.uvs;
                }

                if (scene.openLight) {
                    this.setUplights(scene, program, mesh, camera);
                }
                this.copyToVertexBuffer(program);
            }
        }

        public setUplights(scene: Scene, program: Program, mesh: Mesh, camera: Camera) {
            program.addUniform("normalMatrix", () => {
                engine.gl.uniformMatrix4fv(
                    program.uniforms["normalMatrix"],
                    false, new Float32Array(mesh.normalMatrix));
            });
            program.addUniform("ambient", () => {
                // alert(scene.ambientLight);
                engine.gl.uniform3f(program.uniforms["ambient"],
                    scene.ambientLight[0],
                    scene.ambientLight[1],
                    scene.ambientLight[2]
                )
            });
            program.addUniform("eyePosition", () => {
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
                program.addUniform(diffuse, () => {
                    this.gl.uniform3f(program.uniforms[diffuse],
                        light.diffuse[0],
                        light.diffuse[1],
                        light.diffuse[2]
                    );
                });
                program.addUniform(specular, () => {
                    this.gl.uniform3f(program.uniforms[specular],
                        light.specular[0],
                        light.specular[1],
                        light.specular[2]
                    );
                });
                program.addUniform(position, () => {
                    this.gl.uniform3f(program.uniforms[position],
                        light.position[0],
                        light.position[1],
                        light.position[2]
                    );
                });
                program.addUniform(idensity, () => {
                    this.gl.uniform1f(program.uniforms[idensity],
                        light.idensity
                    );
                });
            }
        }

        addTexture(texture: Texture) {
            this.textureIndices[texture.image.src] = this.usedTextureNum;
            texture.unit = this.usedTextureNum;
            this.usedTextureNum++;
        }

        public startRender(scene: Scene, camera: Camera, duration: number) {
            this.gl.clearColor(
                scene.clearColor[0],
                scene.clearColor[1],
                scene.clearColor[2],
                scene.clearColor[3]
            );
            for (let object of scene.objects) {
                if (object instanceof Mesh) {
                    let mesh = <Mesh>object;
                    this.makePrograms(scene, mesh, camera);
                }
            }
            setInterval(() => this.renderImmediately(scene, camera), duration);
        }

        public getUniformLocation(program: Program, name: string): WebGLUniformLocation {
            if (this.gl == undefined || this.gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = this.gl.getUniformLocation(program.webGlProgram, name);
            if (result == null) {
                console.error("uniform " + name + " not found!");
                return null;
            }
            return result;
        }

        public getAttribLocation(program: Program, name: string): number {
            if (this.gl == undefined || this.gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = this.gl.getAttribLocation(program.webGlProgram, name);
            if (result == null) {
                console.error("attribute " + name + " not found!");
                return null;
            }
            return result;
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
                        program.uniformUpdaters[updaters]();
                    }
                    for (let bufferName in program.vertexBuffers) {
                        gl.bindBuffer(engine.gl.ARRAY_BUFFER, program.vertexBuffers[bufferName].buffer);
                        // console.log(program.vertexBuffers[bufferName].buffer);
                        // console.log('buffer size:' + gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));
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

        private renderImmediately(scene: Scene, camera: Camera) {
            if (this.preloadRes.length > 0) {
                return;
            }
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            for (let renderObject of scene.objects) {
                this.renderObject(camera, renderObject);
            }
        }

        private initMatrix() {
            // glMatrix.setMatrixArrayType(Float32Array);
        }
    }
}
