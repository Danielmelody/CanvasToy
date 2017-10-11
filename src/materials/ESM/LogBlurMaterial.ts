import { mat4, vec2 } from "gl-matrix";
import { Camera } from "../../cameras/Camera";
import { DataType } from "../../DataTypeEnum";
import { texture, uniform } from "../../Decorators";
import { Mesh } from "../../Mesh";
import { defaultProgramPass, Program } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { Texture2D } from "../../textures/Texture2D";
import { Material } from "../Material";
export class LogBlurMaterial extends Material {

    @texture("uOrigin")
    public origin: Texture2D;

    @uniform("uBlurDir", DataType.vec2)
    public blurDirection: vec2 = vec2.fromValues(1, 0);

    @uniform("uBlurStep", DataType.float)
    public blurStep: number = 1.0;

    constructor(gl: WebGLRenderingContext) {
        super();
        this.shader = new ShaderBuilder()
            .resetShaderLib()
            .addShaderLib(ShaderSource.calculators__packFloat1x32_glsl)
            .addShaderLib(ShaderSource.calculators__unpackFloat1x32_glsl)
            .setShadingFrag(ShaderSource.interploters__forward__esm__blur_frag)
            .setShadingVert(ShaderSource.interploters__forward__esm__blur_vert)
            .setPass({
                uniforms: {
                    normalMatrix: defaultProgramPass.uniforms.normalViewMatrix,
                },
                attributes: {
                    position: defaultProgramPass.attributes.position,
                    normal: defaultProgramPass.attributes.aNormal,
                },
            })
            .build(gl);
    }
}
