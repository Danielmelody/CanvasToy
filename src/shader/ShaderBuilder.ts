/// <reference path="../CanvasToy.ts"/>
/// <reference path="../render/Program.ts"/>
/// <reference path="../shader/shaders.ts"/>
/// <reference path="../textures/Texture.ts"/>

namespace CanvasToy {

    export enum InterplotationMethod {
        Flat,
        Gouraud,
        Phong,
    }

    export enum LightingMode {
        Phong,
        Cell,
        Blinn_Phong,
        Physical,
    }

    export class StandardShaderBuilder {

        private _definitions = [
            definitions__light_glsl,
        ];

        private _interplotationMethod: InterplotationMethod = InterplotationMethod.Phong;
        private _interplotationVert: string = interploters__phong_vert;
        private _interplotationFrag: string = interploters__phong_frag;

        private _lightingMode: LightingMode = LightingMode.Blinn_Phong;
        private _lightingModeSource: string = calculators__blinn_phong_glsl;

        public setInterplotationMethod(method: InterplotationMethod) {
            let _interplotationVert: string = "";
            let _interplotationFrag: string = "";
            switch (this._interplotationMethod) {
                case (InterplotationMethod.Flat):
                    _interplotationVert = interploters__gouraud_vert;
                    _interplotationFrag = interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Gouraud):
                    _interplotationVert = interploters__gouraud_vert;
                    _interplotationFrag = interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Phong):
                    _interplotationVert = interploters__phong_vert;
                    _interplotationFrag = interploters__phong_frag;
                    break;
                default: break;
            }
            return this;
        }

        public setLightingMode(lightingMode: LightingMode) {
            switch (lightingMode) {
                case (LightingMode.Blinn_Phong):
                    this._lightingModeSource = calculators__blinn_phong_glsl;
                    break;
                case (LightingMode.Phong):
                    this._lightingModeSource = calculators__phong_glsl;
                    break;
                default: break;
            }
            return this;
        }

        public build(gl: WebGLRenderingContext) {
            return new Program(gl, {
                vertexShader:
                this._definitions.join("\n") +
                this._lightingModeSource +
                this._interplotationVert,
                fragmentShader:
                this._definitions.join("\n") +
                this._lightingModeSource +
                this._interplotationFrag,
            },
                defaultProgramPass,
            );
        }
    }
}
