/// <reference path="./Light.ts"/>

namespace CanvasToy {

    export class SpotLight extends PointLight {

        @uniform("coneAngleCos", DataType.float)
        protected _coneAngleCos: number;

        @uniform("spotDir", DataType.vec3)
        protected _spotDirection: Vec3Array = vec3.fromValues(0, 0, 1);

        protected _coneAngle: number;

        constructor(gl: WebGLRenderingContext) {
            super(gl);
            this.setConeAngle(Math.PI / 4);
        }

        public get typename(): string {
            return "SpotLight";
        }

        public get coneAngle() {
            return this._coneAngle;
        }

        public get spotDirection() {
            return this._spotDirection;
        }

        public setConeAngle(coneAngle: number) {
            this._coneAngle = coneAngle;
            this._coneAngleCos = Math.cos(coneAngle);
            return this;
        }

        public setSpotDirection(spotDirection: Vec3Array) {
            vec3.normalize(this._spotDirection, spotDirection);
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
    }
}
