/*
 * @author Danielhu229 http://hustdanielhu.com
 */

function initWebGL(canvas){
    var gl = null;
    try {
        gl = canvas.getContext('experimental-webgl');
    } catch(e) {
        gl = canvas.getContext('webgl');
    }
    if(!gl){
        alert("can't init webgl, current browser may not support it.");
    }
    return gl;
}

function compileShader(gl, id){
    var shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    var theSource = "";
    var currentChild = shaderScript.firstChild;

    while(currentChild) {
        if (currentChild.nodeType == 3) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

  // Now figure out what type of shader script we have,
  // based on its MIME type.

    var shader;

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        alert(id+": unknown shader type");
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

function getShaderProgram(gl, vertexShader, fragmentShader){
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
}
