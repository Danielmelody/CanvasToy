/// <reference path="../CanvasToy.ts"/>
/// <reference path="../textures/Texture.ts"/>

module CanvasToy {

    export var colors = {
        white: vec4.fromValues(1, 1, 1, 1),
        black: vec4.fromValues(0, 0, 0, 1),
        gray: vec4.fromValues(0.5, 0.5, 0.5, 1),
        red: vec4.fromValues(1, 0, 0, 1)
    }

    export enum ShadingMode {
        flatShading,
        smoothShading
    }

    export class Material {

        public attributes = {};
        public uniforms = {};
        public samplers = {};

        public vertexShaderSource: string;
        public fragShaderSource: string;

        public map: Texture;
        public color: Vec4Array;

        public ambient: Vec3Array = vec3.fromValues(0.1, 0.1, 0.1);
        public ambientMap: Texture;

        public diffuse: Vec3Array = vec3.fromValues(0.8, 0.8, 0.8);
        public diffuseMap: Texture;

        public specular: Vec3Array = vec3.fromValues(1, 1, 1);
        public specularMap: Texture;

        public opacity: Vec3Array = vec3.fromValues(0, 0, 0);
        public opacityMap: Texture;

        shadingMode: ShadingMode = ShadingMode.smoothShading;

        public bumpMap: Texture;

        public normalMap: Texture;

        public reflactivity: number;

        constructor(paramter: { texture: Texture, color: Vec4Array } = { texture: undefined, color: CanvasToy.colors.white }) {
            if (paramter.texture != undefined) {
                this.map = paramter.texture;
                this.addAttribute('aTextureCoord', this.map);
            }
            if (paramter.color != undefined) {
                this.color = paramter.color;
                this.addUniform('uColor', this.color);
            }
        }

        addAttribute(name: string, data: any) {
            this.attributes[name] = data;
        }

        addUniform(name: string, data: any) {
            this.uniforms[name] = data;
        }

    }
}
