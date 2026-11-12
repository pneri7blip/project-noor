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
      new THREE.Vector3(x, 2 * apexY - springY, z),
      new THREE.Vector3(x + half, springY, z),
    );
    const arch = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, tube, 12, false), material);
    group.add(arch);
    const inner = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x - half + 0.27, springY, z - 0.015),
      new THREE.Vector3(x, 2 * (apexY - 0.34) - springY, z - 0.015),
      new THREE.Vector3(x + half - 0.27, springY, z - 0.015),
    );
    group.add(new THREE.Mesh(new THREE.TubeGeometry(inner, 40, 0.055, 8, false), gold));
  }
  function sideArch(x: number, z: number, width: number, springY: number, apexY: number, material: THREE.Material) {
    const half = width / 2;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x, springY, z - half),
      new THREE.Vector3(x, 2 * apexY - springY, z),
      new THREE.Vector3(x, springY, z + half),
    );
    group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 36, 0.19, 10, false), material));
    const inner = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x - 0.02, springY, z - half + 0.25),
      new THREE.Vector3(x - 0.02, 2 * (apexY - 0.32) - springY, z),
      new THREE.Vector3(x - 0.02, springY, z + half - 0.25),
    );
    group.add(new THREE.Mesh(new THREE.TubeGeometry(inner, 36, 0.055, 8, false), gold));
  }
  function column(x: number, z: number, height = 7.3) {
    cylinder(0.43, 0.54, height, ivory, x, height / 2, z, 48);
    cylinder(0.57, 0.57, 0.24, blush, x, 0.12, z);
    cylinder(0.5, 0.5, 0.12, gold, x, 0.29, z);
    cylinder(0.59, 0.59, 0.24, blush, x, height - 0.12, z);
    cylinder(0.53, 0.53, 0.12, gold, x, height - 0.3, z);
    cylinder(0.7, 0.7, 0.32, ivory, x, height + 0.12, z);
    torus(0.52, 0.045, gold, x, 1.1, z);
    torus(0.52, 0.045, gold, x, height - 0.85, z);
    // Fine vertical flutes and a layered capital give the shafts a carved finish.
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const flute = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, height - 1.55, 6), blush);
      flute.position.set(x + Math.cos(a) * 0.438, height / 2, z + Math.sin(a) * 0.438);
      group.add(flute);
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), gold);
      leaf.scale.set(0.7, 1.55, 0.48);
      leaf.position.set(x + Math.cos(a) * 0.55, height - 0.62, z + Math.sin(a) * 0.55);
      leaf.rotation.z = Math.cos(a) * 0.34;
      leaf.rotation.x = Math.sin(a) * 0.34;
      group.add(leaf);
    }
  }
  // Repeated rugs are instanced to keep draw calls low on Android.
  const rugCount = 42;
  const rugLayers = [
    new THREE.InstancedMesh(new THREE.PlaneGeometry(2.35, 3.75), carpet, rugCount),
    new THREE.InstancedMesh(new THREE.PlaneGeometry(2.03, 3.43), carpetLight, rugCount),
    new THREE.InstancedMesh(new THREE.PlaneGeometry(1.94, 3.34), carpet, rugCount),
    new THREE.InstancedMesh(new THREE.PlaneGeometry(1.77, 3.17), carpetLight, rugCount),
    new THREE.InstancedMesh(new THREE.PlaneGeometry(1.68, 3.08), carpet, rugCount),
    new THREE.InstancedMesh(new THREE.CircleGeometry(0.4465, 24), carpetLight, rugCount),
    new THREE.InstancedMesh(new THREE.CircleGeometry(0.3055, 24), carpet, rugCount),
  ];
  for (const layer of rugLayers) group.add(layer);
  const rugTransform = new THREE.Object3D();
  let rugIndex = 0;
  function carpetPanel(x: number, z: number) {
    const y = [0.012, 0.019, 0.022, 0.024, 0.026, 0.029, 0.033];
    rugLayers.forEach((layer, i) => {
      rugTransform.position.set(x, y[i], z);
      rugTransform.rotation.set(-Math.PI / 2, 0, 0);
      rugTransform.scale.set(1, 1, 1);
      rugTransform.updateMatrix();
      layer.setMatrixAt(rugIndex, rugTransform.matrix);
      layer.instanceMatrix.needsUpdate = true;
    });
    rugIndex++;
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

    }
  }
  // Side arcades now follow the long axis of the hall, joining each column bay.
  for (const z of [-5, -13, -21, -29]) {
    sideArch(-13.12, z, 8.0, 6.75, 9.35, ivory);
    sideArch(13.12, z, 8.0, 6.75, 9.35, ivory);
  }

  // Recessed stained-glass panels and carved surrounds along both side walls.
  for (const z of [-5, -13, -21, -29]) {
    for (const side of [-1, 1]) {
      const x = side * 13.245;
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(2.15, 3.7), new THREE.MeshStandardMaterial({
        color: 0x738c83, roughness: 0.32, metalness: 0.12, emissive: 0x243b35, emissiveIntensity: 0.22,
        side: THREE.DoubleSide,
      }));
      pane.rotation.y = side * Math.PI / 2;
      pane.position.set(x, 4.35, z);
      group.add(pane);
      for (const offset of [-1.22, 1.22]) box(0.16, 4.2, 0.18, gold, side * 13.17, 4.35, z + offset);
      box(0.18, 0.16, 2.6, gold, side * 13.17, 6.48, z);
      box(0.18, 0.16, 2.6, gold, side * 13.17, 2.22, z);
      for (let k = -1; k <= 1; k++) {
        const grille = box(0.08, 3.55, 0.08, blush, side * 13.12, 4.35, z + k * 0.58);
        grille.rotation.y = side * Math.PI / 2;
      }
      const rosette = new THREE.Mesh(new THREE.CircleGeometry(0.34, 8), gold);
      rosette.position.set(side * 13.08, 7.05, z);
      rosette.rotation.y = side * Math.PI / 2;
      group.add(rosette);
      const rosetteCore = new THREE.Mesh(new THREE.CircleGeometry(0.2, 8), blush);
      rosetteCore.position.set(side * 13.06, 7.05, z);
      rosetteCore.rotation.y = side * Math.PI / 2;
      group.add(rosetteCore);
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
  const domeMaterial = ivory.clone();
  domeMaterial.side = THREE.DoubleSide;
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(8, 64, 40, 0, Math.PI * 2, 0, Math.PI / 2),
    domeMaterial,
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
    for (let x = -8.4; x <= 8.4; x += 2.8) carpetPanel(x, z);
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
