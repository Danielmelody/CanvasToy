/// <reference path="../CanvasToy.ts"/>
module CanvasToy{

    export class Texture {
        glTexture:WebGLTexture;
        image:HTMLImageElement;
        textureCoord:number[];
        sampler:number;
        active:boolean;

        constructor(path:string, customOnLoad?:()=>void){
            this.active = false;
            this.image = new Image();
            let gl = engine.gl;
            this.glTexture = gl.createTexture();
            engine.preloadRes.push(this);
            this.image.src = path;
            this.image.onload = ()=>{
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);  

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
                this.active = true;

                engine.preloadRes.splice(engine.preloadRes.indexOf(this, 1));

                if (customOnLoad){
                    customOnLoad();
                }
                console.log("texture loaded");
            }
        }
    }
}
