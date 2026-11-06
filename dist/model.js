import * as T from './vendor/three.module.js';
import {bindPoint} from './joints.js';
// Original sculpted procedural meshes, never scan-derived anatomy.
// Sectional surfaces distinguish the tarsal shapes without external assets.
const signedPow=(v,p)=>Math.sign(v)*Math.pow(Math.abs(v),p);
function tarsalGeometry(b){
 const g=new T.SphereGeometry(1,40,28),a=g.attributes.position;
 for(let i=0;i<a.count;i++){
  const x=a.getX(i),y=a.getY(i),z=a.getZ(i);let X=x,Y=y,Z=z;
  if(b.id==='talus'){
   // Broad trochlear body, narrowed neck and rounded anterior head.
   const neck=1-.30*Math.exp(-Math.pow((z-.48)/.22,2));
   X=signedPow(x,.68)*neck;Y=signedPow(y,.65);
   if(y>0)Y-=.17*(1-x*x)*Math.max(0,1-z*z);
   Y-=.20*Math.max(0,z);Z=signedPow(z,.8);
  }else if(b.id==='calcaneus'){
   X=signedPow(x,.7)*(1-.18*Math.max(0,z));Z=signedPow(z,.75);
   Y=signedPow(y,.67)*(1-.30*Math.max(0,z));
   Y+=.17*z-.14*Math.exp(-Math.pow((z-.35)/.3,2))*Math.max(0,y);
   X-=.15*Math.max(0,z)*Math.max(0,y);
  }else if(b.id==='navicular'){
   X=signedPow(x,.72);Y=signedPow(y,.78);Z=.82*z+.22*x*x;
   X-=.13*Math.max(0,-x)*Math.max(0,-y);
  }else if(b.id==='cuboid'){
   X=signedPow(x,.53)*(1-.12*z);Y=signedPow(y,.55);Z=signedPow(z,.53);
   if(y<0)Y+=.19*Math.exp(-Math.pow((z+.2*x)/.28,2));
  }else if(b.id.startsWith('cuneiform')){
   X=signedPow(x,.48)*(1+.32*y);Y=signedPow(y,.62);Z=signedPow(z,.5)*(1-.12*y);
  }else {X=signedPow(x,.8);Y=signedPow(y,.85);Z=signedPow(z,.8);}
  a.setXYZ(i,X*b.s[0],Y*b.s[1],Z*b.s[2]);
 }
 g.computeVertexNormals();return g;
}
export function createBone(b,joints){
 const group=new T.Group(),mat=new T.MeshStandardMaterial({color:0xe8dfc9,roughness:.48,metalness:.03,transparent:true});
 let geo;
 if(b.end){
  const start=new T.Vector3(...b.p),end=new T.Vector3(...b.end),len=start.distanceTo(end);
  const profile=b.joint==='leg'?[[0,0],[.005,1],[.07,1.03],[.18,.72],[.45,.65],[.8,.7],[.999,.78],[1,0]]:[[0,0],[.035,.8],[.08,1],[.18,.88],[.3,.64],[.5,.52],[.72,.63],[.88,.96],[.94,1.02],[.985,.8],[1,0]];
  geo=new T.LatheGeometry(profile.map(([u,r])=>new T.Vector2(r*b.s[0],u*len)),28);geo.translate(0,-len/2,0);
  const attr=geo.attributes.position;
  for(let i=0;i<attr.count;i++){
   const x=attr.getX(i),y=attr.getY(i),z=attr.getZ(i),u=(y+len/2)/len;
   const angle=Math.atan2(z,x),shaft=b.joint==='leg';
   const contour=shaft?1+.09*Math.cos(3*angle):1+.08*Math.cos(2*angle);
   const bow=(shaft?.11:.09)*Math.sin(Math.PI*u);
   attr.setXYZ(i,x*contour+bow,y,z*(b.s[2]/b.s[0])+Math.sin(Math.PI*u)*(shaft?.06:.12));
  }
  geo.computeVertexNormals();
  group.position.copy(bindPoint(joints,b.joint,start.clone().add(end).multiplyScalar(.5).toArray()));group.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),end.sub(start).normalize());
 }else{
  geo=tarsalGeometry(b);group.position.copy(bindPoint(joints,b.joint,b.p));
 }
 const mesh=new T.Mesh(geo,mat);group.add(mesh);joints[b.joint].add(group);group.userData.id=b.id;mesh.userData.id=b.id;
 // Ellipsoidal clearance envelopes for illustrative tendon routing.
 const scale=b.end?[b.s[0]*1.08,new T.Vector3(...b.p).distanceTo(new T.Vector3(...b.end))/2,b.s[2]*1.08]:b.s.map(v=>v*1.03);
 const meshes=[mesh];
 const landmarks={
  calcaneus:[{p:[-1.25,.75,1.05],s:[.70,.33,.82]},{p:[1.25,.1,.7],s:[.35,.26,.48]}],
  talus:[{p:[-.45,-.12,-1.65],s:[.32,.30,.40]},{p:[.5,-.1,-1.55],s:[.36,.30,.35]}],
  navicular:[{p:[-1.23,-.14,.08],s:[.40,.40,.53]}]
 };
 for(const l of landmarks[b.id]||[]){const g=new T.SphereGeometry(1,20,14);g.scale(...l.s);g.translate(...l.p);const m=new T.Mesh(g,mat);m.userData.id=b.id;group.add(m);meshes.push(m);}
 return {data:b,group,meshes,material:mat,envelope:new T.Vector3(...scale)};
}
// Curated replacements can be supplied as same-origin geometry via a loader callback.
// A rejected/missing asset leaves the already-visible procedural bone intact.
export async function loadReplacement(record,loader){if(!loader)return false;try{const geometry=await loader(record.data.id);if(!geometry?.isBufferGeometry)throw Error('Invalid geometry');geometry.computeBoundingSphere();if(!Number.isFinite(geometry.boundingSphere.radius))throw Error('Invalid coordinates');const old=record.meshes[0].geometry;record.meshes[0].geometry=geometry;old.dispose();return true;}catch(e){console.warn('Simplified anatomy retained:',record.data.id,e.message);return false;}}
