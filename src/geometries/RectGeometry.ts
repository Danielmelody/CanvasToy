/// <reference path="./Geometry.ts"/>

module CanvasToy {
    export class RectGeomotry extends Geometry{
        constructor() {
            super();
            this.positions = [
                -1.0, -1.0,  0.0,
                1.0, -1.0,  0.0,
                1.0,  1.0,  0.0,
                -1.0,  1.0,  0.0,
            ];
            this.indices = [
                0, 1, 2,
                1, 2, 3
            ];
        }
    }
}
