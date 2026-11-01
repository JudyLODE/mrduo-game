/* 第二案的新玩法元件（和第一案不重複）。
   每個元件：回傳 Promise；用 g2() 開視窗；過關呼叫 api.ok()；答錯 api.no() 不扣分；
   一定要用 api.solve(fn) 提供「解題掛勾」給自動測試。 */
"use strict";
const T2=[];function clearT2(){T2.splice(0).forEach(t=>{clearInterval(t);clearTimeout(t);cancelAnimationFrame(t)})}
function g2(title,duo,inner,bind,w=900){return new Promise(res=>{
  modal(`<div class="card g2" data-duo="${duo}" style="width:min(${w}px,100%)"><h3>${title}</h3>${inner}<div class="fb" id="gF"></div></div>`,b=>{
    const q=s=>b.querySelector(s),qa=s=>[...b.querySelectorAll(s)];let over=false;
    const api={b,q,qa,
      ok(msg,ms=1600){if(over)return;over=true;window.__solve=null;clearT2();sWin();const f=q('#gF');f.className='fb ok';f.innerHTML=msg||'成功！';lockFor(()=>{closeModal();res()},ms)},
      no(msg){sBad();const f=q('#gF');f.className='fb no';f.innerHTML=msg||'再試試看！'},
      say(msg,cls=''){const f=q('#gF');f.className='fb '+cls;f.innerHTML=msg},
      solve(fn){window.__solve=fn},over:()=>over};
    bind(api)})})}
const svgPt=(svg,e)=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const r=p.matrixTransform(svg.getScreenCTM().inverse());return {x:r.x,y:r.y}};
const fire=(el,type='click')=>el&&el.dispatchEvent(new MouseEvent(type,{bubbles:true}));
const ico=(t,s=40)=>`<span class="ico" style="font-size:${s}px">${t}</span>`;

/* ---------- 鏡子密信：把鏡子放對位置，再從信裡點出關鍵詞 ---------- */
function mirrorRead(title,text,tasks){return g2(title,'think',`
  <p class="lead">信上的字全是反的！把鏡子放到信的旁邊，從鏡子裡讀讀看。</p>
  <div class="mirwrap"><div class="mirletter"><div class="mirtext rev">${text.replace(/\n/g,'<br>')}</div></div>
    <div class="mirslot" id="mSide"><span>放在信的<b>旁邊</b></span></div></div>
  <div class="row"><button class="btn w" id="mTop">把鏡子放在信的上面</button><button class="btn c" id="mPut">把鏡子放在信的旁邊</button></div>
  <div class="story" id="mQ" hidden></div>`,api=>{const {q}=api;let k=0;
    const words=text.replace(/\n/g,'<br>');
    q('#mTop').onclick=()=>{q('.mirtext').className='mirtext rev flip';api.no('鏡子放在上面，字變成上下顛倒了。鏡子要放在字的「旁邊」！')};
    const reveal=()=>{sGood();q('.mirwrap').classList.add('on');q('#mSide').innerHTML=`<div class="mirtext">${tasks.reduce((t,x)=>t.replace(x.w,`<button class="kw" data-w="${x.w}">${x.w}</button>`),words)}</div>`;
      q('#mTop').hidden=q('#mPut').hidden=true;ask()};
    const ask=()=>{q('#mQ').hidden=false;q('#mQ').innerHTML=`第 ${k+1} 題：${tasks[k].q}<br><small>在鏡子裡的信上，點出答案的字。</small>`};
    q('#mPut').onclick=reveal;
    q('#mSide').onclick=e=>{const w=e.target.closest('.kw');if(!w)return;
      if(w.dataset.w===tasks[k].w){sGood();w.classList.add('got');k++;if(k>=tasks.length)api.ok('全部讀懂了！');else ask()}
      else api.no('不是這個，再讀一次題目。')};
    api.solve(()=>{if(!q('.mirwrap').classList.contains('on'))reveal();for(const t of tasks.slice(k))fire(q(`.kw[data-w="${t.w}"]`))});
  },860)}

/* ---------- 找不同 ---------- */
function spotDiff(title,lead,draw,diffs,vb='0 0 600 400'){return g2(title,'hmm',`<p class="lead">${lead}</p>
  <div class="sdwrap"><div><small>魔術前</small>${SV(vb,draw(false),330)}</div><div><small>魔術後（點這張）</small><svg id="sdB" viewBox="${vb}" style="width:100%;max-height:330px;display:block">${draw(true)}<g id="sdM"></g></svg></div></div>
  <div class="row"><span class="pill" id="sdN">找到 0 / ${diffs.length}</span></div>`,api=>{const {q}=api;const got=new Set();let miss=0;
    const mark=i=>{got.add(i);const d=diffs[i];q('#sdM').innerHTML+=`<circle cx="${d.x}" cy="${d.y}" r="${d.r}" fill="none" stroke="#C86062" stroke-width="6"/>`;q('#sdN').textContent=`找到 ${got.size} / ${diffs.length}`;sGood();
      api.say(`找到了：${d.l}`,'ok');if(got.size===diffs.length)api.ok('5 個不同全部找到了！')};
    q('#sdB').onclick=e=>{const p=svgPt(q('#sdB'),e);const i=diffs.findIndex((d,k)=>!got.has(k)&&Math.hypot(d.x-p.x,d.y-p.y)<d.r+14);
      if(i>=0)mark(i);else{miss++;tone([300],.05,'square',.05);if(miss>=3){const j=diffs.findIndex((d,k)=>!got.has(k));const d=diffs[j];q('#sdM').innerHTML+=`<circle class="blink" cx="${d.x}" cy="${d.y}" r="${d.r+8}" fill="#E8E19E" opacity=".5"/>`;miss=0;api.say('多叔：看看發亮的地方！')}}};
    api.solve(()=>diffs.forEach((d,i)=>{if(!got.has(i))mark(i)}));
  },980)}

/* ---------- 撥時鐘：拖動長針（短針會跟著走），撥到正確時間 ---------- */
function clockSet(title,items){return g2(title,'think',`<div class="mgrid" style="align-items:center"><div><svg id="ck" viewBox="-160 -160 320 320" style="width:100%;max-height:360px;touch-action:none"></svg>
  <div class="row" style="justify-content:center"><button class="tool" id="hM">短針 −1 小時</button><button class="tool" id="hP">短針 ＋1 小時</button></div></div>
  <div><div class="story" id="ckQ"></div><div class="row" style="margin-top:10px"><span class="pill" id="ckT"></span><button class="btn c" id="ckOk">撥好了</button></div><div class="locks" id="ckL">${items.map(()=>'<i>？</i>').join('')}</div></div></div>`,api=>{
    const {q}=api;let i=0,t=180,drag=false;
    const draw=()=>{const m=t%60,h=Math.floor(t/60)%12;let s=`<circle r="150" fill="#FFFFFF" stroke="${INK}" stroke-width="8"/>`;
      for(let k=1;k<=12;k++){const a=deg(k*30-90);s+=`<text x="${Math.cos(a)*118}" y="${Math.sin(a)*118+11}" text-anchor="middle" font-size="30" font-weight="700" fill="${INK}" font-family="Fredoka,sans-serif">${k}</text>`}
      for(let k=0;k<60;k++){const a=deg(k*6-90),r1=k%5?142:134;s+=`<line x1="${Math.cos(a)*r1}" y1="${Math.sin(a)*r1}" x2="${Math.cos(a)*148}" y2="${Math.sin(a)*148}" stroke="${INK}" stroke-width="${k%5?2:4}"/>`}
      const ha=deg((h+m/60)*30-90),ma=deg(m*6-90);
      s+=`<line x1="0" y1="0" x2="${Math.cos(ha)*70}" y2="${Math.sin(ha)*70}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><line x1="0" y1="0" x2="${Math.cos(ma)*112}" y2="${Math.sin(ma)*112}" stroke="#C86062" stroke-width="7" stroke-linecap="round"/><circle cx="${Math.cos(ma)*112}" cy="${Math.sin(ma)*112}" r="16" fill="#C86062" opacity=".35"/><circle r="9" fill="${INK}"/>`;
      q('#ck').innerHTML=s;const hh=Math.floor(t/60)%12||12;q('#ckT').textContent='現在撥到：'+hh+' 點 '+m+' 分'};
    const show=()=>{if(i>=items.length)return;q('#ckQ').innerHTML=items[i].q;api.say('拖動<b style="color:#C86062">紅色的長針</b>，短針會跟著走。')};
    const ang=e=>{const p=svgPt(q('#ck'),e);let a=Math.atan2(p.y,p.x)*180/Math.PI+90;if(a<0)a+=360;return Math.round(a/6/5)*5%60};
    q('#ck').addEventListener('pointerdown',e=>{drag=true;q('#ck').setPointerCapture(e.pointerId)});
    q('#ck').addEventListener('pointermove',e=>{if(!drag)return;const m=ang(e),om=t%60;let base=t-om;if(om>=45&&m<15)base+=60;else if(om<15&&m>=45)base-=60;t=(base+m+720)%720;draw()});
    q('#ck').addEventListener('pointerup',()=>drag=false);
    q('#hM').onclick=()=>{t=(t-60+720)%720;draw()};q('#hP').onclick=()=>{t=(t+60)%720;draw()};
    q('#ckOk').onclick=()=>{const it=items[i];if(t%720===(it.h%12)*60+it.m){tick(api.b,i);q('#ckL').children[i].className='on';q('#ckL').children[i].textContent='✓';sGood();i++;
        if(i>=items.length)api.ok(items[items.length-1].ex||'時間全部撥對了！');else{api.say(it.ex||'答對了！','ok');lockFor(show,1200)}}
      else api.no(it.hint||'再算一次時間。')};
    show();draw();
    api.solve(()=>{for(const it of items.slice(i)){t=(it.h%12)*60+it.m;fire(q('#ckOk'))}});
  },940)}

/* ---------- 證詞對質：選一張證物，點出和證物矛盾的那一句 ---------- */
function testimony(title,lines,cards,lie,need,okMsg){return g2(title,'hmm',`<p class="lead">先點一張證物卡，再點和證物<b>不一樣</b>的那一句話。</p>
  <div class="tsgrid"><div class="tslines">${lines.map((l,i)=>`<button class="tsl" data-i="${i}"><span class="tsw">${head(CAST[l[0]].look)}</span><span><small>${CAST[l[0]].name}</small>${l[1]}</span></button>`).join('')}</div>
  <div class="tscards">${cards.map((c,i)=>`<button class="tsc" data-c="${i}">${ico(c[0],34)}<b>${c[1]}</b></button>`).join('')}</div></div>`,api=>{
    const {q,qa}=api;let pick=null,miss=0;
    q('.tscards').onclick=e=>{const c=e.target.closest('.tsc');if(!c)return;pick=+c.dataset.c;qa('.tsc').forEach(x=>x.classList.toggle('on',x===c));sPop()};
    q('.tslines').onclick=e=>{const l=e.target.closest('.tsl');if(!l)return;if(pick===null){api.say('先點右邊的一張證物卡！');return}
      if(+l.dataset.i===lie&&pick===need){l.classList.add('lie');api.ok(okMsg,2200)}
      else{miss++;shake(l);api.no(miss>=2?'那一句會發亮，再看看證物卡。':'這句話和這張證物沒有矛盾，再想想。');if(miss>=2)q(`.tsl[data-i="${lie}"]`).classList.add('hint')}};
    api.solve(()=>{fire(q(`.tsc[data-c="${need}"]`));fire(q(`.tsl[data-i="${lie}"]`))});
  },960)}

