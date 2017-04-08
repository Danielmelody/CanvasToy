/// <reference path="../textures/Texture.ts"/>

namespace CanvasToy {
    export namespace Graphics {

        export function addUniformContainer(program: Program, uniformContainer) {
            if (Array.isArray(uniformContainer.uniforms)) {
                for (const uniformProperty of uniformContainer.uniforms) {
                    if (uniformProperty.updator(uniformContainer) !== undefined) {
                        program.addUniform(uniformProperty.name, {
                            type: uniformProperty.type,
                            updator: () => {
                                return uniformProperty.updator(uniformContainer);
                            },
                        });
                    }
                }
            }
            if (Array.isArray(uniformContainer.uniformArray)) {
                for (const uniformArrayProperty of uniformContainer.uniformArray) {
                    if (uniformArrayProperty.updator(uniformContainer) !== undefined) {
                        program.addUniformArray(
                            uniformArrayProperty.name,
                            {
                                type: uniformArrayProperty.type,
                                updator: () => uniformArrayProperty.updator(uniformContainer),
                            },
                        );
                    }
                }
            }
        }

        export function addTextureContainer(program: Program, textureContainer) {
            if (Array.isArray(textureContainer.textures)) {
                for (const textureDiscriptor of textureContainer.textures) {
                    if (textureDiscriptor.getter(textureContainer) !== undefined) {
                        program.addTexture(
                            textureDiscriptor.name,
                            () => textureDiscriptor.getter(textureContainer),
                        );
                    }
                }
            }
            if (Array.isArray(textureContainer.textureArrays)) {
                for (const textureArrayDiscriptor of textureContainer.textureArrays) {
                    if (textureArrayDiscriptor.arrayGetter(textureContainer) !== undefined) {
                        program.addTextureArray(
                            textureArrayDiscriptor.name,
                            () => textureArrayDiscriptor.arrayGetter(textureContainer),
                        );
                    }
                }
            }
        }

        export function copyDataToVertexBuffer(gl: WebGLRenderingContext, geometry: Geometry) {
            if (geometry.dirty) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.faces.buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                    new Uint16Array(geometry.faces.data), gl.STATIC_DRAW);
                for (const name in geometry.attributes) {
                    const attribute: Attribute = geometry.attributes[name];
                    if (attribute !== undefined) {
                        gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attribute.data), gl.STATIC_DRAW);
                        console.log(`${name} buffer size: `,
                            `${gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE)}`);
                    }
                }
                geometry.dirty = false;
            }
        }

        export function logEnabledAttribute(gl: WebGLRenderingContext, program: WebGLProgram) {
            for (let i = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) - 1; i >= 0; i--) {
                console.dir(gl.getActiveAttrib(program, i));
            }
        }

        export function logIfFrameBufferInvalid(
            gl: WebGLRenderingContext,
            frameBuffer: WebGLFramebuffer,
        ) {
            let valid = false;
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            switch (status) {
                case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                    console.error(
                        `gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: The attachment types are mismatched
                    or not all framebuffer attachment points are framebuffer attachment complete.`,
                    );
                    break;
                case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                    console.error(
                        `gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: There is no attachment.`,
                    );
                    break;
                case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                    console.error(
                        `gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: Height and width of the attachment are not the same.`,
                    );
                    break;
                case gl.FRAMEBUFFER_UNSUPPORTED:
                    console.error(
                        `gl.FRAMEBUFFER_UNSUPPORTED: The format of the attachment is not supported,
                    or if depth and stencil attachments are not the same renderbuffer.`,
                    );
                    break;
                default:
                    valid = true;
                    break;
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return valid;
        }
    }
}
