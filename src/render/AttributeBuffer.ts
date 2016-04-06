module CanvasToy {
    export class Buffer {
        shaderIndex:number = 0
        data:WebGLBuffer = null
        constructor (options:{index:number, data:WebGLBuffer}) {
            this.shaderIndex = options.index;
            this.data = options.data;
        }
    }
}
