float esm_pcf(vec2 originUV, sampler2D shadowMap, float d) {
    float average = 0.0;
    for (float i = -1.0; i < 2.0; ++i) {
        for (float j = -1.0; j < 2.0; ++j) {
            vec2 uv = originUV + (0.0001) * vec2(i, j);
            average += exp((unpackFloat1x32(texture2D(shadowMap, uv)) - d) * 600.0);
        }
    }
    return average / 9.0;
}

float getSpotDirectionShadow(vec4 shadowCoord, sampler2D shadowMap)
{
    vec3 NDCoord = shadowCoord.xyz / shadowCoord.w;
    vec2 uv = NDCoord.xy * 0.5 + 0.5;
    if (uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0) {
        float d = 0.5 * NDCoord.z + 0.5;
        float s = exp((unpackFloat1x32(texture2D(shadowMap, uv)) - d) * 600.0);
        if (s > 1.0001) {
            s = esm_pcf(uv, shadowMap, d);
        }
        return min(s, 1.0 + 0.01);
    } else {
        return 1.0;
    }
}
