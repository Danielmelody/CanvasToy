import { IRenderParamHolder, Program, shaderPassLib } from "./Program";
import { ShaderLib, ShaderSource, ShadingFrag, ShadingVert } from "./shaders";

export class ShaderBuilder {

    private vertLibs: ShaderLib[] = [
        ShaderSource.definitions__light_glsl,
    ];

    private fragLibs: ShaderLib[] = [
        ShaderSource.definitions__light_glsl,
        ShaderSource.calculators__linearlize_depth_glsl,
        ShaderSource.calculators__blinn_phong_glsl,
        ShaderSource.calculators__types_glsl,
        ShaderSource.calculators__unpackFloat1x32_glsl,
        ShaderSource.calculators__shadow_factor_glsl,
        ShaderSource.debug__checkBox_glsl,
    ];

    private shadingVert: ShadingVert = ShaderSource.interploters__forward__phong_vert;

    private shadingFrag: ShadingFrag = ShaderSource.interploters__forward__phong_frag;

    private extraRenderParamHolders: { [index: string]: IRenderParamHolder } = {};

    public resetShaderLib() {
        this.vertLibs = [];
        this.fragLibs = [];
        return this;
    }

    public addShaderLib(...lib: ShaderLib[]) {
        this.vertLibs.push(...lib);
        this.fragLibs.push(...lib);
        return this;
    }

    public addShaderLibVert(...lib: ShaderLib[]) {
        this.vertLibs.push(...lib);
        return this;
    }

    public addShaderLibFrag(...lib: ShaderLib[]) {
        this.fragLibs.push(...lib);
        return this;
    }

    public setShadingVert(vert: ShadingVert) {
        this.shadingVert = vert;
        return this;
    }

    public setShadingFrag(frag: ShadingFrag) {
        this.shadingFrag = frag;
        return this;
    }

    public setExtraRenderParamHolder(name: string, paramHolder: IRenderParamHolder) {
        this.extraRenderParamHolders[name] = paramHolder;
        return this;
    }

    public build(gl: WebGLRenderingContext): Program {
        return new Program(gl, {
            vertexShader: this.vertLibs.join("\n") + this.shadingVert,
            fragmentShader: this.fragLibs.join("\n") + this.shadingFrag,
        },
            this.extraRenderParamHolders,
        );
    }
}
