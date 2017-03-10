float checkerBoard(in vec2 uv, in float subSize) {
    vec2 bigBox = mod(uv, vec2(subSize * 2.0));
    return (
        step(subSize, bigBox.x) * step(subSize, bigBox.y)
        + step(subSize, subSize * 2.0 -bigBox.x) * step(subSize, subSize * 2.0 -bigBox.y)
    );
}
