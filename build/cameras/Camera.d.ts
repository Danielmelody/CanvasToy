import { mat4, vec2, vec3 } from "gl-matrix";
import { Object3d } from "../Object3d";
export declare enum CameraDirection {
    forward = 0,
    bakc = 1,
    left = 2,
    right = 3
}
export declare abstract class Camera extends Object3d {
    protected _upVector: vec3;
    protected _centerVector: vec3;
    protected _rightVector: vec3;
    protected _projectionMatrix: mat4;
    protected _near: number;
    protected _far: number;
    private _controlEnable;
    private _cameraPitch;
    private _cameraYaw;
    private _cameraSpeed;
    constructor();
    get position(): vec3;
    get near(): number;
    get far(): number;
    get eyeVector(): vec3;
    get upVector(): vec3;
    get centerVector(): vec3;
    get rightVector(): vec3;
    get projectionMatrix(): mat4;
    setNear(near: number): this;
    setFar(far: number): this;
    set controlEnable(enable: boolean);
    get controlEnable(): boolean;
    changeDirectionByAngle(deltaAngle: vec2): void;
    abstract changeZoom(offset: number): any;
    genOtherMatrixs(): void;
    abstract compuseProjectionMatrix(): any;
    abstract deCompuseProjectionMatrix(): any;
    abstract setAspectRadio(radio: number): Camera;
}
