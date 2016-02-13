/*
 * @author Danielhu229 http://hustdanielhu.com
 */

var Scene = function() {
    this.renderObjects = [];
}

Scene.prototype = Object.create(RenderNode);
Scene.prototype.constructor = RenderNode;

Scene.prototype.draw = function (camera){
    RenderNode.draw.call(this, camera);
}

Scene.prototype.addChild = function (child) {
    RenderNode.addChild.call(this, child);
    this.renderObjects.push(child);
}