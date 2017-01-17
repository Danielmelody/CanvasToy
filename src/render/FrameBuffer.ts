/// <reference path="../CanvasToy.ts"/>
/// <reference path="../textures/Texture.ts"/>

namespace CanvasToy {

    export enum AttachmentType {
        Texture,
        RenderBuffer,
    }

    export class Attachment {
        public readonly frameBuffer: FrameBuffer;
        public glRenderBuffer: WebGLRenderbuffer;
        public targetTexture: Texture;
        public readonly attachmentCode: (gl) => number;

        private _innerFormatForBuffer: number = -1;
        private _innerFormatForTexture: number = -1;
        private _type: AttachmentType;
        private _isAble = true;

        constructor(frameBuffer: FrameBuffer, attachmentCode: (gl: WebGLRenderingContext) => number) {
            this.frameBuffer = frameBuffer;
            this.attachmentCode = attachmentCode;
        }

        public get innerFormatForBuffer() {
            return this._innerFormatForBuffer;
        }

        public get innerFormatForTexture() {
            return this._innerFormatForTexture;
        }

        public get type() {
            return this._type;
        }

        public get isAble() {
            return this._isAble;
        }

        public enable() {
            this._isAble = true;
            return this;
        }

        public disable() {
            this._isAble = false;
            return this;
        }

        public setInnerFormatForBuffer(innerFormatForBuffer: number) {
            this._innerFormatForBuffer = innerFormatForBuffer;
            return this;
        }

        public setInnerFormatForTexture(innerFormatForTexture: number) {
            this._innerFormatForTexture = innerFormatForTexture;
            return this;
        }

        public setType(gl: WebGLRenderingContext, type: AttachmentType) {
            this._type = type;
            if (type === AttachmentType.Texture) {
                this.targetTexture = new Texture(gl);
                this.glRenderBuffer = null;
            } else {
                this.glRenderBuffer = gl.createRenderbuffer();
                this.targetTexture = null;
            }
            return this;
        }

        public toTexture(gl: WebGLRenderingContext): Texture {
            this.targetTexture = new Texture(gl);
            return this.targetTexture;
        }
    }

    export class FrameBuffer {
        public glFramebuffer: WebGLFramebuffer;

        public attachments = {
            color: new Attachment(this, (gl) => gl.COLOR_ATTACHMENT0),
            depth: new Attachment(this, (gl) => gl.DEPTH_ATTACHMENT),
            stencil: new Attachment(this, (gl) => gl.STENCIL_ATTACHMENT),
        };

        constructor(gl: WebGLRenderingContext) {
            this.glFramebuffer = gl.createFramebuffer();
            this.attachments.color.setType(gl, AttachmentType.Texture)
                .setInnerFormatForBuffer(gl.RGBA4)
                .setInnerFormatForTexture(gl.RGBA);
            this.attachments.depth.setType(gl, AttachmentType.RenderBuffer)
                .setInnerFormatForBuffer(gl.DEPTH_COMPONENT16)
                .setInnerFormatForTexture(gl.DEPTH_COMPONENT);
            this.attachments.stencil.setType(gl, AttachmentType.RenderBuffer)
                .setInnerFormatForBuffer(gl.STENCIL_INDEX8)
                .setInnerFormatForTexture(gl.STENCIL_INDEX)
                .disable();
        }
    }
}
