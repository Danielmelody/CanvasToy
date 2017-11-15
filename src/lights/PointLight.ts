import { mat4, vec3 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";

import { SphereGeometry } from "../geometries/SphereGeometry";
import { BoundingBox2D } from "../Intersections/BoundingBox";

import { Renderer } from "../renderer/Renderer";

import { CubeCamera } from "../cameras/CubeCamera";
import { Light } from "./Light";
import { ShadowType } from "./ShadowType";

export class PointLight extends Light {

    @uniform(DataType.vec3)
    public get position() {
        return this._position;
    }

    protected _radius: number = 100;

    protected _squareAttenuation: number = 0.01;

    protected _linearAttenuation: number = 0.1;

    protected _constantAttenuation: number = 1;

    protected _pcssArea: number = 0.1;

    constructor(renderer: Renderer) {
        super(renderer);
        this.volume = new SphereGeometry(renderer.gl).setRadius(this._radius).build();

        // TODO: remove temporary diasable shadow of point light;
        this._shadowType = ShadowType.None;
    }

    @uniform(DataType.float, "squareAtten")
    public get squareAttenuation() {
        return this._squareAttenuation;
    }
    @uniform(DataType.float, "linearAtten")
    public get linearAttenuation() {
        return this._squareAttenuation;
    }

    @uniform(DataType.float, "constantAtten")
    public get constantAttenuation() {
        return this._constantAttenuation;
    }

    @uniform(DataType.float)
    public get pcssArea() {
        return this._pcssArea;
    }

    public getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D {
        const viewMatrix = mat4.multiply(
            mat4.create(),
            camera.projectionMatrix,
            camera.worldToObjectMatrix,
        );
        const viewDir = vec3.sub(vec3.create(), this.position, camera.position);
        const upSide = vec3.normalize(vec3.create(), camera.upVector);
        const rightSide = vec3.create();
        vec3.cross(rightSide, upSide, viewDir);
        vec3.normalize(rightSide, rightSide);
        vec3.scale(upSide, upSide, this.radius);
        vec3.scale(rightSide, rightSide, this.radius);

        let lightUpPoint = vec3.add(vec3.create(), this.position, upSide);
        let lightRightPoint = vec3.add(vec3.create(), this.position, rightSide);
        const screenPos = vec3.transformMat4(vec3.create(), this._position, viewMatrix);

        lightUpPoint = vec3.transformMat4(vec3.create(), lightUpPoint, viewMatrix);
        lightRightPoint = vec3.transformMat4(vec3.create(), lightRightPoint, viewMatrix);
        const screenH = Math.abs(vec3.len(vec3.sub(vec3.create(), lightUpPoint, screenPos)));
        const screenW = Math.abs(vec3.len(vec3.sub(vec3.create(), lightRightPoint, screenPos)));
        return {
            left: screenPos[0] - screenW,
            right: screenPos[0] + screenW,
            top: -screenPos[1] + screenH,
            bottom: -screenPos[1] - screenH,
        };
    }

    public setRadius(radius: number) {
        this._radius = radius;
        (this.volume as SphereGeometry).setRadius(this._radius).build();
        return this;
    }

    public get typename(): string {
        return "PointLight";
    }

    public get radius() {
        return this._radius;
    }

    protected setUpProjectionCamera() {
        this._projectCamera = new CubeCamera()
            .setParent(this)
            .setLocalPosition(vec3.create())
            .setAspectRadio(1);
    }
}
