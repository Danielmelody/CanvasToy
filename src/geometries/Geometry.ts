module CanvasToy{
    export class Geometry{

        public vertices:Array<any>;

        public verticesBuffer:WebGLBuffer;

        constructor() {
            this.vertices = [];
        }

        initBuffers(gl:WebGLRenderingContext) {
            this.verticesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        }

    }
}
