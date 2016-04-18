/// <reference path="../CanvasToy.ts"/>
/// <reference path="../textures/Texture.ts"/>

module CanvasToy{

    export var colors = {
        white : vec4.fromValues(1, 1, 1, 1),
        black : vec4.fromValues(0, 0, 0, 1),
        gray : vec4.fromValues(0.5, 0.5, 0.5, 1),
        red : vec4.fromValues(1, 0, 0, 1)
    }

    export enum ShadingMode{
        flatShading,
        smoothShading
    }

    export class Material {

        public map:Texture = null;
        public color:Vec4Array = null;
        public colorBuffer:VertexBuffer = null;

        public ambient:Vec3Array = vec3.fromValues(0.1, 0.1, 0.1);
        public ambientMap:Texture = null;

        public diffuse:Vec3Array = vec3.fromValues(0.8, 0.8, 0.8);
        public diffuseMap:Texture = null;

        public specular:Vec3Array = vec3.fromValues(1, 1, 1);
        public specularMap:Texture = null;

        public opacity:Vec3Array = vec3.fromValues(0, 0, 0);
        public opacityMap:Texture = null;

        shadingMode:ShadingMode = ShadingMode.smoothShading;

        public bumpMap:Texture = null;

        public normalMap:Texture = null;

        public reflactivity:number = 1;

        constructor() {}

    }
}
