/// <reference path="./CanvasToy.ts"/>
/// <reference path="./Decorators.ts"/>
/// <reference path="render/Program.ts" />

namespace CanvasToy {

    /**
     * class Object3d
     * @descripton the base class of transform object
     */
    export class Object3d {

        public tag: string;

        public scene: Scene;

        public children: Object3d[] = [];

        public depredations: string[];

        public objectToWorldMatrix: Mat4Array = mat4.create();

        // @uniform("modelViewProjectionMatrix", DataType.mat4, (mesh: Object3d, camera: Camera) => {
        //     return mat4.multiply(
        //         mat4.create(),
        //         camera.projectionMatrix,
        //         mat4.multiply(mat4.create(),
        //             camera.objectToWorldMatrix,
        //             mesh.matrix),
        //     );
        // })
        protected _matrix: Mat4Array = mat4.create();

        protected _parent: Object3d = null;

        protected _localMatrix: Mat4Array = mat4.create();

        protected _localPosition: Vec3Array = vec3.create();
        protected _localRotation: QuatArray = quat.create();
        protected _localScaling: Vec3Array = vec3.fromValues(1, 1, 1);

        protected _position: Vec3Array = vec3.create();
        protected _scaling: Vec3Array = vec3.fromValues(1, 1, 1);
        protected _rotation: QuatArray = quat.create();

        protected updateEvents: Function[] = [];
        protected startEvents: Function[] = [];

        /**
         * Create a Object3d instance
         * @param  {string} tag tag of this object
         * @return {[type]}     [description]
         */
        constructor(tag?: string) {
            this.tag = tag;
            this.handleUniformProperty();
        }

        /**
         * Get transform parent of this object
         * @return {Object3d} [description]
         */
        public get parent(): Object3d {
            return this._parent;
        }

        /**
         * Set transform parent of this object, will also add this to parent‘s children list automatically
         * @param  {Object3d} _parent
         */
        public setParent(_parent: Object3d) {
            _parent.children.push(this);
            this._parent = _parent;
            return this;
        }

        /**
         * Get local matrix
         */
        public get localMatrix(): Mat4Array {
            return this._localMatrix;
        }

        /**
         * Get global matrix
         */
        public get matrix(): Mat4Array {
            return this._matrix;
        }

        /**
         * Get local position
         * @return {Vec3Array} [description]
         */
        public get localPosition(): Vec3Array {
            return this._localPosition;
        }

        /**
         * Set position locally
         * @param  {Vec3Array} _localPosition
         */
        public setLocalPosition(_localPosition: Vec3Array) {
            console.assert(_localPosition && _localPosition.length === 3, "invalid object position paramter");
            this._localPosition = _localPosition;
            this.composeFromLocalMatrix();
            if (!!this._parent) {
                mat4.getTranslation(this._position, this.matrix);
            } else {
                this._position = vec3.clone(_localPosition);
            }
            this.applyToChildren();
            return this;
        }

        /**
         * Get global position
         */
        public get position(): Vec3Array {
            return this._position;
        }

        /**
         * set position globally
         * @param  {Vec3Array} _position
         */
        public setPosition(_position: Vec3Array) {
            console.assert(_position && _position.length === 3, "invalid object position paramter");
            this._position = _position;
            this.composeFromGlobalMatrix();
            if (!!this._parent) {
                mat4.getTranslation(this._localPosition, this._localMatrix);
            } else {
                this._localPosition = vec3.clone(_position);
            }
            this.applyToChildren();
            return this;
        }

        /**
         * Set the rotation globally
         * @param  {QuatArray} _rotation
         */
        public get localRotation(): QuatArray {
            return this._localRotation;
        }

        /**
         * Set the rotation locally
         * @param  {QuatArray} _rotation
         */
        public setLocalRotation(_localRotation: QuatArray) {
            console.assert(_localRotation && _localRotation.length === 4, "invalid object rotation paramter");
            quat.normalize(_localRotation, quat.clone(_localRotation));
            this._localRotation = _localRotation;
            this.composeFromLocalMatrix();
            if (!!this._parent) {
                mat4.getRotation(this._rotation, this.matrix);
            } else {
                this._rotation = quat.clone(_localRotation);
            }
            this.applyToChildren();
            return this;
        }

        public get rotation(): QuatArray {
            return this._rotation;
        }

        /**
         * Set the rotation globally
         * @param  {QuatArray} _rotation
         */
        public setRotation(_rotation: QuatArray) {
            console.assert(_rotation && _rotation.length === 4, "invalid object rotation paramter");
            quat.normalize(_rotation, quat.clone(_rotation));
            this._rotation = _rotation;
            this.composeFromGlobalMatrix();
            if (!!this._parent) {
                mat4.getRotation(this._localRotation, this.localMatrix);
            } else {
                this._localRotation = quat.clone(_rotation);
            }
            this.applyToChildren();
            return this;
        }

        /**
         * Get local scaling factor
         * @return {Vec3Array} the local scaling factor
         */
        public get localScaling(): Vec3Array {
            return this._localScaling;
        }

