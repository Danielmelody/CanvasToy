/// <reference path="../CanvasToy.ts"/>

namespace CanvasToy {
    export abstract class Light extends Object3d {
        public diffuse: Vec3Array = vec3.fromValues(1, 1, 1);
        public specular: Vec3Array = vec3.fromValues(1, 1, 1);
        public idensity = 1.0;

        public paramterToWebgl = [
            this.diffuse
        ]

        constructor() {
            super();
        }
    }
}
