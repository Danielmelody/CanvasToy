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
            this.projectionMatrix = mat4.perspective(mat4.create(), this.fovy, this.aspect, this.near, this.far);
        }

        public adaptCanvas(canvas: HTMLCanvasElement) {
            
        }

    }
}
