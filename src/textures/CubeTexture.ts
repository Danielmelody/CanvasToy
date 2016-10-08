/// <reference path="./Texture.ts"/>

namespace CanvasToy {
    export class CubeTexture extends Texture {


        private count: number = 6;

        constructor(
            public xneg: HTMLImageElement,
            public xpos: HTMLImageElement,
            public yneg: HTMLImageElement,
            public ypos: HTMLImageElement,
            public zneg: HTMLImageElement,
            public zpos: HTMLImageElement,
            wrapS?: number,
            wrapT?: number,
            magFilter?: number,
            minFilter?: number
        ) {
            super(
                null,
                gl.TEXTURE_CUBE_MAP,
                wrapS,
                wrapT,
                magFilter,
                minFilter
            );
            this.xneg.onload = this.onLoad;
            this.xpos.onload = this.onLoad;
            this.yneg.onload = this.onLoad;
            this.ypos.onload = this.onLoad;
            this.zneg.onload = this.onLoad;
            this.zpos.onload = this.onLoad;
        }

        private onLoad() {
            this.count--;
            if (this.count == 0) {
                this.isReadyToUpdate = true;
            }
        }

        public setUpTextureData() {
            if (super.setUpTextureData()) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.xneg);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.xpos);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.yneg);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.ypos);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.zneg);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.zpos);
            }
            return true;
        }
    }
}
