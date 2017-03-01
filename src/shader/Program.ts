/// <reference path="../CanvasToy.ts"/>

namespace CanvasToy {

    export interface IProgramSource {
        vertexShader: string;
        fragmentShader: string;
    }

    export interface IProgramPass {
        faces?: (mesh: Mesh) => Faces;
        uniforms?: any;
        attributes?: any;
        textures?: any;
        prefix?: any;
    }

    export interface IUniform {
        name?: string;
        type: DataType;
        updator: (object?: Object3d, camera?: Camera, material?: Material) => any;
    }

    export class Attribute {
        public size: number = 3;
        public data: number[] = [];
        public type: number;
        public index: number = 0;
        public stride: number = 0;
        public buffer: WebGLBuffer = null;
        public gl: WebGLRenderingContext = null;
        constructor(
            gl: WebGLRenderingContext,
            paramter: { type: number, size?: number, data?: number[], stride?: number },
        ) {
            this.buffer = gl.createBuffer();
            this.gl = gl;
            for (const attributeInfo in paramter) {
                this[attributeInfo] = paramter[attributeInfo] ? paramter[attributeInfo] : this[attributeInfo];
            }
            switch (paramter.type) {
                case DataType.float: this.type = gl.FLOAT; break;
                case DataType.int: this.type = gl.INT; break;
                default: break;
            }
        }
    }

    export class Program implements IProgramPass {
        public gl: WebGLRenderingContext;
        public faces: (mesh: Mesh) => Faces;
        public enableDepthTest: boolean = true;
        public enableStencilTest: boolean = true;
        public uniforms = {};
        public uniformLocationCache = {};
        public attributes = {};
        public attributeLocations = {};
        public attribute0: string;
        public webGlProgram: WebGLProgram;
        public textures: Array<{
            sampler: string,
            getter: (mesh: Mesh, camera: Camera, material) => Texture,
            location: WebGLUniformLocation,
        }> = [];
        public vertexPrecision: string = "highp";
        public fragmentPrecision: string = "highp";

        public extensionStatements: string[] = [];

        public definesFromMaterial: string[] = [];

        private passFunctions: IProgramPass;

        private source: IProgramSource;

        constructor(
            gl: WebGLRenderingContext,
            source: IProgramSource,
            passFunctions: IProgramPass) {
            this.gl = gl;
            this.source = source;
            this.passFunctions = passFunctions;
        }

        public drawMode = (gl: WebGLRenderingContext) => { return gl.STATIC_DRAW; };

        public setFragmentShader(fragmentShader: string) {
            this.source.fragmentShader = fragmentShader;
            return this;
        }

        public setVertexShader(vertexShader: string) {
            this.source.vertexShader = vertexShader;
            return this;
        }

        public resetMaterialDefines(materiel: Material) {
            const _material: any = materiel;
            for (const subdefines in _material.defines) {
                for (const define of _material.defines[subdefines](materiel)) {
                    this.definesFromMaterial.push(define);
                }
            }
        }

        public make(scene: Scene) {
            const defines = ["#define OPEN_LIGHT", "#define LIGHT_NUM " + scene.lights.length];
            for (const define of this.definesFromMaterial) {
                defines.push("#define " + define);
                console.log("#define " + define);
            }
            this.webGlProgram = createEntileShader(
                this.gl,
                this.extensionStatements.join("\n")
                + "\nprecision " + this.vertexPrecision + " float;\n" + defines.join("\n") + "\n"
                + this.source.vertexShader,
                this.extensionStatements.join("\n")
                + "\nprecision " + this.fragmentPrecision + " float;\n" + defines.join("\n") + "\n"
                + this.source.fragmentShader);

            const componets = this.passFunctions;
            this.faces = (componets.faces === undefined ? this.faces : componets.faces);
            this.uniforms = {};
            this.textures = [];
            for (const nameInShader in componets.uniforms) {
                if (componets.uniforms[nameInShader] !== undefined) {
                    this.addUniform(nameInShader, componets.uniforms[nameInShader]);
                }
            }
            for (const sampler in componets.textures) {
                this.addTexture(sampler, componets.textures[sampler]);
            }
            for (const nameInShader in componets.attributes) {
                this.addAttribute(nameInShader, componets.attributes[nameInShader]);
            }
            // this.checkState(mesh);
            return this;
        }

