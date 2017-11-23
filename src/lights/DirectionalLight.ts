import { mat4, quat, vec3 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { OrthoCamera } from "../cameras/OrthoCamera";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";

import { BoundingBox2D } from "../Intersections/BoundingBox";

import { Renderer } from "../renderer/Renderer";

import { Light } from "./Light";

export class DirectionalLight extends Light {

    constructor(renderer: Renderer) {
        super(renderer);
        this.setShadowSize(1024);
    }

    @uniform(DataType.vec3)
    public get direction(): vec3 {
        return vec3.transformQuat(vec3.create(), vec3.fromValues(0, 0, -1),
            mat4.getRotation(quat.create(), this._matrix),
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
        const lookPoint = vec3.add(vec3.create(), this._position, _direction);
        this.lookAt(lookPoint);
        return this;
    }

    protected setUpProjectionCamera() {
        this._projectCamera = new OrthoCamera()
            .setParent(this)
            .setLocalPosition(vec3.create())
            .setAspectRadio(1);
    }
}
