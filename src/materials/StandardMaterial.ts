/// <reference path="Material.ts"/>

namespace CanvasToy {

    export interface IStandardMaterial {
        mainTexture?: Texture;
        ambient?: Vec3Array;
        diffuse?: Vec3Array;
        specular?: Vec3Array;
        interplotationMethod?: InterplotationMethod;
        lightingMode?: LightingMode;
        program?: Program;
    }

    export class StandardMaterial extends Material {

        @readyRequire
        @asDefine("_MAIN_TEXTURE")
        public mainTexture: Texture;

        @uniform("ambient", DataType.vec3)
        public ambient: Vec3Array = vec3.fromValues(0.1, 0.1, 0.1);

        @uniform("materialDiff", DataType.vec3)
        public diffuse: Vec3Array = vec3.fromValues(0.8, 0.8, 0.8);

        @uniform("materialSpec", DataType.vec3)
        public specular: Vec3Array = vec3.fromValues(0.3, 0.3, 0.3);

        @uniform("materialSpecExp", DataType.float)
        public specularExponent: number = 16;

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

        @uniform("reflectivity", DataType.float)
        public reflectivity: number = 0.5;

        @asDefine("_ENVIRONMENT_MAP")
        @readyRequire
        public reflectionMap: CubeTexture;

        constructor(gl: WebGLRenderingContext, paramter: IStandardMaterial = {}) {
            super();
            this.program = new StandardShaderBuilder().build(gl);
            if (!!paramter) {
                for (const name in paramter) {
                    this[name] = paramter[name];
                }
            }
        }
    }
}
