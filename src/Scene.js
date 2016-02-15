/*
 * @author Danielhu229 http://hustdanielhu.com
 */

require('CanvasToy');

CanvasToy.Scene = function() {
    this.renderObjects = [];
};

CanvasToy.Scene.prototype = Object.create(RenderNode);
CanvasToy.Scene.prototype.constructor = RenderNode;

CanvasToy.Scene.prototype.draw = function (camera){
    CanvasToy.RenderNode.draw.call(this, camera);
};

CanvasToy.Scene.prototype.addChild = function (child) {
    CanvasToy.RenderNode.addChild.call(this, child);
    this.renderObjects.push(child);
};