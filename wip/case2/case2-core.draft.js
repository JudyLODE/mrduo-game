/* =====================================================================
   CASE SYSTEM — every case has its own save, chapters, clue board and route.
   Add a new case by adding an entry to CASES and a runner function.
   ===================================================================== */
const FEATS2=[['鞋子 22 公分',/22 公分/],['左撇子',/左撇子|左手/],['背包掛燕子吊飾',/燕子吊飾/],['戴草帽',/草帽/],['手上沾著螢光',/螢光/]];
const CASES={
  1:{key:'duoshu-case1-v3',title:'第一案',name:'消失的台灣三寶',tabs:['','台北101','日月潭','安平古堡'],short:['','101','日月潭','安平'],
     chn:['序章','第一章','第二章','第三章','最終章','結局'],feats:()=>FEATS,route:['t101','sml','anping'],badges:9,quests:2,inv:[1,3],last:4},
  2:{key:'duoshu-case2-v1',title:'第二案',name:'怪盜X的魔術環島',tabs:['','野柳','九份','太魯閣','鹿野高台','墾丁'],short:['','野柳','九份','太魯閣','鹿野','墾丁'],
     chn:['序章','第一章','第二章','第三章','第四章','最終章','結局'],feats:()=>FEATS2,route:['yeliu','jiufen','taroko','luye','kenting'],badges:15,quests:5,inv:[1,5],last:5},
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
    return `<div class="cbook${locked?' lock':''}" data-n="${n}"><div class="cbnum">${C.title}</div><b>${C.name}</b><p>${st}</p>
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

/* ---------- new animals ---------- */
Object.assign(KINDS,{
  crab:{fur:'#DE8A6C',m:'#F6D9C9',ears:'stalk',shell:1},
  dolphin:{fur:'#EBC9CF',m:'#F8EBEE',ears:'none',rostrum:1},
  tabby:{fur:'#D7A56E',m:'#FAF1E4',ears:'point',stripes:1},
  heron:{fur:'#8B6C55',ears:'none',beak:'#4B4B52',crest:'#2E2B33'},
  macaque:{fur:'#9C8B7B',m:'#E7B3A8',ears:'side',face:1},
  swallow:{fur:'#34405F',m:'#F4EEE6',ears:'none',beak:'#3A3A40',crest:'#C86062'},
  serow:{fur:'#5D4C42',m:'#CDBBA9',ears:'horn'},
  pheasant:{fur:'#384670',ears:'none',beak:'#E1D2A0',wattle:1},
  gull:{fur:'#F2F2F2',m:'#FFFFFF',ears:'none',beak:'#E2B044'},
  seaturtle:{fur:'#7FA88A',ears:'none',shell:1}
});
Object.assign(CAST,{
  pango2:{name:'小穿山甲（見習夥伴）',look:{k:'pangolin',shirt:'#8DB36E',top:'scarf'}},
  dolphin:{name:'白海豚館長',look:{k:'dolphin',shirt:'#5B84AB',top:'badge'}},
  crab:{name:'寄居蟹小哥（冰沙攤）',look:{k:'crab',shirt:'#D4BB49',top:'apron'}},
  gull:{name:'海鷗遊客',look:{k:'gull',shirt:'#92C3DB',hat:{t:'cap',c:'#D29841'}}},
  tabby:{name:'虎斑貓婆婆（芋圓店）',look:{k:'tabby',shirt:'#7E5FA3',top:'apron'}},
  heron:{name:'黑冠麻鷺先生（茶樓）',look:{k:'heron',shirt:'#5D7A5A',top:'vest'}},
  macaque:{name:'台灣獼猴巡山員',look:{k:'macaque',shirt:'#6F8A57',hat:{t:'cap',c:'#6F8A57'},top:'badge'}},
  swallow:{name:'燕子小姐（步道導覽）',look:{k:'swallow',shirt:'#F7F0DE',top:'scarf'}},
  serow:{name:'長鬃山羊機長',look:{k:'serow',shirt:'#B37944',hat:{t:'cap',c:'#B37944'}}},
  pheasant:{name:'帝雉姊姊（嘉年華主持人）',look:{k:'pheasant',shirt:'#C86062',hat:{t:'bow',c:'#D4BB49'}}},
  seaturtle:{name:'綠蠵龜燈塔守護員',look:{k:'seaturtle',shirt:'#42507C',hat:{t:'captain'}}},
  x2:{name:'魔術師怪盜X',look:{k:'xfox',shirt:'#3D3E52',hat:{t:'top',c:'#303040'},mask:1,cape:'#7E5FA3'},cls:'x'},
  sdeer:{name:'梅花鹿導覽員？',look:{k:'deer',shirt:'#F7F0DE',top:'vest',hat:{t:'cap',c:'#D29841'}}}
});
const X2_LOOK=CAST.x2.look;
Object.assign(PLACES,{
  jiufen:{n:'九份',c:[121.84,25.11],city:'新北市',f:'九份是山城，以前因為挖金礦而熱鬧，老街上掛滿紅燈籠。'},
  luye:{n:'鹿野高台',c:[121.13,22.91],city:'台東縣',f:'鹿野高台每年夏天舉辦熱氣球嘉年華，可以看到花東縱谷。'}
});

/* ---------- scenes ---------- */
const OL='#2E384F';
function bgYeliu(){return `<rect width="1600" height="1000" fill="#CFE3EC"/>
  <circle cx="1380" cy="150" r="70" fill="#F4E3A1"/>
  <rect y="420" width="1600" height="260" fill="#7FB3CC"/>
  <g stroke="#A9CFDF" stroke-width="5" fill="none">${[460,520,590,640].map((y,i)=>`<path d="M${i*90} ${y} q40 -14 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0"/>`).join('')}</g>
  <path d="M0 640 Q300 600 620 640 Q900 610 1200 650 Q1420 630 1600 650 V1000 H0Z" fill="#D9C7A3" stroke="${OL}" stroke-width="6"/>
  <path d="M0 760 Q400 730 800 770 T1600 760 V1000 H0Z" fill="#E6D6B4"/>
  <!-- queen's head rock -->
  <g transform="translate(560 650)"><path d="M-70 0 Q-60 -90 -18 -140 Q-30 -170 -10 -210 Q20 -260 70 -250 Q118 -236 110 -196 Q102 -168 72 -170 Q62 -150 40 -148 Q30 -100 60 0Z" fill="#C9A77E" stroke="${OL}" stroke-width="6"/>
    <path d="M-6 -200 Q30 -232 76 -222" stroke="#A88861" stroke-width="5" fill="none"/><path d="M-40 -60 Q0 -70 30 -60" stroke="#A88861" stroke-width="5" fill="none"/></g>
  <!-- mushroom rocks -->
  ${[[240,660,1],[340,690,.75],[860,690,.85],[960,660,.6]].map(([x,y,s])=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-26 0 Q-30 -60 -18 -80 H18 Q30 -60 26 0Z" fill="#BFA07A" stroke="${OL}" stroke-width="6"/><ellipse cx="0" cy="-96" rx="66" ry="40" fill="#CDB08A" stroke="${OL}" stroke-width="6"/><circle cx="-20" cy="-100" r="7" fill="#A88861"/><circle cx="14" cy="-88" r="9" fill="#A88861"/></g>`).join('')}
  <!-- honeycomb rock -->
  <g transform="translate(1150 700)"><path d="M-110 0 Q-120 -90 -40 -120 Q60 -140 110 -80 Q130 -30 110 0Z" fill="#C2A47F" stroke="${OL}" stroke-width="6"/>${[[-70,-60],[-40,-90],[-10,-60],[20,-95],[50,-62],[80,-40],[-80,-24],[-20,-26],[40,-22]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="14" ry="11" fill="#9E8263"/>`).join('')}</g>
  <!-- visitor centre -->
  <g transform="translate(0 330)"><rect x="20" y="0" width="200" height="330" fill="#F2EBDD" stroke="${OL}" stroke-width="6"/><path d="M0 0 L120 -60 L240 0Z" fill="#5B84AB" stroke="${OL}" stroke-width="6"/><rect x="60" y="60" width="120" height="80" fill="#BFD9E6" stroke="${OL}" stroke-width="5"/><rect x="90" y="220" width="60" height="110" fill="#8E7558" stroke="${OL}" stroke-width="5"/><rect x="40" y="160" width="160" height="34" rx="6" fill="#FFFFFF" stroke="${OL}" stroke-width="4"/><text x="120" y="185" text-anchor="middle" font-size="20" font-weight="900" fill="${OL}">遊客中心</text></g>
  <!-- smoothie stand -->
  <g transform="translate(1330 470)"><rect x="0" y="80" width="240" height="190" fill="#F7F0E1" stroke="${OL}" stroke-width="6"/><path d="M-20 80 L20 0 H220 L260 80Z" fill="#C86062" stroke="${OL}" stroke-width="6"/><path d="M20 0 L40 80 M80 0 L90 80 M140 0 L140 80 M200 0 L190 80" stroke="#F7F0E1" stroke-width="10"/><rect x="40" y="100" width="160" height="40" rx="8" fill="#FFFFFF" stroke="${OL}" stroke-width="4"/><text x="120" y="128" text-anchor="middle" font-size="22" font-weight="900" fill="${OL}">冰沙</text></g>`}
function bgJiufen(){let s=`<rect width="1600" height="1000" fill="#EBC9A6"/><circle cx="260" cy="170" r="80" fill="#F2DDA0"/>
  <path d="M0 330 Q300 220 640 300 Q900 200 1200 290 Q1420 240 1600 280 V520 H0Z" fill="#9AA889"/>
  <path d="M0 420 Q400 360 800 420 T1600 400 V520 H0Z" fill="#8FA2B3"/>`;
  // houses left & right
  [[0,360,260],[230,400,230],[1150,380,230],[1360,350,240]].forEach(([x,y,w],i)=>{s+=`<g transform="translate(${x} ${y})"><rect width="${w}" height="${1000-y}" fill="${['#B88A6A','#A07A5E','#B98F72','#A4775B'][i]}" stroke="${OL}" stroke-width="6"/><path d="M-14 0 H${w+14} L${w-10} -44 H10Z" fill="#4E4A52" stroke="${OL}" stroke-width="6"/>${[0,1].map(k=>`<rect x="${30+k*(w/2)}" y="60" width="${w/3}" height="90" fill="#F2DDA0" stroke="${OL}" stroke-width="5"/>`).join('')}</g>`});
  // staircase in the middle
  s+=`<path d="M470 1000 L640 470 H960 L1130 1000Z" fill="#B9A58C" stroke="${OL}" stroke-width="6"/>`;
  for(let k=0;k<12;k++){const y=470+k*45,w=320+k*30;s+=`<line x1="${800-w/2}" y1="${y}" x2="${800+w/2}" y2="${y}" stroke="#9C8870" stroke-width="5"/>`}
  // lantern strings
  s+=[150,250].map((y,j)=>`<path d="M0 ${y} Q800 ${y+80} 1600 ${y}" stroke="${OL}" stroke-width="3" fill="none"/>`+Array.from({length:11},(_,i)=>{const x=80+i*145,yy=y+Math.sin(i/10*Math.PI)*70+20;return `<g transform="translate(${x} ${yy})"><rect x="-4" y="-30" width="8" height="10" fill="${OL}"/><ellipse rx="26" ry="32" fill="#C86062" stroke="${OL}" stroke-width="4"/><path d="M-26 0 H26" stroke="#E5C35A" stroke-width="3"/></g>`}).join('')).join('');
  // taro shop sign + teahouse sign
  s+=`<g transform="translate(40 560)"><rect width="200" height="56" rx="8" fill="#7E5FA3" stroke="${OL}" stroke-width="5"/><text x="100" y="38" text-anchor="middle" font-size="28" font-weight="900" fill="#fff">芋圓店</text></g>
  <g transform="translate(1360 560)"><rect width="200" height="56" rx="8" fill="#5D7A5A" stroke="${OL}" stroke-width="5"/><text x="100" y="38" text-anchor="middle" font-size="28" font-weight="900" fill="#fff">茶樓</text></g>`;
  return s}
function bgTaroko(){return `<rect width="1600" height="1000" fill="#BFD9E6"/>
  <path d="M0 0 H520 Q470 200 520 380 Q450 560 520 760 L420 1000 H0Z" fill="#DADCDA" stroke="${OL}" stroke-width="6"/>
  <path d="M1600 0 H1080 Q1140 220 1060 420 Q1150 600 1080 800 L1180 1000 H1600Z" fill="#D0D3D1" stroke="${OL}" stroke-width="6"/>
  <g stroke="#B9BCBA" stroke-width="6" fill="none">${[120,260,400,560,700].map(y=>`<path d="M0 ${y} Q260 ${y-30} 500 ${y+10}"/><path d="M1100 ${y+20} Q1350 ${y-20} 1600 ${y+10}"/>`).join('')}</g>
  ${[[150,330],[300,500],[1300,300],[1420,520],[1220,640]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="34" ry="24" fill="#6E6F72" stroke="${OL}" stroke-width="4"/>`).join('')}
  <!-- river -->
  <path d="M520 760 Q800 720 1080 800 L1180 1000 H420Z" fill="#7FB3CC" stroke="${OL}" stroke-width="6"/>
  <g stroke="#A9CFDF" stroke-width="5" fill="none"><path d="M560 860 q30 -10 60 0 t60 0"/><path d="M820 900 q30 -10 60 0 t60 0"/><path d="M950 830 q30 -10 60 0 t60 0"/></g>
  <!-- suspension bridge -->
  <path d="M380 300 Q800 420 1220 300" stroke="#B5432F" stroke-width="12" fill="none"/><path d="M380 300 Q800 470 1220 300" stroke="#8C6A4E" stroke-width="10" fill="none"/>
  ${Array.from({length:15},(_,i)=>{const x=440+i*50,t=(x-380)/840,y1=300+Math.sin(t*Math.PI)*90,y2=300+Math.sin(t*Math.PI)*150;return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#B5432F" stroke-width="3"/>`}).join('')}
  <!-- trail ledge and hut -->
  <path d="M0 760 Q300 740 600 770 L560 1000 H0Z" fill="#B7A288" stroke="${OL}" stroke-width="6"/>
  <path d="M1040 780 Q1300 750 1600 770 V1000 H1100Z" fill="#B7A288" stroke="${OL}" stroke-width="6"/>
  <g transform="translate(1340 560)"><rect width="220" height="200" fill="#A57E5E" stroke="${OL}" stroke-width="6"/><path d="M-20 0 L110 -70 L240 0Z" fill="#6A8C5C" stroke="${OL}" stroke-width="6"/><rect x="80" y="100" width="60" height="100" fill="#6B523D" stroke="${OL}" stroke-width="4"/><rect x="20" y="40" width="180" height="40" rx="6" fill="#FFFFFF" stroke="${OL}" stroke-width="4"/><text x="110" y="68" text-anchor="middle" font-size="22" font-weight="900" fill="${OL}">步道小屋</text></g>
  ${[[700,150],[860,110],[960,190],[640,230]].map(([x,y])=>`<path d="M${x-24} ${y} q12 -14 24 0 q12 -14 24 0" stroke="${OL}" stroke-width="5" fill="none"/>`).join('')}`}
function bgLuye(){const bal=(x,y,s,c1,c2)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -150 C-110 -150 -110 -10 -30 40 H30 C110 -10 110 -150 0 -150Z" fill="${c1}" stroke="${OL}" stroke-width="6"/><path d="M0 -150 C-40 -150 -40 -10 -12 40 H12 C40 -10 40 -150 0 -150Z" fill="${c2}"/><path d="M-28 40 L-20 80 M28 40 L20 80" stroke="${OL}" stroke-width="4"/><rect x="-24" y="80" width="48" height="36" rx="6" fill="#A57E5E" stroke="${OL}" stroke-width="5"/></g>`;
  return `<rect width="1600" height="1000" fill="#C6E0EC"/>
  <path d="M0 470 Q200 330 420 420 Q640 300 900 400 Q1150 290 1400 390 Q1500 350 1600 380 V620 H0Z" fill="#8FA88A"/>
  <path d="M0 560 H1600 V660 H0Z" fill="#B9C98C"/>${Array.from({length:16},(_,i)=>`<line x1="${i*100}" y1="560" x2="${i*100+40}" y2="660" stroke="#A3B677" stroke-width="4"/>`).join('')}
  <path d="M0 640 Q800 600 1600 640 V1000 H0Z" fill="#9DBE7A" stroke="${OL}" stroke-width="6"/>
  ${bal(260,250,.9,'#C86062','#D4BB49')+bal(1200,200,.7,'#5B84AB','#F7F0E1')+bal(820,150,.55,'#8DB36E','#F7F0E1')+bal(1450,330,.6,'#7E5FA3','#D4BB49')}
  <!-- stage -->
  <g transform="translate(40 560)"><rect width="330" height="110" fill="#A57E5E" stroke="${OL}" stroke-width="6"/><rect x="0" y="-150" width="330" height="20" fill="#C86062" stroke="${OL}" stroke-width="5"/><line x1="10" y1="-130" x2="10" y2="0" stroke="${OL}" stroke-width="8"/><line x1="320" y1="-130" x2="320" y2="0" stroke="${OL}" stroke-width="8"/><text x="165" y="-112" text-anchor="middle" font-size="22" font-weight="900" fill="#fff">熱氣球嘉年華</text></g>
  <!-- science tent -->
  <g transform="translate(1290 560)"><path d="M0 120 L140 -40 L280 120Z" fill="#F7F0E1" stroke="${OL}" stroke-width="6"/><path d="M140 -40 L100 120 M140 -40 L180 120" stroke="#5B84AB" stroke-width="10"/><text x="140" y="100" text-anchor="middle" font-size="20" font-weight="900" fill="${OL}">科學帳篷</text></g>`}
function bgKenting(){return `<rect width="1600" height="1000" fill="#2F3858"/>
  ${Array.from({length:40},(_,i)=>`<circle cx="${(i*197)%1600}" cy="${(i*83)%380}" r="${i%3?2.5:4}" fill="#F7F0DE"/>`).join('')}
  <circle cx="1400" cy="120" r="50" fill="#F2E6B8"/><circle cx="1418" cy="108" r="46" fill="#2F3858"/>
  <rect y="430" width="1600" height="260" fill="#3E5A7A"/>
  <g stroke="#56769A" stroke-width="5" fill="none">${[470,540,610].map(y=>`<path d="M0 ${y} q50 -14 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0"/>`).join('')}</g>
  <path d="M0 660 Q400 630 800 660 T1600 650 V1000 H0Z" fill="#C9B48E" stroke="${OL}" stroke-width="6"/>
  <!-- lighthouse -->
  <g transform="translate(200 660)"><path d="M-60 0 L-40 -420 H40 L60 0Z" fill="#F4F1E8" stroke="${OL}" stroke-width="6"/><rect x="-52" y="-470" width="104" height="50" fill="#3B3F4F" stroke="${OL}" stroke-width="6"/><path d="M-40 -470 Q0 -520 40 -470Z" fill="#3B3F4F" stroke="${OL}" stroke-width="6"/><rect x="-30" y="-462" width="60" height="34" fill="#F2E6B8"/><rect x="-18" y="-80" width="36" height="80" fill="#6B523D"/></g>
  <path d="M230 -10" />
  <!-- dock -->
  <g transform="translate(1180 620)"><rect width="420" height="30" fill="#8C6A4E" stroke="${OL}" stroke-width="5"/>${[20,120,220,320,400].map(x=>`<rect x="${x}" y="30" width="16" height="90" fill="#6B523D"/>`).join('')}</g>`}
function lightBeam(on){return on?`<path d="M232 210 L900 120 L900 300Z" fill="#F2E6B8" opacity=".25"/>`:''}
