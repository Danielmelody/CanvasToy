/// <reference path="../CanvasToy.ts"/>

module CanvasToy{

    export class Geometry{
        public positions:any[] = [];
        public uvs:any[] = [];
        public normals:any[] = [];
        public indices:Array<number> = [];

        constructor(size?:number) {
        }
    }
}
