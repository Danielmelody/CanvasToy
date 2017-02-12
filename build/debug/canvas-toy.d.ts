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
    const resourcesCache: {};
}
declare namespace CanvasToy {
    function uniform<DecoratorClass>(name: string, type: DataType, updator?: (obj, camera) => {}): (proto: any, key: any) => void;
    function readyRequire<IAsyncResource>(proto: any, key: any): void;
}
declare namespace CanvasToy {
    interface IProgramSource {
        vertexShader?: string;
        fragmentShader?: string;
    }
    interface IProgramPass {
        faces?: (mesh: Mesh) => Faces;
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
        updator: (object?: Object3d, camera?: Camera, material?: Material) => any;
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
    class Program implements IProgramPass {
        gl: WebGLRenderingContext;
        faces: (mesh: Mesh) => Faces;
        enableDepthTest: boolean;
        enableStencilTest: boolean;
        uniforms: {};
        attributes: {};
        attributeLocations: {};
        attribute0: string;
        webGlProgram: WebGLProgram;
        textures: Array<(mesh: Mesh, camera: Camera, material) => Texture>;
        vertexPrecision: string;
        fragmentPrecision: string;
        prefix: string[];
        private passFunctions;
        private source;
        constructor(gl: WebGLRenderingContext, source: IProgramSource, passFunctions: IProgramPass);
        drawMode: (gl: WebGLRenderingContext) => number;
        setFragmentShader(fragmentShader: string): this;
        setVertexShader(vertexShader: string): this;
        make(gl: WebGLRenderingContext, scene: Scene): this;
        pass(mesh: Mesh, camera: Camera, materiel: Material): this;
        checkState(mesh: Mesh): this;
        setAttribute0(name: string): this;
        deleteUniform(nameInShader: any): this;
        addTexture(sampler: string, textureGetter: (mesh, camera, material) => Texture): void;
        addUniform(nameInShader: any, uniform: IUniform): void;
        deleteAttribute(nameInShader: string): this;
        addAttribute(nameInShader: string, attributeFun: (mesh?: Mesh, camera?: Camera, material?: Material) => Attribute): this;
        private getUniformLocation(name);
        private addPassProcesser(parameter);
        private getAttribLocation(name);
    }
    const defaultProgramPass: {
        faces: (mesh: any) => any;
        textures: {
            uMainTexture: (mesh: any, camera: any, material: any) => any;
        };
        uniforms: {
            modelViewProjectionMatrix: {
                type: DataType;
                updator: (mesh: Mesh, camera: Camera) => GLM.IArray;
            };
            materialDiff: {
                type: DataType;
                updator: (mesh: any, camera: any, material: any) => any;
            };
            materialSpec: {
                type: DataType;
                updator: (mesh: any, camera: any, material: any) => any;
            };
            materialSpecExp: {
                type: DataType;
                updator: (mesh: any, camera: any, material: any) => any;
            };
            ambient: {
                type: DataType;
                updator: (mesh: any) => any;
            };
            normalMatrix: {
                type: DataType;
                updator: (mesh: any) => Float32Array;
            };
            eyePos: {
                type: DataType;
                updator: (object3d: Object3d, camera: Camera) => GLM.IArray;
            };
        };
        attributes: {
            position: (mesh: any) => any;
            aMainUV: (mesh: any) => any;
            aNormal: (mesh: any) => any;
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
        setLocalScaling(_localScaling: Vec3Array): this;
        readonly scaling: Vec3Array;
        setScaling(_scaling: Vec3Array): this;
        setTransformFromParent(): this;
        registUpdate(updateFunction: Function): this;
        registStart(updateFunction: Function): this;
        start(): void;
        update(dt: number): void;
        translate(delta: Vec3Array): this;
        rotateX(angle: number): this;
        rotateY(angle: number): this;
        rotateZ(angle: number): this;
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
        abstract compuseProjectionMatrix(): any;
        abstract deCompuseProjectionMatrix(): any;
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
        constructor(parameters?: {
            left?: number;
            right?: number;
            bottom?: number;
            top?: number;
            near?: number;
            far?: number;
        });
        setLeft(left: number): void;
        readonly left: number;
        readonly right: number;
        readonly top: number;
        readonly bottom: number;
        readonly near: number;
        readonly far: number;
        compuseProjectionMatrix(): void;
        deCompuseProjectionMatrix(): void;
        genOtherMatrixs(): void;
        adaptTargetRadio(target: {
            width: number;
            height: number;
        }): void;
    }
}
declare namespace CanvasToy {
    class PerspectiveCamera extends Camera {
        protected _aspect: number;
        protected _fovy: number;
        protected _near: number;
        protected _far: number;
        constructor(parameter?: {
            aspect?: number;
            fovy?: number;
            near?: number;
            far?: number;
        });
        compuseProjectionMatrix(): void;
        readonly aspect: number;
        readonly fovy: number;
        readonly near: number;
        readonly far: number;
        setAspect(aspect: number): this;
        setFovy(fovy: number): this;
        setNear(near: number): this;
        setFar(far: number): this;
        deCompuseProjectionMatrix(): void;
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
        setAttribute(name: any, attribute: Attribute): this;
        addVertex(vertex: any): this;
        removeAttribute(name: string): this;
        getVertexByIndex(index: number): any;
        getTriangleByIndex(triangleIndex: number): any[];
        generateFlatNormal(): this;
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
declare module CanvasToy {
    const calculators__blinn_phong_glsl = "vec3 calculate_light(vec4 position, vec3 normal, vec3 lightPos, vec4 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {\n    vec3 lightDir = normalize(lightPos - position.xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n\n    // replace R * V with N * H\n    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);\n    float specularAngle = max(dot(H, normal), 0.0);\n\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n\nvec3 calculate_spot_light(vec4 position, vec3 normal, vec3 lightPos, vec3 spotDir, vec4 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {\n    vec3 lightDir = normalize(lightPos - position.xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n\n    // replace R * V with N * H\n    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);\n    float specularAngle = max(dot(H, normal), 0.0);\n\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
    const calculators__phong_glsl = "vec3 calculate_light(vec4 position, vec3 normal, vec4 lightPos, vec4 eyePos, vec3 specularLight, vec3 diffuseLight, float shiness, float idensity) {\n    vec3 lightDir = normalize((lightPos - position).xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specularLight * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n\nvec3 calculate_spot_light(vec4 position, vec3 normal, vec4 lightPos, vec4 eyePos, vec3 specularLight, vec3 diffuseLight, float shiness, float idensity) {\n    vec3 lightDir = normalize((lightPos - position).xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specularLight * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
    const definitions__light_glsl = "#ifdef OPEN_LIGHT // light declaration\nstruct Light {\n    vec3 color;\n    float idensity;\n    vec3 position;\n};\n\nstruct SpotLight {\n    vec3 color;\n    float idensity;\n    vec3 direction;\n    vec3 position;\n};\n\n#endif // light declaration\n";
    const env_map_vert = "";
    const interploters__deferred__geometry_frag = "#extension GL_EXT_draw_buffers : require\n\n#ifdef OPEN_LIGHT\nuniform vec4 eyePos;\nvarying vec3 vNormal;\nvarying vec4 vPosition;\nvarying vec4 vDepth;\n#endif\n\n#ifdef USE_TEXTURE\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n#endif\n\nvoid main () {\n\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * texture2D(uMainTexture, vMainUV);\n#endif\n#ifdef OPEN_LIGHT\n    vec3 normal = normalize(vNormal);\n    vec3 totalLighting = ambient;\n    //normal, position, depth, color\n    gl_FragData[0] = vec4(vec3(vDepth), 1.0);\n    gl_FragData[1] = vec4(normalize(vNormal.xyz), 1.0);\n    gl_FragData[2] = vPosition;\n    gl_FragData[3] = vec4(texture2D(uMainTexture, vMainUV).xyz, 1.0);\n#endif\n}\n";
    const interploters__deferred__geometry_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\nvarying vec4 vPosition;\nvarying vec4 vDepth;\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;\n    vPosition = gl_Position;\n    vDepth = gl_Position.z / gl_Position.w;\n#endif\n\n#ifdef USE_TEXTURE\n    vMainUV = aMainUV;\n#endif\n}\n";
    const interploters__depth_phong_frag = "uniform vec3 ambient;\nuniform vec3 depthColor;\n\nuniform float cameraNear;\nuniform float cameraFar;\n\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n\nvoid main () {\n    float originDepth = texture2D(uMainTexture, vMainUV).r;\n    gl_FragColor = vec4(vec3(originDepth * 2.0 - 1.0), 1.0);\n}\n";
    const interploters__depth_phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n    vMainUV = aMainUV;\n}\n";
    const interploters__gouraud_frag = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nvoid main() {\n#ifdef USE_TEXTURE\n    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n#ifdef OPEN_LIGHT\n    totalLighting = ambient;\n    vec3 normal = normalize(vNormal);\n    gl_FragColor = vec4(totalLighting, 1.0);\n#else\n#ifdef USE_COLOR\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#endif\n#endif\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * textureColor;\n#endif\n#ifdef USE_COLOR\n    gl_FragColor = gl_FragColor * color;\n#endif\n}\n";
    const interploters__gouraud_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    totalLighting = ambient;\n    normal = normalize(normal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);\n    }\n    vLightColor = totalLighting;\n#endif\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n";
    const interploters__phong_frag = "uniform vec3 ambient;\nuniform vec3 materialSpec;\nuniform float materialSpecExp;\nuniform vec3 materialDiff;\n\n#ifdef OPEN_LIGHT\nuniform vec4 eyePos;\nvarying vec3 vNormal;\nvarying vec4 vPosition;\n#endif\n\n#ifdef USE_TEXTURE\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n#endif\n\nuniform Light lights[LIGHT_NUM];\nuniform SpotLight spotLights[LIGHT_NUM];\n\nvoid main () {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * texture2D(uMainTexture, vMainUV);\n#endif\n#ifdef OPEN_LIGHT\n    vec3 normal = normalize(vNormal);\n    vec3 totalLighting = ambient;\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(\n            vPosition,\n            normal,\n            lights[index].position,\n            eyePos,\n            materialSpec * lights[index].color,\n            materialDiff * lights[index].color,\n            materialSpecExp,\n            lights[index].idensity\n        );\n    }\n    gl_FragColor *= vec4(totalLighting, 1.0);\n#endif\n}\n";
    const interploters__phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\nvarying vec4 vPosition;\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;\n    vPosition = gl_Position;\n#endif\n\n#ifdef USE_TEXTURE\n    vMainUV = aMainUV;\n#endif\n}\n";
}
declare function builder(_thisArg: any): any;
declare namespace CanvasToy {
    class Texture implements IAsyncResource {
        readonly glTexture: WebGLTexture;
        isReadyToUpdate: boolean;
        private readonly _image;
        private _target;
        private _format;
        private _wrapS;
        private _wrapT;
        private _magFilter;
        private _minFilter;
        private _type;
        constructor(gl: WebGLRenderingContext, url?: string);
        readonly image: HTMLImageElement;
        readonly target: number;
        readonly format: number;
        readonly wrapS: number;
        readonly wrapT: number;
        readonly magFilter: number;
        readonly minFilter: number;
        readonly type: number;
        setTarget(_target: number): this;
        setFormat(_format: number): this;
        setWrapS(_wrapS: number): this;
        setWrapT(_wrapT: number): this;
        setMagFilter(_magFilter: number): this;
        setMinFilter(_minFilter: number): this;
        setType(_type: number): this;
        asyncFinished(): Promise<{}>;
        setUpTextureData(gl: WebGLRenderingContext): void;
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
        mainTexture: Texture;
        ambient: Vec3Array;
        diffuse: Vec3Array;
        specular: Vec3Array;
        specularExponent: number;
        specularMap: Texture;
        transparency: number;
        alphaMap: Texture;
        bumpMap: Texture;
        displamentMap: Texture;
        stencilMap: Texture;
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
    interface IAsyncResource {
        asyncFinished(): Promise<any>;
    }
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
        readonly idensity: number;
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
    namespace patterns {
        const num: RegExp;
    }
}
declare namespace CanvasToy {
    class StandardMaterial extends Material {
        constructor(gl: WebGLRenderingContext, paramter?: IMaterial);
    }
}
declare namespace CanvasToy {
    class MTLLoader {
        static load(gl: WebGLRenderingContext, baseurl: string): Promise<{}>;
        protected static removeCommentPattern: RegExp;
        protected static newmtlPattern: RegExp;
        protected static ambientPattern: RegExp;
        protected static diffusePattern: RegExp;
        protected static specularePattern: RegExp;
        protected static specularExponentPattern: RegExp;
        protected static trancparencyPattern: RegExp;
        protected static mapPattern: RegExp;
        protected static mapSinglePattern: RegExp;
        private static fetchTexture(url);
        private static handleSingleLine(gl, line, materials, urlMaps, currentMaterial);
        private static getImageUrl(line);
        private static getVector(pattern, line);
        private static getNumber(pattern, line);
    }
}
declare namespace CanvasToy {
    class OBJLoader {
        static load(gl: WebGLRenderingContext, url: string): Promise<Object3d>;
        protected static commentPattern: RegExp;
        protected static faceSplitVertPattern: RegExp;
        protected static facePerVertPattern: RegExp;
        protected static objectSplitPattern: RegExp;
        protected static mtlLibPattern: RegExp;
        protected static useMTLPattern: RegExp;
        protected static mtlLibSinglePattern: RegExp;
        protected static useMTLSinglePattern: RegExp;
        protected static vertexPattern: RegExp;
        protected static uvPattern: RegExp;
        protected static normalPattern: RegExp;
        protected static indexPattern: RegExp;
        protected static praiseAttibuteLines(lines: any): number[][];
        protected static parseAsTriangle(faces: string[], forEachFace: (face: string[]) => void): void;
        protected static buildUpMeshes(gl: WebGLRenderingContext, content: string, materials: any, unIndexedPositions: number[][], unIndexedUVs: number[][], unIndexedNormals: number[][]): Object3d;
    }
}
declare namespace CanvasToy {
    function fetchRes(url: string): Promise<{}>;
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
        update(dt: number): void;
        addObject(object: Object3d): this;
        removeObject(object: Object3d): this;
        addLight(light: Light): this;
    }
}
declare namespace CanvasToy {
    class DeferredProcessor implements IProcessor {
        readonly gBuffer: FrameBuffer;
        readonly geometryPass: Program;
        constructor(gl: WebGLRenderingContext, scene: Scene);
        process(scene: Scene, camera: Camera, materials: IMaterial[]): void;
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
        readonly attachmentCode: (gl: WebGLRenderingContext | WebGLDrawBuffers) => number;
        private _innerFormatForBuffer;
        private _type;
        private _isAble;
        constructor(frameBuffer: FrameBuffer, attachmentCode: (gl: WebGLRenderingContext | WebGLDrawBuffers) => number);
        readonly innerFormatForBuffer: number;
        readonly type: AttachmentType;
        readonly isAble: boolean;
        enable(): this;
        disable(): this;
        setInnerFormatForBuffer(innerFormatForBuffer: number): this;
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
        extras: Attachment[];
        constructor(gl: WebGLRenderingContext);
    }
}
declare namespace CanvasToy {
    class GeometryBuffer {
        positionTexture: Texture;
        normalTexture: Texture;
        colorTexture: Texture;
        depthTexture: Texture;
        constructor(gl: WebGLRenderingContext);
        depth(gl: WebGLRenderingContext): void;
    }
}
declare namespace CanvasToy {
    class ForwardProcessor implements IProcessor {
        readonly gl: WebGLRenderingContext;
        constructor(gl: WebGLRenderingContext, scene: Scene, camera: Camera);
        process(scene: Scene, camera: Camera, materials: IMaterial[]): void;
        private renderObject(camera, object);
        private setUpLights(scene, material, mesh, camera);
        private makeMeshPrograms(scene, mesh, camera);
    }
}
declare namespace CanvasToy {
    interface IProcessor {
        process(scene: Scene, camera: Camera, matriels: IMaterial[]): any;
    }
}
declare namespace CanvasToy {
    class Renderer {
        readonly canvas: HTMLCanvasElement;
        readonly gl: WebGLRenderingContext;
        readonly ext: {
            depth_texture: WEBGL_depth_texture;
            draw_buffer: WebGLDrawBuffers;
        };
        preloadRes: any[];
        usedTextureNum: number;
        renderTargets: Texture[];
        vertPrecision: string;
        fragPrecision: string;
        isAnimating: boolean;
        renderQueue: Array<(deltaTime: number) => void>;
        fbos: FrameBuffer[];
        scenes: Scene[];
        cameras: Camera[];
        frameRate: number;
        private stopped;
        private materials;
        constructor(canvas: HTMLCanvasElement);
        stop(): void;
        start(): void;
        createFrameBuffer(): FrameBuffer;
        renderFBO(scene: Scene, camera: Camera): void;
        handleResource(scene: Scene): Promise<any[]>;
        render(scene: Scene, camera: Camera): void;
        configTexture(texture: Texture): void;
        private renderLight(light, scene);
        private main;
        private initMatrix();
    }
}
declare namespace CanvasToy {
    enum InterplotationMethod {
        Flat = 0,
        Gouraud = 1,
        Phong = 2,
        DepthPhong = 3,
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
        constructor(gl: WebGLRenderingContext, url?: string);
        setUpTextureData(gl: WebGLRenderingContext): void;
    }
}
declare namespace CanvasToy {
    enum ShaderType {
        VertexShader = 0,
        FragmentShader = 1,
    }
    function mixin(toObject: Object, fromObject: Object): void;
    function copyDataToVertexBuffer(gl: WebGLRenderingContext, geometry: Geometry): void;
    function initWebwebglContext(canvas: any): WebGLRenderingContext;
    function getDomScriptText(script: HTMLScriptElement): string;
    function createEntileShader(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram;
}
