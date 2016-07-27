/// <reference path="../textures/Texture.ts"/>

module CanvasToy {

    export function setCanvas(canvas: HTMLCanvasElement) {
        engine = new Renderer(canvas);
    }

    export class Renderer {

        public canvasDom: HTMLCanvasElement;

        public gl: WebGLRenderingContext;

        public preloadRes: any[] = [];

        textureIndices: {} = {};

        usedTextureNum: number = 0;

        vertPrecision: string = "highp";

        fragPrecision: string = "mediump";

        constructor(canvas: HTMLCanvasElement) {
            this.canvasDom = canvas || document.createElement('canvas');
            this.gl = initWebwebglContext(canvas);
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }

        public makeProgram(scene: Scene, mesh: Mesh, camera: Camera) {
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
                mesh.material.map ? '#define USE_TEXTURE ' : '',
                mesh.material.color ? '#define USE_COLOR ' : '',
                scene.openLight ? '#define OPEN_LIGHT\n#define LIGHT_NUM '
                    + scene.lights.length : ''
            ].join("\n") + '\n';

            var prefixFragment = [
                'precision ' + this.fragPrecision + ' float;',
                mesh.material.map ? '#define USE_TEXTURE ' : '',
                mesh.material.color ? '#define USE_COLOR ' : '',
                scene.openLight ? '#define OPEN_LIGHT \n#define LIGHT_NUM '
                    + scene.lights.length : ''
            ].join("\n") + '\n';

            if (debug) {
                // console.log(prefixVertex + mesh.material.vertexShaderSource);
                // console.log(prefixFragment + mesh.material.fragShaderSource)
            }

            mesh.program = new Program();

            mesh.program.webGlProgram = createEntileShader(this.gl, prefixVertex + mesh.material.vertexShaderSource,
                prefixFragment + mesh.material.fragShaderSource);

            this.gl.useProgram(mesh.program.webGlProgram);

            mesh.program.addUniform("modelViewProjectionMatrix", () => {
                let mvpMatrix = mat4.multiply(
                    mat4.create(),
                    camera.projectionMatrix,
                    mat4.multiply(mat4.create(),
                        mat4.invert(mat4.create(), camera.matrix),
                        mesh.matrix)
                );
                engine.gl.uniformMatrix4fv(
                    mesh.program.uniforms["modelViewProjectionMatrix"],
                    false, new Float32Array(mvpMatrix));
            });

            mesh.program.indexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.program.indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(mesh.geometry.indices), mesh.program.drawMode);

            mesh.program.setAttribute0(new VertexBuffer("position", 3,
                this.gl.FLOAT)).data = mesh.geometry.positions;

            if (mesh.material.color != undefined) {
                mesh.program.addUniform("color", () => {
                    engine.gl.uniform4f(
                        mesh.program.uniforms["color"],
                        mesh.material.color[0],
                        mesh.material.color[1],
                        mesh.material.color[2],
                        mesh.material.color[3]);
                })
            }

            if (mesh.material.map != undefined) {
                mesh.maps.push(mesh.material.map);
                mesh.program.addAttribute(
                    new VertexBuffer("aTextureCoord", 2, this.gl.FLOAT))
                    .data = mesh.geometry.uvs;
            }

