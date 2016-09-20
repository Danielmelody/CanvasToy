/// <reference path="../Mesh.ts"/>

module CanvasToy {
    export class Water extends Mesh {

        constructor() {
            super(new Geometry(), [new Material()]);
        }
    }
}
