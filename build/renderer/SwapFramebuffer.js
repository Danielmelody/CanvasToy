import { FrameBuffer } from "./FrameBuffer";
var ProcessingFrameBuffer = (function () {
    function ProcessingFrameBuffer(gl) {
        this._candidates = [];
        this._activeIndex = 0;
        this._onInits = [];
        this._gl = gl;
    }
    ProcessingFrameBuffer.prototype.swap = function () {
        if (this._candidates.length === 1) {
            var fbo_1 = new FrameBuffer(this._gl);
            fbo_1.setWidth(this._width).setHeight(this._height);
            this._onInits.forEach(function (inits) { inits(fbo_1); });
            this._candidates.push(fbo_1);
        }
        this._activeIndex = 1 - this._activeIndex;
    };
    Object.defineProperty(ProcessingFrameBuffer.prototype, "active", {
        get: function () {
            if (this._candidates.length === 0) {
                var fbo_2 = new FrameBuffer(this._gl);
                fbo_2.setWidth(this._width).setHeight(this._height);
                this._onInits.forEach(function (inits) { inits(fbo_2); });
                fbo_2.attach(this._gl);
                this._candidates.push(fbo_2);
            }
            return this._candidates[this._activeIndex];
        },
        enumerable: false,
        configurable: true
    });
    ProcessingFrameBuffer.prototype.onInit = function (callback) {
        this._onInits.push(callback);
        return this;
    };
    ProcessingFrameBuffer.prototype.setWidth = function (_width) {
        this._width = _width;
        for (var _i = 0, _a = this._candidates; _i < _a.length; _i++) {
            var fbo = _a[_i];
            fbo.setWidth(_width);
        }
        return this;
    };
    ProcessingFrameBuffer.prototype.setHeight = function (_height) {
        this._height = _height;
        for (var _i = 0, _a = this._candidates; _i < _a.length; _i++) {
            var fbo = _a[_i];
            fbo.setHeight(_height);
        }
        return this;
    };
    ProcessingFrameBuffer.prototype.attach = function (gl, drawBuffer) {
        for (var _i = 0, _a = this._candidates; _i < _a.length; _i++) {
            var fbo = _a[_i];
            fbo.attach(gl, drawBuffer);
        }
    };
    Object.defineProperty(ProcessingFrameBuffer.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProcessingFrameBuffer.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    return ProcessingFrameBuffer;
}());
export { ProcessingFrameBuffer };
//# sourceMappingURL=SwapFramebuffer.js.map