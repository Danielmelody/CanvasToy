import { mat4 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { DataType } from "../DataTypeEnum";
import { texture } from "../Decorators";
import { Mesh } from "../Mesh";
import { defaultProgramPass, Program } from "../shader/Program";
import { ShaderBuilder } from "../shader/ShaderBuilder";
import { ShaderSource } from "../shader/shaders";
import { Material } from "./Material";

export class DepthMaterial extends Material {
    constructor(gl: WebGLRenderingContext) {
        super();
        this.program = new ShaderBuilder()
            .resetShaderLib()
            .addShaderLib(ShaderSource.calculators__linearlize_depth_glsl)
            .setShadingFrag(ShaderSource.interploters__depth_phong_frag)
            .setShadingVert(ShaderSource.interploters__depth_phong_vert)
            .setPass({
                uniforms: {
                    modelViewProjectionMatrix: defaultProgramPass.uniforms.modelViewProjectionMatrix,
                    modelViewMatrix: defaultProgramPass.uniforms.modelViewMatrix,
                    cameraFar: {
                        type: DataType.float,
                        updator: (mesh, lightCamera: Camera) => lightCamera.far,
                    },
                    cameraNear: {
                        type: DataType.float,
                        updator: (mesh, lightCamera: Camera) => lightCamera.near,
                    },
                },
                attributes: {
                    position: defaultProgramPass.attributes.position,
                },
            })
            .build(gl);
    }
}
