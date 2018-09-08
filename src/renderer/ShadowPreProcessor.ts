import { Camera } from "../cameras/Camera";
import { RectGeometry } from "../geometries/RectGeometry";
import { Light } from "../lights/Light";
import { ShadowLevel } from "../lights/ShadowLevel";
import { LinearDepthPackMaterial } from "../materials/ESM/DepthPackMaterial";
import { PCSSFilteringMaterial } from "../materials/ESM/LogBlurMaterial";
import { IMaterial } from "../materials/Material";
import { BlinnPhongMaterial } from "../materials/surface/BlinnPhongMaterial";
import { StandardMaterial } from "../materials/surface/StandardMaterial";
import { Mesh } from "../Mesh";
import { Scene } from "../Scene";

import { ISurfaceMaterial } from "../materials/surface/ISurfaceMaterial";
import { WebGLExtension } from "./IExtension";
import { IProcessor } from "./IProcessor";

export class ShadowPreProcess implements IProcessor {
    private gl: WebGLRenderingContext;

    private ext: WebGLExtension;

    private depthMaterial: LinearDepthPackMaterial;

    private blurMaterial: PCSSFilteringMaterial;

    private rectMesh: Mesh;

    constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene) {
        this.gl = gl;
        this.ext = ext;

        this.depthMaterial = new LinearDepthPackMaterial(gl);

        this.blurMaterial = new PCSSFilteringMaterial(gl);
        this.blurMaterial.shader.setViewPort({
            x: 0,
            y: 0,
            width: 512,
            height: 512,
        });

        this.rectMesh = new Mesh(new RectGeometry(gl).build(), []);
        this.rectMesh.geometry.resetLightShadows(gl);
    }

    public process(scene: Scene, camera: Camera, matriels: IMaterial[]) {
        for (const light of scene.lights) {
            if (light.shadowLevel > ShadowLevel.None) {
                this.depthMaterial.shader.setViewPort({
                    x: 0,
                    y: 0,
                    width: light.shadowSize,
                    height: light.shadowSize,
                });
                this.renderDepth(scene, light);
            }
            if (light.shadowLevel > ShadowLevel.Hard) {
                this.blurMaterial.shader.setViewPort({
                    x: 0,
                    y: 0,
                    width: light.shadowSize,
                    height: light.shadowSize,
                });
                this.prefilterDepth(scene, light);
            }
        }

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    private renderDepth(scene: Scene, light: Light) {
        light.shadowFrameBuffers.forEach(() => {
            light.clearShadowFrameBuffer();
            for (const object of scene.objects) {
                if (object instanceof Mesh) {
                    let blockShadow = false;
                    for (const material of object.materials) {
                        if (
                            material instanceof StandardMaterial ||
                            material instanceof BlinnPhongMaterial
                        ) {
                            if ((material as ISurfaceMaterial).blockShadow) {
                                blockShadow = true;
                                break;
                            }
                        }
                    }
                    if (blockShadow) {
                        this.gl.useProgram(
                            this.depthMaterial.shader.webGlProgram,
                        );
                        light.drawWithLightCamera({
                            mesh: object,
                            material: this.depthMaterial,
                        });
                    }
                }
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        });
    }

    private prefilterDepth(scene: Scene, light: Light) {
        light.shadowFrameBuffers.forEach((shadowFrameBuffer) => {
            this.blurMaterial.origin =
                shadowFrameBuffer.active.attachments.color.targetTexture;
            shadowFrameBuffer.swap();
            light.clearShadowFrameBuffer();
            this.blurMaterial.blurStep = 1.0 / light.shadowSize;
            this.gl.useProgram(this.blurMaterial.shader.webGlProgram);
            light.drawWithLightCamera({
                mesh: this.rectMesh,
                material: this.blurMaterial,
            });
            shadowFrameBuffer.swap();
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        });
    }
}