/* ---------- 化學實驗台：預測 → 放材料 → 動手做 → 看結果 → 對照預測 ---------- */
function labBench(c){return g2(c.title,'think',`<div class="labstep" id="lbS"></div><div class="labgrid"><svg id="lbV" viewBox="0 0 900 380" style="width:100%;max-height:340px;touch-action:none"></svg><div class="labtray" id="lbT"></div></div>
  <div class="row" id="lbR"></div>`,api=>{const {q}=api;
    const st={phase:'predict',guess:null,need:c.place.map(p=>p.slice()),put:[],sel:null,cups:c.cups.map(x=>({label:x.label,items:[],color:x.color||'#D9EEF5'})),prog:0,done:false};
    const cx=i=>150+i*(600/(c.cups.length-1||1));
    const drawCups=()=>{let s=`<rect x="0" y="300" width="900" height="80" fill="#C9A878"/>`;
      st.cups.forEach((u,i)=>{const x=cx(i),fin=st.done&&c.cups[i].res;const col=fin&&fin.color||u.color;
        s+=`<g data-cup="${i}" style="cursor:pointer"><path d="M${x-80} 120 L${x-62} 300 H${x+62} L${x+80} 120Z" fill="#FFFFFF" fill-opacity=".55" stroke="${INK}" stroke-width="6"/>
        <path d="M${x-72} ${170} L${x-60} 296 H${x+60} L${x+72} 170Z" fill="${col}"/>
        ${u.items.map((t,k)=>`<text x="${x-40+(k%3)*40}" y="${210+Math.floor(k/3)*42}" text-anchor="middle" font-size="34">${t}</text>`).join('')}
        ${fin&&fin.fx==='ice'?Array.from({length:14},(_,k)=>`<path d="M${x-55+(k*37)%110} ${190+(k*23)%90} l8 -8 l8 8 l-8 8z" fill="#FFFFFF" stroke="#BFD9E6" stroke-width="2"/>`).join(''):''}
        ${fin&&fin.fx==='few'?Array.from({length:4},(_,k)=>`<path d="M${x-40+k*26} ${200+(k%2)*30} l6 -6 l6 6 l-6 6z" fill="#FFFFFF"/>`).join(''):''}
        ${fin&&fin.fx==='bubbles'?Array.from({length:12},(_,k)=>`<circle class="bub" style="animation-delay:${k*.15}s" cx="${x-50+(k*29)%100}" cy="${280-(k*17)%90}" r="${5+k%4}" fill="none" stroke="#FFFFFF" stroke-width="3"/>`).join(''):''}
        ${fin&&fin.fx==='glow'?`<circle cx="${x}" cy="230" r="70" fill="#E8F59A" opacity=".55"/>`:''}
        <rect x="${x-70}" y="318" width="140" height="44" rx="10" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/><text x="${x}" y="349" text-anchor="middle" font-size="24" font-weight="900" fill="${INK}">${u.label}</text>
        ${fin&&fin.tag?`<text x="${x}" y="105" text-anchor="middle" font-size="26" font-weight="900" fill="${INK}">${fin.tag}</text>`:''}</g>`});
      if(st.phase==='stir')s+=`<rect x="20" y="20" width="${860*Math.min(1,st.prog)}" height="16" rx="8" fill="#8DB36E"/><rect x="20" y="20" width="860" height="16" rx="8" fill="none" stroke="${INK}" stroke-width="3"/>`;
      q('#lbV').innerHTML=s};
    const step=(t)=>q('#lbS').innerHTML=t;
    const predict=()=>{step(`<b>① 先猜猜看</b>　${c.predict.q}<small>猜錯也沒關係，科學家也常常猜錯。</small>`);
      q('#lbT').innerHTML=c.predict.o.map((o,i)=>`<button class="btn w" data-g="${i}">${o}</button>`).join('');drawCups()};
    const setup=()=>{st.phase='setup';step(`<b>② 放材料</b>　${c.setupTip}<small>先點右邊的材料，再點杯子。放錯了？點杯子裡的東西就能拿回來。</small>`);
      q('#lbT').innerHTML=c.tray.map(t=>`<button class="labitem" data-t="${t[0]}">${ico(t[1],34)}<span>${t[2]}</span></button>`).join('');drawCups()};
    const act=()=>{st.phase='stir';st.prog=0;step(`<b>③ 動手做</b>　${c.act}`);q('#lbT').innerHTML=c.actBtn?`<button class="btn c" id="lbH">${c.actBtn}</button>`:'';drawCups();
      if(c.actBtn){let h=null;const b=q('#lbH');const go=()=>{h=setInterval(()=>{st.prog+=.04;drawCups();if(st.prog>=1){clearInterval(h);result()}},50);T2.push(h)};
        b.addEventListener('pointerdown',go);['pointerup','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>clearInterval(h)))}};
    let lastA=null;
    q('#lbV').addEventListener('pointermove',e=>{if(st.phase!=='stir'||c.actBtn)return;const p=svgPt(q('#lbV'),e);const a=Math.atan2(p.y-210,p.x-450);
      if(lastA!==null){let d=a-lastA;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;st.prog+=Math.abs(d)/(Math.PI*2*(c.turns||3));drawCups();if(st.prog>=1){st.phase='x';result()}}lastA=a});
    const result=()=>{st.phase='result';st.done=true;drawCups();tone([523,784,1047],.12);step(`<b>④ 看結果</b>　${c.result}`);
      const right=c.predict.ans,ok=st.guess===right;
      q('#lbT').innerHTML=`<div class="story">${ok?'你猜對了！你有科學家的眼光。':'和你猜的不一樣——做實驗，就是為了知道真正的答案！'}<br>${c.why}</div>`;
      q('#lbR').innerHTML=`<button class="btn c" id="lbN">${c.after?'繼續':'寫進科學筆記'}</button>`;
      q('#lbN').onclick=()=>{G.lab=G.lab||[];G.lab.push({t:c.title,g:c.predict.o[st.guess],r:c.predict.o[right]});save();
        if(c.after)c.after(api);else api.ok('化學魔法卡到手！')}};
    q('#lbT').onclick=e=>{const g=e.target.closest('[data-g]');if(g&&st.phase==='predict'){st.guess=+g.dataset.g;sPop();setup();return}
      const it=e.target.closest('.labitem');if(it&&st.phase==='setup'){st.sel=it.dataset.t;api.qa('.labitem').forEach(x=>x.classList.toggle('on',x===it));sPop()}};
    q('#lbV').addEventListener('click',e=>{if(st.phase!=='setup')return;const g=e.target.closest('[data-cup]');if(!g)return;const i=+g.dataset.cup;
      if(!st.sel){const back=st.put.map((p,k)=>[p,k]).filter(([p])=>p.i===i).pop();
        if(back){st.put.splice(back[1],1);st.cups[i].items.pop();st.need.push([back[0].k,i]);sPop();drawCups();api.say('拿回來了，重新放沒關係。');return}
        api.say('先點一樣右邊的材料。');return}
      const k=st.need.findIndex(p=>p[0]===st.sel&&p[1]===i);
      if(k<0){const left=st.need.filter(p=>p[1]===i).map(p=>c.tray.find(t=>t[0]===p[0])[2]);
        api.no((left.length?`「${st.cups[i].label}」還需要：${left.join('、')}。`:'這個杯子已經放滿囉。')+(c.wrongPlace?`　${c.wrongPlace}`:''));return}
      st.need.splice(k,1);st.cups[i].items.push(c.tray.find(t=>t[0]===st.sel)[1]);st.put.push({k:st.sel,i});sPop();drawCups();api.say('');if(!st.need.length)act()});
    predict();
    api.solve(()=>{if(st.phase==='predict')fire(q('[data-g="0"]'));st.need.forEach(p=>st.cups[p[1]].items.push(c.tray.find(t=>t[0]===p[0])[1]));st.need=[];result();fire(q('#lbN'));if(c.after&&window.__solve)window.__solve()});
  },980)}

/* ---------- 數線標記：點標籤，再點數線上的位置 ---------- */
function numberLine(api,o){const {q}=api;const W=760,X=v=>70+(v-o.min)/(o.max-o.min)*W;
  q('#lbT').innerHTML='';q('#lbR').innerHTML='';q('#lbS').innerHTML=`<b>⑤ ${o.title}</b>　${o.lead}`;
  const placed={};let sel=null;
  const draw=()=>{let s=`<line x1="70" y1="200" x2="${70+W}" y2="200" stroke="${INK}" stroke-width="6"/>`;
    for(let v=o.min;v<=o.max+1e-9;v+=o.step){const x=X(v),big=Math.abs(v/o.label-Math.round(v/o.label))<1e-6;s+=`<line x1="${x}" y1="${big?178:188}" x2="${x}" y2="${big?222:212}" stroke="${INK}" stroke-width="${big?4:2}"/>`+(big?`<text x="${x}" y="258" text-anchor="middle" font-size="24" font-weight="700" fill="${INK}" font-family="Fredoka,sans-serif">${+v.toFixed(2)}</text>`:'')}
    o.items.forEach((it,k)=>{if(placed[k]==null)return;const x=X(placed[k]);s+=`<g><path d="M${x} 196 l-14 -30 h28z" fill="${it.c}" stroke="${INK}" stroke-width="3"/><text x="${x}" y="150" text-anchor="middle" font-size="22" font-weight="900" fill="${INK}">${it.l}</text></g>`});
    s+=`<rect id="nlHit" x="40" y="150" width="${W+60}" height="90" fill="transparent"/>`;q('#lbV').innerHTML=s;
    q('#lbT').innerHTML=o.items.map((it,k)=>`<button class="labitem${sel===k?' on':''}" data-k="${k}" style="border-color:${it.c}">${placed[k]!=null?'✓ ':''}<span>${it.l}</span></button>`).join('')+`<button class="btn c" id="nlOk">標好了</button>`};
  draw();
  q('#lbT').onclick=e=>{const b=e.target.closest('[data-k]');if(b){sel=+b.dataset.k;sPop();draw();return}
    if(e.target.closest('#nlOk')){if(Object.keys(placed).length<o.items.length){api.say('還有標籤沒放上去。');return}
      const bad=o.items.filter((it,k)=>Math.abs(placed[k]-it.v)>o.tol+1e-9);
      if(!bad.length)api.ok(o.okMsg,2000);else api.no(`「${bad[0].l}」的位置不太對。${bad[0].hint||''}`)}};
  q('#lbV').onclick=e=>{if(sel===null){api.say('先點下面的一個標籤。');return}const p=svgPt(q('#lbV'),e);let v=o.min+(p.x-70)/W*(o.max-o.min);v=Math.round(v/o.step)*o.step;v=Math.max(o.min,Math.min(o.max,v));placed[sel]=v;sPop();sel=null;draw()};
  api.solve(()=>{o.items.forEach((it,k)=>placed[k]=it.v);draw();fire(q('#nlOk'))});
}

/* ---------- 嗅一嗅：手指沿著氣味線走到終點 ---------- */
function sniffTrail(title,lead,pts,bg,endIco){return g2(title,'point',`<p class="lead">${lead}</p><svg id="snS" viewBox="0 0 900 460" style="width:100%;max-height:420px;touch-action:none;border:4px solid ${INK};border-radius:16px;display:block"></svg>`,api=>{
    const {q}=api;const P=[];for(let k=0;k<pts.length-1;k++){const [a,b]=pts[k],[c2,d]=pts[k+1];const n=Math.ceil(Math.hypot(c2-a,d-b)/12);for(let j=0;j<n;j++)P.push([a+(c2-a)*j/n,b+(d-b)*j/n])}P.push(pts[pts.length-1]);
    let idx=0,down=false;
    const draw=()=>{const [x,y]=P[idx];q('#snS').innerHTML=bg+`<polyline points="${P.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#E8A35C" stroke-width="14" stroke-linecap="round" stroke-dasharray="2 22" opacity=".85"/>
      <polyline points="${P.slice(0,idx+1).map(p=>p.join(',')).join(' ')}" fill="none" stroke="#C86062" stroke-width="10" stroke-linecap="round"/>
      <text x="${pts[pts.length-1][0]}" y="${pts[pts.length-1][1]+14}" text-anchor="middle" font-size="44">${endIco}</text>
      <g transform="translate(${x} ${y+40}) scale(.42)">${critter(CAST.pango2.look)}</g>`};
    const mv=e=>{if(!down)return;const p=svgPt(q('#snS'),e);for(let k=idx+1;k<Math.min(P.length,idx+8);k++){if(Math.hypot(P[k][0]-p.x,P[k][1]-p.y)<48){idx=k}}draw();if(idx>=P.length-1){down=false;api.ok('找到了！小穿山甲的鼻子真靈。')}};
    q('#snS').addEventListener('pointerdown',e=>{down=true;q('#snS').setPointerCapture(e.pointerId);mv(e)});q('#snS').addEventListener('pointermove',mv);q('#snS').addEventListener('pointerup',()=>down=false);
    draw();api.say('用手指按住小穿山甲，沿著橘色的氣味線慢慢走。');
    api.solve(()=>{idx=P.length-1;draw();api.ok('找到了！')});
  },960)}

/* ---------- 蜂巢數字：每格數字＝碰到幾個相鄰的六邊形 ---------- */
function hexCount(title,lead,cells,asks){return g2(title,'think',`<p class="lead">${lead}</p><div class="mgrid" style="align-items:center"><svg id="hxS" viewBox="-300 -230 600 460" style="width:100%;max-height:400px"></svg>
  <div><div class="story" id="hxQ">點一個彩色的問號格。</div><div class="hxpad" id="hxP">${[0,1,2,3,4,5,6].map(n=>`<button data-n="${n}">${n}</button>`).join('')}</div><div class="row" style="margin-top:10px"><button class="btn c" id="hxOk">輸入密碼</button></div></div></div>`,api=>{
    const {q}=api;const key=c=>c.join(','),S=new Set(cells.map(key));const D=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
    const cnt=c=>D.filter(([a,b])=>S.has((c[0]+a)+','+(c[1]+b))).length;const ans={};let sel=null,teach=0;
    const pos=([qq,r])=>[52*Math.sqrt(3)*(qq+r/2),52*1.5*r];
    const draw=()=>{let s='';cells.forEach(c=>{const [x,y]=pos(c),a=asks.find(k=>key(k.c)===key(c));
      const pts=[0,1,2,3,4,5].map(i=>{const an=deg(60*i-30);return `${x+50*Math.cos(an)},${y+50*Math.sin(an)}`}).join(' ');
      s+=`<g data-c="${key(c)}" style="cursor:pointer"><polygon points="${pts}" fill="${a?a.col:'#D9C7A3'}" stroke="${INK}" stroke-width="${sel===key(c)?8:4}"/><text x="${x}" y="${y+12}" text-anchor="middle" font-size="34" font-weight="900" fill="${a?'#fff':INK}" font-family="Fredoka,sans-serif">${a?(ans[key(c)]!=null?ans[key(c)]:'?'):cnt(c)}</text></g>`});q('#hxS').innerHTML=s};
    q('#hxS').onclick=e=>{const g=e.target.closest('[data-c]');if(!g)return;const a=asks.find(k=>key(k.c)===g.dataset.c);
      if(!a){teach++;const n=cnt(g.dataset.c.split(',').map(Number));api.say(`這格寫 ${n}。你數數看，它旁邊碰到幾個六邊形？`);return}
      sel=g.dataset.c;sPop();draw();q('#hxQ').innerHTML=`<b style="color:${a.col}">${a.name}色</b>的格子，碰到幾個六邊形？`};
    q('#hxP').onclick=e=>{const b=e.target.closest('[data-n]');if(!b||!sel)return;ans[sel]=+b.dataset.n;sPop();draw()};
    q('#hxOk').onclick=()=>{if(asks.some(a=>ans[key(a.c)]==null)){api.say('四個問號都要填。');return}
      const bad=asks.filter(a=>ans[key(a.c)]!==cnt(a.c));if(!bad.length)api.ok(`密碼 ${asks.map(a=>cnt(a.c)).join('')}！岩縫裡的小鐵盒打開了。`,2200);
      else api.no(`${bad.map(a=>a.name).join('、')}色的數字不對。提示：點一個寫好數字的格子，看看規則。`)};
    draw();api.solve(()=>{asks.forEach(a=>ans[key(a.c)]=cnt(a.c));draw();fire(q('#hxOk'))});
  },940)}

/* ---------- 英文字母方陣：點單字的第一個和最後一個字母 ---------- */
function wordSearch(title,lead,rows,words){return g2(title,'think',`<p class="lead">${lead}</p><div class="mgrid" style="align-items:start"><div class="wsg" id="wsG" style="grid-template-columns:repeat(${rows[0].length},1fr)">${rows.map((r,y)=>[...r].map((ch,x)=>`<button data-x="${x}" data-y="${y}">${ch}</button>`).join('')).join('')}</div>
  <div><div class="wsw" id="wsW">${words.map(w=>`<span data-w="${w[0]}">${w[0]} <small>${w[1]}</small></span>`).join('')}</div><button class="tool" id="wsSay" style="margin-top:10px">唸單字給我聽</button></div></div>`,api=>{
    const {q,qa}=api;let a=null;const found=new Set();
    const cell=(x,y)=>q(`#wsG [data-x="${x}"][data-y="${y}"]`);
    const line=(x1,y1,x2,y2)=>{const dx=Math.sign(x2-x1),dy=Math.sign(y2-y1);if(dx&&dy)return null;const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));const out=[];for(let k=0;k<=n;k++)out.push([x1+dx*k,y1+dy*k]);return out};
    q('#wsG').onclick=e=>{const b=e.target.closest('button');if(!b)return;const x=+b.dataset.x,y=+b.dataset.y;
      if(!a){a=[x,y];b.classList.add('sel');sPop();return}
      const L=line(a[0],a[1],x,y);qa('#wsG .sel').forEach(z=>z.classList.remove('sel'));const s0=a;a=null;
      if(!L){api.no('單字只會橫著或直著排喔。');return}
      const w=L.map(([u,v])=>rows[v][u]).join(''),hit=words.find(k=>k[0]===w&&!found.has(w));
      if(hit){found.add(w);L.forEach(([u,v])=>cell(u,v).classList.add('got'));q(`#wsW [data-w="${w}"]`).classList.add('got');speak(w.toLowerCase(),'en-US');sGood();
        if(found.size===words.length)api.ok('全部找到了！');}else api.no(`「${w}」不在單字表裡。`)};
    q('#wsSay').onclick=()=>speak(words.map(w=>w[0].toLowerCase()).join(', '),'en-US');
    api.solve(()=>{words.forEach(([w])=>{if(found.has(w))return;for(let y=0;y<rows.length;y++)for(let x=0;x<rows[0].length;x++)for(const [dx,dy] of [[1,0],[0,1]]){const ex=x+dx*(w.length-1),ey=y+dy*(w.length-1);
        if(ex<rows[0].length&&ey<rows.length&&line(x,y,ex,ey).map(([u,v])=>rows[v][u]).join('')===w&&!found.has(w)){fire(cell(x,y));fire(cell(ex,ey))}}})});
  },960)}
function makeGrid(w,h,place,seed=7){const g=Array.from({length:h},()=>Array(w).fill(''));place.forEach(([word,x,y,dir])=>[...word].forEach((ch,k)=>{g[y+(dir==='d'?k:0)][x+(dir==='r'?k:0)]=ch}));
  const AB='ABCDEFGHIKLMNOPRSTUVWY';let r=seed;return g.map(row=>row.map(c=>c||AB[(r=(r*37+11)%997)%AB.length]).join(''))}

/* ---------- 分類籃：點物品，再點正確的籃子 ---------- */
function sortBaskets(title,lead,baskets,items){return g2(title,'think',`<p class="lead">${lead}</p><div class="sbitems" id="sbI">${items.map((it,i)=>`<button class="sbit" data-i="${i}">${ico(it[1],38)}<span>${it[0]}</span></button>`).join('')}</div>
  <div class="sbbaskets" id="sbB">${baskets.map((b,k)=>`<div class="sbb" data-b="${k}"><b>${b}</b><div class="sbin"></div></div>`).join('')}</div>`,api=>{
    const {q,qa}=api;let sel=null,left=items.length;
    q('#sbI').onclick=e=>{const b=e.target.closest('.sbit');if(!b||b.disabled)return;sel=+b.dataset.i;qa('.sbit').forEach(x=>x.classList.toggle('on',x===b));sPop()};
    q('#sbB').onclick=e=>{const bk=e.target.closest('.sbb');if(!bk)return;if(sel===null){api.say('先點上面的一樣東西。');return}const it=items[sel];
      if(+bk.dataset.b===it[2]){const b=q(`.sbit[data-i="${sel}"]`);b.disabled=true;b.classList.remove('on');bk.querySelector('.sbin').innerHTML+=ico(it[1],30);sGood();api.say(it[3]||'放對了！','ok');sel=null;left--;if(!left)api.ok('全部分好了！',2000)}
      else{api.no(it[4]||'再想想看，這樣東西應該放在哪一籃？');shake(bk)}};
    api.solve(()=>items.forEach((it,i)=>{if(q(`.sbit[data-i="${i}"]`).disabled)return;fire(q(`.sbit[data-i="${i}"]`));fire(q(`.sbb[data-b="${it[2]}"]`))}));
  },940)}

/* ---------- 付錢找零：點錢幣放進托盤，湊出剛好的金額 ---------- */
function coinPay(title,rounds){const C=[[1,'#C9A878'],[5,'#D4BB49'],[10,'#C9C1B0'],[50,'#D9B95E'],[100,'#8DB36E'],[500,'#D29841']];
  return g2(title,'think',`<div class="story" id="cpQ"></div><div class="cptray" id="cpT"></div><div class="row"><span class="pill" id="cpS">托盤裡：0 元</span><button class="tool" id="cpC">全部拿回</button></div>
  <div class="cpcoins" id="cpK">${C.map(([v,c])=>`<button data-v="${v}" style="--c:${c}" class="${v>=100?'bill':''}">${v}</button>`).join('')}</div><div class="row" style="margin-top:8px"><button class="btn c" id="cpOk">就是這些錢</button><span class="locks" id="cpL">${rounds.map(()=>'<i>？</i>').join('')}</span></div>`,api=>{
    const {q}=api;let i=0,tray=[];
    const draw=()=>{q('#cpT').innerHTML=tray.map((v,k)=>`<button data-k="${k}" class="${v>=100?'bill':''}" style="--c:${C.find(c=>c[0]===v)[1]}">${v}</button>`).join('')||'<em>點下面的錢，放進托盤</em>';q('#cpS').textContent='托盤裡：'+tray.reduce((a,b)=>a+b,0)+' 元'};
    const show=()=>{if(i>=rounds.length)return;tray=[];q('#cpQ').innerHTML=rounds[i].q;draw()};
    q('#cpK').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;tray.push(+b.dataset.v);tone([700],.04,'sine',.08);draw()};
    q('#cpT').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;tray.splice(+b.dataset.k,1);draw()};
    q('#cpC').onclick=()=>{tray=[];draw()};
    q('#cpOk').onclick=()=>{const s=tray.reduce((a,b)=>a+b,0),r=rounds[i];if(s===r.a){q('#cpL').children[i].className='on';q('#cpL').children[i].textContent='✓';sGood();i++;
        if(i>=rounds.length)api.ok(r.ex||'算得剛剛好！');else{api.say(r.ex||'剛剛好！','ok');lockFor(show,1300)}}
      else api.no(s>r.a?`多了 ${s-r.a} 元喔。`:`還差 ${r.a-s} 元。`+(r.hint?'　'+r.hint:''))};
    show();api.solve(()=>{for(const r of rounds.slice(i)){tray=[r.a];fire(q('#cpOk'))}});
  },900)}

