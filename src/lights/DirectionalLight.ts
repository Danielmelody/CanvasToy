import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { OrthoCamera } from "../cameras/OrthoCamera";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { Geometry } from "../geometries/Geometry";
import { SphereGeometry } from "../geometries/SphereGeometry";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { Object3d } from "../Object3d";
import { Texture } from "../textures/Texture";
import { Light } from "./Light";
import { ShadowType } from "./ShadowType";

export class DirectionalLight extends Light {

    @uniform("direction", DataType.vec3, (light: DirectionalLight, camera: Camera) => {
        const lookDirWorld = vec3.fromValues(
            -light.projectCamera.worldToObjectMatrix[2],
            -light.projectCamera.worldToObjectMatrix[6],
            -light.projectCamera.worldToObjectMatrix[10],
        );
        const cameraRatation = mat4.getRotation(quat.create(), camera.worldToObjectMatrix);
        const lookDirView = vec3.transformQuat(vec3.create(), lookDirWorld, cameraRatation);
        return lookDirView;
    })
    protected _direction: vec3 = vec3.fromValues(0, 0, -1);

    constructor(gl: WebGLRenderingContext) {
        super(gl);
    }

    public get typename(): string {
        return "DirectionalLight";
    }

    public get direction(): vec3 {
        return vec3.transformQuat(vec3.create(), this._direction,
            mat4.getRotation(quat.create(), this.matrix),
        );
    }

    public getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D {
        return {
            left: -1,
            right: 1,
            top: 1,
            bottom: -1,
        };
    }

    public setDirection(_direction: vec3) {
        const lookPoint = vec3.add(vec3.create(), this.position, _direction);
        this._projectCamera.lookAt(lookPoint);
        return this;
    }

    protected setUpProjectionCamera() {
        this._projectCamera = new OrthoCamera()
            .setParent(this)
            .setLocalPosition(vec3.create())
            .adaptTargetRadio({ width: 10, height: 10 })
            .setFar(100);
    }
}
