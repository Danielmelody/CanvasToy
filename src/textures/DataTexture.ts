import { Texture } from "./Texture";

export class DataTexture<TypeArray extends ArrayBufferView> extends Texture {
    public width: number;
    public height: number;

    private data: TypeArray;

    constructor(gl: WebGLRenderingContext, data: TypeArray, width: number = 16, height: number = 16) {
        super(gl);
        this.data = data;
        this.width = width;
        this.height = height;
    }

    public resetData(gl: WebGLRenderingContext, data: TypeArray, width?: number, height?: number) {
        this.data = data;
        this.width = width ? width : this.width;
        this.height = height ? height : this.height;
        this.apply(gl);
        return this;
    }

    public apply(gl: WebGLRenderingContext) {
        super.apply(gl);
        gl.texImage2D(
            this.target,
            0,
            this.format,
            this.width,
            this.height,
            0,
            this.format,
            this.type,
            this.data,
        );
        return this;
    }
}
