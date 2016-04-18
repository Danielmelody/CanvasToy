/// <reference path="../CanvasToy.ts"/>

module CanvasToy{

    export class Geometry{
        public vertices:Array<number> = [];
        public indices:Array<number> = [];


        public indexBuffer:VertexBuffer;
        public positionBuffer:VertexBuffer;
        public textureCoordinateBuffer:VertexBuffer;
        public normalBuffer:VertexBuffer;


        constructor(size?:number) {
            this.positionBuffer = new VertexBuffer();
            this.indexBuffer = new VertexBuffer();
            let gl = engine.gl;
            gl.enableVertexAttribArray(gl.getAttribLocation(engine.currentProgram, "position"));
        }
    }
}
