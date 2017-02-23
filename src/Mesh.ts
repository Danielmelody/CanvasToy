/// <reference path="./CanvasToy.ts"/>
/// <reference path="./Object3d.ts"/>

namespace CanvasToy {

    export class Mesh extends Object3d {

        public geometry: Geometry;

        public materials: Material[] = [];

        public maps: Texture[] = [];

        constructor(geometry: Geometry, materials: Material[]) {
            super();
            this.materials = materials;
            this.geometry = geometry;
        }

        public drawMode(gl: WebGLRenderingContext): number {
            return gl.STATIC_DRAW;
        }

    }
}
