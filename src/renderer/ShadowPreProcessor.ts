import { Camera } from "../cameras/Camera";
import { Light } from "../lights/Light";
import { ShadowType } from "../lights/ShadowType";
import { DepthMaterial } from "../materials/DepthMaterial";
import { Material } from "../materials/Material";
import { StandardMaterial } from "../materials/StandardMaterial";
import { Mesh } from "../Mesh";
import { Scene } from "../Scene";
import { Graphics } from "./GraphicsUtils";
import { WebGLExtension } from "./IExtension";
import { IProcessor } from "./IProcessor";

export class ShadowPreProcess implements IProcessor {

    public gl: WebGLRenderingContext;

    public ext: WebGLExtension;

    public depthMaterial: DepthMaterial;

    constructor(gl: WebGLRenderingContext, ext: WebGLExtension) {
        this.gl = gl;
        this.ext = ext;
        this.depthMaterial = new DepthMaterial(gl);
        this.depthMaterial.program.setViewPort({ x: 0, y: 0, width: 1024, height: 1024 });
    }

    public process(scene: Scene, camera: Camera, matriels: Material[]) {
        if (this.depthMaterial.dirty) {
            this.depthMaterial.program.resetMaterialDefines(this.depthMaterial);
            this.depthMaterial.program.make(scene);
            Graphics.addUniformContainer(this.depthMaterial.program, this.depthMaterial);
            Graphics.addTextureContainer(this.depthMaterial.program, this.depthMaterial);
            this.depthMaterial.dirty = false;
        }
        for (const light of scene.lights) {
            if (light.shadowType !== ShadowType.None) {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, light.shadowFrameBuffer.glFramebuffer);
                this.gl.enable(this.gl.DEPTH_TEST);
                this.gl.depthFunc(this.gl.LEQUAL);
                this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
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
                            this.renderMeshDepth(object, light);
                        }
                    }
                }
            }
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    private renderMeshDepth(mesh: Mesh, light: Light) {
        this.gl.useProgram(this.depthMaterial.program.webGlProgram);
        this.depthMaterial.program.pass(mesh, light.projectCamera, this.depthMaterial);
    }
}
