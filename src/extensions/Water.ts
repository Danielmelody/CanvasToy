/// <reference path="../geometries/Geometry.ts"/>
/// <reference path="../Mesh.ts"/>
/// <reference path="../materials/Material.ts"/>

namespace CanvasToy {

    export class Water extends Mesh {
        constructor() {
            super(new Geometry(), [new Material()]);
        }
    }

}
