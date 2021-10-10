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
import { structure, uniform, } from "../../Decorators";
import { shaderPassLib } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { ISurfaceMaterial } from "./ISurfaceMaterial";
var BlinnPhongMaterial = (function (_super) {
    __extends(BlinnPhongMaterial, _super);
    function BlinnPhongMaterial() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._diffuse = vec3.fromValues(0.8, 0.8, 0.8);
        _this._specular = vec3.fromValues(0.3, 0.3, 0.3);
        _this._specularExponent = 64;
        return _this;
    }
    Object.defineProperty(BlinnPhongMaterial.prototype, "diffuse", {
        get: function () { return this._diffuse; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BlinnPhongMaterial.prototype, "specular", {
        get: function () { return this._specular; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BlinnPhongMaterial.prototype, "specularExponent", {
        get: function () {
            return this._specularExponent;
        },
        enumerable: false,
        configurable: true
    });
    BlinnPhongMaterial.prototype.setDiffuse = function (_diffuse) {
        this._diffuse = _diffuse;
        return this;
    };
    BlinnPhongMaterial.prototype.setSpecular = function (_specular) {
        this._specular = _specular;
        return this;
    };
    BlinnPhongMaterial.prototype.setSpecularExponent = function (_specularExponent) {
        this._specularExponent = _specularExponent;
        return this;
    };
    BlinnPhongMaterial.prototype.initShader = function (gl) {
        return new ShaderBuilder()
            .addDefinition(ShaderSource.definitions__material_blinnphong_glsl)
            .setLightModel(ShaderSource.light_model__blinn_phong_glsl)
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
    __decorate([
        uniform(DataType.vec3)
    ], BlinnPhongMaterial.prototype, "diffuse", null);
    __decorate([
        uniform(DataType.vec3)
    ], BlinnPhongMaterial.prototype, "specular", null);
    __decorate([
        uniform(DataType.float)
    ], BlinnPhongMaterial.prototype, "specularExponent", null);
    BlinnPhongMaterial = __decorate([
        structure("uMaterial")
    ], BlinnPhongMaterial);
    return BlinnPhongMaterial;
}(ISurfaceMaterial));
export { BlinnPhongMaterial };
//# sourceMappingURL=BlinnPhongMaterial.js.map