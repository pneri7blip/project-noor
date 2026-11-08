import * as THREE from 'three';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
const loading = document.querySelector<HTMLDivElement>('#loading')!;
const hint = document.querySelector<HTMLDivElement>('#hint')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset-camera')!;
const greetButton = document.querySelector<HTMLButtonElement>('#greet-action')!;
const pauseButton = document.querySelector<HTMLButtonElement>('#pause-action')!;
const presenceNote = document.querySelector<HTMLDivElement>('#presence-note')!;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc9c4b4);
scene.fog = new THREE.Fog(0xc9c4b4, 34, 72);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.outputColorSpace = THREE.SRGBColorSpace;
app.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xfff1d8, 0x6c7764, 1.8));
const sun = new THREE.DirectionalLight(0xffdfb0, 2.7);
sun.position.set(-8, 14, 7);
scene.add(sun);

const materials = {
  ground: new THREE.MeshStandardMaterial({ color: 0xb9ad91, roughness: 1 }),
  stone: new THREE.MeshStandardMaterial({ color: 0xe4d8bf, roughness: 0.92 }),
  trim: new THREE.MeshStandardMaterial({ color: 0x9a805b, roughness: 0.8 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x536557, roughness: 0.95 }),
  green: new THREE.MeshStandardMaterial({ color: 0x657d59, roughness: 1 }),
  water: new THREE.MeshStandardMaterial({ color: 0x8ba9a5, roughness: 0.32, metalness: 0.05 }),
  avatar: new THREE.MeshStandardMaterial({ color: 0x526d60, roughness: 0.9 }),
  skin: new THREE.MeshStandardMaterial({ color: 0xb98d6b, roughness: 1 }),
};

function box(w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

// NOOR COURTYARD 1.0 — a coherent architectural scene, not a collection of props.
// The composition follows Sansa's priorities: immediate readability, calm atmosphere,
// a clear arrival axis, and enough open space to move naturally on a phone.
const ground = new THREE.Mesh(new THREE.PlaneGeometry(38, 38), materials.ground);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.08;
scene.add(ground);

// Warm stone perimeter, kept low so the courtyard remains visually open.
box(38, 0.82, 0.62, materials.stone, 0, 0.41, -18.7);
box(38, 0.82, 0.62, materials.stone, 0, 0.41, 18.7);
box(0.62, 0.82, 38, materials.stone, -18.7, 0.41, 0);
box(0.62, 0.82, 38, materials.stone, 18.7, 0.41, 0);
const coping = new THREE.MeshStandardMaterial({ color: 0xc6b795, roughness: 0.82 });
for (const z of [-18.7, 18.7]) box(38, 0.12, 0.72, coping, 0, 0.86, z);
for (const x of [-18.7, 18.7]) box(0.72, 0.12, 38, coping, x, 0.86, 0);

// Reusable architectural pieces.
function column(x: number, z: number, height = 3.7, radius = 0.22) {
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.88, radius, height, 16), materials.stone);
  shaft.position.set(x, height / 2, z);
  scene.add(shaft);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.42, radius * 1.5, 0.22, 16), materials.trim);
  base.position.set(x, 0.11, z);
  scene.add(base);
  const capital = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.45, radius * 1.12, 0.2, 16), materials.trim);
  capital.position.set(x, height - 0.08, z);
  scene.add(capital);
}
function archRing(x: number, y: number, z: number, radius: number, material = materials.trim, tube = 0.12) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 10, 40, Math.PI), material);
  ring.position.set(x, y, z);
  scene.add(ring);
  return ring;
}
function tree(x: number, z: number, scale = 1) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * scale, 0.2 * scale, 1.5 * scale, 8), materials.trim);
  trunk.position.set(x, 0.75 * scale, z);
  scene.add(trunk);
  const canopyMaterial = new THREE.MeshStandardMaterial({ color: 0x536d50, roughness: 1 });
  for (const [dx, dy, dz, s] of [[0, 1.55, 0, 0.9], [-0.42, 1.35, 0.12, 0.62], [0.4, 1.42, -0.1, 0.66], [0.05, 1.92, 0.06, 0.62]] as number[][]) {
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(s * scale, 1), canopyMaterial);
    crown.position.set(x + dx * scale, dy * scale, z + dz * scale);
    crown.scale.set(1.0, 0.92, 0.95);
    scene.add(crown);
  }
}
function lantern(x: number, z: number, height = 2.3) {
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.085, height, 8), materials.trim);
  post.position.set(x, height / 2, z);
  scene.add(post);
  const glowMaterial = new THREE.MeshStandardMaterial({ color: 0xf3d9a4, emissive: 0xc58c45, emissiveIntensity: 0.7, roughness: 0.38 });
  const housing = new THREE.Mesh(new THREE.OctahedronGeometry(0.25, 0), glowMaterial);
  housing.position.set(x, height + 0.17, z);
  housing.scale.y = 1.18;
  scene.add(housing);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.2, 8), materials.trim);
  cap.position.set(x, height + 0.48, z);
  scene.add(cap);
}

