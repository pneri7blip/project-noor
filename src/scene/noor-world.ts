import * as THREE from 'three';

export interface NoorMaterials {
  avatar: THREE.MeshStandardMaterial;
  trim: THREE.MeshStandardMaterial;
  skin: THREE.MeshStandardMaterial;
  stone: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
}

function marbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas texture unavailable');
  ctx.fillStyle = '#eeeDE7';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 42; i++) {
    const x = (i * 137) % 600 - 40;
    const y = (i * 83) % 600 - 40;
    ctx.beginPath();
    ctx.moveTo(x - 170, y - 95);
    ctx.bezierCurveTo(x - 65, y - 45, x + 40, y + 55, x + 190, y + 115);
    ctx.strokeStyle = i % 5 === 0 ? 'rgba(153,157,153,.22)' : 'rgba(255,255,255,.65)';
    ctx.lineWidth = i % 4 === 0 ? 2 : 1;
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function carpetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas texture unavailable');
  ctx.fillStyle = '#16483f';
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = '#c5a66b';
  ctx.lineWidth = 3;
  for (let x = 18; x < 512; x += 64) {
    for (let y = 18; y < 512; y += 64) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-15, -15, 30, 30);
      ctx.strokeRect(-8, -8, 16, 16);
      ctx.restore();
    }
  }
  ctx.strokeRect(8, 8, 496, 496);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createNoorWorld(scene: THREE.Scene): NoorMaterials {
  const marbleMap = marbleTexture();
  const ivory = new THREE.MeshStandardMaterial({ color: 0xffffff, map: marbleMap, roughness: 0.34, metalness: 0.025 });
  const white = new THREE.MeshStandardMaterial({ color: 0xf7f5ef, roughness: 0.42 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc4a66a, metalness: 0.68, roughness: 0.27 });
  const goldSoft = new THREE.MeshStandardMaterial({ color: 0xd8c18e, metalness: 0.48, roughness: 0.34 });
  const teal = new THREE.MeshStandardMaterial({ color: 0x174b49, roughness: 0.3, metalness: 0.12 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x477c79, roughness: 0.16, metalness: 0.18, transmission: 0.12, transparent: true, opacity: 0.82 });
  const carpet = new THREE.MeshStandardMaterial({ color: 0xffffff, map: carpetTexture(), roughness: 0.96 });
  const water = new THREE.MeshPhysicalMaterial({ color: 0x8db8b5, roughness: 0.12, metalness: 0.2, transparent: true, opacity: 0.82 });
  const shadowStone = new THREE.MeshStandardMaterial({ color: 0xd8d7d0, roughness: 0.65 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x263a36, roughness: 0.76 });

  const world = new THREE.Group();
  world.name = 'noor-original-architectural-world';
  scene.add(world);

  const addMesh = (geometry: THREE.BufferGeometry, material: THREE.Material, x=0, y=0, z=0, name='') => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x,y,z);
    mesh.name = name;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    world.add(mesh);
    return mesh;
  };
  const box = (w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material) =>
    addMesh(new THREE.BoxGeometry(w,h,d),m,x,y,z);
  const cylinder = (rt:number,rb:number,h:number,x:number,y:number,z:number,m:THREE.Material,segments=32) =>
    addMesh(new THREE.CylinderGeometry(rt,rb,h,segments),m,x,y,z);
  const torus = (r:number,t:number,x:number,y:number,z:number,m:THREE.Material) => {
    const mesh=addMesh(new THREE.TorusGeometry(r,t,10,64),m,x,y,z); mesh.rotation.x=Math.PI/2; return mesh;
  };
  const arch = (x:number,z:number,width:number,spring:number,peak:number,radius:number,m:THREE.Material,axis:'front'|'side'='front') => {
    const pts:THREE.Vector3[]=[];
    const half=width/2;
    for(let i=0;i<=32;i++){
      const a=Math.PI-(i/32)*Math.PI;
      const across=Math.cos(a)*half;
      const y=spring+Math.sin(a)*(peak-spring);
      pts.push(axis==='front'?new THREE.Vector3(x+across,y,z):new THREE.Vector3(x,y,z+across));
    }
    return addMesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),64,radius,10,false),m);
  };
  const column = (x:number,z:number,height=6.2,r=0.28) => {
    cylinder(r*0.88,r,height/2,x,height/2,z,white,24);
    cylinder(r*1.55,r*1.55,0.16,x,0.2,z,goldSoft,24);
    cylinder(r*1.3,r*1.3,0.18,x,height-0.18,z,goldSoft,24);
    cylinder(r*1.48,r*1.48,0.12,x,height-0.04,z,white,24);
  };
  const dome = (x:number,z:number,r:number,baseY:number,material:THREE.Material) => {
    cylinder(r*1.02,r*1.02,0.34,x,baseY,z,white,48);
    const shell=addMesh(new THREE.SphereGeometry(r,48,28,0,Math.PI*2,0,Math.PI/2),material,x,baseY+0.12,z);
    shell.scale.y=1.18;
    torus(r*0.99,0.055,x,baseY+0.12,z,gold);
    cylinder(0.045,0.07,0.72,x,baseY+0.12+r*1.18+0.3,z,gold,12);
    const crescent=addMesh(new THREE.TorusGeometry(0.16,0.035,8,24,Math.PI*1.5),gold,x,baseY+0.12+r*1.18+0.72,z);
    crescent.rotation.y=Math.PI/2;
  };

  // A broad, open marble forecourt establishes the central approach axis.
  box(38,0.34,43,0,-0.22,-2,ivory);
  const paving = new THREE.Mesh(new THREE.PlaneGeometry(35,40),new THREE.MeshStandardMaterial({color:0xffffff,map:marbleMap,roughness:0.38}));
  paving.rotation.x=-Math.PI/2; paving.position.set(0,-0.035,-2); world.add(paving);
  for(let x=-16;x<=16;x+=4) for(let z=-20;z<=16;z+=4){
    box(0.018,0.008,3.92,x,0.012,z,shadowStone);
    box(3.92,0.008,0.018,x,0.012,z,shadowStone);
  }

  // Long reflecting pools frame the processional route without blocking movement.
  for(const side of [-1,1]){
    box(3.1,0.16,17,side*13.6,0.04,-1,white);
    const pool=addMesh(new THREE.PlaneGeometry(2.72,16.6),water,side*13.6,0.13,-1);
    pool.rotation.x=-Math.PI/2;
    for(let i=0;i<7;i++){
      cylinder(0.045,0.045,0.34,side*13.6,0.29,-8+i*2.2,gold,12);
    }
  }

  // Four-sided open riwaq: paired columns, pointed arches and continuous entablature.
  for(const side of [-1,1]){
    for(let z=-10;z<=10;z+=5){
      column(side*10.1,z,6.4,0.3);
      column(side*16.1,z,6.4,0.3);
      arch(side*13.1,z,6.0,4.0,6.15,0.13,white,'side');
    }
    box(6.4,0.42,22,side*13.1,6.55,0,ivory);
    box(6.4,0.12,22,side*13.1,6.82,0,goldSoft);
  }
  for(const z of [-10,10]){
    for(const x of [-13.1,-7.1,7.1,13.1]) column(x,z,6.4,0.3);
    arch(0,z,26.2,4.0,6.15,0.14,white,'front');
    box(26.5,0.42,0.5,0,6.55,z,ivory);
    box(26.5,0.1,0.14,0,6.82,z,goldSoft);
  }

  // Four slender minarets anchor the courtyard corners.
  for(const x of [-16.5,16.5]) for(const z of [-12.5,11.5]){
    cylinder(0.52,0.78,1.1,x,0.55,z,ivory,32);
    cylinder(0.31,0.48,8.0,x,5.0,z,white,32);
    for(const y of [2.1,5.9,8.4]) {
      cylinder(0.54,0.54,0.22,x,y,z,goldSoft,32);
      torus(0.43,0.045,x,y+0.15,z,gold);
    }
    cylinder(0.72,0.34,0.42,x,9.25,z,ivory,32);
    const balcony=addMesh(new THREE.CylinderGeometry(0.68,0.55,0.16,32),goldSoft,x,8.55,z);
    balcony.position.y=8.55;
    cylinder(0.18,0.28,1.9,x,10.4,z,white,24);
    const spire=addMesh(new THREE.ConeGeometry(0.32,1.35,24),gold,x,12.0,z);
    spire.position.y=12.0;
  }

  // The entrance is a layered monumental portal; the central passage remains open.
  for(const side of [-1,1]){
    box(2.2,11.5,1.6,side*5.9,5.75,-13.8,ivory);
    box(0.28,10.8,2.0,side*4.72,5.4,-13.8,goldSoft);
    box(2.2,0.42,2.0,side*5.9,11.35,-13.8,goldSoft);
  }
  arch(0,-13.8,11.7,7.1,11.3,0.34,white);
  arch(0,-13.56,10.5,7.0,10.8,0.075,gold);
  box(12.4,0.6,2.1,0,12.0,-13.8,ivory);
  box(12.7,0.16,2.2,0,12.36,-13.8,gold);

  // Main prayer hall: open central nave, side aisles, high clerestory and qibla end.
  box(22,0.35,26,0,-0.22,-27,ivory);
  box(0.55,8.8,26,-11.0,4.4,-27,ivory);
  box(0.55,8.8,26,11.0,4.4,-27,ivory);
  box(22,8.8,0.55,0,4.4,-40,ivory);
  box(22,0.35,26,0,9.0,-27,teal);
  for(const side of [-1,1]){
    for(const z of [-18,-23,-28,-33,-38]){
      column(side*8.6,z,8.1,0.28);
      arch(side*8.6,z,4.8,6.5,8.0,0.12,white,'side');
    }
  }
  for(const z of [-18,-24,-30,-36]){
    arch(0,z,21.0,6.4,8.35,0.16,white);
    arch(0,z+0.08,20.6,6.35,8.15,0.035,goldSoft);
  }
  // High, dark teal window panels with repeated fine brass divisions.
  for(const side of [-1,1]) for(const z of [-20,-27,-34]){
    const pane=addMesh(new THREE.PlaneGeometry(2.4,3.2),glass,side*10.69,5.4,z);
    pane.rotation.y=side<0?Math.PI/2:-Math.PI/2;
    for(let k=-2;k<=2;k++){
      const bar=box(0.045,3.0,0.045,side*10.57,5.4,z+k*0.43,goldSoft);
      bar.rotation.y=side<0?0:0;
    }
    box(0.08,0.06,2.55,side*10.55,3.8,z,gold);
    box(0.08,0.06,2.55,side*10.55,7.0,z,gold);
  }
  // Central coffered ceiling and three suspended ring chandeliers.
  for(let z=-19;z>=-36;z-=5.5){
    for(const x of [-6,-2,2,6]){
      box(3.45,0.06,3.5,x,8.78,z,teal);
      box(3.4,0.045,0.055,x,8.72,z-1.7,goldSoft);
      box(3.4,0.045,0.055,x,8.72,z+1.7,goldSoft);
      const medallion=addMesh(new THREE.ShapeGeometry((()=>{
        const s=new THREE.Shape();
        for(let i=0;i<16;i++){const a=i*Math.PI/8-Math.PI/2,r=i%2===0?0.58:0.28;const px=Math.cos(a)*r,py=Math.sin(a)*r;if(i===0)s.moveTo(px,py);else s.lineTo(px,py);}
        s.closePath();return s;
      })()),goldSoft,x,8.73,z);
      medallion.rotation.x=0;
    }
  }
  for(const z of [-21,-28,-35]){
    cylinder(0.035,0.035,1.3,0,8.2,z,gold,10);
    torus(1.2,0.075,0,7.45,z,gold);
    torus(0.78,0.035,0,7.4,z,white);
    for(let i=0;i<16;i++){
      const a=i*Math.PI/8;
      const lamp=addMesh(new THREE.SphereGeometry(0.095,12,10),new THREE.MeshStandardMaterial({color:0xffe5ae,emissive:0xe5a84f,emissiveIntensity:0.55}),Math.cos(a),7.4,z+Math.sin(a));
      lamp.scale.setScalar(1);
    }
  }
  // Carpet field with fine prayer-row borders and an unobstructed central axis.
  const prayerCarpet=addMesh(new THREE.PlaneGeometry(19.8,24.8),carpet,0,0.018,-27.2);
  prayerCarpet.rotation.x=-Math.PI/2;
  for(let i=0;i<8;i++) box(19.5,0.018,0.035,0,0.035,-17.2-i*2.8,goldSoft);
  // Deep qibla wall and a recessed mihrab with nested marble and brass profiles.
  box(6.4,5.5,0.22,0,2.75,-39.62,teal);
  box(6.9,0.22,0.36,0,5.5,-39.55,gold);
  arch(0,-39.42,4.8,3.2,5.25,0.13,gold);
  arch(0,-39.3,4.25,3.15,4.95,0.045,ivory);
  box(0.12,3.1,0.1,-2.42,1.55,-39.35,goldSoft);
  box(0.12,3.1,0.1,2.42,1.55,-39.35,goldSoft);

  // A hierarchy of domes: one great central dome and smaller flanking domes.
  dome(0,-27,6.0,9.1,white);
  dome(-7.2,-27,2.6,8.7,ivory);
  dome(7.2,-27,2.6,8.7,ivory);
  dome(0,-7,3.0,7.1,ivory);
  // Upper drum and clerestory band beneath the central dome.
  cylinder(5.45,5.45,1.0,0,9.55,-27,ivory,48);
  for(let i=0;i<16;i++){
    const a=i*Math.PI/8;
    const window=addMesh(new THREE.PlaneGeometry(0.9,0.55),glass,Math.cos(a)*5.38,9.55,-27+Math.sin(a)*5.38);
    window.lookAt(Math.cos(a)*10,9.55,-27+Math.sin(a)*10);
  }
  // Main exterior dome silhouette rises above the courtyard roofline.
  dome(0,-13.8,4.3,12.2,white);

  // Materials returned to the original avatar rig; no control or movement changes.
  return {
    avatar: new THREE.MeshStandardMaterial({color:0xf2eee4,roughness:0.78}),
    trim: new THREE.MeshStandardMaterial({color:0xc6a66d,metalness:0.58,roughness:0.32}),
    skin: new THREE.MeshStandardMaterial({color:0xb98762,roughness:0.8}),
    stone: shadowStone,
    dark,
  };
}
