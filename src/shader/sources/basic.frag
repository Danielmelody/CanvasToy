#ifdef USE_COLOR
varying vec4 vColor;
#endif

#ifdef USE_TEXTURE
varying vec2 vTextureCoord;
uniform sampler2D uTextureSampler;
vec4 textureColor;
#endif

#ifdef OPEN_LIGHT
varying vec3 vNormal;
#endif

void main() {
#ifdef USE_COLOR
    gl_FragColor = vColor;
#endif

#ifdef USE_TEXTURE
    gl_FragColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));
#endif

}
