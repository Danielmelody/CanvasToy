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
import { define, readyRequire, structure, texture, uniform, } from "../../Decorators";
import { shaderPassLib } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { IMaterial } from "../Material";
var ISurfaceMaterial = (function (_super) {
    __extends(ISurfaceMaterial, _super);
    function ISurfaceMaterial() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._debug = false;
        _this._blockShadow = true;
        _this._receiveShadow = true;
        _this._ambient = vec3.fromValues(0.1, 0.1, 0.1);
        _this._transparency = 0;
        _this._reflectivity = 1;
        return _this;
    }
    Object.defineProperty(ISurfaceMaterial.prototype, "geometryShader", {
        get: function () {
            if (!this._geometryShader) {
                this._geometryShader = new ShaderBuilder()
                    .resetShaderLib()
                    .addDefinition(ShaderSource.definitions__material_pbs_glsl)
                    .addShaderLib(ShaderSource.calculators__packFloat1x32_glsl)
                    .setShadingVert(ShaderSource.interploters__deferred__geometry_vert)
                    .setShadingFrag(ShaderSource.interploters__deferred__geometry_frag)
                    .setExtraRenderParamHolder("mvp", {
                    uniforms: {
                        modelViewProjectionMatrix: shaderPassLib.uniforms.modelViewProjectionMatrix,
                        normalViewMatrix: shaderPassLib.uniforms.normalViewMatrix,
                    },
                })
                    .build(this.gl);
                this._geometryShader.extensionStatements.push("#extension GL_EXT_draw_buffers : require");
            }
            return this._geometryShader;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ISurfaceMaterial.prototype, "debugMode", {
        get: function () {
            return this._debug;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ISurfaceMaterial.prototype, "blockShadow", {
        get: function () {
            return this._blockShadow;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ISurfaceMaterial.prototype, "receiveShadow", {
        get: function () {
            return this._receiveShadow;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ISurfaceMaterial.prototype, "mainTexture", {
        get: function () {
            return this._mainTexture;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ISurfaceMaterial.prototype, "ambient", {
        get: function () {
            return this._ambient;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ISurfaceMaterial.prototype, "transparency", {
        get: function () {
            return this._transparency;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ISurfaceMaterial.prototype, "alphaMap", {
        get: function () {
            return this._alphaMap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ISurfaceMaterial.prototype, "bumpMap", {
        get: function () {
            return this._bumpMap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ISurfaceMaterial.prototype, "displamentMap", {
        get: function () {
            return this._displamentMap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ISurfaceMaterial.prototype, "stencilMap", {
        get: function () {
            return this.stencilMap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ISurfaceMaterial.prototype, "environmentMap", {
        get: function () {
            return this._environmentMap;
        },
        enumerable: false,
        configurable: true
    });
    ISurfaceMaterial.prototype.setDebugMode = function (_debug) {
        this._debug = _debug;
        return this;
    };
    ISurfaceMaterial.prototype.setCastShadow = function (_castShadow) {
        this._blockShadow = _castShadow;
        return this;
    };
    ISurfaceMaterial.prototype.setRecieveShadow = function (_receiveShadow) {
        this._receiveShadow = _receiveShadow;
        return this;
    };
    ISurfaceMaterial.prototype.setMainTexture = function (_texture) {
        this._mainTexture = _texture;
        return this;
    };
    ISurfaceMaterial.prototype.setAmbient = function (_ambient) {
        this._ambient = _ambient;
        return this;
    };
    ISurfaceMaterial.prototype.setTransparency = function (_transparency) {
        console.assert(_transparency >= 0 && _transparency <= 1);
        this._transparency = _transparency;
        return this;
    };
    ISurfaceMaterial.prototype.setAlphaMap = function (_alphaMap) {
        this._alphaMap = _alphaMap;
        return this;
    };
    ISurfaceMaterial.prototype.setBumpMap = function (_bumpMap) {
        this._bumpMap = _bumpMap;
        return this;
    };
    ISurfaceMaterial.prototype.setDisplamentMap = function (_displamentMap) {
        this._displamentMap = _displamentMap;
        return this;
    };
    ISurfaceMaterial.prototype.setStencilMap = function (_stencilMap) {
        this._stencilMap = _stencilMap;
        return this;
    };
    ISurfaceMaterial.prototype.setReflectivity = function (_reflectivity) {
        this._reflectivity = _reflectivity;
        return this;
    };
    ISurfaceMaterial.prototype.setEnvironmentMap = function (_environmentMap) {
        this._environmentMap = _environmentMap;
        return this;
    };
    ISurfaceMaterial.prototype.initShader = function (gl) {
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
    __decorate([
        define("_DEBUG")
    ], ISurfaceMaterial.prototype, "_debug", void 0);
    __decorate([
        define("RECEIVE_SHADOW", true)
    ], ISurfaceMaterial.prototype, "_receiveShadow", void 0);
    __decorate([
        define("_MAIN_TEXTURE"),
        texture("uMainTexture")
    ], ISurfaceMaterial.prototype, "_mainTexture", void 0);
    __decorate([
        readyRequire
    ], ISurfaceMaterial.prototype, "_bumpMap", void 0);
    __decorate([
        readyRequire
    ], ISurfaceMaterial.prototype, "_displamentMap", void 0);
    __decorate([
        readyRequire
    ], ISurfaceMaterial.prototype, "_stencilMap", void 0);
    __decorate([
        uniform(DataType.float, "reflectivity")
    ], ISurfaceMaterial.prototype, "_reflectivity", void 0);
    __decorate([
        define("_ENVIRONMENT_MAP"),
        texture("uCubeTexture")
    ], ISurfaceMaterial.prototype, "_environmentMap", void 0);
    __decorate([
        uniform(DataType.vec3)
    ], ISurfaceMaterial.prototype, "ambient", null);
    ISurfaceMaterial = __decorate([
        structure("uMaterial")
    ], ISurfaceMaterial);
    return ISurfaceMaterial;
}(IMaterial));
export { ISurfaceMaterial };
//# sourceMappingURL=ISurfaceMaterial.js.map