import { Texture } from "./Texture";

export class CubeTexture extends Texture {

    public images: HTMLImageElement[] = [];

    private _wrapR: number;

    constructor(
        gl: WebGLRenderingContext,
        xposUrl: string,
        xnegUrl: string,
        yposUrl: string,
        ynegUrl: string,
        zposUrl: string,
        znegUrl: string,
    ) {
        super(gl);
        const image = this._image;
        this.setTarget(gl.TEXTURE_CUBE_MAP);
        this.images = [0, 0, 0, 0, 0, 0].map(() => new Image());
        this.images[0].src = xposUrl;
        this.images[1].src = xnegUrl;
        this.images[2].src = yposUrl;
        this.images[3].src = ynegUrl;
        this.images[4].src = zposUrl;
        this.images[5].src = znegUrl;
        this.setAsyncFinished(
            Promise.all(this.images.map((image) => {
                return this.createLoadPromise(image);
            })).then(() => {
                return Promise.resolve(this);
            }),
        );
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
