module CanvasToy {
    export class VertexBuffer {
        name:string;
        size:number;
        data:number[];
        index:number;
        stride:number;
        buffer:WebGLBuffer = null
        constructor (name:string, size:number, type:number, data?:number[], stride?:number) {
            this.name = name;
            this.data = data ? data : [];
            this.size = size;
            this.stride = stride ? stride : 0;
            this.buffer = engine.gl.createBuffer();
        }
    }
}
