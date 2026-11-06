import * as T from './vendor/three.module.js';
import {bindPoint} from './joints.js';
export function createTendon(t,joints,scene){const material=new T.MeshStandardMaterial({color:0xd48c68,roughness:.4,transparent:true});const group=new T.Group();scene.add(group);const routes=t.routes.map(r=>r.map(a=>({joint:joints[a.joint],local:bindPoint(joints,a.joint,a.p)})));return {data:t,group,material,routes,meshes:[],samples:[]};}
class Polyline extends T.Curve{constructor(p){super();this.p=p;}getPoint(t,target=new T.Vector3()){const f=t*(this.p.length-1),i=Math.min(Math.floor(f),this.p.length-2);return target.copy(this.p[i]).lerp(this.p[i+1],f-i);}}
export function updateTendon(rec,bones,segments=64){
 rec.samples=[];
 rec.routes.forEach((route,index)=>{
  const anchors=route.map(a=>a.joint.localToWorld(a.local.clone()));const curve=new T.CatmullRomCurve3(anchors,false,'centripetal');const pts=curve.getPoints(segments);const target=rec.data.targets?.[index]||rec.data.target;
  // Conservative envelope projection prevents obvious proxy-bone intersections.
  // This is a visual clearance heuristic, not tissue contact mechanics.
  for(let pass=0;pass<3;pass++)for(let k=1;k<pts.length-1;k++)for(const bone of bones){
   if(bone.data.id===target&&k>segments*.82)continue;
   const p=pts[k].clone().applyMatrix4(bone.inverse);const r=bone.envelope.clone().addScalar(rec.data.radius+.045);const q=p.clone().divide(r);const d=q.length();if(d<1&&d>.001){q.multiplyScalar(1.005/d).multiply(r);pts[k].copy(q.applyMatrix4(bone.group.matrixWorld));}
  }
  const geometry=new T.TubeGeometry(new Polyline(pts),segments,rec.data.radius,6,false);
  if(rec.meshes[index]){rec.meshes[index].geometry.dispose();rec.meshes[index].geometry=geometry;}else{const mesh=new T.Mesh(geometry,rec.material);mesh.userData.id=rec.data.id;rec.group.add(mesh);rec.meshes.push(mesh);}rec.samples.push(pts);
 });
}
