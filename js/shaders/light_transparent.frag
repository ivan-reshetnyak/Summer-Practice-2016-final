precision mediump float;

uniform sampler2D TextureRefraction;
uniform vec3 CameraPos;
uniform float RefractionCoefficient;
uniform float DistortionStrength;
uniform vec3 DiffuseColor;

varying vec3 Norm;
varying vec3 Pos;
varying vec2 PosS;

float rand( vec2 co )
{
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 noise( vec3 v )
{
  return vec3(rand(v.yz), rand(v.xz), rand(v.xy));
}

void main()
{
  vec3 dir = normalize(Pos - CameraPos);
  vec3 dnorm = Norm;
  vec3 dist = noise(Pos * Norm);
  dnorm += dist;

  vec4 refr = texture2D(TextureRefraction, PosS + (dnorm.xz + dnorm.xy + dnorm.yz) * DistortionStrength / 3.0);
  gl_FragColor = vec4(DiffuseColor, 1.0) + refr;
  //gl_FragColor = refr;
}