import * as THREE from 'three';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
const loading = document.querySelector<HTMLDivElement>('#loading')!;
const hint = document.querySelector<HTMLDivElement>('#hint')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset-camera')!;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd9d1bd);
scene.fog = new THREE.Fog(0xd9d1bd, 24, 58);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = false;
renderer.outputColorSpace = THREE.SRGBColorSpace;
app.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xf7ead2, 0x777b65, 2.0));
const sun = new THREE.DirectionalLight(0xffe4b8, 2.1);
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

// Open courtyard and low perimeter walls.
const ground = new THREE.Mesh(new THREE.PlaneGeometry(34, 34), materials.ground);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.04;
scene.add(ground);
box(34, 0.7, 0.55, materials.stone, 0, 0.35, -16.7);
box(34, 0.7, 0.55, materials.stone, 0, 0.35, 16.7);
box(0.55, 0.7, 34, materials.stone, -16.7, 0.35, 0);
box(0.55, 0.7, 34, materials.stone, 16.7, 0.35, 0);

// Mosque courtyard landmark: layered facade, recessed entrance, columns and dome.
box(9.6, 4.0, 5.6, materials.stone, 0, 2, -10.5);
box(10.0, 0.28, 5.95, materials.trim, 0, 4.05, -10.5);
box(9.75, 0.12, 5.82, materials.stone, 0, 3.82, -10.5);
const domeBase = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.35, 0.42, 32), materials.trim);
domeBase.position.set(0, 4.22, -10.5); scene.add(domeBase);
const dome = new THREE.Mesh(new THREE.SphereGeometry(2.35, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2), materials.trim);
dome.position.set(0, 4.35, -10.5); scene.add(dome);
const finial = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.55, 12), materials.trim);
finial.position.set(0, 6.72, -10.5); scene.add(finial);
// Deep entrance portal with a horseshoe-like arch and paired columns.
box(2.8, 2.95, 0.22, materials.dark, 0, 1.48, -7.62);
box(3.25, 0.18, 0.42, materials.trim, 0, 3.0, -7.55);
for (const x of [-1.85, 1.85]) {
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.24, 3.25, 16), materials.trim);
  column.position.set(x, 1.63, -7.42); scene.add(column);
  const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.25, 0.2, 16), materials.trim);
  capital.position.set(x, 3.25, -7.42); scene.add(capital);
}
const arch = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.14, 12, 40, Math.PI), materials.trim);
arch.position.set(0, 2.95, -7.38); arch.rotation.z = Math.PI; scene.add(arch);
// Recessed side windows and ornamental bands.
for (const x of [-3.35, 3.35]) {
  box(0.9, 1.55, 0.12, materials.dark, x, 2.25, -7.66);
  box(1.12, 0.12, 0.18, materials.trim, x, 3.08, -7.58);
  const windowArch = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.07, 8, 24, Math.PI), materials.trim);
  windowArch.position.set(x, 3.0, -7.52); windowArch.rotation.z = Math.PI; scene.add(windowArch);
}
const minaret = box(0.95, 6.4, 0.95, materials.stone, 5.8, 3.2, -10.5);
box(1.3, 0.22, 1.3, materials.trim, 5.8, 5.55, -10.5);
box(1.15, 0.18, 1.15, materials.trim, 5.8, 6.05, -10.5);
const minaretCap = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.15, 12), materials.trim);
minaretCap.position.set(5.8, 6.92, -10.5); scene.add(minaretCap);
// Broad entrance steps.
for (let i = 0; i < 3; i++) box(4.5 + i * 0.55, 0.18, 0.55, materials.trim, 0, 0.09 + i * 0.18, -7.15 + i * 0.48);

