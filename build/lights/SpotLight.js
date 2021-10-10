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
import { mat4, quat, vec3 } from "gl-matrix";
import { PerspectiveCamera } from "../cameras/PerspectiveCamera";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { ProcessingFrameBuffer } from "../renderer/SwapFramebuffer";
import { encodeNormal } from "../Util";
import { DampingLight } from "./DampingLight";
var SpotLight = (function (_super) {
    __extends(SpotLight, _super);
    function SpotLight(renderer) {
        var _this = _super.call(this, renderer) || this;
        _this.setConeAngle(Math.PI / 8);
        _this.setRadius(100);
        return _this;
    }
    Object.defineProperty(SpotLight.prototype, "shadowMap", {
        get: function () {
            return this._shadowFrameBuffer.active.attachments.color.targetTexture;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpotLight.prototype, "shadowFrameBuffer", {
        get: function () {
            return this._shadowFrameBuffer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpotLight.prototype, "shadowFrameBuffers", {
        get: function () {
            return [this._shadowFrameBuffer];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpotLight.prototype, "spotDirection", {
        get: function () {
            var dir = vec3.transformQuat(vec3.create(), vec3.fromValues(0, 0, -1), mat4.getRotation(quat.create(), this._matrix));
            vec3.normalize(dir, dir);
            return dir;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpotLight.prototype, "coneAngle", {
        get: function () {
            return this._coneAngle;
        },
        enumerable: false,
        configurable: true
    });
    SpotLight.prototype.getDeferredInfo = function (layer, camera) {
        switch (layer) {
            case 0:
                _super.prototype.getDeferredInfo.call(this, layer, camera);
            case 1:
                var dir = this.spotDirection;
                var codeDir = encodeNormal(dir);
                return [codeDir[0], codeDir[1], codeDir[2], this._coneAngle];
            default:
                throw Error("deferred Info " + layer + " undifined");
        }
    };
    Object.defineProperty(SpotLight.prototype, "coneAngleCos", {
        get: function () {
            return Math.cos(this._coneAngle);
        },
        enumerable: false,
        configurable: true
    });
    SpotLight.prototype.setRadius = function (radius) {
        this._radius = radius;
        return this;
    };
    SpotLight.prototype.setConeAngle = function (coneAngle) {
        console.assert(coneAngle > 0, "coneAngle should be greater than 0!");
        this._coneAngle = coneAngle;
        this._projectCamera.setFovy(coneAngle * 2);
        return this;
    };
    SpotLight.prototype.setSpotDirection = function (spotDirection) {
        var lookPoint = vec3.add(vec3.create(), this.position, spotDirection);
        this.lookAt(lookPoint);
        return this;
    };
    SpotLight.prototype.setShadowSize = function (_size) {
        _super.prototype.setShadowSize.call(this, _size);
        if (this._shadowFrameBuffer !== null) {
            this._shadowFrameBuffer
                .setWidth(_size)
                .setHeight(_size)
                .attach(this.gl);
        }
        return this;
    };
    SpotLight.prototype.getProjecttionBoundingBox2D = function (camera) {
        console.error("function getProjecttionBoundingBox2D has not been init");
        return {
            left: -1,
            right: 1,
            top: 1,
            bottom: -1,
        };
    };
    SpotLight.prototype.init = function (render) {
        var _this = this;
        if (!this._shadowFrameBuffer) {
            this._shadowFrameBuffer = new ProcessingFrameBuffer(this.gl).onInit(function (frameBuffer) {
                frameBuffer.setWidth(_this._shadowSize).setHeight(_this._shadowSize);
                frameBuffer.attachments.color.targetTexture
                    .setType(_this.gl.FLOAT)
                    .setFormat(_this.gl.RGBA)
                    .setMinFilter(_this.gl.NEAREST)
                    .setMagFilter(_this.gl.NEAREST)
                    .setWrapS(_this.gl.REPEAT)
                    .setWrapT(_this.gl.REPEAT)
                    .apply(_this.gl);
                frameBuffer.attach(_this.gl);
            });
        }
        this._projectCamera = new PerspectiveCamera()
            .setParent(this)
            .setLocalPosition(vec3.create())
            .setAspectRadio(1);
        return this;
    };
    SpotLight.prototype.clearShadowFrameBuffer = function () {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._shadowFrameBuffer.active.glFramebuffer);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clearColor(this.far, 0, 0, 0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
    };
    __decorate([
        uniform(DataType.vec3, "spotDir")
    ], SpotLight.prototype, "spotDirection", null);
    __decorate([
        uniform(DataType.float)
    ], SpotLight.prototype, "coneAngleCos", null);
    return SpotLight;
}(DampingLight));
export { SpotLight };
//# sourceMappingURL=SpotLight.js.map