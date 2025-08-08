import * as THREE from "three";
import gsap from "gsap";
import { createText } from "./utils.js";
import SecondScene from "./SecondScene";

export default class FirstScene {
  constructor(renderer, camera, loadScene) {
    this._renderer = renderer;
    this._camera = camera;
    this._scene = new THREE.Scene();
    this._clock = new THREE.Clock();
    this._textMeshes = [];
    this._loadNextScene = loadScene;

    this._setup();
    this._initEvents();
  }

  async _setup() {
    this._setTexts();
    this._animate();
  }

  async _setTexts() {
    const initialScale = 7;

    const dynamicText = createText(
      "",
      new THREE.Vector3(0, 0, 0),
      window.innerWidth,
      window.innerHeight,
      "#ffffff",
      initialScale
    );
    this._scene.add(dynamicText);

    const tl = gsap.timeline();

    const lines = [
      "Once upon a time... there was Vivi",
      "Vivi had many ideas (like, a lot)",
      "She also wanted to do 185 things at once.",
      "So her mind was like that:",
    ];

    this._textMeshes = lines.map((line, i) => {
      const mesh = createText(
        line,
        new THREE.Vector3(0, 0.5 - i * 0.5, 0),
        window.innerWidth,
        window.innerHeight,
        "#ffffff",
        6
      );
      mesh.material.opacity = 0;
      this._scene.add(mesh);
      return mesh;
    });

    this._textMeshes.forEach((mesh, i) => {
      tl.to(
        mesh.material,
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        `+=${i === 0 ? 0.5 : 1}`
      );
    });

    tl.to(
      this._textMeshes.map((mesh) => mesh.material),
      {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      "+=2"
    )
  }

  _initEvents() {
    window.addEventListener("click", () => {
      this._loadNextScene(SecondScene);
    });
  }

  _animate = () => {
    requestAnimationFrame(this._animate);
    this._renderer.render(this._scene, this._camera);
  };
}
