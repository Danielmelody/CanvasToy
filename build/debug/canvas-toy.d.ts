declare namespace CanvasToy {
    let debug: boolean;
    interface Vec2Array extends GLM.IArray {
    }
    interface Vec3Array extends GLM.IArray {
    }
    interface Vec4Array extends GLM.IArray {
    }
    interface Mat2Array extends GLM.IArray {
    }
    interface Mat2dArray extends GLM.IArray {
    }
    interface Mat3Array extends GLM.IArray {
    }
    interface Mat4Array extends GLM.IArray {
    }
    interface QuatArray extends GLM.IArray {
    }
    enum DataType {
        float = 0,
        int = 1,
        vec2 = 2,
        vec3 = 3,
        vec4 = 4,
        mat2 = 5,
        mat3 = 6,
        mat4 = 7,
    }
}
declare namespace CanvasToy {
    class Object3d {
        tag: string;
        scene: Scene;
        children: Object3d[];
        objectToWorldMatrix: Mat4Array;
        protected _parent: Object3d;
        protected _localMatrix: Mat4Array;
        protected _matrix: Mat4Array;
        protected _localPosition: Vec3Array;
        protected _localRotation: QuatArray;
        protected _localScaling: Vec3Array;
        protected _position: Vec3Array;
        protected _scaling: Vec3Array;
        protected _rotation: QuatArray;
        protected updateEvents: Function[];
        protected startEvents: Function[];
        constructor(tag?: string);
        parent: Object3d;
        readonly localMatrix: Mat4Array;
        readonly matrix: Mat4Array;
        localPosition: Vec3Array;
        position: Vec3Array;
        localRotation: QuatArray;
        rotation: QuatArray;
        localScaling: Vec3Array;
        scaling: Vec3Array;
        setTransformFromParent(): void;
        registUpdate(updateFunction: Function): void;
        registStart(updateFunction: Function): void;
        start(): void;
        update(dt: number): void;
        translate(delta: Vec3Array): void;
        rotateX(angle: number): void;
        rotateY(angle: number): void;
        rotateZ(angle: number): void;
        protected genOtherMatrixs(): void;
        private composeFromLocalMatrix();
        private composeFromGlobalMatrix();
        private applyToChildren();
    }
}
declare namespace CanvasToy {
    abstract class Camera extends Object3d {
        projectionMatrix: Mat4Array;
        constructor();
        abstract adaptTargetRadio(target: {
            width: number;
            height: number;
        }): any;
    }
}
declare namespace CanvasToy {
    class OrthoCamera extends Camera {
        left: number;
        right: number;
        bottom: number;
        top: number;
        near: number;
        far: number;
        constructor(left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number);
        genOtherMatrixs(): void;
        adaptTargetRadio(target: {
            width: number;
            height: number;
        }): void;
    }
}
declare namespace CanvasToy {
    class PerspectiveCamera extends Camera {
        aspect: number;
        fovy: number;
        near: number;
        far: number;
        constructor(aspect?: number, fovy?: number, near?: number, far?: number);
        genOtherMatrixs(): void;
        adaptTargetRadio(target: {
            width: number;
            height: number;
        }): void;
    }
}
declare namespace CanvasToy {
    class Geometry {
        attributes: {
            position: Attribute;
            uv: Attribute;
            normal: Attribute;
            flatNormal: Attribute;
        };
        faces: Faces;
        constructor(gl: WebGLRenderingContext);
        setAttribute(name: any, attribute: Attribute): void;
        addVertex(vertex: any): void;
        removeAttribute(name: string): void;
        getVertexByIndex(index: number): any;
        getTriangleByIndex(triangleIndex: number): any[];
        generateFlatNormal(): void;
    }
}
declare namespace CanvasToy {
    class Mesh extends Object3d {
        geometry: Geometry;
        materials: Material[];
        maps: Texture[];
        normalMatrix: Mat4Array;
        constructor(geometry: Geometry, materials: Material[]);
        drawMode(gl: WebGLRenderingContext): number;
        genOtherMatrixs(): void;
    }
}
declare namespace CanvasToy {
    interface IProgramSource {
        vertexShader?: string;
        fragmentShader?: string;
    }
    interface IProgramcomponentBuilder {
        faces?: Faces;
        uniforms?: any;
        attributes?: any;
        textures?: any;
        prefix?: string[];
    }
    class Faces {
        buffer: WebGLBuffer;
        data: number[];
        constructor(gl: WebGLRenderingContext, data: number[]);
    }
    interface IUniform {
        type: DataType;
        updator: (mesh?, camera?) => any;
    }
    class Attribute {
        size: number;
        data: number[];
        type: number;
        index: number;
        stride: number;
        buffer: WebGLBuffer;
        gl: WebGLRenderingContext;
        constructor(gl: WebGLRenderingContext, paramter: {
            type: number;
            size?: number;
            data?: number[];
            stride?: number;
        });
    }
    class Program implements IProgramcomponentBuilder {
        gl: WebGLRenderingContext;
        faces: Faces;
        enableDepthTest: boolean;
        enableStencilTest: boolean;
        uniforms: {};
        attributes: {};
        attributeLocations: {};
        attribute0: string;
        webGlProgram: WebGLProgram;
        textures: Texture[];
        vertexPrecision: string;
        fragmentPrecision: string;
        prefix: string[];
        drawMode: (gl: WebGLRenderingContext) => number;
        private componentBuilder;
        private source;
        constructor(gl: WebGLRenderingContext, source: IProgramSource, componentBuilder: (mesh: Mesh, scene: Scene, camera: Camera, materiel: Material) => IProgramcomponentBuilder);
        make(gl: WebGLRenderingContext, mesh: Mesh, scene: Scene, camera: Camera, material: Material): void;
        pass(mesh: Mesh, camera: Camera, materiel: Material): void;
        checkState(): void;
        setAttribute0(name: string): void;
        addUniform(nameInShader: any, uniform: IUniform): void;
        addAttribute(nameInShader: any, attribute: Attribute): void;
        private getUniformLocation(name);
        private addPassProcesser(parameter);
        private getAttribLocation(name);
    }
    const defaultProgramPass: (mesh: Mesh, scene: Scene, camera: Camera, material: Material) => {
        faces: Faces;
        textures: {
            uMainTexture: Texture;
        };
        uniforms: {
            modelViewProjectionMatrix: {
                type: DataType;
                updator: (mesh: Mesh, camera: Camera) => Float32Array;
            };
            color: {
                type: DataType;
                updator: () => Vec4Array;
            };
            ambient: {
                type: DataType;
                updator: () => Vec3Array;
            };
            normalMatrix: {
                type: DataType;
                updator: () => Float32Array;
            };
            eyePos: {
                type: DataType;
                updator: (mesh: Mesh, camera: Camera) => GLM.IArray;
            };
        };
        attributes: {
            position: Attribute;
            aMainUV: Attribute;
            aNormal: Attribute;
        };
    };
}
declare module CanvasToy {
    var calculators__lambert_glsl: string;
    var calculators__phong_glsl: string;
    var env_map_vert: string;
    var interploters__gouraud_frag: string;
    var interploters__gouraud_vert: string;
    var interploters__phong_frag: string;
    var interploters__phong_vert: string;
}
declare namespace CanvasToy {
    class Texture {
        glTexture: WebGLTexture;
        textureCoord: number[];
        unit: number;
        dataCompleted: boolean;
        isReadyToUpdate: boolean;
        image?: HTMLImageElement;
        type: number;
        format: number;
        wrapS: number;
        wrapT: number;
        magFilter: number;
        minFilter: number;
        constructor(gl: WebGLRenderingContext, image?: HTMLImageElement);
        setUpTextureData(gl: WebGLRenderingContext): boolean;
    }
}
declare namespace CanvasToy {
    let colors: {
        black: GLM.IArray;
        gray: GLM.IArray;
        red: GLM.IArray;
        white: GLM.IArray;
    };
    enum InterplotationMethod {
        Flat = 0,
        Gouraud = 1,
        Phong = 2,
    }
    enum LightingMode {
        Lambort = 0,
        Phong = 1,
        Cell = 2,
        Blinn_Phong = 3,
        Physical = 4,
    }
    interface IMaterial {
        mainTexture?: Texture;
        color?: Vec4Array;
        interplotationMethod?: InterplotationMethod;
        lightingMode?: LightingMode;
        program?: Program;
    }
    class Material implements IMaterial {
        program: Program;
        color: Vec4Array;
        mainTexture: Texture;
        ambient: Vec3Array;
        ambientMap: Texture;
        diffuse: Vec3Array;
        diffuseMap: Texture;
        specular: Vec3Array;
        specularMap: Texture;
        opacity: Vec3Array;
        opacityMap: Texture;
        interplotationMethod: InterplotationMethod;
        lightingMode: LightingMode;
        bumpMap: Texture;
        normalMap: Texture;
        reflactivity: number;
        shaderSource: {
            vertexShader: string;
            fragmentShader: string;
        };
        constructor(gl: WebGLRenderingContext, paramter?: IMaterial);
        configShader(): void;
    }
}
declare namespace CanvasToy {
    class Water extends Mesh {
        constructor(gl: WebGLRenderingContext);
    }
}
declare namespace CanvasToy {
    class CubeGeometry extends Geometry {
        constructor(gl: WebGLRenderingContext);
    }
}
declare namespace CanvasToy {
    class RectGeometry extends Geometry {
        constructor(gl: WebGLRenderingContext);
    }
}
declare namespace CanvasToy {
}
declare namespace CanvasToy {
    abstract class Light extends Object3d {
        diffuse: Vec3Array;
        specular: Vec3Array;
        idensity: number;
        shadowRtt: Texture;
        projectCamera: Camera;
        constructor();
    }
}
declare namespace CanvasToy {
    class DirectionalLight extends Light {
        private _direction;
        direction: Vec3Array;
        constructor();
    }
}
declare namespace CanvasToy {
    class PointLight extends Light {
        constructor();
    }
}
declare namespace CanvasToy {
}
declare namespace CanvasToy {
    class OBJLoader {
        static load(gl: WebGLRenderingContext, url: string, onload: (meshes: Object3d) => void): void;
        protected static commentPattern: RegExp;
        protected static numberPattern: RegExp;
        protected static faceSplitVertPattern: RegExp;
        protected static facePerVertPattern: RegExp;
        protected static objectSplitPattern: RegExp;
        protected static vertexPattern: RegExp;
        protected static uvPattern: RegExp;
        protected static normalPattern: RegExp;
        protected static indexPattern: RegExp;
        protected static fetch(url: string, onload: (content: string) => void): void;
        protected static praiseAttibuteLines(lines: any): number[][];
        protected static parseAsTriangle(faces: string[], forEachFace: (face: string[]) => void): void;
        protected static buildUpMeshes(gl: WebGLRenderingContext, content: string, unIndexedPositions: number[][], unIndexedUVs: number[][], unIndexedNormals: number[][]): Object3d;
    }
}
declare namespace CanvasToy {
    enum BufferUsage {
        Color = 0,
        Depth = 1,
        Stencil = 2,
    }
    class RenderBuffer {
        readonly frameBuffer: FrameBuffer;
        attachment: number;
        glRenderBuffer: WebGLRenderbuffer;
        targetTexture: Texture;
        constructor(gl: WebGLRenderingContext, frameBuffer: FrameBuffer);
        toTexture(gl: WebGLRenderingContext): Texture;
    }
    class FrameBuffer {
        glFramebuffer: WebGLFramebuffer;
        rbos: any;
        constructor(gl: WebGLRenderingContext);
        getRenderBuffer(usage: BufferUsage): RenderBuffer;
        enableRenderBuffer(gl: WebGLRenderingContext, usage: BufferUsage): void;
    }
}
declare namespace CanvasToy {
    enum RenderMode {
        Dynamic = 0,
        Static = 1,
    }
    class Renderer {
        readonly canvas: HTMLCanvasElement;
        readonly gl: WebGLRenderingContext;
        renderMode: RenderMode;
        preloadRes: any[];
        usedTextureNum: number;
        renderTargets: Texture[];
        vertPrecision: string;
        fragPrecision: string;
        isAnimating: boolean;
        renderQueue: Function[];
        fbos: FrameBuffer[];
        scenes: Scene[];
        cameras: Camera[];
        frameRate: number;
        private stopped;
        constructor(canvas: HTMLCanvasElement);
        createFrameBuffer(): FrameBuffer;
        renderFBO(scene: Scene, camera: Camera): void;
        render(scene: Scene, camera: Camera): void;
        buildSingleRender(scene: Scene, camera: Camera): void;
        makeMeshPrograms(scene: Scene, mesh: Mesh, camera: Camera): void;
        loadTexture(program: Program, sampler: string, texture: Texture): void;
        addTextureToProgram(program: Program, sampler: string, texture: Texture): void;
        setUplights(scene: Scene, material: Material, mesh: Mesh, camera: Camera): void;
        private copyDataToVertexBuffer(geometry);
        private renderLight(light, scene);
        private renderObject(camera, object);
        private main;
        private initMatrix();
    }
}
declare namespace CanvasToy {
    class Scene {
        objects: Object3d[];
        lights: Light[];
        ambientLight: Vec3Array;
        openLight: boolean;
        enableShadowMap: boolean;
        clearColor: number[];
        programSetUp: boolean;
        constructor();
        update(dt: number): void;
        addObject(object: Object3d): void;
        removeObject(object: Object3d): void;
        addLight(light: Light): void;
    }
}
declare namespace CanvasToy {
    class CubeTexture extends Texture {
        xneg: HTMLImageElement;
        xpos: HTMLImageElement;
        yneg: HTMLImageElement;
        ypos: HTMLImageElement;
        zneg: HTMLImageElement;
        zpos: HTMLImageElement;
        private count;
        constructor(gl: WebGLRenderingContext, xneg: HTMLImageElement, xpos: HTMLImageElement, yneg: HTMLImageElement, ypos: HTMLImageElement, zneg: HTMLImageElement, zpos: HTMLImageElement);
        setUpTextureData(gl: WebGLRenderingContext): boolean;
        private onLoad();
    }
}
declare namespace CanvasToy {
    class Texture2D extends Texture {
        constructor(gl: WebGLRenderingContext, image: HTMLImageElement);
        setUpTextureData(gl: WebGLRenderingContext): boolean;
    }
}
declare namespace CanvasToy {
    enum ShaderType {
        VertexShader = 0,
        FragmentShader = 1,
    }
    function mixin(toObject: Object, fromObject: Object): void;
    function initWebwebglContext(canvas: any): WebGLRenderingContext;
    function getDomScriptText(script: HTMLScriptElement): string;
    function createEntileShader(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram;
}
