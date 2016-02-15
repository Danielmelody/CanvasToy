/*
 * @author Danielhu229 http://hustdanielhu.com
 */
CanvasToy.RenderNode = function () {
    Object3d.call(this);
    this.relativeMatrix = mat4.create();
    this.children = [];
    this.parent = null;
};

CanvasToy.RenderNode.prototype = Object.create(CanvasToy.Object3d.prototype);
CanvasToy.RenderNode.prototype.constructor = CanvasToy.Object3d;

CanvasToy.RenderNode.prototype.addChild = function (child) {
    this.children.push(child);
    child.parent = this;
};

CanvasToy.RenderNode.prototype.updateMatrices = function () {
    var parentMatrix = this.parent.matrix;
    this.modelViewMatrix = mat4.mul(mat4.create(), this.relativeMatrix, parentMatrix);
    this.children.forEach(function(child){
        this.children[child].updateMatrices();
    });
};

CanvasToy.RenderNode.prototype.draw = function(camera){
    this.matrix = mat4.mul(mat4.create(), camera.projectionMatrix, this.modelViewMatrix);

};

