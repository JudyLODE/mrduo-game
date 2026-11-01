/* 小遊戲元件（第一案用到的所有玩法）、過場、委託卡、章節結算、線索板。 */
"use strict";
/* ================= MINIGAME: guided vertical multiplication ================= */
const PN=['個位','十位','百位','千位'];
function mathLock(probs){
  return new Promise(res=>{
    let pi=0;
    modal(`<div class="card" data-duo="think"><div class="row" style="justify-content:space-between"><h3>電梯密碼鎖</h3><div class="locks" id="lk">${probs.map(()=>'<i>🔒</i>').join('')}</div></div>
      <div class="mgrid"><div><div class="story" id="mStory"></div><div id="mVf"></div></div>
      <div><div class="prompt" id="mPrompt"></div><div class="ans" id="mAns"></div><div class="pad" id="mPad"></div><div class="fb" id="mFb"></div></div></div></div>`,b=>{
      const q=s=>b.querySelector(s);
      q('#mPad').innerHTML=['7','8','9','4','5','6','1','2','3','del','0','ok'].map(k=>`<button data-k="${k}" class="${k==='ok'?'ok':k==='del'?'del':''}">${k==='del'?'刪除':k==='ok'?'確定':k}</button>`).join('');
      let a,bb,ds,i,c,resd,car,val='',miss=0,N;
      function start(){const p=probs[pi];a=p.a;bb=p.b;ds=String(a).split('').reverse().map(Number);i=0;c=0;resd=[];car=[];miss=0;N=String(a*bb).length;
        q('#mStory').innerHTML=fmt(p.q);render()}
      function vf(){const cell=(t,cl='')=>`<span class="vc ${cl}">${t}</span>`;let h=`<div class="vf" style="grid-template-columns:repeat(${N+1},1.2em)">`;
        h+=cell('');for(let p=N-1;p>=0;p--)h+=cell(car[p]||'','cr');
        h+=cell('');for(let p=N-1;p>=0;p--)h+=cell(ds[p]!==undefined?ds[p]:'',p===i?'hl':'');
        h+=cell('×');for(let p=N-1;p>=0;p--)h+=cell(p===0?bb:'');
        h+='<span class="vl" style="grid-column:1/-1"></span>';
        h+=cell('');for(let p=N-1;p>=0;p--)h+=cell(resd[p]!==undefined?resd[p]:'','rs'+(p===i?' hl':''));return h+'</div>'}
      function render(){q('#mVf').innerHTML=vf();val='';q('#mAns').textContent='';
        if(i<ds.length){const d=ds[i];q('#mPrompt').innerHTML=`${PN[i]}：${d} × ${bb}${c?` ＋ 進位 ${c}`:''} ＝ ？`}
        q('#mFb').textContent='';q('#mFb').className='fb'}
      function check(){if(val==='')return;const d=ds[i],want=d*bb+c;
        if(+val===want){sGood();const last=i===ds.length-1;
          if(last){String(want).split('').reverse().forEach((x,j)=>resd[i+j]=x)}else{resd[i]=String(want%10);c=Math.floor(want/10);if(c)car[i+1]=c}
          if(!last&&want<10)c=0;
          i++;miss=0;
          if(i>=ds.length){q('#mVf').innerHTML=vf();q('#mPrompt').innerHTML=`答案：${a} × ${bb} ＝ <span style="color:#2B79B5">${a*bb}</span>`;q('#mAns').textContent='';
            q('#mFb').textContent='密碼正確！';q('#mFb').className='fb ok';q('#lk').children[pi].className='on';q('#lk').children[pi].textContent='🔓';sWin();
            lockFor(()=>{pi++;if(pi<probs.length)start();else{closeModal();res()}},1600)}
          else{render();if(c){q('#mFb').textContent=`滿十進位！把 ${c} 寫到${PN[i]}上面。`;q('#mFb').className='fb ok'}}}
        else{sBad();miss++;shake(q('#mAns'));val='';q('#mAns').textContent='';
          q('#mFb').textContent=miss===1?`再算一次：先想 ${ds[i]} × ${bb} 是多少${c?`，再加上進位的 ${c}`:''}。`:`提示：${ds[i]} × ${bb} ＝ ${ds[i]*bb}${c?`，${ds[i]*bb} ＋ ${c} ＝ ？`:''}`;q('#mFb').className='fb no'}}
      q('#mPad').onclick=e=>{const k=e.target.closest('button');if(!k)return;const v=k.dataset.k;
        if(v==='ok')return check();if(v==='del')val=val.slice(0,-1);else if(val.length<3)val+=v;tone([520],.04,'sine',.08);q('#mAns').textContent=val};
      start();
    });
  });
}

/* ================= MINIGAME: hangman ================= */
function hangman(words){
  return new Promise(res=>{
    let wi=0;const MAX=hard()?5:7;
    modal(`<div class="card" data-duo="think"><div class="row" style="justify-content:space-between"><h3>日月號的英文密碼鎖</h3><div class="locks" id="lk">${words.map(()=>'<i>🔒</i>').join('')}</div></div>
     <div class="mgrid"><svg viewBox="0 0 300 300" id="hb" style="width:100%;max-height:300px"></svg>
     <div><div class="wordpic"><div class="emo" id="hE"></div><div style="flex:1"><b id="hZ" style="font-size:20px"></b><div style="color:var(--ink2);font-size:15px">一次點一個字母，拼出英文單字</div></div><button class="btn w" id="hS" style="min-height:48px;padding:6px 14px;font-size:17px">聽發音</button></div>
     <div class="slots" id="hSl"></div><div style="text-align:center;font-weight:900;color:var(--ink2)" id="hL"></div></div></div>
     <div class="keys" id="hK"></div><div class="fb" id="hF"></div></div>`,b=>{
      const q=s=>b.querySelector(s);let g,miss;
      function balloon(){const k=Math.min(miss/MAX,1),y=180-k*150;q('#hb').innerHTML=`<rect width="300" height="300" rx="20" fill="#92C3DB"/><path d="M0 250 Q75 240 150 250 T300 250 V300 H0Z" fill="#599EC4"/><rect x="100" y="236" width="100" height="18" rx="6" fill="#FFFFFF" stroke="#2E384F" stroke-width="4"/>
        <line x1="150" y1="${y+80}" x2="150" y2="238" stroke="#2E384F" stroke-width="2" stroke-dasharray="5 4"/>
        <g transform="translate(150 ${y})"><path d="M-48 0 A48 52 0 1 1 48 0 Q38 38 12 58 H-12 Q-38 38 -48 0Z" fill="#CB7681" stroke="#2E384F" stroke-width="4"/><path d="M-16 -48 Q-28 0 -12 58 M16 -48 Q28 0 12 58" stroke="#B15862" stroke-width="3" fill="none"/>
        <text y="16" text-anchor="middle" font-family="Fredoka" font-size="44" font-weight="700" fill="#fff">X</text><rect x="-14" y="68" width="28" height="20" rx="4" fill="#936F52" stroke="#2E384F" stroke-width="3"/></g>
        <text x="150" y="290" text-anchor="middle" font-size="16" font-weight="900" fill="#2E384F">${k>=1?'怪盜X飛走了！':'答錯一次，熱氣球就升高一點'}</text>`}
      function start(){const w=words[wi];g=new Set();miss=0;if(!hard())g.add(w.w[0]);
        q('#hE').textContent=w.emo;q('#hZ').textContent=w.zh;
        q('#hK').innerHTML='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(ch=>`<button data-c="${ch}" ${g.has(ch)?'disabled class="hit"':''}>${ch}</button>`).join('');
        q('#hF').textContent='';q('#hF').className='fb';draw()}
      function draw(){const w=words[wi].w;q('#hSl').innerHTML=w.split('').map(ch=>`<div class="slot">${g.has(ch)?ch:''}</div>`).join('');
        q('#hL').textContent=`還有 ${MAX-miss} 次機會`;balloon()}
      q('#hS').onclick=()=>speak(words[wi].w.toLowerCase(),'en-US');
      q('#hK').onclick=e=>{const k=e.target.closest('button');if(!k||k.disabled)return;const ch=k.dataset.c,w=words[wi].w;if(miss>=MAX)return;
        g.add(ch);k.disabled=true;if(w.includes(ch)){k.classList.add('hit');sGood();speak(ch,'en-US')}else{miss++;sBad()}draw();
        if(w.split('').every(x=>g.has(x))){q('#hF').innerHTML=`拼對了！<span style="font-family:var(--f-en);font-size:24px">${w}</span>`;q('#hF').className='fb ok';speak(w.toLowerCase(),'en-US');
          q('#lk').children[wi].className='on';q('#lk').children[wi].textContent='🔓';wi++;lockFor(()=>{if(wi<words.length)start();else{closeModal();res()}},1500)}
        else if(miss>=MAX){q('#hF').innerHTML=`熱氣球飛走了！答案是 <b style="font-family:var(--f-en)">${w}</b>，再挑戰一次。`;q('#hF').className='fb no';lockFor(start,2400)}};
      start();
    });
  });
}

/* ================= MINIGAME: sign typo ================= */
function signFix(sg,n){
  return new Promise(res=>{
    modal(`<div class="card" data-duo="hmm" style="width:min(820px,100%)"><h3>告示牌 ${n}</h3><p class="lead" id="sQ">怪盜X偷偷改了一個字。點出那個錯字！</p>
      <div class="sign" id="sB">${[...sg.s].map((ch,i)=>`<button data-i="${i}" class="${/[，。！？、]/.test(ch)?'p':''}">${ch}</button>`).join('')}</div>
      <div class="row" style="justify-content:center;margin-top:10px"><button class="btn w" id="sSay" style="min-height:46px;font-size:17px;padding:6px 16px">唸給我聽</button></div>
      <div class="opts" id="sO" hidden></div><div class="explain" id="sE" hidden></div><div class="fb" id="sF"></div></div>`,b=>{
      const q=s=>b.querySelector(s);let st=0;
      q('#sSay').onclick=()=>speak(sg.s,'zh-TW');
      q('#sB').onclick=e=>{const k=e.target.closest('button');if(!k||st)return;
        if(+k.dataset.i===sg.w){sGood();st=1;k.classList.add('bad');q('#sQ').textContent='找到了！要換成哪一個字才對？';q('#sO').hidden=false;q('#sO').innerHTML=sg.o.map(c=>`<button>${c}</button>`).join('');q('#sF').textContent=''}
        else{sBad();shake(k);q('#sF').textContent='這個字沒有寫錯喔，再找找看。';q('#sF').className='fb no'}};
      q('#sO').onclick=e=>{const k=e.target.closest('button');if(!k||st!==1)return;
        if(k.textContent===sg.ok){sWin();st=2;const t=q(`#sB [data-i="${sg.w}"]`);t.textContent=sg.ok;t.className='fix';q('#sO').hidden=true;q('#sF').textContent='';
          q('#sE').hidden=false;q('#sE').innerHTML=sg.ex+`<div class="row" style="margin-top:10px"><button class="btn m" id="sOk">修好了！</button></div>`;q('#sOk').onclick=()=>{closeModal();res()}}
        else{sBad();shake(k);q('#sF').textContent='不是這個字，想想看這句話的意思。';q('#sF').className='fb no'}};
    });
  });
}

