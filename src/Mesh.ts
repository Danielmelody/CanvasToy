/// <reference path="./geometries/Geometry.ts"/>
/// <reference path="./materials/material.ts"/>
/// <reference path="./RenderNode.ts"/>

module CanvasToy{

    export class Mesh extends RenderNode{

        protected geometry:Geometry;

        protected material:Material;

        constructor(gl:WebGLRenderingContext){
            super(gl);
        }

        draw(camera:Camera){
            super.draw(camera);
            this.gl.bufferData(
                this.gl.ARRAY_BUFFER,
                new Float32Array(this.geometry.vertices),
                this.gl.STATIC_DRAW
            );
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.geometry.vertices.length);
        }


    }
}
