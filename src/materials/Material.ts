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

    export interface IMaterial {
        mainTexture?: Texture;
        color?: Vec3Array;
        diffuse?: Vec3Array;
        specular?: Vec3Array;
        interplotationMethod?: InterplotationMethod;
        lightingMode?: LightingMode;
        program?: Program;
    }

    export abstract class Material implements IMaterial {

        public program: Program;

        public color: Vec3Array;
        public mainTexture: Texture;

        public ambient: Vec3Array = vec3.fromValues(0.1, 0.1, 0.1);
        public ambientMap: Texture;

        public diffuse: Vec3Array = vec3.fromValues(0.8, 0.8, 0.8);
        public diffuseMap: Texture;

        public specular: Vec3Array = vec3.fromValues(1, 1, 1);
        public specularMap: Texture;

        public opacity: Vec3Array = vec3.fromValues(0, 0, 0);
        public opacityMap: Texture;

        public bumpMap: Texture;

        public normalMap: Texture;

        public reflactivity: number;

        constructor(gl: WebGLRenderingContext, paramter: IMaterial = {}) {
            if (!!paramter) {
                for (const name in paramter) {
                    this[name] = paramter[name];
                }
            }
        }
    }
}