/* ================= MINIGAME: radical chest ================= */
function chest(items){
  return new Promise(res=>{
    let ii=0;
    modal(`<div class="card" data-duo="think" style="width:min(820px,100%)"><div class="row" style="justify-content:space-between"><h3>古堡寶箱的組字鎖</h3><div class="locks" id="lk">${items.map(()=>'<i>🔒</i>').join('')}</div></div>
      <p class="lead">寶箱上的詞語少了一個字。從左右兩邊各選一個部件，把字拼起來！</p>
      <div class="chest"><div class="bigchar" id="cB">？</div><div><div class="story" id="cW" style="font-size:24px"></div>
      <p style="margin:12px 0 6px;font-weight:900">左邊（部首）</p><div class="piece-row" id="cL"></div>
      <p style="margin:12px 0 6px;font-weight:900">右邊或下面</p><div class="piece-row" id="cR"></div></div></div>
      <div class="fb" id="cF"></div></div>`,b=>{
      const q=s=>b.querySelector(s);let L=null,R=null;
      function start(){const it=items[ii];L=R=null;q('#cB').textContent='？';q('#cW').innerHTML=it.word;
        q('#cL').innerHTML=shuffle(it.L).map(p=>`<button aria-pressed="false">${p}</button>`).join('');
        q('#cR').innerHTML=shuffle(it.R).map(p=>`<button aria-pressed="false">${p}</button>`).join('');q('#cF').textContent=''}
      function pick(row,e){const k=e.target.closest('button');if(!k)return;sPop();[...row.children].forEach(x=>x.setAttribute('aria-pressed',x===k));
        if(row===q('#cL'))L=k.textContent;else R=k.textContent;q('#cB').textContent=(L||'')+(R?'＋'+R:'');q('#cB').style.fontSize=(L&&R)?'40px':'72px';
        if(L&&R){const it=items[ii];if(L===it.okL&&R===it.okR){sWin();q('#cB').style.fontSize='72px';q('#cB').textContent=it.ans;q('#cF').textContent=it.ex;q('#cF').className='fb ok';
            q('#lk').children[ii].className='on';q('#lk').children[ii].textContent='🔓';ii++;lockFor(()=>{if(ii<items.length)start();else{closeModal();res()}},1900)}
          else{sBad();q('#cF').textContent='拼不出正確的字，換一個部件試試！';q('#cF').className='fb no';shake(q('#cB'))}}}
      q('#cL').onclick=e=>pick(q('#cL'),e);q('#cR').onclick=e=>pick(q('#cR'),e);start();
    });
  });
}

/* ================= MINIGAME: sentence order ================= */
function order(sents){
  return new Promise(res=>{
    let si=0;
    modal(`<div class="card" data-duo="confused" style="width:min(820px,100%)"><h3>撕碎的紙條</h3><p class="lead">紙條被撕成好幾片了。依照順序點一點，把句子拼回來！</p>
     <div class="chips" id="oA"></div><div class="chips src" id="oS"></div>
     <div class="row"><button class="btn w" id="oR">重來</button><button class="btn m" id="oC">拼好了</button></div><div class="fb" id="oF"></div></div>`,b=>{
      const q=s=>b.querySelector(s);let picked=[];
      function start(){picked=[];render()}
      function render(){const s=sents[si];q('#oA').innerHTML=picked.map(i=>`<button>${s[i]}</button>`).join('');
        q('#oS').innerHTML=shuffle(s.map((_,i)=>i)).filter(i=>!picked.includes(i)).map(i=>`<button data-i="${i}">${s[i]}</button>`).join('')}
      q('#oS').onclick=e=>{const k=e.target.closest('button');if(!k)return;sPop();picked.push(+k.dataset.i);render()};
      q('#oR').onclick=start;
      q('#oC').onclick=()=>{const s=sents[si];if(picked.length<s.length){q('#oF').textContent='還有紙片沒用到喔！';q('#oF').className='fb no';return}
        if(picked.every((v,i)=>v===i)){sWin();q('#oF').textContent='「'+s.join('')+'」';q('#oF').className='fb ok';si++;lockFor(()=>{if(si<sents.length){q('#oF').textContent='';start()}else{closeModal();res()}},2000)}
        else{sBad();q('#oF').textContent='順序怪怪的，唸唸看通不通順？';q('#oF').className='fb no';shake(q('#oA'))}};
      start();
    });
  });
}

/* ================= art helpers for puzzles ================= */
const INK='#2E384F';
const SV=(vb,body,mh=300)=>`<svg viewBox="${vb}" style="width:100%;max-height:${mh}px;display:block" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const deg=a=>a*Math.PI/180;
function clockSvg(h,m){const a=m*6,b=((h%12)+m/60)*30;
  return SV('-110 -110 220 220',`<circle r="100" fill="#FFFFFF" stroke="${INK}" stroke-width="8"/>`+
  Array.from({length:12},(_,i)=>`<text x="${(Math.sin(deg(i*30))*76).toFixed(1)}" y="${(-Math.cos(deg(i*30))*76+9).toFixed(1)}" text-anchor="middle" font-size="24" font-weight="700" fill="${INK}" font-family="Fredoka,sans-serif">${i||12}</text>`).join('')+
  `<line x2="${(Math.sin(deg(b))*48).toFixed(1)}" y2="${(-Math.cos(deg(b))*48).toFixed(1)}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><line x2="${(Math.sin(deg(a))*74).toFixed(1)}" y2="${(-Math.cos(deg(a))*74).toFixed(1)}" stroke="#C86062" stroke-width="6" stroke-linecap="round"/><circle r="8" fill="${INK}"/>`,230)}
function pendSvg(){const L=[[100,90,'A'],[260,160,'B'],[420,230,'C']];
  return SV('0 0 520 330',`<rect x="20" y="14" width="480" height="18" rx="6" fill="#946F4B" stroke="${INK}" stroke-width="3"/>`+L.map(([x,l,n])=>`<g style="transform-box:view-box;transform-origin:${x}px 32px;animation:sw ${(Math.sqrt(l/90)*.8).toFixed(2)}s ease-in-out infinite alternate"><line x1="${x}" y1="32" x2="${x}" y2="${32+l}" stroke="${INK}" stroke-width="4"/><circle cx="${x}" cy="${50+l}" r="20" fill="#D4BB49" stroke="${INK}" stroke-width="4"/></g><text x="${x}" y="322" text-anchor="middle" font-size="30" font-weight="700" fill="${INK}" font-family="Fredoka,sans-serif">${n}</text>`).join(''))}
function compassMap(){return SV('0 0 620 880',mapSvg(true,0)+`<g transform="translate(92 150)"><circle r="58" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/><path d="M0 -46 L13 0 L0 46 L-13 0Z" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/><path d="M0 -46 L13 0 L-13 0Z" fill="#C86062"/><text y="-66" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">北</text></g>`,330)}
function rulerSvg(){let t='';for(let i=0;i<=30;i++){const x=40+i*20;t+=`<line x1="${x}" y1="212" x2="${x}" y2="${i%5?194:180}" stroke="${INK}" stroke-width="${i%5?2:3}"/>`+(i%5?'':`<text x="${x}" y="174" text-anchor="middle" font-size="20" font-weight="700" fill="${INK}" font-family="Fredoka,sans-serif">${i}</text>`)}
  return SV('0 0 680 240',`<rect x="20" y="150" width="640" height="64" rx="6" fill="#D4BB49" stroke="${INK}" stroke-width="4"/>${t}<g transform="translate(40 18)"><path d="M0 52 Q0 6 70 8 L380 22 Q480 30 480 62 Q480 96 380 100 L70 114 Q0 118 0 66Z" fill="#946F4B" stroke="${INK}" stroke-width="3"/>${[60,120,180,240,300,360,420].map(x=>`<path d="M${x} 30 v70" stroke="#BFA68C" stroke-width="6" stroke-linecap="round"/>`).join('')}</g><line x1="520" y1="20" x2="520" y2="150" stroke="#C86062" stroke-width="3" stroke-dasharray="6 5"/>`)}
function trackSvg(){const toe=(x,y,r)=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*1.25}" fill="${INK}"/>`;
  const duck=`<g transform="translate(110 120)"><path d="M0 40 L-42 -36 Q-20 -22 0 -46 Q20 -22 42 -36Z" fill="${INK}"/><path d="M0 40 L0 -40" stroke="#FFFFFF" stroke-width="3"/></g>`;
  const cat=`<g transform="translate(300 120)"><path d="M-26 20 Q-30 50 0 52 Q30 50 26 20 Q14 6 0 8 Q-14 6 -26 20Z" fill="${INK}"/>${toe(-30,-14,10)+toe(-11,-32,10)+toe(11,-32,10)+toe(30,-14,10)}</g>`;
  const fox=`<g transform="translate(490 120)"><ellipse cy="26" rx="20" ry="24" fill="${INK}"/>${toe(-22,-12,9)+toe(-8,-34,9)+toe(8,-34,9)+toe(22,-12,9)}<path d="M-25 -28 l-4 -12 M-9 -50 l-2 -13 M9 -50 l2 -13 M25 -28 l4 -12" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g>`;
  return SV('0 0 600 220',`<rect width="600" height="220" rx="16" fill="#D8C29B"/>${duck}${cat}${fox}`+['A','B','C'].map((n,i)=>`<text x="${110+i*190}" y="205" text-anchor="middle" font-size="30" font-weight="700" fill="${INK}" font-family="Fredoka,sans-serif">${n}</text>`).join(''),240)}
