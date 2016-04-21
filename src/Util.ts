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

    function createSeparatedShader(gl:WebGLRenderingContext, source:string, type:ShaderType):WebGLShader  {

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

    function linkShader (gl:WebGLRenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader):WebGLProgram {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        return shaderProgram;
    };

    export function createEntileShader(gl:WebGLRenderingContext, vertexShaderSource:string, fragmentShaderSource:string):WebGLProgram{
        let vertShader = createSeparatedShader(gl, vertexShaderSource, ShaderType.VertexShader);
        let fragShader = createSeparatedShader(gl, fragmentShaderSource, ShaderType.FragmentShader);
        return linkShader(gl, vertShader, fragShader);
    }

    function setProgram (camera:Camera, fog, material:Material, object:Object3d){
        //TODO: implement function

    }
}
