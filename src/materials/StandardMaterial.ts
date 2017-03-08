/// <reference path="Material.ts"/>

namespace CanvasToy {

    export interface IStandardMaterial {
        mainTexture?: Texture;
        color?: Vec3Array;
        diffuse?: Vec3Array;
        specular?: Vec3Array;
        interplotationMethod?: InterplotationMethod;
        lightingMode?: LightingMode;
        program?: Program;
    }

    export class StandardMaterial extends Material {
        @asDefine("_MAIN_TEXTURE")
        @readyRequire
        public mainTexture: Texture;

        public ambient: Vec3Array = vec3.fromValues(0.1, 0.1, 0.1);

        public diffuse: Vec3Array = vec3.fromValues(0.8, 0.8, 0.8);

        public specular: Vec3Array = vec3.fromValues(1, 1, 1);

        public specularExponent: number = 1;

        @readyRequire
        public specularMap: Texture;

        public transparency: number = 0;

        @readyRequire
        public alphaMap: Texture;

        @readyRequire
        public bumpMap: Texture;

        @readyRequire
        public displamentMap: Texture;

        @readyRequire
        public stencilMap: Texture;

        public reflactivity: number = 0.5;

        @asDefine("_ENVIRONMENT_MAP")
        @readyRequire
        public reflectionMap: CubeTexture;

        constructor(gl: WebGLRenderingContext, paramter: IStandardMaterial = {}) {
            super();
            if (!!paramter) {
                for (const name in paramter) {
                    this[name] = paramter[name];
                }
            }
            this.program = new StandardShaderBuilder().build(gl);
        }
    }
}
