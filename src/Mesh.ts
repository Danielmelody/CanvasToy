/// <reference path="./CanvasToy.ts"/>
/// <reference path="./Object3d.ts"/>

namespace CanvasToy {

    export class Mesh extends Object3d {

        public drawMode: number = gl.STATIC_DRAW;

        public geometry: Geometry;

        public materials: Array<Material> = [];

        public maps: Texture[] = [];

        public normalMatrix: Mat4Array = mat4.create();

        constructor(geometry: Geometry, materials: Array<Material>) {
            super();
            this.materials = materials;
            this.geometry = geometry;
        }

        public genOtherMatrixs() {
            super.genOtherMatrixs();
            mat4.transpose(this.normalMatrix, mat4.invert(mat4.create(), this.matrix));
        }
    }
}
