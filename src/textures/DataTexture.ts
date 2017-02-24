/// <reference path="./Texture2D.ts"/>

namespace CanvasToy {
    export class DataTexture<TypeArray extends ArrayBufferView> extends Texture {

        public readonly width: number;
        public readonly height: number;

        private data: TypeArray;

        constructor(gl: WebGLRenderingContext, data: TypeArray, width: number, height: number) {
            super(gl);
            this.data = data;
            this.width = width;
            this.height = height;
            this.setAsyncFinished(Promise.resolve(this));
            if (data instanceof Float32Array) {
                this.setType(gl.FLOAT);
            }
            if (data instanceof Uint32Array) {
                this.setType(gl.UNSIGNED_INT);
            }
        }

        public resetData(gl: WebGLRenderingContext, data: TypeArray) {
            this.data = data;
            gl.texImage2D(
                this.target,
                0,
                this.format,
                this.width,
                0,
                this.height,
                this.format,
                this.type,
                this.data,
            );
            return this;
        }

        public setUpTextureData(gl: WebGLRenderingContext) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.bindTexture(this.target, this.glTexture);
            gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, this.wrapS);
            gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, this.wrapT);
            gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, this.magFilter);
            gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, this.minFilter);
            super.setUpTextureData(gl);
            gl.texImage2D(
                this.target,
                0,
                this.format,
                this.width,
                0,
                this.height,
                this.format,
                this.type,
                this.data,
            );
            return this;
        }
    }
}
