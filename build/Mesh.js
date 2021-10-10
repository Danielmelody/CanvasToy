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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { mat4 } from "gl-matrix";
import { DataType } from "./DataTypeEnum";
import { uniform } from "./Decorators";
import { Object3d } from "./Object3d";
var Mesh = (function (_super) {
    __extends(Mesh, _super);
    function Mesh(geometry, materials) {
        var _this = _super.call(this) || this;
        _this.materials = [];
        _this.materials = materials;
        _this.geometry = geometry;
        return _this;
    }
    Object.defineProperty(Mesh.prototype, "matrix", {
        get: function () {
            return this._matrix;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "normalMatrix", {
        get: function () {
            return mat4.transpose(mat4.create(), mat4.invert(mat4.create(), this._matrix));
        },
        enumerable: false,
        configurable: true
    });
    Mesh.prototype.drawMode = function (gl) {
        return gl.STATIC_DRAW;
    };
    __decorate([
        uniform(DataType.mat4, "modelMatrix")
    ], Mesh.prototype, "matrix", null);
    __decorate([
        uniform(DataType.mat4)
    ], Mesh.prototype, "normalMatrix", null);
    return Mesh;
}(Object3d));
export { Mesh };
//# sourceMappingURL=Mesh.js.map