/// <reference path="./geometries/Geometry.ts"/>
/// <reference path="./materials/Material.ts"/>
/// <reference path="./Node.ts"/>
/// <reference path="./render/Program.ts"/>

module CanvasToy {

    export class Mesh extends Node {

        public drawMode: number = engine.gl.STATIC_DRAW;

        public program: Program;

        public geometry: Geometry;

        public material: Material;

        public maps: Texture[] = [];

        public normalMatrix: Mat4Array = mat4.create();

        constructor(geometry: Geometry, material: Material) {
            super();
            this.material = material;
            this.geometry = geometry;
            this.registerUpdate((event) => {
                mat4.transpose(this.normalMatrix, mat4.invert(mat4.create(), this.matrix));
            })
        }
    }
}
