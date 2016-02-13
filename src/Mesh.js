/*
 * @author Danielhu229 http://hustdanielhu.com
 */

var Mesh = function (geometry, material) {
    this.geometry = geometry || new Geometry();
    this.material = material || new Material();
}

Mesh.prototype = Object.create(RenderNode.prototype);
Mesh.prototype.constructor = RenderNode;

Mesh.prototype.draw = function(webglContext, camera){
    RenderNode.draw.call(this);
    webglContext.bufferData(
        webglContext.ARRAY_BUFFER,
        new Float32Array(this.geometry.vertices),
        this.webglContext.STATIC_DRAW
    );
    webglContext.drawArrays(webglContext.TRIANGLE_STRIP, 0, this.geometry.vertices.length);

}
