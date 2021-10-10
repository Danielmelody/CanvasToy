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
var DataTexture = (function (_super) {
    __extends(DataTexture, _super);
    function DataTexture(gl, data, width, height) {
        if (width === void 0) { width = 16; }
        if (height === void 0) { height = 16; }
        var _this = _super.call(this, gl) || this;
        _this.data = data;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    DataTexture.prototype.resetData = function (gl, data, width, height) {
        this.data = data;
        this.width = width ? width : this.width;
        this.height = height ? height : this.height;
        this.apply(gl);
        return this;
    };
    DataTexture.prototype.apply = function (gl) {
        _super.prototype.apply.call(this, gl);
        gl.texImage2D(this.target, 0, this.format, this.width, this.height, 0, this.format, this.type, this.data);
        return this;
    };
    return DataTexture;
}(Texture));
export { DataTexture };
//# sourceMappingURL=DataTexture.js.map