/* 第二案「怪盜X的魔術環島」劇本。設計見 DESIGN.md。
   目前完成：開場、序章（事務所）、第一章 野柳。其他章節製作中（run2 會顯示「未完待續」）。
   第二套題目放在 ALTS2（key＝關卡 id，只覆寫 run／intro／ev），破案後再玩時使用。 */
"use strict";
const ALTS2={};   // TODO：第二套題目（見 CHANGELOG 待辦）
function pz2(id,x,y,o){if(G&&G.cs===2&&ALT()&&ALTS2[id])o=Object.assign({},o,ALTS2[id]);return pz(id,x,y,o)}

/* ================= 開場與序章 ================= */
function c2Opening(){const stage=(inner)=>NIGHT(`<rect x="300" y="560" width="1000" height="60" fill="#5A3E52"/><path d="M300 120 Q800 60 1300 120 V560 H300Z" fill="#3E2E45"/>`+inner);
  return cutscene([
    {pic:stage(`<g transform="translate(800 560) scale(2.6)">${critter(X2_LOOK)}</g><text x="800" y="200" text-anchor="middle" font-size="64" fill="#F2E6B8">✨</text>`),speaker:'魔術師怪盜X',t:'「各位觀眾！上次是我不小心，這次——我學會了魔術！」',sfx:()=>tone([523,659,784],.15,'square',.06)},
    {pic:stage(`<g transform="translate(560 560) scale(1.6)">${critter(X2_LOOK)}</g><text x="1020" y="380" text-anchor="middle" font-size="120">🧊🍲🪨🎈👣</text>`),t:'冰會變得超級冷、湯會變顏色、石頭會呼吸、氣球會自己長大、腳印會發光……'},
    {pic:`<svg viewBox="0 0 1600 900" style="width:100%;height:100%;display:block"><rect width="1600" height="900" fill="#EAD9B5"/><rect x="560" y="120" width="480" height="780" rx="14" fill="#B4614F" stroke="#3B3141" stroke-width="10"/><rect x="700" y="760" width="200" height="120" rx="8" fill="#FFFFFF" stroke="#3B3141" stroke-width="6" transform="rotate(-6 800 820)"/><text x="800" y="840" text-anchor="middle" font-size="60" font-weight="900" fill="#7E5FA3" transform="rotate(-6 800 820)">X</text></svg>`,t:'隔天早上，多叔偵探事務所的門縫裡，又塞進了一封紫色的信……'}
  ])}
async function c2Prologue(){
  G.ch=0;save();setCh('序章　反著寫的邀請函');DUO.coat=false;
  setScene({id:'office',color:'#EAD9B5',bg:bgOffice,duo:[780,900,470],spots:[
    {id:'letter',type:'thing',x:1380,y:880,r:70,need:true,art:()=>`<g transform="translate(1380 880) rotate(-8)"><rect x="-60" y="-38" width="120" height="76" rx="6" fill="#E8DDF2" stroke="#2E384F" stroke-width="5"/><path d="M-60 -38 L0 6 L60 -38" fill="none" stroke="#2E384F" stroke-width="5"/><circle r="16" cy="4" fill="#7E5FA3" stroke="#2E384F" stroke-width="3"/></g>`,
     tap:async sp=>{sp.done=true;sp.hidden=true;drawSpots();
       await mirrorRead('反著寫的邀請函','致 偵探多叔：\n上次是我不小心，這次我學會了魔術！\n冰會變得超級冷、湯會變顏色、\n石頭會呼吸、氣球會自己長大、腳印會發光。\n第一場表演：北海岸的女王頭旁邊。\n—— 魔術師怪盜X',
         [{q:'怪盜X的第一場表演在哪裡？',w:'女王頭'},{q:'信上說，什麼東西會「自己長大」？',w:'氣球'},{q:'寫這封信的人，這次自稱是什麼？',w:'魔術師'}])}}]});
  await chapterCard('第二案','怪盜X的魔術環島','序章・多叔偵探事務所');
  await say('sys','叩叩叩——有人敲門。');
  const pg=await actorIn('pango2',CAST.pango2.look,1180,900,1);
  await say('pango2','多叔好！我是小穿山甲。上次你幫我找回氣球，我也想當偵探！');
  await say('duo','哈哈，歡迎你！從今天起，你就是我們的見習夥伴。',{e:'welcome'});
  await say('pango2','我的鼻子很靈，還會捲成一顆球、會挖土喔！');
  await say('duo','咦？門口那封紫色的信……{n}，幫我撿起來。',{e:'gasp'});
  hideDlg();await investigate('撿起門口的信',{button:false});
  await say('duo','女王頭在新北市的野柳地質公園。走吧，偵探出門要穿風衣！',{e:'point'});
  DUO.coat=true;setDuo('confident');sWin();
  await say('sys','多叔穿上風衣，小穿山甲也繫好了綠色的領巾。');
  hideDlg();await actorOut(pg,300,0);await travel(null,'yeliu');
}