            if (scene.openLight) {
                this.setUplights(scene, mesh, camera);
            }
            this.copyToVertexBuffer(mesh.program);
        }

        public setUplights(scene: Scene, mesh: Mesh, camera: Camera) {
            mesh.program.addUniform("normalMatrix", () => {
                engine.gl.uniformMatrix4fv(
                    mesh.program.uniforms["normalMatrix"],
                    false, new Float32Array(mesh.normalMatrix));
            });
            mesh.program.addUniform("ambient", () => {
                // alert(scene.ambientLight);
                engine.gl.uniform3f(mesh.program.uniforms["ambient"],
                    scene.ambientLight[0],
                    scene.ambientLight[1],
                    scene.ambientLight[2]
                )
            });
            mesh.program.addUniform("eyePosition", () => {
                engine.gl.uniform3f(mesh.program.uniforms["eyePosition"],
                    camera.position[0],
                    camera.position[1],
                    camera.position[2]
                )
            });
            mesh.program.addAttribute(
                new VertexBuffer("aNormal", 3, this.gl.FLOAT))
                .data = mesh.geometry.normals;
            var index: number = 0;
            for (let light of scene.lights) {
                var diffuse = "lights[" + index + "].diffuse";
                var specular = "lights[" + index + "].specular";
                var idensity = "lights[" + index + "].idensity";
                var position = "lights[" + index + "].position";
                mesh.program.addUniform(diffuse, () => {
                    this.gl.uniform3f(mesh.program.uniforms[diffuse],
                        light.diffuse[0],
                        light.diffuse[1],
                        light.diffuse[2]
                    );
                });
                mesh.program.addUniform(specular, () => {
                    this.gl.uniform3f(mesh.program.uniforms[specular],
                        light.specular[0],
                        light.specular[1],
                        light.specular[2]
                    );
                });
                mesh.program.addUniform(position, () => {
                    this.gl.uniform3f(mesh.program.uniforms[position],
                        light.position[0],
                        light.position[1],
                        light.position[2]
                    );
                });
                mesh.program.addUniform(idensity, () => {
                    this.gl.uniform1f(mesh.program.uniforms[idensity],
                        light.idensity
                    );
                });
            }
        }

        addTexture(texture: Texture) {
            this.textureIndices[texture.image.src] = this.usedTextureNum;
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
                    this.makeProgram(scene, mesh, camera);
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

        private enableTexture(mesh, texture: Texture) {
            let gl = engine.gl;
            gl.useProgram(mesh.program.webGlProgram);

            // add texture to texture-unit
            this.addTexture(texture);
            let textureIndex: number = this.textureIndices[texture.image.src];

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.activeTexture(gl.TEXTURE0 + textureIndex);
            gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);


            // TODO: config texture paramters
            gl.texImage2D(gl.TEXTURE_2D, 0,
                gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            // the sampler
            mesh.program.addUniform("uTextureSampler", () => {
                engine.gl.uniform1i(
                    mesh.program.uniforms["uTextureSampler"],
                    textureIndex);
            })
        }

        private copyToVertexBuffer(program: Program) {
            let gl = engine.gl;
            for (let name in program.vertexBuffers) {
                gl.enableVertexAttribArray(program.vertexBuffers[name].index);
                gl.bindBuffer(gl.ARRAY_BUFFER, program.vertexBuffers[name].buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(program.vertexBuffers[name].data), engine.gl.STATIC_DRAW);
            }
        };

        private renderObject(camera: Camera, object: Object) {
            let gl = this.gl;
            if (object instanceof Mesh) {
                let mesh = <Mesh>object;
                this.gl.useProgram(mesh.program.webGlProgram);
                for (let updaters in mesh.program.uniformUpdaters) {
                    mesh.program.uniformUpdaters[updaters]();
                }

                // maping texture
                for (let texture of mesh.maps) {
                    if (texture.isReadyToUpdate) {
                        this.enableTexture(mesh, texture);
                        texture.isReadyToUpdate = false;
                    }
                }

                for (let name in mesh.program.vertexBuffers) {
                    gl.bindBuffer(engine.gl.ARRAY_BUFFER, mesh.program.vertexBuffers[name].buffer);
                    engine.gl.vertexAttribPointer(
                        mesh.program.vertexBuffers[name].index,
                        mesh.program.vertexBuffers[name].size,
                        mesh.program.vertexBuffers[name].type,
                        false,
                        0,
                        0);
                }
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.program.indexBuffer);
                gl.drawElements(gl.TRIANGLES, mesh.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
            }
        }

        private renderImmediately(scene: Scene, camera: Camera) {
            if (this.preloadRes.length > 0) {
                return;
            }
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            for (let renderObject of scene.objects) {
                if (scene.openLight) {
                    for (let light of scene.objects) {
                        renderObject
                    }
                }
                this.renderObject(camera, renderObject);
            }
        }

        private initMatrix() {
            // glMatrix.setMatrixArrayType(Float32Array);
        }
    }
}
