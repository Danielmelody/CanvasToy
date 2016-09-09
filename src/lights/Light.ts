/// <reference path="../CanvasToy.ts"/>

module CanvasToy {
    export abstract class Light extends Object3d {
        public diffuse: Vec3Array = vec3.fromValues(1.0, 1.0, 1.0);
        public specular: Vec3Array = vec3.fromValues(1.0, 1.0, 1.0);
        public idensity = 1.0;
        public uniformLocation;
        constructor() {
            super();
        }
    }
}
