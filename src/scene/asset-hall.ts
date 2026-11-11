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
    carpetTexture.repeat.set(2, 3);
    const carpet = new THREE.Mesh(
      new THREE.PlaneGeometry(16.2, 23.5),
      new THREE.MeshStandardMaterial({ color: 0xffffff, map: carpetTexture, roughness: 0.95 }),
    );
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.018, -27.7);
    hall.add(carpet);

    // A complete vaulted prayer hall: this is deliberately built as architecture,
    // not as a collection of extra decorative props.
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x173e38, roughness: 0.92, side: THREE.DoubleSide });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(18.0, 25.0), ceilingMat);
    ceiling.rotation.x = -Math.PI / 2;
    ceiling.position.set(0, 6.55, -27.5);
    hall.add(ceiling);

    const cornice = new THREE.MeshStandardMaterial({ color: 0xc5a66b, metalness: 0.58, roughness: 0.34 });
    const ivory = new THREE.MeshStandardMaterial({ color: 0xf1eee5, roughness: 0.38 });
    const deepGreen = new THREE.MeshStandardMaterial({ color: 0x123b34, roughness: 0.88 });
    const warmGlass = new THREE.MeshStandardMaterial({ color: 0xf3d9a1, emissive: 0xd69a4d, emissiveIntensity: 0.75, roughness: 0.28 });
    const windowGlass = new THREE.MeshStandardMaterial({
      color: 0x315e58, roughness: 0.24, metalness: 0.12,
      emissive: 0x183a35, emissiveIntensity: 0.22, side: THREE.DoubleSide,
    });
    const windowFrame = new THREE.MeshStandardMaterial({ color: 0xc5a66b, metalness: 0.58, roughness: 0.34 });

    const addHallBox = (w: number, h: number, d: number, x: number, y: number, z: number, material: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      hall.add(mesh);
      return mesh;
    };

    // Deep side cornices and five structural bays on each side.
    for (const side of [-1, 1]) {
      addHallBox(0.42, 0.28, 25.0, side * 8.78, 5.95, -27.5, cornice);
      addHallBox(0.2, 0.16, 25.0, side * 8.58, 6.15, -27.5, ivory);
      for (let row = 0; row < 5; row++) {
        const z = -19.2 - row * 4.75;
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 5.25, 24), ivory);
        shaft.position.set(side * 8.18, 2.72, z);
        hall.add(shaft);
        for (const y of [0.18, 0.38, 5.18, 5.38]) {
          const ring = new THREE.Mesh(new THREE.CylinderGeometry(y < 1 ? 0.39 : 0.34, y < 1 ? 0.39 : 0.34, 0.12, 24), cornice);
          ring.position.set(side * 8.18, y, z);
          hall.add(ring);
        }
        addHallBox(0.5, 0.16, 1.1, side * 8.18, 5.48, z, ivory);
      }
    }

    // Tall recessed-looking window bays bring filtered daylight into the prayer hall.
    // The inset glass and nested pointed frames create depth without expensive real-time lights.
    for (const side of [-1, 1]) {
      for (const z of [-22.0, -29.0, -36.0]) {
        const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 2.7), windowGlass);
        glass.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
        glass.position.set(side * 8.925, 2.62, z);
        hall.add(glass);

        const archPoints = [
          new THREE.Vector3(side * 8.91, 1.18, z - 0.73),
          new THREE.Vector3(side * 8.91, 2.9, z - 0.73),
          new THREE.Vector3(side * 8.91, 3.55, z - 0.42),
          new THREE.Vector3(side * 8.91, 4.12, z),
          new THREE.Vector3(side * 8.91, 3.55, z + 0.42),
          new THREE.Vector3(side * 8.91, 2.9, z + 0.73),
          new THREE.Vector3(side * 8.91, 1.18, z + 0.73),
        ];
        const outer = new THREE.CatmullRomCurve3(archPoints);
        hall.add(new THREE.Mesh(new THREE.TubeGeometry(outer, 40, 0.075, 8, false), windowFrame));
        const innerPoints = archPoints.map((point) => new THREE.Vector3(
          point.x + side * 0.012,
          point.y - (point.y > 3.5 ? 0.12 : 0),
          z + (point.z - z) * 0.82,
        ));
        hall.add(new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(innerPoints), 40, 0.025, 6, false),
          ivory,
        ));

        // Delicate vertical and horizontal divisions recall traditional mashrabiya screens.
        for (const offset of [-0.34, 0, 0.34]) {
          const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.035, 2.25, 0.035), windowFrame);
          mullion.position.set(side * 8.89, 2.55, z + offset);
          hall.add(mullion);
        }
        const crossbar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.035, 1.35), windowFrame);
        crossbar.position.set(side * 8.89, 2.42, z);
        hall.add(crossbar);
        addHallBox(0.08, 0.12, 1.68, side * 8.88, 1.12, z, cornice);
      }
    }

    // Pointed transverse arches give the hall its scale and a recognisable rhythm.
    for (let row = 0; row < 5; row++) {
      const z = -18.1 - row * 4.9;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8.25, 5.55, z),
        new THREE.Vector3(-6.6, 6.25, z),
        new THREE.Vector3(-3.5, 6.72, z),
        new THREE.Vector3(0, 7.05, z),
        new THREE.Vector3(3.5, 6.72, z),
        new THREE.Vector3(6.6, 6.25, z),
        new THREE.Vector3(8.25, 5.55, z),
      ]);
      hall.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.105, 10, false), ivory));
      const innerCurve = curve.clone();
      hall.add(new THREE.Mesh(new THREE.TubeGeometry(innerCurve, 64, 0.027, 8, false), cornice));
      addHallBox(16.1, 0.07, 0.08, 0, 6.22, z, cornice);
    }

    // Restrained eight-point ceiling medallions sit inside selected coffers.
    const rosetteShape = new THREE.Shape();
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = i % 2 === 0 ? 0.34 : 0.16;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (i === 0) rosetteShape.moveTo(px, py); else rosetteShape.lineTo(px, py);
    }
    rosetteShape.closePath();
    const rosetteGeometry = new THREE.ShapeGeometry(rosetteShape);
    for (const z of [-19.4, -28.4, -37.4]) {
      for (const x of [-5.8, -2.0, 2.0, 5.8]) {
        const rosette = new THREE.Mesh(rosetteGeometry, cornice);
        rosette.rotation.x = -Math.PI / 2;
        rosette.position.set(x, 6.515, z);
        hall.add(rosette);
      }
    }

    // Recessed coffer rhythm across the dark ceiling.
    for (let z = -19.4; z >= -37.4; z -= 4.5) {
      for (const x of [-5.8, -2.0, 2.0, 5.8]) {
        addHallBox(2.65, 0.035, 2.6, x, 6.48, z, deepGreen);
        addHallBox(2.72, 0.025, 0.055, x, 6.505, z - 1.3, cornice);
        addHallBox(2.72, 0.025, 0.055, x, 6.505, z + 1.3, cornice);
        addHallBox(0.055, 0.025, 2.6, x - 1.33, 6.505, z, cornice);
        addHallBox(0.055, 0.025, 2.6, x + 1.33, 6.505, z, cornice);
      }
    }

    // Three large suspended brass-and-glass chandeliers.
    for (const z of [-21.0, -28.8, -36.0]) {
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 8), cornice);
      chain.position.set(0, 5.95, z);
      hall.add(chain);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.075, 10, 48), cornice);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 5.45, z);
      hall.add(ring);
      const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.63, 0.035, 8, 40), ivory);
      innerRing.rotation.x = Math.PI / 2;
      innerRing.position.set(0, 5.38, z);
      hall.add(innerRing);
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 10), warmGlass);
        bulb.position.set(Math.cos(a) * 0.86, 5.38, z + Math.sin(a) * 0.86);
        hall.add(bulb);
        const drop = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.18, 8), cornice);
        drop.position.set(Math.cos(a) * 0.86, 5.18, z + Math.sin(a) * 0.86);
        hall.add(drop);
      }
    }

    // A monumental, layered mihrab on the qibla axis.
    addHallBox(4.2, 3.9, 0.18, 0, 1.98, -38.78, deepGreen);
    addHallBox(4.45, 0.16, 0.28, 0, 3.88, -38.68, cornice);
    const mihrabCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.05, 0.12, -38.62),
      new THREE.Vector3(-2.05, 2.0, -38.62),
      new THREE.Vector3(-1.75, 3.05, -38.62),
      new THREE.Vector3(-1.05, 3.72, -38.62),
      new THREE.Vector3(0, 4.05, -38.62),
      new THREE.Vector3(1.05, 3.72, -38.62),
      new THREE.Vector3(1.75, 3.05, -38.62),
      new THREE.Vector3(2.05, 2.0, -38.62),
      new THREE.Vector3(2.05, 0.12, -38.62),
    ]);
    hall.add(new THREE.Mesh(new THREE.TubeGeometry(mihrabCurve, 72, 0.105, 10, false), cornice));
    const innerMihrab = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.72, 0.18, -38.55),
      new THREE.Vector3(-1.72, 2.0, -38.55),
      new THREE.Vector3(-1.42, 2.85, -38.55),
      new THREE.Vector3(-0.8, 3.38, -38.55),
      new THREE.Vector3(0, 3.62, -38.55),
      new THREE.Vector3(0.8, 3.38, -38.55),
      new THREE.Vector3(1.42, 2.85, -38.55),
      new THREE.Vector3(1.72, 2.0, -38.55),
      new THREE.Vector3(1.72, 0.18, -38.55),
    ]);
    hall.add(new THREE.Mesh(new THREE.TubeGeometry(innerMihrab, 72, 0.035, 8, false), ivory));

    // Eight-point geometric star above the mihrab, with no lettering or imitation calligraphy.
    const starShape = new THREE.Shape();
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 0.58 : 0.27;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) starShape.moveTo(x, y); else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const star = new THREE.Mesh(new THREE.ShapeGeometry(starShape), cornice);
    star.position.set(0, 3.0, -38.48);
    hall.add(star);

    // Gold prayer-row markers and a broad, framed carpet field.
    for (let row = 0; row < 7; row++) {
      const z = -18.5 - row * 3.05;
      addHallBox(15.7, 0.012, 0.035, 0, 0.031, z, cornice);
    }
    addHallBox(0.075, 0.025, 23.5, -8.05, 0.035, -27.7, cornice);
    addHallBox(0.075, 0.025, 23.5, 8.05, 0.035, -27.7, cornice);
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
