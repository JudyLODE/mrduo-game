/* 開機：首頁、角色設計、開始／繼續遊戲。一定要最後載入。 */
"use strict";
/* ================= boot ================= */
async function run(from){
  AV={...(G.av||AV)};hud();DUO.coat=from>=1;
  if(from<=0){await openingCut();await prologue()}
  if(from<=1)await ch1();
  if(from<=2)await ch2();
  if(from<=3)await ch3();
  await finale();
}
const standalone=window.navigator.standalone===true||(window.matchMedia&&matchMedia('(display-mode: standalone),(display-mode: fullscreen)').matches);
if(standalone)$('#appBtn').hidden=true;
$('#appBtn').onclick=()=>modal(`<div class="card" style="width:min(560px,100%)"><h3>把遊戲變成 App</h3>
  <p class="lead">加到主畫面後，點圖示就會全螢幕開始遊戲；打開過一次後，沒有網路也能玩。</p>
  <p style="margin:0 0 4px;font-weight:900">iPad／iPhone（Safari）</p>
  <ol class="appsteps"><li>點網址列旁的 <b>分享</b> 按鈕（方框加向上箭頭）</li><li>往下找到 <b>加入主畫面</b></li><li>點右上角 <b>新增</b>，主畫面就會出現多叔的圖示</li></ol>
  <p style="margin:12px 0 4px;font-weight:900">Android 手機或平板（Chrome）</p>
  <ol class="appsteps"><li>點右上角 <b>⋮</b> 選單</li><li>選 <b>加到主畫面</b> 或 <b>安裝應用程式</b></li></ol>
  <div class="row" style="margin-top:14px"><button class="btn" id="appOk">知道了</button></div></div>`,b=>{b.querySelector('#appOk').onclick=closeModal});
const avBody=(a=AV)=>`<svg viewBox="-120 -262 240 272">${critter(avLook(a))}</svg>`;
function avDraw(){$('#avPrev').innerHTML=avHead()}
$('#avEdit').onclick=()=>{let step=0;const keep={...AV};
  modal(`<div class="card avcard" style="width:min(900px,100%)"><div class="avsteps"><span id="st0">① 選角色</span><span id="st1">② 選表情</span></div>
    <div class="avgrid"><div class="avbig" id="avBig"></div><div class="avpanel"><h3 id="avQ"></h3><div class="avchoices" id="avC"></div>
    <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn w" id="avBack">取消</button><button class="btn c" id="avNext">下一步</button></div></div></div></div>`,b=>{
    const q=x=>b.querySelector(x);
    function draw(){q('#avBig').innerHTML=avBody();q('#st0').className=step===0?'on':'';q('#st1').className=step===1?'on':'';
      q('#avQ').textContent=step===0?'要選擇哪一個角色？':'要選擇哪一個表情？';q('#avBack').textContent=step===0?'取消':'上一步';q('#avNext').textContent=step===0?'下一步':'完成';
      q('#avC').innerHTML=step===0?AV_K.map(([k,n])=>`<button type="button" data-v="${k}" aria-pressed="${AV.k===k}">${avHead({k,m:AV.m})}<span>${n}</span></button>`).join('')
        :AV_M.map(([m,n])=>`<button type="button" data-v="${m}" aria-pressed="${AV.m===m}">${avHead({k:AV.k,m})}<span>${n}</span></button>`).join('')}
    q('#avC').onclick=e=>{const x=e.target.closest('button');if(!x)return;if(step===0)AV.k=x.dataset.v;else AV.m=x.dataset.v;sPop();draw()};
    q('#avBack').onclick=()=>{if(step===0){AV={...keep};closeModal();avDraw()}else{step=0;draw()}};
    q('#avNext').onclick=()=>{if(step===0){step=1;draw()}else{sGood();closeModal();avDraw()}};
    draw();});};
const prev=load();
function clearsNow(){const m=meta();let c=m.clears||0;if(!c&&prev&&prev.ch>=5){c=1;m.clears=1;setMeta(m)}return c}
{const c=clearsNow();if(c>0){const t=document.createElement('div');t.className='roundtag';t.textContent=`已破案 ${c} 次・開始新的冒險會出現${c%2?'全新的第二套題目':'第一套題目'}`;$('#goBtn').parentElement.before(t)}}if(prev&&prev.av)AV={...prev.av};avDraw();
if(prev&&prev.ch>=0&&prev.ch<=4){const dn=((prev.done||{})[prev.ch]||[]).length;$('#resBtn').hidden=false;
  $('#resBtn').innerHTML=`繼續上次的冒險<small>${['序章','第一章','第二章','第三章','最終章'][prev.ch]}${dn?`・已破解 ${dn} 關`:''}</small>`}
const newGame=()=>{G={round:clearsNow(),av:{...AV},name:$('#pname').value.trim()||'小偵探',level:'hard',energy:5,badges:[],quests:[],clues:[],facts:[],ch:0};save();tone([392,523,659],.1);$('#title').hidden=true;run(0)};
$('#goBtn').onclick=()=>{if(!prev||prev.ch>4){newGame();return}
  modal(`<div class="card" style="width:min(500px,100%)"><h3>要重新開始嗎？</h3><p class="lead">重新開始的話，上次存好的進度會被新的冒險取代。</p><div class="row" style="justify-content:flex-end;gap:10px"><button class="btn w" id="ngNo">回去繼續上次的</button><button class="btn c" id="ngYes">重新開始</button></div></div>`,b=>{b.querySelector('#ngYes').onclick=()=>{closeModal();newGame()};b.querySelector('#ngNo').onclick=()=>{closeModal();$('#resBtn').click()}})};
$('#resBtn').onclick=()=>{G=Object.assign(G||{},prev);G.av={...AV};G.level='hard';G.name=$('#pname').value.trim()||prev.name||'小偵探';G.done=G.done||{};save();$('#title').hidden=true;hud();toast('讀取存檔成功！歡迎回來，'+G.name);run(prev.ch)};
setScene({id:'office',color:'#EAD9B5',bg:bgOffice,spots:[]});hud();$('#heroImg').src=COAT.coat_tip.b;
