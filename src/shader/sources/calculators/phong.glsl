vec3 calculateLight(
    vec3 position,
    vec3 normal,
    vec3 lightDir,
    vec3 eyePos,
    vec3 specularLight,
    vec3 diffuseLight,
    float shiness,
    float idensity
    ) {
    float lambortian = max(dot(lightDir, normal), 0.0);
    vec3 reflectDir = normalize(reflect(lightDir, normal));
    vec3 viewDir = normalize(eyePos - position);
    float specularAngle = max(dot(reflectDir, viewDir), 0.0);
    vec3 specularColor = specularLight * pow(specularAngle, shiness);
    vec3 diffuseColor = diffuse * lambortian;
    return (diffuseColor + specularColor) * idensity;
}
