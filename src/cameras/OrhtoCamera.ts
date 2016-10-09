/// <reference path="./Camera.ts"/>

namespace CanvasToy {

    export class OrthoCamera extends Camera {
        public left: number;
        public right: number;
        public bottom: number;
        public top: number;
        public near: number;
        public far: number;
        constructor(
            left: number = -1,
            right: number = 1,
            bottom: number = -1,
            top: number = 1,
            near: number = 0.001,
            far: number = 10000
        ) {
            super();
            this.left = left;
            this.right = right;
            this.bottom = bottom;
            this.top = top;
            this.near = near;
            this.far = far;
            mat4.ortho(this.projectionMatrix, left, right, bottom, top, near, far);
        }

        public apply() {
            super.apply();
            mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far);
        }

        public adaptTargetRadio(target: { width: number, height: number }) {
            this.left = -target.width / 2;
            this.right = target.width / 2;
            this.top = target.height / 2;
            this.bottom = -target.height / 2;
        }
    }
}
