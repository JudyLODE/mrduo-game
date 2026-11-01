/* 核心引擎：狀態、音效、角色繪製、對話、視窗、場景與鏡頭。改這裡會影響所有案件。 */
"use strict";

const $=s=>document.querySelector(s);
const EMO=[['熱可可了','think'],['歡迎你','welcome'],['很有精神','laugh'],['帽子陪我','greet'],['「觀察」和「推理」','point'],['熱可可要涼了','oops'],
['專門偷台灣寶物','angry'],['你知道是哪裡嗎','think'],['答對了，就是台北101','cheer'],['出發','point'],['快記下來','point'],['真可疑','think'],
['他也看到戴眼鏡','gasp'],['電梯面板','hmm'],['先把線索整理好','think'],['風阻尼器','welcome'],['颱風或地震','confident'],['望遠鏡','hmm'],
['你眼力好','worry'],['別緊張','confident'],['點一點人物','point'],['就點我一下','greet'],['眼睛要放亮','cheeky'],['我們來推理吧','confident'],
['推理時間','confident'],['沒錯，兩個人','confident'],['少付了','angry'],['八成就是怪盜X','point'],['密碼鎖交給你','cheer'],['快把燈還來','shock'],
['預告信……','oops'],['丟下一封信','oops'],['找找看','think'],['就是日月潭','cheer'],['錄音機的任務','greet'],['是怪盜X的錄音','gasp'],
['英文紙條','hmm'],['好幾個空格','think'],['寺廟和塔','welcome'],['好美的湖','jump'],['開始調查吧','point'],['現在我們知道','victory'],
['英文密碼鎖','cheer'],['安平古堡！這次','angry'],['作風','think'],['圓形的包包','point'],['平安無事','laugh'],['組字鎖','think'],
['要躲進老街','hmm'],['被撕碎了','worry'],['原來如此','gasp'],['大砲','cheeky'],['老榕樹','welcome'],['已經修好','confident'],
['紅磚城牆','welcome'],['完全正確','victory'],['他變裝了','point'],['好多人啊','confused'],['記住三個特徵','point'],['就是你，怪盜X','point'],
['看準了','angry'],['為什麼要偷','angry'],['美麗的東西','teary'],['又溜走了','oops'],['太棒了！你是','victory'],['都找齊了，太厲害','laugh'],
['現場還藏著','cheeky'],['過去看看','point'],['三條線索','think']];
function emoFor(t){for(const [k,p] of EMO)if(t.includes(k))return p;return /[？?]/.test(t)?'think':'confident'}
let DUO={pose:'greet',at:null,coat:false};
const HAPPY=/cheer|victory|laugh|jump|welcome|point|greet|cheeky/,SAD=/worry|oops|confused|shock|gasp|teary/;
const COAT_MAP={worry:'coat_shy',teary:'coat_shy',oops:'coat_shy',cheeky:'coat_shy',laugh:'coat_shy',
  confused:'coat_puzzled',shock:'coat_puzzled',gasp:'coat_puzzled',think:'coat_puzzled',hmm:'coat_puzzled',
  victory:'coat_front',cheer:'coat_front',jump:'coat_front',angry:'coat_front',point:'coat_front'};
function bodyFor(p){return DUO.coat?COAT[COAT_MAP[p]||'coat_pocket']:POSES[p]}
function setDuo(p){if(!POSES[p])p='confident';DUO.pose=p;const P=bodyFor(p);
  const b=document.getElementById('duoBody');
  if(b&&DUO.at){const [x,y,h]=DUO.at,w=h*P.r;b.setAttribute('href',P.b);b.setAttribute('x',x-w/2);b.setAttribute('width',w);['pop','hop','shake2'].forEach(c=>b.classList.remove(c));void b.getBoundingClientRect();b.classList.add(DUO.coat?(HAPPY.test(p)?'hop':SAD.test(p)?'shake2':'pop'):'pop')}
  }
function duoReact(p){setDuo(p)}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ================= state ================= */
const KEY='duoshu-case1-v3';
let G={av:{k:'cat',m:'smile'},name:'',level:'hard',energy:5,badges:[],quests:[],clues:[],facts:[],ch:0};
const hard=()=>true;
function markDone(id){G.done=G.done||{};const a=G.done[G.ch]=G.done[G.ch]||[];if(!a.includes(id))a.push(id);G.saved=Date.now();save()}
const META='duoshu-meta';function meta(){try{return JSON.parse(localStorage.getItem(META)||'null')||{clears:0}}catch(e){return {clears:0}}}
function setMeta(m){try{localStorage.setItem(META,JSON.stringify(m))}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(G))}catch(e){}}
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return v&&typeof v.ch==='number'?v:null}catch(e){return null}}
const fmt=t=>t.replace(/\{n\}/g,G.name||'助手');

