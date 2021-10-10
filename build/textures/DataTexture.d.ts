import { Texture } from "./Texture";
export declare class DataTexture<TypeArray extends ArrayBufferView> extends Texture {
    width: number;
    height: number;
    private data;
    constructor(gl: WebGLRenderingContext, data: TypeArray, width?: number, height?: number);
    resetData(gl: WebGLRenderingContext, data: TypeArray, width?: number, height?: number): this;
    apply(gl: WebGLRenderingContext): this;
}
