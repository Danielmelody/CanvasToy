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
            this.vertices = [];
            this.indices = [];
        }
        return Geometry;
    }());
    CanvasToy.Geometry = Geometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Texture = (function () {
        function Texture() {
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
            this.map = null;
            this.color = null;
            this.ambient = CanvasToy.vec3.fromValues(0.1, 0.1, 0.1);
            this.ambientMap = null;
            this.diffuse = CanvasToy.vec3.fromValues(0.8, 0.8, 0.8);
            this.diffuseMap = null;
            this.specular = CanvasToy.vec3.fromValues(1, 1, 1);
            this.specularMap = null;
            this.opacity = CanvasToy.vec3.fromValues(0, 0, 0);
            this.opacityMap = null;
            this.shadingMode = ShadingMode.smoothShading;
            this.bumpMap = null;
            this.normalMap = null;
            this.reflactivity = 1;
            this.color = CanvasToy.colors.white;
        }
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
            var mvUniform = CanvasToy.engine.getUniformLocation("modelViewMatrix");
            CanvasToy.engine.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.modelViewMatrix));
            var pMUniform = CanvasToy.engine.getUniformLocation("projectionMatrix");
            CanvasToy.engine.gl.uniformMatrix4fv(pMUniform, false, new Float32Array(camera.projectionMatrix));
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
            this.geometry = geometry;
            this.material = material;
            this.colors = [];
            this.verticesBuffer = new CanvasToy.Buffer({
                index: CanvasToy.engine.getAttribLocation("position"),
                data: CanvasToy.engine.gl.createBuffer()
            });
            CanvasToy.engine.gl.enableVertexAttribArray(this.verticesBuffer.shaderIndex);
            CanvasToy.engine.gl.bindBuffer(CanvasToy.engine.gl.ARRAY_BUFFER, this.verticesBuffer.data);
            CanvasToy.engine.gl.bufferData(CanvasToy.engine.gl.ARRAY_BUFFER, new Float32Array(this.geometry.vertices), CanvasToy.engine.gl.STATIC_DRAW);
            var size = geometry.vertices.length / 3;
            console.log('size:' + size);
            for (var i = 0; i < size / 2; ++i) {
                this.colors = this.colors.concat([1, 1, 1, 1]);
            }
            for (var i = size / 2; i < size; ++i) {
                this.colors = this.colors.concat([1, 1, 0, 1]);
            }
            console.log(this.geometry.vertices.length);
            console.log(this.colors.length);
            this.colorBuffer = new CanvasToy.Buffer({
                index: CanvasToy.engine.getAttribLocation("aColor"),
                data: CanvasToy.engine.gl.createBuffer()
            });
            CanvasToy.engine.gl.enableVertexAttribArray(this.colorBuffer.shaderIndex);
            CanvasToy.engine.gl.bindBuffer(CanvasToy.engine.gl.ARRAY_BUFFER, this.colorBuffer.data);
            CanvasToy.engine.gl.bufferData(CanvasToy.engine.gl.ARRAY_BUFFER, new Float32Array(this.colors), CanvasToy.engine.gl.STATIC_DRAW);
            this.indicesBuffer = new CanvasToy.Buffer({
                index: -1,
                data: CanvasToy.engine.gl.createBuffer()
            });
            CanvasToy.engine.gl.bindBuffer(CanvasToy.engine.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer.data);
            CanvasToy.engine.gl.bufferData(CanvasToy.engine.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometry.indices), CanvasToy.engine.gl.STATIC_DRAW);
        }
        Mesh.prototype.draw = function (camera) {
            _super.prototype.draw.call(this, camera);
            CanvasToy.engine.gl.bindBuffer(CanvasToy.engine.gl.ARRAY_BUFFER, this.verticesBuffer.data);
            CanvasToy.engine.gl.vertexAttribPointer(this.verticesBuffer.shaderIndex, 3, CanvasToy.engine.gl.FLOAT, false, 0, 0);
            CanvasToy.engine.gl.bindBuffer(CanvasToy.engine.gl.ARRAY_BUFFER, this.colorBuffer.data);
            CanvasToy.engine.gl.vertexAttribPointer(this.colorBuffer.shaderIndex, 4, CanvasToy.engine.gl.FLOAT, false, 0, 0);
            CanvasToy.engine.gl.bindBuffer(CanvasToy.engine.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer.data);
            console.log("index num:" + this.geometry.indices.length);
            CanvasToy.engine.gl.drawElements(CanvasToy.engine.gl.TRIANGLE_STRIP, this.geometry.indices.length, CanvasToy.engine.gl.UNSIGNED_SHORT, 0);
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
    function createShader(gl, source, type) {
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
    CanvasToy.createShader = createShader;
    function getShaderProgram(gl, vertexShader, fragmentShader) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        return shaderProgram;
    }
    CanvasToy.getShaderProgram = getShaderProgram;
    ;
    function setProgram(camera, fog, material, object) {
    }
    function createVertexBuffer(vertices) {
        var vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        if (vertices instanceof Float32Array) {
            this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        }
        else {
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        }
        return vbo;
    }
    CanvasToy.createVertexBuffer = createVertexBuffer;
    function createDynamicVertexBuffer(size) {
        var vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, size, this.gl.DYNAMIC_DRAW);
        return vbo;
    }
    CanvasToy.createDynamicVertexBuffer = createDynamicVertexBuffer;
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
        function CubeGeometry(vertices) {
            _super.call(this);
            if (vertices && vertices.length < 8) {
                return null;
            }
            this.vertices = vertices || [
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
    var Buffer = (function () {
        function Buffer(options) {
            this.shaderIndex = 0;
            this.data = null;
            this.shaderIndex = options.index;
            this.data = options.data;
        }
        return Buffer;
    }());
    CanvasToy.Buffer = Buffer;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    function setCanvas(canvas) {
        CanvasToy.engine = new Renderer(canvas);
    }
    CanvasToy.setCanvas = setCanvas;
    var Renderer = (function () {
        function Renderer(canvas) {
            this.canvasDom = canvas || document.createElement('canvas');
            this.programs = [];
            this.gl = CanvasToy.initWebwebglContext(canvas);
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            var commonVertShader = CanvasToy.createShader(this.gl, CanvasToy.common_vert, CanvasToy.ShaderType.VertexShader);
            var commonFragShader = CanvasToy.createShader(this.gl, CanvasToy.common_frag, CanvasToy.ShaderType.FragmentShader);
            this.currentProgram = CanvasToy.getShaderProgram(this.gl, commonVertShader, commonFragShader);
            this.programs.push(this.currentProgram);
            this.gl.useProgram(this.currentProgram);
        }
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
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
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
    CanvasToy.common_frag = "//#gljs varname:'common_frag'\nprecision mediump float;\nvarying vec4 vColor;\nvoid main (void){\n    gl_FragColor = vColor;\n}\n";
    CanvasToy.common_vert = "//#gljs varname:'common_vert'\nprecision mediump float;\n\nattribute vec3 position;\nattribute vec4 aColor;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nvarying vec4 vColor;\n\nvoid main (){\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    vColor = aColor;\n}\n";
})(CanvasToy || (CanvasToy = {}));
