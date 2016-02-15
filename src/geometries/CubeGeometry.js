/*
 * @author Danielhu229 http://hustdanielhu.com
 */

CanvasToy.CubeGeometry = function () {
    Geometry.call(this);
    this.vertices = [
        1.0,  1.0,  0.0,
        -1.0, 1.0,  0.0,
        1.0,  -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];
    this.initBuffers();
};

CanvasToy.CubeGeometry.prototype = Object.create(CanvasToy.Geometry.prototype);
CanvasToy.CubeGeometry.prototype.constructor = CanvasToy.CubeGeometry;
