var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CanvasToy;
(function (CanvasToy) {
    var version = 2;
    CanvasToy.debug = true;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Object3d = (function () {
        function Object3d() {
            var _this = this;
            this.localMatrix = mat4.create();
            this.matrix = mat4.create();
            this.position = vec4.create();
            this.size = vec3.create();
            this.rotate = vec3.create();
            this.updateEvents = [];
            this.startEvents = [];
            this.registUpdate(function () {
                _this.apply();
            });
        }
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
        };
        Object3d.prototype.translate = function (deltaX, deltaY, deltaZ) {
            this.localMatrix = mat4.translate(mat4.create(), this.localMatrix, vec3.fromValues(deltaX, deltaY, deltaZ));
        };
        Object3d.prototype.translateTo = function (deltaX, deltaY, deltaZ) { };
        Object3d.prototype.rotateX = function (angle) {
            this.localMatrix = mat4.rotateX(mat4.create(), this.localMatrix, angle);
        };
        Object3d.prototype.rotateY = function (angle) {
            this.localMatrix = mat4.rotateY(mat4.create(), this.localMatrix, angle);
        };
        Object3d.prototype.rotateZ = function (angle) {
            this.localMatrix = mat4.rotateZ(mat4.create(), this.localMatrix, angle);
        };
        Object3d.prototype.scale = function (rateX, rateY, rateZ) {
            if (rateY == undefined) {
                var rateY = rateX;
            }
            if (rateZ == undefined) {
                var rateZ = rateX;
            }
            this.localMatrix = mat4.scale(mat4.create(), this.localMatrix, vec3.fromValues(rateX, rateY, rateZ));
        };
        return Object3d;
    }());
    CanvasToy.Object3d = Object3d;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Node = (function (_super) {
        __extends(Node, _super);
        function Node() {
            var _this = this;
            _super.call(this);
            this.parent = null;
            this.parent = null;
            this.children = [];
            this.registUpdate(function () {
                _this.apply();
            });
        }
        Node.prototype.addChild = function (child) {
            this.children.push(child);
            child.parent = this;
        };
        Node.prototype.apply = function () {
            var current = this;
            this.matrix = mat4.copy(mat4.create(), this.localMatrix);
            while (current != null) {
                this.matrix = mat4.mul(mat4.create(), current.localMatrix, this.matrix);
                current = current.parent;
            }
        };
        Node.prototype.compuseMatrixs = function () {
        };
        return Node;
    }(CanvasToy.Object3d));
    CanvasToy.Node = Node;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            _super.call(this);
            this.projectionMatrix = mat4.create();
        }
        return Camera;
    }(CanvasToy.Node));
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
            _super.call(this);
            this.left = left;
            this.right = right;
            this.bottom = bottom;
            this.top = top;
            this.near = near;
            this.far = far;
            mat4.ortho(this.projectionMatrix, left, right, bottom, top, near, far);
        }
        OrthoCamera.prototype.apply = function () {
            _super.prototype.apply.call(this);
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
            _super.call(this);
            this.aspect = aspect;
            this.fovy = fovy;
            this.near = near;
            this.far = far;
            this.apply();
        }
        PerspectiveCamera.prototype.apply = function () {
            _super.prototype.apply.call(this);
            this.projectionMatrix = mat4.perspective(mat4.create(), this.fovy, this.aspect, this.near, this.far);
        };
        PerspectiveCamera.prototype.adaptTargetRadio = function (target) {
            this.aspect = target.width / target.height;
            this.apply();
        };
        return PerspectiveCamera;
    }(CanvasToy.Camera));
    CanvasToy.PerspectiveCamera = PerspectiveCamera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Geometry = (function () {
        function Geometry(size) {
            this.positions = [];
            this.uvs = [];
            this.normals = [];
            this.faces = [];
            this.flatNormals = [];
        }
        Geometry.prototype.generateFlatNormal = function () {
            for (var i = 0; i < this.faces.length; i += 3) {
                var flatX = (this.normals[this.faces[i] * 3] + this.normals[this.faces[i + 1] * 3] + this.normals[this.faces[i + 2] * 3]) / 3;
                var flatY = (this.normals[this.faces[i] * 3 + 1] + this.normals[this.faces[i + 1] * 3 + 1] + this.normals[this.faces[i + 2] * 3 + 1]) / 3;
                var flatZ = (this.normals[this.faces[i] * 3 + 2] + this.normals[this.faces[i + 1] * 3 + 2] + this.normals[this.faces[i + 2] * 3 + 2]) / 3;
                var flat = [
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ,
                    flatX, flatY, flatZ
                ];
                this.flatNormals = this.flatNormals.concat(flat);
            }
            console.log(this.flatNormals);
        };
        Geometry.prototype.addVertex = function (index, position, uv, normal) {
            this.faces.push.apply(index);
            this.positions.push.apply(position);
            (!!uv) ? this.uvs.push.apply(uv) : 0;
            (!!normal) ? this.normals.push.apply : 0;
        };
        return Geometry;
    }());
    CanvasToy.Geometry = Geometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Texture = (function () {
        function Texture(image, type, format, wrapS, wrapT, magFilter, minFilter) {
            if (type === void 0) { type = CanvasToy.engine.gl.TEXTURE_2D; }
            if (format === void 0) { format = CanvasToy.engine.gl.RGB; }
            if (wrapS === void 0) { wrapS = CanvasToy.engine.gl.CLAMP_TO_EDGE; }
            if (wrapT === void 0) { wrapT = CanvasToy.engine.gl.CLAMP_TO_EDGE; }
            if (magFilter === void 0) { magFilter = CanvasToy.engine.gl.NEAREST; }
            if (minFilter === void 0) { minFilter = CanvasToy.engine.gl.NEAREST; }
            this.image = image;
            this.type = type;
            this.format = format;
            this.wrapS = wrapS;
            this.wrapT = wrapT;
            this.magFilter = magFilter;
            this.minFilter = minFilter;
            this.textureCoord = [];
            this.dataCompleted = false;
            this.isReadyToUpdate = false;
            var gl = CanvasToy.engine.gl;
            this.glTexture = gl.createTexture();
        }
        Texture.prototype.setUpTextureData = function () {
            if (this.dataCompleted) {
                return false;
            }
            this.dataCompleted = true;
            return true;
        };
        ;
        return Texture;
    }());
    CanvasToy.Texture = Texture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.colors = {
        white: vec4.fromValues(1, 1, 1, 1),
        black: vec4.fromValues(0, 0, 0, 1),
        gray: vec4.fromValues(0.5, 0.5, 0.5, 1),
        red: vec4.fromValues(1, 0, 0, 1)
    };
    (function (ShadingMode) {
        ShadingMode[ShadingMode["flatShading"] = 0] = "flatShading";
        ShadingMode[ShadingMode["smoothShading"] = 1] = "smoothShading";
    })(CanvasToy.ShadingMode || (CanvasToy.ShadingMode = {}));
    var ShadingMode = CanvasToy.ShadingMode;
    var Material = (function () {
        function Material(paramter) {
            if (paramter === void 0) { paramter = { texture: undefined, color: CanvasToy.colors.white }; }
            this.attributes = {};
            this.uniforms = {};
            this.samplers = {};
            this.ambient = vec3.fromValues(0.1, 0.1, 0.1);
            this.diffuse = vec3.fromValues(0.8, 0.8, 0.8);
            this.specular = vec3.fromValues(1, 1, 1);
            this.opacity = vec3.fromValues(0, 0, 0);
            this.shadingMode = ShadingMode.smoothShading;
            if (paramter.texture != undefined) {
                this.map = paramter.texture;
                this.addAttribute('aTextureCoord', this.map);
            }
            if (paramter.color != undefined) {
                this.color = paramter.color;
                this.addUniform('uColor', this.color);
            }
        }
        Material.prototype.addAttribute = function (name, data) {
            this.attributes[name] = data;
        };
        Material.prototype.addUniform = function (name, data) {
            this.uniforms[name] = data;
        };
        return Material;
    }());
    CanvasToy.Material = Material;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Program = (function () {
        function Program() {
            this.uniforms = {};
            this.uniformUpdaters = {};
            this.attributes = {};
            this.drawMode = CanvasToy.engine.gl.STATIC_DRAW;
            this.textures = [];
            this.vertexBuffers = {};
        }
        Program.prototype.Program = function (parameter) {
            this.uniforms = parameter.uniforms;
            this.attributes = parameter.attributes;
            for (var name_1 in parameter.uniforms) {
                this.uniforms[name_1] = this.getUniformLocation(this, name_1);
            }
            for (var _i = 0, _a = parameter.attributes; _i < _a.length; _i++) {
                var buffer = _a[_i];
                buffer.index = CanvasToy.engine.gl.getAttribLocation(this, buffer.name);
                this.vertexBuffers[buffer.name] = buffer;
            }
        };
        Program.prototype.setAttribute0 = function (newVertexBuffer) {
            this.attribute0 = newVertexBuffer;
            this.attribute0.index = 0;
            this.vertexBuffers[newVertexBuffer.name] = newVertexBuffer;
            CanvasToy.engine.gl.bindAttribLocation(this.webGlProgram, 0, this.attribute0.name);
            return newVertexBuffer;
        };
        Program.prototype.addAttribute = function (newVertexBuffer) {
            newVertexBuffer.index = CanvasToy.engine.gl.getAttribLocation(this.webGlProgram, newVertexBuffer.name);
            this.vertexBuffers[newVertexBuffer.name] = newVertexBuffer;
            return newVertexBuffer;
        };
        Program.prototype.addUniform = function (name, onUpdateUniform) {
            CanvasToy.engine.gl.useProgram(this.webGlProgram);
            this.uniforms[name] = this.getUniformLocation(this, name);
            this.uniformUpdaters[name] = onUpdateUniform;
        };
        Program.prototype.getUniformLocation = function (program, name) {
            if (CanvasToy.engine.gl == undefined || CanvasToy.engine.gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = CanvasToy.engine.gl.getUniformLocation(program.webGlProgram, name);
            if (result == null) {
                console.error("uniform " + name + " not found!");
                return null;
            }
            return result;
        };
        Program.prototype.getAttribLocation = function (program, name) {
            if (CanvasToy.engine.gl == undefined || CanvasToy.engine.gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = CanvasToy.engine.gl.getAttribLocation(program.webGlProgram, name);
            if (result == null) {
                console.error("attribute " + name + " not found!");
                return null;
            }
            return result;
        };
        return Program;
    }());
    CanvasToy.Program = Program;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, materials) {
            _super.call(this);
            this.drawMode = CanvasToy.engine.gl.STATIC_DRAW;
            this.programs = [];
            this.materials = [];
            this.maps = [];
            this.normalMatrix = mat4.create();
            this.materials = materials;
            this.geometry = geometry;
        }
        Mesh.prototype.apply = function () {
            _super.prototype.apply.call(this);
            mat4.transpose(this.normalMatrix, mat4.invert(mat4.create(), this.matrix));
        };
        return Mesh;
    }(CanvasToy.Node));
    CanvasToy.Mesh = Mesh;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Water = (function (_super) {
        __extends(Water, _super);
        function Water() {
            _super.call(this, new CanvasToy.Geometry(), [new CanvasToy.BRDFPerVertMaterial()]);
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
            _super.call(this);
            this.positions = [
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
                -1.0, 1.0, -1.0
            ];
            this.uvs = [
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
            this.normals = [
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
            this.faces = [
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23
            ];
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
            _super.call(this);
            this.positions = [
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, 1.0, 0.0,
            ];
            this.uvs = [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                1.0, 1.0
            ];
            this.normals = [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
                0, 1, 1,
            ];
            this.faces = [
                0, 1, 2,
                2, 1, 3
            ];
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
            _super.call(this);
            this.radius = radius;
            this.perVertDistance = perVertDistance;
            for (var y = -radius; y <= radius; y += perVertDistance) {
                var circlrRadius = Math.sqrt(radius * radius - y * y);
                for (var x = -circlrRadius; x <= circlrRadius; x += perVertDistance) {
                    var z1 = Math.sqrt(circlrRadius * circlrRadius - x * x);
                    var z2 = -z1;
                    this.positions.push(x, y, z1);
                    this.positions.push(x, y, z2);
                }
            }
            for (var _i = 0, _a = this.positions; _i < _a.length; _i++) {
                var verts = _a[_i];
                console.log(verts);
            }
        }
        return SphereGeometry;
    }(CanvasToy.Geometry));
    CanvasToy.SphereGeometry = SphereGeometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light() {
            _super.call(this);
            this.diffuse = vec3.fromValues(1.0, 1.0, 1.0);
            this.specular = vec3.fromValues(1.0, 1.0, 1.0);
            this.idensity = 1.0;
        }
        return Light;
    }(CanvasToy.Object3d));
    CanvasToy.Light = Light;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var PointLight = (function (_super) {
        __extends(PointLight, _super);
        function PointLight() {
            _super.call(this);
        }
        PointLight.prototype.apply = function () {
        };
        return PointLight;
    }(CanvasToy.Light));
    CanvasToy.PointLight = PointLight;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var OBJLoader;
    (function (OBJLoader) {
        var commentPattern = /\#.*/mg;
        var numberPattern = /([0-9]|\.|\-|e)+/g;
        var faceSplitVertPattern = /([0-9]|\/|\-)+/g;
        var facePerVertPattern = /([0-9]*)\/?([0-9]*)\/?([0-9]*)/;
        var objectSplitPattern = /[o|g]\s+.+/mg;
        var materialPattern = /usemtl\s.+/;
        var vertexPattern = /v\s+([0-9]|\s|\.|\-|e)+/mg;
        var uvPattern = /vt\s+([0-9]|\s|\.|\-|e)+/mg;
        var normalPattern = /vn\s+([0-9]|\s|\.|\-|e)+/mg;
        var indexPattern = /f\s+([0-9]|\s|\/|\-)+/mg;
        function fetch(url, onload) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    if (onload) {
                        onload(request.responseText);
                    }
                }
            };
            request.open('GET', url);
            request.send();
        }
        function praiseAttibuteLines(lines) {
            var result = [];
            if (lines == null) {
                return;
            }
            lines.forEach(function (expression) {
                var data = [];
                expression.match(numberPattern).forEach(function (expression) {
                    if (expression != "") {
                        data.push(parseFloat(expression));
                    }
                });
                result.push(data);
            });
            return result;
        }
        function fillAVertex(target, data) {
            for (var i = 0; i < data.length; ++i) {
                target.push(data[i]);
            }
        }
        function parseAsTriangle(faces, forEachFace) {
            for (var i = 0; i < faces.length - 2; ++i) {
                var triangleFace = [faces[0], faces[i + 1], faces[i + 2]];
                forEachFace(triangleFace);
            }
        }
        function buildUpMeshes(content, unIndexedPositions, unIndexedUVs, unIndexedNormals) {
            var container = new CanvasToy.Node();
            var objects = content.split(objectSplitPattern);
            objects.splice(0, 1);
            objects.forEach(function (objectContent) {
                var geometry = new CanvasToy.Geometry();
                geometry.positions = [];
                geometry.normals = [];
                geometry.uvs = [];
                var faces = objectContent.match(indexPattern);
                faces == null ? null : faces.forEach(function (faceStr) {
                    parseAsTriangle(faceStr.match(faceSplitVertPattern), function (triangleFaces) {
                        triangleFaces.forEach(function (perVertData) {
                            var match = perVertData.match(facePerVertPattern);
                            if (match != null && match[1] != null) {
                                var positionIndex = parseInt(match[1]) - 1;
                                geometry.faces.push(geometry.positions.length / 3);
                                fillAVertex(geometry.positions, unIndexedPositions[positionIndex]);
                                match[2] === '' ? null : fillAVertex(geometry.uvs, unIndexedUVs[parseInt(match[2]) - 1]);
                                match[3] === '' ? null : fillAVertex(geometry.normals, unIndexedNormals[parseInt(match[3]) - 1]);
                            }
                        });
                    });
                });
                var mesh = new CanvasToy.Mesh(geometry, [new CanvasToy.BRDFPerVertMaterial()]);
                container.addChild(mesh);
            });
            return container;
        }
        function load(url, onload) {
            fetch(url, function (content) {
                content = content.replace(commentPattern, '');
                var positionlines = content.match(vertexPattern);
                var uvlines = content.match(uvPattern);
                var normallines = content.match(normalPattern);
                var unIndexedPositions = praiseAttibuteLines(positionlines);
                var unIndexedUVs = praiseAttibuteLines(uvlines);
                var unIndexedNormals = praiseAttibuteLines(normallines);
                var container = buildUpMeshes(content, unIndexedPositions, unIndexedUVs, unIndexedNormals);
                onload(container);
            });
        }
        OBJLoader.load = load;
    })(OBJLoader = CanvasToy.OBJLoader || (CanvasToy.OBJLoader = {}));
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var BRDFPerFragMaterial = (function (_super) {
        __extends(BRDFPerFragMaterial, _super);
        function BRDFPerFragMaterial(paramter) {
            _super.call(this, paramter);
            this.vertexShaderSource = CanvasToy.brdf_perfrag_vert;
            this.fragShaderSource = CanvasToy.brdf_perfrag_frag;
        }
        return BRDFPerFragMaterial;
    }(CanvasToy.Material));
    CanvasToy.BRDFPerFragMaterial = BRDFPerFragMaterial;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var BRDFPerVertMaterial = (function (_super) {
        __extends(BRDFPerVertMaterial, _super);
        function BRDFPerVertMaterial(paramter) {
            _super.call(this, paramter);
            this.vertexShaderSource = CanvasToy.brdf_pervert_vert;
            this.fragShaderSource = CanvasToy.brdf_pervert_frag;
        }
        return BRDFPerVertMaterial;
    }(CanvasToy.Material));
    CanvasToy.BRDFPerVertMaterial = BRDFPerVertMaterial;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    function setCanvas(canvas) {
        CanvasToy.engine = new Renderer(canvas);
    }
    var Renderer = (function () {
        function Renderer(canvas) {
            var _this = this;
            this.canvas = canvas;
            this.preloadRes = [];
            this.usedTextureNum = 0;
            this.renderTargets = [];
            this.vertPrecision = "highp";
            this.fragPrecision = "mediump";
            this.isAnimating = false;
            this.renderQueue = [];
            this.gl = CanvasToy.initWebwebglContext(canvas);
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            this.renderQueue.push(function () {
                _this.gl.viewport(0, 0, canvas.width, canvas.height);
                _this.gl.clear(_this.gl.DEPTH_BUFFER_BIT | _this.gl.COLOR_BUFFER_BIT);
            });
            setInterval(function () {
                for (var _i = 0, _a = _this.renderQueue; _i < _a.length; _i++) {
                    var renderCommand = _a[_i];
                    renderCommand();
                }
            }, 1000 / 60);
        }
        Renderer.prototype.renderToTexture = function (scene, camera) {
            var _this = this;
            var gl = this.gl;
            var rttTexture = new CanvasToy.RenderTargetTexture(scene, camera);
            gl.bindTexture(gl.TEXTURE_2D, rttTexture.glTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, rttTexture.format, this.canvas.width, this.canvas.height, 0, rttTexture.format, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(rttTexture.type, gl.TEXTURE_WRAP_S, rttTexture.wrapS);
            gl.texParameteri(rttTexture.type, gl.TEXTURE_WRAP_T, rttTexture.wrapT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, rttTexture.magFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, rttTexture.minFilter);
            rttTexture.frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, rttTexture.frameBuffer);
            rttTexture.depthBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, rttTexture.depthBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.canvas.width, this.canvas.height);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture.glTexture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rttTexture.depthBuffer);
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
                console.log('frame buffer not completed');
            }
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.buildScene(scene, camera);
            this.renderQueue.push(function () {
                gl.bindFramebuffer(gl.FRAMEBUFFER, rttTexture.frameBuffer);
                gl.bindRenderbuffer(gl.RENDERBUFFER, rttTexture.depthBuffer);
                _this.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
                _this.gl.clear(_this.gl.DEPTH_BUFFER_BIT | _this.gl.COLOR_BUFFER_BIT);
                for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                    var object = _a[_i];
                    _this.renderObject(camera, object);
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            });
            return rttTexture;
        };
        Renderer.prototype.render = function (scene, camera) {
            var _this = this;
            this.buildScene(scene, camera);
            this.renderQueue.push(function () {
                _this.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
                for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                    var object = _a[_i];
                    _this.renderObject(camera, object);
                }
            });
        };
        Renderer.prototype.buildScene = function (scene, camera) {
            if (this.preloadRes.length > 0) {
                return;
            }
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (object instanceof CanvasToy.Mesh) {
                    var mesh = object;
                    this.makeMeshPrograms(scene, mesh, camera);
                }
            }
            camera.adaptTargetRadio(this.canvas);
            scene.programSetUp = true;
            console.log('make shaders');
        };
        Renderer.prototype.makeMeshPrograms = function (scene, mesh, camera) {
            if (mesh.materials.length > 1) {
                CanvasToy.engine.gl.enable(CanvasToy.engine.gl.BLEND);
                CanvasToy.engine.gl.blendFunc(CanvasToy.engine.gl.ONE, CanvasToy.engine.gl.DST_COLOR);
            }
            var _loop_1 = function(material) {
                var cameraInScene = false;
                for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                    var object = _a[_i];
                    if (object == camera) {
                        cameraInScene = true;
                        break;
                    }
                }
                ;
                if (!cameraInScene) {
                    console.error("Camera has not been added in Scene!");
                }
                prefixVertex = [
                    'precision ' + this_1.vertPrecision + ' float;',
                    material.map ? '#define USE_TEXTURE ' : '',
                    material.color ? '#define USE_COLOR ' : '',
                    scene.openLight ? '#define OPEN_LIGHT\n#define LIGHT_NUM '
                        + scene.lights.length : ''
                ].join("\n") + '\n';
                prefixFragment = [
                    'precision ' + this_1.fragPrecision + ' float;',
                    material.map ? '#define USE_TEXTURE ' : '',
                    material.color ? '#define USE_COLOR ' : '',
                    scene.openLight ? '#define OPEN_LIGHT \n#define LIGHT_NUM '
                        + scene.lights.length : ''
                ].join("\n") + '\n';
                if (CanvasToy.debug) {
                }
                var program = new CanvasToy.Program();
                mesh.programs.push(program);
                program.material = material;
                program.webGlProgram = CanvasToy.createEntileShader(this_1.gl, prefixVertex + material.vertexShaderSource, prefixFragment + material.fragShaderSource);
                this_1.gl.useProgram(program.webGlProgram);
                program.addUniform("modelViewProjectionMatrix", function (mesh, camera) {
                    var mvpMatrix = mat4.multiply(mat4.create(), camera.projectionMatrix, mat4.multiply(mat4.create(), mat4.invert(mat4.create(), camera.matrix), mesh.matrix));
                    CanvasToy.engine.gl.uniformMatrix4fv(program.uniforms["modelViewProjectionMatrix"], false, new Float32Array(mvpMatrix));
                });
                this_1.gl.useProgram(program.webGlProgram);
                program.indexBuffer = this_1.gl.createBuffer();
                this_1.gl.bindBuffer(this_1.gl.ELEMENT_ARRAY_BUFFER, program.indexBuffer);
                this_1.gl.bufferData(this_1.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.geometry.faces), program.drawMode);
                program.setAttribute0(new CanvasToy.VertexBuffer("position", 3, this_1.gl.FLOAT)).data = mesh.geometry.positions;
                if (material.color != undefined) {
                    program.addUniform("color", function () {
                        CanvasToy.engine.gl.uniform4f(program.uniforms["color"], material.color[0], material.color[1], material.color[2], material.color[3]);
                    });
                }
                if (material.map != undefined) {
                    this_1.loadTexture(program, 'uTextureSampler', material.map);
                    program.addAttribute(new CanvasToy.VertexBuffer("aTextureCoord", 2, this_1.gl.FLOAT))
                        .data = mesh.geometry.uvs;
                    console.log(mesh.geometry.uvs);
                }
                if (scene.openLight) {
                    this_1.setUplights(scene, program, mesh, camera);
                }
                this_1.copyToVertexBuffer(program);
            };
            var this_1 = this;
            var prefixVertex, prefixFragment;
            for (var _b = 0, _c = mesh.materials; _b < _c.length; _b++) {
                var material = _c[_b];
                _loop_1(material);
            }
        };
        Renderer.prototype.loadTexture = function (program, sampler, texture) {
            var _this = this;
            if (texture instanceof CanvasToy.RenderTargetTexture) {
                var gl = CanvasToy.engine.gl;
                texture.unit = this.usedTextureNum;
                this.usedTextureNum++;
                program.textures.push(texture);
                gl.useProgram(program.webGlProgram);
                gl.activeTexture(gl.TEXTURE0 + texture.unit);
                gl.bindTexture(texture.type, texture.glTexture);
                program.addUniform(sampler, function (mesh, camera) {
                    CanvasToy.engine.gl.uniform1i(program.uniforms[sampler], texture.unit);
                });
                return;
            }
            var lastOnload = texture.image.onload;
            if (texture.image.complete) {
                this.addTexture(program, sampler, texture);
                return;
            }
            texture.image.onload = function (et) {
                if (lastOnload) {
                    lastOnload.apply(texture.image, et);
                }
                _this.addTexture(program, sampler, texture);
            };
        };
        Renderer.prototype.addTexture = function (program, sampler, texture) {
            texture.unit = this.usedTextureNum;
            this.usedTextureNum++;
            program.textures.push(texture);
            var gl = CanvasToy.engine.gl;
            gl.useProgram(program.webGlProgram);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.activeTexture(gl.TEXTURE0 + texture.unit);
            gl.bindTexture(texture.type, texture.glTexture);
            gl.texParameteri(texture.type, gl.TEXTURE_WRAP_S, texture.wrapS);
            gl.texParameteri(texture.type, gl.TEXTURE_WRAP_T, texture.wrapT);
            gl.texParameteri(texture.type, gl.TEXTURE_MAG_FILTER, texture.magFilter);
            gl.texParameteri(texture.type, gl.TEXTURE_MIN_FILTER, texture.minFilter);
            texture.setUpTextureData();
            program.addUniform(sampler, function (mesh, camera) {
                CanvasToy.engine.gl.uniform1i(program.uniforms[sampler], texture.unit);
            });
        };
        Renderer.prototype.setUplights = function (scene, program, mesh, camera) {
            var _this = this;
            program.addUniform("normalMatrix", function (mesh, camera) {
                CanvasToy.engine.gl.uniformMatrix4fv(program.uniforms["normalMatrix"], false, new Float32Array(mesh.normalMatrix));
            });
            program.addUniform("ambient", function (mesh, camera) {
                CanvasToy.engine.gl.uniform3f(program.uniforms["ambient"], scene.ambientLight[0], scene.ambientLight[1], scene.ambientLight[2]);
            });
            program.addUniform("eyePosition", function (mesh, camera) {
                CanvasToy.engine.gl.uniform3f(program.uniforms["eyePosition"], camera.position[0], camera.position[1], camera.position[2]);
            });
            switch (program.material.shadingMode) {
                case CanvasToy.ShadingMode.flatShading:
                    mesh.geometry.generateFlatNormal();
                    program.addAttribute(new CanvasToy.VertexBuffer("aNormal", 3, this.gl.FLOAT))
                        .data = mesh.geometry.flatNormals;
                    break;
                case CanvasToy.ShadingMode.smoothShading:
                    program.addAttribute(new CanvasToy.VertexBuffer("aNormal", 3, this.gl.FLOAT))
                        .data = mesh.geometry.normals;
                    console.log('addAttribute');
                    break;
            }
            var index = 0;
            var _loop_2 = function(light) {
                diffuse = "lights[" + index + "].diffuse";
                specular = "lights[" + index + "].specular";
                idensity = "lights[" + index + "].idensity";
                position = "lights[" + index + "].position";
                program.addUniform(diffuse, function (mesh, camera) {
                    _this.gl.uniform3f(program.uniforms[diffuse], light.diffuse[0], light.diffuse[1], light.diffuse[2]);
                });
                program.addUniform(specular, function (mesh, camera) {
                    _this.gl.uniform3f(program.uniforms[specular], light.specular[0], light.specular[1], light.specular[2]);
                });
                program.addUniform(position, function (mesh, camera) {
                    _this.gl.uniform3f(program.uniforms[position], light.position[0], light.position[1], light.position[2]);
                });
                program.addUniform(idensity, function (mesh, camera) {
                    _this.gl.uniform1f(program.uniforms[idensity], light.idensity);
                });
            };
            var diffuse, specular, idensity, position;
            for (var _i = 0, _a = scene.lights; _i < _a.length; _i++) {
                var light = _a[_i];
                _loop_2(light);
            }
        };
        Renderer.prototype.copyToVertexBuffer = function (program) {
            var gl = CanvasToy.engine.gl;
            gl.useProgram(program.webGlProgram);
            for (var name_2 in program.vertexBuffers) {
                var vertexBuffer = program.vertexBuffers[name_2];
                gl.enableVertexAttribArray(vertexBuffer.index);
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexBuffer.data), CanvasToy.engine.gl.STATIC_DRAW);
            }
        };
        ;
        Renderer.prototype.renderObject = function (camera, object) {
            var gl = this.gl;
            if (object instanceof CanvasToy.Mesh) {
                var mesh = object;
                for (var _i = 0, _a = mesh.programs; _i < _a.length; _i++) {
                    var program = _a[_i];
                    this.gl.useProgram(program.webGlProgram);
                    for (var updaters in program.uniformUpdaters) {
                        program.uniformUpdaters[updaters](object, camera);
                    }
                    for (var bufferName in program.vertexBuffers) {
                        gl.bindBuffer(CanvasToy.engine.gl.ARRAY_BUFFER, program.vertexBuffers[bufferName].buffer);
                        CanvasToy.engine.gl.vertexAttribPointer(program.vertexBuffers[bufferName].index, program.vertexBuffers[bufferName].size, program.vertexBuffers[bufferName].type, false, 0, 0);
                    }
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program.indexBuffer);
                    gl.drawElements(gl.TRIANGLES, mesh.geometry.faces.length, gl.UNSIGNED_SHORT, 0);
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
    var VertexBuffer = (function () {
        function VertexBuffer(name, size, type, data, stride) {
            this.buffer = null;
            this.name = name;
            this.size = size;
            this.type = type;
            this.data = data ? data : [];
            this.stride = stride ? stride : 0;
            this.buffer = CanvasToy.engine.gl.createBuffer();
        }
        return VertexBuffer;
    }());
    CanvasToy.VertexBuffer = VertexBuffer;
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
                object.update(dt);
            }
        };
        Scene.prototype.addObject = function (object) {
            var _this = this;
            this.objects.push(object);
            object.scene = this;
            if (object instanceof CanvasToy.Node) {
                var node = object;
                node.children.forEach(function (child) {
                    _this.addObject(child);
                });
            }
        };
        Scene.prototype.removeObject = function (object) {
            var _this = this;
            if (object instanceof CanvasToy.Node) {
                var node = object;
                node.children.forEach(function (child) {
                    _this.removeObject(child);
                });
            }
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
    CanvasToy.vertexShaderTemplate = {
        "basic": [
            "common"
        ]
    };
    CanvasToy.fragmentShaderTemplate = {
        "basic": [
            "common"
        ]
    };
    function makeVertShader(src) {
    }
    CanvasToy.makeVertShader = makeVertShader;
    function makeFragShader(src) {
    }
    CanvasToy.makeFragShader = makeFragShader;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.basic_frag = "#version 100\n\n#ifdef USE_COLOR\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_MAIN_TEXTURE\nvarying vec2 vMainTextureST;\nuniform sampler2D mainTexture;\nvec4 textureColor;\n#endif\n\n#ifdef OPEN_LIGHT\nvarying vec3 vNormal;\n#endif\n\nvoid main() {\n#ifdef USE_COLOR\n    gl_FragColor = vColor;\n#endif\n\n#ifdef USE_MAIN_TEXTURE\n    gl_FragColor = texture2D(mainTexture, vec2(vMainTextureST.s, vMainTextureST.t));\n#endif\n\n}\n";
    CanvasToy.basic_vert = "#version 100\n\nattribute vec3 position;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec4 cameraPosition;\n\n#ifdef USE_COLOR\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_MAIN_TEXTURE\nattribute vec2 aMainTextureST;\nvarying vec2 vMainTextureST;\n#endif\n\n#ifdef OPEN_LIGHT\nattribute vec3 aNormal;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n#ifdef USE_COLOR\n    vColor = aColor;\n#endif\n\n#ifdef USE_MAIN_TEXTURE\n    vMainTextureST = aMainTextureST;\n#endif\n\n}\n";
    CanvasToy.brdf_perfrag_frag = "#ifdef USE_COLOR // color declaration\nuniform vec4 color;\n#endif // color declaration\n\n#ifdef USE_TEXTURE // texture declaration\nvarying vec2 vTextureCoord;\nuniform sampler2D uTextureSampler;\nvec4 textureColor;\n#endif // texture declaration\n\n\n#ifdef OPEN_LIGHT // light declaration\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec3 position;\n    bool directional;\n};\nuniform vec3 ambient;\nuniform vec3 eyePosition;\nvarying vec3 vPosition;\nvec3 totalLighting;\nuniform Light lights[LIGHT_NUM];\nvarying vec3 vNormal;\n#endif // light declaration\n\nvoid main() {\n#ifdef USE_TEXTURE\n    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n#ifdef OPEN_LIGHT\n    totalLighting = ambient;\n    vec3 normal = normalize(vNormal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        vec3 lightDir = normalize(lights[index].position - vPosition);\n        float lambortian = max(dot(lightDir, normal), 0.0);\n        vec3 reflectDir = reflect(lightDir, normal);\n        vec3 viewDir = normalize(eyePosition - vPosition);\n        float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n        // TODO: replace the 2rd paramter to material shineness\n        float specular = pow(specularAngle, 16.0);\n        vec3 specularColor = lights[index].specular * specular;\n        vec3 diffuseColor = lights[index].diffuse * lambortian;\n        totalLighting += (diffuseColor + specularColor) * lights[index].idensity;\n    }\n    gl_FragColor = vec4(totalLighting, 1.0);\n#else\n#ifdef USE_COLOR\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#endif\n#endif\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * textureColor;\n#endif\n#ifdef USE_COLOR\n    gl_FragColor = gl_FragColor * color;\n#endif\n}\n";
    CanvasToy.brdf_perfrag_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    vPosition = gl_Position.xyz;\n#endif\n\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n";
    CanvasToy.brdf_pervert_frag = "#ifdef USE_COLOR // color declaration\nuniform vec4 color;\n#endif // color declaration\n\n#ifdef USE_TEXTURE // texture declaration\nvarying vec2 vTextureCoord;\nuniform sampler2D uTextureSampler;\n#endif // texture declaration\n\n#ifdef OPEN_LIGHT // light declaration\nvarying vec3 vLightColor;\n#endif // light declaration\n\nvoid main() {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#ifdef USE_COLOR\n    gl_FragColor = color;\n#endif\n\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n\n#ifdef OPEN_LIGHT\n    gl_FragColor = gl_FragColor * vec4(vLightColor, 1.0);\n#endif\n}\n";
    CanvasToy.brdf_pervert_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE // texture\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n#endif // texture\n\n#ifdef OPEN_LIGHT // light\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec3 position;\n    bool directional;\n}; // light\n\nuniform vec3 ambient;\nuniform vec3 eyePosition;\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vLightColor;\nvec3 totalLighting;\nuniform Light lights[LIGHT_NUM];\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    totalLighting = ambient;\n    normal = normalize(normal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        vec3 lightDir = normalize(lights[index].position - gl_Position.xyz);\n        float lambortian = max(dot(lightDir, normal), 0.0);\n        vec3 reflectDir = reflect(lightDir, normal);\n        vec3 viewDir = normalize(eyePosition - gl_Position.xyz);\n        float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n        float specular = pow(specularAngle, 16.0);\n        vec3 specularColor = lights[index].specular * specular;\n        vec3 diffuseColor = lights[index].diffuse * lambortian * lights[index].idensity;\n        totalLighting = totalLighting + (diffuseColor + specularColor);\n    }\n    vLightColor = totalLighting;\n#endif\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n";
    CanvasToy.env_map_vert = "";
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var CubeTexture = (function (_super) {
        __extends(CubeTexture, _super);
        function CubeTexture(xneg, xpos, yneg, ypos, zneg, zpos, wrapS, wrapT, magFilter, minFilter) {
            _super.call(this, null, CanvasToy.engine.gl.TEXTURE_CUBE_MAP, wrapS, wrapT, magFilter, minFilter);
            this.xneg = xneg;
            this.xpos = xpos;
            this.yneg = yneg;
            this.ypos = ypos;
            this.zneg = zneg;
            this.zpos = zpos;
            this.count = 6;
            this.xneg.onload = this.onLoad;
            this.xpos.onload = this.onLoad;
            this.yneg.onload = this.onLoad;
            this.ypos.onload = this.onLoad;
            this.zneg.onload = this.onLoad;
            this.zpos.onload = this.onLoad;
        }
        CubeTexture.prototype.onLoad = function () {
            this.count--;
            if (this.count == 0) {
                this.isReadyToUpdate = true;
            }
        };
        CubeTexture.prototype.setUpTextureData = function () {
            if (_super.prototype.setUpTextureData.call(this)) {
                var gl = CanvasToy.engine.gl;
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.xneg);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.xpos);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.yneg);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.ypos);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.zneg);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.format, this.format, gl.UNSIGNED_BYTE, this.zpos);
            }
            return true;
        };
        return CubeTexture;
    }(CanvasToy.Texture));
    CanvasToy.CubeTexture = CubeTexture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var RenderTargetTexture = (function (_super) {
        __extends(RenderTargetTexture, _super);
        function RenderTargetTexture(scene, camera) {
            _super.call(this);
            this.scene = scene;
            this.camera = camera;
        }
        return RenderTargetTexture;
    }(CanvasToy.Texture));
    CanvasToy.RenderTargetTexture = RenderTargetTexture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Texture2D = (function (_super) {
        __extends(Texture2D, _super);
        function Texture2D(image, format, wrapS, wrapT, magFilter, minFilter) {
            if (format === void 0) { format = CanvasToy.engine.gl.RGB; }
            _super.call(this, image, CanvasToy.engine.gl.TEXTURE_2D, format, wrapS, wrapT, magFilter, minFilter);
            var gl = CanvasToy.engine.gl;
            this.glTexture = gl.createTexture();
        }
        Texture2D.prototype.setUpTextureData = function () {
            if (_super.prototype.setUpTextureData.call(this)) {
                CanvasToy.engine.gl.texImage2D(this.type, 0, this.format, this.format, CanvasToy.engine.gl.UNSIGNED_BYTE, this.image);
            }
            return true;
        };
        return Texture2D;
    }(CanvasToy.Texture));
    CanvasToy.Texture2D = Texture2D;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    (function (ShaderType) {
        ShaderType[ShaderType["VertexShader"] = 0] = "VertexShader";
        ShaderType[ShaderType["FragmentShader"] = 1] = "FragmentShader";
    })(CanvasToy.ShaderType || (CanvasToy.ShaderType = {}));
    var ShaderType = CanvasToy.ShaderType;
    function initWebwebglContext(canvas) {
        var gl = null;
        try {
            gl = canvas.getContext('experimental-webgl');
        }
        catch (e) {
            gl = canvas.getContext('webgl');
        }
        if (!gl) {
            alert("can't init webgl, current browser may not support it.");
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
            if (currentChild.nodeType == 3) {
                theSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }
        var shader;
    }
    CanvasToy.getDomScriptText = getDomScriptText;
    function createSeparatedShader(gl, source, type) {
        var shader;
        var typeInfo;
        if (type == ShaderType.FragmentShader) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            typeInfo = "fragment shader";
        }
        else if (type == ShaderType.VertexShader) {
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
            alert("Unable to initialize the shader program.\n" + gl.getProgramInfoLog(shaderProgram));
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
    function setProgram(camera, fog, material, object) {
    }
})(CanvasToy || (CanvasToy = {}));
