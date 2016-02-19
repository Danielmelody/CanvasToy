module CanvasToy{

    export class Renderer{

        public canvasDom:HTMLCanvasElement;

        public programs:Array<WebGLProgram>;

        public gl:WebGLRenderingContext;

        constructor(canvas:HTMLCanvasElement){
            this.canvasDom = canvas || document.createElement('canvas');

            this.programs = [];
            this.gl = initWebwebglContext(canvas);

            this.initMatrix();

            var vertexShader:WebGLShader = compileShader(this.gl, 'shader-vs');
            var fragmentShader:WebGLShader = compileShader(this.gl, 'shader-fs');

            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }

        initMatrix(){
            glMatrix.setMatrixArrayType(Float32Array);
        }
    }
}
