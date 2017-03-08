/// <reference path="Material.ts"/>

namespace CanvasToy {
    export class SkyMaterial extends Material {

        @readyRequire
        public cubeTexture: CubeTexture;

        constructor(gl: WebGLRenderingContext, cubeTexture: CubeTexture) {
            super();
            this.cubeTexture = cubeTexture;
            this.program = new Program(
                gl,
                {
                    vertexShader: interploters__skybox_vert,
                    fragmentShader: interploters__skybox_frag,
                },
                {
                    faces: (mesh) => mesh.geometry.faces,
                    textures: {
                        uMainTexture: (mesh, camera, material) => material.mainTexture,
                    },
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
                },
            );
        }
    }
}
