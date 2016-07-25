/// <reference path="./Material.ts"/>

module CanvasToy {
    export class BRDFPerFragMaterial extends Material {
        constructor(paramter?) {
            super(paramter);
            this.vertexShaderSource = brdf_perfrag_vert;
            this.fragShaderSource = brdf_perfrag_frag;
        }
    }
}
