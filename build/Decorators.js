export var RENDER_PARAM_HOLDER = "renderParams";
function tryAddParamHolder(proto) {
    if (proto.hasOwnProperty(RENDER_PARAM_HOLDER)) {
        return;
    }
    var params = proto[RENDER_PARAM_HOLDER];
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
export function structure(name) {
    return function (constructor) {
        tryAddParamHolder(constructor.prototype);
        constructor.prototype[RENDER_PARAM_HOLDER].customPrefix = name + ".";
    };
}
export function uniform(type, name) {
    return function (proto, key) {
        tryAddParamHolder(proto);
        var uniforms = proto[RENDER_PARAM_HOLDER].uniforms || {};
        uniforms[key] = { name: name, type: type };
        proto[RENDER_PARAM_HOLDER].uniforms = uniforms;
    };
}
export function bindUniformGetter(name, type, getter) {
    return function (constructor) {
        var proto = constructor.prototype;
        tryAddParamHolder(proto);
        var uniforms = proto[RENDER_PARAM_HOLDER].uniforms || {};
        uniforms[name] = { type: type, updator: getter };
        proto[RENDER_PARAM_HOLDER].uniforms = uniforms;
    };
}
export function uniformArray(type, name) {
    return function (proto, key) {
        tryAddParamHolder(proto);
        var uArray = proto[RENDER_PARAM_HOLDER].uArray || {};
        uArray[key] = { name: name, type: type };
        proto[RENDER_PARAM_HOLDER].uArray = uArray;
    };
}
export function texture(name) {
    return function (proto, key) {
        readyRequire(proto, key);
        tryAddParamHolder(proto);
        var textures = proto[RENDER_PARAM_HOLDER].textures || {};
        textures[key] = { name: name };
        proto[RENDER_PARAM_HOLDER].textures = textures;
    };
}
export function textureArray(name) {
    return function (proto, key) {
        tryAddParamHolder(proto);
        var textureArrays = proto[RENDER_PARAM_HOLDER].textureArrays || {};
        textureArrays[key] = { name: name };
        proto[RENDER_PARAM_HOLDER].textureArrays = textureArrays;
    };
}
export function arrayOfStructures(name) {
    return function (proto, key) {
        tryAddParamHolder(proto);
        var structArrays = proto[RENDER_PARAM_HOLDER].structArrays || {};
        structArrays[key] = { name: name };
        proto[RENDER_PARAM_HOLDER].structArrays = structArrays;
    };
}
export function define(defineName, useValue) {
    if (useValue === void 0) { useValue = false; }
    return function (proto, key) {
        tryAddParamHolder(proto);
        var defines = proto[RENDER_PARAM_HOLDER].defines || {};
        defines[key] = { defineName: defineName, useValue: useValue };
        proto[RENDER_PARAM_HOLDER].defines = defines;
    };
}
export function ifdefine(defineName) {
    return function (proto, key) {
        tryAddParamHolder(proto);
        var paramFilters = proto[RENDER_PARAM_HOLDER].paramFilters || {};
        paramFilters[key] = { name: defineName, filter: function () { return true; } };
        proto[RENDER_PARAM_HOLDER].paramFilters = paramFilters;
    };
}
export function ifequal(defineName, defineValue) {
    return function (proto, key) {
        tryAddParamHolder(proto);
        var paramFilters = proto[RENDER_PARAM_HOLDER].paramFilters || {};
        paramFilters[key] = { name: defineName, filter: function (value) { return value === defineValue; } };
        proto[RENDER_PARAM_HOLDER].paramFilters = paramFilters;
    };
}
export function ifgreat(defineName, defineValue) {
    return function (proto, key) {
        tryAddParamHolder(proto);
        var paramFilters = proto[RENDER_PARAM_HOLDER].paramFilters || {};
        paramFilters[key] = { name: defineName, filter: function (value) { return value > defineValue; } };
        proto[RENDER_PARAM_HOLDER].paramFilters = paramFilters;
    };
}
export function readyRequire(proto, key) {
    var asyncResources = proto.asyncResources || [];
    if (!proto.hasOwnProperty("asyncResources")) {
        delete proto.asyncResources;
        Object.defineProperty(proto, "asyncResources", {
            enumerable: true,
            configurable: false,
            writable: false,
            value: asyncResources,
        });
    }
    asyncResources.push(function (obj) {
        var resources = obj[key];
        if (!!obj[key]) {
            return obj[key].asyncFinished();
        }
        return undefined;
    });
    proto.asyncResources = asyncResources;
}
//# sourceMappingURL=Decorators.js.map