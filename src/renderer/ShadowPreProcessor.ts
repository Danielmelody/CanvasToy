
import {vec2} from "gl-matrix";
import { Camera } from "../cameras/Camera";
import {RectGeometry} from "../geometries/RectGeometry";
import { Light } from "../lights/Light";
import { ShadowType } from "../lights/ShadowType";
import { DepthPackMaterial } from "../materials/ESM/DepthPackMaterial";
import { LogBlurMaterial } from "../materials/ESM/LogBlurMaterial";
import { Material } from "../materials/Material";
import { StandardMaterial } from "../materials/StandardMaterial";
import { Mesh } from "../Mesh";
import { Scene } from "../Scene";
import { FrameBuffer } from "./FrameBuffer";
import { Graphics } from "./GraphicsUtils";
import { WebGLExtension } from "./IExtension";
import { IProcessor } from "./IProcessor";

export class ShadowPreProcess implements IProcessor {

    private gl: WebGLRenderingContext;

    private ext: WebGLExtension;

    private depthMaterial: DepthPackMaterial;

    private blurMaterial: LogBlurMaterial;

    private blurFrameBuffer: FrameBuffer;

    private rectMesh: Mesh;

    constructor(gl: WebGLRenderingContext, ext: WebGLExtension) {
        this.gl = gl;
        this.ext = ext;

        this.depthMaterial = new DepthPackMaterial(gl);
        this.depthMaterial.program.setViewPort({ x: 0, y: 0, width: 1024, height: 1024 });

        this.blurMaterial = new LogBlurMaterial(gl);
        this.blurMaterial.program.setViewPort({ x: 0, y: 0, width: 1024, height: 1024 });

        this.blurFrameBuffer = new FrameBuffer(gl).setWidth(1024).setHeight(1024);
        // this.blurFrameBuffer.attachments.depth.disable();
        this.blurFrameBuffer.attachments.color.targetTexture
            .setType(this.gl.UNSIGNED_BYTE)
            .setFormat(this.gl.RGBA)
            .setMagFilter(gl.LINEAR)
            .setMinFilter(gl.LINEAR)
            .setWrapS(this.gl.REPEAT)
            .setWrapT(this.gl.REPEAT)
            .bindTextureData(this.gl);
        this.blurFrameBuffer.attach(gl);

        this.rectMesh = new Mesh(new RectGeometry(gl).build(), []);
        Graphics.copyDataToVertexBuffer(this.gl, this.rectMesh.geometry);
    }

    public process(scene: Scene, camera: Camera, matriels: Material[]) {
        if (this.depthMaterial.dirty) {
            this.depthMaterial.program.resetMaterialDefines(this.depthMaterial);
            this.depthMaterial.program.make(scene);
            Graphics.addUniformContainer(this.depthMaterial.program, this.depthMaterial);
            Graphics.addTextureContainer(this.depthMaterial.program, this.depthMaterial);
            this.depthMaterial.dirty = false;
        }

        if (this.blurMaterial.dirty) {
            this.blurMaterial.program.resetMaterialDefines(this.depthMaterial);
            this.blurMaterial.program.make(scene);
            Graphics.addUniformContainer(this.blurMaterial.program, this.blurMaterial);
            Graphics.addTextureContainer(this.blurMaterial.program, this.blurMaterial);
            this.depthMaterial.dirty = false;
        }

        for (const light of scene.lights) {
            if (light.shadowType !== ShadowType.None) {
                this.renderDepth(scene, light);
                this.blurDepth(scene, light);
            }
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    private renderDepth(scene: Scene, light: Light) {
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
                        this.gl.useProgram(this.depthMaterial.program.webGlProgram);
                        this.depthMaterial.program.pass(object, light.projectCamera, this.depthMaterial);
                    }
                }
            }
    }

    private blurDepth(scene: Scene, light: Light) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.blurFrameBuffer.glFramebuffer);
        this.blurMaterial.blurDirection = vec2.fromValues(1, 0);
        this.blurMaterial.blurStep = 2.0 / light.shadowFrameBuffer.width;
        this.blurMaterial.origin = light.shadowFrameBuffer.attachments.color.targetTexture;
        this.gl.useProgram(this.blurMaterial.program.webGlProgram);
        this.blurMaterial.program.pass(this.rectMesh, light.projectCamera, this.blurMaterial);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, light.shadowFrameBuffer.glFramebuffer);
        this.blurMaterial.blurDirection = vec2.fromValues(0, 1);
        this.blurMaterial.blurStep = 2.0 / light.shadowFrameBuffer.height;
        this.blurMaterial.origin = this.blurFrameBuffer.attachments.color.targetTexture;
        this.gl.useProgram(this.blurMaterial.program.webGlProgram);
        this.blurMaterial.program.pass(this.rectMesh, light.projectCamera, this.blurMaterial);
    }
}
