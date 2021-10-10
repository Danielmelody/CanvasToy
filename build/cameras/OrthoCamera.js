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
var OrthoCamera = (function (_super) {
    __extends(OrthoCamera, _super);
    function OrthoCamera(parameters) {
        if (parameters === void 0) { parameters = {}; }
        var _this = _super.call(this) || this;
        _this._left = -20;
        _this._right = 20;
        _this._bottom = -20;
        _this._top = 20;
        _this._baseSize = 20;
        _this._left = parameters.left || _this._left;
        _this._right = parameters.right || _this._right;
        _this._bottom = parameters.bottom || _this._bottom;
        _this._top = parameters.top || _this._top;
        _this._near = parameters.near || _this._near;
        _this._far = parameters.far || _this._far;
        mat4.ortho(_this._projectionMatrix, _this._left, _this._right, _this._bottom, _this._top, _this._near, _this._far);
        return _this;
    }
    OrthoCamera.prototype.setLeft = function (left) {
        if (left !== this._left) {
            this._left = left;
            this.compuseProjectionMatrix();
        }
    };
    Object.defineProperty(OrthoCamera.prototype, "left", {
        get: function () {
            return this._left;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OrthoCamera.prototype, "right", {
        get: function () {
            return this._right;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OrthoCamera.prototype, "top", {
        get: function () {
            return this._top;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OrthoCamera.prototype, "bottom", {
        get: function () {
            return this._bottom;
        },
        enumerable: false,
        configurable: true
    });
    OrthoCamera.prototype.compuseProjectionMatrix = function () {
        mat4.ortho(this._projectionMatrix, this._left, this._right, this._bottom, this._top, this._near, this._far);
    };
    OrthoCamera.prototype.deCompuseProjectionMatrix = function () {
    };
    OrthoCamera.prototype.setAspectRadio = function (radio) {
        this._ratio = radio;
        this._left = -radio * this._baseSize;
        this._right = radio * this._baseSize;
        this._top = this._baseSize;
        this._bottom = -this._baseSize;
        this.compuseProjectionMatrix();
        return this;
    };
    OrthoCamera.prototype.changeZoom = function (offset) {
        var zoom = this._baseSize + offset;
        if (zoom >= 30.0) {
            zoom = 30.0;
        }
        if (zoom <= 5.0) {
            zoom = 5.0;
        }
        this._baseSize = zoom;
        this.setAspectRadio(this._ratio);
        return this;
    };
    return OrthoCamera;
}(Camera));
export { OrthoCamera };
//# sourceMappingURL=OrthoCamera.js.map