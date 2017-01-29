declare namespace CanvasToy {
    let debug: boolean;
    type Vec2Array = GLM.IArray;
    type Vec3Array = GLM.IArray;
    type Vec4Array = GLM.IArray;
    type Mat2Array = GLM.IArray;
    type Mat2dArray = GLM.IArray;
    type Mat3Array = GLM.IArray;
    type Mat4Array = GLM.IArray;
    type QuatArray = GLM.IArray;
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
    function uniform<DecoratorClass>(name: string, type: DataType, updator?: (obj, camera) => {}): (proto: any, key: any) => void;
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
        name?: string;
        type: DataType;
        updator: (object?: Object3d, camera?: Camera) => any;
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
        private componentBuilder;
        private source;
        constructor(gl: WebGLRenderingContext, source: IProgramSource, componentBuilder: (mesh: Mesh, scene: Scene, camera: Camera, materiel: Material) => IProgramcomponentBuilder);
        drawMode: (gl: WebGLRenderingContext) => number;
        setFragmentShader(fragmentShader: string): this;
        setVertexShader(vertexShader: string): this;
        make(gl: WebGLRenderingContext, mesh: Mesh, scene: Scene, camera: Camera, material: Material): this;
        pass(mesh: Mesh, camera: Camera, materiel: Material): this;
        checkState(): this;
        setAttribute0(name: string): this;
        deleteUniform(nameInShader: any): this;
        addUniform(nameInShader: any, uniform: IUniform): void;
        deleteAttribute(nameInShader: string): this;
        addAttribute(nameInShader: string, attribute: Attribute): this;
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
                updator: (mesh: Mesh, camera: Camera) => GLM.IArray;
            };
            color: {
                type: DataType;
                updator: () => GLM.IArray;
            };
            materialDiff: {
                type: DataType;
                updator: () => GLM.IArray;
            };
            materialSpec: {
                type: DataType;
                updator: () => GLM.IArray;
            };
            ambient: {
                type: DataType;
                updator: () => GLM.IArray;
            };
            normalMatrix: {
                type: DataType;
                updator: () => Float32Array;
            };
            eyePos: {
                type: DataType;
                updator: (object3d: Object3d, camera: Camera) => GLM.IArray;
            };
        };
        attributes: {
            position: Attribute;
            aMainUV: Attribute;
            aNormal: Attribute;
        };
    };
}
declare namespace CanvasToy {
    class Object3d {
        tag: string;
        scene: Scene;
        children: Object3d[];
        depredations: string[];
        objectToWorldMatrix: Mat4Array;
        protected _matrix: Mat4Array;
        protected _parent: Object3d;
        protected _localMatrix: Mat4Array;
        protected _localPosition: Vec3Array;
        protected _localRotation: QuatArray;
        protected _localScaling: Vec3Array;
        protected _position: Vec3Array;
        protected _scaling: Vec3Array;
        protected _rotation: QuatArray;
        protected updateEvents: Function[];
        protected startEvents: Function[];
        constructor(tag?: string);
        readonly parent: Object3d;
        setParent(_parent: Object3d): this;
        readonly localMatrix: Mat4Array;
        readonly matrix: Mat4Array;
        readonly localPosition: Vec3Array;
        setLocalPosition(_localPosition: Vec3Array): this;
        readonly position: Vec3Array;
        setPosition(_position: Vec3Array): this;
        readonly localRotation: QuatArray;
        setLocalRotation(_localRotation: QuatArray): this;
        readonly rotation: QuatArray;
        setRotation(_rotation: QuatArray): this;
        readonly localScaling: Vec3Array;
        setLocalScaling(_localScaling: Vec3Array): void;
        readonly scaling: Vec3Array;
        setScaling(_scaling: Vec3Array): this;
        setTransformFromParent(): void;
        registUpdate(updateFunction: Function): void;
        registStart(updateFunction: Function): void;
        start(): void;
        update(dt: number): void;
        translate(delta: Vec3Array): void;
        rotateX(angle: number): void;
        rotateY(angle: number): void;
        rotateZ(angle: number): void;
        handleUniformProperty(): void;
        protected genOtherMatrixs(): void;
        private composeFromLocalMatrix();
        private composeFromGlobalMatrix();
        private applyToChildren();
    }
}
declare namespace CanvasToy {
    abstract class Camera extends Object3d {
        readonly projectionMatrix: GLM.IArray;
        protected _projectionMatrix: Mat4Array;
        constructor();
        setProjectionMatrix(projectionMatrix: Mat4Array): this;
        abstract adaptTargetRadio(target: {
            width: number;
            height: number;
        }): any;
    }
}
declare namespace CanvasToy {
    class OrthoCamera extends Camera {
        protected _left: number;
        protected _right: number;
        protected _bottom: number;
        protected _top: number;
        protected _near: number;
        protected _far: number;
        constructor(parameters: {
            left?: number;
            right?: number;
            bottom?: number;
            top?: number;
            near?: number;
            far?: number;
        });
        readonly left: number;
        readonly right: number;
        readonly top: number;
        readonly bottom: number;
        readonly near: number;
        readonly far: number;
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
        readonly geometry: Geometry;
        readonly materials: Material[];
        maps: Texture[];
        normalMatrix: Mat4Array;
        constructor(geometry: Geometry, materials: Material[]);
        drawMode(gl: WebGLRenderingContext): number;
        genOtherMatrixs(): void;
    }
}
declare module CanvasToy {
    var calculators__blinn_phong_glsl: string;
    var calculators__phong_glsl: string;
    var definitions__light_glsl: string;
    var env_map_vert: string;
    var interploters__gouraud_frag: string;
    var interploters__gouraud_vert: string;
    var interploters__phong_frag: string;
    var interploters__phong_vert: string;
}
declare function builder(_thisArg: any): any;
declare namespace CanvasToy {
    class Texture {
        readonly glTexture: WebGLTexture;
        dataCompleted: boolean;
        isReadyToUpdate: boolean;
        private _unit;
        private _image;
        private _target;
        private _format;
        private _wrapS;
        private _wrapT;
        private _magFilter;
        private _minFilter;
        private _type;
        constructor(gl: WebGLRenderingContext, image?: HTMLImageElement);
        readonly unit: number;
        readonly image: HTMLImageElement;
        readonly target: number;
        readonly format: number;
        readonly wrapS: number;
        readonly wrapT: number;
        readonly magFilter: number;
        readonly minFilter: number;
        readonly type: number;
        setUnit(_unit: number): this;
        setImage(_image: HTMLImageElement): this;
        setTarget(_target: number): this;
        setFormat(_format: number): this;
        setWrapS(_wrapS: number): this;
        setWrapT(_wrapT: number): this;
        setMagFilter(_magFilter: number): this;
        setMinFilter(_minFilter: number): this;
        setType(_type: number): this;
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
    interface IMaterial {
        mainTexture?: Texture;
        color?: Vec3Array;
        diffuse?: Vec3Array;
        specular?: Vec3Array;
        interplotationMethod?: InterplotationMethod;
        lightingMode?: LightingMode;
        program?: Program;
    }
    abstract class Material implements IMaterial {
        program: Program;
        color: Vec3Array;
        mainTexture: Texture;
        ambient: Vec3Array;
        ambientMap: Texture;
        diffuse: Vec3Array;
        diffuseMap: Texture;
        specular: Vec3Array;
        specularMap: Texture;
        opacity: Vec3Array;
        opacityMap: Texture;
        bumpMap: Texture;
        normalMap: Texture;
        reflactivity: number;
        constructor(gl: WebGLRenderingContext, paramter?: IMaterial);
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
        protected _color: GLM.IArray;
        protected _idensity: number;
        protected _position: Vec3Array;
        protected _shadowRtt: Texture;
        protected _projectCamera: Camera;
        constructor();
        setColor(color: Vec3Array): this;
        setIdensity(idensity: number): this;
        readonly color: GLM.IArray;
        readonly idensity: any;
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
    class StandardMaterial extends Material {
        constructor(gl: WebGLRenderingContext, paramter?: IMaterial);
    }
}
declare namespace CanvasToy {
    enum AttachmentType {
        Texture = 0,
        RenderBuffer = 1,
    }
    class Attachment {
        readonly frameBuffer: FrameBuffer;
        glRenderBuffer: WebGLRenderbuffer;
        targetTexture: Texture;
        readonly attachmentCode: (gl) => number;
        private _innerFormatForBuffer;
        private _innerFormatForTexture;
        private _type;
        private _isAble;
        constructor(frameBuffer: FrameBuffer, attachmentCode: (gl: WebGLRenderingContext) => number);
        readonly innerFormatForBuffer: number;
        readonly innerFormatForTexture: number;
        readonly type: AttachmentType;
        readonly isAble: boolean;
        enable(): this;
        disable(): this;
        setInnerFormatForBuffer(innerFormatForBuffer: number): this;
        setInnerFormatForTexture(innerFormatForTexture: number): this;
        setType(gl: WebGLRenderingContext, type: AttachmentType): this;
        toTexture(gl: WebGLRenderingContext): Texture;
    }
    class FrameBuffer {
        glFramebuffer: WebGLFramebuffer;
        attachments: {
            color: Attachment;
            depth: Attachment;
            stencil: Attachment;
        };
        constructor(gl: WebGLRenderingContext);
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
        readonly ext: any;
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
        addObject(object: Object3d): this;
        removeObject(object: Object3d): this;
        addLight(light: Light): this;
    }
}
declare namespace CanvasToy {
    enum InterplotationMethod {
        Flat = 0,
        Gouraud = 1,
        Phong = 2,
    }
    enum LightingMode {
        Phong = 0,
        Cell = 1,
        Blinn_Phong = 2,
        Physical = 3,
    }
    class StandardShaderBuilder {
        private _definitions;
        private _interplotationMethod;
        private _interplotationVert;
        private _interplotationFrag;
        private _lightingMode;
        private _lightingModeSource;
        setInterplotationMethod(method: InterplotationMethod): this;
        setLightingMode(lightingMode: LightingMode): this;
        build(gl: WebGLRenderingContext): Program;
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
