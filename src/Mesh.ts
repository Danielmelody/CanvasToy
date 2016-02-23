/// <reference path="./geometries/Geometry.ts"/>
/// <reference path="./materials/material.ts"/>
/// <reference path="./RenderNode.ts"/>

module CanvasToy{

    export class Mesh extends RenderNode{

        protected geometry:Geometry;

        protected material:Material;

        constructor(){
            super();
        }

        draw(gl, camera:Camera){
            super.draw(camera);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(this.geometry.vertices),
                gl.STATIC_DRAW
            );
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.geometry.vertices.length);
        }


    }
}
