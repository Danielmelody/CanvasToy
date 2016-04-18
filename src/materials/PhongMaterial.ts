/// <reference path="./Material.ts"/>

module CanvasToy {
    export class PhongMaterial extends Material{
        constructor(paramter:{
            texture:Texture,
            color:Vec4Array})
        {
            super();
            if(paramter.texture != undefined && paramter.color != undefined) {
                console.warn("passed both color and texture to Material, color would be ignored");
            }
            else if(paramter.texture != undefined) {
                this.map = paramter.texture;
            }
            else if(paramter.color != undefined) {
                this.map = null;
            }
        }
    }
}
