module CanvasToy {
    export class VertexBuffer {
        name: string;
        size: number;
        type: number
        data: number[];
        index: number;
        stride: number;
        buffer: WebGLBuffer = null
        constructor(name: string, size: number, type: number, data?: number[], stride?: number) {
            this.name = name;
            this.size = size;
            this.type = type;
            this.data = data ? data : [];
            this.stride = stride ? stride : 0;
            this.buffer = engine.gl.createBuffer();
        }
    }
}
