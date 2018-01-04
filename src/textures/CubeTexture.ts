import { Texture } from "./Texture";

export class CubeTexture extends Texture {

    public images: HTMLImageElement[] = [];

    private _wrapR: number;

    constructor(
        gl: WebGLRenderingContext,
        urls?: {
            xpos: string,
            xneg: string,
            ypos: string,
            yneg: string,
            zpos: string,
            zneg: string,
        },
    ) {
        super(gl);
        const image = this._image;
        this.setTarget(gl.TEXTURE_CUBE_MAP);
        if (!!urls) {
            this.images = [0, 0, 0, 0, 0, 0].map(() => new Image());
            this.images[0].src = urls.xpos;
            this.images[1].src = urls.xneg;
            this.images[2].src = urls.ypos;
            this.images[3].src = urls.yneg;
            this.images[4].src = urls.zpos;
            this.images[5].src = urls.zneg;
            this.setAsyncFinished(
                Promise.all(this.images.map((image) => {
                    return this.createLoadPromise(image);
                })).then(() => {
                    return Promise.resolve(this);
                }),
            );
        }
    }

    public get wrapR() {
        return this._wrapR;
    }

    public setWrapR(_wrapR: number) {
        this._wrapR = _wrapR;
        return this;
    }

    public apply(gl: WebGLRenderingContext) {
        super.apply(gl);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        for (let i = 0; i < this.images.length; ++i) {
            gl.texImage2D(
                gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                0,
                this.format,
                this.format,
                this.type,
                this.images[i],
            );
        }
        return this;
    }

    public applyForRendering(gl: WebGLRenderingContext, width, height) {
        super.apply(gl);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        for (let i = 0; i < 6; ++i) {
            gl.texImage2D(
                gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                0,
                this.format,
                width,
                height,
                0,
                this.format,
                this.type,
                null,
            );
        }
        return this;
    }

    private createLoadPromise(image: HTMLImageElement) {
        return new Promise((resolve, reject) => {
            if (!image) {
                resolve(this);
            } else {
                image.onload = () => resolve(this);
                image.onerror = () => reject(this);
            }
        });
    }
}
