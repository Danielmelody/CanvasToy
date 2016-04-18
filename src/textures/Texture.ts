/// <reference path="../CanvasToy.ts"/>
module CanvasToy{

    export class Texture {
        glTexture:WebGLTexture;
        uTextureSampler:WebGLUniformLocation;
        image:HTMLImageElement;

        constructor(image: HTMLImageElement){
            this.image = image;
            let gl = engine.gl;
            this.glTexture = gl.createTexture();
            this.uTextureSampler = gl.getUniformLocation(engine.currentProgram, 'uTextureSampler');
            this.image.onload = ()=>{ this.onLoad(); }
        }

        onLoad() {
            let gl = engine.gl;
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_INT, this.image);
            gl.uniform1i(this.uTextureSampler, 0);
        }
    }
}
