/// <reference path="./Material.ts"/>

module CanvasToy {
    export class BRDFPerVertMaterial extends Material {
        constructor(paramter?) {
            super(paramter);
            this.vertexShaderSource = brdf_pervert_vert;
            this.fragShaderSource = brdf_pervert_frag;
        }
    }
}
