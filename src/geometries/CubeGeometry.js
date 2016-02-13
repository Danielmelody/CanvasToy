/*
 * @author Danielhu229 http://hustdanielhu.com
 */

var CubeGeometry = function () {
    Geometry.call(this);
    this.vertices = [
        1.0,  1.0,  0.0,
        -1.0, 1.0,  0.0,
        1.0,  -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];
    this.initBuffers();
}

CubeGeometry.prototype = Object.create(Geometry.prototype);
CubeGeometry.prototype.constructor = CubeGeometry
