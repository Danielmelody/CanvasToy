/// <reference path="../CanvasToy.ts"/>

module CanvasToy {


    export interface ProgramPass {
        faces?: Faces;
        uniforms?: any;
        attributes?: any;
        textures?: any;
        vertexShader?: string;
        fragmentShader?: string;
        prefix?: string[]
    }

    export class Faces {
        public buffer: WebGLBuffer = gl.createBuffer();
        constructor(public data: number[]) { }
    }

    export class Attribute {
        size: number = 3;
        data: number[] = [];
        type: number;
        index: number = 0;
        stride: number = 0;
        buffer: WebGLBuffer = gl.createBuffer();
        constructor(paramter: { type: number, size?: number, data?: number[], stride?: number }) {
            for (let attributeInfo in paramter) {
                this[attributeInfo] = paramter[attributeInfo] ? paramter[attributeInfo] : this[attributeInfo];
            }
            switch (paramter.type) {
                case DataType.float: this.type = gl.FLOAT; break;
                case DataType.int: this.type = gl.INT; break;
            }
        }
    }

    export class Program implements ProgramPass {

        faces: Faces;
        enableDepthTest: boolean = true;
        enableStencilTest: boolean = true;
        uniforms = {};
        attributes = {};
        attributeLocations = {};
        attribute0: string;
        webGlProgram: WebGLProgram;
        drawMode: number = gl.STATIC_DRAW;
        textures: Array<Texture> = [];
        vertexPrecision: string = 'highp';
        fragmentPrecision: string = 'mediump';
        vertexShader: string;
        fragmentShader: string;

        prefix: string[] = [];

        private passings:Array<(mesh: Mesh, scene: Scene, camera: Camera) => ProgramPass> = [];

        constructor(passing: (mesh: Mesh, scene: Scene, camera: Camera) => ProgramPass) {
            this.passings.push(passing);
        }

        public make(material: Material, mesh: Mesh, scene: Scene, camera: Camera) {
            this.prefix = [
                material.mainTexture ? '#define USE_TEXTURE ' : '',
                material.color ? '#define USE_COLOR ' : '',
                scene.openLight ? '#define OPEN_LIGHT \n#define LIGHT_NUM '
                    + scene.lights.length : ''
            ];
            if (!!this.passings) {
                let passes = this.passings.map((passing) => {return passing(mesh, scene, camera)});
                let finalPass:any = {};
                passes.forEach((pass) => {
                    mixin(finalPass, pass);
                });
                this.rePass(finalPass);
            };
        }

        public addPassing(passing : (mesh: Mesh, scene: Scene, camera: Camera) => ProgramPass) {
            this.passings.push(passing);
        }

        private rePass(parameter: ProgramPass) {
            if (!!(parameter.vertexShader) || !!(parameter.fragmentShader) || !!(parameter.prefix)) {
                this.vertexShader = parameter.vertexShader || this.vertexShader;
                this.fragmentShader = parameter.fragmentShader || this.fragmentShader;
                this.webGlProgram = createEntileShader(gl,
                    'precision ' + this.vertexPrecision + ' float;\n' + this.prefix.join('\n') + '\n' + this.vertexShader,
                    'precision ' + this.fragmentPrecision + ' float;\n' + this.prefix.join('\n') + '\n' +  this.fragmentShader);
            }
            this.faces = (parameter.faces == undefined ? this.faces : parameter.faces);
            for (let nameInShader in parameter.uniforms) {
                if (parameter.uniforms[nameInShader] != undefined) {
                    this.addUniform(nameInShader, parameter.uniforms[nameInShader]);
                }
            }
            for (let sampler in parameter.textures) {
                this.textures[sampler] = parameter.textures[sampler];
            }
            for (let nameInShader in parameter.attributes) {
                this.addAttribute(nameInShader, parameter.attributes[nameInShader]);
            }
            this.checkState();
            console.log(this);
        }

        public checkState() {
            let maxIndex = 0;
            for (let index of this.faces.data) {
                maxIndex = Math.max(maxIndex, index);
            }
            for (let attributeName in this.attributes) {
                console.assert(this.attributes[attributeName].size <= 4 && this.attributes[attributeName].size >= 1,
                    attributeName + "size error, now: " + this.attributes[attributeName].size + " should be 1-4");
                console.assert((maxIndex + 1) * this.attributes[attributeName].stride <=
                    this.attributes[attributeName].data.length,
                    attributeName + " length error, now:" + this.attributes[attributeName].data.length
                    + ", should bigger than:" + (maxIndex + 1) * this.attributes[attributeName].stride);
            }
        }

        setAttribute0(name: string) {
            this.attribute0 = name;
            gl.bindAttribLocation(this.webGlProgram, 0, name);
        }

        addUniform(nameInShader, uniform: { type: DataType, updator: (mesh?, camera?) => any }) {
            gl.useProgram(this.webGlProgram);
            console.log('uniform ' + nameInShader + ' passed')
            let location = this.getUniformLocation(nameInShader);
            let last = uniform.updator;
            //uniform.updator = () => { console.log(location); return last() };
            switch (uniform.type) {
                case DataType.float:
                    this.uniforms[nameInShader] = (mesh?, camera?) => {
                        gl.uniform1f(location, uniform.updator(mesh, camera));
                    };
                    break;
                case DataType.int:
                    this.uniforms[nameInShader] = (mesh?, camera?) => {
                        gl.uniform1i(location, uniform.updator(mesh, camera));
                    };
                    break;
                case DataType.vec2:
                    this.uniforms[nameInShader] = (mesh?, camera?) => {
                        let value = uniform.updator(mesh, camera);
                        gl.uniform2f(location, value[0], value[1]);
                    };
                    break;
                case DataType.vec3:
                    this.uniforms[nameInShader] = (mesh?, camera?) => {
                        let value = uniform.updator(mesh, camera);
                        gl.uniform3f(location, value[0], value[1], value[2]);
                    };
                    break;
                case DataType.vec4:
                    this.uniforms[nameInShader] = (mesh?, camera?) => {
                        let value = uniform.updator(mesh, camera);
                        gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    };
                    break;
                case DataType.mat2:
                    this.uniforms[nameInShader] = (mesh?, camera?) => {
                        gl.uniformMatrix2fv(location, false, uniform.updator(mesh, camera));
                    };
                case DataType.mat3:
                    this.uniforms[nameInShader] = (mesh?, camera?) => {
                        gl.uniformMatrix3fv(location, false, uniform.updator(mesh, camera));
                    }; case DataType.mat4:
                    this.uniforms[nameInShader] = (mesh?, camera?) => {
                        gl.uniformMatrix4fv(location, false, uniform.updator(mesh, camera));
                    };
                    break;
            }
        }

        public addAttribute(nameInShader, attribute: Attribute) {
            let location = this.getAttribLocation(nameInShader);
            if (location != null && location != -1) {
                console.log('add attribute ' + nameInShader);
                this.attributes[nameInShader] = attribute;
                this.attributeLocations[nameInShader] = location;
                gl.enableVertexAttribArray(location);
            }
        }

        private getUniformLocation(name: string): WebGLUniformLocation {
            if (gl == undefined || gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = gl.getUniformLocation(this.webGlProgram, name);
            if (result == null) {
                console.warn("uniform " + name + " not found!");
                return null;
            }
            return result;
        }

        private getAttribLocation(name: string): number {
            if (gl == undefined || gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = gl.getAttribLocation(this.webGlProgram, name);
            if (result == null) {
                console.error("attribute " + name + " not found!");
                return null;
            }
            return result;
        }

    }
}
