/// <reference path="./Camera.ts"/>

module CanvasToy {
    export class OrthoCamera extends Camera {
        constructor(options?) {
            super();
            mat4.ortho(this.projectionMatrix, -1.0, 1.0, -1.0, 1.0, 0.1, 100);
        }
    }
}
