module CanvasToy {

    export function setCanvas(canvas: HTMLCanvasElement) {
        engine = new Renderer(canvas);
    }

    export class Renderer {

        public canvasDom: HTMLCanvasElement;

        public gl: WebGLRenderingContext;

        public preloadRes: any[] = [];

        vertPrecision:string = "highp";

        fragPrecision:string = "mediump";

        constructor(canvas: HTMLCanvasElement) {
            this.canvasDom = canvas || document.createElement('canvas');
            this.gl = initWebwebglContext(canvas);
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }

        public makeProgram(scene:Scene, mesh:Mesh) {
            var prefixVertex = [
                'precision ' + this.vertPrecision + ' float;',
                mesh.material.map ? '#define USE_TEXTURE' : '',
                mesh.material.color ? '#define USE_COLOR' : '',
                scene.openLight ? '#define OPEN_LIGHT' : ''
            ].join("\n");

            var prefixFragment = [
                'precision ' + this.fragPrecision + ' float;',
                mesh.material.map ? '#define USE_TEXTURE' : '',
                mesh.material.color ? '#define USE_COLOR' : '',
                scene.openLight ? '#define OPEN_LIGHT' : ''
            ].join("\n");

            mesh.program = new Program();

            mesh.program.webGlProgram = createEntileShader(this.gl, prefixVertex + mesh.material.vertexShaderSource,
                prefixFragment + mesh.material.fragShaderSource);

            mesh.program.addUniform("modelViewMatrix");
            mesh.program.addUniform("projectionMatrix");

            mesh.program.addAttribute(new VertexBuffer("position", 3,
            this.gl.FLOAT)).data = mesh.geometry.positions;;

            if (mesh.material.map != undefined) {
                mesh.program.addAttribute(
                    new VertexBuffer("aTextureCoord", 2, this.gl.FLOAT))
                    .data = mesh.geometry.uvs;
            }

            if (scene.openLight) {
                mesh.program.addUniform("ambient");
                mesh.program.addUniform("eyePosition");
                mesh.program.addAttribute(
                    new VertexBuffer("aNormal", 3, this.gl.FLOAT))
                    .data = mesh.geometry.normals;
            }

            mesh.program.indexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.program.indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(mesh.geometry.indices), mesh.program.drawMode);
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
                    this.makeProgram(scene, mesh);
                }
            }
            setInterval(() => this.renderImmediately(scene, camera), duration);
        }

        public getUniformLocation(program:Program, name: string): WebGLUniformLocation {
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

        public getAttribLocation(program:Program, name: string): number {
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

        updateVerticesData(program:Program) {
            let gl = engine.gl;
            for (let name in program.vertexBuffers) {
                console.log(name);
                gl.enableVertexAttribArray(program.vertexBuffers[name].index);
                gl.bindBuffer(gl.ARRAY_BUFFER, program.vertexBuffers[name].buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(program.vertexBuffers[name].data), engine.gl.STATIC_DRAW);
            }
        };

        private renderObject(camera:Camera, object:Object) {
            let gl = engine.gl;
            if (object instanceof Mesh) {
                let mesh = <Mesh>object;
                for (let name in mesh.program) {
                    gl.bindBuffer(engine.gl.ARRAY_BUFFER, mesh.program.vertexBuffers[name].buffer);
                    engine.gl.vertexAttribPointer(
                        mesh.program.vertexBuffers[name].index,
                        mesh.program.vertexBuffers[name].size,
                        mesh.program.vertexBuffers[name].type ,
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
            glMatrix.setMatrixArrayType(Float32Array);
        }
    }
}
