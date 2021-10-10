import { Program } from "./Program";
import { ShaderSource } from "./shaders";
var ShaderBuilder = (function () {
    function ShaderBuilder() {
        this.definitions = [
            ShaderSource.definitions__light_glsl,
        ];
        this.vertLibs = [];
        this.fragLibs = [
            ShaderSource.calculators__linearlize_depth_glsl,
            ShaderSource.calculators__types_glsl,
            ShaderSource.calculators__unpackFloat1x32_glsl,
            ShaderSource.calculators__shadow_factor_glsl,
            ShaderSource.debug__checkBox_glsl,
        ];
        this.lightModel = ShaderSource.light_model__pbs_ggx_glsl;
        this.shadingVert = ShaderSource.interploters__forward__phong_vert;
        this.shadingFrag = ShaderSource.interploters__forward__phong_frag;
        this.extraRenderParamHolders = {};
    }
    ShaderBuilder.prototype.resetShaderLib = function () {
        this.lightModel = undefined;
        this.definitions = [];
        this.vertLibs = [];
        this.fragLibs = [];
        return this;
    };
    ShaderBuilder.prototype.addShaderLib = function () {
        var _a, _b;
        var lib = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            lib[_i] = arguments[_i];
        }
        (_a = this.vertLibs).push.apply(_a, lib);
        (_b = this.fragLibs).push.apply(_b, lib);
        return this;
    };
    ShaderBuilder.prototype.addDefinition = function () {
        var _a;
        var lib = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            lib[_i] = arguments[_i];
        }
        (_a = this.definitions).push.apply(_a, lib);
        return this;
    };
    ShaderBuilder.prototype.addShaderLibVert = function () {
        var _a;
        var lib = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            lib[_i] = arguments[_i];
        }
        (_a = this.vertLibs).push.apply(_a, lib);
        return this;
    };
    ShaderBuilder.prototype.addShaderLibFrag = function () {
        var _a;
        var lib = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            lib[_i] = arguments[_i];
        }
        (_a = this.fragLibs).push.apply(_a, lib);
        return this;
    };
    ShaderBuilder.prototype.setLightModel = function (model) {
        this.lightModel = model;
        return this;
    };
    ShaderBuilder.prototype.setShadingVert = function (vert) {
        this.shadingVert = vert;
        return this;
    };
    ShaderBuilder.prototype.setShadingFrag = function (frag) {
        this.shadingFrag = frag;
        return this;
    };
    ShaderBuilder.prototype.setExtraRenderParamHolder = function (name, paramHolder) {
        this.extraRenderParamHolders[name] = paramHolder;
        return this;
    };
    ShaderBuilder.prototype.build = function (gl) {
        return new Program(gl, {
            vertexShader: this.definitions.join("\n") + "\n" + this.vertLibs.join("\n") + this.shadingVert,
            fragmentShader: this.definitions.join("\n") + "\n" + (this.lightModel ? this.lightModel + "\n" : "")
                + this.fragLibs.join("\n") + this.shadingFrag,
        }, this.extraRenderParamHolders);
    };
    return ShaderBuilder;
}());
export { ShaderBuilder };
//# sourceMappingURL=ShaderBuilder.js.map