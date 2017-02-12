namespace CanvasToy {

    export function uniform<DecoratorClass>(name: string, type: DataType, updator?: (obj, camera) => {}) {
        return (proto, key) => {
            if (!proto.hasOwnProperty("uniforms")) {
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
                    return obj[key];
                },
            });
        };
    }

    export function readyRequire<IAsyncResource>(proto, key) {
        if (!proto.hasOwnProperty("asyncResources")) {
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
