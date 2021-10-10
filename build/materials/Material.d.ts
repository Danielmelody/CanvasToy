import { Program } from "../shader/Program";
export declare let colors: {
    black: any;
    gray: any;
    red: any;
    white: any;
};
export declare abstract class IMaterial {
    name: string;
    defines: string[];
    shader: Program;
    protected gl: WebGLRenderingContext;
    constructor(gl: WebGLRenderingContext);
    protected abstract initShader(gl: WebGLRenderingContext): Program;
}
