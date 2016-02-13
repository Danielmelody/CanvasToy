/*
 * @author Danielhu229 http://hustdanielhu.com
 */

var Camera = function () {
    this.projectionMatrix = mat4.create();
}

Camera.prototype = Object3d.create(Object3d.prototype);
Camera.prototype.constructor = Camera;

Camera.prototype.lookAt = function(eye, center, up){
    this.projectionMatrix.lookAt(eye, center, up);
}