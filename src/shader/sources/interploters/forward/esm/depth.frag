varying vec3 viewPos;

void main () {
    gl_FragColor.r = -viewPos.z;
}
