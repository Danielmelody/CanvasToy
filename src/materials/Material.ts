import { vec4 } from "gl-matrix";
import { IDirtyable } from "../Dirtyable";
import { Scene } from "../Scene";
import { IRenderParamHolder, Program } from "../shader/Program";

export let colors = {
    black: vec4.fromValues(0, 0, 0, 1),
    gray: vec4.fromValues(0.5, 0.5, 0.5, 1),
    red: vec4.fromValues(1, 0, 0, 1),
    white: vec4.fromValues(1, 1, 1, 1),
};

export abstract class Material {
    public defines: string[] = [];
    public shader: Program;

    public constructor(gl: WebGLRenderingContext) {
        this.shader = this.initShader(gl);
    }

    protected abstract initShader(gl: WebGLRenderingContext): Program;

}
