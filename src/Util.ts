module CanvasToy{

    export enum ShaderType{
        VertexShader,
        FragmentShader
    }

    export function initWebwebglContext(canvas):WebGLRenderingContext{
        var gl:WebGLRenderingContext = null;
        try {
            gl = canvas.getContext('experimental-webgl');
        } catch (e) {
            gl = canvas.getContext('webgl');
        }
        if (!gl) {
            alert("can't init webgl, current browser may not support it.");
        }
        return gl;
    }

    export function getDomScriptText(script:HTMLScriptElement):string{

        if (!script) {
            return null;
        }

        var theSource = "";
        var currentChild = script.firstChild;

        while (currentChild) {
            if (currentChild.nodeType == 3) {
                theSource += currentChild.textContent;
            }

            currentChild = currentChild.nextSibling;
        }

        var shader:WebGLShader;

        // Send the source to the shader object

    }

    export function createShader(gl:WebGLRenderingContext, source:string, type:ShaderType):WebGLShader  {

        var shader:WebGLShader;

        if (type == ShaderType.FragmentShader) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type == ShaderType.VertexShader ) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        gl.shaderSource(shader, source);

        // Compile the shader program

        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    export function getShaderProgram (gl:WebGLRenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader):WebGLProgram {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        return shaderProgram;
    };

    function setProgram (camera:Camera, fog, material:Material, object:Object3d){
        //TODO: implement function
    }

    export function createVertexBuffer(vertices: number[] | Float32Array): WebGLBuffer {
        var vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);

        if (vertices instanceof Float32Array) {
            this.gl.bufferData(this.gl.ARRAY_BUFFER, <Float32Array>vertices, this.gl.STATIC_DRAW);
        } else {
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(<number[]>vertices), this.gl.STATIC_DRAW);
        }

        return vbo;
    }

    export function createDynamicVertexBuffer(size:number){
        var vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, size, this.gl.DYNAMIC_DRAW);
        return vbo;
    }

}
