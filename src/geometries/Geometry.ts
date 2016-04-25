/// <reference path="../CanvasToy.ts"/>

module CanvasToy{

    export class Geometry{
        public positions:any[] = [];
        public uvs:any[] = [];
        public normals:any[] = [];
        public indices:Array<number> = [];

        constructor(size?:number) {
        }

        addVertex(index:Vec3Array, position:Vec3Array, uv:Vec2Array, normal:Vec3Array){
            this.indices.push.apply(index);
            this.positions.push.apply(position);
            (!!uv) ? this.uvs.push.apply(uv) : 0;
            (!!normal) ? this.normals.push.apply : 0;
        }
    }
}
