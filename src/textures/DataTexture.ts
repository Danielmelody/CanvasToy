/// <reference path="./Texture2D.ts"/>

namespace CanvasToy {
    export class DataTexture<TypeArray extends ArrayBufferView> extends Texture {

        public width: number;
        public height: number;

        private data: TypeArray;

        constructor(gl: WebGLRenderingContext, data: TypeArray, width: number = 16, height: number = 16) {
            super(gl);
            this.data = data;
            this.width = width;
            this.height = height;
        }

        public resetData(gl: WebGLRenderingContext, data: TypeArray, width?: number, height?: number) {
            this.data = data;
            this.width = width ? width : this.width;
            this.height = height ? height : this.height;
            this.bindTextureData(gl);
            return this;
        }

        public bindTextureData(gl: WebGLRenderingContext) {
            gl.bindTexture(this.target, this.glTexture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.bindTexture(this.target, this.glTexture);
            gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, this.wrapS);
            gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, this.wrapT);
            gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, this.magFilter);
            gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, this.minFilter);
            super.bindTextureData(gl);
            gl.texImage2D(
                this.target,
                0,
                this.format,
                this.width,
                this.height,
                0,
                this.format,
                this.type,
                this.data,
            );
            gl.bindTexture(this.target, null);
            return this;
        }
    }
}
