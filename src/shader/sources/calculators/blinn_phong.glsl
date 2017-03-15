vec3 calculateLight(
    vec3 position,
    vec3 normal,
    vec3 lightDir,
    vec3 eyePos,
    vec3 specular,
    vec3 diffuse,
    float shiness,
    float idensity
    ) {
    float lambortian = max(dot(lightDir, normal), 0.0);
    vec3 reflectDir = normalize(reflect(lightDir, normal));
    vec3 viewDir = normalize(eyePos - position);

    // replace R * V with N * H
    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);
    float specularAngle = max(dot(H, normal), 0.0);

    vec3 specularColor = specular * pow(specularAngle, shiness);
    vec3 diffuseColor = diffuse * lambortian;
    return (diffuseColor + specularColor) * idensity;
}
