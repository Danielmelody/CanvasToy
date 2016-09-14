varying vec4 triangleColor;

void main() {
#ifdef USE_TEXTURE
    gl_FragColor = triangleColor;
#endif
}
