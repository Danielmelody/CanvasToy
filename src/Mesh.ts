import { mat4 } from "gl-matrix";
import { DataType } from "./DataTypeEnum";
import { uniform } from "./Decorators";
import { Geometry } from "./geometries/Geometry";
import { Material } from "./materials/Material";
import { Object3d } from "./Object3d";

export class Mesh extends Object3d {

    public readonly geometry: Geometry;

    public materials: Material[] = [];

    @uniform(DataType.mat4, "modelMatrix")
    public get matrix(): mat4 {
        return this._matrix;
    }

    @uniform(DataType.mat4)
    public get normalMatrix(): mat4 {
        return mat4.transpose(
            mat4.create(),
            mat4.invert(mat4.create(),
                this._matrix),
        );
    }

    constructor(geometry: Geometry, materials: Material[]) {
        super();
        this.materials = materials;
        this.geometry = geometry;
    }

    public drawMode(gl: WebGLRenderingContext): number {
        return gl.STATIC_DRAW;
    }
}