/* ---------- 分組數數：把東西點進一組一組，再算出乘法 ---------- */
function groupCount(title,lead,n,size,icon,eq){return g2(title,'think',`<p class="lead">${lead}</p><svg id="gcS" viewBox="0 0 900 380" style="width:100%;max-height:360px;border:4px solid ${INK};border-radius:16px;background:#7FB3CC"></svg>
  <div class="row"><span class="pill" id="gcN"></span></div><div class="row" id="gcE" hidden></div>`,api=>{
    const {q}=api;const COL=['#C86062','#D4BB49','#8DB36E','#5B84AB','#7E5FA3','#D29841','#50A260','#B37944'];let r=17;
    const P=Array.from({length:n},(_,k)=>[60+((k*97+(r=(r*31+7)%101))%780),60+((k*53+r*3)%260)]);const grp=Array(n).fill(-1);let g=0,cur=0;
    const draw=()=>{q('#gcS').innerHTML=`<path d="M0 330 Q450 300 900 330 V380 H0Z" fill="#D9C7A3"/>`+P.map(([x,y],k)=>`<g data-k="${k}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="30" fill="${grp[k]<0?'transparent':COL[grp[k]%8]}" opacity=".5"/><text x="${x}" y="${y+14}" text-anchor="middle" font-size="40">${icon}</text></g>`).join('');
      q('#gcN').textContent=`已經分好 ${g} 組（每組 ${size} 個）　這一組：${cur}/${size}`};
    q('#gcS').onclick=e=>{const t=e.target.closest('[data-k]');if(!t)return;const k=+t.dataset.k;if(grp[k]>=0)return;grp[k]=g;cur++;sPop();if(cur===size){g++;cur=0;tone([660,880],.08)}draw();
      if(g*size===n){q('#gcE').hidden=false;q('#gcE').innerHTML=`<div class="story">一共分成幾組？</div>`+[g-1,g,g+1].sort(()=>Math.random()-.5).map(v=>`<button class="btn w" data-v="${v}">${v} 組</button>`).join('')}};
    q('#gcE').onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;if(+b.dataset.v===n/size)api.ok(eq||`${n/size} 組 × ${size} 個 ＝ ${n} 個！`,2000);else api.no('數數看有幾種顏色的圈圈。')};
    draw();api.solve(()=>{for(let k=0;k<n;k++)if(grp[k]<0)fire(q(`#gcS [data-k="${k}"]`));fire(q(`#gcE [data-v="${n/size}"]`))});
  },940)}

