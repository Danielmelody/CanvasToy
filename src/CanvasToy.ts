module CanvasToy {
    var version = 2;
    export var engine: Renderer;
    export var gl: WebGLRenderingContext = null;
    export var debug: boolean = true;
    export interface Vec2Array extends GLM.IArray { }
    export interface Vec3Array extends GLM.IArray { }
    export interface Vec4Array extends GLM.IArray { }
    export interface Mat2Array extends GLM.IArray { }
    export interface Mat2dArray extends GLM.IArray { }
    export interface Mat3Array extends GLM.IArray { }
    export interface Mat4Array extends GLM.IArray { }
    export interface QuatArray extends GLM.IArray { }

    export enum DataType {
        float,
        int,
        vec2,
        vec3,
        vec4,
        mat2,
        mat3,
        mat4
    }
}
