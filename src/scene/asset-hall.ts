import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const BAY_URL = 'https://cdn.3dassets.dev/assets/38094/v1/model.glb';
const QIBLA_URL = 'https://cdn.3dassets.dev/assets/38099/v1/model.glb';

function makeMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D context unavailable');
  context.fillStyle = '#f0eee8';
  context.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 28; i++) {
    const x = (i * 97) % 512;
    const y = (i * 151) % 512;
    context.beginPath();
    context.moveTo(x - 110, y - 65);
    context.bezierCurveTo(x - 28, y - 32, x + 35, y + 24, x + 145, y + 82);
    context.strokeStyle = i % 4 === 0 ? 'rgba(151,145,134,0.18)' : 'rgba(255,255,255,0.62)';
    context.lineWidth = i % 5 === 0 ? 2 : 1;
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function makeCarpetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D context unavailable');
  context.fillStyle = '#17483e';
  context.fillRect(0, 0, 512, 512);
  context.strokeStyle = '#c6a56b';
  context.lineWidth = 5;
  context.strokeRect(14, 14, 484, 484);
  context.strokeRect(28, 28, 456, 456);
  context.lineWidth = 2;
  for (let y = 48; y < 490; y += 32) {
    for (let x = 48; x < 490; x += 32) {
      context.save();
      context.translate(x, y);
      context.rotate(Math.PI / 4);
      context.strokeRect(-8, -8, 16, 16);
      context.beginPath();
      context.moveTo(-14, 0);
      context.lineTo(14, 0);
      context.moveTo(0, -14);
      context.lineTo(0, 14);
      context.stroke();
      context.restore();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function recolorMaterial(source: THREE.Material, marble: THREE.Texture): THREE.MeshStandardMaterial {
  const standard = source as THREE.MeshStandardMaterial;
  const sourceColor = standard.color instanceof THREE.Color
    ? standard.color.clone()
    : new THREE.Color(0xffffff);
  const hsl = { h: 0, s: 0, l: 1 };
  sourceColor.getHSL(hsl);
  const name = source.name.toLowerCase();

  let color = 0xf1efe9;
  let roughness = 0.42;
  let metalness = 0.03;
  let map: THREE.Texture | null = marble;

  if (/brass|gold|gilt|metal/.test(name) || (hsl.s > 0.28 && hsl.h >= 0.08 && hsl.h < 0.17)) {
    color = 0xc4a15f;
    roughness = 0.34;
    metalness = 0.62;
    map = null;
  } else if (/tile|glaze|turquoise|blue/.test(name) || (hsl.s > 0.24 && hsl.h > 0.42 && hsl.h < 0.68)) {
    color = 0x24564b;
    roughness = 0.62;
    metalness = 0.02;
    map = null;
  } else if (/cedar|wood/.test(name)) {
    color = 0x604a35;
    roughness = 0.7;
    metalness = 0.01;
    map = null;
  } else if (hsl.l < 0.14) {
    color = 0x343b37;
    roughness = 0.72;
    metalness = 0.04;
    map = null;
  }

  const material = new THREE.MeshStandardMaterial({
    color,
    map,
    roughness,
    metalness,
    side: source.side,
    transparent: source.transparent,
    opacity: source.opacity,
  });
  material.name = source.name || 'Noor contemporary finish';
  return material;
}

function recolorModel(root: THREE.Object3D, marble: THREE.Texture) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const convert = (material: THREE.Material) => recolorMaterial(material, marble);
    object.material = Array.isArray(object.material)
      ? object.material.map(convert)
      : convert(object.material);
    object.castShadow = false;
    object.receiveShadow = true;
  });
}

