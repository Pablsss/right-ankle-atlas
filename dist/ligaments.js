import * as T from './vendor/three.module.js';
import {bindPoint} from './joints.js';
const a=(joint,p)=>({joint,p});
const L=p=>a('leg',p), A=p=>a('ankle',p), H=p=>a('hind',p), F=p=>a('fore',p);
const band=(id,name,from,to,width,description,axis=[0,1,0],bow=[0,0,0])=>({id,name,layer:'ligament',from,to,width,axis,bow,description});
export const ligaments=[
 band('atfl','Anterior talofibular ligament · ATFL',L([2.12,4.85,.26]),A([1.23,4.38,1.32]),.55,'Lateral ankle band joining the anterior fibular malleolus to the talar neck. Footprints and deformation are illustrative.'),
 band('cfl','Calcaneofibular ligament · CFL',L([2.23,4.02,-.55]),H([1.55,2.0,-1.5]),.40,'Lateral band from the fibular tip to the lateral calcaneus, deep to the fibularis tendons.',[0,0,1],[.20,0,0]),
 band('ptfl','Posterior talofibular ligament · PTFL',L([1.80,4.68,-1.0]),A([.48,4.32,-1.56]),.52,'Posterior band connecting the malleolar fossa of the fibula with the posterior talus.'),
 band('aitfl','Anterior inferior tibiofibular ligament',L([.65,6.55,1.02]),L([1.93,5.9,.32]),.62,'Anterior distal syndesmosis band connecting the tibia and fibula.',[0,1,0],[0,0,.15]),
 band('pitfl','Posterior inferior tibiofibular ligament',L([.62,6.42,-1.04]),L([1.93,5.9,-.94]),.70,'Posterior distal syndesmosis band between the tibia and fibula.'),
 band('interosseous','Distal interosseous tibiofibular ligament',L([.60,7.1,-.1]),L([1.52,6.8,-.25]),.85,'Deep connection between the distal tibia and fibula. Lower bone opacity to inspect it.'),
 band('deltoid-navicular','Deltoid · tibionavicular band',L([-1.96,5.1,.62]),F([-1.91,3.10,3.44]),[.32,.95],'Medial deltoid fibres from the medial malleolus toward the navicular. This fan is a simplified representation.',[0,0,1],[-.25,.05,0]),
 band('deltoid-calcaneal','Deltoid · tibiocalcaneal band',L([-1.98,4.55,.1]),H([-1.52,2.85,-.35]),[.3,.68],'Medial deltoid fibres descending to the sustentaculum tali of the calcaneus.',[0,0,1],[-.22,0,0]),
 band('deltoid-anterior','Deltoid · anterior tibiotalar band',L([-1.54,4.8,.7]),A([-1.25,4.35,.85]),.46,'Illustrative deep anterior deltoid fibres linking the tibia to the medial talus. Deltoid subdivisions vary between anatomical descriptions.',[0,0,1]),
 band('deltoid-posterior','Deltoid · posterior tibiotalar band',L([-1.68,4.92,-.57]),A([-1.03,4.43,-.97]),[.40,.78],'Posteromedial deltoid fibres connecting the medial malleolus and talus.',[0,0,1]),
 band('spring','Plantar calcaneonavicular · spring ligament',H([-1.45,2.64,-.18]),F([-1.60,2.50,3.08]),[.62,.90],'Simplified spring ligament band between the sustentaculum tali and navicular, beneath the talar head.',[1,0,0],[-.08,-.35,0]),
 band('cervical','Cervical talocalcaneal ligament',A([1.10,3.94,1.23]),H([1.27,2.87,.85]),.46,'Anterolateral connection between the talar neck and calcaneus in the sinus tarsi region.',[0,0,1]),
 band('talocalcaneal','Interosseous talocalcaneal ligament',A([.1,3.74,.2]),H([.1,3.25,.0]),.72,'Deep connection between talus and calcaneus. Use faint bones or isolation to inspect it.',[1,0,0]),
 band('bifurcate-nav','Bifurcate · calcaneonavicular limb',H([.90,2.85,1.1]),F([.48,3.30,3.2]),.32,'One limb of the bifurcate ligament, from the anterior calcaneus to the navicular.',[1,0,0]),
 band('bifurcate-cub','Bifurcate · calcaneocuboid limb',H([1.12,2.70,1.15]),F([1.75,2.53,3.4]),.36,'The other limb of the bifurcate ligament, from the anterior calcaneus to the cuboid.',[1,0,0]),
 band('short-plantar','Plantar calcaneocuboid · short plantar ligament',H([.76,.77,.42]),F([1.70,1.03,3.57]),.9,'Short plantar band connecting the calcaneus and cuboid.',[1,0,0],[0,-.15,0]),
 band('long-plantar','Long plantar ligament',H([.65,.55,-1.2]),F([1.46,.68,5.28]),[1.0,1.45],'Broad plantar band spanning calcaneus and cuboid toward the metatarsal bases. Distal slips are represented as one sheet.',[1,0,0],[0,-.42,0]),
 band('dorsal-talonav','Dorsal talonavicular ligament',A([-.35,4.84,1.70]),F([-.6,3.79,3.3]),.86,'Dorsal connection between the talar neck and navicular.',[1,0,0],[0,.10,0])
];
export function createLigament(data,joints,scene){
 const group=new T.Group();scene.add(group);
 const widths=Array.isArray(data.width)?data.width:[data.width,data.width];
 const routes=[data.from,data.to].map((anchor,i)=>{
  const delta=new T.Vector3(...data.axis).normalize().multiplyScalar(widths[i]/2);
  return {joint:joints[anchor.joint],center:bindPoint(joints,anchor.joint,anchor.p),edges:[-1,1].map(sign=>bindPoint(joints,anchor.joint,new T.Vector3(...anchor.p).addScaledVector(delta,sign).toArray()))};
 });
 return {data,group,routes,meshes:[],samples:[],material:new T.MeshStandardMaterial({color:0xf2c45d,roughness:.58,transparent:true,side:T.DoubleSide})};
}
export function updateLigament(rec,segments=20){
 const ends=rec.routes.map(r=>({center:r.joint.localToWorld(r.center.clone()),edges:r.edges.map(e=>r.joint.localToWorld(e.clone()))}));
 rec.samples=ends.map(e=>e.center.clone());
 for(let fibre=0;fibre<5;fibre++){
  const positions=[],indices=[];
  for(let k=0;k<=segments;k++){
   const t=k/segments;
   for(let edge=0;edge<2;edge++){
    const u=(fibre+(edge?.94:.06))/5;
    const start=ends[0].edges[0].clone().lerp(ends[0].edges[1],u),end=ends[1].edges[0].clone().lerp(ends[1].edges[1],u);
    const point=start.lerp(end,t).addScaledVector(new T.Vector3(...rec.data.bow),Math.sin(Math.PI*t));positions.push(...point.toArray());
   }
   if(k<segments){const i=k*2;indices.push(i,i+1,i+2,i+1,i+3,i+2);}
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();
  if(rec.meshes[fibre]){rec.meshes[fibre].geometry.dispose();rec.meshes[fibre].geometry=g;}else{const m=new T.Mesh(g,rec.material);m.userData.id=rec.data.id;rec.group.add(m);rec.meshes.push(m);}
 }
}
