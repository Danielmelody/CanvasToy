import { vec3 } from "gl-matrix";
import { Program } from "../../shader/Program";
import { Texture } from "../../textures/Texture";
import { ISurfaceMaterial } from "./ISurfaceMaterial";
export declare class BlinnPhongMaterial extends ISurfaceMaterial {
    protected _diffuse: vec3;
    protected _specular: vec3;
    protected _specularExponent: number;
    protected _specularMap: Texture;
    get diffuse(): vec3;
    get specular(): vec3;
    get specularExponent(): number;
    setDiffuse(_diffuse: vec3): this;
    setSpecular(_specular: vec3): this;
    setSpecularExponent(_specularExponent: number): this;
    protected initShader(gl: WebGLRenderingContext): Program;
}
