import * as THREE from "three";
import Icons from "../Icons.js";
import FinalScene from "./FinalScene.js";

export default class SecondScene {
  constructor(renderer, camera, loadScene) {
    this._renderer = renderer;
    this._camera = camera;
    this._camera.position.set(0, 0, 1);
    this._camera.rotation.x = 0.1; 

    this._scene = new THREE.Scene();
    this._clock = new THREE.Clock();
    this._textMeshes = [];
    this._icons = new Icons();
    this._loadNextScene = loadScene;

    this._scene.add(this._icons);

    this._setup();
    this._initEvents();
  }

  async _setup() {
    this._animate();
  }

  _initEvents() {
    window.addEventListener("mousemove", (e) => this._icons.onMouseMove(e));
    window.addEventListener("click", () => {
      if (this._loadNextScene) {
        this._loadNextScene(FinalScene);
      }
    });
  }

  _animate = () => {
    requestAnimationFrame(this._animate);
    const delta = this._clock.getDelta();

    this._icons.update(delta);
    this._renderer.render(this._scene, this._camera);
  };
}
