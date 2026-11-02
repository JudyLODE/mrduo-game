/* 第二案 最終章 墾丁：會發光的腳印（設計見 DESIGN.md 第 3 節，2026-11-02 因地制宜版）。註冊：C2_CH[5]；G.ch=6 後由 run2 接 c2Ending()。 */
"use strict";

/* ---------- 現場小道具 ---------- */
const kReefArt=()=>`<g transform="translate(500 570)"><ellipse cx="-40" cy="24" rx="60" ry="16" fill="#8FA88A"/><path d="M-70 20 q-8 -34 6 -44 q2 22 10 30 q6 -26 18 -34 q0 28 6 34z" fill="#C86062" stroke="${INK}" stroke-width="3"/><text x="30" y="10" font-size="26">🐠</text><text x="66" y="30" font-size="20">🐟</text></g>`;
const kTideArt=()=>`<g transform="translate(770 650)"><ellipse rx="66" ry="20" fill="#5B9BC2" stroke="${INK}" stroke-width="4"/><ellipse cx="-20" cy="-2" rx="16" ry="7" fill="#7FB3CC"/><text x="18" y="4" font-size="22">⭐</text></g>`;
const kGlowArt=()=>`<g transform="translate(1120 870)"><rect x="-8" y="-44" width="16" height="30" rx="6" fill="#3E4450" stroke="${INK}" stroke-width="3.5"/><path d="M-8 -14 L-22 22 H22 L8 -14Z" fill="#BFA0E9" stroke="${INK}" stroke-width="3.5" opacity=".85"/></g>`;
const kWindArt=()=>`<g transform="translate(1400 780)"><path d="M0 20 q-40 -8 -30 -34 q26 4 30 22 q10 -20 34 -16 q-6 22 -34 28z" fill="#E8E19E" stroke="${INK}" stroke-width="3"/><path d="M-70 0 q16 -12 32 0 t32 0" stroke="#8FA2B3" stroke-width="4" fill="none"/></g>`;
const kTuneArt=()=>`<g transform="translate(420 880)"><path d="M-24 10 q-10 -26 8 -34 q4 16 8 22 q4 -18 14 -24 q0 20 4 24 q6 -14 16 -16 q-4 18 -6 24z" fill="#D29841" stroke="${INK}" stroke-width="3"/><text x="34" y="8" font-size="26" font-weight="900" fill="#C86062">♪</text></g>`;
const kYueqinArt=()=>`<g transform="translate(660 905)"><circle r="24" fill="#C86062" stroke="${INK}" stroke-width="4"/><line x1="-6" y1="-18" x2="-6" y2="18" stroke="#F2E6B8" stroke-width="2.5"/><line x1="6" y1="-18" x2="6" y2="18" stroke="#F2E6B8" stroke-width="2.5"/><path d="M0 -24 v-12" stroke="#946F4B" stroke-width="5"/></g>`;
const kTotemArt=()=>`<g transform="translate(900 880)"><rect x="-14" y="-52" width="28" height="62" rx="6" fill="#8C6A4E" stroke="${INK}" stroke-width="4"/><path d="M0 -44 L9 -32 L0 -20 L-9 -32Z" fill="#C86062" stroke="${INK}" stroke-width="2.5"/><circle cy="-4" r="9" fill="#D4BB49" stroke="${INK}" stroke-width="2.5"/></g>`;
const kGatesArt=()=>`<g transform="translate(80 820)"><rect x="-40" y="-30" width="80" height="60" rx="8" fill="#DADCDA" stroke="${INK}" stroke-width="4"/><path d="M-16 30 v-22 a16 16 0 0 1 32 0 v22z" fill="#2E384F"/></g>`;
const kHistArt=()=>`<g transform="translate(290 885)"><rect x="-30" y="-14" width="60" height="44" rx="6" fill="#9AA0A8" stroke="${INK}" stroke-width="4"/><text y="14" text-anchor="middle" font-size="17" font-weight="900" fill="#FFFDF6">1874</text></g>`;
const kTurtleArt=()=>`<g transform="translate(1500 880)"><ellipse rx="34" ry="22" fill="#7FA88A" stroke="${INK}" stroke-width="4"/><circle cx="30" cy="-12" r="12" fill="#7FA88A" stroke="${INK}" stroke-width="3.5"/><circle cx="33" cy="-15" r="2.5" fill="${INK}"/>${[-14,0,14].map(dx=>`<circle cx="${dx}" cy="2" r="3" fill="#5D8A6B"/>`).join('')}</g>`;
const kSuspectArt=()=>`<g transform="translate(1290 700)"><path d="M0 0 L-46 -54 H46Z" fill="#F7F0E1" stroke="${INK}" stroke-width="4"/><path d="M0 -54 V0" stroke="#5B84AB" stroke-width="5"/><text y="-16" text-anchor="middle" font-size="15" font-weight="900" fill="${INK}">展示</text></g>`;

