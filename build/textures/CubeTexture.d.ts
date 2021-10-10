import { Texture } from "./Texture";
export declare class CubeTexture extends Texture {
    images: HTMLImageElement[];
    private _wrapR;
    constructor(gl: WebGLRenderingContext, urls?: {
        xpos: string;
        xneg: string;
        ypos: string;
        yneg: string;
        zpos: string;
        zneg: string;
    });
    get wrapR(): number;
    setWrapR(_wrapR: number): this;
    apply(gl: WebGLRenderingContext): this;
    applyForRendering(gl: WebGLRenderingContext, width: any, height: any): this;
    private createLoadPromise;
}
