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
    const st={phase:'predict',guess:null,need:c.place.map(p=>p.slice()),sel:null,cups:c.cups.map(x=>({label:x.label,items:[],color:x.color||'#D9EEF5'})),prog:0,done:false};
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
    const setup=()=>{st.phase='setup';step(`<b>② 放材料</b>　${c.setupTip}<small>先點右邊的材料，再點杯子。</small>`);
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
    q('#lbV').addEventListener('click',e=>{if(st.phase!=='setup')return;const g=e.target.closest('[data-cup]');if(!g)return;if(!st.sel){api.say('先點一樣材料。');return}
      const i=+g.dataset.cup,k=st.need.findIndex(p=>p[0]===st.sel&&p[1]===i);
      if(k<0){api.no(c.wrongPlace||'這個杯子不用放這個喔。');return}
      st.need.splice(k,1);st.cups[i].items.push(c.tray.find(t=>t[0]===st.sel)[1]);sPop();drawCups();api.say('');if(!st.need.length)act()});
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
    const jump=()=>{if(y===0){vy=.95;tone([520,660],.05)}};
    q('#wrJ').onclick=jump;q('#wrS').addEventListener('pointerdown',jump);
    const loop=now=>{const dt=Math.min(40,now-last);last=now;next-=dt;
      if(next<=0){waves.push({x:1040});next=1100+Math.random()*900}
      if(y>0||vy>0){y+=vy*dt*.55;vy-=.0042*dt;if(y<=0){y=0;vy=0}}
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
