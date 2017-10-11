import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { Geometry } from "../geometries/Geometry";
import { SphereGeometry } from "../geometries/SphereGeometry";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { Object3d } from "../Object3d";
import { Renderer } from "../renderer/Renderer";
import { Texture } from "../textures/Texture";
import { Light } from "./Light";
import { ShadowType } from "./ShadowType";

export class PointLight extends Light {

    @uniform("position", DataType.vec3, (light, camera) => {
        return vec3.transformMat4(vec3.create(), light.position,
            mat4.mul(mat4.create(), camera.worldToObjectMatrix, light.matrix),
        );
    })
    protected _position: vec3 = vec3.create();

    @uniform("radius", DataType.float)
    protected _radius: number = 100;

    @uniform("squareAtten", DataType.float)
    protected _squareAttenuation: number = 0.01;

    @uniform("linearAtten", DataType.float)
    protected _linearAttenuation: number = 0.1;

    @uniform("constantAtten", DataType.float)
    protected _constantAttenuation: number = 1;

    constructor(renderer: Renderer) {
        super(renderer);
        this.volume = new SphereGeometry(renderer.gl).setRadius(this._radius).build();

        // TODO: remove temporary diasable shadow of point light;
        this._shadowType = ShadowType.None;
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
        // TODO: implement cube camera
    }
}
