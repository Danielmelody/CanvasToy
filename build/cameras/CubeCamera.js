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
import { mat4 } from "gl-matrix";
import { PerspectiveCamera } from "./PerspectiveCamera";
var CubeCamera = (function (_super) {
    __extends(CubeCamera, _super);
    function CubeCamera() {
        var _this = _super.call(this) || this;
        _this._projectionMatrices = [0, 0, 0, 0, 0, 0].map(function () { return mat4.create(); });
        return _this;
    }
    CubeCamera.prototype.compuseProjectionMatrix = function () {
        for (var _i = 0, _a = this._projectionMatrices; _i < _a.length; _i++) {
            var mat = _a[_i];
            mat4.perspective(mat, this._fovy, this._aspect, this._near, this._far);
        }
    };
    CubeCamera.prototype.deCompuseProjectionMatrix = function () {
    };
    return CubeCamera;
}(PerspectiveCamera));
export { CubeCamera };
//# sourceMappingURL=CubeCamera.js.map