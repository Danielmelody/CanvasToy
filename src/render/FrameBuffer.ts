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
        public glRenderBuffer: WebGLRenderbuffer = gl.createRenderbuffer();
        public targetTexture: Texture;
        constructor(frameBuffer: FrameBuffer) {
            this.frameBuffer = frameBuffer;
        }
        public toTexture(): Texture {
            this.targetTexture = new Texture();
            return this.targetTexture;
        }
    }

    export class FrameBuffer {
        public glFramebuffer: WebGLFramebuffer = gl.createFramebuffer();
        public rbos: any = {};
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

        public enableRenderBuffer(usage: BufferUsage) {
            switch (usage) {
                case BufferUsage.Color:
                    this.rbos.color = new RenderBuffer(this);
                    this.rbos.color.attachment = gl.COLOR_ATTACHMENT0;
                    break;
                case BufferUsage.Depth:
                    this.rbos.depth = new RenderBuffer(this);
                    this.rbos.depth.attachment = gl.DEPTH_ATTACHMENT;
                    break;
                case BufferUsage.Stencil:
                    this.rbos.stencil = new RenderBuffer(this);
                    this.rbos.stencil.attachment = gl.STENCIL_ATTACHMENT;
                    break;
                default:
                    this.rbos.color = new RenderBuffer(this);
                    this.rbos.color.attachment = gl.COLOR_ATTACHMENT0;
                    break;
            }
        }
    }
}
