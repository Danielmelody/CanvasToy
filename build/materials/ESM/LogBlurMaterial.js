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
import { vec2 } from "gl-matrix";
import { DataType } from "../../DataTypeEnum";
import { texture, uniform } from "../../Decorators";
import { shaderPassLib } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { IMaterial } from "../Material";
var PCSSFilteringMaterial = (function (_super) {
    __extends(PCSSFilteringMaterial, _super);
    function PCSSFilteringMaterial() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.blurDirection = vec2.fromValues(1, 0);
        _this.blurStep = 0.01;
        return _this;
    }
    PCSSFilteringMaterial.prototype.initShader = function (gl) {
        return new ShaderBuilder()
            .resetShaderLib()
            .setShadingFrag(ShaderSource.interploters__forward__esm__prefiltering_frag)
            .setShadingVert(ShaderSource.interploters__forward__esm__prefiltering_vert)
            .setExtraRenderParamHolder("pcss", {
            defines: shaderPassLib.defines,
        })
            .build(gl);
    };
    __decorate([
        texture("uOrigin")
    ], PCSSFilteringMaterial.prototype, "origin", void 0);
    __decorate([
        uniform(DataType.vec2, "uBlurDir")
    ], PCSSFilteringMaterial.prototype, "blurDirection", void 0);
    __decorate([
        uniform(DataType.float, "uBlurStep")
    ], PCSSFilteringMaterial.prototype, "blurStep", void 0);
    return PCSSFilteringMaterial;
}(IMaterial));
export { PCSSFilteringMaterial };
//# sourceMappingURL=LogBlurMaterial.js.map