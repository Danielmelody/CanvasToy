import { vec2 } from "gl-matrix";

import { DataType } from "../../DataTypeEnum";
import { texture, uniform } from "../../Decorators";

import { Program } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { Texture2D } from "../../textures/Texture2D";
import { Material } from "../Material";

export class PCSSFilteringMaterial extends Material {

    @texture("uOrigin")
    public origin: Texture2D;

    @uniform(DataType.vec2, "uBlurDir")
    public blurDirection: vec2 = vec2.fromValues(1, 0);

    @uniform(DataType.float, "uBlurStep")
    public blurStep: number = 1.0;

    protected initShader(gl: WebGLRenderingContext): Program {
        return new ShaderBuilder()
            .resetShaderLib()
            .addShaderLib(ShaderSource.calculators__packFloat1x32_glsl)
            .addShaderLib(ShaderSource.calculators__unpackFloat1x32_glsl)
            .setShadingFrag(ShaderSource.interploters__forward__esm__blur_frag)
            .setShadingVert(ShaderSource.interploters__forward__esm__blur_vert)
            .build(gl);
    }
}
