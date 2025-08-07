import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import gsap from "gsap";
import "./style.css";

export default class App {
  _scene;
  _camera;
  _renderer;
  _raycaster;
  _mouse;
  _closedBook;
  _openBook;
  _clock;

  constructor() {
    this._init();
    this._animate();
    this._initEvents();
  }

  _init() {
    this._scene = new THREE.Scene();
    this._clock = new THREE.Clock();

    this._setCamera();
    this._initRender();
    this._setLighting();
    this._loadModels();
    this._createPlane();

    const controls = new OrbitControls(this._camera, this._renderer.domElement);

    this._raycaster = new THREE.Raycaster();
    this._mouse = new THREE.Vector2();
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

  _setLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this._scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xfff1c1, 150);
    spotLight.position.y = 3;
    spotLight.angle = 0.6;
    spotLight.castShadow = true;
    spotLight.penumbra = 1.3;
    spotLight.distance = 10;
    this._scene.add(spotLight);
  }

  _loadModels() {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    );
    loader.setDRACOLoader(dracoLoader);

    loader.load("/models/closedBook.glb", (gltf) => {
      this._closedBook = gltf.scene;
      this._closedBook.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this._closedBook.scale.set(2.3, 2.3, 2.3);
      this._closedBook.position.set(0, 0, 0);
      this._closedBook.rotation.set(-50, 80, 0);
      this._scene.add(this._closedBook);
    });

    loader.load("/models/openBook.glb", (gltf) => {
      this._openBook = gltf.scene;
      this._openBook.visible = false;
      this._openBook.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this._scene.add(this._openBook);
    });
  }

  _createPlane() {
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;

    plane.receiveShadow = true;
    this._scene.add(plane);
  }

  _animate() {
    requestAnimationFrame(this._animate.bind(this));

    const time = this._clock.getElapsedTime();
    const floatHeight = 0.3;
    const floatSpeed = 1;

    if (this._closedBook && this._closedBook.visible) {
      this._closedBook.position.y = Math.sin(time * floatSpeed) * floatHeight;
    }

    if (this._openBook && this._openBook.visible) {
      this._openBook.position.y = Math.sin(time * floatSpeed) * floatHeight;
    }

    this._renderer.render(this._scene, this._camera);
  }

  _onMouseClick = (event) => {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this._raycaster.setFromCamera(this._mouse, this._camera);
    if (this._closedBook) {
      const intersects = this._raycaster.intersectObjects(
        this._closedBook.children,
        true
      );
      if (intersects.length > 0) {
        const tl = gsap.timeline();

        tl.to(
          this._closedBook.position,
          {
            y: 2,
            duration: 0.6,
            ease: "power1.inOut",
          },
          0
        );

        tl.to(
          this._closedBook.rotation,
          {
            y: "+=" + Math.PI,
            duration: 0.6,
            ease: "power1.inOut",
          },
          0
        );

        tl.to(this._closedBook.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.4,
          ease: "back.in",
          onComplete: () => {
            this._closedBook.visible = false;
            this._openBook.visible = true;
            this._openBook.scale.set(1, 1, 1);
            this._openBook.position.y = 2;
          },
        });

        tl.to(this._openBook.position, {
          y: 0,
          duration: 0.6,
          ease: "power1.out",
        });

        tl.to(
          this._openBook.scale,
          {
            x: 4,
            y: 4,
            z: 4,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.5"
        ); 
      }
    } 
  };

  _resize() {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  }

  _initEvents() {
    window.addEventListener("resize", this._resize.bind(this));
    window.addEventListener("click", this._onMouseClick.bind(this));
  }
}
