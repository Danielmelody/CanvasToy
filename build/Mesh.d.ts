import { mat4 } from "gl-matrix";
import { Geometry } from "./geometries/Geometry";
import { IMaterial } from "./materials/Material";
import { Object3d } from "./Object3d";
export declare class Mesh extends Object3d {
    readonly geometry: Geometry;
    materials: IMaterial[];
    get matrix(): mat4;
    get normalMatrix(): mat4;
    constructor(geometry: Geometry, materials: IMaterial[]);
    drawMode(gl: WebGLRenderingContext): number;
}