const moon=p=>`<svg viewBox="-50 -50 100 100" width="78" height="78"><circle r="44" fill="#3C4155" stroke="${INK}" stroke-width="4"/>${p===2?'<circle r="41" fill="#D4BB49"/>':p===1?'<path d="M0 -41 A41 41 0 0 1 0 41Z" fill="#D4BB49"/>':p===3?'<path d="M0 -41 A41 41 0 0 0 0 41Z" fill="#D4BB49"/>':''}</svg>`;
function chartSvg(){const d=[[8,22],[10,25],[12,29],[14,31],[16,27]],X=i=>110+i*110,Y=t=>300-(t-20)*20;
  return SV('0 0 640 360',`<rect width="640" height="360" fill="#FFFFFF"/>`+[20,22,24,26,28,30,32].map(t=>`<line x1="80" y1="${Y(t)}" x2="600" y2="${Y(t)}" stroke="#DBDFE6" stroke-width="2"/><text x="70" y="${Y(t)+7}" text-anchor="end" font-size="20" fill="${INK}" font-family="Fredoka,sans-serif">${t}</text>`).join('')+
  `<line x1="80" y1="300" x2="600" y2="300" stroke="${INK}" stroke-width="3"/><line x1="80" y1="40" x2="80" y2="300" stroke="${INK}" stroke-width="3"/><polyline points="${d.map(([h,t],i)=>X(i)+','+Y(t)).join(' ')}" fill="none" stroke="#C86062" stroke-width="5"/>`+
  d.map(([h,t],i)=>`<circle cx="${X(i)}" cy="${Y(t)}" r="8" fill="#C86062" stroke="${INK}" stroke-width="3"/><text x="${X(i)}" y="330" text-anchor="middle" font-size="20" font-weight="700" fill="${INK}" font-family="Fredoka,sans-serif">${h} 時</text>`).join('')+
  `<text x="30" y="30" font-size="20" font-weight="700" fill="${INK}">溫度（度）</text>`,320)}
function protSvg(a){const cx=320,cy=300,R=240;let t='';for(let k=0;k<=180;k+=10){const x1=cx+Math.cos(deg(k))*R,y1=cy-Math.sin(deg(k))*R,x2=cx+Math.cos(deg(k))*(R-(k%30?14:26)),y2=cy-Math.sin(deg(k))*(R-(k%30?14:26));
    t+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${INK}" stroke-width="3"/>`+(k%30?'':`<text x="${(cx+Math.cos(deg(k))*(R-50)).toFixed(1)}" y="${(cy-Math.sin(deg(k))*(R-50)+8).toFixed(1)}" text-anchor="middle" font-size="22" font-weight="700" fill="${INK}" font-family="Fredoka,sans-serif">${k}</text>`)}
  const ex=cx+Math.cos(deg(a))*(R+40),ey=cy-Math.sin(deg(a))*(R+40);
  return SV('0 0 640 330',`<path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy}Z" fill="#F4EDD2" stroke="${INK}" stroke-width="4"/>${t}<line x1="${cx}" y1="${cy}" x2="${cx+R+30}" y2="${cy}" stroke="${INK}" stroke-width="4"/><line x1="${cx}" y1="${cy}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#494952" stroke-width="26" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="26" fill="#946F4B" stroke="${INK}" stroke-width="4"/>`,300)}
function shadowSvg(show){return SV('0 0 640 300',`<rect width="640" height="300" fill="#92C3DB"/><rect y="220" width="640" height="80" fill="#D8C29B"/><circle cx="70" cy="${show?175:90}" r="34" fill="#D4BB49" stroke="${INK}" stroke-width="4"/><text x="40" y="290" font-size="26" font-weight="900" fill="${INK}">西</text><text x="580" y="290" font-size="26" font-weight="900" fill="${INK}">東</text>${show?`<path d="M320 220 L620 220 L620 232 L320 232Z" fill="#2E384F" opacity=".55"/>`:''}<rect x="312" y="80" width="16" height="142" fill="#946F4B" stroke="${INK}" stroke-width="3"/><path d="M328 82 l50 16 l-50 16z" fill="#C86062"/>`,260)}
function magnetSvg(){const bar=(x,y)=>`<g transform="translate(${x} ${y})"><rect width="110" height="56" fill="#C86062" stroke="${INK}" stroke-width="4"/><rect x="110" width="110" height="56" fill="#2B79B5" stroke="${INK}" stroke-width="4"/><text x="55" y="40" text-anchor="middle" font-size="32" font-weight="700" fill="#fff" font-family="Fredoka,sans-serif">N</text><text x="165" y="40" text-anchor="middle" font-size="32" font-weight="700" fill="#fff" font-family="Fredoka,sans-serif">S</text></g>`;
  return SV('0 0 640 140',`${bar(40,40)}<g transform="translate(600 40) scale(-1 1)">${bar(0,0)}</g><text x="320" y="80" text-anchor="middle" font-size="40" font-weight="900" fill="${INK}">？</text>`.replace(/<g transform="translate\(600 40\) scale\(-1 1\)">(.*?)<\/g><text/s,(m,b)=>`<g transform="translate(600 40) scale(-1 1)">${b.replace(/>N</,'>S<').replace(/>S<\/text><\/g>$/,'>N</text></g>')}</g><text`),150)}
function rootSvg(t){const g='#8DB36E',br='#946F4B';
  if(t==='aerial')return SV('0 0 320 260',`<rect width="320" height="260" fill="#92C3DB"/><rect y="230" width="320" height="30" fill="#D8C29B"/><path d="M30 60 Q160 30 300 70" stroke="${br}" stroke-width="22" fill="none" stroke-linecap="round"/>${[70,105,140,175,210,245,280].map((x,i)=>`<path d="M${x} ${56-i%2*4} q${i%2?6:-6} 80 ${i%2?-4:4} ${120+i*12}" stroke="#BFA68C" stroke-width="4" fill="none"/>`).join('')}<ellipse cx="90" cy="40" rx="70" ry="30" fill="${g}"/><ellipse cx="230" cy="44" rx="80" ry="30" fill="${g}"/>`,220);
  if(t==='fib')return SV('0 0 320 260',`<rect width="320" height="260" fill="#D8C29B"/>${[-60,-40,-20,0,20,40,60].map(a=>`<path d="M160 70 Q${160+a*.6} 150 ${160+a*1.6} 240" stroke="${br}" stroke-width="4" fill="none"/>`).join('')}${[-40,-15,15,40].map(a=>`<path d="M160 70 Q${160+a} 30 ${160+a*1.4} 6" stroke="${g}" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}`,220);
  return SV('0 0 320 260',`<rect width="320" height="260" fill="#D8C29B"/><path d="M150 70 Q156 170 160 250 Q164 170 170 70Z" fill="#C9B085" stroke="${br}" stroke-width="4"/>${[110,150,190].map((y,i)=>`<path d="M160 ${y} q${i%2?40:-40} 10 ${i%2?60:-60} 30" stroke="${br}" stroke-width="3" fill="none"/>`).join('')}<path d="M160 70 Q130 30 110 10 M160 70 Q190 30 210 10" stroke="${g}" stroke-width="12" fill="none" stroke-linecap="round"/>`,220)}
function leafSvg(){const lf=(x,y,r)=>`<ellipse cx="${x}" cy="${y}" rx="40" ry="16" fill="#8DB36E" stroke="#59944E" stroke-width="3" transform="rotate(${r} ${x} ${y})"/>`;
  return SV('0 0 320 300',`<rect width="320" height="300" fill="#FFFFFF"/><line x1="160" y1="290" x2="160" y2="10" stroke="#76A960" stroke-width="10"/>${lf(205,230,-25)+lf(115,170,25)+lf(205,110,-25)+lf(115,50,25)}${[230,170,110,50].map(y=>`<circle cx="160" cy="${y+8}" r="7" fill="#59944E"/>`).join('')}`,240)}

/* ================= puzzle runners ================= */
function dots(n){return `<div class="locks" id="pk">${Array.from({length:n},()=>'<i>？</i>').join('')}</div>`}
function tick(b,i){const k=b.querySelector('#pk');if(k&&k.children[i]){k.children[i].className='on';k.children[i].textContent='✓'}}
function quiz(title,qs,o={}){return new Promise(res=>{let i=0;
  modal(`<div class="card" data-duo="${o.duo||'think'}"><div class="row" style="justify-content:space-between"><h3>${title}</h3>${dots(qs.length)}</div><div id="qb"></div></div>`,b=>{const q=s=>b.querySelector(s);
    function show(){const Q=qs[i],opts=shuffle(Q.o.map((t,k)=>({t,k})));
      q('#qb').innerHTML=`${Q.pic?`<div class="qpic">${Q.pic}</div>`:''}<div class="qtext">${Q.q}</div>${Q.say?`<div class="row" style="justify-content:center;margin-bottom:6px"><button class="tool" id="qSay">再聽一次英文</button></div>`:''}<div class="qopts">${opts.map(x=>`<button data-k="${x.k}" class="${Q.en?'en':''}">${x.t}</button>`).join('')}</div><div class="fb" id="qf"></div>`;
      if(Q.say){q('#qSay').onclick=()=>speak(Q.say,'en-US');speak(Q.say,'en-US')}
      q('.qopts').onclick=e=>{const btn=e.target.closest('button');if(!btn||btn.disabled)return;if(Q.en)speak(btn.textContent,'en-US');
        if(+btn.dataset.k===0){sGood();btn.classList.add('right');[...q('.qopts').children].forEach(x=>x.disabled=true);tick(b,i);
          q('#qf').className='fb ok';q('#qf').innerHTML=`<div>${Q.ex||'答對了！'}</div><div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn m" id="qn">${i<qs.length-1?'下一題':'完成'}</button></div>`;
          q('#qn').onclick=()=>{i++;if(i<qs.length){show();lockFor(null,450)}else{closeModal();res()}}}
        else{sBad();shake(btn);btn.disabled=true;q('#qf').className='fb no';q('#qf').textContent=Q.hint||'再想想看！'}};
    }
    show();});});}
function calc(title,qs,o={}){return new Promise(res=>{let i=0,val='',miss=0;
  modal(`<div class="card" data-duo="${o.duo||'think'}"><div class="row" style="justify-content:space-between"><h3>${title}</h3>${dots(qs.length)}</div>
    <div class="mgrid"><div><div id="cq"></div></div><div><div class="ans"><span id="cv"></span> <small id="cu" style="font-size:22px;color:var(--ink2)"></small></div><div class="pad" id="cp"></div><div class="fb" id="cf"></div></div></div></div>`,b=>{const q=s=>b.querySelector(s);
    q('#cp').innerHTML=['7','8','9','4','5','6','1','2','3','del','0','ok'].map(k=>`<button data-k="${k}" class="${k==='ok'?'ok':k==='del'?'del':''}">${k==='del'?'刪除':k==='ok'?'確定':k}</button>`).join('');
    function show(){const Q=qs[i];val='';miss=0;q('#cq').innerHTML=`${Q.pic?`<div class="qpic">${Q.pic}</div>`:''}<div class="story">${Q.q}</div>`;q('#cv').textContent='';q('#cu').textContent=Q.unit||'';q('#cf').textContent=''}
    q('#cp').onclick=e=>{const k=e.target.closest('button');if(!k)return;const v=k.dataset.k;
      if(v==='del')val=val.slice(0,-1);else if(v==='ok'){if(!val)return;const Q=qs[i];
        if(+val===Q.a){sGood();tick(b,i);q('#cf').className='fb ok';q('#cf').textContent='答對了！'+(Q.ex||'');lockFor(()=>{i++;if(i<qs.length)show();else{closeModal();res()}},1500)}
        else{sBad();miss++;shake(q('.ans'));val='';q('#cf').className='fb no';q('#cf').textContent=miss>1&&Q.hint2?Q.hint2:(Q.hint||'再算一次！')}}
      else if(val.length<5)val+=v;tone([520],.04,'sine',.08);q('#cv').textContent=val};
    show();});});}
