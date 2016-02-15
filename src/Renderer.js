/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.Renderer = function (canvas) {

    this.canvasDom = canvas || document.createElement('canvas');

    this.programs = [];
    this.webglContext = initWebwebglContext(canvas);

    this.initMatrix();

    var vertexShader = compileShader(this.webglContext, 'shader-vs');
    var fragmentShader = compileShader(this.webglContext, 'shader-fs');

    this.webglContext.clearColor(0.0, 0.0, 0.0, 1.0);
    this.webglContext.clearDepth(1.0);
    this.webglContext.enable(this.webglContext.DEPTH_TEST);
    this.webglContext.depthFunc(this.webglContext.LEQUAL);
};

CanvasToy.Renderer.prototype.render = function (scene, camera) {
    this.webglContext.clear(this.webglContext.COLOR_BUFFER_BIT | this.webglContext.DEPTH_BUFFER_BIT);
    scene.renderObjects.forEach(function(object){
        object.draw(camera);
    });

    //TODO: implements function
};

CanvasToy.Renderer.prototype.initMatrix = function () {
    glMatrix.setMatrixArrayType(Float32Array);
};