/// <reference path="../CanvasToy.ts"/>
/// <reference path="../render/Program.ts"/>
/// <reference path="../shader/shaders.ts"/>
/// <reference path="../textures/Texture.ts"/>

namespace CanvasToy {

    export let colors = {
        black: vec4.fromValues(0, 0, 0, 1),
        gray: vec4.fromValues(0.5, 0.5, 0.5, 1),
        red: vec4.fromValues(1, 0, 0, 1),
        white: vec4.fromValues(1, 1, 1, 1),
    };

    export enum InterplotationMethod {
        Flat,
        Gouraud,
        Phong
    }

    export enum LightingMode {
        Lambort,
        Phong,
        Cell,
        Blinn_Phong,
        Physical
    }

    export interface IMaterial {
        mainTexture: Texture;
        color: Vec4Array;
        interplotationMethod: InterplotationMethod;
        lightingMode: LightingMode;
        program: Program;
    }

    export class Material implements IMaterial {

        public program: Program;

        public color: Vec4Array;
        public mainTexture: Texture;

        public ambient: Vec3Array = vec3.fromValues(0.1, 0.1, 0.1);
        public ambientMap: Texture;

        public diffuse: Vec3Array = vec3.fromValues(0.8, 0.8, 0.8);
        public diffuseMap: Texture;

        public specular: Vec3Array = vec3.fromValues(1, 1, 1);
        public specularMap: Texture;

        public opacity: Vec3Array = vec3.fromValues(0, 0, 0);
        public opacityMap: Texture;

        public interplotationMethod: InterplotationMethod = InterplotationMethod.Phong;

        public lightingMode: LightingMode = LightingMode.Phong;

        public bumpMap: Texture;

        public normalMap: Texture;

        public reflactivity: number;

        public shaderSource: { vertexShader: string, fragmentShader: string };

        constructor(paramter?: IMaterial) {
            if (!!paramter) {
                for (let name in paramter) {
                    this[name] = paramter[name];
                }
            }
            this.configShader();
            if (!this.program) {
                this.program = new Program(defaultProgramPass);
            }
        }
        public configShader() {
            let interplotationVert: string = "";
            let interplotationFrag: string = "";
            switch (this.interplotationMethod) {
                case (InterplotationMethod.Flat):
                    interplotationVert = interploters__gouraud_vert;
                    interplotationFrag = interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Gouraud):
                    interplotationVert = interploters__gouraud_vert;
                    interplotationFrag = interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Phong):
                    interplotationVert = interploters__phong_vert;
                    interplotationFrag = interploters__phong_frag;
                    break;
                default: break;
            }
            let lightCalculator = "";
            switch (this.lightingMode) {
                case (LightingMode.Lambort):
                    lightCalculator = calculators__lambert_glsl;
                    break;
                case (LightingMode.Phong):
                    lightCalculator = calculators__phong_glsl;
                    break;
                default: break;
            }
            this.shaderSource = {
                vertexShader: lightCalculator + interplotationVert,
                fragmentShader: lightCalculator + interplotationFrag,
            };
        }
    }
}
