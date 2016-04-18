module CanvasToy {
    export class VertexBuffer {
        name:string;
        data:number[];
        index:number;
        stride:number;
        buffer:WebGLBuffer = null
        constructor (name:string, data?:number[], stride?:number) {
            this.data = data ? data : [];
            this.stride = stride ? stride : 0;
            this.index = 0;
        }
    }
}