/* ---------- 剪影小謎案：先自由猜（不判對錯），再從剪影選出答案 ---------- */
function silhouette(c){return g2('今日小謎案：'+c.title,'hmm',`<div class="mgrid" style="align-items:center"><div class="silbox" id="siB">${c.sil}</div>
  <div><div class="story">${c.clue}</div><div id="siStep"></div></div></div>`,api=>{const {q}=api;
    q('#siStep').innerHTML=`<p class="lead" style="margin-top:10px">你猜是誰？說說看，猜什麼都可以！</p><div class="row">${c.guess.map(g=>`<button class="btn w" data-g="1">${g}</button>`).join('')}</div>`;
    const choose=()=>{q('#siStep').innerHTML=`<p class="lead" style="margin-top:10px">再看看剪影的形狀，牠是誰？</p><div class="sichoice">${c.opts.map((o,i)=>`<button data-o="${i}">${ico(o[1],46)}<b>${o[0]}</b></button>`).join('')}</div>`};
    q('#siStep').onclick=e=>{if(e.target.closest('[data-g]')){sPop();api.say('很好，偵探就是要先大膽猜！','ok');choose();return}
      const o=e.target.closest('[data-o]');if(!o)return;if(c.opts[+o.dataset.o][2]){q('#siB').classList.add('reveal');q('#siB').innerHTML=c.real||q('#siB').innerHTML;api.ok(c.fact,2600)}
      else{api.no('不是牠。看看剪影的'+c.part+'！');q('#siB').classList.add('part')}};
    api.solve(()=>{choose();fire(q(`[data-o="${c.opts.findIndex(o=>o[2])}"]`))});
  },900)}

/* ---------- 動作關卡：浪來了就跳！（追怪盜X） ---------- */
function waveRun(title,need=8){return g2(title,'run',`<p class="lead">怪盜X沿著海邊逃跑！浪打過來的時候，按「跳！」（或點畫面）跳過去。</p>
  <svg id="wrS" viewBox="0 0 1000 380" style="width:100%;max-height:380px;border:4px solid ${INK};border-radius:16px;touch-action:none"></svg>
  <div class="row" style="justify-content:center;margin-top:10px"><span class="pill" id="wrN"></span><button class="btn c" id="wrJ" style="min-width:220px;min-height:70px;font-size:26px">跳！</button></div>`,api=>{
    const {q}=api;let y=0,vy=0,waves=[],passed=0,hit=0,t0=performance.now(),last=t0,next=900,speed=.42,inv=0,raf;
    const jump=()=>{if(y===0){vy=1.3;tone([520,660],.05)}};
    q('#wrJ').onclick=jump;q('#wrS').addEventListener('pointerdown',jump);
    const loop=now=>{const dt=Math.min(40,now-last);last=now;next-=dt;
      if(next<=0){waves.push({x:1040});next=1100+Math.random()*900}
      if(y>0||vy>0){y+=vy*dt*.55;vy-=.0038*dt;if(y<=0){y=0;vy=0}}
      waves.forEach(w=>w.x-=speed*dt);
      waves=waves.filter(w=>{if(!w.hit&&w.x<230&&w.x>150&&y<60){w.hit=1;hit++;inv=500;sBad();if(hit>=3)speed=.32}if(w.x<120&&!w.cnt){w.cnt=1;if(!w.hit){passed++;tone([880],.04)}}return w.x>-80});
      inv=Math.max(0,inv-dt);
      const dist=Math.max(0,need-passed);
      let s=`<rect width="1000" height="380" fill="#CFE3EC"/><rect y="150" width="1000" height="90" fill="#7FB3CC"/><rect y="240" width="1000" height="140" fill="#D9C7A3"/>`;
      waves.forEach(w=>s+=`<path d="M${w.x-60} 290 Q${w.x-30} 200 ${w.x} 230 Q${w.x+20} 180 ${w.x+60} 290Z" fill="#5B9BC2" stroke="${INK}" stroke-width="4"/><path d="M${w.x-20} 225 q15 -14 30 -4" stroke="#fff" stroke-width="5" fill="none"/>`);
      s+=`<image href="${COAT.coat_pocket.b}" x="${200-66*COAT.coat_pocket.r}" y="${290-140-y}" width="${140*COAT.coat_pocket.r}" height="140" opacity="${inv>0&&Math.floor(now/80)%2?.4:1}"/>`;
      s+=`<g transform="translate(${720+dist*25} 300) scale(.5)">${critter(X2_LOOK)}</g>`;
      q('#wrS').innerHTML=s;q('#wrN').textContent=`跳過的浪：${passed}/${need}`;
      if(passed>=need){api.ok('追上了！');return}
      raf=requestAnimationFrame(loop);T2.push(raf)};
    raf=requestAnimationFrame(loop);T2.push(raf);
    api.solve(()=>{passed=need});
  },960)}

/* ================= 第二章 九份 的新玩法 ================= */

/* ---------- 變色密碼盤：三個轉盤轉到實驗結果的顏色，對照色卡得到密碼 ---------- */
function colorDials(title,lead,colors,targets,chart,code,okMsg){return g2(title,'think',`<p class="lead">${lead}</p>
  <div class="mgrid" style="align-items:center"><svg id="cdS" viewBox="0 0 520 300" style="width:100%;max-height:320px;touch-action:none"></svg>
  <div><div class="story" id="cdC">${chart.map(([n,d])=>`<div style="display:flex;align-items:center;gap:10px;margin:7px 0"><span style="width:34px;height:34px;border-radius:50%;border:3px solid ${INK};background:${colors.find(c=>c[0]===n)[1]};flex:none"></span><b style="font-size:24px">${n} ＝ ${d}</b></div>`).join('')}<small style="color:var(--ink2)">色卡：三個顏色對應的數字，排起來就是密碼。</small></div>
  <div class="row" style="justify-content:center;margin-top:12px"><button class="btn c" id="cdOk">打開道具箱</button></div></div></div>`,api=>{
  const {q}=api;const st=targets.map(t=>{let v=Math.floor(Math.random()*colors.length);return v===t?(t+1)%colors.length:v});
  const draw=()=>{q('#cdS').innerHTML=[0,1,2].map(i=>{const x=100+i*160,[n,c]=colors[st[i]];
    return `<g data-d="${i}" style="cursor:pointer"><circle cx="${x}" cy="125" r="74" fill="${c}" stroke="${INK}" stroke-width="7"/><circle cx="${x}" cy="125" r="48" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 8" opacity=".7"/><path d="M${x} 26 l17 28 h-34z" fill="${INK}"/><text x="${x}" y="252" text-anchor="middle" font-size="26" font-weight="900" fill="${INK}">${n}</text></g>`}).join('')};
  q('#cdS').onclick=e=>{const g=e.target.closest('[data-d]');if(!g)return;const i=+g.dataset.d;st[i]=(st[i]+1)%colors.length;sPop();draw()};
  let miss=0;
  q('#cdOk').onclick=()=>{if(st.every((v,i)=>v===targets[i])){sWin();q('#cdS').innerHTML+=`<text x="260" y="146" text-anchor="middle" font-size="72" font-weight="700" fill="#FFFFFF" stroke="${INK}" stroke-width="2" font-family="Fredoka,sans-serif">${code}</text>`;api.ok(okMsg,2400)}
    else{miss++;sBad();shake(q('#cdC'));api.no(miss>=2?'提示：實驗結果是 A 粉紅、B 紫色、C 綠色。把三個轉盤轉成一樣的顏色！':'轉盤的顏色跟三杯湯的實驗結果不一樣，再想想看。')}};
  draw();api.solve(()=>{targets.forEach((t,i)=>st[i]=t);draw();fire(q('#cdOk'))});
},920)}

/* ---------- 刷刷顯字：選對工具（水彩），把白蠟筆字刷出來 ---------- */
function brushReveal(title,lead,msg,zones){const WASH='#BFD9E6',PAPER='#FDFBF6';
 return g2(title,'point',`<p class="lead">${lead}</p>
  <div class="row" id="brT">${[['🖍️','蠟筆'],['🖌️','水彩筆'],['🖊️','簽字筆']].map(([e,n],i)=>`<button class="labitem" data-t="${i}">${ico(e,36)}<span>${n}</span></button>`).join('')}</div>
  <div class="row"><span class="pill" id="brP">① 先選對工具</span></div>
  <svg id="brS" viewBox="0 0 900 300" style="width:100%;max-height:290px;border:4px solid ${INK};border-radius:16px;touch-action:none;cursor:crosshair;display:block;margin-top:8px;opacity:.55">
    <defs><mask id="brM"><rect width="900" height="300" fill="#fff"/></mask></defs>
    <rect width="900" height="300" fill="${WASH}"/>
    <text x="450" y="172" text-anchor="middle" font-size="56" font-weight="900" fill="${PAPER}" font-family="Fredoka,var(--f-ui)">${msg}</text>
    <rect width="900" height="300" fill="${PAPER}" mask="url(#brM)"/>
  </svg>`,api=>{
  const {q}=api;let down=false;const done=new Set();let miss=0,ready=false;
  const paint=p=>{q('#brM').insertAdjacentHTML('beforeend',`<circle cx="${p.x}" cy="${p.y}" r="54" fill="#000"/>`);
    zones.forEach((z,i)=>{if(!done.has(i)&&Math.hypot(z[0]-p.x,z[1]-p.y)<z[2]+46){done.add(i);sGood();q('#brP').textContent=`② 刷出字來：${done.size}/${zones.length}`}});
    if(done.size>=zones.length){const t=q('#brS text');t.setAttribute('fill',INK);api.ok('字浮現了！原來蠟不吸水，水彩被白蠟筆擋住，字就跑出來了。',2800)}};
  q('#brT').onclick=e=>{const b=e.target.closest('[data-t]');if(!b||ready)return;const v=+b.dataset.t;
    if(v!==1){miss++;sBad();shake(b);api.no(v===0?(miss>=2?'蠟筆碰蠟筆不會變色。要用「水水的」顏料！':'蠟筆寫的字，再用蠟筆刷沒有用喔。'):(miss>=2?'簽字筆只會把紙畫髒。要用水溶開的顏料！':'簽字筆蓋不住白蠟筆的字，想想看什麼工具是水水的？'))}
    else{ready=true;sPop();q('#brS').style.opacity='1';q('#brP').textContent='② 用水彩筆在紙上刷一刷！';api.say('按住紙，來回刷，讓整張紙都吃進水彩。')}};
  const pt=e=>svgPt(q('#brS'),e);
  q('#brS').addEventListener('pointerdown',e=>{if(!ready)return;down=true;try{q('#brS').setPointerCapture(e.pointerId)}catch(_){}paint(pt(e))});
  q('#brS').addEventListener('pointermove',e=>{if(down&&ready)paint(pt(e))});
  q('#brS').addEventListener('pointerup',()=>down=false);
  api.solve(()=>{fire(q('#brT [data-t="1"]'));const sv=q('#brS');
    const cv=z=>{const p=sv.createSVGPoint();p.x=z[0];p.y=z[1];return p.matrixTransform(sv.getScreenCTM())};
    zones.forEach(z=>{const c=cv(z);sv.dispatchEvent(new PointerEvent('pointerdown',{clientX:c.x,clientY:c.y,bubbles:true}));sv.dispatchEvent(new PointerEvent('pointermove',{clientX:c.x,clientY:c.y,bubbles:true}));sv.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}))})});
},920)}

/* ---------- 插畫路線：依英文路標走到 24 號燈籠 ---------- */
function signRoute(title,lead,steps){const WP=[[120,380],[330,380],[330,250],[560,250],[560,120],[800,120]],ARR=['⬆ 向上','⬅ 向左','➡ 向右'];
 return g2(title,'point',`<p class="lead">${lead}</p>
  <svg id="rtS" viewBox="0 0 900 460" style="width:100%;max-height:320px;border:4px solid ${INK};border-radius:16px;display:block;background:#EBC9A6"></svg>
  <div class="row" style="justify-content:center;margin-top:10px"><span class="story" id="rtQ" style="flex:1;min-width:230px"></span><button class="tool" id="rtHear">再聽一次</button></div>
  <div class="row" id="rtA" style="justify-content:center;margin-top:8px">${ARR.map((a,i)=>`<button class="btn w" data-a="${i}" style="min-width:140px">${a}</button>`).join('')}</div>`,api=>{
  const {q}=api;let i=0;
  const bg=()=>`<rect width="900" height="460" fill="#EBC9A6"/>
   ${[[30,270,110],[690,270,110],[420,140,90]].map(([x,y,w])=>`<g transform="translate(${x} ${y})"><rect width="${w}" height="120" fill="#A07A5E" stroke="${INK}" stroke-width="5"/><path d="M-8 0 H${w+8} L${w-4} -28 H4Z" fill="#4E4A52" stroke="${INK}" stroke-width="4"/></g>`).join('')}
   <path d="M120 380 H330 V250 H560 V120 H800" fill="none" stroke="#8E7558" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
   <path d="M120 380 H330 V250 H560 V120 H800" fill="none" stroke="#F2EBDD" stroke-width="4" stroke-dasharray="10 14"/>
   <g transform="translate(812 100)"><rect x="-4" y="-26" width="8" height="12" fill="${INK}"/><ellipse rx="32" ry="38" fill="#C86062" stroke="${INK}" stroke-width="5"/><path d="M-32 0 H32" stroke="#E5C35A" stroke-width="3"/><text y="86" text-anchor="middle" font-size="32" font-weight="900" fill="${INK}" font-family="Fredoka,sans-serif">24</text></g>`;
  const draw=()=>{const [x,y]=WP[i];q('#rtS').innerHTML=bg()+`<g transform="translate(${x} ${y}) scale(.36)">${critter(CAST.pango2.look)}</g>`};
  const ask=()=>{const s=steps[i];q('#rtQ').innerHTML=`<b style="font-family:var(--f-en);font-size:23px">${s.en}</b>　<small style="color:var(--ink2)">（路標 ${i+1}／${steps.length}）</small>`;speak(s.en,'en-US')};
  q('#rtA').onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const s=steps[i];
    if(+b.dataset.a===s.dir){sGood();i++;if(i>=steps.length){draw();api.ok('走到 24 號燈籠了！小穿山甲的英文真不錯。',2000)}else{draw();ask()}}
    else{sBad();shake(b);api.no('這條路不對喔。路標說的是：「'+s.zh+'」')}};
  q('#rtHear').onclick=()=>speak(steps[i].en,'en-US');
  draw();ask();
  api.solve(()=>{for(const s of steps.slice(i))fire(q(`#rtA [data-a="${s.dir}"]`))});
},940)}

