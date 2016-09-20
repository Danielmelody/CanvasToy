/// <reference path="./Camera.ts"/>

module CanvasToy {
    export class PerspectiveCamera extends Camera {
        constructor(
            public aspect: number = 1,
            public fovy: number = 45,
            public near: number = 0.01,
            public far: number = 10000
        ) {
            super();
            this.apply();
        }

        public apply() {
            super.apply();
            this.projectionMatrix = mat4.perspective(mat4.create(), this.fovy, this.aspect, this.near, this.far);
        }

        public adaptTargetRadio(target: { width: number, height: number }) {
            this.aspect = target.width / target.height;
            this.apply();
        }
    }
}
