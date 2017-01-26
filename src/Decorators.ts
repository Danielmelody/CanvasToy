namespace CanvasToy {

    export function uniform<DecoratorClass>(name: string, type: DataType, updator?: (obj, camera) => {}) {
        return (proto, key) => {
            proto.uniforms = proto.uniforms || [];
            proto.uniforms.push({
                name,
                type,
                updator: updator ? updator : (obj: DecoratorClass) => {
                    return obj[key];
                },
            });
        };
    }
}
