var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("DataTypeEnum", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
    })(DataType = exports.DataType || (exports.DataType = {}));
});
define("IAsyncResource", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("cameras/OrthoCamera", ["require", "exports", "gl-matrix", "cameras/Camera"], function (require, exports, gl_matrix_1, Camera_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var OrthoCamera = (function (_super) {
        __extends(OrthoCamera, _super);
        function OrthoCamera(parameters) {
            if (parameters === void 0) {
                parameters = {};
            }
            var _this = _super.call(this) || this;
            _this._left = -20;
            _this._right = 20;
            _this._bottom = -20;
            _this._top = 20;
            _this._baseSize = 20;
            _this._left = parameters.left || _this._left;
            _this._right = parameters.right || _this._right;
            _this._bottom = parameters.bottom || _this._bottom;
            _this._top = parameters.top || _this._top;
            _this._near = parameters.near || _this._near;
            _this._far = parameters.far || _this._far;
            gl_matrix_1.mat4.ortho(_this._projectionMatrix, _this._left, _this._right, _this._bottom, _this._top, _this._near, _this._far);
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
            gl_matrix_1.mat4.ortho(this._projectionMatrix, this._left, this._right, this._bottom, this._top, this._near, this._far);
        };
        OrthoCamera.prototype.deCompuseProjectionMatrix = function () {
        };
        OrthoCamera.prototype.setAspectRadio = function (radio) {
            this._left = -this._baseSize;
            this._right = this._baseSize;
            this._top = radio * this._baseSize;
            this._bottom = -radio * this._baseSize;
            this.compuseProjectionMatrix();
            return this;
        };
        return OrthoCamera;
    }(Camera_1.Camera));
    exports.OrthoCamera = OrthoCamera;
});
define("Dirtyable", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("textures/Texture", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Texture = (function () {
        function Texture(gl, url) {
            var _this = this;
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
        Texture.prototype.apply = function (gl) {
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
    exports.Texture = Texture;
});
define("renderer/GraphicsUtils", ["require", "exports", "Decorators"], function (require, exports, Decorators_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Graphics;
    (function (Graphics) {
        var ShaderType;
        (function (ShaderType) {
            ShaderType[ShaderType["VertexShader"] = 0] = "VertexShader";
            ShaderType[ShaderType["FragmentShader"] = 1] = "FragmentShader";
        })(ShaderType || (ShaderType = {}));
        function getRenderParamHost(obj, logError) {
            if (logError === void 0) {
                logError = false;
            }
            var holder = obj[Decorators_1.RENDER_PARAM_HOLDER];
            if (holder === undefined) {
                if (logError) {
                    console.log(obj);
                    throw new Error(obj + " has no renderParam property");
                }
                else {
                    return undefined;
                }
            }
            holder.hostObject = obj;
            return holder;
        }
        Graphics.getRenderParamHost = getRenderParamHost;
        function copyDataToVertexBuffer(gl, geometry) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.faces.buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.faces.data), gl.STATIC_DRAW);
            for (var name_1 in geometry.attributes) {
                var attribute = geometry.attributes[name_1];
                if (attribute !== undefined) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attribute.data), gl.STATIC_DRAW);
                }
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
        Graphics.initWebwebglContext = initWebwebglContext;
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
        function createEntileShader(gl, vertexShaderSource, fragmentShaderSource) {
            var vertShader = createSeparatedShader(gl, vertexShaderSource, ShaderType.VertexShader);
            var fragShader = createSeparatedShader(gl, fragmentShaderSource, ShaderType.FragmentShader);
            return linkShader(gl, vertShader, fragShader, vertexShaderSource, fragmentShaderSource);
        }
        Graphics.createEntileShader = createEntileShader;
    })(Graphics = exports.Graphics || (exports.Graphics = {}));
});
define("geometries/Geometry", ["require", "exports", "DataTypeEnum", "renderer/GraphicsUtils", "shader/Program"], function (require, exports, DataTypeEnum_1, GraphicsUtils_1, Program_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Faces = (function () {
        function Faces(gl, data) {
            this.data = [];
            this.data = data;
            this.buffer = gl.createBuffer();
        }
        return Faces;
    }());
    exports.Faces = Faces;
    var Geometry = (function () {
        function Geometry(gl) {
            this._dirty = true;
            this.gl = gl;
            this.attributes = {
                position: new Program_1.Attribute(gl, { type: DataTypeEnum_1.DataType.float, size: 3, data: [] }),
                aMainUV: new Program_1.Attribute(gl, { type: DataTypeEnum_1.DataType.float, size: 2, data: [] }),
                aNormal: new Program_1.Attribute(gl, { type: DataTypeEnum_1.DataType.float, size: 3, data: [] }),
                flatNormal: new Program_1.Attribute(gl, { type: DataTypeEnum_1.DataType.float, size: 3, data: [] }),
            };
            this.faces = { data: [], buffer: gl.createBuffer() };
        }
        Geometry.prototype.build = function () {
            return this;
        };
        Geometry.prototype.assertValid = function () {
            var maxIndex = 0;
            for (var _i = 0, _a = this.faces.data; _i < _a.length; _i++) {
                var index = _a[_i];
                maxIndex = Math.max(maxIndex, index);
            }
            for (var attributeName in this.attributes) {
                console.assert(this.attributes[attributeName].size <= 4
                    && this.attributes[attributeName].size >= 1, attributeName + "size error, now: " + this.attributes[attributeName].size + " should be 1-4");
                console.assert((maxIndex + 1) * this.attributes[attributeName].stride <=
                    this.attributes[attributeName].data.length, attributeName + " length error, now:" + this.attributes[attributeName].data.length
                    + ", should bigger than:" + (maxIndex + 1) * this.attributes[attributeName].stride);
            }
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
        Geometry.prototype.clean = function (gl) {
            if (this._dirty) {
                GraphicsUtils_1.Graphics.copyDataToVertexBuffer(gl, this);
            }
            this._dirty = false;
        };
        return Geometry;
    }());
    exports.Geometry = Geometry;
});
define("geometries/SphereGeometry", ["require", "exports", "gl-matrix", "geometries/Geometry"], function (require, exports, gl_matrix_2, Geometry_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
                    var aMainUV = [ix / this._widthSegments, 1 - iy / this._heightSegments];
                    var position = [
                        -this._radius * Math.cos(this._phiStart + aMainUV[0] * this._phiLength)
                            * Math.sin(this._thetaStart + v * this._thetaLength),
                        this._radius * Math.cos(this._thetaStart + aMainUV[1] * this._thetaLength),
                        this._radius * Math.sin(this._phiStart + aMainUV[0] * this._phiLength)
                            * Math.sin(this._thetaStart + v * this._thetaLength),
                    ];
                    var aNormal = gl_matrix_2.vec3.normalize(gl_matrix_2.vec3.create(), position);
                    this.addVertex({ position: position, aNormal: aNormal, aMainUV: aMainUV });
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
    }(Geometry_1.Geometry));
    exports.SphereGeometry = SphereGeometry;
});
define("Intersections/BoundingBox", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("materials/Material", ["require", "exports", "gl-matrix"], function (require, exports, gl_matrix_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.colors = {
        black: gl_matrix_3.vec4.fromValues(0, 0, 0, 1),
        gray: gl_matrix_3.vec4.fromValues(0.5, 0.5, 0.5, 1),
        red: gl_matrix_3.vec4.fromValues(1, 0, 0, 1),
        white: gl_matrix_3.vec4.fromValues(1, 1, 1, 1),
    };
    var Material = (function () {
        function Material(gl) {
            this.defines = [];
            this.shader = this.initShader(gl);
        }
        return Material;
    }());
    exports.Material = Material;
});
define("Mesh", ["require", "exports", "DataTypeEnum", "gl-matrix", "Decorators", "Object3d"], function (require, exports, DataTypeEnum_2, gl_matrix_4, Decorators_2, Object3d_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, materials) {
            var _this = _super.call(this) || this;
            _this.materials = [];
            _this.materials = materials;
            _this.geometry = geometry;
            return _this;
        }
        Object.defineProperty(Mesh.prototype, "matrix", {
            get: function () {
                return this._matrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh.prototype, "normalMatrix", {
            get: function () {
                return gl_matrix_4.mat4.transpose(gl_matrix_4.mat4.create(), gl_matrix_4.mat4.invert(gl_matrix_4.mat4.create(), this._matrix));
            },
            enumerable: true,
            configurable: true
        });
        Mesh.prototype.drawMode = function (gl) {
            return gl.STATIC_DRAW;
        };
        __decorate([
            Decorators_2.uniform(DataTypeEnum_2.DataType.mat4, "modelMatrix")
        ], Mesh.prototype, "matrix", null);
        __decorate([
            Decorators_2.uniform(DataTypeEnum_2.DataType.mat4)
        ], Mesh.prototype, "normalMatrix", null);
        return Mesh;
    }(Object3d_1.Object3d));
    exports.Mesh = Mesh;
});
define("geometries/RectGeometry", ["require", "exports", "geometries/Geometry"], function (require, exports, Geometry_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
            _this.attributes.aMainUV.data = [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                1.0, 1.0,
            ];
            _this.attributes.aNormal.data = [
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
    }(Geometry_2.Geometry));
    exports.RectGeometry = RectGeometry;
});
define("renderer/FrameBuffer", ["require", "exports", "textures/Texture", "renderer/GraphicsUtils"], function (require, exports, Texture_1, GraphicsUtils_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var AttachmentType;
    (function (AttachmentType) {
        AttachmentType[AttachmentType["Texture"] = 0] = "Texture";
        AttachmentType[AttachmentType["RenderBuffer"] = 1] = "RenderBuffer";
    })(AttachmentType = exports.AttachmentType || (exports.AttachmentType = {}));
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
                this.targetTexture = new Texture_1.Texture(gl);
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
    exports.Attachment = Attachment;
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
            this._attached = GraphicsUtils_2.Graphics.logIfFrameBufferInvalid(gl, this.glFramebuffer);
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
                    gl.renderbufferStorage(gl.RENDERBUFFER, attachment.innerFormatForBuffer, this.width, this.height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment.attachmentCode(gl), gl.RENDERBUFFER, attachment.glRenderBuffer);
                    break;
                default: break;
            }
        };
        return FrameBuffer;
    }());
    exports.FrameBuffer = FrameBuffer;
});
define("renderer/IExtension", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("lights/ShadowType", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShadowType;
    (function (ShadowType) {
        ShadowType[ShadowType["None"] = 0] = "None";
        ShadowType[ShadowType["Hard"] = 1] = "Hard";
        ShadowType[ShadowType["Soft"] = 2] = "Soft";
    })(ShadowType = exports.ShadowType || (exports.ShadowType = {}));
});
define("lights/Light", ["require", "exports", "gl-matrix", "DataTypeEnum", "Decorators", "Object3d", "renderer/FrameBuffer", "lights/ShadowType"], function (require, exports, gl_matrix_5, DataTypeEnum_3, Decorators_3, Object3d_2, FrameBuffer_1, ShadowType_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light(renderer) {
            var _this = _super.call(this) || this;
            _this._color = gl_matrix_5.vec3.fromValues(1, 1, 1);
            _this._idensity = 1;
            _this._shadowType = ShadowType_1.ShadowType.Soft;
            _this._shadowSize = 1024;
            _this.gl = renderer.gl;
            _this.ext = renderer.ext;
            _this.configShadowFrameBuffer();
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
            return this;
        };
        Light.prototype.setShadowSize = function (shadowSize) {
            if (shadowSize !== this._shadowSize) {
                this._shadowSize = shadowSize;
            }
            if (this._shadowFrameBuffer !== null) {
                this._shadowFrameBuffer.setWidth(this._shadowSize);
                this._shadowFrameBuffer.setHeight(this._shadowSize);
            }
            if (this._blurFrameBuffer !== null) {
                this._blurFrameBuffer.setWidth(this._shadowSize);
                this._blurFrameBuffer.setHeight(this._shadowSize);
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
        Object.defineProperty(Light.prototype, "shadowSize", {
            get: function () {
                return this._shadowSize;
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
        Object.defineProperty(Light.prototype, "blurFrameBuffer", {
            get: function () {
                return this._blurFrameBuffer;
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
        Object.defineProperty(Light.prototype, "projectionMatrix", {
            get: function () {
                return this._projectCamera.projectionMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "viewMatrix", {
            get: function () {
                return this._worldToObjectMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "far", {
            get: function () {
                return this._projectCamera.far;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "near", {
            get: function () {
                return this._projectCamera.near;
            },
            enumerable: true,
            configurable: true
        });
        Light.prototype.drawWithLightCamera = function (renderParam) {
            renderParam.camera = this._projectCamera;
            renderParam.material.shader.pass(renderParam);
        };
        Light.prototype.configShadowFrameBuffer = function () {
            if (!this._shadowFrameBuffer) {
                this._shadowFrameBuffer = new FrameBuffer_1.FrameBuffer(this.gl).setWidth(this._shadowSize).setHeight(this._shadowSize);
                this._shadowMap = this._shadowFrameBuffer.attachments.color.targetTexture
                    .setType(this.gl.FLOAT)
                    .setFormat(this.gl.RGBA)
                    .setMinFilter(this.gl.NEAREST)
                    .setMagFilter(this.gl.NEAREST)
                    .setWrapS(this.gl.REPEAT)
                    .setWrapT(this.gl.REPEAT)
                    .apply(this.gl);
                this._shadowFrameBuffer.attach(this.gl);
            }
            if (!this._blurFrameBuffer) {
                this._blurFrameBuffer = new FrameBuffer_1.FrameBuffer(this.gl).setWidth(this._shadowSize).setHeight(this._shadowSize);
                this._blurFrameBuffer.attachments.color.targetTexture
                    .setType(this.gl.FLOAT)
                    .setFormat(this.gl.RGBA)
                    .setMagFilter(this.gl.NEAREST)
                    .setMinFilter(this.gl.NEAREST)
                    .setWrapS(this.gl.CLAMP_TO_EDGE)
                    .setWrapT(this.gl.CLAMP_TO_EDGE)
                    .apply(this.gl);
                this._blurFrameBuffer.attach(this.gl);
            }
            return this;
        };
        __decorate([
            Decorators_3.ifdefine("USE_SHADOW"),
            Decorators_3.uniform(DataTypeEnum_3.DataType.float, "shadowMapSize")
        ], Light.prototype, "shadowSize", null);
        __decorate([
            Decorators_3.ifdefine("USE_SHADOW"),
            Decorators_3.texture()
        ], Light.prototype, "shadowMap", null);
        __decorate([
            Decorators_3.uniform(DataTypeEnum_3.DataType.vec3)
        ], Light.prototype, "color", null);
        __decorate([
            Decorators_3.uniform(DataTypeEnum_3.DataType.float)
        ], Light.prototype, "idensity", null);
        __decorate([
            Decorators_3.ifdefine("USE_SHADOW"),
            Decorators_3.uniform(DataTypeEnum_3.DataType.mat4)
        ], Light.prototype, "projectionMatrix", null);
        __decorate([
            Decorators_3.ifdefine("USE_SHADOW"),
            Decorators_3.uniform(DataTypeEnum_3.DataType.mat4)
        ], Light.prototype, "viewMatrix", null);
        return Light;
    }(Object3d_2.Object3d));
    exports.Light = Light;
});
define("lights/PointLight", ["require", "exports", "gl-matrix", "DataTypeEnum", "Decorators", "geometries/SphereGeometry", "lights/Light", "lights/ShadowType"], function (require, exports, gl_matrix_6, DataTypeEnum_4, Decorators_4, SphereGeometry_1, Light_1, ShadowType_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var PointLight = (function (_super) {
        __extends(PointLight, _super);
        function PointLight(renderer) {
            var _this = _super.call(this, renderer) || this;
            _this._radius = 100;
            _this._squareAttenuation = 0.01;
            _this._linearAttenuation = 0.1;
            _this._constantAttenuation = 1;
            _this._pcssArea = 0.1;
            _this.volume = new SphereGeometry_1.SphereGeometry(renderer.gl).setRadius(_this._radius).build();
            _this._shadowType = ShadowType_2.ShadowType.None;
            return _this;
        }
        Object.defineProperty(PointLight.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointLight.prototype, "squareAttenuation", {
            get: function () {
                return this._squareAttenuation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointLight.prototype, "linearAttenuation", {
            get: function () {
                return this._squareAttenuation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointLight.prototype, "constantAttenuation", {
            get: function () {
                return this._constantAttenuation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointLight.prototype, "pcssArea", {
            get: function () {
                return this._pcssArea;
            },
            enumerable: true,
            configurable: true
        });
        PointLight.prototype.getProjecttionBoundingBox2D = function (camera) {
            var viewMatrix = gl_matrix_6.mat4.multiply(gl_matrix_6.mat4.create(), camera.projectionMatrix, camera.worldToObjectMatrix);
            var viewDir = gl_matrix_6.vec3.sub(gl_matrix_6.vec3.create(), this.position, camera.position);
            var upSide = gl_matrix_6.vec3.normalize(gl_matrix_6.vec3.create(), camera.upVector);
            var rightSide = gl_matrix_6.vec3.create();
            gl_matrix_6.vec3.cross(rightSide, upSide, viewDir);
            gl_matrix_6.vec3.normalize(rightSide, rightSide);
            gl_matrix_6.vec3.scale(upSide, upSide, this.radius);
            gl_matrix_6.vec3.scale(rightSide, rightSide, this.radius);
            var lightUpPoint = gl_matrix_6.vec3.add(gl_matrix_6.vec3.create(), this.position, upSide);
            var lightRightPoint = gl_matrix_6.vec3.add(gl_matrix_6.vec3.create(), this.position, rightSide);
            var screenPos = gl_matrix_6.vec3.transformMat4(gl_matrix_6.vec3.create(), this._position, viewMatrix);
            lightUpPoint = gl_matrix_6.vec3.transformMat4(gl_matrix_6.vec3.create(), lightUpPoint, viewMatrix);
            lightRightPoint = gl_matrix_6.vec3.transformMat4(gl_matrix_6.vec3.create(), lightRightPoint, viewMatrix);
            var screenH = Math.abs(gl_matrix_6.vec3.len(gl_matrix_6.vec3.sub(gl_matrix_6.vec3.create(), lightUpPoint, screenPos)));
            var screenW = Math.abs(gl_matrix_6.vec3.len(gl_matrix_6.vec3.sub(gl_matrix_6.vec3.create(), lightRightPoint, screenPos)));
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
        __decorate([
            Decorators_4.uniform(DataTypeEnum_4.DataType.vec3)
        ], PointLight.prototype, "position", null);
        __decorate([
            Decorators_4.uniform(DataTypeEnum_4.DataType.float, "squareAtten")
        ], PointLight.prototype, "squareAttenuation", null);
        __decorate([
            Decorators_4.uniform(DataTypeEnum_4.DataType.float, "linearAtten")
        ], PointLight.prototype, "linearAttenuation", null);
        __decorate([
            Decorators_4.uniform(DataTypeEnum_4.DataType.float, "constantAtten")
        ], PointLight.prototype, "constantAttenuation", null);
        __decorate([
            Decorators_4.uniform(DataTypeEnum_4.DataType.float)
        ], PointLight.prototype, "pcssArea", null);
        return PointLight;
    }(Light_1.Light));
    exports.PointLight = PointLight;
});
define("shader/shaders", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShaderSource;
    (function (ShaderSource) {
        ShaderSource.calculators__blinn_phong_glsl = "vec3 calculateLight(\n    vec3 position,\n    vec3 normal,\n    vec3 lightDir,\n    vec3 eyePos,\n    vec3 specular,\n    vec3 diffuse,\n    float shiness,\n    float idensity\n    ) {\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize(eyePos - position);\n\n    // replace R * V with N * H\n    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);\n    float specularAngle = max(dot(H, normal), 0.0);\n\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    vec3 color = (diffuseColor + specularColor) * idensity;\n    return color;\n}\n";
        ShaderSource.calculators__blur__gaussian_glsl = "vec4 gaussian_blur(sampler2D origin, vec2 uv, float blurStep, vec2 blurDir) {\n    vec4 average = vec4(0.0, 0.0, 0.0, 0.0);\n    average += texture2D(origin, uv - 4.0 * blurStep * blurDir) * 0.0162162162;\n    average += texture2D(origin, uv - 3.0 * blurStep * blurDir) * 0.0540540541;\n    average += texture2D(origin, uv - 2.0 * blurStep * blurDir) * 0.1216216216;\n    average += texture2D(origin, uv - 1.0 * blurStep * blurDir) * 0.1945945946;\n    average += texture2D(origin, uv) * 0.2270270270;\n    average += texture2D(origin, uv + 1.0 * blurStep * blurDir) * 0.1945945946;\n    average += texture2D(origin, uv + 2.0 * blurStep * blurDir) * 0.1216216216;\n    average += texture2D(origin, uv + 3.0 * blurStep * blurDir) * 0.0540540541;\n    average += texture2D(origin, uv + 4.0 * blurStep * blurDir) * 0.0162162162;\n    return average;\n}\n";
        ShaderSource.calculators__blur__gaussian_log_glsl = "\n";
        ShaderSource.calculators__linearlize_depth_glsl = "float linearlizeDepth(float far, float near, float depth) {\n    float NDRDepth = depth * 2.0 - 1.0;;\n    return 2.0 * near / (near + far - NDRDepth * (far - near));\n}\n";
        ShaderSource.calculators__packFloat1x32_glsl = "vec4 packFloat1x32(float val)\n{\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\n    pack = fract(pack);\n    pack -= vec4(pack.yzw / 255.0, 0.0);\n    return pack;\n}\n";
        ShaderSource.calculators__phong_glsl = "vec3 calculateLight(\n    vec3 position,\n    vec3 normal,\n    vec3 lightDir,\n    vec3 eyePos,\n    vec3 specularLight,\n    vec3 diffuseLight,\n    float shiness,\n    float idensity\n    ) {\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize(eyePos - position);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specularLight * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
        ShaderSource.calculators__shadow_factor_glsl = "float getSpotDirectionShadow(vec2 clipPos, sampler2D shadowMap, float linearDepth, float lambertian, float texelSize)\n{\n    vec2 uv = clipPos * 0.5 + 0.5;\n    \n    vec2 f = fract(uv / texelSize - 0.5);\n    vec2 centroidUV = (floor(uv / texelSize - 0.5)) * texelSize;\n\n    float lb = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 0.0)).r;\n    float lt = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 1.0)).r;\n    float rb = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 0.0)).r;\n    float rt = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 1.0)).r;\n    float a = lb + log(mix(1.0, exp(lt - lb), f.y));\n    float b = rb + log(mix(1.0, exp(rt - rb), f.y));\n    float z = a + log(mix(1.0, exp(b - a), f.x));\n\n    float bias = clamp(0.1 * tan(acos(lambertian)), 0.0, 1.0);\n\n    float s = exp((z + bias - linearDepth));\n\n    return min(s, 1.0);\n}\n";
        ShaderSource.calculators__types_glsl = "vec3 calculateDirLight(\n    DirectLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    return calculateLight(\n        position,\n        normal,\n        -light.direction,\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        light.idensity\n    );\n}\n\nvec3 calculatePointLight(\n    PointLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    float lightDis = length(light.position - position);\n    float idensity = light.idensity / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);\n    idensity *= step(lightDis, light.radius);\n    return calculateLight(\n        position,\n        normal,\n        normalize(light.position - position),\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        idensity\n    );\n}\n\nvec3 calculateSpotLight(\n    SpotLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    vec3 lightDir = normalize(light.position - position);\n    float spotFactor = dot(-lightDir, light.spotDir);\n    if (spotFactor < light.coneAngleCos) {\n        return vec3(0.0);\n    }\n    float lightDis = length(light.position - position);\n    float idensity = light.idensity / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);\n    idensity *= (spotFactor - light.coneAngleCos) / (1.0 - light.coneAngleCos);\n    // idensity *= step(light.radius, lightDis);\n    return calculateLight(\n        position,\n        normal,\n        lightDir,\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        idensity\n    );\n}\n\n// float directAndSpotShadow(sampler2D shadowMap, vec4 shadowCoord) {\n//\n// }\n";
        ShaderSource.calculators__unpackFloat1x32_glsl = "float unpackFloat1x32( vec4 rgba ) {\n  return dot( rgba, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 160581375.0) );\n}\n";
        ShaderSource.debug__checkBox_glsl = "float checkerBoard(in vec2 uv, in float subSize) {\n    vec2 bigBox = mod(uv, vec2(subSize * 2.0));\n    return (\n        step(subSize, bigBox.x) * step(subSize, bigBox.y)\n        + step(subSize, subSize * 2.0 -bigBox.x) * step(subSize, subSize * 2.0 -bigBox.y)\n    );\n}\n";
        ShaderSource.definitions__light_glsl = "struct DirectLight\n{\n    vec3 color;\n    float idensity;\n    vec3 direction;\n#ifdef USE_SHADOW\n    sampler2D shadowMap;\n    float shadowMapSize;\n    mat4 projectionMatrix;\n    mat4 viewMatrix;\n#endif\n};\n\nstruct PointLight {\n    vec3 color;\n    float idensity;\n    float radius;\n    vec3 position;\n    float squareAtten;\n    float linearAtten;\n    float constantAtten;\n#ifdef USE_SHADOW\n    sampler2D shadowMap;\n    float shadowMapSize;\n    mat4 projectionMatrix;\n    mat4 viewMatrix;\n    float pcssArea;\n#endif\n};\n\nstruct SpotLight {\n    vec3 color;\n    float idensity;\n    float radius;\n    vec3 position;\n    float squareAtten;\n    float linearAtten;\n    float constantAtten;\n    float coneAngleCos;\n    vec3 spotDir;\n#ifdef USE_SHADOW\n    sampler2D shadowMap;\n    float shadowMapSize;\n    mat4 projectionMatrix;\n    mat4 viewMatrix;\n    float pcssArea;\n#endif\n};\n";
        ShaderSource.interploters__deferred__geometry_frag = "uniform vec3 ambient;\nuniform vec3 materialDiff;\nuniform vec3 materialSpec;\nuniform float materialSpecExp;\n\n\n#ifdef OPEN_LIGHT\nuniform vec3 eyePos;\nvarying vec3 vNormal;\n#endif\n\n#ifdef _MAIN_TEXTURE\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef _NORMAL_TEXTURE\nuniform sampler2D uNormalTexture;\nvarying vec2 vNormalUV;\n#endif\n\nvec2 encodeNormal(vec3 n) {\n    return normalize(n.xy) * (sqrt(n.z*0.5+0.5));\n}\n\nvoid main () {\n\n#ifdef OPEN_LIGHT\n    vec3 normal = normalize(vNormal);\n    float specular = (materialSpec.x + materialSpec.y + materialSpec.z) / 3.0;\n#ifdef _NORMAL_TEXTURE\n    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, materialSpecExp);\n#else\n    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, materialSpecExp);\n#endif\n#ifdef _MAIN_TEXTURE\n    gl_FragData[1] = vec4(materialDiff * texture2D(uMainTexture, vMainUV).xyz, specular);\n#else\n    gl_FragData[1] = vec4(materialDiff, specular);\n#endif\n#endif\n}\n";
        ShaderSource.interploters__deferred__geometry_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef _MAIN_TEXTURE\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalViewMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalViewMatrix * vec4(aNormal, 1.0)).xyz;\n#endif\n\n#ifdef _MAIN_TEXTURE\n    vMainUV = aMainUV;\n#endif\n}\n";
        ShaderSource.interploters__deferred__tiledLight_frag = "#define MAX_TILE_LIGHT_NUM 32\n\nprecision highp float;\n\nuniform float uHorizontalTileNum;\nuniform float uVerticalTileNum;\nuniform float uLightListLengthSqrt;\n\nuniform mat4 inverseProjection;\n\nuniform sampler2D uLightIndex;\nuniform sampler2D uLightOffsetCount;\nuniform sampler2D uLightPositionRadius;\nuniform sampler2D uLightColorIdensity;\n\nuniform sampler2D uNormalDepthSE;\nuniform sampler2D uDiffSpec;\n\nuniform float cameraNear;\nuniform float cameraFar;\n\n\nvarying vec3 vPosition;\n\nvec3 decodeNormal(vec2 n)\n{\n   vec3 normal;\n   normal.z = dot(n, n) * 2.0 - 1.0;\n   normal.xy = normalize(n) * sqrt(1.0 - normal.z * normal.z);\n   return normal;\n}\n\nvec3 decodePosition(float depth) {\n    vec4 clipSpace = vec4(vPosition.xy, depth * 2.0 - 1.0, 1.0);\n    vec4 homogenous = inverseProjection * clipSpace;\n    return homogenous.xyz / homogenous.w;\n}\n\nvoid main() {\n    vec2 uv = vPosition.xy * 0.5 + vec2(0.5);\n    vec2 gridIndex = uv ;// floor(uv * vec2(uHorizontalTileNum, uVerticalTileNum)) / vec2(uHorizontalTileNum, uVerticalTileNum);\n    vec4 lightIndexInfo = texture2D(uLightOffsetCount, gridIndex);\n    float lightStartIndex = lightIndexInfo.r;\n    float lightNum = lightIndexInfo.w;\n    vec4 tex1 = texture2D(uNormalDepthSE, uv);\n    vec4 tex2 = texture2D(uDiffSpec, uv);\n\n    vec3 materialDiff = tex2.xyz;\n    vec3 materialSpec = vec3(tex2.w);\n    float materialSpecExp = tex1.w;\n\n    vec3 normal = decodeNormal(tex1.xy);\n    vec3 viewPosition = decodePosition(tex1.z);\n    vec3 totalColor = vec3(0.0);\n    int realCount = 0;\n    for(int i = 0; i < MAX_TILE_LIGHT_NUM; i++) {\n        if (float(i) > lightNum - 0.5) {\n            break;\n        }\n        // float listX = (float(lightStartIndex + i) - listX_int * uLightListLengthSqrt) / uLightListLengthSqrt;\n        // float listY = ((lightStartIndex + i) / uLightListLengthSqrt) / uLightListLengthSqrt;\n        // float listX = (mod(lightStartIndex + i, uLightListLengthSqrt)) / uLightListLengthSqrt;\n        // listX = 1.0;\n        // listY = 0.0;\n        float fixlightId = texture2D(uLightIndex, vec2((lightStartIndex + float(i)) / uLightListLengthSqrt, 0.5)).x;\n        vec4 lightPosR = texture2D(uLightPositionRadius, vec2(fixlightId, 0.5));\n        vec3 lightPos = lightPosR.xyz;\n        float lightR = lightPosR.w;\n        vec4 lightColorIden = texture2D(uLightColorIdensity, vec2(fixlightId, 0.5));\n        vec3 lightColor = lightColorIden.xyz;\n        float lightIdensity = lightColorIden.w;\n\n        float dist = distance(lightPos, viewPosition);\n        if (dist < lightR) {\n            realCount++;\n            vec3 fixLightColor = lightColor * min(1.0,  1.0 / (dist * dist ) / (lightR * lightR));\n            totalColor += calculateLight(\n                viewPosition,\n                normal,\n                normalize(lightPos - viewPosition),\n                vec3(0.0),\n                materialSpec * lightColor,\n                materialDiff * lightColor,\n                materialSpecExp,\n                lightIdensity\n            );\n            // totalColor += vec3(listX, listY, 0.0);\n        }\n            // vec3 lightDir = normalize(lightPos - viewPosition);\n            // vec3 reflectDir = normalize(reflect(lightDir, normal));\n            // vec3 viewDir = normalize( - viewPosition);\n            // vec3 H = normalize(lightDir + viewDir);\n            // float specularAngle = max(dot(H, normal), 0.0);\n            // // vec3 specularColor = materialSpec * pow(specularAngle, materialSpecExp);\n        // totalColor = vec3(float(lightStartIndex) / uLightListLengthSqrt / uLightListLengthSqrt);\n        //}\n        //}\n    }\n    // vec3 depth = vec3(linearlizeDepth(cameraFar, cameraNear, tex1.z));\n    // vec3 depth = vec3(tex1.z);\n    vec3 test = vec3(float(realCount) / 32.0);\n    gl_FragColor = vec4(totalColor, 1.0);\n}\n";
        ShaderSource.interploters__deferred__tiledLight_vert = "attribute vec3 position;\nvarying vec3 vPosition;\n\nvoid main()\n{\n    gl_Position = vec4(position, 1.0);\n    vPosition = position;\n}\n";
        ShaderSource.interploters__forward__esm__blur_frag = "uniform sampler2D uOrigin;\nuniform vec2 uBlurDir;\nuniform float uBlurStep;\n\nuniform float lightArea;\n\n#define MAX_BLOCK_SAMPLE 8.0\n#define MAX_PCF_SAMPLE 8.0\n\nuniform float blockSamples;\nuniform float PCFSamples;\n\nvarying vec4 vProjPos;\nvarying vec3 vNormal;\n\nvoid main () {\n    vec2 uv = vProjPos.xy * 0.5 + 0.5;\n    float base = texture2D(uOrigin, uv).r;\n    float block = 0.0;\n    gl_FragColor.r = base;\n\n    for (float i = 0.0; i < MAX_BLOCK_SAMPLE; ++i) {\n        if(i >= blockSamples) {\n            break;\n        }\n        float d = texture2D(uOrigin, uv + (i - blockSamples / 2.0) * uBlurStep * uBlurDir).r;\n        block += step(base, d) * d / blockSamples;\n    }\n    \n    float kenelSize = lightArea * (base - block) / base;\n\n    float sum = 0.0;\n\n    for (float i = 0.0; i < MAX_PCF_SAMPLE; ++i) {\n        if(i >= PCFSamples) {\n            break;\n        }\n        float expd = exp(texture2D(uOrigin, uv + (i - PCFSamples / 2.0) * kenelSize * uBlurStep * uBlurDir).r - base);\n        sum += expd / PCFSamples;\n    }\n\n    float average = log(sum) + base;\n\n    gl_FragColor.r += average;\n}\n";
        ShaderSource.interploters__forward__esm__blur_vert = "uniform mat4 normalMatrix;\nattribute vec3 position;\nattribute vec3 normal;\nvarying vec4 vProjPos;\nvarying vec3 vNormal;\n\nvoid main () {\n    gl_Position = vProjPos = vec4(position, 1.0);\n    vNormal = normalize((normalMatrix * vec4(normal, 1.0)).xyz);\n}\n";
        ShaderSource.interploters__forward__esm__depth_frag = "varying vec3 viewPos;\n\nvoid main () {\n    gl_FragColor.r = -viewPos.z;\n}\n";
        ShaderSource.interploters__forward__esm__depth_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\nuniform mat4 modelViewMatrix;\nvarying vec3 viewPos;\n\nvoid main () {\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n    viewPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n}\n";
        ShaderSource.interploters__forward__gouraud_frag = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nvoid main() {\n    textureColor = colorOrMainTexture(vMainUV);\n#ifdef OPEN_LIGHT\n    totalLighting = ambient;\n    vec3 normal = normalize(vNormal);\n    gl_FragColor = vec4(totalLighting, 1.0);\n#else\n#ifdef USE_COLOR\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#endif\n#endif\n#ifdef _MAIN_TEXTURE\n    gl_FragColor = gl_FragColor * textureColor;\n#endif\n#ifdef USE_COLOR\n    gl_FragColor = gl_FragColor * color;\n#endif\n}\n";
        ShaderSource.interploters__forward__gouraud_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    totalLighting = ambient;\n    normal = normalize(normal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);\n    }\n    vLightColor = totalLighting;\n#endif\n#ifdef _MAIN_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n";
        ShaderSource.interploters__forward__phong_frag = "uniform vec3 ambient;\nuniform vec3 uMaterialSpec;\nuniform float uMaterialSpecExp;\nuniform vec3 uMaterialDiff;\n\nuniform vec3 cameraPos;\n\nvarying vec2 vMainUV;\nvarying vec4 clipPos;\n\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\n#ifdef _MAIN_TEXTURE\nuniform sampler2D uMainTexture;\n#endif\n\n#ifdef _ENVIRONMENT_MAP\nuniform float reflectivity;\nuniform samplerCube uCubeTexture;\n#endif\n\n#if (directLightsNum > 0)\nuniform DirectLight directLights[directLightsNum];\n#endif\n\n#if (pointLightsNum > 0)\nuniform PointLight pointLights[pointLightsNum];\n#endif\n\n#if (spotLightsNum > 0)\nuniform SpotLight spotLights[spotLightsNum];\n#endif\n\n#ifdef USE_SHADOW\n\n    #if (directLightsNum > 0)\n    varying vec4 directShadowCoord[directLightsNum];\n    varying float directLightDepth[directLightsNum];\n    #endif\n\n    #if (pointLightsNum > 0)\n    varying vec4 pointShadowCoord[pointLightsNum];\n    varying float pointLightDepth[pointLightsNum];\n    #endif\n\n    #if (spotLightsNum > 0)\n    varying vec4 spotShadowCoord[spotLightsNum];\n    varying float spotLightDepth[spotLightsNum];\n    #endif\n\n#endif\n\nvoid main () {\n\n#ifdef _MAIN_TEXTURE\n    gl_FragColor = texture2D(uMainTexture, vMainUV);\n#else\n    #ifdef _DEBUG\n    gl_FragColor = vec4(vec3(checkerBoard(vMainUV, 0.1)), 1.0);\n    #else\n    gl_FragColor = vec4(1.0);\n    #endif\n#endif\n    vec3 color = vec3(0.0);\n    vec3 normal = normalize(vNormal);\n    vec3 totalLighting = ambient;\n    #ifdef _ENVIRONMENT_MAP\n    vec3 viewDir = normalize(-vPosition);\n    vec3 skyUV = reflect(viewDir, vNormal);\n    totalLighting = mix(totalLighting, textureCube(uCubeTexture, skyUV).xyz, reflectivity);\n    #endif\n#if (directLightsNum > 0)\n    for (int index = 0; index < directLightsNum; index++) {\n        vec3 lighting = calculateDirLight(\n            directLights[index],\n            uMaterialDiff,\n            uMaterialSpec,\n            uMaterialSpecExp,\n            vPosition,\n            normal,\n            cameraPos\n        );\n    #ifdef USE_SHADOW\n        float lambertian = dot(-directLights[index].direction, normal);\n        float shadowFactor = getSpotDirectionShadow(\n            directShadowCoord[index].xy / directShadowCoord[index].w, \n            directLights[index].shadowMap, \n            directLightDepth[index], \n            lambertian, \n            1.0 / directLights[index].shadowMapSize\n        );\n        lighting *= shadowFactor;\n    #endif\n        totalLighting += lighting;\n    }\n#endif\n#if (pointLightsNum > 0)\n    for (int index = 0; index < pointLightsNum; index++) {\n        vec3 lighting = calculatePointLight(\n            pointLights[index],\n            uMaterialDiff,\n            uMaterialSpec,\n            uMaterialSpecExp,\n            vPosition,\n            normal,\n            cameraPos\n        );\n        totalLighting += lighting;\n    }\n#endif\n#if (spotLightsNum > 0)\n    for (int index = 0; index < spotLightsNum; index++) {\n        vec3 lighting = calculateSpotLight(\n            spotLights[index],\n            uMaterialDiff,\n            uMaterialSpec,\n            uMaterialSpecExp,\n            vPosition,\n            normal,\n            cameraPos\n        );\n    #ifdef USE_SHADOW\n        float lambertian = dot(-spotLights[index].spotDir, normal);\n        float shadowFactor = getSpotDirectionShadow(\n            spotShadowCoord[index].xy / spotShadowCoord[index].w, \n            spotLights[index].shadowMap,\n            spotLightDepth[index], \n            lambertian, 1.0 / spotLights[index].shadowMapSize\n        );\n        lighting *= shadowFactor;\n    #endif\n        totalLighting += lighting;\n\n    }\n#endif\n    color += totalLighting;\n    gl_FragColor *= vec4(color, 1.0);\n}\n";
        ShaderSource.interploters__forward__phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\nuniform mat4 modelMatrix;\n\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\nvarying vec4 clipPos;\n\n\n#if (directLightsNum > 0)\nuniform DirectLight directLights[directLightsNum];\n    #ifdef USE_SHADOW\n    varying vec4 directShadowCoord[directLightsNum];\n    varying float directLightDepth[directLightsNum];\n    #endif\n#endif\n\n#if (pointLightsNum > 0)\nuniform PointLight pointLights[pointLightsNum];\n    #ifdef USE_SHADOW\n    varying vec4 pointShadowCoord[pointLightsNum];\n    varying float pointLightDepth[pointLightsNum];\n    #endif\n#endif\n\n#if (spotLightsNum > 0)\nuniform SpotLight spotLights[spotLightsNum];\n    #ifdef USE_SHADOW\n    varying vec4 spotShadowCoord[spotLightsNum];\n    varying float spotLightDepth[spotLightsNum];\n    #endif\n#endif\n\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n    clipPos = gl_Position;\n    vec4 worldPos = (modelMatrix * vec4(position, 1.0));\n    vPosition = worldPos.xyz;\n    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;\n    vMainUV = aMainUV;\n\n    #ifdef USE_SHADOW\n        #if (directLightsNum > 0)\n        for (int i = 0; i < directLightsNum; ++i) {\n            directShadowCoord[i] = directLights[i].projectionMatrix * directLights[i].viewMatrix * worldPos;\n            directLightDepth[i] = -(directLights[i].viewMatrix * worldPos).z;\n        }\n        #endif\n\n        #if (pointLightsNum > 0)\n        for (int i = 0; i < pointLightsNum; ++i) {\n            pointShadowCoord[i] = pointLights[i].projectionMatrix * pointLights[i].viewMatrix * worldPos;\n            pointLightDepth[i] = -(pointLights[i].viewMatrix * worldPos).z;\n        }\n        #endif\n\n        #if (spotLightsNum > 0)\n        for (int i = 0; i < spotLightsNum; ++i) {\n            spotShadowCoord[i] = spotLights[i].projectionMatrix * spotLights[i].viewMatrix * worldPos;\n            spotLightDepth[i] = -(spotLights[i].viewMatrix * worldPos).z;\n        }\n        #endif\n    #endif\n}\n";
        ShaderSource.interploters__forward__skybox_frag = "varying vec3 cubeUV;\nuniform samplerCube uCubeTexture;\nvoid main()\n{\n    gl_FragColor = textureCube(uCubeTexture, cubeUV);\n}\n";
        ShaderSource.interploters__forward__skybox_vert = "attribute vec3 position;\nuniform mat4 viewProjectionMatrix;\nvarying vec3 cubeUV;\n\nvoid main (){\n    vec4 mvp = viewProjectionMatrix * vec4(position, 1.0);\n    cubeUV = position;\n    gl_Position = mvp.xyww;\n}\n";
    })(ShaderSource = exports.ShaderSource || (exports.ShaderSource = {}));
});
define("shader/ShaderBuilder", ["require", "exports", "shader/Program", "shader/shaders"], function (require, exports, Program_2, shaders_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShaderBuilder = (function () {
        function ShaderBuilder() {
            this.vertLibs = [
                shaders_1.ShaderSource.definitions__light_glsl,
            ];
            this.fragLibs = [
                shaders_1.ShaderSource.definitions__light_glsl,
                shaders_1.ShaderSource.calculators__linearlize_depth_glsl,
                shaders_1.ShaderSource.calculators__blinn_phong_glsl,
                shaders_1.ShaderSource.calculators__types_glsl,
                shaders_1.ShaderSource.calculators__unpackFloat1x32_glsl,
                shaders_1.ShaderSource.calculators__shadow_factor_glsl,
                shaders_1.ShaderSource.debug__checkBox_glsl,
            ];
            this.shadingVert = shaders_1.ShaderSource.interploters__forward__phong_vert;
            this.shadingFrag = shaders_1.ShaderSource.interploters__forward__phong_frag;
            this.extraRenderParamHolders = {};
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
        ShaderBuilder.prototype.setExtraRenderParamHolder = function (name, paramHolder) {
            this.extraRenderParamHolders[name] = paramHolder;
            return this;
        };
        ShaderBuilder.prototype.build = function (gl) {
            return new Program_2.Program(gl, {
                vertexShader: this.vertLibs.join("\n") + this.shadingVert,
                fragmentShader: this.fragLibs.join("\n") + this.shadingFrag,
            }, this.extraRenderParamHolders);
        };
        return ShaderBuilder;
    }());
    exports.ShaderBuilder = ShaderBuilder;
});
define("textures/CubeTexture", ["require", "exports", "textures/Texture"], function (require, exports, Texture_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var CubeTexture = (function (_super) {
        __extends(CubeTexture, _super);
        function CubeTexture(gl, xposUrl, xnegUrl, yposUrl, ynegUrl, zposUrl, znegUrl) {
            var _this = _super.call(this, gl) || this;
            _this.images = [];
            var image = _this._image;
            _this.setTarget(gl.TEXTURE_CUBE_MAP);
            _this.images = [0, 0, 0, 0, 0, 0].map(function () { return new Image(); });
            _this.images[0].src = xposUrl;
            _this.images[1].src = xnegUrl;
            _this.images[2].src = yposUrl;
            _this.images[3].src = ynegUrl;
            _this.images[4].src = zposUrl;
            _this.images[5].src = znegUrl;
            _this.setAsyncFinished(Promise.all(_this.images.map(function (image) {
                return _this.createLoadPromise(image);
            })).then(function () {
                return Promise.resolve(_this);
            }));
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
        CubeTexture.prototype.apply = function (gl) {
            _super.prototype.apply.call(this, gl);
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
    }(Texture_2.Texture));
    exports.CubeTexture = CubeTexture;
});
define("materials/StandardMaterial", ["require", "exports", "gl-matrix", "DataTypeEnum", "Decorators", "shader/Program", "shader/ShaderBuilder", "materials/Material"], function (require, exports, gl_matrix_7, DataTypeEnum_5, Decorators_5, Program_3, ShaderBuilder_1, Material_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var StandardMaterial = (function (_super) {
        __extends(StandardMaterial, _super);
        function StandardMaterial(gl, paramter) {
            if (paramter === void 0) {
                paramter = {};
            }
            var _this = _super.call(this, gl) || this;
            _this.debug = false;
            _this.castShadow = true;
            _this.ambient = gl_matrix_7.vec3.fromValues(0.1, 0.1, 0.1);
            _this.diffuse = gl_matrix_7.vec3.fromValues(0.8, 0.8, 0.8);
            _this.specular = gl_matrix_7.vec3.fromValues(0.3, 0.3, 0.3);
            _this.specularExponent = 64;
            _this.transparency = 0;
            _this.reflectivity = 1;
            if (!!paramter) {
                for (var name_2 in paramter) {
                    _this[name_2] = paramter[name_2];
                }
            }
            return _this;
        }
        StandardMaterial.prototype.initShader = function (gl) {
            return new ShaderBuilder_1.ShaderBuilder()
                .setExtraRenderParamHolder("mvp", {
                uniforms: {
                    modelViewProjectionMatrix: Program_3.shaderPassLib.uniforms.modelViewProjectionMatrix,
                },
            })
                .build(gl);
        };
        __decorate([
            Decorators_5.define("_DEBUG")
        ], StandardMaterial.prototype, "debug", void 0);
        __decorate([
            Decorators_5.define("USE_SHADOW", true)
        ], StandardMaterial.prototype, "castShadow", void 0);
        __decorate([
            Decorators_5.define("_MAIN_TEXTURE"),
            Decorators_5.texture("uMainTexture")
        ], StandardMaterial.prototype, "mainTexture", void 0);
        __decorate([
            Decorators_5.uniform(DataTypeEnum_5.DataType.vec3, "ambient")
        ], StandardMaterial.prototype, "ambient", void 0);
        __decorate([
            Decorators_5.uniform(DataTypeEnum_5.DataType.vec3, "uMaterialDiff")
        ], StandardMaterial.prototype, "diffuse", void 0);
        __decorate([
            Decorators_5.uniform(DataTypeEnum_5.DataType.vec3, "uMaterialSpec")
        ], StandardMaterial.prototype, "specular", void 0);
        __decorate([
            Decorators_5.uniform(DataTypeEnum_5.DataType.float, "uMaterialSpecExp")
        ], StandardMaterial.prototype, "specularExponent", void 0);
        __decorate([
            Decorators_5.readyRequire
        ], StandardMaterial.prototype, "bumpMap", void 0);
        __decorate([
            Decorators_5.readyRequire
        ], StandardMaterial.prototype, "displamentMap", void 0);
        __decorate([
            Decorators_5.readyRequire
        ], StandardMaterial.prototype, "stencilMap", void 0);
        __decorate([
            Decorators_5.uniform(DataTypeEnum_5.DataType.float, "reflectivity")
        ], StandardMaterial.prototype, "reflectivity", void 0);
        __decorate([
            Decorators_5.define("_ENVIRONMENT_MAP"),
            Decorators_5.texture("uCubeTexture")
        ], StandardMaterial.prototype, "reflectionMap", void 0);
        return StandardMaterial;
    }(Material_1.Material));
    exports.StandardMaterial = StandardMaterial;
});
define("textures/DataTexture", ["require", "exports", "textures/Texture"], function (require, exports, Texture_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataTexture = (function (_super) {
        __extends(DataTexture, _super);
        function DataTexture(gl, data, width, height) {
            if (width === void 0) {
                width = 16;
            }
            if (height === void 0) {
                height = 16;
            }
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
            this.apply(gl);
            return this;
        };
        DataTexture.prototype.apply = function (gl) {
            _super.prototype.apply.call(this, gl);
            gl.texImage2D(this.target, 0, this.format, this.width, this.height, 0, this.format, this.type, this.data);
            return this;
        };
        return DataTexture;
    }(Texture_3.Texture));
    exports.DataTexture = DataTexture;
});
define("renderer/IProcessor", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("renderer/deferred/DeferredProcessor", ["require", "exports", "gl-matrix", "DataTypeEnum", "geometries/RectGeometry", "materials/StandardMaterial", "Mesh", "shader/ShaderBuilder", "shader/shaders", "textures/DataTexture", "renderer/FrameBuffer", "renderer/GraphicsUtils"], function (require, exports, gl_matrix_8, DataTypeEnum_6, RectGeometry_1, StandardMaterial_1, Mesh_1, ShaderBuilder_2, shaders_2, DataTexture_1, FrameBuffer_2, GraphicsUtils_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var DeferredProcessor = (function () {
        function DeferredProcessor(gl, ext, scene, camera) {
            this.tilePixelSize = 32;
            this.tileLightIndex = [];
            this.linearLightIndex = [];
            this.gl = gl;
            this.ext = ext;
            this.gBuffer = new FrameBuffer_2.FrameBuffer(gl);
            this.horizontalTileNum = Math.floor(this.gl.canvas.width / this.tilePixelSize);
            this.verticalTileNum = Math.floor(this.gl.canvas.height / this.tilePixelSize);
            this.tileCount = this.horizontalTileNum * this.verticalTileNum;
            this.initGeometryProcess(scene);
            this.initTiledPass(scene);
            scene.programSetUp = true;
        }
        DeferredProcessor.prototype.process = function (scene, camera, materials) {
            GraphicsUtils_3.Graphics.logIfFrameBufferInvalid(this.gl, this.gBuffer.glFramebuffer);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.gBuffer.glFramebuffer);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.cullFace(this.gl.BACK);
            this.gl.disable(this.gl.BLEND);
            this.gl.depthFunc(this.gl.LESS);
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (object instanceof Mesh_1.Mesh) {
                    var mesh = object;
                    for (var _b = 0, _c = mesh.materials; _b < _c.length; _b++) {
                        var material = _c[_b];
                        if (material instanceof StandardMaterial_1.StandardMaterial) {
                            material.geometryShader.pass({ mesh: mesh, camera: camera });
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
                .setType(this.gl, FrameBuffer_2.AttachmentType.Texture)
                .targetTexture
                .setType(this.gl.UNSIGNED_SHORT)
                .setFormat(this.gl.DEPTH_COMPONENT)
                .apply(this.gl);
            this.gBuffer.extras.push(new FrameBuffer_2.Attachment(this.gBuffer, function (ext) { return ext.COLOR_ATTACHMENT0_WEBGL; })
                .setType(this.gl, FrameBuffer_2.AttachmentType.Texture), new FrameBuffer_2.Attachment(this.gBuffer, function (ext) { return ext.COLOR_ATTACHMENT1_WEBGL; })
                .setType(this.gl, FrameBuffer_2.AttachmentType.Texture));
            for (var _i = 0, _a = this.gBuffer.extras; _i < _a.length; _i++) {
                var colorAttach = _a[_i];
                colorAttach.targetTexture
                    .setType(this.gl.FLOAT)
                    .setFormat(this.gl.RGBA)
                    .setMinFilter(this.gl.NEAREST)
                    .setMagFilter(this.gl.NEAREST)
                    .apply(this.gl);
            }
            this.gBuffer.attach(this.gl, this.ext.draw_buffer);
            for (var _b = 0, _c = scene.objects; _b < _c.length; _b++) {
                var object = _c[_b];
                if (object instanceof Mesh_1.Mesh) {
                    var geometryProgram = new ShaderBuilder_2.ShaderBuilder()
                        .resetShaderLib()
                        .setShadingVert(shaders_2.ShaderSource.interploters__deferred__geometry_vert)
                        .setShadingFrag(shaders_2.ShaderSource.interploters__deferred__geometry_frag)
                        .build(this.gl);
                    for (var _d = 0, _e = object.materials; _d < _e.length; _d++) {
                        var material = _e[_d];
                        if (material instanceof StandardMaterial_1.StandardMaterial) {
                            geometryProgram.extensionStatements.push("#extension GL_EXT_draw_buffers : require");
                            material.geometryShader = geometryProgram;
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
                var lightPosInViewSpace = gl_matrix_8.vec3.transformMat4(gl_matrix_8.vec3.create(), light.position, camera.worldToObjectMatrix);
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
            this.tileProgram.pass({ mesh: this.tile, camera: camera });
        };
        DeferredProcessor.prototype.initTiledPass = function (scene) {
            var _this = this;
            if (this.tile === undefined) {
                this.tile = new Mesh_1.Mesh(new RectGeometry_1.RectGeometry(this.gl).build(), []);
            }
            for (var i = 0; i < this.horizontalTileNum; ++i) {
                for (var j = 0; j < this.verticalTileNum; ++j) {
                    this.tileLightIndex.push([]);
                }
            }
            this.tileLightIndexMap = new DataTexture_1.DataTexture(this.gl, new Float32Array([]))
                .setFormat(this.gl.LUMINANCE)
                .setType(this.gl.FLOAT);
            this.tileLightOffsetCountMap = new DataTexture_1.DataTexture(this.gl, new Float32Array([]), this.horizontalTileNum, this.verticalTileNum)
                .setFormat(this.gl.LUMINANCE_ALPHA)
                .setType(this.gl.FLOAT);
            this.tileLightCountMap = new DataTexture_1.DataTexture(this.gl, new Uint8Array([]), this.horizontalTileNum, this.verticalTileNum).setFormat(this.gl.LUMINANCE).setType(this.gl.UNSIGNED_BYTE);
            this.lightColorIdensityMap = new DataTexture_1.DataTexture(this.gl, new Float32Array([]))
                .setType(this.gl.FLOAT)
                .setFormat(this.gl.RGBA);
            this.lightPositionRadiusMap = new DataTexture_1.DataTexture(this.gl, new Float32Array([]))
                .setType(this.gl.FLOAT)
                .setFormat(this.gl.RGBA);
            this.tileProgram = new ShaderBuilder_2.ShaderBuilder()
                .resetShaderLib()
                .addShaderLibFrag(shaders_2.ShaderSource.calculators__blinn_phong_glsl)
                .setShadingVert(shaders_2.ShaderSource.interploters__deferred__tiledLight_vert)
                .setShadingFrag(shaders_2.ShaderSource.interploters__deferred__tiledLight_frag)
                .setExtraRenderParamHolder("lightInfo", {
                uniforms: {
                    inverseProjection: {
                        type: DataTypeEnum_6.DataType.mat4,
                        updator: function (_a) {
                            var camera = _a.camera;
                            return gl_matrix_8.mat4.invert(gl_matrix_8.mat4.create(), camera.projectionMatrix);
                        },
                    },
                    uLightListLengthSqrt: {
                        type: DataTypeEnum_6.DataType.float,
                        updator: function () { return _this.linearLightIndex.length; },
                    },
                    uHorizontalTileNum: {
                        type: DataTypeEnum_6.DataType.float,
                        updator: function () { return _this.horizontalTileNum; },
                    },
                    uVerticalTileNum: {
                        type: DataTypeEnum_6.DataType.float,
                        updator: function () { return _this.verticalTileNum; },
                    },
                    uTotalLightNum: {
                        type: DataTypeEnum_6.DataType.float,
                        updator: function () { return scene.pointLights.length; },
                    },
                },
                textures: {
                    uNormalDepthSE: { source: this.gBuffer.extras[0].targetTexture },
                    uDiffSpec: { source: this.gBuffer.extras[1].targetTexture },
                    uLightOffsetCount: { source: this.tileLightOffsetCountMap },
                    uLightPositionRadius: { source: this.lightPositionRadiusMap },
                    uLightColorIdensity: { source: this.lightColorIdensityMap },
                    uLightIndex: { source: this.tileLightIndexMap },
                },
            })
                .build(this.gl);
            GraphicsUtils_3.Graphics.copyDataToVertexBuffer(this.gl, this.tile.geometry);
            this.tileProgram.make();
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
    exports.DeferredProcessor = DeferredProcessor;
});
define("materials/ESM/DepthPackMaterial", ["require", "exports", "shader/Program", "shader/ShaderBuilder", "shader/shaders", "materials/Material"], function (require, exports, Program_4, ShaderBuilder_3, shaders_3, Material_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var LinearDepthPackMaterial = (function (_super) {
        __extends(LinearDepthPackMaterial, _super);
        function LinearDepthPackMaterial() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LinearDepthPackMaterial.prototype.initShader = function (gl) {
            return new ShaderBuilder_3.ShaderBuilder()
                .resetShaderLib()
                .addShaderLib(shaders_3.ShaderSource.calculators__linearlize_depth_glsl)
                .addShaderLib(shaders_3.ShaderSource.calculators__packFloat1x32_glsl)
                .setShadingFrag(shaders_3.ShaderSource.interploters__forward__esm__depth_frag)
                .setShadingVert(shaders_3.ShaderSource.interploters__forward__esm__depth_vert)
                .setExtraRenderParamHolder("transform", {
                uniforms: {
                    modelViewProjectionMatrix: Program_4.shaderPassLib.uniforms.modelViewProjectionMatrix,
                    modelViewMatrix: Program_4.shaderPassLib.uniforms.modelViewMatrix,
                },
            })
                .build(gl);
        };
        return LinearDepthPackMaterial;
    }(Material_2.Material));
    exports.LinearDepthPackMaterial = LinearDepthPackMaterial;
});
define("renderer/forward/ForwardProcessor", ["require", "exports", "Mesh"], function (require, exports, Mesh_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
            if (object instanceof Mesh_2.Mesh) {
                var mesh = object;
                mesh.geometry.clean(this.gl);
                for (var _i = 0, _a = mesh.materials; _i < _a.length; _i++) {
                    var material = _a[_i];
                    var shader = material.shader;
                    if (shader.enableDepthTest) {
                        this.gl.enable(this.gl.DEPTH_TEST);
                    }
                    else {
                        this.gl.disable(this.gl.DEPTH_TEST);
                    }
                    if (shader.enableStencilTest) {
                        this.gl.enable(this.gl.STENCIL_TEST);
                    }
                    else {
                        this.gl.disable(this.gl.STENCIL_TEST);
                    }
                    this.gl.useProgram(shader.webGlProgram);
                    shader.pass({ mesh: mesh, camera: camera, material: material, scene: scene });
                }
            }
        };
        return ForwardProcessor;
    }());
    exports.ForwardProcessor = ForwardProcessor;
});
define("textures/Texture2D", ["require", "exports", "textures/Texture"], function (require, exports, Texture_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Texture2D = (function (_super) {
        __extends(Texture2D, _super);
        function Texture2D(gl, url) {
            return _super.call(this, gl, url) || this;
        }
        Texture2D.prototype.apply = function (gl) {
            _super.prototype.apply.call(this, gl);
            gl.texImage2D(this.target, 0, this.format, this.format, this.type, this.image);
            return this;
        };
        return Texture2D;
    }(Texture_4.Texture));
    exports.Texture2D = Texture2D;
});
define("materials/ESM/LogBlurMaterial", ["require", "exports", "gl-matrix", "DataTypeEnum", "Decorators", "shader/ShaderBuilder", "shader/shaders", "materials/Material"], function (require, exports, gl_matrix_9, DataTypeEnum_7, Decorators_6, ShaderBuilder_4, shaders_4, Material_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var PCSSFilteringMaterial = (function (_super) {
        __extends(PCSSFilteringMaterial, _super);
        function PCSSFilteringMaterial() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.blurDirection = gl_matrix_9.vec2.fromValues(1, 0);
            _this.blurStep = 1.0;
            return _this;
        }
        PCSSFilteringMaterial.prototype.initShader = function (gl) {
            return new ShaderBuilder_4.ShaderBuilder()
                .resetShaderLib()
                .addShaderLib(shaders_4.ShaderSource.calculators__packFloat1x32_glsl)
                .addShaderLib(shaders_4.ShaderSource.calculators__unpackFloat1x32_glsl)
                .setShadingFrag(shaders_4.ShaderSource.interploters__forward__esm__blur_frag)
                .setShadingVert(shaders_4.ShaderSource.interploters__forward__esm__blur_vert)
                .build(gl);
        };
        __decorate([
            Decorators_6.texture("uOrigin")
        ], PCSSFilteringMaterial.prototype, "origin", void 0);
        __decorate([
            Decorators_6.uniform(DataTypeEnum_7.DataType.vec2, "uBlurDir")
        ], PCSSFilteringMaterial.prototype, "blurDirection", void 0);
        __decorate([
            Decorators_6.uniform(DataTypeEnum_7.DataType.float, "uBlurStep")
        ], PCSSFilteringMaterial.prototype, "blurStep", void 0);
        return PCSSFilteringMaterial;
    }(Material_3.Material));
    exports.PCSSFilteringMaterial = PCSSFilteringMaterial;
});
define("renderer/ShadowPreProcessor", ["require", "exports", "gl-matrix", "geometries/RectGeometry", "lights/ShadowType", "materials/ESM/DepthPackMaterial", "materials/ESM/LogBlurMaterial", "materials/StandardMaterial", "Mesh", "shader/Program"], function (require, exports, gl_matrix_10, RectGeometry_2, ShadowType_3, DepthPackMaterial_1, LogBlurMaterial_1, StandardMaterial_2, Mesh_3, Program_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShadowPreProcess = (function () {
        function ShadowPreProcess(gl, ext, scene) {
            this.gl = gl;
            this.ext = ext;
            this.depthMaterial = new DepthPackMaterial_1.LinearDepthPackMaterial(gl);
            this.blurMaterial = new LogBlurMaterial_1.PCSSFilteringMaterial(gl);
            this.blurMaterial.shader.setViewPort({ x: 0, y: 0, width: 512, height: 512 });
            this.rectMesh = new Mesh_3.Mesh(new RectGeometry_2.RectGeometry(gl).build(), []);
            this.rectMesh.geometry.clean(gl);
            this.initPass(scene);
        }
        ShadowPreProcess.prototype.process = function (scene, camera, matriels) {
            for (var _i = 0, _a = scene.lights; _i < _a.length; _i++) {
                var light = _a[_i];
                if (light.shadowType !== ShadowType_3.ShadowType.None) {
                    this.depthMaterial.shader.setViewPort({ x: 0, y: 0, width: light.shadowSize, height: light.shadowSize });
                    this.renderDepth(scene, light);
                }
                if (light.shadowType === ShadowType_3.ShadowType.Soft) {
                    this.blurMaterial.shader.setViewPort({ x: 0, y: 0, width: light.shadowSize, height: light.shadowSize });
                }
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        };
        ShadowPreProcess.prototype.initPass = function (scene) {
            this.rectMesh.geometry.clean(this.gl);
            this.depthMaterial.shader.setExtraRenderParam("mvp", {
                uniforms: {
                    modelViewProjectionMatrix: Program_5.shaderPassLib.uniforms.modelViewProjectionMatrix,
                },
            });
        };
        ShadowPreProcess.prototype.renderDepth = function (scene, light) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, light.shadowFrameBuffer.glFramebuffer);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            this.gl.clearColor(light.far, 0, 0, 0);
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (object instanceof Mesh_3.Mesh) {
                    var castShadow = false;
                    for (var _b = 0, _c = object.materials; _b < _c.length; _b++) {
                        var material = _c[_b];
                        if (material instanceof StandardMaterial_2.StandardMaterial) {
                            if (material.castShadow) {
                                castShadow = true;
                                break;
                            }
                        }
                    }
                    if (castShadow) {
                        this.gl.useProgram(this.depthMaterial.shader.webGlProgram);
                        light.drawWithLightCamera({ mesh: object, material: this.depthMaterial });
                    }
                }
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        };
        ShadowPreProcess.prototype.blurDepth = function (scene, light) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, light.blurFrameBuffer.glFramebuffer);
            this.gl.clearColor(light.far, 0, 0, 0);
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            this.blurMaterial.blurDirection = gl_matrix_10.vec2.fromValues(1, 0);
            this.blurMaterial.blurStep = 1.0 / light.shadowSize;
            this.blurMaterial.origin = light.shadowFrameBuffer.attachments.color.targetTexture;
            this.gl.useProgram(this.blurMaterial.shader.webGlProgram);
            light.drawWithLightCamera({ mesh: this.rectMesh, material: this.blurMaterial });
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, light.shadowFrameBuffer.glFramebuffer);
            this.gl.clearColor(light.far, 0, 0, 0);
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
            this.blurMaterial.blurDirection = gl_matrix_10.vec2.fromValues(0, 1);
            this.blurMaterial.blurStep = 1.0 / light.shadowSize;
            this.blurMaterial.origin = light.blurFrameBuffer.attachments.color.targetTexture;
            light.drawWithLightCamera({ mesh: this.rectMesh, material: this.blurMaterial });
        };
        return ShadowPreProcess;
    }());
    exports.ShadowPreProcess = ShadowPreProcess;
});
define("renderer/Renderer", ["require", "exports", "Mesh", "renderer/deferred/DeferredProcessor", "renderer/forward/ForwardProcessor", "renderer/FrameBuffer", "renderer/GraphicsUtils", "renderer/ShadowPreProcessor"], function (require, exports, Mesh_4, DeferredProcessor_1, ForwardProcessor_1, FrameBuffer_3, GraphicsUtils_4, ShadowPreProcessor_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
            this.gl = GraphicsUtils_4.Graphics.initWebwebglContext(canvas, debug);
            this.ext = {
                depth_texture: this.gl.getExtension("WEBGL_depth_texture"),
                draw_buffer: this.gl.getExtension("WEBGL_draw_buffers"),
                texture_float: this.gl.getExtension("OES_texture_float"),
                texture_half_float: this.gl.getExtension("OES_texture_half_float"),
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
            var fbo = new FrameBuffer_3.FrameBuffer(this.gl);
            this.fbos.push(fbo);
            return fbo;
        };
        Renderer.prototype.renderFBO = function (scene, camera) {
        };
        Renderer.prototype.handleResource = function (scene) {
            var _this = this;
            var objectPromises = [];
            var _loop_1 = function (object) {
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
                _loop_1(object);
            }
            return Promise.all(objectPromises).then(function () {
                var texturePromises = [];
                for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                    var object = _a[_i];
                    if (object instanceof Mesh_4.Mesh) {
                        for (var _b = 0, _c = object.materials; _b < _c.length; _b++) {
                            var material = _c[_b];
                            var _material = material;
                            for (var _d = 0, _e = _material.asyncResources; _d < _e.length; _d++) {
                                var textureGetter = _e[_d];
                                var promise = textureGetter(_material);
                                if (!!promise) {
                                    texturePromises.push(promise.then(function (texture) {
                                        texture.apply(_this.gl);
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
        Renderer.prototype.render = function (scene, camera, adaptCanvasAspectRatio) {
            var _this = this;
            if (adaptCanvasAspectRatio === void 0) {
                adaptCanvasAspectRatio = true;
            }
            if (adaptCanvasAspectRatio) {
                camera.setAspectRadio(this.canvas.width / this.canvas.height);
            }
            if (this.scenes.indexOf(scene) !== -1 || this.preloadRes.length > 0) {
                return;
            }
            this.scenes.push(scene);
            this.handleResource(scene)
                .then(function () {
                var materials = [];
                for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                    var obj = _a[_i];
                    if (obj instanceof Mesh_4.Mesh) {
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
                    if (object instanceof Mesh_4.Mesh) {
                        GraphicsUtils_4.Graphics.copyDataToVertexBuffer(_this.gl, object.geometry);
                    }
                }
                var shadowPreProcess = new ShadowPreProcessor_1.ShadowPreProcess(_this.gl, _this.ext, scene);
                var processor;
                if (_this.isDeferred) {
                    processor = new DeferredProcessor_1.DeferredProcessor(_this.gl, _this.ext, scene, camera);
                }
                else {
                    processor = new ForwardProcessor_1.ForwardProcessor(_this.gl, _this.ext, scene, camera);
                }
                scene.programSetUp = true;
                _this.renderQueue.push(function (deltaTime) {
                    scene.update(deltaTime);
                    if (!_this.isDeferred) {
                        shadowPreProcess.process(scene, camera, materials);
                    }
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
    exports.Renderer = Renderer;
});
define("lights/DirectionalLight", ["require", "exports", "gl-matrix", "cameras/OrthoCamera", "DataTypeEnum", "Decorators", "lights/Light"], function (require, exports, gl_matrix_11, OrthoCamera_1, DataTypeEnum_8, Decorators_7, Light_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var DirectionalLight = (function (_super) {
        __extends(DirectionalLight, _super);
        function DirectionalLight(renderer) {
            return _super.call(this, renderer) || this;
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
                return gl_matrix_11.vec3.transformQuat(gl_matrix_11.vec3.create(), gl_matrix_11.vec3.fromValues(0, 0, -1), gl_matrix_11.mat4.getRotation(gl_matrix_11.quat.create(), this._matrix));
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
            var lookPoint = gl_matrix_11.vec3.add(gl_matrix_11.vec3.create(), this._position, _direction);
            this.lookAt(lookPoint);
            return this;
        };
        DirectionalLight.prototype.setUpProjectionCamera = function () {
            this._projectCamera = new OrthoCamera_1.OrthoCamera()
                .setParent(this)
                .setLocalPosition(gl_matrix_11.vec3.create())
                .setAspectRadio(1);
        };
        __decorate([
            Decorators_7.uniform(DataTypeEnum_8.DataType.vec3)
        ], DirectionalLight.prototype, "direction", null);
        return DirectionalLight;
    }(Light_2.Light));
    exports.DirectionalLight = DirectionalLight;
});
define("cameras/PerspectiveCamera", ["require", "exports", "gl-matrix", "cameras/Camera"], function (require, exports, gl_matrix_12, Camera_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(parameter) {
            if (parameter === void 0) {
                parameter = {};
            }
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
            gl_matrix_12.mat4.perspective(this._projectionMatrix, this._fovy, this._aspect, this._near, this._far);
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
                this._aspect = aspect;
                this.compuseProjectionMatrix();
            }
            return this;
        };
        PerspectiveCamera.prototype.setFovy = function (fovy) {
            if (fovy !== this._fovy) {
                this._fovy = fovy;
                this.compuseProjectionMatrix();
            }
            return this;
        };
        PerspectiveCamera.prototype.deCompuseProjectionMatrix = function () {
        };
        PerspectiveCamera.prototype.setAspectRadio = function (ratio) {
            this._aspect = ratio;
            this.compuseProjectionMatrix();
            return this;
        };
        return PerspectiveCamera;
    }(Camera_2.Camera));
    exports.PerspectiveCamera = PerspectiveCamera;
});
define("lights/SpotLight", ["require", "exports", "gl-matrix", "cameras/PerspectiveCamera", "DataTypeEnum", "Decorators", "lights/PointLight", "lights/ShadowType"], function (require, exports, gl_matrix_13, PerspectiveCamera_1, DataTypeEnum_9, Decorators_8, PointLight_1, ShadowType_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpotLight = (function (_super) {
        __extends(SpotLight, _super);
        function SpotLight(renderer) {
            var _this = _super.call(this, renderer) || this;
            _this.setConeAngle(Math.PI / 8);
            _this.setRadius(100);
            _this._shadowType = ShadowType_4.ShadowType.Soft;
            return _this;
        }
        Object.defineProperty(SpotLight.prototype, "coneAngleCos", {
            get: function () {
                return Math.cos(this._coneAngle);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpotLight.prototype, "typename", {
            get: function () {
                return "SpotLight";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpotLight.prototype, "spotDirection", {
            get: function () {
                return gl_matrix_13.vec3.transformQuat(gl_matrix_13.vec3.create(), gl_matrix_13.vec3.fromValues(0, 0, -1), gl_matrix_13.mat4.getRotation(gl_matrix_13.quat.create(), this._matrix));
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
        SpotLight.prototype.setRadius = function (radius) {
            _super.prototype.setRadius.call(this, radius);
            return this;
        };
        SpotLight.prototype.setConeAngle = function (coneAngle) {
            console.assert(coneAngle > 0, "coneAngle should greater than 0!");
            this._coneAngle = coneAngle;
            this._projectCamera.setFovy(coneAngle * 2);
            return this;
        };
        SpotLight.prototype.setSpotDirection = function (spotDirection) {
            var lookPoint = gl_matrix_13.vec3.add(gl_matrix_13.vec3.create(), this.position, spotDirection);
            this.lookAt(lookPoint);
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
            this._projectCamera = new PerspectiveCamera_1.PerspectiveCamera()
                .setParent(this)
                .setLocalPosition(gl_matrix_13.vec3.create())
                .setAspectRadio(1);
        };
        __decorate([
            Decorators_8.uniform(DataTypeEnum_9.DataType.float)
        ], SpotLight.prototype, "coneAngleCos", null);
        __decorate([
            Decorators_8.uniform(DataTypeEnum_9.DataType.vec3, "spotDir")
        ], SpotLight.prototype, "spotDirection", null);
        return SpotLight;
    }(PointLight_1.PointLight));
    exports.SpotLight = SpotLight;
});
define("Scene", ["require", "exports", "gl-matrix", "DataTypeEnum", "Decorators"], function (require, exports, gl_matrix_14, DataTypeEnum_10, Decorators_9) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scene = (function () {
        function Scene() {
            this.objects = [];
            this.lights = [];
            this.ambientLight = gl_matrix_14.vec3.fromValues(0.2, 0.2, 0.2);
            this.openLight = false;
            this.clearColor = [0, 0, 0, 0];
            this.programSetUp = false;
            this.directLights = [];
            this.pointLights = [];
            this.spotLights = [];
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
                    this.directLights.push(light);
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
        __decorate([
            Decorators_9.uniform(DataTypeEnum_10.DataType.vec3, "ambient")
        ], Scene.prototype, "ambientLight", void 0);
        __decorate([
            Decorators_9.arrayOfStructures()
        ], Scene.prototype, "directLights", void 0);
        __decorate([
            Decorators_9.arrayOfStructures()
        ], Scene.prototype, "pointLights", void 0);
        __decorate([
            Decorators_9.arrayOfStructures()
        ], Scene.prototype, "spotLights", void 0);
        return Scene;
    }());
    exports.Scene = Scene;
});
define("Object3d", ["require", "exports", "gl-matrix"], function (require, exports, gl_matrix_15) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Object3d = (function () {
        function Object3d(tag) {
            this.children = [];
            this.depredations = [];
            this._worldToObjectMatrix = gl_matrix_15.mat4.create();
            this._asyncFinished = Promise.resolve(this);
            this._matrix = gl_matrix_15.mat4.create();
            this._parent = null;
            this._localMatrix = gl_matrix_15.mat4.create();
            this._localPosition = gl_matrix_15.vec3.create();
            this._localRotation = gl_matrix_15.quat.create();
            this._localScaling = gl_matrix_15.vec3.fromValues(1, 1, 1);
            this._position = gl_matrix_15.vec3.create();
            this._scaling = gl_matrix_15.vec3.fromValues(1, 1, 1);
            this._rotation = gl_matrix_15.quat.create();
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
            gl_matrix_15.mat4.invert(this._matrix, this._worldToObjectMatrix);
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
                gl_matrix_15.mat4.getTranslation(this._position, this.matrix);
            }
            else {
                this._position = gl_matrix_15.vec3.clone(_localPosition);
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
                gl_matrix_15.mat4.getTranslation(this._localPosition, this._localMatrix);
            }
            else {
                this._localPosition = gl_matrix_15.vec3.clone(_position);
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
            gl_matrix_15.quat.normalize(_localRotation, gl_matrix_15.quat.clone(_localRotation));
            this._localRotation = _localRotation;
            this.composeFromLocalTransform();
            if (!!this._parent) {
                gl_matrix_15.mat4.getRotation(this._rotation, this.matrix);
            }
            else {
                this._rotation = gl_matrix_15.quat.clone(_localRotation);
            }
            this.applyToChildren();
            return this;
        };
        Object.defineProperty(Object3d.prototype, "rotation", {
            get: function () {
                return gl_matrix_15.quat.clone(this._rotation);
            },
            enumerable: true,
            configurable: true
        });
        Object3d.prototype.setRotation = function (_rotation) {
            console.assert(_rotation && _rotation.length === 4, "invalid object rotation paramter");
            gl_matrix_15.quat.normalize(_rotation, gl_matrix_15.quat.clone(_rotation));
            this._rotation = _rotation;
            this.composeFromGlobalTransform();
            if (!!this._parent) {
                gl_matrix_15.mat4.getRotation(this._localRotation, this.localMatrix);
            }
            else {
                this._localRotation = gl_matrix_15.quat.clone(_rotation);
            }
            this.applyToChildren();
            return this;
        };
        Object.defineProperty(Object3d.prototype, "localScaling", {
            get: function () {
                return gl_matrix_15.vec3.clone(this._localScaling);
            },
            enumerable: true,
            configurable: true
        });
        Object3d.prototype.setLocalScaling = function (_localScaling) {
            console.assert(_localScaling && _localScaling.length === 3, "invalid object scale paramter");
            this._localScaling = _localScaling;
            if (!!this._parent) {
                gl_matrix_15.vec3.mul(this._scaling, this._parent.scaling, this._localScaling);
            }
            else {
                this._scaling = gl_matrix_15.vec3.clone(_localScaling);
            }
            this.applyToChildren();
            return this;
        };
        Object.defineProperty(Object3d.prototype, "scaling", {
            get: function () {
                return gl_matrix_15.vec3.clone(this._scaling);
            },
            enumerable: true,
            configurable: true
        });
        Object3d.prototype.setScaling = function (_scaling) {
            console.assert(_scaling && _scaling.length === 3, "invalid object scale paramter");
            this._scaling = _scaling;
            this.composeFromGlobalTransform();
            if (!!this._parent) {
                gl_matrix_15.vec3.div(this._localScaling, this.scaling, this._parent.scaling);
            }
            else {
                this._localScaling = gl_matrix_15.vec3.clone(_scaling);
            }
            this.applyToChildren();
            return this;
        };
        Object3d.prototype.setTransformFromParent = function () {
            if (!!this.parent) {
                this._matrix = gl_matrix_15.mat4.mul(gl_matrix_15.mat4.create(), this.parent.matrix, this.localMatrix);
                this.genOtherMatrixs();
                gl_matrix_15.mat4.getTranslation(this._position, this.matrix);
                gl_matrix_15.mat4.getRotation(this._rotation, this.matrix);
                gl_matrix_15.vec3.mul(this.scaling, this.parent.scaling, this.localScaling);
            }
            return this;
        };
        Object3d.prototype.translate = function (delta) {
            console.assert(delta && delta.length === 3, "invalid delta translate");
            this.setPosition(gl_matrix_15.vec3.add(this.localPosition, gl_matrix_15.vec3.clone(this.localPosition), delta));
            return this;
        };
        Object3d.prototype.rotateX = function (angle) {
            this.setLocalRotation(gl_matrix_15.quat.rotateX(this.localRotation, gl_matrix_15.quat.clone(this.localRotation), angle));
            return this;
        };
        Object3d.prototype.rotateY = function (angle) {
            this.setLocalRotation(gl_matrix_15.quat.rotateY(this.localRotation, gl_matrix_15.quat.clone(this.localRotation), angle));
            return this;
        };
        Object3d.prototype.rotateZ = function (angle) {
            this.setLocalRotation(gl_matrix_15.quat.rotateZ(this.localRotation, gl_matrix_15.quat.clone(this.localRotation), angle));
            return this;
        };
        Object3d.prototype.lookAt = function (center) {
            var dir = gl_matrix_15.vec3.sub(gl_matrix_15.vec3.create(), center, this.position);
            var right = gl_matrix_15.vec3.cross(gl_matrix_15.vec3.create(), dir, [0, 1, 0]);
            var up = gl_matrix_15.vec3.cross(gl_matrix_15.vec3.create(), right, dir);
            gl_matrix_15.mat4.lookAt(this._worldToObjectMatrix, this.position, center, up);
            this.setWorldToObjectMatrix(this._worldToObjectMatrix);
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
            gl_matrix_15.mat4.invert(this._worldToObjectMatrix, this.matrix);
        };
        Object3d.prototype.deComposeLocalMatrix = function () {
            gl_matrix_15.mat4.getTranslation(this._localPosition, this._localMatrix);
            gl_matrix_15.mat4.getRotation(this._localRotation, this._localMatrix);
            if (!!this._parent) {
                gl_matrix_15.mat4.mul(this._matrix, this._parent.matrix, this.localMatrix);
            }
            else {
                this._matrix = gl_matrix_15.mat4.clone(this._localMatrix);
            }
            gl_matrix_15.mat4.fromRotationTranslationScale(this._matrix, this.rotation, this.position, this.scaling);
        };
        Object3d.prototype.composeFromLocalTransform = function () {
            gl_matrix_15.mat4.fromRotationTranslationScale(this.localMatrix, this.localRotation, this.localPosition, this.localScaling);
            if (!!this._parent) {
                gl_matrix_15.mat4.mul(this._matrix, this._parent.matrix, this.localMatrix);
            }
            else {
                this._matrix = gl_matrix_15.mat4.clone(this._localMatrix);
            }
            this.genOtherMatrixs();
        };
        Object3d.prototype.deComposeGlobalMatrix = function () {
            gl_matrix_15.mat4.getTranslation(this._position, this._matrix);
            gl_matrix_15.mat4.getRotation(this._rotation, this._matrix);
            if (!!this._parent) {
                gl_matrix_15.mat4.mul(this._localMatrix, this._parent._worldToObjectMatrix, this.matrix);
            }
            else {
                this._localMatrix = gl_matrix_15.mat4.clone(this._matrix);
            }
            gl_matrix_15.mat4.fromRotationTranslationScale(this.localMatrix, this.localRotation, this.localPosition, this.localScaling);
        };
        Object3d.prototype.composeFromGlobalTransform = function () {
            gl_matrix_15.mat4.fromRotationTranslationScale(this._matrix, this.rotation, this.position, this.scaling);
            this.genOtherMatrixs();
            if (!!this._parent) {
                gl_matrix_15.mat4.mul(this._localMatrix, this._parent._worldToObjectMatrix, this.matrix);
            }
            else {
                this._localMatrix = gl_matrix_15.mat4.clone(this._matrix);
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
    exports.Object3d = Object3d;
});
define("cameras/Camera", ["require", "exports", "gl-matrix", "DataTypeEnum", "Decorators", "Object3d"], function (require, exports, gl_matrix_16, DataTypeEnum_11, Decorators_10, Object3d_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            var _this = _super.call(this) || this;
            _this._upVector = gl_matrix_16.vec3.fromValues(0, 1, 0);
            _this._centerVector = gl_matrix_16.vec3.fromValues(0, 0, -1);
            _this._rightVector = gl_matrix_16.vec3.fromValues(1, 0, 0);
            _this._projectionMatrix = gl_matrix_16.mat4.create();
            _this._near = 0.1;
            _this._far = 500;
            return _this;
        }
        Object.defineProperty(Camera.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
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
                return gl_matrix_16.vec3.clone(this._centerVector);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "upVector", {
            get: function () {
                return gl_matrix_16.vec3.clone(this._upVector);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "centerVector", {
            get: function () {
                return gl_matrix_16.vec3.clone(this._centerVector);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "rightVector", {
            get: function () {
                return gl_matrix_16.vec3.clone(this._rightVector);
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
            _super.prototype.lookAt.call(this, center);
            this._centerVector = center;
            gl_matrix_16.vec3.cross(this._rightVector, [0, 1, 0], center);
            return this;
        };
        Camera.prototype.setNear = function (near) {
            if (near !== this._near) {
                this._near = near;
                this.compuseProjectionMatrix();
            }
            return this;
        };
        Camera.prototype.setFar = function (far) {
            if (far !== this._far) {
                this._far = far;
                this.compuseProjectionMatrix();
            }
            return this;
        };
        Camera.prototype.genOtherMatrixs = function () {
            _super.prototype.genOtherMatrixs.call(this);
            this.compuseProjectionMatrix();
        };
        __decorate([
            Decorators_10.uniform(DataTypeEnum_11.DataType.vec3, "cameraPos")
        ], Camera.prototype, "position", null);
        __decorate([
            Decorators_10.uniform(DataTypeEnum_11.DataType.float, "cameraNear")
        ], Camera.prototype, "near", null);
        __decorate([
            Decorators_10.uniform(DataTypeEnum_11.DataType.float, "cameraFar")
        ], Camera.prototype, "far", null);
        return Camera;
    }(Object3d_3.Object3d));
    exports.Camera = Camera;
});
define("shader/Program", ["require", "exports", "gl-matrix", "DataTypeEnum", "renderer/GraphicsUtils"], function (require, exports, gl_matrix_17, DataTypeEnum_12, GraphicsUtils_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
                case DataTypeEnum_12.DataType.float:
                    this.type = gl.FLOAT;
                    break;
                case DataTypeEnum_12.DataType.int:
                    this.type = gl.INT;
                    break;
                default: break;
            }
        }
        return Attribute;
    }());
    exports.Attribute = Attribute;
    var Program = (function () {
        function Program(gl, source, holders) {
            this.enableDepthTest = true;
            this.enableStencilTest = true;
            this.dirty = true;
            this.extensionStatements = [];
            this.defineCaches = {};
            this.uniformCaches = {};
            this.uniformArrayCaches = {};
            this.undesiredUniforms = {};
            this.attributeLocations = {};
            this.undesiredAttributes = {};
            this.defineLinks = {};
            this.vertexPrecision = "highp";
            this.fragmentPrecision = "highp";
            this.currentTextureUnit = 0;
            this.drawMode = function (gl) { return gl.STATIC_DRAW; };
            this.gl = gl;
            this.source = source;
            this.extraRenderParamHolders = holders;
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
        Program.prototype.setExtraRenderParam = function (name, paramHolder) {
            this.extraRenderParamHolders[name] = paramHolder;
            return this;
        };
        Program.prototype.setViewPort = function (viewport) {
            this.viewport = viewport;
        };
        Program.prototype.clean = function () {
            if (this.dirty) {
                this.make();
                this.dirty = false;
            }
        };
        Program.prototype.make = function () {
            var defines = [];
            for (var defineName in this.defineCaches) {
                var defineVal = this.defineCaches[defineName] || "";
                var defineLine = "#define " + defineName + " " + defineVal;
                defines.push(defineLine);
                console.log(defineLine);
            }
            this.webGlProgram = GraphicsUtils_5.Graphics.createEntileShader(this.gl, this.extensionStatements.join("\n")
                + "\nprecision " + this.vertexPrecision + " float;\n" + defines.join("\n") + "\n"
                + this.source.vertexShader, this.extensionStatements.join("\n")
                + "\nprecision " + this.fragmentPrecision + " float;\n" + defines.join("\n") + "\n"
                + this.source.fragmentShader);
            this.undesiredUniforms = {};
            this.uniformCaches = {};
            this.undesiredAttributes = {};
            this.attributeLocations = {};
            return this;
        };
        Program.prototype.pass = function (buildinContainers) {
            this.updateDefines(buildinContainers);
            this.clean();
            this.currentTextureUnit = 0;
            this.gl.useProgram(this.webGlProgram);
            this.gl.viewport(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
            for (var holderName in buildinContainers) {
                var holder = GraphicsUtils_5.Graphics.getRenderParamHost(buildinContainers[holderName]);
                this.passOneParamsHolder(buildinContainers, holder);
            }
            for (var holderName in this.extraRenderParamHolders) {
                var holder = this.extraRenderParamHolders[holderName];
                this.passOneParamsHolder(buildinContainers, holder);
            }
            var geometry = buildinContainers.mesh.geometry;
            for (var attributeKey in geometry.attributes) {
                if (attributeKey in this.undesiredAttributes) {
                    continue;
                }
                var attribute = geometry.attributes[attributeKey];
                var location_1 = this.attributeLocations[attributeKey];
                if (location_1 === undefined) {
                    location_1 = this.getAttribLocation(attributeKey);
                    if (location_1 === null || location_1 === -1) {
                        this.undesiredAttributes[attributeKey] = undefined;
                        continue;
                    }
                    this.attributeLocations[attributeKey] = location_1;
                }
                this.gl.enableVertexAttribArray(this.attributeLocations[attributeKey]);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
                this.gl.vertexAttribPointer(this.attributeLocations[attributeKey], attribute.size, attribute.type, false, 0, 0);
            }
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, geometry.faces.buffer);
            this.gl.drawElements(this.gl.TRIANGLES, geometry.faces.data.length, this.gl.UNSIGNED_SHORT, 0);
            for (var attributeKey in this.attributeLocations) {
                var attribute = geometry.attributes[attributeKey];
                this.gl.disableVertexAttribArray(this.attributeLocations[attributeKey]);
            }
            return this;
        };
        Program.prototype.passOneParamsHolder = function (buildinContainder, holder, namePrefix) {
            if (namePrefix === void 0) {
                namePrefix = "";
            }
            if (holder === undefined) {
                return;
            }
            for (var linkName in holder.defineLinks) {
                this.defineLinks[namePrefix + linkName] = holder.defineLinks[linkName];
            }
            for (var uniformKey in holder.uniforms) {
                var uniformInfo = holder.uniforms[uniformKey];
                var uniformName = namePrefix + (uniformInfo.name || uniformKey);
                if (uniformName in this.defineLinks && !(this.defineLinks[uniformName] in this.defineCaches)) {
                    continue;
                }
                var val = !!uniformInfo.updator ?
                    uniformInfo.updator(buildinContainder) : holder.hostObject[uniformKey];
                this.updateUniform(uniformName, uniformInfo.type, val);
            }
            for (var uniformArrayKey in holder.uniformArrays) {
                var uniformArrayInfo = holder.uniforms[uniformArrayKey];
                var uniformArrayName = namePrefix + (uniformArrayInfo.name || uniformArrayKey);
                if (uniformArrayName in this.defineLinks && !(this.defineLinks[uniformArrayName] in this.defineCaches)) {
                    continue;
                }
                var val = !!uniformArrayInfo.updator ?
                    uniformArrayInfo.updator(buildinContainder) : holder.hostObject[uniformArrayKey];
                this.updateUniformArray(uniformArrayName, uniformArrayInfo.type, val);
            }
            for (var textureKey in holder.textures) {
                var textureInfo = holder.textures[textureKey];
                var name_3 = namePrefix + (textureInfo.name || textureKey);
                if (name_3 in this.defineLinks && !(this.defineLinks[name_3] in this.defineCaches)) {
                    continue;
                }
                var texture = !!textureInfo.source ? textureInfo.source : holder.hostObject[textureKey];
                if (!!texture) {
                    this.gl.activeTexture(this.gl.TEXTURE0 + this.currentTextureUnit);
                    this.gl.bindTexture(texture.target, texture.glTexture);
                    this.updateUniform(name_3, DataTypeEnum_12.DataType.int, this.currentTextureUnit);
                    this.currentTextureUnit++;
                }
            }
            for (var textureArrayKey in holder.textureArrays) {
                var textureArrayInfo = holder.textureArrays[textureArrayKey];
                var name_4 = namePrefix + (textureArrayInfo.name || textureArrayKey);
                if (name_4 in this.defineLinks && !(this.defineLinks[name_4] in this.defineCaches)) {
                    continue;
                }
                var textureArray = !!textureArrayInfo.sources ?
                    holder.hostObject[textureArrayKey] : textureArrayInfo.sources;
                var indices = [];
                for (var _i = 0, textureArray_1 = textureArray; _i < textureArray_1.length; _i++) {
                    var texture = textureArray_1[_i];
                    this.gl.activeTexture(this.gl.TEXTURE0 + this.currentTextureUnit);
                    this.gl.bindTexture(texture.target, texture.glTexture);
                    indices.push(this.currentTextureUnit);
                    this.currentTextureUnit++;
                }
                if (indices.length > 0) {
                    this.updateUniformArray(name_4, DataTypeEnum_12.DataType.int, new Uint32Array(indices));
                }
            }
            if (!!holder.structArrays && namePrefix !== "" && !!holder.hostObject) {
                throw new Error("structArray can only be nested of depth 1");
            }
            for (var structArrayKey in holder.structArrays) {
                var structArrayInfo = holder.structArrays[structArrayKey];
                var arrayName = structArrayInfo.name || structArrayKey;
                var structArray = holder.hostObject[structArrayKey];
                for (var i in structArray) {
                    var struct = structArray[i];
                    var paramHolder = GraphicsUtils_5.Graphics.getRenderParamHost(struct);
                    if (paramHolder === undefined) {
                        throw new Error("\n                    Property " + arrayName + " of type " + typeof holder.hostObject + "\n                    must be an array of class annotated by @RenderParamContainer");
                    }
                    this.passOneParamsHolder(buildinContainder, GraphicsUtils_5.Graphics.getRenderParamHost(struct), arrayName + "[" + i + "].");
                }
            }
        };
        Program.prototype.updateDefines = function (buildinContainers) {
            for (var holderName in buildinContainers) {
                var holder = GraphicsUtils_5.Graphics.getRenderParamHost(buildinContainers[holderName]);
                if (!!holder) {
                    for (var defineKey in holder.defines) {
                        var defineName = holder.defines[defineKey].defineName;
                        if (!holder.hostObject[defineKey]) {
                            continue;
                        }
                        var val = holder.defines[defineKey].useValue ? holder.hostObject[defineKey] : "";
                        var cache = this.defineCaches[defineName];
                        this.defineCaches[defineName] = val;
                        if (val !== cache) {
                            this.dirty = true;
                        }
                    }
                    for (var structArrayKey in holder.structArrays) {
                        var structArrayInfo = holder.structArrays[structArrayKey];
                        var arrayName = structArrayInfo.name || structArrayKey;
                        var structArray = holder.hostObject[structArrayKey];
                        var val = structArray.length.toString();
                        var cache = this.defineCaches[arrayName + "Num"];
                        if (val !== cache) {
                            this.dirty = true;
                        }
                        this.defineCaches[arrayName + "Num"] = val;
                    }
                }
            }
        };
        Program.prototype.updateUniform = function (name, type, value) {
            if (value === undefined) {
                return;
            }
            if (name in this.undesiredUniforms) {
                return;
            }
            var cache = this.uniformCaches[name];
            if (!cache) {
                cache = { value: value, location: this.gl.getUniformLocation(this.webGlProgram, name) };
                if (cache.location === null) {
                    this.undesiredUniforms[name] = undefined;
                    return;
                }
                this.uniformCaches[name] = cache;
            }
            var location = cache.location;
            if (!location) {
                console.error(location);
            }
            switch (type) {
                case DataTypeEnum_12.DataType.float:
                    this.gl.uniform1f(location, value);
                    break;
                case DataTypeEnum_12.DataType.int:
                    this.gl.uniform1i(location, value);
                    break;
                case DataTypeEnum_12.DataType.vec2:
                    this.gl.uniform2f(location, value[0], value[1]);
                    break;
                case DataTypeEnum_12.DataType.vec3:
                    this.gl.uniform3f(location, value[0], value[1], value[2]);
                    break;
                case DataTypeEnum_12.DataType.vec4:
                    this.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    break;
                case DataTypeEnum_12.DataType.mat2:
                    this.gl.uniformMatrix2fv(location, false, value);
                case DataTypeEnum_12.DataType.mat3:
                    this.gl.uniformMatrix3fv(location, false, value);
                case DataTypeEnum_12.DataType.mat4:
                    this.gl.uniformMatrix4fv(location, false, value);
                    break;
                default: break;
            }
        };
        Program.prototype.updateUniformArray = function (name, type, value) {
            if (value === undefined) {
                return;
            }
            if (name in this.undesiredUniforms) {
                return;
            }
            var cache = this.uniformArrayCaches[name];
            if (!cache) {
                cache = { value: value, location: this.gl.getUniformLocation(this.webGlProgram, name) };
                if (cache.location === null) {
                    this.undesiredUniforms[name] = undefined;
                    return;
                }
                this.uniformArrayCaches[name] = cache;
            }
            var result = cache.location;
            switch (type) {
                case DataTypeEnum_12.DataType.float:
                    this.gl.uniform1fv(location, value);
                    break;
                case DataTypeEnum_12.DataType.int:
                    this.gl.uniform1iv(location, value);
                    break;
                case DataTypeEnum_12.DataType.vec2:
                    this.gl.uniform2fv(location, value);
                    break;
                case DataTypeEnum_12.DataType.vec3:
                    this.gl.uniform3fv(location, value);
                    break;
                case DataTypeEnum_12.DataType.vec4:
                    this.gl.uniform4fv(location, value);
                    break;
                case DataTypeEnum_12.DataType.mat2:
                    this.gl.uniformMatrix2fv(location, false, value);
                case DataTypeEnum_12.DataType.mat3:
                    this.gl.uniformMatrix3fv(location, false, value);
                case DataTypeEnum_12.DataType.mat4:
                    this.gl.uniformMatrix4fv(location, false, value);
                    break;
                default: break;
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
            console.log("initial pass attribute " + name + " " + result);
            return result;
        };
        return Program;
    }());
    exports.Program = Program;
    exports.shaderPassLib = {
        uniforms: {
            modelViewProjectionMatrix: {
                type: DataTypeEnum_12.DataType.mat4,
                updator: function (p) {
                    return gl_matrix_17.mat4.multiply(gl_matrix_17.mat4.create(), p.camera.projectionMatrix, gl_matrix_17.mat4.multiply(gl_matrix_17.mat4.create(), p.camera.worldToObjectMatrix, p.mesh.matrix));
                },
            },
            modelViewMatrix: {
                type: DataTypeEnum_12.DataType.mat4,
                updator: function (_a) {
                    var mesh = _a.mesh, camera = _a.camera;
                    return gl_matrix_17.mat4.mul(gl_matrix_17.mat4.create(), camera.worldToObjectMatrix, mesh.matrix);
                },
            },
        },
    };
});
define("Decorators", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RENDER_PARAM_HOLDER = "renderParams";
    function tryAddParamHolder(proto) {
        if (proto.hasOwnProperty(exports.RENDER_PARAM_HOLDER)) {
            return;
        }
        var params = proto[exports.RENDER_PARAM_HOLDER];
        if (params === undefined) {
            params = {};
        }
        delete proto[exports.RENDER_PARAM_HOLDER];
        Object.defineProperty(proto, exports.RENDER_PARAM_HOLDER, {
            enumerable: true,
            configurable: false,
            writable: false,
            value: params,
        });
    }
    function uniform(type, name) {
        return function (proto, key) {
            tryAddParamHolder(proto);
            var uniforms = proto[exports.RENDER_PARAM_HOLDER].uniforms || {};
            uniforms[key] = { name: name, type: type };
            proto[exports.RENDER_PARAM_HOLDER].uniforms = uniforms;
        };
    }
    exports.uniform = uniform;
    function bindUniformGetter(name, type, getter) {
        return function (constructor) {
            var proto = constructor.prototype;
            tryAddParamHolder(proto);
            var uniforms = proto[exports.RENDER_PARAM_HOLDER].uniforms || {};
            uniforms[name] = { type: type, updator: getter };
            proto[exports.RENDER_PARAM_HOLDER].uniforms = uniforms;
        };
    }
    exports.bindUniformGetter = bindUniformGetter;
    function uniformArray(type, name) {
        return function (proto, key) {
            tryAddParamHolder(proto);
            var uniformArray = proto[exports.RENDER_PARAM_HOLDER].uniformArray || {};
            uniformArray[key] = { name: name, type: type };
            proto[exports.RENDER_PARAM_HOLDER].uniformArray = uniformArray;
        };
    }
    exports.uniformArray = uniformArray;
    function texture(name) {
        return function (proto, key) {
            readyRequire(proto, key);
            tryAddParamHolder(proto);
            var textures = proto[exports.RENDER_PARAM_HOLDER].textures || {};
            textures[key] = { name: name };
            proto[exports.RENDER_PARAM_HOLDER].textures = textures;
        };
    }
    exports.texture = texture;
    function textureArray(name) {
        return function (proto, key) {
            tryAddParamHolder(proto);
            var textureArrays = proto[exports.RENDER_PARAM_HOLDER].textureArrays || {};
            textureArrays[key] = { name: name };
            proto[exports.RENDER_PARAM_HOLDER].textureArrays = textureArrays;
        };
    }
    exports.textureArray = textureArray;
    function arrayOfStructures(name) {
        return function (proto, key) {
            tryAddParamHolder(proto);
            var structArrays = proto[exports.RENDER_PARAM_HOLDER].structArrays || {};
            structArrays[key] = { name: name };
            proto[exports.RENDER_PARAM_HOLDER].structArrays = structArrays;
        };
    }
    exports.arrayOfStructures = arrayOfStructures;
    function define(defineName, useValue) {
        if (useValue === void 0) {
            useValue = false;
        }
        return function (proto, key) {
            tryAddParamHolder(proto);
            var defines = proto[exports.RENDER_PARAM_HOLDER].defines || {};
            defines[key] = { defineName: defineName, useValue: useValue };
            proto[exports.RENDER_PARAM_HOLDER].defines = defines;
        };
    }
    exports.define = define;
    function ifdefine(defineName) {
        return function (proto, key) {
            tryAddParamHolder(proto);
            var defineLinks = proto[exports.RENDER_PARAM_HOLDER].defineLinks || {};
            defineLinks[key] = defineName;
            proto[exports.RENDER_PARAM_HOLDER].defineLinks = defineLinks;
        };
    }
    exports.ifdefine = ifdefine;
    function readyRequire(proto, key) {
        var asyncResources = proto.asyncResources || [];
        if (!proto.hasOwnProperty("asyncResources")) {
            delete proto.asyncResources;
            Object.defineProperty(proto, "asyncResources", {
                enumerable: true,
                configurable: false,
                writable: false,
                value: asyncResources,
            });
        }
        asyncResources.push(function (obj) {
            var resources = obj[key];
            if (!!obj[key]) {
                return obj[key].asyncFinished();
            }
            return undefined;
        });
        proto.asyncResources = asyncResources;
    }
    exports.readyRequire = readyRequire;
});
define("Util", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.mixin = mixin;
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
    exports.getDomScriptText = getDomScriptText;
});
define("geometries/CubeGeometry", ["require", "exports", "geometries/Geometry"], function (require, exports, Geometry_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
            _this.attributes.aMainUV.data = [
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
            _this.attributes.aNormal.data = [
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
    }(Geometry_3.Geometry));
    exports.CubeGeometry = CubeGeometry;
});
define("geometries/TileGeometry", ["require", "exports", "geometries/Geometry"], function (require, exports, Geometry_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
                    var aMainUV = [x / this._widthSegments, y / this._heightSegments];
                    var aNormal = [0, 0, 1];
                    this.addVertex({ position: position, aNormal: aNormal, aMainUV: aMainUV });
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
    }(Geometry_4.Geometry));
    exports.TileGeometry = TileGeometry;
});
define("materials/SkyMaterial", ["require", "exports", "gl-matrix", "DataTypeEnum", "Decorators", "shader/ShaderBuilder", "shader/shaders", "materials/Material"], function (require, exports, gl_matrix_18, DataTypeEnum_13, Decorators_11, ShaderBuilder_5, shaders_5, Material_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var SkyMaterial = (function (_super) {
        __extends(SkyMaterial, _super);
        function SkyMaterial(gl, cubeTexture) {
            var _this = _super.call(this, gl) || this;
            _this.cubeTexture = cubeTexture;
            return _this;
        }
        SkyMaterial.prototype.initShader = function (gl) {
            return new ShaderBuilder_5.ShaderBuilder()
                .resetShaderLib()
                .setShadingVert(shaders_5.ShaderSource.interploters__forward__skybox_vert)
                .setShadingFrag(shaders_5.ShaderSource.interploters__forward__skybox_frag)
                .setExtraRenderParamHolder("skyTransform", {
                uniforms: {
                    viewProjectionMatrix: {
                        type: DataTypeEnum_13.DataType.mat4,
                        updator: function (_a) {
                            var mesh = _a.mesh, camera = _a.camera;
                            var rotateOnlyViewMatrix = gl_matrix_18.mat4.fromQuat(gl_matrix_18.mat4.create(), gl_matrix_18.mat4.getRotation(gl_matrix_18.quat.create(), camera.matrix));
                            rotateOnlyViewMatrix = gl_matrix_18.mat4.invert(gl_matrix_18.mat4.create(), rotateOnlyViewMatrix);
                            return gl_matrix_18.mat4.multiply(gl_matrix_18.mat4.create(), camera.projectionMatrix, rotateOnlyViewMatrix);
                        },
                    },
                },
            })
                .build(gl);
        };
        __decorate([
            Decorators_11.texture("uCubeTexture")
        ], SkyMaterial.prototype, "cubeTexture", void 0);
        return SkyMaterial;
    }(Material_4.Material));
    exports.SkyMaterial = SkyMaterial;
});
define("loader/obj_mtl/CommonPatterns", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var patterns;
    (function (patterns) {
        patterns.num = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/mg;
        patterns.commentPattern = /#.*/mg;
    })(patterns = exports.patterns || (exports.patterns = {}));
});
define("loader/obj_mtl/ResourceFetcher", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.fetchRes = fetchRes;
});
define("loader/obj_mtl/MTLLoader", ["require", "exports", "gl-matrix", "materials/StandardMaterial", "textures/Texture2D", "loader/obj_mtl/CommonPatterns", "loader/obj_mtl/ResourceFetcher"], function (require, exports, gl_matrix_19, StandardMaterial_3, Texture2D_1, CommonPatterns_1, ResourceFetcher_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var MTLLoader = (function () {
        function MTLLoader() {
        }
        MTLLoader.load = function (gl, baseurl) {
            var materials = {};
            var currentMaterial = null;
            var home = baseurl.substr(0, baseurl.lastIndexOf("/") + 1);
            return ResourceFetcher_1.fetchRes(baseurl).then(function (content) {
                content = content.replace(CommonPatterns_1.patterns.commentPattern, "");
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
                    materials[mtlName] = new StandardMaterial_3.StandardMaterial(gl);
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
                    currentMaterial.mainTexture = new Texture2D_1.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "map_Ka":
                    currentMaterial.alphaMap = new Texture2D_1.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "map_Kd":
                    currentMaterial.mainTexture = new Texture2D_1.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "map_bump":
                    currentMaterial.bumpMap = new Texture2D_1.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "bump":
                    currentMaterial.bumpMap = new Texture2D_1.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "disp":
                    currentMaterial.displamentMap = new Texture2D_1.Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "decal":
                    currentMaterial.stencilMap = new Texture2D_1.Texture2D(gl, home + MTLLoader.getImageUrl(line));
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
                matches[1].match(CommonPatterns_1.patterns.num).forEach(function (numStr) {
                    if (numStr !== "") {
                        vector.push(parseFloat(numStr));
                    }
                });
            }
            return gl_matrix_19.vec3.fromValues(vector[0], vector[1], vector[2]);
        };
        MTLLoader.getNumber = function (pattern, line) {
            var matches = line.match(pattern);
            if (matches.length > 0) {
                return parseFloat(matches[1].match(CommonPatterns_1.patterns.num)[0]);
            }
            return 0;
        };
        MTLLoader.newmtlPattern = /newmtl\s(.+)/m;
        MTLLoader.ambientPattern = /Ka\s(.+)/m;
        MTLLoader.diffusePattern = /Kd\s(.+)/m;
        MTLLoader.specularePattern = /Ks\s(.+)/m;
        MTLLoader.specularExponentPattern = /Ns\s(.+)/m;
        MTLLoader.trancparencyPattern = /(Tr|d)\s(.+)/m;
        MTLLoader.mapPattern = /(map_[^\s]+|bump|disp|decal)\s.+/mg;
        MTLLoader.mapSinglePattern = /(map_[^\s]+|bump|disp|decal)\s([^\s]+)/m;
        return MTLLoader;
    }());
    exports.MTLLoader = MTLLoader;
});
define("loader/obj_mtl/OBJLoader", ["require", "exports", "geometries/Geometry", "materials/StandardMaterial", "Mesh", "Object3d", "Util", "loader/obj_mtl/CommonPatterns", "loader/obj_mtl/MTLLoader", "loader/obj_mtl/ResourceFetcher"], function (require, exports, Geometry_5, StandardMaterial_4, Mesh_5, Object3d_4, Util_1, CommonPatterns_2, MTLLoader_1, ResourceFetcher_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var OBJLoader = (function () {
        function OBJLoader() {
        }
        OBJLoader.load = function (gl, url) {
            var container = new Object3d_4.Object3d();
            container.setAsyncFinished(ResourceFetcher_2.fetchRes(url).then(function (content) {
                content = content.replace(CommonPatterns_2.patterns.commentPattern, "");
                var home = url.substr(0, url.lastIndexOf("/") + 1);
                var materialLibs = content.match(OBJLoader.mtlLibPattern);
                var materialsMixin = {};
                var promises = [];
                if (materialLibs != null) {
                    for (var _i = 0, materialLibs_1 = materialLibs; _i < materialLibs_1.length; _i++) {
                        var mtlLib = materialLibs_1[_i];
                        var mtlurl = home + mtlLib.match(OBJLoader.mtlLibSinglePattern)[1];
                        promises.push(MTLLoader_1.MTLLoader.load(gl, mtlurl));
                    }
                }
                return Promise.all(promises).then(function (materialLibs) {
                    for (var _i = 0, materialLibs_2 = materialLibs; _i < materialLibs_2.length; _i++) {
                        var materials = materialLibs_2[_i];
                        Util_1.mixin(materialsMixin, materials);
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
                expression.match(CommonPatterns_2.patterns.num).forEach(function (floatNum) {
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
                var geometry = new Geometry_5.Geometry(gl);
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
                                    aMainUV: [unIndexedUVs[parseInt(match[2], 0) - 1][0],
                                        unIndexedUVs[parseInt(match[2], 0) - 1][1]],
                                    aNormal: unIndexedNormals[parseInt(match[3], 0) - 1],
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
                    meshMaterials.push(new StandardMaterial_4.StandardMaterial(gl));
                }
                var mesh = new Mesh_5.Mesh(geometry, meshMaterials);
                mesh.setParent(container);
            });
        };
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
        return OBJLoader;
    }());
    exports.OBJLoader = OBJLoader;
});
define("extensions/Water", ["require", "exports", "geometries/Geometry", "materials/StandardMaterial", "Mesh"], function (require, exports, Geometry_6, StandardMaterial_5, Mesh_6) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Water = (function (_super) {
        __extends(Water, _super);
        function Water(gl) {
            return _super.call(this, new Geometry_6.Geometry(gl), [new StandardMaterial_5.StandardMaterial(gl)]) || this;
        }
        return Water;
    }(Mesh_6.Mesh));
    exports.Water = Water;
});
define("CanvasToy", ["require", "exports", "Decorators", "renderer/Renderer", "renderer/FrameBuffer", "Object3d", "Scene", "DataTypeEnum", "Util", "cameras/Camera", "cameras/PerspectiveCamera", "cameras/OrthoCamera", "geometries/Geometry", "geometries/CubeGeometry", "geometries/RectGeometry", "geometries/SphereGeometry", "geometries/TileGeometry", "textures/Texture", "textures/Texture2D", "textures/CubeTexture", "textures/DataTexture", "materials/Material", "materials/StandardMaterial", "materials/SkyMaterial", "materials/ESM/DepthPackMaterial", "lights/Light", "lights/PointLight", "lights/SpotLight", "lights/DirectionalLight", "lights/ShadowType", "loader/obj_mtl/OBJLoader", "Mesh", "extensions/Water"], function (require, exports, Decorators_12, Renderer_1, FrameBuffer_4, Object3d_5, Scene_1, DataTypeEnum_14, Util_2, Camera_3, PerspectiveCamera_2, OrthoCamera_2, Geometry_7, CubeGeometry_1, RectGeometry_3, SphereGeometry_2, TileGeometry_1, Texture_5, Texture2D_2, CubeTexture_1, DataTexture_2, Material_5, StandardMaterial_6, SkyMaterial_1, DepthPackMaterial_2, Light_3, PointLight_2, SpotLight_1, DirectionalLight_1, ShadowType_5, OBJLoader_1, Mesh_7, Water_1) {
    function __export(m) {
        for (var p in m)
            if (!exports.hasOwnProperty(p))
                exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ifdefine = Decorators_12.ifdefine;
    exports.texture = Decorators_12.texture;
    exports.textureArray = Decorators_12.textureArray;
    exports.uniform = Decorators_12.uniform;
    exports.uniformArray = Decorators_12.uniformArray;
    exports.Renderer = Renderer_1.Renderer;
    exports.FrameBuffer = FrameBuffer_4.FrameBuffer;
    exports.Attachment = FrameBuffer_4.Attachment;
    exports.AttachmentType = FrameBuffer_4.AttachmentType;
    exports.Object3d = Object3d_5.Object3d;
    exports.Scene = Scene_1.Scene;
    exports.DataType = DataTypeEnum_14.DataType;
    __export(Util_2);
    exports.Camera = Camera_3.Camera;
    exports.PerspectiveCamera = PerspectiveCamera_2.PerspectiveCamera;
    exports.OrthoCamera = OrthoCamera_2.OrthoCamera;
    exports.Geometry = Geometry_7.Geometry;
    exports.CubeGeometry = CubeGeometry_1.CubeGeometry;
    exports.RectGeometry = RectGeometry_3.RectGeometry;
    exports.SphereGeometry = SphereGeometry_2.SphereGeometry;
    exports.TileGeometry = TileGeometry_1.TileGeometry;
    exports.Texture = Texture_5.Texture;
    exports.Texture2D = Texture2D_2.Texture2D;
    exports.CubeTexture = CubeTexture_1.CubeTexture;
    exports.DataTexture = DataTexture_2.DataTexture;
    exports.Material = Material_5.Material;
    exports.StandardMaterial = StandardMaterial_6.StandardMaterial;
    exports.SkyMaterial = SkyMaterial_1.SkyMaterial;
    exports.LinearDepthPackMaterial = DepthPackMaterial_2.LinearDepthPackMaterial;
    exports.Light = Light_3.Light;
    exports.PointLight = PointLight_2.PointLight;
    exports.SpotLight = SpotLight_1.SpotLight;
    exports.DirectionalLight = DirectionalLight_1.DirectionalLight;
    exports.ShadowType = ShadowType_5.ShadowType;
    exports.OBJLoader = OBJLoader_1.OBJLoader;
    exports.Mesh = Mesh_7.Mesh;
    exports.Water = Water_1.Water;
});
define("cameras/CubeCamera", ["require", "exports", "gl-matrix", "cameras/PerspectiveCamera"], function (require, exports, gl_matrix_20, PerspectiveCamera_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var CubeCamera = (function (_super) {
        __extends(CubeCamera, _super);
        function CubeCamera() {
            var _this = _super.call(this) || this;
            _this._projectionMatrices = [0, 0, 0, 0, 0, 0].map(function () { return gl_matrix_20.mat4.create(); });
            return _this;
        }
        CubeCamera.prototype.compuseProjectionMatrix = function () {
            for (var _i = 0, _a = this._projectionMatrices; _i < _a.length; _i++) {
                var mat = _a[_i];
                gl_matrix_20.mat4.perspective(mat, this._fovy, this._aspect, this._near, this._far);
            }
        };
        CubeCamera.prototype.deCompuseProjectionMatrix = function () {
        };
        return CubeCamera;
    }(PerspectiveCamera_3.PerspectiveCamera));
    exports.CubeCamera = CubeCamera;
});
define("examples/global", ["require", "exports", "CanvasToy"], function (require, exports, CanvasToy) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.examples = [];
    function createSkyBox(renderer, cubeTexture) {
        return new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.SkyMaterial(renderer.gl, cubeTexture)]);
    }
    exports.createSkyBox = createSkyBox;
    function onMouseOnStart(renderer) {
        renderer.canvas.onmouseover = function () {
            renderer.start();
        };
        renderer.canvas.onmouseleave = function () {
            renderer.stop();
        };
    }
    exports.onMouseOnStart = onMouseOnStart;
    function createCanvas() {
        var table = document.getElementById("table");
        var newCanvas = document.createElement("canvas");
        newCanvas.width = 960;
        newCanvas.height = 540;
        newCanvas.style.background = "black";
        table.appendChild(newCanvas);
        return newCanvas;
    }
    exports.createCanvas = createCanvas;
});
define("examples/basic/bones/index", ["require", "exports", "CanvasToy", "gl-matrix", "examples/global"], function (require, exports, CanvasToy, gl_matrix_1, global_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var renderer = new CanvasToy.Renderer(global_1.createCanvas());
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    var mainTexture = new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg");
    var material = new CanvasToy.StandardMaterial(renderer.gl, { mainTexture: mainTexture });
    var meshes = [];
    for (var i = 0; i < 4; ++i) {
        var mesh = new CanvasToy.Mesh(new CanvasToy.SphereGeometry(renderer.gl).setWidthSegments(50).setHeightSegments(50).build(), [material]);
        if (i > 0) {
            mesh.setParent(meshes[i - 1]);
            if (i === 3) {
                mesh.setLocalPosition(gl_matrix_1.vec3.fromValues(0, 2.5 - i / 4.0, 0));
            }
            else {
                mesh.setLocalPosition(gl_matrix_1.vec3.fromValues(2.5 - i / 4.0, 0, 0));
            }
        }
        var scaleFactor = Math.pow(2, (1 - i));
        mesh.setScaling(gl_matrix_1.vec3.fromValues(scaleFactor, scaleFactor, scaleFactor));
        meshes.push(mesh);
    }
    meshes[0].translate(gl_matrix_1.vec3.fromValues(0, -2, -10));
    camera.rotateX(-0.2);
    var light = new CanvasToy.DirectionalLight(renderer)
        .rotateY(Math.PI / 3)
        .setPosition(gl_matrix_1.vec3.fromValues(10, -2, -10));
    var t = 0;
    scene.addOnUpdateListener(function (dt) {
        meshes[0].rotateY(-0.005);
        meshes[1].rotateY(0.01);
        meshes[2].rotateX(0.05);
        t += dt;
    });
    scene.addObject(meshes[0], camera);
    scene.addLight(light);
    renderer.render(scene, camera);
    renderer.stop();
    global_1.onMouseOnStart(renderer);
});
define("examples/basic/lightesAndGeometries/index", ["require", "exports", "CanvasToy", "gl-matrix", "examples/global"], function (require, exports, CanvasToy, gl_matrix_2, global_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var renderer = new CanvasToy.Renderer(global_2.createCanvas());
    var scene = new CanvasToy.Scene();
    var center = new CanvasToy.Object3d();
    var camera = new CanvasToy.PerspectiveCamera()
        .setParent(center)
        .translate(gl_matrix_2.vec3.fromValues(0, 10, 10))
        .rotateX(-Math.PI / 4);
    var checkerBoard = new CanvasToy.StandardMaterial(renderer.gl);
    checkerBoard.debug = true;
    var objectMaterial = new CanvasToy.StandardMaterial(renderer.gl, { mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg") });
    var ground = new CanvasToy.Mesh(new CanvasToy.TileGeometry(renderer.gl).build(), [checkerBoard])
        .setPosition(gl_matrix_2.vec3.fromValues(0, -2, 0)).rotateX(-Math.PI / 2).setScaling(gl_matrix_2.vec3.fromValues(10, 10, 10));
    var box = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl).build(), [objectMaterial])
        .setPosition(gl_matrix_2.vec3.fromValues(-2, -1, 0)).setScaling(gl_matrix_2.vec3.fromValues(0.5, 0.5, 0.5));
    var sphere = new CanvasToy.Mesh(new CanvasToy.SphereGeometry(renderer.gl)
        .setWidthSegments(50)
        .setHeightSegments(50)
        .build(), [objectMaterial])
        .setPosition(gl_matrix_2.vec3.fromValues(2, 0, 0)).setScaling(gl_matrix_2.vec3.fromValues(0.5, 0.5, 0.5));
    var directLight = new CanvasToy.DirectionalLight(renderer)
        .setIdensity(0.3)
        .translate(gl_matrix_2.vec3.fromValues(0, 6, 1))
        .rotateX(-Math.PI / 2)
        .rotateY(-Math.PI / 4);
    var spotLight = new CanvasToy.SpotLight(renderer)
        .setIdensity(4)
        .translate(gl_matrix_2.vec3.fromValues(0, 5, 5))
        .rotateX(-Math.PI / 4)
        .setConeAngle(Math.PI / 6);
    scene.addLight(spotLight, directLight);
    scene.addObject(ground, box, sphere, center, camera);
    var time = 0;
    scene.addOnUpdateListener(function (delta) {
        time += delta;
        box.translate(gl_matrix_2.vec3.fromValues(0, 0.04 * Math.sin(time / 400), 0));
        sphere.translate(gl_matrix_2.vec3.fromValues(0, -0.04 * Math.sin(time / 400), 0));
        center.rotateY(0.01);
    });
    scene.ambientLight = gl_matrix_2.vec3.fromValues(0.2, 0.2, 0.2);
    renderer.render(scene, camera);
    renderer.stop();
    global_2.onMouseOnStart(renderer);
});
define("examples/basic/Loader/obj_mtl", ["require", "exports", "CanvasToy", "gl-matrix", "examples/global"], function (require, exports, CanvasToy, gl_matrix_3, global_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var renderer = new CanvasToy.Renderer(global_3.createCanvas());
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera()
        .translate(gl_matrix_3.vec3.fromValues(0, 2, 5))
        .lookAt(gl_matrix_3.vec3.create());
    var light = new CanvasToy.SpotLight(renderer)
        .translate(gl_matrix_3.vec3.fromValues(-5, 5, 0))
        .setConeAngle(Math.PI / 3)
        .setIdensity(4)
        .rotateX(-Math.PI / 4)
        .rotateY(-Math.PI / 4);
    scene.addLight(light);
    var skyTexture = new CanvasToy.CubeTexture(renderer.gl, "resources/images/skybox/arid2_rt.jpg", "resources/images/skybox/arid2_lf.jpg", "resources/images/skybox/arid2_up.jpg", "resources/images/skybox/arid2_dn.jpg", "resources/images/skybox/arid2_bk.jpg", "resources/images/skybox/arid2_ft.jpg");
    scene.addObject(global_3.createSkyBox(renderer, skyTexture));
    var teapot = CanvasToy.OBJLoader.load(renderer.gl, "resources/models/teapot/teapot.obj");
    teapot.setAsyncFinished(teapot.asyncFinished().then(function () {
        var material = teapot.children[0].materials[0];
        material.reflectionMap = skyTexture;
        material.castShadow = true;
        return Promise.resolve(teapot);
    }));
    teapot.setScaling(gl_matrix_3.vec3.fromValues(0.1, 0.1, 0.1));
    scene.addObject(teapot);
    camera.lookAt(teapot.position);
    var time = 0;
    scene.addOnUpdateListener(function () {
        time += 1 / 60;
        teapot.rotateY(0.01);
    });
    renderer.render(scene, camera);
    renderer.stop();
    global_3.onMouseOnStart(renderer);
});
define("examples/deferredRendering/index", ["require", "exports", "CanvasToy", "gl-matrix", "examples/global"], function (require, exports, CanvasToy, gl_matrix_4, global_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var renderer = new CanvasToy.Renderer(global_4.createCanvas());
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera()
        .setPosition(gl_matrix_4.vec3.fromValues(0, 100, 100))
        .lookAt(gl_matrix_4.vec3.fromValues(0, 0, -40));
    var tile = new CanvasToy.Mesh(new CanvasToy.RectGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, {
            mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg"),
        })]).translate(gl_matrix_4.vec3.fromValues(0, -10, -40)).rotateX(-Math.PI / 2).setScaling(gl_matrix_4.vec3.fromValues(200, 200, 200));
    scene.addObject(tile, camera);
    var teapotProto = CanvasToy.OBJLoader.load(renderer.gl, "resources/models/teapot/teapot.obj");
    teapotProto.setAsyncFinished(teapotProto.asyncFinished().then(function () {
        var material = teapotProto.children[0].materials[0];
        material.diffuse = gl_matrix_4.vec3.fromValues(1, 0.8, 0.2);
        material.castShadow = false;
        var _loop_1 = function (i) {
            var teapot = new CanvasToy.Mesh(teapotProto.children[0].geometry, teapotProto.children[0].materials);
            scene.addObject(teapot);
            teapot.translate(gl_matrix_4.vec3.fromValues((i % 10) * 40 - 200, 0, -40 - Math.floor(i / 10) * 40));
            var time = 0;
            var spin = 0.03 * (Math.random() - 0.5);
            var light = new CanvasToy.PointLight(renderer)
                .setPosition(gl_matrix_4.vec3.fromValues(Math.random() * 200.0 - 50, 4, Math.random() * 200.0 - 150))
                .setIdensity(0.5)
                .setRadius(50);
            scene.addLight(light);
            var vx = Math.random() * 3;
            var vy = Math.random() * 3;
            scene.addOnUpdateListener(function () {
                time += 1 / 60;
                teapot.rotateY(spin);
                light.translate(gl_matrix_4.vec3.fromValues(-Math.sin(time * vx), 0, -Math.cos(time * vy)));
            });
        };
        for (var i = 0; i < 40; ++i) {
            _loop_1(i);
        }
        renderer.forceDeferred();
        renderer.render(scene, camera);
        return Promise.resolve(teapotProto);
    }));
    renderer.stop();
    global_4.onMouseOnStart(renderer);
});
define("examples/index", ["require", "exports", "examples/basic/bones/index", "examples/basic/lightesAndGeometries/index", "examples/basic/Loader/obj_mtl", "examples/deferredRendering/index"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=index.js.map