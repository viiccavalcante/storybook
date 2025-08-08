import * as THREE from "three";

export function createText(message, position, width, height, color, scale = 1, font = "bold 60px cursive") {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  function drawText(text) {
    context.clearRect(0, 0, width, height);
    context.font = font;
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, width / 2, height / 2);
  }

  drawText(message);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale * (height / width), 1);
  sprite.position.copy(position);

  sprite.setText = (newText) => {
    drawText(newText);
    texture.needsUpdate = true;
  };

  sprite.setColor = (newColor) => {
    color = newColor;
    drawText(message); 
    texture.needsUpdate = true;
  };

  return sprite;
}