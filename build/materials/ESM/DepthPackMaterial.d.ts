import { Program } from "../../shader/Program";
import { IMaterial } from "../Material";
export declare class LinearDepthPackMaterial extends IMaterial {
    protected initShader(gl: WebGLRenderingContext): Program;
}
