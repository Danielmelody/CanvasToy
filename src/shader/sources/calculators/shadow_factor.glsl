float getSpotDirectionShadow(vec4 shadowCoord, sampler2D shadowMap)
{
    vec3 NDCoord = shadowCoord.xyz / shadowCoord.w;
    vec2 uv = NDCoord.xy * 0.5 + 0.5;
    if (uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0) {
        float z = 0.5 * NDCoord.z + 0.5;
        float depth = texture2D(shadowMap, uv).x;
        if (depth < (z - 0.0001)) {
            return 0.5;
        } else {
            return 1.0;
        }
    } else {
        return 1.0;
    }
}
