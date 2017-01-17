/// <reference path="../CanvasToy.ts"/>

namespace CanvasToy {
    export class Texture {
        public glTexture: WebGLTexture;
        public textureCoord: number[] = [];
        public unit: number;
        public dataCompleted: boolean = false;
        public isReadyToUpdate: boolean = false;
        public image?: HTMLImageElement;
        public target: number;
        public format: number;
        public wrapS: number;
        public wrapT: number;
        public magFilter: number;
        public minFilter: number;
        public type: number;
        constructor(
            gl: WebGLRenderingContext,
            image?: HTMLImageElement,
        ) {
            this.target = gl.TEXTURE_2D;
            this.format = gl.RGB;
            this.wrapS = gl.CLAMP_TO_EDGE;
            this.wrapT = gl.CLAMP_TO_EDGE;
            this.magFilter = gl.NEAREST;
            this.minFilter = gl.NEAREST;
            this.type = gl.UNSIGNED_BYTE;
            this.glTexture = gl.createTexture();
            this.image = image;
        }
        public setUpTextureData(gl: WebGLRenderingContext) {
            if (this.dataCompleted) {
                return false;
            }
            this.dataCompleted = true;
            return true;
        }
    }
}
