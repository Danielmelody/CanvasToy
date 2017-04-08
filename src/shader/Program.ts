/// <reference path="../CanvasToy.ts"/>
/// <reference path="../Mesh.ts"/>
/// <reference path="../materials/Material.ts"/>
/// <reference path="../geometries/Geometry.ts"/>

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
        key?: string;
        type: DataType;
        updator: (object?: Object3d, camera?: Camera, material?: Material) => any;
    }

    export interface IUniformArray {
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
        public uniformArrays = {};
        public attributes = {};
        public attributeLocations = {};
        public attribute0: string;
        public webGlProgram: WebGLProgram;

        public viewport: {
            x: number,
            y: number,
            width: number,
            height: number,
        };

        public textures: Array<{
            sampler: string,
            getter: (mesh: Mesh, camera: Camera, material) => Texture,
            location: WebGLUniformLocation,
        }> = [];

        public textureArrays: Array<{
            samplerArray: string,
            arrayGetter: (mesh: Mesh, camera: Camera, material) => Texture[],
            location: WebGLUniformLocation,
        }> = [];

        public vertexPrecision: string = "highp";
        public fragmentPrecision: string = "highp";

        public extensionStatements: string[] = [];

        public definesFromMaterial: Array<{ name: string, value: string }> = [];
        // public definesFromProcesser: string[] = [];

        private passFunctions: IProgramPass;

        private source: IProgramSource;

        constructor(
            gl: WebGLRenderingContext,
            source: IProgramSource,
            passFunctions: IProgramPass) {
            this.gl = gl;
            this.source = source;
            this.passFunctions = passFunctions;
            this.viewport = {
                x: 0, y: 0,
                width: gl.canvas.width,
                height: gl.canvas.height,
            };
        }

        public drawMode = (gl: WebGLRenderingContext) => gl.STATIC_DRAW;

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
                const define = _material.defines[subdefines](materiel);
                if (!!define) {
                    this.definesFromMaterial.push(define);
                }
            }
        }

        public make(scene: Scene) {
            const defines = [
                "#define OPEN_LIGHT",
                "#define LIGHT_NUM " + scene.lights.length,
                "#define DIR_LIGHT_NUM " + scene.dirctionLights.length,
                "#define SPOT_LIGHT_NUM " + scene.spotLights.length,
                "#define POINT_LIGHT_NUM " + scene.pointLights.length,
            ];
            for (const define of this.definesFromMaterial) {
                let defineLine = `#define ${define.name}`;
                if (!!define.value) {
                    defineLine += ` ${define.value}`;
                }
                defines.push(defineLine);
                console.log(defineLine);
            }
            this.webGlProgram = createEntileShader(
                this.gl,
                this.extensionStatements.join("\n")
                + "\nprecision " + this.vertexPrecision + " float;\n" + defines.join("\n") + "\n"
                + this.source.vertexShader,
                this.extensionStatements.join("\n")
                + "\nprecision " + this.fragmentPrecision + " float;\n" + defines.join("\n") + "\n"
                + this.source.fragmentShader);

            this.gl.useProgram(this.webGlProgram);

            const componets = this.passFunctions;
            this.faces = (componets.faces === undefined ? this.faces : componets.faces);
            this.uniforms = {};
            this.textures = [];
            if (!!componets.uniforms) {
                for (const nameInShader in componets.uniforms) {
                    if (componets.uniforms[nameInShader] !== undefined) {
                        this.addUniform(nameInShader, componets.uniforms[nameInShader]);
                    }
                }
            }
            if (!!componets.textures) {
                for (const sampler in componets.textures) {
                    const target = componets.textures[sampler];
                    if (target.isArray) {
                        this.addTextureArray(sampler, componets.textures[sampler]);
                    } else {
                        this.addTexture(sampler, componets.textures[sampler]);
                    }
                }
            }
            for (const nameInShader in componets.attributes) {
                this.addAttribute(nameInShader, componets.attributes[nameInShader]);
            }
            return this;
        }

        public pass(mesh: Mesh, camera: Camera, materiel: Material) {
            this.gl.useProgram(this.webGlProgram);
            this.gl.viewport(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            for (const uniformName in this.uniforms) {
                if (this.uniforms[uniformName] !== undefined) {
                    this.uniforms[uniformName](mesh, camera, materiel);
                }
            }
            for (const uniformArrayName in this.uniformArrays) {
                if (this.uniformArrays[uniformArrayName] !== undefined) {
                    this.uniformArrays[uniformArrayName](mesh, camera, materiel);
                }
            }
            let unit = 0;
            for (const textureDiscriptor of this.textures) {
                const texture = textureDiscriptor.getter(mesh, camera, materiel);
                if (!!texture) {
                    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
                    this.gl.bindTexture(texture.target, texture.glTexture);
                    this.gl.uniform1i(this.textures[unit].location, unit);
                }
                unit++;
            }
            for (const textureArrayDiscriptor of this.textureArrays) {
                const textureArray = textureArrayDiscriptor.arrayGetter(mesh, camera, materiel);
                const indices = [];
                for (const index in textureArray) {
                    const texture = textureArray[index];
                    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
                    this.gl.bindTexture(texture.target, texture.glTexture);
                    indices.push(unit++);
                }
                if (indices.length > 0) {
                    this.gl.uniform1iv(textureArrayDiscriptor.location, indices);
                }
            }
            for (const attributeName in this.attributes) {
                const attribute = this.attributes[attributeName](mesh, camera, materiel);
                this.gl.enableVertexAttribArray(this.attributeLocations[attributeName]);
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
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
            this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.faces.data.length, this.gl.UNSIGNED_SHORT, 0);
            for (const attributeName in this.attributes) {
                const attribute = this.attributes[attributeName](mesh, camera, materiel);
                this.gl.disableVertexAttribArray(this.attributeLocations[attributeName]);
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

        public addTextureArray(samplerArray: string, arrayGetter: () => Texture[]) {
            const location = this.gl.getUniformLocation(this.webGlProgram, samplerArray);
            this.textureArrays.push({
                samplerArray,
                arrayGetter,
                location,
            });
        }

        public addTexture(sampler: string, getter: (mesh, camera, material) => Texture) {
            const unit = this.textures.length;
            this.textures.push({ sampler, getter, location: this.gl.getUniformLocation(this.webGlProgram, sampler) });
        }

        public addUniformArray(arrayNameInShader, uniformArrayDiscriptor: IUniformArray) {
            this.gl.useProgram(this.webGlProgram);
            const location = this.getUniformLocation(arrayNameInShader);
            if (location == null) {
                return this;
            }
            this.uniformArrays[arrayNameInShader] = (mesh, camera, material) => {
                this.updateUniformArray(
                    location,
                    uniformArrayDiscriptor.updator(mesh, camera, material), uniformArrayDiscriptor.type,
                );
            };
            return this;
        }

        public addUniform(nameInShader, uniform: IUniform) {
            this.gl.useProgram(this.webGlProgram);
            const location = this.getUniformLocation(nameInShader);
            if (location == null) {
                return this;
            }
            this.uniforms[nameInShader] = (mesh, camera, material) => {
                this.updateUniform(location, uniform.updator(mesh, camera, material), uniform.type);
            };
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
            }
            return this;
        }

        public setViewPort(viewport: {x: number, y: number, width: number, height: number}) {
            this.viewport = viewport;
        }

        private updateUniformArray(location, value: number[] | Float32Array | Uint32Array, type: DataType) {
            switch (type) {
                case DataType.float:
                    this.gl.uniform1fv(location, value);
                    break;
                case DataType.int:
                    this.gl.uniform1iv(location, value);
                    break;
                case DataType.vec2:
                    this.gl.uniform2fv(location, value);
                    break;
                case DataType.vec3:
                    this.gl.uniform3fv(location, value);
                    break;
                case DataType.vec4:
                    this.gl.uniform4fv(location, value);
                    break;
                case DataType.mat2:
                    this.gl.uniformMatrix2fv(location, false, value);
                case DataType.mat3:
                    this.gl.uniformMatrix3fv(location, false, value);
                case DataType.mat4:
                    this.gl.uniformMatrix4fv(location, false, value);
                    break;
                default: break;
            }
            return this;
        }

        private updateUniform(location, value, type: DataType) {
            switch (type) {
                case DataType.float:
                    this.gl.uniform1f(location, value);
                    break;
                case DataType.int:
                    this.gl.uniform1i(location, value);
                    break;
                case DataType.vec2:
                    this.gl.uniform2f(location, value[0], value[1]);
                    break;
                case DataType.vec3:
                    this.gl.uniform3f(location, value[0], value[1], value[2]);
                    break;
                case DataType.vec4:
                    this.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    break;
                case DataType.mat2:
                    this.gl.uniformMatrix2fv(location, false, value);
                case DataType.mat3:
                    this.gl.uniformMatrix3fv(location, false, value);
                case DataType.mat4:
                    this.gl.uniformMatrix4fv(location, false, value);
                    break;
                default: break;
            }
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
