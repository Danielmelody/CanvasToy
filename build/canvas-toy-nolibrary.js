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
        function Geometry() {
            this.vertices = [];
        }
        Geometry.prototype.initBuffers = function (gl) {
            this.verticesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        };
        return Geometry;
    }());
    CanvasToy.Geometry = Geometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Material = (function () {
        function Material() {
        }
        return Material;
    }());
    CanvasToy.Material = Material;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Object3d = (function () {
        function Object3d(gl) {
            this.gl = gl;
            this.modelViewMatrix = CanvasToy.mat4.create();
            this.matrix = CanvasToy.mat4.create();
            this.position = CanvasToy.vec3.create();
            this.size = CanvasToy.vec3.create();
        }
        Object3d.prototype.start = function () {
        };
        Object3d.prototype.update = function () {
        };
        Object3d.prototype.translate = function () {
        };
        Object3d.prototype.translateTo = function (deltaX, deltaY, deltaZ) {
            this.modelViewMatrix = CanvasToy.mat4.translate(CanvasToy.mat4.create(), this.modelViewMatrix, CanvasToy.vec3.fromValues(deltaX, deltaY, deltaZ));
        };
        Object3d.prototype.scale = function () {
        };
        return Object3d;
    }());
    CanvasToy.Object3d = Object3d;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var RenderNode = (function (_super) {
        __extends(RenderNode, _super);
        function RenderNode() {
            _super.call(this);
            this.parent = null;
            this.children = [];
            this.relativeMatrix = CanvasToy.mat4.create();
        }
        RenderNode.prototype.addChild = function (child) {
            this.children.push(child);
            child.parent = this;
        };
        RenderNode.prototype.compuseMatrixs = function () {
            var parentMatrix = this.parent.matrix;
            this.modelViewMatrix = CanvasToy.mat4.mul(CanvasToy.mat4.create(), this.relativeMatrix, parentMatrix);
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.compuseMatrixs();
            }
        };
        RenderNode.prototype.draw = function (camera) {
            this.matrix = CanvasToy.mat4.mul(CanvasToy.mat4.create(), camera.projectionMatrix, this.modelViewMatrix);
        };
        return RenderNode;
    }(CanvasToy.Object3d));
    CanvasToy.RenderNode = RenderNode;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh() {
            _super.call(this);
        }
        Mesh.prototype.draw = function (gl, camera) {
            _super.prototype.draw.call(this, camera);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.vertices), gl.STATIC_DRAW);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.geometry.vertices.length);
        };
        return Mesh;
    }(CanvasToy.RenderNode));
    CanvasToy.Mesh = Mesh;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Renderer = (function () {
        function Renderer(canvas) {
            this.canvasDom = canvas || document.createElement('canvas');
            this.programs = [];
            this.gl = CanvasToy.initWebwebglContext(canvas);
            this.initMatrix();
            var vertexShader = CanvasToy.compileShader(this.gl, 'shader-vs');
            var fragmentShader = CanvasToy.compileShader(this.gl, 'shader-fs');
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }
        Renderer.prototype.initMatrix = function () {
            CanvasToy.glMatrix.setMatrixArrayType(Float32Array);
        };
        return Renderer;
    }());
    CanvasToy.Renderer = Renderer;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.call(this);
        }
        Scene.prototype.draw = function (gl, Camera) {
            _super.prototype.draw.call(this, gl, Camera);
        };
        Scene.prototype.addChild = function (child) {
            _super.prototype.addChild.call(this, child);
            this.renderObjects.push(child);
        };
        return Scene;
    }(CanvasToy.RenderNode));
    CanvasToy.Scene = Scene;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
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
    function compileShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
        var theSource = "";
        var currentChild = shaderScript.firstChild;
        while (currentChild) {
            if (currentChild.nodeType == 3) {
                theSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }
        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        else {
            alert(id + ": unknown shader type");
            return null;
        }
        gl.shaderSource(shader, theSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    CanvasToy.compileShader = compileShader;
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
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera(gl) {
            _super.call(this, gl);
            this.projectionMatrix = CanvasToy.mat4.create();
        }
        return Camera;
    }(CanvasToy.Object3d));
    CanvasToy.Camera = Camera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var CubeGeometry = (function (_super) {
        __extends(CubeGeometry, _super);
        function CubeGeometry() {
            _super.call(this);
        }
        return CubeGeometry;
    }(CanvasToy.Geometry));
    CanvasToy.CubeGeometry = CubeGeometry;
})(CanvasToy || (CanvasToy = {}));
