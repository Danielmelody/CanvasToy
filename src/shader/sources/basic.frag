#version 100

#ifdef USE_COLOR
varying vec4 vColor;
#endif

#ifdef USE_MAIN_TEXTURE
varying vec2 vMainTextureST;
uniform sampler2D mainTexture;
vec4 textureColor;
#endif

#ifdef OPEN_LIGHT
varying vec3 vNormal;
#endif

void main() {
#ifdef USE_COLOR
    gl_FragColor = vColor;
#endif

#ifdef USE_MAIN_TEXTURE
    gl_FragColor = texture2D(mainTexture, vec2(vMainTextureST.s, vMainTextureST.t));
#endif

}
