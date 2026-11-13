import * as THREE from 'three';

const M = {
  plaster: new THREE.MeshStandardMaterial({ color: 0xeee8dd, roughness: .88 }),
  stone: new THREE.MeshStandardMaterial({ color: 0xd1c2aa, roughness: .68 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xb58c50, roughness: .3, metalness: .68 }),
  paleGold: new THREE.MeshStandardMaterial({ color: 0xd8bd82, roughness: .28, metalness: .55 }),
  marble: new THREE.MeshStandardMaterial({ color: 0x263c38, roughness: .32, metalness: .1 }),
  walnut: new THREE.MeshStandardMaterial({ color: 0x68452f, roughness: .5 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0xc5d8d3, roughness: .12, transmission: .28, transparent: true, opacity: .82, emissive: 0x718c85, emissiveIntensity: .25, side: THREE.DoubleSide }),
  recess: new THREE.MeshStandardMaterial({ color: 0xd7d0c4, roughness: .94 }),
  glow: new THREE.MeshBasicMaterial({ color: 0xffdfa6 }),
};

function archShape(w: number, h: number) {
  const s = new THREE.Shape(), spring = h * .61;
  s.moveTo(-w / 2, 0); s.lineTo(-w / 2, spring);
  s.bezierCurveTo(-w * .49, h * .86, -w * .19, h, 0, h);
  s.bezierCurveTo(w * .19, h, w * .49, h * .86, w / 2, spring);
  s.lineTo(w / 2, 0); s.closePath(); return s;
}
function archCurve(w: number, h: number, base = 0) {
  const s = h * .61;
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-w/2, base, 0), new THREE.Vector3(-w/2, base+s, 0),
    new THREE.Vector3(-w*.45, base+h*.86, 0), new THREE.Vector3(-w*.2, base+h*.98, 0),
    new THREE.Vector3(0, base+h, 0), new THREE.Vector3(w*.2, base+h*.98, 0),
    new THREE.Vector3(w*.45, base+h*.86, 0), new THREE.Vector3(w/2, base+s, 0),
    new THREE.Vector3(w/2, base, 0)
  ], false, 'centripetal');
}
function addBox(parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) {
  const m = new THREE.Mesh(geo, mat); m.position.set(x,y,z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
}
function addArch(parent: THREE.Object3D, x: number, z: number, w: number, h: number, base: number, rot = 0, mat = M.stone, radius = .13) {
  const m = new THREE.Mesh(new THREE.TubeGeometry(archCurve(w,h,base), 72, radius, 12, false), mat);
  m.position.set(x,0,z); m.rotation.y = rot; m.castShadow = true; parent.add(m); return m;
}
function addArchPanel(parent: THREE.Object3D, x: number, y: number, z: number, w: number, h: number, mat: THREE.Material, rot = 0) {
  const m = new THREE.Mesh(new THREE.ShapeGeometry(archShape(w,h), 20), mat);
  m.position.set(x,y,z); m.rotation.y = rot; parent.add(m); return m;
}
function pattern(kind: 'rug'|'entry'|'screen'|'mosaic') {
  const c = document.createElement('canvas'); c.width = c.height = 768;
  const g = c.getContext('2d')!;
  if (kind === 'screen') {
    g.clearRect(0,0,768,768); g.strokeStyle = 'rgba(222,198,150,.88)'; g.lineWidth = 7;
    for(let x=-768;x<1536;x+=96){g.beginPath();g.moveTo(x,0);g.lineTo(x+768,768);g.stroke();g.beginPath();g.moveTo(x,768);g.lineTo(x+768,0);g.stroke();}
  } else if (kind === 'mosaic') {
    g.fillStyle='#d9c8a9';g.fillRect(0,0,768,768);
    for(let y=0;y<768;y+=96)for(let x=0;x<768;x+=96){g.save();g.translate(x+48,y+48);g.rotate(Math.PI/8);g.strokeStyle=(x+y)%192?'#71847a':'#a67c48';g.lineWidth=5;g.strokeRect(-30,-30,60,60);g.beginPath();g.moveTo(0,-42);g.lineTo(42,0);g.lineTo(0,42);g.lineTo(-42,0);g.closePath();g.stroke();g.restore();}
  } else {
    const light=kind==='entry'; g.fillStyle=light?'#d9d1c3':'#315653';g.fillRect(0,0,768,768);
    g.fillStyle=light?'#a9875c':'#b99560';g.fillRect(20,20,728,728);
    g.fillStyle=light?'#eee5d4':'#d8c59e';g.fillRect(32,32,704,704);
    g.fillStyle=light?'#c9b99e':'#315653';g.fillRect(46,46,676,676);
    g.strokeStyle=light?'#a9875c':'#d9c28e';g.lineWidth=5;g.strokeRect(60,60,648,648);g.strokeRect(74,74,620,620);
    for(let y=100;y<700;y+=84)for(let x=100;x<700;x+=84){g.save();g.translate(x,y);g.strokeStyle=light?'#a9875c':'#d9c28e';g.lineWidth=2;for(let i=0;i<8;i++){g.rotate(Math.PI/4);g.beginPath();g.ellipse(0,-18,7,18,0,0,Math.PI*2);g.stroke();}g.restore();}
    g.save();g.translate(384,384);g.strokeStyle=light?'#a9875c':'#d9c28e';g.lineWidth=7;for(let r=48;r<180;r+=28){g.beginPath();g.arc(0,0,r,0,Math.PI*2);g.stroke();}for(let i=0;i<16;i++){g.rotate(Math.PI/8);g.beginPath();g.moveTo(0,-50);g.quadraticCurveTo(65,-125,0,-190);g.quadraticCurveTo(-65,-125,0,-50);g.stroke();}g.restore();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t;
}
const rug = new THREE.MeshStandardMaterial({map:pattern('rug'),roughness:.96,side:THREE.DoubleSide});
const entryRug = new THREE.MeshStandardMaterial({map:pattern('entry'),roughness:.96,side:THREE.DoubleSide});
const screen = new THREE.MeshBasicMaterial({map:pattern('screen'),transparent:true,side:THREE.DoubleSide,depthWrite:false});
const mosaic = new THREE.MeshStandardMaterial({map:pattern('mosaic'),roughness:.65,side:THREE.DoubleSide});

function column(parent: THREE.Object3D,x:number,z:number,h=7.5) {
  const shaftH=h-1.1;
  addBox(parent,new THREE.CylinderGeometry(.43,.52,shaftH,32),M.marble,x,shaftH/2+.48,z);
  const base=addBox(parent,new THREE.BoxGeometry(1.25,.3,1.25),M.stone,x,.15,z);base.rotation.y=Math.PI/4;
  addBox(parent,new THREE.CylinderGeometry(.65,.61,.2,12),M.gold,x,.4,z);
  addBox(parent,new THREE.CylinderGeometry(.76,.48,.68,12),M.stone,x,h-.42,z);
  const cap=addBox(parent,new THREE.BoxGeometry(1.25,.18,1.25),M.gold,x,h-.06,z);cap.rotation.y=Math.PI/4;
  for(const y of [.52,h-.8]){const r=new THREE.Mesh(new THREE.TorusGeometry(.49,.035,8,32),M.paleGold);r.rotation.x=Math.PI/2;r.position.set(x,y,z);parent.add(r);}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const f=new THREE.Mesh(new THREE.CylinderGeometry(.012,.015,shaftH-.55,6),M.paleGold);f.position.set(x+Math.cos(a)*.435,shaftH/2+.48,z+Math.sin(a)*.435);parent.add(f);}
}
function windowPanel(parent: THREE.Object3D,x:number,z:number,rot:number,w:number,h:number) {
  addArchPanel(parent,x,1.05,z,w,h,M.glass,rot);
  const grille=addArchPanel(parent,x,1.12,z+.035,w*.9,h*.9,screen,rot);grille.renderOrder=2;
  addArch(parent,x,z+.08,w+.16,h+.12,1.05,rot,M.gold,.07);
}
function mihrab(parent: THREE.Object3D,z:number,w:number,h:number) {
  addArchPanel(parent,0,.7,z,w,h,M.recess);
  addArch(parent,0,z+.06,w+.38,h+.24,.7,0,M.gold,.13);
  addArch(parent,0,z+.02,w+.68,h+.42,.7,0,M.paleGold,.045);
  const tile=addBox(parent,new THREE.PlaneGeometry(w*.72,h*.32),mosaic,0,.7+h*.53,z+.08);
  tile.material.side=THREE.DoubleSide;
}
function lantern(parent: THREE.Object3D,x:number,y:number,z:number,s=1) {
  addBox(parent,new THREE.CylinderGeometry(.025,.025,.9*s,8),M.gold,x,y+.52*s,z);
  addBox(parent,new THREE.CylinderGeometry(.32*s,.46*s,.76*s,8,1,true),new THREE.MeshPhysicalMaterial({color:0xc89d59,roughness:.28,metalness:.4,transmission:.12,transparent:true,opacity:.82}),x,y,z);
  addBox(parent,new THREE.ConeGeometry(.32*s,.27*s,8),M.gold,x,y+.5*s,z);
  addBox(parent,new THREE.SphereGeometry(.16*s,16,12),M.glow,x,y,z);
  const light=new THREE.PointLight(0xffd9a1,14*s,10*s,2);light.position.set(x,y,z);parent.add(light);
}
function shelf(parent: THREE.Object3D) {
  const x=7.35,z=9.3;
  addBox(parent,new THREE.BoxGeometry(.18,4.4,2.2),M.walnut,x,2.65,z);
  for(let i=0;i<4;i++){
    addBox(parent,new THREE.BoxGeometry(.75,.16,2.5),M.walnut,x-.22,1+i*1.05,z);
    addBox(parent,new THREE.BoxGeometry(.08,.2,2.52),M.gold,x-.59,1+i*1.05,z);
    for(const dz of [-.55,.48]){
      const v=addBox(parent,new THREE.SphereGeometry(.22,16,12),M.stone,x-.22,1.45+i*1.05,z+dz);v.scale.set(1,1.25,1);
    }
  }
  const crown=new THREE.Mesh(new THREE.ShapeGeometry(archShape(1.45,1.55),16),M.walnut);crown.position.set(x-.2,4.85,z);crown.rotation.y=Math.PI/2;parent.add(crown);
}
function dome(parent: THREE.Object3D,z:number) {
  const r=6.1,cy=8.7;
  const shell=new THREE.Mesh(new THREE.SphereGeometry(r,64,32,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xd8c6a8,roughness:.8,side:THREE.BackSide}));
  shell.position.set(0,cy,z);parent.add(shell);
  for(const rr of [5.6,4.8,4,3.1,2.2,1.3]){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(rr,.055,10,96),M.paleGold);ring.rotation.x=Math.PI/2;ring.position.set(0,cy+Math.sqrt(r*r-rr*rr)-.04,z);parent.add(ring);
  }
  for(let i=0;i<16;i++){
    const a=i*Math.PI/8,pts:THREE.Vector3[]=[];
    for(let j=0;j<=24;j++){const t=j/24*Math.PI/2,rr=r*Math.cos(t);pts.push(new THREE.Vector3(Math.cos(a)*rr,cy+r*Math.sin(t),z+Math.sin(a)*rr));}
    parent.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),48,.05,8,false),M.gold));
  }
  const light=new THREE.PointLight(0xffd8a0,24,18,2);light.position.set(0,cy+r-1.1,z);parent.add(light);
  const pendant=addBox(parent,new THREE.CylinderGeometry(.2,.34,.9,12),M.gold,0,cy+r-1.1,z);
}
export function createNoorWorld(scene: THREE.Scene) {
  scene.background=new THREE.Color(0xe7e1d7);scene.fog=new THREE.Fog(0xe7e1d7,48,88);
  const world=new THREE.Group();world.name='NoorWorld';scene.add(world);
  world.add(new THREE.HemisphereLight(0xfff7e9,0x77766c,1.45));
  const sun=new THREE.DirectionalLight(0xfff2dc,2.1);sun.position.set(-10,16,9);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-24;sun.shadow.camera.right=24;sun.shadow.camera.top=24;sun.shadow.camera.bottom=-42;world.add(sun);
  const sky=new THREE.DirectionalLight(0xdde9ee,.75);sky.position.set(-14,9,1);world.add(sky);
  const floor=addBox(world,new THREE.PlaneGeometry(24,60),new THREE.MeshStandardMaterial({color:0xe9e3d9,roughness:.32}),0,-.035,-9);floor.rotation.x=-Math.PI/2;
  const entry=new THREE.Mesh(new THREE.PlaneGeometry(10.8,13.8),entryRug);entry.rotation.x=-Math.PI/2;entry.position.set(0,.012,7.4);world.add(entry);
  const main=new THREE.Mesh(new THREE.PlaneGeometry(14.8,30),rug);main.rotation.x=-Math.PI/2;main.position.set(0,.015,-20.5);world.add(main);

  // Bright entrance room and its screened windows.
  addBox(world,new THREE.BoxGeometry(.32,7.4,24.2),M.plaster,-7.65,3.7,8);
  addBox(world,new THREE.BoxGeometry(.32,7.4,24.2),M.plaster,7.65,3.7,8);
  addBox(world,new THREE.BoxGeometry(15.3,7.4,.36),M.plaster,0,3.7,20);
  mihrab(world,19.78,3.5,5.8);
  for(const z of [1.8,8,14.2])windowPanel(world,-7.43,z,Math.PI/2,2.5,5.45);
  shelf(world);
  for(let i=0;i<6;i++){const roll=addBox(world,new THREE.CylinderGeometry(.18,.18,1.35,20),M.stone,-2.3+i*.92,.2,18.25);roll.rotation.z=Math.PI/2;}
  const pot=addBox(world,new THREE.CylinderGeometry(.2,.28,.52,16),M.stone,5.8,.26,17.8);
  const stem=addBox(world,new THREE.CylinderGeometry(.018,.025,1.35,8),M.gold,5.8,1.2,17.8);
  for(let i=0;i<7;i++){const a=i*Math.PI*2/7,leaf=addBox(world,new THREE.SphereGeometry(.13,10,8),new THREE.MeshStandardMaterial({color:0x7b8068}),5.8+Math.cos(a)*.28,1.7,17.8+Math.sin(a)*.24);leaf.scale.set(.55,1.7,.42);}

  // Open monumental portal.
  column(world,-7.75,-3.9,7.8);column(world,7.75,-3.9,7.8);
  addArch(world,0,-3.9,15.5,4.6,7.55,0,M.stone,.32);
  addArch(world,0,-3.86,15.08,4.36,7.55,0,M.gold,.06);

  // Main prayer hall, with deep arcades and a central dome.
  addBox(world,new THREE.BoxGeometry(.42,12.2,34.8),M.plaster,-11.35,6.1,-21);
  addBox(world,new THREE.BoxGeometry(.42,12.2,34.8),M.plaster,11.35,6.1,-21);
  addBox(world,new THREE.BoxGeometry(5.1,.4,35.2),M.plaster,-8.85,12.05,-21);
  addBox(world,new THREE.BoxGeometry(5.1,.4,35.2),M.plaster,8.85,12.05,-21);
  const rows=[-7.2,-15.4,-23.6,-31.8];
  for(const z of rows){
    column(world,-8,z);column(world,8,z);
    addArch(world,0,z,16,4.25,7.45,0,M.stone,.2);
    addArch(world,0,z+.035,15.68,4.05,7.45,0,M.gold,.045);
  }
  for(let i=0;i<rows.length-1;i++){
    for(const x of [-8,8]){
      const z1=rows[i],z2=rows[i+1],w=z2-z1,cz=(z1+z2)/2,s=2.55,b=7.45;
      const curve=new THREE.CatmullRomCurve3([
        new THREE.Vector3(x,b,z1),new THREE.Vector3(x,b+s*.61,z1),
        new THREE.Vector3(x,b+s*.86,z1+w*.08),new THREE.Vector3(x,b+s,cz),
        new THREE.Vector3(x,b+s*.86,z2-w*.08),new THREE.Vector3(x,b+s*.61,z2),
        new THREE.Vector3(x,b,z2)
      ],false,'centripetal');
      world.add(new THREE.Mesh(new THREE.TubeGeometry(curve,64,.17,10,false),M.stone));
    }
  }
  for(const z of [-10.8,-19,-27.2,-35]){
    windowPanel(world,-11.08,z,Math.PI/2,2.65,6.2);
    windowPanel(world,11.08,z,-Math.PI/2,2.65,6.2);
  }
  dome(world,-23.8);
  for(const z of [-9.2,-17.3,-30.4,-36.2])lantern(world,0,9.2,z,.82);
  lantern(world,-4.8,8.4,-23.8,.62);lantern(world,4.8,8.4,-23.8,.62);

  // Qibla wall and ornamented mihrab at the far end.
  addBox(world,new THREE.BoxGeometry(22.8,12.4,.5),M.plaster,0,6.2,-38.55);
  mihrab(world,-38.25,5.3,8.9);
  for(let i=-4;i<=4;i++){const p=addBox(world,new THREE.PlaneGeometry(.82,1.4),mosaic,i*1.35,1.65,-38.27);}

  const qibla=new THREE.PointLight(0xffd7a1,28,22,2);qibla.position.set(0,6.8,-34.5);world.add(qibla);
  const entryGlow=new THREE.PointLight(0xfff0d8,13,18,2);entryGlow.position.set(-5.2,5.5,13.8);world.add(entryGlow);
  return {minX:-9.8,maxX:9.8,minZ:-36.2,maxZ:17};
}
