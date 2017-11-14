import { mat4, vec3 } from "gl-matrix";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { Object3d } from "../Object3d";

export abstract class Camera extends Object3d {

    protected _upVector: vec3 = vec3.fromValues(0, 1, 0);
    protected _centerVector: vec3 = vec3.fromValues(0, 0, -1);
    protected _rightVector: vec3 = vec3.fromValues(1, 0, 0);
    protected _projectionMatrix: mat4 = mat4.create();

    protected _near: number = 0.1;

    protected _far: number = 500;

    constructor() {
        super();
    }

    @uniform(DataType.vec3, "cameraPos")
    public get position() {
        return this._position;
    }

    @uniform(DataType.float, "cameraNear")
    public get near() {
        return this._near;
    }

    @uniform(DataType.float, "cameraFar")
    public get far() {
        return this._far;
    }

    public get eyeVector() {
        return vec3.clone(this._centerVector);
    }

    public get upVector() {
        return vec3.clone(this._upVector);
    }

    public get centerVector() {
        return vec3.clone(this._centerVector);
    }

    public get rightVector() {
        return vec3.clone(this._rightVector);
    }

    public get projectionMatrix() {
        return this._projectionMatrix;
    }

    public lookAt(center: vec3) {
        super.lookAt(center);
        this._centerVector = center;
        vec3.cross(this._rightVector, [0, 1, 0], center);
        return this;
    }

    public setNear(near: number) {
        if (near !== this._near) {
            this._near = near;
            this.compuseProjectionMatrix();
        }
        return this;
    }

    public setFar(far: number) {
        if (far !== this._far) {
            this._far = far;
            this.compuseProjectionMatrix();
        }
        return this;
    }

    public genOtherMatrixs() {
        super.genOtherMatrixs();
        this.compuseProjectionMatrix();
    }

    public abstract compuseProjectionMatrix();

    public abstract deCompuseProjectionMatrix();

    public abstract setAspectRadio(radio: number): Camera;
}
