namespace CanvasToy {

    export function uniform<DecoratorClass>(name: string, type: DataType, updator?: (obj, camera) => {}) {
        return (proto, key) => {
            if (!proto.hasOwnProperty("uniforms") && !proto.uniforms) {
                Object.defineProperty(proto, "uniforms", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: [],
                });
            }
            const uniforms = proto.uniforms;
            uniforms.push({
                name,
                type,
                updator: updator ? updator : (obj: DecoratorClass) => {
                    if (obj.hasOwnProperty(key)) {
                        return obj[key];
                    }
                    return undefined;
                },
            });
        };
    }

    export function uniformArray<DecoratorClass>(name: string, type: DataType, updator?: (obj, camera) => {}) {
        return (proto, key) => {
            if (!proto.hasOwnProperty("uniformArray") && !proto.uniformArray) {
                Object.defineProperty(proto, "uniformArray", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: [],
                });
            }
            const uniformArray = proto.uniformArray;
            uniformArray.push({
                name,
                type,
                updator: updator ? updator : (obj: DecoratorClass) => {
                    if (obj.hasOwnProperty(key)) {
                        return obj[key];
                    }
                    return undefined;
                },
            });
        };
    }

    export function textureArray<DecoratorClass>(name: string) {
        return (proto, key) => {
            if (!proto.hasOwnProperty("textureArrays") && !proto.textureArrays) {
                Object.defineProperty(proto, "textureArrays", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: [],
                });
            }
            const textureArrays = proto.textureArrays;
            textureArrays.push({
                samplerArray: name,
                arrayGetter: (obj: DecoratorClass) => {
                    if (obj.hasOwnProperty(key)) {
                        return obj[key];
                    }
                    return undefined;
                },
            });
        };
    }

    export function texture<DecoratorClass>(name: string) {
        return (proto, key) => {
            readyRequire(proto, key);
            if (!proto.hasOwnProperty("textures") && !proto.textures) {
                Object.defineProperty(proto, "textures", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: [],
                });
            }
            const textures = proto.textures;
            textures.push({
                name,
                getter: (obj: DecoratorClass) => {
                    if (obj.hasOwnProperty(key)) {
                        return obj[key];
                    }
                    return undefined;
                },
            });
        };
    }

    export function linkdef(...defineNames: string[]) {
        return (proto, key) => {
            if (!proto.hasOwnProperty("defines") && !proto.defines) {
                Object.defineProperty(proto, "defines", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: {},
                });
            }
            const defines = proto.defines;
            defines[key] = (obj) => {
                if (!!obj[key]) {
                    return defineNames;
                }
                return [];
            };
        };
    }

    export function readyRequire<IAsyncResource>(proto, key) {
        if (!proto.hasOwnProperty("asyncResources") && !proto.asyncResources) {
            Object.defineProperty(proto, "asyncResources", {
                enumerable: true,
                configurable: false,
                writable: false,
                value: [],
            });
        }
        const asyncResources = proto.asyncResources;
        asyncResources.push((obj) => {
            const resources = obj[key];
            if (!!obj[key]) {
                return obj[key].asyncFinished();
            }
            return undefined;
        });
    }
}