/* ---------- 紫光掃描的物件 ---------- */
const K_UV=[
 {n:'貝殼',x:150,y:200,g:0,art:`<path d="M-22 10 a22 22 0 0 1 44 0z" fill="#E8DCC8" stroke="${INK}" stroke-width="3"/><path d="M-12 8 V-8 M0 8 V-12 M12 8 V-8" stroke="#C9B89A" stroke-width="2.5"/>`,dim:`<path d="M-22 10 a22 22 0 0 1 44 0z" fill="#4A5064"/>`},
 {n:'怪魔術棒',x:340,y:120,g:1,glowC:'#B8F59A',art:`<rect x="-6" y="-30" width="12" height="44" rx="5" fill="#7E5FA3" stroke="${INK}" stroke-width="3"/><circle cy="-36" r="10" fill="#F2E6B8" stroke="${INK}" stroke-width="3"/>`,dim:`<rect x="-6" y="-30" width="12" height="44" rx="5" fill="#4A5064"/><circle cy="-36" r="10" fill="#565C72"/>`},
 {n:'星星貼紙',x:540,y:220,g:1,glowC:'#F2A9C4',art:`<path d="M0 -26 L7 -8 L26 -8 L11 4 L16 22 L0 11 L-16 22 L-11 4 L-26 -8 L-7 -8Z" fill="#F2A9C4" stroke="${INK}" stroke-width="3"/>`,dim:`<path d="M0 -26 L7 -8 L26 -8 L11 4 L16 22 L0 11 L-16 22 L-11 4 L-26 -8 L-7 -8Z" fill="#565C72"/>`},
 {n:'小骨頭',x:700,y:130,g:1,glowC:'#B8F59A',art:`<path d="M-22 -6 a8 8 0 1 1 4 -10 a8 8 0 1 1 12 -4 h12 a8 8 0 1 1 12 4 a8 8 0 1 1 4 10 a8 8 0 1 1 -6 8 h-36 a8 8 0 1 1 -6 -8z" fill="#F2EBDD" stroke="${INK}" stroke-width="3"/>`,dim:`<path d="M-22 -6 a8 8 0 1 1 4 -10 a8 8 0 1 1 12 -4 h12 a8 8 0 1 1 12 4 a8 8 0 1 1 4 10 a8 8 0 1 1 -6 8 h-36 a8 8 0 1 1 -6 -8z" fill="#565C72"/>`},
 {n:'礦泉水瓶',x:790,y:240,g:0,art:`<rect x="-10" y="-26" width="20" height="40" rx="6" fill="#BFD9E6" stroke="${INK}" stroke-width="3"/><rect x="-5" y="-34" width="10" height="8" fill="#5B84AB" stroke="${INK}" stroke-width="2"/>`,dim:`<rect x="-10" y="-26" width="20" height="40" rx="6" fill="#4A5064"/>`},
 {n:'一張紙條',x:240,y:90,g:1,glowC:'#F2E6B8',art:`<g transform="rotate(-8)"><rect x="-24" y="-14" width="48" height="30" fill="#FFFDF6" stroke="${INK}" stroke-width="3"/><text y="6" text-anchor="middle" font-size="15" font-weight="900" fill="#C86062">X</text></g>`,dim:`<g transform="rotate(-8)"><rect x="-24" y="-14" width="48" height="30" fill="#565C72"/></g>`}];

