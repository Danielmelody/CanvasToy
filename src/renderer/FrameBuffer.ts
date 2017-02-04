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
        public readonly attachmentCode: (gl: WebGLRenderingContext) => number;

        private _innerFormatForBuffer: number = -1;
        private _type: AttachmentType;
        private _isAble = true;

        constructor(
            frameBuffer: FrameBuffer,
            attachmentCode: (gl: WebGLRenderingContext) => number,
        ) {
            this.frameBuffer = frameBuffer;
            this.attachmentCode = attachmentCode;
        }

        public get innerFormatForBuffer() {
            return this._innerFormatForBuffer;
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
                .setInnerFormatForBuffer(gl.RGBA4);
            this.attachments.depth.setType(gl, AttachmentType.RenderBuffer)
                .setInnerFormatForBuffer(gl.DEPTH_COMPONENT16);
            this.attachments.stencil.setType(gl, AttachmentType.RenderBuffer)
                .setInnerFormatForBuffer(gl.STENCIL_INDEX8)
                .disable();
        }
    }
}
