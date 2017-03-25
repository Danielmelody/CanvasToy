/// <reference path="Material.ts"/>

namespace CanvasToy {

    export interface IStandardMaterial {
        mainTexture?: Texture;
        ambient?: Vec3Array;
        diffuse?: Vec3Array;
        specular?: Vec3Array;
        program?: Program;
    }

    export class StandardMaterial extends Material {

        @linkdef("_DEBUG")
        public debug: boolean = false;

        @linkdef("USE_SHADOW")
        public castShadow: boolean = true;

        @linkdef("_MAIN_TEXTURE")
        @texture("uMainTexture")
        public mainTexture: Texture;

        @uniform("ambient", DataType.vec3)
        public ambient: Vec3Array = vec3.fromValues(0.1, 0.1, 0.1);

        @uniform("materialDiff", DataType.vec3)
        public diffuse: Vec3Array = vec3.fromValues(0.8, 0.8, 0.8);

        @uniform("materialSpec", DataType.vec3)
        public specular: Vec3Array = vec3.fromValues(0.3, 0.3, 0.3);

        @uniform("materialSpecExp", DataType.float)
        public specularExponent: number = 64;

        // @texture("specularTexture")
        public specularMap: Texture;

        public transparency: number = 0;

        // @texture("alphaTexture")
        public alphaMap: Texture;

        @readyRequire
        public bumpMap: Texture;

        @readyRequire
        public displamentMap: Texture;

        @readyRequire
        public stencilMap: Texture;

        @uniform("reflectivity", DataType.float)
        public reflectivity: number = 0.5;

        @linkdef("_ENVIRONMENT_MAP")
        @texture("uCubeTexture")
        public reflectionMap: CubeTexture;

        public geometryProgram: Program;

        constructor(gl: WebGLRenderingContext, paramter: IStandardMaterial = {}) {
            super();
            this.program = new ShaderBuilder().build(gl);
            if (!!paramter) {
                for (const name in paramter) {
                    this[name] = paramter[name];
                }
            }
        }
    }
}
