/// <reference path="../CanvasToy.ts"/>
module CanvasToy {

    export abstract class Texture {
        glTexture: WebGLTexture;
        image: HTMLImageElement;
        textureCoord: number[] = [];
        sampler: number;
        isReadyToUpdate: boolean = false;
        constructor(
            path: string,
            public type: number = engine.gl.TEXTURE_2D,
            public format: number = engine.gl.RGBA,
            public wrapS: number = engine.gl.REPEAT,
            public wrapT: number = engine.gl.REPEAT,
            public magFilter: number = engine.gl.LINEAR,
            public minFilter: number = engine.gl.LINEAR) {
            let gl = engine.gl;
            this.glTexture = gl.createTexture();
        }
        public setUpTextureData() {

        };
    }
}
