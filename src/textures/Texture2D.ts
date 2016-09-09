/// <reference path="./Texture.ts"/>

module CanvasToy {
    export class Texture2D extends Texture {
        constructor(
            image?: HTMLImageElement,
            format: number = engine.gl.RGB,
            wrapS?: number,
            wrapT?: number,
            magFilter?: number,
            minFilter?: number
        ) {
            super(
                image,
                engine.gl.TEXTURE_2D,
                format,
                wrapS,
                wrapT,
                magFilter,
                minFilter
            );
            let gl = engine.gl;
            this.glTexture = gl.createTexture();
        }

        public setUpTextureData() {
            if (super.setUpTextureData()) {
                engine.gl.texImage2D(this.type, 0, this.format, this.format, engine.gl.UNSIGNED_BYTE, this.image);
            }
            return true;
        }
    }
}
