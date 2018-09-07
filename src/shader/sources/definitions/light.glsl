#define SHADOW_LEVEL_NONE 0
#define SHADOW_LEVEL_HARD 1
#define SHADOW_LEVEL_SOFT 2
#define SHADOW_LEVEL_PCSS 3

struct Light {
  vec3 color;
  float idensity;
  vec3 direction;
#ifdef RECEIVE_SHADOW
  lowp int shadowLevel;
  float softness;
  float shadowMapSize;
  mat4 projectionMatrix;
  mat4 viewMatrix;
#endif
};

struct DirectLight {
  vec3 color;
  float idensity;
  vec3 direction;
#ifdef RECEIVE_SHADOW
  lowp int shadowLevel;
  float softness;
  float shadowMapSize;
  mat4 projectionMatrix;
  mat4 viewMatrix;
#endif
};

struct PointLight {
  vec3 color;
  float idensity;
  float radius;
  vec3 position;
  float squareAtten;
  float linearAtten;
  float constantAtten;
#ifdef RECEIVE_SHADOW
  lowp int shadowLevel;
  float softness;
  float shadowMapSize;
  mat4 projectionMatrix;
  mat4 viewMatrix;
  float pcssArea;
#endif
};

struct SpotLight {
  vec3 color;
  float idensity;
  float radius;
  vec3 position;
  float squareAtten;
  float linearAtten;
  float constantAtten;
  float coneAngleCos;
  vec3 spotDir;
#ifdef RECEIVE_SHADOW
  lowp int shadowLevel;
  float softness;
  float shadowMapSize;
  mat4 projectionMatrix;
  mat4 viewMatrix;
  float pcssArea;
#endif
};
