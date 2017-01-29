/// <reference path="../Object3d.ts"/>

namespace CanvasToy {
    export abstract class Camera extends Object3d {

        public get projectionMatrix() {
            return this._projectionMatrix;
        }

        protected _projectionMatrix: Mat4Array = mat4.create();

        constructor() {
            super();
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
