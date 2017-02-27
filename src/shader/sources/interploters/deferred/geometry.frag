uniform vec3 ambient;
uniform vec3 materialDiff;
uniform vec3 materialSpec;
uniform float materialSpecExp;


#ifdef OPEN_LIGHT
uniform vec3 eyePos;
varying vec3 vNormal;
#endif

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

#ifdef OPEN_LIGHT
    vec3 normal = normalize(vNormal);
    float specular = (materialSpec.x + materialSpec.y + materialSpec.z) / 3.0;
#ifdef _NORMAL_TEXTURE
    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, materialSpecExp);
#else
    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, materialSpecExp);
#endif
#ifdef _MAIN_TEXTURE
    gl_FragData[1] = vec4(materialDiff * texture2D(uMainTexture, vMainUV).xyz, specular);
#else
    gl_FragData[1] = vec4(materialDiff, specular);
#endif
#endif
}
