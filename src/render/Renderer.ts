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
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }

        public startRender(scene:Scene, camera:Camera, duration:number) {
            this.gl.clearColor(
                scene.clearColor[0],
                scene.clearColor[1],
                scene.clearColor[2],
                scene.clearColor[3]
            );
            setInterval(() => this.renderImmediately(scene, camera), duration);
        }

        private renderImmediately(scene:Scene, camera:Camera){
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            for(let renderObject of scene.renderObjects) {
                renderObject.draw(this.gl, camera);
            }
        }

        public useProgram(program:WebGLProgram){
            this.gl.useProgram(program);
        }

        private initMatrix(){
            glMatrix.setMatrixArrayType(Float32Array);
        }
    }
}
