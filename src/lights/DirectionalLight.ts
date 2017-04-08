/// <reference path="./Light.ts"/>

namespace CanvasToy {
    export class DirectionalLight extends Light {

        @uniform("direction", DataType.vec3)
        protected _direction: Vec3Array = vec3.fromValues(1, 1, 1);

        constructor(gl: WebGLRenderingContext) {
            super(gl);
            this._projectCamera = new OrthoCamera();
            this._projectCamera.setParent(this);
            this._projectCamera.setLocalPosition([0, 0, 0]);
            this._projectCamera.setFar(1000);
        }

        public get typename(): string {
            return "DirectionalLight";
        }

        public get direction(): Vec3Array {
            return this._direction;
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
            vec3.normalize(this._direction, _direction);
            return this;
        }

        protected setUpProjectionCamera() {
            this._projectCamera = new OrthoCamera()
                .setParent(this)
                .setLocalPosition([0, 0, 0])
                .adaptTargetRadio({width: 1024, height: 1024});
        }
    }
}