/* ---------- 潮間帶 ---------- */
const K_TZ_ZONES=['潮上帶（沙灘）','潮間帶（礁石）','潮下帶（水裡）'];
const K_TZ_ITEMS=[
 {n:'寄居蟹',e:'🐚',z:0,hint:'寄居蟹住在沙灘上，潮水只淹到一下下。'},
 {n:'海星',e:'⭐',z:1,hint:'海星吸在潮間帶的礁石上，退潮才看得到。'},
 {n:'招潮蟹',e:'🦀',z:1,hint:'招潮蟹在潮間帶的泥灘上揮大螯。'},
 {n:'海螺',e:'🐌',z:1,hint:'海螺黏在潮間帶的岩石上。'},
 {n:'海葵',e:'🌸',z:2,hint:'海葵一直泡在水裡。'},
 {n:'小丑魚',e:'🐠',z:2,hint:'小丑魚住在海葵裡，離不開水。'}];

/* ---------- 城門定位（用 mapBuild） ---------- */
const K_GATE_ZONES=[{x:330,y:30,w:240,h:62},{x:575,y:92,w:62,h:180},{x:330,y:272,w:240,h:62},{x:263,y:92,w:62,h:180}];
const K_GATE_PIECES=[
 {zone:0,sx:80,sy:40,hint:'北門在「上面」，通往山的那一邊。',art:`<g transform="translate(120 8)"><rect x="-26" y="10" width="52" height="44" rx="6" fill="#DADCDA" stroke="${INK}" stroke-width="4"/><path d="M-12 54 v-20 a12 12 0 0 1 24 0 v20z" fill="#2E384F"/><text y="34" text-anchor="middle" font-size="16" font-weight="900" fill="${INK}">北門</text></g>`},
 {zone:1,sx:560,sy:40,hint:'東門在「右邊」，面向太平洋。',art:`<g transform="translate(31 12)"><rect x="-26" y="10" width="52" height="44" rx="6" fill="#DADCDA" stroke="${INK}" stroke-width="4"/><path d="M-12 54 v-20 a12 12 0 0 1 24 0 v20z" fill="#2E384F"/><text y="34" text-anchor="middle" font-size="16" font-weight="900" fill="${INK}">東門</text></g>`},
 {zone:2,sx:330,sy:40,hint:'南門在「下面」，通往海邊。',art:`<g transform="translate(120 8)"><rect x="-26" y="10" width="52" height="44" rx="6" fill="#DADCDA" stroke="${INK}" stroke-width="4"/><path d="M-12 54 v-20 a12 12 0 0 1 24 0 v20z" fill="#2E384F"/><text y="34" text-anchor="middle" font-size="16" font-weight="900" fill="${INK}">南門</text></g>`},
 {zone:3,sx:120,sy:40,hint:'西門在「左邊」，通往台南的方向。',art:`<g transform="translate(31 12)"><rect x="-26" y="10" width="52" height="44" rx="6" fill="#DADCDA" stroke="${INK}" stroke-width="4"/><path d="M-12 54 v-20 a12 12 0 0 1 24 0 v20z" fill="#2E384F"/><text y="34" text-anchor="middle" font-size="16" font-weight="900" fill="${INK}">西門</text></g>`}];

