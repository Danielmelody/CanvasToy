import { vec2 } from "gl-matrix";
import { Program } from "../../shader/Program";
import { Texture } from "../../textures/Texture";
import { IMaterial } from "../Material";
export declare class PCSSFilteringMaterial extends IMaterial {
    origin: Texture;
    blurDirection: vec2;
    blurStep: number;
    protected initShader(gl: WebGLRenderingContext): Program;
}
