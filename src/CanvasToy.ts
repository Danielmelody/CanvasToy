namespace CanvasToy {

    export let debug: boolean = true;
    export type Vec2Array = GLM.IArray;
    export type Vec3Array = GLM.IArray;
    export type Vec4Array = GLM.IArray;
    export type Mat2Array = GLM.IArray;
    export type Mat2dArray = GLM.IArray;
    export type Mat3Array = GLM.IArray;
    export type Mat4Array = GLM.IArray;
    export type QuatArray = GLM.IArray;

    export enum DataType {
        float,
        int,
        vec2,
        vec3,
        vec4,
        mat2,
        mat3,
        mat4,
    }

    export const resourcesCache = {};
}
