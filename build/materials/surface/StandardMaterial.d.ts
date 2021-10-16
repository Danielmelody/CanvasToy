import { vec3 } from "gl-matrix";
import { Program } from "../../shader/Program";
import { Texture2D } from "../../textures/Texture2D";
import { BlinnPhongMaterial } from "./BlinnPhongMaterial";
import { ISurfaceMaterial } from "./ISurfaceMaterial";
export declare class StandardMaterial extends ISurfaceMaterial {
    static fromLaggard(gl: WebGLRenderingContext, blinnPhong: BlinnPhongMaterial): StandardMaterial;
    protected _albedo: vec3;
    protected _metallic: number;
    protected _metallicTexture: Texture2D;
    protected _roughness: number;
    get albedo(): vec3;
    get metallic(): number;
    get roughness(): number;
    get stencilMap(): any;
    setAlbedo(_albedo: vec3): this;
    setMetallic(_metallic: number): this;
    setRoughness(_roughness: number): this;
    protected initShader(gl: WebGLRenderingContext): Program;
}
