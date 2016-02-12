/*
 * @author Danielhu229 http://hustdanielhu.com
 */
var RenderNode = function () {
    Object3d.call(this);
    this.relativeMatrix = mat4.create();
    this.children = [];
}

RenderNode.prototype = Object.create(Object3d.prototype);
RenderNode.prototype.constructor = Object3d;

RenderNode.prototype.addChild = function (child) {
    this.children.push(child);

}

RenderNode.prototype.draw = function(options){
    this.matrix = mat4.mul(mat4.create(), this.relativeMatrix, options.parentMatrix);
    options = {
        parentMatrix:this.matrix.clone()
    }
    forEach(child in this.children)
    {
        this.children[child].draw(options);
    }
}

