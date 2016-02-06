var WebGLWindow = function(canvas) {
    this.gl = initWebGL(canvas);

    this.initMatrix();

    var vertexShader = compileShader(this.gl, 'shader-vs');
    var fragmentShader = compileShader(this.gl, 'shader-fs');

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    setInterval(this.update(), 6);
}

WebGLWindow.prototype.update = function (){
    var self = this;
    return function (){
        self.gl.clear(self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT);
    }
}

WebGLWindow.prototype.initMatrix = function () {
    glMatrix.setMatrixArrayType(Float32Array);
}

function start(){
    var canvas = document.getElementById('canvas');
    var webgl = new WebGLWindow(canvas);
}