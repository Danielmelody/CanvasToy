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
            super.setUpTextureData(gl);
            gl.texImage2D(this.target, 0, this.format, this.format, this.type, this.image);
        }
    }
}
