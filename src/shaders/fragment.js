export default `
  precision mediump float;
  uniform sampler2D u_texture;
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(u_texture, vUv);
    float alpha = texColor.a;

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(texColor.rgb, alpha);
  }
`;
