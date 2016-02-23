/// <reference path="./geometries/Geometry.ts"/>
/// <reference path="./materials/material.ts"/>
/// <reference path="./LogicNode.ts"/>
/// <reference path="./Drawable.ts"/>

module CanvasToy{

    export class Mesh extends LogicNode implements Drawable{

        protected geometry:Geometry;

        protected material:Material;

        constructor(){
            super();
        }

        draw(gl, camera:Camera){
            super.draw(gl, camera);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(this.geometry.vertices),
                gl.STATIC_DRAW
            );
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.geometry.vertices.length);
        }


    }
}
