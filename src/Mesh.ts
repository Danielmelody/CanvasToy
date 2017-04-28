import { Geometry } from "./geometries/Geometry";
import { Material } from "./materials/Material";
import { Object3d } from "./Object3d";

export class Mesh extends Object3d {

    public geometry: Geometry;

    public materials: Material[] = [];

    constructor(geometry: Geometry, materials: Material[]) {
        super();
        this.materials = materials;
        this.geometry = geometry;
    }

    public drawMode(gl: WebGLRenderingContext): number {
        return gl.STATIC_DRAW;
    }
}
