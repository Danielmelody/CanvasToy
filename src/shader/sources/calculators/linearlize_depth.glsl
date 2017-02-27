float linearlizeDepth(float far, float near, float depth) {
    float NDRDepth = depth * 2.0 - 1.0;;
    return 2.0 * near / (near + far - NDRDepth * (far - near));
}