async function signs(list){for(let i=0;i<list.length;i++)await signFix(list[i],i+1)}

/* flashlight / UV search */
let lensN=0;
function lens(title,lead,o){return new Promise(res=>{const id='L'+(++lensN),W=800,H=500,R=o.uv?110:95;
  const found=new Set();
  modal(`<div class="card" data-duo="hmm" style="width:min(940px,100%)"><div class="row" style="justify-content:space-between"><h3>${title}</h3>${o.targets?dots(o.targets.length):''}</div><p class="lead">${lead}</p>
    <svg id="lsv" viewBox="0 0 ${W} ${H}" style="width:100%;max-height:52vh;display:block;border:4px solid ${INK};border-radius:16px;touch-action:none;cursor:crosshair;background:#171B28">
      <defs><mask id="${id}a"><rect width="${W}" height="${H}" fill="#fff"/><circle id="${id}c1" cx="400" cy="250" r="${R}" fill="#000"/></mask><mask id="${id}b"><rect width="${W}" height="${H}" fill="#000"/><circle id="${id}c2" cx="400" cy="250" r="${R}" fill="#fff"/></mask></defs>
      ${o.pic}
      <rect width="${W}" height="${H}" fill="${o.uv?'#35214A':'#171B28'}" opacity="${o.uv?.86:.94}" mask="url(#${id}a)"/>
      ${o.secret?`<g mask="url(#${id}b)">${o.secret}</g>`:''}
      <circle id="${id}r" cx="400" cy="250" r="${R}" fill="none" stroke="${o.uv?'#BFA0E9':'#E8E19E'}" stroke-width="5"/><g id="${id}f"></g>
    </svg><div class="fb" id="lf"></div>${o.uv?`<div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn m" id="lDone">我看到了！</button></div>`:''}</div>`,b=>{
    const sv=b.querySelector('#lsv'),c1=b.querySelector('#'+id+'c1'),c2=b.querySelector('#'+id+'c2'),rr=b.querySelector('#'+id+'r'),fl=b.querySelector('#'+id+'f');
    const pt=e=>{const p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(sv.getScreenCTM().inverse())};
    const mv=e=>{const p=pt(e);[c1,c2,rr].forEach(c=>{c.setAttribute('cx',p.x);c.setAttribute('cy',p.y)});return p};
    sv.addEventListener('pointermove',mv);
    sv.addEventListener('pointerdown',e=>{const p=mv(e);if(!o.targets)return;
      const t=o.targets.findIndex((t,k)=>!found.has(k)&&Math.hypot(t.x-p.x,t.y-p.y)<t.r);
      if(t<0){tone([300],.05,'sine',.05);return}
      found.add(t);sGood();tick(b,found.size-1);const T=o.targets[t];
      fl.insertAdjacentHTML('beforeend',`<circle cx="${T.x}" cy="${T.y}" r="${T.r}" fill="none" stroke="#8DB36E" stroke-width="6"/><g transform="translate(${T.x} ${T.y-T.r-12})"><rect x="-80" y="-26" width="160" height="34" rx="10" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/><text y="0" text-anchor="middle" font-size="20" font-weight="900" fill="${INK}">${T.l}</text></g>`);
      b.querySelector('#lf').className='fb ok';b.querySelector('#lf').textContent=`找到「${T.l}」！（${found.size}/${o.targets.length}）`;
      if(found.size===o.targets.length)lockFor(()=>{closeModal();res()},1300)});
    if(o.uv)b.querySelector('#lDone').onclick=()=>{closeModal();res()};
  });});}

/* fingerprint matching */
function fpSvg(type,marks,sz=150){let r='';
  if(type==='w')for(let k=0;k<8;k++)r+=`<ellipse cx="0" cy="4" rx="${10+k*8}" ry="${14+k*9}" fill="none" stroke="${INK}" stroke-width="4"/>`;
  if(type==='l')for(let k=0;k<8;k++)r+=`<path d="M${-14-k*8} 80 C${-14-k*8} ${-20-k*8} ${14+k*8} ${-20-k*8} ${14+k*8} ${10+k*4}" fill="none" stroke="${INK}" stroke-width="4"/>`;
  if(type==='a')for(let k=0;k<9;k++)r+=`<path d="M-80 ${70-k*16} Q0 ${30-k*22} 80 ${70-k*16}" fill="none" stroke="${INK}" stroke-width="4"/>`;
  r+=marks.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="#FFFFFF"/><circle cx="${x}" cy="${y}" r="4" fill="#C86062"/>`).join('');
  return `<svg viewBox="-80 -90 160 180" width="${sz}" height="${sz*1.12}"><defs><clipPath id="fc${type}${marks.length}${marks[0]?marks[0][0]:0}"><ellipse rx="70" ry="84"/></clipPath></defs><ellipse rx="72" ry="86" fill="#F4EDD2" stroke="${INK}" stroke-width="3"/><g clip-path="url(#fc${type}${marks.length}${marks[0]?marks[0][0]:0})">${r}</g></svg>`}
function fingerprint(rounds){const R=[{t:'w',m:[[-30,-20],[24,40]]},{t:'l',m:[[30,-10],[-20,50],[0,-50]]}].slice(0,rounds);
  return new Promise(res=>{let i=0;
    modal(`<div class="card" data-duo="hmm"><div class="row" style="justify-content:space-between"><h3>指紋比對</h3>${dots(R.length)}</div><p class="lead">左邊是現場採到的指紋。紋路的形狀和紅點的位置都要一樣，才是同一個人！</p><div id="fb"></div><div class="fb" id="ff"></div></div>`,b=>{const q=s=>b.querySelector(s);
      function show(){const T=R[i],other=T.t==='w'?'l':'w';
        const cands=shuffle([{ok:1,t:T.t,m:T.m},{t:T.t,m:T.m.map(([x,y])=>[-x,y])},{t:other,m:T.m},{t:'a',m:T.m.slice(0,2)}]);
        q('#fb').innerHTML=`<div class="fpgrid"><div class="fptarget"><b>現場指紋</b>${fpSvg(T.t,T.m,170)}</div><div class="fpopts">${cands.map((c,k)=>`<button data-ok="${c.ok?1:0}">${fpSvg(c.t,c.m,110)}<span>${'ABCD'[k]}</span></button>`).join('')}</div></div>`;
        q('.fpopts').onclick=e=>{const btn=e.target.closest('button');if(!btn||btn.disabled)return;
          if(btn.dataset.ok==='1'){sGood();btn.classList.add('right');tick(b,i);q('#ff').className='fb ok';q('#ff').textContent='完全吻合！';lockFor(()=>{i++;if(i<R.length){q('#ff').textContent='';show()}else{closeModal();res()}},1300)}
          else{sBad();shake(btn);btn.disabled=true;q('#ff').className='fb no';q('#ff').textContent='不一樣！先看紋路是圓圈、彎彎的還是像小山，再看紅點的位置。'}}}
      show();});});}

/* torn photo: tap two pieces to swap */
function tiles(title,pic){return new Promise(res=>{let ord;do{ord=shuffle([0,1,2,3,4,5,6,7,8])}while(ord.every((v,k)=>v===k));let sel=-1;
  modal(`<div class="card" data-duo="confused" style="width:min(720px,100%)"><h3>${title}</h3><p class="lead">照片被撕成 9 片了。點兩片可以交換位置，把照片拼回來！</p><div class="tiles" id="tg"></div><div class="fb" id="tf"></div></div>`,b=>{const g=b.querySelector('#tg');
    function draw(){g.innerHTML=ord.map((p,k)=>`<button data-k="${k}" class="${k===sel?'sel':''}"><svg viewBox="${(p%3)*200} ${Math.floor(p/3)*200} 200 200">${pic}</svg></button>`).join('')}
    g.onclick=e=>{const btn=e.target.closest('button');if(!btn)return;const k=+btn.dataset.k;
      if(sel<0){sel=k;sPop()}else{[ord[sel],ord[k]]=[ord[k],ord[sel]];sel=-1;tone([600],.05,'sine',.1)}draw();
      if(ord.every((v,k)=>v===k)){sGood();b.querySelector('#tf').className='fb ok';b.querySelector('#tf').textContent='照片拼好了！';g.onclick=null;lockFor(()=>{closeModal();res()},1600)}};
    draw();});});}

/* fractions: tap to shade */
function fraction(title,qs){return new Promise(res=>{let i=0;
  modal(`<div class="card" data-duo="think" style="width:min(760px,100%)"><div class="row" style="justify-content:space-between"><h3>${title}</h3>${dots(qs.length)}</div><div class="story" id="fq"></div><div id="fs" style="margin:12px 0"></div><div class="row"><button class="btn m" id="fok">塗好了</button><span class="fb" id="ffb"></span></div></div>`,b=>{const q=s=>b.querySelector(s);let on;
    function draw(){const Q=qs[i];let s='';
      if(Q.shape==='pie'){for(let k=0;k<Q.d;k++){const a0=deg(k*360/Q.d-90),a1=deg((k+1)*360/Q.d-90);s+=`<path data-k="${k}" d="M0 0 L${(Math.cos(a0)*120).toFixed(1)} ${(Math.sin(a0)*120).toFixed(1)} A120 120 0 0 1 ${(Math.cos(a1)*120).toFixed(1)} ${(Math.sin(a1)*120).toFixed(1)}Z" fill="${on.has(k)?'#D4BB49':'#FFFFFF'}" stroke="${INK}" stroke-width="5"/>`}q('#fs').innerHTML=SV('-130 -130 260 260',s,280)}
      else{for(let k=0;k<Q.d;k++)s+=`<rect data-k="${k}" x="${10+k*(620/Q.d)}" y="20" width="${620/Q.d}" height="110" rx="10" fill="${on.has(k)?'#D29841':'#FFFFFF'}" stroke="${INK}" stroke-width="5"/>`;q('#fs').innerHTML=SV('0 0 640 150',s,170)}}
    function show(){on=new Set();q('#fq').innerHTML=qs[i].q;q('#ffb').textContent='';draw()}
    q('#fs').onclick=e=>{const p=e.target.closest('[data-k]');if(!p)return;const k=+p.dataset.k;on.has(k)?on.delete(k):on.add(k);sPop();draw()};
    q('#fok').onclick=()=>{const Q=qs[i];if(on.size===Q.a){sGood();tick(b,i);q('#ffb').className='fb ok';q('#ffb').textContent=`答對了！${Q.a}/${Q.d} 就是 ${Q.d} 份裡的 ${Q.a} 份。`;lockFor(()=>{i++;if(i<qs.length)show();else{closeModal();res()}},1600)}
      else{sBad();q('#ffb').className='fb no';q('#ffb').textContent=`現在塗了 ${on.size} 份。分母 ${Q.d} 是總共分幾份，分子 ${Q.a} 是要塗幾份。`}};
    show();});});}

/* electric circuit: tap gaps to connect wires */
function circuit(){return new Promise(res=>{const gaps=[{x:200,y:80,v:0,k:1},{x:600,y:200,v:1,k:1},{x:400,y:320,v:0,k:1},{x:600,y:60,v:1,k:0}];const on=new Set();
  modal(`<div class="card" data-duo="think" style="width:min(820px,100%)"><h3>接好電路，讓燈亮起來</h3><p class="lead">電線有好幾個斷掉的地方。點一點缺口接上電線。小心：有一條是沒用的岔路喔！</p><div id="cz"></div><div class="fb" id="czf"></div></div>`,b=>{
    function draw(){const lit=gaps.every((g,k)=>!g.k||on.has(k));
      let s=`<rect width="800" height="400" rx="16" fill="#FFFFFF"/>`;
      s+=`<path d="M120 80 H180 M220 80 H400 M440 80 H600 V180 M600 220 V320 H420 M380 320 H120 V80" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M600 80 V40 H700" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
      s+=`<g transform="translate(120 200)"><rect x="-36" y="-60" width="72" height="120" rx="10" fill="#D4BB49" stroke="${INK}" stroke-width="5"/><rect x="-14" y="-74" width="28" height="16" fill="${INK}"/><text y="-20" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">＋</text><text y="40" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">－</text></g>`;
      s+=`<g transform="translate(420 80)">${lit?`<circle r="62" fill="#E8E19E"/>${[0,45,90,135,180,225,270,315].map(a=>`<line x1="${Math.cos(deg(a))*48}" y1="${Math.sin(deg(a))*48}" x2="${Math.cos(deg(a))*72}" y2="${Math.sin(deg(a))*72}" stroke="#D29841" stroke-width="6"/>`).join('')}`:''}<circle r="34" fill="${lit?'#D4BB49':'#E8EAF0'}" stroke="${INK}" stroke-width="5"/><path d="M-10 6 q10 -20 20 0" stroke="${INK}" stroke-width="3" fill="none"/></g>`;
      s+=`<text x="700" y="30" font-size="20" font-weight="900" fill="${INK}" text-anchor="middle">岔路</text>`;
      gaps.forEach((g,k)=>{const c=on.has(k);s+=`<g data-k="${k}" style="cursor:pointer"><circle cx="${g.x}" cy="${g.y}" r="34" fill="${c?'#FFFFFF':'#E5D490'}" stroke="${c?'none':'#C86062'}" stroke-width="4" stroke-dasharray="6 5"/>${c?`<path d="${g.v?`M${g.x} ${g.y-24} V${g.y+24}`:`M${g.x-24} ${g.y} H${g.x+24}`}" stroke="#D29841" stroke-width="10" stroke-linecap="round"/>`:`<text x="${g.x}" y="${g.y+10}" text-anchor="middle" font-size="28" font-weight="900" fill="#C86062">？</text>`}</g>`});
      b.querySelector('#cz').innerHTML=SV('0 0 800 400',s,380);
      if(lit){sWin();b.querySelector('#czf').className='fb ok';b.querySelector('#czf').innerHTML=`燈亮了！電流從電池的正極出發，繞一圈回到負極，形成「通路」，燈泡才會亮。${on.has(3)?'（岔路接不接都沒關係，因為它不在迴路上。）':''}<div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn m" id="czok">完成</button></div>`;b.querySelector('#czok').onclick=()=>{closeModal();res()}}}
    b.querySelector('#cz').onclick=e=>{const g=e.target.closest('[data-k]');if(!g||gaps.every((g,k)=>!g.k||on.has(k)))return;const k=+g.dataset.k;on.has(k)?on.delete(k):on.add(k);tone([700],.05,'square',.05);draw()};
    draw();});});}

