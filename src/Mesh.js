/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.Mesh = function (geometry, material) {
    this.geometry = geometry || new Geometry();
    this.material = material || new Material();
};

CanvasToy.Mesh.prototype = Object.create(CanvasToy.RenderNode.prototype);
CanvasToy.Mesh.prototype.constructor = CanvasToy.RenderNode;

CanvasToy.Mesh.prototype.draw = function(webglContext, camera){
    RenderNode.draw.call(this);
    webglContext.bufferData(
        webglContext.ARRAY_BUFFER,
        new Float32Array(this.geometry.vertices),
        this.webglContext.STATIC_DRAW
    );
    webglContext.drawArrays(webglContext.TRIANGLE_STRIP, 0, this.geometry.vertices.length);

};
