/// <reference path="../CanvasToy.ts"/>
module CanvasToy {

    export class Texture {
        glTexture: WebGLTexture;
        image: HTMLImageElement;
        textureCoord: number[] = [];
        sampler: number;
        isReadyToUpdate: boolean = false;

        constructor(path: string, customOnLoad?: () => void) {
            this.image = new Image();
            let gl = engine.gl;
            this.glTexture = gl.createTexture();
            this.image.src = path;
            this.image.onload = () => {
                this.isReadyToUpdate = true;
                console.log("texture loaded");
            }
        }
    }
}
