import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { PerspectiveCamera } from "../cameras/PerspectiveCamera";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { Geometry } from "../geometries/Geometry";
import { SphereGeometry } from "../geometries/SphereGeometry";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { Object3d } from "../Object3d";
import { Renderer } from "../renderer/Renderer";
import { Texture } from "../textures/Texture";
import { PointLight } from "./PointLight";
import { ShadowType } from "./ShadowType";

export class SpotLight extends PointLight {

    @uniform(DataType.float)
    protected get coneAngleCos(): number {
        return Math.cos(this._coneAngle);
    }

    protected _coneAngle: number;

    constructor(renderer: Renderer) {
        super(renderer);
        this.setConeAngle(Math.PI / 8);
        this.setRadius(100);
        this._shadowType = ShadowType.Soft;
    }

    public get typename(): string {
        return "SpotLight";
    }

    @uniform(DataType.vec3, "spotDir")
    public get spotDirection() {
        return vec3.transformQuat(vec3.create(), vec3.fromValues(0, 0, -1),
            mat4.getRotation(quat.create(), this._matrix),
        );
    }

    public get coneAngle() {
        return this._coneAngle;
    }

    public setRadius(radius: number) {
        super.setRadius(radius);
        // this._projectCamera.setFar(radius);
        return this;
    }

    public setConeAngle(coneAngle: number) {
        console.assert(coneAngle > 0, "coneAngle should greater than 0!");
        this._coneAngle = coneAngle;
        (this._projectCamera as PerspectiveCamera).setFovy(coneAngle * 2);
        return this;
    }

    public setSpotDirection(spotDirection: vec3) {
        const lookPoint = vec3.add(vec3.create(), this.position, spotDirection);
        this.lookAt(lookPoint);
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
            .setLocalPosition(vec3.create())
            .setAspectRadio(1);
    }

}
