/// <reference path="./Camera.ts"/>

namespace CanvasToy {

    export class OrthoCamera extends Camera {

        protected _left: number = -32;
        protected _right: number = 32;
        protected _bottom: number = -32;
        protected _top: number = 32;
        protected _baseSize: number = 32;

        constructor(parameters: {
            left?: number,
            right?: number,
            bottom?: number,
            top?: number,
            near?: number,
            far?: number,
        } = {}) {
            super();
            this._left = parameters.left || this._left;
            this._right = parameters.right || this._right;
            this._bottom = parameters.bottom || this._bottom;
            this._top = parameters.top || this._top;
            this._near = parameters.near || this._near;
            this._far = parameters.far || this._far;
            mat4.ortho(
                this._projectionMatrix,
                this._left,
                this._right,
                this._bottom,
                this._top,
                this._near,
                this._far,
            );
        }

        public setLeft(left: number) {
            if (left !== this._left) {
                this._left = left;
                this.compuseProjectionMatrix();
            }
        }

        public get left() {
            return this._left;
        }

        public get right() {
            return this._right;
        }

        public get top() {
            return this._top;
        }

        public get bottom() {
            return this._bottom;
        }

        public compuseProjectionMatrix() {
            mat4.ortho(
                this._projectionMatrix,
                this._left,
                this._right,
                this._bottom,
                this._top,
                this._near,
                this._far,
            );
        }

        public deCompuseProjectionMatrix() {
            // TODO: de compute ortho camera
        }

        public genOtherMatrixs() {
            super.genOtherMatrixs();
            mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far);
        }

        public adaptTargetRadio(target: { width: number, height: number }) {
            const radio = target.height / target.width;
            this._left = -this._baseSize / 2;
            this._right = this._baseSize / 2;
            this._top = radio * this._baseSize / 2;
            this._bottom = -radio * this._baseSize / 2;
            this.compuseProjectionMatrix();
            return this;
        }
    }
}
