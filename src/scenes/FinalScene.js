import * as THREE from "three";
import gsap from "gsap";
import { createText } from "./utils.js";

export default class FinalScene {
  constructor(renderer, camera) {
    this._renderer = renderer;
    this._camera = camera;
    this._scene = new THREE.Scene();
    this._clock = new THREE.Clock();
    this._textMeshes = [];

    this._setup();
  }

  async _setup() {
    await this._setTexts();
    this._animate();
  }

  async _setTexts() {
    const lines = [
      "But her main superpower was:",
      "being delusional.",
      "Somehow she always thought she'd find time to do everything.",
    ];

    const initialScale = 10;
    let dynamicText = createText(
      "",
      new THREE.Vector3(0, 0, 0),
      window.innerWidth,
      window.innerHeight,
      "#ffffff",
      initialScale
    );
    this._scene.add(dynamicText);

    const tl = gsap.timeline();

    for (const line of lines) {
      tl.to({}, { duration: 0.5 });

      if (line === "being delusional.") {
        tl.to(
          dynamicText.scale,
          {
            x: 20,
            y: 20,
            z: 20,
            duration: 0.3,
            ease: "back.out(2)",
          },
          ">"
        );
      } else if (
        line === "Somehow she always thought she'd find time to do everything."
      ) {
        tl.to(
          dynamicText.scale,
          {
            x: 7,
            y: 7,
            z: 7,
            duration: 0.3,
            ease: "power2.out",
          },
          ">"
        );
      } else {
        tl.to(
          dynamicText.scale,
          {
            x: 10,
            y: 10,
            z: 10,
            duration: 0.3,
            ease: "power2.out",
          },
          ">"
        );
      }

      for (let i = 0; i <= line.length; i++) {
        tl.to(
          {},
          {
            duration: 0.03,
            onUpdate: () => {
              dynamicText.setText(line.slice(0, i));
            },
          }
        );
      }

      if (line === "being delusional.") {
        tl.to(
          dynamicText.material.color,
          {
            r: 1,
            g: 0,
            b: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          "<"
        );
        tl.to(
          dynamicText.rotation,
          {
            z: "+=0.2",
            yoyo: true,
            repeat: 3,
            duration: 0.1,
          },
          ">"
        );
        tl.to({}, { duration: 3 });
      } else {
        tl.to({}, { duration: 2.5 });
      }

      for (let i = line.length; i >= 0; i--) {
        tl.to(
          {},
          {
            duration: 0.015,
            onUpdate: () => {
              dynamicText.setText(line.slice(0, i));
            },
          }
        );
      }

      tl.to(dynamicText.scale, {
        x: initialScale,
        y: initialScale,
        z: initialScale,
        duration: 0.3,
        ease: "power2.inOut",
      });

      tl.set(dynamicText.rotation, { z: 0 });
      tl.set(dynamicText.material.color, { r: 1, g: 1, b: 1 });
    }

    const finalLinesBlock = [
      "In the end…",
      "Vivi is me.",
      "And this was the story because…",
      "…I didn’t have time to make a better one.",
    ];

    this._textMeshes = finalLinesBlock.map((line, i) => {
      const mesh = createText(
        line,
        new THREE.Vector3(0, 0.5 - i * 0.4, 0),
        window.innerWidth,
        window.innerHeight,
        "#ffffff",
        7
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
          ease: "power1.inOut",
        },
        `+=${i === 0 ? 0.5 : 0.8}`
      );
    });
  }

  _animate = () => {
    requestAnimationFrame(this._animate);
    this._renderer.render(this._scene, this._camera);
  };
}
