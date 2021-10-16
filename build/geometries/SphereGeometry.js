var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { vec3 } from "gl-matrix";
import { Geometry } from "./Geometry";
var SphereGeometry = (function (_super) {
    __extends(SphereGeometry, _super);
    function SphereGeometry(gl) {
        var _this = _super.call(this, gl) || this;
        _this._radius = 1;
        _this._widthSegments = 8;
        _this._heightSegments = 6;
        _this._phiStart = 0;
        _this._phiLength = Math.PI * 2;
        _this._thetaStart = 0;
        _this._thetaLength = Math.PI;
        return _this;
    }
    SphereGeometry.prototype.build = function () {
        var iy = 0;
        var ix = 0;
        var index = 0;
        var grid = [];
        var thetaEnd = this._thetaStart + this._thetaLength;
        for (iy = 0; iy <= this._heightSegments; iy++) {
            var verticesRow = [];
            var v = iy / this._heightSegments;
            for (ix = 0; ix <= this._widthSegments; ix++) {
                var aMainUV = [ix / this._widthSegments, 1 - iy / this._heightSegments];
                var position = Float32Array.from([
                    -this._radius * Math.cos(this._phiStart + aMainUV[0] * this._phiLength)
                        * Math.sin(this._thetaStart + v * this._thetaLength),
                    this._radius * Math.cos(this._thetaStart + aMainUV[1] * this._thetaLength),
                    this._radius * Math.sin(this._phiStart + aMainUV[0] * this._phiLength)
                        * Math.sin(this._thetaStart + v * this._thetaLength),
                ]);
                var aNormal = vec3.normalize(vec3.create(), position);
                this.addVertex({ position: position, aNormal: aNormal, aMainUV: aMainUV });
                verticesRow.push(index++);
            }
            grid.push(verticesRow);
        }
        for (iy = 0; iy < this._heightSegments; iy++) {
            for (ix = 0; ix < this._widthSegments; ix++) {
                var a = grid[iy][ix + 1];
                var b = grid[iy][ix];
                var c = grid[iy + 1][ix];
                var d = grid[iy + 1][ix + 1];
                if (iy !== 0 || this._thetaStart > 0) {
                    this.faces.data.push(a, b, d);
                }
                if (iy !== this._heightSegments - 1 || thetaEnd < Math.PI) {
                    this.faces.data.push(b, c, d);
                }
            }
        }
        return this;
    };
    Object.defineProperty(SphereGeometry.prototype, "radius", {
        get: function () { return this._radius; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SphereGeometry.prototype, "widthSegments", {
        get: function () { return this._widthSegments; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SphereGeometry.prototype, "heightSegments", {
        get: function () { return this._heightSegments; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SphereGeometry.prototype, "phiStart", {
        get: function () { return this._phiStart; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SphereGeometry.prototype, "phiLength", {
        get: function () { return this._phiLength; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SphereGeometry.prototype, "thetaStart", {
        get: function () { return this._thetaStart; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SphereGeometry.prototype, "thetaLength", {
        get: function () { return this._thetaLength; },
        enumerable: false,
        configurable: true
    });
    SphereGeometry.prototype.setRadius = function (radius) {
        this._radius = radius;
        return this;
    };
    SphereGeometry.prototype.setWidthSegments = function (widthSegments) {
        this._widthSegments = widthSegments;
        return this;
    };
    SphereGeometry.prototype.setHeightSegments = function (heightSegments) {
        this._heightSegments = heightSegments;
        return this;
    };
    SphereGeometry.prototype.setPhiStart = function (phiStart) {
        this._phiStart = phiStart;
        return this;
    };
    SphereGeometry.prototype.setPhiLength = function (phiLength) {
        this._phiLength = phiLength;
        return this;
    };
    SphereGeometry.prototype.setThetaStart = function (thetaStart) {
        this._thetaStart = thetaStart;
        return this;
    };
    SphereGeometry.prototype.setThetaLength = function (thetaLength) {
        this._thetaLength = thetaLength;
        return this;
    };
    return SphereGeometry;
}(Geometry));
export { SphereGeometry };
//# sourceMappingURL=SphereGeometry.js.map