/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.Camera = function () {
    this.projectionMatrix = mat4.create();
};

CanvasToy.Camera.prototype = Object3d.create(Object3d.prototype);
CanvasToy.Camera.prototype.constructor = Camera;

CanvasToy.Camera.prototype.lookAt = function(eye, center, up){
    this.projectionMatrix.lookAt(eye, center, up);
};