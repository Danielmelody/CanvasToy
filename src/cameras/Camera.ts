/// <reference path="../Object3d.ts"/>

namespace CanvasToy {
    export abstract class Camera extends Object3d {
        public projectionMatrix: Mat4Array = mat4.create();

        constructor() {
            super();
        }
        public apply() {
            super.apply();
        }
        public abstract adaptTargetRadio(target: { width: number, height: number });
    }
}