        public pass(mesh: Mesh, camera: Camera, materiel: Material) {
            this.gl.useProgram(this.webGlProgram);
            for (const uniformName in this.uniforms) {
                if (this.uniforms[uniformName] !== undefined) {
                    this.uniforms[uniformName](mesh, camera, materiel);
                }
            }
            for (let unit = 0; unit < this.textures.length; ++unit) {
                const texture = this.textures[unit].getter(mesh, camera, materiel);
                if (!!texture) {
                    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
                    this.gl.bindTexture(texture.target, texture.glTexture);
                    this.gl.uniform1i(this.textures[unit].location, unit);
                }
            }
            for (const attributeName in this.attributes) {
                const attribute = this.attributes[attributeName](mesh, camera, materiel);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
                this.gl.vertexAttribPointer(
                    this.attributeLocations[attributeName],
                    attribute.size,
                    attribute.type,
                    false,
                    0,
                    0,
                );
            }
            return this;
        }

        public checkState(mesh: Mesh) {
            let maxIndex = 0;
            for (const index of this.faces(mesh).data) {
                maxIndex = Math.max(maxIndex, index);
            }
            for (const attributeName in this.attributes) {
                console.assert(this.attributes[attributeName](mesh).size <= 4
                    && this.attributes[attributeName](mesh).size >= 1,
                    attributeName + "size error, now: " + this.attributes[attributeName].size + " should be 1-4");
                console.assert((maxIndex + 1) * this.attributes[attributeName](mesh).stride <=
                    this.attributes[attributeName](mesh).data.length,
                    attributeName + " length error, now:" + this.attributes[attributeName](mesh).data.length
                    + ", should bigger than:" + (maxIndex + 1) * this.attributes[attributeName](mesh).stride);
            }
            return this;
        }

        public setAttribute0(name: string) {
            this.attribute0 = name;
            this.gl.bindAttribLocation(this.webGlProgram, 0, name);
            return this;
        }

        public addTexture(sampler: string, getter: (mesh, camera, material) => Texture) {
            const unit = this.textures.length;
            this.addUniform(sampler, { type: DataType.int, updator: () => unit });
            this.textures.push({ sampler, getter, location: this.gl.getUniformLocation(this.webGlProgram, sampler) });
        }

        public addUniform(nameInShader, uniform: IUniform) {
            this.gl.useProgram(this.webGlProgram);
            const location = this.getUniformLocation(nameInShader);
            if (location == null) {
                return this;
            }
            switch (uniform.type) {
                case DataType.float:
                    this.uniforms[nameInShader] = (mesh?, camera?, material?) => {
                        this.gl.uniform1f(location, uniform.updator(mesh, camera, material));
                    };
                    break;
                case DataType.int:
                    this.uniforms[nameInShader] = (mesh?, camera?, material?) => {
                        this.gl.uniform1i(location, uniform.updator(mesh, camera, material));
                    };
                    break;
                case DataType.vec2:
                    this.uniforms[nameInShader] = (mesh?, camera?, material?) => {
                        const value = uniform.updator(mesh, camera, material);
                        this.gl.uniform2f(location, value[0], value[1]);
                    };
                    break;
                case DataType.vec3:
                    this.uniforms[nameInShader] = (mesh?, camera?, material?) => {
                        const value = uniform.updator(mesh, camera, material);
                        this.gl.uniform3f(location, value[0], value[1], value[2]);
                    };
                    break;
                case DataType.vec4:
                    this.uniforms[nameInShader] = (mesh?, camera?, material?) => {
                        const value = uniform.updator(mesh, camera, material);
                        this.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    };
                    break;
                case DataType.mat2:
                    this.uniforms[nameInShader] = (mesh?, camera?, material?) => {
                        this.gl.uniformMatrix2fv(location, false, uniform.updator(mesh, camera, material));
                    };
                case DataType.mat3:
                    this.uniforms[nameInShader] = (mesh?, camera?, material?) => {
                        this.gl.uniformMatrix3fv(location, false, uniform.updator(mesh, camera, material));
                    }; case DataType.mat4:
                    this.uniforms[nameInShader] = (mesh?, camera?, material?) => {
                        this.gl.uniformMatrix4fv(location, false, uniform.updator(mesh, camera, material));
                    };
                    break;
                default: break;
            }
        }

