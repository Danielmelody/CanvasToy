var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.debug = true;
    var DataType;
    (function (DataType) {
        DataType[DataType["float"] = 0] = "float";
        DataType[DataType["int"] = 1] = "int";
        DataType[DataType["vec2"] = 2] = "vec2";
        DataType[DataType["vec3"] = 3] = "vec3";
        DataType[DataType["vec4"] = 4] = "vec4";
        DataType[DataType["mat2"] = 5] = "mat2";
        DataType[DataType["mat3"] = 6] = "mat3";
        DataType[DataType["mat4"] = 7] = "mat4";
    })(DataType = CanvasToy.DataType || (CanvasToy.DataType = {}));
    CanvasToy.resourcesCache = {};
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    function uniform(name, type, updator) {
        return function (proto, key) {
            if (!proto.hasOwnProperty("uniforms") && !proto.uniforms) {
                Object.defineProperty(proto, "uniforms", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: [],
                });
            }
            var uniforms = proto.uniforms;
            uniforms.push({
                key: key,
                name: name,
                type: type,
                updator: updator ? updator : function (obj) {
                    if (obj.hasOwnProperty(key)) {
                        return obj[key];
                    }
                    return undefined;
                },
            });
        };
    }
    CanvasToy.uniform = uniform;
    function uniformArray(name, type, updator) {
        return function (proto, key) {
            if (!proto.hasOwnProperty("uniformArray") && !proto.uniformArray) {
                Object.defineProperty(proto, "uniformArray", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: [],
                });
            }
            var uniformArray = proto.uniformArray;
            uniformArray.push({
                key: key,
                name: name,
                type: type,
                updator: updator ? updator : function (obj) {
                    if (obj.hasOwnProperty(key)) {
                        return obj[key];
                    }
                    return undefined;
                },
            });
        };
    }
    CanvasToy.uniformArray = uniformArray;
    function textureArray(name) {
        return function (proto, key) {
            if (!proto.hasOwnProperty("textureArrays") && !proto.textureArrays) {
                Object.defineProperty(proto, "textureArrays", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: [],
                });
            }
            var textureArrays = proto.textureArrays;
            textureArrays.push({
                key: key,
                name: name,
                arrayGetter: function (obj) {
                    if (obj.hasOwnProperty(key)) {
                        return obj[key];
                    }
                    return undefined;
                },
            });
        };
    }
    CanvasToy.textureArray = textureArray;
    function texture(name) {
        return function (proto, key) {
            readyRequire(proto, key);
            if (!proto.hasOwnProperty("textures") && !proto.textures) {
                Object.defineProperty(proto, "textures", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: [],
                });
            }
            var textures = proto.textures;
            textures.push({
                key: key,
                name: name,
                getter: function (obj) {
                    if (obj.hasOwnProperty(key)) {
                        return obj[key];
                    }
                    return undefined;
                },
            });
        };
    }
    CanvasToy.texture = texture;
    function linkdef(name, value) {
        return function (proto, key) {
            if (!proto.hasOwnProperty("defines") && !proto.defines) {
                Object.defineProperty(proto, "defines", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: {},
                });
            }
            var defines = proto.defines;
            defines[key] = function (obj) {
                if (!!obj[key]) {
                    return { name: name, value: value };
                }
                return undefined;
            };
        };
    }
    CanvasToy.linkdef = linkdef;
    function readyRequire(proto, key) {
        if (!proto.hasOwnProperty("asyncResources") && !proto.asyncResources) {
            Object.defineProperty(proto, "asyncResources", {
                enumerable: true,
                configurable: false,
                writable: false,
                value: [],
            });
        }
        var asyncResources = proto.asyncResources;
        asyncResources.push(function (obj) {
            var resources = obj[key];
            if (!!obj[key]) {
                return obj[key].asyncFinished();
            }
            return undefined;
        });
    }
    CanvasToy.readyRequire = readyRequire;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Object3d = (function () {
        function Object3d(tag) {
            this.children = [];
            this.uniforms = [];
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
            this.handleUniformProperty();
        }
        Object.defineProperty(Object3d.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
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
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "matrix", {
            get: function () {
                return this._matrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "worldToObjectMatrix", {
            get: function () {
                return this._worldToObjectMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object3d.prototype.setWorldToObjectMatrix = function (worldToObjectMatrix) {
            this._worldToObjectMatrix = worldToObjectMatrix;
            mat4.invert(this._matrix, this._worldToObjectMatrix);
            this.deComposeGlobalMatrix();
            return this;
        };
        Object.defineProperty(Object3d.prototype, "localPosition", {
            get: function () {
                return this._localPosition;
            },
            enumerable: true,
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
            enumerable: true,
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
            enumerable: true,
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
                return this._rotation;
            },
            enumerable: true,
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
                return this._localScaling;
            },
            enumerable: true,
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
                return this._scaling;
            },
            enumerable: true,
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
            console.assert(delta instanceof Array && delta.length === 3, "invalid delta translate");
            this.setPosition(vec3.add(this.localPosition, vec3.clone(this.localPosition), delta));
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
        Object3d.prototype.handleUniformProperty = function () {
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
    CanvasToy.Object3d = Object3d;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            var _this = _super.call(this) || this;
            _this._upVector = vec3.fromValues(0, 1, 0);
            _this._centerVector = vec3.fromValues(0, 0, -1);
            _this._rightVector = vec3.fromValues(1, 0, 0);
            _this._projectionMatrix = mat4.create();
            _this._near = 0.1;
            _this._far = 1000;
            return _this;
        }
        Object.defineProperty(Camera.prototype, "near", {
            get: function () {
                return this._near;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "far", {
            get: function () {
                return this._far;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "eyeVector", {
            get: function () {
                return this._centerVector;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "upVector", {
            get: function () {
                return this._upVector;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "centerVector", {
            get: function () {
                return this._centerVector;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "rightVector", {
            get: function () {
                return this._rightVector;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "projectionMatrix", {
            get: function () {
                return this._projectionMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Camera.prototype.lookAt = function (center) {
            this._centerVector = center;
            vec3.cross(this._rightVector, [0, 1, 0], center);
            mat4.lookAt(this._worldToObjectMatrix, this.position, center, [0, 1, 0]);
            this.setWorldToObjectMatrix(this._worldToObjectMatrix);
            return this;
        };
        Camera.prototype.setProjectionMatrix = function (projectionMatrix) {
            this._projectionMatrix = projectionMatrix;
            return this;
        };
        Camera.prototype.setNear = function (near) {
            if (near !== this._near) {
                this.compuseProjectionMatrix();
                this._near = near;
            }
            return this;
        };
        Camera.prototype.setFar = function (far) {
            if (far !== this._far) {
                this.compuseProjectionMatrix();
                this._far = far;
            }
            return this;
        };
        return Camera;
    }(CanvasToy.Object3d));
    __decorate([
        CanvasToy.uniform("cameraNear", CanvasToy.DataType.float)
    ], Camera.prototype, "_near", void 0);
    __decorate([
        CanvasToy.uniform("cameraFar", CanvasToy.DataType.float)
    ], Camera.prototype, "_far", void 0);
    CanvasToy.Camera = Camera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var OrthoCamera = (function (_super) {
        __extends(OrthoCamera, _super);
        function OrthoCamera(parameters) {
            if (parameters === void 0) { parameters = {}; }
            var _this = _super.call(this) || this;
            _this._left = -1;
            _this._right = 1;
            _this._bottom = -1;
            _this._top = 1;
            _this._left = parameters.left || _this._left;
            _this._right = parameters.right || _this._right;
            _this._bottom = parameters.bottom || _this._bottom;
            _this._top = parameters.top || _this._top;
            _this._near = parameters.near || _this._near;
            _this._far = parameters.far || _this._far;
            mat4.ortho(_this._projectionMatrix, _this._left, _this._right, _this._bottom, _this._top, _this._near, _this._far);
            return _this;
        }
        OrthoCamera.prototype.setLeft = function (left) {
            if (left !== this._left) {
                this._left = left;
                this.compuseProjectionMatrix();
            }
        };
        Object.defineProperty(OrthoCamera.prototype, "left", {
            get: function () {
                return this._left;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OrthoCamera.prototype, "right", {
            get: function () {
                return this._right;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OrthoCamera.prototype, "top", {
            get: function () {
                return this._top;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OrthoCamera.prototype, "bottom", {
            get: function () {
                return this._bottom;
            },
            enumerable: true,
            configurable: true
        });
        OrthoCamera.prototype.compuseProjectionMatrix = function () {
            mat4.ortho(this._projectionMatrix, this._left, this._right, this._bottom, this._top, this._near, this._far);
        };
        OrthoCamera.prototype.deCompuseProjectionMatrix = function () {
        };
        OrthoCamera.prototype.genOtherMatrixs = function () {
            _super.prototype.genOtherMatrixs.call(this);
            mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far);
        };
        OrthoCamera.prototype.adaptTargetRadio = function (target) {
            this._left = -target.width / 2;
            this._right = target.width / 2;
            this._top = target.height / 2;
            this._bottom = -target.height / 2;
            this.compuseProjectionMatrix();
            return this;
        };
        return OrthoCamera;
    }(CanvasToy.Camera));
    CanvasToy.OrthoCamera = OrthoCamera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(parameter) {
            if (parameter === void 0) { parameter = {}; }
            var _this = _super.call(this) || this;
            _this._aspect = 1;
            _this._fovy = Math.PI / 4;
            _this._aspect = parameter.aspect || _this._aspect;
            _this._fovy = parameter.fovy || _this._fovy;
            _this._near = parameter.near || _this._near;
            _this._far = parameter.far || _this._far;
            return _this;
        }
        PerspectiveCamera.prototype.compuseProjectionMatrix = function () {
            mat4.perspective(mat4.create(), this.fovy, this.aspect, this.near, this.far);
        };
        Object.defineProperty(PerspectiveCamera.prototype, "aspect", {
            get: function () {
                return this._aspect;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PerspectiveCamera.prototype, "fovy", {
            get: function () {
                return this._fovy;
            },
            enumerable: true,
            configurable: true
        });
        PerspectiveCamera.prototype.setAspect = function (aspect) {
            if (aspect !== this._aspect) {
                this.compuseProjectionMatrix();
                this._aspect = aspect;
            }
            return this;
        };
        PerspectiveCamera.prototype.setFovy = function (fovy) {
            if (fovy !== this._fovy) {
                this.compuseProjectionMatrix();
                this._fovy = fovy;
            }
            return this;
        };
        PerspectiveCamera.prototype.deCompuseProjectionMatrix = function () {
        };
        PerspectiveCamera.prototype.genOtherMatrixs = function () {
            _super.prototype.genOtherMatrixs.call(this);
            this._projectionMatrix = mat4.perspective(mat4.create(), this.fovy, this.aspect, this.near, this.far);
        };
        PerspectiveCamera.prototype.adaptTargetRadio = function (target) {
            this._aspect = target.width / target.height;
            this.genOtherMatrixs();
            return this;
        };
        return PerspectiveCamera;
    }(CanvasToy.Camera));
    CanvasToy.PerspectiveCamera = PerspectiveCamera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, materials) {
            var _this = _super.call(this) || this;
            _this.materials = [];
            _this.materials = materials;
            _this.geometry = geometry;
            return _this;
        }
        Mesh.prototype.drawMode = function (gl) {
            return gl.STATIC_DRAW;
        };
        return Mesh;
    }(CanvasToy.Object3d));
    CanvasToy.Mesh = Mesh;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var ShaderSource;
    (function (ShaderSource) {
        ShaderSource.calculators__blinn_phong_glsl = "vec3 calculateLight(\n    vec3 position,\n    vec3 normal,\n    vec3 lightDir,\n    vec3 eyePos,\n    vec3 specular,\n    vec3 diffuse,\n    float shiness,\n    float idensity\n    ) {\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize(eyePos - position);\n\n    // replace R * V with N * H\n    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);\n    float specularAngle = max(dot(H, normal), 0.0);\n\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
        ShaderSource.calculators__linearlize_depth_glsl = "float linearlizeDepth(float far, float near, float depth) {\n    float NDRDepth = depth * 2.0 - 1.0;;\n    return 2.0 * near / (near + far - NDRDepth * (far - near));\n}\n";
        ShaderSource.calculators__phong_glsl = "vec3 calculateLight(\n    vec3 position,\n    vec3 normal,\n    vec3 lightDir,\n    vec3 eyePos,\n    vec3 specularLight,\n    vec3 diffuseLight,\n    float shiness,\n    float idensity\n    ) {\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize(eyePos - position);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specularLight * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
        ShaderSource.calculators__shadow_factor_glsl = "float getSpotDirectionShadow(vec4 shadowCoord, sampler2D shadowMap)\n{\n    vec3 NDCoord = shadowCoord.xyz / shadowCoord.w;\n    vec2 uv = NDCoord.xy * 0.5 + 0.5;\n    if (uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0) {\n        float z = 0.5 * NDCoord.z + 0.5;\n        float depth = texture2D(shadowMap, uv).x;\n        if (depth < (z - 0.00001)) {\n            return 0.0;\n        } else {\n            return 1.0;\n        }\n    } else {\n        return 1.0;\n    }\n}\n";
        ShaderSource.calculators__types_glsl = "vec3 calculateDirLight(\n    DirectLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    return calculateLight(\n        position,\n        normal,\n        -light.direction,\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        light.idensity\n    );\n}\n\nvec3 calculatePointLight(\n    PointLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    float lightDis = length(light.position - position);\n    float idensity = light.idensity / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);\n    idensity *= step(lightDis, light.radius);\n    return calculateLight(\n        position,\n        normal,\n        normalize(light.position - position),\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        idensity\n    );\n}\n\nvec3 calculateSpotLight(\n    SpotLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    vec3 lightDir = normalize(light.position - position);\n    float spotFactor = dot(-lightDir, light.spotDir);\n    if (spotFactor < light.coneAngleCos) {\n        return vec3(0.0);\n    }\n    float lightDis = length(light.position - position);\n    float idensity = light.idensity / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);\n    idensity = (spotFactor - light.coneAngleCos) / (1.0 - light.coneAngleCos);\n    // idensity *= step(light.radius, lightDis);\n    return calculateLight(\n        position,\n        normal,\n        lightDir,\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        idensity\n    );\n}\n\n// float directAndSpotShadow(sampler2D shadowMap, vec4 shadowCoord) {\n//\n// }\n";
        ShaderSource.debug__checkBox_glsl = "float checkerBoard(in vec2 uv, in float subSize) {\n    vec2 bigBox = mod(uv, vec2(subSize * 2.0));\n    return (\n        step(subSize, bigBox.x) * step(subSize, bigBox.y)\n        + step(subSize, subSize * 2.0 -bigBox.x) * step(subSize, subSize * 2.0 -bigBox.y)\n    );\n}\n";
        ShaderSource.definitions__light_glsl = "#ifdef OPEN_LIGHT // light declaration\n\nstruct DirectLight\n{\n    vec3 color;\n    float idensity;\n    vec3 direction;\n\n    int shadowIndex;\n};\n\nstruct PointLight {\n    vec3 color;\n    float idensity;\n    float radius;\n    vec3 position;\n    float squareAtten;\n    float linearAtten;\n    float constantAtten;\n\n    int shadowIndex;\n};\n\nstruct SpotLight {\n    vec3 color;\n    float idensity;\n    float radius;\n    vec3 position;\n    float squareAtten;\n    float linearAtten;\n    float constantAtten;\n    float coneAngleCos;\n    vec3 spotDir;\n\n    int shadowIndex;\n};\n\n#endif // light declaration\n";
        ShaderSource.interploters__deferred__geometry_frag = "uniform vec3 ambient;\nuniform vec3 materialDiff;\nuniform vec3 materialSpec;\nuniform float materialSpecExp;\n\n\n#ifdef OPEN_LIGHT\nuniform vec3 eyePos;\nvarying vec3 vNormal;\n#endif\n\n#ifdef _MAIN_TEXTURE\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef _NORMAL_TEXTURE\nuniform sampler2D uNormalTexture;\nvarying vec2 vNormalUV;\n#endif\n\nvec2 encodeNormal(vec3 n) {\n    return normalize(n.xy) * (sqrt(n.z*0.5+0.5));\n}\n\nvoid main () {\n\n#ifdef OPEN_LIGHT\n    vec3 normal = normalize(vNormal);\n    float specular = (materialSpec.x + materialSpec.y + materialSpec.z) / 3.0;\n#ifdef _NORMAL_TEXTURE\n    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, materialSpecExp);\n#else\n    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, materialSpecExp);\n#endif\n#ifdef _MAIN_TEXTURE\n    gl_FragData[1] = vec4(materialDiff * texture2D(uMainTexture, vMainUV).xyz, specular);\n#else\n    gl_FragData[1] = vec4(materialDiff, specular);\n#endif\n#endif\n}\n";
        ShaderSource.interploters__deferred__geometry_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef _MAIN_TEXTURE\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalViewMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalViewMatrix * vec4(aNormal, 1.0)).xyz;\n#endif\n\n#ifdef _MAIN_TEXTURE\n    vMainUV = aMainUV;\n#endif\n}\n";
        ShaderSource.interploters__deferred__tiledLight_frag = "#define MAX_TILE_LIGHT_NUM 32\n\nprecision highp float;\n\nuniform float uHorizontalTileNum;\nuniform float uVerticalTileNum;\nuniform float uLightListLengthSqrt;\n\nuniform mat4 inverseProjection;\n\nuniform sampler2D uLightIndex;\nuniform sampler2D uLightOffsetCount;\nuniform sampler2D uLightPositionRadius;\nuniform sampler2D uLightColorIdensity;\n\nuniform sampler2D uNormalDepthSE;\nuniform sampler2D uDiffSpec;\n\nuniform float cameraNear;\nuniform float cameraFar;\n\n\nvarying vec3 vPosition;\n\nvec3 decodeNormal(vec2 n)\n{\n   vec3 normal;\n   normal.z = dot(n, n) * 2.0 - 1.0;\n   normal.xy = normalize(n) * sqrt(1.0 - normal.z * normal.z);\n   return normal;\n}\n\nvec3 decodePosition(float depth) {\n    vec4 clipSpace = vec4(vPosition.xy, depth * 2.0 - 1.0, 1.0);\n    vec4 homogenous = inverseProjection * clipSpace;\n    return homogenous.xyz / homogenous.w;\n}\n\nvoid main() {\n    vec2 uv = vPosition.xy * 0.5 + vec2(0.5);\n    vec2 gridIndex = uv ;// floor(uv * vec2(uHorizontalTileNum, uVerticalTileNum)) / vec2(uHorizontalTileNum, uVerticalTileNum);\n    vec4 lightIndexInfo = texture2D(uLightOffsetCount, gridIndex);\n    float lightStartIndex = lightIndexInfo.r;\n    float lightNum = lightIndexInfo.w;\n    vec4 tex1 = texture2D(uNormalDepthSE, uv);\n    vec4 tex2 = texture2D(uDiffSpec, uv);\n\n    vec3 materialDiff = tex2.xyz;\n    vec3 materialSpec = vec3(tex2.w);\n    float materialSpecExp = tex1.w;\n\n    vec3 normal = decodeNormal(tex1.xy);\n    vec3 viewPosition = decodePosition(tex1.z);\n    vec3 totalColor = vec3(0.0);\n    int realCount = 0;\n    for(int i = 0; i < MAX_TILE_LIGHT_NUM; i++) {\n        if (float(i) > lightNum - 0.5) {\n            break;\n        }\n        // float listX = (float(lightStartIndex + i) - listX_int * uLightListLengthSqrt) / uLightListLengthSqrt;\n        // float listY = ((lightStartIndex + i) / uLightListLengthSqrt) / uLightListLengthSqrt;\n        // float listX = (mod(lightStartIndex + i, uLightListLengthSqrt)) / uLightListLengthSqrt;\n        // listX = 1.0;\n        // listY = 0.0;\n        float fixlightId = texture2D(uLightIndex, vec2((lightStartIndex + float(i)) / uLightListLengthSqrt, 0.5)).x;\n        vec4 lightPosR = texture2D(uLightPositionRadius, vec2(fixlightId, 0.5));\n        vec3 lightPos = lightPosR.xyz;\n        float lightR = lightPosR.w;\n        vec4 lightColorIden = texture2D(uLightColorIdensity, vec2(fixlightId, 0.5));\n        vec3 lightColor = lightColorIden.xyz;\n        float lightIdensity = lightColorIden.w;\n\n        float dist = distance(lightPos, viewPosition);\n        if (dist < lightR) {\n            realCount++;\n            vec3 fixLightColor = lightColor * min(1.0,  1.0 / (dist * dist ) / (lightR * lightR));\n            totalColor += calculateLight(\n                viewPosition,\n                normal,\n                normalize(lightPos - viewPosition),\n                vec3(0.0),\n                materialSpec * lightColor,\n                materialDiff * lightColor,\n                materialSpecExp,\n                lightIdensity\n            );\n            // totalColor += vec3(listX, listY, 0.0);\n        }\n            // vec3 lightDir = normalize(lightPos - viewPosition);\n            // vec3 reflectDir = normalize(reflect(lightDir, normal));\n            // vec3 viewDir = normalize( - viewPosition);\n            // vec3 H = normalize(lightDir + viewDir);\n            // float specularAngle = max(dot(H, normal), 0.0);\n            // // vec3 specularColor = materialSpec * pow(specularAngle, materialSpecExp);\n        // totalColor = vec3(float(lightStartIndex) / uLightListLengthSqrt / uLightListLengthSqrt);\n        //}\n        //}\n    }\n    // vec3 depth = vec3(linearlizeDepth(cameraFar, cameraNear, tex1.z));\n    // vec3 depth = vec3(tex1.z);\n    vec3 test = vec3(float(realCount) / 32.0);\n    gl_FragColor = vec4(totalColor, 1.0);\n}\n";
        ShaderSource.interploters__deferred__tiledLight_vert = "attribute vec3 position;\nvarying vec3 vPosition;\n\nvoid main()\n{\n    gl_Position = vec4(position, 1.0);\n    vPosition = position;\n}\n";
        ShaderSource.interploters__depth_phong_frag = "uniform vec3 ambient;\nuniform vec3 depthColor;\n\nuniform float cameraNear;\nuniform float cameraFar;\n\nvoid main () {\n    // float originDepth = 1.0 - (1.0 - gl_FragCoord.z) * 25.0;\n    //\n    // float linearDepth = linearlizeDepth(cameraFar, cameraNear, originDepth);\n    // gl_FragColor = vec4(vec3(linearDepth), 1.0);\n    // gl_FragColor = vec4(1.0);\n}\n";
        ShaderSource.interploters__depth_phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\nuniform mat4 modelViewMatrix;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n}\n";
        ShaderSource.interploters__forward__gouraud_frag = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nvoid main() {\n    textureColor = colorOrMainTexture(vMainUV);\n#ifdef OPEN_LIGHT\n    totalLighting = ambient;\n    vec3 normal = normalize(vNormal);\n    gl_FragColor = vec4(totalLighting, 1.0);\n#else\n#ifdef USE_COLOR\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#endif\n#endif\n#ifdef _MAIN_TEXTURE\n    gl_FragColor = gl_FragColor * textureColor;\n#endif\n#ifdef USE_COLOR\n    gl_FragColor = gl_FragColor * color;\n#endif\n}\n";
        ShaderSource.interploters__forward__gouraud_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    totalLighting = ambient;\n    normal = normalize(normal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);\n    }\n    vLightColor = totalLighting;\n#endif\n#ifdef _MAIN_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n";
        ShaderSource.interploters__forward__phong_frag = "uniform vec3 ambient;\nuniform vec3 materialSpec;\nuniform float materialSpecExp;\nuniform vec3 materialDiff;\nvarying vec2 vMainUV;\nvarying vec4 screenPos;\n\n#ifdef OPEN_LIGHT\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n#endif\n\n#ifdef _MAIN_TEXTURE\nuniform sampler2D uMainTexture;\n#endif\n\n#ifdef _ENVIRONMENT_MAP\nuniform float reflectivity;\nuniform samplerCube uCubeTexture;\n#endif\n\n#if (DIR_LIGHT_NUM > 0)\nuniform DirectLight directLights[DIR_LIGHT_NUM];\n#endif\n\n#if (POINT_LIGHT_NUM > 0)\nuniform PointLight pointLights[POINT_LIGHT_NUM];\n#endif\n\n#if (SPOT_LIGHT_NUM)\nuniform SpotLight spotLights[SPOT_LIGHT_NUM];\n#endif\n\n#ifdef USE_SHADOW\n\n    #if (DIR_LIGHT_NUM > 0)\n    uniform sampler2D directShadowMaps[DIR_LIGHT_NUM];\n    varying vec4 directShadowCoord[DIR_LIGHT_NUM];\n    #endif\n\n    #if (POINT_LIGHT_NUM > 0)\n    uniform sampler2D pointShadowMaps[POINT_LIGHT_NUM];\n    varying vec4 pointShadowCoord[POINT_LIGHT_NUM];\n    #endif\n\n    #if (SPOT_LIGHT_NUM > 0)\n    uniform sampler2D spotShadowMaps[SPOT_LIGHT_NUM];\n    varying vec4 spotShadowCoord[SPOT_LIGHT_NUM];\n    #endif\n\n#endif\n\nvoid main () {\n#ifdef _MAIN_TEXTURE\n    gl_FragColor = texture2D(uMainTexture, vMainUV);\n#else\n    #ifdef _DEBUG\n    gl_FragColor = vec4(vec3(checkerBoard(vMainUV, 0.1)), 1.0);\n    #else\n    gl_FragColor = vec4(1.0);\n    #endif\n#endif\n    vec3 color = vec3(0.0);\n    vec3 normal = normalize(vNormal);\n#ifdef OPEN_LIGHT\n    vec3 totalLighting = ambient;\n    #if (DIR_LIGHT_NUM > 0)\n    for (int index = 0; index < DIR_LIGHT_NUM; index++) {\n        vec3 lighting = calculateDirLight(\n            directLights[index],\n            materialDiff,\n            materialSpec,\n            materialSpecExp,\n            vPosition,\n            normal,\n            vec3(0.0)\n        );\n        #ifdef USE_SHADOW\n        lighting = lighting * getSpotDirectionShadow(directShadowCoord[index], directShadowMaps[index]);\n        #endif\n        totalLighting += lighting;\n    }\n    #endif\n    #if (POINT_LIGHT_NUM > 0)\n    for (int index = 0; index < POINT_LIGHT_NUM; index++) {\n        vec3 lighting = calculatePointLight(\n            pointLights[index],\n            materialDiff,\n            materialSpec,\n            materialSpecExp,\n            vPosition,\n            normal,\n            vec3(0.0)\n        );\n        totalLighting += lighting;\n    }\n    #endif\n    #if (SPOT_LIGHT_NUM > 0)\n    for (int index = 0; index < SPOT_LIGHT_NUM; index++) {\n        vec3 lighting = calculateSpotLight(\n            spotLights[index],\n            materialDiff,\n            materialSpec,\n            materialSpecExp,\n            vPosition,\n            normal,\n            vec3(0.0)\n        );\n        #ifdef USE_SHADOW\n        lighting = lighting * getSpotDirectionShadow(spotShadowCoord[index], spotShadowMaps[index]);\n        #endif\n        totalLighting += lighting;\n\n    }\n    #endif\n    color = totalLighting;\n#endif\n#ifdef _ENVIRONMENT_MAP\n    vec3 viewDir = normalize(-vPosition);\n    vec3 skyUV = reflect(-viewDir, vNormal);\n    color = mix(color, textureCube(uCubeTexture, skyUV).xyz, reflectivity);\n#endif\n    gl_FragColor *= vec4(color, 1.0);\n}\n";
        ShaderSource.interploters__forward__phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\nuniform mat4 modelViewMatrix;\n\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nuniform mat4 normalViewMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\nvarying vec4 screenPos;\n\n\n#ifdef USE_SHADOW\n\n    #if (DIR_LIGHT_NUM > 0)\n    uniform mat4 directShadowMatrices[DIR_LIGHT_NUM];\n    varying vec4 directShadowCoord[DIR_LIGHT_NUM];\n    #endif\n\n    #if (POINT_LIGHT_NUM > 0)\n    uniform mat4 pointShadowMatrices[POINT_LIGHT_NUM];\n    varying vec4 pointShadowCoord[POINT_LIGHT_NUM];\n    #endif\n\n    #if (SPOT_LIGHT_NUM > 0)\n    uniform mat4 spotShadowMatrices[SPOT_LIGHT_NUM];\n    varying vec4 spotShadowCoord[SPOT_LIGHT_NUM];\n    #endif\n\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n    screenPos = gl_Position;\n    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;\n    vNormal = (normalViewMatrix * vec4(aNormal, 1.0)).xyz;\n    vMainUV = aMainUV;\n\n    #ifdef USE_SHADOW\n        #if (DIR_LIGHT_NUM > 0)\n        for (int i = 0; i < DIR_LIGHT_NUM; ++i) {\n            directShadowCoord[i] = directShadowMatrices[i] * vec4(position, 1.0);\n        }\n        #endif\n\n        #if (POINT_LIGHT_NUM > 0)\n        for (int i = 0; i < POINT_LIGHT_NUM; ++i) {\n            pointShadowCoord[i] = pointShadowMatrices[i] * vec4(position, 1.0);\n        }\n        #endif\n\n        #if (SPOT_LIGHT_NUM > 0)\n        for (int i = 0; i < SPOT_LIGHT_NUM; ++i) {\n            spotShadowCoord[i] = spotShadowMatrices[i] * vec4(position, 1.0);\n        }\n        #endif\n    #endif\n}\n";
        ShaderSource.interploters__forward__skybox_frag = "varying vec3 cubeUV;\nuniform samplerCube uCubeTexture;\nvoid main()\n{\n    gl_FragColor = textureCube(uCubeTexture, cubeUV);\n}\n";
        ShaderSource.interploters__forward__skybox_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nvarying vec3 cubeUV;\n\nvoid main (){\n    vec4 mvp = modelViewProjectionMatrix * vec4(position, 1.0);\n    cubeUV = position;\n    gl_Position = mvp.xyww;\n}\n";
    })(ShaderSource = CanvasToy.ShaderSource || (CanvasToy.ShaderSource = {}));
})(CanvasToy || (CanvasToy = {}));
function builder(_thisArg) {
    return _thisArg;
}
var CanvasToy;
(function (CanvasToy) {
    var Texture = (function () {
        function Texture(gl, url) {
            var _this = this;
            this.isReadyToUpdate = false;
            if (!!url) {
                this._image = new Image();
                var image_1 = this._image;
                this.setAsyncFinished(new Promise(function (resolve, reject) {
                    image_1.onload = function () { return resolve(_this); };
                    image_1.onerror = function () { return reject(_this); };
                    _this._image.src = url;
                }));
            }
            this.setTarget(gl.TEXTURE_2D)
                .setFormat(gl.RGB)
                .setWrapS(gl.CLAMP_TO_EDGE)
                .setWrapT(gl.CLAMP_TO_EDGE)
                .setMagFilter(gl.NEAREST)
                .setMinFilter(gl.NEAREST)
                .setType(gl.UNSIGNED_BYTE);
            this.glTexture = gl.createTexture();
        }
        Object.defineProperty(Texture.prototype, "image", {
            get: function () {
                return this._image;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "target", {
            get: function () {
                return this._target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "format", {
            get: function () {
                return this._format;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "wrapS", {
            get: function () {
                return this._wrapS;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "wrapT", {
            get: function () {
                return this._wrapT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "magFilter", {
            get: function () {
                return this._magFilter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "minFilter", {
            get: function () {
                return this._minFilter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype.setTarget = function (_target) {
            this._target = _target;
            return this;
        };
        Texture.prototype.setFormat = function (_format) {
            this._format = _format;
            return this;
        };
        Texture.prototype.setWrapS = function (_wrapS) {
            this._wrapS = _wrapS;
            return this;
        };
        Texture.prototype.setWrapT = function (_wrapT) {
            this._wrapT = _wrapT;
            return this;
        };
        Texture.prototype.setMagFilter = function (_magFilter) {
            this._magFilter = _magFilter;
            return this;
        };
        Texture.prototype.setMinFilter = function (_minFilter) {
            this._minFilter = _minFilter;
            return this;
        };
        Texture.prototype.setType = function (_type) {
            this._type = _type;
            return this;
        };
        Texture.prototype.setAsyncFinished = function (promise) {
            this._asyncFinished = promise;
        };
        Texture.prototype.asyncFinished = function () {
            return this._asyncFinished;
        };
        ;
        Texture.prototype.bindTextureData = function (gl) {
            gl.bindTexture(this.target, this.glTexture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, this.wrapS);
            gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, this.wrapT);
            gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, this.magFilter);
            gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, this.minFilter);
            return this;
        };
        return Texture;
    }());
    CanvasToy.Texture = Texture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.colors = {
        black: vec4.fromValues(0, 0, 0, 1),
        gray: vec4.fromValues(0.5, 0.5, 0.5, 1),
        red: vec4.fromValues(1, 0, 0, 1),
        white: vec4.fromValues(1, 1, 1, 1),
    };
    var Material = (function () {
        function Material() {
            this.dirty = true;
            this.defines = [];
        }
        return Material;
    }());
    CanvasToy.Material = Material;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Attribute = (function () {
        function Attribute(gl, paramter) {
            this.size = 3;
            this.data = [];
            this.index = 0;
            this.stride = 0;
            this.buffer = null;
            this.gl = null;
            this.buffer = gl.createBuffer();
            this.gl = gl;
            for (var attributeInfo in paramter) {
                this[attributeInfo] = paramter[attributeInfo] ? paramter[attributeInfo] : this[attributeInfo];
            }
            switch (paramter.type) {
                case CanvasToy.DataType.float:
                    this.type = gl.FLOAT;
                    break;
                case CanvasToy.DataType.int:
                    this.type = gl.INT;
                    break;
                default: break;
            }
        }
        return Attribute;
    }());
    CanvasToy.Attribute = Attribute;
    var Program = (function () {
        function Program(gl, source, passFunctions) {
            this.enableDepthTest = true;
            this.enableStencilTest = true;
            this.uniforms = {};
            this.uniformArrays = {};
            this.attributes = {};
            this.attributeLocations = {};
            this.textures = [];
            this.textureArrays = [];
            this.vertexPrecision = "highp";
            this.fragmentPrecision = "highp";
            this.extensionStatements = [];
            this.definesFromMaterial = [];
            this.drawMode = function (gl) { return gl.STATIC_DRAW; };
            this.gl = gl;
            this.source = source;
            this.passFunctions = passFunctions;
            this.viewport = {
                x: 0, y: 0,
                width: gl.canvas.width,
                height: gl.canvas.height,
            };
        }
        Program.prototype.setFragmentShader = function (fragmentShader) {
            this.source.fragmentShader = fragmentShader;
            return this;
        };
        Program.prototype.setVertexShader = function (vertexShader) {
            this.source.vertexShader = vertexShader;
            return this;
        };
        Program.prototype.resetMaterialDefines = function (materiel) {
            var _material = materiel;
            for (var subdefines in _material.defines) {
                var define = _material.defines[subdefines](materiel);
                if (!!define) {
                    this.definesFromMaterial.push(define);
                }
            }
        };
        Program.prototype.make = function (scene) {
            var defines = [
                "#define OPEN_LIGHT",
                "#define LIGHT_NUM " + scene.lights.length,
                "#define DIR_LIGHT_NUM " + scene.dirctionLights.length,
                "#define SPOT_LIGHT_NUM " + scene.spotLights.length,
                "#define POINT_LIGHT_NUM " + scene.pointLights.length,
            ];
            for (var _i = 0, _a = this.definesFromMaterial; _i < _a.length; _i++) {
                var define = _a[_i];
                var defineLine = "#define " + define.name;
                if (!!define.value) {
                    defineLine += " " + define.value;
                }
                defines.push(defineLine);
                console.log(defineLine);
            }
            this.webGlProgram = CanvasToy.createEntileShader(this.gl, this.extensionStatements.join("\n")
                + "\nprecision " + this.vertexPrecision + " float;\n" + defines.join("\n") + "\n"
                + this.source.vertexShader, this.extensionStatements.join("\n")
                + "\nprecision " + this.fragmentPrecision + " float;\n" + defines.join("\n") + "\n"
                + this.source.fragmentShader);
            this.gl.useProgram(this.webGlProgram);
            var componets = this.passFunctions;
            this.faces = (componets.faces === undefined ? this.faces : componets.faces);
            this.uniforms = {};
            this.textures = [];
            if (!!componets.uniforms) {
                for (var nameInShader in componets.uniforms) {
                    if (componets.uniforms[nameInShader] !== undefined) {
                        this.addUniform(nameInShader, componets.uniforms[nameInShader]);
                    }
                }
            }
            if (!!componets.textures) {
                for (var sampler in componets.textures) {
                    var target = componets.textures[sampler];
                    if (target.isArray) {
                        this.addTextureArray(sampler, componets.textures[sampler]);
                    }
                    else {
                        this.addTexture(sampler, componets.textures[sampler]);
                    }
                }
            }
            for (var nameInShader in componets.attributes) {
                this.addAttribute(nameInShader, componets.attributes[nameInShader]);
            }
            return this;
        };
        Program.prototype.pass = function (mesh, camera, materiel) {
            this.gl.useProgram(this.webGlProgram);
            this.gl.viewport(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            for (var uniformName in this.uniforms) {
                if (this.uniforms[uniformName] !== undefined) {
                    this.uniforms[uniformName](mesh, camera, materiel);
                }
            }
            for (var uniformArrayName in this.uniformArrays) {
                if (this.uniformArrays[uniformArrayName] !== undefined) {
                    this.uniformArrays[uniformArrayName](mesh, camera, materiel);
                }
            }
            var unit = 0;
            for (var _i = 0, _a = this.textures; _i < _a.length; _i++) {
                var textureDiscriptor = _a[_i];
                var texture_1 = textureDiscriptor.getter(mesh, camera, materiel);
                if (!!texture_1) {
                    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
                    this.gl.bindTexture(texture_1.target, texture_1.glTexture);
                    this.gl.uniform1i(this.textures[unit].location, unit);
                }
                unit++;
            }
            for (var _b = 0, _c = this.textureArrays; _b < _c.length; _b++) {
                var textureArrayDiscriptor = _c[_b];
                var textureArray_1 = textureArrayDiscriptor.arrayGetter(mesh, camera, materiel);
                var indices = [];
                for (var index in textureArray_1) {
                    var texture_2 = textureArray_1[index];
                    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
                    this.gl.bindTexture(texture_2.target, texture_2.glTexture);
                    indices.push(unit++);
                }
                if (indices.length > 0) {
                    this.gl.uniform1iv(textureArrayDiscriptor.location, indices);
                }
            }
            for (var attributeName in this.attributes) {
                var attribute = this.attributes[attributeName](mesh, camera, materiel);
                this.gl.enableVertexAttribArray(this.attributeLocations[attributeName]);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
                this.gl.vertexAttribPointer(this.attributeLocations[attributeName], attribute.size, attribute.type, false, 0, 0);
            }
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
            this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.faces.data.length, this.gl.UNSIGNED_SHORT, 0);
            for (var attributeName in this.attributes) {
                var attribute = this.attributes[attributeName](mesh, camera, materiel);
                this.gl.disableVertexAttribArray(this.attributeLocations[attributeName]);
            }
            return this;
        };
        Program.prototype.checkState = function (mesh) {
            var maxIndex = 0;
            for (var _i = 0, _a = this.faces(mesh).data; _i < _a.length; _i++) {
                var index = _a[_i];
                maxIndex = Math.max(maxIndex, index);
            }
            for (var attributeName in this.attributes) {
                console.assert(this.attributes[attributeName](mesh).size <= 4
                    && this.attributes[attributeName](mesh).size >= 1, attributeName + "size error, now: " + this.attributes[attributeName].size + " should be 1-4");
                console.assert((maxIndex + 1) * this.attributes[attributeName](mesh).stride <=
                    this.attributes[attributeName](mesh).data.length, attributeName + " length error, now:" + this.attributes[attributeName](mesh).data.length
                    + ", should bigger than:" + (maxIndex + 1) * this.attributes[attributeName](mesh).stride);
            }
            return this;
        };
        Program.prototype.setAttribute0 = function (name) {
            this.attribute0 = name;
            this.gl.bindAttribLocation(this.webGlProgram, 0, name);
            return this;
        };
        Program.prototype.addTextureArray = function (samplerArray, arrayGetter) {
            var location = this.gl.getUniformLocation(this.webGlProgram, samplerArray);
            this.textureArrays.push({
                samplerArray: samplerArray,
                arrayGetter: arrayGetter,
                location: location,
            });
        };
        Program.prototype.addTexture = function (sampler, getter) {
            var unit = this.textures.length;
            this.textures.push({ sampler: sampler, getter: getter, location: this.gl.getUniformLocation(this.webGlProgram, sampler) });
        };
        Program.prototype.addUniformArray = function (arrayNameInShader, uniformArrayDiscriptor) {
            var _this = this;
            this.gl.useProgram(this.webGlProgram);
            var location = this.getUniformLocation(arrayNameInShader);
            if (location == null) {
                return this;
            }
            this.uniformArrays[arrayNameInShader] = function (mesh, camera, material) {
                _this.updateUniformArray(location, uniformArrayDiscriptor.updator(mesh, camera, material), uniformArrayDiscriptor.type);
            };
            return this;
        };
        Program.prototype.addUniform = function (nameInShader, uniform) {
            var _this = this;
            this.gl.useProgram(this.webGlProgram);
            var location = this.getUniformLocation(nameInShader);
            if (location == null) {
                return this;
            }
            this.uniforms[nameInShader] = function (mesh, camera, material) {
                _this.updateUniform(location, uniform.updator(mesh, camera, material), uniform.type);
            };
        };
        Program.prototype.deleteUniform = function (nameInShader) {
            this.uniforms[nameInShader] = undefined;
            return this;
        };
        Program.prototype.deleteAttribute = function (nameInShader) {
            this.attributes[nameInShader] = undefined;
            this.attributeLocations[nameInShader] = undefined;
            return this;
        };
        Program.prototype.addAttribute = function (nameInShader, attributeFun) {
            var location = this.getAttribLocation(nameInShader);
            if (location !== null && location !== -1) {
                this.attributes[nameInShader] = attributeFun;
                this.attributeLocations[nameInShader] = location;
            }
            return this;
        };
        Program.prototype.setViewPort = function (viewport) {
            this.viewport = viewport;
        };
        Program.prototype.updateUniformArray = function (location, value, type) {
            switch (type) {
                case CanvasToy.DataType.float:
                    this.gl.uniform1fv(location, value);
                    break;
                case CanvasToy.DataType.int:
                    this.gl.uniform1iv(location, value);
                    break;
                case CanvasToy.DataType.vec2:
                    this.gl.uniform2fv(location, value);
                    break;
                case CanvasToy.DataType.vec3:
                    this.gl.uniform3fv(location, value);
                    break;
                case CanvasToy.DataType.vec4:
                    this.gl.uniform4fv(location, value);
                    break;
                case CanvasToy.DataType.mat2:
                    this.gl.uniformMatrix2fv(location, false, value);
                case CanvasToy.DataType.mat3:
                    this.gl.uniformMatrix3fv(location, false, value);
                case CanvasToy.DataType.mat4:
                    this.gl.uniformMatrix4fv(location, false, value);
                    break;
                default: break;
            }
            return this;
        };
        Program.prototype.updateUniform = function (location, value, type) {
            switch (type) {
                case CanvasToy.DataType.float:
                    this.gl.uniform1f(location, value);
                    break;
                case CanvasToy.DataType.int:
                    this.gl.uniform1i(location, value);
                    break;
                case CanvasToy.DataType.vec2:
                    this.gl.uniform2f(location, value[0], value[1]);
                    break;
                case CanvasToy.DataType.vec3:
                    this.gl.uniform3f(location, value[0], value[1], value[2]);
                    break;
                case CanvasToy.DataType.vec4:
                    this.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    break;
                case CanvasToy.DataType.mat2:
                    this.gl.uniformMatrix2fv(location, false, value);
                case CanvasToy.DataType.mat3:
                    this.gl.uniformMatrix3fv(location, false, value);
                case CanvasToy.DataType.mat4:
                    this.gl.uniformMatrix4fv(location, false, value);
                    break;
                default: break;
            }
        };
        Program.prototype.getUniformLocation = function (name) {
            if (this.gl === undefined || this.gl === null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            if (!this.webGlProgram) {
                console.warn("program invalid");
            }
            var result = this.gl.getUniformLocation(this.webGlProgram, name);
            if (result === null) {
                console.log("uniform " + name + " not found!");
                return null;
            }
            return result;
        };
        Program.prototype.addPassProcesser = function (parameter) {
            this.faces = (parameter.faces === undefined ? this.faces : parameter.faces);
            for (var nameInShader in parameter.uniforms) {
                if (parameter.uniforms[nameInShader] !== undefined) {
                    this.addUniform(nameInShader, parameter.uniforms[nameInShader]);
                }
            }
            for (var sampler in parameter.textures) {
                this.textures[sampler] = parameter.textures[sampler];
            }
            for (var nameInShader in parameter.attributes) {
                this.addAttribute(nameInShader, parameter.attributes[nameInShader]);
            }
            return this;
        };
        Program.prototype.getAttribLocation = function (name) {
            if (this.gl === undefined || this.gl === null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = this.gl.getAttribLocation(this.webGlProgram, name);
            if (result === null) {
                console.error("attribute " + name + " not found!");
                return null;
            }
            return result;
        };
        return Program;
    }());
    CanvasToy.Program = Program;
    CanvasToy.defaultProgramPass = {
        faces: function (mesh) { return mesh.geometry.faces; },
        uniforms: {
            modelViewProjectionMatrix: {
                type: CanvasToy.DataType.mat4,
                updator: function (mesh, camera) {
                    return mat4.multiply(mat4.create(), camera.projectionMatrix, mat4.multiply(mat4.create(), camera.worldToObjectMatrix, mesh.matrix));
                },
            },
            modelViewMatrix: {
                type: CanvasToy.DataType.mat4,
                updator: function (mesh, camera) {
                    return mat4.multiply(mat4.create(), camera.worldToObjectMatrix, mesh.matrix);
                },
            },
            normalViewMatrix: {
                type: CanvasToy.DataType.mat4,
                updator: function (mesh, camera) {
                    return mat4.transpose(mat4.create(), mat4.invert(mat4.create(), mat4.mul(mat4.create(), camera.worldToObjectMatrix, mesh.matrix)));
                },
            },
        },
        attributes: {
            position: function (mesh) { return mesh.geometry.attributes.position; },
            aMainUV: function (mesh) { return mesh.geometry.attributes.uv; },
            aNormal: function (mesh) { return mesh.geometry.attributes.normal; },
        },
    };
})(CanvasToy || (CanvasToy = {}));
;
var CanvasToy;
(function (CanvasToy) {
    var Faces = (function () {
        function Faces(gl, data) {
            this.data = [];
            this.data = data;
            this.buffer = gl.createBuffer();
        }
        return Faces;
    }());
    CanvasToy.Faces = Faces;
    var Geometry = (function () {
        function Geometry(gl) {
            this.dirty = true;
            this.gl = gl;
            this.attributes = {
                position: new CanvasToy.Attribute(gl, { type: CanvasToy.DataType.float, size: 3, data: [] }),
                uv: new CanvasToy.Attribute(gl, { type: CanvasToy.DataType.float, size: 2, data: [] }),
                normal: new CanvasToy.Attribute(gl, { type: CanvasToy.DataType.float, size: 3, data: [] }),
                flatNormal: new CanvasToy.Attribute(gl, { type: CanvasToy.DataType.float, size: 3, data: [] }),
            };
            this.faces = { data: [], buffer: gl.createBuffer() };
        }
        Geometry.prototype.build = function () {
            return this;
        };
        Geometry.prototype.setAttribute = function (name, attribute) {
            this.attributes[name] = attribute;
            return this;
        };
        Geometry.prototype.addVertex = function (vertex) {
            for (var attributeName in this.attributes) {
                if (this.attributes[attributeName] !== undefined) {
                    if (vertex[attributeName] === undefined) {
                        continue;
                    }
                    if (vertex[attributeName].length !== this.attributes[attributeName].size) {
                        console.error("length " + attributeName + "wrong");
                        continue;
                    }
                    for (var _i = 0, _a = vertex[attributeName]; _i < _a.length; _i++) {
                        var comp = _a[_i];
                        this.attributes[attributeName].data.push(comp);
                    }
                }
            }
            return this;
        };
        Geometry.prototype.removeAttribute = function (name) {
            this.attributes[name] = undefined;
            return this;
        };
        Geometry.prototype.getVertexByIndex = function (index) {
            var vertex = {};
            for (var attributeName in this.attributes) {
                vertex[attributeName] = [];
                for (var i = 0; i < this.attributes[attributeName].stride; ++i) {
                    vertex[attributeName].push(this.attributes[attributeName].data[this.attributes[attributeName].stride * index + i]);
                }
            }
            return vertex;
        };
        Geometry.prototype.getTriangleByIndex = function (triangleIndex) {
            return [
                this.getVertexByIndex(triangleIndex * 3),
                this.getVertexByIndex(triangleIndex * 3 + 1),
                this.getVertexByIndex(triangleIndex * 3 + 2),
            ];
        };
        Geometry.prototype.generateFlatNormal = function () {
            for (var i = 0; i < this.faces.data.length; i += 3) {
                var triangle = this.getTriangleByIndex(i / 3);
                var flatX = (triangle[0].normals[0] + triangle[0].normals[1] + triangle[0].normals[2]) / 3;
                var flatY = (triangle[1].normals[0] + triangle[1].normals[1] + triangle[1].normals[2]) / 3;
                var flatZ = (triangle[2].normals[0] + triangle[0].normals[1] + triangle[2].normals[2]) / 3;
                var flat = [
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ,
                ];
                this.attributes.flatNormal.data = this.attributes.flatNormal.data.concat(flat);
            }
            return this;
        };
        return Geometry;
    }());
    CanvasToy.Geometry = Geometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Water = (function (_super) {
        __extends(Water, _super);
        function Water(gl) {
            return _super.call(this, new CanvasToy.Geometry(gl), [new CanvasToy.StandardMaterial(gl)]) || this;
        }
        return Water;
    }(CanvasToy.Mesh));
    CanvasToy.Water = Water;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var CubeGeometry = (function (_super) {
        __extends(CubeGeometry, _super);
        function CubeGeometry(gl) {
            var _this = _super.call(this, gl) || this;
            _this.attributes.position.data = [
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,
                1.0, -1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0,
            ];
            _this.attributes.uv.data = [
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,
                0, 1,
            ];
            _this.attributes.normal.data = [
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
            ];
            _this.faces.data = [
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23,
            ];
            return _this;
        }
        return CubeGeometry;
    }(CanvasToy.Geometry));
    CanvasToy.CubeGeometry = CubeGeometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var RectGeometry = (function (_super) {
        __extends(RectGeometry, _super);
        function RectGeometry(gl) {
            var _this = _super.call(this, gl) || this;
            _this.attributes.position.data = [
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, 1.0, 0.0,
            ];
            _this.attributes.uv.data = [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,
            ];
            _this.attributes.normal.data = [
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
            ];
            _this.faces.data = [
                0, 1, 2,
                2, 1, 3,
            ];
            return _this;
        }
        return RectGeometry;
    }(CanvasToy.Geometry));
    CanvasToy.RectGeometry = RectGeometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var SphereGeometry = (function (_super) {
        __extends(SphereGeometry, _super);
        function SphereGeometry(gl) {
            var _this = _super.call(this, gl) || this;
            _this._radius = 1;
            _this._widthSegments = 8;
            _this._heightSegments = 6;
            _this._phiStart = 0;
            _this._phiLength = Math.PI * 2;
            _this._thetaStart = 0;
            _this._thetaLength = Math.PI;
            return _this;
        }
        SphereGeometry.prototype.build = function () {
            var iy = 0;
            var ix = 0;
            var index = 0;
            var grid = [];
            var thetaEnd = this._thetaStart + this._thetaLength;
            for (iy = 0; iy <= this._heightSegments; iy++) {
                var verticesRow = [];
                var v = iy / this._heightSegments;
                for (ix = 0; ix <= this._widthSegments; ix++) {
                    var uv = [ix / this._widthSegments, 1 - iy / this._heightSegments];
                    var position = [
                        -this._radius * Math.cos(this._phiStart + uv[0] * this._phiLength)
                            * Math.sin(this._thetaStart + v * this._thetaLength),
                        this._radius * Math.cos(this._thetaStart + uv[1] * this._thetaLength),
                        this._radius * Math.sin(this._phiStart + uv[0] * this._phiLength)
                            * Math.sin(this._thetaStart + v * this._thetaLength),
                    ];
                    var normal = vec3.normalize([], position);
                    this.addVertex({ position: position, normal: normal, uv: uv });
                    verticesRow.push(index++);
                }
                grid.push(verticesRow);
            }
            for (iy = 0; iy < this._heightSegments; iy++) {
                for (ix = 0; ix < this._widthSegments; ix++) {
                    var a = grid[iy][ix + 1];
                    var b = grid[iy][ix];
                    var c = grid[iy + 1][ix];
                    var d = grid[iy + 1][ix + 1];
                    if (iy !== 0 || this._thetaStart > 0) {
                        this.faces.data.push(a, b, d);
                    }
                    if (iy !== this._heightSegments - 1 || thetaEnd < Math.PI) {
                        this.faces.data.push(b, c, d);
                    }
                }
            }
            return this;
        };
        Object.defineProperty(SphereGeometry.prototype, "radius", {
            get: function () { return this._radius; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereGeometry.prototype, "widthSegments", {
            get: function () { return this._widthSegments; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereGeometry.prototype, "heightSegments", {
            get: function () { return this._heightSegments; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereGeometry.prototype, "phiStart", {
            get: function () { return this._phiStart; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereGeometry.prototype, "phiLength", {
            get: function () { return this._phiLength; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereGeometry.prototype, "thetaStart", {
            get: function () { return this._thetaStart; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereGeometry.prototype, "thetaLength", {
            get: function () { return this._thetaLength; },
            enumerable: true,
            configurable: true
        });
        SphereGeometry.prototype.setRadius = function (radius) {
            this._radius = radius;
            return this;
        };
        SphereGeometry.prototype.setWidthSegments = function (widthSegments) {
            this._widthSegments = widthSegments;
            return this;
        };
        SphereGeometry.prototype.setHeightSegments = function (heightSegments) {
            this._heightSegments = heightSegments;
            return this;
        };
        SphereGeometry.prototype.setPhiStart = function (phiStart) {
            this._phiStart = phiStart;
            return this;
        };
        SphereGeometry.prototype.setPhiLength = function (phiLength) {
            this._phiLength = phiLength;
            return this;
        };
        SphereGeometry.prototype.setThetaStart = function (thetaStart) {
            this._thetaStart = thetaStart;
            return this;
        };
        SphereGeometry.prototype.setThetaLength = function (thetaLength) {
            this._thetaLength = thetaLength;
            return this;
        };
        return SphereGeometry;
    }(CanvasToy.Geometry));
    CanvasToy.SphereGeometry = SphereGeometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var TileGeometry = (function (_super) {
        __extends(TileGeometry, _super);
        function TileGeometry(gl) {
            var _this = _super.call(this, gl) || this;
            _this._widthSegments = 8;
            _this._heightSegments = 6;
            _this._width = 2;
            _this._height = 2;
            return _this;
        }
        TileGeometry.prototype.build = function () {
            var index = 0;
            var grid = [];
            for (var x = 0; x <= this._widthSegments; ++x) {
                var row = [];
                for (var y = 0; y <= this._heightSegments; ++y) {
                    var position = [
                        this._width * (x - this._widthSegments / 2) / this._widthSegments,
                        this._height * (y - this._heightSegments / 2) / this._heightSegments,
                        0,
                    ];
                    var uv = [x / this._widthSegments, y / this._heightSegments];
                    var normal = [0, 0, 1];
                    this.addVertex({ position: position, normal: normal, uv: uv });
                    row.push(index++);
                }
                grid.push(row);
            }
            for (var x = 0; x < this._widthSegments; ++x) {
                for (var y = 0; y < this._heightSegments; ++y) {
                    var a = grid[x][y];
                    var b = grid[x + 1][y];
                    var c = grid[x + 1][y + 1];
                    var d = grid[x][y + 1];
                    this.faces.data.push(a, b, c);
                    this.faces.data.push(a, d, c);
                }
            }
            return this;
        };
        return TileGeometry;
    }(CanvasToy.Geometry));
    CanvasToy.TileGeometry = TileGeometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light(gl) {
            var _this = _super.call(this) || this;
            _this._color = vec3.fromValues(1, 1, 1);
            _this._idensity = 1;
            _this._shadowType = CanvasToy.ShadowType.Hard;
            _this.gl = gl;
            _this.setShadowType(_this.shadowType);
            _this.setUpProjectionCamera();
            return _this;
        }
        Light.prototype.setColor = function (color) {
            this._color = color;
            return this;
        };
        Light.prototype.setIdensity = function (idensity) {
            this._idensity = idensity;
            return this;
        };
        Light.prototype.setShadowType = function (shadowType) {
            this._shadowType = shadowType;
            switch (shadowType) {
                case CanvasToy.ShadowType.Hard:
                    this.configShadowFrameBuffer();
                    break;
                case CanvasToy.ShadowType.Soft:
                    this.configShadowFrameBuffer();
                    break;
                default: break;
            }
            return this;
        };
        Object.defineProperty(Light.prototype, "shadowType", {
            get: function () {
                return this._shadowType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "shadowMap", {
            get: function () {
                return this._shadowMap;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "shadowFrameBuffer", {
            get: function () {
                return this._shadowFrameBuffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "projectCamera", {
            get: function () {
                return this._projectCamera;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "typename", {
            get: function () {
                return "Light";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "color", {
            get: function () {
                return this._color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "idensity", {
            get: function () {
                return this._idensity;
            },
            enumerable: true,
            configurable: true
        });
        Light.prototype.configShadowFrameBuffer = function () {
            if (!this._shadowFrameBuffer) {
                this._shadowFrameBuffer = new CanvasToy.FrameBuffer(this.gl).setWidth(1024).setHeight(1024);
                this._shadowFrameBuffer.attachments.color.disable();
                this._shadowFrameBuffer.attachments.depth.setType(this.gl, CanvasToy.AttachmentType.Texture);
                this._shadowMap = this._shadowFrameBuffer.attachments.depth.targetTexture
                    .setType(this.gl.UNSIGNED_SHORT)
                    .setFormat(this.gl.DEPTH_COMPONENT)
                    .setMinFilter(this.gl.LINEAR)
                    .setMagFilter(this.gl.LINEAR)
                    .setWrapS(this.gl.REPEAT)
                    .setWrapT(this.gl.REPEAT)
                    .bindTextureData(this.gl);
                this._shadowFrameBuffer.attach(this.gl);
            }
            return this;
        };
        return Light;
    }(CanvasToy.Object3d));
    __decorate([
        CanvasToy.uniform("color", CanvasToy.DataType.vec3)
    ], Light.prototype, "_color", void 0);
    __decorate([
        CanvasToy.uniform("idensity", CanvasToy.DataType.float)
    ], Light.prototype, "_idensity", void 0);
    CanvasToy.Light = Light;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var DirectionalLight = (function (_super) {
        __extends(DirectionalLight, _super);
        function DirectionalLight(gl) {
            var _this = _super.call(this, gl) || this;
            _this._direction = vec3.fromValues(1, 1, 1);
            _this._projectCamera = new CanvasToy.OrthoCamera();
            _this._projectCamera.setParent(_this);
            _this._projectCamera.setLocalPosition([0, 0, 0]);
            _this._projectCamera.setFar(1000);
            return _this;
        }
        Object.defineProperty(DirectionalLight.prototype, "typename", {
            get: function () {
                return "DirectionalLight";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectionalLight.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            enumerable: true,
            configurable: true
        });
        DirectionalLight.prototype.getProjecttionBoundingBox2D = function (camera) {
            return {
                left: -1,
                right: 1,
                top: 1,
                bottom: -1,
            };
        };
        DirectionalLight.prototype.setDirection = function (_direction) {
            vec3.normalize(this._direction, _direction);
            return this;
        };
        DirectionalLight.prototype.setUpProjectionCamera = function () {
            this._projectCamera = new CanvasToy.OrthoCamera()
                .setParent(this)
                .setLocalPosition([0, 0, 0])
                .adaptTargetRadio({ width: 1024, height: 1024 });
        };
        return DirectionalLight;
    }(CanvasToy.Light));
    __decorate([
        CanvasToy.uniform("direction", CanvasToy.DataType.vec3)
    ], DirectionalLight.prototype, "_direction", void 0);
    CanvasToy.DirectionalLight = DirectionalLight;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var PointLight = (function (_super) {
        __extends(PointLight, _super);
        function PointLight(gl) {
            var _this = _super.call(this, gl) || this;
            _this._position = vec3.create();
            _this._radius = 100;
            _this._squareAttenuation = 0.01;
            _this._linearAttenuation = 0.1;
            _this._constantAttenuation = 1;
            _this.volume = new CanvasToy.SphereGeometry(gl).setRadius(_this._radius).build();
            _this._shadowType = CanvasToy.ShadowType.None;
            return _this;
        }
        PointLight.prototype.getProjecttionBoundingBox2D = function (camera) {
            var viewMatrix = mat4.multiply(mat4.create(), camera.projectionMatrix, camera.worldToObjectMatrix);
            var viewDir = vec3.sub(vec3.create(), this.position, camera.position);
            var upSide = vec3.normalize(vec3.create(), camera.upVector);
            var rightSide = vec3.create();
            vec3.cross(rightSide, upSide, viewDir);
            vec3.normalize(rightSide, rightSide);
            vec3.scale(upSide, upSide, this.radius);
            vec3.scale(rightSide, rightSide, this.radius);
            var lightUpPoint = vec3.add(vec3.create(), this.position, upSide);
            var lightRightPoint = vec3.add(vec3.create(), this.position, rightSide);
            var screenPos = vec3.transformMat4(vec3.create(), this._position, viewMatrix);
            lightUpPoint = vec3.transformMat4(vec3.create(), lightUpPoint, viewMatrix);
            lightRightPoint = vec3.transformMat4(vec3.create(), lightRightPoint, viewMatrix);
            var screenH = Math.abs(vec3.len(vec3.sub(vec3.create(), lightUpPoint, screenPos)));
            var screenW = Math.abs(vec3.len(vec3.sub(vec3.create(), lightRightPoint, screenPos)));
            return {
                left: screenPos[0] - screenW,
                right: screenPos[0] + screenW,
                top: -screenPos[1] + screenH,
                bottom: -screenPos[1] - screenH,
            };
        };
        PointLight.prototype.setRadius = function (radius) {
            this._radius = radius;
            this.volume.setRadius(this._radius).build();
            return this;
        };
        Object.defineProperty(PointLight.prototype, "typename", {
            get: function () {
                return "PointLight";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointLight.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            enumerable: true,
            configurable: true
        });
        PointLight.prototype.setUpProjectionCamera = function () {
        };
        return PointLight;
    }(CanvasToy.Light));
    __decorate([
        CanvasToy.uniform("position", CanvasToy.DataType.vec3, function (light, camera) {
            return vec3.transformMat4(vec3.create(), light.position, mat4.mul(mat4.create(), camera.worldToObjectMatrix, light.matrix));
        })
    ], PointLight.prototype, "_position", void 0);
    __decorate([
        CanvasToy.uniform("radius", CanvasToy.DataType.float)
    ], PointLight.prototype, "_radius", void 0);
    __decorate([
        CanvasToy.uniform("squareAtten", CanvasToy.DataType.float)
    ], PointLight.prototype, "_squareAttenuation", void 0);
    __decorate([
        CanvasToy.uniform("linearAtten", CanvasToy.DataType.float)
    ], PointLight.prototype, "_linearAttenuation", void 0);
    __decorate([
        CanvasToy.uniform("constantAtten", CanvasToy.DataType.float)
    ], PointLight.prototype, "_constantAttenuation", void 0);
    CanvasToy.PointLight = PointLight;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var ShadowType;
    (function (ShadowType) {
        ShadowType[ShadowType["None"] = 0] = "None";
        ShadowType[ShadowType["Hard"] = 1] = "Hard";
        ShadowType[ShadowType["Soft"] = 2] = "Soft";
    })(ShadowType = CanvasToy.ShadowType || (CanvasToy.ShadowType = {}));
    ;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var SpotLight = (function (_super) {
        __extends(SpotLight, _super);
        function SpotLight(gl) {
            var _this = _super.call(this, gl) || this;
            _this._spotDirection = vec3.fromValues(0, 0, -1);
            _this.setConeAngle(Math.PI / 4);
            _this.setRadius(100);
            _this._shadowType = CanvasToy.ShadowType.Hard;
            return _this;
        }
        Object.defineProperty(SpotLight.prototype, "typename", {
            get: function () {
                return "SpotLight";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpotLight.prototype, "coneAngle", {
            get: function () {
                return this._coneAngle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpotLight.prototype, "spotDirection", {
            get: function () {
                return vec3.transformQuat(vec3.create(), this._spotDirection, mat4.getRotation(quat.create(), this.matrix));
            },
            enumerable: true,
            configurable: true
        });
        SpotLight.prototype.setRadius = function (radius) {
            _super.prototype.setRadius.call(this, radius);
            this._projectCamera.setFar(radius);
            return this;
        };
        SpotLight.prototype.setConeAngle = function (coneAngle) {
            this._coneAngle = coneAngle;
            this._coneAngleCos = Math.cos(coneAngle);
            this._projectCamera.setFovy(coneAngle * 2);
            return this;
        };
        SpotLight.prototype.setSpotDirection = function (spotDirection) {
            var lookPoint = vec3.add(vec3.create(), this.position, spotDirection);
            this._projectCamera.lookAt(lookPoint);
            return this;
        };
        SpotLight.prototype.getProjecttionBoundingBox2D = function (camera) {
            console.error("function getProjecttionBoundingBox2D has not been init");
            return {
                left: -1,
                right: 1,
                top: 1,
                bottom: -1,
            };
        };
        SpotLight.prototype.setUpProjectionCamera = function () {
            this._projectCamera = new CanvasToy.PerspectiveCamera()
                .setParent(this)
                .setLocalPosition([0, 0, 0])
                .adaptTargetRadio({ width: 1024, height: 1024 });
        };
        return SpotLight;
    }(CanvasToy.PointLight));
    __decorate([
        CanvasToy.uniform("coneAngleCos", CanvasToy.DataType.float)
    ], SpotLight.prototype, "_coneAngleCos", void 0);
    __decorate([
        CanvasToy.uniform("spotDir", CanvasToy.DataType.vec3, function (light, camera) {
            return vec3.transformQuat(vec3.create(), light._spotDirection, mat4.getRotation(quat.create(), mat4.multiply(mat4.create(), camera.worldToObjectMatrix, light.matrix)));
        })
    ], SpotLight.prototype, "_spotDirection", void 0);
    CanvasToy.SpotLight = SpotLight;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var patterns;
    (function (patterns) {
        patterns.num = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/mg;
        patterns.commentPattern = /#.*/mg;
    })(patterns = CanvasToy.patterns || (CanvasToy.patterns = {}));
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var StandardMaterial = (function (_super) {
        __extends(StandardMaterial, _super);
        function StandardMaterial(gl, paramter) {
            if (paramter === void 0) { paramter = {}; }
            var _this = _super.call(this) || this;
            _this.debug = false;
            _this.castShadow = true;
            _this.ambient = vec3.fromValues(0.1, 0.1, 0.1);
            _this.diffuse = vec3.fromValues(0.8, 0.8, 0.8);
            _this.specular = vec3.fromValues(0.3, 0.3, 0.3);
            _this.specularExponent = 64;
            _this.transparency = 0;
            _this.reflectivity = 0.5;
            _this.program = new CanvasToy.ShaderBuilder().build(gl);
            if (!!paramter) {
                for (var name_1 in paramter) {
                    _this[name_1] = paramter[name_1];
                }
            }
            return _this;
        }
        return StandardMaterial;
    }(CanvasToy.Material));
    __decorate([
        CanvasToy.linkdef("_DEBUG")
    ], StandardMaterial.prototype, "debug", void 0);
    __decorate([
        CanvasToy.linkdef("USE_SHADOW")
    ], StandardMaterial.prototype, "castShadow", void 0);
    __decorate([
        CanvasToy.linkdef("_MAIN_TEXTURE"),
        CanvasToy.texture("uMainTexture")
    ], StandardMaterial.prototype, "mainTexture", void 0);
    __decorate([
        CanvasToy.uniform("ambient", CanvasToy.DataType.vec3)
    ], StandardMaterial.prototype, "ambient", void 0);
    __decorate([
        CanvasToy.uniform("materialDiff", CanvasToy.DataType.vec3)
    ], StandardMaterial.prototype, "diffuse", void 0);
    __decorate([
        CanvasToy.uniform("materialSpec", CanvasToy.DataType.vec3)
    ], StandardMaterial.prototype, "specular", void 0);
    __decorate([
        CanvasToy.uniform("materialSpecExp", CanvasToy.DataType.float)
    ], StandardMaterial.prototype, "specularExponent", void 0);
    __decorate([
        CanvasToy.readyRequire
    ], StandardMaterial.prototype, "bumpMap", void 0);
    __decorate([
        CanvasToy.readyRequire
    ], StandardMaterial.prototype, "displamentMap", void 0);
    __decorate([
        CanvasToy.readyRequire
    ], StandardMaterial.prototype, "stencilMap", void 0);
    __decorate([
        CanvasToy.uniform("reflectivity", CanvasToy.DataType.float)
    ], StandardMaterial.prototype, "reflectivity", void 0);
    __decorate([
        CanvasToy.linkdef("_ENVIRONMENT_MAP"),
        CanvasToy.texture("uCubeTexture")
    ], StandardMaterial.prototype, "reflectionMap", void 0);
    CanvasToy.StandardMaterial = StandardMaterial;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var MTLLoader = (function () {
        function MTLLoader() {
        }
        MTLLoader.load = function (gl, baseurl) {
            var materials = {};
            var currentMaterial = null;
            var home = baseurl.substr(0, baseurl.lastIndexOf("/") + 1);
            return CanvasToy.fetchRes(baseurl).then(function (content) {
                content = content.replace(CanvasToy.patterns.commentPattern, "");
                content.split("\n").forEach(function (line) {
                    currentMaterial = MTLLoader.handleSingleLine(gl, home, line, materials, currentMaterial);
                });
                return Promise.resolve(materials);
            });
        };
        MTLLoader.handleSingleLine = function (gl, home, line, materials, currentMaterial) {
            if (line.length === 0) {
                return;
            }
            var firstVar = line.match(/([^\s]+)/g)[0];
            switch (firstVar) {
                case "newmtl":
                    var mtlName = line.match(MTLLoader.newmtlPattern)[1];
                    materials[mtlName] = new CanvasToy.StandardMaterial(gl);
                    return materials[mtlName];
                case "Ka":
                    currentMaterial.ambient = MTLLoader.getVector(MTLLoader.ambientPattern, line);
                    break;
                case "Kd":
                    currentMaterial.diffuse = MTLLoader.getVector(MTLLoader.diffusePattern, line);
                    break;
                case "Ks":
                    currentMaterial.specular = MTLLoader.getVector(MTLLoader.specularePattern, line);
                    break;
                case "Ns":
                    currentMaterial.specularExponent =
                        MTLLoader.getNumber(MTLLoader.specularExponentPattern, line);
                    break;
                case "map_Ka":
                    currentMaterial.mainTexture = new CanvasToy.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "map_Ka":
                    currentMaterial.alphaMap = new CanvasToy.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "map_Kd":
                    currentMaterial.mainTexture = new CanvasToy.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "map_bump":
                    currentMaterial.bumpMap = new CanvasToy.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "bump":
                    currentMaterial.bumpMap = new CanvasToy.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "disp":
                    currentMaterial.displamentMap = new CanvasToy.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "decal":
                    currentMaterial.stencilMap = new CanvasToy.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                default: break;
            }
            return currentMaterial;
        };
        MTLLoader.getImageUrl = function (line) {
            var matches = line.match(MTLLoader.mapSinglePattern);
            return matches[2];
        };
        MTLLoader.getVector = function (pattern, line) {
            var matches = line.match(pattern);
            var vector = [];
            if (matches.length > 0) {
                matches[1].match(CanvasToy.patterns.num).forEach(function (numStr) {
                    if (numStr !== "") {
                        vector.push(parseFloat(numStr));
                    }
                });
            }
            return vector;
        };
        MTLLoader.getNumber = function (pattern, line) {
            var matches = line.match(pattern);
            if (matches.length > 0) {
                return parseFloat(matches[1].match(CanvasToy.patterns.num)[0]);
            }
            return 0;
        };
        return MTLLoader;
    }());
    MTLLoader.newmtlPattern = /newmtl\s(.+)/m;
    MTLLoader.ambientPattern = /Ka\s(.+)/m;
    MTLLoader.diffusePattern = /Kd\s(.+)/m;
    MTLLoader.specularePattern = /Ks\s(.+)/m;
    MTLLoader.specularExponentPattern = /Ns\s(.+)/m;
    MTLLoader.trancparencyPattern = /(Tr|d)\s(.+)/m;
    MTLLoader.mapPattern = /(map_[^\s]+|bump|disp|decal)\s.+/mg;
    MTLLoader.mapSinglePattern = /(map_[^\s]+|bump|disp|decal)\s([^\s]+)/m;
    CanvasToy.MTLLoader = MTLLoader;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var OBJLoader = (function () {
        function OBJLoader() {
        }
        OBJLoader.load = function (gl, url) {
            var container = new CanvasToy.Object3d();
            container.setAsyncFinished(CanvasToy.fetchRes(url).then(function (content) {
                content = content.replace(CanvasToy.patterns.commentPattern, "");
                var home = url.substr(0, url.lastIndexOf("/") + 1);
                var materialLibs = content.match(OBJLoader.mtlLibPattern);
                var materialsMixin = {};
                var promises = [];
                if (materialLibs != null) {
                    for (var _i = 0, materialLibs_1 = materialLibs; _i < materialLibs_1.length; _i++) {
                        var mtlLib = materialLibs_1[_i];
                        var mtlurl = home + mtlLib.match(OBJLoader.mtlLibSinglePattern)[1];
                        promises.push(CanvasToy.MTLLoader.load(gl, mtlurl));
                    }
                }
                return Promise.all(promises).then(function (materialLibs) {
                    for (var _i = 0, materialLibs_2 = materialLibs; _i < materialLibs_2.length; _i++) {
                        var materials = materialLibs_2[_i];
                        CanvasToy.mixin(materialsMixin, materials);
                    }
                    var positionlines = content.match(OBJLoader.vertexPattern);
                    var uvlines = content.match(OBJLoader.uvPattern);
                    var normallines = content.match(OBJLoader.normalPattern);
                    var unIndexedPositions = OBJLoader.praiseAttibuteLines(positionlines);
                    var unIndexedUVs = OBJLoader.praiseAttibuteLines(uvlines);
                    var unIndexedNormals = OBJLoader.praiseAttibuteLines(normallines);
                    OBJLoader.buildUpMeshes(gl, container, content, materialsMixin, unIndexedPositions, unIndexedUVs, unIndexedNormals);
                    return Promise.resolve(container);
                });
            }));
            return container;
        };
        OBJLoader.praiseAttibuteLines = function (lines) {
            var result = [];
            if (lines === null) {
                return;
            }
            lines.forEach(function (expression) {
                var data = [];
                expression.match(CanvasToy.patterns.num).forEach(function (floatNum) {
                    if (expression !== "") {
                        data.push(parseFloat(floatNum));
                    }
                });
                result.push(data);
            });
            return result;
        };
        OBJLoader.parseAsTriangle = function (faces, forEachFace) {
            for (var i = 0; i < faces.length - 2; ++i) {
                var triangleFace = [faces[0], faces[i + 1], faces[i + 2]];
                forEachFace(triangleFace);
            }
        };
        OBJLoader.buildUpMeshes = function (gl, container, content, materials, unIndexedPositions, unIndexedUVs, unIndexedNormals) {
            var objects = content.split(OBJLoader.objectSplitPattern);
            objects.splice(0, 1);
            objects.forEach(function (objectContent) {
                var geometry = new CanvasToy.Geometry(gl);
                var faces = objectContent.match(OBJLoader.indexPattern);
                if (faces !== null) {
                    faces.forEach(function (faceStr) {
                        OBJLoader.parseAsTriangle(faceStr.match(OBJLoader.faceSplitVertPattern), function (triangleFaces) {
                            triangleFaces.forEach(function (perVertData) {
                                var match = perVertData.match(OBJLoader.facePerVertPattern);
                                console.assert(match !== null && match[1] !== null, "obj file error");
                                var positionIndex = parseInt(match[1], 0) - 1;
                                geometry.faces.data.push(geometry.attributes.position.data.length / 3);
                                geometry.addVertex({
                                    position: unIndexedPositions[positionIndex],
                                    uv: [unIndexedUVs[parseInt(match[2], 0) - 1][0],
                                        unIndexedUVs[parseInt(match[2], 0) - 1][1]],
                                    normal: unIndexedNormals[parseInt(match[3], 0) - 1],
                                });
                            });
                        });
                    });
                }
                var meshMaterials = [];
                var mtls = objectContent.match(OBJLoader.useMTLPattern);
                if (!!mtls) {
                    mtls.forEach(function (useMTLLine) {
                        meshMaterials.push(materials[useMTLLine.match(OBJLoader.useMTLSinglePattern)[1]]);
                    });
                }
                else {
                    meshMaterials.push(new CanvasToy.StandardMaterial(gl));
                }
                var mesh = new CanvasToy.Mesh(geometry, meshMaterials);
                mesh.setParent(container);
            });
        };
        return OBJLoader;
    }());
    OBJLoader.faceSplitVertPattern = /([0-9]|\/|\-)+/g;
    OBJLoader.facePerVertPattern = /([0-9]*)\/?([0-9]*)\/?([0-9]*)/;
    OBJLoader.objectSplitPattern = /[o|g]\s+.+/mg;
    OBJLoader.mtlLibPattern = /mtllib\s([^\s]+)/mg;
    OBJLoader.useMTLPattern = /usemtl\s([^\s]+)/mg;
    OBJLoader.mtlLibSinglePattern = /mtllib\s([^\s]+)/;
    OBJLoader.useMTLSinglePattern = /usemtl\s([^\s]+)/;
    OBJLoader.vertexPattern = /v\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
    OBJLoader.uvPattern = /vt\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
    OBJLoader.normalPattern = /vn\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
    OBJLoader.indexPattern = /f\s+([-+]?[0-9]*\.?[0-9]+ ?|\/)+/mg;
    CanvasToy.OBJLoader = OBJLoader;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    function fetchRes(url) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(request.responseText);
                }
            };
            request.open("GET", url);
            request.send();
        });
    }
    CanvasToy.fetchRes = fetchRes;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var DepthMaterial = (function (_super) {
        __extends(DepthMaterial, _super);
        function DepthMaterial(gl) {
            var _this = _super.call(this) || this;
            _this.program = new CanvasToy.ShaderBuilder()
                .resetShaderLib()
                .addShaderLib(CanvasToy.ShaderSource.calculators__linearlize_depth_glsl)
                .setShadingFrag(CanvasToy.ShaderSource.interploters__depth_phong_frag)
                .setShadingVert(CanvasToy.ShaderSource.interploters__depth_phong_vert)
                .setPass({
                uniforms: {
                    modelViewProjectionMatrix: CanvasToy.defaultProgramPass.uniforms.modelViewProjectionMatrix,
                    modelViewMatrix: CanvasToy.defaultProgramPass.uniforms.modelViewMatrix,
                    cameraFar: {
                        type: CanvasToy.DataType.float,
                        updator: function (mesh, lightCamera) { return lightCamera.far; },
                    },
                    cameraNear: {
                        type: CanvasToy.DataType.float,
                        updator: function (mesh, lightCamera) { return lightCamera.near; },
                    },
                },
                attributes: {
                    position: CanvasToy.defaultProgramPass.attributes.position,
                },
            })
                .build(gl);
            return _this;
        }
        return DepthMaterial;
    }(CanvasToy.Material));
    CanvasToy.DepthMaterial = DepthMaterial;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var SkyMaterial = (function (_super) {
        __extends(SkyMaterial, _super);
        function SkyMaterial(gl, cubeTexture) {
            var _this = _super.call(this) || this;
            _this.cubeTexture = cubeTexture;
            _this.program = new CanvasToy.ShaderBuilder()
                .resetShaderLib()
                .setShadingVert(CanvasToy.ShaderSource.interploters__forward__skybox_vert)
                .setShadingFrag(CanvasToy.ShaderSource.interploters__forward__skybox_frag)
                .setPass({
                faces: function (mesh) { return mesh.geometry.faces; },
                uniforms: {
                    modelViewProjectionMatrix: {
                        type: CanvasToy.DataType.mat4,
                        updator: function (mesh, camera) {
                            return mat4.multiply(mat4.create(), camera.projectionMatrix, mat4.multiply(mat4.create(), camera.worldToObjectMatrix, mesh.matrix));
                        },
                    },
                },
                attributes: {
                    position: function (mesh) { return mesh.geometry.attributes.position; },
                },
            })
                .build(gl);
            return _this;
        }
        return SkyMaterial;
    }(CanvasToy.Material));
    __decorate([
        CanvasToy.texture("uCubeTexture")
    ], SkyMaterial.prototype, "cubeTexture", void 0);
    CanvasToy.SkyMaterial = SkyMaterial;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Scene = (function () {
        function Scene() {
            this.objects = [];
            this.lights = [];
            this.pointLights = [];
            this.spotLights = [];
            this.dirctionLights = [];
            this.pointShadowMaps = [];
            this.pointShadowMatrices = new Float32Array([]);
            this.spotShadowMaps = [];
            this.spotShadowMatrices = new Float32Array([]);
            this.directionShadowMaps = [];
            this.directShadowMatrices = new Float32Array([]);
            this.ambientLight = vec3.fromValues(0, 0, 0);
            this.openLight = false;
            this.clearColor = [0, 0, 0, 0];
            this.programSetUp = false;
            this.updateEvents = [];
        }
        Scene.prototype.update = function (dt) {
            for (var _i = 0, _a = this.updateEvents; _i < _a.length; _i++) {
                var event_1 = _a[_i];
                if (!!event_1) {
                    event_1(dt);
                }
            }
        };
        Scene.prototype.addOnUpdateListener = function (listener) {
            this.updateEvents.push(listener);
            return this;
        };
        Scene.prototype.removeOnUpdateListener = function (listener) {
            var index = this.updateEvents.indexOf(listener);
            if (index !== -1) {
                this.updateEvents[index] = undefined;
            }
            return this;
        };
        Scene.prototype.addObject = function () {
            var _this = this;
            var objects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objects[_i] = arguments[_i];
            }
            for (var _a = 0, objects_1 = objects; _a < objects_1.length; _a++) {
                var object = objects_1[_a];
                if (this.objects.indexOf(object) === -1) {
                    this.objects.push(object);
                    object.scene = this;
                    object.children.forEach(function (child) {
                        _this.addObject(child);
                    });
                }
            }
            return this;
        };
        Scene.prototype.removeObject = function (object) {
            var _this = this;
            object.children.forEach(function (child) {
                _this.removeObject(child);
            });
            this.objects.splice(this.objects.indexOf(object));
            return this;
        };
        Scene.prototype.addLight = function () {
            var lights = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                lights[_i] = arguments[_i];
            }
            this.openLight = true;
            for (var _a = 0, lights_1 = lights; _a < lights_1.length; _a++) {
                var light = lights_1[_a];
                this.lights.push(light);
                if (light.typename === "DirectionalLight") {
                    this.dirctionLights.push(light);
                }
                else if (light.typename === "PointLight") {
                    this.pointLights.push(light);
                }
                else if (light.typename === "SpotLight") {
                    this.spotLights.push(light);
                }
                else {
                    console.assert(false, "un-recognize light type: " + light);
                }
                light.scene = this;
            }
        };
        return Scene;
    }());
    __decorate([
        CanvasToy.textureArray("pointShadowMaps")
    ], Scene.prototype, "pointShadowMaps", void 0);
    __decorate([
        CanvasToy.uniformArray("pointShadowMatrices", CanvasToy.DataType.mat4)
    ], Scene.prototype, "pointShadowMatrices", void 0);
    __decorate([
        CanvasToy.textureArray("spotShadowMaps")
    ], Scene.prototype, "spotShadowMaps", void 0);
    __decorate([
        CanvasToy.uniformArray("spotShadowMatrices", CanvasToy.DataType.mat4)
    ], Scene.prototype, "spotShadowMatrices", void 0);
    __decorate([
        CanvasToy.textureArray("directionShadowMaps")
    ], Scene.prototype, "directionShadowMaps", void 0);
    __decorate([
        CanvasToy.uniformArray("directShadowMatrices", CanvasToy.DataType.mat4)
    ], Scene.prototype, "directShadowMatrices", void 0);
    CanvasToy.Scene = Scene;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Graphics;
    (function (Graphics) {
        function addUniformContainer(program, uniformContainer) {
            if (Array.isArray(uniformContainer.uniforms)) {
                var _loop_1 = function (uniformProperty) {
                    if (uniformProperty.updator(uniformContainer) !== undefined) {
                        program.addUniform(uniformProperty.name, {
                            type: uniformProperty.type,
                            updator: function () {
                                return uniformProperty.updator(uniformContainer);
                            },
                        });
                    }
                };
                for (var _i = 0, _a = uniformContainer.uniforms; _i < _a.length; _i++) {
                    var uniformProperty = _a[_i];
                    _loop_1(uniformProperty);
                }
            }
            if (Array.isArray(uniformContainer.uniformArray)) {
                var _loop_2 = function (uniformArrayProperty) {
                    if (uniformArrayProperty.updator(uniformContainer) !== undefined) {
                        program.addUniformArray(uniformArrayProperty.name, {
                            type: uniformArrayProperty.type,
                            updator: function () { return uniformArrayProperty.updator(uniformContainer); },
                        });
                    }
                };
                for (var _b = 0, _c = uniformContainer.uniformArray; _b < _c.length; _b++) {
                    var uniformArrayProperty = _c[_b];
                    _loop_2(uniformArrayProperty);
                }
            }
        }
        Graphics.addUniformContainer = addUniformContainer;
        function addTextureContainer(program, textureContainer) {
            if (Array.isArray(textureContainer.textures)) {
                var _loop_3 = function (textureDiscriptor) {
                    if (textureDiscriptor.getter(textureContainer) !== undefined) {
                        program.addTexture(textureDiscriptor.name, function () { return textureDiscriptor.getter(textureContainer); });
                    }
                };
                for (var _i = 0, _a = textureContainer.textures; _i < _a.length; _i++) {
                    var textureDiscriptor = _a[_i];
                    _loop_3(textureDiscriptor);
                }
            }
            if (Array.isArray(textureContainer.textureArrays)) {
                var _loop_4 = function (textureArrayDiscriptor) {
                    if (textureArrayDiscriptor.arrayGetter(textureContainer) !== undefined) {
                        program.addTextureArray(textureArrayDiscriptor.name, function () { return textureArrayDiscriptor.arrayGetter(textureContainer); });
                    }
                };
                for (var _b = 0, _c = textureContainer.textureArrays; _b < _c.length; _b++) {
                    var textureArrayDiscriptor = _c[_b];
                    _loop_4(textureArrayDiscriptor);
                }
            }
        }
        Graphics.addTextureContainer = addTextureContainer;
        function copyDataToVertexBuffer(gl, geometry) {
            if (geometry.dirty) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.faces.buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.faces.data), gl.STATIC_DRAW);
                for (var name_2 in geometry.attributes) {
                    var attribute = geometry.attributes[name_2];
                    if (attribute !== undefined) {
                        gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attribute.data), gl.STATIC_DRAW);
                        console.log(name_2 + " buffer size: ", "" + gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));
                    }
                }
                geometry.dirty = false;
            }
        }
        Graphics.copyDataToVertexBuffer = copyDataToVertexBuffer;
        function logEnabledAttribute(gl, program) {
            for (var i = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) - 1; i >= 0; i--) {
                console.dir(gl.getActiveAttrib(program, i));
            }
        }
        Graphics.logEnabledAttribute = logEnabledAttribute;
        function logIfFrameBufferInvalid(gl, frameBuffer) {
            var valid = false;
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            switch (status) {
                case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                    console.error("gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: The attachment types are mismatched\n                    or not all framebuffer attachment points are framebuffer attachment complete.");
                    break;
                case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                    console.error("gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: There is no attachment.");
                    break;
                case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                    console.error("gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: Height and width of the attachment are not the same.");
                    break;
                case gl.FRAMEBUFFER_UNSUPPORTED:
                    console.error("gl.FRAMEBUFFER_UNSUPPORTED: The format of the attachment is not supported,\n                    or if depth and stencil attachments are not the same renderbuffer.");
                    break;
                default:
                    valid = true;
                    break;
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return valid;
        }
        Graphics.logIfFrameBufferInvalid = logIfFrameBufferInvalid;
    })(Graphics = CanvasToy.Graphics || (CanvasToy.Graphics = {}));
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var DeferredProcessor = (function () {
        function DeferredProcessor(gl, ext, scene, camera) {
            this.tilePixelSize = 32;
            this.tileLightIndex = [];
            this.linearLightIndex = [];
            this.gl = gl;
            this.ext = ext;
            this.gBuffer = new CanvasToy.FrameBuffer(gl);
            this.horizontalTileNum = Math.floor(this.gl.canvas.width / this.tilePixelSize);
            this.verticalTileNum = Math.floor(this.gl.canvas.height / this.tilePixelSize);
            this.tileCount = this.horizontalTileNum * this.verticalTileNum;
            this.initGeometryProcess(scene);
            this.initTiledPass(scene);
            scene.programSetUp = true;
        }
        DeferredProcessor.prototype.process = function (scene, camera, materials) {
            CanvasToy.Graphics.logIfFrameBufferInvalid(this.gl, this.gBuffer.glFramebuffer);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.gBuffer.glFramebuffer);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.cullFace(this.gl.BACK);
            this.gl.disable(this.gl.BLEND);
            this.gl.depthFunc(this.gl.LESS);
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (object instanceof CanvasToy.Mesh) {
                    var mesh = object;
                    for (var _b = 0, _c = mesh.materials; _b < _c.length; _b++) {
                        var material = _c[_b];
                        if (material instanceof CanvasToy.StandardMaterial) {
                            if (material.dirty) {
                                material.geometryProgram.resetMaterialDefines(material);
                                material.geometryProgram.make(mesh.scene);
                                CanvasToy.Graphics.addUniformContainer(material.geometryProgram, object);
                                CanvasToy.Graphics.addUniformContainer(material.geometryProgram, material);
                                material.dirty = false;
                            }
                            material.geometryProgram.pass(mesh, camera, material);
                        }
                    }
                }
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            this.gl.disable(this.gl.DEPTH_TEST);
            this.gl.enable(this.gl.BLEND);
            this.gl.depthFunc(this.gl.EQUAL);
            this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
            this.tileLightPass(scene, camera);
        };
        DeferredProcessor.prototype.initGeometryProcess = function (scene) {
            this.gBuffer.attachments.color.disable();
            this.gBuffer.attachments.depth
                .setType(this.gl, CanvasToy.AttachmentType.Texture)
                .targetTexture
                .setType(this.gl.UNSIGNED_SHORT)
                .setFormat(this.gl.DEPTH_COMPONENT)
                .bindTextureData(this.gl);
            this.gBuffer.extras.push(new CanvasToy.Attachment(this.gBuffer, function (ext) { return ext.COLOR_ATTACHMENT0_WEBGL; })
                .setType(this.gl, CanvasToy.AttachmentType.Texture), new CanvasToy.Attachment(this.gBuffer, function (ext) { return ext.COLOR_ATTACHMENT1_WEBGL; })
                .setType(this.gl, CanvasToy.AttachmentType.Texture));
            for (var _i = 0, _a = this.gBuffer.extras; _i < _a.length; _i++) {
                var colorAttach = _a[_i];
                colorAttach.targetTexture
                    .setType(this.gl.FLOAT)
                    .setFormat(this.gl.RGBA)
                    .setMinFilter(this.gl.NEAREST)
                    .setMagFilter(this.gl.NEAREST)
                    .bindTextureData(this.gl);
            }
            this.gBuffer.attach(this.gl, this.ext.draw_buffer);
            for (var _b = 0, _c = scene.objects; _b < _c.length; _b++) {
                var object = _c[_b];
                if (object instanceof CanvasToy.Mesh) {
                    var geometryProgram = new CanvasToy.ShaderBuilder()
                        .resetShaderLib()
                        .setShadingVert(CanvasToy.ShaderSource.interploters__deferred__geometry_vert)
                        .setShadingFrag(CanvasToy.ShaderSource.interploters__deferred__geometry_frag)
                        .build(this.gl);
                    for (var _d = 0, _e = object.materials; _d < _e.length; _d++) {
                        var material = _e[_d];
                        if (material instanceof CanvasToy.StandardMaterial) {
                            geometryProgram.extensionStatements.push("#extension GL_EXT_draw_buffers : require");
                            geometryProgram.make(scene);
                            CanvasToy.Graphics.addUniformContainer(geometryProgram, object);
                            CanvasToy.Graphics.addUniformContainer(geometryProgram, material);
                            material.geometryProgram = geometryProgram;
                        }
                    }
                }
            }
        };
        DeferredProcessor.prototype.tileLightPass = function (scene, camera) {
            var lightColors = [];
            var lightPositionRadius = [];
            for (var _i = 0, _a = scene.pointLights; _i < _a.length; _i++) {
                var light = _a[_i];
                lightColors.push(light.color[0], light.color[1], light.color[2], light.idensity);
                var lightPosInViewSpace = vec3.transformMat4(vec3.create(), light.position, camera.worldToObjectMatrix);
                lightPositionRadius.push(lightPosInViewSpace[0], lightPosInViewSpace[1], lightPosInViewSpace[2], light.radius);
            }
            this.lightColorIdensityMap.resetData(this.gl, new Float32Array(lightColors), lightColors.length / 4, 1);
            this.lightPositionRadiusMap.resetData(this.gl, new Float32Array(lightPositionRadius), lightPositionRadius.length / 4, 1);
            for (var i = 0; i < this.tileCount; ++i) {
                this.tileLightIndex[i] = [];
            }
            this.linearLightIndex = [];
            for (var i = 0; i < scene.pointLights.length; ++i) {
                var light = scene.pointLights[i];
                var box = light.getProjecttionBoundingBox2D(camera);
                this.fillTileWithBoundingBox2D(camera, box, i);
            }
            var lightOffsetCount = [];
            var offset = 0;
            for (var _b = 0, _c = this.tileLightIndex; _b < _c.length; _b++) {
                var indices = _c[_b];
                lightOffsetCount.push(offset);
                lightOffsetCount.push(indices.length);
                offset += indices.length;
                for (var _d = 0, indices_1 = indices; _d < indices_1.length; _d++) {
                    var index = indices_1[_d];
                    this.linearLightIndex.push(index / scene.pointLights.length);
                }
            }
            this.tileLightIndexMap.resetData(this.gl, new Float32Array(this.linearLightIndex), this.linearLightIndex.length, 1);
            this.tileLightOffsetCountMap.resetData(this.gl, new Float32Array(lightOffsetCount), this.horizontalTileNum, this.verticalTileNum);
            this.tileProgram.pass(this.tile, camera, null);
        };
        DeferredProcessor.prototype.initTiledPass = function (scene) {
            var _this = this;
            if (this.tile === undefined) {
                this.tile = new CanvasToy.Mesh(new CanvasToy.RectGeometry(this.gl).build(), []);
            }
            for (var i = 0; i < this.horizontalTileNum; ++i) {
                for (var j = 0; j < this.verticalTileNum; ++j) {
                    this.tileLightIndex.push([]);
                }
            }
            this.tileLightIndexMap = new CanvasToy.DataTexture(this.gl, new Float32Array([]))
                .setFormat(this.gl.LUMINANCE)
                .setType(this.gl.FLOAT);
            this.tileLightOffsetCountMap = new CanvasToy.DataTexture(this.gl, new Float32Array([]), this.horizontalTileNum, this.verticalTileNum)
                .setFormat(this.gl.LUMINANCE_ALPHA)
                .setType(this.gl.FLOAT);
            this.tileLightCountMap = new CanvasToy.DataTexture(this.gl, new Uint8Array([]), this.horizontalTileNum, this.verticalTileNum).setFormat(this.gl.LUMINANCE).setType(this.gl.UNSIGNED_BYTE);
            this.lightColorIdensityMap = new CanvasToy.DataTexture(this.gl, new Float32Array([]))
                .setType(this.gl.FLOAT)
                .setFormat(this.gl.RGBA);
            this.lightPositionRadiusMap = new CanvasToy.DataTexture(this.gl, new Float32Array([]))
                .setType(this.gl.FLOAT)
                .setFormat(this.gl.RGBA);
            this.tileProgram = new CanvasToy.ShaderBuilder()
                .resetShaderLib()
                .addShaderLibFrag(CanvasToy.ShaderSource.calculators__blinn_phong_glsl)
                .setShadingVert(CanvasToy.ShaderSource.interploters__deferred__tiledLight_vert)
                .setShadingFrag(CanvasToy.ShaderSource.interploters__deferred__tiledLight_frag)
                .setPass({
                faces: function () { return _this.tile.geometry.faces; },
                uniforms: {
                    cameraFar: {
                        type: CanvasToy.DataType.float,
                        updator: function (mesh, camera) { return camera.far; },
                    },
                    cameraNear: {
                        type: CanvasToy.DataType.float,
                        updator: function (mesh, camera) { return camera.near; },
                    },
                    inverseProjection: {
                        type: CanvasToy.DataType.mat4,
                        updator: function (mesh, camera) { return mat4.invert(mat4.create(), camera.projectionMatrix); },
                    },
                    uLightListLengthSqrt: {
                        type: CanvasToy.DataType.float,
                        updator: function () { return _this.linearLightIndex.length; },
                    },
                    uHorizontalTileNum: {
                        type: CanvasToy.DataType.float,
                        updator: function () { return _this.horizontalTileNum; },
                    },
                    uVerticalTileNum: {
                        type: CanvasToy.DataType.float,
                        updator: function () { return _this.verticalTileNum; },
                    },
                    uTotalLightNum: {
                        type: CanvasToy.DataType.float,
                        updator: function () { return scene.pointLights.length; },
                    },
                },
                textures: {
                    uNormalDepthSE: function () { return _this.gBuffer.extras[0].targetTexture; },
                    uDiffSpec: function () { return _this.gBuffer.extras[1].targetTexture; },
                    uLightOffsetCount: function () { return _this.tileLightOffsetCountMap; },
                    uLightPositionRadius: function () { return _this.lightPositionRadiusMap; },
                    uLightColorIdensity: function () { return _this.lightColorIdensityMap; },
                    uLightIndex: function () { return _this.tileLightIndexMap; },
                },
                attributes: {
                    position: function () { return _this.tile.geometry.attributes.position; },
                },
            })
                .build(this.gl);
            CanvasToy.Graphics.copyDataToVertexBuffer(this.gl, this.tile.geometry);
            this.tileProgram.make(scene);
        };
        DeferredProcessor.prototype.fillTileWithBoundingBox2D = function (camera, box, lightIndex) {
            var leftTile = Math.max(Math.floor((box.left / 2.0 + 0.5) * this.horizontalTileNum) - 1, 0);
            var topTile = Math.min(Math.ceil((box.top / 2.0 + 0.5) * this.verticalTileNum) + 1, this.verticalTileNum);
            var rightTile = Math.min(Math.ceil((box.right / 2.0 + 0.5) * this.horizontalTileNum) + 1, this.horizontalTileNum);
            var bottomTile = Math.max(Math.floor((box.bottom / 2.0 + 0.5) * this.verticalTileNum) - 1, 0);
            for (var i = leftTile; i < rightTile; i++) {
                for (var j = bottomTile; j < topTile; j++) {
                    var tileIndex = i + j * this.horizontalTileNum;
                    if (tileIndex < this.tileCount && tileIndex >= 0) {
                        this.tileLightIndex[tileIndex].push(lightIndex);
                    }
                }
            }
        };
        return DeferredProcessor;
    }());
    CanvasToy.DeferredProcessor = DeferredProcessor;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var ForwardProcessor = (function () {
        function ForwardProcessor(gl, ext, scene, camera) {
            this.gl = gl;
            this.ext = ext;
        }
        ForwardProcessor.prototype.process = function (scene, camera, materials) {
            this.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                this.renderObject(scene, camera, object);
            }
        };
        ForwardProcessor.prototype.renderObject = function (scene, camera, object) {
            if (object instanceof CanvasToy.Mesh) {
                var mesh = object;
                for (var _i = 0, _a = mesh.materials; _i < _a.length; _i++) {
                    var material = _a[_i];
                    var program = material.program;
                    if (program.enableDepthTest) {
                        this.gl.enable(this.gl.DEPTH_TEST);
                    }
                    else {
                        this.gl.disable(this.gl.DEPTH_TEST);
                    }
                    if (program.enableStencilTest) {
                        this.gl.enable(this.gl.STENCIL_TEST);
                    }
                    else {
                        this.gl.disable(this.gl.STENCIL_TEST);
                    }
                    if (material.dirty) {
                        program.resetMaterialDefines(material);
                        program.make(mesh.scene);
                        CanvasToy.Graphics.addUniformContainer(material.program, mesh);
                        CanvasToy.Graphics.addUniformContainer(material.program, material);
                        CanvasToy.Graphics.addUniformContainer(material.program, camera);
                        CanvasToy.Graphics.addUniformContainer(material.program, scene);
                        if (material instanceof CanvasToy.StandardMaterial) {
                            this.setupLights(mesh.scene, material, mesh, camera);
                        }
                        CanvasToy.Graphics.addTextureContainer(material.program, material);
                        CanvasToy.Graphics.addTextureContainer(material.program, scene);
                        material.dirty = false;
                    }
                    if (material instanceof CanvasToy.StandardMaterial) {
                        this.passShadows(mesh, scene, material, camera);
                    }
                    this.gl.useProgram(program.webGlProgram);
                    program.pass(mesh, camera, material);
                }
            }
        };
        ForwardProcessor.prototype.setupLight = function (light, camera, program, index, lightArrayName) {
            console.assert(light.uniforms !== undefined);
            var _loop_5 = function (uniformProperty) {
                if (!!uniformProperty.key && light[uniformProperty.key] !== undefined) {
                    program.addUniform(lightArrayName + "[" + index + "]." + uniformProperty.name, {
                        type: uniformProperty.type,
                        updator: function (obj, camera) {
                            return uniformProperty.updator(light, camera);
                        },
                    });
                }
            };
            for (var _i = 0, _a = light.uniforms; _i < _a.length; _i++) {
                var uniformProperty = _a[_i];
                _loop_5(uniformProperty);
            }
        };
        ForwardProcessor.prototype.setupLights = function (scene, material, mesh, camera) {
            for (var index in scene.dirctionLights) {
                this.setupLight(scene.dirctionLights[index], camera, material.program, index, "directLights");
            }
            for (var index in scene.pointLights) {
                this.setupLight(scene.pointLights[index], camera, material.program, index, "pointLights");
            }
            for (var index in scene.spotLights) {
                this.setupLight(scene.spotLights[index], camera, material.program, index, "spotLights");
            }
        };
        ForwardProcessor.prototype.passShadows = function (mesh, scene, material, camera) {
            if (material.castShadow) {
                var handleShadow = function (lights, shadowMatrices, shadowMaps) {
                    var offset = 0;
                    lights.forEach(function (light) {
                        shadowMaps.push(light.shadowMap);
                        shadowMatrices.set(mat4.mul(mat4.create(), light.projectCamera.projectionMatrix, mat4.mul(mat4.create(), light.projectCamera.worldToObjectMatrix, mesh.matrix)), offset);
                        offset += 16;
                    });
                };
                scene.directionShadowMaps = [];
                scene.directShadowMatrices = new Float32Array(scene.dirctionLights.length * 16);
                handleShadow(scene.dirctionLights, scene.directShadowMatrices, scene.directionShadowMaps);
                scene.pointShadowMaps = [];
                scene.pointShadowMatrices = new Float32Array(scene.pointLights.length * 16);
                handleShadow(scene.pointLights, scene.pointShadowMatrices, scene.pointShadowMaps);
                scene.spotShadowMaps = [];
                scene.spotShadowMatrices = new Float32Array(scene.spotLights.length * 16);
                handleShadow(scene.spotLights, scene.spotShadowMatrices, scene.spotShadowMaps);
            }
        };
        return ForwardProcessor;
    }());
    CanvasToy.ForwardProcessor = ForwardProcessor;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var AttachmentType;
    (function (AttachmentType) {
        AttachmentType[AttachmentType["Texture"] = 0] = "Texture";
        AttachmentType[AttachmentType["RenderBuffer"] = 1] = "RenderBuffer";
    })(AttachmentType = CanvasToy.AttachmentType || (CanvasToy.AttachmentType = {}));
    var Attachment = (function () {
        function Attachment(frameBuffer, attachmentCode) {
            this._innerFormatForBuffer = -1;
            this._isAble = true;
            this.frameBuffer = frameBuffer;
            this.attachmentCode = attachmentCode;
        }
        Object.defineProperty(Attachment.prototype, "innerFormatForBuffer", {
            get: function () {
                return this._innerFormatForBuffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Attachment.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Attachment.prototype, "isAble", {
            get: function () {
                return this._isAble;
            },
            enumerable: true,
            configurable: true
        });
        Attachment.prototype.enable = function () {
            this._isAble = true;
            return this;
        };
        Attachment.prototype.disable = function () {
            this._isAble = false;
            return this;
        };
        Attachment.prototype.setInnerFormatForBuffer = function (innerFormatForBuffer) {
            this._innerFormatForBuffer = innerFormatForBuffer;
            return this;
        };
        Attachment.prototype.setType = function (gl, type) {
            this._type = type;
            if (type === AttachmentType.Texture) {
                this.targetTexture = new CanvasToy.Texture(gl);
                this.glRenderBuffer = null;
            }
            else {
                this.glRenderBuffer = gl.createRenderbuffer();
                this.targetTexture = null;
            }
            return this;
        };
        return Attachment;
    }());
    CanvasToy.Attachment = Attachment;
    var FrameBuffer = (function () {
        function FrameBuffer(gl) {
            this.attachments = {
                color: new Attachment(this, function (gl) { return gl.COLOR_ATTACHMENT0; }),
                depth: new Attachment(this, function (gl) { return gl.DEPTH_ATTACHMENT; }),
                stencil: new Attachment(this, function (gl) { return gl.STENCIL_ATTACHMENT; }),
            };
            this.extras = [];
            this._attached = false;
            this.glFramebuffer = gl.createFramebuffer();
            this._width = gl.canvas.width;
            this._height = gl.canvas.height;
            this.attachments.color.setType(gl, AttachmentType.Texture)
                .setInnerFormatForBuffer(gl.RGBA4);
            this.attachments.depth.setType(gl, AttachmentType.RenderBuffer)
                .setInnerFormatForBuffer(gl.DEPTH_COMPONENT16);
            this.attachments.stencil.setType(gl, AttachmentType.RenderBuffer)
                .setInnerFormatForBuffer(gl.STENCIL_INDEX8)
                .disable();
        }
        FrameBuffer.prototype.setWidth = function (_width) {
            this._width = _width;
            return this;
        };
        FrameBuffer.prototype.setHeight = function (_height) {
            this._height = _height;
            return this;
        };
        Object.defineProperty(FrameBuffer.prototype, "attached", {
            get: function () {
                return this._attached;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameBuffer.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameBuffer.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        FrameBuffer.prototype.attach = function (gl, drawBuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer);
            for (var index in this.attachments) {
                var attachment = this.attachments[index];
                if (attachment.isAble) {
                    this.linkAttachment(attachment, gl, gl);
                }
            }
            if (!!drawBuffer) {
                for (var _i = 0, _a = this.extras; _i < _a.length; _i++) {
                    var attachment = _a[_i];
                    this.linkAttachment(attachment, gl, drawBuffer);
                }
                drawBuffer.drawBuffersWEBGL([
                    drawBuffer.COLOR_ATTACHMENT0_WEBGL,
                    drawBuffer.COLOR_ATTACHMENT1_WEBGL,
                ]);
            }
            this._attached = CanvasToy.Graphics.logIfFrameBufferInvalid(gl, this.glFramebuffer);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        };
        FrameBuffer.prototype.linkAttachment = function (attachment, gl, context) {
            switch (attachment.type) {
                case AttachmentType.Texture:
                    gl.bindTexture(attachment.targetTexture.target, attachment.targetTexture.glTexture);
                    gl.texImage2D(attachment.targetTexture.target, 0, attachment.targetTexture.format, this.width, this.height, 0, attachment.targetTexture.format, attachment.targetTexture.type, null);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment.attachmentCode(context), attachment.targetTexture.target, attachment.targetTexture.glTexture, 0);
                    gl.bindTexture(attachment.targetTexture.target, null);
                    break;
                case AttachmentType.RenderBuffer:
                    gl.bindRenderbuffer(gl.RENDERBUFFER, attachment.glRenderBuffer);
                    gl.renderbufferStorage(gl.RENDERBUFFER, attachment.innerFormatForBuffer, gl.canvas.width, gl.canvas.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment.attachmentCode(gl), gl.RENDERBUFFER, attachment.glRenderBuffer);
                    break;
                default: break;
            }
        };
        return FrameBuffer;
    }());
    CanvasToy.FrameBuffer = FrameBuffer;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    ;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Renderer = (function () {
        function Renderer(canvas, debug) {
            var _this = this;
            this.canvas = null;
            this.gl = null;
            this.debug = false;
            this.preloadRes = [];
            this.usedTextureNum = 0;
            this.renderTargets = [];
            this.vertPrecision = "highp";
            this.fragPrecision = "mediump";
            this.isAnimating = false;
            this.renderQueue = [];
            this.fbos = [];
            this.scenes = [];
            this.cameras = [];
            this.frameRate = 1000 / 60;
            this.stopped = false;
            this.materials = [];
            this.isDeferred = false;
            this.main = function () {
                for (var _i = 0, _a = _this.renderQueue; _i < _a.length; _i++) {
                    var renderCommand = _a[_i];
                    renderCommand(_this.frameRate);
                }
                if (_this.stopped) {
                    return;
                }
                setTimeout(_this.main, _this.frameRate);
            };
            this.canvas = canvas;
            this.debug = debug;
            this.gl = CanvasToy.initWebwebglContext(canvas, debug);
            this.ext = {
                depth_texture: this.gl.getExtension("WEBGL_depth_texture"),
                draw_buffer: this.gl.getExtension("WEBGL_draw_buffers"),
                texture_float: this.gl.getExtension("OES_texture_float"),
                texture_float_linear: this.gl.getExtension("OES_texture_float_linear"),
            };
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            setTimeout(this.main, this.frameRate);
        }
        Renderer.prototype.stop = function () {
            this.stopped = true;
        };
        Renderer.prototype.start = function () {
            this.stopped = false;
            setTimeout(this.main, this.frameRate);
        };
        Renderer.prototype.createFrameBuffer = function () {
            var fbo = new CanvasToy.FrameBuffer(this.gl);
            this.fbos.push(fbo);
            return fbo;
        };
        Renderer.prototype.renderFBO = function (scene, camera) {
        };
        Renderer.prototype.handleResource = function (scene) {
            var _this = this;
            var objectPromises = [];
            var _loop_6 = function (object) {
                var promise = object.asyncFinished();
                if (!!promise) {
                    objectPromises.push(promise.then(function () {
                        for (var _i = 0, _a = object.children; _i < _a.length; _i++) {
                            var child = _a[_i];
                            scene.addObject(child);
                        }
                    }));
                }
            };
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                _loop_6(object);
            }
            return Promise.all(objectPromises).then(function () {
                var texturePromises = [];
                for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                    var object = _a[_i];
                    if (object instanceof CanvasToy.Mesh) {
                        for (var _b = 0, _c = object.materials; _b < _c.length; _b++) {
                            var material = _c[_b];
                            var _material = material;
                            for (var _d = 0, _e = _material.asyncResources; _d < _e.length; _d++) {
                                var textureGetter = _e[_d];
                                var promise = textureGetter(_material);
                                if (!!promise) {
                                    texturePromises.push(promise.then(function (texture) {
                                        texture.bindTextureData(_this.gl);
                                        return Promise.resolve(texture);
                                    }));
                                }
                            }
                        }
                    }
                }
                return Promise.all(texturePromises);
            });
        };
        Renderer.prototype.forceDeferred = function () {
            this.isDeferred = true;
        };
        Renderer.prototype.render = function (scene, camera) {
            var _this = this;
            camera.adaptTargetRadio(this.canvas);
            if (this.scenes.indexOf(scene) !== -1 || this.preloadRes.length > 0) {
                return;
            }
            this.scenes.push(scene);
            this.handleResource(scene)
                .then(function () {
                var materials = [];
                for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                    var obj = _a[_i];
                    if (obj instanceof CanvasToy.Mesh) {
                        var mesh = obj;
                        for (var _b = 0, _c = mesh.materials; _b < _c.length; _b++) {
                            var material = _c[_b];
                            if (materials.indexOf(material) === -1) {
                                materials.push(material);
                            }
                        }
                    }
                }
                for (var _d = 0, _e = scene.objects; _d < _e.length; _d++) {
                    var object = _e[_d];
                    if (object instanceof CanvasToy.Mesh) {
                        CanvasToy.Graphics.copyDataToVertexBuffer(_this.gl, object.geometry);
                    }
                }
                var shadowPreProcess = new CanvasToy.ShadowPreProcess(_this.gl, _this.ext);
                var processor;
                if (_this.isDeferred) {
                    processor = new CanvasToy.DeferredProcessor(_this.gl, _this.ext, scene, camera);
                }
                else {
                    processor = new CanvasToy.ForwardProcessor(_this.gl, _this.ext, scene, camera);
                }
                scene.programSetUp = true;
                _this.renderQueue.push(function (deltaTime) {
                    scene.update(deltaTime);
                    shadowPreProcess.process(scene, camera, materials);
                    processor.process(scene, camera, materials);
                });
            })
                .catch(function (err) {
                console.error(err);
            });
        };
        Renderer.prototype.renderLight = function (light, scene) {
        };
        Renderer.prototype.initMatrix = function () {
        };
        return Renderer;
    }());
    CanvasToy.Renderer = Renderer;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var ShadowPreProcess = (function () {
        function ShadowPreProcess(gl, ext) {
            this.gl = gl;
            this.ext = ext;
            this.depthMaterial = new CanvasToy.DepthMaterial(gl);
            this.depthMaterial.program.setViewPort({ x: 0, y: 0, width: 1024, height: 1024 });
        }
        ShadowPreProcess.prototype.process = function (scene, camera, matriels) {
            if (this.depthMaterial.dirty) {
                this.depthMaterial.program.resetMaterialDefines(this.depthMaterial);
                this.depthMaterial.program.make(scene);
                CanvasToy.Graphics.addUniformContainer(this.depthMaterial.program, this.depthMaterial);
                CanvasToy.Graphics.addTextureContainer(this.depthMaterial.program, this.depthMaterial);
                this.depthMaterial.dirty = false;
            }
            for (var _i = 0, _a = scene.lights; _i < _a.length; _i++) {
                var light = _a[_i];
                if (light.shadowType !== CanvasToy.ShadowType.None) {
                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, light.shadowFrameBuffer.glFramebuffer);
                    this.gl.enable(this.gl.DEPTH_TEST);
                    this.gl.depthFunc(this.gl.LEQUAL);
                    this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
                    for (var _b = 0, _c = scene.objects; _b < _c.length; _b++) {
                        var object = _c[_b];
                        if (object instanceof CanvasToy.Mesh) {
                            var castShadow = false;
                            for (var _d = 0, _e = object.materials; _d < _e.length; _d++) {
                                var material = _e[_d];
                                if (material instanceof CanvasToy.StandardMaterial) {
                                    if (material.castShadow) {
                                        castShadow = true;
                                        break;
                                    }
                                }
                            }
                            if (castShadow) {
                                this.renderMeshDepth(object, light);
                            }
                        }
                    }
                }
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        };
        ShadowPreProcess.prototype.renderMeshDepth = function (mesh, light) {
            this.gl.useProgram(this.depthMaterial.program.webGlProgram);
            this.depthMaterial.program.pass(mesh, light.projectCamera, this.depthMaterial);
        };
        return ShadowPreProcess;
    }());
    CanvasToy.ShadowPreProcess = ShadowPreProcess;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var ShaderBuilder = (function () {
        function ShaderBuilder() {
            this.vertLibs = [];
            this.fragLibs = [
                CanvasToy.ShaderSource.definitions__light_glsl,
                CanvasToy.ShaderSource.calculators__linearlize_depth_glsl,
                CanvasToy.ShaderSource.calculators__blinn_phong_glsl,
                CanvasToy.ShaderSource.calculators__types_glsl,
                CanvasToy.ShaderSource.calculators__shadow_factor_glsl,
                CanvasToy.ShaderSource.debug__checkBox_glsl,
            ];
            this.shadingVert = CanvasToy.ShaderSource.interploters__forward__phong_vert;
            this.shadingFrag = CanvasToy.ShaderSource.interploters__forward__phong_frag;
            this.pass = CanvasToy.defaultProgramPass;
        }
        ShaderBuilder.prototype.resetShaderLib = function () {
            this.vertLibs = [];
            this.fragLibs = [];
            return this;
        };
        ShaderBuilder.prototype.addShaderLib = function () {
            var lib = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                lib[_i] = arguments[_i];
            }
            (_a = this.vertLibs).push.apply(_a, lib);
            (_b = this.fragLibs).push.apply(_b, lib);
            return this;
            var _a, _b;
        };
        ShaderBuilder.prototype.addShaderLibVert = function () {
            var lib = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                lib[_i] = arguments[_i];
            }
            (_a = this.vertLibs).push.apply(_a, lib);
            return this;
            var _a;
        };
        ShaderBuilder.prototype.addShaderLibFrag = function () {
            var lib = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                lib[_i] = arguments[_i];
            }
            (_a = this.fragLibs).push.apply(_a, lib);
            return this;
            var _a;
        };
        ShaderBuilder.prototype.setShadingVert = function (vert) {
            this.shadingVert = vert;
            return this;
        };
        ShaderBuilder.prototype.setShadingFrag = function (frag) {
            this.shadingFrag = frag;
            return this;
        };
        ShaderBuilder.prototype.setPass = function (pass) {
            this.pass = pass;
            return this;
        };
        ShaderBuilder.prototype.build = function (gl) {
            return new CanvasToy.Program(gl, {
                vertexShader: this.vertLibs.join("\n") + this.shadingVert,
                fragmentShader: this.fragLibs.join("\n") + this.shadingFrag,
            }, this.pass);
        };
        return ShaderBuilder;
    }());
    CanvasToy.ShaderBuilder = ShaderBuilder;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var CubeTexture = (function (_super) {
        __extends(CubeTexture, _super);
        function CubeTexture(gl, xposUrl, xnegUrl, yposUrl, ynegUrl, zposUrl, znegUrl) {
            var _this = _super.call(this, gl) || this;
            _this.images = [];
            var image = _this._image;
            _this.setAsyncFinished(Promise.all(_this.images.map(function (image) { return _this.createLoadPromise(image); })).then(function () {
                return Promise.resolve(_this);
            }));
            _this.setTarget(gl.TEXTURE_CUBE_MAP)
                .setMinFilter(gl.NEAREST)
                .setMagFilter(gl.NEAREST);
            _this.images = [0, 0, 0, 0, 0, 0].map(function () { return new Image(); });
            _this.images[0].src = xposUrl;
            _this.images[1].src = xnegUrl;
            _this.images[2].src = yposUrl;
            _this.images[3].src = ynegUrl;
            _this.images[4].src = zposUrl;
            _this.images[5].src = znegUrl;
            return _this;
        }
        Object.defineProperty(CubeTexture.prototype, "wrapR", {
            get: function () {
                return this._wrapR;
            },
            enumerable: true,
            configurable: true
        });
        CubeTexture.prototype.setWrapR = function (_wrapR) {
            this._wrapR = _wrapR;
            return this;
        };
        CubeTexture.prototype.bindTextureData = function (gl) {
            _super.prototype.bindTextureData.call(this, gl);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
            for (var i = 0; i < this.images.length; ++i) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.format, this.format, this.type, this.images[i]);
            }
            return this;
        };
        CubeTexture.prototype.createLoadPromise = function (image) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!image) {
                    resolve(_this);
                }
                else {
                    image.onload = function () { return resolve(_this); };
                    image.onerror = function () { return reject(_this); };
                }
            });
        };
        return CubeTexture;
    }(CanvasToy.Texture));
    CanvasToy.CubeTexture = CubeTexture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Texture2D = (function (_super) {
        __extends(Texture2D, _super);
        function Texture2D(gl, url) {
            return _super.call(this, gl, url) || this;
        }
        Texture2D.prototype.bindTextureData = function (gl) {
            _super.prototype.bindTextureData.call(this, gl);
            gl.texImage2D(this.target, 0, this.format, this.format, this.type, this.image);
            return this;
        };
        return Texture2D;
    }(CanvasToy.Texture));
    CanvasToy.Texture2D = Texture2D;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var DataTexture = (function (_super) {
        __extends(DataTexture, _super);
        function DataTexture(gl, data, width, height) {
            if (width === void 0) { width = 16; }
            if (height === void 0) { height = 16; }
            var _this = _super.call(this, gl) || this;
            _this.data = data;
            _this.width = width;
            _this.height = height;
            return _this;
        }
        DataTexture.prototype.resetData = function (gl, data, width, height) {
            this.data = data;
            this.width = width ? width : this.width;
            this.height = height ? height : this.height;
            this.bindTextureData(gl);
            return this;
        };
        DataTexture.prototype.bindTextureData = function (gl) {
            _super.prototype.bindTextureData.call(this, gl);
            gl.texImage2D(this.target, 0, this.format, this.width, this.height, 0, this.format, this.type, this.data);
            return this;
        };
        return DataTexture;
    }(CanvasToy.Texture));
    CanvasToy.DataTexture = DataTexture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var ShaderType;
    (function (ShaderType) {
        ShaderType[ShaderType["VertexShader"] = 0] = "VertexShader";
        ShaderType[ShaderType["FragmentShader"] = 1] = "FragmentShader";
    })(ShaderType = CanvasToy.ShaderType || (CanvasToy.ShaderType = {}));
    function mixin(toObject, fromObject) {
        for (var property in fromObject) {
            if (toObject[property] instanceof Object) {
                mixin(toObject[property], fromObject[property]);
            }
            else {
                toObject[property] = fromObject[property];
            }
        }
    }
    CanvasToy.mixin = mixin;
    function initWebwebglContext(canvas, debug) {
        var gl;
        try {
            gl = canvas.getContext("experimental-webgl");
        }
        catch (e) {
            gl = canvas.getContext("webgl");
        }
        if (!gl) {
            alert("Cannot init webgl, current browser may not support it.");
        }
        return gl;
    }
    CanvasToy.initWebwebglContext = initWebwebglContext;
    function getDomScriptText(script) {
        if (!script) {
            return null;
        }
        var theSource = "";
        var currentChild = script.firstChild;
        while (currentChild) {
            if (currentChild.nodeType === 3) {
                theSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }
    }
    CanvasToy.getDomScriptText = getDomScriptText;
    function createSeparatedShader(gl, source, type) {
        var shader;
        var typeInfo;
        if (type === ShaderType.FragmentShader) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            typeInfo = "fragment shader";
        }
        else if (type === ShaderType.VertexShader) {
            shader = gl.createShader(gl.VERTEX_SHADER);
            typeInfo = "vertex shader";
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("error: " + typeInfo + "\n" + gl.getShaderInfoLog(shader));
            console.error(source);
            return null;
        }
        return shader;
    }
    function linkShader(gl, vertexShader, fragmentShader, vertexSource, fragmentSource) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("error: link shader program failed.\n" + gl.getProgramInfoLog(shaderProgram));
            console.error("vertex:\n" + vertexSource);
            console.error("fragment:\n" + fragmentSource);
        }
        return shaderProgram;
    }
    ;
    function createEntileShader(gl, vertexShaderSource, fragmentShaderSource) {
        var vertShader = createSeparatedShader(gl, vertexShaderSource, ShaderType.VertexShader);
        var fragShader = createSeparatedShader(gl, fragmentShaderSource, ShaderType.FragmentShader);
        return linkShader(gl, vertShader, fragShader, vertexShaderSource, fragmentShaderSource);
    }
    CanvasToy.createEntileShader = createEntileShader;
})(CanvasToy || (CanvasToy = {}));
//# sourceMappingURL=canvas-toy.js.map