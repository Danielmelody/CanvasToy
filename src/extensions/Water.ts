import { Geometry } from "../geometries/Geometry";
import { StandardMaterial } from "../materials/StandardMaterial";
import { Mesh } from "../Mesh";

export class Water extends Mesh {
    constructor(gl: WebGLRenderingContext) {
        super(new Geometry(gl), [new StandardMaterial(gl)]);
    }
}
