/// <reference path="../Scene.ts"/>
/// <reference path="../cameras/Camera.ts"/>
/// <reference path="IExtension.ts"/>

namespace CanvasToy {
    export class ShadowPreProcess implements IProcessor {

        public gl: WebGLRenderingContext;

        public ext: WebGLExtension;

        public depthMaterial: DepthMaterial;

        constructor(gl: WebGLRenderingContext, ext: WebGLExtension) {
            this.gl = gl;
            this.ext = ext;
            this.depthMaterial = new DepthMaterial(gl);
        }

        public process(scene: Scene, camera: Camera, matriels: Material[]) {
            if (this.depthMaterial.dirty) {
                this.depthMaterial.program.resetMaterialDefines(this.depthMaterial);
                this.depthMaterial.program.make(scene);
                Graphics.addUniformContainer(this.depthMaterial.program, this.depthMaterial);
                Graphics.addTextureContainer(this.depthMaterial.program, this.depthMaterial);
                this.depthMaterial.dirty = false;
            }
            this.gl.enable(this.gl.DEPTH_TEST);
            for (const light of scene.lights) {
                if (light.shadowType !== ShadowType.None) {
                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, light.shadowFrameBuffer.glFramebuffer);
                    light.shadowFrameBuffer.attach(this.gl, this.ext.draw_buffer);
                    for (const object of scene.objects) {
                        if (object instanceof Mesh) {
                            this.renderMeshDepth(object, light);
                        }
                    }
                }
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }

        private renderMeshDepth(mesh: Mesh, light: Light) {
            this.depthMaterial.program.pass(mesh, light.projectCamera, this.depthMaterial);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
            this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.faces.data.length, this.gl.UNSIGNED_SHORT, 0);
        }
    }
}
