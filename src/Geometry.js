/*
 * @author Danielhu229 http://hustdanielhu.com
 */

var Geometry = function (vertices) {

    RenderNode.call(this);

    this.vertices = vertices || [];
    this.vertBuffer = this.webglContext.createBuffer();
    this.webglContext.bindBuffer(this.webglContext.ARRAY_BUFFER, this.vertBuffer);
    this.webglContext.bufferData(
        this.webglContext.ARRAY_BUFFER,
        new Float32Array(this.vertices),
        this.webglContext.STATIC_DRAW
    );
}
