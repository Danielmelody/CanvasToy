/// <reference path="./Texture.ts"/>

module CanvasToy {
    export class Texture2D extends Texture {
        constructor(
            path: string,
            public format,
            wrapS?: number,
            wrapT?: number,
            magFilter?: number,
            minFilter?: number
        ) {
            super(
                null,
                engine.gl.TEXTURE_2D,
                wrapS,
                wrapT,
                magFilter,
                minFilter
            );
            this.image = new Image();
            let gl = engine.gl;
            this.glTexture = gl.createTexture();
            this.image.src = path;
            this.image.onload = () => {
                this.isReadyToUpdate = true;
                console.log("texture loaded");
            }
        }

        public setUpTextureData() {
            super.setUpTextureData();
            engine.gl.texImage2D(this.type, 0, this.format, this.format, engine.gl.UNSIGNED_BYTE, this.image);
        }
    }
}
