/// <reference path="./Texture.ts"/>

module CanvasToy {
    export class Texture2D extends Texture {
        constructor(
            path: string,
            public format: number = engine.gl.RGB,
            wrapS?: number,
            wrapT?: number,
            magFilter?: number,
            minFilter?: number
        ) {
            super(
                path,
                engine.gl.TEXTURE_2D,
                format,
                wrapS,
                wrapT,
                magFilter,
                minFilter
            );
            this.image = new Image();
            let gl = engine.gl;
            this.glTexture = gl.createTexture();
            this.image.src = path;
            let lastOnload = this.image.onload;
            this.image.onload = (ev:Event) => {
                if (!!lastOnload) {
                    lastOnload.apply(this.image, ev);
                }
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
