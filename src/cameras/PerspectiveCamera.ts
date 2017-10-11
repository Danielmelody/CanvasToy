import { mat4 } from "gl-matrix";
import { Camera } from "./Camera";
export class PerspectiveCamera extends Camera {
    protected _aspect: number = 1;
    protected _fovy: number = Math.PI / 4;
    constructor(parameter: {
        aspect?: number,
        fovy?: number,
        near?: number,
        far?: number,
    } = {}) {
        super();
        this._aspect = parameter.aspect || this._aspect;
        this._fovy = parameter.fovy || this._fovy;
        this._near = parameter.near || this._near;
        this._far = parameter.far || this._far;
    }

    public compuseProjectionMatrix() {
        mat4.perspective(
            this._projectionMatrix,
            this._fovy,
            this._aspect,
            this._near,
            this._far,
        );
    }

    public get aspect() {
        return this._aspect;
    }

    public get fovy() {
        return this._fovy;
    }

    public setAspect(aspect: number) {
        if (aspect !== this._aspect) {
            this._aspect = aspect;
            this.compuseProjectionMatrix();
        }
        return this;
    }

    public setFovy(fovy: number) {
        if (fovy !== this._fovy) {
            this._fovy = fovy;
            this.compuseProjectionMatrix();
        }
        return this;
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
        return this;
    }
}
