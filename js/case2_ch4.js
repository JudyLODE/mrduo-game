/* 第二案 第四章 鹿野高台：自己長大的氣球（設計見 DESIGN.md 第 3 節，2026-11-02 因地制宜版）。註冊：C2_CH[4]。 */
"use strict";

/* ---------- 現場小道具 ---------- */
const lWindArt=()=>`<g transform="translate(390 720)"><path d="M-4 0 V-96" stroke="#946F4B" stroke-width="5"/><path d="M-4 -96 L40 -84 L-4 -70Z" fill="#C86062" stroke="${INK}" stroke-width="3"/><circle cx="-4" cy="-100" r="8" fill="#D4BB49" stroke="${INK}" stroke-width="3"/></g>`;
const lFieldArt=()=>`<g transform="translate(190 880)">${[0,1,2].map(k=>`<path d="M${-60+k*46} 20 q6 -40 12 -44 M${-50+k*46} 20 q8 -34 16 -40" stroke="#D4BB49" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}<path d="M-70 22 H70" stroke="#8DB36E" stroke-width="8"/></g>`;
const lMapArt=()=>`<g transform="translate(450 860)"><rect x="-52" y="-40" width="104" height="76" rx="8" fill="#F7F0E1" stroke="${INK}" stroke-width="4"/><path d="M-44 -30 L-10 -14 L-44 4Z M10 -24 L44 -8 L10 10Z" fill="#8DB36E" stroke="${INK}" stroke-width="2.5"/><path d="M-8 -34 q8 20 -4 40" stroke="#5B9BC2" stroke-width="5" fill="none"/><circle cx="30" cy="22" r="5" fill="#C86062"/></g>`;
const lSingArt=()=>`<g transform="translate(1180 880)">${[-36,0,36].map(dx=>`<g transform="translate(${dx} 0) scale(.2)"><g class="breathe">${critter({k:'bear',m:'grin'})}</g></g>`).join('')}<text x="0" y="12" text-anchor="middle" font-size="24" font-weight="900" fill="#C86062">♪♪</text></g>`;
const lBoatArt=()=>`<g transform="translate(1360 880)"><path d="M-60 10 Q-64 -16 -30 -20 H30 Q64 -16 60 10Z" fill="#C86062" stroke="${INK}" stroke-width="4"/><path d="M-44 -12 h24 M-8 -12 h24 M28 -12 h16" stroke="#F7F0E1" stroke-width="6"/><circle cx="-46" cy="-4" r="6" fill="#FFF" stroke="${INK}" stroke-width="2.5"/></g>`;
const lDigArt=()=>`<g transform="translate(1550 900)"><rect x="-56" y="-8" width="112" height="16" fill="#A57E5E" stroke="${INK}" stroke-width="4"/><path d="M-40 8 h80" stroke="#8E7558" stroke-width="6"/><path d="M-28 -12 l14 -10 8 12z M8 -14 l16 4 -10 10z" fill="#DADCDA" stroke="${INK}" stroke-width="2.5"/></g>`;
const lBaseballArt=()=>`<g transform="translate(1500 760)"><rect x="-8" y="-6" width="16" height="40" fill="#FFF" stroke="${INK}" stroke-width="3"/><path d="M-14 -22 h28 v18 h-28z" fill="#FFF" stroke="${INK}" stroke-width="3"/><path d="M-8 -16 h16" stroke="#C86062" stroke-width="3"/></g>`;
const lSilArt=()=>`<g transform="translate(820 878)"><ellipse rx="30" ry="18" fill="#2E384F" opacity=".75"/><circle cx="18" cy="-14" r="12" fill="#2E384F" opacity=".75"/><path d="M-8 -6 l8 -8 8 8 -8 8z" fill="#FFF" opacity=".85"/></g>`;

/* ---------- 服飾穿搭（阿美族豐年祭）的零件圖 ---------- */
const DU={
 crownOk:`<g transform="translate(150 50)"><path d="M-42 10 q-8 -44 10 -58 q2 32 10 46 q4 -38 18 -50 q0 36 8 50 q8 -32 22 -36 q-8 34 -10 48z" fill="#C86062" stroke="${INK}" stroke-width="3.5"/><circle cy="8" r="8" fill="#D4BB49" stroke="${INK}" stroke-width="3.5"/></g>`,
 crownCap:`<g transform="translate(150 52)"><path d="M-38 6 Q-36 -26 0 -28 Q36 -26 38 6Z" fill="#2B79B5" stroke="${INK}" stroke-width="3.5"/><path d="M-40 6 Q4 -4 52 8 Q20 16 -40 12Z" fill="#23689E" stroke="${INK}" stroke-width="3"/></g>`,
 crownBow:`<g transform="translate(150 46)"><path d="M0 0 l-26 -14 v28z M0 0 l26 -14 v28z" fill="#D4BB49" stroke="${INK}" stroke-width="3.5"/><circle r="7" fill="#C9A42F" stroke="${INK}" stroke-width="3"/></g>`,
 topOk:`<g><path d="M106 158 q44 -20 88 0 l8 78 h-104z" fill="#C86062" stroke="${INK}" stroke-width="4"/><path d="M110 168 h80 M108 224 h84" stroke="#FFFDF6" stroke-width="5"/><path d="M118 186 h24 M158 186 h24 M118 204 h24 M158 204 h24" stroke="#D4BB49" stroke-width="4"/></g>`,
 topT:`<g><path d="M106 158 q44 -20 88 0 l8 78 h-104z" fill="#FFFDF6" stroke="${INK}" stroke-width="4"/><text x="150" y="208" text-anchor="middle" font-size="26" font-weight="900" fill="#92C3DB">T</text></g>`,
 topFl:`<g><path d="M106 158 q44 -20 88 0 l8 78 h-104z" fill="#8DB36E" stroke="${INK}" stroke-width="4"/>${[[120,180],[160,180],[138,206],[178,206]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#FFFDF6"/>`).join('')}</g>`,
 skirtOk:`<g><path d="M116 234 h68 l18 122 h-104z" fill="#2E384F" stroke="${INK}" stroke-width="4"/><path d="M122 262 h56 M126 296 h48 M132 328 h36" stroke="#D4BB49" stroke-width="5"/><path d="M140 262 l8 8 -8 8 -8 -8z M164 296 l8 8 -8 8 -8 -8z" stroke="#C86062" stroke-width="4" fill="none"/></g>`,
 skirtJeans:`<g><path d="M118 234 h64 l6 122 h-30 l-8 -70 -8 70 h-30z" fill="#2B5A8C" stroke="${INK}" stroke-width="4"/></g>`,
 skirtShort:`<g><path d="M118 234 h64 l8 60 h-80z" fill="#D4BB49" stroke="${INK}" stroke-width="4"/></g>`,
 accOk:`<g><path d="M176 244 q22 6 18 34 q-16 8 -26 -4z" fill="#946F4B" stroke="${INK}" stroke-width="3.5"/><path d="M180 252 q10 4 8 18" stroke="#D4BB49" stroke-width="3" fill="none"/><g transform="translate(204 400)"><circle r="8" fill="#D4BB49" stroke="${INK}" stroke-width="3"/><circle cx="14" cy="-4" r="6" fill="#D4BB49" stroke="${INK}" stroke-width="3"/></g></g>`,
 accBag:`<g><rect x="182" y="180" width="34" height="44" rx="8" fill="#C86062" stroke="${INK}" stroke-width="3.5"/><path d="M188 180 q11 -16 22 0" stroke="${INK}" stroke-width="3.5" fill="none"/></g>`,
 accSun:`<g><path d="M128 92 h18 v12 h-18z M154 92 h18 v12 h-18z M146 96 h8" stroke="#2E384F" stroke-width="5" fill="#2E384F"/></g>`};

/* ---------- 拼板舟船板 ---------- */
const L_BOAT=[0,1,2,3,4,5].map(i=>({home:i,col:['#C86062','#F7F0E1','#2E384F'][i%3],sx:60+i*140,sy:i%2?44:8}));

/* ---------- 卑南遺址：地層與文物 ---------- */
const L_LAYERS=['現代層（最年輕）','清代生活層','三和文化層','卑南文化層（最古老，約三千年前）'];
const L_DL_ART={
 bottle:`<g transform="translate(0 0)"><rect x="-8" y="-22" width="16" height="26" rx="5" fill="#BFD9E6" stroke="${INK}" stroke-width="2.5"/><rect x="-4" y="-30" width="8" height="8" fill="#5B84AB" stroke="${INK}" stroke-width="2"/></g>`,
 coin:`<g><circle r="12" fill="#D4BB49" stroke="${INK}" stroke-width="2.5"/><rect x="-5" y="-5" width="10" height="10" fill="none" stroke="#8A6F3C" stroke-width="2"/></g>`,
 pot:`<g><path d="M-14 6 q-4 -18 8 -22 q10 -3 16 6 q6 8 0 16z" fill="#B4614F" stroke="${INK}" stroke-width="2.5"/><path d="M-6 -8 h12" stroke="#8C4436" stroke-width="2"/></g>`,
 jade:`<g><circle r="11" fill="none" stroke="#7FB98A" stroke-width="6"/><circle r="11" fill="none" stroke="${INK}" stroke-width="2" opacity=".6"/></g>`,
 slab:`<g><rect x="-22" y="-10" width="44" height="18" rx="3" fill="#9AA0A8" stroke="${INK}" stroke-width="2.5"/><path d="M-14 -4 h28" stroke="#7E858E" stroke-width="2"/></g>`};
const L_DL_ITEMS=[
  {n:'塑膠瓶',e:'🥤',l:0,when:'上星期掉的',art:L_DL_ART.bottle},
  {n:'清朝銅錢',e:'🪙',l:1,when:'兩百年前',art:L_DL_ART.coin},
  {n:'紅陶片',e:'🏺',l:2,when:'一千多年前',art:L_DL_ART.pot},
  {n:'玉耳飾',e:'💚',l:3,when:'三千年前',art:L_DL_ART.jade},
  {n:'小石板棺',e:'🪨',l:3,when:'三千年前',art:L_DL_ART.slab}];

/* ---------- 縱谷大地圖零件 ---------- */
const L_MB_ZONES=[
  {x:60,y:40,w:200,h:300},{x:280,y:40,w:220,h:300},{x:520,y:40,w:160,h:300},{x:700,y:40,w:150,h:300}];
const L_MB_PIECES=[
  {zone:0,sx:70,sy:6,hint:'中央山脈在台灣的「西邊」，是高高的山。',art:`<path d="M30 300 L70 100 L110 200 L150 60 L185 190 L205 300Z" fill="#8A93A8" stroke="${INK}" stroke-width="4"/>`},
  {zone:2,sx:330,sy:6,hint:'海岸山脈在「東邊」，靠太平洋的那一側。',art:`<path d="M25 300 L60 130 L95 220 L125 90 L155 300Z" fill="#9AA895" stroke="${INK}" stroke-width="4"/>`},
  {zone:1,sx:520,sy:6,hint:'卑南溪在中央，由北往南流。',art:`<path d="M100 0 q40 80 -10 160 q-40 80 10 140" stroke="#5B9BC2" stroke-width="30" fill="none" stroke-linecap="round"/>`},
  {zone:3,sx:660,sy:6,hint:'太平洋在台灣的東邊，是一片大海。',art:`<rect width="150" height="300" fill="#7FB3CC" stroke="${INK}" stroke-width="4"/>${[60,130,200,260].map(y=>`<path d="M10 ${y} q18 -10 36 0 t36 0 t36 0" stroke="#A9CFDF" stroke-width="5" fill="none"/>`).join('')}`},
  {mark:0,mx:360,my:250,sx:820,sy:80,hint:'台東市在河流出海的地方。',art:`<g transform="translate(30 30)"><rect x="-18" y="-4" width="36" height="26" fill="#C86062" stroke="${INK}" stroke-width="3"/><path d="M-24 -4 L0 -26 L24 -4Z" fill="#8C6A4E" stroke="${INK}" stroke-width="3"/></g>`},
  {mark:1,mx:340,my:90,sx:820,sy:160,hint:'鹿野高台在中央縱谷的北邊。',art:`<g transform="translate(0 0)"><path d="M0 0 V-44" stroke="${INK}" stroke-width="4"/><path d="M0 -44 L34 -36 L0 -26Z" fill="#D4BB49" stroke="${INK}" stroke-width="3"/></g>`}];
const L_MB_MARKS=[{x:390,y:290},{x:390,y:100}];

/* ================= 第四章本體 ================= */
async function c2ch4(){
  G.ch=4;save();setCh('第四章　自己長大的氣球');DUO.coat=true;
  setScene({id:'luye',color:'#C6E0EC',bg:bgLuye,duo:[560,905,300],ground:()=>905,range:[150,1450],spots:[
    pz2('l_balloon',260,330,{r:50,hint:'巨大的熱氣球底下，掛著「飛行原理」的牌子。',
      intro:[['duo','「自己長大的氣球」……{n}，我們來看看熱氣球到底是怎麼飛的！'],['pango2','我知道！電視上說跟「熱空氣」有關係！']],
      run:()=>heatRise('熱氣球為什麼會飛？','兩顆一樣大的球，一顆下面用火加熱、一顆不加熱。先猜猜看，再按住按鈕加熱驗證！',
        '看到了嗎？加熱的那顆球，裡面的空氣變熱、變輕，就把球托起來了——熱氣球就是用這個原理飛上天的！'),
      ev:['科學魔法卡：熱氣魔法','空氣受熱會膨脹、變輕，往上升。怪盜X 偷偷在球下面加熱，氣球就「自己」長大、自己升空！']}),
    pz2('l_wind',390,720,{r:50,hint:'起飛場旁邊有一支風向袋。',art:lWindArt,
      intro:[['duo','熱氣球要靠風才能往目標飛。起飛前，一定要先看風向！'],['duo','{n}，把羅盤的箭頭轉到風來的方向。',{e:'point'}]],
      run:()=>windCompass('起飛前的風向檢查','風會告訴你它從哪裡來！把紅色箭頭轉向「風來的方向」。',
        [{q:'清晨，風從「東南方」吹來。',ans:3},{q:'氣象站廣播：現在吹「西北風」。',ans:7},{q:'起飛檢查：現在吹「東風」。',ans:2}],
        '方位全部正確！風向判斷是飛行員的基本功。'),
      ev:['風向觀測記錄','起飛場的記錄：「下午轉西北風。戴草帽的工作人員，把一個長長的袋子搬上了熱氣球……」']}),
    pz2('l_dress',680,915,{r:55,hint:'阿美族的服飾攤位，掛著漂亮的祭典服裝。',art:()=>`<g transform="translate(680 915)"><path d="M-56 10 V-70 M56 10 V-70 M-64 -70 H64" stroke="#8E7558" stroke-width="7" fill="none"/>${[-30,0,30].map((dx,i)=>`<g transform="translate(${dx} -48)"><path d="M-16 -18 h32 v36 q-16 8 -32 0z" fill="${['#C86062','#2E384F','#D4BB49'][i]}" stroke="${INK}" stroke-width="3"/></g>`).join('')}</g>`,
      intro:[['duo','今天是阿美族的豐年祭！姐姐要穿上最漂亮的盛裝，我們來幫忙搭配。'],['duo','阿美族的服飾有紅、黑、白三色，還有刺繡和羽飾喔。',{e:'welcome'}]],
      run:()=>dressUp('豐年祭盛裝','點「換」切換每一部位的服飾，幫姐姐穿上正統的阿美族祭典盛裝！',
        [{slot:'頭飾',hint:'頭上：豐年祭會戴「羽毛」裝飾。',opts:[{n:'紅色羽冠',ok:1,art:DU.crownOk},{n:'藍色棒球帽',ok:0,art:DU.crownCap},{n:'蝴蝶結',ok:0,art:DU.crownBow}]},
         {slot:'上衣',hint:'上衣：祭典穿「紅色」的刺繡衣。',opts:[{n:'紅色刺繡上衣',ok:1,art:DU.topOk},{n:'白 T 恤',ok:0,art:DU.topT},{n:'綠花襯衫',ok:0,art:DU.topFl}]},
         {slot:'裙子',hint:'裙子：阿美族姐姐穿「長裙」，有織花。',opts:[{n:'黑色織花長裙',ok:1,art:DU.skirtOk},{n:'牛仔褲',ok:0,art:DU.skirtJeans},{n:'黃短裙',ok:0,art:DU.skirtShort}]},
         {slot:'配件',hint:'配件：腰上掛「檸榔袋」，腳上有鈴鐺。',opts:[{n:'檳榔袋和腳鈴',ok:1,art:DU.accOk},{n:'後背包',ok:0,art:DU.accBag},{n:'墨鏡',ok:0,art:DU.accSun}]}],
        '好隆重的豐年祭盛裝！阿美族的問候語是「Nga\'ay ho!」（你好）——跟著多叔說一次！'),
      ev:['阿美族服飾冊','豐年祭盛裝：羽冠、紅色刺繡上衣、織花長裙。冊子裡寫著：「歌舞敬天，感謝豐收。」']}),
    pz2('l_sing',1180,880,{r:55,hint:'布農族合唱團正在練習，準備晚上的演出。',art:lSingArt,
      intro:[['duo','聽！這是布農族的「八部合音」——每一個人唱一個聲部，疊起來像山裡的風。'],
             ['duo','{n}，從「最低的音」開始，一個一個族員點上去！',{e:'point'}]],
      run:()=>harmonyStack('八部合音','八個族員，一人一部。聽一聽、比一比，從最低的音開始，一個一個把他們點進合唱裡！',8,
        '這就是布農族的八部合音！一個一個聲部疊上去，最後變成像大山一樣的歌聲。'),
      ev:['合唱團的節目單','「布農族八部合音——從一個人的歌，唱到一座山的歌。」單子角落寫著：「下一場：光的魔術，最南邊的海。X」']}),
    pz2('l_boat',1360,880,{r:55,hint:'展示的拼板舟被拆成一片片船板了。',art:lBoatArt,
      intro:[['pango2','多叔！這是蘭嶼達悟族的拼板舟，可是船板被拆散放在地上了……'],
             ['duo','我們幫忙拼回去吧。拼板舟是紅、白、黑三色，船首還有船眼圖案喔。',{e:'welcome'}]],
      run:()=>boatBuild('拼回拼板舟','點一片船板，再點船架上對應的位置，把拼板舟拼回去！',
        L_BOAT,
        '拼好了！達悟族的拼板舟紅白黑三色，船眼看守平安。飛魚季的時候，蘭嶼的大哥哥們會划著它出海。'),
      ev:['拼板舟的明信片','蘭嶼寄來的明信片：「拼板舟紅白黑三色，船眼看守平安。飛魚季快到了。——一位蘭嶼船匠」']}),
    pz2('l_field',190,880,{r:55,hint:'池上來的稻田體驗區，可以動手「圍田」。',art:lFieldArt,
      intro:[['duo','這是池上稻田的縮小版！農夫說：想要多大、多長的田，就要會算「面積」和「周長」。'],
             ['duo','{n}，在方格上拖出一個長方形，完成農夫的訂單！',{e:'point'}]],
      run:()=>fieldFence('農夫的圍田訂單','每一格是 1 平方公尺。按住方格拖曳，圍出題目要的田！',
        [{q:'<b>第 1 張訂單</b>：圍一塊<b>面積 12 平方公尺</b>的田。',w:4,h:3,hint:'4 × 3 ＝ 12，想想還有別的圍法嗎？4 格寬、3 格高就可以！'},
         {q:'<b>第 2 張訂單</b>：圍一塊<b>面積 16、周長 16</b>的田。',w:4,h:4,hint:'每一邊一樣長的正方形：4 × 4，周長 4+4+4+4。'},
         {q:'<b>第 3 張訂單</b>（高年級挑戰）：圍一塊<b>面積 8、周長 12</b>的田。',w:4,h:2,hint:'2 × 4 ＝ 8，周長 2+4+2+4 ＝ 12！'}],
        '三張訂單都完成了！面積是田的大小，周長是籬笆的長度——池上的米就是這樣一區一區種出來的！'),
      ev:['稻田認養牌','「這一區稻田認養人：鹿野國小三年一班。」牌子下壓著收據：買了 4 包紅烏龍茶，署名 M.F.？']}),
    pz2('l_baseball',1500,760,{r:50,hint:'紅葉少棒的紀念展示牌。',art:lBaseballArt,
      intro:[['duo','「1968 年，台東紅葉少棒隊打贏了日本少棒明星隊！」——這塊牌子紀念那場傳奇比賽。'],
             ['pango2','多叔，我把四個隊員的守備位置搞混了……']],
      run:()=>logicGrid('紅葉少棒守備表','1968 年那場比賽的先發名單，四個隊員守四個位置。用線索推理出來！',
        ['阿宏','小傑','秀英','志明'],['投手','捕手','一壘手','外野手'],
        ['小傑是主將，站投手丘。','秀英最不會跑，守一壘。','阿宏眼力最好，守外野。','四個人守四個不同的位置。'],
        {0:3,1:0,2:1,3:2},
        '守備表排好了！紅葉少棒靠團隊合作贏了日本隊——練習再練習，台東的孩子不認輸！'),
      ev:['紅葉少棒紀念牌','「1968 年，紅葉少棒隊擊敗日本少棒明星隊！」牌子後面刻著：「練習再練習，台東的孩子不認輸。」']}),
    pz2('l_dig',1550,900,{r:50,hint:'卑南遺址的考古體驗坑。',art:lDigArt,
      intro:[['duo','這是仿照卑南遺址做的考古體驗坑！卑南遺址有三千多年歷史，是台灣最大的史前聚落。'],
             ['duo','考古學家的祕訣：越深的地層，東西越古老。{n}，把文物放回正確的地層！',{e:'think'}]],
      run:()=>digLayers('考古小隊出動','體驗坑挖出了 5 件東西！先點一件文物，再點它應該埋在哪一層。',
        L_LAYERS,L_DL_ITEMS,
        '考古成功！卑南文化層裡有石板棺和精美玉器，是台灣的國寶。真正的卑南遺址，就在台東市旁邊喔。'),
      ev:['考古隊的出土清單','清單上寫：「卑南文化層出土：石板棺、玉器。三千年前的人，就住在這片縱谷裡。」']}),
    pz2('l_map',450,860,{r:55,hint:'一幅還沒完成的花東縱谷大地圖。',art:lMapArt,
      intro:[['pango2','多叔！這幅大地圖的山和河都不見了！'],['duo','沒關係，我們對照課本拼回來。中央山脈在西、海岸山脈在東，中間夾著卑南溪。',{e:'confident'}]],
      run:()=>mapBuild('拼出花東縱谷','把山脈、河流、海洋和兩個地標放回大地圖上的正確位置！',
        L_MB_PIECES,L_MB_ZONES,L_MB_MARKS,
        '大地圖完成了！中央山脈、海岸山脈夾著卑南溪——這條花東縱谷，是台灣的米倉，也是熱氣球的家。'),
      ev:['縱谷大地圖','地圖角落的筆記：「中央山脈、海岸山脈夾著卑南溪——花東縱谷是台灣的米倉。」']}),
    pz2('l_market',1010,900,{r:55,hint:'釋迦攤位飄著甜甜的香味。',art:()=>`<g transform="translate(1010 900)"><path d="M-56 8 h112 l-8 -30 h-96z" fill="#A57E5E" stroke="${INK}" stroke-width="4"/>${[-30,0,30].map(dx=>`<g transform="translate(${dx} -22)"><circle r="13" fill="#8DB36E" stroke="${INK}" stroke-width="3"/><path d="M-4 -13 q2 -8 8 -8" stroke="#5C7A3C" stroke-width="3" fill="none"/></g>`).join('')}<path d="M-64 -24 H64" stroke="#946F4B" stroke-width="6"/></g>`,
      intro:[['duo','台東的釋迦最甜了！不過老闆遇到難題：大小顆不一樣重，客人要公平。'],
             ['duo','{n}，用天平讓兩邊一樣重吧！大釋迦 2 斤、小釋迦 1 斤。',{e:'point'}]],
      run:()=>marketScale('釋迦公平秤','右盤是老闆放的釋迦。用「大釋迦（2 斤）」和「小釋迦（1 斤）」在左盤擺出一樣重！',
        [{right:[1]},{right:[0,0,0]},{right:[1,1]}],
        '天平平衡！1 顆大釋迦＝2 顆小釋迦——這就是數學的「等量」。老闆說要送大家一人一顆！'),
      ev:['釋迦攤的收據','戴草帽的客人買了 10 顆大釋迦：「要帶去南邊的海邊請客。」他往熱氣球起飛場的方向走了。'],after:'釋迦要放軟了才最好吃喔。'}),
    pz2('l_sil',820,878,{r:50,hint:'草叢裡有一個大大的黑影。',art:lSilArt,
      intro:[['pango2','多叔！草叢裡有一個好大的黑影，樹都在搖！']],
      run:()=>silhouette({title:'草叢裡的大力士',clue:'牠力氣很大，會爬樹。胸口有白色的 V 字花紋，冬天會在樹洞裡睡大覺。',
        sil:`<svg viewBox="0 0 300 220"><rect width="300" height="220" fill="#D9C7A3"/><ellipse cx="150" cy="150" rx="70" ry="48" fill="#2E384F"/><circle cx="208" cy="108" r="30" fill="#2E384F"/><circle cx="196" cy="86" r="10" fill="#2E384F"/><circle cx="222" cy="86" r="10" fill="#2E384F"/><path d="M126 128 l12 -12 12 12 -12 12z" fill="#FFFFFF"/><path d="M84 180 l-14 26 M216 180 l14 26" stroke="#2E384F" stroke-width="14" stroke-linecap="round"/></svg>`,
        real:`<svg viewBox="0 0 300 220"><rect width="300" height="220" fill="#D9C7A3"/><ellipse cx="150" cy="150" rx="70" ry="48" fill="#5D4C42" stroke="${INK}" stroke-width="5"/><path d="M96 130 q-14 40 8 62 M204 130 q14 40 -8 62" stroke="#4A3C33" stroke-width="10" fill="none"/><circle cx="208" cy="108" r="30" fill="#5D4C42" stroke="${INK}" stroke-width="5"/><circle cx="196" cy="86" r="10" fill="#5D4C42" stroke="${INK}" stroke-width="4"/><circle cx="222" cy="86" r="10" fill="#5D4C42" stroke="${INK}" stroke-width="4"/><circle cx="218" cy="104" r="4" fill="${INK}"/><ellipse cx="228" cy="116" rx="8" ry="6" fill="#3A332E"/><path d="M126 128 l12 -12 12 12 -12 12z" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/><path d="M84 180 l-14 26 M216 180 l14 26" stroke="#4A3C33" stroke-width="14" stroke-linecap="round"/></svg>`,
        guess:['台灣黑熊','野豬','我先想想'],part:'胸口的 V 字白毛',
        opts:[['台灣黑熊','🐻',1],['野豬','🐗',0],['山羌','🦌',0]],
        fact:'答對了！台灣黑熊是台灣最大的陸地動物，胸口的 V 字白毛是牠的招牌！'}),
      ev:['今日小謎案','原來是台灣黑熊在找蜂蜜！牠說：「有個戴草帽的人經過，背著好大的袋子……」']}),
    {id:'l_q',type:'thing',x:1150,y:240,r:45,hidden:true,
     art:()=>`<g transform="translate(1150 240) rotate(-10)"><rect x="-14" y="-22" width="28" height="40" rx="10" fill="#3E4450" stroke="${INK}" stroke-width="4"/><path d="M-14 8 q-10 10 -4 22" stroke="${INK}" stroke-width="4" fill="none"/><path d="M-8 -12 h16" stroke="#8FA2B3" stroke-width="4"/></g>`,
     tap:async sp=>{sp.hidden=true;if(!G.quests.includes('k4'))G.quests.push('k4');save();drawSpots();sWin();await say('pheasant','我的麥克風！晚會主持就靠它了，謝謝你！');toast('完成幫忙任務！')}},
    {id:'l_host',type:'npc',actor:'pheasant',x:310,y:905,s:1},
    {id:'b1',type:'badge',bid:'k4a',x:90,y:700},{id:'b2',type:'badge',bid:'k4b',x:1500,y:560},{id:'b3',type:'badge',bid:'k4c',x:820,y:60}
  ]});
  await chapterCard('第四章','自己長大的氣球','台東縣・鹿野高台');
  await caseCard(4,'找回金色熱氣球獎盃','揭穿「自己長大的氣球」魔術，找出魔術師逃去哪裡。','台東縣・鹿野高台');
  await say('pheasant','偵探先生！歡迎來到台灣國際熱氣球嘉年華！我是主持人帝雉姊姊！');
  await say('pheasant','怪盜X 表演「會自己長大的氣球」，表演完，金色熱氣球獎盃就不見了！');
  await say('duo','{n}，鹿野高台有 11 個破案關卡。這裡風大，帽子要戴好！',{e:'point'});
  await say('pheasant','哎呀！我的麥克風被風吹走了，好像在熱氣球那邊……');
  spot('l_q').hidden=false;drawSpots();
  hideDlg();await investigate('調查鹿野高台');
  await say('duo','線索都到齊了！{n}，推理時間！',{e:'confident'});
  hideDlg();await clueBoard(true);
  await ask('duo','「自己長大的氣球」到底是怎麼自己升起的？',['球裡的空氣被加熱，熱空氣變輕會上升','裡面裝了氦氣','有人偷偷用線把球拉起來'],0,{scored:1,wrong:'想想熱氣球升空的實驗。'});
  await ask('duo','兩個證人都提到，怪盜X 這次戴著什麼？',['草帽','毛線帽','安全帽'],0,{scored:1,wrong:'看看風向觀測記錄和釋迦攤的收據。'});
  await ask('duo','合唱團節目單上，怪盜X 預告的下一站在哪裡？',['最南邊的海邊（墾丁）','台北','九份'],0,{scored:1});
  await say('duo','沒錯！怪盜X 搭熱氣球跑了，快追！',{e:'run'});
  hideDlg();await balloonRide('熱氣球追逐：追！');
  const xg=await actorIn('x2',X2_LOOK,1250,880,1);
  hideDlg();await finisher('熱空氣上升讓球變輕——你的氣球魔術，被科學拆穿了！');
  await say('x2','哼，算你們會看風。下一場，我要讓黑暗裡開出光的花！');
  await say('sys','砰！白煙散開——金色熱氣球獎盃滾了出來，還有一張字條。');
  hideDlg();await actorOut(xg,700,-200);
  await say('pango2','字條上寫著：「會發光的腳印，在最南邊的海。——X」');
  await say('duo','{n}，我們去墾丁！',{e:'point'});
  hideDlg();await chapterResult(4,'自己長大的氣球');
  hideDlg();await travel('luye','kenting');
  G.ch=5;save();
}
C2_CH[4]=c2ch4;