/* ================= sound & voice ================= */
let ac=null;
function tone(fs,d=.11,type='triangle',v=.16){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();fs.forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;const t=ac.currentTime+i*d;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+d+.03)})}catch(e){}}
const sGood=()=>{tone([660,880,1320]);duoReact(['cheer','victory','laugh','jump'][Math.floor(Math.random()*4)])},sBad=()=>{tone([240,190],.14,'square',.08);duoReact(['confused','oops','worry'][Math.floor(Math.random()*3)])},sWin=()=>tone([523,659,784,1047,1319],.12),sPop=()=>tone([880],.06,'sine',.12),sBell=()=>tone([1320,990],.35,'sine',.14);
function speak(t,lang){try{const u=new SpeechSynthesisUtterance(t.replace(/[「」『』]/g,''));u.lang=lang;u.rate=lang==='en-US'?.78:.95;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function shush(){try{speechSynthesis.cancel()}catch(e){}}
function toast(t,ms=1800){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),ms)}
function shake(el){if(!el)return;el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake')}

/* ================= HUD ================= */
function hud(){const hm=document.getElementById('hudMe');if(hm)hm.innerHTML=`<span class="hmh">${avHead()}</span>${G.name||''}`;
  $('#hudHearts').innerHTML='推理力 '+[0,1,2,3,4].map(i=>`<span class="${i<G.energy?'':'off'}">♥</span>`).join('');
  $('#hudBones').textContent=G.badges.length;
}
function setCh(t){$('#hudCh').textContent=t}

/* ================= critters ================= */
function shade(hex,p){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=p<0?0:255,a=Math.abs(p)/100;r=Math.round((f-r)*a+r);g=Math.round((f-g)*a+g);b=Math.round((f-b)*a+b);return'#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
const KINDS={
 bear:{fur:'#3F3C44',m:'#CDB89F',ears:'round'},
 bear2:{fur:'#A28166',m:'#E4D4BD',ears:'round'},
 leopard:{fur:'#C9AA85',m:'#FAF4EB',ears:'point',spots:1,stripes:1},
 koala:{fur:'#B2B8C0',ears:'fluffy',bignose:1},
 otter:{fur:'#967159',m:'#EADECF',ears:'tiny',whisk:1},
 magpie:{fur:'#36384A',ears:'none',beak:'#CD6B6F'},
 deer:{fur:'#BD9A7B',m:'#F0E5D7',ears:'long',spots:1},
 turtle:{fur:'#99BB89',ears:'none',shell:1},
 pangolin:{fur:'#B4967D',m:'#E5D5C3',ears:'tiny',scales:1},
 fox:{fur:'#D59D73',m:'#FBF5EE',ears:'fox'},
 xfox:{fur:'#A390D1',m:'#F7F4FC',ears:'fox'},
 cat:{fur:'#E0C495',m:'#F9F4E8',ears:'point'},
 cat2:{fur:'#A9B0BE',m:'#F5F6F9',ears:'point'},
 rabbit:{fur:'#F6F4F7',m:'#FFFFFF',ears:'bunny'},
 pig:{fur:'#EECAD0',ears:'pig',snout:1},
 monkey:{fur:'#A28F7D',m:'#EAD7C5',ears:'side',face:1},
 sheep:{fur:'#FFFFFF',m:'#EFE0D7',ears:'side',wool:1}
};
const HATC={r:'#C86062',b:'#2B79B5',y:'#D4BB49'};
function critter(o){
  const K=Object.assign({},KINDS[o.k],o);const f=K.fur,d=shade(f,-28),m=K.m,ink='#33313F';
  let s='';
  if(K.cape)s+=`<path d="M-46 -98 Q-78 -30 -64 0 H64 Q78 -30 46 -98Z" fill="${K.cape}"/>`;
  if(K.shell)s+=`<ellipse cx="0" cy="-62" rx="58" ry="52" fill="#739661"/><path d="M-30 -96 L0 -110 L30 -96 L30 -60 L0 -46 L-30 -60Z" fill="#8CA57B"/>`;
  s+=`<ellipse cx="-18" cy="-7" rx="16" ry="10" fill="${d}"/><ellipse cx="18" cy="-7" rx="16" ry="10" fill="${d}"/>`;
  s+=`<path d="M-36 -10 Q-46 -72 -27 -96 H27 Q46 -72 36 -10 Q0 4 -36 -10Z" fill="${K.shirt||shade(f,15)}"/>`;
  if(K.top==='apron')s+=`<path d="M-22 -80 H22 V-12 Q0 -6 -22 -12Z" fill="#FFFFFF"/><path d="M-22 -80 Q0 -98 22 -80" fill="none" stroke="#FFFFFF" stroke-width="4"/>`;
  if(K.top==='vest')s+=`<path d="M-30 -92 L-8 -40 L-8 -10 Q-26 -8 -36 -12 Q-44 -70 -30 -92Z M30 -92 L8 -40 L8 -10 Q26 -8 36 -12 Q44 -70 30 -92Z" fill="#5DA17D"/>`;
  if(K.top==='badge')s+=`<circle cx="-16" cy="-66" r="7" fill="#D4BB49" stroke="${ink}" stroke-width="2"/>`;
  if(K.top==='scarf')s+=`<path d="M-26 -96 Q0 -80 26 -96 L22 -84 Q0 -70 -22 -84Z" fill="#50A260"/>`;
  s+=`<ellipse cx="-40" cy="-58" rx="11" ry="21" fill="${f}" transform="rotate(20 -40 -58)"/><ellipse cx="40" cy="-58" rx="11" ry="21" fill="${f}" transform="rotate(-20 40 -58)"/>`;
  const E=K.ears;
  const ear=(l)=>{let p='';
    if(E==='round')p=`<circle cx="-38" cy="-178" r="18" fill="${f}"/><circle cx="-38" cy="-178" r="9" fill="${m||d}"/>`;
    if(E==='point')p=`<path d="M-50 -160 L-42 -204 L-14 -182Z" fill="${f}"/><path d="M-42 -166 L-39 -192 L-24 -180Z" fill="#F2C6CD"/>`;
    if(E==='fox')p=`<path d="M-54 -152 L-48 -216 L-10 -184Z" fill="${f}"/><path d="M-50 -196 L-48 -216 L-36 -205Z" fill="${d}"/><path d="M-44 -164 L-42 -196 L-22 -182Z" fill="#F9E6EA"/>`;
    if(E==='fluffy')p=`<circle cx="-52" cy="-162" r="27" fill="${f}"/><circle cx="-50" cy="-160" r="15" fill="#F1F2F5"/>`;
    if(E==='tiny')p=`<circle cx="-42" cy="-172" r="10" fill="${d}"/>`;
    if(E==='long')p=`<ellipse cx="-60" cy="-158" rx="27" ry="12" fill="${f}" transform="rotate(-25 -60 -158)"/><ellipse cx="-60" cy="-158" rx="16" ry="6" fill="#E5D490" transform="rotate(-25 -60 -158)"/>`;
    if(E==='bunny')p=`<ellipse cx="-20" cy="-212" rx="13" ry="40" fill="${f}"/><ellipse cx="-20" cy="-210" rx="6" ry="28" fill="#F4D0D8"/>`;
    if(E==='pig')p=`<path d="M-44 -168 L-34 -196 L-18 -176Z" fill="${d}"/>`;
    if(E==='side')p=`<ellipse cx="-54" cy="-136" rx="13" ry="17" fill="${K.wool?'#EFE0D7':m||d}"/>`;
    return l?p:`<g transform="scale(-1 1)">${p}</g>`};
  s+=ear(1)+ear(0);
  if(K.wool)s+=[[-40,-170],[-14,-184],[14,-184],[40,-170],[-50,-140],[50,-140]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="20" fill="#FFFFFF" stroke="#E8E6EC" stroke-width="2"/>`).join('');
  s+=`<ellipse cx="0" cy="-138" rx="53" ry="49" fill="${f}"/>`;
  if(K.wool)s+=`<circle cx="0" cy="-182" r="22" fill="#FFFFFF" stroke="#E8E6EC" stroke-width="2"/>`;
  if(K.face)s+=`<ellipse cx="0" cy="-128" rx="40" ry="33" fill="${m}"/>`;
  if(K.stripes)s+=`<path d="M-9 -182 Q-12 -164 -14 -152 M9 -182 Q12 -164 14 -152" stroke="#FAF4EB" stroke-width="5" stroke-linecap="round" fill="none"/>`;
  if(K.spots)s+=[[-32,-166],[30,-170],[-40,-148],[40,-150]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4.5" fill="${K.k==='deer'?'#F9F1E5':d}"/>`).join('');
  if(K.scales)s+=`<path d="M-40 -168 q10 -10 20 0 q10 -10 20 0 q10 -10 20 0 q10 -10 20 0 M-30 -182 q10 -10 20 0 q10 -10 20 0 q10 -10 20 0" fill="none" stroke="${d}" stroke-width="4"/>`;
  if(K.mask)s+=`<path d="M-52 -152 Q0 -168 52 -152 L50 -126 Q0 -140 -50 -126Z" fill="#2A2837"/>`;
  const ey=-140;
  if(K.mood==='sad')s+=`<path d="M-26 -158 L-10 -152 M26 -158 L10 -152" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
  const arc=x=>`<path d="M${x-9} ${ey+3} Q${x} ${ey-9} ${x+9} ${ey+3}" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  if(K.mood==='grin')s+=arc(-18)+arc(18);
  else if(K.mood==='wink')s+=`<ellipse cx="-18" cy="${ey}" rx="8.5" ry="10" fill="${ink}"/><circle cx="-15" cy="${ey-4}" r="3.2" fill="#FFFFFF"/>`+arc(18);
  else s+=`<ellipse cx="-18" cy="${ey}" rx="8.5" ry="10" fill="${K.mask?'#FFFFFF':ink}"/><ellipse cx="18" cy="${ey}" rx="8.5" ry="10" fill="${K.mask?'#FFFFFF':ink}"/>`;
  if(K.mask)s+=`<circle cx="-17" cy="${ey+1}" r="5" fill="${ink}"/><circle cx="19" cy="${ey+1}" r="5" fill="${ink}"/>`;
  if(!/grin|wink/.test(K.mood||''))s+=`<circle cx="-15" cy="${ey-4}" r="3.2" fill="#FFFFFF"/><circle cx="21" cy="${ey-4}" r="3.2" fill="#FFFFFF"/>`;
  if(K.mood==='cool')s+=`<path d="M-36 ${ey-12} H-4 V${ey+4} Q-20 ${ey+14} -36 ${ey+4}Z M4 ${ey-12} H36 V${ey+4} Q20 ${ey+14} 4 ${ey+4}Z" fill="#2B2733"/><path d="M-4 ${ey-8} H4" stroke="#2B2733" stroke-width="4"/>`;
  s+=`<ellipse cx="-35" cy="-118" rx="10" ry="6" fill="#ECADB8" opacity=".55"/><ellipse cx="35" cy="-118" rx="10" ry="6" fill="#ECADB8" opacity=".55"/>`;
  const mouth=K.mood==='grin'?`<path d="M-12 -113 Q0 -92 12 -113Z" fill="#8E3B3B" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`:K.mood==='o'?`<ellipse cx="0" cy="-106" rx="6" ry="7" fill="${ink}"/>`:K.mood==='sad'?`<path d="M-8 -104 Q0 -112 8 -104" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`:`<path d="M-9 -112 Q-4.5 -105 0 -112 Q4.5 -105 9 -112" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if(K.beak)s+=`<path d="M-13 -126 L13 -126 L0 -102Z" fill="${K.beak}"/>`;
  else if(K.bignose)s+=`<ellipse cx="0" cy="-122" rx="13" ry="17" fill="#39383F"/><path d="M-6 -100 Q0 -96 6 -100" stroke="${ink}" stroke-width="3" fill="none"/>`;
  else if(K.snout)s+=`<ellipse cx="0" cy="-118" rx="17" ry="12" fill="${shade(f,-12)}"/><ellipse cx="-6" cy="-118" rx="3" ry="4" fill="${ink}"/><ellipse cx="6" cy="-118" rx="3" ry="4" fill="${ink}"/>`+mouth.replace(/-112/g,'-102').replace(/-105/g,'-96');
  else if(m)s+=`<ellipse cx="0" cy="-116" rx="23" ry="16" fill="${m}"/><ellipse cx="0" cy="-124" rx="7.5" ry="5.5" fill="${ink}"/>`+mouth;
  else s+=mouth;
  if(K.whisk)s+=`<path d="M-24 -116 H-44 M-24 -110 L-42 -104 M24 -116 H44 M24 -110 L42 -104" stroke="${ink}" stroke-width="2"/>`;
  if(K.glasses)s+=`<g stroke="#2C303A" stroke-width="4" fill="rgba(255,255,255,.28)"><circle cx="-18" cy="${ey}" r="14"/><circle cx="18" cy="${ey}" r="14"/></g><path d="M-4 ${ey} H4" stroke="#2C303A" stroke-width="4"/>`;
  const H=K.hat;
  if(H){const c=H.c||'#C86062';
    if(H.t==='cap')s+=`<path d="M-50 -170 Q-48 -224 0 -226 Q48 -224 50 -170Z" fill="${c}"/><path d="M-52 -170 Q8 -184 74 -166 Q34 -156 -52 -162Z" fill="${shade(c,-22)}"/><circle cx="0" cy="-224" r="5" fill="${shade(c,-22)}"/>`;
    if(H.t==='top')s+=`<rect x="-32" y="-252" width="64" height="72" rx="8" fill="${c}"/><rect x="-32" y="-202" width="64" height="12" fill="#C9727A"/><ellipse cx="0" cy="-180" rx="54" ry="11" fill="${c}"/>`;
    if(H.t==='chef')s+=`<rect x="-36" y="-206" width="72" height="30" rx="6" fill="#FFFFFF" stroke="#DEE1E8" stroke-width="2"/><circle cx="-24" cy="-214" r="22" fill="#FFFFFF" stroke="#DEE1E8" stroke-width="2"/><circle cx="24" cy="-214" r="22" fill="#FFFFFF" stroke="#DEE1E8" stroke-width="2"/><circle cx="0" cy="-226" r="25" fill="#FFFFFF" stroke="#DEE1E8" stroke-width="2"/>`;
    if(H.t==='captain')s+=`<path d="M-48 -176 Q-52 -222 0 -224 Q52 -222 48 -176Z" fill="#FFFFFF"/><rect x="-48" y="-190" width="96" height="14" fill="#42507C"/><path d="M-46 -176 Q0 -164 46 -176 L40 -168 Q0 -156 -40 -168Z" fill="#2A2A32"/><circle cx="0" cy="-204" r="8" fill="#D4BB49"/>`;
    if(H.t==='guard')s+=`<path d="M-50 -172 Q-48 -222 0 -224 Q48 -222 50 -172Z" fill="#495987"/><path d="M-52 -172 Q0 -160 52 -172 L48 -164 Q0 -152 -48 -164Z" fill="#2D3551"/><path d="M0 -214 l9 6 -3 12 h-12 l-3 -12z" fill="#D4BB49"/>`;
    if(H.t==='beret')s+=`<ellipse cx="-6" cy="-184" rx="54" ry="18" fill="${c}"/><circle cx="-6" cy="-202" r="5" fill="${c}"/>`;
    if(H.t==='bow')s+=`<path d="M22 -186 l-16 -12 v24z M22 -186 l16 -12 v24z" fill="${c}"/><circle cx="22" cy="-186" r="6" fill="${shade(c,-20)}"/>`;
  }
  if(K.bag==='o')s+=`<path d="M-30 -94 L40 -42" stroke="#5B4535" stroke-width="5"/><circle cx="42" cy="-34" r="18" fill="#936F52"/><circle cx="42" cy="-34" r="10" fill="none" stroke="#BFA68C" stroke-width="3" stroke-dasharray="4 3"/>`;
  if(K.bag==='s')s+=`<path d="M-30 -94 L36 -56" stroke="#5B4535" stroke-width="5"/><rect x="24" y="-60" width="34" height="30" rx="5" fill="#936F52"/><rect x="30" y="-52" width="22" height="5" fill="#BFA68C"/>`;
  if(K.hold==='recorder')s+=`<rect x="34" y="-70" width="34" height="24" rx="4" fill="#55586F"/>`;
  return s;
}
const head=(look)=>`<svg viewBox="-75 -232 150 150">${critter(look)}</svg>`;
const AV_K=[['cat','小貓'],['rabbit','兔子'],['bear2','小熊'],['sheep','綿羊'],['monkey','猴子']],AV_M=[['smile','微笑'],['grin','開心'],['wink','眨眼'],['cool','酷酷'],['o','驚訝']];
let AV={k:'cat',m:'smile'};
const avLook=(a=AV)=>({k:a.k,mood:a.m,shirt:'#7FA0BF',top:'scarf'});
const avHead=(a=AV)=>`<svg viewBox="-80 -245 160 160">${critter(avLook(a))}</svg>`;

/* ================= cast ================= */
const X_LOOK={k:'xfox',shirt:'#3D3E52',hat:{t:'top',c:'#303040'},mask:1,cape:'#CB7681'};
const CAST={
 duo:{name:'偵探多叔'},
 x:{name:'怪盜X',look:X_LOOK,cls:'x'},
 bear:{name:'熊阿伯（保全）',look:{k:'bear',shirt:'#495987',hat:{t:'guard'},top:'badge'}},
 leo:{name:'石虎姐姐（紀念品店）',look:{k:'leopard',shirt:'#C86062',top:'apron',hat:{t:'bow',c:'#C86062'}}},
 koala:{name:'Mr. Koala（觀光客）',look:{k:'koala',shirt:'#D4BB49',hat:{t:'cap',c:'#2B79B5'}}},
 pango:{name:'小穿山甲',look:{k:'pangolin',shirt:'#8DB36E',mood:'sad'}},
 otter:{name:'水獺船長',look:{k:'otter',shirt:'#42507C',hat:{t:'captain'}}},
 magpie:{name:'藍鵲阿姨（茶葉蛋攤）',look:{k:'magpie',shirt:'#2B79B5',top:'apron',hat:{t:'chef'}}},
 deer:{name:'梅花鹿導覽員',look:{k:'deer',shirt:'#F7F0DE',top:'vest'}},
 turtle:{name:'海龜伯伯（蝦捲攤）',look:{k:'turtle',shirt:'#D29841',top:'apron'}},
 tape:{name:'錄音機',look:X_LOOK,cls:'x'}
};

/* ================= dialogue ================= */
let typingT=null;
function portrait(who){
  if(who==='duo')return `<img src="${DUO.coat?COAT.bust_coat.b:COAT.bust_sweater.b}" alt="">`;
  if(who==='me')return `<svg viewBox="-100 -262 200 232">${critter(avLook())}</svg>`;
  const c=CAST[who];return c&&c.look?`<svg viewBox="-100 -262 200 232">${critter(c.look)}</svg>`:'';
}
function showLine(who,text,o={}){
  return new Promise(res=>{
    const box=$('#dlg');box.hidden=false;box.className='dlg'+(who==='sys'?' sys':'');
    if(who==='duo')setDuo(o.e||emoFor(fmt(text)));
    $('#stage').classList.add('talk');if(who!=='sys'&&who!=='me')camOn(who);
    $('#dPort').innerHTML=portrait(who);
    const nm=$('#dName');nm.hidden=who==='sys';nm.textContent=who==='me'?(G.name||'助手'):(CAST[who]?CAST[who].name:'');nm.className='nametag'+(CAST[who]&&CAST[who].cls?' x':'');
    const t=fmt(text),el=$('#dText');el.textContent='';el.className='dtext'+(o.en?' en':'');
    $('#dZh').hidden=true;$('#dZh').textContent=o.zh?fmt(o.zh):'';$('#dZhBtn').hidden=!o.zh;$('#dZhBtn').textContent='看中文';
    $('#dZhBtn').onclick=e=>{e.stopPropagation();const z=$('#dZh');z.hidden=!z.hidden;$('#dZhBtn').textContent=z.hidden?'看中文':'收起中文'};
    $('#dSay').onclick=e=>{e.stopPropagation();speak(t,o.en?'en-US':'zh-TW')};
    if(o.en)speak(t,'en-US');
    talkAnim(who,true);
    let i=0,done=false;$('#dNext').hidden=true;
    const fin=()=>{done=true;clearTimeout(typingT);el.textContent=t;talkAnim(who,false);res({box,isDone:()=>done})};
    const step=()=>{i+=1;el.textContent=t.slice(0,i);if(i%3===0)tone([o.en?520:440+((i*37)%120)],.03,'sine',.035);if(i<t.length)typingT=setTimeout(step,o.en?30:26);else fin()};
    box.onclick=()=>{if(!done)fin()};
    step();
  });
}
function say(who,text,o={}){
  return showLine(who,text,o).then(({box})=>new Promise(res=>{
    $('#dNext').hidden=false;
    box.onclick=()=>{box.onclick=null;$('#dNext').hidden=true;sPop();res()};
  }));
}
function hideDlg(){$('#dlg').hidden=true;$('#choices').hidden=true;shush();$('#stage').classList.remove('talk');camFull()}
async function ask(who,text,opts,correct,o={}){
  await showLine(who,text,o);
  $('#dlg').onclick=null;
  return new Promise(res=>{
    const c=$('#choices');c.className='choices'+(o.grid?' grid':'');c.hidden=false;
    c.innerHTML=opts.map((t,i)=>`<button data-i="${i}" class="${o.enOpts?'en':''}"${o.colors?` style="background:${o.colors[i]};color:${o.dark&&o.dark[i]?'#fff':'inherit'}"`:''}><span class="k">${'ABCD'[i]}</span>${t}</button>`).join('');
    c.onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const i=+b.dataset.i;
      if(o.enOpts)speak(opts[i].replace(/<[^>]+>/g,''),'en-US');
      if(correct==null||i===correct){c.hidden=true;c.onclick=null;if(correct!=null)sGood();res(i)}
      else{sBad();shake(b);b.disabled=true;if(o.scored){G.energy=Math.max(1,G.energy-1);hud();toast('推理力 −1　'+(o.wrong||'再想想看！'))}else toast(o.wrong||'再想想看！')}};
  });
}
function talkAnim(who,on){const g=document.querySelector(`#spotL [data-actor="${who}"]`);if(g)g.classList.toggle('talking',on)}

/* ================= modal ================= */
let LOCK_T=0;function lockFor(fn,ms){const m=$('#mBody');m.classList.add('lock');const t=++LOCK_T;setTimeout(()=>{if(t===LOCK_T)m.classList.remove('lock');if(fn)fn()},ms)}
function modal(html,bind){$('#mBody').innerHTML=html;$('#modal').hidden=false;lockFor(null,380);const c=$('#mBody .card[data-duo]');if(c){const h3=c.querySelector('h3');if(h3)h3.insertAdjacentHTML('beforeend',`<span class="ptools"><button type="button" class="tool" data-peek>看現場</button><button type="button" class="tool" data-board>線索板</button></span>`);c.addEventListener('click',e=>{if(e.target.closest('[data-peek]'))peekOn();else if(e.target.closest('[data-board]'))clueBoard(false)});if(h3)h3.insertAdjacentHTML('afterbegin',`<span class="duoMini"><img class="duoFace" src="${FACE}" alt=""></span>`);setDuo(c.dataset.duo)}if(bind)bind($('#mBody'))}
function closeModal(){$('#peekBtn').hidden=true;$('#stage').classList.remove('peek');$('#modal').hidden=true;$('#mBody').innerHTML='';shush()}
function chapterCard(small,big,sub){return new Promise(res=>{const d=document.createElement('div');d.className='chap';d.innerHTML=`<div><small>${small}</small><b>${big}</b><span>${sub}</span></div>`;document.body.appendChild(d);sWin();setTimeout(()=>{d.remove();res()},2300);d.onclick=()=>{d.remove();res()}})}

/* ================= scene engine ================= */
let SC=null,busy=false;
const CAM={x:0,y:0,w:1600,last:null};let camRaf=0;const ACT={};
function camSet(x,y,w){CAM.x=x;CAM.y=y;CAM.w=w;const sv=document.getElementById('scene');if(sv)sv.setAttribute('viewBox',`${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${(w*.625).toFixed(1)}`)}
function camTo(x,y,w,ms=450){cancelAnimationFrame(camRaf);const a={x:CAM.x,y:CAM.y,w:CAM.w},t0=performance.now();
  if(matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)ms=1;
  const f=t=>{const k=Math.min((t-t0)/ms,1),e=1-Math.pow(1-k,3);camSet(a.x+(x-a.x)*e,a.y+(y-a.y)*e,a.w+(w-a.w)*e);if(k<1)camRaf=requestAnimationFrame(f)};camRaf=requestAnimationFrame(f)}
function camFull(){CAM.last=null;if(CAM.w<1600||CAM.x||CAM.y)camTo(0,0,1600)}
function posOf(who){if(!SC)return null;if(who==='duo'&&DUO.at)return DUO.at;if(ACT[who])return ACT[who];
  const sp=SC.spots.find(s=>!s.hidden&&(s.actor===who||s.id===who));if(!sp)return null;return sp.type==='npc'?[sp.x,sp.y,240*(sp.s||1)]:[sp.x,sp.y+40,160]}
function camOn(who){const p=posOf(who);if(!p)return;const pts=[p];
  const q=CAM.last&&CAM.last.who!==who?posOf(CAM.last.who):null;if(q&&Math.abs(q[0]-p[0])<760)pts.push(q);
  if(CAM.subject&&CAM.subject!==who){const r=posOf(CAM.subject);if(r&&Math.abs(r[0]-p[0])<760)pts.push(r)}
  const xmin=Math.min(...pts.map(t=>t[0]-t[2]*.4)),xmax=Math.max(...pts.map(t=>t[0]+t[2]*.4)),top=Math.min(...pts.map(t=>t[1]-t[2])),bot=Math.max(...pts.map(t=>t[1]));
  let w=Math.max(820,xmax-xmin+260,((bot-top)*1.1/.76)/.625);w=Math.min(w,1600);const H=w*.625;
  const x0=Math.max(0,Math.min(1600-w,(xmin+xmax)/2-w/2));let y0=Math.max(bot-H*.8,top-H*.06);y0=Math.max(0,Math.min(1000-H,y0));
  CAM.last={who};camTo(x0,y0,w)}
const bone=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-14" cy="-6" r="9" fill="#EEE5D1" stroke="#2E384F" stroke-width="3"/><circle cx="-14" cy="6" r="9" fill="#EEE5D1" stroke="#2E384F" stroke-width="3"/><circle cx="14" cy="-6" r="9" fill="#EEE5D1" stroke="#2E384F" stroke-width="3"/><circle cx="14" cy="6" r="9" fill="#EEE5D1" stroke="#2E384F" stroke-width="3"/><rect x="-14" y="-6" width="28" height="12" fill="#EEE5D1"/><path d="M-14 -6 H14 M-14 6 H14" stroke="#2E384F" stroke-width="3"/></g>`;
const star=(x,y,r=24)=>`<path class="twinkle" d="M${x} ${y-r} L${x+r*.28} ${y-r*.28} L${x+r} ${y} L${x+r*.28} ${y+r*.28} L${x} ${y+r} L${x-r*.28} ${y+r*.28} L${x-r} ${y} L${x-r*.28} ${y-r*.28}Z" fill="#E8E19E" stroke="#C9A42F" stroke-width="2"/>`;
function duoImg(x,y,h){DUO.at=[x,y,h];const P=bodyFor(DUO.pose),w=h*P.r;return `<g class="spot" data-id="__duo"><image id="duoBody" href="${P.b}" x="${x-w/2}" y="${y-h}" width="${w}" height="${h}" class="breathe"/><rect class="hit" id="duoHit" x="${x-h*.3}" y="${y-h}" width="${h*.6}" height="${h}"/></g>`}
function spotSvg(sp){
  if(sp.hidden||(sp.type==='badge'&&sp.got))return '';
  let s=`<g class="spot" data-id="${sp.id}">`;
  if(sp.type==='npc'){
    const sc=sp.s||1;s+=`<g data-actor="${sp.actor||sp.id}"><g transform="translate(${sp.x} ${sp.y}) scale(${sc})"><g class="breathe">${critter(CAST[sp.actor||sp.id].look)}</g></g></g>`;
    s+=`<rect class="hit" x="${sp.x-70*sc}" y="${sp.y-240*sc}" width="${140*sc}" height="${245*sc}"/>`;
    const mk=!sp.done&&sp.need?'!':(sp.quest&&!sp.qdone?'?':'');
    if(mk)s+=`<g transform="translate(${sp.x+40*sc} ${sp.y-250*sc})"><g class="bob"><circle r="24" fill="${mk==='!'?'#D4BB49':'#92C3DB'}" stroke="#2E384F" stroke-width="4"/><text y="10" text-anchor="middle" font-size="30" font-weight="900" fill="#2E384F" font-family="Fredoka,sans-serif">${mk}</text></g></g>`;
  }else if(sp.type==='badge'){
    s+=`<g class="wiggle"><circle cx="${sp.x}" cy="${sp.y}" r="34" fill="#E8E19E" opacity=".55"/>${bone(sp.x,sp.y,sp.s||1.3)}</g><circle class="hit" cx="${sp.x}" cy="${sp.y}" r="50"/>`;
  }else{
    s+=(sp.art?sp.art():'')+`<circle class="hit" cx="${sp.x}" cy="${sp.y}" r="${sp.r||60}"/>`;
    if(sp.need&&!sp.done)s+=mag(sp.x+(sp.sx||30),sp.y-(sp.sy||30));
    if(sp.done&&sp.need)s+=`<g transform="translate(${sp.x+(sp.sx||30)} ${sp.y-(sp.sy||30)})"><circle r="17" fill="#50A260" stroke="#fff" stroke-width="3"/><path d="M-7 0 l5 5 l9 -10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
  }
  return s+'</g>';
}
function drawSpots(){if(!SC)return;const dy=SC.duo?SC.duo[1]:0,back=SC.spots.filter(s=>SC.duo&&s.y<dy-40),front=SC.spots.filter(s=>!back.includes(s));$('#spotL').innerHTML=back.map(spotSvg).join('')+(SC.duo?duoImg(...SC.duo):'')+front.map(spotSvg).join('');updateTask()}
function setScene(def){if(typeof G!=='undefined'&&G){const dn=(G.done||{})[G.ch]||[];def.spots.forEach(s=>{if(s.need&&s.tap&&dn.includes(s.id))s.done=true;if(s.type==='badge'&&(G.badges||[]).includes(s.bid))s.got=true})}SC=def;DUO.at=null;cancelAnimationFrame(camRaf);camSet(0,0,1600);CAM.last=null;for(const k in ACT)delete ACT[k];$('#bgL').innerHTML=def.bg();$('#fxL').innerHTML='';$('#stage').style.background=def.color||'#92C3DB';drawSpots()}
function spot(id){return SC.spots.find(s=>s.id===id)}
function updateTask(){
  const p=$('#taskPill');if(!SC||!SC.inv){p.hidden=true;$('#deduceBtn').hidden=true;return}
  const need=SC.spots.filter(s=>s.need),d=need.filter(s=>s.done).length;
  const bs=SC.spots.filter(s=>s.type==='badge'),bg=bs.filter(s=>s.got).length;
  p.hidden=false;p.innerHTML=`${SC.inv.title}　破案進度 ${d}/${need.length}${bs.length?`　｜　骨頭徽章 ${bg}/${bs.length}`:''}<small>${d<need.length?'點「！」的人物問話，點黃色放大鏡調查':(bs.length&&bg<bs.length?'全部破解！推理前，還可以找找會搖來搖去的骨頭徽章':'全部破解！可以開始推理')}</small>`;
  $('#deduceBtn').hidden=!(d===need.length&&SC.inv.button);
}
$('#scene').addEventListener('click',async e=>{
  const g=e.target.closest('.spot');if(!g||!SC)return;
  const id=g.dataset.id;
  if(SC.mode){SC.mode(id,g);return}
  if(busy)return;
  if(!SC.inv)return;
  busy=true;$('#deduceBtn').hidden=true;
  try{
    if(id==='__duo')await duoHint();
    else{const sp=spot(id);
      if(sp.type==='badge'){sp.got=true;if(!G.badges.includes(sp.bid)){G.badges.push(sp.bid);save()}hud();sWin();toast('找到骨頭徽章！（'+G.badges.length+'/9）');drawSpots()}
      else if(sp.tap){CAM.subject=sp.id;await duoGo(sp);await sp.tap(sp);hideDlg()}
    }
  }finally{busy=false;CAM.subject=null;drawSpots();checkInv()}
});
let invResolve=null;
function investigate(title,{button=true}={}){SC.inv={title,button};drawSpots();return new Promise(r=>{invResolve=r;checkInv()})}
function checkInv(){if(!SC||!SC.inv||!invResolve)return;const need=SC.spots.filter(s=>s.need);
  if(need.every(s=>s.done)&&!SC.inv.button){const r=invResolve;invResolve=null;SC.inv=null;updateTask();r()}}
$('#deduceBtn').onclick=()=>{if(busy||!invResolve)return;const r=invResolve;invResolve=null;SC.inv=null;updateTask();r()};
async function duoHint(){
  const left=SC.spots.filter(s=>s.need&&!s.done);
  if(!left.length){const bl=SC.spots.filter(s=>s.type==='badge'&&!s.got);
    if(!bl.length){await say('duo','證物和骨頭徽章都找齊了，太厲害了！按右下角的「開始推理」吧。');return}
    await say('duo',`證物都找齊了！現場還藏著 ${bl.length} 個骨頭徽章，它們會偷偷搖來搖去。我幫你圈出一個！`);
    ring(bl[0].x,bl[0].y);return}
  const t=left[0];
  await say('duo',t.hint||'嗯……那邊好像還有線索，我們過去看看。');
  ring(t.x,t.type==='npc'?t.y-120*(t.s||1):t.y);
}
function ring(x,y){$('#fxL').innerHTML=`<circle class="pulse-ring" cx="${x}" cy="${y}" r="70" fill="none" stroke="#C86062" stroke-width="10"/>`;setTimeout(()=>{$('#fxL').innerHTML=''},2600)}
function addClue(t){if(!G.clues.includes(t)){G.clues.push(t);save()}toast('偵探筆記：新增線索！')}
function addFact(t){if(!G.facts.includes(t)){G.facts.push(t);save()}}
async function actorIn(id,look,x,y,s=1){ACT[id]=[x,y,240*s];const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('data-actor',id);g.innerHTML=`<g transform="translate(${x} ${y}) scale(${s})"><g class="breathe">${critter(look)}</g></g>`;g.style.transition='transform .6s';g.style.transform='translateY(-400px)';$('#spotL').appendChild(g);await sleep(30);g.style.transform='none';await sleep(600);return g}
async function actorOut(g,dx=0,dy=-700){for(const k in ACT)if(ACT[k])delete ACT[k];g.style.transition='transform 1.2s ease-in';g.style.transform=`translate(${dx}px,${dy}px)`;await sleep(1200);g.remove()}
