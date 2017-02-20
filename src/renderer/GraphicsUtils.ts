/// <reference path="../textures/Texture.ts"/>

namespace CanvasToy {
    export namespace Graphics {

        export function configTexture(gl: WebGLRenderingContext, texture: Texture) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.bindTexture(texture.target, texture.glTexture);
            gl.texParameteri(texture.target, gl.TEXTURE_WRAP_S, texture.wrapS);
            gl.texParameteri(texture.target, gl.TEXTURE_WRAP_T, texture.wrapT);
            gl.texParameteri(texture.target, gl.TEXTURE_MAG_FILTER, texture.magFilter);
            gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.minFilter);
            texture.setUpTextureData(gl);
        }

        export function copyDataToVertexBuffer(gl: WebGLRenderingContext, geometry: Geometry) {
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
        }

        export function logIfFrameBufferInvalid(
            gl: WebGLRenderingContext,
            frameBuffer: WebGLFramebuffer,
            ext: WebGLExtension,
        ) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            switch (status) {
                case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT :
                console.error(
                    `gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: The attachment types are mismatched
                    or not all framebuffer attachment points are framebuffer attachment complete.`,
                );
                break;
                case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT :
                console.error(
                    `gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: There is no attachment.`,
                );
                break;
                case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS :
                console.error(
                    `gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: Height and width of the attachment are not the same.`,
                );
                break;
                case gl.FRAMEBUFFER_UNSUPPORTED :
                console.error(
                    `gl.FRAMEBUFFER_UNSUPPORTED: The format of the attachment is not supported,
                    or if depth and stencil attachments are not the same renderbuffer.`,
                );
                break;
                default: break;
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
}
