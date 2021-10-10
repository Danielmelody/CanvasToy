import { mat4, quat, vec3 } from "gl-matrix";
var Object3d = (function () {
    function Object3d(tag) {
        this.children = [];
        this.depredations = [];
        this._worldToObjectMatrix = mat4.create();
        this._asyncFinished = Promise.resolve(this);
        this._matrix = mat4.create();
        this._parent = null;
        this._localMatrix = mat4.create();
        this._localPosition = vec3.create();
        this._localRotation = quat.create();
        this._localScaling = vec3.fromValues(1, 1, 1);
        this._position = vec3.create();
        this._scaling = vec3.fromValues(1, 1, 1);
        this._rotation = quat.create();
        this.tag = tag;
    }
    Object.defineProperty(Object3d.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: false,
        configurable: true
    });
    Object3d.prototype.setParent = function (_parent) {
        _parent.children.push(this);
        this._parent = _parent;
        return this;
    };
    Object.defineProperty(Object3d.prototype, "localMatrix", {
        get: function () {
            return this._localMatrix;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Object3d.prototype, "matrix", {
        get: function () {
            return this._matrix;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Object3d.prototype, "worldToObjectMatrix", {
        get: function () {
            return this._worldToObjectMatrix;
        },
        enumerable: false,
        configurable: true
    });
    Object3d.prototype.setWorldToObjectMatrix = function (worldToObjectMatrix) {
        this._worldToObjectMatrix = worldToObjectMatrix;
        mat4.invert(this._matrix, this._worldToObjectMatrix);
        this.deComposeGlobalMatrix();
        this.applyToChildren();
        return this;
    };
    Object.defineProperty(Object3d.prototype, "localPosition", {
        get: function () {
            return this._localPosition;
        },
        enumerable: false,
        configurable: true
    });
    Object3d.prototype.setLocalPosition = function (_localPosition) {
        console.assert(_localPosition && _localPosition.length === 3, "invalid object position paramter");
        this._localPosition = _localPosition;
        this.composeFromLocalTransform();
        if (!!this._parent) {
            mat4.getTranslation(this._position, this.matrix);
        }
        else {
            this._position = vec3.clone(_localPosition);
        }
        this.applyToChildren();
        return this;
    };
    Object.defineProperty(Object3d.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: false,
        configurable: true
    });
    Object3d.prototype.setPosition = function (_position) {
        console.assert(_position && _position.length === 3, "invalid object position paramter");
        this._position = _position;
        this.composeFromGlobalTransform();
        if (!!this._parent) {
            mat4.getTranslation(this._localPosition, this._localMatrix);
        }
        else {
            this._localPosition = vec3.clone(_position);
        }
        this.applyToChildren();
        return this;
    };
    Object.defineProperty(Object3d.prototype, "localRotation", {
        get: function () {
            return this._localRotation;
        },
        enumerable: false,
        configurable: true
    });
    Object3d.prototype.setLocalRotation = function (_localRotation) {
        console.assert(_localRotation && _localRotation.length === 4, "invalid object rotation paramter");
        quat.normalize(_localRotation, quat.clone(_localRotation));
        this._localRotation = _localRotation;
        this.composeFromLocalTransform();
        if (!!this._parent) {
            mat4.getRotation(this._rotation, this.matrix);
        }
        else {
            this._rotation = quat.clone(_localRotation);
        }
        this.applyToChildren();
        return this;
    };
    Object.defineProperty(Object3d.prototype, "rotation", {
        get: function () {
            return quat.clone(this._rotation);
        },
        enumerable: false,
        configurable: true
    });
    Object3d.prototype.setRotation = function (_rotation) {
        console.assert(_rotation && _rotation.length === 4, "invalid object rotation paramter");
        quat.normalize(_rotation, quat.clone(_rotation));
        this._rotation = _rotation;
        this.composeFromGlobalTransform();
        if (!!this._parent) {
            mat4.getRotation(this._localRotation, this.localMatrix);
        }
        else {
            this._localRotation = quat.clone(_rotation);
        }
        this.applyToChildren();
        return this;
    };
    Object.defineProperty(Object3d.prototype, "localScaling", {
        get: function () {
            return vec3.clone(this._localScaling);
        },
        enumerable: false,
        configurable: true
    });
    Object3d.prototype.setLocalScaling = function (_localScaling) {
        console.assert(_localScaling && _localScaling.length === 3, "invalid object scale paramter");
        this._localScaling = _localScaling;
        if (!!this._parent) {
            vec3.mul(this._scaling, this._parent.scaling, this._localScaling);
        }
        else {
            this._scaling = vec3.clone(_localScaling);
        }
        this.applyToChildren();
        return this;
    };
    Object.defineProperty(Object3d.prototype, "scaling", {
        get: function () {
            return vec3.clone(this._scaling);
        },
        enumerable: false,
        configurable: true
    });
    Object3d.prototype.setScaling = function (_scaling) {
        console.assert(_scaling && _scaling.length === 3, "invalid object scale paramter");
        this._scaling = _scaling;
        this.composeFromGlobalTransform();
        if (!!this._parent) {
            vec3.div(this._localScaling, this.scaling, this._parent.scaling);
        }
        else {
            this._localScaling = vec3.clone(_scaling);
        }
        this.applyToChildren();
        return this;
    };
    Object3d.prototype.setTransformFromParent = function () {
        if (!!this.parent) {
            this._matrix = mat4.mul(mat4.create(), this.parent.matrix, this.localMatrix);
            this.genOtherMatrixs();
            mat4.getTranslation(this._position, this.matrix);
            mat4.getRotation(this._rotation, this.matrix);
            vec3.mul(this.scaling, this.parent.scaling, this.localScaling);
        }
        return this;
    };
    Object3d.prototype.translate = function (delta) {
        console.assert(delta && delta.length === 3, "invalid delta translate");
        this.setPosition(vec3.add(this.position, vec3.clone(this.position), delta));
        return this;
    };
    Object3d.prototype.rotateX = function (angle) {
        this.setLocalRotation(quat.rotateX(this.localRotation, quat.clone(this.localRotation), angle));
        return this;
    };
    Object3d.prototype.rotateY = function (angle) {
        this.setLocalRotation(quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle));
        return this;
    };
    Object3d.prototype.rotateZ = function (angle) {
        this.setLocalRotation(quat.rotateZ(this.localRotation, quat.clone(this.localRotation), angle));
        return this;
    };
    Object3d.prototype.lookAt = function (center, up) {
        if (up === void 0) { up = vec3.fromValues(0, 1, 0); }
        mat4.lookAt(this._worldToObjectMatrix, this.position, center, up);
        this.setWorldToObjectMatrix(this._worldToObjectMatrix);
        return this;
    };
    Object3d.prototype.lookAtLocal = function (center, up) {
        if (up === void 0) { up = vec3.fromValues(0, 1, 0); }
        mat4.invert(this._localMatrix, mat4.lookAt(mat4.create(), this.localPosition, center, up));
        this.deComposeLocalMatrix();
        return this;
    };
    Object3d.prototype.asyncFinished = function () {
        return this._asyncFinished;
    };
    Object3d.prototype.setAsyncFinished = function (promise) {
        this._asyncFinished = promise;
    };
    Object3d.prototype.genOtherMatrixs = function () {
        mat4.invert(this._worldToObjectMatrix, this.matrix);
    };
    Object3d.prototype.deComposeLocalMatrix = function () {
        mat4.getTranslation(this._localPosition, this._localMatrix);
        mat4.getRotation(this._localRotation, this._localMatrix);
        if (!!this._parent) {
            mat4.mul(this._matrix, this._parent.matrix, this.localMatrix);
        }
        else {
            this._matrix = mat4.clone(this._localMatrix);
        }
        mat4.fromRotationTranslationScale(this._matrix, this.rotation, this.position, this.scaling);
    };
    Object3d.prototype.composeFromLocalTransform = function () {
        mat4.fromRotationTranslationScale(this.localMatrix, this.localRotation, this.localPosition, this.localScaling);
        if (!!this._parent) {
            mat4.mul(this._matrix, this._parent.matrix, this.localMatrix);
        }
        else {
            this._matrix = mat4.clone(this._localMatrix);
        }
        this.genOtherMatrixs();
    };
    Object3d.prototype.deComposeGlobalMatrix = function () {
        mat4.getTranslation(this._position, this._matrix);
        mat4.getRotation(this._rotation, this._matrix);
        if (!!this._parent) {
            mat4.mul(this._localMatrix, this._parent._worldToObjectMatrix, this.matrix);
        }
        else {
            this._localMatrix = mat4.clone(this._matrix);
        }
        mat4.fromRotationTranslationScale(this.localMatrix, this.localRotation, this.localPosition, this.localScaling);
    };
    Object3d.prototype.composeFromGlobalTransform = function () {
        mat4.fromRotationTranslationScale(this._matrix, this.rotation, this.position, this.scaling);
        this.genOtherMatrixs();
        if (!!this._parent) {
            mat4.mul(this._localMatrix, this._parent._worldToObjectMatrix, this.matrix);
        }
        else {
            this._localMatrix = mat4.clone(this._matrix);
        }
    };
    Object3d.prototype.applyToChildren = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.setTransformFromParent();
            child.applyToChildren();
        }
    };
    return Object3d;
}());
export { Object3d };
//# sourceMappingURL=Object3d.js.map