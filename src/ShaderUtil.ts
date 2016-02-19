module CanvasToy{
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

    export function compileShader (gl:WebGLRenderingContext, id:string) {
        var shaderScript = <HTMLScriptElement>document.getElementById(id);

        if (!shaderScript) {
            return null;
        }

        var theSource = "";
        var currentChild = shaderScript.firstChild;

        while (currentChild) {
            if (currentChild.nodeType == 3) {
                theSource += currentChild.textContent;
            }

            currentChild = currentChild.nextSibling;
        }

        var shader:WebGLShader;

        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            alert(id + ": unknown shader type");
            return null;  // Unknown shader type
        }

        // Send the source to the shader object

        gl.shaderSource(shader, theSource);

        // Compile the shader program

        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    export function getShaderProgram (gl:WebGLRenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        return shaderProgram;
    };

    function setProgram (camera:Camera, fog, material:Material, object:Object3d){
        //TODO: implement function
    }

}
