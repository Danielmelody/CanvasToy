uniform sampler2D uOrigin;
uniform vec2 uBlurDir;
uniform float uBlurStep;

varying vec4 vProjPos;
varying vec3 vNormal;

void main () {
    vec2 uv = vProjPos.xy * 0.5 + 0.5;
    float base = texture2D(uOrigin, uv).r;
    float average = 0.0;
    gl_FragColor.r = base;
    //if (dot(vNormal, vec3(0, 0, -1)) > 0.0) 
    //{
        average += exp((texture2D(uOrigin, uv - 4.0 * uBlurStep * uBlurDir).r - base)) * 0.0162162162;
        average += exp((texture2D(uOrigin, uv - 3.0 * uBlurStep * uBlurDir).r - base)) * 0.0540540541;
        average += exp((texture2D(uOrigin, uv - 2.0 * uBlurStep * uBlurDir).r - base)) * 0.1216216216;
        average += exp((texture2D(uOrigin, uv - 1.0 * uBlurStep * uBlurDir).r - base)) * 0.1945945946;
        average += 0.2270270270;
        average += exp((texture2D(uOrigin, uv + 1.0 * uBlurStep * uBlurDir).r - base)) * 0.1945945946;
        average += exp((texture2D(uOrigin, uv + 2.0 * uBlurStep * uBlurDir).r - base)) * 0.1216216216;
        average += exp((texture2D(uOrigin, uv + 3.0 * uBlurStep * uBlurDir).r - base)) * 0.0540540541;
        average += exp((texture2D(uOrigin, uv + 4.0 * uBlurStep * uBlurDir).r - base)) * 0.0162162162;
        average += log(average);
    // }
     gl_FragColor.r += average;
}