/* ---------- 字裡藏數：語分早仁各藏一個數字，加起來找燈籠 ---------- */
function charNums(title,lead,chars,sumq,opts,ansN,okMsg){return g2(title,'think',`<p class="lead">${lead}</p>
  <div class="cngrid">${chars.map((c,i)=>`<div class="cnc" data-i="${i}"><button class="cnbig" data-b="${i}">${c.ch}</button><div class="cnde" hidden></div><div class="cnopts">${c.opts.map(o=>`<button data-o="${o}">${o}</button>`).join('')}</div></div>`).join('')}</div>
  <div id="cnSum" hidden><div class="story" style="text-align:center;margin-top:12px">${sumq}</div><div class="row" style="justify-content:center;margin-top:4px">${opts.map(n=>`<button class="btn c" data-n="${n}" style="min-width:130px;font-family:var(--f-en)">${n} 號</button>`).join('')}</div></div>`,api=>{
  const {q,qa}=api;const got=chars.map(()=>false);let miss=0;
  q('.cngrid').onclick=e=>{
    const bb=e.target.closest('[data-b]');
    if(bb){const c=chars[+bb.dataset.b],de=bb.parentElement.querySelector('.cnde');de.hidden=!de.hidden;
      if(!de.hidden)de.innerHTML=`${c.ch} ＝ ${c.d.map((p,k)=>k===c.dk?`<b style="color:#C86062;font-size:24px">${p}</b>`:p).join(' ＋ ')}`;sPop();return}
    const o=e.target.closest('[data-o]');if(!o)return;const card=o.closest('[data-i]');const i=+card.dataset.i;if(got[i])return;const c=chars[i];
    if(+o.dataset.o===c.ans){got[i]=true;o.classList.add('on');qa(`[data-i="${i}"] [data-o]`).forEach(x=>x.disabled=true);sGood();api.say(`對了！「${c.ch}」裡藏著「${c.hide}」。`,'ok');
      if(got.every(Boolean)){q('#cnSum').hidden=false;api.say('四個數字都找到了！加一加，去點出正確的燈籠。')}}
    else{miss++;sBad();shake(o);api.no(miss>=2?`提示：${c.ch} 可以拆成「${c.d.join('」和「')}」，其中哪一個是數字？`:'這個數字不在字裡面。點一點大字，看看拆開的樣子！')}};
  q('#cnSum').onclick=e=>{const b=e.target.closest('[data-n]');if(!b)return;
    if(+b.dataset.n===ansN)api.ok(okMsg,2400);else{sBad();shake(b);api.no('再算一次：五 ＋ 八 ＋ 十 ＋ 二 是多少？')}};
  api.solve(()=>{chars.forEach((c,i)=>{if(!got[i])fire(q(`[data-i="${i}"] [data-o="${c.ans}"]`))});fire(q(`#cnSum [data-n="${ansN}"]`))});
},940)}

/* ---------- 箭頭疊合：兩張透明片疊在一起，拼出數字密碼 ---------- */
function arrowOverlay(title,lead,digits,okMsg){const T=(off,op)=>`<g><rect x="-185" y="-125" width="370" height="250" rx="18" fill="#E8A35C" opacity="${op}" stroke="${INK}" stroke-width="6"/><text y="58" text-anchor="middle" font-size="150" font-weight="700" fill="none" stroke="${INK}" stroke-width="14" stroke-dasharray="26 26" stroke-dashoffset="${off}" font-family="Fredoka,sans-serif">${digits}</text><text y="-94" text-anchor="middle" font-size="22" font-weight="900" fill="${INK}">透明片</text></g>`;
 return g2(title,'hmm',`<p class="lead">${lead}</p>
  <svg id="ovS" viewBox="0 0 900 420" style="width:100%;max-height:320px;border:4px solid ${INK};border-radius:16px;touch-action:none;display:block;background:#D9C7A3"></svg>
  <div class="row" style="justify-content:center;margin-top:8px"><span class="pill" id="ovP">按住右邊的透明片，拖去跟左邊疊在一起</span></div>`,api=>{
  const {q}=api;const A={x:240,y:210};let B={x:660,y:210},drag=false,merged=false;
  const draw=()=>{q('#ovS').innerHTML=`<g transform="translate(${A.x} ${A.y})">${T(0,.45)}</g><g transform="translate(${B.x} ${B.y})" style="cursor:grab">${T(26,.55)}</g>`};
  const merge=()=>{if(merged||api.over())return;merged=true;B={...A};draw();sWin();q('#ovP').textContent='疊合成功！';api.ok(okMsg,2400)};
  const pt=e=>svgPt(q('#ovS'),e);
  q('#ovS').addEventListener('pointerdown',e=>{if(merged)return;const p=pt(e);if(Math.abs(p.x-B.x)<200&&Math.abs(p.y-B.y)<145){drag=true;try{q('#ovS').setPointerCapture(e.pointerId)}catch(_){}}});
  q('#ovS').addEventListener('pointermove',e=>{if(!drag)return;const p=pt(e);B={x:p.x,y:p.y};draw();
    if(Math.hypot(p.x-A.x,p.y-A.y)<60){drag=false;merge()}});
  q('#ovS').addEventListener('pointerup',()=>drag=false);
  draw();api.say('分開看，兩張都只是亂亂的箭頭碎片。');
  api.solve(merge);
},920)}

/* ---------- 翻牌配對：英文顏色字 ↔ 燈籠顏色 ---------- */
function lanternSvg(c){return `<svg viewBox="-40 -60 80 96" style="width:100%;max-height:96px;display:block"><rect x="-3" y="-58" width="6" height="10" fill="${INK}"/><ellipse rx="30" ry="36" fill="${c}" stroke="${INK}" stroke-width="5"/><path d="M-30 0 H30 M-26 -18 H26 M-26 18 H26" stroke="${INK}" stroke-width="2" opacity=".4"/><line x1="0" y1="36" x2="0" y2="48" stroke="${INK}" stroke-width="4"/><circle cy="53" r="5" fill="#D4BB49" stroke="${INK}" stroke-width="2"/></svg>`}
function flipMatch(title,lead,pairs){return g2(title,'think',`<p class="lead">${lead}</p>
  <div class="fmg" id="fmG"></div>`,api=>{
  const {q}=api;const cards=shuffle(pairs.flatMap((p,i)=>[{k:i,word:p[0],zh:p[1]},{k:i,color:p[2]}]));let open=[],lock=false,done=0;
  const draw=()=>{q('#fmG').innerHTML=cards.map((c,i)=>`<button data-i="${i}" class="${c.up||c.ok?'open':''}${c.ok?' done':''}"><span class="bk">🏮</span><span class="ft">${c.word?`<b style="font:700 24px var(--f-en)">${c.word}</b><small style="font-weight:900;color:var(--ink2)">${c.zh}</small>`:lanternSvg(c.color)}</span></button>`).join('')};
  q('#fmG').onclick=e=>{const b=e.target.closest('[data-i]');if(!b||lock)return;const c=cards[+b.dataset.i];if(c.ok||c.up)return;
    c.up=1;open.push(c);sPop();draw();
    if(open.length===2){const [a,b2]=open;
      if(a.k===b2.k){a.ok=b2.ok=1;done++;sGood();open=[];api.say('配對成功！','ok');if(done===pairs.length)api.ok('全部配對完成！英文顏色都記住了！',1800)}
      else{lock=true;sBad();api.say('不一樣，蓋回去。把顏色記起來，再試一次！');lockFor(()=>{a.up=b2.up=0;open=[];lock=false;draw()},1000)}}};
  draw();api.solve(()=>{pairs.forEach((p,k)=>{const a=cards.findIndex(c=>c.k===k&&c.word),b2=cards.findIndex(c=>c.k===k&&c.color);fire(q(`#fmG [data-i="${a}"]`));fire(q(`#fmG [data-i="${b2}"]`))})});
},900)}

/* ---------- 食譜加倍：2 碗份量改成 6 碗 ---------- */
function recipeScale(title,lead,rows,okMsg){return g2(title,'think',`<p class="lead">${lead}</p>
  <div class="story" style="text-align:center">🏮 芋圓店食譜卡：下面是 <b>2 碗</b> 的份量，請幫婆婆改成 <b>6 碗</b>。</div>
  <div id="rsR">${rows.map((r,i)=>`<div class="rsrow"><b>${r.name}</b><small>2 碗：${r.base} ${r.unit}</small><span class="rsp"><button data-i="${i}" data-d="-1">−</button><span id="rsV${i}">${r.base} ${r.unit}</span><button data-i="${i}" data-d="1">＋</button></span></div>`).join('')}</div>
  <div class="row" style="justify-content:center;margin-top:12px"><button class="btn c" id="rsOk">食譜改好了</button></div>`,api=>{
  const {q}=api;const val=rows.map(r=>r.base);const miss=rows.map(()=>0);
  const draw=()=>rows.forEach((r,i)=>q('#rsV'+i).textContent=val[i]+' '+r.unit);
  q('#rsR').onclick=e=>{const b=e.target.closest('[data-d]');if(!b)return;const i=+b.dataset.i;val[i]=Math.max(0,val[i]+ +b.dataset.d);sPop();draw()};
  q('#rsOk').onclick=()=>{const bad=rows.filter((r,i)=>val[i]!==r.base*r.mult);
    if(!bad.length){sWin();api.ok(okMsg,2200);return}
    sBad();const r=bad[0],i=rows.indexOf(r);miss[i]++;shake(q('#rsV'+i).parentElement);
    api.no(miss[i]>=2?`提示：6 碗是 2 碗的 ${r.mult} 倍，${r.base} × ${r.mult} ＝ ${r.base*r.mult}！`:`「${r.name}」的份量不對喔。想想看：6 碗是 2 碗的幾倍？`)};
  draw();api.solve(()=>{rows.forEach((r,i)=>val[i]=r.base*r.mult);draw();fire(q('#rsOk'))});
},720)}

