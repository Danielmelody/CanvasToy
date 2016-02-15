/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.Geometry = function (vertices) {

    CanvasToy.RenderNode.call(this);
    this.vertices = [];

};

CanvasToy.Geometry.prototype.initBuffers = function() {
    //this.vertices = vertices || [];
    this.vertBuffer = this.webglContext.createBuffer();
    this.webglContext.bindBuffer(this.webglContext.ARRAY_BUFFER, this.vertBuffer);
};


