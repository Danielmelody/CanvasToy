import { DataType } from "./DataTypeEnum";
import { IBuildinRenderParamMaps, IRenderParamHolder } from './shader/Program';

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

/**
 * A property decorator. Treat property as an uniform parameter for rendering. If not provided,
 * the name of the property will be uniform name to find in shader by default,
 * otherwise will use the given name
 */
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

/**
 * A property decorator. Treat property as an array of uniform for rendering.
 * The array in shader must be declared as ${name}[${name}Num], if not provided,
 * the name of the property will be array name to find in shader by default, otherwise will use the given name
 */
export function uniformArray<DecoratorClass>(type: DataType, name?: string) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const uniformArray = proto[RENDER_PARAM_HOLDER].uniformArray || {};
        uniformArray[key] = { name, type };
        proto[RENDER_PARAM_HOLDER].uniformArray = uniformArray;
    };
}

/**
 * A property decorator. Treat property as a texture parameter for rendering. If not provided,
 * the name of the property will be the uniform sampler name to find in shader by default,
 * otherwise will use the given name
 */
export function texture<DecoratorClass>(name?: string) {
    return (proto, key) => {
        readyRequire(proto, key);
        tryAddParamHolder(proto);
        const textures = proto[RENDER_PARAM_HOLDER].textures || {};
        textures[key] = { name };
        proto[RENDER_PARAM_HOLDER].textures = textures;
    };
}

/**
 * A property decorator. Treat property as an array of texture for rendering. The array in shader must
 * be declared as ${name}[${name}Num], if not provided, the name of the property will be sampler
 * array name to find in shader by default, otherwise will use the given name
 */
export function textureArray<DecoratorClass>(name?: string) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const textureArrays = proto[RENDER_PARAM_HOLDER].textureArrays || {};
        textureArrays[key] = { name };
        proto[RENDER_PARAM_HOLDER].textureArrays = textureArrays;
    };
}

/**
 * A property decorator. Treat property as an array of structures(AoS) for rendering.
 * The array in shader must be declared as ${name}[${name}Num]
 * the name of the property will be array name to find in shader by default, otherwise will use the given name
 */
export function arrayOfStructures(name?: string) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const structArrays = proto[RENDER_PARAM_HOLDER].structArrays || {};
        structArrays[key] = { name };
        proto[RENDER_PARAM_HOLDER].structArrays = structArrays;
    };
}

/**
 * A property decorator to control if add define statement at the start of the shader
 * @param defineName name after #define
 * @param useValue Whether use property value as the define value after name
 */
export function define(defineName: string, useValue = false) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const defines = proto[RENDER_PARAM_HOLDER].defines || {};
        defines[key] = { defineName, useValue };
        proto[RENDER_PARAM_HOLDER].defines = defines;
    };
}

/**
 * A property decorator to control if pass property value to shader or not,
 * by auto detect if the given name defined inside shader source
 */
export function ifdefine(defineName: string) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const paramFilters = (proto[RENDER_PARAM_HOLDER] as IRenderParamHolder).paramFilters || {};
        paramFilters[key] = { name: defineName, filter: () => true };
        proto[RENDER_PARAM_HOLDER].paramFilters = paramFilters;
    };
}

/**
 * A property decorator to control if pass property value to shader or not,
 * by auto detect if the define value equal to the given value
 */
export function ifequal(defineName: string, defineValue: string) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const paramFilters = (proto[RENDER_PARAM_HOLDER] as IRenderParamHolder).paramFilters || {};
        paramFilters[key] = { name: defineName, filter: (value) => value === defineValue };
        proto[RENDER_PARAM_HOLDER].paramFilters = paramFilters;
    };
}

/**
 * A property decorator to control if pass property value to shader or not,
 * by auto detect if the define value less to the given value
 */
export function ifgreat(defineName: string, defineValue: string) {
    return (proto, key) => {
        tryAddParamHolder(proto);
        const paramFilters = (proto[RENDER_PARAM_HOLDER] as IRenderParamHolder).paramFilters || {};
        paramFilters[key] = { name: defineName, filter: (value) => value > defineValue };
        proto[RENDER_PARAM_HOLDER].paramFilters = paramFilters;
    };
}

/**
 * A property decorator. Mark the property as an async resource
 * A async resource is only available when the promise it's method asyncFinished returned resolved
 */
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
