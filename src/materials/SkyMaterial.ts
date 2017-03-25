/// <reference path="Material.ts"/>

namespace CanvasToy {
    export class SkyMaterial extends Material {

        @texture("uCubeTexture")
        public cubeTexture: CubeTexture;

        constructor(gl: WebGLRenderingContext, cubeTexture: CubeTexture) {
            super();
            this.cubeTexture = cubeTexture;
            this.program = new ShaderBuilder()
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
}
