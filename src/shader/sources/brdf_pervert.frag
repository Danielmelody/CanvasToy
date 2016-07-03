#ifdef USE_COLOR // color declaration
uniform vec4 color;
#endif // color declaration

#ifdef USE_TEXTURE // texture declaration
varying vec2 vTextureCoord;
uniform sampler2D uTextureSampler;
#endif // texture declaration

#ifdef OPEN_LIGHT // light declaration
varying vec3 vLightColor;
#endif // light declaration

void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
#ifdef USE_COLOR
    gl_FragColor = color;
#endif

#ifdef USE_TEXTURE
    gl_FragColor = gl_FragColor * texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));
#endif

#ifdef OPEN_LIGHT
    gl_FragColor = gl_FragColor * vec4(vLightColor, 1.0);
#endif
}
