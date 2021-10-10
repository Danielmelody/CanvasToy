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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { mat4, vec3 } from "gl-matrix";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { Object3d } from "../Object3d";
export var CameraDirection;
(function (CameraDirection) {
    CameraDirection[CameraDirection["forward"] = 0] = "forward";
    CameraDirection[CameraDirection["bakc"] = 1] = "bakc";
    CameraDirection[CameraDirection["left"] = 2] = "left";
    CameraDirection[CameraDirection["right"] = 3] = "right";
})(CameraDirection || (CameraDirection = {}));
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super.call(this) || this;
        _this._upVector = vec3.fromValues(0, 1, 0);
        _this._centerVector = vec3.fromValues(0, 0, -1);
        _this._rightVector = vec3.fromValues(1, 0, 0);
        _this._projectionMatrix = mat4.create();
        _this._near = 0.1;
        _this._far = 500;
        _this._controlEnable = false;
        _this._cameraPitch = 0.0;
        _this._cameraYaw = -90.0;
        _this._cameraSpeed = 2.5;
        return _this;
    }
    Object.defineProperty(Camera.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "near", {
        get: function () {
            return this._near;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "far", {
        get: function () {
            return this._far;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "eyeVector", {
        get: function () {
            return vec3.clone(this._centerVector);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "upVector", {
        get: function () {
            return vec3.clone(this._upVector);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "centerVector", {
        get: function () {
            return vec3.clone(this._centerVector);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "rightVector", {
        get: function () {
            return vec3.clone(this._rightVector);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "projectionMatrix", {
        get: function () {
            return this._projectionMatrix;
        },
        enumerable: false,
        configurable: true
    });
    Camera.prototype.setNear = function (near) {
        if (near !== this._near) {
            this._near = near;
            this.compuseProjectionMatrix();
        }
        return this;
    };
    Camera.prototype.setFar = function (far) {
        if (far !== this._far) {
            this._far = far;
            this.compuseProjectionMatrix();
        }
        return this;
    };
    Object.defineProperty(Camera.prototype, "controlEnable", {
        get: function () {
            return this._controlEnable;
        },
        set: function (enable) {
            this._controlEnable = enable;
        },
        enumerable: false,
        configurable: true
    });
    Camera.prototype.changeDirectionByAngle = function (deltaAngle) {
        this._cameraYaw += deltaAngle[0];
        this._cameraPitch += deltaAngle[1];
        if (this._cameraPitch > 89.0) {
            this._cameraPitch = 89.0;
        }
        if (this._cameraPitch < -89.0) {
            this._cameraPitch = -89.0;
        }
        var newEyeVector = vec3.fromValues(Math.cos(this._cameraPitch * Math.PI / 180.0) * Math.cos(this._cameraYaw * Math.PI / 180.0), Math.sin(this._cameraPitch * Math.PI / 180.0), Math.cos(this._cameraPitch * Math.PI / 180.0) * Math.sin(this._cameraYaw * Math.PI / 180.0));
        this._centerVector = newEyeVector;
        _super.prototype.lookAt.call(this, newEyeVector);
    };
    Camera.prototype.genOtherMatrixs = function () {
        _super.prototype.genOtherMatrixs.call(this);
        this.compuseProjectionMatrix();
    };
    __decorate([
        uniform(DataType.vec3, "cameraPos")
    ], Camera.prototype, "position", null);
    __decorate([
        uniform(DataType.float, "cameraNear")
    ], Camera.prototype, "near", null);
    __decorate([
        uniform(DataType.float, "cameraFar")
    ], Camera.prototype, "far", null);
    return Camera;
}(Object3d));
export { Camera };
//# sourceMappingURL=Camera.js.map