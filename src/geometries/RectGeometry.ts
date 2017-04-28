import { Geometry } from "./Geometry";

export class RectGeometry extends Geometry {
    constructor(gl: WebGLRenderingContext) {
        super(gl);
        this.attributes.position.data = [
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
        ];
        this.attributes.uv.data = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
        ];
        this.attributes.normal.data = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];
        this.faces.data = [
            0, 1, 2,
            2, 1, 3,
        ];
    }
}