export async function loadAssetPrayerHall(scene: THREE.Scene): Promise<boolean> {
  try {
    const loader = new GLTFLoader();
    const [bayAsset, qiblaAsset] = await Promise.all([
      loader.loadAsync(BAY_URL),
      loader.loadAsync(QIBLA_URL),
    ]);

    const hall = new THREE.Group();
    hall.name = 'noor-cc0-asset-prayer-hall';
    const marbleTexture = makeMarbleTexture();
    marbleTexture.repeat.set(3, 5);
    const marble = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: marbleTexture,
      roughness: 0.38,
      metalness: 0.02,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: 0xc4a15f,
      metalness: 0.62,
      roughness: 0.34,
    });
    const green = new THREE.MeshStandardMaterial({
      color: 0x17483e,
      roughness: 0.92,
    });

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 25), marble);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.035, -27.5);
    hall.add(floor);

    const addBox = (
      width: number, height: number, depth: number,
      x: number, y: number, z: number,
      material: THREE.Material,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      hall.add(mesh);
    };

    addBox(0.3, 4.42, 25, -9.1, 2.21, -27.5, marble);
    addBox(0.3, 4.42, 25, 9.1, 2.21, -27.5, marble);
    addBox(7.5, 4.42, 0.25, -5.25, 2.21, -39.82, marble);
    addBox(7.5, 4.42, 0.25, 5.25, 2.21, -39.82, marble);
    addBox(18, 0.09, 0.12, 0, 4.39, -27.5, gold);
    addBox(0.08, 0.09, 25, -8.92, 4.39, -27.5, gold);
    addBox(0.08, 0.09, 25, 8.92, 4.39, -27.5, gold);

    const carpetTexture = makeCarpetTexture();
    carpetTexture.repeat.set(1, 2);
    const carpet = new THREE.Mesh(
      new THREE.PlaneGeometry(5.5, 20),
      new THREE.MeshStandardMaterial({ color: 0xffffff, map: carpetTexture, roughness: 0.95 }),
    );
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.018, -27.7);
    hall.add(carpet);
    addBox(0.055, 0.012, 20, -2.8, 0.026, -27.7, gold);
    addBox(0.055, 0.012, 20, 2.8, 0.026, -27.7, gold);

    // The source bay is a 3 m module. Instancing shares its geometry across the full hall.
    const bayRoot = bayAsset.scene;
    bayRoot.updateMatrixWorld(true);
    const placements: Array<{ x: number; z: number }> = [];
    for (let row = 0; row < 7; row++) {
      for (let column = 0; column < 6; column++) {
        placements.push({ x: -7.5 + column * 3, z: -18 - row * 3 });
      }
    }

    const sourceMeshes: THREE.Mesh[] = [];
    bayRoot.traverse((object) => {
      if (object instanceof THREE.Mesh) sourceMeshes.push(object);
    });
    for (const source of sourceMeshes) {
      const materials = Array.isArray(source.material)
        ? source.material.map((material) => recolorMaterial(material, marbleTexture))
        : recolorMaterial(source.material, marbleTexture);
      const instances = new THREE.InstancedMesh(source.geometry, materials, placements.length);
      instances.name = source.name ? source.name + ' — Noor instances' : 'Noor prayer bay instances';
      instances.castShadow = false;
      instances.receiveShadow = true;
      for (let index = 0; index < placements.length; index++) {
        const placement = placements[index];
        const matrix = new THREE.Matrix4()
          .makeTranslation(placement.x, 0, placement.z)
          .multiply(source.matrixWorld);
        instances.setMatrixAt(index, matrix);
      }
      instances.instanceMatrix.needsUpdate = true;
      instances.computeBoundingSphere();
      hall.add(instances);
    }

    const qiblaWall = qiblaAsset.scene.clone(true);
    recolorModel(qiblaWall, marbleTexture);
    qiblaWall.position.set(0, 0, -39.12);
    hall.add(qiblaWall);

    const fallback = scene.getObjectByName('noor-hall-fallback');
    if (fallback) scene.remove(fallback);
    scene.add(hall);
    return true;
  } catch (error) {
    console.error('Noor: the CC0 prayer-hall models could not be loaded; keeping the fallback hall.', error);
    return false;
  }
}
