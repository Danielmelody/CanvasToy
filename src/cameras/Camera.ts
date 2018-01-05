import { mat4, vec2, vec3 } from "gl-matrix";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { Object3d } from "../Object3d";

export enum CameraDirection {
    forward,
    bakc,
    left,
    right,
}

export abstract class Camera extends Object3d {

    protected _upVector: vec3 = vec3.fromValues(0, 1, 0);
    protected _centerVector: vec3 = vec3.fromValues(0, 0, -1);
    protected _rightVector: vec3 = vec3.fromValues(1, 0, 0);
    protected _projectionMatrix: mat4 = mat4.create();

    protected _near: number = 0.1;

    protected _far: number = 500;

    private _controlEnable: boolean = false;
    private _cameraPitch: number = 0.0;
    private _cameraYaw: number = -90.0;
    private _cameraSpeed: number = 2.5;

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

    public set controlEnable(enable: boolean) {
        this._controlEnable = enable;
    }
    public get controlEnable() {
        return this._controlEnable;
    }

    public changeDirectionByAngle(deltaAngle: vec2) {
        this._cameraYaw += deltaAngle[0];
        this._cameraPitch += deltaAngle[1];
        if (this._cameraPitch > 89.0) {
            this._cameraPitch = 89.0;
        }
        if (this._cameraPitch < -89.0) {
            this._cameraPitch = -89.0;
        }
        const newEyeVector= vec3.fromValues(
            Math.cos(this._cameraPitch * Math.PI / 180.0) * Math.cos(this._cameraYaw * Math.PI / 180.0),
            Math.sin(this._cameraPitch * Math.PI / 180.0),
            Math.cos(this._cameraPitch * Math.PI / 180.0) * Math.sin(this._cameraYaw * Math.PI / 180.0),
        );
        this._centerVector = newEyeVector;
        super.lookAt(newEyeVector);
    }

    public abstract changeZoom(offset: number);

    public genOtherMatrixs() {
        super.genOtherMatrixs();
        this.compuseProjectionMatrix();
    }

    public abstract compuseProjectionMatrix();

    public abstract deCompuseProjectionMatrix();

    public abstract setAspectRadio(radio: number): Camera;
}
