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

// Mosque-inspired landmark: restrained arch, prayer hall volume and dome.
box(9, 3.8, 5.4, materials.stone, 0, 1.9, -10.5);
box(9.3, 0.22, 5.7, materials.trim, 0, 3.85, -10.5);
const dome = new THREE.Mesh(new THREE.SphereGeometry(2.35, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), materials.trim);
dome.position.set(0, 3.95, -10.5);
scene.add(dome);
box(2.3, 2.7, 0.28, materials.dark, 0, 1.35, -7.76);
const arch = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.12, 8, 32, Math.PI), materials.trim);
arch.position.set(0, 2.65, -7.58);
scene.add(arch);
arch.rotation.z = Math.PI;
const minaret = box(0.8, 6.4, 0.8, materials.stone, 5.8, 3.2, -10.5);
box(1.2, 0.22, 1.2, materials.trim, 5.8, 5.6, -10.5);
const minaretCap = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.1, 8), materials.trim);
minaretCap.position.set(5.8, 6.95, -10.5);
scene.add(minaretCap);

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
pool.position.set(7, 0.08, -1);
scene.add(pool);
box(6, 0.22, 0.22, materials.trim, 7, 0.12, -2.2);
box(6, 0.22, 0.22, materials.trim, 7, 0.12, 0.2);

// Temporary, intentionally simple avatar.
const avatar = new THREE.Group();
const body = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 1.15, 10), materials.avatar);
body.position.y = 0.85;
avatar.add(body);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 12, 10), materials.skin);
head.position.y = 1.62;
avatar.add(head);
const feet = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.16, 0.78), materials.dark);
feet.position.set(0, 0.08, 0);
avatar.add(feet);
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