vec4 gaussian_blur(sampler2D origin, vec2 uv, float blurStep, vec2 blurDir) {
    vec4 average = vec4(0.0, 0.0, 0.0, 0.0);
    average += texture2D(origin, uv - 4.0 * blurStep * blurDir) * 0.0162162162;
    average += texture2D(origin, uv - 3.0 * blurStep * blurDir) * 0.0540540541;
    average += texture2D(origin, uv - 2.0 * blurStep * blurDir) * 0.1216216216;
    average += texture2D(origin, uv - 1.0 * blurStep * blurDir) * 0.1945945946;
    average += texture2D(origin, uv) * 0.2270270270;
    average += texture2D(origin, uv + 1.0 * blurStep * blurDir) * 0.1945945946;
    average += texture2D(origin, uv + 2.0 * blurStep * blurDir) * 0.1216216216;
    average += texture2D(origin, uv + 3.0 * blurStep * blurDir) * 0.0540540541;
    average += texture2D(origin, uv + 4.0 * blurStep * blurDir) * 0.0162162162;
    return average;
}
