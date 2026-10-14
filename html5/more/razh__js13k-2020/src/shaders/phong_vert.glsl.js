export default `
precision highp int;
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
varying vec3 vViewPosition;

attribute vec3 color;
varying vec3 vColor;

varying vec3 fogPosition;

void main() {
  vColor = color;

  vec4 e = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * e;
  vViewPosition = -e.xyz;

  fogPosition = e.xyz;
}
`.trim();
