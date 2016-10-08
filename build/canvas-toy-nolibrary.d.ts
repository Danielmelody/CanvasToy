declare module CanvasToy {
    var engine: Renderer;
    var gl: WebGLRenderingContext;
    var debug: boolean;
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
declare module CanvasToy {
    abstract class Object3d {
        name: string;
        scene: Scene;
        localMatrix: Mat4Array;
        matrix: Mat4Array;
        private _position;
        position: Vec4Array;
        private _localScale;
        localScale: Vec3Array;
        private _rotation;
        rotation: Vec3Array;
        protected updateEvents: Array<Function>;
        protected startEvents: Array<Function>;
        constructor();
        abstract apply(): any;
        registUpdate(updateFunction: Function): void;
        registStart(updateFunction: Function): void;
        start(): void;
        update(dt: number): void;
        translate(deltaX: number, deltaY: number, deltaZ: number): void;
        rotateX(angle: number): void;
        rotateY(angle: number): void;
        rotateZ(angle: number): void;
    }
}
declare module CanvasToy {
    class Node extends Object3d {
        children: Array<Node>;
        parent: Node;
        constructor();
        addChild(child: Node): void;
        apply(): void;
        compuseMatrixs(): void;
    }
}
declare module CanvasToy {
    abstract class Camera extends Node {
        projectionMatrix: Mat4Array;
        constructor();
        abstract adaptTargetRadio(target: {
            width: number;
            height: number;
        }): any;
    }
}
declare module CanvasToy {
    class OrthoCamera extends Camera {
        left: number;
        right: number;
        bottom: number;
        top: number;
        near: number;
        far: number;
        constructor(left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number);
        apply(): void;
        adaptTargetRadio(target: {
            width: number;
            height: number;
        }): void;
    }
}
declare module CanvasToy {
    class PerspectiveCamera extends Camera {
        aspect: number;
        fovy: number;
        near: number;
        far: number;
        constructor(aspect?: number, fovy?: number, near?: number, far?: number);
        apply(): void;
        adaptTargetRadio(target: {
            width: number;
            height: number;
        }): void;
    }
}
declare module CanvasToy {
    class Geometry {
        attributes: {
            position: Attribute;
            uv: Attribute;
            normal: Attribute;
            flatNormal: Attribute;
        };
        faces: {
            data: any[];
            buffer: WebGLBuffer;
        };
        constructor();
        setAttribute(name: any, attribute: Attribute): void;
        addVertex(vertex: any): void;
        removeAttribute(name: string): void;
        getVertexByIndex(index: number): any;
        getTriangleByIndex(triangleIndex: number): any[];
        generateFlatNormal(): void;
    }
}
declare module CanvasToy {
    abstract class Texture {
        image: HTMLImageElement;
        type: number;
        format: number;
        wrapS: number;
        wrapT: number;
        magFilter: number;
        minFilter: number;
        glTexture: WebGLTexture;
        textureCoord: number[];
        unit: number;
        dataCompleted: boolean;
        isReadyToUpdate: boolean;
        constructor(image?: HTMLImageElement, type?: number, format?: number, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number);
        setUpTextureData(): boolean;
    }
}
declare module CanvasToy {
    var colors: {
        white: number[];
        black: number[];
        gray: number[];
        red: number[];
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
        mainTexture: Texture;
        color: Vec4Array;
        interplotationMethod: InterplotationMethod;
        lightingMode: LightingMode;
        program: Program;
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
        constructor(paramter?: IMaterial);
        configShader(): {
            vertexShader: string;
            fragmentShader: string;
        };
    }
}
declare module CanvasToy {
    interface ProgramPass {
        faces?: Faces;
        uniforms?: any;
        attributes?: any;
        textures?: any;
        vertexShader?: string;
        fragmentShader?: string;
        prefix?: string[];
    }
    class Faces {
        data: number[];
        buffer: WebGLBuffer;
        constructor(data: number[]);
    }
    class Attribute {
        size: number;
        data: number[];
        type: number;
        index: number;
        stride: number;
        buffer: WebGLBuffer;
        constructor(paramter: {
            type: number;
            size?: number;
            data?: number[];
            stride?: number;
        });
    }
    class Program implements ProgramPass {
        faces: Faces;
        enableDepthTest: boolean;
        enableStencilTest: boolean;
        uniforms: {};
        attributes: {};
        attributeLocations: {};
        attribute0: string;
        webGlProgram: WebGLProgram;
        drawMode: number;
        textures: Array<Texture>;
        vertexPrecision: string;
        fragmentPrecision: string;
        vertexShader: string;
        fragmentShader: string;
        prefix: string[];
        private passings;
        constructor(passing: (mesh: Mesh, scene: Scene, camera: Camera) => ProgramPass);
        make(material: Material, mesh: Mesh, scene: Scene, camera: Camera): void;
        addPassing(passing: (mesh: Mesh, scene: Scene, camera: Camera) => ProgramPass): void;
        private rePass(parameter);
        checkState(): void;
        setAttribute0(name: string): void;
        addUniform(nameInShader: any, uniform: {
            type: DataType;
            updator: (mesh?, camera?) => any;
        }): void;
        addAttribute(nameInShader: any, attribute: Attribute): void;
        private getUniformLocation(name);
        private getAttribLocation(name);
    }
}
declare module CanvasToy {
    class Mesh extends Node {
        drawMode: number;
        geometry: Geometry;
        materials: Array<Material>;
        maps: Texture[];
        normalMatrix: Mat4Array;
        constructor(geometry: Geometry, materials: Array<Material>);
        apply(): void;
    }
}
declare module CanvasToy {
    class Water extends Mesh {
        constructor();
    }
}
declare module CanvasToy {
    class CubeGeometry extends Geometry {
        constructor();
    }
}
declare module CanvasToy {
    class RectGeometry extends Geometry {
        constructor();
    }
}
declare module CanvasToy {
    class SphereGeometry extends Geometry {
        radius: number;
        perVertDistance: number;
        constructor(radius: number, perVertDistance: number);
    }
}
declare module CanvasToy {
    abstract class Light extends Object3d {
        diffuse: Vec3Array;
        specular: Vec3Array;
        idensity: number;
        uniformLocation: any;
        constructor();
    }
}
declare module CanvasToy {
    class DirectionalLight extends Light {
        constructor();
        apply(): void;
    }
}
declare module CanvasToy {
    class PointLight extends Light {
        constructor();
        apply(): void;
    }
}
declare module CanvasToy {
    module OBJLoader {
        function load(url: string, onload: (meshes: Node) => void): void;
    }
}
declare module CanvasToy {
    function setCanvas(canvas: HTMLCanvasElement): void;
    enum RenderMode {
        Dynamic = 0,
        Static = 1,
    }
    class Renderer {
        canvas: HTMLCanvasElement;
        renderMode: RenderMode;
        preloadRes: any[];
        usedTextureNum: number;
        renderTargets: Array<RenderTargetTexture>;
        vertPrecision: string;
        fragPrecision: string;
        isAnimating: boolean;
        renderQueue: Array<Function>;
        scenes: Array<Scene>;
        cameras: Array<Camera>;
        frameRate: number;
        private stopped;
        main: () => void;
        constructor(canvas: HTMLCanvasElement);
        renderToTexture(scene: Scene, camera: Camera): RenderTargetTexture;
        render(scene: Scene, camera: Camera): void;
        buildScene(scene: Scene, camera: Camera): void;
        makeMeshPrograms(scene: Scene, mesh: Mesh, camera: Camera): void;
        loadTexture(program: Program, sampler: string, texture: Texture): void;
        addTexture(program: Program, sampler: string, texture: Texture): void;
        setUplights(scene: Scene, material: Material, mesh: Mesh, camera: Camera): void;
        private copyDataToVertexBuffer(geometry);
        private renderObject(camera, object);
        private initMatrix();
    }
}
declare module CanvasToy {
    class Scene {
        objects: Array<Object3d>;
        lights: Array<Light>;
        ambientLight: Vec3Array;
        openLight: boolean;
        enableShadowMap: boolean;
        clearColor: Array<number>;
        programSetUp: boolean;
        constructor();
        update(dt: number): void;
        addObject(object: Object3d): void;
        removeObject(object: Object3d): void;
        addLight(light: Light): void;
    }
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
declare module CanvasToy {
    class CubeTexture extends Texture {
        xneg: HTMLImageElement;
        xpos: HTMLImageElement;
        yneg: HTMLImageElement;
        ypos: HTMLImageElement;
        zneg: HTMLImageElement;
        zpos: HTMLImageElement;
        private count;
        constructor(xneg: HTMLImageElement, xpos: HTMLImageElement, yneg: HTMLImageElement, ypos: HTMLImageElement, zneg: HTMLImageElement, zpos: HTMLImageElement, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number);
        private onLoad();
        setUpTextureData(): boolean;
    }
}
declare module CanvasToy {
    class RenderTargetTexture extends Texture {
        scene: Scene;
        camera: Camera;
        frameBuffer: WebGLFramebuffer;
        depthBuffer: WebGLRenderbuffer;
        stencilBuffer: WebGLRenderbuffer;
        constructor(scene: Scene, camera: Camera);
    }
}
declare module CanvasToy {
    class Texture2D extends Texture {
        constructor(image?: HTMLImageElement, format?: number, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number);
        setUpTextureData(): boolean;
    }
}
declare module CanvasToy {
    enum ShaderType {
        VertexShader = 0,
        FragmentShader = 1,
    }
    function mixin(toObject: Object, fromObject: Object): void;
    function initWebwebglContext(canvas: any): WebGLRenderingContext;
    function getDomScriptText(script: HTMLScriptElement): string;
    function createEntileShader(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram;
}
