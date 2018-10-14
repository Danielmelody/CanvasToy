import { Camera } from "../../cameras/Camera";
import { IMaterial } from "../../materials/Material";
import { Mesh } from "../../Mesh";
import { Object3d } from "../../Object3d";
import { Scene } from "../../Scene";
import { Program } from "../../shader/Program";
import { WebGLExtension } from "../IExtension";
import { IProcessor } from "../IProcessor";

export class ForwardProcessor implements IProcessor {
    public readonly gl: WebGLRenderingContext;

    public readonly ext: WebGLExtension;

    constructor(
        gl: WebGLRenderingContext,
        ext: WebGLExtension,
        scene: Scene,
        camera: Camera,
    ) {
        this.gl = gl;
        this.ext = ext;
    }

    public process(scene: Scene, camera: Camera, materials: IMaterial[]) {
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
            mesh.geometry.resetLightShadows(this.gl);
            for (const material of mesh.materials) {
                const shader = material.shader;
                if (shader.enableDepthTest) {
                    this.gl.enable(this.gl.DEPTH_TEST);
                } else {
                    this.gl.disable(this.gl.DEPTH_TEST);
                }
                if (shader.enableStencilTest) {
                    this.gl.enable(this.gl.STENCIL_TEST);
                } else {
                    this.gl.disable(this.gl.STENCIL_TEST);
                }
                this.gl.useProgram(shader.webGlProgram);
                shader.pass({ mesh, camera, material, scene });
            }
        }
    }
}
