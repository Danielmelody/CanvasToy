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
import { Geometry } from "./Geometry";
var TileGeometry = (function (_super) {
    __extends(TileGeometry, _super);
    function TileGeometry(gl) {
        var _this = _super.call(this, gl) || this;
        _this._widthSegments = 8;
        _this._heightSegments = 6;
        _this._width = 2;
        _this._height = 2;
        return _this;
    }
    TileGeometry.prototype.build = function () {
        var index = 0;
        var grid = [];
        for (var x = 0; x <= this._widthSegments; ++x) {
            var row = [];
            for (var y = 0; y <= this._heightSegments; ++y) {
                var position = [
                    this._width * (x - this._widthSegments / 2) / this._widthSegments,
                    this._height * (y - this._heightSegments / 2) / this._heightSegments,
                    0,
                ];
                var aMainUV = [x / this._widthSegments, y / this._heightSegments];
                var aNormal = [0, 0, 1];
                this.addVertex({ position: position, aNormal: aNormal, aMainUV: aMainUV });
                row.push(index++);
            }
            grid.push(row);
        }
        for (var x = 0; x < this._widthSegments; ++x) {
            for (var y = 0; y < this._heightSegments; ++y) {
                var a = grid[x][y];
                var b = grid[x + 1][y];
                var c = grid[x + 1][y + 1];
                var d = grid[x][y + 1];
                this.faces.data.push(a, b, c);
                this.faces.data.push(a, d, c);
            }
        }
        return this;
    };
    return TileGeometry;
}(Geometry));
export { TileGeometry };
//# sourceMappingURL=TileGeometry.js.map