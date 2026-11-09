import * as THREE from 'three';

function makeMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.fillStyle = '#f5f3ee'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 32; i++) {
    const x = (i * 137 + 23) % 512, y = (i * 83 + 61) % 512;
    ctx.beginPath(); ctx.moveTo(x - 150, y - 85);
    ctx.bezierCurveTo(x - 65, y - 42, x + 20, y + 35, x + 160, y + 92);
    ctx.strokeStyle = i % 5 === 0 ? 'rgba(145,139,129,0.20)' : 'rgba(196,190,180,0.11)';
    ctx.lineWidth = i % 6 === 0 ? 2 : 1; ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

// Noor's courtyard architecture. The avatar, camera and touch controls live in main.ts.
export function createArchitecture(scene: THREE.Scene) {
  const marble = makeMarbleTexture();
  const materials = {
    ground: new THREE.MeshStandardMaterial({ color: 0xffffff, map: marble, roughness: 0.43, metalness: 0.015 }),
    stone: new THREE.MeshStandardMaterial({ color: 0xf0ede5, map: marble, roughness: 0.5, metalness: 0.01 }),
    ivory: new THREE.MeshStandardMaterial({ color: 0xfaf8f2, map: marble, roughness: 0.34, metalness: 0.015 }),
    trim: new THREE.MeshStandardMaterial({ color: 0xb69a68, roughness: 0.38, metalness: 0.28 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x315047, roughness: 0.8 }),
    green: new THREE.MeshStandardMaterial({ color: 0x536e55, roughness: 1 }),
    water: new THREE.MeshStandardMaterial({ color: 0x91b7b2, roughness: 0.22, metalness: 0.08 }),
    avatar: new THREE.MeshStandardMaterial({ color: 0x526d60, roughness: 0.9 }),
    skin: new THREE.MeshStandardMaterial({ color: 0xb98d6b, roughness: 1 }),
  };

  const add = <T extends THREE.Object3D>(object: T, x = 0, y = 0, z = 0): T => {
    object.position.set(x, y, z);
    scene.add(object);
    return object;
  };
  const box = (w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number) =>
    add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material), x, y, z);
  const cylinder = (rt: number, rb: number, h: number, material: THREE.Material, x: number, y: number, z: number, sides = 32) =>
    add(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, sides), material), x, y, z);

  function arch(x: number, z: number, width: number, springY: number, rise: number, material = materials.trim, tube = 0.11) {
    const radius = width / 2;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x - radius, springY, z),
      new THREE.Vector3(x - radius * 0.82, springY + rise * 0.56, z),
      new THREE.Vector3(x - radius * 0.42, springY + rise * 0.91, z),
      new THREE.Vector3(x, springY + rise, z),
      new THREE.Vector3(x + radius * 0.42, springY + rise * 0.91, z),
      new THREE.Vector3(x + radius * 0.82, springY + rise * 0.56, z),
      new THREE.Vector3(x + radius, springY, z),
    ]);
    return add(new THREE.Mesh(new THREE.TubeGeometry(curve, 36, tube, 8, false), material));
  }

  function column(x: number, z: number, height = 4.4, radius = 0.22) {
    const g = new THREE.Group();
    const part = (rt: number, rb: number, h: number, y: number, material: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 40), material);
      mesh.position.y = y; g.add(mesh);
    };
    part(radius * 1.72, radius * 1.8, 0.18, 0.09, materials.trim);
    part(radius * 1.48, radius * 1.5, 0.12, 0.24, materials.ivory);
    part(radius * 0.82, radius, height - 0.72, height / 2, materials.ivory);
    part(radius * 1.12, radius * 1.12, 0.12, height - 0.28, materials.trim);
    part(radius * 1.72, radius * 1.52, 0.2, height - 0.12, materials.trim);
    part(radius * 1.5, radius * 1.45, 0.1, height + 0.03, materials.ivory);
    const fluteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.28 });
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2;
      const flute = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, height - 0.8, 8), fluteMat);
      flute.position.set(Math.cos(a) * radius * 0.81, height / 2, Math.sin(a) * radius * 0.81);
      g.add(flute);
    }
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.42, 12, 10), materials.trim);
      leaf.scale.set(0.7, 1.35, 0.62);
      leaf.position.set(Math.cos(a) * radius * 1.2, height - 0.25, Math.sin(a) * radius * 1.2);
      g.add(leaf);
    }
    g.position.set(x, 0, z); scene.add(g);
  }

  function dome(x: number, z: number, radius: number, baseY: number, height: number) {
    cylinder(radius * 1.08, radius * 1.1, 0.24, materials.trim, x, baseY, z, 64);
    cylinder(radius * 1.02, radius * 1.02, 0.72, materials.ivory, x, baseY + 0.47, z, 64);
    // Tall drum with narrow recessed windows and gold pilasters.
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2;
      const window = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 0.06), materials.dark);
      window.position.set(x + Math.cos(a) * radius, baseY + 0.47, z + Math.sin(a) * radius);
      window.lookAt(x, baseY + 0.47, z); scene.add(window);
      const pilaster = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.82, 10), materials.trim);
      pilaster.position.set(x + Math.cos(a) * radius * 1.02, baseY + 0.48, z + Math.sin(a) * radius * 1.02);
      scene.add(pilaster);
    }
    const profile = [
      new THREE.Vector2(0, 0), new THREE.Vector2(radius, 0),
      new THREE.Vector2(radius * 0.98, height * 0.14),
      new THREE.Vector2(radius * 0.9, height * 0.32),
      new THREE.Vector2(radius * 0.76, height * 0.5),
      new THREE.Vector2(radius * 0.56, height * 0.68),
      new THREE.Vector2(radius * 0.34, height * 0.84),
      new THREE.Vector2(radius * 0.13, height * 0.96),
      new THREE.Vector2(0, height),
    ];
    add(new THREE.Mesh(new THREE.LatheGeometry(profile, 96), materials.ivory), x, baseY + 0.84, z);
    // Fine radial ribs follow the curved dome shell.
    for (let i = 0; i < 24; i++) {
      const a = i / 24 * Math.PI * 2;
      const ribCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x + Math.cos(a) * radius * 0.98, baseY + 0.9, z + Math.sin(a) * radius * 0.98),
        new THREE.Vector3(x + Math.cos(a) * radius * 0.82, baseY + 0.84 + height * 0.42, z + Math.sin(a) * radius * 0.82),
        new THREE.Vector3(x + Math.cos(a) * radius * 0.52, baseY + 0.84 + height * 0.72, z + Math.sin(a) * radius * 0.52),
        new THREE.Vector3(x + Math.cos(a) * radius * 0.12, baseY + 0.84 + height * 0.97, z + Math.sin(a) * radius * 0.12),
      ]);
      add(new THREE.Mesh(new THREE.TubeGeometry(ribCurve, 32, 0.026, 6, false), materials.trim));
    }
    cylinder(0.15, 0.19, 0.2, materials.trim, x, baseY + 0.84 + height, z, 24);
    add(new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.58, 24), materials.trim), x, baseY + 1.22 + height, z);
    add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 16), materials.trim), x, baseY + 1.56 + height, z);
  }

  function minaret(x: number, z: number) {
    cylinder(0.72, 0.78, 0.2, materials.trim, x, 0.1, z, 40);
    cylinder(0.52, 0.62, 1.0, materials.ivory, x, 0.72, z, 40);
    cylinder(0.4, 0.5, 5.1, materials.ivory, x, 3.77, z, 40);
    for (const y of [1.45, 5.95, 6.35, 8.35]) {
      cylinder(0.68, 0.62, 0.16, materials.trim, x, y, z, 40);
      cylinder(0.59, 0.57, 0.1, materials.ivory, x, y + 0.12, z, 40);
    }
    cylinder(0.46, 0.48, 1.2, materials.ivory, x, 7.18, z, 40);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.0, 10), materials.trim);
      add(pillar, x + Math.cos(a) * 0.37, 7.18, z + Math.sin(a) * 0.37);
    }
    cylinder(0.68, 0.5, 0.2, materials.trim, x, 8.0, z, 40);
    cylinder(0.27, 0.4, 2.1, materials.ivory, x, 9.15, z, 40);
    add(new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.4, 32), materials.trim), x, 10.9, z);
    const crescent = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 8, 24, Math.PI * 1.65), materials.trim);
    add(crescent, x, 11.7, z);
  }

  function tree(x: number, z: number, scale = 1) {
    cylinder(0.12 * scale, 0.18 * scale, 1.4 * scale, materials.trim, x, 0.7 * scale, z, 10);
    const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x536e55, roughness: 1 });
    for (const [dx, dy, dz, size] of [[0, 1.5, 0, 0.85], [-0.4, 1.3, 0.1, 0.58], [0.38, 1.38, -0.08, 0.62], [0.04, 1.9, 0.02, 0.58]] as number[][]) {
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(size * scale, 2), crownMaterial);
      crown.scale.set(1, 1.1, 1);
      add(crown, x + dx * scale, dy * scale, z + dz * scale);
    }
  }

  // Courtyard ground and large-format stone paving.
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), materials.ground);
  ground.rotation.x = -Math.PI / 2;
  add(ground, 0, -0.08, 0);
  const paving = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1.28, 0.045, 1.28),
    new THREE.MeshStandardMaterial({ color: 0xd5c9b2, roughness: 0.92 }),
    625,
  );
  const dummy = new THREE.Object3D();
  let index = 0;
  for (let ix = -12; ix <= 12; ix++) for (let iz = -12; iz <= 12; iz++) {
    dummy.position.set(ix * 1.42, -0.015, iz * 1.42);
    dummy.updateMatrix();
    paving.setMatrixAt(index, dummy.matrix);
    const shade = (ix * 7 + iz * 11) % 5 === 0 ? 0xbcae92 : 0xd5c9b2;
    paving.setColorAt(index++, new THREE.Color(shade));
  }
  paving.instanceMatrix.needsUpdate = true;
  add(paving);

  // Main approach: a long, calm axis framed by narrow brass inlays.
  box(3.8, 0.07, 13.5, materials.ivory, 0, 0.015, -4.6);
  for (const x of [-1.94, 1.94]) box(0.045, 0.018, 13.4, materials.trim, x, 0.06, -4.6);
  for (let z = 1.5; z > -11; z -= 1.5) box(3.75, 0.012, 0.025, materials.trim, 0, 0.06, z);

  // Prayer hall front: layered wings leave a genuine walk-through portal.
  box(5.1, 5.25, 3.5, materials.stone, -5.05, 2.625, -14.25);
  box(5.1, 5.25, 3.5, materials.stone, 5.05, 2.625, -14.25);
  box(4.9, 0.72, 3.5, materials.stone, 0, 4.9, -14.25);
  box(15.7, 0.28, 3.75, materials.trim, 0, 5.28, -14.25);
  box(15.35, 0.13, 3.68, materials.ivory, 0, 5.48, -14.25);

  // Recessed central portal, layered voussoirs and a dark teal inner reveal.
  box(4.12, 3.88, 0.18, materials.dark, 0, 1.94, -12.43);
  box(4.42, 0.16, 0.34, materials.trim, 0, 3.86, -12.34);
  arch(0, -12.29, 4.2, 2.0, 1.9, materials.trim, 0.18);
  arch(0, -12.24, 3.75, 2.0, 1.68, materials.ivory, 0.055);
  for (const x of [-2.25, 2.25]) column(x, -12.32, 3.9, 0.2);
  box(4.1, 0.1, 1.25, materials.trim, 0, 0.05, -14.15);

  // Flanking recessed bays and geometric screens.
  for (const x of [-5.1, 5.1]) {
    box(1.65, 2.55, 0.16, materials.dark, x, 2.45, -12.42);
    arch(x, -12.3, 1.62, 2.55, 0.95, materials.trim, 0.09);
    box(1.38, 0.07, 0.1, materials.trim, x, 1.2, -12.28);
    for (let i = 0; i < 7; i++) {
      const screen = box(0.045, 1.65, 0.055, materials.trim, x - 0.48 + i * 0.16, 2.15, -12.24);
      screen.rotation.z = i % 2 === 0 ? 0.12 : -0.12;
    }
    box(0.22, 4.45, 0.32, materials.trim, x * 1.38, 2.22, -12.12);
  }

  // A broad dome anchors the skyline above the entrance.
  cylinder(2.62, 2.72, 0.9, materials.ivory, 0, 5.98, -14.25, 48);
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    const window = box(0.28, 0.48, 0.08, materials.dark, Math.cos(a) * 2.5, 5.98, -14.25 + Math.sin(a) * 2.5);
    window.lookAt(0, 5.98, -14.25);
  }
  dome(0, -14.25, 4.05, 6.48, 3.7);
  dome(-5.45, -14.0, 1.55, 5.9, 1.9);
  dome(5.45, -14.0, 1.55, 5.9, 1.9);
  minaret(-9.5, -14.1);
  minaret(9.5, -14.1);

  // Deep arcades: more bays, larger columns and layered gold cornices.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 7; i++) {
      const z = -10.2 + i * 2.85;
      column(side * 8.7, z, 4.0, 0.22);
      column(side * 12.0, z, 4.0, 0.22);
      box(3.55, 0.2, 0.42, materials.trim, side * 10.35, 4.08, z);
      arch(side * 10.35, z, 3.4, 4.0, 1.65, materials.ivory, 0.12);
      box(3.62, 0.09, 0.42, materials.ivory, side * 10.35, 4.28, z);
      box(3.2, 0.035, 2.5, materials.dark, side * 10.35, 4.02, z);
    }
  }

  // Low perimeter wall and repeating inset panels.
  box(39, 0.82, 0.55, materials.stone, 0, 0.41, -19.4);
  box(39, 0.82, 0.55, materials.stone, 0, 0.41, 19.4);
  box(0.55, 0.82, 39, materials.stone, -19.4, 0.41, 0);
  box(0.55, 0.82, 39, materials.stone, 19.4, 0.41, 0);
  for (let x = -17; x <= 17; x += 2.8) {
    box(1.25, 0.34, 0.045, materials.trim, x, 0.43, -19.09);
    box(1.25, 0.34, 0.045, materials.trim, x, 0.43, 19.09);
  }

  // Reflecting pool and garden edge to the right.
  box(6.4, 0.25, 3.5, materials.trim, 11.1, 0.08, -0.2);
  box(6.05, 0.08, 3.15, materials.water, 11.1, 0.23, -0.2);
  const sheen = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 2.7), new THREE.MeshBasicMaterial({ color: 0xd5e8df, transparent: true, opacity: 0.18 }));
  sheen.rotation.x = -Math.PI / 2;
  add(sheen, 11.1, 0.28, -0.2);
  cylinder(0.3, 0.42, 0.7, materials.ivory, 11.1, 0.62, -0.2, 20);
  cylinder(0.9, 0.45, 0.2, materials.trim, 11.1, 1.08, -0.2, 32);

  // Planted beds, mature trees and quiet seating.
  const planter = new THREE.MeshStandardMaterial({ color: 0x857960, roughness: 1 });
  for (const [x, z] of [[-12, -5], [-12, 3], [-11, 10], [12, 8], [15, 3], [15, 11], [-5, 12], [5, 12]] as number[][]) {
    box(3.4, 0.34, 2.2, planter, x, 0.17, z);
    tree(x, z, 0.9);
  }
  for (const [x, z] of [[-14, -1], [-14, 7], [14, -7], [14, 5]] as number[][]) {
    box(1.8, 0.15, 0.5, materials.trim, x, 0.62, z);
    for (const dx of [-0.68, 0.68]) box(0.12, 0.62, 0.36, materials.dark, x + dx, 0.31, z);
    box(1.8, 0.68, 0.12, materials.dark, x, 0.96, z - 0.18);
  }

  // Warm low lanterns, with restrained emissive glass.
  const lanternGlass = new THREE.MeshStandardMaterial({ color: 0xf2d9a6, emissive: 0xb77c3b, emissiveIntensity: 0.5, roughness: 0.35 });
  for (const x of [-6.2, 6.2]) for (const z of [-5.5, 1.8, 8.4]) {
    cylinder(0.045, 0.075, 1.7, materials.trim, x, 0.85, z, 8);
    add(new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), lanternGlass), x, 1.78, z);
    add(new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.18, 8), materials.trim), x, 2.0, z);
  }

  return materials;
}
