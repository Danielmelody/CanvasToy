#define MAX_TILE_LIGHT_NUM 32

precision highp float;

uniform float uHorizontalTileNum;
uniform float uVerticalTileNum;
uniform float uLightListLengthSqrt;

uniform mat4 inverseProjection;

uniform sampler2D uLightIndex;
uniform sampler2D uLightOffsetCount;
uniform sampler2D uLightPositionRadius;
uniform sampler2D uLightColorIdensity;

uniform sampler2D uNormalDepthSE;
uniform sampler2D uDiffSpec;

uniform float cameraNear;
uniform float cameraFar;


varying vec3 vPosition;

vec3 decodeNormal(vec2 n)
{
   vec3 normal;
   normal.z = dot(n, n) * 2.0 - 1.0;
   normal.xy = normalize(n) * sqrt(1.0 - normal.z * normal.z);
   return normal;
}

vec3 decodePosition(float depth) {
    vec4 clipSpace = vec4(vPosition.xy, depth * 2.0 - 1.0, 1.0);
    vec4 homogenous = inverseProjection * clipSpace;
    return homogenous.xyz / homogenous.w;
}

void main() {
    vec2 uv = vPosition.xy * 0.5 + vec2(0.5);
    vec2 gridIndex = uv ;// floor(uv * vec2(uHorizontalTileNum, uVerticalTileNum)) / vec2(uHorizontalTileNum, uVerticalTileNum);
    vec4 lightIndexInfo = texture2D(uLightOffsetCount, gridIndex);
    float lightStartIndex = lightIndexInfo.r;
    float lightNum = lightIndexInfo.w;
    vec4 tex1 = texture2D(uNormalDepthSE, uv);
    vec4 tex2 = texture2D(uDiffSpec, uv);

    vec3 materialDiff = tex2.xyz;
    vec3 materialSpec = vec3(tex2.w);
    float materialSpecExp = tex1.w;

    vec3 normal = decodeNormal(tex1.xy);
    vec3 viewPosition = decodePosition(tex1.z);
    vec3 totalColor = vec3(0.0);
    int realCount = 0;
    for(int i = 0; i < MAX_TILE_LIGHT_NUM; i++) {
        if (float(i) > lightNum - 0.5) {
            break;
        }
        // float listX = (float(lightStartIndex + i) - listX_int * uLightListLengthSqrt) / uLightListLengthSqrt;
        // float listY = ((lightStartIndex + i) / uLightListLengthSqrt) / uLightListLengthSqrt;
        // float listX = (mod(lightStartIndex + i, uLightListLengthSqrt)) / uLightListLengthSqrt;
        // listX = 1.0;
        // listY = 0.0;
        float fixlightId = texture2D(uLightIndex, vec2((lightStartIndex + float(i)) / uLightListLengthSqrt, 0.5)).x;
        vec4 lightPosR = texture2D(uLightPositionRadius, vec2(fixlightId, 0.5));
        vec3 lightPos = lightPosR.xyz;
        float lightR = lightPosR.w;
        vec4 lightColorIden = texture2D(uLightColorIdensity, vec2(fixlightId, 0.5));
        vec3 lightColor = lightColorIden.xyz;
        float lightIdensity = lightColorIden.w;

        float dist = distance(lightPos, viewPosition);
        if (dist < lightR) {
            realCount++;
            vec3 fixLightColor = lightColor * min(1.0,  1.0 / (dist * dist ) / (lightR * lightR));
            totalColor += calculate_light(
                viewPosition,
                normal,
                normalize(lightPos - viewPosition),
                vec3(0.0),
                materialSpec * lightColor,
                materialDiff * lightColor,
                materialSpecExp,
                lightIdensity
            );
            // totalColor += vec3(listX, listY, 0.0);
        }
            // vec3 lightDir = normalize(lightPos - viewPosition);
            // vec3 reflectDir = normalize(reflect(lightDir, normal));
            // vec3 viewDir = normalize( - viewPosition);
            // vec3 H = normalize(lightDir + viewDir);
            // float specularAngle = max(dot(H, normal), 0.0);
            // // vec3 specularColor = materialSpec * pow(specularAngle, materialSpecExp);
        // totalColor = vec3(float(lightStartIndex) / uLightListLengthSqrt / uLightListLengthSqrt);
        //}
        //}
    }
    // vec3 depth = vec3(linearlizeDepth(cameraFar, cameraNear, tex1.z));
    // vec3 depth = vec3(tex1.z);
    vec3 test = vec3(float(realCount) / 32.0);
    gl_FragColor = vec4(totalColor, 1.0);
}
