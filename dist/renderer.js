import * as T from './vendor/three.module.js';
// CPU projection fallback for browsers without WebGL. Uses the same scene,
// articulation and raycast geometry; shading is deliberately less detailed.
export class CompatibilityRenderer{
 constructor(){this.domElement=document.createElement('canvas');this.ctx=this.domElement.getContext('2d');this.ratio=1;this.isCompatibility=true;this.width=1;this.height=1;}
 setPixelRatio(r){this.ratio=Math.min(r,1);}
 getPixelRatio(){return this.ratio;}
 setClearColor(){}
 setSize(w,h){this.width=w;this.height=h;this.domElement.width=Math.round(w*this.ratio);this.domElement.height=Math.round(h*this.ratio);}
 render(scene,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);const ctx=this.ctx,w=this.domElement.width,h=this.domElement.height;ctx.clearRect(0,0,w,h);const vp=new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);const faces=[],light=new T.Vector3(-.4,.75,.5).normalize();
 scene.traverseVisible(mesh=>{if(!mesh.isMesh)return;const g=mesh.geometry,p=g.attributes.position,idx=g.index?.array,mat=mesh.material;if(mat.opacity<.01)return;const mvp=new T.Matrix4().multiplyMatrices(vp,mesh.matrixWorld);const points=[],world=[];for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i);world.push(v.clone().applyMatrix4(mesh.matrixWorld));points.push(v.applyMatrix4(mvp));}const n=idx?idx.length:p.count;
 for(let i=0;i<n;i+=3){const ia=idx?idx[i]:i,ib=idx?idx[i+1]:i+1,ic=idx?idx[i+2]:i+2,a=points[ia],b=points[ib],c=points[ic];if(a.z>1||b.z>1||c.z>1||a.z< -1||b.z< -1||c.z< -1)continue;const cross=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);if(cross<=0&&mat.side!==T.DoubleSide)continue;const normal=world[ib].clone().sub(world[ia]).cross(world[ic].clone().sub(world[ia])).normalize();const shade=.48+.52*Math.max(0,normal.dot(light));const color=mat.color.clone().multiplyScalar(shade).convertLinearToSRGB();faces.push({a,b,c,z:(a.z+b.z+c.z)/3,color:`rgb(${Math.round(color.r*255)},${Math.round(color.g*255)},${Math.round(color.b*255)})`,alpha:mat.opacity});}
 });faces.sort((a,b)=>b.z-a.z);for(const f of faces){ctx.beginPath();ctx.moveTo((f.a.x+1)*w/2,(1-f.a.y)*h/2);ctx.lineTo((f.b.x+1)*w/2,(1-f.b.y)*h/2);ctx.lineTo((f.c.x+1)*w/2,(1-f.c.y)*h/2);ctx.closePath();ctx.globalAlpha=f.alpha;ctx.fillStyle=f.color;ctx.fill();if(f.alpha>.95){ctx.lineWidth=.45;ctx.strokeStyle=f.color;ctx.stroke();}}ctx.globalAlpha=1;
 }
}