/* ---------- 淘金：左右晃動淘金盤，沙子流走、金子留下 ---------- */
function goldPan(title,lead){const GOLD=[[-52,-4],[-18,6],[14,-12],[46,4],[4,16]];let sd=7;
  const SAND=Array.from({length:44},(_,k)=>{sd=(sd*31+17)%97;return [(sd-48)*2.4,((sd*13)%44)-20]});
 return g2(title,'point',`<p class="lead">${lead}</p>
  <svg id="gpS" viewBox="0 0 900 400" style="width:100%;max-height:350px;border:4px solid ${INK};border-radius:16px;touch-action:none;display:block;background:#7FB3CC"></svg>
  <div class="row" style="justify-content:center;margin-top:8px"><span class="pill" id="gpN"></span></div>`,api=>{
  const {q}=api;const gone=new Set();let acc=0,lastX=null,drag=false;
  const left=()=>SAND.length-gone.size;
  const draw=()=>{q('#gpS').innerHTML=`<rect y="296" width="900" height="104" fill="#5B9BC2"/><path d="M0 330 q60 -12 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0" stroke="#A9CFDF" stroke-width="5" fill="none"/>
   <g id="gpP" transform="translate(450 250)"><ellipse rx="200" ry="66" fill="#8C6A4E" stroke="${INK}" stroke-width="7"/><ellipse cy="-8" rx="176" ry="50" fill="#6E523D"/>
   ${SAND.map((p,k)=>gone.has(k)?'':`<circle cx="${p[0]}" cy="${p[1]-8}" r="${5+k%4}" fill="#C9B085" style="transition:opacity .5s"/>`).join('')}
   ${GOLD.map(([x,y])=>`<path d="M${x} ${y-20} L${x+4} ${y-12} L${x+12} ${y-8} L${x+4} ${y-4} L${x} ${y+4} L${x-4} ${y-4} L${x-12} ${y-8} L${x-4} ${y-12}Z" fill="#E5C35A" stroke="${INK}" stroke-width="3"/>`).join('')}
   </g>`;
   q('#gpN').textContent=left()>0?`剩下的沙子：${left()}　（按住盤子，左右來回晃）`:'沙子淘光了，金子留下來了！'};
  const wash=n=>{const rem=SAND.map((_,k)=>k).filter(k=>!gone.has(k));
    for(let k=0;k<n&&rem.length;k++)gone.add(rem.splice(Math.floor(Math.random()*rem.length),1)[0]);
    draw();
    if(left()<=0){sWin();api.ok('沙子淘光了，金子留下來了！沙子比較輕會先被水沖走，金子比較重會留在盤子裡。',2800)}};
  const pt=e=>svgPt(q('#gpS'),e);
  q('#gpS').addEventListener('pointerdown',e=>{const p=pt(e);if(Math.hypot(p.x-450,p.y-250)<225){drag=true;lastX=p.x;try{q('#gpS').setPointerCapture(e.pointerId)}catch(_){}}});
  q('#gpS').addEventListener('pointermove',e=>{if(!drag)return;const p=pt(e);const dx=p.x-(lastX==null?p.x:lastX);lastX=p.x;acc+=Math.abs(dx);
    const g=q('#gpP');if(g)g.setAttribute('transform',`translate(450 250) rotate(${Math.max(-8,Math.min(8,dx*3))})`);
    if(acc>=190){acc=0;wash(6);tone([280+Math.random()*90],.05,'sine',.07)}});
  q('#gpS').addEventListener('pointerup',()=>{drag=false;lastX=null;const g=q('#gpP');if(g)g.setAttribute('transform','translate(450 250)')});
  draw();api.say('按住淘金盤，左右來回晃。');
  api.solve(()=>wash(44));
},920)}

/* ---------- 燈籠記憶：看怪盜X點亮燈籠的順序，照順序跟著點 ---------- */
function lanternSimon(title){const PITCH=[523,587,659,698,784];
 return g2(title,'gasp',`<p class="lead">怪盜X 一邊往階梯上跑，一邊點亮燈籠。仔細看他點亮的<b>順序</b>，然後照順序點一次！</p>
  <div class="smw" id="smG">${PITCH.map((p,i)=>`<button data-s="${i}">${lanternSvg(['#C86062','#D4BB49','#5B84AB','#8DB36E','#7E5FA3'][i])}</button>`).join('')}</div>
  <div class="row" style="justify-content:center"><span class="pill" id="smP">準備好了嗎？</span></div>`,api=>{
  const {q,qa}=api;const seq=shuffle([0,1,2,3,4]).slice(0,4);
  let idx=0,phase='watch',fails=0,solving=false;
  const lit=i=>{qa('#smG button').forEach((b,k)=>b.classList.toggle('lit',k===i));if(i!=null)tone([PITCH[i]],.15,'sine',.13)};
  const play=async()=>{if(api.over())return;phase='watch';idx=0;q('#smP').textContent=fails?'再看一次，這次慢慢看……':'看好了……';
    await sleep(750);if(api.over())return;const speed=fails>=2?820:540;
    for(const s of seq){lit(s);await sleep(speed);lit(null);await sleep(230);if(api.over())return}
    phase='input';q('#smP').textContent='換你了！照順序點燈籠'};
  q('#smG').onclick=e=>{const b=e.target.closest('[data-s]');if(!b||phase!=='input'||api.over())return;const s=+b.dataset.s;
    lit(s);setTimeout(()=>lit(null),260);
    if(s===seq[idx]){idx++;sPop();
      if(idx>=seq.length){phase='done';q('#smP').textContent='';api.ok('全部點對了！怪盜X 的腳步被我們記住了！',2000)}}
    else{fails++;sBad();phase='watch';q('#smP').textContent='順序不對！再看一次……';lockFor(play,1300)}};
  play();
  api.solve(async()=>{while(phase!=='input'&&!api.over())await sleep(200);if(api.over())return;
    for(const s of seq){if(api.over())return;fire(q(`#smG [data-s="${s}"]`));await sleep(230)}});
},920)}

/* ---------- 英文顏色字 ↔ 實驗杯（labBench 的 after 步驟） ---------- */
function wordToCups(api,o){const {q}=api;let sel=null;const done=new Set();let miss=0;
  q('#lbT').innerHTML='';q('#lbR').innerHTML='';q('#lbS').innerHTML=`<b>⑤ 英文顏色字卡</b>　先點一張字卡，再點顏色一樣的杯子。<small>跟著多叔唸：PINK、PURPLE、GREEN！</small>`;
  const cx=i=>150+i*300;
  const draw=()=>{q('#lbV').innerHTML=`<rect x="0" y="300" width="900" height="80" fill="#C9A878"/>`+o.cups.map((c,i)=>{const x=cx(i);
    return `<g data-cup="${i}" style="cursor:pointer"><path d="M${x-80} 120 L${x-62} 300 H${x+62} L${x+80} 120Z" fill="#FFFFFF" fill-opacity=".55" stroke="${INK}" stroke-width="6"/>
    <path d="M${x-72} 170 L${x-60} 296 H${x+60} L${x+72} 170Z" fill="${c.color}"/>
    <rect x="${x-70}" y="318" width="140" height="44" rx="10" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/><text x="${x}" y="349" text-anchor="middle" font-size="24" font-weight="900" fill="${INK}">${c.label}</text>
    ${done.has(i)?`<text x="${x}" y="96" text-anchor="middle" font-size="30" font-weight="700" fill="#2B79B5" font-family="Fredoka,sans-serif">${c.word}</text>`:''}</g>`}).join('');
    q('#lbT').innerHTML=o.cups.map((c,i)=>`<button class="labitem${sel===i?' on':''}" data-w="${i}" ${done.has(i)?'disabled style="opacity:.5"':''}><b style="font:700 22px var(--f-en)">${c.word}</b><span>${c.zh}</span></button>`).join('')};
  q('#lbT').onclick=e=>{const b=e.target.closest('[data-w]');if(!b||b.disabled)return;sel=+b.dataset.w;sPop();speak(o.cups[sel].word,'en-US');draw()};
  q('#lbV').onclick=e=>{const g=e.target.closest('[data-cup]');if(!g)return;
    if(sel===null){api.say('先點下面的一張英文卡。');return}
    const i=+g.dataset.cup;
    if(i===sel){done.add(i);sel=null;sGood();speak(o.cups[i].word,'en-US');draw();api.say('配對成功！','ok');
      if(done.size===o.cups.length)api.ok(o.okMsg,2000)}
    else{miss++;sBad();shake(g);api.no(miss>=2?`提示：${o.cups[sel].zh}的英文是 ${o.cups[sel].word}，找找看那個顏色的杯子！`:'顏色不一樣，再想想看！')}};
  draw();
  api.solve(()=>{o.cups.forEach((c,i)=>{fire(q(`#lbT [data-w="${i}"]`));fire(q(`#lbV [data-cup="${i}"]`))})});
}

/* ================= 第三章 太魯閣 的新玩法 ================= */

/* ---------- 冒泡分類：先猜哪些白色東西遇醋會冒泡，再滴醋驗證 ---------- */
function fizzSort(title,lead,items,okMsg){return g2(title,'think',`<p class="lead">${lead}</p>
  <div class="sbitems" id="fzI">${items.map((it,i)=>`<button class="sbit" data-i="${i}">${ico(it[1],38)}<span>${it[0]}</span></button>`).join('')}</div>
  <div class="sbbaskets" id="fzB">${['我猜：會冒泡','我猜：不會冒泡'].map((b,k)=>`<div class="sbb" data-b="${k}"><b>${b}</b><div class="sbin" id="fzS${k}"></div></div>`).join('')}</div>
  <div class="row" style="justify-content:center;margin-top:8px"><button class="btn c" id="fzGo" disabled>🧪 滴醋，看結果！</button></div>`,api=>{
  const {q}=api;const put=items.map(()=>-1);let sel=null,phase='sort';
  const drawBins=()=>{[0,1].forEach(k=>{q('#fzS'+k).innerHTML=items.map((it,i)=>put[i]===k?ico(it[1],30):'').join('')});
    items.forEach((it,i)=>q(`.sbit[data-i="${i}"]`).style.opacity=put[i]>=0?.45:1)};
  q('#fzI').onclick=e=>{const b=e.target.closest('.sbit');if(!b||phase!=='sort'||put[+b.dataset.i]>=0)return;sel=+b.dataset.i;api.qa('.sbit').forEach(x=>x.classList.toggle('on',x===b));sPop()};
  q('#fzB').onclick=e=>{const bk=e.target.closest('.sbb');if(!bk||phase!=='sort'||sel===null)return;
    put[sel]=+bk.dataset.b;sel=null;sPop();drawBins();
    if(put.every(v=>v>=0)){q('#fzGo').disabled=false;api.say('分好了！現在滴醋，看看真正的結果。')}};
  q('#fzGo').onclick=()=>{phase='fizz';sWin();
    const right=items.filter((it,i)=>put[i]===(it[2]?0:1)).length;
    q('#fzB').outerHTML=items.map((it,i)=>`<div class="rsrow" style="margin:6px 0"><b>${it[1]} ${it[0]}</b><small>你的猜測：${put[i]===0?'會冒泡':'不會冒泡'}</small><span class="rsp" style="font-weight:900;font-size:20px;color:${it[2]?'#2B79B5':'#8A8F98'}">${it[2]?'🫧 冒泡泡了！':'安安靜靜'}</span></div>`).join('')+
      `<div class="row" style="justify-content:center;margin-top:10px"><button class="btn c" id="fzOk">寫進科學筆記</button></div>`;
    q('#fzI').innerHTML='';q('#fzGo').hidden=true;
    api.say(`你猜對了 ${right}/${items.length} 個！${right===items.length?'太厲害了！':'沒關係，做實驗就是為了知道真正的答案。'}`);
    q('#fzOk').onclick=()=>api.ok(okMsg,3200)};
  api.solve(()=>{items.forEach((it,i)=>{fire(q(`.sbit[data-i="${i}"]`));fire(q(`.sbb[data-b="${it[2]?0:1}"]`))});fire(q('#fzGo'));fire(q('#fzOk'))});
},860)}

/* ---------- 翻牌配對（自訂卡面）：材料 ↔ 滴醋後的樣子 ---------- */
function flipPair(title,lead,pairs,okMsg){return g2(title,'think',`<p class="lead">${lead}</p>
  <div class="fmg" id="fpG" style="grid-template-columns:repeat(5,1fr)"></div>`,api=>{
  const {q}=api;const cards=shuffle(pairs.flatMap((p,i)=>[{k:i,h:p[0]},{k:i,h:p[1]}]));let open=[],lock=false,done=0;
  const draw=()=>{q('#fpG').innerHTML=cards.map((c,i)=>`<button data-i="${i}" class="${c.up||c.ok?'open':''}${c.ok?' done':''}" style="aspect-ratio:3/3.4"><span class="bk">🔍</span><span class="ft">${c.h}</span></button>`).join('')};
  q('#fpG').onclick=e=>{const b=e.target.closest('[data-i]');if(!b||lock)return;const c=cards[+b.dataset.i];if(c.ok||c.up)return;
    c.up=1;open.push(c);sPop();draw();
    if(open.length===2){const [a,b2]=open;
      if(a.k===b2.k){a.ok=b2.ok=1;done++;sGood();open=[];api.say('配對成功！','ok');if(done===pairs.length)api.ok(okMsg,1800)}
      else{lock=true;sBad();api.say('不一樣，蓋回去。記住位置，再試一次！');lockFor(()=>{a.up=b2.up=0;open=[];lock=false;draw()},1000)}}};
  draw();api.solve(()=>{pairs.forEach((p,k)=>{cards.forEach((c,i)=>{if(c.k===k&&!c.up&&!c.ok)fire(q(`#fpG [data-i="${i}"]`))})})});
},920)}

