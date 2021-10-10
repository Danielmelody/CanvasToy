import { vec4 } from "gl-matrix";
export var colors = {
    black: vec4.fromValues(0, 0, 0, 1),
    gray: vec4.fromValues(0.5, 0.5, 0.5, 1),
    red: vec4.fromValues(1, 0, 0, 1),
    white: vec4.fromValues(1, 1, 1, 1),
};
var IMaterial = (function () {
    function IMaterial(gl) {
        this.defines = [];
        this.gl = gl;
        this.shader = this.initShader(gl);
    }
    return IMaterial;
}());
export { IMaterial };
//# sourceMappingURL=Material.js.map