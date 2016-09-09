/// <reference path="../CanvasToy.ts"/>
module CanvasToy {

    export abstract class Texture {
        public glTexture: WebGLTexture;
        public textureCoord: number[] = [];
        public unit: number;
        public dataCompleted: boolean = false;
        public isReadyToUpdate: boolean = false;
        constructor(
            public image?: HTMLImageElement,
            public type: number = engine.gl.TEXTURE_2D,
            public format: number = engine.gl.RGB,
            public wrapS: number = engine.gl.CLAMP_TO_EDGE,
            public wrapT: number = engine.gl.CLAMP_TO_EDGE,
            public magFilter: number = engine.gl.NEAREST,
            public minFilter: number = engine.gl.NEAREST) {
            let gl = engine.gl;
            this.glTexture = gl.createTexture();
        }
        public setUpTextureData() {
            if (this.dataCompleted) {
                return false;
            }
            this.dataCompleted = true;
            return true;
        };
    }
}
