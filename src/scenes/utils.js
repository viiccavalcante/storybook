import * as THREE from "three";
import arrowImg from "../../public/assets/arrow.png";

export function createFloatingText2D(message, options = {}) {
  const {
    font = "bold 80px Arial",
    fillStyle = "#ffffff",
    width = 1024,
    height = 256,
    scale = new THREE.Vector3(5, 1.25, 1),
    position = new THREE.Vector3(0, 2, 0),
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context.font = font;
  context.fillStyle = fillStyle;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.clearRect(0, 0, width, height);
  context.fillText(message, width / 2, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.copy(scale);
  sprite.position.copy(position);

  return sprite;
}

export function createArrow(position = new THREE.Vector3(0, -1.5, 0)) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      arrowImg,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        });
        const geometry = new THREE.PlaneGeometry(1, 1);
        const arrowMesh = new THREE.Mesh(geometry, material);
        arrowMesh.position.copy(position);
        resolve(arrowMesh);
      },
      undefined,
      (err) => reject(err)
    );
  });
}
