/// <reference path="../CanvasToy.ts"/>

module CanvasToy{

    export class Geometry{

        public vertices:Array<number>;
        public normals:Array<number>;

        public vbo:WebGLBuffer;

        constructor(size?:number) {
            this.vertices = [];
            this.normals = [];
            this.vbo = createDynamicVertexBuffer(size | 1000);
        }
    }
}
