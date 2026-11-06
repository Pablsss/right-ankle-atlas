import * as T from './vendor/three.module.js';
export function createJoints(scene){
 const leg=new T.Group(),ankle=new T.Group(),hind=new T.Group(),fore=new T.Group();scene.add(leg);leg.add(ankle);ankle.position.set(0,4.6,0);ankle.add(hind);hind.position.set(0,-1.05,-.8);hind.add(fore);fore.position.set(0,-.8,4.8);scene.updateMatrixWorld(true);return {leg,ankle,hind,fore};
}
export function bindPoint(joints,joint,p){return joints[joint].worldToLocal(new T.Vector3(...p));}
export function setPose(j,dorsi,inversion){j.ankle.rotation.x=-T.MathUtils.degToRad(dorsi);const axis=new T.Vector3(0,.3,1).normalize();j.hind.quaternion.setFromAxisAngle(axis,-T.MathUtils.degToRad(inversion*.8));j.fore.quaternion.setFromAxisAngle(axis,-T.MathUtils.degToRad(inversion*.2));j.leg.updateMatrixWorld(true);}
