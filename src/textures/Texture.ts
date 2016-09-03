/// <reference path="../CanvasToy.ts"/>
module CanvasToy {

    export abstract class Texture {
        glTexture: WebGLTexture;
        image: HTMLImageElement;
        textureCoord: number[] = [];
        unit: number;
        isReadyToUpdate: boolean = false;
        constructor(
            path: string,
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


        };
    }
}
