import { vec2 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { uniform } from "../Decorators";
import { RectGeometry } from "../geometries/RectGeometry";
import { Light } from "../lights/Light";
import { ShadowType } from "../lights/ShadowType";
import { LinearDepthPackMaterial } from "../materials/ESM/DepthPackMaterial";
import { PCSSFilteringMaterial } from "../materials/ESM/LogBlurMaterial";
import { Material } from "../materials/Material";
import { StandardMaterial } from "../materials/StandardMaterial";
import { Mesh } from "../Mesh";
import { Scene } from "../Scene";
import { shaderPassLib } from "../shader/Program";
import { FrameBuffer } from "./FrameBuffer";
import { Graphics } from "./GraphicsUtils";
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
        this.blurMaterial.shader.setViewPort({ x: 0, y: 0, width: 512, height: 512 });

        this.rectMesh = new Mesh(new RectGeometry(gl).build(), []);
        this.rectMesh.geometry.clean(gl);

        this.initPass(scene);
    }

    public process(scene: Scene, camera: Camera, matriels: Material[]) {
        for (const light of scene.lights) {
            if (light.shadowType !== ShadowType.None) {
                this.depthMaterial.shader.setViewPort(
                    { x: 0, y: 0, width: light.shadowSize, height: light.shadowSize });
                this.renderDepth(scene, light);
            }
            if (light.shadowType === ShadowType.Soft) {
                this.blurMaterial.shader.setViewPort(
                    { x: 0, y: 0, width: light.shadowSize, height: light.shadowSize });
                // this.blurDepth(scene, light);
            }
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    private initPass(scene: Scene) {
        this.rectMesh.geometry.clean(this.gl);
        this.depthMaterial.shader.setExtraRenderParam("mvp", {
            uniforms: {
                modelViewProjectionMatrix: shaderPassLib.uniforms.modelViewProjectionMatrix,
            },
        });
    }

    private renderDepth(scene: Scene, light: Light) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, light.shadowFrameBuffer.glFramebuffer);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clearColor(light.far, 0, 0, 0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        // this.gl.cullFace(this.gl.FRONT);
        for (const object of scene.objects) {
            if (object instanceof Mesh) {
                let castShadow = false;
                for (const material of object.materials) {
                    if (material instanceof StandardMaterial) {
                        if (material.castShadow) {
                            castShadow = true;
                            break;
                        }
                    }
                }
                if (castShadow) {
                    this.gl.useProgram(this.depthMaterial.shader.webGlProgram);
                    light.drawWithLightCamera({ mesh: object, material: this.depthMaterial });
                }
            }
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    private blurDepth(scene: Scene, light: Light) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, light.blurFrameBuffer.glFramebuffer);
        this.gl.clearColor(light.far, 0, 0, 0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        this.blurMaterial.blurDirection = vec2.fromValues(1, 0);
        this.blurMaterial.blurStep = 1.0 / light.shadowSize;
        this.blurMaterial.origin = light.shadowFrameBuffer.attachments.color.targetTexture;
        this.gl.useProgram(this.blurMaterial.shader.webGlProgram);
        light.drawWithLightCamera({ mesh: this.rectMesh, material: this.blurMaterial });

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, light.shadowFrameBuffer.glFramebuffer);
        this.gl.clearColor(light.far, 0, 0, 0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        this.blurMaterial.blurDirection = vec2.fromValues(0, 1);
        this.blurMaterial.blurStep = 1.0 / light.shadowSize;
        this.blurMaterial.origin = light.blurFrameBuffer.attachments.color.targetTexture;
        light.drawWithLightCamera({ mesh: this.rectMesh, material: this.blurMaterial });
    }
}
