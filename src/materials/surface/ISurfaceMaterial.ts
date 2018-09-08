import { vec3 } from "gl-matrix";

import { DataType } from "../../DataTypeEnum";
import {
    define,
    readyRequire,
    structure,
    texture,
    uniform,
} from "../../Decorators";
import { Program, shaderPassLib } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { CubeTexture } from "../../textures/CubeTexture";
import { Texture } from "../../textures/Texture";
import { Texture2D } from "../../textures/Texture2D";
import { IMaterial } from "../Material";

@structure("uMaterial")
export class ISurfaceMaterial extends IMaterial {
    protected _geometryShader: Program;

    @define("_DEBUG")
    protected _debug: boolean = false;

    protected _blockShadow: boolean = true;

    @define("RECEIVE_SHADOW", true)
    protected _receiveShadow: boolean = true;

    protected _ambient: vec3 = vec3.fromValues(0.1, 0.1, 0.1);

    @define("_MAIN_TEXTURE")
    @texture("uMainTexture")
    protected _mainTexture: Texture2D;

    protected _transparency: number = 0;

    // @texture("alphaTexture")
    protected _alphaMap: Texture;

    @readyRequire
    protected _bumpMap: Texture;

    @readyRequire
    protected _displamentMap: Texture;

    @readyRequire
    protected _stencilMap: Texture;

    @uniform(DataType.float, "reflectivity")
    protected _reflectivity: number = 1;

    @define("_ENVIRONMENT_MAP")
    @texture("uCubeTexture")
    protected _environmentMap: CubeTexture;

    public get geometryShader() {
        if (!this._geometryShader) {
            this._geometryShader = new ShaderBuilder()
                .resetShaderLib()
                .addDefinition(ShaderSource.definitions__material_pbs_glsl)
                .addShaderLib(ShaderSource.calculators__packFloat1x32_glsl)
                .setShadingVert(
                    ShaderSource.interploters__deferred__geometry_vert,
                )
                .setShadingFrag(
                    ShaderSource.interploters__deferred__geometry_frag,
                )
                .setExtraRenderParamHolder("mvp", {
                    uniforms: {
                        modelViewProjectionMatrix:
                            shaderPassLib.uniforms.modelViewProjectionMatrix,
                        normalViewMatrix:
                            shaderPassLib.uniforms.normalViewMatrix,
                    },
                })
                .build(this.gl);
            this._geometryShader.extensionStatements.push(
                "#extension GL_EXT_draw_buffers : require",
            );
        }
        return this._geometryShader;
    }

    public get debugMode() {
        return this._debug;
    }

    public get blockShadow() {
        return this._blockShadow;
    }

    public get receiveShadow() {
        return this._receiveShadow;
    }

    public get mainTexture() {
        return this._mainTexture;
    }

    @uniform(DataType.vec3)
    public get ambient() {
        return this._ambient;
    }

    public get transparency() {
        return this._transparency;
    }

    // @texture("alphaTexture")
    public get alphaMap() {
        return this._alphaMap;
    }

    public get bumpMap() {
        return this._bumpMap;
    }

    public get displamentMap() {
        return this._displamentMap;
    }
    public get stencilMap() {
        return this.stencilMap;
    }

    public get environmentMap() {
        return this._environmentMap;
    }

    public setDebugMode(_debug: boolean) {
        this._debug = _debug;
        return this;
    }

    public setCastShadow(_castShadow: boolean) {
        this._blockShadow = _castShadow;
        return this;
    }

    public setRecieveShadow(_receiveShadow: boolean) {
        this._receiveShadow = _receiveShadow;
        return this;
    }

    public setMainTexture(_texture: Texture) {
        this._mainTexture = _texture;
        return this;
    }

    public setAmbient(_ambient: vec3) {
        this._ambient = _ambient;
        return this;
    }

    public setTransparency(_transparency: number) {
        console.assert(_transparency >= 0 && _transparency <= 1);
        this._transparency = _transparency;
        return this;
    }

    // @texture("alphaTexture")
    public setAlphaMap(_alphaMap) {
        this._alphaMap = _alphaMap;
        return this;
    }

    public setBumpMap(_bumpMap: Texture) {
        this._bumpMap = _bumpMap;
        return this;
    }

    public setDisplamentMap(_displamentMap: Texture) {
        this._displamentMap = _displamentMap;
        return this;
    }
    public setStencilMap(_stencilMap: Texture) {
        this._stencilMap = _stencilMap;
        return this;
    }

    public setReflectivity(_reflectivity: number) {
        this._reflectivity = _reflectivity;
        return this;
    }

    public setEnvironmentMap(_environmentMap: CubeTexture) {
        this._environmentMap = _environmentMap;
        return this;
    }

    protected initShader(gl: WebGLRenderingContext) {
        return new ShaderBuilder()
            .addDefinition(ShaderSource.definitions__material_pbs_glsl)
            .setLightModel(ShaderSource.light_model__pbs_ggx_glsl)
            .setExtraRenderParamHolder("mvp", {
                uniforms: {
                    modelViewProjectionMatrix:
                        shaderPassLib.uniforms.modelViewProjectionMatrix,
                },
            })
            .setExtraRenderParamHolder("pcss", {
                defines: shaderPassLib.defines,
            })
            .build(gl);
    }
}
