import { vec4 } from "gl-matrix";
import { Program } from "../shader/Program";
export declare let colors: {
    black: vec4;
    gray: vec4;
    red: vec4;
    white: vec4;
};
export declare abstract class IMaterial {
    name: string;
    defines: string[];
    shader: Program;
    protected gl: WebGLRenderingContext;
    constructor(gl: WebGLRenderingContext);
    protected abstract initShader(gl: WebGLRenderingContext): Program;
}
