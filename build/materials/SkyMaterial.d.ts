import { Program } from "../shader/Program";
import { CubeTexture } from "../textures/CubeTexture";
import { IMaterial } from "./Material";
export declare class SkyMaterial extends IMaterial {
    cubeTexture: CubeTexture;
    constructor(gl: WebGLRenderingContext, cubeTexture: CubeTexture);
    protected initShader(gl: WebGLRenderingContext): Program;
}
