import { mat4, vec3 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { DataType } from "../DataTypeEnum";
import { linkdef, readyRequire, texture, uniform } from "../Decorators";
import { Mesh } from "../Mesh";
import { Program } from "../shader/Program";
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

    @linkdef("_DEBUG")
    public debug: boolean = false;

    @linkdef("USE_SHADOW")
    public castShadow: boolean = true;

    @linkdef("_MAIN_TEXTURE")
    @texture("uMainTexture")
    public mainTexture: Texture;

    @uniform("ambient", DataType.vec3)
    public ambient: vec3 = vec3.fromValues(0.1, 0.1, 0.1);

    @uniform("materialDiff", DataType.vec3)
    public diffuse: vec3 = vec3.fromValues(0.8, 0.8, 0.8);

    @uniform("materialSpec", DataType.vec3)
    public specular: vec3 = vec3.fromValues(0.3, 0.3, 0.3);

    @uniform("materialSpecExp", DataType.float)
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

    @uniform("reflectivity", DataType.float)
    public reflectivity: number = 0.5;

    @linkdef("_ENVIRONMENT_MAP")
    @texture("uCubeTexture")
    public reflectionMap: CubeTexture;

    public geometryProgram: Program;

    constructor(gl: WebGLRenderingContext, paramter: IStandardMaterial = {}) {
        super();
        this.shader = new ShaderBuilder().build(gl);
        if (!!paramter) {
            for (const name in paramter) {
                this[name] = paramter[name];
            }
        }
    }
}
