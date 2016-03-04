/// <reference path="../CanvasToy.ts"/>
/// <reference path="../textures/Texture.ts"/>

module CanvasToy{

    export class Material {

        public map:Texture = null;


        public ambient:Vec3Array = vec3.fromValues(0.1, 0.1, 0.1);
        public ambientMap:Texture = null;

        public diffuse:Vec3Array = vec3.fromValues(0.8, 0.8, 0.8);
        public diffuseMap:Texture = null;

        public specular:Vec3Array = vec3.fromValues(1, 1, 1);
        public specularMap:Texture = null;

        public opacity:Vec3Array = vec3.fromValues(0, 0, 0);
        public opacityMap:Texture = null;

        public bumpMap:Texture = null;

        public normalMap:Texture = null;

        public reflactivity:number = 1;

        constructor(){

        }

    }
}
