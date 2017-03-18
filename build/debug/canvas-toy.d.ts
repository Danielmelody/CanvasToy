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
    function asDefine(...defineNames: string[]): (proto: any, key: any) => void;
    function readyRequire<IAsyncResource>(proto: any, key: any): void;
}
declare namespace CanvasToy {
    interface IProgramSource {
        vertexShader: string;
        fragmentShader: string;
    }
    interface IProgramPass {
        faces?: (mesh: Mesh) => Faces;
        uniforms?: any;
        attributes?: any;
        textures?: any;
        prefix?: any;
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
        uniformLocationCache: {};
        attributes: {};
        attributeLocations: {};
        attribute0: string;
        webGlProgram: WebGLProgram;
        textures: Array<{
            sampler: string;
            getter: (mesh: Mesh, camera: Camera, material) => Texture;
            location: WebGLUniformLocation;
        }>;
        vertexPrecision: string;
        fragmentPrecision: string;
        extensionStatements: string[];
        definesFromMaterial: string[];
        definesFromProcesser: string[];
        private passFunctions;
        private source;
        constructor(gl: WebGLRenderingContext, source: IProgramSource, passFunctions: IProgramPass);
        drawMode: (gl: WebGLRenderingContext) => number;
        setFragmentShader(fragmentShader: string): this;
        setVertexShader(vertexShader: string): this;
        resetMaterialDefines(materiel: Material): void;
        make(scene: Scene): this;
        pass(mesh: Mesh, camera: Camera, materiel: Material): this;
        checkState(mesh: Mesh): this;
        setAttribute0(name: string): this;
        addTexture(sampler: string, getter: (mesh, camera, material) => Texture): void;
        addUniform(nameInShader: any, uniform: IUniform): this;
        deleteUniform(nameInShader: any): this;
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
            uCubeTexture: (mesh: any, camera: any, material: any) => any;
        };
        uniforms: {
            modelViewProjectionMatrix: {
                type: DataType;
                updator: (mesh: Mesh, camera: Camera) => GLM.IArray;
            };
            modelViewMatrix: {
                type: DataType;
                updator: (mesh: Mesh, camera: Camera) => GLM.IArray;
            };
            normalViewMatrix: {
                type: DataType;
                updator: (mesh: Mesh, camera: Camera) => GLM.IArray;
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
    class Object3d implements IAsyncResource {
        tag: string;
        scene: Scene;
        children: Object3d[];
        depredations: string[];
        uniforms: IUniform[];
        protected _worldToObjectMatrix: Mat4Array;
        protected _asyncFinished: Promise<Object3d>;
        protected _matrix: Mat4Array;
        protected _parent: Object3d;
        protected _localMatrix: Mat4Array;
        protected _localPosition: Vec3Array;
        protected _localRotation: QuatArray;
        protected _localScaling: Vec3Array;
        protected _position: Vec3Array;
        protected _scaling: Vec3Array;
        protected _rotation: QuatArray;
        constructor(tag?: string);
        readonly parent: Object3d;
        setParent(_parent: Object3d): this;
        readonly localMatrix: Mat4Array;
        readonly matrix: Mat4Array;
        readonly worldToObjectMatrix: Mat4Array;
        setWorldToObjectMatrix(worldToObjectMatrix: Mat4Array): this;
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
        translate(delta: Vec3Array): this;
        rotateX(angle: number): this;
        rotateY(angle: number): this;
        rotateZ(angle: number): this;
        handleUniformProperty(): void;
        asyncFinished(): Promise<Object3d>;
        setAsyncFinished(promise: Promise<Object3d>): void;
        protected genOtherMatrixs(): void;
        protected deComposeLocalMatrix(): void;
        protected composeFromLocalTransform(): void;
        protected deComposeGlobalMatrix(): void;
        private composeFromGlobalTransform();
        private applyToChildren();
    }
}
declare namespace CanvasToy {
    abstract class Camera extends Object3d {
        protected _upVector: Vec3Array;
        protected _centerVector: Vec3Array;
        protected _rightVector: Vec3Array;
        protected _projectionMatrix: Mat4Array;
        protected _near: number;
        protected _far: number;
        constructor();
        readonly near: number;
        readonly far: number;
        readonly eyeVector: GLM.IArray;
        readonly upVector: GLM.IArray;
        readonly centerVector: GLM.IArray;
        readonly rightVector: GLM.IArray;
        readonly projectionMatrix: GLM.IArray;
        lookAt(center: Vec3Array, up: Vec3Array): this;
        setProjectionMatrix(projectionMatrix: Mat4Array): this;
        setNear(near: number): this;
        setFar(far: number): this;
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
        constructor(parameter?: {
            aspect?: number;
            fovy?: number;
            near?: number;
            far?: number;
        });
        compuseProjectionMatrix(): void;
        readonly aspect: number;
        readonly fovy: number;
        setAspect(aspect: number): this;
        setFovy(fovy: number): this;
        deCompuseProjectionMatrix(): void;
        genOtherMatrixs(): void;
        adaptTargetRadio(target: {
            width: number;
            height: number;
        }): void;
    }
}
declare namespace CanvasToy {
    class Faces {
        buffer: WebGLBuffer;
        data: number[];
        constructor(gl: WebGLRenderingContext, data: number[]);
    }
    class Geometry {
        dirty: boolean;
        attributes: {
            position: Attribute;
            uv: Attribute;
            normal: Attribute;
            flatNormal: Attribute;
        };
        faces: Faces;
        protected gl: WebGLRenderingContext;
        constructor(gl: WebGLRenderingContext);
        build(): this;
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
        constructor(geometry: Geometry, materials: Material[]);
        drawMode(gl: WebGLRenderingContext): number;
    }
}
declare namespace CanvasToy {
    namespace ShaderSource {
        const calculators__blinn_phong_glsl = "vec3 calculateLight(\n    vec3 position,\n    vec3 normal,\n    vec3 lightDir,\n    vec3 eyePos,\n    vec3 specular,\n    vec3 diffuse,\n    float shiness,\n    float idensity\n    ) {\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize(eyePos - position);\n\n    // replace R * V with N * H\n    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);\n    float specularAngle = max(dot(H, normal), 0.0);\n\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
        const calculators__linearlize_depth_glsl = "float linearlizeDepth(float far, float near, float depth) {\n    float NDRDepth = depth * 2.0 - 1.0;;\n    return 2.0 * near / (near + far - NDRDepth * (far - near));\n}\n";
        const calculators__phong_glsl = "vec3 calculateLight(\n    vec3 position,\n    vec3 normal,\n    vec3 lightDir,\n    vec3 eyePos,\n    vec3 specularLight,\n    vec3 diffuseLight,\n    float shiness,\n    float idensity\n    ) {\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize(eyePos - position);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specularLight * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
        const calculators__types_glsl = "vec3 calculateDirLight(\n    DirectLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    return calculateLight(\n        position,\n        normal,\n        -light.direction,\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        light.idensity\n    );\n}\n\nvec3 calculatePointLight(\n    PointLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    float lightDis = length(light.position - position);\n    float idensity = light.idensity / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);\n    idensity *= step(lightDis, light.radius);\n    return calculateLight(\n        position,\n        normal,\n        normalize(light.position - position),\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        idensity\n    );\n}\n\nvec3 calculateSpotLight(\n    SpotLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    vec3 lightDir = normalize(light.position - position);\n    float spotFactor = dot(-lightDir, light.spotDir);\n    if (spotFactor < light.coneAngleCos) {\n        return vec3(0.0);\n    }\n    float lightDis = length(light.position - position);\n    float idensity = light.idensity / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);\n    idensity = (spotFactor - light.coneAngleCos) / (1.0 - light.coneAngleCos);\n    // idensity *= step(light.radius, lightDis);\n    return calculateLight(\n        position,\n        normal,\n        lightDir,\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        idensity\n    );\n}\n";
        const debug__checkBox_glsl = "float checkerBoard(in vec2 uv, in float subSize) {\n    vec2 bigBox = mod(uv, vec2(subSize * 2.0));\n    return (\n        step(subSize, bigBox.x) * step(subSize, bigBox.y)\n        + step(subSize, subSize * 2.0 -bigBox.x) * step(subSize, subSize * 2.0 -bigBox.y)\n    );\n}\n";
        const definitions__light_glsl = "#ifdef OPEN_LIGHT // light declaration\n\nstruct DirectLight\n{\n    vec3 color;\n    float idensity;\n    vec3 direction;\n};\n\nstruct PointLight {\n    vec3 color;\n    float idensity;\n    float radius;\n    vec3 position;\n    float squareAtten;\n    float linearAtten;\n    float constantAtten;\n};\n\nstruct SpotLight {\n    vec3 color;\n    float idensity;\n    float radius;\n    vec3 position;\n    float squareAtten;\n    float linearAtten;\n    float constantAtten;\n    vec3 spotDir;\n    float coneAngleCos;\n};\n\n#endif // light declaration\n";
        const interploters__deferred__geometry_frag = "uniform vec3 ambient;\nuniform vec3 materialDiff;\nuniform vec3 materialSpec;\nuniform float materialSpecExp;\n\n\n#ifdef OPEN_LIGHT\nuniform vec3 eyePos;\nvarying vec3 vNormal;\n#endif\n\n#ifdef _MAIN_TEXTURE\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef _NORMAL_TEXTURE\nuniform sampler2D uNormalTexture;\nvarying vec2 vNormalUV;\n#endif\n\nvec2 encodeNormal(vec3 n) {\n    return normalize(n.xy) * (sqrt(n.z*0.5+0.5));\n}\n\nvoid main () {\n\n#ifdef OPEN_LIGHT\n    vec3 normal = normalize(vNormal);\n    float specular = (materialSpec.x + materialSpec.y + materialSpec.z) / 3.0;\n#ifdef _NORMAL_TEXTURE\n    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, materialSpecExp);\n#else\n    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, materialSpecExp);\n#endif\n#ifdef _MAIN_TEXTURE\n    gl_FragData[1] = vec4(materialDiff * texture2D(uMainTexture, vMainUV).xyz, specular);\n#else\n    gl_FragData[1] = vec4(materialDiff, specular);\n#endif\n#endif\n}\n";
        const interploters__deferred__geometry_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef _MAIN_TEXTURE\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalViewMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalViewMatrix * vec4(aNormal, 1.0)).xyz;\n#endif\n\n#ifdef _MAIN_TEXTURE\n    vMainUV = aMainUV;\n#endif\n}\n";
        const interploters__deferred__tiledLight_frag = "#define MAX_TILE_LIGHT_NUM 32\n\nprecision highp float;\n\nuniform float uHorizontalTileNum;\nuniform float uVerticalTileNum;\nuniform float uLightListLengthSqrt;\n\nuniform mat4 inverseProjection;\n\nuniform sampler2D uLightIndex;\nuniform sampler2D uLightOffsetCount;\nuniform sampler2D uLightPositionRadius;\nuniform sampler2D uLightColorIdensity;\n\nuniform sampler2D uNormalDepthSE;\nuniform sampler2D uDiffSpec;\n\nuniform float cameraNear;\nuniform float cameraFar;\n\n\nvarying vec3 vPosition;\n\nvec3 decodeNormal(vec2 n)\n{\n   vec3 normal;\n   normal.z = dot(n, n) * 2.0 - 1.0;\n   normal.xy = normalize(n) * sqrt(1.0 - normal.z * normal.z);\n   return normal;\n}\n\nvec3 decodePosition(float depth) {\n    vec4 clipSpace = vec4(vPosition.xy, depth * 2.0 - 1.0, 1.0);\n    vec4 homogenous = inverseProjection * clipSpace;\n    return homogenous.xyz / homogenous.w;\n}\n\nvoid main() {\n    vec2 uv = vPosition.xy * 0.5 + vec2(0.5);\n    vec2 gridIndex = uv ;// floor(uv * vec2(uHorizontalTileNum, uVerticalTileNum)) / vec2(uHorizontalTileNum, uVerticalTileNum);\n    vec4 lightIndexInfo = texture2D(uLightOffsetCount, gridIndex);\n    float lightStartIndex = lightIndexInfo.r;\n    float lightNum = lightIndexInfo.w;\n    vec4 tex1 = texture2D(uNormalDepthSE, uv);\n    vec4 tex2 = texture2D(uDiffSpec, uv);\n\n    vec3 materialDiff = tex2.xyz;\n    vec3 materialSpec = vec3(tex2.w);\n    float materialSpecExp = tex1.w;\n\n    vec3 normal = decodeNormal(tex1.xy);\n    vec3 viewPosition = decodePosition(tex1.z);\n    vec3 totalColor = vec3(0.0);\n    int realCount = 0;\n    for(int i = 0; i < MAX_TILE_LIGHT_NUM; i++) {\n        if (float(i) > lightNum - 0.5) {\n            break;\n        }\n        // float listX = (float(lightStartIndex + i) - listX_int * uLightListLengthSqrt) / uLightListLengthSqrt;\n        // float listY = ((lightStartIndex + i) / uLightListLengthSqrt) / uLightListLengthSqrt;\n        // float listX = (mod(lightStartIndex + i, uLightListLengthSqrt)) / uLightListLengthSqrt;\n        // listX = 1.0;\n        // listY = 0.0;\n        float fixlightId = texture2D(uLightIndex, vec2((lightStartIndex + float(i)) / uLightListLengthSqrt, 0.5)).x;\n        vec4 lightPosR = texture2D(uLightPositionRadius, vec2(fixlightId, 0.5));\n        vec3 lightPos = lightPosR.xyz;\n        float lightR = lightPosR.w;\n        vec4 lightColorIden = texture2D(uLightColorIdensity, vec2(fixlightId, 0.5));\n        vec3 lightColor = lightColorIden.xyz;\n        float lightIdensity = lightColorIden.w;\n\n        float dist = distance(lightPos, viewPosition);\n        if (dist < lightR) {\n            realCount++;\n            vec3 fixLightColor = lightColor * min(1.0,  1.0 / (dist * dist ) / (lightR * lightR));\n            totalColor += calculateLight(\n                viewPosition,\n                normal,\n                normalize(lightPos - viewPosition),\n                vec3(0.0),\n                materialSpec * lightColor,\n                materialDiff * lightColor,\n                materialSpecExp,\n                lightIdensity\n            );\n            // totalColor += vec3(listX, listY, 0.0);\n        }\n            // vec3 lightDir = normalize(lightPos - viewPosition);\n            // vec3 reflectDir = normalize(reflect(lightDir, normal));\n            // vec3 viewDir = normalize( - viewPosition);\n            // vec3 H = normalize(lightDir + viewDir);\n            // float specularAngle = max(dot(H, normal), 0.0);\n            // // vec3 specularColor = materialSpec * pow(specularAngle, materialSpecExp);\n        // totalColor = vec3(float(lightStartIndex) / uLightListLengthSqrt / uLightListLengthSqrt);\n        //}\n        //}\n    }\n    // vec3 depth = vec3(linearlizeDepth(cameraFar, cameraNear, tex1.z));\n    // vec3 depth = vec3(tex1.z);\n    vec3 test = vec3(float(realCount) / 32.0);\n    gl_FragColor = vec4(totalColor, 1.0);\n}\n";
        const interploters__deferred__tiledLight_vert = "attribute vec3 position;\nvarying vec3 vPosition;\n\nvoid main()\n{\n    gl_Position = vec4(position, 1.0);\n    vPosition = position;\n}\n";
        const interploters__depth_phong_frag = "uniform vec3 ambient;\nuniform vec3 depthColor;\n\nuniform float cameraNear;\nuniform float cameraFar;\n\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n\nvoid main () {\n    float originDepth = texture2D(uMainTexture, vMainUV).r;\n    float linearDepth = linearlizeDepth(cameraFar, cameraNear, originDepth) / cameraFar;\n    gl_FragColor = vec4(vec3(originDepth * 2.0 - 1.0), 1.0);\n}\n";
        const interploters__depth_phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n    vMainUV = aMainUV;\n}\n";
        const interploters__forward__gouraud_frag = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nvoid main() {\n    textureColor = colorOrMainTexture(vMainUV);\n#ifdef OPEN_LIGHT\n    totalLighting = ambient;\n    vec3 normal = normalize(vNormal);\n    gl_FragColor = vec4(totalLighting, 1.0);\n#else\n#ifdef USE_COLOR\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#endif\n#endif\n#ifdef _MAIN_TEXTURE\n    gl_FragColor = gl_FragColor * textureColor;\n#endif\n#ifdef USE_COLOR\n    gl_FragColor = gl_FragColor * color;\n#endif\n}\n";
        const interploters__forward__gouraud_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    totalLighting = ambient;\n    normal = normalize(normal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);\n    }\n    vLightColor = totalLighting;\n#endif\n#ifdef _MAIN_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n";
        const interploters__forward__phong_frag = "uniform vec3 ambient;\nuniform vec3 materialSpec;\nuniform float materialSpecExp;\nuniform vec3 materialDiff;\nvarying vec2 vMainUV;\n\n#ifdef OPEN_LIGHT\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n#endif\n\nuniform sampler2D uMainTexture;\n\nuniform float reflectivity;\nuniform samplerCube uCubeTexture;\n\n#if (DIR_LIGHT_NUM > 0)\nuniform DirectLight directLights[DIR_LIGHT_NUM];\n#endif\n\n#if (POINT_LIGHT_NUM > 0)\nuniform PointLight pointLights[POINT_LIGHT_NUM];\n#endif\n\n#if (SPOT_LIGHT_NUM)\nuniform SpotLight spotLights[SPOT_LIGHT_NUM];\n#endif\n\nvoid main () {\n#ifdef _MAIN_TEXTURE\n    gl_FragColor = texture2D(uMainTexture, vMainUV);\n#else\n    #ifdef _DEBUG\n    gl_FragColor = vec4(vec3(checkerBoard(vMainUV, 0.1)), 1.0);\n    #else\n    gl_FragColor = vec4(1.0);\n    #endif\n#endif\n    vec3 color = vec3(0.0);\n    vec3 normal = normalize(vNormal);\n#ifdef OPEN_LIGHT\n    vec3 totalLighting = ambient;\n    #if (DIR_LIGHT_NUM > 0)\n    for (int index = 0; index < DIR_LIGHT_NUM; index++) {\n        totalLighting += calculateDirLight(\n            directLights[index],\n            materialDiff,\n            materialSpec,\n            materialSpecExp,\n            vPosition,\n            normal,\n            vec3(0.0)\n        );\n    }\n    #endif\n    #if (POINT_LIGHT_NUM > 0)\n    for (int index = 0; index < POINT_LIGHT_NUM; index++) {\n        totalLighting += calculatePointLight(\n            pointLights[index],\n            materialDiff,\n            materialSpec,\n            materialSpecExp,\n            vPosition,\n            normal,\n            vec3(0.0)\n        );\n    }\n    #endif\n    #if (SPOT_LIGHT_NUM > 0)\n    for (int index = 0; index < SPOT_LIGHT_NUM; index++) {\n        totalLighting += calculateSpotLight(\n            spotLights[index],\n            materialDiff,\n            materialSpec,\n            materialSpecExp,\n            vPosition,\n            normal,\n            vec3(0.0)\n        );\n    }\n    #endif\n    color = totalLighting;\n#endif\n#ifdef _ENVIRONMENT_MAP\n    vec3 viewDir = normalize(-vPosition);\n    vec3 skyUV = reflect(-viewDir, vNormal);\n    color = mix(color, textureCube(uCubeTexture, skyUV).xyz, reflectivity);\n#endif\n    gl_FragColor *= vec4(color, 1.0);\n}\n";
        const interploters__forward__phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\nuniform mat4 modelViewMatrix;\n\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nuniform mat4 normalViewMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;\n    vNormal = (normalViewMatrix * vec4(aNormal, 1.0)).xyz;\n    vMainUV = aMainUV;\n}\n";
        const interploters__forward__skybox_frag = "varying vec3 cubeUV;\nuniform samplerCube uCubeTexture;\nvoid main()\n{\n    gl_FragColor = textureCube(uCubeTexture, cubeUV);\n}\n";
        const interploters__forward__skybox_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nvarying vec3 cubeUV;\n\nvoid main (){\n    vec4 mvp = modelViewProjectionMatrix * vec4(position, 1.0);\n    cubeUV = position;\n    gl_Position = mvp.xyww;\n}\n";
    }
    type ShaderLib = typeof ShaderSource.calculators__blinn_phong_glsl | typeof ShaderSource.calculators__linearlize_depth_glsl | typeof ShaderSource.calculators__phong_glsl | typeof ShaderSource.calculators__types_glsl | typeof ShaderSource.debug__checkBox_glsl | typeof ShaderSource.definitions__light_glsl;
    type ShadingVert = typeof ShaderSource.interploters__deferred__geometry_vert | typeof ShaderSource.interploters__deferred__tiledLight_vert | typeof ShaderSource.interploters__depth_phong_vert | typeof ShaderSource.interploters__forward__gouraud_vert | typeof ShaderSource.interploters__forward__phong_vert | typeof ShaderSource.interploters__forward__skybox_vert;
    type ShadingFrag = typeof ShaderSource.interploters__deferred__geometry_frag | typeof ShaderSource.interploters__deferred__tiledLight_frag | typeof ShaderSource.interploters__depth_phong_frag | typeof ShaderSource.interploters__forward__gouraud_frag | typeof ShaderSource.interploters__forward__phong_frag | typeof ShaderSource.interploters__forward__skybox_frag;
}
declare function builder(_thisArg: any): any;
declare namespace CanvasToy {
    class Texture implements IAsyncResource {
        readonly glTexture: WebGLTexture;
        isReadyToUpdate: boolean;
        protected _asyncFinished: Promise<Texture>;
        protected _image: HTMLImageElement;
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
        setAsyncFinished(promise: Promise<Texture>): void;
        asyncFinished(): Promise<Texture>;
        bindTextureData(gl: WebGLRenderingContext): void;
    }
}
declare namespace CanvasToy {
    let colors: {
        black: GLM.IArray;
        gray: GLM.IArray;
        red: GLM.IArray;
        white: GLM.IArray;
    };
    abstract class Material {
        dirty: boolean;
        defines: string[];
        program: Program;
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
    class SphereGeometry extends Geometry {
        private _radius;
        private _widthSegments;
        private _heightSegments;
        private _phiStart;
        private _phiLength;
        private _thetaStart;
        private _thetaLength;
        constructor(gl: WebGLRenderingContext);
        build(): this;
        readonly radius: number;
        readonly widthSegments: number;
        readonly heightSegments: number;
        readonly phiStart: number;
        readonly phiLength: number;
        readonly thetaStart: number;
        readonly thetaLength: number;
        setRadius(radius: number): this;
        setWidthSegments(widthSegments: number): this;
        setHeightSegments(heightSegments: number): this;
        setPhiStart(phiStart: number): this;
        setPhiLength(phiLength: number): this;
        setThetaStart(thetaStart: number): this;
        setThetaLength(thetaLength: number): this;
    }
}
declare namespace CanvasToy {
    class TileGeometry extends Geometry {
        private _widthSegments;
        private _heightSegments;
        private _width;
        private _height;
        constructor(gl: WebGLRenderingContext);
        build(): this;
    }
}
declare namespace CanvasToy {
    interface IAsyncResource {
        asyncFinished(): Promise<IAsyncResource>;
        setAsyncFinished(promise: Promise<IAsyncResource>): void;
    }
}
declare namespace CanvasToy {
    interface BoundingBox2D {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }
}
declare namespace CanvasToy {
    abstract class Light extends Object3d {
        readonly typename: string;
        volume: Geometry;
        protected _color: GLM.IArray;
        protected _idensity: number;
        protected _shadowRtt: Texture;
        protected _projectCamera: Camera;
        constructor();
        abstract getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
        setColor(color: Vec3Array): this;
        setIdensity(idensity: number): this;
        readonly color: GLM.IArray;
        readonly idensity: number;
    }
}
declare namespace CanvasToy {
    class DirectionalLight extends Light {
        protected _direction: Vec3Array;
        constructor(gl: WebGLRenderingContext);
        readonly typename: string;
        readonly direction: Vec3Array;
        getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
        setDirection(_direction: Vec3Array): this;
    }
}
declare namespace CanvasToy {
    class PointLight extends Light {
        protected _position: Vec3Array;
        protected _radius: number;
        protected _squareAttenuation: number;
        protected _linearAttenuation: number;
        protected _constantAttenuation: number;
        constructor(gl: WebGLRenderingContext);
        getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
        setRadius(radius: number): this;
        readonly typename: string;
        readonly radius: number;
    }
}
declare namespace CanvasToy {
    class SpotLight extends PointLight {
        protected _coneAngleCos: number;
        protected _spotDirection: Vec3Array;
        protected _coneAngle: number;
        constructor(gl: WebGLRenderingContext);
        readonly typename: string;
        readonly coneAngle: number;
        readonly spotDirection: GLM.IArray;
        setConeAngle(coneAngle: number): this;
        setSpotDirection(spotDirection: Vec3Array): this;
        getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
    }
}
declare namespace CanvasToy {
    namespace patterns {
        const num: RegExp;
        const commentPattern: RegExp;
    }
}
declare namespace CanvasToy {
    interface IStandardMaterial {
        mainTexture?: Texture;
        ambient?: Vec3Array;
        diffuse?: Vec3Array;
        specular?: Vec3Array;
        program?: Program;
    }
    class StandardMaterial extends Material {
        debug: boolean;
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
        reflectivity: number;
        reflectionMap: CubeTexture;
        geometryProgram: Program;
        constructor(gl: WebGLRenderingContext, paramter?: IStandardMaterial);
    }
}
declare namespace CanvasToy {
    class MTLLoader {
        static load(gl: WebGLRenderingContext, baseurl: string): Promise<{}>;
        protected static newmtlPattern: RegExp;
        protected static ambientPattern: RegExp;
        protected static diffusePattern: RegExp;
        protected static specularePattern: RegExp;
        protected static specularExponentPattern: RegExp;
        protected static trancparencyPattern: RegExp;
        protected static mapPattern: RegExp;
        protected static mapSinglePattern: RegExp;
        private static handleSingleLine(gl, home, line, materials, currentMaterial);
        private static getImageUrl(line);
        private static getVector(pattern, line);
        private static getNumber(pattern, line);
    }
}
declare namespace CanvasToy {
    class OBJLoader {
        static load(gl: WebGLRenderingContext, url: string): Object3d;
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
        protected static buildUpMeshes(gl: WebGLRenderingContext, container: Object3d, content: string, materials: any, unIndexedPositions: number[][], unIndexedUVs: number[][], unIndexedNormals: number[][]): void;
    }
}
declare namespace CanvasToy {
    function fetchRes(url: string): Promise<{}>;
}
declare namespace CanvasToy {
    class SkyMaterial extends Material {
        cubeTexture: CubeTexture;
        constructor(gl: WebGLRenderingContext, cubeTexture: CubeTexture);
    }
}
declare namespace CanvasToy {
    class Scene {
        objects: Object3d[];
        lights: Light[];
        pointLights: PointLight[];
        spotLights: SpotLight[];
        dirctionLights: DirectionalLight[];
        ambientLight: Vec3Array;
        openLight: boolean;
        enableShadowMap: boolean;
        clearColor: number[];
        programSetUp: boolean;
        protected updateEvents: Function[];
        update(dt: number): void;
        addOnUpdateListener(listener: (deltaTime: number) => void): this;
        removeOnUpdateListener(listener: (deltaTime: number) => void): this;
        addObject(...objects: Object3d[]): this;
        removeObject(object: Object3d): this;
        addLight(...lights: Light[]): void;
    }
}
declare namespace CanvasToy {
    namespace Graphics {
        function addRootUniformContainer(program: Program, uniformContainer: any): void;
        function copyDataToVertexBuffer(gl: WebGLRenderingContext, geometry: Geometry): void;
        function logIfFrameBufferInvalid(gl: WebGLRenderingContext, frameBuffer: WebGLFramebuffer, ext: WebGLExtension): void;
    }
}
declare namespace CanvasToy {
    interface WebGLExtension {
        depth_texture: WEBGL_depth_texture;
        draw_buffer: WebGLDrawBuffers;
        texture_float: OES_texture_float;
        texture_float_linear: OES_texture_float_linear;
    }
}
declare namespace CanvasToy {
    class DeferredProcessor implements IProcessor {
        tile: RectGeometry;
        readonly tilePixelSize: number;
        readonly horizontalTileNum: any;
        readonly verticalTileNum: any;
        readonly tileCount: any;
        readonly gBuffer: FrameBuffer;
        readonly gl: WebGLRenderingContext;
        readonly ext: WebGLExtension;
        tilePass: Program;
        private tileLightIndexMap;
        private tileLightOffsetCountMap;
        private tileLightCountMap;
        private lightPositionRadiusMap;
        private lightColorIdensityMap;
        private tileLightIndex;
        private linearLightIndex;
        constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene, camera: Camera);
        process(scene: Scene, camera: Camera, materials: Material[]): void;
        private initGeometryProcess(scene);
        private passLightInfoToTexture(scene, camera);
        private initTiledPass(scene);
        private fillTileWithBoundingBox2D(camera, box, lightIndex);
    }
}
declare namespace CanvasToy {
    class ForwardProcessor implements IProcessor {
        readonly gl: WebGLRenderingContext;
        readonly ext: WebGLExtension;
        constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene, camera: Camera);
        process(scene: Scene, camera: Camera, materials: Material[]): void;
        private renderObject(camera, object);
        private setupLight(light, camera, program, index, lightArrayName);
        private setupLights(scene, material, mesh, camera);
        private makeMeshPrograms(scene, mesh, camera);
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
    interface IProcessor {
        process(scene: Scene, camera: Camera, matriels: Material[]): any;
    }
}
declare namespace CanvasToy {
    class Renderer {
        readonly canvas: HTMLCanvasElement;
        readonly gl: WebGLRenderingContext;
        readonly ext: WebGLExtension;
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
        private isDeferred;
        constructor(canvas: HTMLCanvasElement);
        stop(): void;
        start(): void;
        createFrameBuffer(): FrameBuffer;
        renderFBO(scene: Scene, camera: Camera): void;
        handleResource(scene: Scene): Promise<any[]>;
        forceDeferred(): void;
        render(scene: Scene, camera: Camera): void;
        private renderLight(light, scene);
        private main;
        private initMatrix();
    }
}
declare namespace CanvasToy {
    class ShaderBuilder {
        private vertLibs;
        private fragLibs;
        private shadingVert;
        private shadingFrag;
        private pass;
        resetShaderLib(): this;
        addShaderLib(...lib: ShaderLib[]): this;
        addShaderLibVert(...lib: ShaderLib[]): this;
        addShaderLibFrag(...lib: ShaderLib[]): this;
        setShadingVert(vert: ShadingVert): this;
        setShadingFrag(frag: ShadingFrag): this;
        setPass(pass: IProgramPass): this;
        build(gl: WebGLRenderingContext): Program;
    }
}
declare namespace CanvasToy {
    class CubeTexture extends Texture {
        images: HTMLImageElement[];
        private _wrapR;
        constructor(gl: WebGLRenderingContext, xposUrl: string, xnegUrl: string, yposUrl: string, ynegUrl: string, zposUrl: string, znegUrl: string);
        readonly wrapR: number;
        setWrapR(_wrapR: number): this;
        bindTextureData(gl: WebGLRenderingContext): void;
        private createLoadPromise(image);
    }
}
declare namespace CanvasToy {
    class Texture2D extends Texture {
        constructor(gl: WebGLRenderingContext, url?: string);
        bindTextureData(gl: WebGLRenderingContext): void;
    }
}
declare namespace CanvasToy {
    class DataTexture<TypeArray extends ArrayBufferView> extends Texture {
        width: number;
        height: number;
        private data;
        constructor(gl: WebGLRenderingContext, data: TypeArray, width?: number, height?: number);
        resetData(gl: WebGLRenderingContext, data: TypeArray, width?: number, height?: number): this;
        bindTextureData(gl: WebGLRenderingContext): this;
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
