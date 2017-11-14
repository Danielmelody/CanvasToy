import { mat4 } from "gl-matrix";
import { Camera } from "../../cameras/Camera";
import { DataType } from "../../DataTypeEnum";
import { texture } from "../../Decorators";
import { Mesh } from "../../Mesh";
import { IBuildinRenderParamMaps, Program, shaderPassLib } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { Material } from "../Material";

export class LinearDepthPackMaterial extends Material {

    protected initShader(gl: WebGLRenderingContext): Program {
        return new ShaderBuilder()
            .resetShaderLib()
            .addShaderLib(ShaderSource.calculators__linearlize_depth_glsl)
            .addShaderLib(ShaderSource.calculators__packFloat1x32_glsl)
            .setShadingFrag(ShaderSource.interploters__forward__esm__depth_frag)
            .setShadingVert(ShaderSource.interploters__forward__esm__depth_vert)
            .setExtraRenderParamHolder(
            "transform",
            {
                uniforms: {
                    modelViewProjectionMatrix: shaderPassLib.uniforms.modelViewProjectionMatrix,
                    modelViewMatrix: shaderPassLib.uniforms.modelViewMatrix,
                },
            })
            .build(gl);
    }
}
