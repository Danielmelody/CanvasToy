/// <reference path="../../Scene.ts"/>
/// <reference path="../../cameras/Camera.ts"/>
/// <reference path="../../Mesh.ts"/>
/// <reference path="../../shader/Program.ts"/>
/// <reference path="../GraphicsUtils.ts"/>
/// <reference path="../IExtension.ts"/>

namespace CanvasToy {
    export class DeferredProcessor implements IProcessor {

        public readonly gBuffer: FrameBuffer;

        public readonly geometryPass: {} = {};

        public readonly gl: WebGLRenderingContext;

        public readonly ext: WebGLExtension;

        constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene, camera: Camera) {
            this.gl = gl;
            this.ext = ext;
            this.gBuffer = new FrameBuffer(gl);
            for (const object of scene.objects) {
                if (object instanceof Mesh) {
                    Graphics.copyDataToVertexBuffer(this.gl, (object as Mesh).geometry);
                }
            }
            this.initGeometryProcess(scene);
            scene.programSetUp = true;
        }

        public process(scene: Scene, camera: Camera, materials: Material[]) {
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthMask(true);
            this.gl.clearDepth(1.0);
            this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
            this.gl.blendFunc(this.gl.ONE, this.gl.ZERO);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.cullFace(this.gl.BACK);
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            Graphics.logIfFrameBufferInvalid(this.gl, this.gBuffer.glFramebuffer, this.ext);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.gBuffer.glFramebuffer);
            for (const object of scene.objects) {
                if (object instanceof Mesh) {
                    const mesh = object as Mesh;
                    this.gl.useProgram(this.geometryPass[mesh as any].webGlProgram);
                    for (const material of mesh.materials) {
                        if (material.dirty) {
                            this.geometryPass[mesh as any].resetMaterialDefines(material);
                            this.geometryPass[mesh as any].make(mesh.scene);
                            material.dirty = false;
                        }
                        this.geometryPass[mesh as any].pass(mesh, camera, material);
                        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
                        this.gl.drawElements(
                            this.gl.TRIANGLES,
                            mesh.geometry.faces.data.length,
                            this.gl.UNSIGNED_SHORT,
                            0,
                        );
                    }
                }
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }

        private initGeometryProcess(scene: Scene) {
            this.gBuffer.attachments.color.disable();
            this.gBuffer.attachments.depth.setType(this.gl, AttachmentType.Texture);
            this.gBuffer.extras.push(
                new Attachment(this.gBuffer, (ext: WebGLDrawBuffers) => ext.COLOR_ATTACHMENT0_WEBGL)
                    .setType(this.gl, AttachmentType.Texture),
                new Attachment(this.gBuffer, (ext: WebGLDrawBuffers) => ext.COLOR_ATTACHMENT1_WEBGL)
                    .setType(this.gl, AttachmentType.Texture),
                new Attachment(this.gBuffer, (ext: WebGLDrawBuffers) => ext.COLOR_ATTACHMENT2_WEBGL)
                    .setType(this.gl, AttachmentType.Texture),
            );
            this.gBuffer.attachments.depth.targetTexture
                .setType(this.gl.UNSIGNED_SHORT)
                .setFormat(this.gl.DEPTH_COMPONENT)
                .setUpTextureData(this.gl);
            for (const colorAttach of this.gBuffer.extras) {
                    colorAttach.targetTexture
                        .setType(this.gl.FLOAT)
                        .setFormat(this.gl.RGBA)
                        .setMinFilter(this.gl.LINEAR)
                        .setMagFilter(this.gl.LINEAR)
                        .setUpTextureData(this.gl);
            }

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.gBuffer.glFramebuffer);
            this.gl.bindTexture(
                this.gl.TEXTURE_2D,
                this.gBuffer.attachments.depth.targetTexture.glTexture,
            );
            this.gl.texImage2D(this.gl.TEXTURE_2D,
                0,
                this.gBuffer.attachments.depth.targetTexture.format,
                this.gl.canvas.width,
                this.gl.canvas.height,
                0,
                this.gBuffer.attachments.depth.targetTexture.format,
                this.gBuffer.attachments.depth.targetTexture.type,
                null,
            );
            this.gl.framebufferTexture2D(
                this.gl.FRAMEBUFFER,
                this.gBuffer.attachments.depth.attachmentCode(this.gl),
                this.gl.TEXTURE_2D,
                this.gBuffer.attachments.depth.targetTexture.glTexture,
                0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);

            for (const attachment of this.gBuffer.extras) {
                this.gl.bindTexture(this.gl.TEXTURE_2D, attachment.targetTexture.glTexture);
                this.gl.texImage2D(this.gl.TEXTURE_2D,
                    0,
                    attachment.targetTexture.format,
                    this.gl.canvas.width,
                    this.gl.canvas.height,
                    0,
                    attachment.targetTexture.format,
                    attachment.targetTexture.type,
                    null,
                );
                this.gl.framebufferTexture2D(
                    this.gl.FRAMEBUFFER,
                    attachment.attachmentCode(this.ext.draw_buffer),
                    this.gl.TEXTURE_2D,
                    attachment.targetTexture.glTexture,
                    0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            }
            Graphics.logIfFrameBufferInvalid(this.gl, this.gBuffer.glFramebuffer, this.ext);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.gBuffer.glFramebuffer);
            this.ext.draw_buffer.drawBuffersWEBGL([
                this.ext.draw_buffer.COLOR_ATTACHMENT0_WEBGL,
                this.ext.draw_buffer.COLOR_ATTACHMENT1_WEBGL,
                this.ext.draw_buffer.COLOR_ATTACHMENT2_WEBGL,
                this.ext.draw_buffer.COLOR_ATTACHMENT3_WEBGL,
            ]);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            for (const object of scene.objects) {
                if (object instanceof Mesh) {
                    const geometryProgram = new Program(
                        this.gl,
                        {
                            vertexShader: interploters__deferred__geometry_vert,
                            fragmentShader: interploters__deferred__geometry_frag,
                        },
                        defaultProgramPass,
                    );
                    geometryProgram.deleteUniform("materialDiff")
                        .deleteUniform("materialSpec");
                    geometryProgram.extensionStatements.push("#extension GL_EXT_draw_buffers : require");
                    geometryProgram.make(scene);
                    this.geometryPass[(object as any)] = geometryProgram;
                }
            }
        }

        private gBufferProcess() {
        }
    }
}
