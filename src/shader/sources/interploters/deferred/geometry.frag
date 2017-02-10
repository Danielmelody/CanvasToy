#extension GL_EXT_draw_buffers : require

#ifdef OPEN_LIGHT
uniform vec4 eyePos;
varying vec3 vNormal;
varying vec4 vPosition;
varying vec4 vDepth;
#endif

#ifdef USE_TEXTURE
uniform sampler2D uMainTexture;
varying vec2 vMainUV;
#endif

void main () {

#ifdef USE_TEXTURE
    gl_FragColor = gl_FragColor * texture2D(uMainTexture, vMainUV);
#endif
#ifdef OPEN_LIGHT
    vec3 normal = normalize(vNormal);
    vec3 totalLighting = ambient;
    //normal, position, depth, color
    gl_FragData[0] = vec4(vec3(vDepth), 1.0);
    gl_FragData[1] = vec4(normalize(vNormal.xyz), 1.0);
    gl_FragData[2] = vPosition;
    gl_FragData[3] = vec4(texture2D(uMainTexture, vMainUV).xyz, 1.0);
#endif
}
