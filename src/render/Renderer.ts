module CanvasToy{

    export function setCanvas(canvas:HTMLCanvasElement){
        engine = new Renderer(canvas);
    }

    export class Renderer{

        public canvasDom:HTMLCanvasElement;

        public programs:Array<WebGLProgram>;

        public currentProgram:WebGLProgram;

        public gl:WebGLRenderingContext;

        public preloadRes:any[] = [];

        constructor(canvas:HTMLCanvasElement){
            this.canvasDom = canvas || document.createElement('canvas');
            this.programs = [];
            this.gl = initWebwebglContext(canvas);
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }

        public makeProgram(geometry:Geometry, material:Material, parameters:ProgramParamter){
            var prefixVertex = [
				'precision ' + parameters.precision + ' float;',
				'precision ' + parameters.precision + ' int;',
                material.map ? '#define USE_TEXTURE' : '',
                material.color ? '#define USE_COLOR' : ''
            ].join("\n");

            var prefixFragment = [
				'precision ' + parameters.precision + ' float;',
				'precision ' + parameters.precision + ' int;',
                material.map ? '#define USE_TEXTURE' : '',
                material.color ? '#define USE_COLOR' : ''
            ].join("\n");

            this.currentProgram = createEntileShader(this.gl, prefixVertex + basic_vert, prefixFragment + basic_frag);
            this.programs.push(this.currentProgram);
            this.gl.useProgram(this.currentProgram);

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

        public getUniformLocation(name:string):WebGLUniformLocation {
            if(this.gl == undefined || this.gl == null){
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = this.gl.getUniformLocation(this.currentProgram, name);
            if (result == null) {
                console.error("uniform " + name + " not found!");
                return null;
            }
            return result;
        }

        public getAttribLocation(name:string):number {
            if(this.gl == undefined || this.gl == null){
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = this.gl.getAttribLocation(this.currentProgram, name);
            if (result == null) {
                console.error("attribute " + name + " not found!");
                return null;
            }
            return result;
        }

        private renderImmediately(scene:Scene, camera:Camera){
            if (this.preloadRes.length > 0) {
                return;
            }
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            for(let renderObject of scene.objects) {
                renderObject.draw(camera);
            }
        }

        private initMatrix(){
            glMatrix.setMatrixArrayType(Float32Array);
        }
    }
}
