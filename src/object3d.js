/*
 * @author Danielhu229 http://hustdanielhu.com
 */
CanvasToy.Object3d = function(){
    this.webglContext = options.webglContext;
    this.modelViewMatrix = mat4.create();
    this.matrix = mat4.create();
    this.position = vec3.create();
    this.scale = vec3.create();
};

CanvasToy.Object3d.prototype.start = function () {

};

CanvasToy.Object3d.prototype.update = function(dt){

};

CanvasToy.Object3d.updateMatrices = function() {

};

CanvasToy.Object3d.prototype.tranlate = function (deltaX, deltaY, deltaZ) {
    this.modelViewMatrix = mat4.tranlate(mat4.create(), this.modelViewMatrix, new vec3(deltaX, deltaY, deltaZ));
};

CanvasToy.Object3d.prototype.tranlateTo = function(toX, toY, toZ){
    
};

CanvasToy.Object3d.prototype.scale = function (deltaX, deltaY, deltaZ) {
    this.modelViewMatrix = mat4.scale(mat4.create(), this.modelViewMatrix, new vec3(deltaX, deltaY, deltaZ));
};

CanvasToy.Object3d.prototype.rotate = function (axis, angle) {
    this.modelViewMatrix = mat4.rotate(mat4.create(), this.modelViewMatrix, new vec3(deltaX, deltaY, deltaZ));
};

CanvasToy.Object3d.prototype.rotate = function () {
    
};
