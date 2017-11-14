import { DataType } from "./DataTypeEnum";
import { IBuildinRenderParamMaps, IRenderParamHolder, IUniform } from "./shader/Program";

export const RENDER_PARAM_HOLDER = "renderParams";

function tryAddParamHolder(proto) {
    if (proto.hasOwnProperty(RENDER_PARAM_HOLDER)) {
        return;
    }
    let params: IRenderParamHolder = proto[RENDER_PARAM_HOLDER];
    if (params === undefined) {
        params = {};
    }
    delete proto[RENDER_PARAM_HOLDER];
    Object.defineProperty(proto, RENDER_PARAM_HOLDER, {
        enumerable: true,
        configurable: false,
        writable: false,
        value: params,
    });
}

export function uniform(type: DataType, name?: string) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const uniforms = proto[RENDER_PARAM_HOLDER].uniforms || {};
        uniforms[key] = { name, type };
        proto[RENDER_PARAM_HOLDER].uniforms = uniforms;
    };
}

export function bindUniformGetter(name: string, type: DataType, getter: (p: IBuildinRenderParamMaps) => any) {
    return (constructor) => {
        const proto = constructor.prototype;
        tryAddParamHolder(proto);
        const uniforms = proto[RENDER_PARAM_HOLDER].uniforms || {};
        uniforms[name] = { type, updator: getter };
        proto[RENDER_PARAM_HOLDER].uniforms = uniforms;
    };
}

export function uniformArray<DecoratorClass>(type: DataType, name?: string) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const uniformArray = proto[RENDER_PARAM_HOLDER].uniformArray || {};
        uniformArray[key] = { name, type };
        proto[RENDER_PARAM_HOLDER].uniformArray = uniformArray;
    };
}

export function texture<DecoratorClass>(name?: string) {
    return (proto, key) => {
        readyRequire(proto, key);
        tryAddParamHolder(proto);
        const textures = proto[RENDER_PARAM_HOLDER].textures || {};
        textures[key] = { name };
        proto[RENDER_PARAM_HOLDER].textures = textures;
    };
}

export function textureArray<DecoratorClass>(name?: string) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const textureArrays = proto[RENDER_PARAM_HOLDER].textureArrays || {};
        textureArrays[key] = { name };
        proto[RENDER_PARAM_HOLDER].textureArrays = textureArrays;
    };
}

export function arrayOfStructures(name?: string) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const structArrays = proto[RENDER_PARAM_HOLDER].structArrays || {};
        structArrays[key] = { name };
        proto[RENDER_PARAM_HOLDER].structArrays = structArrays;
    };
}

export function define(defineName: string, useValue = false) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const defines = proto[RENDER_PARAM_HOLDER].defines || {};
        defines[key] = { defineName, useValue };
        proto[RENDER_PARAM_HOLDER].defines = defines;
    };
}

export function ifdefine(defineName: string) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const defineLinks = proto[RENDER_PARAM_HOLDER].defineLinks || {};
        defineLinks[key] = defineName;
        proto[RENDER_PARAM_HOLDER].defineLinks = defineLinks;
    };
}

export function readyRequire<IAsyncResource>(proto, key) {
    const asyncResources = proto.asyncResources || [];
    if (!proto.hasOwnProperty("asyncResources")) {
        delete proto.asyncResources;
        Object.defineProperty(proto, "asyncResources", {
            enumerable: true,
            configurable: false,
            writable: false,
            value: asyncResources,
        });
    }
    asyncResources.push((obj) => {
        const resources = obj[key];
        if (!!obj[key]) {
            return obj[key].asyncFinished();
        }
        return undefined;
    });
    proto.asyncResources = asyncResources;
}
