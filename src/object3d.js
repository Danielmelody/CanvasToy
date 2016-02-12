/*
 * @author Danielhu229 http://hustdanielhu.com
 */
var Object3d = function(){
    this.webglContext = options.webglContext;
    this.matrix = mat4.create();
    this.position = vec3.create();
    this.scale = vec3.create();
}

Object3d.prototype.update = function(){

}

Object3d.prototype.tranlate = function (by) {
    this.matrix.tranlate(by);
}