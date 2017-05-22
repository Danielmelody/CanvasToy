import { mat4 } from "gl-matrix";
import { Camera } from "../../cameras/Camera";
import { DataType } from "../../DataTypeEnum";
import { texture } from "../../Decorators";
import { Mesh } from "../../Mesh";
import { defaultProgramPass, Program } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { Material } from "../Material";

export class DepthPackMaterial extends Material {
    constructor(gl: WebGLRenderingContext) {
        super();
        this.program = new ShaderBuilder()
            .resetShaderLib()
            .addShaderLib(ShaderSource.calculators__packFloat1x32_glsl)
            .setShadingFrag(ShaderSource.interploters__forward__esm__depth_frag)
            .setShadingVert(ShaderSource.interploters__forward__esm__depth_vert)
            .setPass({
                uniforms: {
                    modelViewProjectionMatrix: defaultProgramPass.uniforms.modelViewProjectionMatrix,
                },
                attributes: {
                    position: defaultProgramPass.attributes.position,
                },
            })
            .build(gl);
    }
}