/* number cipher A=1 ... Z=26 */
function cipher(title,rounds){return new Promise(res=>{let i=0,pos=0;const AB='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  modal(`<div class="card" data-duo="think"><div class="row" style="justify-content:space-between"><h3>${title}</h3>${dots(rounds.length)}</div>
    <div class="ctable">${AB.split('').map((c,k)=>`<span><b>${c}</b>${k+1}</span>`).join('')}</div>
    <div class="story" id="cn" style="text-align:center;font-family:var(--f-en);font-size:30px;letter-spacing:4px"></div><div class="slots" id="cs"></div><div class="keys" id="ck"></div><div class="fb" id="cf"></div></div>`,b=>{const q=s=>b.querySelector(s);
    q('#ck').innerHTML=AB.split('').map(c=>`<button data-c="${c}">${c}</button>`).join('');
    function show(){pos=0;const R=rounds[i];q('#cn').textContent=R.n.join(' - ');q('#cs').innerHTML=R.a.split('').map(()=>`<div class="slot"></div>`).join('');q('#cf').textContent='用上面的表，把數字換成英文字母。'}
    q('#ck').onclick=e=>{const k=e.target.closest('button');if(!k)return;const R=rounds[i];
      if(k.dataset.c===R.a[pos]){q('#cs').children[pos].textContent=R.a[pos];pos++;tone([660],.06);
        if(pos===R.a.length){sGood();tick(b,i);speak(R.a.toLowerCase(),'en-US');q('#cf').className='fb ok';q('#cf').textContent=`${R.a}，意思是「${R.zh}」！`;lockFor(()=>{i++;if(i<rounds.length)show();else{closeModal();res()}},1800)}}
      else{sBad();shake(k);q('#cf').className='fb no';q('#cf').textContent=`第 ${pos+1} 個數字是 ${R.n[pos]}，在表上找 ${R.n[pos]} 對應的字母。`}};
    show();});});}

/* ordering with pictures or text */
function seq(title,lead,items){return new Promise(res=>{let picked=[];
  modal(`<div class="card" data-duo="think" style="width:min(860px,100%)"><h3>${title}</h3><p class="lead">${lead}</p><div class="chips seqA" id="sA"></div><div class="chips src seqS" id="sS"></div><div class="row"><button class="btn w" id="sR">重來</button><button class="btn m" id="sC">排好了</button></div><div class="fb" id="sF"></div></div>`,b=>{const q=s=>b.querySelector(s);const mix=shuffle(items.map((_,k)=>k));
    const chip=k=>`<span class="sq">${items[k].h||''}<em>${items[k].l}</em></span>`;
    function draw(){q('#sA').innerHTML=picked.map((k,n)=>`<button><b class="no">${n+1}</b>${chip(k)}</button>`).join('')||'<span style="color:var(--ink2);padding:10px">點下面的卡片，依照順序放上來</span>';q('#sS').innerHTML=mix.filter(k=>!picked.includes(k)).map(k=>`<button data-k="${k}">${chip(k)}</button>`).join('')}
    q('#sS').onclick=e=>{const btn=e.target.closest('button');if(!btn)return;picked.push(+btn.dataset.k);sPop();draw()};
    q('#sR').onclick=()=>{picked=[];draw()};
    q('#sC').onclick=()=>{if(picked.length<items.length){q('#sF').className='fb no';q('#sF').textContent='還有卡片沒排上去喔！';return}
      if(picked.every((v,k)=>v===k)){sGood();q('#sF').className='fb ok';q('#sF').textContent='順序完全正確！';lockFor(()=>{closeModal();res()},1500)}
      else{sBad();shake(q('#sA'));q('#sF').className='fb no';q('#sF').textContent='順序怪怪的，再想想看。按「重來」重新排。'}};
    draw();});});}

/* evidence card with stamp */
function evidence(title,text){return new Promise(res=>{const n=(SC.evN=(SC.evN||0)+1),tot=SC.spots.filter(s=>s.need).length;G.ev=G.ev||[];if(!G.ev.some(e=>e.ch===G.ch&&e.t===title))G.ev.push({ch:G.ch,n,t:title,x:text});
  const t=`${G.ch?CASE().short[G.ch]:''}證物 #${n}　${title}：${text}`;if(!G.clues.includes(t)){G.clues.push(t);save()}sWin();
  modal(`<div class="card evid" style="width:min(580px,100%)"><div class="stampE">證物 #${String(n).padStart(2,'0')}</div><div class="evtag">破案進度 ${n}/${tot}</div><h3>${title}</h3><p class="lead" style="font-size:20px">${text}</p><div class="row"><button class="btn c" id="evOk">收進偵探筆記</button></div></div>`,b=>{b.querySelector('#evOk').onclick=()=>{closeModal();res()}})})}

/* puzzle hotspot factory */
const ROUND=()=>(G&&G.round)||0,ALT=()=>ROUND()%2===1;
function pz(id,x,y,o){if(ALT()&&ALTS()[id])o=Object.assign({},o,ALTS()[id]);return {id,type:o.npc?'npc':'thing',actor:o.npc,x,y,s:o.s,r:o.r||60,sx:o.sx,sy:o.sy,need:true,hint:o.hint,art:o.art,
  tap:async sp=>{
    if(sp.done){if(typeof o.after==='function')await o.after(sp);else await say(o.npc||'duo',o.after||'這裡已經調查完了。');return}
    for(const l of (o.intro||[]))await say(l[0],l[1],l[2]||{});
    hideDlg();await o.run();sp.done=true;markDone(sp.id);drawSpots();await evidence(o.ev[0],o.ev[1]);
    for(const l of (o.outro||[]))await say(l[0],l[1],l[2]||{});
  }}}
const mag=(x,y)=>`<g transform="translate(${x} ${y})"><g class="bob"><circle r="26" fill="#D4BB49" stroke="${INK}" stroke-width="4"/><circle cx="-4" cy="-4" r="10" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/><path d="M4 4 L13 13" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g></g>`;

