import { mat4, vec3 } from "gl-matrix";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { Object3d } from "../Object3d";

export abstract class Camera extends Object3d {

    protected _upVector: vec3 = vec3.fromValues(0, 1, 0);
    protected _centerVector: vec3 = vec3.fromValues(0, 0, -1);
    protected _rightVector: vec3 = vec3.fromValues(1, 0, 0);
    protected _projectionMatrix: mat4 = mat4.create();

    @uniform("cameraNear", DataType.float)
    protected _near: number = 0.1;

    @uniform("cameraFar", DataType.float)
    protected _far: number = 1000;

    constructor() {
        super();
    }

    public get near() {
        return this._near;
    }

    public get far() {
        return this._far;
    }

    public get eyeVector() {
        return this._centerVector;
    }

    public get upVector() {
        return this._upVector;
    }

    public get centerVector() {
        return this._centerVector;
    }

    public get rightVector() {
        return this._rightVector;
    }

    public get projectionMatrix() {
        return this._projectionMatrix;
    }

    public lookAt(center: vec3) {
        this._centerVector = center;
        vec3.cross(this._rightVector, [0, 1, 0], center);
        mat4.lookAt(this._worldToObjectMatrix, this.position, center, [0, 1, 0]);
        this.setWorldToObjectMatrix(this._worldToObjectMatrix);
        return this;
    }

    public setProjectionMatrix(projectionMatrix: mat4) {
        this._projectionMatrix = projectionMatrix;
        return this;
    }

    public setNear(near: number) {
        if (near !== this._near) {
            this.compuseProjectionMatrix();
            this._near = near;
        }
        return this;
    }

    public setFar(far: number) {
        if (far !== this._far) {
            this.compuseProjectionMatrix();
            this._far = far;
        }
        return this;
    }

    public abstract compuseProjectionMatrix();

    public abstract deCompuseProjectionMatrix();

    public abstract adaptTargetRadio(target: { width: number, height: number }): Camera;
}
