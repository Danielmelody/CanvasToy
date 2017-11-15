uniform vec3 ambient;
uniform vec3 uMaterialDiff;
uniform vec3 uMaterialSpec;
uniform float uMaterialSpecExp;

uniform vec3 eyePos;
varying vec3 vNormal;

#ifdef _MAIN_TEXTURE
uniform sampler2D uMainTexture;
varying vec2 vMainUV;
#endif

#ifdef _NORMAL_TEXTURE
uniform sampler2D uNormalTexture;
varying vec2 vNormalUV;
#endif

vec2 encodeNormal(vec3 n) {
    return normalize(n.xy) * (sqrt(n.z*0.5+0.5));
}

void main () {
    vec3 normal = normalize(vNormal);
    float specular = (uMaterialSpec.x + uMaterialSpec.y + uMaterialSpec.z) / 3.0;
#ifdef _NORMAL_TEXTURE
    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, uMaterialSpecExp);
#else
    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, uMaterialSpecExp);
#endif
#ifdef _MAIN_TEXTURE
    gl_FragData[1] = vec4(uMaterialDiff * texture2D(uMainTexture, vMainUV).xyz, specular);
#else
    gl_FragData[1] = vec4(uMaterialDiff, specular);
#endif
}
