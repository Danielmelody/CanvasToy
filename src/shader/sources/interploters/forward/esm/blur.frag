uniform sampler2D uOrigin;
uniform vec2 uBlurDir;
uniform float uBlurStep;

varying vec4 vProjPos;

#define ESM_C 600.0

float float_from_rgba(sampler2D origin, vec2 uv) {
    return unpackFloat1x32(texture2D(origin, uv));
}


void main () {
    vec2 uv = vProjPos.xy * 0.5 + 0.5;
    float base = float_from_rgba(uOrigin, uv);
    float average = 0.0;
    average += exp((float_from_rgba(uOrigin, uv - 4.0 * uBlurStep * uBlurDir) - base) * ESM_C ) * 0.0162162162;
    average += exp((float_from_rgba(uOrigin, uv - 3.0 * uBlurStep * uBlurDir) - base) * ESM_C ) * 0.0540540541;
    average += exp((float_from_rgba(uOrigin, uv - 2.0 * uBlurStep * uBlurDir) - base) * ESM_C ) * 0.1216216216;
    average += exp((float_from_rgba(uOrigin, uv - 1.0 * uBlurStep * uBlurDir) - base) * ESM_C ) * 0.1945945946;
    average += 0.2270270270;
    average += exp((float_from_rgba(uOrigin, uv + 1.0 * uBlurStep * uBlurDir) - base) * ESM_C ) * 0.1945945946;
    average += exp((float_from_rgba(uOrigin, uv + 2.0 * uBlurStep * uBlurDir) - base) * ESM_C ) * 0.1216216216;
    average += exp((float_from_rgba(uOrigin, uv + 3.0 * uBlurStep * uBlurDir) - base) * ESM_C ) * 0.0540540541;
    average += exp((float_from_rgba(uOrigin, uv + 4.0 * uBlurStep * uBlurDir) - base) * ESM_C ) * 0.0162162162;
    average = base + log(average) / ESM_C;
    gl_FragColor = packFloat1x32(average);
}
