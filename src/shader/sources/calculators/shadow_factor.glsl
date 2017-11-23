#ifdef RECEIVE_SHADOW

vec4 texture2DbilinearEXP(sampler2D shadowMap, vec2 uv, float texelSize) {
    vec2 f = fract(uv / texelSize - 0.5);
    vec2 centroidUV = (floor(uv / texelSize - 0.5)) * texelSize;

    vec4 lb = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 0.0));
    vec4 lt = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 1.0));
    vec4 rb = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 0.0));
    vec4 rt = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 1.0));
    vec4 a = lb + log(mix(vec4(1.0), exp(lt - lb), f.y));
    vec4 b = rb + log(mix(vec4(1.0), exp(rt - rb), f.y));
    vec4 z = a + log(mix(vec4(1.0), exp(b - a), f.x));
    return z;
}

vec4 texture2Dbilinear(sampler2D shadowMap, vec2 uv, float texelSize) {
    vec2 f = fract(uv / texelSize - 0.5);
    vec2 centroidUV = (floor(uv / texelSize - 0.5)) * texelSize;

    vec4 lb = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 0.0));
    vec4 lt = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 1.0));
    vec4 rb = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 0.0));
    vec4 rt = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 1.0));
    vec4 a = mix(lb, lt, f.y);
    vec4 b = mix(rb, rt, f.y);
    vec4 z = mix(a, b, f.x);
    return z;
}

float texture2Dfilter(sampler2D shadowMap, vec2 uv, float texelSize) {
    vec2 info = texture2Dbilinear(shadowMap, uv, texelSize).xy;
    float base = info.r;
    float kernelSize = info.g;
    float sum = 0.0;
    for (int i = 0; i < FILTER_SIZE; ++i) {
        for (int j = 0; j < FILTER_SIZE; ++j) {
            vec2 subuv = uv + vec2(float(i) + 0.5 - float(FILTER_SIZE) / 2.0, float(j) + 0.5 - float(FILTER_SIZE) / 2.0) * texelSize * kernelSize;
            float z = texture2Dbilinear(shadowMap, subuv, texelSize).r;
            float expd = exp(z - base);
            sum += expd;
        }
    }
    sum /= float(FILTER_SIZE * FILTER_SIZE);
    return base + log(sum);
}

float pcf(sampler2D shadowMap, vec2 uv, float depth, float bias, float texelSize) {
    vec2 info = texture2Dbilinear(shadowMap, uv, texelSize).xy;
    float kernelSize = 1.0;
    float sum = 0.0;
    for (int i = 0; i < FILTER_SIZE; ++i) {
        for (int j = 0; j < FILTER_SIZE; ++j) {
            float z = texture2Dbilinear(shadowMap, uv + kernelSize * vec2(float(i) + 0.5 - float(FILTER_SIZE) / 2.0, float(j) + 0.5 - float(FILTER_SIZE) / 2.0).x * texelSize, texelSize).r;
            sum += step(depth - bias, z) / float(FILTER_SIZE * FILTER_SIZE);
        }
    }
    return sum;
}

float getSpotDirectionShadow(vec2 clipPos, sampler2D shadowMap, float linearDepth, float lambertian, float texelSize, int shadowLevel, float softness)
{
    if (shadowLevel == SHADOW_LEVEL_NONE) {
        return 1.0;
    } else {
        vec2 uv = clipPos * 0.5 + 0.5;
        float bias = clamp(0.2 * tan(acos(lambertian)), 0.0, 1.0);
        if (shadowLevel == SHADOW_LEVEL_HARD) {
            return step(texture2D(shadowMap, uv).r + bias, linearDepth);
        } else {
            float z = texture2DbilinearEXP(shadowMap, uv, texelSize).r;
            float s = exp(z - linearDepth * softness);
            return min(s, 1.0);
        }
    }
}
#endif
