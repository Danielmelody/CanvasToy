/*
 * @author Danielhu229 http://hustdanielhu.com
 */

var Mesh = function (geometry, material) {
    this.geometry = geometry || new Geometry();
    this.material = material || new Material();
}

Mesh.prototype = Object.create(RenderNode.prototype);
Mesh.prototype.constructor = RenderNode;

