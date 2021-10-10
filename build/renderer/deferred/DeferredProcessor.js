import { mat4 } from "gl-matrix";
import { DataType } from "../../DataTypeEnum";
import { RectGeometry } from "../../geometries/RectGeometry";
import { StandardMaterial } from "../../materials/surface/StandardMaterial";
import { Mesh } from "../../Mesh";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { DataTexture } from "../../textures/DataTexture";
import { Texture } from "../../textures/Texture";
import { Attachment, FrameBuffer } from "../FrameBuffer";
import { Graphics } from "../GraphicsUtils";
var DeferredProcessor = (function () {
    function DeferredProcessor(gl, ext, scene, camera) {
        this.tilePixelSize = 32;
        this.tileLightIndex = [];
        this.linearLightIndex = [];
        this.gl = gl;
        this.ext = ext;
        this.gBuffer = new FrameBuffer(gl);
        this.horizontalTileNum = Math.floor(this.gl.canvas.width / this.tilePixelSize);
        this.verticalTileNum = Math.floor(this.gl.canvas.height / this.tilePixelSize);
        this.tileCount = this.horizontalTileNum * this.verticalTileNum;
        this.initGeometryProcess(scene);
        this.initTiledPass(scene);
        scene.programSetUp = true;
    }
    DeferredProcessor.prototype.process = function (scene, camera, materials) {
        Graphics.logIfFrameBufferInvalid(this.gl, this.gBuffer.glFramebuffer);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.gBuffer.glFramebuffer);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.disable(this.gl.BLEND);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
            var object = _a[_i];
            if (object instanceof Mesh) {
                var mesh = object;
                var standardMaterials = mesh.materials.filter(function (mat) { return mat instanceof StandardMaterial; });
                if (standardMaterials.length > 0) {
                    var material = standardMaterials[0];
                    material.geometryShader.pass({
                        mesh: mesh,
                        material: material,
                        scene: scene,
                        camera: camera,
                    });
                }
            }
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.depthFunc(this.gl.EQUAL);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
        this.tileLightPass(scene, camera, scene.pointLights, this.pointLightShader);
    };
    DeferredProcessor.prototype.initGeometryProcess = function (scene) {
        this.gBuffer.attachments.color.disable();
        this.gBuffer.attachments.depth
            .asTargetTexture(new Texture(this.gl), this.gl.TEXTURE_2D)
            .targetTexture.setType(this.gl.UNSIGNED_SHORT)
            .setFormat(this.gl.DEPTH_COMPONENT)
            .apply(this.gl);
        this.gBuffer.extras.push(new Attachment(this.gBuffer, function (ext) { return ext.COLOR_ATTACHMENT0_WEBGL; }).asTargetTexture(new Texture(this.gl), this.gl.TEXTURE_2D), new Attachment(this.gBuffer, function (ext) { return ext.COLOR_ATTACHMENT1_WEBGL; }).asTargetTexture(new Texture(this.gl), this.gl.TEXTURE_2D), new Attachment(this.gBuffer, function (ext) { return ext.COLOR_ATTACHMENT2_WEBGL; }).asTargetTexture(new Texture(this.gl), this.gl.TEXTURE_2D));
        this.gBuffer.attach(this.gl, this.ext.draw_buffer);
    };
    DeferredProcessor.prototype.tileLightPass = function (scene, camera, lights, lightShader) {
        var _a, _b;
        var lightInfo = [[], []];
        for (var _i = 0, lights_1 = lights; _i < lights_1.length; _i++) {
            var light = lights_1[_i];
            (_a = lightInfo[0]).push.apply(_a, light.getDeferredInfo(0, camera));
            (_b = lightInfo[1]).push.apply(_b, light.getDeferredInfo(1, camera));
        }
        this.lightColorIdensityMap.resetData(this.gl, new Float32Array(lightInfo[0]), lightInfo[0].length / 4, 1);
        this.lightPositionRadiusMap.resetData(this.gl, new Float32Array(lightInfo[1]), lightInfo[1].length / 4, 1);
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
        for (var _c = 0, _d = this.tileLightIndex; _c < _d.length; _c++) {
            var indices = _d[_c];
            lightOffsetCount.push(offset + 0.5);
            lightOffsetCount.push(indices.length);
            offset += indices.length;
            for (var _e = 0, indices_1 = indices; _e < indices_1.length; _e++) {
                var index = indices_1[_e];
                this.linearLightIndex.push((index + 0.5) / scene.pointLights.length);
            }
        }
        this.tileLightIndexMap.resetData(this.gl, new Float32Array(this.linearLightIndex), this.linearLightIndex.length, 1);
        this.tileLightOffsetCountMap.resetData(this.gl, new Float32Array(lightOffsetCount), this.horizontalTileNum, this.verticalTileNum);
        lightShader.pass({ mesh: this.tile, camera: camera });
    };
    DeferredProcessor.prototype.initTiledPass = function (scene) {
        var _this = this;
        if (this.tile === undefined) {
            this.tile = new Mesh(new RectGeometry(this.gl).build(), []);
        }
        for (var i = 0; i < this.horizontalTileNum; ++i) {
            for (var j = 0; j < this.verticalTileNum; ++j) {
                this.tileLightIndex.push([]);
            }
        }
        this.tileLightIndexMap = new DataTexture(this.gl, new Float32Array([]))
            .setFormat(this.gl.LUMINANCE)
            .setType(this.gl.FLOAT);
        this.tileLightOffsetCountMap = new DataTexture(this.gl, new Float32Array([]), this.horizontalTileNum, this.verticalTileNum)
            .setFormat(this.gl.LUMINANCE_ALPHA)
            .setType(this.gl.FLOAT);
        this.lightColorIdensityMap = new DataTexture(this.gl, new Float32Array([]))
            .setType(this.gl.FLOAT)
            .setFormat(this.gl.RGBA);
        this.lightPositionRadiusMap = new DataTexture(this.gl, new Float32Array([]))
            .setType(this.gl.FLOAT)
            .setFormat(this.gl.RGBA);
        this.pointLightShader = new ShaderBuilder()
            .resetShaderLib()
            .addDefinition(ShaderSource.definitions__material_pbs_glsl)
            .addDefinition(ShaderSource.definitions__light_glsl)
            .setLightModel(ShaderSource.light_model__pbs_ggx_glsl)
            .addShaderLibFrag(ShaderSource.calculators__types_glsl)
            .addShaderLib(ShaderSource.calculators__unpackFloat1x32_glsl)
            .setShadingVert(ShaderSource.interploters__deferred__tiledLight_vert)
            .setShadingFrag(ShaderSource.interploters__deferred__tiledLightPoint_frag)
            .setExtraRenderParamHolder("lightInfo", {
            uniforms: {
                inverseProjection: {
                    type: DataType.mat4,
                    updator: function (_a) {
                        var camera = _a.camera;
                        return mat4.invert(mat4.create(), camera.projectionMatrix);
                    },
                },
                uLightListLengthSqrt: {
                    type: DataType.float,
                    updator: function () { return _this.linearLightIndex.length; },
                },
                uHorizontalTileNum: {
                    type: DataType.float,
                    updator: function () { return _this.horizontalTileNum; },
                },
                uVerticalTileNum: {
                    type: DataType.float,
                    updator: function () { return _this.verticalTileNum; },
                },
                uTotalLightNum: {
                    type: DataType.float,
                    updator: function () { return scene.pointLights.length; },
                },
            },
            textures: {
                normalRoughnessTex: {
                    source: this.gBuffer.extras[0].targetTexture,
                },
                albedoMetallicTex: {
                    source: this.gBuffer.extras[1].targetTexture,
                },
                depthTex: { source: this.gBuffer.extras[2].targetTexture },
                uLightOffsetCount: { source: this.tileLightOffsetCountMap },
                uLightPositionRadius: {
                    source: this.lightPositionRadiusMap,
                },
                uLightColorIdensity: { source: this.lightColorIdensityMap },
                uLightIndex: { source: this.tileLightIndexMap },
            },
        })
            .build(this.gl);
        Graphics.copyDataToVertexBuffer(this.gl, this.tile.geometry);
        this.pointLightShader.make();
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
export { DeferredProcessor };
//# sourceMappingURL=DeferredProcessor.js.map