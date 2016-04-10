/// <reference path="./geometries/Geometry.ts"/>
/// <reference path="./materials/material.ts"/>
/// <reference path="./Node.ts"/>

module CanvasToy{

    export class Mesh extends Node{

        protected colors:Array<number> = [];
        protected verticesBuffer:Buffer;
        protected indicesBuffer:Buffer;
        protected colorBuffer:Buffer;

        constructor(protected geometry:Geometry,protected material:Material) {
            super();

            this.verticesBuffer = new Buffer({
                index:engine.getAttribLocation("position"),
                data:engine.gl.createBuffer()
            });
            engine.gl.enableVertexAttribArray(this.verticesBuffer.shaderIndex);
            engine.gl.bindBuffer(engine.gl.ARRAY_BUFFER, this.verticesBuffer.data);
            engine.gl.bufferData(engine.gl.ARRAY_BUFFER, new Float32Array(this.geometry.vertices), engine.gl.STATIC_DRAW);

            let size = geometry.vertices.length / 3;
            console.log('size:'+size);
            for (let i = 0; i < size / 2; ++i) {
                this.colors = this.colors.concat([1, 1, 1, 1]);
            }
            for (let i = size / 2; i < size; ++i) {
                this.colors = this.colors.concat([1, 1, 0, 1]);
            }
            console.log(this.geometry.vertices.length);
            console.log(this.colors.length);
            this.colorBuffer = new Buffer({
                index:engine.getAttribLocation("aColor"),
                data:engine.gl.createBuffer()
            });
            engine.gl.enableVertexAttribArray(this.colorBuffer.shaderIndex);
            engine.gl.bindBuffer(engine.gl.ARRAY_BUFFER, this.colorBuffer.data);
            engine.gl.bufferData(engine.gl.ARRAY_BUFFER, new Float32Array(this.colors), engine.gl.STATIC_DRAW);

            this.indicesBuffer = new Buffer({
                index:-1,
                data:engine.gl.createBuffer()
            });
            engine.gl.bindBuffer(engine.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer.data);
            engine.gl.bufferData(engine.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometry.indices), engine.gl.STATIC_DRAW);

        }
        draw(camera:Camera){
            super.draw(camera);
            engine.gl.bindBuffer(engine.gl.ARRAY_BUFFER, this.verticesBuffer.data);
            engine.gl.vertexAttribPointer(this.verticesBuffer.shaderIndex, 3, engine.gl.FLOAT, false, 0, 0);

            engine.gl.bindBuffer(engine.gl.ARRAY_BUFFER, this.colorBuffer.data);
            engine.gl.vertexAttribPointer(this.colorBuffer.shaderIndex, 4, engine.gl.FLOAT, false, 0, 0);

            engine.gl.bindBuffer(engine.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer.data);
            console.log("index num:" + this.geometry.indices.length);
            engine.gl.drawElements(engine.gl.TRIANGLE_STRIP, this.geometry.indices.length, engine.gl.UNSIGNED_SHORT, 0);
        }
    }
}
