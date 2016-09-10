/// <reference path="./Camera.ts"/>

module CanvasToy {
    export class OrthoCamera extends Camera {
        constructor(
            public left: number = -1,
            public right: number = 1,
            public bottom: number = -1,
            public top: number = 1,
            public near: number = 0.001,
            public far: number = 10000
        ) {
            super();
            mat4.ortho(this.projectionMatrix, left, right, bottom, top, near, far);
        }

        public apply() {
            super.apply();
            mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far);
        }

        public adaptTargetRadio(target: {width: number, height: number}) {
            this.left = -target.width / 2;
            this.right = target.width / 2;
            this.top = target.height / 2;
            this.bottom = -target.height / 2;
        }
    }
}