// A single, legible arrival route. Instancing keeps the stonework light enough for Android.
const tileMaterial = new THREE.MeshStandardMaterial({ color: 0xcfc2a7, roughness: 0.94 });
const tileGeometry = new THREE.BoxGeometry(1.28, 0.045, 1.28);
const tiles = new THREE.InstancedMesh(tileGeometry, tileMaterial, 625);
const tileDummy = new THREE.Object3D();
let tileIndex = 0;
for (let ix = -12; ix <= 12; ix++) {
  for (let iz = -12; iz <= 12; iz++) {
    const x = ix * 1.42;
    const z = iz * 1.42;
    tileDummy.position.set(x, -0.015, z);
    tileDummy.rotation.y = ((ix + iz) % 2) * 0.012;
    tileDummy.updateMatrix();
    tiles.setMatrixAt(tileIndex, tileDummy.matrix);
    const shade = ((ix * 7 + iz * 11) % 5 === 0) ? 0xb9aa8d : ((ix + iz) % 4 === 0 ? 0xd8cbb2 : 0xcfc2a7);
    tiles.setColorAt(tileIndex, new THREE.Color(shade));
    tileIndex++;
  }
}
tiles.count = tileIndex;
tiles.instanceMatrix.needsUpdate = true;
scene.add(tiles);

// A broad central path leads the eye from the visitor to the prayer-hall entrance.
const pathStone = new THREE.MeshStandardMaterial({ color: 0xe0d4bd, roughness: 0.88 });
for (let i = 0; i < 10; i++) {
  const slab = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.07, 1.28), pathStone);
  slab.position.set(0, 0.015, 3.2 - i * 1.28);
  scene.add(slab);
}
for (const x of [-1.28, 1.28]) {
  for (let z = -7.8; z <= 3.5; z += 1.28) {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.012, 0.96), materials.trim);
    seam.position.set(x, 0.055, z);
    scene.add(seam);
  }
}

// Prayer-hall façade: layered massing, recessed portal, crafted arches and a large dome.
// Split the former solid facade around a walk-through central entrance.
box(5.25, 5.15, 3.8, materials.stone, -4.98, 2.575, -14.25);
box(5.25, 5.15, 3.8, materials.stone, 4.98, 2.575, -14.25);
box(4.85, 0.82, 3.8, materials.stone, 0, 4.74, -14.25);
box(15.7, 0.3, 4.05, materials.trim, 0, 5.18, -14.25);
box(15.35, 0.14, 3.95, coping, 0, 5.38, -14.25);
box(4.25, 3.8, 0.24, materials.dark, 0, 1.9, -12.28);
box(4.85, 0.16, 0.34, materials.trim, 0, 3.82, -12.2);
archRing(0, 3.82, -12.12, 2.05, materials.trim, 0.16);
for (const x of [-2.12, 2.12]) column(x, -12.05, 3.75, 0.2);
// The central opening remains clear: visitors can walk from the courtyard into the hall.
const threshold = new THREE.Mesh(new THREE.BoxGeometry(4.15, 0.08, 1.2), pathStone);
threshold.position.set(0, 0.02, -14.5);
scene.add(threshold);
for (const x of [-5.2, 5.2]) {
  box(1.5, 2.15, 0.14, materials.dark, x, 2.3, -12.27);
  archRing(x, 3.35, -12.17, 0.72, materials.trim, 0.085);
  for (const offset of [-0.36, -0.12, 0.12, 0.36]) {
    box(0.035, 1.55, 0.06, materials.trim, x + offset, 2.25, -12.05);
  }
  box(1.18, 0.045, 0.06, materials.trim, x, 2.18, -12.04);
}
for (const x of [-7.1, 7.1]) {
  box(0.22, 4.4, 0.28, materials.trim, x, 2.2, -12.08);
  box(0.38, 0.16, 0.42, coping, x, 4.35, -12.08);
}
for (let i = 0; i < 4; i++) {
  const step = new THREE.Mesh(new THREE.BoxGeometry(5.3 + i * 0.55, 0.16, 0.42), materials.trim);
  step.position.set(0, 0.08 + i * 0.15, -11.45 + i * 0.38);
  scene.add(step);
}

