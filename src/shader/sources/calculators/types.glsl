vec3 calculateDirLight(
    DirectLight light,
    vec3 materialDiff,
    vec3 materialSpec,
    float materialSpecExp,
    vec3 position,
    vec3 normal,
    vec3 eyePos
    ) {
    return calculateLight(
        position,
        normal,
        -light.direction,
        eyePos,
        light.color * materialSpec,
        light.color * materialDiff,
        materialSpecExp,
        light.idensity
    );
}

vec3 calculatePointLight(
    PointLight light,
    vec3 materialDiff,
    vec3 materialSpec,
    float materialSpecExp,
    vec3 position,
    vec3 normal,
    vec3 eyePos
    ) {
    float lightDis = length(light.position - position);
    lightDis /= light.radius;
    float atten_min = 1.0 / (light.constantAtten + light.linearAtten + light.squareAtten);
    float atten_max = 1.0 / light.constantAtten;
    float atten = 1.0 / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);
    float idensity = light.idensity * (atten - atten_min) / (atten_max - atten_min);
    idensity *= step(lightDis, 1.0);
    return calculateLight(
        position,
        normal,
        normalize(light.position - position),
        eyePos,
        light.color * materialSpec,
        light.color * materialDiff,
        materialSpecExp,
        idensity
    );
}

vec3 calculateSpotLight(
    SpotLight light,
    vec3 materialDiff,
    vec3 materialSpec,
    float materialSpecExp,
    vec3 position,
    vec3 normal,
    vec3 eyePos
    ) {
    vec3 lightDir = normalize(light.position - position);
    float spotFactor = dot(-lightDir, light.spotDir);
    if (spotFactor < light.coneAngleCos) {
        return vec3(0.0);
    }
    float lightDis = length(light.position - position);
    lightDis /= light.radius;
    float atten_min = 1.0 / (light.constantAtten + light.linearAtten + light.squareAtten);
    float atten_max = 1.0 / light.constantAtten;
    float atten = 1.0 / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);
    float idensity = light.idensity * (atten - atten_min) / (atten_max - atten_min);
    
    idensity *= (spotFactor - light.coneAngleCos) / (1.0 - light.coneAngleCos);
    // idensity *= step(light.radius, lightDis);
    return calculateLight(
        position,
        normal,
        lightDir,
        eyePos,
        light.color * materialSpec,
        light.color * materialDiff,
        materialSpecExp,
        idensity
    );
}

// float directAndSpotShadow(sampler2D shadowMap, vec4 shadowCoord) {
//
// }