        public deleteUniform(nameInShader) {
            this.uniforms[nameInShader] = undefined;
            return this;
        }

        public deleteAttribute(nameInShader: string) {
            this.attributes[nameInShader] = undefined;
            this.attributeLocations[nameInShader] = undefined;
            return this;
        }

        public addAttribute(
            nameInShader: string,
            attributeFun: (mesh?: Mesh, camera?: Camera, material?: Material) => Attribute) {
            const location = this.getAttribLocation(nameInShader);
            if (location !== null && location !== -1) {
                this.attributes[nameInShader] = attributeFun;
                this.attributeLocations[nameInShader] = location;
                this.gl.enableVertexAttribArray(location);
            }
            return this;
        }

        private getUniformLocation(name: string): WebGLUniformLocation {
            if (this.gl === undefined || this.gl === null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            if (!this.webGlProgram) {
                console.warn("program invalid");
            }
            const result = this.gl.getUniformLocation(this.webGlProgram, name);
            if (result === null) {
                console.log("uniform " + name + " not found!");
                return null;
            }
            return result;
        }

        private addPassProcesser(parameter: IProgramPass) {
            this.faces = (parameter.faces === undefined ? this.faces : parameter.faces);
            for (const nameInShader in parameter.uniforms) {
                if (parameter.uniforms[nameInShader] !== undefined) {
                    this.addUniform(nameInShader, parameter.uniforms[nameInShader]);
                }
            }
            for (const sampler in parameter.textures) {
                this.textures[sampler] = parameter.textures[sampler];
            }
            for (const nameInShader in parameter.attributes) {
                this.addAttribute(nameInShader, parameter.attributes[nameInShader]);
            }
            // this.checkState(mesh);
            return this;
        }

        private getAttribLocation(name: string): number {
            if (this.gl === undefined || this.gl === null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            const result = this.gl.getAttribLocation(this.webGlProgram, name);
            if (result === null) {
                console.error("attribute " + name + " not found!");
                return null;
            }
            return result;
        }
    }

    export const defaultProgramPass = {
        faces: (mesh) => mesh.geometry.faces,
        textures: {
            uMainTexture: (mesh, camera, material) => material.mainTexture,
            uCubeTexture: (mesh, camera, material) => material.reflectionMap,
        },
        uniforms: {
            modelViewProjectionMatrix: {
                type: DataType.mat4,
                updator: (mesh: Mesh, camera: Camera) => {
                    return mat4.multiply(
                        mat4.create(),
                        camera.projectionMatrix,
                        mat4.multiply(mat4.create(),
                            camera.worldToObjectMatrix,
                            mesh.matrix),
                    );
                },
            },
            modelViewMatrix: {
                type: DataType.mat4,
                updator: (mesh: Mesh, camera: Camera) => {
                    return mat4.multiply(mat4.create(),
                        camera.worldToObjectMatrix,
                        mesh.matrix,
                    );
                },
            },
            normalViewMatrix: {
                type: DataType.mat4,
                updator: (mesh: Mesh, camera: Camera) =>
                    mat4.transpose(mat4.create(), mat4.invert(mat4.create(),
                        mat4.mul(mat4.create(), camera.worldToObjectMatrix, mesh.matrix))),
            },
        },
        attributes: {
            position: (mesh) => mesh.geometry.attributes.position,
            aMainUV: (mesh) => mesh.geometry.attributes.uv,
            aNormal: (mesh) => mesh.geometry.attributes.normal,
        },
    };
};
