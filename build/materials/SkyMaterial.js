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
import { mat4, quat } from "gl-matrix";
import { DataType } from "../DataTypeEnum";
import { texture } from "../Decorators";
import { ShaderBuilder } from "../shader/ShaderBuilder";
import { ShaderSource } from "../shader/shaders";
import { IMaterial } from "./Material";
var SkyMaterial = (function (_super) {
    __extends(SkyMaterial, _super);
    function SkyMaterial(gl, cubeTexture) {
        var _this = _super.call(this, gl) || this;
        _this.cubeTexture = cubeTexture;
        return _this;
    }
    SkyMaterial.prototype.initShader = function (gl) {
        return new ShaderBuilder()
            .resetShaderLib()
            .setShadingVert(ShaderSource.interploters__forward__skybox_vert)
            .setShadingFrag(ShaderSource.interploters__forward__skybox_frag)
            .setExtraRenderParamHolder("skyTransform", {
            uniforms: {
                viewProjectionMatrix: {
                    type: DataType.mat4,
                    updator: function (_a) {
                        var mesh = _a.mesh, camera = _a.camera;
                        var rotateOnlyViewMatrix = mat4.fromQuat(mat4.create(), mat4.getRotation(quat.create(), camera.matrix));
                        rotateOnlyViewMatrix = mat4.invert(mat4.create(), rotateOnlyViewMatrix);
                        return mat4.multiply(mat4.create(), camera.projectionMatrix, rotateOnlyViewMatrix);
                    },
                },
            },
        })
            .build(gl);
    };
    __decorate([
        texture("uCubeTexture")
    ], SkyMaterial.prototype, "cubeTexture", void 0);
    return SkyMaterial;
}(IMaterial));
export { SkyMaterial };
//# sourceMappingURL=SkyMaterial.js.map