// Drum and ribbed dome. The silhouette is deliberately the main landmark, not a tiny ornament.
const drum = new THREE.Mesh(new THREE.CylinderGeometry(2.45, 2.55, 1.0, 40), materials.stone);
drum.position.set(0, 5.88, -14.25);
scene.add(drum);
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2;
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.48, 0.08), materials.dark);
  win.position.set(Math.cos(a) * 2.42, 5.88, -14.25 + Math.sin(a) * 2.42);
  win.lookAt(0, 5.88, -14.25);
  scene.add(win);
}
const domeProfile = [
  new THREE.Vector2(0, 0), new THREE.Vector2(2.35, 0),
  new THREE.Vector2(2.28, 0.32), new THREE.Vector2(2.08, 0.82),
  new THREE.Vector2(1.72, 1.35), new THREE.Vector2(1.25, 1.82),
  new THREE.Vector2(0.72, 2.2), new THREE.Vector2(0.22, 2.43),
  new THREE.Vector2(0, 2.48),
];
const dome = new THREE.Mesh(new THREE.LatheGeometry(domeProfile, 40), materials.trim);
dome.position.set(0, 6.35, -14.25);
scene.add(dome);
for (const y of [6.7, 7.0, 7.34, 7.68, 8.0]) {
  const radius = y < 7 ? 2.22 - (y - 6.7) * 0.55 : 2.055 - (y - 7) * 0.9;
  const rib = new THREE.Mesh(new THREE.TorusGeometry(Math.max(0.5, radius), 0.035, 6, 48), coping);
  rib.rotation.x = Math.PI / 2;
  rib.position.set(0, y, -14.25);
  scene.add(rib);
}
const finial = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.62, 12), materials.trim);
finial.position.set(0, 8.95, -14.25);
scene.add(finial);

// NOOR PRAYER HALL — a walk-through interior, built from reusable low-cost geometry.
const hallStone = new THREE.MeshStandardMaterial({ color: 0xe8dfcf, roughness: 0.82 });
const hallIvory = new THREE.MeshStandardMaterial({ color: 0xf2eadb, roughness: 0.72 });
const hallGold = new THREE.MeshStandardMaterial({ color: 0xb18a51, metalness: 0.28, roughness: 0.48 });
const hallDeep = new THREE.MeshStandardMaterial({ color: 0x25443f, roughness: 0.88 });
const hallTile = new THREE.MeshStandardMaterial({ color: 0xc6b18b, roughness: 0.76 });
const hallGlow = new THREE.MeshBasicMaterial({ color: 0xffd99a });
const hallFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 25), hallIvory);
hallFloor.rotation.x = -Math.PI / 2;
hallFloor.position.set(0, -0.025, -27.3);
scene.add(hallFloor);

// Large, restrained marble floor modules with a contrasting central prayer carpet.
const hallTiles = new THREE.InstancedMesh(new THREE.BoxGeometry(1.88, 0.035, 1.88), hallTile, 120);
const hallTileDummy = new THREE.Object3D();
let hallTileIndex = 0;
for (let ix = -4; ix <= 4; ix++) {
  for (let iz = -6; iz <= 6; iz++) {
    hallTileDummy.position.set(ix * 2.05, 0.005, -27.3 + iz * 1.92);
    hallTileDummy.updateMatrix();
    hallTiles.setMatrixAt(hallTileIndex++, hallTileDummy.matrix);
  }
}
hallTiles.count = hallTileIndex;
hallTiles.instanceMatrix.needsUpdate = true;
scene.add(hallTiles);

