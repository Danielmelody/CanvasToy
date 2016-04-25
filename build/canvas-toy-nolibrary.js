var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CanvasToy;
(function (CanvasToy) {
    var version = 2;
})(CanvasToy || (CanvasToy = {}));
CanvasToy.glMatrix = glMatrix;
CanvasToy.vec2 = vec2;
CanvasToy.vec3 = vec3;
CanvasToy.vec4 = vec4;
CanvasToy.mat2 = mat2;
CanvasToy.mat2d = mat2d;
CanvasToy.mat3 = mat3;
CanvasToy.mat4 = mat4;
CanvasToy.quat = quat;
var CanvasToy;
(function (CanvasToy) {
    var Geometry = (function () {
        function Geometry(size) {
            this.positions = [];
            this.uvs = [];
            this.normals = [];
            this.indices = [];
        }
        return Geometry;
    }());
    CanvasToy.Geometry = Geometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Texture = (function () {
        function Texture(path, customOnLoad) {
            var _this = this;
            this.active = false;
            this.image = new Image();
            var gl = CanvasToy.engine.gl;
            this.glTexture = gl.createTexture();
            CanvasToy.engine.preloadRes.push(this);
            this.image.src = path;
            this.image.onload = function () {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, _this.glTexture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _this.image);
                _this.active = true;
                CanvasToy.engine.preloadRes.splice(CanvasToy.engine.preloadRes.indexOf(_this, 1));
                if (customOnLoad) {
                    customOnLoad();
                }
                console.log("texture loaded");
            };
        }
        return Texture;
    }());
    CanvasToy.Texture = Texture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.colors = {
        white: CanvasToy.vec4.fromValues(1, 1, 1, 1),
        black: CanvasToy.vec4.fromValues(0, 0, 0, 1),
        gray: CanvasToy.vec4.fromValues(0.5, 0.5, 0.5, 1),
        red: CanvasToy.vec4.fromValues(1, 0, 0, 1)
    };
    (function (ShadingMode) {
        ShadingMode[ShadingMode["flatShading"] = 0] = "flatShading";
        ShadingMode[ShadingMode["smoothShading"] = 1] = "smoothShading";
    })(CanvasToy.ShadingMode || (CanvasToy.ShadingMode = {}));
    var ShadingMode = CanvasToy.ShadingMode;
    var Material = (function () {
        function Material() {
            this.attributes = {};
            this.uniforms = {};
            this.samplers = {};
            this.ambient = CanvasToy.vec3.fromValues(0.1, 0.1, 0.1);
            this.diffuse = CanvasToy.vec3.fromValues(0.8, 0.8, 0.8);
            this.specular = CanvasToy.vec3.fromValues(1, 1, 1);
            this.opacity = CanvasToy.vec3.fromValues(0, 0, 0);
            this.shadingMode = ShadingMode.smoothShading;
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
    var Object3d = (function () {
        function Object3d() {
            this.updateEvents = [];
            this.startEvents = [];
            this.modelViewMatrix = CanvasToy.mat4.create();
            this.translate(0, 0, 0);
            this.matrix = CanvasToy.mat4.create();
            this.position = CanvasToy.vec3.create();
            this.size = CanvasToy.vec3.create();
        }
        Object3d.prototype.registerUpdate = function (updateFunction) {
            this.updateEvents.push(updateFunction);
        };
        Object3d.prototype.registerStart = function (updateFunction) {
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
        Object3d.prototype.draw = function (camera) { };
        Object3d.prototype.translate = function (deltaX, deltaY, deltaZ) {
            this.modelViewMatrix = CanvasToy.mat4.translate(CanvasToy.mat4.create(), this.modelViewMatrix, CanvasToy.vec3.fromValues(deltaX, deltaY, deltaZ));
        };
        Object3d.prototype.translateTo = function (deltaX, deltaY, deltaZ) { };
        Object3d.prototype.rotateX = function (angle) {
            this.modelViewMatrix = CanvasToy.mat4.rotateX(CanvasToy.mat4.create(), this.modelViewMatrix, angle);
        };
        Object3d.prototype.rotateY = function (angle) {
            this.modelViewMatrix = CanvasToy.mat4.rotateY(CanvasToy.mat4.create(), this.modelViewMatrix, angle);
        };
        Object3d.prototype.rotateZ = function (angle) {
            this.modelViewMatrix = CanvasToy.mat4.rotateZ(CanvasToy.mat4.create(), this.modelViewMatrix, angle);
        };
        Object3d.prototype.scale = function (rateX, rateY, rateZ) {
            if (rateY == undefined) {
                var rateY = rateX;
            }
            if (rateZ == undefined) {
                var rateZ = rateX;
            }
            this.modelViewMatrix = CanvasToy.mat4.scale(CanvasToy.mat4.create(), this.modelViewMatrix, CanvasToy.vec3.fromValues(rateX, rateY, rateZ));
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
            _super.call(this);
            this.parent = null;
            this.children = [];
            this.relativeMatrix = CanvasToy.mat4.create();
        }
        Node.prototype.addChild = function (child) {
            this.children.push(child);
            child.parent = this;
        };
        Node.prototype.compuseMatrixs = function () {
            var parentMatrix = this.parent.matrix;
            this.modelViewMatrix = CanvasToy.mat4.mul(CanvasToy.mat4.create(), this.relativeMatrix, parentMatrix);
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.compuseMatrixs();
            }
        };
        Node.prototype.draw = function (camera) {
            CanvasToy.engine.gl.uniformMatrix4fv(this.mvUniform, false, new Float32Array(this.modelViewMatrix));
            CanvasToy.engine.gl.uniformMatrix4fv(this.pMUniform, false, new Float32Array(camera.projectionMatrix));
        };
        return Node;
    }(CanvasToy.Object3d));
    CanvasToy.Node = Node;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, material) {
            _super.call(this);
            this.vertexBuffers = {};
            this.material = material;
            this.geometry = geometry;
            CanvasToy.engine.makeProgram(geometry, material, { precision: 'mediump' });
            this.initUniforms();
            this.initVerticesData();
            this.updateVerticesData();
        }
        Mesh.prototype.initVerticesData = function () {
            var gl = CanvasToy.engine.gl;
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometry.indices), gl.STATIC_DRAW);
            this.addAttribute(new CanvasToy.VertexBuffer("position", 3, gl.FLOAT))
                .data = this.geometry.positions;
            this.addAttribute(new CanvasToy.VertexBuffer("aTextureCoord", 2, gl.FLOAT))
                .data = this.geometry.uvs;
        };
        Mesh.prototype.initUniforms = function () {
            this.mvUniform = CanvasToy.engine.getUniformLocation("modelViewMatrix");
            this.pMUniform = CanvasToy.engine.getUniformLocation("projectionMatrix");
        };
        Mesh.prototype.addAttribute = function (newVertexBuffer) {
            newVertexBuffer.index = CanvasToy.engine.gl.getAttribLocation(CanvasToy.engine.currentProgram, newVertexBuffer.name);
            this.vertexBuffers[newVertexBuffer.name] = newVertexBuffer;
            return newVertexBuffer;
        };
        Mesh.prototype.updateVerticesData = function () {
            var gl = CanvasToy.engine.gl;
            for (var name_1 in this.vertexBuffers) {
                console.log(name_1);
                gl.enableVertexAttribArray(this.vertexBuffers[name_1].index);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[name_1].buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexBuffers[name_1].data), CanvasToy.engine.gl.STATIC_DRAW);
            }
        };
        ;
        Mesh.prototype.draw = function (camera) {
            _super.prototype.draw.call(this, camera);
            var gl = CanvasToy.engine.gl;
            for (var name_2 in this.vertexBuffers) {
                gl.bindBuffer(CanvasToy.engine.gl.ARRAY_BUFFER, this.vertexBuffers[name_2].buffer);
                CanvasToy.engine.gl.vertexAttribPointer(this.vertexBuffers[name_2].index, this.vertexBuffers[name_2].size, this.vertexBuffers[name_2].type, false, 0, 0);
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
        };
        return Mesh;
    }(CanvasToy.Node));
    CanvasToy.Mesh = Mesh;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Scene = (function () {
        function Scene() {
            var _this = this;
            this.objects = [];
            this.clearColor = [0, 0, 0, 0];
            window.setInterval(function () { return _this.update(1000 / 60); }, 1000 / 60);
        }
        Scene.prototype.update = function (dt) {
            for (var _i = 0, _a = this.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                object.update(dt);
            }
        };
        Scene.prototype.addObject = function (object) {
            this.objects.push(object);
        };
        return Scene;
    }());
    CanvasToy.Scene = Scene;
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
        if (type == ShaderType.FragmentShader) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        else if (type == ShaderType.VertexShader) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    function linkShader(gl, vertexShader, fragmentShader) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
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
var CanvasToy;
(function (CanvasToy) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            _super.call(this);
            this.projectionMatrix = CanvasToy.mat4.create();
            console.log(this.projectionMatrix);
            console.log("init camera");
        }
        return Camera;
    }(CanvasToy.Object3d));
    CanvasToy.Camera = Camera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var OrthoCamera = (function (_super) {
        __extends(OrthoCamera, _super);
        function OrthoCamera(options) {
            _super.call(this);
            CanvasToy.mat4.ortho(this.projectionMatrix, -1.0, 1.0, -1.0, 1.0, 0.1, 100);
        }
        return OrthoCamera;
    }(CanvasToy.Camera));
    CanvasToy.OrthoCamera = OrthoCamera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(options) {
            _super.call(this);
            this.projectionMatrix = CanvasToy.mat4.perspective(this.projectionMatrix, 45, 640 / 480, 0.1, 100);
        }
        return PerspectiveCamera;
    }(CanvasToy.Camera));
    CanvasToy.PerspectiveCamera = PerspectiveCamera;
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
            this.indices = [
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
    var RectGeomotry = (function (_super) {
        __extends(RectGeomotry, _super);
        function RectGeomotry() {
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
            this.indices = [
                0, 1, 2,
                2, 1, 3
            ];
        }
        return RectGeomotry;
    }(CanvasToy.Geometry));
    CanvasToy.RectGeomotry = RectGeomotry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light() {
            _super.call(this);
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
        return PointLight;
    }(CanvasToy.Light));
    CanvasToy.PointLight = PointLight;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var ModelLoader = (function () {
        function ModelLoader() {
        }
        ModelLoader.loadObj = function (url, onload) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    console.log("load succeeded!");
                    if (onload) {
                        onload();
                    }
                }
            };
            request.open('GET', url);
            request.send();
        };
        return ModelLoader;
    }());
    CanvasToy.ModelLoader = ModelLoader;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var PhongMaterial = (function (_super) {
        __extends(PhongMaterial, _super);
        function PhongMaterial(paramter) {
            _super.call(this);
            if (paramter.texture != undefined && paramter.color != undefined) {
                console.warn("passed both color and texture to Material, color would be ignored");
            }
            else if (paramter.texture != undefined) {
                this.map = paramter.texture;
                this.addAttribute('aTextureCoord', this.map);
            }
            else if (paramter.color != undefined) {
                this.color = paramter.color;
                this.addUniform('uColor', this.color);
            }
        }
        return PhongMaterial;
    }(CanvasToy.Material));
    CanvasToy.PhongMaterial = PhongMaterial;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    function setCanvas(canvas) {
        CanvasToy.engine = new Renderer(canvas);
    }
    CanvasToy.setCanvas = setCanvas;
    var Renderer = (function () {
        function Renderer(canvas) {
            this.preloadRes = [];
            this.canvasDom = canvas || document.createElement('canvas');
            this.programs = [];
            this.gl = CanvasToy.initWebwebglContext(canvas);
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }
        Renderer.prototype.makeProgram = function (geometry, material, parameters) {
            var prefixVertex = [
                'precision ' + parameters.precision + ' float;',
                'precision ' + parameters.precision + ' int;',
                material.map ? '#define USE_TEXTURE' : '',
                material.color ? '#define USE_COLOR' : ''
            ].join("\n");
            var prefixFragment = [
                'precision ' + parameters.precision + ' float;',
                'precision ' + parameters.precision + ' int;',
                material.map ? '#define USE_TEXTURE' : '',
                material.color ? '#define USE_COLOR' : ''
            ].join("\n");
            this.currentProgram = CanvasToy.createEntileShader(this.gl, prefixVertex + CanvasToy.basic_vert, prefixFragment + CanvasToy.basic_frag);
            this.programs.push(this.currentProgram);
            this.gl.useProgram(this.currentProgram);
        };
        Renderer.prototype.startRender = function (scene, camera, duration) {
            var _this = this;
            this.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
            setInterval(function () { return _this.renderImmediately(scene, camera); }, duration);
        };
        Renderer.prototype.getUniformLocation = function (name) {
            if (this.gl == undefined || this.gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = this.gl.getUniformLocation(this.currentProgram, name);
            if (result == null) {
                console.error("uniform " + name + " not found!");
                return null;
            }
            return result;
        };
        Renderer.prototype.getAttribLocation = function (name) {
            if (this.gl == undefined || this.gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = this.gl.getAttribLocation(this.currentProgram, name);
            if (result == null) {
                console.error("attribute " + name + " not found!");
                return null;
            }
            return result;
        };
        Renderer.prototype.renderImmediately = function (scene, camera) {
            if (this.preloadRes.length > 0) {
                return;
            }
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var renderObject = _a[_i];
                renderObject.draw(camera);
            }
        };
        Renderer.prototype.initMatrix = function () {
            CanvasToy.glMatrix.setMatrixArrayType(Float32Array);
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
    CanvasToy.basic_frag = "#ifdef USE_COLOR\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_TEXTURE\nvarying vec2 vTextureCoord;\nuniform sampler2D uTextureSampler;\nvec4 textureColor;\n#endif\n\n#ifdef OPEN_LIGHT\nvarying vec3 vNormal;\n#endif\n\nvoid main() {\n#ifdef USE_COLOR\n    gl_FragColor = vColor;\n#endif\n\n#ifdef USE_TEXTURE\n    gl_FragColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n\n}\n";
    CanvasToy.basic_vert = "attribute vec3 position;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec4 cameraPosition;\n\n#ifdef USE_COLOR\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_TEXTURE\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n#endif\n\n#ifdef OPEN_LIGHT\nattribute vec3 aNormal;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n#ifdef USE_COLOR\n    vColor = aColor;\n#endif\n\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n\n}\n";
})(CanvasToy || (CanvasToy = {}));
