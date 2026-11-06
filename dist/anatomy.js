import {ligaments} from './ligaments.js';
// Coordinates: +X lateral (right), +Y superior, +Z anterior. Units illustrative cm.
export const bones=[];
const bone=(id,name,joint,p,s,description,end=null)=>bones.push({id,name,layer:'bone',joint,p,s,end,description});
bone('tibia','Tibia','leg',[-.45,13,0],[1.3,7.3,1.15],'The main weight-bearing bone of the lower leg. Its distal surface forms the roof of the ankle mortise.');
bone('medial-malleolus','Medial malleolus · tibia','leg',[-1.55,5.25,.1],[.55,1.5,.8],'The medial projection of the tibia. Posterior tendons pass behind it.');
bone('fibula','Fibula','leg',[2.02,12.5,-.35],[.55,7.3,.6],'The slender lateral lower-leg bone; its distal end forms the lateral malleolus.');
bone('lateral-malleolus','Lateral malleolus · fibula','leg',[2.04,4.9,-.4],[.62,1.4,.77],'The fibular tip extends lower and more posteriorly than the medial malleolus.');
bone('talus','Talus','ankle',[0,4.6,.25],[1.45,1.0,1.8],'Connects the leg to the hindfoot. No tendon inserts into the talus.');
bone('calcaneus','Calcaneus','hind',[.05,2,-1.5],[1.55,1.55,3.15],'Heel bone. The Achilles tendon attaches to its posterior surface.');
bone('navicular','Navicular','fore',[-.65,3,3.25],[1.5,.82,1.05],'Medial midfoot bone in front of the talus; principal insertion of tibialis posterior.');
bone('cuboid','Cuboid','fore',[1.8,1.8,4],[1.0,.83,1.4],'Lateral midfoot bone; fibularis longus turns under its plantar surface.');
['Medial','Intermediate','Lateral'].forEach((n,i)=>bone('cuneiform'+i,n+' cuneiform','fore',[-1.35+i*1.08,2.45,5.25],[.64,.83,1.1],'One of three wedge-shaped midfoot bones connecting the navicular to the first three metatarsals.'));
// Distal leg shafts with flat proximal cut ends.
for(const b of bones){if(b.id==='tibia'){b.p=[-.45,6.15,0];b.end=[-.45,20.3,0];b.s=[1.28,0,1.12];}if(b.id==='fibula'){b.p=[2.02,5.5,-.35];b.end=[2.02,19.8,-.35];b.s=[.53,0,.52];}}
export const rays=[];
for(let i=0;i<5;i++){
 const x=-2.1+i*1.16, base=[i===4?2.8:x,1.95-i*.13,6.1-i*.33], head=[x,1.25,12.6-(i>1?(i-1)*.8:0)];
 bone('met'+i,'Metatarsal '+(i+1)+(i===0?' · hallux':''),'fore',base,[i===0?.58:.39,0,i===0?.53:.36],'Metatarsal '+(i+1)+' forms a forefoot ray between the tarsus and toe.',head);
 let z=head[2]+.65;const lengths=i===0?[2.2,1.65]:[1.85-i*.11,1.0-i*.07,.9-i*.07];let tip;
 lengths.forEach((l,k)=>{const kind=k===0?'Proximal':k===lengths.length-1?'Distal':'Middle';tip=[x-(i===0?.15:0),1.03,z+l];bone('toe'+i+'-'+k,kind+' phalanx · '+(i===0?'hallux':'toe '+(i+1)),'fore',[x,1.12,z],[i===0?.46:.3,0,i===0?.4:.28],kind+' bone of '+(i===0?'the great toe. The hallux has two phalanges.':'toe '+(i+1)+'. Toes 2–5 have three phalanges.'),tip);z+=l+.28;});
 rays.push({x,base,head,tip});
}
bone('sesamoid-medial','Medial hallux sesamoid','fore',[-2.43,.5,12.35],[.28,.26,.42],'Small plantar bone beneath the first metatarsal head, within the flexor hallucis brevis apparatus.');
bone('sesamoid-lateral','Lateral hallux sesamoid','fore',[-1.77,.5,12.35],[.28,.26,.42],'Paired sesamoid beneath the first metatarsal head; flexor hallucis longus passes between the pair.');
const a=(joint,p)=>({joint,p});
const L=p=>a('leg',p),H=p=>a('hind',p),F=p=>a('fore',p),A=p=>a('ankle',p);
export const tendons=[
 {id:'achilles',name:'Achilles tendon',description:'Common tendon of gastrocnemius and soleus. Inserts on the posterior calcaneus and contributes to plantarflexion.',radius:.24,target:'calcaneus',routes:[[L([0,20,-2.3]),L([0,10,-2.45]),H([0,5,-4.6]),H([0,2.7,-4.55])]]},
 {id:'ta',name:'Tibialis anterior',description:'Passes across the anterior ankle to the medial cuneiform and base of metatarsal 1. Contributes to dorsiflexion and inversion.',target:'cuneiform0',routes:[[L([-.8,19,1.7]),L([-1.25,7,1.7]),A([-1.7,4.6,2.1]),F([-2.1,3.3,4.5]),F([-1.9,2.5,5.6])]]},
 {id:'tp',name:'Tibialis posterior',description:'Runs behind the medial malleolus to the navicular, with additional midfoot insertions. Only its principal navicular attachment is represented.',target:'navicular',routes:[[L([-1.55,19,-1.4]),L([-2.28,7,-1.05]),L([-2.25,4.4,-.85]),H([-2.25,2.7,.3]),F([-2.08,2.95,3.2])]]},
 {id:'pl',name:'Fibularis longus (peroneus)',description:'Passes behind the lateral malleolus, beneath the cuboid, then obliquely across the sole to the medial cuneiform and base of metatarsal 1.',target:'met0',routes:[[L([2.75,19,-.9]),L([3.05,6,-1.5]),H([3,3,-.9]),F([3.0,1,3.7]),F([2.6,.3,4.8]),F([0,.35,6]),F([-2.05,1.3,6.4])]]},
 {id:'pb',name:'Fibularis brevis (peroneus)',description:'Passes behind the lateral malleolus, anterior to longus, and inserts on the tuberosity of metatarsal 5.',target:'met4',routes:[[L([2.9,17,.05]),L([2.97,6,-.8]),H([3,3.05,.2]),F([3.15,1.75,3.6]),F([3.15,1.45,4.95])]]},
 {id:'fhl',name:'Flexor hallucis longus',description:'Passes behind the talus and under the foot to the distal phalanx of the great toe, between the hallux sesamoids.',target:'toe0-1',routes:[[L([.8,19,-1.8]),L([.5,7,-2]),A([-.65,3.7,-2]),H([-1.7,1.3,.4]),F([-1.1,.05,5.5]),F([-2.1,.14,12.3]),F([-2.25,.62,rays[0].tip[2]-.15])]]},
 {id:'fdl',name:'Flexor digitorum longus',description:'Passes behind the medial malleolus and divides in the sole into four tendons inserting on the distal phalanges of toes 2–5.',routes:rays.slice(1).map((r,i)=>[L([-1.6,18,-1.95]),L([-2.4,6,-1.75]),H([-2.4,2.5,-.25]),F([-1.4,.0,5.0]),F([r.x,.18,r.head[2]]),F([r.x,.73,r.tip[2]-.12])]),targets:[1,2,3,4].map(i=>'toe'+i+'-2')},
 {id:'ehl',name:'Extensor hallucis longus',description:'Crosses the anterior ankle to the dorsal base of the distal phalanx of the great toe.',target:'toe0-1',routes:[[L([-.1,19,1.85]),L([-.35,6,2]),A([-.45,4.4,2.6]),F([-1.1,3.5,6]),F([-2.1,1.95,12.5]),F([-2.25,1.4,rays[0].tip[2]-.5])]]},
 {id:'edl',name:'Extensor digitorum longus',description:'Crosses the anterior ankle and divides into four slips to the extensor expansions of toes 2–5. The complex expansions are simplified to distal routes.',routes:rays.slice(1).map(r=>[L([1.1,19,1.45]),L([1.15,6,1.8]),A([1.2,4.2,2.5]),F([1,3.45,5.5]),F([r.x,1.95,r.head[2]]),F([r.x,1.43,r.tip[2]-.4])]),targets:[1,2,3,4].map(i=>'toe'+i+'-2')}
].map(t=>({...t,layer:'tendon',radius:t.radius||.105}));
export const structures=[...bones,...tendons,...ligaments];