const carpet = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 22), new THREE.MeshStandardMaterial({ color: 0x31534d, roughness: 1 }));
carpet.rotation.x = -Math.PI / 2;
carpet.position.set(0, 0.025, -27.4);
scene.add(carpet);
for (const x of [-2.48, 2.48]) {
  const runner = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.012, 21.8), hallGold);
  runner.position.set(x, 0.04, -27.4);
  scene.add(runner);
}

// Side walls and the far qibla wall define a real enclosed interior.
box(0.55, 8.6, 25, hallStone, -10.1, 4.3, -27.3);
box(0.55, 8.6, 25, hallStone, 10.1, 4.3, -27.3);
box(20.2, 8.6, 0.55, hallStone, 0, 4.3, -39.7);
box(20.2, 0.45, 25.2, hallGold, 0, 8.55, -27.3);

// Repeated pointed arches and paired columns create depth without expensive real-time lighting.
function pointedArch(x: number, z: number, width: number, height: number, material: THREE.Material, depth = 0.1) {
  const half = width / 2;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(x - half, 0.12, z),
    new THREE.Vector3(x - half, height * 0.62, z),
    new THREE.Vector3(x - width * 0.28, height * 0.9, z),
    new THREE.Vector3(x, height, z),
    new THREE.Vector3(x + width * 0.28, height * 0.9, z),
    new THREE.Vector3(x + half, height * 0.62, z),
    new THREE.Vector3(x + half, 0.12, z),
  ]);
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, depth, 8, false), material);
  scene.add(mesh);
  return mesh;
}
for (const z of [-20.5, -26.2, -31.9, -37.1]) {
  for (const side of [-1, 1]) {
    const x = side * 8.55;
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 7.1, 20), hallIvory);
    pillar.position.set(x, 3.55, z);
    scene.add(pillar);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.6, 0.24, 20), hallGold);
    base.position.set(x, 0.12, z);
    scene.add(base);
    const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.39, 0.34, 20), hallGold);
    capital.position.set(x, 7.05, z);
    scene.add(capital);
    pointedArch(side * 5.15, z, 6.8, 8.0, hallGold, 0.105);
    const inset = pointedArch(side * 5.15, z - 0.025, 6.48, 7.72, hallIvory, 0.035);
    inset.position.y = 0.04;
  }
}

// Cross-vault ribs overhead give the hall a monumental rhythm.
for (const z of [-19.1, -24.4, -29.7, -35.0]) {
  const vault = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-9.65, 8.15, z),
    new THREE.Vector3(-7.2, 9.0, z),
    new THREE.Vector3(-4.6, 10.15, z),
    new THREE.Vector3(0, 10.65, z),
    new THREE.Vector3(4.6, 10.15, z),
    new THREE.Vector3(7.2, 9.0, z),
    new THREE.Vector3(9.65, 8.15, z),
  ]);
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(vault, 48, 0.16, 8, false), hallGold));
}

// The qibla wall: a tall recessed mihrab with layered illuminated borders.
box(6.6, 6.8, 0.18, hallDeep, 0, 3.85, -39.32);
pointedArch(0, -39.12, 6.2, 7.0, hallGold, 0.2);
pointedArch(0, -39.08, 5.75, 6.62, hallGlow, 0.045);
pointedArch(0, -39.02, 5.35, 6.25, hallIvory, 0.035);
const mihrabNiche = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 5.9), new THREE.MeshBasicMaterial({ color: 0x263b35 }));
mihrabNiche.position.set(0, 3.1, -39.17);
scene.add(mihrabNiche);
for (const x of [-7.6, 7.6]) {
  const panel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 5.2, 0.08), hallDeep);
  panel.position.set(x, 3.9, -39.34);
  scene.add(panel);
  for (let y = 1.65; y <= 5.9; y += 0.7) {
    const motif = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), hallGold);
    motif.position.set(x, y, -39.25);
    motif.rotation.z = Math.PI / 4;
    scene.add(motif);
  }
}

