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
import { shaderPassLib } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { IMaterial } from "../Material";
var LinearDepthPackMaterial = (function (_super) {
    __extends(LinearDepthPackMaterial, _super);
    function LinearDepthPackMaterial() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinearDepthPackMaterial.prototype.initShader = function (gl) {
        return new ShaderBuilder()
            .resetShaderLib()
            .addShaderLib(ShaderSource.calculators__linearlize_depth_glsl)
            .addShaderLib(ShaderSource.calculators__packFloat1x32_glsl)
            .setShadingFrag(ShaderSource.interploters__forward__esm__depth_frag)
            .setShadingVert(ShaderSource.interploters__forward__esm__depth_vert)
            .setExtraRenderParamHolder("transform", {
            uniforms: {
                modelViewProjectionMatrix: shaderPassLib.uniforms.modelViewProjectionMatrix,
                modelViewMatrix: shaderPassLib.uniforms.modelViewMatrix,
            },
        })
            .setExtraRenderParamHolder("pcss", {
            defines: shaderPassLib.defines,
        })
            .build(gl);
    };
    return LinearDepthPackMaterial;
}(IMaterial));
export { LinearDepthPackMaterial };
//# sourceMappingURL=DepthPackMaterial.js.map