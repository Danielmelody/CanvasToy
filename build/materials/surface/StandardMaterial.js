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
import { DataType } from "../../DataTypeEnum";
import { define, structure, texture, uniform } from "../../Decorators";
import { shaderPassLib } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { ISurfaceMaterial } from "./ISurfaceMaterial";
var StandardMaterial = (function (_super) {
    __extends(StandardMaterial, _super);
    function StandardMaterial() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._albedo = vec3.fromValues(0.8, 0.8, 0.8);
        _this._metallic = 0.8;
        _this._roughness = 0.5;
        return _this;
    }
    StandardMaterial_1 = StandardMaterial;
    StandardMaterial.fromLaggard = function (gl, blinnPhong) {
        var standard = new StandardMaterial_1(gl);
        standard.name = blinnPhong.name;
        standard
            .setAlbedo(blinnPhong.diffuse)
            .setAmbient(blinnPhong.ambient)
            .setAlphaMap(blinnPhong.alphaMap)
            .setBumpMap(blinnPhong.bumpMap)
            .setTransparency(blinnPhong.transparency)
            .setMainTexture(blinnPhong.mainTexture)
            .setCastShadow(blinnPhong.blockShadow)
            .setRecieveShadow(blinnPhong.receiveShadow)
            .setDebugMode(blinnPhong.debugMode)
            .setEnvironmentMap(blinnPhong.environmentMap);
        return standard;
    };
    Object.defineProperty(StandardMaterial.prototype, "albedo", {
        get: function () {
            return this._albedo;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial.prototype, "metallic", {
        get: function () {
            return this._metallic;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial.prototype, "roughness", {
        get: function () {
            return this._roughness;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StandardMaterial.prototype, "stencilMap", {
        get: function () {
            return this.stencilMap;
        },
        enumerable: false,
        configurable: true
    });
    StandardMaterial.prototype.setAlbedo = function (_albedo) {
        this._albedo = _albedo;
        return this;
    };
    StandardMaterial.prototype.setMetallic = function (_metallic) {
        this._metallic = _metallic;
        return this;
    };
    StandardMaterial.prototype.setRoughness = function (_roughness) {
        this._roughness = _roughness;
        return this;
    };
    StandardMaterial.prototype.initShader = function (gl) {
        return new ShaderBuilder()
            .addDefinition(ShaderSource.definitions__material_pbs_glsl)
            .setLightModel(ShaderSource.light_model__pbs_ggx_glsl)
            .setExtraRenderParamHolder("mvp", {
            uniforms: {
                modelViewProjectionMatrix: shaderPassLib.uniforms.modelViewProjectionMatrix,
            },
        })
            .setExtraRenderParamHolder("pcss", {
            defines: shaderPassLib.defines,
        })
            .build(gl);
    };
    var StandardMaterial_1;
    __decorate([
        define("_METALLIC_TEXTURE"),
        texture("uMetallicTexture")
    ], StandardMaterial.prototype, "_metallicTexture", void 0);
    __decorate([
        uniform(DataType.vec3)
    ], StandardMaterial.prototype, "albedo", null);
    __decorate([
        uniform(DataType.float)
    ], StandardMaterial.prototype, "metallic", null);
    __decorate([
        uniform(DataType.float)
    ], StandardMaterial.prototype, "roughness", null);
    StandardMaterial = StandardMaterial_1 = __decorate([
        structure("uMaterial")
    ], StandardMaterial);
    return StandardMaterial;
}(ISurfaceMaterial));
export { StandardMaterial };
//# sourceMappingURL=StandardMaterial.js.map