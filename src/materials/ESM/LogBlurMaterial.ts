import { vec2 } from "gl-matrix";
import { DataType } from "../../DataTypeEnum";
import { texture, uniform } from "../../Decorators";
import { Program, shaderPassLib } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { Texture } from "../../textures/Texture";
import { IMaterial } from "../Material";
export class PCSSFilteringMaterial extends IMaterial {
  @texture("uOrigin")
  public origin: Texture;

  @uniform(DataType.vec2, "uBlurDir")
  public blurDirection: vec2 = vec2.fromValues(1, 0);

  @uniform(DataType.float, "uBlurStep")
  public blurStep: number = 0.01;

  protected initShader(gl: WebGLRenderingContext): Program {
    return new ShaderBuilder()
        .resetShaderLib()
        .setShadingFrag(
        ShaderSource.interploters__forward__esm__prefiltering_frag,
        )
        .setShadingVert(
        ShaderSource.interploters__forward__esm__prefiltering_vert,
        )
        .setExtraRenderParamHolder("pcss", {
        defines: shaderPassLib.defines,
        })
        .build(gl);
  }
}
