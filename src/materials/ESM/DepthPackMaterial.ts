import { Program, shaderPassLib } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { IMaterial } from "../Material";

export class LinearDepthPackMaterial extends IMaterial {
  protected initShader(gl: WebGLRenderingContext): Program {
    return new ShaderBuilder()
        .resetShaderLib()
        .addShaderLib(ShaderSource.calculators__linearlize_depth_glsl)
        .addShaderLib(ShaderSource.calculators__packFloat1x32_glsl)
        .setShadingFrag(ShaderSource.interploters__forward__esm__depth_frag)
        .setShadingVert(ShaderSource.interploters__forward__esm__depth_vert)
        .setExtraRenderParamHolder("transform", {
        uniforms: {
            modelViewProjectionMatrix:
            shaderPassLib.uniforms.modelViewProjectionMatrix,
            modelViewMatrix: shaderPassLib.uniforms.modelViewMatrix,
        },
        })
        .setExtraRenderParamHolder("pcss", {
        defines: shaderPassLib.defines,
        })
        .build(gl);
  }
}
