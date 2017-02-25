/// <reference path="../../Scene.ts"/>
/// <reference path="../../cameras/Camera.ts"/>
/// <reference path="../IExtension.ts"/>

namespace CanvasToy {
    export class ForwardProcessor implements IProcessor {

        public readonly gl: WebGLRenderingContext;

        public readonly ext: WebGLExtension;

        constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene, camera: Camera) {
            this.gl = gl;
            this.ext = ext;
            for (const object of scene.objects) {
                if (object instanceof Mesh) {
                    const mesh = object as Mesh;
                    this.makeMeshPrograms(scene, mesh, camera);
                }
            }
            scene.programSetUp = true;
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
                this.renderObject(camera, object);
            }
        }

        private renderObject(camera: Camera, object: Object) {
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
                        Graphics.addRootUniformContainer(material.program, mesh);
                        Graphics.addRootUniformContainer(material.program, material);
                        Graphics.addRootUniformContainer(material.program, camera);
                        this.setUpLights(mesh.scene, material, mesh, camera);
                        material.dirty = false;
                    }
                    this.gl.useProgram(program.webGlProgram);
                    program.pass(mesh, camera, material);
                    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.faces.buffer);
                    this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.faces.data.length, this.gl.UNSIGNED_SHORT, 0);
                }
            }
        }

        private setUpLights(scene: Scene, material: Material, mesh: Mesh, camera: Camera) {
            for (const index in scene.lights) {
                const light: any = scene.lights[index];

                // light properties pass
                console.assert(light.uniforms !== undefined);
                for (const uniformProperty of light.uniforms) {
                    if (uniformProperty.updator(light, camera) !== undefined) {
                        material.program.addUniform(`lights[${index}].${uniformProperty.name}`, {
                            type: uniformProperty.type,
                            updator: (obj, camera) => {
                                return uniformProperty.updator(light, camera);
                            },
                        });
                    }
                }
                // light.shadowRtt = new Texture(this.gl);
            }
        }

        private makeMeshPrograms(scene: Scene, mesh: Mesh, camera: Camera) {

            Graphics.copyDataToVertexBuffer(this.gl, mesh.geometry);

            if (mesh.materials.length > 1) {
                this.gl.enable(this.gl.BLEND);
                this.gl.blendFunc(this.gl.SRC_COLOR, this.gl.ONE_MINUS_SRC_COLOR);
            }

            for (const material of mesh.materials) {

                let cameraInScene = false;
                for (const object of scene.objects) {
                    if (object === camera) {
                        cameraInScene = true;
                        break;
                    }
                }

                if (!cameraInScene) {
                    console.error("Camera has not been added in Scene. Rendering stopped");
                    return;
                }

                material.program.make(scene);

                Graphics.addRootUniformContainer(material.program, mesh);
                Graphics.addRootUniformContainer(material.program, material);
                Graphics.addRootUniformContainer(material.program, camera);

                if (scene.openLight) {
                    this.setUpLights(scene, material, mesh, camera);
                }
            }
        }
    }
}
