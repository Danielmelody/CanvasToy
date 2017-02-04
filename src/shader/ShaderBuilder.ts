/// <reference path="../CanvasToy.ts"/>
/// <reference path="./Program.ts"/>
/// <reference path="../shader/shaders.ts"/>
/// <reference path="../textures/Texture.ts"/>

namespace CanvasToy {

    export enum InterplotationMethod {
        Flat,
        Gouraud,
        Phong,
        DepthPhong,
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
            switch (method) {
                case (InterplotationMethod.Flat):
                    this._interplotationVert = interploters__gouraud_vert;
                    this._interplotationFrag = interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Gouraud):
                    this._interplotationVert = interploters__gouraud_vert;
                    this._interplotationFrag = interploters__gouraud_frag;
                    break;
                case (InterplotationMethod.Phong):
                    this._interplotationVert = interploters__phong_vert;
                    this._interplotationFrag = interploters__phong_frag;
                    break;
                case (InterplotationMethod.DepthPhong):
                    this._interplotationVert = interploters__depth_phong_vert;
                    this._interplotationFrag = interploters__depth_phong_frag;
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

        public build(gl: WebGLRenderingContext): Program {
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
