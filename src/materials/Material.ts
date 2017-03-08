/// <reference path="../CanvasToy.ts"/>
/// <reference path="../shader/Program.ts"/>
/// <reference path="../shader/shaders.ts"/>
/// <reference path="../textures/Texture.ts"/>

namespace CanvasToy {

    export let colors = {
        black: vec4.fromValues(0, 0, 0, 1),
        gray: vec4.fromValues(0.5, 0.5, 0.5, 1),
        red: vec4.fromValues(1, 0, 0, 1),
        white: vec4.fromValues(1, 1, 1, 1),
    };

    export abstract class Material {
        public dirty = true;
        public defines: string[] = [];
        public program: Program;
    }
}
