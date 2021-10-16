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
import { vec3 } from "gl-matrix";
import { DataType } from "../DataTypeEnum";
import { ifdefine, uniform } from "../Decorators";
import { Object3d } from "../Object3d";
import { ShadowLevel } from "./ShadowLevel";
var Light = (function (_super) {
    __extends(Light, _super);
    function Light(renderer) {
        var _this = _super.call(this) || this;
        _this._color = vec3.fromValues(1, 1, 1);
        _this._idensity = 1;
        _this._pcssArea = 5;
        _this._shadowLevel = ShadowLevel.PCSS;
        _this._shadowSoftness = 1.0;
        _this._shadowSize = 512;
        _this.gl = renderer.gl;
        _this.ext = renderer.ext;
        _this.init(renderer);
        return _this;
    }
    Light.prototype.setColor = function (color) {
        this._color = color;
        return this;
    };
    Light.prototype.setIdensity = function (idensity) {
        this._idensity = idensity;
        return this;
    };
    Light.prototype.setShadowLevel = function (shadowLevel) {
        this._shadowLevel = shadowLevel;
        return this;
    };
    Light.prototype.setShadowSize = function (shadowSize) {
        this._shadowSize = shadowSize;
        return this;
    };
    Light.prototype.setShadowSoftness = function (_shadowSoftness) {
        this._shadowSoftness = _shadowSoftness;
        return this;
    };
    Light.prototype.setPCSSArea = function (_pcssArea) {
        this._pcssArea = _pcssArea;
        return this;
    };
    Object.defineProperty(Light.prototype, "shadowLevel", {
        get: function () {
            return this._shadowLevel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Light.prototype, "shadowSoftness", {
        get: function () {
            return this._shadowSoftness;
        },
        enumerable: false,
        configurable: true
    });
    Light.prototype.getDeferredInfo = function (layer, renderCamera) {
        switch (layer) {
            case 0:
                return [this._color[0], this._color[1], this._color[2], this._idensity];
            default:
                throw Error("deferred Info " + layer + " undifined");
        }
    };
    Object.defineProperty(Light.prototype, "shadowSize", {
        get: function () {
            return this._shadowSize;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Light.prototype, "color", {
        get: function () {
            return this._color;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Light.prototype, "idensity", {
        get: function () {
            return this._idensity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Light.prototype, "projectionMatrix", {
        get: function () {
            return this._projectCamera.projectionMatrix;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Light.prototype, "viewMatrix", {
        get: function () {
            return this._worldToObjectMatrix;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Light.prototype, "pcssArea", {
        get: function () {
            return this._pcssArea;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Light.prototype, "far", {
        get: function () {
            return this._projectCamera.far;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Light.prototype, "near", {
        get: function () {
            return this._projectCamera.near;
        },
        enumerable: false,
        configurable: true
    });
    Light.prototype.drawWithLightCamera = function (renderParam) {
        renderParam.camera = this._projectCamera;
        renderParam.light = this;
        renderParam.material.shader.pass(renderParam);
    };
    __decorate([
        uniform(BaseType.i32, "shadowLevel")
    ], Light.prototype, "_shadowLevel", void 0);
    __decorate([
        uniform(DataType.float, "softness")
    ], Light.prototype, "_shadowSoftness", void 0);
    __decorate([
        ifdefine("RECEIVE_SHADOW"),
        uniform(DataType.float, "shadowMapSize")
    ], Light.prototype, "shadowSize", null);
    __decorate([
        uniform(DataType.vec3)
    ], Light.prototype, "color", null);
    __decorate([
        uniform(DataType.float)
    ], Light.prototype, "idensity", null);
    __decorate([
        ifdefine("RECEIVE_SHADOW"),
        uniform(DataType.mat4)
    ], Light.prototype, "projectionMatrix", null);
    __decorate([
        ifdefine("RECEIVE_SHADOW"),
        uniform(DataType.mat4)
    ], Light.prototype, "viewMatrix", null);
    __decorate([
        uniform(DataType.float, "lightArea")
    ], Light.prototype, "pcssArea", null);
    return Light;
}(Object3d));
export { Light };
//# sourceMappingURL=Light.js.map