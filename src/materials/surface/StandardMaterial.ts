import { vec3 } from "gl-matrix";

import { DataType } from "../../DataTypeEnum";
import { define, structure, texture, uniform } from "../../Decorators";
import { Program, shaderPassLib } from "../../shader/Program";
import { ShaderBuilder } from "../../shader/ShaderBuilder";
import { ShaderSource } from "../../shader/shaders";
import { CubeTexture } from "../../textures/CubeTexture";
import { Texture } from "../../textures/Texture";
import { Texture2D } from "../../textures/Texture2D";

import { BlinnPhongMaterial } from "./BlinnPhongMaterial";
import { ISurfaceMaterial } from "./ISurfaceMaterial";

@structure("uMaterial")
export class StandardMaterial extends ISurfaceMaterial {
    public static fromLaggard(
        gl: WebGLRenderingContext,
        blinnPhong: BlinnPhongMaterial,
    ) {
        const standard = new StandardMaterial(gl);
        standard.name = blinnPhong.name;
        standard
            .setAlbedo(blinnPhong.diffuse)
            .setAmbient(blinnPhong.ambient)
            .setAlphaMap(blinnPhong.alphaMap)
            .setBumpMap(blinnPhong.bumpMap)
            .setTransparency(blinnPhong.transparency)
            .setMainTexture(blinnPhong.mainTexture)
            .setCastShadow(blinnPhong.blockShadow)
            .setRecieveShadow(blinnPhong.receiveShadow)
            .setDebugMode(blinnPhong.debugMode)
            .setEnvironmentMap(blinnPhong.environmentMap);
        return standard;
    }

    protected _albedo: vec3 = vec3.fromValues(0.8, 0.8, 0.8);

    protected _metallic: number = 0.8;

    @define("_METALLIC_TEXTURE")
    @texture("uMetallicTexture")
    protected _metallicTexture: Texture2D;

    protected _roughness: number = 0.5;

    @uniform(DataType.vec3)
    public get albedo() {
        return this._albedo;
    }

    @uniform(DataType.float)
    public get metallic() {
        return this._metallic;
    }

    @uniform(DataType.float)
    public get roughness() {
        return this._roughness;
    }

    public get stencilMap() {
        return this.stencilMap;
    }

    public setAlbedo(_albedo: vec3) {
        this._albedo = _albedo;
        return this;
    }

    public setMetallic(_metallic: number) {
        this._metallic = _metallic;
        return this;
    }

    public setRoughness(_roughness: number) {
        this._roughness = _roughness;
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
