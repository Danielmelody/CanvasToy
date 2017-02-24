/// <reference path="../Object3d.ts"/>

namespace CanvasToy {
    export abstract class Camera extends Object3d {

        protected _upVector: Vec3Array = vec3.fromValues(0, 1, 0);
        protected _centerVector: Vec3Array = vec3.fromValues(0, 0, -1);
        protected _rightVector: Vec3Array = vec3.fromValues(1, 0, 0);
        protected _projectionMatrix: Mat4Array = mat4.create();

        constructor() {
            super();
        }

        public get eyeVector() {
            return this._centerVector;
        }

        public get upVector() {
            return this._upVector;
        }

        public get centerVector() {
            return this._centerVector;
        }

        public get rightVector() {
            return this._rightVector;
        }

        public get projectionMatrix() {
            return this._projectionMatrix;
        }

        public lookAt(eye: Vec3Array, center: Vec3Array, up: Vec3Array) {
            this.setPosition(eye);
            this._centerVector = center;
            this._upVector = up;
            vec3.cross(this._rightVector, up, center);
            mat4.lookAt(this._worldToObjectMatrix, eye, center, up);
            this.setWorldToObjectMatrix(this._worldToObjectMatrix);
            return this;
        }

        public setProjectionMatrix(projectionMatrix: Mat4Array) {
            this._projectionMatrix = projectionMatrix;
            return this;
        }

        public abstract compuseProjectionMatrix();

        public abstract deCompuseProjectionMatrix();

        public abstract adaptTargetRadio(target: { width: number, height: number });
    }
}
