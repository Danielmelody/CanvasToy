var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.gl = null;
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
    var Object3d = (function () {
        function Object3d(tag) {
            this.children = [];
            this.objectToWorldMatrix = mat4.create();
            this._parent = null;
            this._localMatrix = mat4.create();
            this._matrix = mat4.create();
            this._localPosition = vec3.create();
            this._localRotation = quat.create();
            this._localScaling = vec3.fromValues(1, 1, 1);
            this._position = vec3.create();
            this._scaling = vec3.fromValues(1, 1, 1);
            this._rotation = quat.create();
            this.updateEvents = [];
            this.startEvents = [];
            this.tag = tag;
        }
        Object.defineProperty(Object3d.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (_parent) {
                _parent.children.push(this);
                this._parent = _parent;
            },
            enumerable: true,
            configurable: true
        });
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
            set: function (_localPosition) {
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (_position) {
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "localRotation", {
            get: function () {
                return this._localRotation;
            },
            set: function (_localRotation) {
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (_rotation) {
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "localScaling", {
            get: function () {
                return this._localScaling;
            },
            set: function (_localScaling) {
                console.assert(_localScaling && _localScaling.length === 3, "invalid object scale paramter");
                this._localScaling = _localScaling;
                if (!!this._parent) {
                    vec3.mul(this._scaling, this._parent.scaling, this._localScaling);
                }
                else {
                    this._scaling = vec3.clone(_localScaling);
                }
                this.applyToChildren();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3d.prototype, "scaling", {
            get: function () {
                return this._scaling;
            },
            set: function (_scaling) {
                console.assert(_scaling && _scaling.length === 3, "invalid object scale paramter");
                this._scaling = _scaling;
                if (!!this._parent) {
                    vec3.div(this.localScaling, this.scaling, this._parent.scaling);
                }
                else {
                    this.localScaling = vec3.clone(_scaling);
                }
                this.applyToChildren();
            },
            enumerable: true,
            configurable: true
        });
        Object3d.prototype.setTransformFromParent = function () {
            if (!!this.parent) {
                this._matrix = mat4.mul(mat4.create(), this.parent.matrix, this.localMatrix);
                this.genOtherMatrixs();
                mat4.getTranslation(this._position, this.matrix);
                mat4.getRotation(this._rotation, this.matrix);
                vec3.mul(this.scaling, this.parent.scaling, this.localScaling);
            }
        };
        Object3d.prototype.registUpdate = function (updateFunction) {
            this.updateEvents.push(updateFunction);
        };
        Object3d.prototype.registStart = function (updateFunction) {
            this.startEvents.push(updateFunction);
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
            this.localPosition = vec3.add(this.localPosition, vec3.clone(this.localPosition), delta);
        };
        Object3d.prototype.rotateX = function (angle) {
            this.localRotation = quat.rotateX(this.localRotation, quat.clone(this.localRotation), angle);
        };
        Object3d.prototype.rotateY = function (angle) {
            this.localRotation = quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle);
        };
        Object3d.prototype.rotateZ = function (angle) {
            this.localRotation = quat.rotateY(this.localRotation, quat.clone(this.localRotation), angle);
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
            _this.projectionMatrix = mat4.create();
            return _this;
        }
        return Camera;
    }(CanvasToy.Object3d));
    CanvasToy.Camera = Camera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var OrthoCamera = (function (_super) {
        __extends(OrthoCamera, _super);
        function OrthoCamera(left, right, bottom, top, near, far) {
            if (left === void 0) { left = -1; }
            if (right === void 0) { right = 1; }
            if (bottom === void 0) { bottom = -1; }
            if (top === void 0) { top = 1; }
            if (near === void 0) { near = 0.001; }
            if (far === void 0) { far = 10000; }
            var _this = _super.call(this) || this;
            _this.left = left;
            _this.right = right;
            _this.bottom = bottom;
            _this.top = top;
            _this.near = near;
            _this.far = far;
            mat4.ortho(_this.projectionMatrix, left, right, bottom, top, near, far);
            return _this;
        }
        OrthoCamera.prototype.genOtherMatrixs = function () {
            _super.prototype.genOtherMatrixs.call(this);
            mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far);
        };
        OrthoCamera.prototype.adaptTargetRadio = function (target) {
            this.left = -target.width / 2;
            this.right = target.width / 2;
            this.top = target.height / 2;
            this.bottom = -target.height / 2;
        };
        return OrthoCamera;
    }(CanvasToy.Camera));
    CanvasToy.OrthoCamera = OrthoCamera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(aspect, fovy, near, far) {
            if (aspect === void 0) { aspect = 1; }
            if (fovy === void 0) { fovy = 45; }
            if (near === void 0) { near = 0.01; }
            if (far === void 0) { far = 10000; }
            var _this = _super.call(this) || this;
            _this.aspect = aspect;
            _this.fovy = fovy;
            _this.near = near;
            _this.far = far;
            return _this;
        }
        PerspectiveCamera.prototype.genOtherMatrixs = function () {
            _super.prototype.genOtherMatrixs.call(this);
            this.projectionMatrix = mat4.perspective(mat4.create(), this.fovy, this.aspect, this.near, this.far);
        };
        PerspectiveCamera.prototype.adaptTargetRadio = function (target) {
            this.aspect = target.width / target.height;
            this.genOtherMatrixs();
        };
        return PerspectiveCamera;
    }(CanvasToy.Camera));
    CanvasToy.PerspectiveCamera = PerspectiveCamera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Geometry = (function () {
        function Geometry() {
            this.attributes = {
                position: new CanvasToy.Attribute({ type: CanvasToy.DataType.float, size: 3, data: [] }),
                uv: new CanvasToy.Attribute({ type: CanvasToy.DataType.float, size: 2, data: [] }),
                normal: new CanvasToy.Attribute({ type: CanvasToy.DataType.float, size: 3, data: [] }),
                flatNormal: new CanvasToy.Attribute({ type: CanvasToy.DataType.float, size: 3, data: [] }),
            };
            this.faces = { data: [], buffer: CanvasToy.gl.createBuffer() };
        }
        Geometry.prototype.setAttribute = function (name, attribute) {
            this.attributes[name] = attribute;
        };
        Geometry.prototype.addVertex = function (vertex) {
            for (var attributeName in this.attributes) {
                if (this.attributes[attributeName] !== undefined) {
                    if (vertex[attributeName] === undefined) {
                        return;
                    }
                    if (vertex[attributeName].length !== this.attributes[attributeName].size) {
                        console.error("length " + attributeName + "wrong");
                        return;
                    }
                    this.attributes[attributeName].data
                        = this.attributes[attributeName].data.concat(vertex[attributeName]);
                }
            }
        };
        Geometry.prototype.removeAttribute = function (name) {
            this.attributes[name] = undefined;
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
            _this.drawMode = CanvasToy.gl.STATIC_DRAW;
            _this.materials = [];
            _this.maps = [];
            _this.normalMatrix = mat4.create();
            _this.materials = materials;
            _this.geometry = geometry;
            return _this;
        }
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
    var Faces = (function () {
        function Faces(data) {
            this.buffer = CanvasToy.gl.createBuffer();
            this.data = [];
            this.data = data;
        }
        return Faces;
    }());
    CanvasToy.Faces = Faces;
    var Attribute = (function () {
        function Attribute(paramter) {
            this.size = 3;
            this.data = [];
            this.index = 0;
            this.stride = 0;
            this.buffer = CanvasToy.gl.createBuffer();
            for (var attributeInfo in paramter) {
                this[attributeInfo] = paramter[attributeInfo] ? paramter[attributeInfo] : this[attributeInfo];
            }
            switch (paramter.type) {
                case CanvasToy.DataType.float:
                    this.type = CanvasToy.gl.FLOAT;
                    break;
                case CanvasToy.DataType.int:
                    this.type = CanvasToy.gl.INT;
                    break;
                default: break;
            }
        }
        return Attribute;
    }());
    CanvasToy.Attribute = Attribute;
    var Program = (function () {
        function Program(passing) {
            this.enableDepthTest = true;
            this.enableStencilTest = true;
            this.uniforms = {};
            this.attributes = {};
            this.attributeLocations = {};
            this.drawMode = CanvasToy.gl.STATIC_DRAW;
            this.textures = [];
            this.vertexPrecision = "highp";
            this.fragmentPrecision = "mediump";
            this.prefix = [];
            this.passings = [];
            this.passings.push(passing);
        }
        Program.prototype.make = function (material, mesh, scene, camera) {
            this.prefix = [
                material.mainTexture ? "#define USE_TEXTURE " : "",
                material.color ? "#define USE_COLOR " : "",
                scene.openLight ? "#define OPEN_LIGHT \n#define LIGHT_NUM "
                    + scene.lights.length : "",
            ];
            if (!!this.passings) {
                var passes = this.passings.map(function (passing) { return passing(mesh, scene, camera, material); });
                var finalPass_1 = {};
                passes.forEach(function (pass) {
                    CanvasToy.mixin(finalPass_1, pass);
                });
                this.rePass(finalPass_1);
            }
        };
        Program.prototype.addPassing = function (passing) {
            this.passings.push(passing);
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
        };
        Program.prototype.setAttribute0 = function (name) {
            this.attribute0 = name;
            CanvasToy.gl.bindAttribLocation(this.webGlProgram, 0, name);
        };
        Program.prototype.addUniform = function (nameInShader, uniform) {
            CanvasToy.gl.useProgram(this.webGlProgram);
            var location = this.getUniformLocation(nameInShader);
            switch (uniform.type) {
                case CanvasToy.DataType.float:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        CanvasToy.gl.uniform1f(location, uniform.updator(mesh, camera));
                    };
                    break;
                case CanvasToy.DataType.int:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        CanvasToy.gl.uniform1i(location, uniform.updator(mesh, camera));
                    };
                    break;
                case CanvasToy.DataType.vec2:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        var value = uniform.updator(mesh, camera);
                        CanvasToy.gl.uniform2f(location, value[0], value[1]);
                    };
                    break;
                case CanvasToy.DataType.vec3:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        var value = uniform.updator(mesh, camera);
                        CanvasToy.gl.uniform3f(location, value[0], value[1], value[2]);
                    };
                    break;
                case CanvasToy.DataType.vec4:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        var value = uniform.updator(mesh, camera);
                        CanvasToy.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    };
                    break;
                case CanvasToy.DataType.mat2:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        CanvasToy.gl.uniformMatrix2fv(location, false, uniform.updator(mesh, camera));
                    };
                case CanvasToy.DataType.mat3:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        CanvasToy.gl.uniformMatrix3fv(location, false, uniform.updator(mesh, camera));
                    };
                case CanvasToy.DataType.mat4:
                    this.uniforms[nameInShader] = function (mesh, camera) {
                        CanvasToy.gl.uniformMatrix4fv(location, false, uniform.updator(mesh, camera));
                    };
                    break;
                default: break;
            }
        };
        Program.prototype.addAttribute = function (nameInShader, attribute) {
            var location = this.getAttribLocation(nameInShader);
            if (location !== null && location !== -1) {
                this.attributes[nameInShader] = attribute;
                this.attributeLocations[nameInShader] = location;
                CanvasToy.gl.enableVertexAttribArray(location);
            }
        };
        Program.prototype.getUniformLocation = function (name) {
            if (CanvasToy.gl === undefined || CanvasToy.gl === null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = CanvasToy.gl.getUniformLocation(this.webGlProgram, name);
            if (result === null) {
                console.warn("uniform " + name + " not found!");
                return null;
            }
            return result;
        };
        Program.prototype.rePass = function (parameter) {
            if (!!(parameter.vertexShader) || !!(parameter.fragmentShader) || !!(parameter.prefix)) {
                this.vertexShader = parameter.vertexShader || this.vertexShader;
                this.fragmentShader = parameter.fragmentShader || this.fragmentShader;
                this.webGlProgram = CanvasToy.createEntileShader(CanvasToy.gl, "precision " + this.vertexPrecision + " float;\n" + this.prefix.join("\n") + "\n"
                    + this.vertexShader, "precision " + this.fragmentPrecision + " float;\n" + this.prefix.join("\n") + "\n"
                    + this.fragmentShader);
            }
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
        };
        Program.prototype.getAttribLocation = function (name) {
            if (CanvasToy.gl === undefined || CanvasToy.gl === null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = CanvasToy.gl.getAttribLocation(this.webGlProgram, name);
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
            vertexShader: material.shaderSource.vertexShader,
            fragmentShader: material.shaderSource.fragmentShader,
            faces: mesh.geometry.faces,
            textures: {
                uMainTexture: material.mainTexture,
            },
            uniforms: {
                modelViewProjectionMatrix: {
                    type: CanvasToy.DataType.mat4,
                    updator: function (meshOnUpdate, cameraOnUpdate) {
                        return new Float32Array(mat4.multiply(mat4.create(), cameraOnUpdate.projectionMatrix, mat4.multiply(mat4.create(), camera.objectToWorldMatrix, meshOnUpdate.matrix)));
                    },
                },
                color: !material.color ? undefined : {
                    type: CanvasToy.DataType.vec4, updator: function () {
                        return material.color;
                    },
                },
                ambient: !scene.openLight ? undefined : {
                    type: CanvasToy.DataType.vec3,
                    updator: function () { return scene.ambientLight; },
                },
                normalMatrix: !scene.openLight ? undefined : {
                    type: CanvasToy.DataType.mat4,
                    updator: function () { return new Float32Array(mesh.normalMatrix); },
                },
                eyePos: !scene.openLight ? undefined : {
                    type: CanvasToy.DataType.vec4,
                    updator: function (meshOnUpdate, cameraOnUpdate) {
                        return vec4.fromValues(cameraOnUpdate.position[0], cameraOnUpdate.position[1], cameraOnUpdate.position[2], 1);
                    },
                },
            },
            attributes: {
                position: mesh.geometry.attributes.position,
                aMainUV: !material.mainTexture ? undefined : mesh.geometry.attributes.uv,
                aNormal: !scene.openLight ?
                    undefined :
                    material.interplotationMethod === CanvasToy.InterplotationMethod.Flat ?
                        mesh.geometry.attributes.flatNormal : mesh.geometry.attributes.normal,
            },
        };
    };
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.calculators__lambert_glsl = "vec3 calculate_light(vec4 position, vec3 normal, vec4 lightPos, vec4 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {\n    vec3 lightDir = normalize((lightPos - position).xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
    CanvasToy.calculators__phong_glsl = "\nvec3 calculate_light(vec4 position, vec3 normal, vec4 lightPos, vec4 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {\n    vec3 lightDir = normalize((lightPos - position).xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
    CanvasToy.env_map_vert = "";
    CanvasToy.interploters__gouraud_frag = "#ifdef USE_COLOR // color declaration\nuniform vec4 color;\n#endif // color declaration\n\n#ifdef USE_TEXTURE // texture declaration\nvarying vec2 vMainUV;\nuniform sampler2D uMainTexture;\nvec4 textureColor;\n#endif // texture declaration\n\n#ifdef OPEN_LIGHT // light declaration\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec4 position;\n    bool directional;\n};\nuniform vec3 ambient;\nuniform vec4 eyePos;\nvarying vec4 position;\nvec3 totalLighting;\nuniform Light lights[LIGHT_NUM];\nvarying vec3 vNormal;\n#endif // light declaration\n\nvoid main() {\n#ifdef USE_TEXTURE\n    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n#ifdef OPEN_LIGHT\n    totalLighting = ambient;\n    vec3 normal = normalize(vNormal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        calculate_light()\n    }\n    gl_FragColor = vec4(totalLighting, 1.0);\n#else\n#ifdef USE_COLOR\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#endif\n#endif\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * textureColor;\n#endif\n#ifdef USE_COLOR\n    gl_FragColor = gl_FragColor * color;\n#endif\n}\n";
    CanvasToy.interploters__gouraud_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE // texture\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif // texture\n\n#ifdef OPEN_LIGHT // light\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec4 position;\n    bool directional;\n}; // light\n\nuniform vec3 ambient;\nuniform vec4 eyePos;\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vLightColor;\nvec3 totalLighting;\nuniform Light lights[LIGHT_NUM];\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    totalLighting = ambient;\n    normal = normalize(normal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);\n    }\n    vLightColor = totalLighting;\n#endif\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n";
    CanvasToy.interploters__phong_frag = "#ifdef USE_COLOR // color declaration\nuniform vec4 color;\n#endif\n\n#ifdef USE_TEXTURE // texture declaration\nvarying vec2 vMainUV;\nuniform sampler2D uMainTexture;\nvec4 textureColor;\n#endif\n\n#ifdef OPEN_LIGHT\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec4 position;\n    bool directional;\n};\nvarying vec4 vPosition;\nvarying vec3 vNormal;\nuniform vec3 ambient;\nuniform vec4 eyePos;\nvec3 totalLighting;\nuniform Light lights[LIGHT_NUM];\n#endif\n\nvoid main () {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#ifdef USE_COLOR\n    gl_FragColor = color;\n#endif\n\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * texture2D(uMainTexture, vMainUV);\n#endif\n#ifdef OPEN_LIGHT\n    vec3 normal = normalize(vNormal);\n    totalLighting = ambient;\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(vPosition, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4.0, lights[index].idensity);\n    }\n    gl_FragColor *= vec4(totalLighting, 1.0);\n#endif\n}\n";
    CanvasToy.interploters__phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec4 vPosition;\nvarying vec3 vNormal;\n#endif\n\n// #ifdef SHOW_LIGHT_POS\n\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;\n    vPosition = gl_Position;\n#endif\n\n#ifdef USE_TEXTURE\n    vMainUV = aMainUV;\n#endif\n}\n";
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Texture = (function () {
        function Texture(image, type, format, wrapS, wrapT, magFilter, minFilter) {
            if (type === void 0) { type = CanvasToy.gl.TEXTURE_2D; }
            if (format === void 0) { format = CanvasToy.gl.RGB; }
            if (wrapS === void 0) { wrapS = CanvasToy.gl.CLAMP_TO_EDGE; }
            if (wrapT === void 0) { wrapT = CanvasToy.gl.CLAMP_TO_EDGE; }
            if (magFilter === void 0) { magFilter = CanvasToy.gl.NEAREST; }
            if (minFilter === void 0) { minFilter = CanvasToy.gl.NEAREST; }
            this.textureCoord = [];
            this.dataCompleted = false;
            this.isReadyToUpdate = false;
            this.image = image;
            this.type = type;
            this.format = format;
            this.wrapS = wrapS;
            this.wrapT = wrapT;
            this.magFilter = magFilter;
            this.minFilter = minFilter;
            this.glTexture = CanvasToy.gl.createTexture();
        }
        Texture.prototype.setUpTextureData = function () {
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
    var InterplotationMethod;
    (function (InterplotationMethod) {
        InterplotationMethod[InterplotationMethod["Flat"] = 0] = "Flat";
        InterplotationMethod[InterplotationMethod["Gouraud"] = 1] = "Gouraud";
        InterplotationMethod[InterplotationMethod["Phong"] = 2] = "Phong";
    })(InterplotationMethod = CanvasToy.InterplotationMethod || (CanvasToy.InterplotationMethod = {}));
    var LightingMode;
    (function (LightingMode) {
        LightingMode[LightingMode["Lambort"] = 0] = "Lambort";
        LightingMode[LightingMode["Phong"] = 1] = "Phong";
        LightingMode[LightingMode["Cell"] = 2] = "Cell";
        LightingMode[LightingMode["Blinn_Phong"] = 3] = "Blinn_Phong";
        LightingMode[LightingMode["Physical"] = 4] = "Physical";
    })(LightingMode = CanvasToy.LightingMode || (CanvasToy.LightingMode = {}));
    var Material = (function () {
        function Material(paramter) {
            if (paramter === void 0) { paramter = {}; }
            this.ambient = vec3.fromValues(0.1, 0.1, 0.1);
            this.diffuse = vec3.fromValues(0.8, 0.8, 0.8);
            this.specular = vec3.fromValues(1, 1, 1);
            this.opacity = vec3.fromValues(0, 0, 0);
            this.interplotationMethod = InterplotationMethod.Phong;
            this.lightingMode = LightingMode.Phong;
            if (!!paramter) {
                for (var name_1 in paramter) {
                    this[name_1] = paramter[name_1];
                }
            }
            this.configShader();
            if (!this.program) {
                this.program = new CanvasToy.Program(CanvasToy.defaultProgramPass);
            }
        }
        Material.prototype.configShader = function () {
            var interplotationVert = "";
            var interplotationFrag = "";
            switch (this.interplotationMethod) {
                case (InterplotationMethod.Flat):
                    interplotationVert = CanvasToy.interploters__gouraud_vert;
                    interplotationFrag = CanvasToy.interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Gouraud):
                    interplotationVert = CanvasToy.interploters__gouraud_vert;
                    interplotationFrag = CanvasToy.interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Phong):
                    interplotationVert = CanvasToy.interploters__phong_vert;
                    interplotationFrag = CanvasToy.interploters__phong_frag;
                    break;
                default: break;
            }
            var lightCalculator = "";
            switch (this.lightingMode) {
                case (LightingMode.Lambort):
                    lightCalculator = CanvasToy.calculators__lambert_glsl;
                    break;
                case (LightingMode.Phong):
                    lightCalculator = CanvasToy.calculators__phong_glsl;
                    break;
                default: break;
            }
            this.shaderSource = {
                vertexShader: lightCalculator + interplotationVert,
                fragmentShader: lightCalculator + interplotationFrag,
            };
        };
        return Material;
    }());
    CanvasToy.Material = Material;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Water = (function (_super) {
        __extends(Water, _super);
        function Water() {
            return _super.call(this, new CanvasToy.Geometry(), [new CanvasToy.Material()]) || this;
        }
        return Water;
    }(CanvasToy.Mesh));
    CanvasToy.Water = Water;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var CubeGeometry = (function (_super) {
        __extends(CubeGeometry, _super);
        function CubeGeometry() {
            var _this = _super.call(this) || this;
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
        function RectGeometry() {
            var _this = _super.call(this) || this;
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
        function SphereGeometry(radius, perVertDistance) {
            var _this = _super.call(this) || this;
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
            _this.diffuse = vec3.fromValues(1, 1, 1);
            _this.specular = vec3.fromValues(1, 1, 1);
            _this.idensity = 1.0;
            return _this;
        }
        return Light;
    }(CanvasToy.Object3d));
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
            _this.projectCamera = new CanvasToy.PerspectiveCamera();
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
            _this.coneAngle = 1;
            _this.direction = vec3.fromValues(1, 1, 1);
            return _this;
        }
        return SpotLight;
    }(CanvasToy.Light));
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var OBJLoader = (function () {
        function OBJLoader() {
        }
        OBJLoader.load = function (url, onload) {
            OBJLoader.fetch(url, function (content) {
                content = content.replace(OBJLoader.commentPattern, "");
                var positionlines = content.match(OBJLoader.vertexPattern);
                var uvlines = content.match(OBJLoader.uvPattern);
                var normallines = content.match(OBJLoader.normalPattern);
                var unIndexedPositions = OBJLoader.praiseAttibuteLines(positionlines);
                var unIndexedUVs = OBJLoader.praiseAttibuteLines(uvlines);
                var unIndexedNormals = OBJLoader.praiseAttibuteLines(normallines);
                var container = OBJLoader.buildUpMeshes(content, unIndexedPositions, unIndexedUVs, unIndexedNormals);
                onload(container);
            });
        };
        OBJLoader.fetch = function (url, onload) {
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
        };
        OBJLoader.praiseAttibuteLines = function (lines) {
            var result = [];
            if (lines === null) {
                return;
            }
            lines.forEach(function (expression) {
                var data = [];
                expression.match(OBJLoader.numberPattern).forEach(function (floatNum) {
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
        OBJLoader.buildUpMeshes = function (content, unIndexedPositions, unIndexedUVs, unIndexedNormals) {
            var container = new CanvasToy.Object3d();
            var objects = content.split(OBJLoader.objectSplitPattern);
            objects.splice(0, 1);
            objects.forEach(function (objectContent) {
                var geometry = new CanvasToy.Geometry();
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
                var mesh = new CanvasToy.Mesh(geometry, [new CanvasToy.Material()]);
                mesh.parent = container;
            });
            return container;
        };
        return OBJLoader;
    }());
    OBJLoader.commentPattern = /#.*/mg;
    OBJLoader.numberPattern = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/mg;
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
    var BufferUsage;
    (function (BufferUsage) {
        BufferUsage[BufferUsage["Color"] = 0] = "Color";
        BufferUsage[BufferUsage["Depth"] = 1] = "Depth";
        BufferUsage[BufferUsage["Stencil"] = 2] = "Stencil";
    })(BufferUsage = CanvasToy.BufferUsage || (CanvasToy.BufferUsage = {}));
    var RenderBuffer = (function () {
        function RenderBuffer(frameBuffer) {
            this.glRenderBuffer = CanvasToy.gl.createRenderbuffer();
            this.frameBuffer = frameBuffer;
        }
        RenderBuffer.prototype.toTexture = function () {
            this.targetTexture = new CanvasToy.Texture();
            return this.targetTexture;
        };
        return RenderBuffer;
    }());
    CanvasToy.RenderBuffer = RenderBuffer;
    var FrameBuffer = (function () {
        function FrameBuffer() {
            this.glFramebuffer = CanvasToy.gl.createFramebuffer();
            this.rbos = {};
        }
        FrameBuffer.prototype.getRenderBuffer = function (usage) {
            switch (usage) {
                case BufferUsage.Color:
                    return this.rbos.color;
                case BufferUsage.Depth:
                    return this.rbos.depth;
                case BufferUsage.Stencil:
                    return this.rbos.stencil;
                default:
                    return this.rbos.color;
            }
        };
        FrameBuffer.prototype.enableRenderBuffer = function (usage) {
            switch (usage) {
                case BufferUsage.Color:
                    this.rbos.color = new RenderBuffer(this);
                    this.rbos.color.attachment = CanvasToy.gl.COLOR_ATTACHMENT0;
                    break;
                case BufferUsage.Depth:
                    this.rbos.depth = new RenderBuffer(this);
                    this.rbos.depth.attachment = CanvasToy.gl.DEPTH_ATTACHMENT;
                    break;
                case BufferUsage.Stencil:
                    this.rbos.stencil = new RenderBuffer(this);
                    this.rbos.stencil.attachment = CanvasToy.gl.STENCIL_ATTACHMENT;
                    break;
                default:
                    this.rbos.color = new RenderBuffer(this);
                    this.rbos.color.attachment = CanvasToy.gl.COLOR_ATTACHMENT0;
                    break;
            }
        };
        return FrameBuffer;
    }());
    CanvasToy.FrameBuffer = FrameBuffer;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    function setCanvas(canvas) {
        CanvasToy.engine = new Renderer(canvas);
    }
    CanvasToy.setCanvas = setCanvas;
    var RenderMode;
    (function (RenderMode) {
        RenderMode[RenderMode["Dynamic"] = 0] = "Dynamic";
        RenderMode[RenderMode["Static"] = 1] = "Static";
    })(RenderMode = CanvasToy.RenderMode || (CanvasToy.RenderMode = {}));
    var Renderer = (function () {
        function Renderer(canvas) {
            var _this = this;
            this.canvas = null;
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
                    renderCommand();
                }
                if (_this.stopped) {
                    return;
                }
                setTimeout(_this.main, _this.frameRate);
            };
            this.canvas = canvas;
            CanvasToy.gl = CanvasToy.initWebwebglContext(canvas);
            this.initMatrix();
            CanvasToy.gl.clearDepth(1.0);
            CanvasToy.gl.enable(CanvasToy.gl.DEPTH_TEST);
            CanvasToy.gl.depthFunc(CanvasToy.gl.LEQUAL);
            setTimeout(this.main, this.frameRate);
        }
        Renderer.prototype.createFrameBuffer = function () {
            var fbo = new CanvasToy.FrameBuffer();
            this.fbos.push(fbo);
            return fbo;
        };
        Renderer.prototype.renderFBO = function (scene, camera) {
            var _this = this;
            this.buildSingleRender(scene, camera);
            var _loop_1 = function (frameBuffer) {
                frameBuffer = frameBuffer;
                CanvasToy.gl.bindFramebuffer(CanvasToy.gl.FRAMEBUFFER, frameBuffer.glFramebuffer);
                for (var rboi in frameBuffer.rbos) {
                    var renderBuffer = frameBuffer.rbos[rboi];
                    var rttTexture = renderBuffer.targetTexture;
                    if (rttTexture != null) {
                        CanvasToy.gl.bindTexture(CanvasToy.gl.TEXTURE_2D, rttTexture.glTexture);
                        CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_2D, 0, rttTexture.format, this_1.canvas.width, this_1.canvas.height, 0, rttTexture.format, CanvasToy.gl.UNSIGNED_BYTE, null);
                        CanvasToy.gl.framebufferTexture2D(CanvasToy.gl.FRAMEBUFFER, renderBuffer.attachment, CanvasToy.gl.TEXTURE_2D, rttTexture.glTexture, 0);
                        CanvasToy.gl.bindTexture(CanvasToy.gl.TEXTURE_2D, null);
                        CanvasToy.gl.bindRenderbuffer(CanvasToy.gl.RENDERBUFFER, null);
                    }
                }
                this_1.renderQueue.push(function () {
                    CanvasToy.gl.bindFramebuffer(CanvasToy.gl.FRAMEBUFFER, frameBuffer.glFramebuffer);
                    for (var rboi in frameBuffer.rbos) {
                        var renderBuffer = frameBuffer.rbos[rboi];
                        CanvasToy.gl.bindRenderbuffer(CanvasToy.gl.RENDERBUFFER, renderBuffer.glRenderBuffer);
                        CanvasToy.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
                        CanvasToy.gl.clear(CanvasToy.gl.DEPTH_BUFFER_BIT | CanvasToy.gl.COLOR_BUFFER_BIT);
                        for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                            var object = _a[_i];
                            _this.renderObject(camera, object);
                        }
                        CanvasToy.gl.bindRenderbuffer(CanvasToy.gl.RENDERBUFFER, null);
                    }
                    CanvasToy.gl.bindFramebuffer(CanvasToy.gl.FRAMEBUFFER, null);
                });
                if (CanvasToy.gl.checkFramebufferStatus(CanvasToy.gl.FRAMEBUFFER) !== CanvasToy.gl.FRAMEBUFFER_COMPLETE) {
                    console.log("frame buffer not completed");
                }
                CanvasToy.gl.bindFramebuffer(CanvasToy.gl.FRAMEBUFFER, null);
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
                    CanvasToy.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
                    CanvasToy.gl.clear(CanvasToy.gl.DEPTH_BUFFER_BIT | CanvasToy.gl.COLOR_BUFFER_BIT);
                    for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                        var object = _a[_i];
                        this.renderObject(camera, object);
                    }
                    break;
                case RenderMode.Dynamic:
                    this.renderQueue.push(function () {
                        CanvasToy.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
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
            if (this.scenes.indexOf(scene) !== -1 || this.preloadRes.length > 0) {
                return;
            }
            this.cameras.push(camera);
            this.scenes.push(scene);
            camera.adaptTargetRadio(this.canvas);
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
            CanvasToy.gl.bindBuffer(CanvasToy.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
            CanvasToy.gl.bufferData(CanvasToy.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.geometry.faces.data), CanvasToy.gl.STATIC_DRAW);
            this.copyDataToVertexBuffer(mesh.geometry);
            if (mesh.materials.length > 1) {
                CanvasToy.gl.enable(CanvasToy.gl.BLEND);
                CanvasToy.gl.blendFunc(CanvasToy.gl.SRC_COLOR, CanvasToy.gl.ONE_MINUS_SRC_COLOR);
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
                material.program.make(material, mesh, scene, camera);
                CanvasToy.gl.useProgram(material.program.webGlProgram);
                for (var textureName in material.program.textures) {
                    if (material.program.textures[textureName] !== undefined) {
                        this.loadTexture(material.program, textureName, material.program.textures[textureName]);
                    }
                }
                if (scene.openLight) {
                    this.setUplights(scene, material, mesh, camera);
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
            texture.unit = this.usedTextureNum;
            this.usedTextureNum++;
            program.textures.push(texture);
            CanvasToy.gl.useProgram(program.webGlProgram);
            CanvasToy.gl.pixelStorei(CanvasToy.gl.UNPACK_FLIP_Y_WEBGL, 1);
            CanvasToy.gl.activeTexture(CanvasToy.gl.TEXTURE0 + texture.unit);
            CanvasToy.gl.bindTexture(texture.type, texture.glTexture);
            CanvasToy.gl.texParameteri(texture.type, CanvasToy.gl.TEXTURE_WRAP_S, texture.wrapS);
            CanvasToy.gl.texParameteri(texture.type, CanvasToy.gl.TEXTURE_WRAP_T, texture.wrapT);
            CanvasToy.gl.texParameteri(texture.type, CanvasToy.gl.TEXTURE_MAG_FILTER, texture.magFilter);
            CanvasToy.gl.texParameteri(texture.type, CanvasToy.gl.TEXTURE_MIN_FILTER, texture.minFilter);
            texture.setUpTextureData();
            program.addUniform(sampler, { type: CanvasToy.DataType.int, updator: function () { return texture.unit; } });
        };
        Renderer.prototype.setUplights = function (scene, material, mesh, camera) {
            var _loop_2 = function (index) {
                var light = scene.lights[index];
                var diffuse = "lights[" + index + "].diffuse";
                var specular = "lights[" + index + "].specular";
                var idensity = "lights[" + index + "].idensity";
                var position = "lights[" + index + "].position";
                material.program.addUniform(diffuse, {
                    type: CanvasToy.DataType.vec3,
                    updator: function () { return light.diffuse; },
                });
                material.program.addUniform(specular, {
                    type: CanvasToy.DataType.vec3,
                    updator: function () { return light.specular; },
                });
                material.program.addUniform(position, {
                    type: CanvasToy.DataType.vec4,
                    updator: function () { return light.position; },
                });
                material.program.addUniform(idensity, {
                    type: CanvasToy.DataType.float,
                    updator: function () { return light.idensity; },
                });
                light.shadowRtt = new CanvasToy.Texture();
            };
            for (var index in scene.lights) {
                _loop_2(index);
            }
        };
        Renderer.prototype.copyDataToVertexBuffer = function (geometry) {
            for (var name_2 in geometry.attributes) {
                var attribute = geometry.attributes[name_2];
                if (attribute !== undefined) {
                    CanvasToy.gl.bindBuffer(CanvasToy.gl.ARRAY_BUFFER, attribute.buffer);
                    CanvasToy.gl.bufferData(CanvasToy.gl.ARRAY_BUFFER, new Float32Array(attribute.data), CanvasToy.gl.STATIC_DRAW);
                    console.log(name_2 + "buffer size:" + CanvasToy.gl.getBufferParameter(CanvasToy.gl.ARRAY_BUFFER, CanvasToy.gl.BUFFER_SIZE));
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
                        CanvasToy.gl.enable(CanvasToy.gl.DEPTH_TEST);
                    }
                    else {
                        CanvasToy.gl.disable(CanvasToy.gl.DEPTH_TEST);
                    }
                    CanvasToy.gl.useProgram(program.webGlProgram);
                    for (var uniformName in program.uniforms) {
                        if (program.uniforms[uniformName] !== undefined) {
                            program.uniforms[uniformName](object, camera);
                        }
                    }
                    for (var attributeName in program.attributes) {
                        CanvasToy.gl.bindBuffer(CanvasToy.gl.ARRAY_BUFFER, program.attributes[attributeName].buffer);
                        CanvasToy.gl.vertexAttribPointer(program.attributeLocations[attributeName], program.attributes[attributeName].size, program.attributes[attributeName].type, false, 0, 0);
                    }
                    CanvasToy.gl.bindBuffer(CanvasToy.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
                    CanvasToy.gl.drawElements(CanvasToy.gl.TRIANGLES, mesh.geometry.faces.data.length, CanvasToy.gl.UNSIGNED_SHORT, 0);
                }
            }
        };
        Renderer.prototype.initMatrix = function () {
        };
        return Renderer;
    }());
    CanvasToy.Renderer = Renderer;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Scene = (function () {
        function Scene() {
            var _this = this;
            this.objects = [];
            this.lights = [];
            this.ambientLight = vec3.fromValues(0, 0, 0);
            this.openLight = false;
            this.enableShadowMap = false;
            this.clearColor = [0, 0, 0, 0];
            this.programSetUp = false;
            window.setInterval(function () { return _this.update(1000 / 60); }, 1000 / 60);
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
        };
        Scene.prototype.removeObject = function (object) {
            var _this = this;
            object.children.forEach(function (child) {
                _this.removeObject(child);
            });
            this.objects.splice(this.objects.indexOf(object));
        };
        Scene.prototype.addLight = function (light) {
            this.openLight = true;
            this.lights.push(light);
            light.scene = this;
        };
        return Scene;
    }());
    CanvasToy.Scene = Scene;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var CubeTexture = (function (_super) {
        __extends(CubeTexture, _super);
        function CubeTexture(xneg, xpos, yneg, ypos, zneg, zpos, wrapS, wrapT, magFilter, minFilter) {
            var _this = _super.call(this, null, CanvasToy.gl.TEXTURE_CUBE_MAP, wrapS, wrapT, magFilter, minFilter) || this;
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
        CubeTexture.prototype.setUpTextureData = function () {
            if (_super.prototype.setUpTextureData.call(this)) {
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.xneg);
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.xpos);
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.yneg);
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.ypos);
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.zneg);
                CanvasToy.gl.texImage2D(CanvasToy.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.zpos);
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
        function Texture2D(image, format, wrapS, wrapT, magFilter, minFilter) {
            if (format === void 0) { format = CanvasToy.gl.RGB; }
            if (wrapS === void 0) { wrapS = CanvasToy.gl.CLAMP_TO_EDGE; }
            if (wrapT === void 0) { wrapT = CanvasToy.gl.CLAMP_TO_EDGE; }
            if (magFilter === void 0) { magFilter = CanvasToy.gl.NEAREST; }
            if (minFilter === void 0) { minFilter = CanvasToy.gl.NEAREST; }
            return _super.call(this, image, CanvasToy.gl.TEXTURE_2D, format, wrapS, wrapT, magFilter, minFilter) || this;
        }
        Texture2D.prototype.setUpTextureData = function () {
            if (_super.prototype.setUpTextureData.call(this)) {
                CanvasToy.gl.texImage2D(this.type, 0, this.format, this.format, CanvasToy.gl.UNSIGNED_BYTE, this.image);
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
        try {
            CanvasToy.gl = canvas.getContext("experimental-webgl");
        }
        catch (e) {
            CanvasToy.gl = canvas.getContext("webgl");
        }
        if (!CanvasToy.gl) {
            alert("Cannot init webgl, current browser may not support it.");
        }
        return CanvasToy.gl;
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
            alert("error: " + typeInfo + "\n" + gl.getShaderInfoLog(shader));
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
            alert("error: link shader program failed.\n" + gl.getProgramInfoLog(shaderProgram));
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