import { mat4 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { DataType } from "../DataTypeEnum";
import { IDirtyable } from "../Dirtyable";

import { Geometry } from "../geometries/Geometry";

import { Material } from "../materials/Material";
import { Mesh } from "../Mesh";

import { Light } from "../lights/Light";
import { Graphics } from "../renderer/GraphicsUtils";
import { Scene } from "../Scene";
import { Texture } from "../textures/Texture";
import { Attribute } from "./Attibute";

export interface IProgramSource {
    vertexShader: string;
    fragmentShader: string;
}

export interface IRenderParamHolder {
    hostObject?: object;
    defines?: {
        [index: string]: { defineName: string, useValue?: boolean, value: string };
    };
    paramFilters?: {
        [index: string]: { name: string, filter: (value: string) => boolean };
    };
    uniforms?: {
        [index: string]: IUniform;
    };
    uniformArrays?: {
        [index: string]: IUniformArray;
    };
    attributes?: {
        [index: string]: Attribute;
    };
    textures?: {
        [index: string]: { name?: string, source?: Texture },
    };
    textureArrays?: {
        [index: string]: { name?: string, sources?: Texture[] },
    };
    customPrefix?: string;
    structArrays?: {
        [index: string]: { name?: string };
    };
}

export interface IBuildinRenderParamMaps {
    mesh: Mesh;
    camera?: Camera;
    material?: Material;
    scene?: Scene;
    light?: Light;
}

export interface IRenderParamBase {
    name?: string;
    updator?: (param: IBuildinRenderParamMaps) => any;
}

export interface IUniform extends IRenderParamBase {
    type: DataType;
}

export interface IUniformArray extends IRenderParamBase {
    type: DataType;
}

export class Program implements IDirtyable {
    public gl: WebGLRenderingContext;
    public enableDepthTest: boolean = true;
    public enableStencilTest: boolean = true;

    public dirty: boolean = true;

    public webGlProgram: WebGLProgram;

    public extensionStatements: string[] = [];

    private defineCaches: { [index: string]: string } = {};
    private uniformCaches: { [index: string]: { value: number, location: WebGLUniformLocation } } = {};
    private uniformArrayCaches: { [index: string]: { value: ArrayBufferView, location: WebGLUniformLocation } } = {};
    private undesiredUniforms: { [index: string]: undefined } = {};
    private attributeLocations: { [index: string]: number } = {};
    private undesiredAttributes: { [index: string]: undefined } = {};

    private paramFilters: { [index: string]: { name: string, filter: (value: string) => boolean }; } = {};

    private extraRenderParamHolders: { [index: string]: IRenderParamHolder };

    private viewport: {
        x: number,
        y: number,
        width: number,
        height: number,
    };

    private vertexPrecision: string = "highp";
    private fragmentPrecision: string = "highp";

    private currentTextureUnit: number = 0;

    private source: IProgramSource;

    constructor(
        gl: WebGLRenderingContext,
        source: IProgramSource,
        holders: { [index: string]: IRenderParamHolder }) {
        this.gl = gl;
        this.source = source;
        this.extraRenderParamHolders = holders;
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

    public setExtraRenderParam(name: string, paramHolder: IRenderParamHolder) {
        this.extraRenderParamHolders[name] = paramHolder;
        return this;
    }

    public setViewPort(viewport: { x: number, y: number, width: number, height: number }) {
        this.viewport = viewport;
    }

    public clean() {
        if (this.dirty) {
            this.make();
            this.dirty = false;
        }
    }

    public make() {
        const defines = [];
        for (const defineName in this.defineCaches) {
            const defineVal = this.defineCaches[defineName] || "";
            const defineLine = `#define ${defineName} ${defineVal}`;
            defines.push(defineLine);
            console.log(defineLine);
        }
        this.webGlProgram = Graphics.createEntileShader(
            this.gl,
            this.extensionStatements.join("\n")
            + "\nprecision " + this.vertexPrecision + " float;\n" + defines.join("\n") + "\n"
            + this.source.vertexShader,
            this.extensionStatements.join("\n")
            + "\nprecision " + this.fragmentPrecision + " float;\n" + defines.join("\n") + "\n"
            + this.source.fragmentShader);
        this.undesiredUniforms = {};
        this.uniformCaches = {};
        this.undesiredAttributes = {};
        this.attributeLocations = {};
        return this;
    }

    public pass(buildinContainers: IBuildinRenderParamMaps) {
        this.updateDefines(buildinContainers);
        this.clean();
        this.currentTextureUnit = 0;
        this.gl.useProgram(this.webGlProgram);
        this.gl.viewport(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);

        for (const holderName in buildinContainers) {
            const holder = Graphics.getRenderParamHost(buildinContainers[holderName]);
            this.passOneParamsHolder(buildinContainers, holder);
        }

        for (const holderName in this.extraRenderParamHolders) {
            const holder = this.extraRenderParamHolders[holderName];
            this.passOneParamsHolder(buildinContainers, holder);
        }

        const geometry = buildinContainers.mesh.geometry;

        for (const attributeKey in geometry.attributes) {
            if (attributeKey in this.undesiredAttributes) {
                continue;
            }
            const attribute = geometry.attributes[attributeKey];
            let location = this.attributeLocations[attributeKey];
            if (location === undefined) {
                location = this.getAttribLocation(attributeKey);
                if (location === null || location === -1) {
                    this.undesiredAttributes[attributeKey] = undefined;
                    continue;
                }
                this.attributeLocations[attributeKey] = location;
            }

            this.gl.enableVertexAttribArray(this.attributeLocations[attributeKey]);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
            this.gl.vertexAttribPointer(
                this.attributeLocations[attributeKey],
                attribute.size,
                attribute.type,
                false,
                0,
                0,
            );
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, geometry.faces.buffer);
        this.gl.drawElements(this.gl.TRIANGLES, geometry.faces.data.length, this.gl.UNSIGNED_SHORT, 0);
        for (const attributeKey in this.attributeLocations) {
            const attribute = geometry.attributes[attributeKey];
            this.gl.disableVertexAttribArray(this.attributeLocations[attributeKey]);
        }
        return this;
    }

    private passOneParamsHolder(
        buildinContainder: IBuildinRenderParamMaps, holder: IRenderParamHolder, namePrefix: string = "") {
        if (holder === undefined) {
            return;
        }

        if (!!holder.customPrefix) {
            namePrefix = holder.customPrefix;
        }

        for (const linkName in holder.paramFilters) {
            this.paramFilters[namePrefix + linkName] = holder.paramFilters[linkName];
        }

        for (const uniformKey in holder.uniforms) {
            const uniformInfo = holder.uniforms[uniformKey];
            const uniformName = namePrefix + (uniformInfo.name || uniformKey);
            if (!this.filter(name)) {
                continue;
            }
            const val = !!uniformInfo.updator ?
                uniformInfo.updator(buildinContainder) : holder.hostObject[uniformKey];
            this.updateUniform(uniformName, uniformInfo.type, val);
        }
        for (const uniformArrayKey in holder.uniformArrays) {
            const uniformArrayInfo = holder.uniforms[uniformArrayKey];
            const uniformArrayName = namePrefix + (uniformArrayInfo.name || uniformArrayKey);
            if (!this.filter(name)) {
                continue;
            }
            const val = !!uniformArrayInfo.updator ?
                uniformArrayInfo.updator(buildinContainder) : holder.hostObject[uniformArrayKey];
            this.updateUniformArray(uniformArrayName, uniformArrayInfo.type, val);
        }
        for (const textureKey in holder.textures) {
            const textureInfo = holder.textures[textureKey];
            const name = namePrefix + (textureInfo.name || textureKey);
            if (!this.filter(name)) {
                continue;
            }
            const texture: Texture = !!textureInfo.source ? textureInfo.source : holder.hostObject[textureKey];
            if (!!texture) {
                this.gl.activeTexture(this.gl.TEXTURE0 + this.currentTextureUnit);
                this.gl.bindTexture(texture.target, texture.glTexture);
                this.updateUniform(name, DataType.int, this.currentTextureUnit);
                this.currentTextureUnit++;
            }
        }
        for (const textureArrayKey in holder.textureArrays) {
            const textureArrayInfo = holder.textureArrays[textureArrayKey];
            const name = namePrefix + (textureArrayInfo.name || textureArrayKey);
            if (!this.filter(name)) {
                continue;
            }
            const textureArray: Texture[] = !!textureArrayInfo.sources ?
                textureArrayInfo.sources : holder.hostObject[textureArrayKey];
            const indices = [];
            for (const texture of textureArray) {
                this.gl.activeTexture(this.gl.TEXTURE0 + this.currentTextureUnit);
                this.gl.bindTexture(texture.target, texture.glTexture);
                indices.push(this.currentTextureUnit);
                this.currentTextureUnit++;
            }
            if (indices.length > 0) {
                this.updateUniformArray(name, DataType.int, new Int32Array(indices));
            }
        }
        if (!!holder.structArrays && namePrefix !== "" && !!holder.hostObject) {
            throw new Error("structArray can only be nested of depth 1");
        }
        for (const structArrayKey in holder.structArrays) {
            const structArrayInfo = holder.structArrays[structArrayKey];
            const arrayName = structArrayInfo.name || structArrayKey;
            const structArray: any[] = holder.hostObject[structArrayKey];
            for (const i in structArray) {
                const struct = structArray[i];
                const paramHolder = Graphics.getRenderParamHost(struct);
                if (paramHolder === undefined) {
                    throw new Error(`
                    Property ${arrayName} of type ${typeof holder.hostObject}
                    must be an array of class annotated by @RenderParamContainer`);
                }
                this.passOneParamsHolder(
                    buildinContainder, Graphics.getRenderParamHost(struct), `${arrayName}[${i}].`);
            }
        }
    }

    private filter(name) {
        if (name in this.paramFilters && !(this.paramFilters[name].name in this.defineCaches)) {
            const value = this.defineCaches[this.paramFilters[name].name];
            return (this.paramFilters[name].filter(value));
        }
        return true;
    }

    private updateDefines(buildinContainers: IBuildinRenderParamMaps) {
        for (const holderName in buildinContainers) {
            this.updateOneDefines(Graphics.getRenderParamHost(buildinContainers[holderName]), buildinContainers);
        }
        for (const holderName in this.extraRenderParamHolders) {
            this.updateOneDefines(this.extraRenderParamHolders[holderName], buildinContainers);
        }
    }

    private updateOneDefines(holder: IRenderParamHolder, buildinContainers: IBuildinRenderParamMaps) {
        if (!!holder) {
            for (const defineKey in holder.defines) {
                const defineName = holder.defines[defineKey].defineName;
                let val = "";
                if (!!holder.hostObject) {
                    if (!holder.hostObject[defineKey]) {
                        continue;
                    }
                    val = holder.hostObject[defineKey];
                } else if (!!holder.defines[defineKey].value) {
                    val = holder.defines[defineKey].value;
                }
                const cache = this.defineCaches[defineName];
                this.defineCaches[defineName] = val;
                if (val !== cache) {
                    this.dirty = true;
                }
            }
            for (const structArrayKey in holder.structArrays) {
                const structArrayInfo = holder.structArrays[structArrayKey];
                const arrayName = structArrayInfo.name || structArrayKey;
                const structArray: any[] = holder.hostObject[structArrayKey];
                const val = structArray.length.toString();
                const cache = this.defineCaches[arrayName + "Num"];
                if (val !== cache) {
                    this.dirty = true;
                }
                this.defineCaches[arrayName + "Num"] = val;
            }
        }
    }

    private updateUniform(name: string, type: DataType, value) {
        if (value === undefined) { return; }
        if (name in this.undesiredUniforms) {
            return;
        }
        let cache = this.uniformCaches[name];
        if (!cache) {
            cache = { value, location: this.gl.getUniformLocation(this.webGlProgram, name) };
            if (cache.location === null) {
                this.undesiredUniforms[name] = undefined;
                return;
            }
            console.log("initial pass uniform " + name + " " + value);
            this.uniformCaches[name] = cache;
        }
        const location = cache.location;
        if (!location) { console.error(location); }
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

    private updateUniformArray(name, type: DataType, value: Float32Array | Int32Array) {
        if (value === undefined) { return; }
        if (name in this.undesiredUniforms) {
            return;
        }
        let cache = this.uniformArrayCaches[name];
        if (!cache) {
            cache = { value, location: this.gl.getUniformLocation(this.webGlProgram, name) };
            if (cache.location === null) {
                this.undesiredUniforms[name] = undefined;
                return;
            }
            console.log("initial pass uniform array " + name + " " + value);
            this.uniformArrayCaches[name] = cache;
        }
        const location = cache.location;
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
        console.log("initial pass attribute " + name + " " + result);
        return result;
    }

}

export const shaderPassLib = {
    uniforms: {
        modelViewProjectionMatrix: {
            type: DataType.mat4,
            updator: (p: IBuildinRenderParamMaps) => {
                return mat4.multiply(
                    mat4.create(),
                    p.camera.projectionMatrix,
                    mat4.multiply(mat4.create(),
                        p.camera.worldToObjectMatrix,
                        p.mesh.matrix),
                );
            },
        },
        modelViewMatrix: {
            type: DataType.mat4,
            updator: ({ mesh, camera }) => mat4.mul(mat4.create(), camera.worldToObjectMatrix, mesh.matrix),
        },
        normalViewMatrix: {
            type: DataType.mat4,
            updator: ({ mesh, camera }) =>
                mat4.transpose(mat4.create(), mat4.invert(mat4.create(),
                    mat4.mul(mat4.create(), camera.worldToObjectMatrix, mesh.matrix))),
        },
    },
    defines: {
        filterSize: { defineName: "FILTER_SIZE", value: "6" },
        blockSize: { defineName: "BLOCK_SIZE", value: "6" },
    },
};