/* ---------- 平分＋挖一挖：12 樣平分到 3 個洞，再挖出秘密 ---------- */
function digDiv(title,lead,okMsg){const N=12,COL=['#C86062','#D4BB49','#5B84AB','#8DB36E'];
 return g2(title,'point',`<p class="lead">${lead}</p>
  <svg id="ddS" viewBox="0 0 900 300" style="width:100%;max-height:290px;border:4px solid ${INK};border-radius:16px;display:block;background:#D9C7A3;touch-action:none"></svg>
  <div class="row" style="justify-content:center;margin-top:8px"><span class="pill" id="ddP"></span></div>
  <div class="row" id="ddR" style="justify-content:center"></div>`,api=>{
  const {q}=api;const HX=[200,450,700],HY=228;const cnt=[0,0,0];const st=Array(N).fill(-1);let sel=null,phase='div',dug=0;
  const stones=Array.from({length:N},(_,k)=>[70+(k%6)*58,52+Math.floor(k/6)*52,COL[k%4]]);
  const mound=s=>`<g transform="translate(450 210) scale(${s})"><ellipse rx="86" ry="34" fill="#B9A58C" stroke="${INK}" stroke-width="5"/><ellipse cx="-20" cy="-8" rx="26" ry="10" fill="#C9B085"/><ellipse cx="26" cy="-4" rx="18" ry="8" fill="#C9B085"/></g>`;
  const statue=`<g transform="translate(450 176)"><path d="M-14 34 Q-20 -10 0 -18 Q20 -10 14 34Z" fill="#DADCDA" stroke="${INK}" stroke-width="4"/><path d="M0 -18 q-8 -20 6 -30" stroke="#DADCDA" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M6 -48 l20 4 l-20 7z" fill="#3A3A40"/><path d="M-4 -40 l-18 -10 l4 10 l-4 10z" fill="#B9BCBA"/></g>`;
  const draw=()=>{let s=`<rect y="120" width="900" height="180" fill="#C9B085"/>`;
    if(phase==='div'){s+=stones.map((t,k)=>st[k]>=0?'':(sel===k?`<g transform="translate(${t[0]} ${t[1]})"><circle r="22" fill="none" stroke="#E8E19E" stroke-width="6"/><circle r="14" fill="${t[2]}" stroke="${INK}" stroke-width="3"/></g>`:`<g data-s="${k}" style="cursor:pointer"><circle cx="${t[0]}" cy="${t[1]}" r="14" fill="${t[2]}" stroke="${INK}" stroke-width="3"/></g>`)).join('')}
    s+=HX.map((x,i)=>`<g data-h="${i}" style="cursor:pointer"><ellipse cx="${x}" cy="${HY}" rx="72" ry="30" fill="#8A6F4D" stroke="${INK}" stroke-width="5"/><ellipse cx="${x}" cy="${HY}" rx="54" ry="20" fill="#5F4A33"/><text x="${x}" y="${HY+64}" text-anchor="middle" font-size="24" font-weight="900" fill="${INK}" font-family="Fredoka,sans-serif">${cnt[i]}/4</text></g>`).join('');
    if(phase==='dig'&&dug<6)s+=mound(1-dug/7);
    if(phase==='dig'&&dug>=6)s+=statue;
    if(phase==='fizz')s+=statue+Array.from({length:10},(_,k)=>`<circle class="bub" style="animation-delay:${k*.12}s" cx="${420+(k*23)%60}" cy="${140-(k*17)%50}" r="${4+k%4}" fill="none" stroke="#8DB36E" stroke-width="3"/>`).join('');
    q('#ddS').innerHTML=s;
    q('#ddP').textContent=phase==='div'?'把 12 顆小石頭「平分」到 3 個洞：點石頭，再點洞（每洞 4 顆）':phase==='dig'?'12 ÷ 3 ＝ 4，每洞一樣多！點中間的土堆挖挖看！':'🫧 大理石做的！';
    q('#ddR').innerHTML=phase==='dig'&&dug>=6?`<button class="btn c" id="ddV">🧪 滴醋驗貨</button>`:''};
  q('#ddS').onclick=e=>{const g=e.target.closest('[data-s],[data-h]');if(!g)return;
    if(g.dataset.s!=null){if(phase!=='div')return;sel=+g.dataset.s;sPop();draw();return}
    const h=+g.dataset.h;
    if(phase==='div'){if(sel===null){api.say('先點一顆小石頭。');return}
      if(cnt[h]>=4){api.no('這個洞滿了！每個洞要一樣多。');return}
      cnt[h]++;st[sel]=h;sel=null;sPop();
      if(st.every(v=>v>=0)){phase='dig';sWin();api.say('平分好了！12 ÷ 3 ＝ 4。現挖土堆！')}draw();return}
    if(phase==='dig'){if(h!==1)return;dug++;tone([300+dug*30],.05,'sine',.08);draw();
      if(dug>=6){sGood();api.say('挖到東西了！是一座燕子雕像……敲敲看是什麼材料？')}}};
  q('#ddR').onclick=e=>{if(!e.target.closest('#ddV'))return;phase='fizz';sWin();draw();
    lockFor(()=>api.ok(okMsg,3000),1400)};
  draw();
  api.solve(()=>{for(let k=0;k<N;k++){fire(q(`#ddS [data-s="${k}"]`));fire(q(`#ddS [data-h="${k%3}"]`))}
    for(let k=0;k<6;k++)fire(q('#ddS [data-h="1"]'));fire(q('#ddV'))});
},920)}

/* ---------- 邏輯推理格：✓ ✗ 推出誰走哪條步道 ---------- */
function logicGrid(title,lead,people,trails,clues,sol,okMsg){return g2(title,'think',`<p class="lead">${lead}</p>
  <div class="mgrid" style="align-items:start"><div><div class="story"><b>線索：</b><ul style="margin:6px 0 0;padding-left:22px;line-height:1.9;font-size:18px">${clues.map(c=>`<li>${c}</li>`).join('')}</ul></div>
  <div class="story" style="margin-top:10px;background:#FFF6D8">每個人走一條不同的步道。點格子可以切換：？→ ✓ → ✗。</div></div>
  <div><div class="lg" id="lgG"><div class="lgh"></div>${trails.map(t=>`<div class="lgh">${t}</div>`).join('')}${people.map((p,pi)=>`<div class="lgh">${p}</div>${trails.map((_,ti)=>`<button class="lgc" data-p="${pi}" data-t="${ti}">？</button>`).join('')}`).join('')}</div>
  <div class="row" style="justify-content:center;margin-top:10px"><button class="btn c" id="lgOk">推理好了</button></div></div></div>`,api=>{
  const {q,qa}=api;const mark={};let miss=0;
  q('#lgG').onclick=e=>{const b=e.target.closest('.lgc');if(!b)return;const k=b.dataset.p+'-'+b.dataset.t;
    mark[k]=mark[k]==null?'✓':mark[k]==='✓'?'✗':null;
    b.textContent=mark[k]||'？';b.className='lgc'+(mark[k]==='✓'?' on':mark[k]==='✗'?' off':'');sPop()};
  q('#lgOk').onclick=()=>{let bad=null;
    people.forEach((_,pi)=>trails.forEach((_,ti)=>{const m=mark[pi+'-'+ti];if((sol[pi]===ti)?m!=='✓':m==='✓')bad=[pi,ti]}));
    if(!bad){sWin();api.ok(okMsg,3000)}
    else{miss++;sBad();shake(q(`[data-p="${bad[0]}"][data-t="${bad[1]}"]`));
      api.no(miss>=2?'提示：先用「獼猴巡山員走燕子口」，再想想剩下兩個人怎麼分。':'有格子跟線索矛盾，再想想看！')}};
  api.solve(()=>{people.forEach((_,pi)=>trails.forEach((_,ti)=>{const b=q(`[data-p="${pi}"][data-t="${ti}"]`);mark[pi+'-'+ti]=sol[pi]===ti?'✓':'✗';b.textContent=mark[pi+'-'+ti];b.className='lgc'+(sol[pi]===ti?' on':' off')}));fire(q('#lgOk'))});
},900)}

/* ---------- 詞語填字：依序點出紅框字，拼出答案 ---------- */
function charPick(title,lead,cards,ans,okMsg){return g2(title,'think',`<p class="lead">${lead}</p>
  <div class="row" id="cpC" style="justify-content:center">${cards.map((c,i)=>`<button class="cpcard" data-i="${i}"><b>${c[0]}</b><span class="cpchar">${c[1]}</span></button>`).join('')}</div>
  <div class="cslots" id="cpS">${ans.split('').map(()=>'<button>？</button>').join('')}</div>
  <div class="row" style="justify-content:center;margin-top:10px"><button class="btn w" id="cpR">重來</button><button class="btn c" id="cpOk">拼好了</button></div>`,api=>{
  const {q,qa}=api;const picked=[];let miss=0;
  const draw=()=>{qa('#cpS button').forEach((s,k)=>s.textContent=picked[k]!=null?cards[picked[k]][1]:'？')};
  q('#cpC').onclick=e=>{const b=e.target.closest('.cpcard');if(!b||b.disabled)return;
    if(picked.length>=ans.length){api.say('四個格子滿了，點格子可以把字放回去。');return}
    picked.push(+b.dataset.i);b.disabled=true;b.style.opacity=.4;sPop();draw()};
  q('#cpS').onclick=e=>{const s=e.target.closest('button');if(!s)return;const k=[...q('#cpS').children].indexOf(s);if(k>=picked.length)return;
    const b=q(`#cpC [data-i="${picked[k]}"]`);if(b){b.disabled=false;b.style.opacity=1}picked.splice(k,1);sPop();draw()};
  q('#cpR').onclick=()=>{picked.length=0;qa('#cpC .cpcard').forEach(b=>{b.disabled=false;b.style.opacity=1});draw()};
  q('#cpOk').onclick=()=>{if(picked.length<ans.length){api.say('還沒選滿四個字。');return}
    if(picked.map(i=>cards[i][1]).join('')===ans){sWin();api.ok(okMsg,2600)}
    else{miss++;sBad();shake(q('#cpS'));api.no(miss>=2?'提示：按照紙條上四個詞的順序：梅花鹿、野生動物、高山、台灣。':'順序不對，再念念看紙條上的四個詞。')}};
  draw();api.solve(()=>{ans.split('').forEach(ch=>fire(q(`#cpC [data-i="${cards.findIndex(c=>c[1]===ch)}"]`)));fire(q('#cpOk'))});
},840)}

/* ---------- 拍照取證：燕子飛進圈圈時按快門 ---------- */
function photoSnap(title,lead,need){return g2(title,'point',`<p class="lead">${lead}</p>
  <svg id="phS" viewBox="0 0 900 420" style="width:100%;max-height:340px;border:4px solid ${INK};border-radius:16px;display:block;background:#BFD9E6"></svg>
  <div class="row" style="justify-content:center;margin-top:8px"><span class="pill" id="phN"></span><button class="btn c" id="phB" style="min-width:190px">📸 快門！</button></div>`,api=>{
  const {q}=api;let birds=[],caught=0,raf,next=performance.now()+500;
  const mk=()=>({x:Math.random()<.5?-60:960,y:80+Math.random()*230,v:(Math.random()<.5?1:-1)*(1.7+Math.random()*1.5),w:Math.random()*10});
  const bird=p=>`<g transform="translate(${p.x} ${p.y}) scale(${p.v>0?1:-1} 1)"><path d="M-6 4 L-28 -6 L-21 4 L-28 14Z" fill="#34405F"/><ellipse rx="14" ry="8" fill="#34405F"/><ellipse cx="4" cy="4" rx="9" ry="5" fill="#F4EEE6"/><circle cx="12" cy="-4" r="4.5" fill="#C86062"/><path d="M15 -3 l12 2.5 l-12 3.5z" fill="#3A3A40"/><path d="M-2 -6 q${p.w%2?10:-10} -14 ${p.w%2?20:2} -6" stroke="#34405F" stroke-width="4.5" fill="none" stroke-linecap="round"/></g>`;
  const drawBG=()=>`<rect width="900" height="420" fill="#BFD9E6"/><path d="M0 330 Q200 300 400 330 T900 320 V420 H0Z" fill="#DADCDA"/><path d="M620 420 L700 170 H770 L700 420Z" fill="#D0D3D1"/><path d="M640 240 h84 M652 200 h60" stroke="#B9BCBA" stroke-width="5"/>`;
  const loop=now=>{if(api.over())return;
    if(now>next){birds.push(mk());next=now+850+Math.random()*900}
    birds.forEach(b=>{b.x+=b.v;b.w+=.35});
    birds=birds.filter(b=>b.x>-100&&b.x<1000);
    q('#phS').innerHTML=drawBG()+birds.map(bird).join('')+
      `<circle cx="450" cy="205" r="95" fill="none" stroke="#C86062" stroke-width="6" stroke-dasharray="14 10"/><path d="M450 124 v-22 M450 286 v22 M369 205 h-22 M531 205 h22" stroke="#C86062" stroke-width="5"/>`;
    q('#phN').textContent=`拍到的燕子：${caught}/${need}`;
    raf=requestAnimationFrame(loop);T2.push(raf)};
  q('#phB').onclick=()=>{const hit=birds.find(b=>Math.hypot(b.x-450,b.y-205)<100);
    if(hit){birds.splice(birds.indexOf(hit),1);caught++;sGood();q('#phS').style.filter='brightness(1.7)';setTimeout(()=>{if(!api.over())q('#phS').style.filter=''},130);
      if(caught>=need)api.ok('拍到了！燕子口的照片一清二楚。',2000)}
    else{sBad();api.say('沒拍到……等燕子飛進紅色圈圈裡再按快門！')}};
  raf=requestAnimationFrame(loop);T2.push(raf);
  api.solve(()=>{const t=setInterval(()=>{if(api.over()){clearInterval(t);return}
    if(birds.some(b=>Math.hypot(b.x-450,b.y-205)<100))fire(q('#phB'))},120);T2.push(t)});
},920)}

