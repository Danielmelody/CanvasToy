vec3 calculateDirLight(
    DirectLight light,
    Material material,
    vec3 position,
    vec3 normal,
    vec3 eyePos
    ) {
    return calculateLight(
        material,
        normalize(eyePos - position),
        normal,
        -light.direction,
        light.color,
        light.idensity
    );
}

vec3 calculatePointLight(
    PointLight light,
    Material material,
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
    //idensity *= step(lightDis, 1.0);
    return calculateLight(
        material,
        normalize(eyePos - position),
        normal,
        normalize(light.position - position),
        light.color,
        idensity
    );
}

vec3 calculateSpotLight(
    SpotLight light,
    Material material,
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
        material,
        normalize(eyePos - position),
        normal,
        lightDir,
        light.color,
        idensity
    );
}
