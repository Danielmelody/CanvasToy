/// <reference path="../lib/modules/gl-matrix.d.ts"/>

module CanvasToy{
    var version = 2;
}

// FIXME: the declaration && assignment below is to add Library glMatrix to
// CanvasToy modules, it still remain all global variables like glMatrix, etc.

declare var glMatrix;
declare var vec2;
declare var vec3;
declare var vec4;
declare var mat2;
declare var mat2d;
declare var mat3;
declare var mat4;
declare var quat;

CanvasToy.glMatrix = glMatrix;
CanvasToy.vec2 = vec2
CanvasToy.vec3 = vec3;
CanvasToy.vec4 = vec4;
CanvasToy.mat2 = mat2;
CanvasToy.mat2d = mat2d;
CanvasToy.mat3 = mat3;
CanvasToy.mat4 = mat4;
CanvasToy.quat = quat;
