/// <reference path="./Light.ts"/>

namespace CanvasToy {
    class SpotLight extends Light {
        public coneAngle: number = 1;
        public direction: Vec3Array = vec3.fromValues(1, 1, 1);
        constructor() {
            super();
        }
    }
}