// Garden beds and simple stylized trees.
function tree(x: number, z: number, scale = 1) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14 * scale, 0.2 * scale, 1.3 * scale, 7), materials.trim);
  trunk.position.set(x, 0.65 * scale, z);
  scene.add(trunk);
  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.85 * scale, 10, 8), materials.green);
  crown.position.set(x, 1.65 * scale, z);
  scene.add(crown);
}
for (const [x, z] of [[-10, -5], [-11, 2], [-8, 10], [10, -3], [11, 7], [7, 11]] as number[][]) {
  box(2.2, 0.35, 2.2, materials.dark, x, 0.18, z);
  tree(x, z, 0.9 + (Math.abs(x + z) % 3) * 0.08);
}
const pool = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.12, 2.2), materials.water);
pool.position.set(7, 0.08, -1); scene.add(pool);
for (const z of [-2.2, 0.2]) box(6, 0.22, 0.22, materials.trim, 7, 0.12, z);
for (const x of [4.25, 9.75]) box(0.22, 0.22, 2.2, materials.trim, x, 0.12, -1);
// A central stone walkway gives the courtyard a readable arrival axis.
for (let i = 0; i < 8; i++) {
  const tile = box(2.2, 0.08, 1.25, materials.stone, 0, 0.015, 2 - i * 1.25);
  tile.material = new THREE.MeshStandardMaterial({ color: i % 2 ? 0xd0c2a5 : 0xc4b596, roughness: 0.95 });
}
// Low lantern posts along the approach.
for (const x of [-3.4, 3.4]) for (const z of [-1, 3]) {
  box(0.16, 1.05, 0.16, materials.trim, x, 0.52, z);
  const glow = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.38, 0.34), new THREE.MeshStandardMaterial({ color: 0xf2d69b, emissive: 0x8c6128, emissiveIntensity: 0.35 }));
  glow.position.set(x, 1.12, z); scene.add(glow);
}

// Courtyard paving: a quiet, repeating stone pattern around the central arrival path.
const pavingMaterial = new THREE.MeshStandardMaterial({ color: 0xcfc3aa, roughness: 0.96 });
const pavingAlt = new THREE.MeshStandardMaterial({ color: 0xbfb294, roughness: 0.98 });
const pavingGeometry = new THREE.BoxGeometry(1.12, 0.035, 1.12);
const paving = new THREE.InstancedMesh(pavingGeometry, pavingMaterial, 196);
const pavingDummy = new THREE.Object3D();
let pavingIndex = 0;
for (let ix = -7; ix <= 7; ix++) {
  for (let iz = -7; iz <= 7; iz++) {
    const x = ix * 1.25;
    const z = iz * 1.25;
    // Keep the central walkway and the reflecting pool visually clear.
    if (Math.abs(x) < 1.5 || (x > 3.8 && x < 10.2 && z > -2.5 && z < 0.5)) continue;
    pavingDummy.position.set(x, 0.005, z);
    pavingDummy.updateMatrix();
    paving.setMatrixAt(pavingIndex, pavingDummy.matrix);
    paving.setColorAt(pavingIndex, ((ix + iz) % 3 === 0) ? new THREE.Color(0xbfb294) : new THREE.Color(0xcfc3aa));
    pavingIndex++;
  }
}
paving.count = pavingIndex;
paving.instanceMatrix.needsUpdate = true;
scene.add(paving);

// Low planted borders soften the stone courtyard without obstructing movement.
const planterMaterial = new THREE.MeshStandardMaterial({ color: 0x88785d, roughness: 1 });
const shrubMaterial = new THREE.MeshStandardMaterial({ color: 0x526b4d, roughness: 1 });
for (const x of [-5.8, 5.8]) {
  for (const z of [-4.5, 5.8]) {
    const bed = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.28, 1.35), planterMaterial);
    bed.position.set(x, 0.14, z);
    scene.add(bed);
    for (let n = 0; n < 5; n++) {
      const shrub = new THREE.Mesh(new THREE.SphereGeometry(0.42, 9, 7), shrubMaterial);
      shrub.scale.set(1.15, 0.72, 0.9);
      shrub.position.set(x - 1.05 + n * 0.52, 0.48, z);
      scene.add(shrub);
    }
  }
}

// A small, still-water fountain anchors the courtyard's quieter side.
const fountainBase = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.18, 0.22, 32), materials.trim);
fountainBase.position.set(-7, 0.12, 5.2);
scene.add(fountainBase);
const fountainWater = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 0.08, 32), materials.water);
fountainWater.position.set(-7, 0.27, 5.2);
scene.add(fountainWater);
const fountainStem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.55, 12), materials.stone);
fountainStem.position.set(-7, 0.55, 5.2);
scene.add(fountainStem);
const fountainBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.18, 0.16, 24), materials.trim);
fountainBowl.position.set(-7, 0.88, 5.2);
scene.add(fountainBowl);

// Fine vertical accents give the entrance windows a crafted, screened appearance.
for (const x of [-3.35, 3.35]) {
  for (const offset of [-0.22, 0, 0.22]) {
    box(0.035, 1.18, 0.035, materials.trim, x + offset, 2.25, -7.48);
  }
  box(0.72, 0.035, 0.035, materials.trim, x, 2.25, -7.47);
}