/* small scene props */
const shoeArt=(x,y)=>`<g transform="translate(${x} ${y}) rotate(-12)"><path d="M-46 0 Q-46 -18 -16 -18 L30 -12 Q50 -10 50 2 Q50 16 30 16 L-16 20 Q-46 22 -46 6Z" fill="#946F4B" opacity=".75"/></g>`;
const smudgeArt=(x,y)=>`<g transform="translate(${x} ${y})" opacity=".8">${[0,1,2,3,4].map(k=>`<ellipse rx="${6+k*5}" ry="${8+k*6}" fill="none" stroke="#FFFFFF" stroke-width="3"/>`).join('')}</g>`;
const noteArt=(x,y)=>`<g transform="translate(${x} ${y}) rotate(-8)"><rect x="-44" y="-30" width="88" height="60" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/><text y="-2" text-anchor="middle" font-size="16" font-weight="700" fill="${INK}" font-family="Fredoka,sans-serif">12-9-7</text><text y="20" text-anchor="middle" font-size="16" font-weight="700" fill="#C86062" font-family="Fredoka,sans-serif">8-20</text></g>`;
const boardArt=(x,y,t,c='#D4BB49')=>`<g transform="translate(${x} ${y})"><rect x="-6" y="0" width="12" height="120" fill="#946F4B"/><rect x="-76" y="-66" width="152" height="74" rx="10" fill="${c}" stroke="${INK}" stroke-width="5"/><text y="-18" text-anchor="middle" font-size="26" font-weight="900" fill="${INK}">${t}</text></g>`;
const gaugeArt=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-12" y="-150" width="24" height="170" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/>${[0,1,2,3,4,5].map(k=>`<line x1="-12" y1="${-140+k*28}" x2="4" y2="${-140+k*28}" stroke="#C86062" stroke-width="4"/>`).join('')}</g>`;
const crateArt=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-44" y="-40" width="88" height="70" fill="#BB9A7A" stroke="${INK}" stroke-width="5"/><path d="M-44 -40 L44 30 M44 -40 L-44 30" stroke="#946F4B" stroke-width="5"/><rect x="-26" y="-56" width="40" height="30" fill="#FFFFFF" stroke="${INK}" stroke-width="3" transform="rotate(-14)"/></g>`;
const tracksArt=(x,y)=>`<g transform="translate(${x} ${y})" fill="#6E5D50">${[[-50,6],[-15,-6],[20,6],[55,-6]].map(([dx,dy])=>`<ellipse cx="${dx}" cy="${dy}" rx="9" ry="11"/><circle cx="${dx-8}" cy="${dy-13}" r="4"/><circle cx="${dx}" cy="${dy-16}" r="4"/><circle cx="${dx+8}" cy="${dy-13}" r="4"/>`).join('')}</g>`;
const poleArt=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M0 0 L150 10 L150 22 L0 14Z" fill="#2E384F" opacity=".5"/><rect x="-6" y="-150" width="12" height="160" fill="#946F4B" stroke="${INK}" stroke-width="3"/><path d="M6 -148 l46 14 l-46 14z" fill="#2B79B5"/></g>`;
const compassArt=(x,y)=>`<g transform="translate(${x} ${y})"><circle r="34" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/><path d="M0 -26 L8 0 L-8 0Z" fill="#C86062"/><path d="M0 26 L8 0 L-8 0Z" fill="#2B79B5"/></g>`;
const moonArt=(x,y)=>`<g transform="translate(${x} ${y})"><circle r="40" fill="#FFFFFF" opacity=".9"/><circle cx="16" cy="-6" r="36" fill="#92C3DB"/></g>`;

/* puzzle pictures */
function shelfPic(){let s=`<rect width="800" height="500" fill="#C86062"/>`;[120,260,400].forEach(y=>s+=`<rect x="20" y="${y}" width="760" height="18" fill="#946F4B"/>`);
  const box=(x,y,c)=>`<rect x="${x}" y="${y}" width="70" height="80" fill="${c}" stroke="${INK}" stroke-width="3"/>`;
  s+=box(60,40,'#D4BB49')+box(260,40,'#8DB36E')+box(560,40,'#2B79B5')+box(250,180,'#D29841')+box(560,180,'#D4BB49')+box(80,320,'#2B79B5')+box(470,320,'#8DB36E');
  s+=`<g transform="translate(150 330)"><rect x="-46" y="-20" width="92" height="40" rx="18" fill="#494952"/><circle cx="-18" cy="0" r="12" fill="none" stroke="#FFFFFF" stroke-width="4"/><circle cx="18" cy="0" r="12" fill="none" stroke="#FFFFFF" stroke-width="4"/></g>`;
  s+=`<g transform="translate(430 180) rotate(8)"><rect x="-40" y="-28" width="80" height="56" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/><text y="14" text-anchor="middle" font-size="40" font-weight="700" fill="#7E5FA3" font-family="Fredoka,sans-serif">X</text></g>`;
  s+=`<g transform="translate(650 365) rotate(-20)"><circle r="18" fill="none" stroke="#D4BB49" stroke-width="8"/><rect x="14" y="-5" width="56" height="10" fill="#D4BB49"/><rect x="52" y="4" width="8" height="14" fill="#D4BB49"/><rect x="64" y="4" width="6" height="10" fill="#D4BB49"/></g>`;
  return s}
function boatPhoto(){return `<rect width="600" height="600" fill="#92C3DB"/><circle cx="500" cy="90" r="50" fill="#D4BB49"/><rect y="400" width="600" height="200" fill="#599EC4"/><path d="M60 420 Q80 500 160 510 H460 Q540 500 560 420Z" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/><rect x="60" y="440" width="500" height="16" fill="#C86062"/><rect x="170" y="330" width="260" height="96" rx="12" fill="#F4EDD2" stroke="${INK}" stroke-width="5"/><g transform="translate(300 470) scale(1.25)">${critter({k:'xfox',shirt:'#3D3E52',hat:{t:'cap',c:'#C86062'},glasses:1,bag:'o'})}</g><text x="300" y="560" text-anchor="middle" font-size="34" font-weight="900" fill="${INK}">日月號</text>`}
function cabinPic(){return `<rect width="800" height="500" fill="#F4EDD2"/>${[0,1,2,3,4,5,6,7].map(k=>`<line x1="${k*100}" y1="0" x2="${k*100}" y2="500" stroke="#D8C29B" stroke-width="4"/>`).join('')}<rect x="560" y="60" width="180" height="130" rx="16" fill="#92C3DB" stroke="${INK}" stroke-width="6"/><circle cx="120" cy="420" r="40" fill="#BB9A7A" stroke="${INK}" stroke-width="5"/>`}
const cabinSecret2=`<text x="320" y="230" text-anchor="middle" font-size="46" font-weight="700" fill="#EADEF7" font-family="Fredoka,sans-serif">Look under</text><text x="320" y="300" text-anchor="middle" font-size="46" font-weight="700" fill="#EADEF7" font-family="Fredoka,sans-serif">the big rock.</text>`;
const cabinSecret=`<text x="320" y="230" text-anchor="middle" font-size="46" font-weight="700" fill="#EADEF7" font-family="Fredoka,sans-serif">The key is</text><text x="320" y="300" text-anchor="middle" font-size="46" font-weight="700" fill="#EADEF7" font-family="Fredoka,sans-serif">under the rock.</text><text x="320" y="380" text-anchor="middle" font-size="60" font-weight="700" fill="#EADEF7" font-family="Fredoka,sans-serif">X</text>`;
function windowPic(){let s=`<rect width="800" height="500" fill="#B87F6D"/>`;[[150,150],[400,150],[650,150]].forEach(([x,y])=>s+=`<rect x="${x-100}" y="${y-110}" width="200" height="330" rx="100" fill="#413737" stroke="${INK}" stroke-width="6"/>`);
  s+=`<g transform="translate(160 230)"><path d="M-40 10 Q-38 -40 0 -42 Q38 -40 40 10Z" fill="#C86062"/><rect x="-50" y="6" width="100" height="12" rx="6" fill="#C86062"/></g>`;
  s+=`<g transform="translate(410 290)"><path d="M-30 -60 L30 -10" stroke="#5B4535" stroke-width="5"/><circle cx="30" cy="0" r="34" fill="#936F52"/><circle cx="30" cy="0" r="18" fill="none" stroke="#BFA68C" stroke-width="4" stroke-dasharray="5 4"/></g>`;
  s+=`<g transform="translate(650 200)"><circle cx="-22" r="18" fill="none" stroke="#FFFFFF" stroke-width="5"/><circle cx="22" r="18" fill="none" stroke="#FFFFFF" stroke-width="5"/><path d="M-4 0 H4" stroke="#FFFFFF" stroke-width="5"/></g>`;return s}
const passage=t=>`<div class="passage">${t}</div>`;

/* ================= 多叔 walks to whoever / whatever he investigates ================= */
function placeDuo(x,y,h){SC.duo=[x,y,h];DUO.at=[x,y,h];const P=bodyFor(DUO.pose),w=h*P.r;
  const b=document.getElementById('duoBody'),r=document.getElementById('duoHit');
  if(b){b.setAttribute('x',x-w/2);b.setAttribute('y',y-h);b.setAttribute('width',w);b.setAttribute('height',h)}
  if(r){r.setAttribute('x',x-h*.3);r.setAttribute('y',y-h);r.setAttribute('height',h)}}
function duoGo(sp){return new Promise(res=>{
  if(!SC||!SC.ground||!SC.duo||!sp||sp.type==='badge')return res();
  const [x0,y0,h0]=SC.duo,[lo,hi]=SC.range;
  const side=(sp.x-x0)>0?-1:1,gap=sp.type==='npc'?70*(sp.s||1)+h0*.3+10:150;
  let tx=sp.x+side*gap;if(tx<lo||tx>hi)tx=sp.x-side*gap;tx=Math.max(lo,Math.min(hi,tx));
  let ty=sp.type==='npc'?sp.y+3:SC.ground(tx);const th=SC.duoH?SC.duoH(ty):h0;
  if(Math.abs(tx-x0)<25&&Math.abs(ty-y0)<12)return res();
  if(sp.type==='npc'&&sp.y<y0-1)drawSpots(); // keep depth order right
  const t0=performance.now(),D=Math.min(900,300+Math.abs(tx-x0)*.7);
  const f=t=>{const k=Math.min((t-t0)/D,1),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    placeDuo(x0+(tx-x0)*e,y0+(ty-y0)*e-Math.abs(Math.sin(k*Math.PI*5))*10*(1-k),h0+(th-h0)*e);
    if(k<1)requestAnimationFrame(f);else{placeDuo(tx,ty,th);drawSpots();res()}};
  tone([330,392],.08,'sine',.06);requestAnimationFrame(f)})}

