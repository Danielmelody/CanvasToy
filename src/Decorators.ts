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

    export function loadTexture<Material>(proto, key) {
        if (!proto.hasOwnProperty("textures")) {
            Object.defineProperty(proto, "textures", {
                enumerable: true,
                configurable: false,
                writable: false,
                value: new Array<(obj) => Texture>(),
            });
        }
        const textures = proto.textures;
        textures.push((obj) => obj[key]);
    }
}
