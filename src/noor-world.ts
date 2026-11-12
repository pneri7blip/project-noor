import * as THREE from 'three';

type Palette = {
  stone: THREE.Material;
  trim: THREE.Material;
  dark: THREE.Material;
};

export function createNoorWorld(scene: THREE.Scene, palette: Palette) {
  const stone = palette.stone as THREE.MeshStandardMaterial;
  const gold = palette.trim as THREE.MeshStandardMaterial;
  const ivory = new THREE.MeshStandardMaterial({ color: 0xf1e8d9, roughness: 0.82 });
  const blush = new THREE.MeshStandardMaterial({ color: 0xd8b9a7, roughness: 0.76 });
  const deep = new THREE.MeshStandardMaterial({ color: 0x59665a, roughness: 0.9 });
  const carpet = new THREE.MeshStandardMaterial({ color: 0x9b5550, roughness: 1 });
  const carpetLight = new THREE.MeshStandardMaterial({ color: 0xd6b987, roughness: 0.9 });
  const dark = palette.dark as THREE.MeshStandardMaterial;

  const group = new THREE.Group();
  scene.add(group);

  function box(w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }
  function cylinder(rt: number, rb: number, h: number, material: THREE.Material, x: number, y: number, z: number, segments = 32) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segments), material);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  }
  function torus(radius: number, tube: number, material: THREE.Material, x: number, y: number, z: number, horizontal = true) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 64), material);
    if (horizontal) mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  }
  function pointedArch(x: number, z: number, width: number, springY: number, apexY: number, material: THREE.Material, tube = 0.19) {
    const half = width / 2;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x - half, springY, z),
      new THREE.Vector3(x, apexY + 0.8, z),
      new THREE.Vector3(x + half, springY, z),
    );
    const arch = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, tube, 12, false), material);
    group.add(arch);
    const inner = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x - half + 0.27, springY, z - 0.015),
      new THREE.Vector3(x, apexY + 0.34, z - 0.015),
      new THREE.Vector3(x + half - 0.27, springY, z - 0.015),
    );
    group.add(new THREE.Mesh(new THREE.TubeGeometry(inner, 40, 0.055, 8, false), gold));
  }
  function column(x: number, z: number, height = 7.3) {
    cylinder(0.43, 0.54, height, ivory, x, height / 2, z, 40);
    cylinder(0.57, 0.57, 0.24, blush, x, 0.12, z);
    cylinder(0.5, 0.5, 0.12, gold, x, 0.29, z);
    cylinder(0.59, 0.59, 0.24, blush, x, height - 0.12, z);
    cylinder(0.53, 0.53, 0.12, gold, x, height - 0.3, z);
    cylinder(0.7, 0.7, 0.32, ivory, x, height + 0.12, z);
    torus(0.52, 0.045, gold, x, 1.1, z);
    torus(0.52, 0.045, gold, x, height - 0.85, z);
  }
  function carpetPanel(x: number, z: number, w: number, d: number) {
    const base = new THREE.Mesh(new THREE.PlaneGeometry(w, d), carpet);
    base.rotation.x = -Math.PI / 2;
    base.position.set(x, 0.012, z);
    group.add(base);
    for (const inset of [0.16, 0.29]) {
      const border = new THREE.Mesh(new THREE.PlaneGeometry(w - inset * 2, d - inset * 2), carpetLight);
      border.rotation.x = -Math.PI / 2;
      border.position.set(x, 0.019 + inset * 0.001, z);
      group.add(border);
      const inner = new THREE.Mesh(new THREE.PlaneGeometry(w - (inset + 0.045) * 2, d - (inset + 0.045) * 2), carpet);
      inner.rotation.x = -Math.PI / 2;
      inner.position.set(x, 0.022 + inset * 0.001, z);
      group.add(inner);
    }
    const medallion = new THREE.Mesh(new THREE.CircleGeometry(Math.min(w, d) * 0.19, 32), carpetLight);
    medallion.rotation.x = -Math.PI / 2;
    medallion.position.set(x, 0.027, z);
    group.add(medallion);
    const center = new THREE.Mesh(new THREE.CircleGeometry(Math.min(w, d) * 0.13, 32), carpet);
    center.rotation.x = -Math.PI / 2;
    center.position.set(x, 0.031, z);
    group.add(center);
  }

  // A long ivory prayer hall, open toward the courtyard.
  box(27, 0.28, 55, ivory, 0, -0.19, -9);
  box(0.65, 9, 54, blush, -13.6, 4.5, -9);
  box(0.65, 9, 54, blush, 13.6, 4.5, -9);
  box(27.8, 0.75, 0.7, ivory, 0, 8.6, -35.5);
  box(27.8, 0.34, 0.7, gold, 0, 8.08, -35.5);

  // Repeated side arcades: columns, carved capitals and pointed arches.
  for (const z of [-1, -9, -17, -25, -33]) {
    for (const x of [-11.9, 11.9]) {
      column(x, z, 7.2);
      const wallX = x < 0 ? -13.25 : 13.25;
      pointedArch(wallX, z, 4.2, 6.7, 9.5, ivory, 0.2);
    }
  }
  // Transverse arches create a rhythmic sequence of bays.
  for (const z of [-5, -13, -21, -29]) {
    pointedArch(0, z, 22.8, 7.0, 10.0, blush, 0.22);
    for (const x of [-11.9, 11.9]) {
      const pilaster = box(0.9, 7.2, 0.9, ivory, x, 3.6, z);
      pilaster.position.y = 3.6;
      box(1.25, 0.32, 1.25, gold, x, 7.15, z);
    }
  }

  // Central dome with a layered drum, luminous ribs and a finial.
  cylinder(8.15, 8.15, 1.2, blush, 0, 9.0, -18, 64);
  torus(8.12, 0.16, gold, 0, 9.58, -18);
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(8, 64, 40, 0, Math.PI * 2, 0, Math.PI / 2),
    ivory,
  );
  dome.position.set(0, 9.55, -18);
  group.add(dome);
  torus(7.92, 0.075, gold, 0, 9.63, -18);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const points: THREE.Vector3[] = [];
    for (let j = 0; j <= 24; j++) {
      const t = (j / 24) * Math.PI / 2;
      const r = 7.92 * Math.cos(t);
      points.push(new THREE.Vector3(Math.cos(a) * r, 9.58 + 7.92 * Math.sin(t), -18 + Math.sin(a) * r));
    }
    const rib = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 32, 0.045, 6, false), gold);
    group.add(rib);
  }
  cylinder(0.23, 0.32, 0.62, gold, 0, 17.7, -18, 24);
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.25, 20, 16), gold);
  finial.position.set(0, 18.12, -18);
  group.add(finial);

  // Qibla wall and a deep, framed mihrab.
  box(8.5, 7.2, 0.65, ivory, 0, 3.6, -35.0);
  box(5.1, 6.1, 0.22, blush, 0, 3.2, -34.55);
  pointedArch(0, -34.35, 4.5, 1.15, 5.6, gold, 0.16);
  box(3.2, 0.22, 0.18, gold, 0, 1.0, -34.3);
  const mihrabInset = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 4.4), dark);
  mihrabInset.position.set(0, 3.15, -34.2);
  group.add(mihrabInset);
  for (let i = -2; i <= 2; i++) {
    const ornament = new THREE.Mesh(new THREE.CircleGeometry(0.12, 6), gold);
    ornament.position.set(i * 0.48, 5.7, -34.15);
    group.add(ornament);
  }

  // Prayer carpet field with individual, aligned prayer rugs.
  for (let z = -4; z >= -29; z -= 4.2) {
    for (let x = -8.4; x <= 8.4; x += 2.8) carpetPanel(x, z, 2.35, 3.75);
  }

  // Pendant lanterns: warm metal frames and softly glowing cores.
  for (const z of [-7, -17, -27]) {
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.7, 8), gold);
    chain.position.set(0, 8.2, z);
    group.add(chain);
    const lantern = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 1), gold);
    lantern.position.set(0, 7.25, z);
    lantern.scale.y = 1.25;
    group.add(lantern);
    const glow = new THREE.PointLight(0xffdba2, 0.42, 8);
    glow.position.set(0, 7.0, z);
    group.add(glow);
  }

  // Decorative geometric medallions on the upper qibla wall.
  for (let x = -10; x <= 10; x += 2.5) {
    const med = new THREE.Mesh(new THREE.CircleGeometry(0.42, 8), gold);
    med.position.set(x, 7.1, -35.08);
    group.add(med);
    const core = new THREE.Mesh(new THREE.CircleGeometry(0.27, 8), blush);
    core.position.set(x, 7.1, -35.05);
    group.add(core);
  }

  // Courtyard threshold: two monumental portal piers and a shallow water basin.
  for (const x of [-10.2, 10.2]) {
    box(1.4, 9.5, 1.25, ivory, x, 4.65, 14.2);
    box(1.8, 0.35, 1.65, gold, x, 9.45, 14.2);
    box(1.65, 0.25, 1.5, blush, x, 0.3, 14.2);
  }
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.3, 0.28, 64), blush);
  basin.position.set(0, 0.02, 16.5);
  group.add(basin);
  const water = new THREE.Mesh(new THREE.CircleGeometry(2.92, 64), new THREE.MeshStandardMaterial({ color: 0x9eb7b3, roughness: 0.22, metalness: 0.12 }));
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0.18, 16.5);
  group.add(water);

  return group;
}