// Warm recessed light bands are emissive surfaces, not costly real-time spotlights.
for (const side of [-1, 1]) {
  const strip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.055, 23.5), hallGlow);
  strip.position.set(side * 9.72, 7.95, -27.3);
  scene.add(strip);
}
for (const z of [-21.5, -27.2, -33.0]) {
  const ceilingLight = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.035, 0.045), hallGlow);
  ceilingLight.position.set(0, 8.08, z);
  scene.add(ceilingLight);
}

// A simple patterned border at the entrance makes the transition from courtyard to hall legible.
for (const x of [-4.3, 4.3]) {
  const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.22, 5.2, 0.28), hallGold);
  pilaster.position.set(x, 2.6, -12.28);
  scene.add(pilaster);
}

// Two slender minarets frame the dome and give the courtyard a recognisable skyline.
for (const x of [-8.3, 8.3]) {
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.68, 7.7, 16), materials.stone);
  shaft.position.set(x, 3.85, -14.1);
  scene.add(shaft);
  for (const y of [1.1, 5.5, 6.0]) {
    const balcony = new THREE.Mesh(new THREE.CylinderGeometry(y < 2 ? 0.88 : 0.72, y < 2 ? 0.78 : 0.68, 0.18, 20), materials.trim);
    balcony.position.set(x, y, -14.1);
    scene.add(balcony);
  }
  const lanternWindow = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.05, 0.1), materials.dark);
  lanternWindow.position.set(x, 6.55, -13.58);
  scene.add(lanternWindow);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.62, 1.35, 16), materials.trim);
  cap.position.set(x, 8.35, -14.1);
  scene.add(cap);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), coping);
  tip.position.set(x, 9.08, -14.1);
  scene.add(tip);
}

// Shaded side arcades: repeated bays make this read as a place, not a façade prop.
for (const side of [-1, 1]) {
  for (let i = 0; i < 6; i++) {
    const z = -10.2 + i * 2.45;
    column(side * 8.8, z, 3.55, 0.2);
    column(side * 12.0, z, 3.55, 0.2);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(3.45, 0.22, 0.34), materials.trim);
    beam.position.set(side * 10.4, 3.62, z);
    scene.add(beam);
    archRing(side * 10.4, 3.56, z, 1.55, materials.trim, 0.1);
  }
}

// Reflecting pool on the right, with a raised stone rim and a low fountain bowl.
const poolBed = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.22, 3.3), materials.trim);
poolBed.position.set(11.1, 0.06, -0.2);
scene.add(poolBed);
const pool = new THREE.Mesh(new THREE.BoxGeometry(5.82, 0.09, 2.92), materials.water);
pool.position.set(11.1, 0.2, -0.2);
scene.add(pool);
const waterSheen = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.35), new THREE.MeshBasicMaterial({ color: 0xc0d6cf, transparent: true, opacity: 0.16 }));
waterSheen.rotation.x = -Math.PI / 2;
waterSheen.position.set(11.1, 0.255, -0.2);
scene.add(waterSheen);
const fountainPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 0.72, 16), materials.stone);
fountainPedestal.position.set(11.1, 0.55, -0.2);
scene.add(fountainPedestal);
const fountainBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.46, 0.22, 28), materials.trim);
fountainBowl.position.set(11.1, 0.98, -0.2);
scene.add(fountainBowl);
const fountainWater = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.035, 28), materials.water);
fountainWater.position.set(11.1, 1.105, -0.2);
scene.add(fountainWater);

