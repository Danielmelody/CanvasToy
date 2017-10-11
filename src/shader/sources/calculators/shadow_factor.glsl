float getSpotDirectionShadow(vec2 clipPos, sampler2D shadowMap, float linearDepth, float lambertian, float texelSize)
{
    vec2 uv = clipPos * 0.5 + 0.5;
    
    vec2 f = fract(uv / texelSize - 0.5);
    vec2 centroidUV = (floor(uv / texelSize - 0.5)) * texelSize;

    float lb = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 0.0)).r;
    float lt = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 1.0)).r;
    float rb = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 0.0)).r;
    float rt = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 1.0)).r;
    float a = lb + log(mix(1.0, exp(lt - lb), f.y));
    float b = rb + log(mix(1.0, exp(rt - rb), f.y));
    float z = a + log(mix(1.0, exp(b - a), f.x));

    float bias = clamp(0.1 * tan(acos(lambertian)), 0.0, 1.0);

    float s = exp((z + bias - linearDepth));

    return min(s, 1.0);
}
