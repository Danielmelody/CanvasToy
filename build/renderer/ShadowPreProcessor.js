import { RectGeometry } from "../geometries/RectGeometry";
import { ShadowLevel } from "../lights/ShadowLevel";
import { LinearDepthPackMaterial } from "../materials/ESM/DepthPackMaterial";
import { PCSSFilteringMaterial } from "../materials/ESM/LogBlurMaterial";
import { BlinnPhongMaterial } from "../materials/surface/BlinnPhongMaterial";
import { StandardMaterial } from "../materials/surface/StandardMaterial";
import { Mesh } from "../Mesh";
var ShadowPreProcess = (function () {
    function ShadowPreProcess(gl, ext, scene) {
        this.gl = gl;
        this.ext = ext;
        this.depthMaterial = new LinearDepthPackMaterial(gl);
        this.blurMaterial = new PCSSFilteringMaterial(gl);
        this.blurMaterial.shader.setViewPort({
            x: 0,
            y: 0,
            width: 512,
            height: 512,
        });
        this.rectMesh = new Mesh(new RectGeometry(gl).build(), []);
        this.rectMesh.geometry.resetLightShadows(gl);
    }
    ShadowPreProcess.prototype.process = function (scene, camera, matriels) {
        for (var _i = 0, _a = scene.lights; _i < _a.length; _i++) {
            var light = _a[_i];
            if (light.shadowLevel > ShadowLevel.None) {
                this.depthMaterial.shader.setViewPort({
                    x: 0,
                    y: 0,
                    width: light.shadowSize,
                    height: light.shadowSize,
                });
                this.renderDepth(scene, light);
            }
            if (light.shadowLevel > ShadowLevel.Hard) {
                this.blurMaterial.shader.setViewPort({
                    x: 0,
                    y: 0,
                    width: light.shadowSize,
                    height: light.shadowSize,
                });
                this.prefiltDepth(scene, light);
            }
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    };
    ShadowPreProcess.prototype.renderDepth = function (scene, light) {
        var _this = this;
        light.shadowFrameBuffers.forEach(function () {
            light.clearShadowFrameBuffer();
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (object instanceof Mesh) {
                    var blockShadow = false;
                    for (var _b = 0, _c = object.materials; _b < _c.length; _b++) {
                        var material = _c[_b];
                        if (material instanceof StandardMaterial ||
                            material instanceof BlinnPhongMaterial) {
                            if (material.blockShadow) {
                                blockShadow = true;
                                break;
                            }
                        }
                    }
                    if (blockShadow) {
                        _this.gl.useProgram(_this.depthMaterial.shader.webGlProgram);
                        light.drawWithLightCamera({
                            mesh: object,
                            material: _this.depthMaterial,
                        });
                    }
                }
            }
            _this.gl.bindFramebuffer(_this.gl.FRAMEBUFFER, null);
        });
    };
    ShadowPreProcess.prototype.prefiltDepth = function (scene, light) {
        var _this = this;
        light.shadowFrameBuffers.forEach(function (shadowFrameBuffer) {
            _this.blurMaterial.origin =
                shadowFrameBuffer.active.attachments.color.targetTexture;
            shadowFrameBuffer.swap();
            light.clearShadowFrameBuffer();
            _this.blurMaterial.blurStep = 1.0 / light.shadowSize;
            _this.gl.useProgram(_this.blurMaterial.shader.webGlProgram);
            light.drawWithLightCamera({
                mesh: _this.rectMesh,
                material: _this.blurMaterial,
            });
            shadowFrameBuffer.swap();
            _this.gl.bindFramebuffer(_this.gl.FRAMEBUFFER, null);
        });
    };
    return ShadowPreProcess;
}());
export { ShadowPreProcess };
//# sourceMappingURL=ShadowPreProcessor.js.map