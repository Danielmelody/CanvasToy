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
import { OrthoCamera } from "../cameras/OrthoCamera";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { ProcessingFrameBuffer } from "../renderer/SwapFramebuffer";
import { Light } from "./Light";
var DirectionalLight = (function (_super) {
    __extends(DirectionalLight, _super);
    function DirectionalLight(renderer) {
        var _this = _super.call(this, renderer) || this;
        _this.setShadowSize(1024);
        return _this;
    }
    Object.defineProperty(DirectionalLight.prototype, "shadowMap", {
        get: function () {
            return this._shadowFrameBuffer.active.attachments.color.targetTexture;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DirectionalLight.prototype, "shadowFrameBuffers", {
        get: function () {
            return [this._shadowFrameBuffer];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DirectionalLight.prototype, "direction", {
        get: function () {
            return vec3.transformQuat(vec3.create(), vec3.fromValues(0, 0, -1), mat4.getRotation(quat.create(), this._matrix));
        },
        enumerable: false,
        configurable: true
    });
    DirectionalLight.prototype.getProjecttionBoundingBox2D = function (camera) {
        return {
            left: -1,
            right: 1,
            top: 1,
            bottom: -1,
        };
    };
    DirectionalLight.prototype.setDirection = function (_direction) {
        var lookPoint = vec3.add(vec3.create(), this._position, _direction);
        this.lookAt(lookPoint);
        return this;
    };
    DirectionalLight.prototype.setShadowSize = function (_size) {
        _super.prototype.setShadowSize.call(this, _size);
        if (this._shadowFrameBuffer !== null) {
            this._shadowFrameBuffer.setWidth(_size).setHeight(_size).attach(this.gl);
        }
        return this;
    };
    DirectionalLight.prototype.clearShadowFrameBuffer = function () {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._shadowFrameBuffer.active.glFramebuffer);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clearColor(this.far, 0, 0, 0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
    };
    DirectionalLight.prototype.init = function (renderer) {
        var _this = this;
        if (!this._shadowFrameBuffer) {
            this._shadowFrameBuffer = new ProcessingFrameBuffer(this.gl)
                .onInit(function (frameBuffer) {
                frameBuffer
                    .setWidth(_this._shadowSize)
                    .setHeight(_this._shadowSize);
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
        this._projectCamera = new OrthoCamera()
            .setParent(this)
            .setLocalPosition(vec3.create())
            .setAspectRadio(1);
        return this;
    };
    __decorate([
        uniform(DataType.vec3)
    ], DirectionalLight.prototype, "direction", null);
    return DirectionalLight;
}(Light));
export { DirectionalLight };
//# sourceMappingURL=DirectionalLight.js.map