/* 案件系統：每一案有自己的存檔、章節、線索板、路線。新增案件＝在 CASES 加一筆＋寫 js/caseN.js 的 runN()。 */
"use strict";
/* =====================================================================
   CASE SYSTEM — every case has its own save, chapters, clue board and route.
   Add a new case by adding an entry to CASES and a runner function.
   ===================================================================== */
const FEATS2=[['鞋子 22 公分',/22 公分/],['左撇子',/左撇子|左手/],['背包掛燕子吊飾',/燕子吊飾/],['戴草帽',/草帽/],['手上沾著螢光',/螢光/]];
const CASES={
  1:{key:'duoshu-case1-v3',title:'第一案',name:'消失的台灣三寶',tabs:['','台北101','日月潭','安平古堡'],short:['','101','日月潭','安平'],
     chn:['序章','第一章','第二章','第三章','最終章','結局'],feats:()=>FEATS,route:['t101','sml','anping'],badges:9,quests:2,inv:[1,3],last:4},
  2:{key:'duoshu-case2-v1',title:'第二案',name:'怪盜X的魔術環島',tabs:['','野柳','九份','太魯閣','鹿野高台','墾丁'],short:['','野柳','九份','太魯閣','鹿野','墾丁'],
     chn:['序章','第一章','第二章','第三章','第四章','最終章','結局'],feats:()=>FEATS2,route:['yeliu','jiufen','taroko','luye','kenting'],badges:15,quests:5,inv:[1,5],last:5,wip:'製作中：目前可以玩序章和第一章「野柳」'},
  3:{soon:1,title:'第三案',name:'海的那一邊（離島篇）',teaser:'怪盜X丟下的魔術帽裡寫著：「下次，我要去海的那一邊……澎湖、綠島、蘭嶼，等著我吧！」'}
};
let CUR=1;const CASE=()=>CASES[CUR];
function useCase(n){CUR=n;KEY=CASES[n].key;ROUTE=CASES[n].route}
function loadCase(n){try{const v=JSON.parse(localStorage.getItem(CASES[n].key)||'null');return v&&typeof v.ch==='number'?v:null}catch(e){return null}}
function caseClears(n){const m=meta();if(n===1){let c=m.clears||0;const p=loadCase(1);if(!c&&p&&p.ch>=5)c=1;return c}return (m['c'+n]||0)}

/* ---------- case book on the title page ---------- */
function caseBook(){
  const cards=[1,2,3].map(n=>{const C=CASES[n];
    if(C.soon){const open=caseClears(2)>0;return `<div class="cbook soon"><div class="cbnum">${C.title}</div><b>${C.name}</b><p>${open?C.teaser:'破解第二案以後，就會知道怪盜X的下一站……'}</p><div class="cbstamp">敬請期待</div></div>`}
    const locked=n>1&&caseClears(n-1)===0,p=loadCase(n),cl=caseClears(n),inprog=p&&p.ch<=C.last;
    const st=locked?`破解${CASES[n-1].title}以後解鎖`:inprog?`進行中：${C.chn[p.ch]}${((p.done||{})[p.ch]||[]).length?`・已破解 ${(p.done||{})[p.ch].length} 關`:''}`:cl?`已破案 ${cl} 次`:'還沒開始';
    return `<div class="cbook${locked?' lock':''}" data-n="${n}"><div class="cbnum">${C.title}</div><b>${C.name}</b><p>${st}</p>${C.wip&&!locked?`<p class="cbwip">${C.wip}</p>`:''}
      ${locked?'<div class="cbstamp">🔒</div>':`<div class="row" style="gap:8px">${inprog?`<button class="btn c" data-go="res">繼續辦案</button><button class="btn w" data-go="new">重新開始</button>`:`<button class="btn c" data-go="new">${cl?'再辦一次':'開始辦案'}</button>`}</div>`}
      ${cl&&!locked?'<div class="cbstamp ok">破案</div>':''}</div>`}).join('');
  modal(`<div class="card" style="width:min(1060px,100%)"><h3>偵探多叔的案件簿</h3><p class="lead">選一個案件開始調查。每個案件都有自己的存檔，不會互相影響。</p><div class="cbooks">${cards}</div>
    <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn w" id="cbClose">關閉</button></div></div>`,b=>{
    b.querySelector('#cbClose').onclick=closeModal;
    b.querySelector('.cbooks').onclick=e=>{const btn=e.target.closest('[data-go]');if(!btn)return;const n=+btn.closest('[data-n]').dataset.n;
      const go=()=>{closeModal();startCase(n,btn.dataset.go==='res')};
      if(btn.dataset.go==='new'&&loadCase(n)&&loadCase(n).ch<=CASES[n].last){
        modal(`<div class="card" style="width:min(500px,100%)"><h3>要重新開始嗎？</h3><p class="lead">${CASES[n].title}上次存好的進度，會被新的冒險取代。</p><div class="row" style="justify-content:flex-end;gap:10px"><button class="btn w" id="ngNo">回去</button><button class="btn c" id="ngYes">重新開始</button></div></div>`,bb=>{bb.querySelector('#ngYes').onclick=go;bb.querySelector('#ngNo').onclick=caseBook})}
      else go()};
  });
}
function startCase(n,resume){
  useCase(n);const p=loadCase(n);const nm=$('#pname').value.trim();
  if(resume&&p){G=Object.assign({},p);G.av={...AV};G.name=nm||p.name||'小偵探';G.done=G.done||{}}
  else G={av:{...AV},name:nm||'小偵探',level:'hard',energy:5,badges:[],quests:[],clues:[],facts:[],ch:0,round:n===1?caseClears(1):caseClears(n),cs:n};
  save();tone([392,523,659],.1);$('#title').hidden=true;hud();
  if(resume&&p)toast('讀取存檔成功！歡迎回來，'+G.name);
  if(n===1)run(resume&&p?p.ch:0);else run2(resume&&p?p.ch:0);
}

