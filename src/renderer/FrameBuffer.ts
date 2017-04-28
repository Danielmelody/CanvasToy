import { Texture } from "../textures/Texture";
import { Graphics } from "./GraphicsUtils";

export enum AttachmentType {
    Texture,
    RenderBuffer,
}

export class Attachment {
    public readonly frameBuffer: FrameBuffer;
    public glRenderBuffer: WebGLRenderbuffer;
    public targetTexture: Texture;
    public readonly attachmentCode: (gl: WebGLRenderingContext | WebGLDrawBuffers) => number;

    private _innerFormatForBuffer: number = -1;
    private _type: AttachmentType;
    private _isAble = true;

    constructor(
        frameBuffer: FrameBuffer,
        attachmentCode: (gl: WebGLRenderingContext | WebGLDrawBuffers) => number,
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

}

export class FrameBuffer {

    public glFramebuffer: WebGLFramebuffer;

    public attachments = {
        color: new Attachment(this, (gl: WebGLRenderingContext) => gl.COLOR_ATTACHMENT0),
        depth: new Attachment(this, (gl: WebGLRenderingContext) => gl.DEPTH_ATTACHMENT),
        stencil: new Attachment(this, (gl: WebGLRenderingContext) => gl.STENCIL_ATTACHMENT),
    };

    public extras: Attachment[] = [];

    private _attached = false;

    private _width: number;
    private _height: number;

    constructor(gl: WebGLRenderingContext) {
        this.glFramebuffer = gl.createFramebuffer();
        this._width = gl.canvas.width;
        this._height = gl.canvas.height;
        this.attachments.color.setType(gl, AttachmentType.Texture)
            .setInnerFormatForBuffer(gl.RGBA4);
        this.attachments.depth.setType(gl, AttachmentType.RenderBuffer)
            .setInnerFormatForBuffer(gl.DEPTH_COMPONENT16);
        this.attachments.stencil.setType(gl, AttachmentType.RenderBuffer)
            .setInnerFormatForBuffer(gl.STENCIL_INDEX8)
            .disable();
    }

    public setWidth(_width: number) {
        this._width = _width;
        return this;
    }

    public setHeight(_height: number) {
        this._height = _height;
        return this;
    }

    public get attached(): boolean {
        return this._attached;
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    // make all attachment settings take effect.
    public attach(gl: WebGLRenderingContext, drawBuffer?: WebGLDrawBuffers) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer);
        for (const index in this.attachments) {
            const attachment: Attachment = this.attachments[index];
            if (attachment.isAble) {
                this.linkAttachment(attachment, gl, gl);
            }
        }
        if (!!drawBuffer) {
            for (const attachment of this.extras) {
                this.linkAttachment(attachment, gl, drawBuffer);
            }
            drawBuffer.drawBuffersWEBGL([
                drawBuffer.COLOR_ATTACHMENT0_WEBGL,
                drawBuffer.COLOR_ATTACHMENT1_WEBGL,
            ]);
        }
        this._attached = Graphics.logIfFrameBufferInvalid(gl, this.glFramebuffer);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    private linkAttachment(
        attachment: Attachment,
        gl: WebGLRenderingContext,
        context: WebGLRenderingContext | WebGLDrawBuffers) {
        switch (attachment.type) {
            case AttachmentType.Texture:
                gl.bindTexture(attachment.targetTexture.target, attachment.targetTexture.glTexture);
                gl.texImage2D(
                    attachment.targetTexture.target,
                    0,
                    attachment.targetTexture.format,
                    this.width,
                    this.height,
                    0,
                    attachment.targetTexture.format,
                    attachment.targetTexture.type,
                    null,
                );
                gl.framebufferTexture2D(
                    gl.FRAMEBUFFER,
                    attachment.attachmentCode(context),
                    attachment.targetTexture.target,
                    attachment.targetTexture.glTexture,
                    0);
                gl.bindTexture(attachment.targetTexture.target, null);
                break;
            case AttachmentType.RenderBuffer:
                gl.bindRenderbuffer(gl.RENDERBUFFER, attachment.glRenderBuffer);
                gl.renderbufferStorage(
                    gl.RENDERBUFFER,
                    attachment.innerFormatForBuffer,
                    gl.canvas.width,
                    gl.canvas.height,
                );
                gl.framebufferRenderbuffer(
                    gl.FRAMEBUFFER,
                    attachment.attachmentCode(gl),
                    gl.RENDERBUFFER,
                    attachment.glRenderBuffer,
                );
                break;
            default: break;
        }
    }
}