var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Mesh } from "../Mesh";
import { DeferredProcessor } from "./deferred/DeferredProcessor";
import { ForwardProcessor } from "./forward/ForwardProcessor";
import { FrameBuffer } from "./FrameBuffer";
import { Graphics } from "./GraphicsUtils";
import { ShadowPreProcess } from "./ShadowPreProcessor";
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
        this.currentFPS = 60;
        this.duration = 0;
        this.stopped = false;
        this.materials = [];
        this.isDeferred = false;
        this.main = function () {
            if (_this.stopped) {
                return;
            }
            var now = Date.now();
            for (var _i = 0, _a = _this.renderQueue; _i < _a.length; _i++) {
                var renderCommand = _a[_i];
                renderCommand(_this.frameRate);
            }
            var delta = now - _this.duration - _this.startTime;
            _this.currentFPS = 1000 / delta;
            _this.duration = now - _this.startTime;
            requestAnimationFrame(_this.main);
        };
        this.canvas = canvas;
        this.debug = debug;
        this.gl = Graphics.initWebwebglContext(canvas, debug);
        this.ext = {
            depth_texture: this.gl.getExtension("WEBGL_depth_texture"),
            draw_buffer: this.gl.getExtension("WEBGL_draw_buffers"),
            texture_float: this.gl.getExtension("OES_texture_float"),
            texture_half_float: this.gl.getExtension("OES_texture_half_float"),
            texture_float_linear: this.gl.getExtension("OES_texture_float_linear"),
        };
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.startTime = Date.now();
        requestAnimationFrame(this.main);
    }
    Renderer.prototype.waitAsyncResouces = function (asyncRes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, asyncRes.asyncFinished];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Renderer.prototype.stop = function () {
        this.stopped = true;
    };
    Renderer.prototype.start = function () {
        this.stopped = false;
        requestAnimationFrame(this.main);
    };
    Renderer.prototype.createFrameBuffer = function () {
        var fbo = new FrameBuffer(this.gl);
        this.fbos.push(fbo);
        return fbo;
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
                if (object instanceof Mesh) {
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
        if (adaptCanvasAspectRatio === void 0) { adaptCanvasAspectRatio = true; }
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
                if (obj instanceof Mesh) {
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
                if (object instanceof Mesh) {
                    Graphics.copyDataToVertexBuffer(_this.gl, object.geometry);
                }
            }
            var shadowPreProcess = new ShadowPreProcess(_this.gl, _this.ext, scene);
            var processor = _this.isDeferred
                ? new DeferredProcessor(_this.gl, _this.ext, scene, camera)
                : new ForwardProcessor(_this.gl, _this.ext, scene, camera);
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
    return Renderer;
}());
export { Renderer };
//# sourceMappingURL=Renderer.js.map