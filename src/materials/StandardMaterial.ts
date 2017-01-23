/// <reference path="Material.ts"/>

namespace CanvasToy {
    export class StandardMaterial extends Material {
        constructor(gl: WebGLRenderingContext, paramter: IMaterial = {}) {
            super(gl, paramter);
            this.program = new StandardShaderBuilder().build(gl);
        }
    }
}
