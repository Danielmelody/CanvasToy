var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else {
        var a = factory();
        for (var i in a)
            (typeof exports === 'object' ? exports : root)[i] = a[i];
    }
})(this, function () {
    return (function (modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId])
                return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                exports: {},
                id: moduleId,
                loaded: false
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.loaded = true;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.p = "";
        return __webpack_require__(0);
    })([
        function (module, exports, __webpack_require__) {
            exports.glMatrix = __webpack_require__(1);
            exports.mat2 = __webpack_require__(2);
            exports.mat2d = __webpack_require__(3);
            exports.mat3 = __webpack_require__(4);
            exports.mat4 = __webpack_require__(5);
            exports.quat = __webpack_require__(6);
            exports.vec2 = __webpack_require__(9);
            exports.vec3 = __webpack_require__(7);
            exports.vec4 = __webpack_require__(8);
        },
        function (module, exports) {
            var glMatrix = {};
            glMatrix.EPSILON = 0.000001;
            glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
            glMatrix.RANDOM = Math.random;
            glMatrix.ENABLE_SIMD = false;
            glMatrix.SIMD_AVAILABLE = (glMatrix.ARRAY_TYPE === Float32Array) && ('SIMD' in this);
            glMatrix.USE_SIMD = glMatrix.ENABLE_SIMD && glMatrix.SIMD_AVAILABLE;
            glMatrix.setMatrixArrayType = function (type) {
                glMatrix.ARRAY_TYPE = type;
            };
            var degree = Math.PI / 180;
            glMatrix.toRadian = function (a) {
                return a * degree;
            };
            glMatrix.equals = function (a, b) {
                return Math.abs(a - b) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
            };
            module.exports = glMatrix;
        },
        function (module, exports, __webpack_require__) {
            var glMatrix = __webpack_require__(1);
            var mat2 = {};
            mat2.create = function () {
                var out = new glMatrix.ARRAY_TYPE(4);
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 1;
                return out;
            };
            mat2.clone = function (a) {
                var out = new glMatrix.ARRAY_TYPE(4);
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                return out;
            };
            mat2.copy = function (out, a) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                return out;
            };
            mat2.identity = function (out) {
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 1;
                return out;
            };
            mat2.fromValues = function (m00, m01, m10, m11) {
                var out = new glMatrix.ARRAY_TYPE(4);
                out[0] = m00;
                out[1] = m01;
                out[2] = m10;
                out[3] = m11;
                return out;
            };
            mat2.set = function (out, m00, m01, m10, m11) {
                out[0] = m00;
                out[1] = m01;
                out[2] = m10;
                out[3] = m11;
                return out;
            };
            mat2.transpose = function (out, a) {
                if (out === a) {
                    var a1 = a[1];
                    out[1] = a[2];
                    out[2] = a1;
                }
                else {
                    out[0] = a[0];
                    out[1] = a[2];
                    out[2] = a[1];
                    out[3] = a[3];
                }
                return out;
            };
            mat2.invert = function (out, a) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], det = a0 * a3 - a2 * a1;
                if (!det) {
                    return null;
                }
                det = 1.0 / det;
                out[0] = a3 * det;
                out[1] = -a1 * det;
                out[2] = -a2 * det;
                out[3] = a0 * det;
                return out;
            };
            mat2.adjoint = function (out, a) {
                var a0 = a[0];
                out[0] = a[3];
                out[1] = -a[1];
                out[2] = -a[2];
                out[3] = a0;
                return out;
            };
            mat2.determinant = function (a) {
                return a[0] * a[3] - a[2] * a[1];
            };
            mat2.multiply = function (out, a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
                var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
                out[0] = a0 * b0 + a2 * b1;
                out[1] = a1 * b0 + a3 * b1;
                out[2] = a0 * b2 + a2 * b3;
                out[3] = a1 * b2 + a3 * b3;
                return out;
            };
            mat2.mul = mat2.multiply;
            mat2.rotate = function (out, a, rad) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], s = Math.sin(rad), c = Math.cos(rad);
                out[0] = a0 * c + a2 * s;
                out[1] = a1 * c + a3 * s;
                out[2] = a0 * -s + a2 * c;
                out[3] = a1 * -s + a3 * c;
                return out;
            };
            mat2.scale = function (out, a, v) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], v0 = v[0], v1 = v[1];
                out[0] = a0 * v0;
                out[1] = a1 * v0;
                out[2] = a2 * v1;
                out[3] = a3 * v1;
                return out;
            };
            mat2.fromRotation = function (out, rad) {
                var s = Math.sin(rad), c = Math.cos(rad);
                out[0] = c;
                out[1] = s;
                out[2] = -s;
                out[3] = c;
                return out;
            };
            mat2.fromScaling = function (out, v) {
                out[0] = v[0];
                out[1] = 0;
                out[2] = 0;
                out[3] = v[1];
                return out;
            };
            mat2.str = function (a) {
                return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
            };
            mat2.frob = function (a) {
                return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)));
            };
            mat2.LDU = function (L, D, U, a) {
                L[2] = a[2] / a[0];
                U[0] = a[0];
                U[1] = a[1];
                U[3] = a[3] - L[2] * U[1];
                return [L, D, U];
            };
            mat2.add = function (out, a, b) {
                out[0] = a[0] + b[0];
                out[1] = a[1] + b[1];
                out[2] = a[2] + b[2];
                out[3] = a[3] + b[3];
                return out;
            };
            mat2.subtract = function (out, a, b) {
                out[0] = a[0] - b[0];
                out[1] = a[1] - b[1];
                out[2] = a[2] - b[2];
                out[3] = a[3] - b[3];
                return out;
            };
            mat2.sub = mat2.subtract;
            mat2.exactEquals = function (a, b) {
                return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
            };
            mat2.equals = function (a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
                var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
                return (Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                    Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
                    Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
                    Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
            };
            mat2.multiplyScalar = function (out, a, b) {
                out[0] = a[0] * b;
                out[1] = a[1] * b;
                out[2] = a[2] * b;
                out[3] = a[3] * b;
                return out;
            };
            mat2.multiplyScalarAndAdd = function (out, a, b, scale) {
                out[0] = a[0] + (b[0] * scale);
                out[1] = a[1] + (b[1] * scale);
                out[2] = a[2] + (b[2] * scale);
                out[3] = a[3] + (b[3] * scale);
                return out;
            };
            module.exports = mat2;
        },
        function (module, exports, __webpack_require__) {
            var glMatrix = __webpack_require__(1);
            var mat2d = {};
            mat2d.create = function () {
                var out = new glMatrix.ARRAY_TYPE(6);
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 1;
                out[4] = 0;
                out[5] = 0;
                return out;
            };
            mat2d.clone = function (a) {
                var out = new glMatrix.ARRAY_TYPE(6);
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[4] = a[4];
                out[5] = a[5];
                return out;
            };
            mat2d.copy = function (out, a) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[4] = a[4];
                out[5] = a[5];
                return out;
            };
            mat2d.identity = function (out) {
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 1;
                out[4] = 0;
                out[5] = 0;
                return out;
            };
            mat2d.fromValues = function (a, b, c, d, tx, ty) {
                var out = new glMatrix.ARRAY_TYPE(6);
                out[0] = a;
                out[1] = b;
                out[2] = c;
                out[3] = d;
                out[4] = tx;
                out[5] = ty;
                return out;
            };
            mat2d.set = function (out, a, b, c, d, tx, ty) {
                out[0] = a;
                out[1] = b;
                out[2] = c;
                out[3] = d;
                out[4] = tx;
                out[5] = ty;
                return out;
            };
            mat2d.invert = function (out, a) {
                var aa = a[0], ab = a[1], ac = a[2], ad = a[3], atx = a[4], aty = a[5];
                var det = aa * ad - ab * ac;
                if (!det) {
                    return null;
                }
                det = 1.0 / det;
                out[0] = ad * det;
                out[1] = -ab * det;
                out[2] = -ac * det;
                out[3] = aa * det;
                out[4] = (ac * aty - ad * atx) * det;
                out[5] = (ab * atx - aa * aty) * det;
                return out;
            };
            mat2d.determinant = function (a) {
                return a[0] * a[3] - a[1] * a[2];
            };
            mat2d.multiply = function (out, a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
                out[0] = a0 * b0 + a2 * b1;
                out[1] = a1 * b0 + a3 * b1;
                out[2] = a0 * b2 + a2 * b3;
                out[3] = a1 * b2 + a3 * b3;
                out[4] = a0 * b4 + a2 * b5 + a4;
                out[5] = a1 * b4 + a3 * b5 + a5;
                return out;
            };
            mat2d.mul = mat2d.multiply;
            mat2d.rotate = function (out, a, rad) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], s = Math.sin(rad), c = Math.cos(rad);
                out[0] = a0 * c + a2 * s;
                out[1] = a1 * c + a3 * s;
                out[2] = a0 * -s + a2 * c;
                out[3] = a1 * -s + a3 * c;
                out[4] = a4;
                out[5] = a5;
                return out;
            };
            mat2d.scale = function (out, a, v) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], v0 = v[0], v1 = v[1];
                out[0] = a0 * v0;
                out[1] = a1 * v0;
                out[2] = a2 * v1;
                out[3] = a3 * v1;
                out[4] = a4;
                out[5] = a5;
                return out;
            };
            mat2d.translate = function (out, a, v) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], v0 = v[0], v1 = v[1];
                out[0] = a0;
                out[1] = a1;
                out[2] = a2;
                out[3] = a3;
                out[4] = a0 * v0 + a2 * v1 + a4;
                out[5] = a1 * v0 + a3 * v1 + a5;
                return out;
            };
            mat2d.fromRotation = function (out, rad) {
                var s = Math.sin(rad), c = Math.cos(rad);
                out[0] = c;
                out[1] = s;
                out[2] = -s;
                out[3] = c;
                out[4] = 0;
                out[5] = 0;
                return out;
            };
            mat2d.fromScaling = function (out, v) {
                out[0] = v[0];
                out[1] = 0;
                out[2] = 0;
                out[3] = v[1];
                out[4] = 0;
                out[5] = 0;
                return out;
            };
            mat2d.fromTranslation = function (out, v) {
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 1;
                out[4] = v[0];
                out[5] = v[1];
                return out;
            };
            mat2d.str = function (a) {
                return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
            };
            mat2d.frob = function (a) {
                return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1));
            };
            mat2d.add = function (out, a, b) {
                out[0] = a[0] + b[0];
                out[1] = a[1] + b[1];
                out[2] = a[2] + b[2];
                out[3] = a[3] + b[3];
                out[4] = a[4] + b[4];
                out[5] = a[5] + b[5];
                return out;
            };
            mat2d.subtract = function (out, a, b) {
                out[0] = a[0] - b[0];
                out[1] = a[1] - b[1];
                out[2] = a[2] - b[2];
                out[3] = a[3] - b[3];
                out[4] = a[4] - b[4];
                out[5] = a[5] - b[5];
                return out;
            };
            mat2d.sub = mat2d.subtract;
            mat2d.multiplyScalar = function (out, a, b) {
                out[0] = a[0] * b;
                out[1] = a[1] * b;
                out[2] = a[2] * b;
                out[3] = a[3] * b;
                out[4] = a[4] * b;
                out[5] = a[5] * b;
                return out;
            };
            mat2d.multiplyScalarAndAdd = function (out, a, b, scale) {
                out[0] = a[0] + (b[0] * scale);
                out[1] = a[1] + (b[1] * scale);
                out[2] = a[2] + (b[2] * scale);
                out[3] = a[3] + (b[3] * scale);
                out[4] = a[4] + (b[4] * scale);
                out[5] = a[5] + (b[5] * scale);
                return out;
            };
            mat2d.exactEquals = function (a, b) {
                return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
            };
            mat2d.equals = function (a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
                var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
                return (Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                    Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
                    Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
                    Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
                    Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
                    Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)));
            };
            module.exports = mat2d;
        },
        function (module, exports, __webpack_require__) {
            var glMatrix = __webpack_require__(1);
            var mat3 = {};
            mat3.create = function () {
                var out = new glMatrix.ARRAY_TYPE(9);
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 1;
                out[5] = 0;
                out[6] = 0;
                out[7] = 0;
                out[8] = 1;
                return out;
            };
            mat3.fromMat4 = function (out, a) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[4];
                out[4] = a[5];
                out[5] = a[6];
                out[6] = a[8];
                out[7] = a[9];
                out[8] = a[10];
                return out;
            };
            mat3.clone = function (a) {
                var out = new glMatrix.ARRAY_TYPE(9);
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[4] = a[4];
                out[5] = a[5];
                out[6] = a[6];
                out[7] = a[7];
                out[8] = a[8];
                return out;
            };
            mat3.copy = function (out, a) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[4] = a[4];
                out[5] = a[5];
                out[6] = a[6];
                out[7] = a[7];
                out[8] = a[8];
                return out;
            };
            mat3.fromValues = function (m00, m01, m02, m10, m11, m12, m20, m21, m22) {
                var out = new glMatrix.ARRAY_TYPE(9);
                out[0] = m00;
                out[1] = m01;
                out[2] = m02;
                out[3] = m10;
                out[4] = m11;
                out[5] = m12;
                out[6] = m20;
                out[7] = m21;
                out[8] = m22;
                return out;
            };
            mat3.set = function (out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
                out[0] = m00;
                out[1] = m01;
                out[2] = m02;
                out[3] = m10;
                out[4] = m11;
                out[5] = m12;
                out[6] = m20;
                out[7] = m21;
                out[8] = m22;
                return out;
            };
            mat3.identity = function (out) {
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 1;
                out[5] = 0;
                out[6] = 0;
                out[7] = 0;
                out[8] = 1;
                return out;
            };
            mat3.transpose = function (out, a) {
                if (out === a) {
                    var a01 = a[1], a02 = a[2], a12 = a[5];
                    out[1] = a[3];
                    out[2] = a[6];
                    out[3] = a01;
                    out[5] = a[7];
                    out[6] = a02;
                    out[7] = a12;
                }
                else {
                    out[0] = a[0];
                    out[1] = a[3];
                    out[2] = a[6];
                    out[3] = a[1];
                    out[4] = a[4];
                    out[5] = a[7];
                    out[6] = a[2];
                    out[7] = a[5];
                    out[8] = a[8];
                }
                return out;
            };
            mat3.invert = function (out, a) {
                var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, det = a00 * b01 + a01 * b11 + a02 * b21;
                if (!det) {
                    return null;
                }
                det = 1.0 / det;
                out[0] = b01 * det;
                out[1] = (-a22 * a01 + a02 * a21) * det;
                out[2] = (a12 * a01 - a02 * a11) * det;
                out[3] = b11 * det;
                out[4] = (a22 * a00 - a02 * a20) * det;
                out[5] = (-a12 * a00 + a02 * a10) * det;
                out[6] = b21 * det;
                out[7] = (-a21 * a00 + a01 * a20) * det;
                out[8] = (a11 * a00 - a01 * a10) * det;
                return out;
            };
            mat3.adjoint = function (out, a) {
                var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
                out[0] = (a11 * a22 - a12 * a21);
                out[1] = (a02 * a21 - a01 * a22);
                out[2] = (a01 * a12 - a02 * a11);
                out[3] = (a12 * a20 - a10 * a22);
                out[4] = (a00 * a22 - a02 * a20);
                out[5] = (a02 * a10 - a00 * a12);
                out[6] = (a10 * a21 - a11 * a20);
                out[7] = (a01 * a20 - a00 * a21);
                out[8] = (a00 * a11 - a01 * a10);
                return out;
            };
            mat3.determinant = function (a) {
                var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
                return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
            };
            mat3.multiply = function (out, a, b) {
                var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b00 = b[0], b01 = b[1], b02 = b[2], b10 = b[3], b11 = b[4], b12 = b[5], b20 = b[6], b21 = b[7], b22 = b[8];
                out[0] = b00 * a00 + b01 * a10 + b02 * a20;
                out[1] = b00 * a01 + b01 * a11 + b02 * a21;
                out[2] = b00 * a02 + b01 * a12 + b02 * a22;
                out[3] = b10 * a00 + b11 * a10 + b12 * a20;
                out[4] = b10 * a01 + b11 * a11 + b12 * a21;
                out[5] = b10 * a02 + b11 * a12 + b12 * a22;
                out[6] = b20 * a00 + b21 * a10 + b22 * a20;
                out[7] = b20 * a01 + b21 * a11 + b22 * a21;
                out[8] = b20 * a02 + b21 * a12 + b22 * a22;
                return out;
            };
            mat3.mul = mat3.multiply;
            mat3.translate = function (out, a, v) {
                var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
                out[0] = a00;
                out[1] = a01;
                out[2] = a02;
                out[3] = a10;
                out[4] = a11;
                out[5] = a12;
                out[6] = x * a00 + y * a10 + a20;
                out[7] = x * a01 + y * a11 + a21;
                out[8] = x * a02 + y * a12 + a22;
                return out;
            };
            mat3.rotate = function (out, a, rad) {
                var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
                out[0] = c * a00 + s * a10;
                out[1] = c * a01 + s * a11;
                out[2] = c * a02 + s * a12;
                out[3] = c * a10 - s * a00;
                out[4] = c * a11 - s * a01;
                out[5] = c * a12 - s * a02;
                out[6] = a20;
                out[7] = a21;
                out[8] = a22;
                return out;
            };
            mat3.scale = function (out, a, v) {
                var x = v[0], y = v[1];
                out[0] = x * a[0];
                out[1] = x * a[1];
                out[2] = x * a[2];
                out[3] = y * a[3];
                out[4] = y * a[4];
                out[5] = y * a[5];
                out[6] = a[6];
                out[7] = a[7];
                out[8] = a[8];
                return out;
            };
            mat3.fromTranslation = function (out, v) {
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 1;
                out[5] = 0;
                out[6] = v[0];
                out[7] = v[1];
                out[8] = 1;
                return out;
            };
            mat3.fromRotation = function (out, rad) {
                var s = Math.sin(rad), c = Math.cos(rad);
                out[0] = c;
                out[1] = s;
                out[2] = 0;
                out[3] = -s;
                out[4] = c;
                out[5] = 0;
                out[6] = 0;
                out[7] = 0;
                out[8] = 1;
                return out;
            };
            mat3.fromScaling = function (out, v) {
                out[0] = v[0];
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = v[1];
                out[5] = 0;
                out[6] = 0;
                out[7] = 0;
                out[8] = 1;
                return out;
            };
            mat3.fromMat2d = function (out, a) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = 0;
                out[3] = a[2];
                out[4] = a[3];
                out[5] = 0;
                out[6] = a[4];
                out[7] = a[5];
                out[8] = 1;
                return out;
            };
            mat3.fromQuat = function (out, q) {
                var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, yx = y * x2, yy = y * y2, zx = z * x2, zy = z * y2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
                out[0] = 1 - yy - zz;
                out[3] = yx - wz;
                out[6] = zx + wy;
                out[1] = yx + wz;
                out[4] = 1 - xx - zz;
                out[7] = zy - wx;
                out[2] = zx - wy;
                out[5] = zy + wx;
                out[8] = 1 - xx - yy;
                return out;
            };
            mat3.normalFromMat4 = function (out, a) {
                var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
                if (!det) {
                    return null;
                }
                det = 1.0 / det;
                out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
                out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
                out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
                out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
                out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
                out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
                out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
                out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
                out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
                return out;
            };
            mat3.str = function (a) {
                return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' +
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
            };
            mat3.frob = function (a) {
                return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)));
            };
            mat3.add = function (out, a, b) {
                out[0] = a[0] + b[0];
                out[1] = a[1] + b[1];
                out[2] = a[2] + b[2];
                out[3] = a[3] + b[3];
                out[4] = a[4] + b[4];
                out[5] = a[5] + b[5];
                out[6] = a[6] + b[6];
                out[7] = a[7] + b[7];
                out[8] = a[8] + b[8];
                return out;
            };
            mat3.subtract = function (out, a, b) {
                out[0] = a[0] - b[0];
                out[1] = a[1] - b[1];
                out[2] = a[2] - b[2];
                out[3] = a[3] - b[3];
                out[4] = a[4] - b[4];
                out[5] = a[5] - b[5];
                out[6] = a[6] - b[6];
                out[7] = a[7] - b[7];
                out[8] = a[8] - b[8];
                return out;
            };
            mat3.sub = mat3.subtract;
            mat3.multiplyScalar = function (out, a, b) {
                out[0] = a[0] * b;
                out[1] = a[1] * b;
                out[2] = a[2] * b;
                out[3] = a[3] * b;
                out[4] = a[4] * b;
                out[5] = a[5] * b;
                out[6] = a[6] * b;
                out[7] = a[7] * b;
                out[8] = a[8] * b;
                return out;
            };
            mat3.multiplyScalarAndAdd = function (out, a, b, scale) {
                out[0] = a[0] + (b[0] * scale);
                out[1] = a[1] + (b[1] * scale);
                out[2] = a[2] + (b[2] * scale);
                out[3] = a[3] + (b[3] * scale);
                out[4] = a[4] + (b[4] * scale);
                out[5] = a[5] + (b[5] * scale);
                out[6] = a[6] + (b[6] * scale);
                out[7] = a[7] + (b[7] * scale);
                out[8] = a[8] + (b[8] * scale);
                return out;
            };
            mat3.exactEquals = function (a, b) {
                return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] &&
                    a[3] === b[3] && a[4] === b[4] && a[5] === b[5] &&
                    a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
            };
            mat3.equals = function (a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
                var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = a[6], b7 = b[7], b8 = b[8];
                return (Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                    Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
                    Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
                    Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
                    Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
                    Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
                    Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
                    Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
                    Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)));
            };
            module.exports = mat3;
        },
        function (module, exports, __webpack_require__) {
            var glMatrix = __webpack_require__(1);
            var mat4 = {
                scalar: {},
                SIMD: {},
            };
            mat4.create = function () {
                var out = new glMatrix.ARRAY_TYPE(16);
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = 1;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = 1;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            };
            mat4.clone = function (a) {
                var out = new glMatrix.ARRAY_TYPE(16);
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[4] = a[4];
                out[5] = a[5];
                out[6] = a[6];
                out[7] = a[7];
                out[8] = a[8];
                out[9] = a[9];
                out[10] = a[10];
                out[11] = a[11];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
                return out;
            };
            mat4.copy = function (out, a) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[4] = a[4];
                out[5] = a[5];
                out[6] = a[6];
                out[7] = a[7];
                out[8] = a[8];
                out[9] = a[9];
                out[10] = a[10];
                out[11] = a[11];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
                return out;
            };
            mat4.fromValues = function (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
                var out = new glMatrix.ARRAY_TYPE(16);
                out[0] = m00;
                out[1] = m01;
                out[2] = m02;
                out[3] = m03;
                out[4] = m10;
                out[5] = m11;
                out[6] = m12;
                out[7] = m13;
                out[8] = m20;
                out[9] = m21;
                out[10] = m22;
                out[11] = m23;
                out[12] = m30;
                out[13] = m31;
                out[14] = m32;
                out[15] = m33;
                return out;
            };
            mat4.set = function (out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
                out[0] = m00;
                out[1] = m01;
                out[2] = m02;
                out[3] = m03;
                out[4] = m10;
                out[5] = m11;
                out[6] = m12;
                out[7] = m13;
                out[8] = m20;
                out[9] = m21;
                out[10] = m22;
                out[11] = m23;
                out[12] = m30;
                out[13] = m31;
                out[14] = m32;
                out[15] = m33;
                return out;
            };
            mat4.identity = function (out) {
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = 1;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = 1;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            };
            mat4.scalar.transpose = function (out, a) {
                if (out === a) {
                    var a01 = a[1], a02 = a[2], a03 = a[3], a12 = a[6], a13 = a[7], a23 = a[11];
                    out[1] = a[4];
                    out[2] = a[8];
                    out[3] = a[12];
                    out[4] = a01;
                    out[6] = a[9];
                    out[7] = a[13];
                    out[8] = a02;
                    out[9] = a12;
                    out[11] = a[14];
                    out[12] = a03;
                    out[13] = a13;
                    out[14] = a23;
                }
                else {
                    out[0] = a[0];
                    out[1] = a[4];
                    out[2] = a[8];
                    out[3] = a[12];
                    out[4] = a[1];
                    out[5] = a[5];
                    out[6] = a[9];
                    out[7] = a[13];
                    out[8] = a[2];
                    out[9] = a[6];
                    out[10] = a[10];
                    out[11] = a[14];
                    out[12] = a[3];
                    out[13] = a[7];
                    out[14] = a[11];
                    out[15] = a[15];
                }
                return out;
            };
            mat4.SIMD.transpose = function (out, a) {
                var a0, a1, a2, a3, tmp01, tmp23, out0, out1, out2, out3;
                a0 = SIMD.Float32x4.load(a, 0);
                a1 = SIMD.Float32x4.load(a, 4);
                a2 = SIMD.Float32x4.load(a, 8);
                a3 = SIMD.Float32x4.load(a, 12);
                tmp01 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
                tmp23 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
                out0 = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
                out1 = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
                SIMD.Float32x4.store(out, 0, out0);
                SIMD.Float32x4.store(out, 4, out1);
                tmp01 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
                tmp23 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
                out2 = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
                out3 = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
                SIMD.Float32x4.store(out, 8, out2);
                SIMD.Float32x4.store(out, 12, out3);
                return out;
            };
            mat4.transpose = glMatrix.USE_SIMD ? mat4.SIMD.transpose : mat4.scalar.transpose;
            mat4.scalar.invert = function (out, a) {
                var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
                if (!det) {
                    return null;
                }
                det = 1.0 / det;
                out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
                out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
                out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
                out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
                out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
                out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
                out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
                out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
                out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
                out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
                out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
                out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
                out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
                out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
                out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
                out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
                return out;
            };
            mat4.SIMD.invert = function (out, a) {
                var row0, row1, row2, row3, tmp1, minor0, minor1, minor2, minor3, det, a0 = SIMD.Float32x4.load(a, 0), a1 = SIMD.Float32x4.load(a, 4), a2 = SIMD.Float32x4.load(a, 8), a3 = SIMD.Float32x4.load(a, 12);
                tmp1 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
                row1 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
                row0 = SIMD.Float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
                row1 = SIMD.Float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);
                tmp1 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
                row3 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
                row2 = SIMD.Float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
                row3 = SIMD.Float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);
                tmp1 = SIMD.Float32x4.mul(row2, row3);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                minor0 = SIMD.Float32x4.mul(row1, tmp1);
                minor1 = SIMD.Float32x4.mul(row0, tmp1);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor0 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row1, tmp1), minor0);
                minor1 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor1);
                minor1 = SIMD.Float32x4.swizzle(minor1, 2, 3, 0, 1);
                tmp1 = SIMD.Float32x4.mul(row1, row2);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor0);
                minor3 = SIMD.Float32x4.mul(row0, tmp1);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row3, tmp1));
                minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor3);
                minor3 = SIMD.Float32x4.swizzle(minor3, 2, 3, 0, 1);
                tmp1 = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(row1, 2, 3, 0, 1), row3);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                row2 = SIMD.Float32x4.swizzle(row2, 2, 3, 0, 1);
                minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor0);
                minor2 = SIMD.Float32x4.mul(row0, tmp1);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row2, tmp1));
                minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor2);
                minor2 = SIMD.Float32x4.swizzle(minor2, 2, 3, 0, 1);
                tmp1 = SIMD.Float32x4.mul(row0, row1);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor2);
                minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row2, tmp1), minor3);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row3, tmp1), minor2);
                minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row2, tmp1));
                tmp1 = SIMD.Float32x4.mul(row0, row3);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row2, tmp1));
                minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor2);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor1);
                minor2 = SIMD.Float32x4.sub(minor2, SIMD.Float32x4.mul(row1, tmp1));
                tmp1 = SIMD.Float32x4.mul(row0, row2);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor1);
                minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row1, tmp1));
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row3, tmp1));
                minor3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor3);
                det = SIMD.Float32x4.mul(row0, minor0);
                det = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 2, 3, 0, 1), det);
                det = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 1, 0, 3, 2), det);
                tmp1 = SIMD.Float32x4.reciprocalApproximation(det);
                det = SIMD.Float32x4.sub(SIMD.Float32x4.add(tmp1, tmp1), SIMD.Float32x4.mul(det, SIMD.Float32x4.mul(tmp1, tmp1)));
                det = SIMD.Float32x4.swizzle(det, 0, 0, 0, 0);
                if (!det) {
                    return null;
                }
                SIMD.Float32x4.store(out, 0, SIMD.Float32x4.mul(det, minor0));
                SIMD.Float32x4.store(out, 4, SIMD.Float32x4.mul(det, minor1));
                SIMD.Float32x4.store(out, 8, SIMD.Float32x4.mul(det, minor2));
                SIMD.Float32x4.store(out, 12, SIMD.Float32x4.mul(det, minor3));
                return out;
            };
            mat4.invert = glMatrix.USE_SIMD ? mat4.SIMD.invert : mat4.scalar.invert;
            mat4.scalar.adjoint = function (out, a) {
                var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
                out[0] = (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
                out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
                out[2] = (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
                out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
                out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
                out[5] = (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
                out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
                out[7] = (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
                out[8] = (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
                out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
                out[10] = (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
                out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
                out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
                out[13] = (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
                out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
                out[15] = (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
                return out;
            };
            mat4.SIMD.adjoint = function (out, a) {
                var a0, a1, a2, a3;
                var row0, row1, row2, row3;
                var tmp1;
                var minor0, minor1, minor2, minor3;
                var a0 = SIMD.Float32x4.load(a, 0);
                var a1 = SIMD.Float32x4.load(a, 4);
                var a2 = SIMD.Float32x4.load(a, 8);
                var a3 = SIMD.Float32x4.load(a, 12);
                tmp1 = SIMD.Float32x4.shuffle(a0, a1, 0, 1, 4, 5);
                row1 = SIMD.Float32x4.shuffle(a2, a3, 0, 1, 4, 5);
                row0 = SIMD.Float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
                row1 = SIMD.Float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);
                tmp1 = SIMD.Float32x4.shuffle(a0, a1, 2, 3, 6, 7);
                row3 = SIMD.Float32x4.shuffle(a2, a3, 2, 3, 6, 7);
                row2 = SIMD.Float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
                row3 = SIMD.Float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);
                tmp1 = SIMD.Float32x4.mul(row2, row3);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                minor0 = SIMD.Float32x4.mul(row1, tmp1);
                minor1 = SIMD.Float32x4.mul(row0, tmp1);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor0 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row1, tmp1), minor0);
                minor1 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor1);
                minor1 = SIMD.Float32x4.swizzle(minor1, 2, 3, 0, 1);
                tmp1 = SIMD.Float32x4.mul(row1, row2);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor0);
                minor3 = SIMD.Float32x4.mul(row0, tmp1);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row3, tmp1));
                minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor3);
                minor3 = SIMD.Float32x4.swizzle(minor3, 2, 3, 0, 1);
                tmp1 = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(row1, 2, 3, 0, 1), row3);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                row2 = SIMD.Float32x4.swizzle(row2, 2, 3, 0, 1);
                minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor0);
                minor2 = SIMD.Float32x4.mul(row0, tmp1);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row2, tmp1));
                minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor2);
                minor2 = SIMD.Float32x4.swizzle(minor2, 2, 3, 0, 1);
                tmp1 = SIMD.Float32x4.mul(row0, row1);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor2);
                minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row2, tmp1), minor3);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row3, tmp1), minor2);
                minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row2, tmp1));
                tmp1 = SIMD.Float32x4.mul(row0, row3);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row2, tmp1));
                minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor2);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor1);
                minor2 = SIMD.Float32x4.sub(minor2, SIMD.Float32x4.mul(row1, tmp1));
                tmp1 = SIMD.Float32x4.mul(row0, row2);
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
                minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor1);
                minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row1, tmp1));
                tmp1 = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
                minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row3, tmp1));
                minor3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor3);
                SIMD.Float32x4.store(out, 0, minor0);
                SIMD.Float32x4.store(out, 4, minor1);
                SIMD.Float32x4.store(out, 8, minor2);
                SIMD.Float32x4.store(out, 12, minor3);
                return out;
            };
            mat4.adjoint = glMatrix.USE_SIMD ? mat4.SIMD.adjoint : mat4.scalar.adjoint;
            mat4.determinant = function (a) {
                var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
                return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            };
            mat4.SIMD.multiply = function (out, a, b) {
                var a0 = SIMD.Float32x4.load(a, 0);
                var a1 = SIMD.Float32x4.load(a, 4);
                var a2 = SIMD.Float32x4.load(a, 8);
                var a3 = SIMD.Float32x4.load(a, 12);
                var b0 = SIMD.Float32x4.load(b, 0);
                var out0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 0, 0, 0, 0), a0), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 1, 1, 1, 1), a1), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 2, 2, 2, 2), a2), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b0, 3, 3, 3, 3), a3))));
                SIMD.Float32x4.store(out, 0, out0);
                var b1 = SIMD.Float32x4.load(b, 4);
                var out1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 0, 0, 0, 0), a0), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 1, 1, 1, 1), a1), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 2, 2, 2, 2), a2), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b1, 3, 3, 3, 3), a3))));
                SIMD.Float32x4.store(out, 4, out1);
                var b2 = SIMD.Float32x4.load(b, 8);
                var out2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 0, 0, 0, 0), a0), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 1, 1, 1, 1), a1), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 2, 2, 2, 2), a2), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b2, 3, 3, 3, 3), a3))));
                SIMD.Float32x4.store(out, 8, out2);
                var b3 = SIMD.Float32x4.load(b, 12);
                var out3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 0, 0, 0, 0), a0), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 1, 1, 1, 1), a1), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 2, 2, 2, 2), a2), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(b3, 3, 3, 3, 3), a3))));
                SIMD.Float32x4.store(out, 12, out3);
                return out;
            };
            mat4.scalar.multiply = function (out, a, b) {
                var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
                var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
                out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = b[4];
                b1 = b[5];
                b2 = b[6];
                b3 = b[7];
                out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = b[8];
                b1 = b[9];
                b2 = b[10];
                b3 = b[11];
                out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                b0 = b[12];
                b1 = b[13];
                b2 = b[14];
                b3 = b[15];
                out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
                out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
                out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
                out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
                return out;
            };
            mat4.multiply = glMatrix.USE_SIMD ? mat4.SIMD.multiply : mat4.scalar.multiply;
            mat4.mul = mat4.multiply;
            mat4.scalar.translate = function (out, a, v) {
                var x = v[0], y = v[1], z = v[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
                if (a === out) {
                    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
                    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
                    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
                    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
                }
                else {
                    a00 = a[0];
                    a01 = a[1];
                    a02 = a[2];
                    a03 = a[3];
                    a10 = a[4];
                    a11 = a[5];
                    a12 = a[6];
                    a13 = a[7];
                    a20 = a[8];
                    a21 = a[9];
                    a22 = a[10];
                    a23 = a[11];
                    out[0] = a00;
                    out[1] = a01;
                    out[2] = a02;
                    out[3] = a03;
                    out[4] = a10;
                    out[5] = a11;
                    out[6] = a12;
                    out[7] = a13;
                    out[8] = a20;
                    out[9] = a21;
                    out[10] = a22;
                    out[11] = a23;
                    out[12] = a00 * x + a10 * y + a20 * z + a[12];
                    out[13] = a01 * x + a11 * y + a21 * z + a[13];
                    out[14] = a02 * x + a12 * y + a22 * z + a[14];
                    out[15] = a03 * x + a13 * y + a23 * z + a[15];
                }
                return out;
            };
            mat4.SIMD.translate = function (out, a, v) {
                var a0 = SIMD.Float32x4.load(a, 0), a1 = SIMD.Float32x4.load(a, 4), a2 = SIMD.Float32x4.load(a, 8), a3 = SIMD.Float32x4.load(a, 12), vec = SIMD.Float32x4(v[0], v[1], v[2], 0);
                if (a !== out) {
                    out[0] = a[0];
                    out[1] = a[1];
                    out[2] = a[2];
                    out[3] = a[3];
                    out[4] = a[4];
                    out[5] = a[5];
                    out[6] = a[6];
                    out[7] = a[7];
                    out[8] = a[8];
                    out[9] = a[9];
                    out[10] = a[10];
                    out[11] = a[11];
                }
                a0 = SIMD.Float32x4.mul(a0, SIMD.Float32x4.swizzle(vec, 0, 0, 0, 0));
                a1 = SIMD.Float32x4.mul(a1, SIMD.Float32x4.swizzle(vec, 1, 1, 1, 1));
                a2 = SIMD.Float32x4.mul(a2, SIMD.Float32x4.swizzle(vec, 2, 2, 2, 2));
                var t0 = SIMD.Float32x4.add(a0, SIMD.Float32x4.add(a1, SIMD.Float32x4.add(a2, a3)));
                SIMD.Float32x4.store(out, 12, t0);
                return out;
            };
            mat4.translate = glMatrix.USE_SIMD ? mat4.SIMD.translate : mat4.scalar.translate;
            mat4.scalar.scale = function (out, a, v) {
                var x = v[0], y = v[1], z = v[2];
                out[0] = a[0] * x;
                out[1] = a[1] * x;
                out[2] = a[2] * x;
                out[3] = a[3] * x;
                out[4] = a[4] * y;
                out[5] = a[5] * y;
                out[6] = a[6] * y;
                out[7] = a[7] * y;
                out[8] = a[8] * z;
                out[9] = a[9] * z;
                out[10] = a[10] * z;
                out[11] = a[11] * z;
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
                return out;
            };
            mat4.SIMD.scale = function (out, a, v) {
                var a0, a1, a2;
                var vec = SIMD.Float32x4(v[0], v[1], v[2], 0);
                a0 = SIMD.Float32x4.load(a, 0);
                SIMD.Float32x4.store(out, 0, SIMD.Float32x4.mul(a0, SIMD.Float32x4.swizzle(vec, 0, 0, 0, 0)));
                a1 = SIMD.Float32x4.load(a, 4);
                SIMD.Float32x4.store(out, 4, SIMD.Float32x4.mul(a1, SIMD.Float32x4.swizzle(vec, 1, 1, 1, 1)));
                a2 = SIMD.Float32x4.load(a, 8);
                SIMD.Float32x4.store(out, 8, SIMD.Float32x4.mul(a2, SIMD.Float32x4.swizzle(vec, 2, 2, 2, 2)));
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
                return out;
            };
            mat4.scale = glMatrix.USE_SIMD ? mat4.SIMD.scale : mat4.scalar.scale;
            mat4.rotate = function (out, a, rad, axis) {
                var x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z), s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22;
                if (Math.abs(len) < glMatrix.EPSILON) {
                    return null;
                }
                len = 1 / len;
                x *= len;
                y *= len;
                z *= len;
                s = Math.sin(rad);
                c = Math.cos(rad);
                t = 1 - c;
                a00 = a[0];
                a01 = a[1];
                a02 = a[2];
                a03 = a[3];
                a10 = a[4];
                a11 = a[5];
                a12 = a[6];
                a13 = a[7];
                a20 = a[8];
                a21 = a[9];
                a22 = a[10];
                a23 = a[11];
                b00 = x * x * t + c;
                b01 = y * x * t + z * s;
                b02 = z * x * t - y * s;
                b10 = x * y * t - z * s;
                b11 = y * y * t + c;
                b12 = z * y * t + x * s;
                b20 = x * z * t + y * s;
                b21 = y * z * t - x * s;
                b22 = z * z * t + c;
                out[0] = a00 * b00 + a10 * b01 + a20 * b02;
                out[1] = a01 * b00 + a11 * b01 + a21 * b02;
                out[2] = a02 * b00 + a12 * b01 + a22 * b02;
                out[3] = a03 * b00 + a13 * b01 + a23 * b02;
                out[4] = a00 * b10 + a10 * b11 + a20 * b12;
                out[5] = a01 * b10 + a11 * b11 + a21 * b12;
                out[6] = a02 * b10 + a12 * b11 + a22 * b12;
                out[7] = a03 * b10 + a13 * b11 + a23 * b12;
                out[8] = a00 * b20 + a10 * b21 + a20 * b22;
                out[9] = a01 * b20 + a11 * b21 + a21 * b22;
                out[10] = a02 * b20 + a12 * b21 + a22 * b22;
                out[11] = a03 * b20 + a13 * b21 + a23 * b22;
                if (a !== out) {
                    out[12] = a[12];
                    out[13] = a[13];
                    out[14] = a[14];
                    out[15] = a[15];
                }
                return out;
            };
            mat4.scalar.rotateX = function (out, a, rad) {
                var s = Math.sin(rad), c = Math.cos(rad), a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
                if (a !== out) {
                    out[0] = a[0];
                    out[1] = a[1];
                    out[2] = a[2];
                    out[3] = a[3];
                    out[12] = a[12];
                    out[13] = a[13];
                    out[14] = a[14];
                    out[15] = a[15];
                }
                out[4] = a10 * c + a20 * s;
                out[5] = a11 * c + a21 * s;
                out[6] = a12 * c + a22 * s;
                out[7] = a13 * c + a23 * s;
                out[8] = a20 * c - a10 * s;
                out[9] = a21 * c - a11 * s;
                out[10] = a22 * c - a12 * s;
                out[11] = a23 * c - a13 * s;
                return out;
            };
            mat4.SIMD.rotateX = function (out, a, rad) {
                var s = SIMD.Float32x4.splat(Math.sin(rad)), c = SIMD.Float32x4.splat(Math.cos(rad));
                if (a !== out) {
                    out[0] = a[0];
                    out[1] = a[1];
                    out[2] = a[2];
                    out[3] = a[3];
                    out[12] = a[12];
                    out[13] = a[13];
                    out[14] = a[14];
                    out[15] = a[15];
                }
                var a_1 = SIMD.Float32x4.load(a, 4);
                var a_2 = SIMD.Float32x4.load(a, 8);
                SIMD.Float32x4.store(out, 4, SIMD.Float32x4.add(SIMD.Float32x4.mul(a_1, c), SIMD.Float32x4.mul(a_2, s)));
                SIMD.Float32x4.store(out, 8, SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_2, c), SIMD.Float32x4.mul(a_1, s)));
                return out;
            };
            mat4.rotateX = glMatrix.USE_SIMD ? mat4.SIMD.rotateX : mat4.scalar.rotateX;
            mat4.scalar.rotateY = function (out, a, rad) {
                var s = Math.sin(rad), c = Math.cos(rad), a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
                if (a !== out) {
                    out[4] = a[4];
                    out[5] = a[5];
                    out[6] = a[6];
                    out[7] = a[7];
                    out[12] = a[12];
                    out[13] = a[13];
                    out[14] = a[14];
                    out[15] = a[15];
                }
                out[0] = a00 * c - a20 * s;
                out[1] = a01 * c - a21 * s;
                out[2] = a02 * c - a22 * s;
                out[3] = a03 * c - a23 * s;
                out[8] = a00 * s + a20 * c;
                out[9] = a01 * s + a21 * c;
                out[10] = a02 * s + a22 * c;
                out[11] = a03 * s + a23 * c;
                return out;
            };
            mat4.SIMD.rotateY = function (out, a, rad) {
                var s = SIMD.Float32x4.splat(Math.sin(rad)), c = SIMD.Float32x4.splat(Math.cos(rad));
                if (a !== out) {
                    out[4] = a[4];
                    out[5] = a[5];
                    out[6] = a[6];
                    out[7] = a[7];
                    out[12] = a[12];
                    out[13] = a[13];
                    out[14] = a[14];
                    out[15] = a[15];
                }
                var a_0 = SIMD.Float32x4.load(a, 0);
                var a_2 = SIMD.Float32x4.load(a, 8);
                SIMD.Float32x4.store(out, 0, SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_0, c), SIMD.Float32x4.mul(a_2, s)));
                SIMD.Float32x4.store(out, 8, SIMD.Float32x4.add(SIMD.Float32x4.mul(a_0, s), SIMD.Float32x4.mul(a_2, c)));
                return out;
            };
            mat4.rotateY = glMatrix.USE_SIMD ? mat4.SIMD.rotateY : mat4.scalar.rotateY;
            mat4.scalar.rotateZ = function (out, a, rad) {
                var s = Math.sin(rad), c = Math.cos(rad), a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
                if (a !== out) {
                    out[8] = a[8];
                    out[9] = a[9];
                    out[10] = a[10];
                    out[11] = a[11];
                    out[12] = a[12];
                    out[13] = a[13];
                    out[14] = a[14];
                    out[15] = a[15];
                }
                out[0] = a00 * c + a10 * s;
                out[1] = a01 * c + a11 * s;
                out[2] = a02 * c + a12 * s;
                out[3] = a03 * c + a13 * s;
                out[4] = a10 * c - a00 * s;
                out[5] = a11 * c - a01 * s;
                out[6] = a12 * c - a02 * s;
                out[7] = a13 * c - a03 * s;
                return out;
            };
            mat4.SIMD.rotateZ = function (out, a, rad) {
                var s = SIMD.Float32x4.splat(Math.sin(rad)), c = SIMD.Float32x4.splat(Math.cos(rad));
                if (a !== out) {
                    out[8] = a[8];
                    out[9] = a[9];
                    out[10] = a[10];
                    out[11] = a[11];
                    out[12] = a[12];
                    out[13] = a[13];
                    out[14] = a[14];
                    out[15] = a[15];
                }
                var a_0 = SIMD.Float32x4.load(a, 0);
                var a_1 = SIMD.Float32x4.load(a, 4);
                SIMD.Float32x4.store(out, 0, SIMD.Float32x4.add(SIMD.Float32x4.mul(a_0, c), SIMD.Float32x4.mul(a_1, s)));
                SIMD.Float32x4.store(out, 4, SIMD.Float32x4.sub(SIMD.Float32x4.mul(a_1, c), SIMD.Float32x4.mul(a_0, s)));
                return out;
            };
            mat4.rotateZ = glMatrix.USE_SIMD ? mat4.SIMD.rotateZ : mat4.scalar.rotateZ;
            mat4.fromTranslation = function (out, v) {
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = 1;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = 1;
                out[11] = 0;
                out[12] = v[0];
                out[13] = v[1];
                out[14] = v[2];
                out[15] = 1;
                return out;
            };
            mat4.fromScaling = function (out, v) {
                out[0] = v[0];
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = v[1];
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = v[2];
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            };
            mat4.fromRotation = function (out, rad, axis) {
                var x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z), s, c, t;
                if (Math.abs(len) < glMatrix.EPSILON) {
                    return null;
                }
                len = 1 / len;
                x *= len;
                y *= len;
                z *= len;
                s = Math.sin(rad);
                c = Math.cos(rad);
                t = 1 - c;
                out[0] = x * x * t + c;
                out[1] = y * x * t + z * s;
                out[2] = z * x * t - y * s;
                out[3] = 0;
                out[4] = x * y * t - z * s;
                out[5] = y * y * t + c;
                out[6] = z * y * t + x * s;
                out[7] = 0;
                out[8] = x * z * t + y * s;
                out[9] = y * z * t - x * s;
                out[10] = z * z * t + c;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            };
            mat4.fromXRotation = function (out, rad) {
                var s = Math.sin(rad), c = Math.cos(rad);
                out[0] = 1;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = c;
                out[6] = s;
                out[7] = 0;
                out[8] = 0;
                out[9] = -s;
                out[10] = c;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            };
            mat4.fromYRotation = function (out, rad) {
                var s = Math.sin(rad), c = Math.cos(rad);
                out[0] = c;
                out[1] = 0;
                out[2] = -s;
                out[3] = 0;
                out[4] = 0;
                out[5] = 1;
                out[6] = 0;
                out[7] = 0;
                out[8] = s;
                out[9] = 0;
                out[10] = c;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            };
            mat4.fromZRotation = function (out, rad) {
                var s = Math.sin(rad), c = Math.cos(rad);
                out[0] = c;
                out[1] = s;
                out[2] = 0;
                out[3] = 0;
                out[4] = -s;
                out[5] = c;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = 1;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            };
            mat4.fromRotationTranslation = function (out, q, v) {
                var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
                out[0] = 1 - (yy + zz);
                out[1] = xy + wz;
                out[2] = xz - wy;
                out[3] = 0;
                out[4] = xy - wz;
                out[5] = 1 - (xx + zz);
                out[6] = yz + wx;
                out[7] = 0;
                out[8] = xz + wy;
                out[9] = yz - wx;
                out[10] = 1 - (xx + yy);
                out[11] = 0;
                out[12] = v[0];
                out[13] = v[1];
                out[14] = v[2];
                out[15] = 1;
                return out;
            };
            mat4.getTranslation = function (out, mat) {
                out[0] = mat[12];
                out[1] = mat[13];
                out[2] = mat[14];
                return out;
            };
            mat4.getRotation = function (out, mat) {
                var trace = mat[0] + mat[5] + mat[10];
                var S = 0;
                if (trace > 0) {
                    S = Math.sqrt(trace + 1.0) * 2;
                    out[3] = 0.25 * S;
                    out[0] = (mat[6] - mat[9]) / S;
                    out[1] = (mat[8] - mat[2]) / S;
                    out[2] = (mat[1] - mat[4]) / S;
                }
                else if ((mat[0] > mat[5]) & (mat[0] > mat[10])) {
                    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
                    out[3] = (mat[6] - mat[9]) / S;
                    out[0] = 0.25 * S;
                    out[1] = (mat[1] + mat[4]) / S;
                    out[2] = (mat[8] + mat[2]) / S;
                }
                else if (mat[5] > mat[10]) {
                    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
                    out[3] = (mat[8] - mat[2]) / S;
                    out[0] = (mat[1] + mat[4]) / S;
                    out[1] = 0.25 * S;
                    out[2] = (mat[6] + mat[9]) / S;
                }
                else {
                    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
                    out[3] = (mat[1] - mat[4]) / S;
                    out[0] = (mat[8] + mat[2]) / S;
                    out[1] = (mat[6] + mat[9]) / S;
                    out[2] = 0.25 * S;
                }
                return out;
            };
            mat4.fromRotationTranslationScale = function (out, q, v, s) {
                var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2, sx = s[0], sy = s[1], sz = s[2];
                out[0] = (1 - (yy + zz)) * sx;
                out[1] = (xy + wz) * sx;
                out[2] = (xz - wy) * sx;
                out[3] = 0;
                out[4] = (xy - wz) * sy;
                out[5] = (1 - (xx + zz)) * sy;
                out[6] = (yz + wx) * sy;
                out[7] = 0;
                out[8] = (xz + wy) * sz;
                out[9] = (yz - wx) * sz;
                out[10] = (1 - (xx + yy)) * sz;
                out[11] = 0;
                out[12] = v[0];
                out[13] = v[1];
                out[14] = v[2];
                out[15] = 1;
                return out;
            };
            mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
                var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2, sx = s[0], sy = s[1], sz = s[2], ox = o[0], oy = o[1], oz = o[2];
                out[0] = (1 - (yy + zz)) * sx;
                out[1] = (xy + wz) * sx;
                out[2] = (xz - wy) * sx;
                out[3] = 0;
                out[4] = (xy - wz) * sy;
                out[5] = (1 - (xx + zz)) * sy;
                out[6] = (yz + wx) * sy;
                out[7] = 0;
                out[8] = (xz + wy) * sz;
                out[9] = (yz - wx) * sz;
                out[10] = (1 - (xx + yy)) * sz;
                out[11] = 0;
                out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
                out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
                out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
                out[15] = 1;
                return out;
            };
            mat4.fromQuat = function (out, q) {
                var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, yx = y * x2, yy = y * y2, zx = z * x2, zy = z * y2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
                out[0] = 1 - yy - zz;
                out[1] = yx + wz;
                out[2] = zx - wy;
                out[3] = 0;
                out[4] = yx - wz;
                out[5] = 1 - xx - zz;
                out[6] = zy + wx;
                out[7] = 0;
                out[8] = zx + wy;
                out[9] = zy - wx;
                out[10] = 1 - xx - yy;
                out[11] = 0;
                out[12] = 0;
                out[13] = 0;
                out[14] = 0;
                out[15] = 1;
                return out;
            };
            mat4.frustum = function (out, left, right, bottom, top, near, far) {
                var rl = 1 / (right - left), tb = 1 / (top - bottom), nf = 1 / (near - far);
                out[0] = (near * 2) * rl;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = (near * 2) * tb;
                out[6] = 0;
                out[7] = 0;
                out[8] = (right + left) * rl;
                out[9] = (top + bottom) * tb;
                out[10] = (far + near) * nf;
                out[11] = -1;
                out[12] = 0;
                out[13] = 0;
                out[14] = (far * near * 2) * nf;
                out[15] = 0;
                return out;
            };
            mat4.perspective = function (out, fovy, aspect, near, far) {
                var f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
                out[0] = f / aspect;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = f;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = (far + near) * nf;
                out[11] = -1;
                out[12] = 0;
                out[13] = 0;
                out[14] = (2 * far * near) * nf;
                out[15] = 0;
                return out;
            };
            mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
                var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0), downTan = Math.tan(fov.downDegrees * Math.PI / 180.0), leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0), rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0), xScale = 2.0 / (leftTan + rightTan), yScale = 2.0 / (upTan + downTan);
                out[0] = xScale;
                out[1] = 0.0;
                out[2] = 0.0;
                out[3] = 0.0;
                out[4] = 0.0;
                out[5] = yScale;
                out[6] = 0.0;
                out[7] = 0.0;
                out[8] = -((leftTan - rightTan) * xScale * 0.5);
                out[9] = ((upTan - downTan) * yScale * 0.5);
                out[10] = far / (near - far);
                out[11] = -1.0;
                out[12] = 0.0;
                out[13] = 0.0;
                out[14] = (far * near) / (near - far);
                out[15] = 0.0;
                return out;
            };
            mat4.ortho = function (out, left, right, bottom, top, near, far) {
                var lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
                out[0] = -2 * lr;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                out[4] = 0;
                out[5] = -2 * bt;
                out[6] = 0;
                out[7] = 0;
                out[8] = 0;
                out[9] = 0;
                out[10] = 2 * nf;
                out[11] = 0;
                out[12] = (left + right) * lr;
                out[13] = (top + bottom) * bt;
                out[14] = (far + near) * nf;
                out[15] = 1;
                return out;
            };
            mat4.lookAt = function (out, eye, center, up) {
                var x0, x1, x2, y0, y1, y2, z0, z1, z2, len, eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2], centerx = center[0], centery = center[1], centerz = center[2];
                if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
                    Math.abs(eyey - centery) < glMatrix.EPSILON &&
                    Math.abs(eyez - centerz) < glMatrix.EPSILON) {
                    return mat4.identity(out);
                }
                z0 = eyex - centerx;
                z1 = eyey - centery;
                z2 = eyez - centerz;
                len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
                z0 *= len;
                z1 *= len;
                z2 *= len;
                x0 = upy * z2 - upz * z1;
                x1 = upz * z0 - upx * z2;
                x2 = upx * z1 - upy * z0;
                len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
                if (!len) {
                    x0 = 0;
                    x1 = 0;
                    x2 = 0;
                }
                else {
                    len = 1 / len;
                    x0 *= len;
                    x1 *= len;
                    x2 *= len;
                }
                y0 = z1 * x2 - z2 * x1;
                y1 = z2 * x0 - z0 * x2;
                y2 = z0 * x1 - z1 * x0;
                len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
                if (!len) {
                    y0 = 0;
                    y1 = 0;
                    y2 = 0;
                }
                else {
                    len = 1 / len;
                    y0 *= len;
                    y1 *= len;
                    y2 *= len;
                }
                out[0] = x0;
                out[1] = y0;
                out[2] = z0;
                out[3] = 0;
                out[4] = x1;
                out[5] = y1;
                out[6] = z1;
                out[7] = 0;
                out[8] = x2;
                out[9] = y2;
                out[10] = z2;
                out[11] = 0;
                out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
                out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
                out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
                out[15] = 1;
                return out;
            };
            mat4.str = function (a) {
                return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' +
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
            };
            mat4.frob = function (a) {
                return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2)));
            };
            mat4.add = function (out, a, b) {
                out[0] = a[0] + b[0];
                out[1] = a[1] + b[1];
                out[2] = a[2] + b[2];
                out[3] = a[3] + b[3];
                out[4] = a[4] + b[4];
                out[5] = a[5] + b[5];
                out[6] = a[6] + b[6];
                out[7] = a[7] + b[7];
                out[8] = a[8] + b[8];
                out[9] = a[9] + b[9];
                out[10] = a[10] + b[10];
                out[11] = a[11] + b[11];
                out[12] = a[12] + b[12];
                out[13] = a[13] + b[13];
                out[14] = a[14] + b[14];
                out[15] = a[15] + b[15];
                return out;
            };
            mat4.subtract = function (out, a, b) {
                out[0] = a[0] - b[0];
                out[1] = a[1] - b[1];
                out[2] = a[2] - b[2];
                out[3] = a[3] - b[3];
                out[4] = a[4] - b[4];
                out[5] = a[5] - b[5];
                out[6] = a[6] - b[6];
                out[7] = a[7] - b[7];
                out[8] = a[8] - b[8];
                out[9] = a[9] - b[9];
                out[10] = a[10] - b[10];
                out[11] = a[11] - b[11];
                out[12] = a[12] - b[12];
                out[13] = a[13] - b[13];
                out[14] = a[14] - b[14];
                out[15] = a[15] - b[15];
                return out;
            };
            mat4.sub = mat4.subtract;
            mat4.multiplyScalar = function (out, a, b) {
                out[0] = a[0] * b;
                out[1] = a[1] * b;
                out[2] = a[2] * b;
                out[3] = a[3] * b;
                out[4] = a[4] * b;
                out[5] = a[5] * b;
                out[6] = a[6] * b;
                out[7] = a[7] * b;
                out[8] = a[8] * b;
                out[9] = a[9] * b;
                out[10] = a[10] * b;
                out[11] = a[11] * b;
                out[12] = a[12] * b;
                out[13] = a[13] * b;
                out[14] = a[14] * b;
                out[15] = a[15] * b;
                return out;
            };
            mat4.multiplyScalarAndAdd = function (out, a, b, scale) {
                out[0] = a[0] + (b[0] * scale);
                out[1] = a[1] + (b[1] * scale);
                out[2] = a[2] + (b[2] * scale);
                out[3] = a[3] + (b[3] * scale);
                out[4] = a[4] + (b[4] * scale);
                out[5] = a[5] + (b[5] * scale);
                out[6] = a[6] + (b[6] * scale);
                out[7] = a[7] + (b[7] * scale);
                out[8] = a[8] + (b[8] * scale);
                out[9] = a[9] + (b[9] * scale);
                out[10] = a[10] + (b[10] * scale);
                out[11] = a[11] + (b[11] * scale);
                out[12] = a[12] + (b[12] * scale);
                out[13] = a[13] + (b[13] * scale);
                out[14] = a[14] + (b[14] * scale);
                out[15] = a[15] + (b[15] * scale);
                return out;
            };
            mat4.exactEquals = function (a, b) {
                return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] &&
                    a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] &&
                    a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] &&
                    a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
            };
            mat4.equals = function (a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11], a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
                var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
                return (Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                    Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
                    Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
                    Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
                    Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
                    Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
                    Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
                    Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
                    Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
                    Math.abs(a9 - b9) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
                    Math.abs(a10 - b10) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
                    Math.abs(a11 - b11) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
                    Math.abs(a12 - b12) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
                    Math.abs(a13 - b13) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
                    Math.abs(a14 - b14) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
                    Math.abs(a15 - b15) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15)));
            };
            module.exports = mat4;
        },
        function (module, exports, __webpack_require__) {
            var glMatrix = __webpack_require__(1);
            var mat3 = __webpack_require__(4);
            var vec3 = __webpack_require__(7);
            var vec4 = __webpack_require__(8);
            var quat = {};
            quat.create = function () {
                var out = new glMatrix.ARRAY_TYPE(4);
                out[0] = 0;
                out[1] = 0;
                out[2] = 0;
                out[3] = 1;
                return out;
            };
            quat.rotationTo = (function () {
                var tmpvec3 = vec3.create();
                var xUnitVec3 = vec3.fromValues(1, 0, 0);
                var yUnitVec3 = vec3.fromValues(0, 1, 0);
                return function (out, a, b) {
                    var dot = vec3.dot(a, b);
                    if (dot < -0.999999) {
                        vec3.cross(tmpvec3, xUnitVec3, a);
                        if (vec3.length(tmpvec3) < 0.000001)
                            vec3.cross(tmpvec3, yUnitVec3, a);
                        vec3.normalize(tmpvec3, tmpvec3);
                        quat.setAxisAngle(out, tmpvec3, Math.PI);
                        return out;
                    }
                    else if (dot > 0.999999) {
                        out[0] = 0;
                        out[1] = 0;
                        out[2] = 0;
                        out[3] = 1;
                        return out;
                    }
                    else {
                        vec3.cross(tmpvec3, a, b);
                        out[0] = tmpvec3[0];
                        out[1] = tmpvec3[1];
                        out[2] = tmpvec3[2];
                        out[3] = 1 + dot;
                        return quat.normalize(out, out);
                    }
                };
            })();
            quat.setAxes = (function () {
                var matr = mat3.create();
                return function (out, view, right, up) {
                    matr[0] = right[0];
                    matr[3] = right[1];
                    matr[6] = right[2];
                    matr[1] = up[0];
                    matr[4] = up[1];
                    matr[7] = up[2];
                    matr[2] = -view[0];
                    matr[5] = -view[1];
                    matr[8] = -view[2];
                    return quat.normalize(out, quat.fromMat3(out, matr));
                };
            })();
            quat.clone = vec4.clone;
            quat.fromValues = vec4.fromValues;
            quat.copy = vec4.copy;
            quat.set = vec4.set;
            quat.identity = function (out) {
                out[0] = 0;
                out[1] = 0;
                out[2] = 0;
                out[3] = 1;
                return out;
            };
            quat.setAxisAngle = function (out, axis, rad) {
                rad = rad * 0.5;
                var s = Math.sin(rad);
                out[0] = s * axis[0];
                out[1] = s * axis[1];
                out[2] = s * axis[2];
                out[3] = Math.cos(rad);
                return out;
            };
            quat.getAxisAngle = function (out_axis, q) {
                var rad = Math.acos(q[3]) * 2.0;
                var s = Math.sin(rad / 2.0);
                if (s != 0.0) {
                    out_axis[0] = q[0] / s;
                    out_axis[1] = q[1] / s;
                    out_axis[2] = q[2] / s;
                }
                else {
                    out_axis[0] = 1;
                    out_axis[1] = 0;
                    out_axis[2] = 0;
                }
                return rad;
            };
            quat.add = vec4.add;
            quat.multiply = function (out, a, b) {
                var ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
                out[0] = ax * bw + aw * bx + ay * bz - az * by;
                out[1] = ay * bw + aw * by + az * bx - ax * bz;
                out[2] = az * bw + aw * bz + ax * by - ay * bx;
                out[3] = aw * bw - ax * bx - ay * by - az * bz;
                return out;
            };
            quat.mul = quat.multiply;
            quat.scale = vec4.scale;
            quat.rotateX = function (out, a, rad) {
                rad *= 0.5;
                var ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = Math.sin(rad), bw = Math.cos(rad);
                out[0] = ax * bw + aw * bx;
                out[1] = ay * bw + az * bx;
                out[2] = az * bw - ay * bx;
                out[3] = aw * bw - ax * bx;
                return out;
            };
            quat.rotateY = function (out, a, rad) {
                rad *= 0.5;
                var ax = a[0], ay = a[1], az = a[2], aw = a[3], by = Math.sin(rad), bw = Math.cos(rad);
                out[0] = ax * bw - az * by;
                out[1] = ay * bw + aw * by;
                out[2] = az * bw + ax * by;
                out[3] = aw * bw - ay * by;
                return out;
            };
            quat.rotateZ = function (out, a, rad) {
                rad *= 0.5;
                var ax = a[0], ay = a[1], az = a[2], aw = a[3], bz = Math.sin(rad), bw = Math.cos(rad);
                out[0] = ax * bw + ay * bz;
                out[1] = ay * bw - ax * bz;
                out[2] = az * bw + aw * bz;
                out[3] = aw * bw - az * bz;
                return out;
            };
            quat.calculateW = function (out, a) {
                var x = a[0], y = a[1], z = a[2];
                out[0] = x;
                out[1] = y;
                out[2] = z;
                out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
                return out;
            };
            quat.dot = vec4.dot;
            quat.lerp = vec4.lerp;
            quat.slerp = function (out, a, b, t) {
                var ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
                var omega, cosom, sinom, scale0, scale1;
                cosom = ax * bx + ay * by + az * bz + aw * bw;
                if (cosom < 0.0) {
                    cosom = -cosom;
                    bx = -bx;
                    by = -by;
                    bz = -bz;
                    bw = -bw;
                }
                if ((1.0 - cosom) > 0.000001) {
                    omega = Math.acos(cosom);
                    sinom = Math.sin(omega);
                    scale0 = Math.sin((1.0 - t) * omega) / sinom;
                    scale1 = Math.sin(t * omega) / sinom;
                }
                else {
                    scale0 = 1.0 - t;
                    scale1 = t;
                }
                out[0] = scale0 * ax + scale1 * bx;
                out[1] = scale0 * ay + scale1 * by;
                out[2] = scale0 * az + scale1 * bz;
                out[3] = scale0 * aw + scale1 * bw;
                return out;
            };
            quat.sqlerp = (function () {
                var temp1 = quat.create();
                var temp2 = quat.create();
                return function (out, a, b, c, d, t) {
                    quat.slerp(temp1, a, d, t);
                    quat.slerp(temp2, b, c, t);
                    quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
                    return out;
                };
            }());
            quat.invert = function (out, a) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3, invDot = dot ? 1.0 / dot : 0;
                out[0] = -a0 * invDot;
                out[1] = -a1 * invDot;
                out[2] = -a2 * invDot;
                out[3] = a3 * invDot;
                return out;
            };
            quat.conjugate = function (out, a) {
                out[0] = -a[0];
                out[1] = -a[1];
                out[2] = -a[2];
                out[3] = a[3];
                return out;
            };
            quat.length = vec4.length;
            quat.len = quat.length;
            quat.squaredLength = vec4.squaredLength;
            quat.sqrLen = quat.squaredLength;
            quat.normalize = vec4.normalize;
            quat.fromMat3 = function (out, m) {
                var fTrace = m[0] + m[4] + m[8];
                var fRoot;
                if (fTrace > 0.0) {
                    fRoot = Math.sqrt(fTrace + 1.0);
                    out[3] = 0.5 * fRoot;
                    fRoot = 0.5 / fRoot;
                    out[0] = (m[5] - m[7]) * fRoot;
                    out[1] = (m[6] - m[2]) * fRoot;
                    out[2] = (m[1] - m[3]) * fRoot;
                }
                else {
                    var i = 0;
                    if (m[4] > m[0])
                        i = 1;
                    if (m[8] > m[i * 3 + i])
                        i = 2;
                    var j = (i + 1) % 3;
                    var k = (i + 2) % 3;
                    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
                    out[i] = 0.5 * fRoot;
                    fRoot = 0.5 / fRoot;
                    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
                    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
                    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
                }
                return out;
            };
            quat.str = function (a) {
                return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
            };
            quat.exactEquals = vec4.exactEquals;
            quat.equals = vec4.equals;
            module.exports = quat;
        },
        function (module, exports, __webpack_require__) {
            var glMatrix = __webpack_require__(1);
            var vec3 = {};
            vec3.create = function () {
                var out = new glMatrix.ARRAY_TYPE(3);
                out[0] = 0;
                out[1] = 0;
                out[2] = 0;
                return out;
            };
            vec3.clone = function (a) {
                var out = new glMatrix.ARRAY_TYPE(3);
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                return out;
            };
            vec3.fromValues = function (x, y, z) {
                var out = new glMatrix.ARRAY_TYPE(3);
                out[0] = x;
                out[1] = y;
                out[2] = z;
                return out;
            };
            vec3.copy = function (out, a) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                return out;
            };
            vec3.set = function (out, x, y, z) {
                out[0] = x;
                out[1] = y;
                out[2] = z;
                return out;
            };
            vec3.add = function (out, a, b) {
                out[0] = a[0] + b[0];
                out[1] = a[1] + b[1];
                out[2] = a[2] + b[2];
                return out;
            };
            vec3.subtract = function (out, a, b) {
                out[0] = a[0] - b[0];
                out[1] = a[1] - b[1];
                out[2] = a[2] - b[2];
                return out;
            };
            vec3.sub = vec3.subtract;
            vec3.multiply = function (out, a, b) {
                out[0] = a[0] * b[0];
                out[1] = a[1] * b[1];
                out[2] = a[2] * b[2];
                return out;
            };
            vec3.mul = vec3.multiply;
            vec3.divide = function (out, a, b) {
                out[0] = a[0] / b[0];
                out[1] = a[1] / b[1];
                out[2] = a[2] / b[2];
                return out;
            };
            vec3.div = vec3.divide;
            vec3.ceil = function (out, a) {
                out[0] = Math.ceil(a[0]);
                out[1] = Math.ceil(a[1]);
                out[2] = Math.ceil(a[2]);
                return out;
            };
            vec3.floor = function (out, a) {
                out[0] = Math.floor(a[0]);
                out[1] = Math.floor(a[1]);
                out[2] = Math.floor(a[2]);
                return out;
            };
            vec3.min = function (out, a, b) {
                out[0] = Math.min(a[0], b[0]);
                out[1] = Math.min(a[1], b[1]);
                out[2] = Math.min(a[2], b[2]);
                return out;
            };
            vec3.max = function (out, a, b) {
                out[0] = Math.max(a[0], b[0]);
                out[1] = Math.max(a[1], b[1]);
                out[2] = Math.max(a[2], b[2]);
                return out;
            };
            vec3.round = function (out, a) {
                out[0] = Math.round(a[0]);
                out[1] = Math.round(a[1]);
                out[2] = Math.round(a[2]);
                return out;
            };
            vec3.scale = function (out, a, b) {
                out[0] = a[0] * b;
                out[1] = a[1] * b;
                out[2] = a[2] * b;
                return out;
            };
            vec3.scaleAndAdd = function (out, a, b, scale) {
                out[0] = a[0] + (b[0] * scale);
                out[1] = a[1] + (b[1] * scale);
                out[2] = a[2] + (b[2] * scale);
                return out;
            };
            vec3.distance = function (a, b) {
                var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
                return Math.sqrt(x * x + y * y + z * z);
            };
            vec3.dist = vec3.distance;
            vec3.squaredDistance = function (a, b) {
                var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
                return x * x + y * y + z * z;
            };
            vec3.sqrDist = vec3.squaredDistance;
            vec3.length = function (a) {
                var x = a[0], y = a[1], z = a[2];
                return Math.sqrt(x * x + y * y + z * z);
            };
            vec3.len = vec3.length;
            vec3.squaredLength = function (a) {
                var x = a[0], y = a[1], z = a[2];
                return x * x + y * y + z * z;
            };
            vec3.sqrLen = vec3.squaredLength;
            vec3.negate = function (out, a) {
                out[0] = -a[0];
                out[1] = -a[1];
                out[2] = -a[2];
                return out;
            };
            vec3.inverse = function (out, a) {
                out[0] = 1.0 / a[0];
                out[1] = 1.0 / a[1];
                out[2] = 1.0 / a[2];
                return out;
            };
            vec3.normalize = function (out, a) {
                var x = a[0], y = a[1], z = a[2];
                var len = x * x + y * y + z * z;
                if (len > 0) {
                    len = 1 / Math.sqrt(len);
                    out[0] = a[0] * len;
                    out[1] = a[1] * len;
                    out[2] = a[2] * len;
                }
                return out;
            };
            vec3.dot = function (a, b) {
                return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
            };
            vec3.cross = function (out, a, b) {
                var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
                out[0] = ay * bz - az * by;
                out[1] = az * bx - ax * bz;
                out[2] = ax * by - ay * bx;
                return out;
            };
            vec3.lerp = function (out, a, b, t) {
                var ax = a[0], ay = a[1], az = a[2];
                out[0] = ax + t * (b[0] - ax);
                out[1] = ay + t * (b[1] - ay);
                out[2] = az + t * (b[2] - az);
                return out;
            };
            vec3.hermite = function (out, a, b, c, d, t) {
                var factorTimes2 = t * t, factor1 = factorTimes2 * (2 * t - 3) + 1, factor2 = factorTimes2 * (t - 2) + t, factor3 = factorTimes2 * (t - 1), factor4 = factorTimes2 * (3 - 2 * t);
                out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
                out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
                out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
                return out;
            };
            vec3.bezier = function (out, a, b, c, d, t) {
                var inverseFactor = 1 - t, inverseFactorTimesTwo = inverseFactor * inverseFactor, factorTimes2 = t * t, factor1 = inverseFactorTimesTwo * inverseFactor, factor2 = 3 * t * inverseFactorTimesTwo, factor3 = 3 * factorTimes2 * inverseFactor, factor4 = factorTimes2 * t;
                out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
                out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
                out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
                return out;
            };
            vec3.random = function (out, scale) {
                scale = scale || 1.0;
                var r = glMatrix.RANDOM() * 2.0 * Math.PI;
                var z = (glMatrix.RANDOM() * 2.0) - 1.0;
                var zScale = Math.sqrt(1.0 - z * z) * scale;
                out[0] = Math.cos(r) * zScale;
                out[1] = Math.sin(r) * zScale;
                out[2] = z * scale;
                return out;
            };
            vec3.transformMat4 = function (out, a, m) {
                var x = a[0], y = a[1], z = a[2], w = m[3] * x + m[7] * y + m[11] * z + m[15];
                w = w || 1.0;
                out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
                out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
                out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
                return out;
            };
            vec3.transformMat3 = function (out, a, m) {
                var x = a[0], y = a[1], z = a[2];
                out[0] = x * m[0] + y * m[3] + z * m[6];
                out[1] = x * m[1] + y * m[4] + z * m[7];
                out[2] = x * m[2] + y * m[5] + z * m[8];
                return out;
            };
            vec3.transformQuat = function (out, a, q) {
                var x = a[0], y = a[1], z = a[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3], ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
                out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
                out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
                out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
                return out;
            };
            vec3.rotateX = function (out, a, b, c) {
                var p = [], r = [];
                p[0] = a[0] - b[0];
                p[1] = a[1] - b[1];
                p[2] = a[2] - b[2];
                r[0] = p[0];
                r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
                r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);
                out[0] = r[0] + b[0];
                out[1] = r[1] + b[1];
                out[2] = r[2] + b[2];
                return out;
            };
            vec3.rotateY = function (out, a, b, c) {
                var p = [], r = [];
                p[0] = a[0] - b[0];
                p[1] = a[1] - b[1];
                p[2] = a[2] - b[2];
                r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
                r[1] = p[1];
                r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);
                out[0] = r[0] + b[0];
                out[1] = r[1] + b[1];
                out[2] = r[2] + b[2];
                return out;
            };
            vec3.rotateZ = function (out, a, b, c) {
                var p = [], r = [];
                p[0] = a[0] - b[0];
                p[1] = a[1] - b[1];
                p[2] = a[2] - b[2];
                r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
                r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
                r[2] = p[2];
                out[0] = r[0] + b[0];
                out[1] = r[1] + b[1];
                out[2] = r[2] + b[2];
                return out;
            };
            vec3.forEach = (function () {
                var vec = vec3.create();
                return function (a, stride, offset, count, fn, arg) {
                    var i, l;
                    if (!stride) {
                        stride = 3;
                    }
                    if (!offset) {
                        offset = 0;
                    }
                    if (count) {
                        l = Math.min((count * stride) + offset, a.length);
                    }
                    else {
                        l = a.length;
                    }
                    for (i = offset; i < l; i += stride) {
                        vec[0] = a[i];
                        vec[1] = a[i + 1];
                        vec[2] = a[i + 2];
                        fn(vec, vec, arg);
                        a[i] = vec[0];
                        a[i + 1] = vec[1];
                        a[i + 2] = vec[2];
                    }
                    return a;
                };
            })();
            vec3.angle = function (a, b) {
                var tempA = vec3.fromValues(a[0], a[1], a[2]);
                var tempB = vec3.fromValues(b[0], b[1], b[2]);
                vec3.normalize(tempA, tempA);
                vec3.normalize(tempB, tempB);
                var cosine = vec3.dot(tempA, tempB);
                if (cosine > 1.0) {
                    return 0;
                }
                else {
                    return Math.acos(cosine);
                }
            };
            vec3.str = function (a) {
                return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
            };
            vec3.exactEquals = function (a, b) {
                return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
            };
            vec3.equals = function (a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2];
                var b0 = b[0], b1 = b[1], b2 = b[2];
                return (Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                    Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
                    Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
            };
            module.exports = vec3;
        },
        function (module, exports, __webpack_require__) {
            var glMatrix = __webpack_require__(1);
            var vec4 = {};
            vec4.create = function () {
                var out = new glMatrix.ARRAY_TYPE(4);
                out[0] = 0;
                out[1] = 0;
                out[2] = 0;
                out[3] = 0;
                return out;
            };
            vec4.clone = function (a) {
                var out = new glMatrix.ARRAY_TYPE(4);
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                return out;
            };
            vec4.fromValues = function (x, y, z, w) {
                var out = new glMatrix.ARRAY_TYPE(4);
                out[0] = x;
                out[1] = y;
                out[2] = z;
                out[3] = w;
                return out;
            };
            vec4.copy = function (out, a) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                return out;
            };
            vec4.set = function (out, x, y, z, w) {
                out[0] = x;
                out[1] = y;
                out[2] = z;
                out[3] = w;
                return out;
            };
            vec4.add = function (out, a, b) {
                out[0] = a[0] + b[0];
                out[1] = a[1] + b[1];
                out[2] = a[2] + b[2];
                out[3] = a[3] + b[3];
                return out;
            };
            vec4.subtract = function (out, a, b) {
                out[0] = a[0] - b[0];
                out[1] = a[1] - b[1];
                out[2] = a[2] - b[2];
                out[3] = a[3] - b[3];
                return out;
            };
            vec4.sub = vec4.subtract;
            vec4.multiply = function (out, a, b) {
                out[0] = a[0] * b[0];
                out[1] = a[1] * b[1];
                out[2] = a[2] * b[2];
                out[3] = a[3] * b[3];
                return out;
            };
            vec4.mul = vec4.multiply;
            vec4.divide = function (out, a, b) {
                out[0] = a[0] / b[0];
                out[1] = a[1] / b[1];
                out[2] = a[2] / b[2];
                out[3] = a[3] / b[3];
                return out;
            };
            vec4.div = vec4.divide;
            vec4.ceil = function (out, a) {
                out[0] = Math.ceil(a[0]);
                out[1] = Math.ceil(a[1]);
                out[2] = Math.ceil(a[2]);
                out[3] = Math.ceil(a[3]);
                return out;
            };
            vec4.floor = function (out, a) {
                out[0] = Math.floor(a[0]);
                out[1] = Math.floor(a[1]);
                out[2] = Math.floor(a[2]);
                out[3] = Math.floor(a[3]);
                return out;
            };
            vec4.min = function (out, a, b) {
                out[0] = Math.min(a[0], b[0]);
                out[1] = Math.min(a[1], b[1]);
                out[2] = Math.min(a[2], b[2]);
                out[3] = Math.min(a[3], b[3]);
                return out;
            };
            vec4.max = function (out, a, b) {
                out[0] = Math.max(a[0], b[0]);
                out[1] = Math.max(a[1], b[1]);
                out[2] = Math.max(a[2], b[2]);
                out[3] = Math.max(a[3], b[3]);
                return out;
            };
            vec4.round = function (out, a) {
                out[0] = Math.round(a[0]);
                out[1] = Math.round(a[1]);
                out[2] = Math.round(a[2]);
                out[3] = Math.round(a[3]);
                return out;
            };
            vec4.scale = function (out, a, b) {
                out[0] = a[0] * b;
                out[1] = a[1] * b;
                out[2] = a[2] * b;
                out[3] = a[3] * b;
                return out;
            };
            vec4.scaleAndAdd = function (out, a, b, scale) {
                out[0] = a[0] + (b[0] * scale);
                out[1] = a[1] + (b[1] * scale);
                out[2] = a[2] + (b[2] * scale);
                out[3] = a[3] + (b[3] * scale);
                return out;
            };
            vec4.distance = function (a, b) {
                var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2], w = b[3] - a[3];
                return Math.sqrt(x * x + y * y + z * z + w * w);
            };
            vec4.dist = vec4.distance;
            vec4.squaredDistance = function (a, b) {
                var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2], w = b[3] - a[3];
                return x * x + y * y + z * z + w * w;
            };
            vec4.sqrDist = vec4.squaredDistance;
            vec4.length = function (a) {
                var x = a[0], y = a[1], z = a[2], w = a[3];
                return Math.sqrt(x * x + y * y + z * z + w * w);
            };
            vec4.len = vec4.length;
            vec4.squaredLength = function (a) {
                var x = a[0], y = a[1], z = a[2], w = a[3];
                return x * x + y * y + z * z + w * w;
            };
            vec4.sqrLen = vec4.squaredLength;
            vec4.negate = function (out, a) {
                out[0] = -a[0];
                out[1] = -a[1];
                out[2] = -a[2];
                out[3] = -a[3];
                return out;
            };
            vec4.inverse = function (out, a) {
                out[0] = 1.0 / a[0];
                out[1] = 1.0 / a[1];
                out[2] = 1.0 / a[2];
                out[3] = 1.0 / a[3];
                return out;
            };
            vec4.normalize = function (out, a) {
                var x = a[0], y = a[1], z = a[2], w = a[3];
                var len = x * x + y * y + z * z + w * w;
                if (len > 0) {
                    len = 1 / Math.sqrt(len);
                    out[0] = x * len;
                    out[1] = y * len;
                    out[2] = z * len;
                    out[3] = w * len;
                }
                return out;
            };
            vec4.dot = function (a, b) {
                return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
            };
            vec4.lerp = function (out, a, b, t) {
                var ax = a[0], ay = a[1], az = a[2], aw = a[3];
                out[0] = ax + t * (b[0] - ax);
                out[1] = ay + t * (b[1] - ay);
                out[2] = az + t * (b[2] - az);
                out[3] = aw + t * (b[3] - aw);
                return out;
            };
            vec4.random = function (out, scale) {
                scale = scale || 1.0;
                out[0] = glMatrix.RANDOM();
                out[1] = glMatrix.RANDOM();
                out[2] = glMatrix.RANDOM();
                out[3] = glMatrix.RANDOM();
                vec4.normalize(out, out);
                vec4.scale(out, out, scale);
                return out;
            };
            vec4.transformMat4 = function (out, a, m) {
                var x = a[0], y = a[1], z = a[2], w = a[3];
                out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
                out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
                out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
                out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
                return out;
            };
            vec4.transformQuat = function (out, a, q) {
                var x = a[0], y = a[1], z = a[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3], ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
                out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
                out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
                out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
                out[3] = a[3];
                return out;
            };
            vec4.forEach = (function () {
                var vec = vec4.create();
                return function (a, stride, offset, count, fn, arg) {
                    var i, l;
                    if (!stride) {
                        stride = 4;
                    }
                    if (!offset) {
                        offset = 0;
                    }
                    if (count) {
                        l = Math.min((count * stride) + offset, a.length);
                    }
                    else {
                        l = a.length;
                    }
                    for (i = offset; i < l; i += stride) {
                        vec[0] = a[i];
                        vec[1] = a[i + 1];
                        vec[2] = a[i + 2];
                        vec[3] = a[i + 3];
                        fn(vec, vec, arg);
                        a[i] = vec[0];
                        a[i + 1] = vec[1];
                        a[i + 2] = vec[2];
                        a[i + 3] = vec[3];
                    }
                    return a;
                };
            })();
            vec4.str = function (a) {
                return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
            };
            vec4.exactEquals = function (a, b) {
                return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
            };
            vec4.equals = function (a, b) {
                var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
                var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
                return (Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                    Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
                    Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
                    Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
            };
            module.exports = vec4;
        },
        function (module, exports, __webpack_require__) {
            var glMatrix = __webpack_require__(1);
            var vec2 = {};
            vec2.create = function () {
                var out = new glMatrix.ARRAY_TYPE(2);
                out[0] = 0;
                out[1] = 0;
                return out;
            };
            vec2.clone = function (a) {
                var out = new glMatrix.ARRAY_TYPE(2);
                out[0] = a[0];
                out[1] = a[1];
                return out;
            };
            vec2.fromValues = function (x, y) {
                var out = new glMatrix.ARRAY_TYPE(2);
                out[0] = x;
                out[1] = y;
                return out;
            };
            vec2.copy = function (out, a) {
                out[0] = a[0];
                out[1] = a[1];
                return out;
            };
            vec2.set = function (out, x, y) {
                out[0] = x;
                out[1] = y;
                return out;
            };
            vec2.add = function (out, a, b) {
                out[0] = a[0] + b[0];
                out[1] = a[1] + b[1];
                return out;
            };
            vec2.subtract = function (out, a, b) {
                out[0] = a[0] - b[0];
                out[1] = a[1] - b[1];
                return out;
            };
            vec2.sub = vec2.subtract;
            vec2.multiply = function (out, a, b) {
                out[0] = a[0] * b[0];
                out[1] = a[1] * b[1];
                return out;
            };
            vec2.mul = vec2.multiply;
            vec2.divide = function (out, a, b) {
                out[0] = a[0] / b[0];
                out[1] = a[1] / b[1];
                return out;
            };
            vec2.div = vec2.divide;
            vec2.ceil = function (out, a) {
                out[0] = Math.ceil(a[0]);
                out[1] = Math.ceil(a[1]);
                return out;
            };
            vec2.floor = function (out, a) {
                out[0] = Math.floor(a[0]);
                out[1] = Math.floor(a[1]);
                return out;
            };
            vec2.min = function (out, a, b) {
                out[0] = Math.min(a[0], b[0]);
                out[1] = Math.min(a[1], b[1]);
                return out;
            };
            vec2.max = function (out, a, b) {
                out[0] = Math.max(a[0], b[0]);
                out[1] = Math.max(a[1], b[1]);
                return out;
            };
            vec2.round = function (out, a) {
                out[0] = Math.round(a[0]);
                out[1] = Math.round(a[1]);
                return out;
            };
            vec2.scale = function (out, a, b) {
                out[0] = a[0] * b;
                out[1] = a[1] * b;
                return out;
            };
            vec2.scaleAndAdd = function (out, a, b, scale) {
                out[0] = a[0] + (b[0] * scale);
                out[1] = a[1] + (b[1] * scale);
                return out;
            };
            vec2.distance = function (a, b) {
                var x = b[0] - a[0], y = b[1] - a[1];
                return Math.sqrt(x * x + y * y);
            };
            vec2.dist = vec2.distance;
            vec2.squaredDistance = function (a, b) {
                var x = b[0] - a[0], y = b[1] - a[1];
                return x * x + y * y;
            };
            vec2.sqrDist = vec2.squaredDistance;
            vec2.length = function (a) {
                var x = a[0], y = a[1];
                return Math.sqrt(x * x + y * y);
            };
            vec2.len = vec2.length;
            vec2.squaredLength = function (a) {
                var x = a[0], y = a[1];
                return x * x + y * y;
            };
            vec2.sqrLen = vec2.squaredLength;
            vec2.negate = function (out, a) {
                out[0] = -a[0];
                out[1] = -a[1];
                return out;
            };
            vec2.inverse = function (out, a) {
                out[0] = 1.0 / a[0];
                out[1] = 1.0 / a[1];
                return out;
            };
            vec2.normalize = function (out, a) {
                var x = a[0], y = a[1];
                var len = x * x + y * y;
                if (len > 0) {
                    len = 1 / Math.sqrt(len);
                    out[0] = a[0] * len;
                    out[1] = a[1] * len;
                }
                return out;
            };
            vec2.dot = function (a, b) {
                return a[0] * b[0] + a[1] * b[1];
            };
            vec2.cross = function (out, a, b) {
                var z = a[0] * b[1] - a[1] * b[0];
                out[0] = out[1] = 0;
                out[2] = z;
                return out;
            };
            vec2.lerp = function (out, a, b, t) {
                var ax = a[0], ay = a[1];
                out[0] = ax + t * (b[0] - ax);
                out[1] = ay + t * (b[1] - ay);
                return out;
            };
            vec2.random = function (out, scale) {
                scale = scale || 1.0;
                var r = glMatrix.RANDOM() * 2.0 * Math.PI;
                out[0] = Math.cos(r) * scale;
                out[1] = Math.sin(r) * scale;
                return out;
            };
            vec2.transformMat2 = function (out, a, m) {
                var x = a[0], y = a[1];
                out[0] = m[0] * x + m[2] * y;
                out[1] = m[1] * x + m[3] * y;
                return out;
            };
            vec2.transformMat2d = function (out, a, m) {
                var x = a[0], y = a[1];
                out[0] = m[0] * x + m[2] * y + m[4];
                out[1] = m[1] * x + m[3] * y + m[5];
                return out;
            };
            vec2.transformMat3 = function (out, a, m) {
                var x = a[0], y = a[1];
                out[0] = m[0] * x + m[3] * y + m[6];
                out[1] = m[1] * x + m[4] * y + m[7];
                return out;
            };
            vec2.transformMat4 = function (out, a, m) {
                var x = a[0], y = a[1];
                out[0] = m[0] * x + m[4] * y + m[12];
                out[1] = m[1] * x + m[5] * y + m[13];
                return out;
            };
            vec2.forEach = (function () {
                var vec = vec2.create();
                return function (a, stride, offset, count, fn, arg) {
                    var i, l;
                    if (!stride) {
                        stride = 2;
                    }
                    if (!offset) {
                        offset = 0;
                    }
                    if (count) {
                        l = Math.min((count * stride) + offset, a.length);
                    }
                    else {
                        l = a.length;
                    }
                    for (i = offset; i < l; i += stride) {
                        vec[0] = a[i];
                        vec[1] = a[i + 1];
                        fn(vec, vec, arg);
                        a[i] = vec[0];
                        a[i + 1] = vec[1];
                    }
                    return a;
                };
            })();
            vec2.str = function (a) {
                return 'vec2(' + a[0] + ', ' + a[1] + ')';
            };
            vec2.exactEquals = function (a, b) {
                return a[0] === b[0] && a[1] === b[1];
            };
            vec2.equals = function (a, b) {
                var a0 = a[0], a1 = a[1];
                var b0 = b[0], b1 = b[1];
                return (Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                    Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)));
            };
            module.exports = vec2;
        }
    ]);
});
;
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.gl = null;
    CanvasToy.debug = true;
    (function (DataType) {
        DataType[DataType["float"] = 0] = "float";
        DataType[DataType["int"] = 1] = "int";
        DataType[DataType["vec2"] = 2] = "vec2";
        DataType[DataType["vec3"] = 3] = "vec3";
        DataType[DataType["vec4"] = 4] = "vec4";
        DataType[DataType["mat2"] = 5] = "mat2";
        DataType[DataType["mat3"] = 6] = "mat3";
        DataType[DataType["mat4"] = 7] = "mat4";
    })(CanvasToy.DataType || (CanvasToy.DataType = {}));
    var DataType = CanvasToy.DataType;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Object3d = (function () {
        function Object3d(tag) {
            this.children = [];
            this.objectToWorldMatrix = mat4.create();
            this._parent = null;
            this._localMatrix = mat4.create();
            this._matrix = mat4.create();
            this._localPosition = vec3.create();
            this._localRotation = quat.create();
            this._localScaling = vec3.fromValues(1, 1, 1);
            this._position = vec3.create();
            this._scaling = vec3.fromValues(1, 1, 1);
            this._rotation = quat.create();
            this.updateEvents = [];
            this.startEvents = [];
            this.tag = tag;
        }
        Object.defineProperty(Object3d.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (_parent) {
                _parent.children.push(this);
                this._parent = _parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "localMatrix", {
            get: function () {
                return this._localMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "matrix", {
            get: function () {
                return this._matrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "localPosition", {
            get: function () {
                return this._localPosition;
            },
            set: function (_localPosition) {
                console.assert(_localPosition && _localPosition.length === 3, "invalid object position paramter");
                this._localPosition = _localPosition;
                this.composeFromLocalMatrix();
                if (!!this._parent) {
                    mat4.getTranslation(this._position, this.matrix);
                }
                else {
                    this._position = vec3.clone(_localPosition);
                }
                this.applyToChildren();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (_position) {
                console.assert(_position && _position.length === 3, "invalid object position paramter");
                this._position = _position;
                this.composeFromGlobalMatrix();
                if (!!this._parent) {
                    mat4.getTranslation(this._localPosition, this._localMatrix);
                }
                else {
                    this._localPosition = vec3.clone(_position);
                }
                this.applyToChildren();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "localRotation", {
            get: function () {
                return this._localRotation;
            },
            set: function (_localRotation) {
                console.assert(_localRotation && _localRotation.length === 4, "invalid object rotation paramter");
                quat.normalize(_localRotation, quat.clone(_localRotation));
                this._localRotation = _localRotation;
                this.composeFromLocalMatrix();
                if (!!this._parent) {
                    mat4.getRotation(this._rotation, this.matrix);
                }
                else {
                    this._rotation = quat.clone(_localRotation);
                }
                this.applyToChildren();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (_rotation) {
                console.assert(_rotation && _rotation.length === 4, "invalid object rotation paramter");
                quat.normalize(_rotation, quat.clone(_rotation));
                this._rotation = _rotation;
                this.composeFromGlobalMatrix();
                if (!!this._parent) {
                    mat4.getRotation(this._localRotation, this.localMatrix);
                }
                else {
                    this._localRotation = quat.clone(_rotation);
                }
                this.applyToChildren();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "localScaling", {
            get: function () {
                return this._localScaling;
            },
            set: function (_localScaling) {
                console.assert(_localScaling && _localScaling.length === 3, "invalid object scale paramter");
                this._localScaling = _localScaling;
                if (!!this._parent) {
                    vec3.mul(this._scaling, this._parent.scaling, this._localScaling);
                }
                else {
                    this._scaling = vec3.clone(_localScaling);
                }
                this.applyToChildren();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "scaling", {
            get: function () {
                return this._scaling;
            },
            set: function (_scaling) {
                console.assert(_scaling && _scaling.length === 3, "invalid object scale paramter");
                this._scaling = _scaling;
                if (!!this._parent) {
                    vec3.div(this.localScaling, this.scaling, this._parent.scaling);
                }
                else {
                    this.localScaling = vec3.clone(_scaling);
                }
                this.applyToChildren();
            },
            enumerable: true,
            configurable: true
        });
        Object3d.prototype.setTransformFromParent = function () {
            if (!!this.parent) {
                this._matrix = mat4.mul(mat4.create(), this.parent.matrix, this.localMatrix);
                this.genOtherMatrixs();
                mat4.getTranslation(this._position, this.matrix);
                mat4.getRotation(this._rotation, this.matrix);
                vec3.mul(this.scaling, this.parent.scaling, this.localScaling);
            }
        };
        Object3d.prototype.registUpdate = function (updateFunction) {
            this.updateEvents.push(updateFunction);
        };
        Object3d.prototype.registStart = function (updateFunction) {
            this.startEvents.push(updateFunction);
        };
        Object3d.prototype.start = function () {
            for (var _i = 0, _a = this.startEvents; _i < _a.length; _i++) {
                var event_1 = _a[_i];
                event_1();
            }
        };
        Object3d.prototype.update = function (dt) {
            for (var _i = 0, _a = this.updateEvents; _i < _a.length; _i++) {
                var event_2 = _a[_i];
                event_2(dt);
            }
            for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
                var child = _c[_b];
                child.update(dt);
            }
        };
        Object3d.prototype.translate = function (delta) {
            console.assert(delta instanceof Array && delta.length === 3, "invalid delta translate");
            this.localPosition = vec3.add(this.localPosition, vec3.clone(this.localPosition), delta);
        };
        Object3d.prototype.rotateX = function (angle) {
            this.localRotation = quat.rotateX(this.localRotation, quat.clone(this.localRotation), angle);
        };
        Object3d.prototype.rotateY = function (angle) {
            this.localRotation = quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle);
        };
        Object3d.prototype.rotateZ = function (angle) {
            this.localRotation = quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle);
        };
        Object3d.prototype.genOtherMatrixs = function () {
            mat4.invert(this.objectToWorldMatrix, this.matrix);
        };
        Object3d.prototype.composeFromLocalMatrix = function () {
            mat4.fromRotationTranslationScale(this.localMatrix, this.localRotation, this.localPosition, this.localScaling);
            if (!!this._parent) {
                mat4.mul(this._matrix, this._parent.matrix, this.localMatrix);
            }
            else {
                this._matrix = mat4.clone(this._localMatrix);
            }
            this.genOtherMatrixs();
        };
        Object3d.prototype.composeFromGlobalMatrix = function () {
            mat4.fromRotationTranslationScale(this._matrix, this.rotation, this.position, this.scaling);
            this.genOtherMatrixs();
            if (!!this._parent) {
                mat4.mul(this._localMatrix, this._parent.objectToWorldMatrix, this.matrix);
            }
            else {
                this._localMatrix = mat4.clone(this._matrix);
            }
        };
        Object3d.prototype.applyToChildren = function () {
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.setTransformFromParent();
            }
        };
        return Object3d;
    }());
    CanvasToy.Object3d = Object3d;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            _super.call(this);
            this.projectionMatrix = mat4.create();
        }
        return Camera;
    }(CanvasToy.Object3d));
    CanvasToy.Camera = Camera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var OrthoCamera = (function (_super) {
        __extends(OrthoCamera, _super);
        function OrthoCamera(left, right, bottom, top, near, far) {
            if (left === void 0) { left = -1; }
            if (right === void 0) { right = 1; }
            if (bottom === void 0) { bottom = -1; }
            if (top === void 0) { top = 1; }
            if (near === void 0) { near = 0.001; }
            if (far === void 0) { far = 10000; }
            _super.call(this);
            this.left = left;
            this.right = right;
            this.bottom = bottom;
            this.top = top;
            this.near = near;
            this.far = far;
            mat4.ortho(this.projectionMatrix, left, right, bottom, top, near, far);
        }
        OrthoCamera.prototype.genOtherMatrixs = function () {
            _super.prototype.genOtherMatrixs.call(this);
            mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far);
        };
        OrthoCamera.prototype.adaptTargetRadio = function (target) {
            this.left = -target.width / 2;
            this.right = target.width / 2;
            this.top = target.height / 2;
            this.bottom = -target.height / 2;
        };
        return OrthoCamera;
    }(CanvasToy.Camera));
    CanvasToy.OrthoCamera = OrthoCamera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(aspect, fovy, near, far) {
            if (aspect === void 0) { aspect = 1; }
            if (fovy === void 0) { fovy = 45; }
            if (near === void 0) { near = 0.01; }
            if (far === void 0) { far = 10000; }
            _super.call(this);
            this.aspect = aspect;
            this.fovy = fovy;
            this.near = near;
            this.far = far;
        }
        PerspectiveCamera.prototype.genOtherMatrixs = function () {
            _super.prototype.genOtherMatrixs.call(this);
            this.projectionMatrix = mat4.perspective(mat4.create(), this.fovy, this.aspect, this.near, this.far);
        };
        PerspectiveCamera.prototype.adaptTargetRadio = function (target) {
            this.aspect = target.width / target.height;
            this.genOtherMatrixs();
        };
        return PerspectiveCamera;
    }(CanvasToy.Camera));
    CanvasToy.PerspectiveCamera = PerspectiveCamera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Geometry = (function () {
        function Geometry() {
            this.attributes = {
                position: new CanvasToy.Attribute({ type: CanvasToy.DataType.float, size: 3, data: [] }),
                uv: new CanvasToy.Attribute({ type: CanvasToy.DataType.float, size: 2, data: [] }),
                normal: new CanvasToy.Attribute({ type: CanvasToy.DataType.float, size: 3, data: [] }),
                flatNormal: new CanvasToy.Attribute({ type: CanvasToy.DataType.float, size: 3, data: [] }),
            };
            this.faces = { data: [], buffer: CanvasToy.gl.createBuffer() };
        }
        Geometry.prototype.setAttribute = function (name, attribute) {
            this.attributes[name] = attribute;
        };
        Geometry.prototype.addVertex = function (vertex) {
            for (var attributeName in this.attributes) {
                if (this.attributes[attributeName] !== undefined) {
                    if (vertex[attributeName] === undefined) {
                        return;
                    }
                    if (vertex[attributeName].length !== this.attributes[attributeName].size) {
                        console.error("length " + attributeName + "wrong");
                        return;
                    }
                    this.attributes[attributeName].data
                        = this.attributes[attributeName].data.concat(vertex[attributeName]);
                }
            }
        };
        Geometry.prototype.removeAttribute = function (name) {
            this.attributes[name] = undefined;
        };
        Geometry.prototype.getVertexByIndex = function (index) {
            var vertex = {};
            for (var attributeName in this.attributes) {
                vertex[attributeName] = [];
                for (var i = 0; i < this.attributes[attributeName].stride; ++i) {
                    vertex[attributeName].push(this.attributes[attributeName].data[this.attributes[attributeName].stride * index + i]);
                }
            }
            return vertex;
        };
        Geometry.prototype.getTriangleByIndex = function (triangleIndex) {
            return [
                this.getVertexByIndex(triangleIndex * 3),
                this.getVertexByIndex(triangleIndex * 3 + 1),
                this.getVertexByIndex(triangleIndex * 3 + 2),
            ];
        };
        Geometry.prototype.generateFlatNormal = function () {
            for (var i = 0; i < this.faces.data.length; i += 3) {
                var triangle = this.getTriangleByIndex(i / 3);
                var flatX = (triangle[0].normals[0] + triangle[0].normals[1] + triangle[0].normals[2]) / 3;
                var flatY = (triangle[1].normals[0] + triangle[1].normals[1] + triangle[1].normals[2]) / 3;
                var flatZ = (triangle[2].normals[0] + triangle[0].normals[1] + triangle[2].normals[2]) / 3;
                var flat = [
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ,
                ];
                this.attributes.flatNormal.data = this.attributes.flatNormal.data.concat(flat);
            }
        };
        return Geometry;
    }());
    CanvasToy.Geometry = Geometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, materials) {
            _super.call(this);
            this.drawMode = CanvasToy.gl.STATIC_DRAW;
            this.materials = [];
            this.maps = [];
            this.normalMatrix = mat4.create();
            this.materials = materials;
            this.geometry = geometry;
        }
        Mesh.prototype.genOtherMatrixs = function () {
            _super.prototype.genOtherMatrixs.call(this);
            mat4.transpose(this.normalMatrix, mat4.invert(mat4.create(), this.matrix));
        };
        return Mesh;
    }(CanvasToy.Object3d));
    CanvasToy.Mesh = Mesh;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Faces = (function () {
        function Faces(data) {
            this.buffer = CanvasToy.gl.createBuffer();
            this.data = [];
            this.data = data;
        }
        return Faces;
    }());
    CanvasToy.Faces = Faces;
    var Attribute = (function () {
        function Attribute(paramter) {
            this.size = 3;
            this.data = [];
            this.index = 0;
            this.stride = 0;
            this.buffer = CanvasToy.gl.createBuffer();
            for (var attributeInfo in paramter) {
                this[attributeInfo] = paramter[attributeInfo] ? paramter[attributeInfo] : this[attributeInfo];
            }
            switch (paramter.type) {
                case CanvasToy.DataType.float:
                    this.type = CanvasToy.gl.FLOAT;
                    break;
                case CanvasToy.DataType.int:
                    this.type = CanvasToy.gl.INT;
                    break;
                default: break;
            }
        }
        return Attribute;
    }());
    CanvasToy.Attribute = Attribute;
    var Program = (function () {
        function Program(passing) {
            this.enableDepthTest = true;
            this.enableStencilTest = true;
            this.uniforms = {};
            this.attributes = {};
            this.attributeLocations = {};
            this.drawMode = CanvasToy.gl.STATIC_DRAW;
            this.textures = [];
            this.vertexPrecision = "highp";
            this.fragmentPrecision = "mediump";
            this.prefix = [];
            this.passings = [];
            this.passings.push(passing);
        }
        Program.prototype.make = function (material, mesh, scene, camera) {
            this.prefix = [
                material.mainTexture ? "#define USE_TEXTURE " : "",
                material.color ? "#define USE_COLOR " : "",
                scene.openLight ? "#define OPEN_LIGHT \n#define LIGHT_NUM "
                    + scene.lights.length : "",
            ];
            if (!!this.passings) {
                var passes = this.passings.map(function (passing) { return passing(mesh, scene, camera, material); });
                var finalPass_1 = {};
                passes.forEach(function (pass) {
                    CanvasToy.mixin(finalPass_1, pass);
                });
                this.rePass(finalPass_1);
            }
        };
        Program.prototype.addPassing = function (passing) {
            this.passings.push(passing);
        };
        Program.prototype.checkState = function () {
            var maxIndex = 0;
            for (var _i = 0, _a = this.faces.data; _i < _a.length; _i++) {
                var index = _a[_i];
                maxIndex = Math.max(maxIndex, index);
            }
            for (var attributeName in this.attributes) {
                console.assert(this.attributes[attributeName].size <= 4 && this.attributes[attributeName].size >= 1, attributeName + "size error, now: " + this.attributes[attributeName].size + " should be 1-4");
                console.assert((maxIndex + 1) * this.attributes[attributeName].stride <=
                    this.attributes[attributeName].data.length, attributeName + " length error, now:" + this.attributes[attributeName].data.length
                    + ", should bigger than:" + (maxIndex + 1) * this.attributes[attributeName].stride);
            }
        };
        Program.prototype.setAttribute0 = function (name) {
            this.attribute0 = name;
            CanvasToy.gl.bindAttribLocation(this.webGlProgram, 0, name);
        };
        Program.prototype.addUniform = function (nameInShader, uniform) {
            CanvasToy.gl.useProgram(this.webGlProgram);
            var location = this.getUniformLocation(nameInShader);
            switch (uniform.type) {
                case CanvasToy.DataType.float:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        CanvasToy.gl.uniform1f(location, uniform.updator(mesh, camera));
                    };
                    break;
                case CanvasToy.DataType.int:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        CanvasToy.gl.uniform1i(location, uniform.updator(mesh, camera));
                    };
                    break;
                case CanvasToy.DataType.vec2:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        var value = uniform.updator(mesh, camera);
                        CanvasToy.gl.uniform2f(location, value[0], value[1]);
                    };
                    break;
                case CanvasToy.DataType.vec3:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        var value = uniform.updator(mesh, camera);
                        CanvasToy.gl.uniform3f(location, value[0], value[1], value[2]);
                    };
                    break;
                case CanvasToy.DataType.vec4:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        var value = uniform.updator(mesh, camera);
                        CanvasToy.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    };
                    break;
                case CanvasToy.DataType.mat2:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        CanvasToy.gl.uniformMatrix2fv(location, false, uniform.updator(mesh, camera));
                    };
                case CanvasToy.DataType.mat3:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        CanvasToy.gl.uniformMatrix3fv(location, false, uniform.updator(mesh, camera));
                    };
                case CanvasToy.DataType.mat4:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        CanvasToy.gl.uniformMatrix4fv(location, false, uniform.updator(mesh, camera));
                    };
                    break;
                default: break;
            }
        };
        Program.prototype.addAttribute = function (nameInShader, attribute) {
            var location = this.getAttribLocation(nameInShader);
            if (location !== null && location !== -1) {
                this.attributes[nameInShader] = attribute;
                this.attributeLocations[nameInShader] = location;
                CanvasToy.gl.enableVertexAttribArray(location);
            }
        };
        Program.prototype.getUniformLocation = function (name) {
            if (CanvasToy.gl === undefined || CanvasToy.gl === null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = CanvasToy.gl.getUniformLocation(this.webGlProgram, name);
            if (result === null) {
                console.warn("uniform " + name + " not found!");
                return null;
            }
            return result;
        };
        Program.prototype.rePass = function (parameter) {
            if (!!(parameter.vertexShader) || !!(parameter.fragmentShader) || !!(parameter.prefix)) {
                this.vertexShader = parameter.vertexShader || this.vertexShader;
                this.fragmentShader = parameter.fragmentShader || this.fragmentShader;
                this.webGlProgram = CanvasToy.createEntileShader(CanvasToy.gl, "precision " + this.vertexPrecision + " float;\n" + this.prefix.join("\n") + "\n"
                    + this.vertexShader, "precision " + this.fragmentPrecision + " float;\n" + this.prefix.join("\n") + "\n"
                    + this.fragmentShader);
            }
            this.faces = (parameter.faces === undefined ? this.faces : parameter.faces);
            for (var nameInShader in parameter.uniforms) {
                if (parameter.uniforms[nameInShader] !== undefined) {
                    this.addUniform(nameInShader, parameter.uniforms[nameInShader]);
                }
            }
            for (var sampler in parameter.textures) {
                this.textures[sampler] = parameter.textures[sampler];
            }
            for (var nameInShader in parameter.attributes) {
                this.addAttribute(nameInShader, parameter.attributes[nameInShader]);
            }
            this.checkState();
        };
        Program.prototype.getAttribLocation = function (name) {
            if (CanvasToy.gl === undefined || CanvasToy.gl === null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = CanvasToy.gl.getAttribLocation(this.webGlProgram, name);
            if (result === null) {
                console.error("attribute " + name + " not found!");
                return null;
            }
            return result;
        };
        return Program;
    }());
    CanvasToy.Program = Program;
    CanvasToy.defaultProgramPass = function (mesh, scene, camera, material) {
        return {
            vertexShader: material.shaderSource.vertexShader,
            fragmentShader: material.shaderSource.fragmentShader,
            faces: mesh.geometry.faces,
            textures: {
                uMainTexture: material.mainTexture,
            },
            uniforms: {
                modelViewProjectionMatrix: {
                    type: CanvasToy.DataType.mat4,
                    updator: function (meshOnUpdate, cameraOnUpdate) {
                        return new Float32Array(mat4.multiply(mat4.create(), cameraOnUpdate.projectionMatrix, mat4.multiply(mat4.create(), camera.objectToWorldMatrix, meshOnUpdate.matrix)));
                    },
                },
                color: !material.color ? undefined : {
                    type: CanvasToy.DataType.vec4, updator: function () {
                        return material.color;
                    },
                },
                ambient: !scene.openLight ? undefined : {
                    type: CanvasToy.DataType.vec3,
                    updator: function () { return scene.ambientLight; },
                },
                normalMatrix: !scene.openLight ? undefined : {
                    type: CanvasToy.DataType.mat4,
                    updator: function () { return new Float32Array(mesh.normalMatrix); },
                },
                eyePos: !scene.openLight ? undefined : {
                    type: CanvasToy.DataType.vec4,
                    updator: function (meshOnUpdate, cameraOnUpdate) {
                        return vec4.fromValues(cameraOnUpdate.position[0], cameraOnUpdate.position[1], cameraOnUpdate.position[2], 1);
                    },
                },
            },
            attributes: {
                position: mesh.geometry.attributes.position,
                aMainUV: !material.mainTexture ? undefined : mesh.geometry.attributes.uv,
                aNormal: !scene.openLight ?
                    undefined :
                    material.interplotationMethod === CanvasToy.InterplotationMethod.Flat ?
                        mesh.geometry.attributes.flatNormal : mesh.geometry.attributes.normal,
            },
        };
    };
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.calculators__lambert_glsl = "vec3 calculate_light(vec4 position, vec3 normal, vec4 lightPos, vec4 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {\n    vec3 lightDir = normalize((lightPos - position).xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
    CanvasToy.calculators__phong_glsl = "\nvec3 calculate_light(vec4 position, vec3 normal, vec4 lightPos, vec4 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {\n    vec3 lightDir = normalize((lightPos - position).xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
    CanvasToy.env_map_vert = "";
    CanvasToy.interploters__gouraud_frag = "#ifdef USE_COLOR // color declaration\nuniform vec4 color;\n#endif // color declaration\n\n#ifdef USE_TEXTURE // texture declaration\nvarying vec2 vMainUV;\nuniform sampler2D uMainTexture;\nvec4 textureColor;\n#endif // texture declaration\n\n#ifdef OPEN_LIGHT // light declaration\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec4 position;\n    bool directional;\n};\nuniform vec3 ambient;\nuniform vec4 eyePos;\nvarying vec4 position;\nvec3 totalLighting;\nuniform Light lights[LIGHT_NUM];\nvarying vec3 vNormal;\n#endif // light declaration\n\nvoid main() {\n#ifdef USE_TEXTURE\n    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n#ifdef OPEN_LIGHT\n    totalLighting = ambient;\n    vec3 normal = normalize(vNormal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        calculate_light()\n    }\n    gl_FragColor = vec4(totalLighting, 1.0);\n#else\n#ifdef USE_COLOR\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#endif\n#endif\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * textureColor;\n#endif\n#ifdef USE_COLOR\n    gl_FragColor = gl_FragColor * color;\n#endif\n}\n";
    CanvasToy.interploters__gouraud_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE // texture\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif // texture\n\n#ifdef OPEN_LIGHT // light\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec4 position;\n    bool directional;\n}; // light\n\nuniform vec3 ambient;\nuniform vec4 eyePos;\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vLightColor;\nvec3 totalLighting;\nuniform Light lights[LIGHT_NUM];\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    totalLighting = ambient;\n    normal = normalize(normal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);\n    }\n    vLightColor = totalLighting;\n#endif\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n";
    CanvasToy.interploters__phong_frag = "#ifdef USE_COLOR // color declaration\nuniform vec4 color;\n#endif\n\n#ifdef USE_TEXTURE // texture declaration\nvarying vec2 vMainUV;\nuniform sampler2D uMainTexture;\nvec4 textureColor;\n#endif\n\n#ifdef OPEN_LIGHT\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec4 position;\n    bool directional;\n};\nvarying vec4 vPosition;\nvarying vec3 vNormal;\nuniform vec3 ambient;\nuniform vec4 eyePos;\nvec3 totalLighting;\nuniform Light lights[LIGHT_NUM];\n#endif\n\nvoid main () {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#ifdef USE_COLOR\n    gl_FragColor = color;\n#endif\n\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * texture2D(uMainTexture, vMainUV);\n#endif\n#ifdef OPEN_LIGHT\n    vec3 normal = normalize(vNormal);\n    totalLighting = ambient;\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(vPosition, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4.0, lights[index].idensity);\n    }\n    gl_FragColor *= vec4(totalLighting, 1.0);\n#endif\n}\n";
    CanvasToy.interploters__phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec4 vPosition;\nvarying vec3 vNormal;\n#endif\n\n// #ifdef SHOW_LIGHT_POS\n\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;\n    vPosition = gl_Position;\n#endif\n\n#ifdef USE_TEXTURE\n    vMainUV = aMainUV;\n#endif\n}\n";
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Texture = (function () {
        function Texture(image, type, format, wrapS, wrapT, magFilter, minFilter) {
            if (type === void 0) { type = CanvasToy.gl.TEXTURE_2D; }
            if (format === void 0) { format = CanvasToy.gl.RGB; }
            if (wrapS === void 0) { wrapS = CanvasToy.gl.CLAMP_TO_EDGE; }
            if (wrapT === void 0) { wrapT = CanvasToy.gl.CLAMP_TO_EDGE; }
            if (magFilter === void 0) { magFilter = CanvasToy.gl.NEAREST; }
            if (minFilter === void 0) { minFilter = CanvasToy.gl.NEAREST; }
            this.textureCoord = [];
            this.dataCompleted = false;
            this.isReadyToUpdate = false;
            this.image = image;
            this.type = type;
            this.format = format;
            this.wrapS = wrapS;
            this.wrapT = wrapT;
            this.magFilter = magFilter;
            this.minFilter = minFilter;
            this.glTexture = CanvasToy.gl.createTexture();
        }
        Texture.prototype.setUpTextureData = function () {
            if (this.dataCompleted) {
                return false;
            }
            this.dataCompleted = true;
            return true;
        };
        ;
        return Texture;
    }());
    CanvasToy.Texture = Texture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.colors = {
        black: vec4.fromValues(0, 0, 0, 1),
        gray: vec4.fromValues(0.5, 0.5, 0.5, 1),
        red: vec4.fromValues(1, 0, 0, 1),
        white: vec4.fromValues(1, 1, 1, 1),
    };
    (function (InterplotationMethod) {
        InterplotationMethod[InterplotationMethod["Flat"] = 0] = "Flat";
        InterplotationMethod[InterplotationMethod["Gouraud"] = 1] = "Gouraud";
        InterplotationMethod[InterplotationMethod["Phong"] = 2] = "Phong";
    })(CanvasToy.InterplotationMethod || (CanvasToy.InterplotationMethod = {}));
    var InterplotationMethod = CanvasToy.InterplotationMethod;
    (function (LightingMode) {
        LightingMode[LightingMode["Lambort"] = 0] = "Lambort";
        LightingMode[LightingMode["Phong"] = 1] = "Phong";
        LightingMode[LightingMode["Cell"] = 2] = "Cell";
        LightingMode[LightingMode["Blinn_Phong"] = 3] = "Blinn_Phong";
        LightingMode[LightingMode["Physical"] = 4] = "Physical";
    })(CanvasToy.LightingMode || (CanvasToy.LightingMode = {}));
    var LightingMode = CanvasToy.LightingMode;
    var Material = (function () {
        function Material(paramter) {
            this.ambient = vec3.fromValues(0.1, 0.1, 0.1);
            this.diffuse = vec3.fromValues(0.8, 0.8, 0.8);
            this.specular = vec3.fromValues(1, 1, 1);
            this.opacity = vec3.fromValues(0, 0, 0);
            this.interplotationMethod = InterplotationMethod.Phong;
            this.lightingMode = LightingMode.Phong;
            if (!!paramter) {
                for (var name_1 in paramter) {
                    this[name_1] = paramter[name_1];
                }
            }
            this.configShader();
            if (!this.program) {
                this.program = new CanvasToy.Program(CanvasToy.defaultProgramPass);
            }
        }
        Material.prototype.configShader = function () {
            var interplotationVert = "";
            var interplotationFrag = "";
            switch (this.interplotationMethod) {
                case (InterplotationMethod.Flat):
                    interplotationVert = CanvasToy.interploters__gouraud_vert;
                    interplotationFrag = CanvasToy.interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Gouraud):
                    interplotationVert = CanvasToy.interploters__gouraud_vert;
                    interplotationFrag = CanvasToy.interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Phong):
                    interplotationVert = CanvasToy.interploters__phong_vert;
                    interplotationFrag = CanvasToy.interploters__phong_frag;
                    break;
                default: break;
            }
            var lightCalculator = "";
            switch (this.lightingMode) {
                case (LightingMode.Lambort):
                    lightCalculator = CanvasToy.calculators__lambert_glsl;
                    break;
                case (LightingMode.Phong):
                    lightCalculator = CanvasToy.calculators__phong_glsl;
                    break;
                default: break;
            }
            this.shaderSource = {
                vertexShader: lightCalculator + interplotationVert,
                fragmentShader: lightCalculator + interplotationFrag,
            };
        };
        return Material;
    }());
    CanvasToy.Material = Material;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Water = (function (_super) {
        __extends(Water, _super);
        function Water() {
            _super.call(this, new CanvasToy.Geometry(), [new CanvasToy.Material()]);
        }
        return Water;
    }(CanvasToy.Mesh));
    CanvasToy.Water = Water;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var CubeGeometry = (function (_super) {
        __extends(CubeGeometry, _super);
        function CubeGeometry() {
            _super.call(this);
            this.attributes.position.data = [
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,
                1.0, -1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0,
            ];
            this.attributes.uv.data = [
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,
                0, 1,
            ];
            this.attributes.normal.data = [
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
            ];
            this.faces.data = [
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23,
            ];
        }
        return CubeGeometry;
    }(CanvasToy.Geometry));
    CanvasToy.CubeGeometry = CubeGeometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var RectGeometry = (function (_super) {
        __extends(RectGeometry, _super);
        function RectGeometry() {
            _super.call(this);
            this.attributes.position.data = [
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, 1.0, 0.0,
            ];
            this.attributes.uv.data = [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,
            ];
            this.attributes.normal.data = [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
                0, 1, 1,
            ];
            this.faces.data = [
                0, 1, 2,
                2, 1, 3,
            ];
        }
        return RectGeometry;
    }(CanvasToy.Geometry));
    CanvasToy.RectGeometry = RectGeometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var SphereGeometry = (function (_super) {
        __extends(SphereGeometry, _super);
        function SphereGeometry(radius, perVertDistance) {
            _super.call(this);
            for (var y = -radius; y <= radius; y += perVertDistance) {
                var circlrRadius = Math.sqrt(radius * radius - y * y);
                for (var x = -circlrRadius; x <= circlrRadius; x += perVertDistance) {
                    var z1 = Math.sqrt(circlrRadius * circlrRadius - x * x);
                    var z2 = -z1;
                    this.attributes.position.data.push(x, y, z1);
                    this.attributes.position.data.push(x, y, z2);
                }
            }
        }
        return SphereGeometry;
    }(CanvasToy.Geometry));
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var BufferForRender;
    (function (BufferForRender) {
        BufferForRender[BufferForRender["Color"] = 0] = "Color";
        BufferForRender[BufferForRender["Depth"] = 1] = "Depth";
        BufferForRender[BufferForRender["Stencil"] = 2] = "Stencil";
    })(BufferForRender || (BufferForRender = {}));
    var RenderTargetTexture = (function (_super) {
        __extends(RenderTargetTexture, _super);
        function RenderTargetTexture() {
            _super.call(this);
            this.bufferForRender = BufferForRender.Color;
            this.enableColorBuffer = true;
            this.enableDepthBuffer = false;
            this.enableStencilBuffer = false;
        }
        Object.defineProperty(RenderTargetTexture.prototype, "renderBuffer", {
            get: function () {
                switch (this.bufferForRender) {
                    case BufferForRender.Color:
                        return this.colorBuffer;
                    case BufferForRender.Depth:
                        return this.depthBuffer;
                    case BufferForRender.Stencil:
                        return this.stencilBuffer;
                    default:
                        return this.colorBuffer;
                }
            },
            enumerable: true,
            configurable: true
        });
        return RenderTargetTexture;
    }(CanvasToy.Texture));
    CanvasToy.RenderTargetTexture = RenderTargetTexture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light() {
            _super.call(this);
            this.diffuse = vec3.fromValues(1, 1, 1);
            this.specular = vec3.fromValues(1, 1, 1);
            this.idensity = 1.0;
        }
        return Light;
    }(CanvasToy.Object3d));
    CanvasToy.Light = Light;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var DirectionalLight = (function (_super) {
        __extends(DirectionalLight, _super);
        function DirectionalLight() {
            _super.call(this);
            this._direction = vec3.fromValues(1, 1, 1);
        }
        Object.defineProperty(DirectionalLight.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            set: function (_direction) {
                vec3.normalize(this._direction, _direction);
            },
            enumerable: true,
            configurable: true
        });
        return DirectionalLight;
    }(CanvasToy.Light));
    CanvasToy.DirectionalLight = DirectionalLight;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var PointLight = (function (_super) {
        __extends(PointLight, _super);
        function PointLight() {
            _super.call(this);
            this.projectCamera = new CanvasToy.PerspectiveCamera();
        }
        return PointLight;
    }(CanvasToy.Light));
    CanvasToy.PointLight = PointLight;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var SpotLight = (function (_super) {
        __extends(SpotLight, _super);
        function SpotLight() {
            _super.call(this);
            this.coneAngle = 1;
            this.direction = vec3.fromValues(1, 1, 1);
        }
        return SpotLight;
    }(CanvasToy.Light));
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var OBJLoader = (function () {
        function OBJLoader() {
        }
        OBJLoader.load = function (url, onload) {
            OBJLoader.fetch(url, function (content) {
                content = content.replace(OBJLoader.commentPattern, "");
                var positionlines = content.match(OBJLoader.vertexPattern);
                var uvlines = content.match(OBJLoader.uvPattern);
                var normallines = content.match(OBJLoader.normalPattern);
                var unIndexedPositions = OBJLoader.praiseAttibuteLines(positionlines);
                var unIndexedUVs = OBJLoader.praiseAttibuteLines(uvlines);
                var unIndexedNormals = OBJLoader.praiseAttibuteLines(normallines);
                var container = OBJLoader.buildUpMeshes(content, unIndexedPositions, unIndexedUVs, unIndexedNormals);
                onload(container);
            });
        };
        OBJLoader.fetch = function (url, onload) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    if (onload) {
                        onload(request.responseText);
                    }
                }
            };
            request.open("GET", url);
            request.send();
        };
        OBJLoader.praiseAttibuteLines = function (lines) {
            var result = [];
            if (lines === null) {
                return;
            }
            lines.forEach(function (expression) {
                var data = [];
                expression.match(OBJLoader.numberPattern).forEach(function (floatNum) {
                    if (expression !== "") {
                        data.push(parseFloat(floatNum));
                    }
                });
                result.push(data);
            });
            return result;
        };
        OBJLoader.parseAsTriangle = function (faces, forEachFace) {
            for (var i = 0; i < faces.length - 2; ++i) {
                var triangleFace = [faces[0], faces[i + 1], faces[i + 2]];
                forEachFace(triangleFace);
            }
        };
        OBJLoader.buildUpMeshes = function (content, unIndexedPositions, unIndexedUVs, unIndexedNormals) {
            var container = new CanvasToy.Object3d();
            var objects = content.split(OBJLoader.objectSplitPattern);
            objects.splice(0, 1);
            objects.forEach(function (objectContent) {
                var geometry = new CanvasToy.Geometry();
                var faces = objectContent.match(OBJLoader.indexPattern);
                if (faces !== null) {
                    faces.forEach(function (faceStr) {
                        OBJLoader.parseAsTriangle(faceStr.match(OBJLoader.faceSplitVertPattern), function (triangleFaces) {
                            triangleFaces.forEach(function (perVertData) {
                                var match = perVertData.match(OBJLoader.facePerVertPattern);
                                console.assert(match !== null && match[1] !== null, "obj file error");
                                var positionIndex = parseInt(match[1], 0) - 1;
                                geometry.faces.data.push(geometry.attributes.position.data.length / 3);
                                geometry.addVertex({
                                    position: unIndexedPositions[positionIndex],
                                    uv: [unIndexedUVs[parseInt(match[2], 0) - 1][0],
                                        unIndexedUVs[parseInt(match[2], 0) - 1][1]],
                                    normal: unIndexedNormals[parseInt(match[3], 0) - 1],
                                });
                            });
                        });
                    });
                }
                var mesh = new CanvasToy.Mesh(geometry, [new CanvasToy.Material()]);
                mesh.parent = container;
            });
            return container;
        };
        OBJLoader.commentPattern = /#.*/mg;
        OBJLoader.numberPattern = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/mg;
        OBJLoader.faceSplitVertPattern = /([0-9]|\/|\-)+/g;
        OBJLoader.facePerVertPattern = /([0-9]*)\/?([0-9]*)\/?([0-9]*)/;
        OBJLoader.objectSplitPattern = /[o|g]\s+.+/mg;
        OBJLoader.vertexPattern = /v\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
        OBJLoader.uvPattern = /vt\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
        OBJLoader.normalPattern = /vn\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
        OBJLoader.indexPattern = /f\s+([-+]?[0-9]*\.?[0-9]+ ?|\/)+/mg;
        return OBJLoader;
    }());
    CanvasToy.OBJLoader = OBJLoader;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    function setCanvas(canvas) {
        CanvasToy.engine = new Renderer(canvas);
    }
    CanvasToy.setCanvas = setCanvas;
    (function (RenderMode) {
        RenderMode[RenderMode["Dynamic"] = 0] = "Dynamic";
        RenderMode[RenderMode["Static"] = 1] = "Static";
    })(CanvasToy.RenderMode || (CanvasToy.RenderMode = {}));
    var RenderMode = CanvasToy.RenderMode;
    var Renderer = (function () {
        function Renderer(canvas) {
            var _this = this;
            this.canvas = null;
            this.renderMode = RenderMode.Dynamic;
            this.preloadRes = [];
            this.usedTextureNum = 0;
            this.renderTargets = [];
            this.vertPrecision = "highp";
            this.fragPrecision = "mediump";
            this.isAnimating = false;
            this.renderQueue = [];
            this.scenes = [];
            this.cameras = [];
            this.frameRate = 1000 / 60;
            this.stopped = false;
            this.main = function () {
                for (var _i = 0, _a = _this.renderQueue; _i < _a.length; _i++) {
                    var renderCommand = _a[_i];
                    renderCommand();
                }
                if (_this.stopped) {
                    return;
                }
                setTimeout(_this.main, _this.frameRate);
            };
            this.canvas = canvas;
            CanvasToy.gl = CanvasToy.initWebwebglContext(canvas);
            this.initMatrix();
            CanvasToy.gl.clearDepth(1.0);
            CanvasToy.gl.enable(CanvasToy.gl.DEPTH_TEST);
            CanvasToy.gl.depthFunc(CanvasToy.gl.LEQUAL);
            setTimeout(this.main, this.frameRate);
        }
        Renderer.prototype.renderToTexture = function (scene, camera, rttTexture) {
            var _this = this;
            CanvasToy.gl.bindTexture(CanvasToy.gl.TEXTURE_2D, rttTexture.glTexture);
            CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_2D, 0, rttTexture.format, this.canvas.width, this.canvas.height, 0, rttTexture.format, CanvasToy.gl.UNSIGNED_BYTE, null);
            CanvasToy.gl.texParameteri(rttTexture.type, CanvasToy.gl.TEXTURE_WRAP_S, rttTexture.wrapS);
            CanvasToy.gl.texParameteri(rttTexture.type, CanvasToy.gl.TEXTURE_WRAP_T, rttTexture.wrapT);
            CanvasToy.gl.texParameteri(CanvasToy.gl.TEXTURE_2D, CanvasToy.gl.TEXTURE_MAG_FILTER, rttTexture.magFilter);
            CanvasToy.gl.texParameteri(CanvasToy.gl.TEXTURE_2D, CanvasToy.gl.TEXTURE_MIN_FILTER, rttTexture.minFilter);
            rttTexture.frameBuffer = CanvasToy.gl.createFramebuffer();
            CanvasToy.gl.bindFramebuffer(CanvasToy.gl.FRAMEBUFFER, rttTexture.frameBuffer);
            if (rttTexture.enableColorBuffer) {
                rttTexture.colorBuffer = CanvasToy.gl.createRenderbuffer();
                CanvasToy.gl.framebufferTexture2D(CanvasToy.gl.FRAMEBUFFER, CanvasToy.gl.COLOR_ATTACHMENT0, CanvasToy.gl.TEXTURE_2D, rttTexture.glTexture, 0);
            }
            if (rttTexture.enableDepthBuffer) {
                rttTexture.depthBuffer = CanvasToy.gl.createRenderbuffer();
                CanvasToy.gl.framebufferTexture2D(CanvasToy.gl.FRAMEBUFFER, CanvasToy.gl.DEPTH_ATTACHMENT, CanvasToy.gl.TEXTURE_2D, rttTexture.glTexture, 0);
            }
            if (rttTexture.enableDepthBuffer) {
                rttTexture.stencilBuffer = CanvasToy.gl.createRenderbuffer();
                CanvasToy.gl.framebufferTexture2D(CanvasToy.gl.FRAMEBUFFER, CanvasToy.gl.STENCIL_ATTACHMENT, CanvasToy.gl.TEXTURE_2D, rttTexture.glTexture, 0);
            }
            if (CanvasToy.gl.checkFramebufferStatus(CanvasToy.gl.FRAMEBUFFER) !== CanvasToy.gl.FRAMEBUFFER_COMPLETE) {
                console.log("frame buffer not completed");
            }
            CanvasToy.gl.bindTexture(CanvasToy.gl.TEXTURE_2D, null);
            CanvasToy.gl.bindRenderbuffer(CanvasToy.gl.RENDERBUFFER, null);
            CanvasToy.gl.bindFramebuffer(CanvasToy.gl.FRAMEBUFFER, null);
            this.buildScene(scene, camera);
            this.renderQueue.push(function () {
                CanvasToy.gl.bindFramebuffer(CanvasToy.gl.FRAMEBUFFER, rttTexture.frameBuffer);
                CanvasToy.gl.bindRenderbuffer(CanvasToy.gl.RENDERBUFFER, rttTexture.colorBuffer);
                CanvasToy.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
                CanvasToy.gl.clear(CanvasToy.gl.DEPTH_BUFFER_BIT | CanvasToy.gl.COLOR_BUFFER_BIT);
                for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                    var object = _a[_i];
                    _this.renderObject(camera, object);
                }
                CanvasToy.gl.bindFramebuffer(CanvasToy.gl.FRAMEBUFFER, null);
                CanvasToy.gl.bindRenderbuffer(CanvasToy.gl.RENDERBUFFER, null);
            });
            return rttTexture;
        };
        Renderer.prototype.render = function (scene, camera) {
            var _this = this;
            if (this.scenes.indexOf(scene) === -1) {
                this.scenes.push(scene);
                this.buildScene(scene, camera);
            }
            if (this.cameras.indexOf(camera) === -1) {
                this.cameras.push(camera);
                camera.adaptTargetRadio(this.canvas);
            }
            switch (this.renderMode) {
                case RenderMode.Static:
                    this.renderQueue = [];
                    CanvasToy.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
                    CanvasToy.gl.clear(CanvasToy.gl.DEPTH_BUFFER_BIT | CanvasToy.gl.COLOR_BUFFER_BIT);
                    for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                        var object = _a[_i];
                        this.renderObject(camera, object);
                    }
                    break;
                case RenderMode.Dynamic:
                    this.renderQueue.push(function () {
                        CanvasToy.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
                        for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                            var object = _a[_i];
                            _this.renderObject(camera, object);
                        }
                    });
                    break;
                default:
                    break;
            }
        };
        Renderer.prototype.buildScene = function (scene, camera) {
            if (this.preloadRes.length > 0) {
                return;
            }
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (object instanceof CanvasToy.Mesh) {
                    var mesh = object;
                    this.makeMeshPrograms(scene, mesh, camera);
                }
            }
            scene.programSetUp = true;
        };
        Renderer.prototype.makeMeshPrograms = function (scene, mesh, camera) {
            CanvasToy.gl.bindBuffer(CanvasToy.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
            CanvasToy.gl.bufferData(CanvasToy.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.geometry.faces.data), CanvasToy.gl.STATIC_DRAW);
            this.copyDataToVertexBuffer(mesh.geometry);
            if (mesh.materials.length > 1) {
                CanvasToy.gl.enable(CanvasToy.gl.BLEND);
                CanvasToy.gl.blendFunc(CanvasToy.gl.SRC_COLOR, CanvasToy.gl.ONE_MINUS_SRC_COLOR);
            }
            for (var _i = 0, _a = mesh.materials; _i < _a.length; _i++) {
                var material = _a[_i];
                var cameraInScene = false;
                for (var _b = 0, _c = scene.objects; _b < _c.length; _b++) {
                    var object = _c[_b];
                    if (object === camera) {
                        cameraInScene = true;
                        break;
                    }
                }
                if (!cameraInScene) {
                    console.error("Camera has not been added in Scene. Rendering stopped");
                    return;
                }
                material.program.make(material, mesh, scene, camera);
                CanvasToy.gl.useProgram(material.program.webGlProgram);
                for (var textureName in material.program.textures) {
                    if (material.program.textures[textureName] !== undefined) {
                        this.loadTexture(material.program, textureName, material.program.textures[textureName]);
                    }
                }
                if (scene.openLight) {
                    this.setUplights(scene, material, mesh, camera);
                }
            }
        };
        Renderer.prototype.loadTexture = function (program, sampler, texture) {
            var _this = this;
            if (texture instanceof CanvasToy.RenderTargetTexture) {
                texture.unit = this.usedTextureNum;
                this.usedTextureNum++;
                program.textures.push(texture);
                CanvasToy.gl.useProgram(program.webGlProgram);
                CanvasToy.gl.activeTexture(CanvasToy.gl.TEXTURE0 + texture.unit);
                CanvasToy.gl.bindTexture(texture.type, texture.glTexture);
                return;
            }
            var lastOnload = texture.image.onload;
            if (texture.image.complete) {
                this.addTexture(program, sampler, texture);
                return;
            }
            texture.image.onload = function (et) {
                if (lastOnload) {
                    lastOnload.apply(texture.image, et);
                }
                _this.addTexture(program, sampler, texture);
            };
        };
        Renderer.prototype.addTexture = function (program, sampler, texture) {
            texture.unit = this.usedTextureNum;
            this.usedTextureNum++;
            program.textures.push(texture);
            CanvasToy.gl.useProgram(program.webGlProgram);
            CanvasToy.gl.pixelStorei(CanvasToy.gl.UNPACK_FLIP_Y_WEBGL, 1);
            CanvasToy.gl.activeTexture(CanvasToy.gl.TEXTURE0 + texture.unit);
            CanvasToy.gl.bindTexture(texture.type, texture.glTexture);
            CanvasToy.gl.texParameteri(texture.type, CanvasToy.gl.TEXTURE_WRAP_S, texture.wrapS);
            CanvasToy.gl.texParameteri(texture.type, CanvasToy.gl.TEXTURE_WRAP_T, texture.wrapT);
            CanvasToy.gl.texParameteri(texture.type, CanvasToy.gl.TEXTURE_MAG_FILTER, texture.magFilter);
            CanvasToy.gl.texParameteri(texture.type, CanvasToy.gl.TEXTURE_MIN_FILTER, texture.minFilter);
            texture.setUpTextureData();
            program.addUniform(sampler, { type: CanvasToy.DataType.int, updator: function () { return texture.unit; } });
        };
        Renderer.prototype.setUplights = function (scene, material, mesh, camera) {
            var _loop_1 = function(index) {
                var light = scene.lights[index];
                var diffuse = "lights[" + index + "].diffuse";
                var specular = "lights[" + index + "].specular";
                var idensity = "lights[" + index + "].idensity";
                var position = "lights[" + index + "].position";
                material.program.addUniform(diffuse, {
                    type: CanvasToy.DataType.vec3,
                    updator: function () { return light.diffuse; },
                });
                material.program.addUniform(specular, {
                    type: CanvasToy.DataType.vec3,
                    updator: function () { return light.specular; },
                });
                material.program.addUniform(position, {
                    type: CanvasToy.DataType.vec4,
                    updator: function () { return light.position; },
                });
                material.program.addUniform(idensity, {
                    type: CanvasToy.DataType.float,
                    updator: function () { return light.idensity; },
                });
                light.shadowRtt = new CanvasToy.RenderTargetTexture();
            };
            for (var index in scene.lights) {
                _loop_1(index);
            }
        };
        Renderer.prototype.copyDataToVertexBuffer = function (geometry) {
            for (var name_2 in geometry.attributes) {
                var attribute = geometry.attributes[name_2];
                if (attribute !== undefined) {
                    CanvasToy.gl.bindBuffer(CanvasToy.gl.ARRAY_BUFFER, attribute.buffer);
                    CanvasToy.gl.bufferData(CanvasToy.gl.ARRAY_BUFFER, new Float32Array(attribute.data), CanvasToy.gl.STATIC_DRAW);
                    console.log(name_2 + "buffer size:" + CanvasToy.gl.getBufferParameter(CanvasToy.gl.ARRAY_BUFFER, CanvasToy.gl.BUFFER_SIZE));
                }
            }
        };
        ;
        Renderer.prototype.renderLight = function (light, scene) {
        };
        Renderer.prototype.renderObject = function (camera, object) {
            if (object instanceof CanvasToy.Mesh) {
                var mesh = object;
                for (var _i = 0, _a = mesh.materials; _i < _a.length; _i++) {
                    var material = _a[_i];
                    var program = material.program;
                    if (program.enableDepthTest) {
                        CanvasToy.gl.enable(CanvasToy.gl.DEPTH_TEST);
                    }
                    else {
                        CanvasToy.gl.disable(CanvasToy.gl.DEPTH_TEST);
                    }
                    CanvasToy.gl.useProgram(program.webGlProgram);
                    for (var uniformName in program.uniforms) {
                        if (program.uniforms[uniformName] !== undefined) {
                            program.uniforms[uniformName](object, camera);
                        }
                    }
                    for (var attributeName in program.attributes) {
                        CanvasToy.gl.bindBuffer(CanvasToy.gl.ARRAY_BUFFER, program.attributes[attributeName].buffer);
                        CanvasToy.gl.vertexAttribPointer(program.attributeLocations[attributeName], program.attributes[attributeName].size, program.attributes[attributeName].type, false, 0, 0);
                    }
                    CanvasToy.gl.bindBuffer(CanvasToy.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
                    CanvasToy.gl.drawElements(CanvasToy.gl.TRIANGLES, mesh.geometry.faces.data.length, CanvasToy.gl.UNSIGNED_SHORT, 0);
                }
            }
        };
        Renderer.prototype.initMatrix = function () {
        };
        return Renderer;
    }());
    CanvasToy.Renderer = Renderer;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Scene = (function () {
        function Scene() {
            var _this = this;
            this.objects = [];
            this.lights = [];
            this.ambientLight = vec3.fromValues(0, 0, 0);
            this.openLight = false;
            this.enableShadowMap = false;
            this.clearColor = [0, 0, 0, 0];
            this.programSetUp = false;
            window.setInterval(function () { return _this.update(1000 / 60); }, 1000 / 60);
        }
        Scene.prototype.update = function (dt) {
            for (var _i = 0, _a = this.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (!object.parent) {
                    object.update(dt);
                }
            }
        };
        Scene.prototype.addObject = function (object) {
            var _this = this;
            this.objects.push(object);
            object.scene = this;
            object.children.forEach(function (child) {
                _this.addObject(child);
            });
        };
        Scene.prototype.removeObject = function (object) {
            var _this = this;
            object.children.forEach(function (child) {
                _this.removeObject(child);
            });
            this.objects.splice(this.objects.indexOf(object));
        };
        Scene.prototype.addLight = function (light) {
            this.openLight = true;
            this.lights.push(light);
            light.scene = this;
        };
        return Scene;
    }());
    CanvasToy.Scene = Scene;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var CubeTexture = (function (_super) {
        __extends(CubeTexture, _super);
        function CubeTexture(xneg, xpos, yneg, ypos, zneg, zpos, wrapS, wrapT, magFilter, minFilter) {
            _super.call(this, null, CanvasToy.gl.TEXTURE_CUBE_MAP, wrapS, wrapT, magFilter, minFilter);
            this.count = 6;
            this.xneg = xneg;
            this.xpos = xpos;
            this.yneg = yneg;
            this.ypos = ypos;
            this.zneg = zneg;
            this.zpos = zpos;
            this.xneg.onload = this.onLoad;
            this.xpos.onload = this.onLoad;
            this.yneg.onload = this.onLoad;
            this.ypos.onload = this.onLoad;
            this.zneg.onload = this.onLoad;
            this.zpos.onload = this.onLoad;
        }
        CubeTexture.prototype.setUpTextureData = function () {
            if (_super.prototype.setUpTextureData.call(this)) {
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.xneg);
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.xpos);
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.yneg);
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.ypos);
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.zneg);
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.zpos);
            }
            return true;
        };
        CubeTexture.prototype.onLoad = function () {
            this.count--;
            if (this.count === 0) {
                this.isReadyToUpdate = true;
            }
        };
        return CubeTexture;
    }(CanvasToy.Texture));
    CanvasToy.CubeTexture = CubeTexture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Texture2D = (function (_super) {
        __extends(Texture2D, _super);
        function Texture2D(image, format, wrapS, wrapT, magFilter, minFilter) {
            if (format === void 0) { format = CanvasToy.gl.RGB; }
            if (wrapS === void 0) { wrapS = CanvasToy.gl.CLAMP_TO_EDGE; }
            if (wrapT === void 0) { wrapT = CanvasToy.gl.CLAMP_TO_EDGE; }
            if (magFilter === void 0) { magFilter = CanvasToy.gl.NEAREST; }
            if (minFilter === void 0) { minFilter = CanvasToy.gl.NEAREST; }
            _super.call(this, image, CanvasToy.gl.TEXTURE_2D, format, wrapS, wrapT, magFilter, minFilter);
        }
        Texture2D.prototype.setUpTextureData = function () {
            if (_super.prototype.setUpTextureData.call(this)) {
                CanvasToy.gl.texImage2D(this.type, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.image);
            }
            return true;
        };
        return Texture2D;
    }(CanvasToy.Texture));
    CanvasToy.Texture2D = Texture2D;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    (function (ShaderType) {
        ShaderType[ShaderType["VertexShader"] = 0] = "VertexShader";
        ShaderType[ShaderType["FragmentShader"] = 1] = "FragmentShader";
    })(CanvasToy.ShaderType || (CanvasToy.ShaderType = {}));
    var ShaderType = CanvasToy.ShaderType;
    function mixin(toObject, fromObject) {
        for (var property in fromObject) {
            if (toObject[property] instanceof Object) {
                mixin(toObject[property], fromObject[property]);
            }
            else {
                toObject[property] = fromObject[property];
            }
        }
    }
    CanvasToy.mixin = mixin;
    function initWebwebglContext(canvas) {
        try {
            CanvasToy.gl = canvas.getContext("experimental-webgl");
        }
        catch (e) {
            CanvasToy.gl = canvas.getContext("webgl");
        }
        if (!CanvasToy.gl) {
            alert("Cannot init webgl, current browser may not support it.");
        }
        return CanvasToy.gl;
    }
    CanvasToy.initWebwebglContext = initWebwebglContext;
    function getDomScriptText(script) {
        if (!script) {
            return null;
        }
        var theSource = "";
        var currentChild = script.firstChild;
        while (currentChild) {
            if (currentChild.nodeType === 3) {
                theSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }
    }
    CanvasToy.getDomScriptText = getDomScriptText;
    function createSeparatedShader(gl, source, type) {
        var shader;
        var typeInfo;
        if (type === ShaderType.FragmentShader) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            typeInfo = "fragment shader";
        }
        else if (type === ShaderType.VertexShader) {
            shader = gl.createShader(gl.VERTEX_SHADER);
            typeInfo = "vertex shader";
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("error: " + typeInfo + "\n" + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    function linkShader(gl, vertexShader, fragmentShader) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("error: link shader program failed.\n" + gl.getProgramInfoLog(shaderProgram));
        }
        return shaderProgram;
    }
    ;
    function createEntileShader(gl, vertexShaderSource, fragmentShaderSource) {
        var vertShader = createSeparatedShader(gl, vertexShaderSource, ShaderType.VertexShader);
        var fragShader = createSeparatedShader(gl, fragmentShaderSource, ShaderType.FragmentShader);
        return linkShader(gl, vertShader, fragShader);
    }
    CanvasToy.createEntileShader = createEntileShader;
})(CanvasToy || (CanvasToy = {}));
//# sourceMappingURL=canvas-toy.js.map