// A quieter garden zone on the left, with trees, planted beds and places to sit.
const planterMaterial = new THREE.MeshStandardMaterial({ color: 0x81765f, roughness: 1 });
const shrubMaterial = new THREE.MeshStandardMaterial({ color: 0x536d50, roughness: 1 });
for (const [x, z] of [[-12, -5], [-12, 2], [-11, 10], [12, 8], [15, 3], [15, 11], [-5, 12], [5, 12]] as number[][]) {
  const bed = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.34, 2.2), planterMaterial);
  bed.position.set(x, 0.17, z);
  scene.add(bed);
  tree(x, z, 0.88 + ((Math.abs(x + z) % 3) * 0.08));
  for (let n = 0; n < 4; n++) {
    const shrub = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 1), shrubMaterial);
    shrub.scale.set(1.2, 0.72, 0.9);
    shrub.position.set(x - 1.05 + n * 0.7, 0.52, z + 0.82);
    scene.add(shrub);
  }
}
for (const [x, z] of [[-14, -1], [-14, 7], [14, -7], [14, 5]] as number[][]) {
  const bench = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.16, 0.48), materials.trim);
  seat.position.y = 0.62;
  bench.add(seat);
  for (const dx of [-0.68, 0.68]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.62, 0.36), materials.dark);
    leg.position.set(dx, 0.31, 0);
    bench.add(leg);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.72, 0.12), materials.dark);
    back.position.set(dx, 0.98, -0.17);
    bench.add(back);
  }
  bench.position.set(x, 0, z);
  scene.add(bench);
}

// Warm lanterns and low wall lights create depth without adding heavy real-time shadows.
for (const x of [-6.2, 6.2]) for (const z of [-5.5, 1.8, 8.4]) lantern(x, z, 1.8);
for (const x of [-16.5, 16.5]) for (const z of [-10, -2, 6, 14]) {
  const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.22), new THREE.MeshStandardMaterial({ color: 0xf1d39b, emissive: 0xb97b36, emissiveIntensity: 0.45 }));
  sconce.position.set(x, 1.5, z);
  scene.add(sconce);
}

// A small ablution-free garden fountain at the far end is a visual soundless landmark.
const gardenFountainBase = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.38, 0.2, 32), materials.trim);
gardenFountainBase.position.set(-13.5, 0.1, 12.8);
scene.add(gardenFountainBase);
const gardenFountainWater = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.06, 32), materials.water);
gardenFountainWater.position.set(-13.5, 0.23, 12.8);
scene.add(gardenFountainWater);
const gardenFountainStem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.52, 12), materials.stone);
gardenFountainStem.position.set(-13.5, 0.5, 12.8);
scene.add(gardenFountainStem);
const gardenFountainTop = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.18, 0.16, 24), materials.trim);
gardenFountainTop.position.set(-13.5, 0.82, 12.8);
scene.add(gardenFountainTop);

// Procedural humanoid with articulated limbs and a lightweight walk cycle.
// The rig is built from reusable smooth meshes so it needs no external model download.
const avatar = new THREE.Group();
const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.49, 1.28, 24), materials.avatar);
robe.position.y = 0.88;
avatar.add(robe);
const robeHem = new THREE.Mesh(new THREE.TorusGeometry(0.475, 0.035, 8, 32), materials.trim);
robeHem.rotation.x = Math.PI / 2;
robeHem.position.y = 0.245;
avatar.add(robeHem);
const sash = new THREE.Mesh(new THREE.TorusGeometry(0.365, 0.035, 8, 32), materials.trim);
sash.rotation.x = Math.PI / 2;
sash.position.y = 1.13;
avatar.add(sash);
const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.39, 20, 16), materials.avatar);
shoulders.scale.set(1.08, 0.58, 0.78);
shoulders.position.y = 1.43;
avatar.add(shoulders);
const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.12, 0.2, 16), materials.skin);
neck.position.y = 1.62;
avatar.add(neck);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.245, 24, 20), materials.skin);
head.position.y = 1.82;
avatar.add(head);
const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.245, 0.13, 24), materials.trim);
cap.position.y = 2.035;
avatar.add(cap);
const capBand = new THREE.Mesh(new THREE.TorusGeometry(0.232, 0.018, 6, 24), materials.stone);
capBand.rotation.x = Math.PI / 2;
capBand.position.y = 2.0;
avatar.add(capBand);