/* ================= look back at the scene while a puzzle is open ================= */
function peekOn(){const m=$('#modal');if(m.hidden)return;m.hidden=true;$('#peekBtn').hidden=false;$('#stage').classList.add('peek');camFull()}
function peekOff(){$('#modal').hidden=false;$('#peekBtn').hidden=true;$('#stage').classList.remove('peek')}

/* ================= second layer for the clue board (opens on top of anything) ================= */
function modal2(html,bind){$('#m2Body').innerHTML=html;$('#modal2').hidden=false;if(bind)bind($('#m2Body'))}
function closeModal2(){$('#modal2').hidden=true;$('#m2Body').innerHTML=''}

/* ================= cutscene panels ================= */
const NIGHT=(body)=>`<svg viewBox="0 0 1600 900" style="width:100%;height:100%;display:block"><rect width="1600" height="900" fill="#2E3550"/>${[[120,90],[380,160],[620,70],[900,140],[1180,80],[1460,170],[260,300],[1320,330],[760,260]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="#F3E8CF"/>`).join('')}<circle cx="1320" cy="190" r="90" fill="#F1E3B0"/><circle cx="1360" cy="160" r="80" fill="#2E3550"/>${body}</svg>`;
function cutscene(panels){return new Promise(res=>{let i=0;const el=document.createElement('div');el.className='cut';document.body.appendChild(el);
  const show=()=>{const p=panels[i];el.innerHTML=`<div class="cutframe"><div class="cutpic">${p.pic}</div><div class="cutcap">${p.speaker?`<b>${p.speaker}</b>`:''}<span>${fmt(p.t)}</span></div><div class="cutnext">${i<panels.length-1?'點一下繼續 ▶':'點一下開始 ▶'}</div><button class="cutskip" type="button">跳過</button></div>`;
    if(p.sfx)p.sfx();el.querySelector('.cutskip').onclick=e=>{e.stopPropagation();el.remove();res()}};
  el.onclick=()=>{sPop();i++;if(i<panels.length)show();else{el.remove();res()}};show()})}
function openingCut(){const sky=(x)=>`<g fill="#3E4766">${[[0,640,120,260],[140,600,90,300],[260,660,140,240],[440,580,110,320],[1040,620,130,280],[1200,560,100,340],[1330,650,150,250],[1500,600,100,300]].map(([a,b,c,d])=>`<rect x="${a+x}" y="${b}" width="${c}" height="${d}"/>`).join('')}</g>`;
  const tower=`<g fill="#4A5578">${t101(800,900,2.1,'#4A5578')}</g><circle cx="800" cy="${900-60*2.1-8*26*2.1-62*2.1}" r="26" fill="#F7E08A"/><circle cx="800" cy="${900-60*2.1-8*26*2.1-62*2.1}" r="52" fill="#F7E08A" opacity=".35"/>`;
  const xbig=`<g transform="translate(800 960) scale(3.2)">${critter(X_LOOK)}</g>`;
  return cutscene([
    {pic:NIGHT(sky(0)+tower),t:'深夜的台北。台北101的最頂端，亮著一盞特別的燈。'},
    {pic:NIGHT(sky(0)+tower+`<g transform="translate(1240 640) scale(1.1)"><path d="M-60 -120 Q-90 -30 -70 0 H70 Q90 -30 60 -120Z" fill="#1E2236"/>${critter(Object.assign({},X_LOOK,{shirt:'#1E2236'}))}</g>`),t:'一個披著斗篷的身影，站在對面的屋頂上，悄悄看著那盞燈……',sfx:()=>tone([220,196,175],.25,'sine',.1)},
    {pic:NIGHT(xbig),speaker:'怪盜X',t:'「台灣最美的寶物，我通通都要！呵呵呵～」',sfx:()=>tone([392,330,262],.18,'square',.06)},
    {pic:`<svg viewBox="0 0 1600 900" style="width:100%;height:100%;display:block"><rect width="1600" height="900" fill="#EAD9B5"/><rect x="560" y="120" width="480" height="780" rx="14" fill="#B4614F" stroke="#3B3141" stroke-width="10"/><rect x="620" y="200" width="360" height="300" rx="12" fill="#A4544A"/><g transform="translate(800 820) rotate(-6)"><rect x="-150" y="-80" width="300" height="160" rx="10" fill="#FFFFFF" stroke="#3B3141" stroke-width="8"/><path d="M-150 -80 L0 20 L150 -80" fill="none" stroke="#3B3141" stroke-width="8"/><circle cy="10" r="38" fill="#7E5FA3" stroke="#3B3141" stroke-width="6"/><text y="28" text-anchor="middle" font-size="46" font-weight="700" fill="#fff" font-family="Fredoka,sans-serif">X</text></g></svg>`,t:'第二天早上——一封紅色的信，被塞進了「多叔偵探事務所」的門縫。'}
  ])}

/* ================= case card ================= */
function caseCard(no,title,goal,place){return new Promise(res=>{sBell();
  modal(`<div class="card casecard" style="width:min(640px,100%)"><div class="casetag">委託 No.${no}</div><div class="caseplace">${place}</div><h3 class="casetitle">${title}</h3><div class="casegoal"><b>任務目標</b>${goal}</div><div class="casestamp">受理</div><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn c" id="ccOk">接下委託！</button></div></div>`,b=>{b.querySelector('#ccOk').onclick=()=>{closeModal();res()}})})}

/* ================= 多叔's signature close-up ================= */
function finisher(line){return new Promise(res=>{const el=document.createElement('div');el.className='fin';const perfect=G.energy>=5;
  el.innerHTML=`<svg class="finlines" viewBox="-800 -500 1600 1000" preserveAspectRatio="xMidYMid slice">${Array.from({length:40},(_,k)=>{const a=k*9*Math.PI/180,b=a+.06;return `<path d="M0 0 L${Math.cos(a)*1400} ${Math.sin(a)*1400} L${Math.cos(b)*1400} ${Math.sin(b)*1400}Z" fill="${k%2?'#F4D774':'#F7E7A6'}"/>`}).join('')}</svg>
    <img class="finbust" src="${COAT.bust_coat.b}" alt=""><div class="finline">${fmt(line)}</div>${perfect?'<div class="finperfect">完美推理！</div>':''}<div class="cutnext" style="color:#3B3141">點一下繼續 ▶</div>`;
  document.body.appendChild(el);tone([523,659,784,1047],.1,'square',.08);setTimeout(()=>tone([1047,1319,1568],.12),500);
  el.onclick=()=>{el.remove();res()}})}

/* ================= chapter result page ================= */
function chapterResult(no,title){return new Promise(res=>{const tot=SC.spots.filter(s=>s.need).length,done=SC.spots.filter(s=>s.need&&s.done).length;
  const bones=SC.spots.filter(s=>s.type==='badge'),bg=bones.filter(s=>s.got).length,score=Math.min(100,40+G.energy*8+bg*4),stars=score>=90?3:score>=70?2:1;
  G.results=G.results||{};G.results[no]={score,stars};save();sWin();
  modal(`<div class="card book" style="width:min(900px,100%)"><div class="bookL"><div class="booktag">第 ${no} 話</div><h3>${title}</h3>
    <p><b>破案關卡</b>　${done} / ${tot}</p><p><b>骨頭徽章</b>　${'🦴'.repeat(bg)}${'・'.repeat(bones.length-bg)}　${bg} / ${bones.length}</p><p><b>推理力</b>　${'♥'.repeat(G.energy)}<span style="opacity:.3">${'♥'.repeat(5-G.energy)}</span></p></div>
    <div class="bookR"><div class="bookstamp">${stars===3?'做得好！':stars===2?'不錯喔！':'完成了！'}</div><img src="${COAT.coat_tip.b}" alt="" style="height:170px"><div class="bookscore"><b>${score}</b> 分</div><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div></div>
    <div class="row" style="justify-content:flex-end;grid-column:1/-1"><button class="btn c" id="brOk">繼續下一段旅程</button></div></div>`,b=>{b.querySelector('#brOk').onclick=()=>{closeModal();res()}})})}

/* ================= action: maze chase up the tower ================= */
const MAZE=["S..#.....","..#..##..",".#...#..#",".####.#..","......#.#","#.###...X"];
function mazeChase(){return new Promise(res=>{const R=MAZE.length,C=MAZE[0].length;let fails=0,timer=null;
  modal(`<div class="card" data-duo="run" style="width:min(940px,100%)"><div class="row" style="justify-content:space-between"><h3>追上怪盜X！</h3><div class="pill" id="mzT">⏱ 60</div></div>
    <p class="lead">電梯被怪盜X弄壞了！沿著走廊和樓梯追上頂樓。點旁邊的格子或方向鍵移動，順路撿起放大鏡可以加分。</p>
    <div class="mzwrap"><svg id="mzS" viewBox="0 0 ${C*100} ${R*100}" style="width:100%;display:block;border:4px solid var(--line);border-radius:16px;touch-action:none"></svg>
    <div class="dpad"><span></span><button data-d="0,-1">▲</button><span></span><button data-d="-1,0">◀</button><span></span><button data-d="1,0">▶</button><span></span><button data-d="0,1">▼</button><span></span></div></div><div class="fb" id="mzF"></div></div>`,b=>{
    const q=s=>b.querySelector(s);let pos,coins,t,slow=false;
    function start(){pos=[0,0];coins=new Set(['0,4','5,3','6,2']);t=60;draw();clearInterval(timer);
      if(!slow)timer=setInterval(()=>{t--;q('#mzT').textContent='⏱ '+t;if(t<=0){clearInterval(timer);fails++;sBad();q('#mzF').className='fb no';q('#mzF').textContent=fails>=2?'時間到了！這次改成「慢慢模式」，沒有時間限制，慢慢走。':'時間到了！沒關係，再追一次！';if(fails>=2){slow=true;q('#mzT').textContent='慢慢模式'}setTimeout(start,1500)}},1000)}
    function draw(){let s='';for(let r=0;r<R;r++)for(let c=0;c<C;c++){const w=MAZE[r][c]==='#';s+=`<rect x="${c*100}" y="${r*100}" width="100" height="100" fill="${w?'#8E7558':'#F5ECD6'}" stroke="#E2D2AE" stroke-width="2" data-c="${c},${r}"/>`;if(w)s+=`<path d="M${c*100} ${r*100+33}h100M${c*100} ${r*100+66}h100" stroke="#7A6248" stroke-width="3"/>`}
      coins.forEach(k=>{const [c,r]=k.split(',').map(Number);s+=`<g transform="translate(${c*100+50} ${r*100+50})"><circle r="22" fill="#E5C35A" stroke="#3B3141" stroke-width="4"/><circle cx="-4" cy="-4" r="8" fill="#fff" stroke="#3B3141" stroke-width="3"/><path d="M3 3 l9 9" stroke="#3B3141" stroke-width="5" stroke-linecap="round"/></g>`});
      s+=`<g transform="translate(${8*100+50} ${5*100+96}) scale(.42)">${critter(X_LOOK)}</g>`;
      s+=`<image href="${COAT.bust_coat.b}" x="${pos[0]*100+8}" y="${pos[1]*100+4}" width="84" height="94"/>`;q('#mzS').innerHTML=s}
    function move(dx,dy){const nx=pos[0]+dx,ny=pos[1]+dy;if(nx<0||ny<0||nx>=C||ny>=R||MAZE[ny][nx]==='#'){tone([200],.05,'square',.05);return}
      pos=[nx,ny];tone([600],.04,'sine',.08);const k=nx+','+ny;if(coins.has(k)){coins.delete(k);G.mz=(G.mz||0)+1;tone([880,1175],.08)}
      draw();if(MAZE[ny][nx]==='X'){clearInterval(timer);sWin();q('#mzF').className='fb ok';q('#mzF').textContent='追上了！';lockFor(()=>{closeModal();res()},1300)}}
    q('.dpad').onclick=e=>{const x=e.target.closest('button');if(!x)return;const [dx,dy]=x.dataset.d.split(',').map(Number);move(dx,dy)};
    q('#mzS').onclick=e=>{const c=e.target.closest('[data-c]');if(!c)return;const [x,y]=c.dataset.c.split(',').map(Number);const dx=x-pos[0],dy=y-pos[1];if(Math.abs(dx)+Math.abs(dy)===1)move(dx,dy)};
    window.__mz={move,pos:()=>pos};start();});})}


