import * as THREE from 'three';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
const hint = document.querySelector<HTMLDivElement>('#hint')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset-camera')!;
const joystick = document.querySelector<HTMLDivElement>('#joystick')!;
const joystickKnob = document.querySelector<HTMLDivElement>('#joystick-knob')!;
const greetButton = document.querySelector<HTMLButtonElement>('#greet-action')!;
const pauseButton = document.querySelector<HTMLButtonElement>('#pause-action')!;
const presenceNote = document.querySelector<HTMLDivElement>('#presence-note')!;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202522);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.outputColorSpace = THREE.SRGBColorSpace;
app.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 1.8));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(-8, 14, 7);
scene.add(sun);

const materials = {
  avatar: new THREE.MeshStandardMaterial({ color: 0x526d60, roughness: 0.9 }),
  trim: new THREE.MeshStandardMaterial({ color: 0xb69a68, roughness: 0.38, metalness: 0.28 }),
  skin: new THREE.MeshStandardMaterial({ color: 0xb98d6b, roughness: 1 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x26352f, roughness: 0.9 }),
};

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
let joystickPointer: number | null = null;
let joystickAxes = { x: 0, y: 0 };
let lastCameraPoint = { x: 0, y: 0 };
const lookTarget = new THREE.Vector3();
const pointers = new Map<number, { x: number; y: number }>();
const steeringDirection = new THREE.Vector3();
let steeringActive = false;
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
    lastCameraPoint = { x: event.clientX, y: event.clientY };
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
    const lookX = event.clientX - lastCameraPoint.x;
    const lookY = event.clientY - lastCameraPoint.y;
    angle -= lookX * 0.006;
    cameraHeight = THREE.MathUtils.clamp(cameraHeight + lookY * 0.008, 2.8, 7);
    lastCameraPoint = { x: event.clientX, y: event.clientY };
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
    lastCameraPoint = { ...[...pointers.values()][0] };
    steeringActive = joystickPointer !== null && Math.hypot(joystickAxes.x, joystickAxes.y) > 0.12;
    pinchStart = 0;
  }
}
renderer.domElement.addEventListener('pointerup', endPointer);
renderer.domElement.addEventListener('pointercancel', endPointer);
renderer.domElement.addEventListener('wheel', (event) => {
  distance = THREE.MathUtils.clamp(distance + event.deltaY * 0.008, 5.5, 15);
}, { passive: true });
resetButton.addEventListener('click', () => { angle = 0; distance = 8.5; cameraHeight = 4.2; });
function updateJoystick(event: PointerEvent) {
  const rect = joystick.getBoundingClientRect();
  const radius = rect.width * 0.36;
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const length = Math.hypot(dx, dy);
  const scale = length > radius ? radius / length : 1;
  const x = dx * scale, y = dy * scale;
  joystickAxes = { x: x / radius, y: y / radius };
  joystickKnob.style.transform = `translate(${x}px, ${y}px)`;
}
joystick.addEventListener('pointerdown', (event) => {
  event.preventDefault(); event.stopPropagation();
  joystickPointer = event.pointerId;
  joystick.setPointerCapture(event.pointerId);
  updateJoystick(event);
});
joystick.addEventListener('pointermove', (event) => {
  if (event.pointerId !== joystickPointer) return;
  event.preventDefault(); updateJoystick(event);
});
function releaseJoystick(event: PointerEvent) {
  if (event.pointerId !== joystickPointer) return;
  joystickPointer = null; joystickAxes = { x: 0, y: 0 };
  joystickKnob.style.transform = 'translate(0px, 0px)';
  steeringActive = false; steeringDirection.set(0, 0, 0);
}
joystick.addEventListener('pointerup', releaseJoystick);
joystick.addEventListener('pointercancel', releaseJoystick);
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
    presenceNote.textContent = 'Muovi il joystick per camminare, trascina lo schermo per guardarti intorno.';
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
  camera.getWorldDirection(cameraForward);
  cameraForward.y = 0; cameraForward.normalize();
  cameraRight.crossVectors(cameraForward, worldUp).normalize();
  steeringDirection.copy(cameraRight).multiplyScalar(joystickAxes.x).addScaledVector(cameraForward, -joystickAxes.y);
  steeringActive = joystickPointer !== null && Math.hypot(joystickAxes.x, joystickAxes.y) > 0.12;
  const delta = steeringDirection.clone().normalize();
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
window.setTimeout(() => { hint.style.opacity = '0'; }, 6500);