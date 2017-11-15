import { mat4, quat } from "gl-matrix";

import { DataType } from "../DataTypeEnum";
import { texture } from "../Decorators";

import { Program } from "../shader/Program";
import { ShaderBuilder } from "../shader/ShaderBuilder";
import { ShaderSource } from "../shader/shaders";
import { CubeTexture } from "../textures/CubeTexture";
import { Material } from "./Material";

export class SkyMaterial extends Material {

    @texture("uCubeTexture")
    public cubeTexture: CubeTexture;

    constructor(gl: WebGLRenderingContext, cubeTexture: CubeTexture) {
        super(gl);
        this.cubeTexture = cubeTexture;
    }

    protected initShader(gl: WebGLRenderingContext): Program {
        return new ShaderBuilder()
            .resetShaderLib()
            .setShadingVert(ShaderSource.interploters__forward__skybox_vert)
            .setShadingFrag(ShaderSource.interploters__forward__skybox_frag)
            .setExtraRenderParamHolder(
            "skyTransform",
            {
                uniforms: {
                    viewProjectionMatrix: {
                        type: DataType.mat4,
                        updator: ({ mesh, camera }) => {
                            let rotateOnlyViewMatrix = mat4.fromQuat(
                                mat4.create(),
                                mat4.getRotation(quat.create(),
                                    camera.matrix),
                            );
                            rotateOnlyViewMatrix = mat4.invert(mat4.create(), rotateOnlyViewMatrix);
                            return mat4.multiply(
                                mat4.create(),
                                camera.projectionMatrix,
                                rotateOnlyViewMatrix,
                            );
                        },
                    },
                },
            })
            .build(gl);
    }
}
