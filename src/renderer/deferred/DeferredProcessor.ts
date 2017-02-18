/// <reference path="../../Scene.ts"/>
/// <reference path="../../cameras/Camera.ts"/>
/// <reference path="../../Mesh.ts"/>
/// <reference path="../../shader/Program.ts"/>

namespace CanvasToy {
    export class DeferredProcessor implements IProcessor {

        public readonly gBuffer: FrameBuffer;

        public readonly geometryPass: Program;

        constructor(gl: WebGLRenderingContext, scene: Scene) {
            this.gBuffer = new FrameBuffer(gl);
            this.gBuffer.attachments.color.disable();
            this.gBuffer.extras.push(
                new Attachment(this.gBuffer, (ext: WebGLDrawBuffers) => ext.COLOR_ATTACHMENT0_WEBGL),
            );
            this.geometryPass = new Program(
                gl,
                {
                    vertexShader: interploters__deferred__geometry_vert,
                    fragmentShader: interploters__deferred__geometry_frag,
                },
                defaultProgramPass,
            );
            this.geometryPass.deleteUniform("materialDiff")
                .deleteUniform("materialSpec")
                .deleteUniform("materialAmbient")
                .deleteUniform("color");
            this.geometryPass.make(scene);
        }

        public process(scene: Scene, camera: Camera, materials: IMaterial[]) {
            for (const object of scene.objects) {
                if (object instanceof Mesh) {
                    const mesh = object as Mesh;
                    for (const material of mesh.materials) {
                        this.geometryPass.pass(mesh, camera, material);
                    }
                }
            }
        }
    }
}
