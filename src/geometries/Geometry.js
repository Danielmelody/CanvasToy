/*
 * @author Danielhu229 http://hustdanielhu.com
 */

var Geometry = function (vertices) {

    RenderNode.call(this);
    this.vertices = [];

}

Geometry.prototype.initBuffers = function() {
    //this.vertices = vertices || [];
    this.vertBuffer = this.webglContext.createBuffer();
    this.webglContext.bindBuffer(this.webglContext.ARRAY_BUFFER, this.vertBuffer);
}


