/// <reference path="./CanvasToy.ts"/>
/// <reference path="./Object3d.ts"/>

namespace CanvasToy {

    export class Mesh extends Object3d {

        public geometry: Geometry;

        public materials: Material[] = [];

        public maps: Texture[] = [];

        // @uniform("normalMatrix", DataType.mat4)
        public normalMatrix: Mat4Array = mat4.create();

        constructor(geometry: Geometry, materials: Material[]) {
            super();
            this.materials = materials;
            this.geometry = geometry;
        }

        public drawMode(gl: WebGLRenderingContext): number {
            return gl.STATIC_DRAW;
        }

        public genOtherMatrixs() {
            super.genOtherMatrixs();
            mat4.transpose(this.normalMatrix, mat4.invert(mat4.create(), this.matrix));
        }
    }
}
