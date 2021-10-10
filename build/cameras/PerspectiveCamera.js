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
import { Camera } from "./Camera";
var PerspectiveCamera = (function (_super) {
    __extends(PerspectiveCamera, _super);
    function PerspectiveCamera(parameter) {
        if (parameter === void 0) { parameter = {}; }
        var _this = _super.call(this) || this;
        _this._aspect = 1;
        _this._fovy = Math.PI / 4;
        _this._aspect = parameter.aspect || _this._aspect;
        _this._fovy = parameter.fovy || _this._fovy;
        _this._near = parameter.near || _this._near;
        _this._far = parameter.far || _this._far;
        return _this;
    }
    PerspectiveCamera.prototype.compuseProjectionMatrix = function () {
        mat4.perspective(this._projectionMatrix, this._fovy, this._aspect, this._near, this._far);
    };
    Object.defineProperty(PerspectiveCamera.prototype, "aspect", {
        get: function () {
            return this._aspect;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveCamera.prototype, "fovy", {
        get: function () {
            return this._fovy;
        },
        enumerable: false,
        configurable: true
    });
    PerspectiveCamera.prototype.setAspect = function (aspect) {
        if (aspect !== this._aspect) {
            this._aspect = aspect;
            this.compuseProjectionMatrix();
        }
        return this;
    };
    PerspectiveCamera.prototype.setFovy = function (fovy) {
        if (fovy !== this._fovy) {
            this._fovy = fovy;
            this.compuseProjectionMatrix();
        }
        return this;
    };
    PerspectiveCamera.prototype.deCompuseProjectionMatrix = function () {
    };
    PerspectiveCamera.prototype.setAspectRadio = function (ratio) {
        this._aspect = ratio;
        this.compuseProjectionMatrix();
        return this;
    };
    PerspectiveCamera.prototype.changeZoom = function (offset) {
        var fov = this._fovy / Math.PI * 180.0;
        fov -= offset;
        if (fov <= 1.0) {
            fov = 1.0;
        }
        if (fov >= 45.0) {
            fov = 45.0;
        }
        this.setFovy(fov * Math.PI / 180.0);
        return this;
    };
    return PerspectiveCamera;
}(Camera));
export { PerspectiveCamera };
//# sourceMappingURL=PerspectiveCamera.js.map