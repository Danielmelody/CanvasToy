/// <reference path="./Texture.ts"/>

namespace CanvasToy {
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

        public setUpTextureData(gl: WebGLRenderingContext) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.bindTexture(this.target, this.glTexture);
            gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, this.wrapS);
            gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, this.wrapT);
            gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, this.magFilter);
            gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, this.minFilter);
            super.setUpTextureData(gl);
            gl.texImage2D(this.target, 0, this.format, this.format, this.type, this.image);
        }

        public asyncFinished() {
            const image = this._image;
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
}
