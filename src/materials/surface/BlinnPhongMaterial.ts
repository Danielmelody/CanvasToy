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
import { ISurfaceMaterial } from "./ISurfaceMaterial";

@structure("uMaterial")
export class BlinnPhongMaterial extends ISurfaceMaterial {
    protected _diffuse: vec3 = vec3.fromValues(0.8, 0.8, 0.8);

    protected _specular: vec3 = vec3.fromValues(0.3, 0.3, 0.3);

    protected _specularExponent: number = 64;

    // @texture("specularTexture")
    protected _specularMap: Texture;

    @uniform(DataType.vec3)
    public get diffuse() {return this._diffuse; }

    @uniform(DataType.vec3)
    public get specular() {return this._specular; }

    @uniform(DataType.float)
    public get specularExponent() {
        return this._specularExponent;
    }

    public setDiffuse(_diffuse: vec3) {
        this._diffuse = _diffuse;
        return this;
    }

    public setSpecular(_specular: vec3) {
        this._specular = _specular;
        return this;
    }

    public setSpecularExponent(_specularExponent: number) {
        this._specularExponent = _specularExponent;
        return this;
    }

    protected initShader(gl: WebGLRenderingContext) {
        return new ShaderBuilder()
            .addDefinition(ShaderSource.definitions__material_blinnphong_glsl)
            .setLightModel(ShaderSource.light_model__blinn_phong_glsl)
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
