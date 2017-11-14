import { Texture } from "./Texture";

export class Texture2D extends Texture {
    constructor(
        gl: WebGLRenderingContext,
        url?: string,
    ) {
        super(
            gl,
            url,
        );
    }

    public apply(gl: WebGLRenderingContext) {
        super.apply(gl);
        gl.texImage2D(this.target, 0, this.format, this.format, this.type, this.image);
        return this;
    }
}
