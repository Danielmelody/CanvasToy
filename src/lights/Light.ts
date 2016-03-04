/// <reference path="../CanvasToy.ts"/>

module CanvasToy {
    export abstract class Light extends Object3d{
        ambient:Vec3Array;
        diffuse:Vec3Array;
        specular:Vec3Array;
        constructor(){
            super();
        }
    }
}
