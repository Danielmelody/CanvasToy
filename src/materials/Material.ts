/// <reference path="../CanvasToy.ts"/>
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

        constructor(paramter?: IMaterial) {
            if (!!paramter) {
                for (let name in paramter) {
                    if (paramter.hasOwnProperty(name)) {
                        this[name] = paramter[name];
                    }
                }
            }
            let shaderSrc = this.configShader();
            if (!this.program) {
                this.program = new Program((mesh: Mesh, scene: Scene, camera: Camera) => {
                    return {
                        vertexShader: shaderSrc.vertexShader,
                        fragmentShader: shaderSrc.fragmentShader,
                        faces: mesh.geometry.faces,
                        textures: {
                            uMainTexture: this.mainTexture,
                        },
                        uniforms: {
                            modelViewProjectionMatrix: {
                                type: DataType.mat4,
                                updator: (meshOnUpdate: Mesh, cameraOnUpdate: Camera) => {
                                    return new Float32Array(mat4.multiply(
                                        mat4.create(),
                                        cameraOnUpdate.projectionMatrix,
                                        mat4.multiply(mat4.create(),
                                            camera.objectToWorldMatrix,
                                            meshOnUpdate.matrix))
                                    );
                                },
                            },
                            color: !this.color ? undefined : {
                                type: DataType.vec4, updator: () => {
                                    return this.color;
                                },
                            },
                            ambient: !scene.openLight ? undefined : {
                                type: DataType.vec3,
                                updator: () => { return scene.ambientLight; },
                            },
                            normalMatrix: !scene.openLight ? undefined : {
                                type: DataType.mat4,
                                updator: () => { return new Float32Array(mesh.normalMatrix); },
                            },
                            eyePos: !scene.openLight ? undefined : {
                                type: DataType.vec4,
                                updator: (meshOnUpdate: Mesh, cameraOnUpdate: Camera) => {
                                    return vec4.fromValues(
                                        cameraOnUpdate.position[0],
                                        cameraOnUpdate.position[1],
                                        cameraOnUpdate.position[2],
                                        1
                                    );
                                },
                            },
                        },
                        attributes: {
                            position: mesh.geometry.attributes.position,
                            aMainUV: !this.mainTexture ? undefined : mesh.geometry.attributes.uv,
                            aNormal: !scene.openLight ?
                                undefined :
                                this.interplotationMethod === InterplotationMethod.Flat ?
                                    mesh.geometry.attributes.flatNormal : mesh.geometry.attributes.normal,
                        },
                    };
                });
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
            return {
                vertexShader: lightCalculator + interplotationVert,
                fragmentShader: lightCalculator + interplotationFrag,
            };
        }
    }
}
