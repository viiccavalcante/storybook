export default `
  precision mediump float;

  uniform sampler2D u_texture;         
  uniform float u_alpha;              
  uniform float u_globalBrightness;   
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(u_texture, vUv);

    texColor.rgb *= u_globalBrightness;
    texColor.a *= u_alpha;

    if (texColor.a < 0.01) discard;
    gl_FragColor = texColor;
  }
`;
