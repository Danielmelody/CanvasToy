var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Texture } from "./Texture";
var CubeTexture = (function (_super) {
    __extends(CubeTexture, _super);
    function CubeTexture(gl, urls) {
        var _this = _super.call(this, gl) || this;
        _this.images = [];
        _this.setTarget(gl.TEXTURE_CUBE_MAP);
        if (!!urls) {
            _this.images = [0, 0, 0, 0, 0, 0].map(function () { return new Image(); });
            _this.images[0].src = urls.xpos;
            _this.images[1].src = urls.xneg;
            _this.images[2].src = urls.ypos;
            _this.images[3].src = urls.yneg;
            _this.images[4].src = urls.zpos;
            _this.images[5].src = urls.zneg;
            _this.setAsyncFinished(Promise.all(_this.images.map(function (image) {
                return _this.createLoadPromise(image);
            })).then(function () {
                return Promise.resolve(_this);
            }));
        }
        return _this;
    }
    Object.defineProperty(CubeTexture.prototype, "wrapR", {
        get: function () {
            return this._wrapR;
        },
        enumerable: false,
        configurable: true
    });
    CubeTexture.prototype.setWrapR = function (_wrapR) {
        this._wrapR = _wrapR;
        return this;
    };
    CubeTexture.prototype.apply = function (gl) {
        _super.prototype.apply.call(this, gl);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        for (var i = 0; i < this.images.length; ++i) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.format, this.format, this.type, this.images[i]);
        }
        return this;
    };
    CubeTexture.prototype.applyForRendering = function (gl, width, height) {
        _super.prototype.apply.call(this, gl);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        for (var i = 0; i < 6; ++i) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.format, width, height, 0, this.format, this.type, null);
        }
        return this;
    };
    CubeTexture.prototype.createLoadPromise = function (image) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!image) {
                resolve(_this);
            }
            else {
                image.onload = function () { return resolve(_this); };
                image.onerror = function () { return reject(_this); };
            }
        });
    };
    return CubeTexture;
}(Texture));
export { CubeTexture };
//# sourceMappingURL=CubeTexture.js.map