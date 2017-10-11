import { mat4 } from "gl-matrix";
import { Camera } from "../../cameras/Camera";
import { DataType } from "../../DataTypeEnum";
import { texture } from "../../Decorators";
import { Mesh } from "../../Mesh";
import { defaultProgramPass, Program } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { Material } from "../Material";

export class LinearDepthPackMaterial extends Material {
    constructor(gl: WebGLRenderingContext) {
        super();
        this.shader = new ShaderBuilder()
            .resetShaderLib()
            .addShaderLib(ShaderSource.calculators__linearlize_depth_glsl)
            .addShaderLib(ShaderSource.calculators__packFloat1x32_glsl)
            .setShadingFrag(ShaderSource.interploters__forward__esm__depth_frag)
            .setShadingVert(ShaderSource.interploters__forward__esm__depth_vert)
            .setPass({
                uniforms: {
                    modelViewProjectionMatrix: defaultProgramPass.uniforms.modelViewProjectionMatrix,
                    modelViewMatrix: defaultProgramPass.uniforms.modelViewMatrix,
                    far: {
                        type: DataType.float,
                        updator: (mesh: Mesh, camera: Camera) => camera.far,
                    },
                    near: {
                        type: DataType.float,
                        updator: (mesh: Mesh, camera: Camera) => camera.near,
                    },
                },
                attributes: {
                    position: defaultProgramPass.attributes.position,
                },
            })
            .build(gl);
    }
}
