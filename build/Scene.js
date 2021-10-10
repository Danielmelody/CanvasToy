var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { vec3 } from "gl-matrix";
import { DataType } from "./DataTypeEnum";
import { arrayOfStructures, textureArray, uniform } from "./Decorators";
import { DirectionalLight } from "./lights/DirectionalLight";
import { PointLight } from "./lights/PointLight";
import { ShadowLevel } from "./lights/ShadowLevel";
import { SpotLight } from "./lights/SpotLight";
var Scene = (function () {
    function Scene() {
        this.objects = [];
        this.lights = [];
        this.ambientLight = vec3.fromValues(0.2, 0.2, 0.2);
        this.openLight = false;
        this.clearColor = [0, 0, 0, 0];
        this.programSetUp = false;
        this.directLights = [];
        this.pointLights = [];
        this.spotLights = [];
        this.updateEvents = [];
        this._directLightShadowMap = [];
        this._spotLightShadowMap = [];
        this._pointLightShadowMap = [];
        this._directShadowDirty = true;
        this._pointShadowDirty = true;
        this._spotShadowDirty = true;
    }
    Object.defineProperty(Scene.prototype, "directLightShadowMap", {
        get: function () {
            this.resetLightShadows();
            return this._directLightShadowMap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "spotLightShadowMap", {
        get: function () {
            this.resetLightShadows();
            return this._spotLightShadowMap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "pointLightShadowMap", {
        get: function () {
            this.resetLightShadows();
            return this._pointLightShadowMap;
        },
        enumerable: false,
        configurable: true
    });
    Scene.prototype.resetLightShadows = function () {
        if (this._directShadowDirty) {
            this._directLightShadowMap = this.directLights
                .filter(function (light) { return light.shadowLevel > ShadowLevel.None; })
                .map(function (light) { return light.shadowMap; });
            this._directShadowDirty = false;
        }
        if (this._spotShadowDirty) {
            this._spotLightShadowMap = this.spotLights
                .filter(function (light) { return light.shadowLevel > ShadowLevel.None; })
                .map(function (light) { return light.shadowMap; });
            this._spotShadowDirty = false;
        }
        if (this._pointShadowDirty) {
            this._pointLightShadowMap = this.pointLights
                .filter(function (light) { return light.shadowLevel > ShadowLevel.None; })
                .map(function (light) { return light.shadowMap; });
            this._pointShadowDirty = false;
        }
    };
    Scene.prototype.update = function (dt) {
        for (var _i = 0, _a = this.updateEvents; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            if (!!event_1) {
                event_1(dt);
            }
        }
    };
    Scene.prototype.addOnUpdateListener = function (listener) {
        this.updateEvents.push(listener);
        return this;
    };
    Scene.prototype.removeOnUpdateListener = function (listener) {
        var index = this.updateEvents.indexOf(listener);
        if (index !== -1) {
            this.updateEvents[index] = undefined;
        }
        return this;
    };
    Scene.prototype.addObject = function () {
        var _this = this;
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objects[_i] = arguments[_i];
        }
        for (var _a = 0, objects_1 = objects; _a < objects_1.length; _a++) {
            var object = objects_1[_a];
            if (this.objects.indexOf(object) === -1) {
                this.objects.push(object);
                object.scene = this;
                object.children.forEach(function (child) {
                    _this.addObject(child);
                });
            }
        }
        return this;
    };
    Scene.prototype.removeObject = function (object) {
        var _this = this;
        object.children.forEach(function (child) {
            _this.removeObject(child);
        });
        this.objects.splice(this.objects.indexOf(object));
        return this;
    };
    Scene.prototype.addLight = function () {
        var lights = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            lights[_i] = arguments[_i];
        }
        this.openLight = true;
        var addonDirect = lights.filter(function (light) { return light instanceof DirectionalLight; });
        this.directLights = this.directLights.concat(addonDirect);
        this._directShadowDirty = addonDirect.length > 0;
        var addonPoint = lights.filter(function (light) {
            return light instanceof PointLight && !(light instanceof SpotLight);
        });
        this.pointLights = this.pointLights.concat(addonPoint);
        this._pointShadowDirty = addonPoint.length > 0;
        var addonSpot = lights.filter(function (light) { return light instanceof SpotLight; });
        this.spotLights = this.spotLights.concat(addonSpot);
        this._spotShadowDirty = addonSpot.length > 0;
        this.lights = this.lights.concat(lights);
    };
    __decorate([
        uniform(DataType.vec3, "ambient")
    ], Scene.prototype, "ambientLight", void 0);
    __decorate([
        arrayOfStructures()
    ], Scene.prototype, "directLights", void 0);
    __decorate([
        arrayOfStructures()
    ], Scene.prototype, "pointLights", void 0);
    __decorate([
        arrayOfStructures()
    ], Scene.prototype, "spotLights", void 0);
    __decorate([
        textureArray()
    ], Scene.prototype, "directLightShadowMap", null);
    __decorate([
        textureArray()
    ], Scene.prototype, "spotLightShadowMap", null);
    __decorate([
        textureArray()
    ], Scene.prototype, "pointLightShadowMap", null);
    return Scene;
}());
export { Scene };
//# sourceMappingURL=Scene.js.map