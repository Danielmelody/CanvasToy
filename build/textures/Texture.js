var Texture = (function () {
    function Texture(gl, url) {
        var _this = this;
        if (!!url) {
            this._image = new Image();
            var image_1 = this._image;
            this.setAsyncFinished(new Promise(function (resolve, reject) {
                image_1.onload = function () { return resolve(_this); };
                image_1.onerror = function () { return reject(_this); };
                _this._image.src = url;
            }));
        }
        this.setTarget(gl.TEXTURE_2D)
            .setFormat(gl.RGB)
            .setWrapS(gl.CLAMP_TO_EDGE)
            .setWrapT(gl.CLAMP_TO_EDGE)
            .setMagFilter(gl.NEAREST)
            .setMinFilter(gl.NEAREST)
            .setType(gl.UNSIGNED_BYTE);
        this._glTexture = gl.createTexture();
    }
    Object.defineProperty(Texture.prototype, "glTexture", {
        get: function () {
            return this._glTexture;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "image", {
        get: function () {
            return this._image;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "format", {
        get: function () {
            return this._format;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "wrapS", {
        get: function () {
            return this._wrapS;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "wrapT", {
        get: function () {
            return this._wrapT;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "magFilter", {
        get: function () {
            return this._magFilter;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "minFilter", {
        get: function () {
            return this._minFilter;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Texture.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Texture.prototype.setTarget = function (_target) {
        this._target = _target;
        return this;
    };
    Texture.prototype.setFormat = function (_format) {
        this._format = _format;
        return this;
    };
    Texture.prototype.setWrapS = function (_wrapS) {
        this._wrapS = _wrapS;
        return this;
    };
    Texture.prototype.setWrapT = function (_wrapT) {
        this._wrapT = _wrapT;
        return this;
    };
    Texture.prototype.setMagFilter = function (_magFilter) {
        this._magFilter = _magFilter;
        return this;
    };
    Texture.prototype.setMinFilter = function (_minFilter) {
        this._minFilter = _minFilter;
        return this;
    };
    Texture.prototype.setType = function (_type) {
        this._type = _type;
        return this;
    };
    Texture.prototype.setAsyncFinished = function (promise) {
        this._asyncFinished = promise;
        return this;
    };
    Texture.prototype.asyncFinished = function () {
        return this._asyncFinished;
    };
    Texture.prototype.apply = function (gl) {
        gl.bindTexture(this.target, this.glTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, this.wrapT);
        gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, this.minFilter);
        return this;
    };
    Texture.prototype.applyForRendering = function (gl, width, height) {
        gl.bindTexture(this.target, this.glTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, this.wrapT);
        gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, this.minFilter);
        gl.texImage2D(this.target, 0, this.format, width, height, 0, this.format, this.type, null);
        return this;
    };
    return Texture;
}());
export { Texture };
//# sourceMappingURL=Texture.js.map