// First-pass human silhouette: robe, sleeves, hands, feet and simple kufi.
const avatar = new THREE.Group();
const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.5, 1.28, 16), materials.avatar);
robe.position.y = 0.82; avatar.add(robe);
const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.43, 16, 12), materials.avatar);
shoulders.scale.set(1, 0.62, 0.72); shoulders.position.y = 1.35; avatar.add(shoulders);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.245, 20, 16), materials.skin);
head.position.y = 1.72; avatar.add(head);
const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.12, 20), materials.trim);
cap.position.y = 1.94; avatar.add(cap);
for (const side of [-1, 1]) {
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.13, 0.82, 12), materials.avatar);
  arm.position.set(side * 0.43, 1.08, 0); arm.rotation.z = side * -0.18; avatar.add(arm);
  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 10), materials.skin);
  hand.position.set(side * 0.5, 0.66, 0.02); avatar.add(hand);
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.13, 0.42), materials.dark);
  foot.position.set(side * 0.2, 0.07, 0.08); avatar.add(foot);
}
avatar.position.set(0, 0, 5);
scene.add(avatar);

const target = new THREE.Vector3(0, 0, 5);
let angle = 0;
let distance = 8.5;
let cameraHeight = 4.2;
const lookTarget = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const pointers = new Map<number, { x: number; y: number }>();
let gestureStart = { x: 0, y: 0 };
let gestureMoved = false;
let pinchStart = 0;
let pinchDistance = 0;
let dragging = false;
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
function screenRay(x: number, y: number) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set((x - rect.left) / rect.width * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(ground, false)[0];
  if (hit) {
    target.copy(hit.point);
    target.x = THREE.MathUtils.clamp(target.x, -14.5, 14.5);
    target.z = THREE.MathUtils.clamp(target.z, -14.5, 14.5);
  }
}
function gap() {
  const pts = [...pointers.values()];
  return pts.length < 2 ? 0 : Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
}
renderer.domElement.addEventListener('pointerdown', (event) => {
  renderer.domElement.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  gestureStart = { x: event.clientX, y: event.clientY };
  gestureMoved = false;
  if (pointers.size === 1) dragging = true;
  if (pointers.size === 2) { dragging = false; pinchStart = gap(); pinchDistance = distance; }
});
renderer.domElement.addEventListener('pointermove', (event) => {
  if (!pointers.has(event.pointerId)) return;
  const previous = pointers.get(event.pointerId)!;
  const dx = event.clientX - previous.x;
  const dy = event.clientY - previous.y;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 2) {
    const currentGap = gap();
    if (pinchStart > 0) distance = THREE.MathUtils.clamp(pinchDistance * pinchStart / Math.max(1, currentGap), 5.5, 15);
    gestureMoved = true;
  } else if (pointers.size === 1 && dragging) {
    if (Math.hypot(event.clientX - gestureStart.x, event.clientY - gestureStart.y) > 5) gestureMoved = true;
    if (gestureMoved) {
      angle -= dx * 0.006;
      cameraHeight = THREE.MathUtils.clamp(cameraHeight + dy * 0.008, 2.8, 7);
    }
  }
});
function endPointer(event: PointerEvent) {
  if (!pointers.has(event.pointerId)) return;
  if (pointers.size === 1 && !gestureMoved && !event.pointerType.match(/mouse/)) screenRay(event.clientX, event.clientY);
  if (pointers.size === 1 && !gestureMoved && event.pointerType === 'mouse' && event.button === 0) screenRay(event.clientX, event.clientY);
  pointers.delete(event.pointerId);
  if (pointers.size === 0) { dragging = false; pinchStart = 0; }
  if (pointers.size === 1) { dragging = false; }
}
renderer.domElement.addEventListener('pointerup', endPointer);
renderer.domElement.addEventListener('pointercancel', endPointer);
renderer.domElement.addEventListener('wheel', (event) => {
  distance = THREE.MathUtils.clamp(distance + event.deltaY * 0.008, 5.5, 15);
}, { passive: true });
resetButton.addEventListener('click', () => { angle = 0; distance = 8.5; cameraHeight = 4.2; });

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
  const delta = new THREE.Vector3().subVectors(target, avatar.position);
  delta.y = 0;
  const length = delta.length();
  if (length > 0.08) {
    const step = Math.min(length, 2.2 * dt);
    delta.normalize();
    avatar.position.addScaledVector(delta, step);
    avatar.rotation.y = Math.atan2(delta.x, delta.z);
  }
  updateCamera(dt);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
loading.remove();
window.setTimeout(() => { hint.style.opacity = '0'; }, 6500);