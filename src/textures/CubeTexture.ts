/// <reference path="./Texture.ts"/>

module CanvasToy {
    export class CubeTexture extends Texture {
        xneg: HTMLImageElement;
        xpos: HTMLImageElement;
        yneg: HTMLImageElement;
        ypos: HTMLImageElement;
        zneg: HTMLImageElement;
        zpos: HTMLImageElement;

        private count: number = 6;

        constructor(
            xnegPath: string,
            xposPath: string,
            ynegPath: string,
            yposPath: string,
            znegPath: string,
            zposPath: string,
            wrapS?: number,
            wrapT?: number,
            magFilter?: number,
            minFilter?: number
        ) {
            super(
                null,
                engine.gl.TEXTURE_CUBE_MAP,
                wrapS,
                wrapT,
                magFilter,
                minFilter
            );
            this.xneg = new Image();
            this.xneg.src = xnegPath;
            this.xneg.onload = this.onLoad;

            this.xpos = new Image();
            this.xpos.src = xnegPath;
            this.xpos.onload = this.onLoad;

            this.yneg = new Image();
            this.yneg.src = ynegPath;
            this.yneg.onload = this.onLoad;

            this.ypos = new Image();
            this.ypos.src = ynegPath;
            this.ypos.onload = this.onLoad;

            this.zneg = new Image();
            this.zneg.src = ynegPath;
            this.zneg.onload = this.onLoad;

            this.zpos = new Image();
            this.zpos.src = ynegPath;
            this.zpos.onload = this.onLoad;
        }

        private onLoad() {
            this.count--;
            if (this.count == 0) {
                this.isReadyToUpdate = true;
            }
        }

        public setUpTextureData() {
            super.setUpTextureData();
            let gl = engine.gl;
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.xneg);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.xpos);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.yneg);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.ypos);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.zneg);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.zpos);
        }
    }
}
