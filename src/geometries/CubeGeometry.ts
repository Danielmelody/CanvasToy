/// <reference path="./Geometry.ts"/>

module CanvasToy{
    export class CubeGeometry extends Geometry{

        constructor(vertices?:Array<number>) {
            if (vertices && vertices.length < 8) {
                return null;
            }
            this.vertices = vertices.slice(0, 8) || [
                -1, -1, -1,
                -1, -1, 1,
                -1, 1, -1,
                -1, 1, 1,
                1, -1, -1,
                1, -1, 1,
                1, 1, -1,
                1, 1, 1,
            ];
            super();
        }
    }
}
