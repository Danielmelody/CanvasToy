/// <reference path="./CanvasToy.ts"/>

namespace CanvasToy {

    export class Object3d {

        public tag: string;

        public scene: Scene;

        public children: Array<Object3d> = [];

        public parent: Object3d = null;

        public objectToWorldMatrix: Mat4Array = mat4.create();

        protected _localMatrix: Mat4Array = mat4.create();
        protected _matrix: Mat4Array = mat4.create();

        protected _localPosition: Vec3Array = vec3.create();
        protected _localRotation: QuatArray = quat.create();
        protected _localScale: Vec3Array = vec3.fromValues(1, 1, 1);

        protected _position: Vec3Array = vec3.create();
        protected _scale: Vec3Array = vec3.fromValues(1, 1, 1);
        protected _rotation: QuatArray = quat.create();

        protected updateEvents: Array<Function> = [];
        protected startEvents: Array<Function> = [];

        constructor(tag?: string) {
            this.tag = tag;
        }

        public get localMatrix(): Mat4Array {
            return this._localMatrix;
        }

        public get matrix(): Mat4Array {
            return this._matrix;
        }

        public set matrix(_matrix: Mat4Array) {
            this._matrix = _matrix;
            this.genOtherMatrixs();
        }

        public get localPosition(): Vec3Array {
            return this._localPosition;
        }
        public set localPosition(_localPosition: Vec3Array) {
            console.assert(_localPosition && _localPosition.length === 3, "invalid object position paramter");
            this._localPosition = _localPosition;
            this.composeFromLocalMatrix();
            if (!!this.parent) {
                mat4.getTranslation(this._position, this.matrix);
            } else {
                this._position = vec3.clone(_localPosition);
            }
            this.applyToChildren();
        }

        public get position(): Vec3Array {
            return this._position;
        }
        public set position(_position: Vec3Array) {
            console.assert(_position && _position.length === 3, "invalid object position paramter");
            this._position = _position;
            this.composeFromGlobalMatrix();
            if (!!this.parent) {
                mat4.getTranslation(this._localPosition, this._localMatrix);
            } else {
                this._localPosition = vec3.clone(_position);
            }
            this.applyToChildren();
        }

        public get localRotation(): QuatArray {
            return this._localRotation;
        }
        public set localRotation(_localRotation: QuatArray) {
            console.assert(_localRotation && _localRotation.length === 4, "invalid object rotation paramter");
            quat.normalize(_localRotation, quat.clone(_localRotation));
            this._localRotation = _localRotation;
            this.composeFromLocalMatrix();
            if (!!this.parent) {
                mat4.getRotation(this._rotation, this.matrix);
            } else {
                this._rotation = quat.clone(_localRotation);
            }
            this.applyToChildren();
        }

        public get rotation(): QuatArray {
            return this._rotation;
        }
        public set rotation(_rotation: QuatArray) {
            console.assert(_rotation && _rotation.length === 4, "invalid object rotation paramter");
            quat.normalize(_rotation, quat.clone(_rotation));
            this._rotation = _rotation;
            this.composeFromGlobalMatrix();
            if (!!this.parent) {
                mat4.getRotation(this._localRotation, this.localMatrix);
            } else {
                this._localRotation = quat.clone(_rotation);
            }
            this.applyToChildren();
        }

        public get localScale(): Vec3Array {
            return this._localScale;
        }
        public set localScale(_localScale: Vec3Array) {
            console.assert(_localScale && _localScale.length === 3, "invalid object scale paramter");
            if (!!this.parent) {
                vec3.mul(this._scale, this.parent.scale, this._localScale);
            } else {
                this._scale = vec3.clone(_localScale);
            }
            this._localScale = _localScale;
        }

        public get scale(): Vec3Array {
            return this._scale;
        }
        public set scale(_scale: Vec3Array) {
            console.assert(_scale && _scale.length === 3, "invalid object scale paramter");
            this._scale = _scale;
        }

        public composeFromLocalMatrix() {
            mat4.fromRotationTranslationScale(
                this.localMatrix,
                this.localRotation,
                this.localPosition,
                this.localScale
            );
            if (!!this.parent) {
                this.matrix = mat4.mul(mat4.create(), this.parent.matrix, this.localMatrix);
            } else {
                this.matrix = mat4.clone(this._localMatrix);
            }
        }

        public composeFromGlobalMatrix() {
            this.matrix = mat4.fromRotationTranslationScale(
                mat4.create(),
                this.rotation,
                this.position,
                this.scale
            );
            if (!!this.parent) {
                mat4.mul(this.localMatrix, this.parent.objectToWorldMatrix, this.matrix);
            } else {
                this._localMatrix = mat4.clone(this._matrix);
            }
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
            this.localPosition = vec3.add(this.localPosition, vec3.clone(this.localPosition), delta);
        }

        public rotateX(angle: number) {
            this.localRotation = quat.rotateX(this.localRotation, quat.clone(this.localRotation), angle);
        }

        public rotateY(angle: number) {
            this.localRotation = quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle);
        }

        public rotateZ(angle: number) {
            this.localRotation = quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle);
        }

        protected genOtherMatrixs() {
            mat4.invert(this.objectToWorldMatrix, this.matrix);
        }

        private applyToChildren() {
            for (let child of this.children) {
                child.matrix = mat4.mul(mat4.create(), this.matrix, child.localMatrix);
                mat4.getTranslation(child._position, child.matrix);
                mat4.getRotation(child._rotation, child.matrix);
            }
        }
    }
}
