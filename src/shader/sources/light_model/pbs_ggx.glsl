float lambda_theta(float roughness, float cos_2) {
    float factor = 1.0 + roughness * (1.0 - cos_2) / cos_2;
    float factorSqr = factor * factor;
    return (factor * factorSqr * factorSqr - 1.0) / 2.0;
}

float tangent_2(float cos_2) {
    return (1. - cos_2) / cos_2;
}

float Smith_G1(float NdotV, float roughness) {
    float tan_2 = tangent_2(NdotV * NdotV);
    float root = roughness * roughness * tan_2;
    return 2.0 / (1. + sqrt(1. + root));
}

float GGX_D(float HdotN, float roughness) {
    float cos_2 = HdotN * HdotN;
    float tan_2 = tangent_2(cos_2);

    float root = roughness / (cos_2 * (roughness * roughness + tan_2));
    return root * root / acos(-1.);
}

vec3 calculateLight(
    Material material,
    vec3 position,
    vec3 normal,
    vec3 lightDir,
    vec3 eyePos,
    vec3 lightColor,
    float idensity
    ) {
    vec3 viewDir = normalize(eyePos - position);

    vec3 halfVec = normalize(lightDir + viewDir);

    float LdotN = dot(lightDir, normal);
    float VdotN = dot(viewDir, normal);
    float HdotN = dot(halfVec, normal);
    float LdotH = dot(lightDir, halfVec);
    float VdotH = dot(viewDir, halfVec);

    if (VdotN < 0. || LdotN < 0.) {
        return vec3(0.);
    }

    float OneMinusLdotH = 1. - LdotH;
    float OneMinusLdotHSqr = OneMinusLdotH * OneMinusLdotH;

    vec3 albedo = material.albedo * lightColor;

    vec3 fresnel = albedo + (1. - albedo) * OneMinusLdotHSqr * OneMinusLdotHSqr * OneMinusLdotH;

    float d = GGX_D(HdotN, material.roughness);
    float g = Smith_G1(VdotN, material.roughness) * Smith_G1(LdotN, material.roughness);
    vec3 specbrdf = fresnel * (g * d / (4. * VdotN * LdotN));

    float OneMinusLdotN = 1. - LdotN;
    float OneMinusLdotNSqr = OneMinusLdotN * OneMinusLdotN;

    float OneMinusVdotN = 1. - VdotN;
    float OneMinusVdotNSqr = OneMinusVdotN * OneMinusVdotN;

    float fd90 = 0.5 + 2.0 * material.roughness * (LdotH * LdotH);
    vec3 diffbrdf = (albedo / acos(-1.)) * (1.0 + (fd90 - 1.0) * OneMinusLdotN * OneMinusLdotNSqr * OneMinusLdotNSqr) *
                (1.0 + (fd90 - 1.0) * OneMinusVdotN * OneMinusVdotNSqr * OneMinusVdotNSqr);


    vec3 color = (material.metallic * 0.96 + 0.04) * specbrdf + ((1. - material.metallic) * 0.96) * diffbrdf;
    return color * LdotN;
}