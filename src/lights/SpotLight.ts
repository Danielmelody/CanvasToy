/// <reference path="./Light.ts"/>

namespace CanvasToy {

    class SpotLight extends Light {

        @uniform("coneAngle", DataType.float)
        protected _coneAngle: number = 1;

        @uniform("direction", DataType.vec3)
        protected _direction: Vec3Array = vec3.fromValues(1, 1, 1);
        constructor() {
            super();
        }

        public get coneAngle() {
            return this._coneAngle;
        }

        public get direction() {
            return this._direction;
        }

        public setConeAngle(coneAngle: number) {
            this._coneAngle = coneAngle;
            return this;
        }

        public getProjecttionBoundingBox(camera: Camera): BoundingBox {
            // TODO: implements bounding box for spot light.
            console.error("function getProjecttionBoundingBox has not been init");
            return {
                left: -1,
                right: 1,
                top: 1,
                bottom: -1,
            };
        }
    }
}
