namespace CanvasToy {
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
}
