/// <reference path="./geometries/Geometry.ts"/>
/// <reference path="./materials/Material.ts"/>
/// <reference path="./Node.ts"/>

module CanvasToy{

    export class Mesh extends Node{

        protected colors:Array<number> = [];

        protected indexBuffer:VertexBuffer;
        protected vertexBuffers:VertexBuffer[] = [];


        constructor(protected geometry:Geometry,protected material:Material) {
            super();
        }

        addAttribute(name:string) {
            this.vertexBuffers.push(new VertexBuffer(name));
        }

        updateAttributesBuffer(){
            for (let vertexBuffer of this.vertexBuffers) {
                let gl = engine.gl;
                gl.enableVertexAttribArray(gl.getAttribLocation(engine.currentProgram, vertexBuffer.name));
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.data);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexBuffer.data), engine.gl.STATIC_DRAW);
            }
        };

        draw(camera:Camera){
            super.draw(camera);

            for (let vertexBuffer of this.vertexBuffers) {
                let gl = engine.gl;
                gl.bindBuffer(engine.gl.ARRAY_BUFFER, vertexBuffer);
                engine.gl.vertexAttribPointer(vertexBuffer.index, vertexBuffer.stride, engine.gl.FLOAT, false, 0, 0);
            }

            engine.gl.bindBuffer(engine.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.data);
            console.log("index num:" + this.geometry.indices.length);
            engine.gl.drawElements(engine.gl.TRIANGLE_STRIP, this.geometry.indices.length, engine.gl.UNSIGNED_SHORT, 0);
        }
    }
}
