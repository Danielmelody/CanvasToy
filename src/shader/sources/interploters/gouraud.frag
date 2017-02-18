attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;

void main() {
    textureColor = colorOrMainTexture(vMainUV);
#ifdef OPEN_LIGHT
    totalLighting = ambient;
    vec3 normal = normalize(vNormal);
    gl_FragColor = vec4(totalLighting, 1.0);
#else
#ifdef USE_COLOR
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
#endif
#endif
#ifdef _MAIN_TEXTURE
    gl_FragColor = gl_FragColor * textureColor;
#endif
#ifdef USE_COLOR
    gl_FragColor = gl_FragColor * color;
#endif
}
