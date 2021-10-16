import { mat4 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { DataType } from "../DataTypeEnum";
import { IDirtyable } from "../Dirtyable";
import { Light } from "../lights/Light";
import { IMaterial } from "../materials/Material";
import { Mesh } from "../Mesh";
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
        [index: string]: {
            defineName: string;
            useValue?: boolean;
            value: string;
        };
    };
    paramFilters?: {
        [index: string]: {
            name: string;
            filter: (value: string) => boolean;
        };
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
        [index: string]: {
            name?: string;
            source?: Texture;
        };
    };
    textureArrays?: {
        [index: string]: {
            name?: string;
            sources?: Texture[];
        };
    };
    customPrefix?: string;
    structArrays?: {
        [index: string]: {
            name?: string;
        };
    };
}
export interface IBuildinRenderParamMaps {
    mesh: Mesh;
    camera?: Camera;
    material?: IMaterial;
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
export declare class Program implements IDirtyable {
    gl: WebGLRenderingContext;
    enableDepthTest: boolean;
    enableStencilTest: boolean;
    dirty: boolean;
    webGlProgram: WebGLProgram;
    extensionStatements: string[];
    private defineCaches;
    private uniformCaches;
    private uniformArrayCaches;
    private undesiredUniforms;
    private attributeLocations;
    private undesiredAttributes;
    private paramFilters;
    private extraRenderParamHolders;
    private viewport;
    private vertexPrecision;
    private fragmentPrecision;
    private source;
    constructor(gl: WebGLRenderingContext, source: IProgramSource, holders: {
        [index: string]: IRenderParamHolder;
    });
    drawMode: (gl: WebGLRenderingContext) => number;
    setFragmentShader(fragmentShader: string): this;
    setVertexShader(vertexShader: string): this;
    setExtraRenderParam(name: string, paramHolder: IRenderParamHolder): this;
    setViewPort(viewport: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): void;
    resetLightShadows(): void;
    make(): this;
    pass(buildinContainers: IBuildinRenderParamMaps): this;
    private passOneParamsHolder;
    private filter;
    private updateDefines;
    private updateOneDefines;
    private updateUniform;
    private updateUniformArray;
    private getAttribLocation;
}
export declare const shaderPassLib: {
    uniforms: {
        modelViewProjectionMatrix: {
            type: DataType;
            updator: (p: IBuildinRenderParamMaps) => mat4;
        };
        modelViewMatrix: {
            type: DataType;
            updator: ({ mesh, camera }: {
                mesh: any;
                camera: any;
            }) => mat4;
        };
        normalViewMatrix: {
            type: DataType;
            updator: ({ mesh, camera }: {
                mesh: any;
                camera: any;
            }) => mat4;
        };
    };
    defines: {
        filterSize: {
            defineName: string;
            value: string;
        };
        blockSize: {
            defineName: string;
            value: string;
        };
    };
};
