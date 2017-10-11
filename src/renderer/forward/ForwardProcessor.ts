import { mat4 } from "gl-matrix";
import { Camera } from "../../cameras/Camera";
import { Light } from "../../lights/Light";
import { ShadowType } from "../../lights/ShadowType";
import { LinearDepthPackMaterial } from "../../materials/ESM/DepthPackMaterial";
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
                const program = material.shader;
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
                    Graphics.addUniformContainer(material.shader, mesh);
                    Graphics.addUniformContainer(material.shader, material);
                    Graphics.addUniformContainer(material.shader, camera);
                    Graphics.addUniformContainer(material.shader, scene);
                    if (material instanceof StandardMaterial) {
                        this.setupLights(mesh.scene, material, mesh, camera);
                    }

                    Graphics.addTextureContainer(material.shader, material);
                    Graphics.addTextureContainer(material.shader, scene);

                    material.dirty = false;

                }
                if (material instanceof StandardMaterial && material.castShadow) {
                    this.passShadowInfo(mesh, scene, material, camera);
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
            this.setupLight(scene.dirctionLights[index], camera, material.shader, index, "directLights");
        }
        for (const index in scene.pointLights) {
            this.setupLight(scene.pointLights[index], camera, material.shader, index, "pointLights");
        }
        for (const index in scene.spotLights) {
            this.setupLight(scene.spotLights[index], camera, material.shader, index, "spotLights");
        }
    }

    private passShadowInfo(mesh: Mesh, scene: Scene, material: StandardMaterial, camera: Camera) {
        scene.directShadowMaps = [];
        scene.directShadowMV = new Float32Array(scene.dirctionLights.length * 16);
        scene.directShadowP = new Float32Array(scene.dirctionLights.length * 16);
        scene.directShadowSize = new Float32Array(scene.dirctionLights.length);
        this.passSpecificShadowArray(
            mesh,
            scene.dirctionLights,
            scene.directShadowMV,
            scene.directShadowP,
            scene.directShadowMaps,
            scene.directShadowSize,
        );

        scene.pointShadowMaps = [];
        scene.pointShadowMV = new Float32Array(scene.pointLights.length * 16);
        scene.pointShadowP = new Float32Array(scene.pointLights.length * 16);
        scene.pointShadowSize = new Float32Array(scene.pointLights.length);
        this.passSpecificShadowArray(
            mesh,
            scene.pointLights,
            scene.pointShadowMV,
            scene.pointShadowP,
            scene.pointShadowMaps,
            scene.pointShadowSize,
        );

        scene.spotShadowMaps = [];
        scene.spotShadowMV = new Float32Array(scene.spotLights.length * 16);
        scene.spotShadowP = new Float32Array(scene.spotLights.length * 16);
        scene.spotShadowSize = new Float32Array(scene.spotLights.length);
        this.passSpecificShadowArray(
            mesh,
            scene.spotLights,
            scene.spotShadowMV,
            scene.spotShadowP,
            scene.spotShadowMaps,
            scene.spotShadowSize,
        );
    }

    private passSpecificShadowArray(
        mesh: Mesh,
        lights: Light[],
        shadowMVArray:
            Float32Array,
        shadowPArray: Float32Array,
        shadowMaps: Texture[],
        shadowSizeArray: Float32Array,
    ) {

        let offset = 0;
        lights.forEach((light) => {
            if (light.shadowType === ShadowType.None) {
                return;
            }
            shadowMaps.push(light.shadowMap);
            shadowMVArray.set(
                mat4.mul(
                    mat4.create(),
                    light.worldToObjectMatrix,
                    mesh.matrix,
                ),
                offset,
            );
            shadowPArray.set(
                light.projectionMatrix,
                offset,
            );
            shadowSizeArray[offset / 16] = light.shadowFrameBuffer.width;
            offset += 16;
        });
    }
}
