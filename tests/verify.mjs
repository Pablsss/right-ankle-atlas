import {ligaments,createLigament,updateLigament} from '../dist/ligaments.js';
import assert from 'node:assert/strict';import * as T from '../dist/vendor/three.module.js';import {bones,tendons} from '../dist/anatomy.js';import {createJoints,setPose} from '../dist/joints.js';import {createBone,loadReplacement} from '../dist/model.js';import {createTendon,updateTendon} from '../dist/tendons.js';import {readFile,access} from 'node:fs/promises';
const scene=new T.Scene(),j=createJoints(scene),bs=bones.map(b=>createBone(b,j)),ts=tendons.map(t=>createTendon(t,j,scene));
const ls=ligaments.map(l=>createLigament(l,j,scene));assert.equal(ls.length,18);
for(const b of bs)for(const m of b.meshes)assert([...m.geometry.attributes.position.array].every(Number.isFinite));
assert.equal(bones.length,32);assert.equal(tendons.length,9);assert.equal(bones.filter(b=>b.id.startsWith('toe')).length,14);
let poses=0,maxEndpointError=0,minClearance=Infinity;
for(let d=-25;d<=15;d+=5)for(let inv=-10;inv<=15;inv+=5){setPose(j,d,inv);for(const b of bs)b.inverse=b.group.matrixWorld.clone().invert();for(const t of ts){updateTendon(t,bs,48);for(let r=0;r<t.routes.length;r++){const route=t.routes[r],pts=t.samples[r],last=route.at(-1),expected=last.joint.localToWorld(last.local.clone());maxEndpointError=Math.max(maxEndpointError,expected.distanceTo(pts.at(-1)));assert(expected.distanceTo(pts.at(-1))<1e-7);for(const p of pts)assert([p.x,p.y,p.z].every(Number.isFinite));const a=t.meshes[r].geometry.attributes.position.array;assert([...a].every(Number.isFinite));} }for(const l of ls){
 updateLigament(l);assert.equal(l.meshes.length,5);
 for(let i=0;i<2;i++){const r=l.routes[i];assert(l.samples[i].distanceTo(r.joint.localToWorld(r.center.clone()))<1e-7);}
 for(let fibre=0;fibre<5;fibre++){
  const g=l.meshes[fibre].geometry;assert([...g.attributes.position.array].every(Number.isFinite));
  for(let end=0;end<2;end++)for(let edge=0;edge<2;edge++){
   const r=l.routes[end],u=(fibre+(edge?.94:.06))/5;
   const expected=r.joint.localToWorld(r.edges[0].clone()).lerp(r.joint.localToWorld(r.edges[1].clone()),u);
   const actual=new T.Vector3().fromBufferAttribute(g.attributes.position,end?40+edge:edge);
   assert(actual.distanceTo(expected)<2e-6,'Ligament footprint detached: '+l.data.id);
  }
 }
}poses++;}
assert.equal(poses,54);assert.deepEqual(j.leg.position.toArray(),[0,0,0]);assert.equal(j.ankle.parent,j.leg);assert.equal(j.hind.parent,j.ankle);assert.equal(j.fore.parent,j.hind);
const before=bs[0].meshes[0].geometry;assert.equal(await loadReplacement(bs[0],async()=>{throw Error('test missing asset');}),false);assert.equal(bs[0].meshes[0].geometry,before);
const html=await readFile('dist/index.html','utf8');for(const m of html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g))await access('dist/'+m[1]);
const sw=await readFile('dist/sw.js','utf8');for(const m of sw.matchAll(/'\.\/([^']+)'/g))await access('dist/'+m[1]);
console.log(JSON.stringify({result:'PASS',poses,bones:bones.length,tendonGroups:tendons.length,ligamentBands:ligaments.length,endpointError:maxEndpointError,checks:['joint hierarchy','fixed leg','ligament footprint edge tracking','finite sculpted bone and ligament vertices','finite tube vertices','attachments follow bones','missing asset fallback','HTML and offline-cache assets exist']},null,2));
