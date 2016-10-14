/// <reference path="./Camera.ts"/>

namespace CanvasToy {

    export class PerspectiveCamera extends Camera {
        public aspect: number;
        public fovy: number;
        public near: number;
        public far: number;
        constructor(
            aspect: number = 1,
            fovy: number = 45,
            near: number = 0.01,
            far: number = 10000
        ) {
            super();
            this.aspect = aspect;
            this.fovy = fovy;
            this.near = near;
            this.far = far;
        }

        public genOtherMatrixs() {
            super.genOtherMatrixs();
            this.projectionMatrix = mat4.perspective(mat4.create(), this.fovy, this.aspect, this.near, this.far);
        }

        public adaptTargetRadio(target: { width: number, height: number }) {
            this.aspect = target.width / target.height;
            this.genOtherMatrixs();
        }
    }
}
