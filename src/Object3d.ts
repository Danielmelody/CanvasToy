/// <reference path="./CanvasToy.ts"/>

module CanvasToy {

    export abstract class Object3d {

        public name: string;

        public scene: Scene;

        public localMatrix: Mat4Array = mat4.create();

        public matrix: Mat4Array = mat4.create();

        private _position: Vec4Array = vec4.create();
        get position(): Vec4Array {
            return this._position;
        }
        set position(_position: Vec4Array) {
            console.assert(_position && _position.length == 4, "invalid object position paramter");
            mat4.translate(this.localMatrix, mat4.create(), _position);
            this._position = _position;
        }

        private _localScale: Vec3Array = vec3.create();
        get localScale(): Vec3Array {
            return this._localScale;
        }
        set localScale(_localScale: Vec3Array) {
            console.assert(_localScale && _localScale.length == 3, "invalid object scale paramter");
            this.localMatrix = mat4.scale(mat4.create(), this.localMatrix, _localScale);
            this._localScale = _localScale;
        }

        private _rotation: Vec4Array = quat.create();
        get rotation(): Vec3Array {
            return this._rotation;
        }
        set rotation(_rotation: Vec4Array) {
            console.assert(_rotation && _rotation.length == 3, "invalid object rotation paramter");
            this._rotation = mat4.fromQuat(quat.create(), this._rotation);
            this._rotation = _rotation;
        }

        protected updateEvents: Array<Function> = [];

        protected startEvents: Array<Function> = [];

        constructor() {
            this.registUpdate(() => {
                this.apply();
            });
        }

        public abstract apply();

        public registUpdate(updateFunction: Function) {
            this.updateEvents.push(updateFunction);
        }

        public registStart(updateFunction: Function) {
            this.startEvents.push(updateFunction);
        }

        public start() {
            for (let event of this.startEvents) {
                event();
            }
        }

        public update(dt: number) {
            for (let event of this.updateEvents) {
                event(dt);
            }
        }

        public translate(deltaX: number, deltaY: number, deltaZ: number) {
            this.localMatrix = mat4.translate(mat4.create(), this.localMatrix, vec3.fromValues(deltaX, deltaY, deltaZ));
        }

        public rotateX(angle: number) {
            this.localMatrix = mat4.rotateX(mat4.create(), this.localMatrix, angle);
        }

        public rotateY(angle: number) {
            this.localMatrix = mat4.rotateY(mat4.create(), this.localMatrix, angle);
        }

        public rotateZ(angle: number) {
            this.localMatrix = mat4.rotateZ(mat4.create(), this.localMatrix, angle);
        }
    }
}
