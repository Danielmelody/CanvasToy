/*
 * @author Danielhu229 http://hustdanielhu.com
 */
var node = function () {
    Camera.apply(this);
    this.children = [];

}

node.prototype = Object.create(Object3d.prototype);

node.prototype.draw = function(){

}
