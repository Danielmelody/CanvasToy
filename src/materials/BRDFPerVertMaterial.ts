/// <reference path="./Material.ts"/>

module CanvasToy {
    export class BRDFPerVertMaterial extends Material {
        constructor(paramter?: {
            texture: Texture,
            color: Vec4Array
        }) {
            super();
            this.vertexShaderSource = brdf_pervert_vert;
            this.fragShaderSource = brdf_pervert_frag;
            if (paramter.texture != undefined) {
                this.map = paramter.texture;
                this.addAttribute('aTextureCoord', this.map);
            }
            if (paramter.color != undefined) {
                this.color = paramter.color;
                this.addUniform('uColor', this.color);
            }
        }
    }
}
