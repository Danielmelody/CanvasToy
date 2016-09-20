/// <reference path="./Geometry.ts"/>

module CanvasToy {
    export class RectGeometry extends Geometry {
        constructor() {
            super();
            this.attributes.position.data = [
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, 1.0, 0.0,
            ];
            this.attributes.uv.data = [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                1.0, 1.0
            ];
            this.attributes.normal.data = [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
                0, 1, 1,
            ];
            this.faces.data = [
                0, 1, 2,
                2, 1, 3
            ];
        }
    }
}
