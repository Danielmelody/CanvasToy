/// <reference path="./Camera.ts"/>

namespace CanvasToy {

    export class PerspectiveCamera extends Camera {
        protected _aspect: number = 1;
        protected _fovy: number = 45;
        protected _near: number = 0.01;
        protected _far: number = 10000;
        constructor(parameter: {
            aspect: number,
            fovy: number,
            near: number,
            far: number,
        }) {
            super();
            this._aspect = parameter.aspect;
            this._fovy = parameter.fovy;
            this._near = parameter.near;
            this._far = parameter.far;
        }

        public compuseProjectionMatrix() {
            mat4.perspective(
                mat4.create(),
                this.fovy,
                this.aspect,
                this.near,
                this.far,
            );
        }

        public get aspect() {
            return this._aspect;
        }

        public get fovy() {
            return this._fovy;
        }

        public get near() {
            return this._near;
        }

        public get far() {
            return this._far;
        }

        public deCompuseProjectionMatrix() {
            // TODO: decompuse perspective camera
        }

        public genOtherMatrixs() {
            super.genOtherMatrixs();
            this._projectionMatrix = mat4.perspective(mat4.create(), this.fovy, this.aspect, this.near, this.far);
        }

        public adaptTargetRadio(target: { width: number, height: number }) {
            this._aspect = target.width / target.height;
            this.genOtherMatrixs();
        }
    }
}
