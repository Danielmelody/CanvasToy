/// <reference path="./Material.ts"/>

module CanvasToy {
    export class LambertMaterial extends Material{
        constructor(paramter?:{
            texture:Texture,
            color:Vec4Array})
        {
            super();

            /*this.vertexShaderSource = lambert_vert;
            this.fragShaderSource = lambert_frag;*/

            if(paramter.texture != undefined && paramter.color != undefined) {
                console.warn("passed both color and texture to Material, color would be ignored");
            }
            else if(paramter.texture != undefined) {
                this.map = paramter.texture;
                this.addAttribute('aTextureCoord', this.map);
            }
            else if(paramter.color != undefined) {
                this.color = paramter.color;
                this.addUniform('uColor', this.color);
            }

            //this.ambient = vec4.fromValues(0.3, 0.3, 0.3, 1)

        }
    }
}
