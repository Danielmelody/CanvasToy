/*
 * @author Danielhu229 http://hustdanielhu.com
 */
var RenderNode = function () {
    Object3d.call(this);
    this.relativeMatrix = mat4.create();
    this.children = [];
    this.parent = null;
}

RenderNode.prototype = Object.create(Object3d.prototype);
RenderNode.prototype.constructor = Object3d;

RenderNode.prototype.addChild = function (child) {
    this.children.push(child);
    child.parent = this;
}

RenderNode.prototype.updateMatrices = function () {
    var parentMatrix = this.parent.matrix;
    this.modelViewMatrix = mat4.mul(mat4.create(), this.relativeMatrix, parentMatrix);
    forEach(child in this.children)
    {
        this.children[child].updateMatrices();
    }
}

RenderNode.prototype.draw = function(camera){
    this.matrix = mat4.mul(mat4.create(), camera.projectionMatrix, this.modelViewMatrix);

}

