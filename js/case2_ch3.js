/* 第二案 第三章 太魯閣：會呼吸的石頭（設計見 DESIGN.md 第 3 節）。註冊：C2_CH[3]。 */
"use strict";

/* ---------- 現場小道具 ---------- */
const tHutArt=()=>`<g transform="translate(1285 760)"><rect x="-70" y="-16" width="140" height="18" fill="#A57E5E" stroke="${INK}" stroke-width="4"/><path d="M-56 2 V26 M56 2 V26" stroke="#8E7558" stroke-width="7"/>${[-48,-24,0,24,48].map((dx,i)=>`<circle cx="${dx}" cy="-30" r="13" fill="#F2F2EE" stroke="${INK}" stroke-width="3.5"/><text x="${dx}" y="-24" text-anchor="middle" font-size="15">${['🪨','🥚','🐚','🍬','🕯️'][i]}</text>`).join('')}</g>`;
const tDigArt=()=>`<g transform="translate(555 770)"><ellipse rx="58" ry="24" fill="#B9A58C" stroke="${INK}" stroke-width="5"/><ellipse cx="-16" cy="-6" rx="18" ry="7" fill="#C9B085"/><ellipse cx="18" cy="-3" rx="12" ry="5" fill="#C9B085"/><path d="M44 10 l20 -16 M52 2 l8 8" stroke="#8C6A4E" stroke-width="5" stroke-linecap="round"/></g>`;
const tForkArt=()=>`<g transform="translate(260 855)"><rect x="-5" y="-14" width="10" height="48" fill="#946F4B" stroke="${INK}" stroke-width="3"/><rect x="-46" y="-56" width="92" height="42" rx="8" fill="#F7EFDE" stroke="${INK}" stroke-width="4"/><text y="-38" text-anchor="middle" font-size="17" font-weight="900" fill="#2B79B5">◀ 砂卡礑</text><text y="-18" text-anchor="middle" font-size="17" font-weight="900" fill="#8DB36E">長春祠 ▶</text></g>`;
const tSnapArt=()=>`<g transform="translate(1150 330)"><rect x="-30" y="-20" width="60" height="42" rx="8" fill="#3E4450" stroke="${INK}" stroke-width="4"/><circle r="13" cy="2" fill="#8FA2B3" stroke="#FFFFFF" stroke-width="4"/><rect x="-16" y="-30" width="32" height="12" rx="4" fill="#3E4450" stroke="${INK}" stroke-width="3"/></g>`;
const tKmArt=()=>`<g transform="translate(990 440)"><rect x="-5" y="-8" width="10" height="48" fill="#946F4B" stroke="${INK}" stroke-width="3"/><rect x="-40" y="-50" width="80" height="42" rx="8" fill="#FFFDF6" stroke="${INK}" stroke-width="4"/><text y="-22" text-anchor="middle" font-size="20" font-weight="900" fill="${INK}" font-family="Fredoka,sans-serif">0.5k</text></g>`;
const tScaleArt=()=>`<g transform="translate(760 430)"><rect x="-52" y="-8" width="104" height="14" fill="#8C6A4E" stroke="${INK}" stroke-width="4"/><rect x="-40" y="6" width="80" height="20" fill="#A57E5E" stroke="${INK}" stroke-width="4"/><g transform="translate(0 -12)"><path d="M-13 0 Q-16 -30 0 -36 Q16 -30 13 0Z" fill="#DADCDA" stroke="${INK}" stroke-width="3.5"/><path d="M0 -36 q-6 -16 5 -24" stroke="#DADCDA" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M5 -60 l16 3 l-16 6z" fill="#3A3A40"/></g></g>`;
const tSilArt=()=>`<g transform="translate(1400 858)"><ellipse rx="26" ry="12" fill="#2E384F" opacity=".75"/><path d="M-14 -4 q-8 -14 2 -22 M0 -6 q-8 -14 2 -22 M12 -4 q-8 -14 2 -22" stroke="#2E384F" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
const tEnArt=()=>boardArt(600,430,'EN','#92C3DB');

/* ---------- 英文路牌的圖 ---------- */
const MP_B=`${(()=>{const arc=x=>(44-Math.sin((x-4)/72*Math.PI)*30).toFixed(1);return `<svg viewBox="0 0 80 60" style="width:100%;max-height:64px;display:block"><path d="M4 44 Q40 10 76 44" stroke="#2E384F" stroke-width="6" fill="none"/><path d="M4 44 H76" stroke="#2E384F" stroke-width="4"/>${[16,28,40,52,64].map(x=>`<line x1="${x}" y1="${arc(x)}" x2="${x}" y2="44" stroke="#2E384F" stroke-width="3"/>`).join('')}</svg>`})()}`;
const MP_R=`<svg viewBox="0 0 80 60" style="width:100%;max-height:64px;display:block"><path d="M6 22 q10 -8 20 0 t20 0 t20 0" stroke="#5B9BC2" stroke-width="7" fill="none"/><path d="M6 40 q10 -8 20 0 t20 0 t20 0" stroke="#5B9BC2" stroke-width="7" fill="none"/></svg>`;
const MP_C=`<svg viewBox="0 0 80 60" style="width:100%;max-height:64px;display:block"><path d="M10 54 Q10 14 40 14 Q70 14 70 54Z" fill="#8A6F4D" stroke="#2E384F" stroke-width="4"/><path d="M26 54 Q26 32 40 32 Q54 32 54 54Z" fill="#2E384F"/></svg>`;
const MP_S=`<svg viewBox="0 0 80 60" style="width:100%;max-height:64px;display:block"><path d="M16 40 L4 32 L8 40 L4 48Z" fill="#34405F"/><ellipse cx="36" cy="38" rx="15" ry="9" fill="#34405F"/><ellipse cx="39" cy="41" rx="9" ry="5" fill="#F4EEE6"/><circle cx="48" cy="31" r="4.5" fill="#C86062"/><path d="M51 32 l12 2.5 l-12 3.5z" fill="#3A3A40"/></svg>`;

const MP_STONE=`<svg viewBox="0 0 80 60" style="width:100%;max-height:64px;display:block"><ellipse cx="40" cy="38" rx="26" ry="15" fill="#DADCDA" stroke="#2E384F" stroke-width="4"/><circle cx="31" cy="34" r="3" fill="#B9BCBA"/><circle cx="48" cy="41" r="2.5" fill="#B9BCBA"/><circle cx="42" cy="33" r="2" fill="#B9BCBA"/></svg>`;

/* ================= 第三章本體 ================= */
async function c2ch3(){
  G.ch=3;save();setCh('第三章　會呼吸的石頭');DUO.coat=true;
  setScene({id:'taroko',color:'#BFD9E6',bg:bgTaroko,duo:[760,895,300],ground:()=>895,range:[150,1450],spots:[
    pz2('t_hut',1285,760,{r:55,hint:'步道小屋的桌上放著五樣白色的東西。',art:tHutArt,
      intro:[['macaque','偵探先生！我是台灣獼猴巡山員。怪盜X 表演「會呼吸的石頭」，表演完，展示館的大理石燕子就不見了！'],
             ['duo','石頭會呼吸？{n}，我們先用桌上的東西做實驗！真的實驗要有大人陪，桌上的東西都不能吃。',{e:'think'}]],
      run:()=>fizzSort('哪些白色東西會冒泡？','五樣白色的東西，哪些遇到醋會「呼呼呼」冒泡泡？先分分看，再滴醋驗證！',
        [['大理石','🪨',1],['雞蛋殼','🥚',1],['貝殼','🐚',1],['方糖','🍬',0],['蠟燭','🕯️',0]],
        '大理石、蛋殼、貝殼都含有「碳酸鈣」，遇到醋會產生二氧化碳——泡泡就是這樣來的！這就是石頭「呼吸」的秘密。'),
      ev:['化學魔法卡：呼吸魔法','大理石含有碳酸鈣，遇到醋會產生二氧化碳泡泡——一顆一顆泡泡，看起來就像石頭在呼吸！']}),
    pz2('t_sign',395,870,{r:48,hint:'步道旁的解說牌，被人翻成背面了。',art:()=>boardArt(395,870,'解說牌','#FFFFFF'),
      intro:[['duo','解說牌上寫著「岩石與醋」。怪盜X 把配對弄亂了，我們來復原。']],
      run:()=>flipPair('解說牌配對','把「材料」跟「滴醋之後的樣子」配成一對！',
        [['<b style="font-size:21px">大理石</b>','<b style="font-size:21px;color:#2B79B5">🫧 冒泡泡</b>'],
         ['<b style="font-size:21px">方糖</b>','<b style="font-size:21px;color:#8A8F98">沒有變化</b>'],
         ['<b style="font-size:21px">雞蛋殼</b>','<b style="font-size:21px;color:#2B79B5">🫧 冒泡泡</b>'],
         ['<b style="font-size:21px">橡皮擦</b>','<b style="font-size:21px;color:#8A8F98">沒有變化</b>'],
         ['<b style="font-size:21px">貝殼</b>','<b style="font-size:21px;color:#2B79B5">🫧 冒泡泡</b>']],
        '配好了！會冒泡的都是含碳酸鈣的東西。'),
      ev:['解說牌的筆記','解說牌背面有鉛筆字：「會呼吸的是大理石——碳酸鈣 ＋ 醋 → 二氧化碳泡泡。」']}),
    pz2('t_dig',500,775,{r:50,hint:'溪邊的土堆鬆鬆的，好像被挖過。',art:tDigArt,
      intro:[['pango2','多叔！這個土堆軟軟的，我來挖！先幫我把 12 顆小石頭平分裝進三個洞，免得滾走。'],
             ['duo','好主意！12 顆平分給 3 個洞，每洞要一樣多——這就是「除法」喔。',{e:'welcome'}]],
      run:()=>digDiv('溪邊土堆的秘密','先把 12 顆小石頭平分到 3 個洞（每洞一樣多），再挖挖看中間的土堆！',
        '挖到了！土堆裡藏著大理石做的小燕子，滴醋會冒泡——怪盜X 在這裡練習「讓石頭呼吸」。'),
      ev:['練習用的大理石','土堆裡藏著大理石碎片和一座小石燕——怪盜X 在溪邊偷偷練習「石頭呼吸術」。']}),
    pz2('t_fork',260,855,{r:48,hint:'步道分岔口的路標指向不同步道。',art:tForkArt,
      intro:[['duo','三個人走向三條不同的步道。把線索排出來，看看每個人走哪一條！',{e:'point'}]],
      run:()=>logicGrid('誰走哪條步道？',
        '燕子小姐、獼猴巡山員、山羊機長各自走一條步道。用線索推理出來！',
        ['燕子小姐','獼猴巡山員','山羊機長'],['砂卡礑','燕子口','長春祠'],
        ['獼猴巡山員每天固定走燕子口巡邏。','燕子小姐要去長春祠澆花。','三個人走三條不同的步道。'],
        {0:2,1:1,2:0},
        '推理正確！走砂卡礑的是長鬃山羊機長。燕子小姐說：「那個背大背包的人，背包上掛著燕子吊飾！」'),
      ev:['砂卡礑的目擊','燕子小姐：「背大背包的人往砂卡礑走了，他的背包上掛著燕子吊飾！」']}),
    pz2('t_note',880,420,{r:48,hint:'吊橋上貼著一張四個詞的紙條。',art:()=>noteArt(880,420),
      intro:[['pango2','紙條上有四個詞：梅花鹿、野生動物、高山、台灣……每個詞都有一個字被紅框圈起來！'],
             ['duo','把紅框的字照順序排出來，就是怪盜X 的下一站。',{e:'think'}]],
      run:()=>charPick('紅框字的祕密',
        '點一點卡片，把四個紅框字照「紙條上的順序」排出來！',
        [['梅花鹿','鹿'],['野生動物','野'],['高山','高'],['台灣','台']],'鹿野高台',
        '「鹿野高台」！怪盜X 的下一場魔術，在台東的鹿野高台！'),
      ev:['砂卡礑紙條','紅框字拼出「鹿野高台」——怪盜X 的下一站，在台東！']}),
    pz2('t_snap',1150,330,{r:50,hint:'燕子口的峭壁間，燕子飛來飛去。',art:tSnapArt,
      intro:[['duo','燕子口到了！拿出相機：等燕子飛進取景框，就按快門！'],
             ['pango2','交給你，{n}！']],
      run:()=>photoSnap('燕子口拍照取證','燕子飛進紅色圈圈裡的時候，按「快門」拍下來！要拍到 3 隻。',3),
      ev:['燕子口的照片','照片裡，燕子雕像展示櫃是空的！玻璃倒影裡有一個背包，背包上掛著燕子吊飾。']}),
    pz2('t_en',600,430,{r:48,hint:'吊橋旁釘著一根英文路牌。',art:tEnArt,
      intro:[['duo','太魯閣的英文路牌！左邊是單字、右邊是圖案，把它們連起來。',{en:0}],
             ['duo','跟著多叔唸：bridge、river、cave、stone、swallow！',{e:'greet'}]],
      run:()=>matchPair('英文路牌連連看','先點左邊的英文單字，再點右邊對應的圖案。',
        [['bridge',MP_B,'橋'],['river',MP_R,'河流'],['cave',MP_C,'洞穴'],['stone',MP_STONE,'石頭'],['swallow',MP_S,'燕子']],
        '全部連好了！英文路牌難不倒你。'),
      ev:['英文路牌的刻痕','路牌背面刻著一行小字：「The stone is breathing. — X」（石頭正在呼吸——X）']}),
    pz2('t_km',990,440,{r:48,hint:'步道旁有標示公里的里程牌。',art:tKmArt,
      intro:[['duo','里程牌上寫著小數：0.5 公里、1.2 公里、1.8 公里。把它們標到數線上！',{e:'point'}]],
      run:()=>numLineSolo('里程牌的小數','點下面的標籤，再點數線上的位置。每一格是 0.1 公里。',
        {title:'標出里程',lead:'把 0.5、1.2、1.8 公里標在數線上。',min:0,max:2,step:.1,label:.5,tol:.06,
         items:[{l:'0.5',v:.5,c:'#C86062',hint:'0.5 在 0 和 1 的正中間。'},{l:'1.2',v:1.2,c:'#5B84AB',hint:'1.2 在 1 的右邊 2 格。'},{l:'1.8',v:1.8,c:'#8DB36E',hint:'1.8 在 2 的左邊 2 格。'}],
         okMsg:'三個里程都標對了！小數其實一點都不難。'}),
      ev:['里程牌後的通行證','0.5 公里里程牌背面貼著展示館通行證：「砂卡礑步道——怪盜X 進去過。」']}),
    pz2('t_idiom',140,895,{npc:'macaque',s:1,hint:'獼猴巡山員在路口等著考考你。',
      intro:[['macaque','想抓怪盜X，頭腦要靈活！來玩「成語接龍」——用前一個成語的最後一個字，接下一個成語。'],
             ['duo','{n}，成語接龍是高年級的考驗，我們一起來！',{e:'confident'}]],
      run:()=>idiomChain('巡山員的考驗：成語接龍','每個成語都要用前一個成語的「最後一個字」開頭！',
        [{cur:'一帆風順',opts:['順手牽羊','一鳴驚人','花開富貴'],ans:'順手牽羊'},
         {cur:'順手牽羊',opts:['羊入虎口','虎口拔牙','三羊開泰'],ans:'羊入虎口'},
         {cur:'羊入虎口',opts:['口是心非','羊腸小道','心花怒放'],ans:'口是心非'}],
        '接得漂亮！獼猴巡山員心服口服，送你一條登山繩。'),
      ev:['巡山員的考驗','獼猴巡山員：「你們連成語都接得上，一定有資格抓到怪盜X！」他送了一條登山繩當謝禮。']}),
    pz2('t_scale',760,430,{r:48,hint:'展示台上四座燕子雕像，有一座怪怪的。',art:tScaleArt,
      intro:[['duo','展示館裡只剩四座燕子雕像。大理石比較重、塑膠比較輕——用天平把假貨找出來！'],
             ['duo','天平只能秤兩次喔，想一想再下手。',{e:'think'}]],
      run:()=>balanceFind('找出塑膠假貨','真正的燕子雕像是大理石做的比較重，假貨是塑膠做的比較輕。把雕像放到天平兩邊，最多秤兩次，找出假貨！',
        '找到了！這座輕飄飄的塑膠假貨，就是怪盜X 留下的——真的大理石燕子被他帶走了。'),
      ev:['展示館的假貨','四座雕像裡有一座塑膠假貨！真的大理石燕子被怪盜X 掉包帶走了。']}),
    pz2('t_sil',1400,860,{r:48,hint:'峭壁上有一團快速移動的黑影。',art:tSilArt,
      intro:[['pango2','多叔！峭壁上有黑影在飛來飛去，咻——咻——']],
      run:()=>silhouette({title:'峭壁上的小黑影',clue:'牠用泥巴在峭壁上蓋房子，尖尖的尾巴像一把剪刀。牠叫聲嘹亮，飛得又快又低。',
        sil:`<svg viewBox="0 0 300 220"><rect width="300" height="220" fill="#D9C7A3"/><path d="M0 0 H120 L96 220 H0Z" fill="#B9BCBA"/><g fill="#2E384F"><path d="M150 100 L118 84 L128 100 L118 116Z"/><ellipse cx="172" cy="102" rx="22" ry="13"/><path d="M190 96 q14 -16 30 -10" stroke="#2E384F" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="218" cy="86" r="8"/><path d="M226 84 l20 4 l-20 7z"/></g></svg>`,
        real:`<svg viewBox="0 0 300 220"><rect width="300" height="220" fill="#D9C7A3"/><path d="M0 0 H120 L96 220 H0Z" fill="#B9BCBA" stroke="${INK}" stroke-width="4"/><path d="M150 100 L118 84 L128 100 L118 116Z" fill="#34405F"/><ellipse cx="172" cy="102" rx="22" ry="13" fill="#34405F"/><ellipse cx="176" cy="107" rx="14" ry="7" fill="#F4EEE6"/><path d="M190 96 q14 -16 30 -10" stroke="#34405F" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="218" cy="86" r="8" fill="#34405F"/><circle cx="220" cy="84" r="2" fill="#fff"/><path d="M226 84 l20 4 l-20 7z" fill="#3A3A40"/><path d="M-6 40 q10 -12 22 -6 M-2 70 q10 -12 22 -6" stroke="#8A6F4D" stroke-width="5" fill="none"/></svg>`,
        guess:['燕子','蝙蝠','我先想想'],part:'像剪刀一樣分叉的尾巴',
        opts:[['燕子','🐦',1],['蝙蝠','🦇',0],['麻雀','🐧',0]],
        fact:'答對了！是燕子。牠們用泥巴在峭壁上築巢，尾巴像剪刀。燕子小姐說，她看到怪盜X 把大理石燕子放進背包——背包上掛著燕子吊飾！'}),
      ev:['今日小謎案','原來是燕子在築巢！燕子小姐說：「那個人的背包上掛著燕子吊飾，裡面裝著大理石燕子！」']}),
    {id:'t_q',type:'thing',x:400,y:335,r:45,hidden:true,
     art:()=>`<g transform="translate(400 335) rotate(8)"><line x1="0" y1="-26" x2="0" y2="-8" stroke="${INK}" stroke-width="3"/><path d="M0 -8 L34 -2 L0 10Z" fill="#C86062" stroke="${INK}" stroke-width="3"/></g>`,
     tap:async sp=>{sp.hidden=true;if(!G.quests.includes('k3'))G.quests.push('k3');save();drawSpots();sWin();await say('swallow','我的領隊小旗！沒有它，旅客都認不出我了，謝謝你！');toast('完成幫忙任務！')}},
    {id:'b1',type:'badge',bid:'k3a',x:90,y:600},{id:'b2',type:'badge',bid:'k3b',x:1490,y:620},{id:'b3',type:'badge',bid:'k3c',x:800,y:160}
  ]});
  await chapterCard('第三章','會呼吸的石頭','花蓮縣・太魯閣');
  await caseCard(3,'找回大理石燕子','揭穿「會呼吸的石頭」魔術，找出魔術師逃去哪裡。','花蓮縣・太魯閣');
  await say('macaque','偵探先生！你們來得正好，展示館出大事了！');
  await say('duo','{n}，太魯閣峽谷有 11 個破案關卡。這裡常有落石，調查時小心步道喔。',{e:'point'});
  await say('swallow','嗚……我的領隊小旗被風吹到吊橋那邊了……');
  spot('t_q').hidden=false;drawSpots();
  hideDlg();await investigate('調查太魯閣');
  await say('duo','證物都釘好了！{n}，推理時間！',{e:'confident'});
  hideDlg();await clueBoard(true);
  await ask('duo','石頭為什麼會「呼吸」（冒出泡泡）？',['醋碰到大理石會產生二氧化碳泡泡','石頭裡住著小精靈','怪盜X 對石頭一直吹氣'],0,{scored:1,wrong:'想想小屋裡的滴醋實驗。'});
  await ask('duo','兩個目擊都提到，怪盜X 的背包掛著什麼吊飾？',['燕子吊飾','星星吊飾','什麼都沒掛'],0,{scored:1,wrong:'看看照片和燕子小姐的證詞。'});
  await ask('duo','紙條紅框字拼出的「鹿野高台」是什麼意思？',['怪盜X 下一場魔術的地點','怪盜X 最喜歡的餐廳','一條步道的名字'],0,{scored:1});
  await say('duo','沒錯！怪盜X 往吊橋跑了，追！',{e:'run'});
  hideDlg();await bridgeBal('吊橋平衡：追！');
  const xg=await actorIn('x2',X2_LOOK,1250,900,1);
  hideDlg();await finisher('醋碰到大理石會冒出二氧化碳——你的呼吸魔術，被科學拆穿了！');
  await say('x2','哼，石頭只是我的暖場秀。下一場，我要讓天空熱鬧起來！');
  await say('sys','砰！白煙升起——怪盜X 又不見了。煙散開後，地上躺著被掉包的大理石燕子！');
  hideDlg();await actorOut(xg,700,-200);
  await say('pango2','大理石燕子找回來了！這裡還有一張傳單：「鹿野高台熱氣球嘉年華——自己長大的氣球，即將登場。」');
  await say('duo','{n}，我們去鹿野高台！',{e:'point'});
  hideDlg();await chapterResult(3,'會呼吸的石頭');
  hideDlg();await travel('taroko','luye');
  G.ch=4;save();
}
C2_CH[3]=c2ch3;
