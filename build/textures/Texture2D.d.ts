import { Texture } from "./Texture";
export declare class Texture2D extends Texture {
    constructor(gl: WebGLRenderingContext, url?: string);
    apply(gl: WebGLRenderingContext): this;
}
