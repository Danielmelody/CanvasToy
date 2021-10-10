import { IRenderParamHolder, Program } from "./Program";
import { ShaderLib, ShadingFrag, ShadingVert } from "./shaders";
export declare class ShaderBuilder {
    private definitions;
    private vertLibs;
    private fragLibs;
    private lightModel;
    private shadingVert;
    private shadingFrag;
    private extraRenderParamHolders;
    resetShaderLib(): this;
    addShaderLib(...lib: ShaderLib[]): this;
    addDefinition(...lib: ShaderLib[]): this;
    addShaderLibVert(...lib: ShaderLib[]): this;
    addShaderLibFrag(...lib: ShaderLib[]): this;
    setLightModel(model: ShaderLib): this;
    setShadingVert(vert: ShadingVert): this;
    setShadingFrag(frag: ShadingFrag): this;
    setExtraRenderParamHolder(name: string, paramHolder: IRenderParamHolder): this;
    build(gl: WebGLRenderingContext): Program;
}
