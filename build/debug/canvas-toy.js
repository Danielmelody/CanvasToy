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
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    function uniform(name, type, updator) {
        return function (proto, key) {
            if (!proto.hasOwnProperty("uniforms")) {
                Object.defineProperty(proto, "uniforms", {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: [],
                });
            }
            var uniforms = proto.uniforms;
            uniforms.push({
                name: name,
                type: type,
                updator: updator ? updator : function (obj) {
                    return obj[key];
                },
            });
        };
    }
    CanvasToy.uniform = uniform;
})(CanvasToy || (CanvasToy = {}));
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
        function Program(gl, source, componentBuilder) {
            this.enableDepthTest = true;
            this.enableStencilTest = true;
            this.uniforms = {};
            this.attributes = {};
            this.attributeLocations = {};
            this.textures = [];
            this.vertexPrecision = "highp";
            this.fragmentPrecision = "mediump";
            this.prefix = [];
            this.drawMode = function (gl) { return gl.STATIC_DRAW; };
            this.gl = gl;
            this.source = source;
            this.componentBuilder = componentBuilder;
        }
        Program.prototype.setFragmentShader = function (fragmentShader) {
            this.source.fragmentShader = fragmentShader;
            return this;
        };
        Program.prototype.setVertexShader = function (vertexShader) {
            this.source.vertexShader = vertexShader;
            return this;
        };
        Program.prototype.make = function (gl, mesh, scene, camera, material) {
            this.prefix = [
                material.mainTexture ? "#define USE_TEXTURE " : "",
                material.ambient ? "#define USE_COLOR " : "",
                scene.openLight ? "#define OPEN_LIGHT \n#define LIGHT_NUM "
                    + scene.lights.length : "",
            ];
            this.webGlProgram = CanvasToy.createEntileShader(gl, "precision " + this.vertexPrecision + " float;\n" + this.prefix.join("\n") + "\n"
                + this.source.vertexShader, "precision " + this.fragmentPrecision + " float;\n" + this.prefix.join("\n") + "\n"
                + this.source.fragmentShader);
            var componets = this.componentBuilder(mesh, scene, camera, material);
            this.faces = (componets.faces === undefined ? this.faces : componets.faces);
            for (var nameInShader in componets.uniforms) {
                if (componets.uniforms[nameInShader] !== undefined) {
                    this.addUniform(nameInShader, componets.uniforms[nameInShader]);
                }
            }
            for (var sampler in componets.textures) {
                this.textures[sampler] = componets.textures[sampler];
            }
            for (var nameInShader in componets.attributes) {
                this.addAttribute(nameInShader, componets.attributes[nameInShader]);
            }
            this.checkState();
            return this;
        };
        Program.prototype.pass = function (mesh, camera, materiel) {
            for (var uniformName in this.uniforms) {
                if (this.uniforms[uniformName] !== undefined) {
                    this.uniforms[uniformName](mesh, camera);
                }
            }
            for (var attributeName in this.attributes) {
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.attributes[attributeName].buffer);
                this.gl.vertexAttribPointer(this.attributeLocations[attributeName], this.attributes[attributeName].size, this.attributes[attributeName].type, false, 0, 0);
            }
            return this;
        };
        Program.prototype.checkState = function () {
            var maxIndex = 0;
            for (var _i = 0, _a = this.faces.data; _i < _a.length; _i++) {
                var index = _a[_i];
                maxIndex = Math.max(maxIndex, index);
            }
            for (var attributeName in this.attributes) {
                console.assert(this.attributes[attributeName].size <= 4 && this.attributes[attributeName].size >= 1, attributeName + "size error, now: " + this.attributes[attributeName].size + " should be 1-4");
                console.assert((maxIndex + 1) * this.attributes[attributeName].stride <=
                    this.attributes[attributeName].data.length, attributeName + " length error, now:" + this.attributes[attributeName].data.length
                    + ", should bigger than:" + (maxIndex + 1) * this.attributes[attributeName].stride);
            }
            return this;
        };
        Program.prototype.setAttribute0 = function (name) {
            this.attribute0 = name;
            this.gl.bindAttribLocation(this.webGlProgram, 0, name);
            return this;
        };
        Program.prototype.deleteUniform = function (nameInShader) {
            this.uniforms[nameInShader] = undefined;
            return this;
        };
        Program.prototype.addUniform = function (nameInShader, uniform) {
            var _this = this;
            this.gl.useProgram(this.webGlProgram);
            var location = this.getUniformLocation(nameInShader);
            switch (uniform.type) {
                case CanvasToy.DataType.float:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        _this.gl.uniform1f(location, uniform.updator(mesh, camera));
                    };
                    break;
                case CanvasToy.DataType.int:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        _this.gl.uniform1i(location, uniform.updator(mesh, camera));
                    };
                    break;
                case CanvasToy.DataType.vec2:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        var value = uniform.updator(mesh, camera);
                        _this.gl.uniform2f(location, value[0], value[1]);
                    };
                    break;
                case CanvasToy.DataType.vec3:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        var value = uniform.updator(mesh, camera);
                        _this.gl.uniform3f(location, value[0], value[1], value[2]);
                    };
                    break;
                case CanvasToy.DataType.vec4:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        var value = uniform.updator(mesh, camera);
                        _this.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    };
                    break;
                case CanvasToy.DataType.mat2:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        _this.gl.uniformMatrix2fv(location, false, uniform.updator(mesh, camera));
                    };
                case CanvasToy.DataType.mat3:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        _this.gl.uniformMatrix3fv(location, false, uniform.updator(mesh, camera));
                    };
                case CanvasToy.DataType.mat4:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        _this.gl.uniformMatrix4fv(location, false, uniform.updator(mesh, camera));
                    };
                    break;
                default: break;
            }
        };
        Program.prototype.deleteAttribute = function (nameInShader) {
            this.attributes[nameInShader] = undefined;
            this.attributeLocations[nameInShader] = undefined;
            return this;
        };
        Program.prototype.addAttribute = function (nameInShader, attribute) {
            var location = this.getAttribLocation(nameInShader);
            if (location !== null && location !== -1) {
                this.attributes[nameInShader] = attribute;
                this.attributeLocations[nameInShader] = location;
                this.gl.enableVertexAttribArray(location);
            }
            return this;
        };
        Program.prototype.getUniformLocation = function (name) {
            if (this.gl === undefined || this.gl === null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = this.gl.getUniformLocation(this.webGlProgram, name);
            if (result === null) {
                console.warn("uniform " + name + " not found!");
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
            this.checkState();
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
    CanvasToy.defaultProgramPass = function (mesh, scene, camera, material) {
        return {
            faces: mesh.geometry.faces,
            textures: {
                uMainTexture: material.mainTexture,
            },
            uniforms: {
                modelViewProjectionMatrix: {
                    type: CanvasToy.DataType.mat4,
                    updator: function (mesh, camera) {
                        return mat4.multiply(mat4.create(), camera.projectionMatrix, mat4.multiply(mat4.create(), camera.objectToWorldMatrix, mesh.matrix));
                    },
                },
                ambient: !material.ambient ? undefined : {
                    type: CanvasToy.DataType.vec3, updator: function () {
                        return material.ambient;
                    },
                },
                materialDiff: !material.diffuse ? undefined : {
                    type: CanvasToy.DataType.vec3, updator: function () {
                        return material.diffuse;
                    },
                },
                materialSpec: !material.specular ? undefined : {
                    type: CanvasToy.DataType.vec3, updator: function () {
                        return material.specular;
                    },
                },
                normalMatrix: !scene.openLight ? undefined : {
                    type: CanvasToy.DataType.mat4,
                    updator: function () { return new Float32Array(mesh.normalMatrix); },
                },
                eyePos: !scene.openLight ? undefined : {
                    type: CanvasToy.DataType.vec4,
                    updator: function (object3d, camera) {
                        return vec4.fromValues(camera.position[0], camera.position[1], camera.position[2], 1);
                    },
                },
            },
            attributes: {
                position: mesh.geometry.attributes.position,
                aMainUV: !material.mainTexture ? undefined : mesh.geometry.attributes.uv,
                aNormal: mesh.geometry.attributes.normal,
            },
        };
    };
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Object3d = (function () {
        function Object3d(tag) {
            this.children = [];
            this.objectToWorldMatrix = mat4.create();
            this._matrix = mat4.create();
            this._parent = null;
            this._localMatrix = mat4.create();
            this._localPosition = vec3.create();
            this._localRotation = quat.create();
            this._localScaling = vec3.fromValues(1, 1, 1);
            this._position = vec3.create();
            this._scaling = vec3.fromValues(1, 1, 1);
            this._rotation = quat.create();
            this.updateEvents = [];
            this.startEvents = [];
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
            this.composeFromLocalMatrix();
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
            this.composeFromGlobalMatrix();
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
            this.composeFromLocalMatrix();
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
            this.composeFromGlobalMatrix();
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
            this.composeFromGlobalMatrix();
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
        Object3d.prototype.registUpdate = function (updateFunction) {
            this.updateEvents.push(updateFunction);
            return this;
        };
        Object3d.prototype.registStart = function (updateFunction) {
            this.startEvents.push(updateFunction);
            return this;
        };
        Object3d.prototype.start = function () {
            for (var _i = 0, _a = this.startEvents; _i < _a.length; _i++) {
                var event_1 = _a[_i];
                event_1();
            }
        };
        Object3d.prototype.update = function (dt) {
            for (var _i = 0, _a = this.updateEvents; _i < _a.length; _i++) {
                var event_2 = _a[_i];
                event_2(dt);
            }
            for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
                var child = _c[_b];
                child.update(dt);
            }
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
        Object3d.prototype.genOtherMatrixs = function () {
            mat4.invert(this.objectToWorldMatrix, this.matrix);
        };
        Object3d.prototype.composeFromLocalMatrix = function () {
            mat4.fromRotationTranslationScale(this.localMatrix, this.localRotation, this.localPosition, this.localScaling);
            if (!!this._parent) {
                mat4.mul(this._matrix, this._parent.matrix, this.localMatrix);
            }
            else {
                this._matrix = mat4.clone(this._localMatrix);
            }
            this.genOtherMatrixs();
        };
        Object3d.prototype.composeFromGlobalMatrix = function () {
            mat4.fromRotationTranslationScale(this._matrix, this.rotation, this.position, this.scaling);
            this.genOtherMatrixs();
            if (!!this._parent) {
                mat4.mul(this._localMatrix, this._parent.objectToWorldMatrix, this.matrix);
            }
            else {
                this._localMatrix = mat4.clone(this._matrix);
            }
        };
        Object3d.prototype.applyToChildren = function () {
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.setTransformFromParent();
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
            _this._projectionMatrix = mat4.create();
            return _this;
        }
        Object.defineProperty(Camera.prototype, "projectionMatrix", {
            get: function () {
                return this._projectionMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Camera.prototype.setProjectionMatrix = function (projectionMatrix) {
            this._projectionMatrix = projectionMatrix;
            return this;
        };
        return Camera;
    }(CanvasToy.Object3d));
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
            _this._near = 0.001;
            _this._far = 1000;
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
        Object.defineProperty(OrthoCamera.prototype, "near", {
            get: function () {
                return this._near;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OrthoCamera.prototype, "far", {
            get: function () {
                return this._far;
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
            _this._fovy = 45;
            _this._near = 0.01;
            _this._far = 10000;
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
        Object.defineProperty(PerspectiveCamera.prototype, "near", {
            get: function () {
                return this._near;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PerspectiveCamera.prototype, "far", {
            get: function () {
                return this._far;
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
        PerspectiveCamera.prototype.setNear = function (near) {
            if (near !== this._near) {
                this.compuseProjectionMatrix();
                this._near = near;
            }
            return this;
        };
        PerspectiveCamera.prototype.setFar = function (far) {
            if (far !== this._far) {
                this.compuseProjectionMatrix();
                this._far = far;
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
        };
        return PerspectiveCamera;
    }(CanvasToy.Camera));
    CanvasToy.PerspectiveCamera = PerspectiveCamera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Geometry = (function () {
        function Geometry(gl) {
            this.attributes = {
                position: new CanvasToy.Attribute(gl, { type: CanvasToy.DataType.float, size: 3, data: [] }),
                uv: new CanvasToy.Attribute(gl, { type: CanvasToy.DataType.float, size: 2, data: [] }),
                normal: new CanvasToy.Attribute(gl, { type: CanvasToy.DataType.float, size: 3, data: [] }),
                flatNormal: new CanvasToy.Attribute(gl, { type: CanvasToy.DataType.float, size: 3, data: [] }),
            };
            this.faces = { data: [], buffer: gl.createBuffer() };
        }
        Geometry.prototype.setAttribute = function (name, attribute) {
            this.attributes[name] = attribute;
            return this;
        };
        Geometry.prototype.addVertex = function (vertex) {
            for (var attributeName in this.attributes) {
                if (this.attributes[attributeName] !== undefined) {
                    if (vertex[attributeName] === undefined) {
                        return this;
                    }
                    if (vertex[attributeName].length !== this.attributes[attributeName].size) {
                        console.error("length " + attributeName + "wrong");
                        return this;
                    }
                    this.attributes[attributeName].data
                        = this.attributes[attributeName].data.concat(vertex[attributeName]);
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
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, materials) {
            var _this = _super.call(this) || this;
            _this.materials = [];
            _this.maps = [];
            _this.normalMatrix = mat4.create();
            _this.materials = materials;
            _this.geometry = geometry;
            return _this;
        }
        Mesh.prototype.drawMode = function (gl) {
            return gl.STATIC_DRAW;
        };
        Mesh.prototype.genOtherMatrixs = function () {
            _super.prototype.genOtherMatrixs.call(this);
            mat4.transpose(this.normalMatrix, mat4.invert(mat4.create(), this.matrix));
        };
        return Mesh;
    }(CanvasToy.Object3d));
    CanvasToy.Mesh = Mesh;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.calculators__blinn_phong_glsl = "vec3 calculate_light(vec4 position, vec3 normal, vec3 lightPos, vec4 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {\n    vec3 lightDir = normalize(lightPos - position.xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n\n    // replace R * V with N * H\n    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);\n    float specularAngle = max(dot(H, normal), 0.0);\n\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n\nvec3 calculate_spot_light(vec4 position, vec3 normal, vec3 lightPos, vec3 spotDir, vec4 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {\n    vec3 lightDir = normalize(lightPos - position.xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n\n    // replace R * V with N * H\n    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);\n    float specularAngle = max(dot(H, normal), 0.0);\n\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
    CanvasToy.calculators__phong_glsl = "vec3 calculate_light(vec4 position, vec3 normal, vec4 lightPos, vec4 eyePos, vec3 specularLight, vec3 diffuseLight, float shiness, float idensity) {\n    vec3 lightDir = normalize((lightPos - position).xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specularLight * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n\nvec3 calculate_spot_light(vec4 position, vec3 normal, vec4 lightPos, vec4 eyePos, vec3 specularLight, vec3 diffuseLight, float shiness, float idensity) {\n    vec3 lightDir = normalize((lightPos - position).xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specularLight * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
    CanvasToy.definitions__light_glsl = "#ifdef OPEN_LIGHT // light declaration\nstruct Light {\n    vec3 color;\n    float idensity;\n    vec3 position;\n};\n\nstruct SpotLight {\n    vec3 color;\n    float idensity;\n    vec3 direction;\n    vec3 position;\n};\n\n#endif // light declaration\n";
    CanvasToy.env_map_vert = "";
    CanvasToy.interploters__depth_phong_frag = "uniform vec3 ambient;\nuniform vec3 depthColor;\n\nuniform float cameraNear;\nuniform float cameraFar;\n\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n\nvoid main () {\n    float originDepth = texture2D(uMainTexture, vMainUV).r;\n    gl_FragColor = vec4(vec3(originDepth * 2.0 - 1.0), 1.0);\n}\n";
    CanvasToy.interploters__depth_phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n    vMainUV = aMainUV;\n}\n";
    CanvasToy.interploters__g_buffer_frag = "";
    CanvasToy.interploters__g_buffer_vert = "";
    CanvasToy.interploters__gouraud_frag = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nvoid main() {\n#ifdef USE_TEXTURE\n    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n#ifdef OPEN_LIGHT\n    totalLighting = ambient + materialAmbient;\n    vec3 normal = normalize(vNormal);\n    gl_FragColor = vec4(totalLighting, 1.0);\n#else\n#ifdef USE_COLOR\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#endif\n#endif\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * textureColor;\n#endif\n#ifdef USE_COLOR\n    gl_FragColor = gl_FragColor * color;\n#endif\n}\n";
    CanvasToy.interploters__gouraud_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    totalLighting = ambient;\n    normal = normalize(normal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);\n    }\n    vLightColor = totalLighting;\n#endif\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n";
    CanvasToy.interploters__phong_frag = "uniform vec3 ambient;\n\nuniform vec3 materialSpec;\nuniform vec3 materialDiff;\nuniform vec3 materialAmbient;\n\n#ifdef OPEN_LIGHT\nuniform vec4 eyePos;\nvarying vec3 vNormal;\nvarying vec4 vPosition;\n#endif\n\n#ifdef USE_TEXTURE\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n#endif\n\nuniform Light lights[LIGHT_NUM];\nuniform SpotLight spotLights[LIGHT_NUM];\n\nvoid main () {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#ifdef USE_COLOR\n    gl_FragColor = vec4(materialAmbient, 1.0);\n#endif\n\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * texture2D(uMainTexture, vMainUV);\n#endif\n#ifdef OPEN_LIGHT\n    vec3 normal = normalize(vNormal);\n    vec3 totalLighting = ambient;\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(\n            vPosition,\n            normal,\n            lights[index].position,\n            eyePos,\n            materialSpec * lights[index].color,\n            materialDiff * lights[index].color,\n            4.0,\n            lights[index].idensity\n        );\n    }\n    gl_FragColor *= vec4(totalLighting, 1.0);\n#endif\n}\n";
    CanvasToy.interploters__phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\nvarying vec4 vPosition;\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;\n    vPosition = gl_Position;\n#endif\n\n#ifdef USE_TEXTURE\n    vMainUV = aMainUV;\n#endif\n}\n";
})(CanvasToy || (CanvasToy = {}));
function builder(_thisArg) {
    return _thisArg;
}
var CanvasToy;
(function (CanvasToy) {
    var Texture = (function () {
        function Texture(gl, image) {
            this.dataCompleted = false;
            this.isReadyToUpdate = false;
            this.setTarget(gl.TEXTURE_2D)
                .setFormat(gl.RGB)
                .setWrapS(gl.CLAMP_TO_EDGE)
                .setWrapT(gl.CLAMP_TO_EDGE)
                .setMagFilter(gl.NEAREST)
                .setMinFilter(gl.NEAREST)
                .setType(gl.UNSIGNED_BYTE);
            this.glTexture = gl.createTexture();
            this._image = image;
        }
        Object.defineProperty(Texture.prototype, "unit", {
            get: function () {
                return this._unit;
            },
            enumerable: true,
            configurable: true
        });
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
        Texture.prototype.setUnit = function (_unit) {
            this._unit = _unit;
            return this;
        };
        Texture.prototype.setImage = function (_image) {
            this._image = _image;
            return this;
        };
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
        Texture.prototype.setUpTextureData = function (gl) {
            if (this.dataCompleted) {
                return false;
            }
            this.dataCompleted = true;
            return true;
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
        function Material(gl, paramter) {
            if (paramter === void 0) { paramter = {}; }
            this.ambient = vec3.fromValues(0.1, 0.1, 0.1);
            this.diffuse = vec3.fromValues(0.8, 0.8, 0.8);
            this.specularExponent = 1;
            this.specular = vec3.fromValues(1, 1, 1);
            this.opacity = vec3.fromValues(0, 0, 0);
            if (!!paramter) {
                for (var name_1 in paramter) {
                    this[name_1] = paramter[name_1];
                }
            }
        }
        return Material;
    }());
    CanvasToy.Material = Material;
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
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
                0, 1, 1,
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
        function SphereGeometry(gl, radius, perVertDistance) {
            var _this = _super.call(this, gl) || this;
            for (var y = -radius; y <= radius; y += perVertDistance) {
                var circlrRadius = Math.sqrt(radius * radius - y * y);
                for (var x = -circlrRadius; x <= circlrRadius; x += perVertDistance) {
                    var z1 = Math.sqrt(circlrRadius * circlrRadius - x * x);
                    var z2 = -z1;
                    _this.attributes.position.data.push(x, y, z1);
                    _this.attributes.position.data.push(x, y, z2);
                }
            }
            return _this;
        }
        return SphereGeometry;
    }(CanvasToy.Geometry));
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light() {
            var _this = _super.call(this) || this;
            _this._color = vec3.fromValues(1, 1, 1);
            _this._idensity = 1.0;
            _this._position = vec3.create();
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
        return Light;
    }(CanvasToy.Object3d));
    __decorate([
        CanvasToy.uniform("color", CanvasToy.DataType.vec3)
    ], Light.prototype, "_color", void 0);
    __decorate([
        CanvasToy.uniform("idensity", CanvasToy.DataType.float)
    ], Light.prototype, "_idensity", void 0);
    __decorate([
        CanvasToy.uniform("position", CanvasToy.DataType.vec3)
    ], Light.prototype, "_position", void 0);
    CanvasToy.Light = Light;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var DirectionalLight = (function (_super) {
        __extends(DirectionalLight, _super);
        function DirectionalLight() {
            var _this = _super.call(this) || this;
            _this._direction = vec3.fromValues(1, 1, 1);
            return _this;
        }
        Object.defineProperty(DirectionalLight.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            set: function (_direction) {
                vec3.normalize(this._direction, _direction);
            },
            enumerable: true,
            configurable: true
        });
        return DirectionalLight;
    }(CanvasToy.Light));
    CanvasToy.DirectionalLight = DirectionalLight;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var PointLight = (function (_super) {
        __extends(PointLight, _super);
        function PointLight() {
            var _this = _super.call(this) || this;
            _this._projectCamera = new CanvasToy.PerspectiveCamera();
            return _this;
        }
        return PointLight;
    }(CanvasToy.Light));
    CanvasToy.PointLight = PointLight;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var SpotLight = (function (_super) {
        __extends(SpotLight, _super);
        function SpotLight() {
            var _this = _super.call(this) || this;
            _this._coneAngle = 1;
            _this._direction = vec3.fromValues(1, 1, 1);
            return _this;
        }
        Object.defineProperty(SpotLight.prototype, "coneAngle", {
            get: function () {
                return this._coneAngle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpotLight.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            enumerable: true,
            configurable: true
        });
        SpotLight.prototype.setConeAngle = function (coneAngle) {
            this._coneAngle = coneAngle;
            return this;
        };
        return SpotLight;
    }(CanvasToy.Light));
    __decorate([
        CanvasToy.uniform("coneAngle", CanvasToy.DataType.float)
    ], SpotLight.prototype, "_coneAngle", void 0);
    __decorate([
        CanvasToy.uniform("direction", CanvasToy.DataType.vec3)
    ], SpotLight.prototype, "_direction", void 0);
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var patterns;
    (function (patterns) {
        patterns.num = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/mg;
    })(patterns = CanvasToy.patterns || (CanvasToy.patterns = {}));
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var StandardMaterial = (function (_super) {
        __extends(StandardMaterial, _super);
        function StandardMaterial(gl, paramter) {
            if (paramter === void 0) { paramter = {}; }
            var _this = _super.call(this, gl, paramter) || this;
            _this.program = new CanvasToy.StandardShaderBuilder().build(gl);
            return _this;
        }
        return StandardMaterial;
    }(CanvasToy.Material));
    CanvasToy.StandardMaterial = StandardMaterial;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var MTLLoader = (function () {
        function MTLLoader() {
        }
        MTLLoader.load = function (gl, url, onload) {
            var materials = {};
            var currentMaterial = null;
            CanvasToy.fetchRes(url, function (content) {
                content.split("\n").forEach(function (line) {
                    currentMaterial = MTLLoader.handleSingleLine(gl, line, materials, currentMaterial);
                });
            });
        };
        MTLLoader.handleSingleLine = function (gl, line, materials, currentMaterial) {
            if (line.length === 0) {
                return;
            }
            var matches = line.match(MTLLoader.removeCommentPattern);
            if (matches.length > 0) {
                line = matches[0];
                var firstVar = line.match(/([^\s]+)/g)[0];
                switch (firstVar) {
                    case "newmtl":
                        var mtlName = line.match(MTLLoader.newmtlPattern)[0];
                        materials[mtlName] = new CanvasToy.StandardMaterial(gl);
                        break;
                    case "Ka":
                        currentMaterial.ambient = MTLLoader.getVector(MTLLoader.ambientPattern, line);
                        break;
                    case "Kd":
                        currentMaterial.diffuse = MTLLoader.getVector(MTLLoader.diffusePattern, line);
                        break;
                    case "Ks":
                        currentMaterial.specular = MTLLoader.getVector(MTLLoader.specularePattern, line);
                        break;
                    case "Ds":
                        currentMaterial.specularExponent =
                            MTLLoader.getNumber(MTLLoader.specularExponentMapPattern, line);
                        break;
                    default: break;
                }
            }
        };
        MTLLoader.getVector = function (pattern, line) {
            var matches = line.match(pattern);
            var vector = [];
            if (matches.length > 0) {
                matches[0].match(CanvasToy.patterns.num).forEach(function (numStr) {
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
                return parseFloat(matches[0].match(CanvasToy.patterns.num)[0]);
            }
            return 0;
        };
        return MTLLoader;
    }());
    MTLLoader.removeCommentPattern = /#.*/mg;
    MTLLoader.newmtlPattern = /newmtl\s(.+)/mg;
    MTLLoader.ambientPattern = /Ka\s(.+)/mg;
    MTLLoader.diffusePattern = /Kd\s(.+)/mg;
    MTLLoader.specularePattern = /Ks\s(.+)/mg;
    MTLLoader.specularExponentPattern = /Ns\s(.+)/mg;
    MTLLoader.trancparencyPattern = /(Tr|d)\s(.+)/mg;
    MTLLoader.ambientMapPattern = /map_Ka\s(.+)/mg;
    MTLLoader.diffuseMapPattern = /map_Kd\s(.+)/mg;
    MTLLoader.speculareMapPattern = /map_Ks\s(.+)/mg;
    MTLLoader.specularExponentMapPattern = /map_Ns\s(.+)/mg;
    MTLLoader.trancparencyMapPattern = /(map_Tr|map_d)\s(.+)/mg;
    MTLLoader.bumpPattern = /(map_bump|bump)\s(.+)/mg;
    MTLLoader.dispPattern = /disp\s(.+)/mg;
    MTLLoader.decalPattern = /decal\s(.+)/mg;
    MTLLoader.mapPattern = /(map_|bump|disp|decal).+/mg;
    CanvasToy.MTLLoader = MTLLoader;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var OBJLoader = (function () {
        function OBJLoader() {
        }
        OBJLoader.load = function (gl, url, onload) {
            CanvasToy.fetchRes(url, function (content) {
                content = content.replace(OBJLoader.commentPattern, "");
                var positionlines = content.match(OBJLoader.vertexPattern);
                var uvlines = content.match(OBJLoader.uvPattern);
                var normallines = content.match(OBJLoader.normalPattern);
                var unIndexedPositions = OBJLoader.praiseAttibuteLines(positionlines);
                var unIndexedUVs = OBJLoader.praiseAttibuteLines(uvlines);
                var unIndexedNormals = OBJLoader.praiseAttibuteLines(normallines);
                var container = OBJLoader.buildUpMeshes(gl, content, unIndexedPositions, unIndexedUVs, unIndexedNormals);
                onload(container);
            });
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
        OBJLoader.buildUpMeshes = function (gl, content, unIndexedPositions, unIndexedUVs, unIndexedNormals) {
            var container = new CanvasToy.Object3d();
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
                var mesh = new CanvasToy.Mesh(geometry, [new CanvasToy.StandardMaterial(gl)]);
                mesh.setParent(container);
            });
            return container;
        };
        return OBJLoader;
    }());
    OBJLoader.commentPattern = /#.*/mg;
    OBJLoader.faceSplitVertPattern = /([0-9]|\/|\-)+/g;
    OBJLoader.facePerVertPattern = /([0-9]*)\/?([0-9]*)\/?([0-9]*)/;
    OBJLoader.objectSplitPattern = /[o|g]\s+.+/mg;
    OBJLoader.vertexPattern = /v\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
    OBJLoader.uvPattern = /vt\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
    OBJLoader.normalPattern = /vn\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
    OBJLoader.indexPattern = /f\s+([-+]?[0-9]*\.?[0-9]+ ?|\/)+/mg;
    CanvasToy.OBJLoader = OBJLoader;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    function fetchRes(url, onload) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                if (onload) {
                    onload(request.responseText);
                }
            }
        };
        request.open("GET", url);
        request.send();
    }
    CanvasToy.fetchRes = fetchRes;
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
        Attachment.prototype.toTexture = function (gl) {
            this.targetTexture = new CanvasToy.Texture(gl);
            return this.targetTexture;
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
            this.glFramebuffer = gl.createFramebuffer();
            this.attachments.color.setType(gl, AttachmentType.Texture)
                .setInnerFormatForBuffer(gl.RGBA4);
            this.attachments.depth.setType(gl, AttachmentType.RenderBuffer)
                .setInnerFormatForBuffer(gl.DEPTH_COMPONENT16);
            this.attachments.stencil.setType(gl, AttachmentType.RenderBuffer)
                .setInnerFormatForBuffer(gl.STENCIL_INDEX8)
                .disable();
        }
        return FrameBuffer;
    }());
    CanvasToy.FrameBuffer = FrameBuffer;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var GeometryBuffer = (function () {
        function GeometryBuffer(gl) {
            this.positionTexture = new CanvasToy.Texture(gl);
            this.normalTexture = new CanvasToy.Texture(gl);
            this.colorTexture = new CanvasToy.Texture(gl);
        }
        GeometryBuffer.prototype.depth = function (gl) {
            this.depthTexture = new CanvasToy.Texture(gl);
        };
        return GeometryBuffer;
    }());
    CanvasToy.GeometryBuffer = GeometryBuffer;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var DeferredProcessor = (function () {
        function DeferredProcessor(gl, scene) {
            this.geometryBuffer = new CanvasToy.GeometryBuffer(gl);
        }
        return DeferredProcessor;
    }());
    CanvasToy.DeferredProcessor = DeferredProcessor;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var RenderMode;
    (function (RenderMode) {
        RenderMode[RenderMode["Dynamic"] = 0] = "Dynamic";
        RenderMode[RenderMode["Static"] = 1] = "Static";
    })(RenderMode = CanvasToy.RenderMode || (CanvasToy.RenderMode = {}));
    var Renderer = (function () {
        function Renderer(canvas) {
            var _this = this;
            this.canvas = null;
            this.gl = null;
            this.renderMode = RenderMode.Dynamic;
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
            this.gl = CanvasToy.initWebwebglContext(canvas);
            this.ext = {
                depth_texture: this.gl.getExtension("WEBGL_depth_texture"),
                draw_buffer: this.gl.getExtension("WEBGL_draw_buffers"),
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
            var _this = this;
            this.buildSingleRender(scene, camera);
            var _loop_1 = function (frameBuffer) {
                frameBuffer = frameBuffer;
                this_1.gl.bindFramebuffer(this_1.gl.FRAMEBUFFER, frameBuffer.glFramebuffer);
                for (var atti in frameBuffer.attachments) {
                    var attachment = frameBuffer.attachments[atti];
                    if (!attachment.isAble) {
                        continue;
                    }
                    switch (attachment.type) {
                        case CanvasToy.AttachmentType.Texture:
                            this_1.gl.bindTexture(this_1.gl.TEXTURE_2D, attachment.targetTexture.glTexture);
                            this_1.gl.texImage2D(this_1.gl.TEXTURE_2D, 0, attachment.targetTexture.format, this_1.canvas.width, this_1.canvas.height, 0, attachment.targetTexture.format, attachment.targetTexture.type, null);
                            this_1.gl.framebufferTexture2D(this_1.gl.FRAMEBUFFER, attachment.attachmentCode(this_1.gl), this_1.gl.TEXTURE_2D, attachment.targetTexture.glTexture, 0);
                            this_1.gl.bindTexture(this_1.gl.TEXTURE_2D, null);
                            break;
                        case CanvasToy.AttachmentType.RenderBuffer:
                            this_1.gl.bindRenderbuffer(this_1.gl.RENDERBUFFER, attachment.glRenderBuffer);
                            this_1.gl.renderbufferStorage(this_1.gl.RENDERBUFFER, attachment.innerFormatForBuffer, this_1.canvas.width, this_1.canvas.height);
                            this_1.gl.framebufferRenderbuffer(this_1.gl.FRAMEBUFFER, attachment.attachmentCode(this_1.gl), this_1.gl.RENDERBUFFER, attachment.glRenderBuffer);
                            break;
                        default: console.assert(false);
                    }
                }
                if (this_1.gl.checkFramebufferStatus(this_1.gl.FRAMEBUFFER) !== this_1.gl.FRAMEBUFFER_COMPLETE) {
                    console.error("" + this_1.gl.getError());
                }
                this_1.renderQueue.push(function (deltaTime) {
                    _this.gl.bindFramebuffer(_this.gl.FRAMEBUFFER, frameBuffer.glFramebuffer);
                    scene.update(deltaTime);
                    _this.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
                    _this.gl.clear(_this.gl.DEPTH_BUFFER_BIT | _this.gl.COLOR_BUFFER_BIT);
                    for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                        var object = _a[_i];
                        _this.renderObject(camera, object);
                    }
                    _this.gl.bindRenderbuffer(_this.gl.RENDERBUFFER, null);
                    _this.gl.bindFramebuffer(_this.gl.FRAMEBUFFER, null);
                });
                if (this_1.gl.checkFramebufferStatus(this_1.gl.FRAMEBUFFER) !== this_1.gl.FRAMEBUFFER_COMPLETE) {
                    console.log("frame buffer not completed");
                }
                this_1.gl.bindFramebuffer(this_1.gl.FRAMEBUFFER, null);
            };
            var this_1 = this;
            for (var _i = 0, _a = this.fbos; _i < _a.length; _i++) {
                var frameBuffer = _a[_i];
                _loop_1(frameBuffer);
            }
        };
        Renderer.prototype.render = function (scene, camera) {
            var _this = this;
            this.buildSingleRender(scene, camera);
            switch (this.renderMode) {
                case RenderMode.Static:
                    this.renderQueue = [];
                    this.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
                    this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
                    for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                        var object = _a[_i];
                        this.renderObject(camera, object);
                    }
                    break;
                case RenderMode.Dynamic:
                    this.renderQueue.push(function (deltaTime) {
                        scene.update(deltaTime);
                        _this.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
                        for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                            var object = _a[_i];
                            _this.renderObject(camera, object);
                        }
                    });
                    break;
                default:
                    break;
            }
        };
        Renderer.prototype.buildSingleRender = function (scene, camera) {
            camera.adaptTargetRadio(this.canvas);
            if (this.scenes.indexOf(scene) !== -1 || this.preloadRes.length > 0) {
                return;
            }
            this.scenes.push(scene);
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (object instanceof CanvasToy.Mesh) {
                    var mesh = object;
                    this.makeMeshPrograms(scene, mesh, camera);
                }
            }
            scene.programSetUp = true;
        };
        Renderer.prototype.makeMeshPrograms = function (scene, mesh, camera) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.geometry.faces.data), this.gl.STATIC_DRAW);
            this.copyDataToVertexBuffer(mesh.geometry);
            if (mesh.materials.length > 1) {
                this.gl.enable(this.gl.BLEND);
                this.gl.blendFunc(this.gl.SRC_COLOR, this.gl.ONE_MINUS_SRC_COLOR);
            }
            for (var _i = 0, _a = mesh.materials; _i < _a.length; _i++) {
                var material = _a[_i];
                var cameraInScene = false;
                for (var _b = 0, _c = scene.objects; _b < _c.length; _b++) {
                    var object = _c[_b];
                    if (object === camera) {
                        cameraInScene = true;
                        break;
                    }
                }
                if (!cameraInScene) {
                    console.error("Camera has not been added in Scene. Rendering stopped");
                    return;
                }
                material.program.make(this.gl, mesh, scene, camera, material);
                this.gl.useProgram(material.program.webGlProgram);
                for (var textureName in material.program.textures) {
                    if (material.program.textures[textureName] !== undefined) {
                        this.loadTexture(material.program, textureName, material.program.textures[textureName]);
                    }
                }
                if (scene.openLight) {
                    this.setUpLights(scene, material, mesh, camera);
                }
            }
        };
        Renderer.prototype.loadTexture = function (program, sampler, texture) {
            var _this = this;
            if (!texture.image) {
                this.addTextureToProgram(program, sampler, texture);
                return;
            }
            var lastOnload = texture.image.onload;
            if (texture.image.complete) {
                this.addTextureToProgram(program, sampler, texture);
                return;
            }
            texture.image.onload = function (et) {
                if (lastOnload) {
                    lastOnload.apply(texture.image, et);
                }
                _this.addTextureToProgram(program, sampler, texture);
            };
        };
        Renderer.prototype.addTextureToProgram = function (program, sampler, texture) {
            texture.setUnit(this.usedTextureNum);
            this.usedTextureNum++;
            program.textures.push(texture);
            this.gl.useProgram(program.webGlProgram);
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
            this.gl.activeTexture(this.gl.TEXTURE0 + texture.unit);
            this.gl.bindTexture(texture.target, texture.glTexture);
            this.gl.texParameteri(texture.target, this.gl.TEXTURE_WRAP_S, texture.wrapS);
            this.gl.texParameteri(texture.target, this.gl.TEXTURE_WRAP_T, texture.wrapT);
            this.gl.texParameteri(texture.target, this.gl.TEXTURE_MAG_FILTER, texture.magFilter);
            this.gl.texParameteri(texture.target, this.gl.TEXTURE_MIN_FILTER, texture.minFilter);
            texture.setUpTextureData(this.gl);
            program.addUniform(sampler, { type: CanvasToy.DataType.int, updator: function () { return texture.unit; } });
        };
        Renderer.prototype.setUpLights = function (scene, material, mesh, camera) {
            var _loop_2 = function (index) {
                var light = scene.lights[index];
                console.assert(light.uniforms !== undefined);
                var _loop_3 = function (uniformProperty) {
                    material.program.addUniform("lights[" + index + "]." + uniformProperty.name, {
                        type: uniformProperty.type,
                        updator: function () {
                            return uniformProperty.updator(light);
                        },
                    });
                };
                for (var _i = 0, _a = light.uniforms; _i < _a.length; _i++) {
                    var uniformProperty = _a[_i];
                    _loop_3(uniformProperty);
                }
            };
            for (var index in scene.lights) {
                _loop_2(index);
            }
        };
        Renderer.prototype.copyDataToVertexBuffer = function (geometry) {
            for (var name_2 in geometry.attributes) {
                var attribute = geometry.attributes[name_2];
                if (attribute !== undefined) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(attribute.data), this.gl.STATIC_DRAW);
                    console.log(name_2 + "buffer size:" + this.gl.getBufferParameter(this.gl.ARRAY_BUFFER, this.gl.BUFFER_SIZE));
                }
            }
        };
        Renderer.prototype.renderLight = function (light, scene) {
        };
        Renderer.prototype.renderObject = function (camera, object) {
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
                    this.gl.useProgram(program.webGlProgram);
                    program.pass(mesh, camera, material);
                    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
                    this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.faces.data.length, this.gl.UNSIGNED_SHORT, 0);
                }
            }
        };
        Renderer.prototype.initMatrix = function () {
        };
        return Renderer;
    }());
    CanvasToy.Renderer = Renderer;
    var ForwardProcessor = (function () {
        function ForwardProcessor() {
        }
        return ForwardProcessor;
    }());
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Scene = (function () {
        function Scene() {
            this.objects = [];
            this.lights = [];
            this.ambientLight = vec3.fromValues(0, 0, 0);
            this.openLight = false;
            this.enableShadowMap = false;
            this.clearColor = [0, 0, 0, 0];
            this.programSetUp = false;
        }
        Scene.prototype.update = function (dt) {
            for (var _i = 0, _a = this.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (!object.parent) {
                    object.update(dt);
                }
            }
        };
        Scene.prototype.addObject = function (object) {
            var _this = this;
            this.objects.push(object);
            object.scene = this;
            object.children.forEach(function (child) {
                _this.addObject(child);
            });
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
        Scene.prototype.addLight = function (light) {
            this.openLight = true;
            this.lights.push(light);
            light.scene = this;
            return this;
        };
        return Scene;
    }());
    CanvasToy.Scene = Scene;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var InterplotationMethod;
    (function (InterplotationMethod) {
        InterplotationMethod[InterplotationMethod["Flat"] = 0] = "Flat";
        InterplotationMethod[InterplotationMethod["Gouraud"] = 1] = "Gouraud";
        InterplotationMethod[InterplotationMethod["Phong"] = 2] = "Phong";
        InterplotationMethod[InterplotationMethod["DepthPhong"] = 3] = "DepthPhong";
    })(InterplotationMethod = CanvasToy.InterplotationMethod || (CanvasToy.InterplotationMethod = {}));
    var LightingMode;
    (function (LightingMode) {
        LightingMode[LightingMode["Phong"] = 0] = "Phong";
        LightingMode[LightingMode["Cell"] = 1] = "Cell";
        LightingMode[LightingMode["Blinn_Phong"] = 2] = "Blinn_Phong";
        LightingMode[LightingMode["Physical"] = 3] = "Physical";
    })(LightingMode = CanvasToy.LightingMode || (CanvasToy.LightingMode = {}));
    var StandardShaderBuilder = (function () {
        function StandardShaderBuilder() {
            this._definitions = [
                CanvasToy.definitions__light_glsl,
            ];
            this._interplotationMethod = InterplotationMethod.Phong;
            this._interplotationVert = CanvasToy.interploters__phong_vert;
            this._interplotationFrag = CanvasToy.interploters__phong_frag;
            this._lightingMode = LightingMode.Blinn_Phong;
            this._lightingModeSource = CanvasToy.calculators__blinn_phong_glsl;
        }
        StandardShaderBuilder.prototype.setInterplotationMethod = function (method) {
            switch (method) {
                case (InterplotationMethod.Flat):
                    this._interplotationVert = CanvasToy.interploters__gouraud_vert;
                    this._interplotationFrag = CanvasToy.interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Gouraud):
                    this._interplotationVert = CanvasToy.interploters__gouraud_vert;
                    this._interplotationFrag = CanvasToy.interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Phong):
                    this._interplotationVert = CanvasToy.interploters__phong_vert;
                    this._interplotationFrag = CanvasToy.interploters__phong_frag;
                    break;
                case (InterplotationMethod.DepthPhong):
                    this._interplotationVert = CanvasToy.interploters__depth_phong_vert;
                    this._interplotationFrag = CanvasToy.interploters__depth_phong_frag;
                    break;
                default: break;
            }
            return this;
        };
        StandardShaderBuilder.prototype.setLightingMode = function (lightingMode) {
            switch (lightingMode) {
                case (LightingMode.Blinn_Phong):
                    this._lightingModeSource = CanvasToy.calculators__blinn_phong_glsl;
                    break;
                case (LightingMode.Phong):
                    this._lightingModeSource = CanvasToy.calculators__phong_glsl;
                    break;
                default: break;
            }
            return this;
        };
        StandardShaderBuilder.prototype.build = function (gl) {
            return new CanvasToy.Program(gl, {
                vertexShader: this._definitions.join("\n") +
                    this._lightingModeSource +
                    this._interplotationVert,
                fragmentShader: this._definitions.join("\n") +
                    this._lightingModeSource +
                    this._interplotationFrag,
            }, CanvasToy.defaultProgramPass);
        };
        return StandardShaderBuilder;
    }());
    CanvasToy.StandardShaderBuilder = StandardShaderBuilder;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var CubeTexture = (function (_super) {
        __extends(CubeTexture, _super);
        function CubeTexture(gl, xneg, xpos, yneg, ypos, zneg, zpos) {
            var _this = _super.call(this, gl) || this;
            _this.count = 6;
            _this.xneg = xneg;
            _this.xpos = xpos;
            _this.yneg = yneg;
            _this.ypos = ypos;
            _this.zneg = zneg;
            _this.zpos = zpos;
            _this.xneg.onload = _this.onLoad;
            _this.xpos.onload = _this.onLoad;
            _this.yneg.onload = _this.onLoad;
            _this.ypos.onload = _this.onLoad;
            _this.zneg.onload = _this.onLoad;
            _this.zpos.onload = _this.onLoad;
            return _this;
        }
        CubeTexture.prototype.setUpTextureData = function (gl) {
            if (_super.prototype.setUpTextureData.call(this, gl)) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.xneg);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.xpos);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.yneg);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.ypos);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.zneg);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.zpos);
            }
            return true;
        };
        CubeTexture.prototype.onLoad = function () {
            this.count--;
            if (this.count === 0) {
                this.isReadyToUpdate = true;
            }
        };
        return CubeTexture;
    }(CanvasToy.Texture));
    CanvasToy.CubeTexture = CubeTexture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Texture2D = (function (_super) {
        __extends(Texture2D, _super);
        function Texture2D(gl, image) {
            return _super.call(this, gl, image) || this;
        }
        Texture2D.prototype.setUpTextureData = function (gl) {
            if (_super.prototype.setUpTextureData.call(this, gl)) {
                gl.texImage2D(this.target, 0, this.format, this.format, this.type, this.image);
            }
            return true;
        };
        return Texture2D;
    }(CanvasToy.Texture));
    CanvasToy.Texture2D = Texture2D;
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
    function initWebwebglContext(canvas) {
        var gl = undefined;
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
    function linkShader(gl, vertexShader, fragmentShader) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("error: link shader program failed.\n" + gl.getProgramInfoLog(shaderProgram));
        }
        return shaderProgram;
    }
    ;
    function createEntileShader(gl, vertexShaderSource, fragmentShaderSource) {
        var vertShader = createSeparatedShader(gl, vertexShaderSource, ShaderType.VertexShader);
        var fragShader = createSeparatedShader(gl, fragmentShaderSource, ShaderType.FragmentShader);
        return linkShader(gl, vertShader, fragShader);
    }
    CanvasToy.createEntileShader = createEntileShader;
})(CanvasToy || (CanvasToy = {}));
//# sourceMappingURL=canvas-toy.js.map