/* ================= 第一章 野柳 ================= */
function museumPic(after){let s=`<rect width="600" height="400" fill="#F2EBDD"/><rect y="300" width="600" height="100" fill="#D9C7A3"/>
  <rect x="40" y="40" width="150" height="120" fill="${after?'#CFE3EC':'#BFD9E6'}" stroke="${INK}" stroke-width="6"/>`;
  s+=after?`<path d="M40 40 L-10 70 V190 L40 160Z" fill="#E6EEF2" stroke="${INK}" stroke-width="5"/>`:`<line x1="115" y1="40" x2="115" y2="160" stroke="${INK}" stroke-width="5"/>`;
  s+=`<circle cx="470" cy="90" r="50" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/><line x1="470" y1="90" x2="470" y2="58" stroke="${INK}" stroke-width="6"/><line x1="470" y1="90" x2="${after?470+Math.cos(deg(-30))*42:470+42}" y2="${after?90+Math.sin(deg(-30))*42:90}" stroke="#C86062" stroke-width="4"/>`;
  s+=`<rect x="240" y="170" width="140" height="130" fill="#BFD9E6" fill-opacity=".5" stroke="${INK}" stroke-width="6"/><rect x="225" y="300" width="170" height="20" fill="#8E7558"/>`;
  if(!after)s+=`<path d="M310 180 L340 230 L310 290 L280 230Z" fill="#B9E3F0" stroke="${INK}" stroke-width="4"/><path d="M310 180 L310 290" stroke="#FFFFFF" stroke-width="3"/>`;
  if(after)s+=`<path d="M375 172 q10 -10 18 2 q-6 8 -18 -2" fill="#D59D73" stroke="${INK}" stroke-width="2"/>`;
  if(after)s+=[[120,370],[170,345],[220,372],[270,348]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="12" ry="20" fill="#9BB7C9" opacity=".8"/>`).join('')+`<line x1="110" y1="392" x2="290" y2="392" stroke="${INK}" stroke-width="3"/><text x="200" y="388" text-anchor="middle" font-size="16" font-weight="900" fill="${INK}">22 公分</text>`;
  s+=`<rect x="440" y="200" width="120" height="100" fill="#A57E5E" stroke="${INK}" stroke-width="5"/><rect x="455" y="215" width="90" height="40" fill="#F7F0E1"/>`;
  return s}
const YELIU_DIFF=[{x:310,y:235,r:60,l:'水晶模型不見了'},{x:470,y:90,r:58,l:'時鐘從 3:00 變成 3:10'},{x:40,y:110,r:60,l:'窗戶被打開了'},{x:200,y:360,r:70,l:'地上多了一串濕腳印'},{x:384,y:175,r:30,l:'展示櫃上有一撮橘色的毛'}];
const SHORE_BG=`<rect width="900" height="460" fill="#D9C7A3"/><path d="M0 0 H900 V120 Q600 160 300 110 Q120 90 0 120Z" fill="#7FB3CC"/>${[[160,300],[420,220],[700,340],[600,120]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="70" ry="38" fill="#C2A47F" stroke="${INK}" stroke-width="5"/>`).join('')}`;

async function c2ch1(){
  G.ch=1;save();setCh('第一章　三分鐘變出冰沙');DUO.coat=true;
  setScene({id:'yeliu',color:'#CFE3EC',bg:bgYeliu,duo:[700,900,300],ground:()=>900,range:[260,1300],spots:[
    pz2('y_dolphin',150,880,{npc:'dolphin',s:1,hint:'遊客中心的白海豚館長拍了魔術前後的照片。',
      intro:[['dolphin','偵探先生！魔術表演的時候，展示櫃裡的「女王頭水晶模型」不見了！'],['dolphin','我剛好在表演前、表演後各拍了一張照片，你們幫我比比看。']],
      run:()=>spotDiff('館長的兩張照片','左邊是魔術前，右邊是魔術後。在右邊的照片點出 5 個不一樣的地方。',museumPic,YELIU_DIFF),
      ev:['館長的照片','魔術後：水晶模型不見了、窗戶被打開、時鐘從 3:00 變成 3:10、展示櫃上有一撮橘色的毛，地上多了一串 22 公分的濕腳印。'],after:'那個水晶模型是照著女王頭做的，好珍貴啊……'}),
    pz2('y_clock',90,470,{r:55,hint:'遊客中心的牆上有一個大時鐘。',art:()=>`<g transform="translate(90 470)"><circle r="34" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/><line x1="0" y1="0" x2="0" y2="-22" stroke="${INK}" stroke-width="5"/><line x1="0" y1="0" x2="18" y2="10" stroke="#C86062" stroke-width="4"/></g>`,
      intro:[['duo','魔術表演的節目單上寫著時間，我們用時鐘來推算。']],
      run:()=>clockSet('魔術節目單',[
        {q:'魔術從 3 點開始，表演了 10 分鐘。把時鐘撥到<b>表演結束</b>的時間。',h:3,m:10,ex:'3 點再過 10 分鐘，就是 3 點 10 分。',hint:'長針每走一大格是 5 分鐘。'},
        {q:'節目單上寫：「表演結束 35 分鐘後，魔術師搭船離開。」撥到<b>他要離開</b>的時間。',h:3,m:45,ex:'3:10 再過 35 分鐘是 3:45。',hint:'10 分 ＋ 35 分 ＝ ？'},
        {q:'下一班遊覽車在 3:45 的 1 小時 20 分鐘後才來。撥到<b>遊覽車來</b>的時間。',h:5,m:5,ex:'3:45 過 1 小時是 4:45，再過 20 分鐘，超過 60 分要進位，是 5:05。',hint:'先撥短針多 1 小時，再把長針往前撥 20 分鐘。'}]),
      ev:['魔術節目單','魔術師 3:45 要搭船離開！遊覽車要 5:05 才來，他一定是坐船逃走。']}),
    pz2('y_crab',1440,860,{npc:'crab',s:.95,hint:'冰沙攤的寄居蟹小哥看到了魔術。',
      intro:[['crab','魔術師說「不用冰箱，三分鐘把果汁變成冰沙」，真的變出來了！'],['duo','嗯……垃圾桶裡有一個剛撕開的空袋子，上面寫著「鹽」。{n}，我們聽聽大家怎麼說。',{e:'hmm'}]],
      run:()=>testimony('冰沙攤的證詞',[['crab','魔術師從我這裡拿了一大桶冰塊。'],['gull','他就只用冰塊，什麼都沒有加，果汁就變冰沙了！'],['crab','他一直用手搖那個袋子，搖了好久好久。']],
        [['🧂','空鹽袋（垃圾桶裡）'],['🧊','冰塊夾'],['🥤','果汁杯']],1,0,'找到矛盾了！垃圾桶裡有剛用完的鹽袋——魔術師偷偷加了鹽！'),
      ev:['空鹽袋','魔術師說「什麼都沒加」，其實偷偷在冰塊裡加了鹽。'],after:'要不要來一杯芒果冰沙？'}),
    pz2('y_lab',1350,700,{r:60,hint:'冰沙攤的工作台，可以做實驗。',art:()=>`<g transform="translate(1350 700)"><rect x="-60" y="-10" width="120" height="16" fill="#A57E5E"/><path d="M-50 -10 l8 -34 h20 l8 34z M10 -10 l8 -34 h20 l8 34z" fill="#D9EEF5" stroke="${INK}" stroke-width="4"/></g>`,
      intro:[['duo','我們來做實驗，拆穿冰沙魔術！記住：真的要做實驗時，要有大人陪，桌上的東西都不能喝。']],
      run:()=>labBench({title:'化學實驗台：冰沙魔術',predict:{q:'三碗冰裡分別放：①什麼都不加 ②加糖 ③加鹽。哪一碗最快把果汁變成冰沙？',o:['① 只有冰','② 冰加糖','③ 冰加鹽'],ans:2},
        cups:[{label:'① 不加料'},{label:'② 加糖'},{label:'③ 加鹽'}],tray:[['ice','🧊','冰塊'],['sugar','🍬','糖'],['salt','🧂','鹽'],['juice','🧃','果汁袋']],
        place:[['ice',0],['ice',1],['ice',2],['sugar',1],['salt',2],['juice',0],['juice',1],['juice',2]],setupTip:'每一碗都要放「冰塊」和「果汁袋」。放好以後，②號碗再加「糖」，③號碗再加「鹽」。',wrongPlace:'看看杯子下面的標籤。',
        act:'用手指在杯子上面<b>畫圈圈</b>，搖一搖！',turns:3,
        result:'③ 的果汁最先結成冰沙，② 只有一點點冰晶，① 還是果汁。',
        why:'冰塊撒上鹽會融化得更快，融化時會把旁邊的熱吸走，所以會冷到 0 度以下！',
        after:api=>numberLine(api,{title:'讀溫度計',lead:'三碗的溫度計：① 0 度、② 零下 2 度、③ 零下 12 度。把標籤放到數線上。',min:-15,max:5,step:1,label:5,tol:0,
          items:[{l:'①',v:0,c:'#92C3DB'},{l:'②',v:-2,c:'#D4BB49'},{l:'③',v:-12,c:'#C86062',hint:'零下 12 度在 0 的左邊，數 12 格。'}],okMsg:'③ 比 ① 冷了 12 度！化學魔法卡「鹽冰魔法」到手！'})}),
      ev:['化學魔法卡：鹽冰魔法','冰塊撒鹽會融得更快，而且會冷到 0 度以下。生活例子：漁港用加鹽的冰保存魚。']}),
    pz2('y_fur',1245,590,{r:50,hint:'蜂窩岩上勾著一撮橘色的毛。',art:()=>`<path d="M1235 590 q12 -14 22 2 q-10 10 -22 -2" fill="#D59D73" stroke="${INK}" stroke-width="3"/>`,
      intro:[['duo','橘色的毛……是狐狸毛！小穿山甲，用你的鼻子聞聞看！'],['pango2','交給我！嗅嗅嗅——有一條味道往海邊去了！']],
      run:()=>sniffTrail('夥伴技能：嗅一嗅','畫面上出現了橘色的氣味線。用手指沿著線走，帶小穿山甲找到東西！',[[80,400],[200,330],[330,360],[430,290],[520,330],[640,250],[760,280],[820,180]],SHORE_BG,'🎫'),
      ev:['九份芋圓店集點卡','氣味線的盡頭有一張集點卡，上面蓋了 9 個章，店名是「九份芋圓店」。']}),
    pz2('y_honey',1100,660,{r:60,sx:60,sy:90,hint:'蜂窩岩上的洞，旁邊寫了好多數字。',
      intro:[['duo','這是蜂窩岩，海水和風把岩石侵蝕出一個一個小洞。咦，有人在格子裡寫了數字。']],
      run:()=>hexCount('蜂窩岩的數字','每個格子裡的數字，都有同一個規則。找出規則，算出四個彩色問號，照「綠、黃、紅、紫」排成密碼。',
        [[0,-2],[1,-2],[-1,-1],[0,-1],[1,-1],[2,-1],[-2,0],[-1,0],[0,0],[1,0],[-2,1],[-1,1],[0,1],[1,1],[-1,2],[2,-2],[-3,1],[0,2]],
        [{c:[-3,1],col:'#50A260',name:'綠'},{c:[1,1],col:'#C9A42F',name:'黃'},{c:[-2,0],col:'#C86062',name:'紅'},{c:[1,0],col:'#7E5FA3',name:'紫'}]),
      ev:['岩縫裡的節目單','密碼 2345 打開了岩縫的小鐵盒，裡面是魔術節目單：「第二場：九份，會變色的湯」。']}),
    pz2('y_sand',820,940,{r:60,sy:40,hint:'沙灘上寫了好多英文字母。',art:()=>`<g transform="translate(820 940)"><text x="-50" y="0" font-size="30" font-weight="700" fill="#A88861" font-family="Fredoka">S A L T</text></g>`,
      intro:[['duo','沙灘上用樹枝寫滿了英文字母，裡面藏著好幾個單字！']],
      run:()=>wordSearch('沙灘上的英文字','單字只會橫著（從左到右）或直著（從上到下）排。點單字的第一個字母，再點最後一個字母。',
        makeGrid(8,7,[['SEA',0,0,'r'],['SAND',4,1,'r'],['CRAB',1,2,'d'],['ROCK',3,3,'r'],['WAVE',7,2,'d'],['SALT',0,3,'d']]),
        [['SEA','海'],['SAND','沙'],['CRAB','螃蟹'],['ROCK','岩石'],['WAVE','海浪'],['SALT','鹽']]),
      ev:['沙灘上的 SALT','最後一個字是 SALT（鹽），旁邊還畫了一個狐狸的笑臉。']}),
    pz2('y_board',960,560,{r:55,sy:60,hint:'地質公園的解說牌，介紹「溶解」。',art:()=>boardArt(960,560,'解說牌','#FFFFFF'),
      intro:[['duo','觀眾為什麼都沒看到魔術師加鹽？我們來做溶解的分類。']],
      run:()=>sortBaskets('會不會溶在水裡？','把每樣東西放進水裡攪一攪，會不見（溶解）的放左邊，還看得到的放右邊。',['會溶解，看不見','不會溶解，還看得到'],
        [['鹽','🧂',0,'鹽溶在水裡，看不見了，但是水會變鹹。'],['糖','🍬',0,'糖也會溶解，水會變甜。'],['沙子','⏳',1,'沙子會沉在水底。','沙子攪一攪會沉到底下，還看得到喔。'],['貝殼','🐚',1,'貝殼不會溶解。'],['果汁粉','🧃',0,'果汁粉溶解後，水變成果汁。'],['小石頭','🪨',1,'小石頭不會溶解。']]),
      ev:['溶解的祕密','鹽會溶在水裡看不見——所以觀眾沒發現魔術師偷偷加了鹽！']}),
    pz2('y_gull',1040,880,{npc:'gull',s:.9,hint:'海鷗遊客幫大家買了冰沙。',
      intro:[['gull','魔術師請大家喝冰沙，是我幫忙付的錢……我算錢算得頭好暈。']],
      run:()=>coinPay('幫海鷗算錢',[
        {q:'一杯冰沙 45 元，海鷗先買了 3 杯。拿出<b>剛剛好</b>的錢。',a:135,ex:'45 × 3 ＝ 135 元。'},
        {q:'海鷗拿 200 元付 3 杯冰沙（135 元）。寄居蟹小哥要<b>找回</b>多少錢？把要找的錢拿出來。',a:65,ex:'200 − 135 ＝ 65 元。'},
        {q:'魔術師用一張 500 元，買了 10 杯冰沙請觀眾喝。要找他多少錢？',a:50,ex:'45 × 10 ＝ 450，500 − 450 ＝ 50 元。'}]),
      ev:['海鷗的收據','魔術師買了 10 杯冰沙請大家喝——原來是想讓大家看冰沙，不要看展示櫃！'],after:'謝謝你們，我的頭不暈了！'}),
    pz2('y_pool',420,900,{r:60,sy:40,hint:'潮池裡有好多寄居蟹。',art:()=>`<g transform="translate(420 900)"><ellipse rx="90" ry="34" fill="#7FB3CC" stroke="${INK}" stroke-width="5"/><text x="-20" y="10" font-size="30">🐚</text></g>`,
      intro:[['duo','潮池裡有好多寄居蟹，有一隻背著亮晶晶的東西！先幫牠們排好隊，數數看有幾隻。']],
      run:()=>groupCount('潮池裡的寄居蟹','每 4 隻分成一組：點 4 隻寄居蟹，就會圈成一組。全部分好以後，算算一共有幾組。',24,4,'🐚','6 組 × 4 隻 ＝ 24 隻！'),
      ev:['水晶碎片','一隻寄居蟹背著一小片水晶碎片——魔術師逃跑時，水晶模型在這裡撞缺了一角！']}),
    pz2('y_sil',300,560,{r:55,hint:'石頭縫裡有一個奇怪的影子。',art:()=>`<g transform="translate(300 560)"><ellipse rx="40" ry="26" fill="#2E384F" opacity=".75"/></g>`,
      intro:[['pango2','多叔！石頭縫裡有個黑影子，動來動去的！']],
      run:()=>silhouette({title:'會搬家的黑影',clue:'牠住在海邊的石頭縫裡。牠每長大一點，就要搬一次「家」，可是牠的家不是自己做的。',
        sil:`<svg viewBox="0 0 300 220"><rect width="300" height="220" fill="#D9C7A3"/><path d="M120 150 q-10 -70 50 -90 q60 10 50 80 z" fill="#2E384F"/><path d="M110 160 q-30 -10 -40 10 M130 165 l-20 30 M150 168 l-6 32" stroke="#2E384F" stroke-width="10" stroke-linecap="round"/><circle cx="104" cy="120" r="8" fill="#2E384F"/><line x1="112" y1="140" x2="104" y2="120" stroke="#2E384F" stroke-width="5"/></svg>`,
        real:`<svg viewBox="0 0 300 220"><rect width="300" height="220" fill="#D9C7A3"/><path d="M120 150 q-10 -70 50 -90 q60 10 50 80 z" fill="#E6D3B5" stroke="${INK}" stroke-width="5"/><path d="M150 80 q20 20 0 40 q-20 10 -10 30" stroke="#B9A07E" stroke-width="5" fill="none"/><path d="M110 160 q-30 -10 -40 10 M130 165 l-20 30 M150 168 l-6 32" stroke="#DE8A6C" stroke-width="10" stroke-linecap="round"/><circle cx="104" cy="120" r="8" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/><line x1="112" y1="140" x2="104" y2="120" stroke="#DE8A6C" stroke-width="5"/></svg>`,
        guess:['螃蟹','海螺','我先想想'],part:'背上那個圓圓的殼',
        opts:[['寄居蟹','🐚',1],['海星','⭐',0],['章魚','🐙',0]],fact:'答對了！寄居蟹會找空的貝殼當家，長大了就換一個更大的殼。到海邊撿貝殼時，記得留一些給牠們。'}),
      ev:['今日小謎案','原來是寄居蟹在換殼！牠旁邊的岩石上，有魔術師留下的 22 公分鞋印。']}),
    {id:'y_q',type:'thing',x:560,y:420,r:45,hidden:true,art:()=>`<g transform="translate(560 420)"><path d="M-34 6 Q-30 -26 0 -28 Q30 -26 34 6Z" fill="#D29841" stroke="${INK}" stroke-width="4"/><path d="M-40 6 H50" stroke="${INK}" stroke-width="6"/></g>`,
     tap:async sp=>{sp.hidden=true;if(!G.quests.includes('k1'))G.quests.push('k1');save();drawSpots();sWin();await say('gull','我的帽子！被風吹到女王頭上了，謝謝你！');toast('完成幫忙任務！')}},
    {id:'b1',type:'badge',bid:'k1a',x:250,y:520},{id:'b2',type:'badge',bid:'k1b',x:1450,y:520},{id:'b3',type:'badge',bid:'k1c',x:560,y:330}
  ]});
  await chapterCard('第一章','三分鐘變出冰沙','新北市・野柳地質公園');
  await caseCard(1,'找回女王頭水晶模型','揭穿「三分鐘冰沙」魔術的祕密，找出魔術師逃去哪裡。','新北市・野柳');
  await say('dolphin','偵探先生！你們來得正好！');
  await say('duo','{n}，這裡有 11 個破案關卡。記得：女王頭不能摸、不能爬喔。卡住了就點我！',{e:'point'});
  await say('gull','啊！我的帽子被風吹走了……誰能幫我找找？');spot('y_q').hidden=false;drawSpots();
  hideDlg();
  await investigate('調查野柳地質公園');
  await say('duo','線索都到手了！{n}，推理時間！',{e:'confident'});
  hideDlg();await clueBoard(true);
  await ask('duo','冰沙魔術的祕密是什麼？',['在冰塊裡偷偷加了鹽','在果汁裡加了很多糖','藏了一台小冰箱'],0,{scored:1,wrong:'想想空鹽袋和化學實驗台。'});
  await ask('duo','照片裡的濕腳印，告訴我們魔術師的鞋子是幾公分？',['22 公分','30 公分','15 公分'],0,{scored:1,wrong:'看看館長照片裡腳印旁邊的尺。'});
  await ask('duo','集點卡和節目單都指向哪裡？魔術師的下一站是？',['九份','太魯閣','墾丁'],0,{scored:1});
  await say('duo','沒錯！魔術師帶著水晶模型，要搭 3:45 的船逃走！快追！',{e:'run'});
  hideDlg();await waveRun('沿著海邊追魔術師！');
  const xg=await actorIn('x2',X2_LOOK,1250,880,1);
  hideDlg();await finisher('冰塊加鹽，冷到零下 12 度——你的冰沙魔術，被科學拆穿了！');
  await say('x2','哼哼，被你們發現了？可是魔術師的帽子裡，永遠還有下一招！');
  await say('sys','砰！一陣白煙——魔術師跳上小船，往東北邊的山城開走了。');
  hideDlg();await actorOut(xg,700,-200);
  await say('pango2','多叔，船上掉下一張紙！「下一場：會變色的湯，九份見！」');
  await say('duo','{n}，我們去九份！',{e:'point'});
  hideDlg();await chapterResult(1,'三分鐘變出冰沙');
  G.ch=2;save();
}

/* ================= 執行 =================
   每一章是一個 async 函式，結尾要寫 G.ch=下一章;save();
   第二章以後放在獨立檔案 js/case2_chN.js，用 C2_CH[N]=函式 註冊（見 docs/KIMI.md）。 */
const C2_CH={1:c2ch1};
const C2_NAMES={2:'九份：會變色的芋圓湯',3:'太魯閣：會呼吸的石頭',4:'鹿野高台：自己長大的氣球',5:'墾丁：會發光的腳印'};
async function run2(from){
  AV={...(G.av||AV)};hud();DUO.coat=from>=1;
  if(from<=0){await c2Opening();await c2Prologue()}
  for(let n=Math.max(1,from);n<=5;n++){if(!C2_CH[n]){await c2Soon(n);return}DUO.coat=true;await C2_CH[n]()}
  c2Ending();
}
function c2Soon(n){return new Promise(()=>{setCh('未完待續');
  modal(`<div class="card" style="width:min(600px,100%);text-align:center"><h3>未完待續……</h3><img src="${COAT.coat_tip.b}" alt="" style="height:180px"><p class="lead">下一章「${C2_NAMES[n]||'新的章節'}」還在製作中。<br>你的進度已經存好了，下次打開案件簿，就能從這裡繼續！</p>
    <button class="btn c" id="soonOk">回到首頁</button></div>`,b=>{b.querySelector('#soonOk').onclick=()=>location.reload()})})}
/* 第二案結局（最終章結束後呼叫）：記錄破案次數、頒證書、預告第三案 */
function c2Ending(){if(!G.counted){G.counted=1;const m=meta();m.c2=(m.c2||0)+1;setMeta(m)}G.ch=6;save();
  setCh('第二案　破案成功！');const stars=G.energy>=5?3:G.energy>=3?2:1,cards=(G.ev||[]).filter(e=>/化學魔法卡/.test(e.t)).length;
  modal(`<div class="card cert" style="width:min(720px,100%)">
    <div style="display:flex;justify-content:center;align-items:flex-end;gap:10px"><img src="${COAT.coat_front.b}" alt="偵探多叔" style="height:190px;display:block"><div style="width:120px;height:120px">${avHead()}</div><div style="width:110px;height:110px">${head(CAST.pango2.look)}</div></div>
    <div style="letter-spacing:6px;font-weight:900;color:var(--ink2)">第二案　破案證書</div>
    <h3 style="font-size:36px;margin:6px 0">${fmt('{n}')} 偵探助手</h3>
    <p class="lead" style="margin:0">和偵探多叔、小穿山甲一起，用科學拆穿了魔術師怪盜X的五個魔術，把寶物全部找回來了！${cards>=5?'<br><b>獲得稱號：小化學家</b>':''}</p>
    <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
    <div class="stats"><div><b>${G.energy}/5</b>推理力</div><div><b>${G.badges.length}/15</b>骨頭徽章</div><div><b>${G.quests.length}/5</b>幫忙任務</div><div><b>${cards}</b>化學魔法卡</div></div>
    <div class="story" style="text-align:left">${CASES[3].teaser}</div>
    <p class="lead" style="margin:10px 0 0">再辦一次第二案的話，學科題目會換成新的喔！</p>
    <div class="row" style="justify-content:center;margin-top:14px"><button class="btn c" id="c2Home">回到案件簿</button></div></div>`,b=>{b.querySelector('#c2Home').onclick=()=>location.reload()})}
