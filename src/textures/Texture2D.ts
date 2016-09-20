/// <reference path="./Texture.ts"/>

module CanvasToy {
    export class Texture2D extends Texture {
        constructor(
            image?: HTMLImageElement,
            format: number = gl.RGB,
            wrapS?: number,
            wrapT?: number,
            magFilter?: number,
            minFilter?: number
        ) {
            super(
                image,
                gl.TEXTURE_2D,
                format,
                wrapS,
                wrapT,
                magFilter,
                minFilter
            );
            this.glTexture = gl.createTexture();
        }

        public setUpTextureData() {
            if (super.setUpTextureData()) {
                gl.texImage2D(this.type, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.image);
            }
            return true;
        }
    }
}
