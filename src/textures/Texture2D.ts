/// <reference path="./Texture.ts"/>

namespace CanvasToy {
    export class Texture2D extends Texture {
        constructor(
            image: HTMLImageElement,
            format: number = gl.RGB,
            wrapS: number = gl.CLAMP_TO_EDGE,
            wrapT: number = gl.CLAMP_TO_EDGE,
            magFilter: number = gl.NEAREST,
            minFilter: number = gl.NEAREST,
        ) {
            super(
                image,
                gl.TEXTURE_2D,
                format,
                wrapS,
                wrapT,
                magFilter,
                minFilter,
            );
        }

        public setUpTextureData() {
            if (super.setUpTextureData()) {
                gl.texImage2D(this.type, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.image);
            }
            return true;
        }
    }
}