/* ---------- 連連看：英文單字連到圖案 ---------- */
function matchPair(title,lead,pairs,okMsg){return g2(title,'think',`<p class="lead">${lead}</p>
  <div class="mp" id="mpG"><div>${pairs.map((p,i)=>`<button class="mpw" data-k="${i}"><b>${p[0]}</b><small>${p[2]}</small></button>`).join('')}</div>
  <div>${shuffle(pairs.map((p,i)=>({k:i,h:p[1]}))).map(c=>`<button class="mpi" data-k="${c.k}">${c.h}</button>`).join('')}</div></div>`,api=>{
  const {q,qa}=api;let selW=null,done=0;
  q('#mpG').onclick=e=>{const w=e.target.closest('.mpw');
    if(w){if(w.classList.contains('done'))return;selW=+w.dataset.k;qa('.mpw').forEach(x=>x.classList.toggle('on',x===w));sPop();speak(pairs[selW][0],'en-US');return}
    const im=e.target.closest('.mpi');if(!im||im.classList.contains('done'))return;
    if(selW===null){api.say('先點左邊的英文單字。');return}
    if(+im.dataset.k===selW){im.classList.add('done');q(`.mpw[data-k="${selW}"]`).classList.add('done');selW=null;sGood();done++;
      if(done===pairs.length)api.ok(okMsg,1800)}
    else{sBad();shake(im);api.no('圖案跟單字不一樣，再想想看！')}};
  api.solve(()=>{pairs.forEach((p,i)=>{fire(q(`.mpw[data-k="${i}"]`));fire(q(`.mpi[data-k="${i}"]`))})});
},840)}

/* ---------- 成語接龍：用前一個成語的最後一個字開頭 ---------- */
function idiomChain(title,lead,rounds,okMsg){return g2(title,'think',`<p class="lead">${lead}</p>
  <div class="story" style="text-align:center;font-size:28px;font-family:var(--f-hand)" id="icC"></div>
  <div class="story" style="background:#FFF6D8" id="icQ"></div>
  <div class="row" id="icO" style="justify-content:center;margin-top:4px"></div>`,api=>{
  const {q}=api;let i=0,miss=0,solving=false;
  const show=()=>{const r=rounds[i];q('#icC').innerHTML=`「${r.cur}」`;
    q('#icQ').innerHTML=`第 ${i+1} 棒：下一個成語要用 <b>「${r.cur[r.cur.length-1]}」</b> 開頭！`;
    q('#icO').innerHTML=shuffle(r.opts.map(o=>({o,ok:o===r.ans}))).map(x=>`<button class="btn w" data-ok="${x.ok?1:0}" style="min-width:180px;font-family:var(--f-hand);font-size:27px">${x.o}</button>`).join('')};
  q('#icO').onclick=e=>{const b=e.target.closest('[data-ok]');if(!b)return;
    if(b.dataset.ok==='1'){b.style.background='#D3E4C7';sGood();i++;
      if(i>=rounds.length){q('#icQ').textContent='';api.ok(okMsg,2400)}else lockFor(show,1100)}
    else{miss++;sBad();shake(b);api.no(miss>=2?`提示：要找「${rounds[i].cur[rounds[i].cur.length-1]}」開頭的成語！`:'接錯囉！看看前一個成語的「最後一個字」。')}};show();
  api.solve(()=>{if(solving)return;solving=true;const go=()=>{if(api.over()||i>=rounds.length)return;const b=q('#icO [data-ok="1"]');
    if(b){fire(b);setTimeout(go,1300)}else setTimeout(go,400)};go()});
},760)}

/* ---------- 天平秤重：秤兩次找出比較輕的塑膠假貨 ---------- */
function balanceFind(title,lead,okMsg){return g2(title,'hmm',`<p class="lead">${lead}</p>
  <svg id="bfS" viewBox="0 0 900 330" style="width:100%;max-height:290px;display:block"></svg>
  <div class="row" id="bfB" style="justify-content:center;margin-top:6px;flex-wrap:wrap"></div>`,api=>{
  const {q}=api;const fake=Math.floor(Math.random()*4);const pan=[null,null];let weigh=0,accuse=false,miss=0;const res=[];
  const swSt=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12 26 Q-17 -8 0 -15 Q17 -8 12 26Z" fill="#DADCDA" stroke="${INK}" stroke-width="3.5"/><path d="M0 -15 q-7 -18 5 -27" stroke="#DADCDA" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M5 -42 l17 3.5 l-17 6z" fill="#3A3A40"/><path d="M-3 -34 l-15 -9 l3.5 9 l-3.5 9z" fill="#B9BCBA"/></g>`;
  const draw=()=>{const tip=res.length?res[res.length-1][2]:0;
    q('#bfS').innerHTML=`<rect y="296" width="900" height="34" fill="#C9B085"/>
    <g transform="rotate(${tip*-4} 450 46)"><path d="M450 46 V296" stroke="${INK}" stroke-width="10"/><path d="M140 46 H760" stroke="${INK}" stroke-width="10"/>
    <path d="M140 46 L120 ${180+ (tip<0?24:0)} M140 46 L160 ${180+(tip<0?24:0)}" stroke="${INK}" stroke-width="4"/><path d="M760 46 L740 ${180+(tip>0?24:0)} M760 46 L780 ${180+(tip>0?24:0)}" stroke="${INK}" stroke-width="4"/>
    ${[0,1].map(i=>{const px=i?760:140,py=190+(i? (tip>0?26:0):(tip<0?26:0));return `<g transform="translate(${px} ${py})"><path d="M-92 0 A92 30 0 0 0 92 0Z" fill="#8C6A4E" stroke="${INK}" stroke-width="5"/>${pan[i]!=null?swSt(0,-14,1.15):''}</g>`}).join('')}</g>
    <text x="450" y="30" text-anchor="middle" font-size="22" font-weight="900" fill="${INK}">⚖️ 真正的燕子雕像是大理石，比較重；假貨是塑膠，比較輕</text>`;
    q('#bfB').innerHTML=[0,1,2,3].map(i=>`<button class="tool" data-s="${i}" style="font-size:19px;min-height:52px;${accuse?'background:#FFF6D8;border-color:#C86062':''}">${'ABCD'[i]} 號${pan[0]===i?' ⬅左盤':pan[1]===i?' ⬅右盤':''}</button>`).join('')+
      (accuse?'':'<button class="btn w" id="bfW" '+(weigh>=2||pan[0]==null||pan[1]==null?'disabled':'')+'>秤！（還能秤 '+(2-weigh)+' 次）</button>')+
      (weigh>0&&!accuse?'<button class="btn c" id="bfA">我要指認假貨</button>':'')};
  q('#bfB').onclick=e=>{const b=e.target.closest('[data-s]');if(b){const i=+b.dataset.s;
    if(accuse){if(i===fake){sWin();api.ok(okMsg,2800)}
      else{miss++;sBad();shake(b);api.no(miss>=2?'提示：回想哪一盤比較輕——輕的那一盤裡面就是假貨！':'不是這一座。想想看，哪一盤「比較輕」？')}return}
    if(pan[0]===i)pan[0]=null;else if(pan[1]===i)pan[1]=null;else if(pan[0]==null)pan[0]=i;else if(pan[1]==null)pan[1]=i;else{api.say('兩個盤都有東西了，再點一次可以拿下來。');return}
    sPop();draw();return}
    if(e.target.closest('#bfW')){weigh++;const L=pan[0],R=pan[1],lr=(L===fake)?-1:(R===fake)?1:0;res.push([L,R,lr]);
      if(lr===0)api.say('⚖️ 平衡！假貨在「沒有上桌」的雕像裡。');
      else api.say(lr<0?'⚖️ 左盤翹起來了——左盤比較輕！':'⚖️ 右盤比較輕！');
      sPop();draw();return}
    if(e.target.closest('#bfA')){accuse=true;api.say('好，直接點一座你認為是假的雕像！');draw()}};
  draw();
  api.solve(()=>{pan[0]=0;pan[1]=1;draw();fire(q('#bfW'));
    if(res[0][2]===0){pan[0]=2;pan[1]=3;draw();fire(q('#bfW'))}
    const last=res[res.length-1];accuse=true;
    fire(q(`#bfB [data-s="${last[2]<0?last[0]:last[1]}"]`))});
},920)}

/* ---------- 吊橋平衡：左右按住保持平衡走過吊橋 ---------- */
function bridgeBal(title){return g2(title,'run',`<p class="lead">吊橋搖搖晃晃！按住「◀ 左傾 / 右傾 ▶」幫多叔保持平衡、走到對岸。歪太多會跌一跤（不會失敗，風會變小）。</p>
  <svg id="bbS" viewBox="0 0 900 380" style="width:100%;max-height:330px;border:4px solid ${INK};border-radius:16px;display:block;background:#BFD9E6"></svg>
  <div class="row" style="justify-content:center;margin-top:10px"><button class="btn w" id="bbL" style="min-width:160px;min-height:66px;font-size:23px;touch-action:none">◀ 左傾</button><span class="pill" id="bbN"></span><button class="btn w" id="bbR" style="min-width:160px;min-height:66px;font-size:23px;touch-action:none">右傾 ▶</button></div>`,api=>{
  const {q}=api;let tilt=0,prog=0,hold=0,stumble=0,raf,last=performance.now();
  const on=(el,v)=>{const d=e=>{e.preventDefault();hold=v};const u=()=>{if(hold===v)hold=0};
    el.addEventListener('pointerdown',d);['pointerup','pointerleave','pointercancel'].forEach(ev=>el.addEventListener(ev,u))};
  on(q('#bbL'),-1);on(q('#bbR'),1);
  const deckY=x=>236-Math.sin(Math.max(0,Math.min(1,(x-60)/780))*Math.PI)*62;
  const loop=now=>{if(api.over())return;last=now;
    const w=stumble>=2?.22:.5;tilt+=(Math.random()-.5)*w+hold*.95-tilt*.025;
    tilt=Math.max(-42,Math.min(42,tilt));
    if(Math.abs(tilt)>32){stumble++;sBad();tilt=tilt>0?11:-11;prog=Math.max(0,prog-4);
      api.say(stumble>=2?'沒關係，風變小了，慢慢調整！':'差點跌下去！快往反方向按！')}
    else prog=Math.min(100,prog+.06);
    const dx=110+prog*6.8;
    let s=`<rect width="900" height="380" fill="#BFD9E6"/><path d="M0 310 Q450 280 900 310 V380 H0Z" fill="#8FA2B3"/><path d="M0 0 H60 V310 H0Z M840 0 H900 V310 H840Z" fill="#DADCDA"/>`;
    s+=`<path d="M60 236 Q450 174 840 236" stroke="#A57E5E" stroke-width="15" fill="none"/><path d="M60 210 Q450 148 840 210" stroke="#B5432F" stroke-width="6" fill="none"/>`;
    s+=`${[150,270,390,510,630,750].map(x=>`<line x1="${x}" y1="${deckY(x)}" x2="${x}" y2="${deckY(x)-26}" stroke="#8C6A4E" stroke-width="4"/>`).join('')}`;
    s+=`<path d="M770 60 l34 9 l-34 9z" fill="#C86062" opacity="${.35+Math.abs(tilt)/70}"/><text x="787" y="94" text-anchor="middle" font-size="16" font-weight="900" fill="${INK}">風</text>`;
    s+=`<g transform="translate(${dx} ${deckY(dx)-4}) rotate(${tilt/3})"><image href="${COAT.coat_pocket.b}" x="${-62*COAT.coat_pocket.r}" y="-168" width="${150*COAT.coat_pocket.r}" height="168"/></g>`;
    q('#bbS').innerHTML=s;q('#bbN').textContent=`過橋進度：${Math.floor(prog)}%`;
    if(prog>=100){api.ok('走到對岸了！平衡感一流！',2000);return}
    raf=requestAnimationFrame(loop);T2.push(raf)};
  raf=requestAnimationFrame(loop);T2.push(raf);
  api.solve(()=>{prog=100});
},960)}

/* ---------- 數線標記（獨立版，給非實驗台的關卡用） ---------- */
function numLineSolo(title,lead,o){return g2(title,'think',`<p class="lead">${lead}</p>
  <div class="labstep" id="lbS"></div><svg id="lbV" viewBox="0 0 900 380" style="width:100%;max-height:300px;display:block;touch-action:none"></svg>
  <div class="labtray" id="lbT" style="justify-content:center"></div><div class="row" id="lbR" style="justify-content:center"></div>`,api=>{numberLine(api,o)},940)}
