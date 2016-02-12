/*
 * @author Danielhu229 http://hustdanielhu.com
 */

var Geometry = function (options) {

    Object3d.call(this, options);

    this.vertices = options.vertices || [];
    this.vertBuffer = this.webglContext.createBuffer();
    this.webglContext.bindBuffer(this.webglContext.ARRAY_BUFFER, this.vertBuffer);
    this.webglContext.bufferData(
        this.webglContext.ARRAY_BUFFER,
        new Float32Array(this.vertices),
        this.webglContext.STATIC_DRAW
    );
}


Geometry.prototype = Object.create(RenderNode);
Geometry.prototype.constructor = RenderNode;

Geometry.prototype.draw = function () {
    RenderNode.prototype.draw();
}

