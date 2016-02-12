/*
 * @author Danielhu229 http://hustdanielhu.com
 */

var Scene = function(canvas) {
    this.gl = initWebGL(canvas);
    this.shaderPrograms = [];

    this.initMatrix();

    var vertexShader = compileShader(this.gl, 'shader-vs');
    var fragmentShader = compileShader(this.gl, 'shader-fs');

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

}

Scene.prototype = Object.create(RenderNode);
Scene.prototype.constructor = RenderNode;

Scene.prototype.draw = function (){
    var self = this;
    return function (){
        self.gl.clear(self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT);
    }
}

Scene.prototype.initMatrix = function () {
    glMatrix.setMatrixArrayType(Float32Array);
}

Scene.prototype.bindMatrix = function () {
    
}

function start(){
    var canvas = document.getElementById('canvas');
    var webgl = new Scene(canvas);

}