/* ================= action: tail the thief without being seen ================= */
function tailGame(){return new Promise(res=>{let prog=0,look=0,warn=false,hold=false,loop=null,lastSafe=0,caught=0;
  modal(`<div class="card" data-duo="hmm" style="width:min(940px,100%)"><div class="row" style="justify-content:space-between"><h3>跟蹤怪盜X</h3><div class="pill" id="tlP">0%</div></div>
    <p class="lead">按住「跟上」往前走。怪盜X頭上出現「？」就是要回頭了，馬上放手、停下來！被他看到會退回上一個檢查點。</p>
    <svg id="tlS" viewBox="0 0 1600 420" style="width:100%;display:block;border:4px solid var(--line);border-radius:16px"></svg>
    <div class="row" style="justify-content:center;margin-top:12px"><button class="btn c" id="tlGo" style="min-width:260px;min-height:76px;font-size:26px;touch-action:none">按住「跟上」</button></div><div class="fb" id="tlF"></div></div>`,b=>{
    const q=s=>b.querySelector(s);
    function draw(){const dx=120+prog*10.4,xx=Math.min(1480,dx+340);let s=`<rect width="1600" height="420" fill="#BFD6E2"/><path d="M0 230 Q400 200 800 230 T1600 220 V420 H0Z" fill="#7FAE6B"/><rect y="300" width="1600" height="120" fill="#D9C08F"/>`;
      [200,520,840,1160,1480].forEach((x,k)=>s+=`<g transform="translate(${x} 300)"><circle cx="-30" r="44" fill="#6E9A5C"/><circle cx="20" cy="-10" r="52" fill="#7FAE6B"/><circle cx="60" r="40" fill="#6E9A5C"/></g>`);
      [25,50,75].forEach(p=>{const x=120+p*10.4;s+=`<g transform="translate(${x} 380)"><rect x="-3" y="-60" width="6" height="60" fill="#8B6A48"/><path d="M3 -60 l30 10 l-30 10z" fill="${prog>=p?'#8DB36E':'#E2D2AE'}"/></g>`});
      s+=`<g transform="translate(${xx} 395) scale(${look?-1:1} 1) scale(.95)">${critter(Object.assign({},X_LOOK,{mask:1}))}</g>`;
      if(warn&&!look)s+=`<g transform="translate(${xx} 120)"><circle r="34" fill="#F4D774" stroke="#3B3141" stroke-width="5"/><text y="14" text-anchor="middle" font-size="44" font-weight="900" fill="#3B3141">？</text></g>`;
      if(look)s+=`<g transform="translate(${xx} 120)"><circle r="34" fill="#C86062" stroke="#3B3141" stroke-width="5"/><text y="14" text-anchor="middle" font-size="44" font-weight="900" fill="#fff">！</text></g>`;
      s+=`<image href="${COAT.coat_pocket.b}" x="${dx-60}" y="${395-210}" width="${210*COAT.coat_pocket.r}" height="210"/>`;
      q('#tlS').innerHTML=s;q('#tlP').textContent=Math.floor(prog)+'%'}
    let nextTurn=performance.now()+2200+Math.random()*1800,phase=0;
    const tick=()=>{const now=performance.now();
      if(phase===0&&now>nextTurn){phase=1;warn=true;nextTurn=now+(caught>=3?1400:800)}
      else if(phase===1&&now>nextTurn){phase=2;warn=false;look=1;nextTurn=now+1300}
      else if(phase===2&&now>nextTurn){phase=0;look=0;nextTurn=now+2000+Math.random()*2200}
      if(hold){if(look){caught++;sBad();prog=lastSafe;hold=false;q('#tlF').className='fb no';q('#tlF').textContent=caught>=3?'被發現了！怪盜X看起來有點累，回頭的速度變慢了。':'被發現了！退回檢查點，看到「？」就要停下來喔。';if(caught>=3){/* gentler */}}
        else{prog=Math.min(100,prog+(caught>=3?.9:.7));[25,50,75].forEach(p=>{if(prog>=p&&lastSafe<p){lastSafe=p;tone([784],.08)}})}}
      draw();if(prog>=100){clearInterval(loop);sWin();q('#tlF').className='fb ok';q('#tlF').textContent='成功跟到船邊了！';lockFor(()=>{closeModal();res()},1400)}};
    const g=q('#tlGo');const on=e=>{e.preventDefault();hold=true},off=()=>{hold=false};
    g.addEventListener('pointerdown',on);g.addEventListener('pointerup',off);g.addEventListener('pointerleave',off);g.addEventListener('pointercancel',off);
    window.__tl={look:()=>look||warn,set:v=>{hold=v},prog:()=>prog};loop=setInterval(tick,50);draw();});})}


/* ================= notebook ================= */
const FEATS=[['戴眼鏡',/眼鏡/],['紅色帽子',/紅帽子|紅色的帽子|red hat/],['圓形包包',/圓形的包包|圓包包/],['是一隻狐狸',/狐狸/]];
function clueBoard(go){return new Promise(res=>{const ev=G.ev||[];let tab=Math.min(Math.max(G.ch||1,1),CASE().inv[1]);
  const all=ev.map(e=>e.t+e.x).join(' ')+G.clues.join(' ');const got=CASE().feats().filter(f=>f[1].test(all));
  modal2(`<div class="card board" style="width:min(1000px,100%)"><div class="boardtop"><span class="tape">怪盜X 線索板</span><div class="btabs">${CASE().tabs.map((t,i)=>i?`<button data-t="${i}">${t}</button>`:'').join('')}</div></div>
    <div class="boardbody"><div class="suspect"><div class="sil">${head(X_LOOK)}<b>？</b></div><div class="feat">${got.length?got.map(f=>`<span>${f[0]}</span>`).join(''):'<em>還沒有找到特徵</em>'}</div></div><div class="cards" id="bc"></div></div>
    <div class="banner"><b>怪盜X的特徵：</b>${got.length?got.map(f=>f[0]).join('、'):'繼續調查，把線索找出來！'}</div>
    <div class="row" style="justify-content:space-between;margin-top:12px"><div class="small">骨頭徽章 ${G.badges.length}/${CASE().badges}　幫忙任務 ${G.quests.length}/${CASE().quests}</div><div class="row">${go?'':'<button class="btn w" id="nbHome">回封面</button>'}<button class="btn ${go?'c':''}" id="nbOk">${go?'開始推理！':'關閉'}</button></div></div></div>`,b=>{
    function draw(){b.querySelectorAll('.btabs button').forEach(x=>x.className=+x.dataset.t===tab?'on':'');
      const list=ev.filter(e=>e.ch===tab);b.querySelector('#bc').innerHTML=list.length?list.map((e,k)=>`<div class="ecard" style="transform:rotate(${(k%3-1)*1.6}deg)"><i></i><small>證物 #${String(e.n).padStart(2,'0')}</small><b>${e.t}</b><p>${e.x}</p></div>`).join(''):'<p class="nocard">這裡還沒有證物。到現場調查，找到的證物會釘在這裡。</p>'}
    b.querySelector('.btabs').onclick=e=>{const x=e.target.closest('button');if(!x)return;tab=+x.dataset.t;sPop();draw()};
    b.querySelector('#nbOk').onclick=()=>{closeModal2();res()};const h=b.querySelector('#nbHome');if(h)h.onclick=()=>location.reload();draw()});})}
$('#nbBtn').onclick=()=>{if(!$('#modal2').hidden)return;clueBoard(false)};
$('#pauseBtn').onclick=()=>{if(!$('#modal2').hidden||!$('#title').hidden)return;save();sPop();
  const dn=((G.done||{})[G.ch]||[]).length,chn=CASE().chn[G.ch]||'';
  modal2(`<div class="card pausecard" style="width:min(520px,100%)"><h3>暫停休息一下</h3>
    <div class="savebox"><span class="saveicon">✔</span><div><b>進度已經自動存好了</b><small>${chn}${G.ch>=CASE().inv[0]&&G.ch<=CASE().inv[1]?`・已破解 ${dn} 關`:''}・推理力 ${G.energy}・骨頭徽章 ${G.badges.length}</small></div></div>
    <p class="lead">下次打開遊戲，在首頁打開「案件簿」按「繼續辦案」，就會回到這一章，已經破解的關卡不用再玩一次。</p>
    <div class="row" style="justify-content:flex-end;gap:10px"><button class="btn w" id="pzHome">存檔並回到首頁</button><button class="btn c" id="pzGo">繼續玩</button></div></div>`,b=>{
    b.querySelector('#pzGo').onclick=()=>closeModal2();
    b.querySelector('#pzHome').onclick=()=>{save();location.reload()}})};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&typeof G!=='undefined'&&G&&$('#title').hidden)save()});
$('#peekBtn').onclick=()=>{sPop();peekOff()};
