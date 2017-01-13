/// <reference path="../CanvasToy.ts"/>
/// <reference path="../textures/Texture.ts"/>

namespace CanvasToy {
    export abstract class Light extends Object3d {
        public diffuse: Vec3Array = vec3.fromValues(1, 1, 1);
        public specular: Vec3Array = vec3.fromValues(1, 1, 1);
        public idensity = 1.0;
        public shadowRtt: Texture;
        public projectCamera: Camera;
        constructor() {
            super();
        }
    }
}
