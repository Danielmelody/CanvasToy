import { mat4 } from "gl-matrix";
import { Camera } from "../../cameras/Camera";
import { Light } from "../../lights/Light";
import { ShadowType } from "../../lights/ShadowType";
import { DepthMaterial } from "../../materials/DepthMaterial";
import { Material } from "../../materials/Material";
import { StandardMaterial } from "../../materials/StandardMaterial";
import { Mesh } from "../../Mesh";
import { Object3d } from "../../Object3d";
import { Scene } from "../../Scene";
import { Program } from "../../shader/Program";
import { Texture } from "../../textures/Texture";
import { Graphics } from "../GraphicsUtils";
import { WebGLExtension } from "../IExtension";
import { IProcessor } from "../IProcessor";

export class ForwardProcessor implements IProcessor {

    public readonly gl: WebGLRenderingContext;

    public readonly ext: WebGLExtension;

    constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene, camera: Camera) {
        this.gl = gl;
        this.ext = ext;
    }

    public process(scene: Scene, camera: Camera, materials: Material[]) {
        this.gl.clearColor(
            scene.clearColor[0],
            scene.clearColor[1],
            scene.clearColor[2],
            scene.clearColor[3],
        );
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        for (const object of scene.objects) {
            this.renderObject(scene, camera, object);
        }
    }

    private renderObject(scene: Scene, camera: Camera, object: Object3d) {
        if (object instanceof Mesh) {
            const mesh = object as Mesh;
            for (const material of mesh.materials) {
                const program = material.program;
                if (program.enableDepthTest) {
                    this.gl.enable(this.gl.DEPTH_TEST);
                } else {
                    this.gl.disable(this.gl.DEPTH_TEST);
                }
                if (program.enableStencilTest) {
                    this.gl.enable(this.gl.STENCIL_TEST);
                } else {
                    this.gl.disable(this.gl.STENCIL_TEST);
                }
                if (material.dirty) {
                    program.resetMaterialDefines(material);
                    program.make(mesh.scene);
                    Graphics.addUniformContainer(material.program, mesh);
                    Graphics.addUniformContainer(material.program, material);
                    Graphics.addUniformContainer(material.program, camera);
                    Graphics.addUniformContainer(material.program, scene);
                    if (material instanceof StandardMaterial) {
                        this.setupLights(mesh.scene, material, mesh, camera);
                    }

                    Graphics.addTextureContainer(material.program, material);
                    Graphics.addTextureContainer(material.program, scene);

                    material.dirty = false;
                }

                if (material instanceof StandardMaterial && material.castShadow) {
                    this.passShadows(mesh, scene, material, camera);
                }

                this.gl.useProgram(program.webGlProgram);
                program.pass(mesh, camera, material);
            }
        }
    }

    private setupLight(light: Light, camera: Camera, program: Program, index: string, lightArrayName: string) {
        console.assert(light.uniforms !== undefined);
        for (const uniformProperty of light.uniforms) {
            if (!!uniformProperty.key && light[uniformProperty.key] !== undefined) {
                program.addUniform(`${lightArrayName}[${index}].${uniformProperty.name}`, {
                    type: uniformProperty.type,
                    updator: (obj, camera) => {
                        // console.log("update light property " + uniformProperty.name);
                        return uniformProperty.updator(light, camera);
                    },
                });
            }
        }
    }

    private setupLights(scene: Scene, material: StandardMaterial, mesh: Mesh, camera: Camera) {
        for (const index in scene.dirctionLights) {
            this.setupLight(scene.dirctionLights[index], camera, material.program, index, "directLights");
        }
        for (const index in scene.pointLights) {
            this.setupLight(scene.pointLights[index], camera, material.program, index, "pointLights");
        }
        for (const index in scene.spotLights) {
            this.setupLight(scene.spotLights[index], camera, material.program, index, "spotLights");
        }
    }

    private passShadows(mesh: Mesh, scene: Scene, material: StandardMaterial, camera: Camera) {
        const handleShadow = (lights: Light[], shadowMatrices: Float32Array, shadowMaps: Texture[]) => {
            let offset = 0;
            lights.forEach((light) => {
                if (light.shadowType === ShadowType.None) {
                    return;
                }
                shadowMaps.push(light.shadowMap);
                shadowMatrices.set(
                    mat4.mul(
                        mat4.create(),
                        light.projectCamera.projectionMatrix,
                        mat4.mul(
                            mat4.create(),
                            light.projectCamera.worldToObjectMatrix,
                            mesh.matrix,
                        ),
                    ),
                    offset,
                );
                offset += 16;
            });
        };
        scene.directionShadowMaps = [];
        scene.directShadowMatrices = new Float32Array(scene.dirctionLights.length * 16);
        handleShadow(scene.dirctionLights, scene.directShadowMatrices, scene.directionShadowMaps);

        scene.pointShadowMaps = [];
        scene.pointShadowMatrices = new Float32Array(scene.pointLights.length * 16);
        handleShadow(scene.pointLights, scene.pointShadowMatrices, scene.pointShadowMaps);

        scene.spotShadowMaps = [];
        scene.spotShadowMatrices = new Float32Array(scene.spotLights.length * 16);
        handleShadow(scene.spotLights, scene.spotShadowMatrices, scene.spotShadowMaps);
    }
}