const armPivots: THREE.Group[] = [];
const legPivots: THREE.Group[] = [];
for (const side of [-1, 1]) {
  const armPivot = new THREE.Group();
  armPivot.position.set(side * 0.37, 1.43, 0);
  const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.34, 4, 10), materials.avatar);
  upperArm.position.y = -0.22;
  armPivot.add(upperArm);
  const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 10), materials.avatar);
  elbow.position.y = -0.42;
  armPivot.add(elbow);
  const forearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.31, 4, 10), materials.avatar);
  forearm.position.y = -0.59;
  armPivot.add(forearm);
  const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.018, 6, 16), materials.trim);
  cuff.rotation.x = Math.PI / 2;
  cuff.position.y = -0.77;
  armPivot.add(cuff);
  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 12), materials.skin);
  hand.position.y = -0.82;
  armPivot.add(hand);
  avatar.add(armPivot);
  armPivots.push(armPivot);

  const legPivot = new THREE.Group();
  legPivot.position.set(side * 0.19, 0.62, 0);
  const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, 0.3, 4, 10), materials.dark);
  thigh.position.y = -0.16;
  legPivot.add(thigh);
  const knee = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 10), materials.dark);
  knee.position.y = -0.33;
  legPivot.add(knee);
  const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.31, 4, 10), materials.dark);
  shin.position.y = -0.47;
  legPivot.add(shin);
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.36), materials.dark);
  foot.position.set(0, -0.58, 0.09);
  legPivot.add(foot);
  avatar.add(legPivot);
  legPivots.push(legPivot);
}
avatar.position.set(0, 0, 5);
scene.add(avatar);

let walkBlend = 0;
let walkPhase = 0;
let gesture: 'none' | 'greet' = 'none';
let gestureStarted = 0;
let paused = false;
let angle = 0;
let distance = 8.5;
let cameraHeight = 4.2;
const lookTarget = new THREE.Vector3();
const pointers = new Map<number, { x: number; y: number }>();
const steeringDirection = new THREE.Vector3();
let steeringActive = false;
let gestureStart = { x: 0, y: 0 };
let pinchStart = 0;
let pinchDistance = 0;
let lastTwoFingerCenter = { x: 0, y: 0 };
const cameraForward = new THREE.Vector3();
const cameraRight = new THREE.Vector3();
const worldUp = new THREE.Vector3(0, 1, 0);
const clock = new THREE.Clock();

function updateCamera(dt: number) {
  const desired = new THREE.Vector3(
    avatar.position.x + Math.sin(angle) * distance,
    avatar.position.y + cameraHeight,
    avatar.position.z + Math.cos(angle) * distance,
  );
  camera.position.lerp(desired, 1 - Math.exp(-7 * dt));
  lookTarget.set(avatar.position.x, avatar.position.y + 1.05, avatar.position.z);
  camera.lookAt(lookTarget);
}
function gap() {
  const pts = [...pointers.values()];
  return pts.length < 2 ? 0 : Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
}
function center() {
  const pts = [...pointers.values()];
  return { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
}
renderer.domElement.addEventListener('pointerdown', (event) => {
  renderer.domElement.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 1) {
    gestureStart = { x: event.clientX, y: event.clientY };
    steeringActive = false;
  } else if (pointers.size === 2) {
    steeringActive = false;
    pinchStart = gap();
    pinchDistance = distance;
    lastTwoFingerCenter = center();
  }
});
renderer.domElement.addEventListener('pointermove', (event) => {
  if (!pointers.has(event.pointerId)) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 1) {
    const steerX = event.clientX - gestureStart.x;
    const steerY = event.clientY - gestureStart.y;
    if (Math.hypot(steerX, steerY) > 12) {
      camera.getWorldDirection(cameraForward);
      cameraForward.y = 0;
      cameraForward.normalize();
      cameraRight.crossVectors(cameraForward, worldUp).normalize();
      steeringDirection.copy(cameraRight).multiplyScalar(steerX)
        .addScaledVector(cameraForward, -steerY).normalize();
      steeringActive = true;
    } else {
      steeringActive = false;
    }
  } else if (pointers.size === 2) {
    const currentGap = gap();
    if (pinchStart > 0) distance = THREE.MathUtils.clamp(pinchDistance * pinchStart / Math.max(1, currentGap), 5.5, 15);
    const currentCenter = center();
    angle -= (currentCenter.x - lastTwoFingerCenter.x) * 0.006;
    cameraHeight = THREE.MathUtils.clamp(cameraHeight + (currentCenter.y - lastTwoFingerCenter.y) * 0.008, 2.8, 7);
    lastTwoFingerCenter = currentCenter;
  }
});
function endPointer(event: PointerEvent) {
  if (!pointers.has(event.pointerId)) return;
  pointers.delete(event.pointerId);
  if (pointers.size === 0) {
    steeringActive = false;
    steeringDirection.set(0, 0, 0);
    pinchStart = 0;
  } else if (pointers.size === 1) {
    gestureStart = { ...[...pointers.values()][0] };
    steeringActive = false;
    pinchStart = 0;
  }
}
renderer.domElement.addEventListener('pointerup', endPointer);
renderer.domElement.addEventListener('pointercancel', endPointer);
renderer.domElement.addEventListener('wheel', (event) => {
  distance = THREE.MathUtils.clamp(distance + event.deltaY * 0.008, 5.5, 15);
}, { passive: true });
resetButton.addEventListener('click', () => { angle = 0; distance = 8.5; cameraHeight = 4.2; });
greetButton.addEventListener('click', () => {
  gesture = 'greet';
  gestureStarted = clock.elapsedTime;
  paused = false;
  pauseButton.setAttribute('aria-pressed', 'false');
  presenceNote.textContent = 'Un saluto discreto, nel rispetto della quiete.';
});
pauseButton.addEventListener('click', () => {
  paused = !paused;
  pauseButton.setAttribute('aria-pressed', String(paused));
  if (paused) {
    steeringActive = false;
    gesture = 'none';
    presenceNote.textContent = 'Puoi restare qui quanto desideri.';
  } else {
    presenceNote.textContent = 'Tieni premuto e sposta il dito per camminare.';
  }
});

