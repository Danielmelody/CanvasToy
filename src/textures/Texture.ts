/// <reference path="../CanvasToy.ts"/>

namespace CanvasToy {
    export class Texture {
        public glTexture: WebGLTexture;
        public textureCoord: number[] = [];
        public unit: number;
        public dataCompleted: boolean = false;
        public isReadyToUpdate: boolean = false;
        public image?: HTMLImageElement;
        public type: number;
        public format: number;
        public wrapS: number;
        public wrapT: number;
        public magFilter: number;
        public minFilter: number;
        constructor(
            image?: HTMLImageElement,
            type: number = gl.TEXTURE_2D,
            format: number = gl.RGB,
            wrapS: number = gl.CLAMP_TO_EDGE,
            wrapT: number = gl.CLAMP_TO_EDGE,
            magFilter: number = gl.NEAREST,
            minFilter: number = gl.NEAREST) {
            this.image = image;
            this.type = type;
            this.format = format;
            this.wrapS = wrapS;
            this.wrapT = wrapT;
            this.magFilter = magFilter;
            this.minFilter = minFilter;
            this.glTexture = gl.createTexture();
        }
        public setUpTextureData() {
            if (this.dataCompleted) {
                return false;
            }
            this.dataCompleted = true;
            return true;
        }
    }
}
