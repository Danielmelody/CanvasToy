declare module CanvasToy {

    interface Vec2Array extends Array<number> {
    }
    interface Vec3Array extends Array<number> {
    }
    interface Vec4Array extends Array<number> {
    }
    interface Mat2Array extends Array<number> {
    }
    interface Mat2dArray extends Array<number> {
    }
    interface Mat3Array extends Array<number> {
    }
    interface Mat4Array extends Array<number> {
    }
    interface QuatArray extends Array<number> {
    }

    interface glMatrix {
        setMatrixArrayType: (arrayType) => any;
    }

    export var glMatrix: glMatrix;

    interface vec2 {
        add: (out: Vec2Array, a: Vec2Array, b: Vec2Array) => Vec2Array;
        clone: (a: Vec2Array) => Vec2Array;
        copy: (out: Vec2Array, a: Vec2Array) => Vec2Array;
        create: () => Vec2Array;
        cross: (out: Vec2Array, a: Vec2Array, b: Vec2Array) => Vec3Array;
        dist: (a: Vec2Array, b: Vec2Array) => Number;
        distance: (a: Vec2Array, b: Vec2Array) => Number;
        div: (out: Vec2Array, a: Vec2Array, b: Vec2Array) => Vec2Array;
        divide: (out: Vec2Array, a: Vec2Array, b: Vec2Array) => Vec2Array;
        dot: (a: Vec2Array, b: Vec2Array) => Number;
        forEach: (a: Array<Number>, stride: Number, offset: Number, count: Number, fn: Function, arg?: Object) => Array<Number>;
        fromValues: (x: Number, y: Number) => Vec2Array;
        len: (a: Vec2Array) => Number;
        length: (a: Vec2Array) => Number;
        lerp: (out: Vec2Array, a: Vec2Array, b: vec2, t: Number) => Number;
        max: (out: Vec2Array, a: Vec2Array, b: Vec2Array) => Vec2Array;
        min: (out: Vec2Array, a: Vec2Array, b: Vec2Array) => Vec2Array;
        mul: (out: Vec2Array, a: Vec2Array, b: Vec2Array) => Vec2Array;
        multiply: (out: Vec2Array, a: Vec2Array, b: Vec2Array) => Vec2Array;
        negate: (out: Vec2Array, a: Vec2Array) => Vec2Array;
        normalize: (out: Vec2Array, a: Vec2Array) => Vec2Array;
        random: (out: Vec2Array, scale?: Number) => Vec2Array;
        scale: (out: Vec2Array, a: Vec2Array, b: Number) => Vec2Array;
        scaleAndAdd: (out: Vec2Array, a: Vec2Array, b: Number, scale: Number) => Vec2Array;
        set: (out: Number, x: Number, y: Number) => Vec2Array;
        sqrDist: (a: Vec2Array, b: Vec2Array) => Number;
        sqrLen: (a: Vec2Array) => Number;
        squaredDistance: (a: Vec2Array, b: Vec2Array) => Number;
        squaredLength: (a: Vec2Array) => Number;
        str: (vec: Vec2Array) => String;
        sub: (out: Vec2Array, a: Vec2Array, b: Vec2Array) => Vec2Array;
        transformMat2: (out: Vec2Array, a: Vec2Array, b: mat2) => Vec2Array;
        transformMat2d: (out: Vec2Array, a: Vec2Array, m: Mat2dArray) => Vec2Array;
        transformMat3: (out: Vec2Array, a: Vec2Array, m: Mat3Array) => Vec2Array;
        transformMat4: (out: Vec2Array, a: Vec2Array, m: Mat4Array) => Vec2Array;
    }

    export var vec2: vec2;

    interface vec3 {
        add: (out: Vec3Array, a: Vec3Array, b: Vec3Array) => Vec3Array;
        clone: (a: Vec3Array) => Vec3Array;
        copy: (out: Vec3Array, a: Vec3Array) => Vec3Array;
        create: () => Vec3Array;
        cross: (out: Vec3Array, a: Vec3Array, b: Vec3Array) => Vec3Array;
        dist: (a: Vec3Array, b: Vec3Array) => Number;
        distance: (a: Vec3Array, b: Vec3Array) => Number;
        div: (out: Vec3Array, a: Vec3Array, b: Vec3Array) => Vec3Array;
        divide: (out: Vec3Array, a: Vec3Array, b: Vec3Array) => Vec3Array;
        dot: (a: Vec3Array, b: Vec3Array) => Number;
        forEach: (a: Array<Number>, stride: Number, offset: Number, count: Number, fn: Function, arg?: Object) => Array<Number>;
        fromValues: (x: Number, y: Number, z: Number) => Vec3Array;
        len: (a: Vec3Array) => Number;
        length: (a: Vec3Array) => Number;
        lerp: (out: Vec3Array, a: Vec3Array, b: vec3, t: Number) => Number;
        max: (out: Vec3Array, a: Vec3Array, b: Vec3Array) => Vec3Array;
        min: (out: Vec3Array, a: Vec3Array, b: Vec3Array) => Vec3Array;
        mul: (out: Vec3Array, a: Vec3Array, b: Vec3Array) => Vec3Array;
        multiply: (out: Vec3Array, a: Vec3Array, b: Vec3Array) => Vec3Array;
        negate: (out: Vec3Array, a: Vec3Array) => Vec3Array;
        normalize: (out: Vec3Array, a: Vec3Array) => Vec3Array;
        random: (out: Vec3Array, scale?: Number) => Vec3Array;
        scale: (out: Vec3Array, a: Vec3Array, b: Number) => Vec3Array;
        scaleAndAdd: (out: Vec3Array, a: Vec3Array, b: Number, scale: Number) => Vec3Array;
        set: (out: Number, x: Number, y: Number) => Vec3Array;
        sqrDist: (a: Vec3Array, b: Vec3Array) => Number;
        sqrLen: (a: Vec3Array) => Number;
        squaredDistance: (a: Vec3Array, b: Vec3Array) => Number;
        squaredLength: (a: Vec3Array) => Number;
        str: (vec: Vec3Array) => String;
        sub: (out: Vec3Array, a: Vec3Array, b: Vec3Array) => Vec3Array;
        transformMat3: (out: Vec3Array, a: Vec3Array, m: Mat3Array) => Vec3Array;
        transformMat4: (out: Vec3Array, a: Vec3Array, m: Mat4Array) => Vec3Array;
        transformQuat: (out: Vec3Array, a: Vec3Array, q: QuatArray) => Vec3Array;
    }

    export var vec3: vec3;

    interface vec4 {
        add: (out: Vec4Array, a: Vec4Array, b: Vec4Array) => Vec4Array;
        clone: (a: Vec4Array) => Vec4Array;
        copy: (out: Vec4Array, a: Vec4Array) => Vec4Array;
        create: () => Vec4Array;
        dist: (a: Vec4Array, b: Vec4Array) => Number;
        distance: (a: Vec4Array, b: Vec4Array) => Number;
        div: (out: Vec4Array, a: Vec4Array, b: Vec4Array) => Vec4Array;
        divide: (out: Vec4Array, a: Vec4Array, b: Vec4Array) => Vec4Array;
        dot: (a: Vec4Array, b: Vec4Array) => Number;
        forEach: (a: Array<Number>, stride: Number, offset: Number, count: Number, fn: Function, arg?: Object) => Array<Number>;
        fromValues: (x: Number, y: Number, z: Number, w: Number) => Vec4Array;
        len: (a: Vec4Array) => Number;
        length: (a: Vec4Array) => Number;
        lerp: (out: Vec4Array, a: Vec4Array, b: Vec4Array, t: Number) => Number;
        max: (out: Vec4Array, a: Vec4Array, b: Vec4Array) => Vec4Array;
        min: (out: Vec4Array, a: Vec4Array, b: Vec4Array) => Vec4Array;
        mul: (out: Vec4Array, a: Vec4Array, b: Vec4Array) => Vec4Array;
        multiply: (out: Vec4Array, a: Vec4Array, b: Vec4Array) => Vec4Array;
        negate: (out: Vec4Array, a: Vec4Array) => Vec4Array;
        normalize: (out: Vec4Array, a: Vec4Array) => Vec4Array;
        random: (out: Vec4Array, scale?: Number) => Vec4Array;
        scale: (out: Vec4Array, a: Vec4Array, b: Number) => Vec4Array;
        scaleAndAdd: (out: Vec4Array, a: Vec4Array, b: Number, scale: Number) => Vec4Array;
        set: (out: Number, x: Number, y: Number) => Vec4Array;
        sqrDist: (a: Vec4Array, b: Vec4Array) => Number;
        sqrLen: (a: Vec4Array) => Number;
        squaredDistance: (a: Vec4Array, b: Vec4Array) => Number;
        squaredLength: (a: Vec4Array) => Number;
        str: (vec: Vec4Array) => String;
        sub: (out: Vec4Array, a: Vec4Array, b: Vec4Array) => Vec4Array;
        transformMat4: (out: Vec4Array, a: Vec4Array, m: Mat4Array) => Vec4Array;
        transformQuat: (out: Vec4Array, a: Vec4Array, q: QuatArray) => Vec4Array;
    }

    export var vec4: vec4

    interface mat2 {
        adjoint: (out: mat2, a: mat2) => mat2;
        clone: () => mat2;
        copy: (a: mat2) => mat2;
        create: () => mat2;
        determinant: () => Number;
        identity: (out: mat2) => mat2;
        invert: (out: mat2, a: mat2) => mat2;
        mul: (out: mat2, a: mat2, b: mat2) => mat2;
        multiply: (out: mat2, a: mat2, b: mat2) => mat2;
        rotate: (out: mat2, a: mat2, v: Vec2Array) => mat2;
        scale: (out: mat2, a: mat2, rad: Number) => mat2;
        str: (mat: mat2) => String;
        transpose: (out: mat2, a: mat2) => mat2;
    }

    export var mat2: mat2;

    interface mat2d {
        clone: () => Mat2dArray;
        copy: (a: Mat2dArray) => Mat2dArray;
        create: () => Mat2dArray;
        determinant: () => Number;
        identity: (out: Mat2dArray) => Mat2dArray;
        invert: (out: Mat2dArray, a: Mat2dArray) => Mat2dArray;
        mul: (out: Mat2dArray, a: Mat2dArray, b: Mat2dArray) => Mat2dArray;
        multiply: (out: Mat2dArray, a: Mat2dArray, b: Mat2dArray) => Mat2dArray;
        rotate: (out: Mat2dArray, a: Mat2dArray, v: Vec2Array) => Mat2dArray;
        scale: (out: Mat2dArray, a: Mat2dArray, rad: Number) => Mat2dArray;
        str: (mat: Mat2dArray) => String;
        transpose: (out: Mat2dArray, a: Mat2dArray) => Mat2dArray;
    }

    export var mat2d: mat2d;

    interface mat3 {
        adjoint: (out: Mat3Array, a: Mat3Array) => Mat3Array;
        clone: () => Mat3Array;
        copy: (a: Mat3Array) => Mat3Array;
        create: () => Mat3Array;
        determinant: () => Number;
        fromMat2d: (out: Mat3Array, a: Mat2dArray) => Mat3Array;
        identity: (out: Mat3Array) => Mat3Array;
        invert: (out: Mat3Array, a: Mat3Array) => Mat3Array;
        mul: (out: Mat3Array, a: Mat3Array, b: Mat3Array) => Mat3Array;
        multiply: (out: Mat3Array, a: Mat3Array, b: Mat3Array) => Mat3Array;
        normalFromMat4: (out: Mat3Array, a: Mat4Array) => Mat3Array
        rotate: (out: Mat3Array, a: Mat3Array, rad: Number) => Mat3Array;
        scale: (out: Mat3Array, a: Mat3Array, v: Vec2Array) => Mat3Array;
        str: (mat: Mat3Array) => String;
        translate: (out: Mat3Array, a: Mat3Array, v: Vec2Array) => Mat3Array;
        transpose: (out: Mat3Array, a: Mat3Array) => Mat3Array;
    }

    export var mat3: mat3;

    interface mat4 {
        adjoint: (out: Mat4Array, a: Mat4Array) => Mat4Array;
        clone: () => Mat4Array;
        copy: (a: Mat4Array) => Mat4Array;
        create: () => Mat4Array;
        determinant: () => Number;
        fromQuat: (out: Mat4Array, q: QuatArray) => Mat4Array;
        fromRotationTranslation: (out: Mat4Array, q: QuatArray, v: Vec3Array) => Mat4Array;
        frustum: (out: Mat4Array, left: Number, right: Number, bottom: Number,
            top: Number, near: Number, far: Number) => Mat4Array;
        identity: (out: Mat4Array) => Mat4Array;
        invert: (out: Mat4Array, a: Mat4Array) => Mat4Array;
        lookAt: (out: mat4, eye: Vec3Array, center: Vec3Array, up: Vec3Array) => Mat4Array;
        mul: (out: Mat4Array, a: Mat4Array, b: Mat4Array) => Mat4Array;
        multiply: (out: Mat4Array, a: Mat4Array, b: Mat4Array) => Mat4Array;
        ortho: (out: Mat4Array, left: Number, right: Number, bottom: Number, top: Number,
            near: Number, far: Number) => Mat4Array;
        perspective: (out: Mat4Array, fovy: Number, aspect: Number, near: Number, far: Number) => Mat4Array;
        rotate: (out: Mat4Array, a: Mat4Array, rad: Number) => Mat4Array;
        rotateX: (out: Mat4Array, a: Mat4Array, rad: Number) => Mat4Array;
        rotateY: (out: Mat4Array, a: Mat4Array, rad: Number) => Mat4Array;
        rotateZ: (out: Mat4Array, a: Mat4Array, rad: Number) => Mat4Array;
        scale: (out: Mat4Array, a: Mat4Array, v: Vec3Array) => Mat4Array;
        str: (mat: Mat4Array) => String;
        translate: (out: Mat4Array, a: Mat4Array, v: Vec3Array) => Mat4Array;
        transpose: (out: Mat4Array, a: Mat4Array) => Mat4Array;
    }

    export var mat4: mat4;

    interface quat {
        rotationTo: QuatArray;
        setAxes: QuatArray;
        add: (out, a, b) => QuatArray;
        calculateW: (out: quat, a: quat) => QuatArray;
        clone: (a: QuatArray) => QuatArray;
        conjugate: (out: QuatArray, a: QuatArray) => QuatArray;
        copy: (out: quat, a: QuatArray) => QuatArray;
        create: () => QuatArray;
        dot: (a: QuatArray, b: QuatArray) => Number;
        fromMat3: (out: QuatArray, m: Mat3Array) => QuatArray;
        fromValues: (x: Number, y: Number, z: Number, w: Number) => QuatArray;
        identity: (out: QuatArray) => QuatArray;
        invert: (out: QuatArray, a: QuatArray) => QuatArray;
        len: (a: QuatArray) => Number;
        length: (a: QuatArray) => Number;
        mul: (out: QuatArray, a: QuatArray, b: QuatArray) => QuatArray;
        multiply: (out: QuatArray, a: QuatArray, b: QuatArray) => QuatArray;
        normalize: (out: QuatArray, a: QuatArray) => QuatArray;
        rotateX: (out: QuatArray, a: QuatArray, rad: Number) => QuatArray;
        rotateY: (out: QuatArray, a: QuatArray, rad: Number) => QuatArray;
        rotateZ: (out: QuatArray, a: QuatArray, rad: Number) => QuatArray;
        scale: (out: QuatArray, a: QuatArray, b: Number) => QuatArray;
        set: (out: QuatArray, x: Number, y: Number, z: Number, w: Number) => QuatArray;
        setAxisAngle: (out: QuatArray, axis: Vec3Array, rad: Number) => QuatArray;
        slerp: (out: QuatArray, a: QuatArray, b: QuatArray, t: Number) => QuatArray;
        sqrLen: (a: QuatArray) => Number;
        squaredLength: (a: QuatArray) => Number;
        str: (vec: QuatArray) => String;
    }

    export var quat: quat;

}
