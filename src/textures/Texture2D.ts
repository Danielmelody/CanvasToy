/// <reference path="./Texture.ts"/>

namespace CanvasToy {
    export class Texture2D extends Texture {
        constructor(
            gl: WebGLRenderingContext,
            image: HTMLImageElement,
        ) {
            super(
                gl,
                image,
            );
        }

        public setUpTextureData(gl: WebGLRenderingContext) {
            if (super.setUpTextureData(gl)) {
                gl.texImage2D(this.target, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.image);
            }
            return true;
        }
    }
}
