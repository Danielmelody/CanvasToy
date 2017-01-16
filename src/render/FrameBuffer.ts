/// <reference path="../CanvasToy.ts"/>
/// <reference path="../textures/Texture.ts"/>

namespace CanvasToy {
    export enum BufferUsage {
        Color,
        Depth,
        Stencil,
    }

    export class RenderBuffer {
        public readonly frameBuffer: FrameBuffer;
        public attachment: number;
        public glRenderBuffer: WebGLRenderbuffer;
        public targetTexture: Texture;
        constructor(gl: WebGLRenderingContext, frameBuffer: FrameBuffer) {
            this.frameBuffer = frameBuffer;
            this.glRenderBuffer = gl.createRenderbuffer();
        }
        public toTexture(gl: WebGLRenderingContext): Texture {
            this.targetTexture = new Texture(gl);
            return this.targetTexture;
        }
    }

    export class FrameBuffer {
        public glFramebuffer: WebGLFramebuffer;
        public rbos: any = {};

        constructor(gl: WebGLRenderingContext) {
            this.glFramebuffer = gl.createFramebuffer();
        }

        public getRenderBuffer(usage: BufferUsage): RenderBuffer {
            switch (usage) {
                case BufferUsage.Color:
                    return this.rbos.color as RenderBuffer;
                case BufferUsage.Depth:
                    return this.rbos.depth as RenderBuffer;
                case BufferUsage.Stencil:
                    return this.rbos.stencil as RenderBuffer;
                default:
                    return this.rbos.color as RenderBuffer;
            }
        }

        public enableRenderBuffer(gl: WebGLRenderingContext, usage: BufferUsage) {
            switch (usage) {
                case BufferUsage.Color:
                    this.rbos.color = new RenderBuffer(gl, this);
                    this.rbos.color.attachment = gl.COLOR_ATTACHMENT0;
                    break;
                case BufferUsage.Depth:
                    this.rbos.depth = new RenderBuffer(gl, this);
                    this.rbos.depth.attachment = gl.DEPTH_ATTACHMENT;
                    break;
                case BufferUsage.Stencil:
                    this.rbos.stencil = new RenderBuffer(gl, this);
                    this.rbos.stencil.attachment = gl.STENCIL_ATTACHMENT;
                    break;
                default:
                    this.rbos.color = new RenderBuffer(gl, this);
                    this.rbos.color.attachment = gl.COLOR_ATTACHMENT0;
                    break;
            }
        }
    }
}
