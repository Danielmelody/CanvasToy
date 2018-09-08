import { Camera } from "../cameras/Camera";
import { IAsyncResource } from "../IAsyncResource";
import { IMaterial } from "../materials/Material";
import { Mesh } from "../Mesh";
import { Scene } from "../Scene";
import { Texture } from "../textures/Texture";
import { DeferredProcessor } from "./deferred/DeferredProcessor";
import { ForwardProcessor } from "./forward/ForwardProcessor";
import { FrameBuffer } from "./FrameBuffer";
import { Graphics } from "./GraphicsUtils";
import { WebGLExtension } from "./IExtension";
import { IProcessor } from "./IProcessor";
import { ShadowPreProcess } from "./ShadowPreProcessor";

export class Renderer {
    public readonly canvas: HTMLCanvasElement = null;

    public readonly gl: WebGLRenderingContext = null;

    public readonly ext: WebGLExtension;

    public debug: boolean = false;

    public preloadRes: any[] = [];

    public usedTextureNum: number = 0;

    public renderTargets: Texture[] = [];

    public vertPrecision: string = "highp";

    public fragPrecision: string = "mediump";

    public isAnimating: boolean = false;

    public renderQueue: Array<(deltaTime: number) => void> = [];

    public fbos: FrameBuffer[] = [];

    public scenes: Scene[] = [];

    public cameras: Camera[] = [];

    public frameRate: number = 1000 / 60;

    public currentFPS = 60;

    private startTime: number;

    private duration: number = 0;

    private stopped: boolean = false;

    private materials: IMaterial[] = [];

    private isDeferred = false;

    constructor(canvas: HTMLCanvasElement, debug?: boolean) {
        this.canvas = canvas;
        this.debug = debug;
        this.gl = Graphics.initWebwebglContext(canvas, debug);
        this.ext = {
            depth_texture: this.gl.getExtension("WEBGL_depth_texture"),
            draw_buffer: this.gl.getExtension("WEBGL_draw_buffers"),
            texture_float: this.gl.getExtension("OES_texture_float"),
            texture_half_float: this.gl.getExtension("OES_texture_half_float"),
            texture_float_linear: this.gl.getExtension(
                "OES_texture_float_linear",
            ),
        };
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.startTime = Date.now();
        requestAnimationFrame(this.main);
    }

    public async waitAsyncResouces(asyncRes: IAsyncResource) {
        await asyncRes.asyncFinished;
    }

    public stop() {
        this.stopped = true;
    }

    public start() {
        this.stopped = false;
        requestAnimationFrame(this.main);
    }

    public createFrameBuffer(): FrameBuffer {
        const fbo = new FrameBuffer(this.gl);
        this.fbos.push(fbo);
        return fbo;
    }

    public handleResource(scene: Scene) {
        const objectPromises = [];
        for (const object of scene.objects) {
            const promise = object.asyncFinished();
            if (!!promise) {
                objectPromises.push(
                    promise.then(() => {
                        for (const child of object.children) {
                            scene.addObject(child);
                        }
                    }),
                );
            }
        }
        return Promise.all(objectPromises).then(() => {
            const texturePromises = [];
            for (const object of scene.objects) {
                if (object instanceof Mesh) {
                    for (const material of (object as Mesh).materials) {
                        const _material: any = material;
                        for (const textureGetter of _material.asyncResources) {
                            const promise: Promise<any> = textureGetter(
                                _material,
                            );
                            if (!!promise) {
                                texturePromises.push(
                                    promise.then((texture: Texture) => {
                                        texture.apply(this.gl);
                                        return Promise.resolve(texture);
                                    }),
                                );
                            }
                        }
                    }
                }
            }
            return Promise.all(texturePromises);
        });
    }

    public forceDeferred() {
        this.isDeferred = true;
    }

    public render(scene: Scene, camera: Camera, adaptCanvasAspectRatio = true) {
        if (adaptCanvasAspectRatio) {
            camera.setAspectRadio(this.canvas.width / this.canvas.height);
        }
        if (this.scenes.indexOf(scene) !== -1 || this.preloadRes.length > 0) {
            return;
        }
        this.scenes.push(scene);

        this.handleResource(scene)
            .then(() => {
                const materials = [];
                for (const obj of scene.objects) {
                    if (obj instanceof Mesh) {
                        const mesh = obj as Mesh;
                        for (const material of mesh.materials) {
                            if (materials.indexOf(material) === -1) {
                                materials.push(material);
                            }
                        }
                    }
                }

                for (const object of scene.objects) {
                    if (object instanceof Mesh) {
                        Graphics.copyDataToVertexBuffer(
                            this.gl,
                            (object as Mesh).geometry,
                        );
                    }
                }

                const shadowPreProcess = new ShadowPreProcess(
                    this.gl,
                    this.ext,
                    scene,
                );

                // TODO: Dynamic processor strategy
                const processor: IProcessor = this.isDeferred
                    ? new DeferredProcessor(this.gl, this.ext, scene, camera)
                    : new ForwardProcessor(this.gl, this.ext, scene, camera);

                scene.programSetUp = true;
                this.renderQueue.push((deltaTime: number) => {
                    scene.update(deltaTime);
                    if (!this.isDeferred) {
                        shadowPreProcess.process(scene, camera, materials);
                    }
                    processor.process(scene, camera, materials);
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    private renderLight(light, scene) {
        // Undo
    }

    private main = () => {
        const now = Date.now();
        for (const renderCommand of this.renderQueue) {
            renderCommand(this.frameRate);
        }
        if (this.stopped) {
            return;
        }
        const delta = now - this.duration - this.startTime;
        this.currentFPS = 1000 / delta;
        this.duration = now - this.startTime;
        requestAnimationFrame(this.main);
    }
}
