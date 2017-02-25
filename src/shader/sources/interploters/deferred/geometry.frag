uniform vec3 ambient;

#ifdef OPEN_LIGHT
uniform vec3 eyePos;
varying vec3 vNormal;
varying vec4 vPosition;
varying float vDepth;
#endif

#ifdef _MAIN_TEXTURE
uniform sampler2D uMainTexture;
varying vec2 vMainUV;
#endif

#ifdef _NORMAL_TEXTURE
uniform sampler2D uNormalTexture;
varying vec2 vNormalUV;
#endif

void main () {

#ifdef OPEN_LIGHT
    vec3 normal = normalize(vNormal);
    // normal, position, color
#ifdef _NORMAL_TEXTURE
    gl_FragData[0] = vec4(normalize(vNormal.xyz), 1.0);
#else
    gl_FragData[0] = vec4(normalize(vNormal.xyz), 1.0);
#endif
    gl_FragData[1] = vPosition;
#ifdef _MAIN_TEXTURE
    gl_FragData[2] = vec4(texture2D(uMainTexture, vMainUV).xyz + ambient, 1.0);
#else
    gl_FragData[2] = vec4(ambient, 1.0);
#endif
#endif
}
