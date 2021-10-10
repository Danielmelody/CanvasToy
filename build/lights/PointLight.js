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
import { mat4, vec3 } from "gl-matrix";
import { SphereGeometry } from "../geometries/SphereGeometry";
import { CubeTexture } from "../textures/CubeTexture";
import { DampingLight } from "./DampingLight";
import { ShadowLevel } from "./ShadowLevel";
import { SpotLight } from "./SpotLight";
var PointLight = (function (_super) {
    __extends(PointLight, _super);
    function PointLight(renderer) {
        return _super.call(this, renderer) || this;
    }
    Object.defineProperty(PointLight.prototype, "shadowMap", {
        get: function () {
            return this._cubeTexture;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PointLight.prototype, "shadowFrameBuffers", {
        get: function () {
            return this._spotLights.map(function (spot) { return spot.shadowFrameBuffer; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PointLight.prototype, "projectionMatrix", {
        get: function () {
            return this._spotLights[0].projectionMatrix;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PointLight.prototype, "far", {
        get: function () {
            return this._spotLights[0].far;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PointLight.prototype, "near", {
        get: function () {
            return this._spotLights[0].near;
        },
        enumerable: false,
        configurable: true
    });
    PointLight.prototype.getDeferredInfo = function (layer, renderCamera) {
        switch (layer) {
            case 0:
                return _super.prototype.getDeferredInfo.call(this, layer, renderCamera);
            case 1:
                var viewPos = vec3.transformMat4(vec3.create(), this._position, renderCamera.worldToObjectMatrix);
                return [viewPos[0], viewPos[1], viewPos[2], this._radius];
            case 2:
                return [
                    this.squareAttenuation,
                    this.linearAttenuation,
                    this.constantAttenuation
                ];
            default:
                throw Error("deferred Info " + layer + " undifined");
        }
    };
    PointLight.prototype.setColor = function (color) {
        this._color = color;
        for (var _i = 0, _a = this._spotLights; _i < _a.length; _i++) {
            var spotLight = _a[_i];
            spotLight.setColor(color);
        }
        return this;
    };
    PointLight.prototype.setIdensity = function (idensity) {
        this._idensity = idensity;
        for (var _i = 0, _a = this._spotLights; _i < _a.length; _i++) {
            var spotLight = _a[_i];
            spotLight.setIdensity(idensity);
        }
        return this;
    };
    PointLight.prototype.setShadowLevel = function (shadowLevel) {
        this._shadowLevel = shadowLevel;
        for (var _i = 0, _a = this._spotLights; _i < _a.length; _i++) {
            var spotLight = _a[_i];
            spotLight.setShadowLevel(shadowLevel);
        }
        return this;
    };
    PointLight.prototype.setShadowSize = function (shadowSize) {
        this._shadowSize = shadowSize;
        for (var _i = 0, _a = this._spotLights; _i < _a.length; _i++) {
            var spotLight = _a[_i];
            spotLight.setShadowSize(shadowSize);
        }
        return this;
    };
    PointLight.prototype.setShadowSoftness = function (_shadowSoftness) {
        this._shadowSoftness = _shadowSoftness;
        for (var _i = 0, _a = this._spotLights; _i < _a.length; _i++) {
            var spotLight = _a[_i];
            spotLight.setShadowSoftness(_shadowSoftness);
        }
        return this;
    };
    PointLight.prototype.setPCSSArea = function (_pcssArea) {
        this._pcssArea = _pcssArea;
        for (var _i = 0, _a = this._spotLights; _i < _a.length; _i++) {
            var spotLight = _a[_i];
            spotLight.setPCSSArea(_pcssArea);
        }
        return this;
    };
    PointLight.prototype.setRadius = function (radius) {
        this._radius = radius;
        this.volume.setRadius(this._radius).build();
        for (var _i = 0, _a = this._spotLights; _i < _a.length; _i++) {
            var spotLight = _a[_i];
            spotLight.setRadius(radius);
        }
        return this;
    };
    PointLight.prototype.init = function (renderer) {
        var _this = this;
        this._shadowLevel = ShadowLevel.Hard;
        this._cubeTexture = new CubeTexture(renderer.gl)
            .setFormat(this.gl.RGBA)
            .setType(this.gl.FLOAT);
        this._spotLights = [0, 0, 0, 0, 0, 0].map(function () { return new SpotLight(renderer); });
        this.volume = new SphereGeometry(this.gl)
            .setRadius(this._radius)
            .build();
        var _loop_1 = function (i) {
            var spotLight = this_1._spotLights[i];
            spotLight.init(renderer).setConeAngle(Math.PI / 4);
            spotLight.shadowFrameBuffer.onInit(function (fbo) {
                fbo.attachments.color.asTargetTexture(_this._cubeTexture, _this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i);
            });
            spotLight.setParent(this_1);
        };
        var this_1 = this;
        for (var i = 0; i < this._spotLights.length; ++i) {
            _loop_1(i);
        }
        this._spotLights[0].lookAtLocal(vec3.fromValues(1, 0, 0), vec3.fromValues(0, -1, 0));
        this._spotLights[1].lookAtLocal(vec3.fromValues(-1, 0, 0), vec3.fromValues(0, -1, 0));
        this._spotLights[2].lookAtLocal(vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1));
        this._spotLights[3].lookAtLocal(vec3.fromValues(0, -1, 0), vec3.fromValues(0, 0, -1));
        this._spotLights[4].lookAtLocal(vec3.fromValues(0, 0, 1), vec3.fromValues(0, -1, 0));
        this._spotLights[5].lookAtLocal(vec3.fromValues(0, 0, -1), vec3.fromValues(0, -1, 0));
        return this;
    };
    PointLight.prototype.drawWithLightCamera = function (renderParam) {
        for (var _i = 0, _a = this._spotLights; _i < _a.length; _i++) {
            var spotLight = _a[_i];
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, spotLight.shadowFrameBuffer.active.glFramebuffer);
            spotLight.drawWithLightCamera(renderParam);
        }
    };
    PointLight.prototype.clearShadowFrameBuffer = function () {
        for (var _i = 0, _a = this._spotLights; _i < _a.length; _i++) {
            var spotLight = _a[_i];
            spotLight.clearShadowFrameBuffer();
        }
    };
    PointLight.prototype.getProjecttionBoundingBox2D = function (camera) {
        var viewMatrix = mat4.multiply(mat4.create(), camera.projectionMatrix, camera.worldToObjectMatrix);
        var viewDir = vec3.sub(vec3.create(), this.position, camera.position);
        var upSide = vec3.normalize(vec3.create(), camera.upVector);
        var rightSide = vec3.create();
        vec3.cross(rightSide, upSide, viewDir);
        vec3.normalize(rightSide, rightSide);
        vec3.scale(upSide, upSide, this.radius);
        vec3.scale(rightSide, rightSide, this.radius);
        var lightUpPoint = vec3.add(vec3.create(), this.position, upSide);
        var lightRightPoint = vec3.add(vec3.create(), this.position, rightSide);
        var screenPos = vec3.transformMat4(vec3.create(), this._position, viewMatrix);
        lightUpPoint = vec3.transformMat4(vec3.create(), lightUpPoint, viewMatrix);
        lightRightPoint = vec3.transformMat4(vec3.create(), lightRightPoint, viewMatrix);
        var screenH = Math.abs(vec3.len(vec3.sub(vec3.create(), lightUpPoint, screenPos)));
        var screenW = Math.abs(vec3.len(vec3.sub(vec3.create(), lightRightPoint, screenPos)));
        return {
            left: screenPos[0] - screenW,
            right: screenPos[0] + screenW,
            top: -screenPos[1] + screenH,
            bottom: -screenPos[1] - screenH
        };
    };
    return PointLight;
}(DampingLight));
export { PointLight };
//# sourceMappingURL=PointLight.js.map