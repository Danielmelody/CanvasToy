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
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { Light } from "./Light";
var DampingLight = (function (_super) {
    __extends(DampingLight, _super);
    function DampingLight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._radius = 10;
        _this._squareAttenuation = 0.01;
        _this._linearAttenuation = 0.01;
        _this._constantAttenuation = 0.01;
        return _this;
    }
    Object.defineProperty(DampingLight.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DampingLight.prototype, "squareAttenuation", {
        get: function () {
            return this._squareAttenuation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DampingLight.prototype, "linearAttenuation", {
        get: function () {
            return this._squareAttenuation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DampingLight.prototype, "constantAttenuation", {
        get: function () {
            return this._constantAttenuation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DampingLight.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        enumerable: false,
        configurable: true
    });
    DampingLight.prototype.setSquareAtten = function (atten) {
        this._squareAttenuation = atten;
        return this;
    };
    DampingLight.prototype.setLinearAtten = function (atten) {
        this._linearAttenuation = atten;
        return this;
    };
    DampingLight.prototype.setConstAtten = function (atten) {
        this._constantAttenuation = atten;
        return this;
    };
    __decorate([
        uniform(DataType.vec3)
    ], DampingLight.prototype, "position", null);
    __decorate([
        uniform(DataType.float, "squareAtten")
    ], DampingLight.prototype, "squareAttenuation", null);
    __decorate([
        uniform(DataType.float, "linearAtten")
    ], DampingLight.prototype, "linearAttenuation", null);
    __decorate([
        uniform(DataType.float, "constantAtten")
    ], DampingLight.prototype, "constantAttenuation", null);
    __decorate([
        uniform(DataType.float)
    ], DampingLight.prototype, "radius", null);
    return DampingLight;
}(Light));
export { DampingLight };
//# sourceMappingURL=DampingLight.js.map