/// <reference path="../CanvasToy.ts"/>

module CanvasToy {

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

    export class Program {

        faces: Faces;
        uniforms = {};
        attributes = {};
        attributeLocations = {};
        attribute0: string;
        webGlProgram: WebGLProgram;
        drawMode: number = gl.STATIC_DRAW;
        textures: Array<Texture> = [];
        vertexPrecision: string = 'highp';
        fragmentPrecision: string = 'mediump';

        constructor(parameter: { vertexShader: string, fragmentShader: string, faces?: Faces, uniforms?: any, attributes?: any, textures?: any }) {
            this.reMake(parameter);
        }

        public reMake(parameter: { vertexShader: string, fragmentShader: string, faces?: Faces, uniforms?: any, attributes?: any, textures?: any }) {
            this.webGlProgram = createEntileShader(gl,
                'precision ' + this.vertexPrecision + ' float;\n' + parameter.vertexShader,
                'precision ' + this.fragmentPrecision + ' float;\n' +parameter.fragmentShader);
            this.resetPass(parameter);
        }

        public resetPass(parameter: { faces?: Faces, uniforms?: any, attributes?: any, textures?: any }) {
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

        addUniform(nameInShader, uniform: { type: DataType, updator: () => any }) {
            gl.useProgram(this.webGlProgram);
            console.log('uniform ' + nameInShader + ' passed')
            let location = this.getUniformLocation(nameInShader);
            let last = uniform.updator;
            //uniform.updator = () => { console.log(location); return last() };
            switch (uniform.type) {
                case DataType.float:
                    this.uniforms[nameInShader] = () => {
                        gl.uniform1f(location, uniform.updator());
                    };
                    break;
                case DataType.int:
                    this.uniforms[nameInShader] = () => {
                        gl.uniform1i(location, uniform.updator());
                    };
                    break;
                case DataType.vec2:
                    this.uniforms[nameInShader] = () => {
                        let value = uniform.updator();
                        gl.uniform2f(location, value[0], value[1]);
                    };
                    break;
                case DataType.vec3:
                    this.uniforms[nameInShader] = () => {
                        let value = uniform.updator();
                        gl.uniform3f(location, value[0], value[1], value[2]);
                    };
                    break;
                case DataType.vec4:
                    this.uniforms[nameInShader] = () => {
                        let value = uniform.updator();
                        gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    };
                    break;
                case DataType.mat2:
                    this.uniforms[nameInShader] = () => {
                        gl.uniformMatrix2fv(location, false, uniform.updator());
                    };
                case DataType.mat3:
                    this.uniforms[nameInShader] = () => {
                        gl.uniformMatrix3fv(location, false, uniform.updator());
                    }; case DataType.mat4:
                    this.uniforms[nameInShader] = () => {
                        gl.uniformMatrix4fv(location, false, uniform.updator());
                    };
                    break;
            }
        }

        public addAttribute(nameInShader, attribute: Attribute) {
            let location = this.getAttribLocation(nameInShader);
            if (location != null && location != -1) {
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
