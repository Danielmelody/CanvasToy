import { mat4 } from "gl-matrix";
import { PerspectiveCamera } from "./PerspectiveCamera";

export class CubeCamera extends PerspectiveCamera {

    private _projectionMatrices: mat4[];

    public constructor() {
        super();
        this._projectionMatrices = [0, 0, 0, 0, 0, 0].map(() => mat4.create());
    }

    public compuseProjectionMatrix() {
        for (const mat of this._projectionMatrices) {
            mat4.perspective(
                mat,
                this._fovy,
                this._aspect,
                this._near,
                this._far,
            );
        }
    }

    public deCompuseProjectionMatrix() {
        // TODO: decompuse cube camera
    }
}
