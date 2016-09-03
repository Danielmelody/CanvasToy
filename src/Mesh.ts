/// <reference path="./geometries/Geometry.ts"/>
/// <reference path="./materials/Material.ts"/>
/// <reference path="./Node.ts"/>
/// <reference path="./render/Program.ts"/>

module CanvasToy {

    export class Mesh extends Node {

        public drawMode: number = engine.gl.STATIC_DRAW;

        public programs: Array<Program> = [];

        public geometry: Geometry;

        public materials: Array<Material> = [];

        public maps: Texture[] = [];

        public normalMatrix: Mat4Array = mat4.create();

        constructor(geometry: Geometry, materials: Array<Material>) {
            super();
            this.materials = materials;
            this.geometry = geometry;
            this.registerUpdate((event) => {
                mat4.transpose(this.normalMatrix, mat4.invert(mat4.create(), this.matrix));
            })
        }
    }
}
