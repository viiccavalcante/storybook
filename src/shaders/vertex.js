export default `
  precision mediump float;

  uniform float u_time;
  uniform float u_size;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 pos = position;
    float scale = u_size;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos * scale, 1.0);
  }
`;
