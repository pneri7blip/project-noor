import * as THREE from 'three';

// Noor's courtyard architecture. The avatar, camera and touch controls live in main.ts.
export function createArchitecture(scene: THREE.Scene) {
  const materials = {
    ground: new THREE.MeshStandardMaterial({ color: 0xb9ad91, roughness: 1 }),
    stone: new THREE.MeshStandardMaterial({ color: 0xe8dfcd, roughness: 0.82 }),
    ivory: new THREE.MeshStandardMaterial({ color: 0xf3eee2, roughness: 0.58 }),
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

  function column(x: number, z: number, height = 3.8, radius = 0.2) {
    cylinder(radius * 0.86, radius, height, materials.ivory, x, height / 2, z, 20);
    cylinder(radius * 1.55, radius * 1.5, 0.18, materials.trim, x, 0.09, z, 20);
    cylinder(radius * 1.48, radius * 1.1, 0.2, materials.trim, x, height - 0.08, z, 20);
    cylinder(radius * 1.12, radius * 1.12, 0.07, materials.ivory, x, height + 0.04, z, 20);
  }

  function dome(x: number, z: number, radius: number, baseY: number, height: number) {
    cylinder(radius * 1.04, radius * 1.08, 0.28, materials.trim, x, baseY, z, 48);
    cylinder(radius * 0.94, radius, 0.88, materials.ivory, x, baseY + 0.56, z, 48);
    // Tall, gently pointed profile rather than a primitive hemisphere.
    const profile = [
      new THREE.Vector2(0, 0), new THREE.Vector2(radius, 0),
      new THREE.Vector2(radius * 0.98, height * 0.16),
      new THREE.Vector2(radius * 0.86, height * 0.39),
      new THREE.Vector2(radius * 0.64, height * 0.65),
      new THREE.Vector2(radius * 0.36, height * 0.86),
      new THREE.Vector2(radius * 0.12, height * 0.98),
      new THREE.Vector2(0, height),
    ];
    add(new THREE.Mesh(new THREE.LatheGeometry(profile, 64), materials.ivory), x, baseY + 1.0, z);
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2;
      const ribCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x + Math.cos(a) * radius * 0.98, baseY + 1.05, z + Math.sin(a) * radius * 0.98),
        new THREE.Vector3(x + Math.cos(a) * radius * 0.78, baseY + 1.0 + height * 0.42, z + Math.sin(a) * radius * 0.78),
        new THREE.Vector3(x + Math.cos(a) * radius * 0.34, baseY + 1.0 + height * 0.86, z + Math.sin(a) * radius * 0.34),
        new THREE.Vector3(x, baseY + 1.0 + height, z),
      ]);
      add(new THREE.Mesh(new THREE.TubeGeometry(ribCurve, 24, 0.025, 5, false), materials.trim));
    }
    cylinder(0.13, 0.18, 0.18, materials.trim, x, baseY + 1.0 + height, z, 16);
    add(new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.48, 12), materials.trim), x, baseY + 1.0 + height + 0.29, z);
  }

  function minaret(x: number, z: number) {
    cylinder(0.48, 0.62, 7.6, materials.ivory, x, 3.8, z, 24);
    cylinder(0.76, 0.68, 0.2, materials.trim, x, 1.15, z, 24);
    cylinder(0.7, 0.62, 0.18, materials.trim, x, 5.55, z, 24);
    cylinder(0.62, 0.52, 0.16, materials.trim, x, 6.1, z, 24);
    cylinder(0.42, 0.5, 1.1, materials.ivory, x, 6.75, z, 24);
    // Open lantern crown and its small arches.
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.88, 8), materials.trim);
      add(pillar, x + Math.cos(a) * 0.34, 6.78, z + Math.sin(a) * 0.34);
    }
    cylinder(0.58, 0.48, 0.13, materials.trim, x, 7.25, z, 24);
    add(new THREE.Mesh(new THREE.ConeGeometry(0.58, 1.25, 24), materials.trim), x, 7.92, z);
    add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), materials.trim), x, 8.62, z);
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
  dome(0, -14.25, 2.55, 6.48, 2.55);
  minaret(-8.25, -14.1);
  minaret(8.25, -14.1);

  // Arcaded wings make the courtyard feel enclosed without blocking the view.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 6; i++) {
      const z = -9.6 + i * 2.55;
      column(side * 8.6, z, 3.55, 0.2);
      column(side * 12.0, z, 3.55, 0.2);
      box(3.65, 0.2, 0.32, materials.trim, side * 10.3, 3.62, z);
      arch(side * 10.3, z, 3.4, 3.55, 1.55, materials.trim, 0.09);
      // Fine parapet line above each bay.
      box(3.7, 0.08, 0.38, materials.ivory, side * 10.3, 3.82, z);
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