function resize() {
  const width = app.clientWidth;
  const height = app.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
window.addEventListener('resize', resize);
resize();

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;
  const delta = steeringDirection.clone();
  const moving = steeringActive && steeringDirection.lengthSq() > 0.01 && !paused;

  if (moving) {
    const desiredYaw = Math.atan2(delta.x, delta.z);
    const yawDifference = Math.atan2(
      Math.sin(desiredYaw - avatar.rotation.y),
      Math.cos(desiredYaw - avatar.rotation.y),
    );
    avatar.rotation.y += THREE.MathUtils.clamp(yawDifference, -4.8 * dt, 4.8 * dt);
    avatar.position.addScaledVector(delta, 2.05 * dt);
    avatar.position.x = THREE.MathUtils.clamp(avatar.position.x, -14.5, 14.5);
    avatar.position.z = THREE.MathUtils.clamp(avatar.position.z, -37.2, 14.5);
  }

  walkBlend = THREE.MathUtils.damp(walkBlend, moving ? 1 : 0, 9, dt);
  walkPhase += dt * (3.8 + walkBlend * 3.2);
  const stride = Math.sin(walkPhase) * 0.48 * walkBlend;
  legPivots[0].rotation.x = stride;
  legPivots[1].rotation.x = -stride;
  armPivots[0].rotation.x = -stride * 0.62;
  armPivots[1].rotation.x = stride * 0.62;
  armPivots[0].rotation.z = -0.045 - walkBlend * 0.025;
  armPivots[1].rotation.z = 0.045 + walkBlend * 0.025;

  // A brief hand-to-chest greeting, inspired by Sansa's simple social gestures.
  const greetElapsed = elapsed - gestureStarted;
  const greetEnvelope = gesture === 'greet' ? Math.sin(Math.min(1, greetElapsed / 1.25) * Math.PI) : 0;
  armPivots[1].rotation.z += -0.95 * greetEnvelope;
  armPivots[1].rotation.x += -0.22 * greetEnvelope;
  if (gesture === 'greet' && greetElapsed > 1.25) gesture = 'none';

  // A restrained idle breath keeps the character from looking frozen.
  const breathing = Math.sin(elapsed * 1.7) * 0.006 * (1 - walkBlend);
  robe.scale.y = 1 + breathing;
  shoulders.position.y = 1.43 + breathing * 1.5;
  head.position.y = 1.82 + Math.sin(elapsed * 1.1) * 0.008 * (1 - walkBlend);

  updateCamera(dt);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
loading.remove();
window.setTimeout(() => { hint.style.opacity = '0'; }, 6500);