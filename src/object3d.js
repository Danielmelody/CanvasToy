/*
 * @author Danielhu229 http://hustdanielhu.com
 */
var Object3d = function(){
    this.webglContext = options.webglContext;
    this.modelViewMatrix = mat4.create();
    this.matrix = mat4.create();
    this.position = vec3.create();
    this.scale = vec3.create();
}

Object3d.prototype.start = function () {

}

Object3d.prototype.update = function(dt){

}

Object3d.updateMatrices = function() {

}

Object3d.prototype.tranlate = function (deltaX, deltaY, deltaZ) {
    this.modelViewMatrix = mat4.tranlate(mat4.create(), this.modelViewMatrix, new vec3(deltaX, deltaY, deltaZ));
}

Object3d.prototype.tranlateTo = function(toX, toY, toZ){
    
}

Object3d.prototype.scale = function (deltaX, deltaY, deltaZ) {
    this.modelViewMatrix = mat4.scale(mat4.create(), this.modelViewMatrix, new vec3(deltaX, deltaY, deltaZ));
}

Object3d.prototype.rotate = function (axis, angle) {
    this.modelViewMatrix = mat4.rotate(mat4.create(), this.modelViewMatrix, new vec3(deltaX, deltaY, deltaZ));
}

Object3d.prototype.rotate = function () {
    
}
