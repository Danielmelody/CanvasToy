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
import { Geometry } from "./Geometry";
var RectGeometry = (function (_super) {
    __extends(RectGeometry, _super);
    function RectGeometry(gl) {
        var _this = _super.call(this, gl) || this;
        _this.attributes.position.data = [
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
        ];
        _this.attributes.aMainUV.data = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
        ];
        _this.attributes.aNormal.data = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];
        _this.faces.data = [
            0, 1, 2,
            2, 1, 3,
        ];
        return _this;
    }
    return RectGeometry;
}(Geometry));
export { RectGeometry };
//# sourceMappingURL=RectGeometry.js.map