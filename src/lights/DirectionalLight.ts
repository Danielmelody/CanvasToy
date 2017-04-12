/// <reference path="./Light.ts"/>

namespace CanvasToy {
    export class DirectionalLight extends Light {

        @uniform("direction", DataType.vec3, (light: DirectionalLight, camera: Camera) =>
            vec3.transformQuat(vec3.create(), light._direction,
                mat4.getRotation(
                    quat.create(),
                    mat4.multiply(mat4.create(), camera.worldToObjectMatrix, light.matrix),
                ),
            ))
        protected _direction: Vec3Array = vec3.fromValues(0, 0, -1);

        constructor(gl: WebGLRenderingContext) {
            super(gl);
            this._projectCamera = new OrthoCamera();
            this._projectCamera.setParent(this)
                .setLocalPosition([0, 0, 0])
                .setFar(100);
        }

        public get typename(): string {
            return "DirectionalLight";
        }

        public get direction(): Vec3Array {
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

        public setDirection(_direction: Vec3Array) {
            const lookPoint = vec3.add(vec3.create(), this.position, _direction);
            this._projectCamera.lookAt(lookPoint);
            return this;
        }

        protected setUpProjectionCamera() {
            this._projectCamera = new OrthoCamera()
                .setParent(this)
                .setLocalPosition([0, 0, 0])
                .adaptTargetRadio({ width: 10, height: 10 });
        }
    }
}
