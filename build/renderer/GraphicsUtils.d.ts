import { Geometry } from "../geometries/Geometry";
import { IRenderParamHolder } from "../shader/Program";
export declare namespace Graphics {
    function getRenderParamHost(obj: any, logError?: boolean): IRenderParamHolder;
    function copyDataToVertexBuffer(gl: WebGLRenderingContext, geometry: Geometry): void;
    function logEnabledAttribute(gl: WebGLRenderingContext, program: WebGLProgram): void;
    function logIfFrameBufferInvalid(gl: WebGLRenderingContext, frameBuffer: WebGLFramebuffer): boolean;
    function initWebwebglContext(canvas: any, debug?: boolean): WebGLRenderingContext;
    function createEntileShader(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram;
}
