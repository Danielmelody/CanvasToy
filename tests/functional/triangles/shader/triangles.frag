varying vec2 vTextureCoord;
uniform sampler2D uTextureSampler;
vec4 textureColor;

void main() {
#ifdef USE_TEXTURE
    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = textureColor;
#endif
}
