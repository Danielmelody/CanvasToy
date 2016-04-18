#extension GL_OES_standard_derivatives : enable

varying vec3 vNormal;
varying sampler2D uSampler;
varying vec4 vColor;

vec4 outColor ;

vec4 diffuse;
vec4 specular;
vec4 ambient;

vec4 light;
vec3 normal;
vec2 uv;

vec3 flatNormals(vec3 pos) {
  vec3 fdx = dFdx(pos);
  vec3 fdy = dFdy(pos);
  return normalize(cross(fdx, fdy));
}


void main() {

	diffuseColor  = vec4(1.0,1.0,1.0,1.0);
	specularColor = vec4(0.0,0.0,0.0,0.0);
	ambientColor  = vec4(0.0,0.0,0.0,0.0);
	light         = vec4(0.0,0.0,0.0,0.0);

    normal = normalize(varying_eyeNormal) ;
	uv_0 = varying_uv0;

}
