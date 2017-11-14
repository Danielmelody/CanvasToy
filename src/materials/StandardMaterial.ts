import { mat4, vec3 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { DataType } from "../DataTypeEnum";
import { define, ifdefine, readyRequire, texture, uniform } from "../Decorators";
import { Mesh } from "../Mesh";
import { Graphics } from "../renderer/GraphicsUtils";
import { Program, shaderPassLib } from "../shader/Program";
import { ShaderBuilder } from "../shader/ShaderBuilder";
import { ShaderSource } from "../shader/shaders";
import { CubeTexture } from "../textures/CubeTexture";
import { Texture } from "../textures/Texture";
import { Material } from "./Material";

export interface IStandardMaterial {
    mainTexture?: Texture;
    ambient?: vec3;
    diffuse?: vec3;
    specular?: vec3;
    program?: Program;
}

export class StandardMaterial extends Material {

    @define("_DEBUG")
    public debug: boolean = false;

    @define("USE_SHADOW", true)
    public castShadow: boolean = true;

    @define("_MAIN_TEXTURE")
    @texture("uMainTexture")
    public mainTexture: Texture;

    @uniform(DataType.vec3, "ambient")
    public ambient: vec3 = vec3.fromValues(0.1, 0.1, 0.1);

    @uniform(DataType.vec3, "uMaterialDiff")
    public diffuse: vec3 = vec3.fromValues(0.8, 0.8, 0.8);

    @uniform(DataType.vec3, "uMaterialSpec")
    public specular: vec3 = vec3.fromValues(0.3, 0.3, 0.3);

    @uniform(DataType.float, "uMaterialSpecExp")
    public specularExponent: number = 64;

    // @texture("specularTexture")
    public specularMap: Texture;

    public transparency: number = 0;

    // @texture("alphaTexture")
    public alphaMap: Texture;

    @readyRequire
    public bumpMap: Texture;

    @readyRequire
    public displamentMap: Texture;

    @readyRequire
    public stencilMap: Texture;

    @uniform(DataType.float, "reflectivity")
    public reflectivity: number = 1;

    @define("_ENVIRONMENT_MAP")
    @texture("uCubeTexture")
    public reflectionMap: CubeTexture;

    public geometryShader: Program;

    constructor(gl: WebGLRenderingContext, paramter: IStandardMaterial = {}) {
        super(gl);
        if (!!paramter) {
            for (const name in paramter) {
                this[name] = paramter[name];
            }
        }
    }

    protected initShader(gl: WebGLRenderingContext) {
        return new ShaderBuilder()
            .setExtraRenderParamHolder("mvp", {
                uniforms: {
                    modelViewProjectionMatrix: shaderPassLib.uniforms.modelViewProjectionMatrix,
                },
            })
            .build(gl);
    }
}
