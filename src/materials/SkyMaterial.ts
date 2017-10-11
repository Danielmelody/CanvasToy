import { mat4 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { DataType } from "../DataTypeEnum";
import { texture } from "../Decorators";
import { Mesh } from "../Mesh";
import { ShaderBuilder } from "../shader/ShaderBuilder";
import { ShaderSource } from "../shader/shaders";
import { CubeTexture } from "../textures/CubeTexture";
import { Material } from "./Material";

export class SkyMaterial extends Material {

    @texture("uCubeTexture")
    public cubeTexture: CubeTexture;

    constructor(gl: WebGLRenderingContext, cubeTexture: CubeTexture) {
        super();
        this.cubeTexture = cubeTexture;
        this.shader = new ShaderBuilder()
            .resetShaderLib()
            .setShadingVert(ShaderSource.interploters__forward__skybox_vert)
            .setShadingFrag(ShaderSource.interploters__forward__skybox_frag)
            .setPass({
                faces: (mesh) => mesh.geometry.faces,
                uniforms: {
                    modelViewProjectionMatrix: {
                        type: DataType.mat4,
                        updator: (mesh: Mesh, camera: Camera) => {
                            return mat4.multiply(
                                mat4.create(),
                                camera.projectionMatrix,
                                mat4.multiply(mat4.create(),
                                    camera.worldToObjectMatrix,
                                    mesh.matrix),
                            );
                        },
                    },
                },
                attributes: {
                    position: (mesh) => mesh.geometry.attributes.position,
                },
            })
            .build(gl);
    }
}
