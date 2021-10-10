import { Mesh } from "../../Mesh";
var ForwardProcessor = (function () {
    function ForwardProcessor(gl, ext, scene, camera) {
        this.gl = gl;
        this.ext = ext;
    }
    ForwardProcessor.prototype.process = function (scene, camera, materials) {
        this.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
            var object = _a[_i];
            this.renderObject(scene, camera, object);
        }
    };
    ForwardProcessor.prototype.renderObject = function (scene, camera, object) {
        if (object instanceof Mesh) {
            var mesh = object;
            mesh.geometry.resetLightShadows(this.gl);
            for (var _i = 0, _a = mesh.materials; _i < _a.length; _i++) {
                var material = _a[_i];
                var shader = material.shader;
                if (shader.enableDepthTest) {
                    this.gl.enable(this.gl.DEPTH_TEST);
                }
                else {
                    this.gl.disable(this.gl.DEPTH_TEST);
                }
                if (shader.enableStencilTest) {
                    this.gl.enable(this.gl.STENCIL_TEST);
                }
                else {
                    this.gl.disable(this.gl.STENCIL_TEST);
                }
                this.gl.useProgram(shader.webGlProgram);
                shader.pass({ mesh: mesh, camera: camera, material: material, scene: scene });
            }
        }
    };
    return ForwardProcessor;
}());
export { ForwardProcessor };
//# sourceMappingURL=ForwardProcessor.js.map