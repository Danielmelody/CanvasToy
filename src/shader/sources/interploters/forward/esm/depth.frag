varying vec4 vProjPos;

void main () {
    float depth = vProjPos.z / vProjPos.w * 0.5 + 0.5;
    gl_FragColor = packFloat1x32(depth);
}
