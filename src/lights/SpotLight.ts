import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { PerspectiveCamera } from "../cameras/PerspectiveCamera";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { Geometry } from "../geometries/Geometry";
import { SphereGeometry } from "../geometries/SphereGeometry";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { Object3d } from "../Object3d";
import { Texture } from "../textures/Texture";
import { PointLight } from "./PointLight";
import { ShadowType } from "./ShadowType";

export class SpotLight extends PointLight {

    @uniform("coneAngleCos", DataType.float)
    protected _coneAngleCos: number;

    @uniform("spotDir", DataType.vec3, (light: SpotLight, camera: Camera) =>
        vec3.transformQuat(vec3.create(), light._spotDirection,
            mat4.getRotation(
                quat.create(),
                mat4.multiply(mat4.create(), camera.worldToObjectMatrix, light.matrix),
            ),
        ))
    protected _spotDirection: vec3 = vec3.fromValues(0, 0, -1);

    protected _coneAngle: number;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
        this.setConeAngle(Math.PI / 4);
        this.setRadius(100);
        this._shadowType = ShadowType.Hard;
    }

    public get typename(): string {
        return "SpotLight";
    }

    public get coneAngle() {
        return this._coneAngle;
    }

    public get spotDirection() {
        return vec3.transformQuat(vec3.create(), this._spotDirection,
            mat4.getRotation(quat.create(), this.matrix),
        );
    }

    public setRadius(radius: number) {
        super.setRadius(radius);
        this._projectCamera.setFar(radius);
        return this;
    }

    public setConeAngle(coneAngle: number) {
        this._coneAngle = coneAngle;
        this._coneAngleCos = Math.cos(coneAngle);
        (this._projectCamera as PerspectiveCamera).setFovy(coneAngle * 2);
        return this;
    }

    public setSpotDirection(spotDirection: vec3) {
        const lookPoint = vec3.add(vec3.create(), this.position, spotDirection);
        this._projectCamera.lookAt(lookPoint);
        return this;
    }

    public getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D {
        // TODO: implements bounding box for spot light.
        console.error("function getProjecttionBoundingBox2D has not been init");
        return {
            left: -1,
            right: 1,
            top: 1,
            bottom: -1,
        };
    }

    protected setUpProjectionCamera() {
        this._projectCamera = new PerspectiveCamera()
            .setParent(this)
            .setLocalPosition(vec3.fromValues(0, 0, 0))
            .adaptTargetRadio({ width: 1024, height: 1024 });
    }

}
