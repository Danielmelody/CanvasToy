import { Texture } from "../textures/Texture";
import { Graphics } from "./GraphicsUtils";
export var AttachmentType;
(function (AttachmentType) {
    AttachmentType[AttachmentType["Texture"] = 0] = "Texture";
    AttachmentType[AttachmentType["RenderBuffer"] = 1] = "RenderBuffer";
})(AttachmentType || (AttachmentType = {}));
var Attachment = (function () {
    function Attachment(frameBuffer, attachmentCode) {
        this._innerFormatForBuffer = -1;
        this._isAble = true;
        this.frameBuffer = frameBuffer;
        this.attachmentCode = attachmentCode;
    }
    Object.defineProperty(Attachment.prototype, "innerFormatForBuffer", {
        get: function () {
            return this._innerFormatForBuffer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attachment.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Attachment.prototype, "isAble", {
        get: function () {
            return this._isAble;
        },
        enumerable: false,
        configurable: true
    });
    Attachment.prototype.enable = function () {
        this._isAble = true;
        return this;
    };
    Attachment.prototype.disable = function () {
        this._isAble = false;
        return this;
    };
    Attachment.prototype.setInnerFormatForBuffer = function (innerFormatForBuffer) {
        this._innerFormatForBuffer = innerFormatForBuffer;
        return this;
    };
    Attachment.prototype.asRenderBuffer = function (gl) {
        this._type = AttachmentType.RenderBuffer;
        this.glRenderBuffer = gl.createRenderbuffer();
        this.targetTexture = null;
        return this;
    };
    Attachment.prototype.asTargetTexture = function (texture, targetcode) {
        this._type = AttachmentType.Texture;
        this.targetTexture = texture;
        this.textureTargetCode = targetcode;
        this.glRenderBuffer = null;
        return this;
    };
    return Attachment;
}());
export { Attachment };
var FrameBuffer = (function () {
    function FrameBuffer(gl) {
        this.attachments = {
            color: new Attachment(this, function (gl) { return gl.COLOR_ATTACHMENT0; }),
            depth: new Attachment(this, function (gl) { return gl.DEPTH_ATTACHMENT; }),
            stencil: new Attachment(this, function (gl) { return gl.STENCIL_ATTACHMENT; }),
        };
        this.extras = [];
        this._attached = false;
        this.glFramebuffer = gl.createFramebuffer();
        this._width = gl.canvas.width;
        this._height = gl.canvas.height;
        this.attachments.color.asTargetTexture(new Texture(gl), gl.TEXTURE_2D)
            .setInnerFormatForBuffer(gl.RGBA4);
        this.attachments.depth.asRenderBuffer(gl)
            .setInnerFormatForBuffer(gl.DEPTH_COMPONENT16);
        this.attachments.stencil.asRenderBuffer(gl)
            .setInnerFormatForBuffer(gl.STENCIL_INDEX8)
            .disable();
    }
    FrameBuffer.prototype.setWidth = function (_width) {
        this._width = _width;
        return this;
    };
    FrameBuffer.prototype.setHeight = function (_height) {
        this._height = _height;
        return this;
    };
    Object.defineProperty(FrameBuffer.prototype, "attached", {
        get: function () {
            return this._attached;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameBuffer.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameBuffer.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    FrameBuffer.prototype.attach = function (gl, drawBuffer) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer);
        for (var index in this.attachments) {
            var attachment = this.attachments[index];
            if (attachment.isAble) {
                this.linkAttachment(attachment, gl, gl);
            }
        }
        if (!!drawBuffer) {
            var i = 0;
            var drawBuffers = [];
            for (var _i = 0, _a = this.extras; _i < _a.length; _i++) {
                var attachment = _a[_i];
                this.linkAttachment(attachment, gl, drawBuffer);
                drawBuffers.push(drawBuffer.COLOR_ATTACHMENT0_WEBGL + i);
                i++;
            }
            drawBuffer.drawBuffersWEBGL(drawBuffers);
        }
        this._attached = Graphics.logIfFrameBufferInvalid(gl, this.glFramebuffer);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    FrameBuffer.prototype.linkAttachment = function (attachment, gl, context) {
        switch (attachment.type) {
            case AttachmentType.Texture:
                attachment.targetTexture.applyForRendering(gl, this.width, this.height);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment.attachmentCode(context), attachment.textureTargetCode, attachment.targetTexture.glTexture, 0);
                break;
            case AttachmentType.RenderBuffer:
                gl.bindRenderbuffer(gl.RENDERBUFFER, attachment.glRenderBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, attachment.innerFormatForBuffer, this.width, this.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment.attachmentCode(gl), gl.RENDERBUFFER, attachment.glRenderBuffer);
                break;
            default: break;
        }
    };
    return FrameBuffer;
}());
export { FrameBuffer };
//# sourceMappingURL=FrameBuffer.js.map