/* ================= 最終章本體 ================= */
async function c2ch5(){
  G.ch=5;save();setCh('最終章　會發光的腳印');DUO.coat=true;
  setScene({id:'kenting',color:'#2F3858',bg:bgKenting,duo:[760,905,300],ground:()=>905,range:[180,1420],spots:[
    pz2('k_light',200,250,{r:48,hint:'鵝鑾鼻燈塔的燈室，今晚閃個不停。',
      intro:[['seaturtle','燈塔的燈今晚怪怪的，一長一短地閃……好像在說話！'],
             ['duo','燈塔會用「長閃」和「短閃」送信號！{n}，對照密碼表解解看。',{e:'think'}]],
      run:()=>morseLight('燈塔燈號解碼','燈塔閃燈有長有短，對照密碼表，一個一個字母解出來！',
        [{code:'短短短短',ans:'H'},{code:'短',ans:'E'},{code:'短長短短',ans:'L'},{code:'短長長短',ans:'P'}],
        'H－E－L－P……「救命」？不對，在燈塔這裡是「歡迎來到恆春半島」的意思！燈號解讀成功！'),
      ev:['燈塔的信號表','燈塔守護員的筆記：「紫光燈檢查過了——怪盜X 在燈塔上留下了發亮的腳印，一路往沙灘去！」']}),
    pz2('k_reef',500,570,{r:55,hint:'浮潛區的珊瑚礁，好多熱帶魚！',art:kReefArt,
      intro:[['pango2','哇！珊瑚礁好像一座熱鬧的城市，好多魚在裡面躲貓貓！'],
             ['duo','{n}，海洋生物學家說：想找到線索，就要會「觀察」——看顏色、形狀、花紋！',{e:'point'}]],
      run:()=>fishID('珊瑚礁觀察室','聽線索，找出正確的那一隻魚！點牠！',
        [{clue:'<b>綠綠的、身體大大</b>，嘴巴像鸚鵡一樣有大板牙，愛啃珊瑚。',fish:'parrot'},
         {clue:'<b>黃黃扁扁</b>，身上有兩條黑色的斜線，像蝴蝶的翅膀。',fish:'butterfly'},
         {clue:'<b>全身條紋</b>，鰭張開像扇子——有毒的刺，要小心！',fish:'lion'}],
        '三種魚都找到了！鸚哥魚的便便還是造沙高手呢——墾丁的沙灘有一部分是牠們做出來的！'),
      ev:['浮潛區的觀察筆記','「今天看到鸚哥魚、蝴蝶魚和獅子魚。獅子魚是外來種，不能放生喔。」簽名：戴草帽的浮潛教練？']}),
    pz2('k_tide',770,650,{r:55,hint:'潮間帶的水窪裡有好多小生物。',art:kTideArt,
      intro:[['seaturtle','潮間帶是海洋和陸地的交界，住著特別會「等潮水」的生物。'],
             ['duo','{n}，幫每個生物找到牠的家！',{e:'welcome'}]],
      run:()=>tideZones('誰住哪一帶？','潮水每天來回，把海岸分成潮上帶、潮間帶、潮下帶三個家。',
        K_TZ_ZONES,K_TZ_ITEMS,
        '全部住對家了！潮間帶的生物最厲害：一天要忍受兩次「泡水又曬太陽」。到海邊玩，腳下小心，別踩到牠們喔。'),
      ev:['潮間帶導覽圖','導覽圖背面：「夜間導覽預約者：梅花鹿導覽員？」……導覽員不是白天才上班嗎？']}),
    pz2('k_glow',1120,870,{r:55,hint:'沙灘上散落著怪盜X 留下的一堆東西。',art:kGlowArt,
      intro:[['duo','天黑了……怪盜X 說他的腳印「會發光」。{n}，拿起紫光燈，看看到底是什麼把戲！'],
             ['pango2','我幫你照路！'] ],
      run:()=>uvScan('紫光燈大搜查','用紫光燈照照看：哪些東西會發出螢光？（點每一樣東西）',K_UV,
        '找到了！怪魔術棒、星星貼紙、骨頭和怪盜X 的字條都會發亮——這就是「會發光」的真相：它們沾了螢光粉！'),
      ev:['科學魔法卡：螢光魔法','有些顏料含有螢光劑，照到紫光會把光「存起來」再放出來——看起來就像在發光！字條寫著：「腳印通往燈塔。X」']}),
    pz2('k_wind',1400,780,{r:50,hint:'沙丘上插著「落山風注意」的牌子。',art:kWindArt,
      intro:[['seaturtle','冬天的恆春有一種有名的風——「落山風」，強到可以把人吹跑！'],
             ['duo','{n}，想想看：東北季風被中央山脈擋住以後，會往哪裡吹？',{e:'think'}]],
      run:()=>windBlow('落山風往哪吹？','冬天的東北季風翻過中央山脈、鑽過山谷，到了恆春半島會變成什麼樣的風？',
        [{q:'冬天的東北季風，被中央山脈擋下來、擠過山谷，到了恆春半島會往哪裡吹？',opts:['往西南吹（落山風）','往正東吹回山上','往天上吹'],ans:0,hint:'高山擋住去路，風只能沿著山邊往下衝、往西南跑。',extra:''},
         {q:'強風年年吹，把港口溪的砂「吹」到哪裡去了？',opts:['堆到西南邊的海邊（風吹砂）','把砂吹回山上','砂原地不動'],ans:0,hint:'風把輕輕的砂往西南邊送，就成了「風吹砂」奇景。',extra:`<g transform="translate(620 300)"><path d="M0 0 q30 -18 66 -10 q20 4 26 10z" fill="#E8DFC8" stroke="${INK}" stroke-width="3"/><text x="46" y="-14" text-anchor="middle" font-size="14" font-weight="900" fill="${INK}">風吹砂</text></g>`}],
        '答對了！落山風從山裡「掉」下來往西南衝，把砂吹到海邊，堆成了風吹砂。大自然的力氣真大！'),
      ev:['落山風觀測站紀錄','「今日落山風強勁。戴草帽的導覽員說：風越大，腳印消失得越快……」']}),
    pz2('k_tune',420,880,{r:55,hint:'營火旁的老爺爺在彈唱恆春民謠。',art:kTuneArt,
      intro:[['duo','「思想起……」這是恆春最有名的民謠！爺爺說，以前的人想家就唱這首。'],
             ['duo','{n}，用心聽，找出正確的樂譜！',{e:'welcome'}]],
      run:()=>folkTune('恆春民謠：思想起','聽聽看「思想起」的旋律，哪一張樂譜是對的？（圓點越高，音越高）',
        '這就是「思想起」！月琴一彈、歌聲一起，连海風都會安靜下來聽。1967 年，音樂家就是在恆春採集到這首歌的！'),
      ev:['民謠採集手冊','「1967 年民歌採集運動，在恆春記錄了陳達爷爷的月琴彈唱。」手冊夾著一張票根：夜間導覽，導覽員簽名歪歪的。']}),
    pz2('k_yueqin',600,900,{r:55,hint:'一把月琴躺在營火旁的椅子上。',art:kYueqinArt,
      intro:[['duo','月琴是恆春的寶貝，圓圓的琴身、兩條弦，聲音又清又亮。'],
             ['duo','{n}，照著譜，幫爺爺把這段旋律彈完！',{e:'point'}]],
      run:()=>yueqin('照譜彈月琴','看譜上的數字：① 是低音弦、② 是高音弦。照順序撥對的弦！',
        [1,2,1,1,2,1,2,2],
        '彈好了！兩條弦就能彈出整首歌——恆春人說：「沒有月琴，就不算恆春民謠。」'),
      ev:['月琴琴袋裡的字條','琴袋裡有一張收據：「修理月琴，取件人：梅……」後面的字被撕掉了。']}),
    pz2('k_totem',920,880,{r:55,hint:'一塊排灣族的圖騰板，缺了最後一塊。',art:kTotemArt,
      intro:[['duo','排灣族的圖騰有自己的「規律」：百步蛇紋、人形紋、太陽紋，一排一排重複。'],
             ['pango2','多叔，最後一格空空的！']],
      run:()=>totemPattern('圖騰的規律','排灣族圖騰像一列整齊的隊伍。看看前面的排列，空白處應該放哪一個？',
        [{seq:['snake','human','snake','human','？'],opts:['snake','human','sun'],ans:'snake'},
         {seq:['sun','sun','snake','sun','？'],opts:['human','sun','snake'],ans:'sun'},
         {seq:['snake','human','sun','snake','human','？'],opts:['human','sun','snake'],ans:'snake'}],
        '圖騰補好了！百步蛇是排灣族的守護神，圖案裡藏著部落的祝福。'),
      ev:['圖騰板的刻字','「此板獻給守護半島的祖靈。」角落有新刻的記號：一頂草帽和一個 X。']}),
    pz2('k_gates',80,820,{r:50,hint:'恆春古城的導覽地圖，四個城門的牌子掉了。',art:kGatesArt,
      intro:[['seaturtle','恆春古城有一百多年了，是台灣保存最完整的清代古城！四個城門都有名字。'],
             ['duo','{n}，把東西南北門放回地圖上的家！',{e:'point'}]],
      run:()=>mapBuild('找回四座城門','1875 年建的恆春城有東、南、西、北四座門。把門放回地圖上的正確位置！',
        K_GATE_PIECES,K_GATE_ZONES,[],
        '四座城門都歸位了！東門朝太平洋、南門向海——一百多年的古城，守護著整個恆春半島。'),
      ev:['古城導覽手冊','「牡丹社事件後，沈葆楨奏請建城保衛恆春半島。」手冊的借閱紀錄上，最後一筆簽名是用左手寫的！']}),
    pz2('k_history',290,885,{r:50,hint:'牡丹社事件紀念石碑。',art:kHistArt,
      intro:[['duo','這塊石碑紀念「牡丹社事件」——一百多年前，排灣族勇士在石門天險抵抗日軍。'],
             ['duo','{n}，把「事件」和「結果」配成一對，這段歷史就清楚了。',{e:'think'}]],
      run:()=>matchPair('牡丹社事件連連看','把左邊的事件，連到右邊對應的結果！',
        [['<b>1871 八瑤灣事件</b>','琉球的船遇到颱風，漂到恆春半島',''],
         ['<b>1874 牡丹社之役</b>','日軍登陸，排灣族抵抗',''],
         ['<b>1875 建恆春城</b>','清廷築城保衛半島',''],
         ['<b>石門天險</b>','兩山對峙的天然隘口','']],
        '歷史連起來了！事件和結果像骨牌一樣，一件推著一件，最後誕生了恆春城。'),
      ev:['石碑背面的刻痕','石碑背面有新刮痕，湊近看是一個箭頭：「展示帳篷 →」。']}),
    pz2('k_turtle',1500,880,{r:55,hint:'海龜產卵保護區的沙地。',art:kTurtleArt,
      intro:[['seaturtle','夏天夜晚，母龜會爬上沙灘產卵。每個窩的蛋數量，我們都要記錄。'],
             ['duo','{n}，幫守護員把蛋分好、算好！',{e:'welcome'}]],
      run:()=>turtleNest('海龜蛋窩記錄','母龜把 9 顆蛋埋在沙裡。幫忙分成 3 窩，再算算總共幾顆！',
        '分窩完成！每窩 3 顆、3 窩共 9 顆——小海龜兩個月後就會孵出來，一起爬向大海。晚上看見母龜，要安靜、不開手電筒白光喔。'),
      ev:['海龜保育巡邏表','「夜巡 22:00：沙灘發現發光腳印，從展示帳篷一路延伸到燈塔。」']}),
    pz2('k_guests',1080,700,{r:55,hint:'碼頭上，四位遊客在等船：都是第一案的老朋友！',
      intro:[['duo','石虎姐姐、水獺船長、梅花鹿導覽員、無尾熊先生——大家都來墾丁玩了！'],
             ['duo','{n}，用五章累積的五個特徵，一項一項檢查：他們之中有怪盜X 嗎？',{e:'think'}]],
      run:()=>logicGrid('四位遊客是怪盜X 嗎？','先在格子裡圈出每個人「有」的特徵，再看看誰五項全中！',
        ['石虎姐姐','水獺船長','梅花鹿導覽員','無尾熊先生'],['鞋子 22 公分','左撇子','戴草帽','燕子吊飾','手上螢光'],
        ['石虎姐姐慣用右手，鞋子 23 公分，但戴著草帽防曬。','水獺船長的背包掛著貝殼，鞋子 25 公分，什麼都不符合。','梅花鹿導覽員的鞋子正好 22 公分！','無尾熊先生是左撇子，鞋子 24 公分。','四個人都沒有燕子吊飾，手上也沒有螢光。'],
        {0:2,2:0,3:1},
        '檢查完了！四個人各自只中一項特徵，沒有人「五項全中」——他們都不是怪盜X！怪盜X 還藏在工作人員裡！',
        '提示：先把每個人「有」的特徵圈起來，再看看誰五項全中？'),
      ev:['遊客們的合照','石虎姐姐：「怪盜X？我們四個一直在吃豆花！」照片裡，每個人手上都拿著豆花，清清白白的。']}),
    pz2('k_suspect',1290,700,{r:50,hint:'展示帳篷外，梅花鹿「導覽員」神色慌張。',art:kSuspectArt,
      intro:[['duo','所有的線索都指向這裡——梅花鹿「導覽員」，我們有幾個問題想請教你。'],
             ['sdeer','我、我什麼都不知道！我一直都在墾丁啊！']],
      run:()=>testimony('對質：梅花鹿導覽員？',
        [['sdeer','我是梅花鹿導覽員，我整晚都在燈塔幫忙，哪裡都沒去！'],
         ['seaturtle','可是……砂卡礑步道的通行證上，有你的簽名耶。'],
         ['sdeer','我、我從來沒去過太魯閣！那個燕子吊飾也不是我的！']],
        [['🎫','砂卡礑通行證（上面有鹿的簽名）'],['🏷️','燕子吊飾標籤（寫著「導覽員」）'],['🔦','紫光手電筒（照出螢光粉）']],2,0,
        '抓到矛盾了！通行證上有你的簽名——你根本去過太魯閣！'),
      ev:['面具與燕子吊飾','「梅花鹿導覽員」臉上掉下一张面具，背包掛著燕子吊飾，手上還有沒擦乾淨的螢光粉——怪盜X 一直假扮成工作人員！'],
      outro:[['sys','「梅花鹿導覽員」的臉裂開了——那是一张面具！'],
             ['x2','啧！被你們逼到這一步。可是抓住我，可沒那麼容易！']] }),
    {id:'k_q',type:'thing',x:1500,y:595,r:45,hidden:true,
     art:()=>`<g transform="translate(1500 595) rotate(14)"><rect x="-7" y="-26" width="14" height="24" rx="5" fill="#3E4450" stroke="${INK}" stroke-width="3"/><path d="M-7 -2 h14 l-4 16 h-6z" fill="#F2E6B8" stroke="${INK}" stroke-width="3"/></g>`,
     tap:async sp=>{sp.hidden=true;if(!G.quests.includes('k5'))G.quests.push('k5');save();drawSpots();sWin();await say('seaturtle','我的巡邏手電筒！沒有它，晚上就照顧不了海龜媽媽了，謝謝你！');toast('完成幫忙任務！')}},
    {id:'b1',type:'badge',bid:'k5a',x:60,y:480},{id:'b2',type:'badge',bid:'k5b',x:1560,y:460},{id:'b3',type:'badge',bid:'k5c',x:800,y:120}
  ]});
  await chapterCard('最終章','會發光的腳印','屏東縣・墾丁');
  await caseCard(5,'找回全部寶物','揭穿「會發光的腳印」魔術，當場抓住怪盜X！','屏東縣・墾丁');
  await say('seaturtle','偵探先生！我是綠蠵龜守護員。這裡是墾丁，台灣的最南端！');
  await say('seaturtle','怪盜X 預告要在黑暗裡表演「會發光的腳印」，然後展示帳篷的寶物箱就被搬空了！');
  await say('duo','{n}，墾丁有 12 個破案關卡。晚上要聽守護員的話：不打擾產卵的母龜、不亂照白光！',{e:'point'});
  await say('seaturtle','哎呀……我的巡邏手電筒被風吹跑了，好像在碼頭那邊……');
  spot('k_q').hidden=false;drawSpots();
  hideDlg();await investigate('調查墾丁');
  await say('duo','線索都齊了！{n}，最後的推理時間！',{e:'confident'});
  hideDlg();await clueBoard(true);
  await ask('duo','「會發光的腳印」是怎麼做出來的？',['腳上沾了螢光粉，紫光一照就發亮','腳本身就是螢光做的','他踩到了很多螢火蟲'],0,{scored:1,wrong:'想想紫光燈下會發亮的是什麼。'});
  await ask('duo','四位遊客（石虎姐姐、水獺船長、梅花鹿導覽員、無尾熊先生）是怪盜X 嗎？',['都不是！怪盜X 假扮成工作人員','梅花鹿導覽員就是怪盜X','無尾熊先生是怪盜X'],0,{scored:1,wrong:'用五個特徵一項一項檢查四位遊客。'});
  await ask('duo','怪盜X 這次露出的破綻：手上沾著什麼？',['螢光粉','巧克力醬','油漆'],0,{scored:1});
  await say('duo','他往沙灘跑了！{n}，最後一追！',{e:'run'});
  hideDlg();await uvChase('紫光追逐：抓！');
  const xg=await actorIn('x2',X2_LOOK,1250,880,1);
  hideDlg();await finisher('紫光讓螢光現形——你的發光腳印魔術，被科學拆穿了！');
  await say('x2','五個魔術……竟然全被科學拆穿了！哼，可是魔術師永遠有下一場！');
  await say('sys','砰！一陣白煙——怪盜X 的身影消失了，地上留下一頂魔術帽。');
  hideDlg();await actorOut(xg,700,-200);
  await say('pango2','帽子裡有一張紙條：「下次，我要去海的那一邊……澎湖、綠島、蘭嶼，等著我吧！」');
  await say('duo','{n}，五個寶物全部找回來了！我們贏了！',{e:'victory'});
  hideDlg();await chapterResult(5,'會發光的腳印');
  G.ch=6;save();
}
C2_CH[5]=c2ch5;