        /**
         * Set scaling locally
         * @param  {Vec3Array} _localScaling expected local scaling factor
         */
        public setLocalScaling(_localScaling: Vec3Array) {
            console.assert(_localScaling && _localScaling.length === 3, "invalid object scale paramter");
            this._localScaling = _localScaling;
            if (!!this._parent) {
                vec3.mul(this._scaling, this._parent.scaling, this._localScaling);
            } else {
                this._scaling = vec3.clone(_localScaling);
            }
            this.applyToChildren();
            return this;
        }

        /**
         * Get global scaling factor.
         * @return {Vec3Array} the global scaling factor
         */
        public get scaling(): Vec3Array {
            return this._scaling;
        }

        /**
         * Set scaling factor globally.
         * @param  {Vec3Array} _scaling the given scaling factor
         */
        public setScaling(_scaling: Vec3Array) {
            console.assert(_scaling && _scaling.length === 3, "invalid object scale paramter");
            this._scaling = _scaling;
            if (!!this._parent) {
                vec3.div(this.localScaling, this.scaling, this._parent.scaling);
            } else {
                this._localScaling = vec3.clone(_scaling);
            }
            this.applyToChildren();
            return this;
        }

        /**
         * Reset all global transforms { position, rotation, scaling, objectToWorldMatrix }
         * by parent, but keep all local transforms the same before called.
         */
        public setTransformFromParent() {
            if (!!this.parent) {
                this._matrix = mat4.mul(mat4.create(), this.parent.matrix, this.localMatrix);
                this.genOtherMatrixs();
                mat4.getTranslation(this._position, this.matrix);
                mat4.getRotation(this._rotation, this.matrix);
                vec3.mul(this.scaling, this.parent.scaling, this.localScaling);
            }
            return this;
        }

        /**
         * Add on update function, which will be called at update time;
         * @param  {Function} updateFunction
         */
        public registUpdate(updateFunction: Function) {
            this.updateEvents.push(updateFunction);
            return this;
        }

        /**
         * Add on start function, which will be called at start time;
         * @param  {Function} updateFunction
         */
        public registStart(updateFunction: Function) {
            this.startEvents.push(updateFunction);
            return this;
        }

        /**
         * Start Animating object by keep calling update per frame
         */
        public start() {
            for (const event of this.startEvents) {
                event();
            }
        }

        /**
         * Update object status after next delta time
         * @param  {number} dt delta time
         */
        public update(dt: number) {
            for (const event of this.updateEvents) {
                event(dt);
            }
            for (const child of this.children) {
                child.update(dt);
            }
        }

        /**
         * Translate object by the given vector
         * @param  {Vec3Array} delta vector to translate by
         */
        public translate(delta: Vec3Array) {
            console.assert(delta instanceof Array && delta.length === 3, "invalid delta translate");
            this._localPosition = vec3.add(this.localPosition, vec3.clone(this.localPosition), delta);
        }

        /**
         * Rotates specific angle about X axis
         * @param  {number} angle angle (in radians) to rotate
         */
        public rotateX(angle: number) {
            this.setLocalRotation(quat.rotateX(this.localRotation, quat.clone(this.localRotation), angle));
            return this;
        }

        /**
         * Rotates specific angle about Y axis
         * @param  {number} angle angle (in radians) to rotate
         */
        public rotateY(angle: number) {
            this.setLocalRotation(quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle));
            return this;
        }

        /**
         * Rotates specific angle about Z axis
         * @param  {number} angle angle (in radians) to rotate
         */
        public rotateZ(angle: number) {
            this.setLocalRotation(quat.rotateZ(this.localRotation, quat.clone(this.localRotation), angle));
            return this;
        }

        public handleUniformProperty() {
            // console.warn(this);
            // this.uniforms.forEach((uniform) => {
            //     console.warn("handle uniform " + uniform.name);
            // });
        }

        protected genOtherMatrixs() {
            mat4.invert(this.objectToWorldMatrix, this.matrix);
        }

        private composeFromLocalMatrix() {
            mat4.fromRotationTranslationScale(
                this.localMatrix,
                this.localRotation,
                this.localPosition,
                this.localScaling,
            );
            if (!!this._parent) {
                mat4.mul(this._matrix, this._parent.matrix, this.localMatrix);
            } else {
                this._matrix = mat4.clone(this._localMatrix);
            }
            this.genOtherMatrixs();
        }

        private composeFromGlobalMatrix() {
            mat4.fromRotationTranslationScale(
                this._matrix,
                this.rotation,
                this.position,
                this.scaling,
            );
            this.genOtherMatrixs();
            if (!!this._parent) {
                mat4.mul(this._localMatrix, this._parent.objectToWorldMatrix, this.matrix);
            } else {
                this._localMatrix = mat4.clone(this._matrix);
            }
        }

        private applyToChildren() {
            for (const child of this.children) {
                child.setTransformFromParent();
            }
        }
    }
}
