/// <reference path="./CanvasToy.ts"/>

namespace CanvasToy {

    export class Object3d {

        public name: string;

        public scene: Scene;

        public children: Array<Object3d> = [];

        public parent: Object3d = null;

        public objectToWorldMatrix: Mat4Array = mat4.create();

        public _localMatrix: Mat4Array = mat4.create();
        public get localMatrix(): Mat4Array {
            return this._localMatrix;
        }
        public set localMatrix(_localMatrix: Mat4Array) {
            this._localMatrix = _localMatrix;
        }

        protected _matrix: Mat4Array = mat4.create();
        public get matrix(): Mat4Array {
            return this._matrix;
        }
        public set matrix(_matrix: Mat4Array) {
            this._matrix = _matrix;
            mat4.invert(this.objectToWorldMatrix, this.matrix);
            console.assert(!!this.objectToWorldMatrix, 'object matrix cannot invert');
        }

        protected _localPosition: Vec3Array = vec3.create();
        public get localPosition(): Vec3Array {
            return this._localPosition;
        }
        public set localPosition(_localPosition: Vec3Array) {
            console.assert(_localPosition && _localPosition.length == 3, "invalid object position paramter");
            let delta = vec4.sub(vec4.create(), _localPosition, this._localPosition)
            vec4.add(this._position, delta, vec4.clone(this._position));
            this._localPosition = _localPosition;
        }

        protected _position: Vec3Array = vec3.create();
        public get position(): Vec3Array {
            return this._position;
        }
        public set position(_position: Vec3Array) {
            console.assert(_position && _position.length == 3, "invalid object position paramter");
            let delta = vec4.sub(vec4.create(), _position, this._position)
            vec4.add(this._localPosition, delta, vec4.clone(this._localPosition));
            this._position = _position;
        }


        protected _localScale: Vec3Array = vec3.fromValues(1, 1, 1);
        public get localScale(): Vec3Array {
            return this._localScale;
        }
        public set localScale(_localScale: Vec3Array) {
            console.assert(_localScale && _localScale.length == 3, "invalid object scale paramter");
            this._localScale = _localScale;
        }

        protected _scale: Vec3Array = vec3.create();
        public get scale(): Vec3Array {
            return this._scale;
        }
        public set scale(_scale: Vec3Array) {
            console.assert(_scale && _scale.length == 3, "invalid object scale paramter");
            this._scale = _scale;
        }

        protected _localRotation: QuatArray = quat.create();
        public get localRotation(): QuatArray {
            return this._localRotation;
        }
        public set localRotation(_localRotation: QuatArray) {
            console.assert(_localRotation && _localRotation.length == 4, "invalid object rotation paramter");
            this._localRotation = _localRotation;
            quat.multiply(this._rotation, this._localRotation, this.parent.rotation);
        }

        protected _rotation: QuatArray = quat.create();
        public get rotation(): QuatArray {
            return this._rotation;
        }
        public set rotation(_rotation: QuatArray) {
            console.assert(_rotation && _rotation.length == 4, "invalid object rotation paramter");
            this._rotation = _rotation;
        }

        protected updateEvents: Array<Function> = [];

        protected startEvents: Array<Function> = [];

        constructor() {
            this.registUpdate(() => {
                this.apply();
            });
        }

        public apply() {
            mat4.fromRotationTranslationScale(
                this.localMatrix,
                this.localRotation,
                this.localPosition,
                this.localScale
            )
            let current: Object3d = this;
            this.matrix = mat4.clone(this.localMatrix);
            if (!!current.parent) {
                mat4.mul(this.matrix, current.parent.matrix, mat4.clone(this.localMatrix));
            }
        };

        public composeLocalMatrix() {
            mat4.fromRotationTranslationScale(
                this.localMatrix,
                this.localRotation,
                this.localPosition,
                this.localScale
            );
        }

        public composeGlobalMatrix() {
            mat4.fromRotationTranslationScale(
                this.matrix,
                this.rotation,
                this.position,
                this.scale
            );
        }

        public addChild(child: Object3d) {
            this.children.push(child);
            child.parent = this;
        }

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
            for (let child of this.children) {
                child.update(dt);
            }
        }

        public translate(delta: Vec3Array) {
            console.assert(delta instanceof Array && delta.length === 3, "invalid delta translate");
            vec3.add(this.localPosition, vec3.clone(this.localPosition), delta);
        }

        public rotateX(angle: number) {
            quat.rotateX(this.localRotation, quat.clone(this.localRotation), angle);
        }

        public rotateY(angle: number) {
            quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle);
        }

        public rotateZ(angle: number) {
            quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle);
        }
    }
}
