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
var Texture2D = (function (_super) {
    __extends(Texture2D, _super);
    function Texture2D(gl, url) {
        return _super.call(this, gl, url) || this;
    }
    Texture2D.prototype.apply = function (gl) {
        _super.prototype.apply.call(this, gl);
        gl.texImage2D(this.target, 0, this.format, this.format, this.type, this.image);
        return this;
    };
    return Texture2D;
}(Texture));
export { Texture2D };
//# sourceMappingURL=Texture2D.js.map