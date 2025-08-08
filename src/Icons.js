import {
  Group,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Vector2,
  Vector3,
  TextureLoader,
} from "three";

import vertexShader from "./shaders/vertex.js";
import fragmentShader from "./shaders/fragment.js";

export default class Icons extends Group {
  constructor() {
    super();

    this.uniforms = {
      u_time: { value: 0 },
      u_mouse: { value: new Vector2(0, 0) },
      u_globalBrightness: { value: 1.0 },
      u_size: { value: 0.3 },
    };

    this.icons = [];
    this.textures = [];
    this._loadTextures();
  }

  _loadTextures() {
    const loader = new TextureLoader();
    const textureFiles = Array.from({ length: 12 }, (_, i) => `/assets/i${i + 1}.png`);

    for (const file of textureFiles) {
      this.textures.push(loader.load(file));
    }

    this._createIcons();
  }

  _createIcons() {
    const geometry = new PlaneGeometry(0.5, 0.5);
    const count = 20;

    for (let i = 0; i < count; i++) {
      const texture = this.textures[Math.floor(Math.random() * this.textures.length)];

      const uniforms = {
        u_time: this.uniforms.u_time,
        u_mouse: this.uniforms.u_mouse,
        u_globalBrightness: this.uniforms.u_globalBrightness,
        u_size: this.uniforms.u_size,
        u_alpha: { value: 1.0 },
        u_texture: { value: texture },
      };

      const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
      });

      const mesh = new Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 2,
        0
      );

      this.icons.push(mesh);
      this.add(mesh);

      mesh.userData.basePosition = mesh.position.clone();
      mesh.userData.pulseOffset = Math.random() * Math.PI * 2;
      mesh.userData.pulseSpeed = 3 + Math.random() * 6;
    }
  }

  onMouseMove(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);
    this.uniforms.u_mouse.value.set(x, y);
  }

  update(delta) {
    this.uniforms.u_time.value += delta;
    const mousePos = this.uniforms.u_mouse.value.clone();

    for (const icon of this.icons) {
      const basePos = icon.userData.basePosition || icon.position.clone();
      icon.userData.basePosition = basePos;

      const dist = icon.position.distanceTo(
        new Vector3(mousePos.x, mousePos.y, 0)
      );
      const dir = icon.position
        .clone()
        .sub(new Vector3(mousePos.x, mousePos.y, 0))
        .normalize();
      const pushForce = Math.max(0, 1 - dist / 1.5) * 0.1;

      icon.position.lerp(
        basePos.clone().add(dir.multiplyScalar(pushForce)),
        0.1
      );
    }
  }
}
