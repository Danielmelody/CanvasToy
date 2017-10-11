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
    float idensity = light.idensity / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);
    idensity *= step(lightDis, light.radius);
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
    float idensity = light.idensity / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);
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
