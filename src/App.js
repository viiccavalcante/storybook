import * as THREE from 'three';

export default class App {
  constructor(InitialScene) {
    this._initRender();
    this._setCamera();

    this._scene = null;

    this._initEvents();
    this._changeScene(InitialScene);
  }

  _setCamera() {
    this._camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this._camera.position.set(0, 1.5, 4);
  }

  _initRender() {
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.shadowMap.enabled = true;
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(this._renderer.domElement);
  }

   _resize() {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  }

  _initEvents() {
    window.addEventListener("resize", this._resize.bind(this));
  }

  _changeScene(SceneClass) {
    if (this.currentScene?.destroy) {
      this.currentScene.destroy();
    }

    this.currentScene = new SceneClass(
      this._renderer,
      this._camera,
      (NextScene) => this._changeScene(NextScene)
    );
  }
}
