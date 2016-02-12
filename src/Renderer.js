/*
 * @author Danielhu229 http://hustdanielhu.com
 */

var Renderer = function () {
    this.programs = [];
    this.gl = initWebGL(canvas);

    this.initMatrix();

    var vertexShader = compileShader(this.gl, 'shader-vs');
    var fragmentShader = compileShader(this.gl, 'shader-fs');

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
}

Renderer.prototype.renderBuffer = function (camera, geometry, material, object, group) {
    //TODO: implements function
}

Renderer.prototype.initMatrix = function () {
    glMatrix.setMatrixArrayType(Float32Array);
}