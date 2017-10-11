import { mat4 } from "gl-matrix";
import { Camera } from "./Camera";

export class OrthoCamera extends Camera {

    protected _left: number = -20;
    protected _right: number = 20;
    protected _bottom: number = -20;
    protected _top: number = 20;
    protected _baseSize: number = 20;

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
        this._left = -this._baseSize;
        this._right = this._baseSize;
        this._top = radio * this._baseSize;
        this._bottom = -radio * this._baseSize;
        this.compuseProjectionMatrix();
        return this;
    }
}
