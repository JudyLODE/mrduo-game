/* 第一案「消失的台灣三寶」劇本、關卡與題目（含第二套題目 ALTS）。 */
"use strict";
/* ================= CHAPTER 0: Prologue ================= */
async function prologue(){
  setCh('序章　紅色的預告信');
  setScene({id:'office',color:'#EAD9B5',bg:bgOffice,duo:[780,900,470],spots:[
    {id:'letter',type:'thing',x:1380,y:880,r:70,hidden:true,need:true,art:()=>`<g transform="translate(1380 880) rotate(-8)"><rect x="-60" y="-38" width="120" height="76" rx="6" fill="#FFFFFF" stroke="#2E384F" stroke-width="5"/><path d="M-60 -38 L0 6 L60 -38" fill="none" stroke="#2E384F" stroke-width="5"/><circle r="16" cy="4" fill="#7E5FA3" stroke="#2E384F" stroke-width="3"/><text y="11" text-anchor="middle" font-size="20" font-weight="900" fill="#fff" font-family="Fredoka">X</text></g>`,
     tap:async sp=>{sp.done=true;sp.hidden=true;drawSpots();await letter(0)}}]});
  await chapterCard('序章','紅色的預告信','台北，一個下著小雨的早晨');
  await say('sys','台北，一個下著小雨的早晨。這裡是「多叔偵探事務所」。');
  await say('duo','嗯……下雨天最適合喝熱可可了。今天應該不會有什麼案子吧……');
  await say('duo','啊，你就是新來的見習助手{n}吧？我是偵探多叔。歡迎你！');
  const c=await ask('me','（要怎麼回答多叔呢？）',['多叔好！請多指教！','多叔，你的帽子好帥！']);
  await say('duo',c===0?'很好，很有精神！當偵探，打招呼可是很重要的。':'呵呵，謝謝。這頂帽子陪我破過一百個案子呢。');
  await say('duo','對了，我們偵探最重要的工具，是「觀察」和「推理」。今天我會慢慢教你。');
  sBell();setDuo('gasp');await say('sys','叮咚——！門縫底下，突然塞進來一封紅色的信。');
  spot('letter').hidden=false;drawSpots();
  await say('duo','……看來我的熱可可要涼了。{n}，幫我把門口那封信撿起來吧。');
  hideDlg();await investigate('撿起門口的信',{button:false});
  await say('duo','怪盜X！他是專門偷台灣寶物的怪盜，連警察都抓不到他。');
  await say('duo','信上說，他要偷「台灣最高大樓頂端的燈」……{n}，你知道是哪裡嗎？我們打開地圖看看。');
  hideDlg();await mapPick('t101',0);
  await say('duo','答對了，就是台北101！它高 508 公尺，曾經是世界最高的大樓。');
  await say('duo','熱可可回來再喝。等我一下，偵探出門，一定要穿上這件！',{e:'cheeky'});
  DUO.coat=true;setDuo('confident');sWin();
  await say('sys','多叔從衣架上拿起他的招牌風衣，帥氣地穿上。');
  await say('duo','好了！走吧，{n}，出發！',{e:'point'});
  hideDlg();await travel(null,'t101');
}

/* ================= second question set (used on every even-numbered playthrough) =================
   Same scenes, same mini-games, but every school-subject question is new. */
const ALT_SIGNS=[{"s": "觀景台的窗戶很乾淨，請勿用手觸莫。", "w": 15, "ok": "摸", "o": ["摸", "模", "漠"], "ex": "用手去碰是「摸」，所以是手字旁；「模」是木字旁，例如模型。"}, {"s": "看完風景後，請延著箭頭的方向離開。", "w": 7, "ok": "沿", "o": ["沿", "鉛", "船"], "ex": "「沿著」的沿有三點水；「延長」的延沒有三點水。"}, {"s": "古堡裡的大砲很重要，請不要攀爬或座在上面。", "w": 16, "ok": "坐", "o": ["坐", "座", "做"], "ex": "「坐下」的坐是動作；「座位」的座是地方，上面有广字頭。"}, {"s": "參觀古堡時請保持安靜，不要大聲喊較。", "w": 16, "ok": "叫", "o": ["叫", "較", "教"], "ex": "「喊叫」要用嘴巴，所以是口字旁的「叫」。"}, {"s": "雖然怪盜X很絞猾，但是多叔一定會抓到他。", "w": 6, "ok": "狡", "o": ["狡", "絞", "餃"], "ex": "「狡猾」的狡是犬字旁（犭）；「絞」是糸字旁。這句用了「雖然……，但是……」。"}, {"s": "如果天一黑，怪盜X就要朵進人群。", "w": 11, "ok": "躲", "o": ["躲", "朵", "垛"], "ex": "「躲藏」要用身體，所以是身字旁；「花朵」的朵沒有身字旁。這句用了「如果……就……」。"}];
const ALTS_SRC=()=>({
  /* ---------- Chapter 1: Taipei 101 ---------- */
  bear:{intro:[['bear','偵探先生！我一直守在電梯口。剛剛有個戴著圓圓眼鏡的人，鬼鬼祟祟地走過去。'],['bear','他經過的時候，還抬頭看了一眼牆上的時鐘……']],
    run:()=>quiz('熊阿伯的證詞',[
      {q:'熊阿伯看到可疑的人時，時鐘是這樣。那時候是幾點幾分？',pic:clockSvg(2,20),o:['2 點 20 分','4 點 10 分','2 點 4 分'],ex:'短針剛過 2，長針指著 4，4 × 5 ＝ 20，就是 2 點 20 分。',hint:'長針指著 4，一大格是 5 分鐘，4 大格是幾分？'},
      {q:'那個人 2:20 經過電梯口，過了 35 分鐘，又出現在紀念品店。那時候是幾點幾分？',o:['2 點 55 分','3 點 5 分','2 點 45 分'],ex:'20 分再加 35 分是 55 分，還不到 60 分，所以是 2 點 55 分。',hint:'20 ＋ 35 ＝ ？ 有沒有超過 60 分？'}]),
    ev:['熊阿伯的證詞','可疑的人戴著圓圓的眼鏡，2:20 經過電梯口，2:55 到了紀念品店。']},
  leo:{intro:[['leo','歡迎光臨！剛剛有位戴眼鏡的客人，買了 4 個101鑰匙圈，丟下錢就跑了。'],['leo','這是收據，我還沒算清楚……']],
    run:()=>calc('紀念品店的收據',[{q:'一個101鑰匙圈 245 元，客人買了 4 個，一共要多少元？',a:980,unit:'元',hint:'245 × 4：5 × 4 ＝ 20，寫 0 進 2……'},{q:'客人只留下 900 元就跑走了。他少付了多少元？',a:80,unit:'元',hint:'980 − 900 ＝ ？'}]),
    ev:['紀念品店收據','戴眼鏡的客人少付了 80 元就跑走了，非常可疑。']},
  koala:{run:()=>quiz('和 Mr. Koala 說英文',[
      {q:'Mr. Koala 指著熊阿伯問：「Is he a cook?」要怎麼回答？',say:'Is he a cook?',en:1,pic:`<div style="height:170px">${head(CAST.bear.look)}</div>`,o:["No, he isn't.","Yes, she is.","Yes, I am."],ex:"熊阿伯是保全，不是廚師，所以說 No, he isn't.（不，他不是。）"},
      {q:'Mr. Koala 笑著問你：「How are you?」',say:'How are you?',en:1,o:["I'm fine. Thank you.","I'm ten.","It's a cat."],ex:'How are you? 是問「你好嗎？」，回答 I\'m fine. Thank you.（我很好，謝謝。）'},
      {q:'Mr. Koala 說：「The man has big glasses.」這句話是什麼意思？',say:'The man has big glasses.',o:['那個男人戴著大眼鏡','那個男人有一頂大帽子','那個男人有一隻大狗'],ex:'big 是大的，glasses 是眼鏡。'}]),
    ev:['Mr. Koala 的證詞','The man has big glasses. 外國觀光客也看到可疑的人戴著眼鏡。']},
  panel:{intro:[['duo','電梯又被怪盜X換了新的密碼！要解開三道乘法密碼，電梯才會動。']],
    run:()=>mathLock([{a:254,b:4,q:'第一道密碼：254 × 4'},{a:127,b:6,q:'第二道密碼：每層樓有 127 扇窗戶，6 層樓一共有幾扇？'},{a:382,b:3,q:'第三道密碼：89 樓觀景台大約在 382 公尺高的地方。3 倍高是幾公尺？'}])},
  damper:{run:()=>quiz('擺錘實驗',[
      {q:'三個擺錘一起擺動，哪一個擺得最快（來回一次最短）？',pic:pendSvg(),o:['A','B','C','三個一樣快'],ex:'擺長越短，擺動越快。A 的繩子最短，所以最快。',hint:'仔細看動畫，哪一個來回最匆忙？'},
      {q:'想讓擺錘擺得慢一點，可以怎麼做？',o:['把繩子加長','把繩子剪短','換成比較輕的擺錘'],ex:'擺長越長，擺動越慢；擺錘的輕重影響不大。'},
      {q:'擺錘來回擺動一次的時間，主要和什麼有關？',o:['擺長','擺錘的顏色','擺錘的重量'],ex:'擺動的快慢主要決定於擺長。'}])},
  scope:{run:()=>quiz('地圖上的方位',[
      {q:'一般的地圖，右邊是哪一個方位？',pic:compassMap(),o:['東方','西方','北方'],ex:'上北、下南、左西、右東，右邊是東方。'},
      {q:'台北101在日月潭的哪一個方向？',pic:compassMap(),o:['北方','南方','東方'],ex:'台北在台灣北部，日月潭在中部，所以台北在日月潭的北方。'},
      {q:'從日月潭要去台南的安平古堡，大約要往哪個方向走？',pic:compassMap(),o:['西南方','東北方','正北方'],ex:'台南在日月潭的南邊偏西，所以是西南方。'},
      {q:'野柳在台灣的哪一部分？',pic:compassMap(),o:['北部','南部','東部'],ex:'野柳在新北市的北海岸，屬於台灣北部。'}])},
  steps:{run:()=>calc('量鞋印',[{q:'鞋印是 24 公分長。1 公分是 10 毫米，鞋印是幾毫米？',pic:rulerSvg(),a:240,unit:'毫米',hint:'24 × 10 ＝ ？'},{q:'沿著鞋印走過去，怪盜X走了 5 步，每一步大約 40 公分。他一共走了幾公分？',a:200,unit:'公分',hint:'40 × 5 ＝ ？'}])},
  note:{run:()=>cipher('數字密碼紙條',[{n:[12,1,13,16],a:'LAMP',zh:'燈'},{n:[21,16],a:'UP',zh:'上面'}]),
    ev:['密碼紙條','LAMP、UP：怪盜X要偷的，就是「最上面的燈」——頂端的燈！']},
  poster:{run:()=>signs([ALT_SIGNS[0],ALT_SIGNS[1]])},
  /* ---------- Chapter 2: Sun Moon Lake ---------- */
  otter:{run:()=>quiz('和水獺船長說英文',[
      {q:'水獺船長指著藍鵲阿姨問：「Is she a cook?」',say:'Is she a cook?',en:1,pic:`<div style="height:170px">${head(CAST.magpie.look)}</div>`,o:['Yes, she is.','Yes, he is.',"No, I'm not."],ex:'藍鵲阿姨戴著廚師帽，是廚師。問 she（她），所以回答 Yes, she is.'},
      {q:"水獺船長問你：「What's your name?」",say:"What's your name?",en:1,o:['My name is Amy.',"I'm nine.","It's red."],ex:'問名字，要回答 My name is……（我的名字是……）。'},
      {q:'湖邊有三位老師在拍照。船長問：「Are they teachers?」',say:'Are they teachers?',en:1,o:['Yes, they are.','Yes, he is.',"No, she isn't."],ex:'they（他們）是很多人，所以回答 Yes, they are.'}])},
  tape:{run:()=>listenHunt([{id:'snake',s:'It is long. It has no legs.',zh:'牠長長的，沒有腳。'},{id:'swan',s:'It is white. It can swim.',zh:'牠白白的，會游泳。'},{id:'sloth',s:'It is in the tree. It is sleeping.',zh:'牠在樹上，正在睡覺。'},{id:'snail',s:'It is slow. It has a shell.',zh:'牠慢吞吞的，背著一個殼。'}])},
  bottle:{run:()=>quiz('瓶中的英文信',[
      {q:'信上寫：「X has a red hat and big glasses.」怪盜X有什麼？',say:'X has a red hat and big glasses.',o:['紅帽子和大眼鏡','藍帽子和小眼鏡','紅鞋子和大包包'],ex:'red hat 是紅帽子，big glasses 是大眼鏡。'},
      {q:'信上又寫：「I can\'t swim.」是什麼意思？',say:"I can't swim.",o:['我不會游泳','我會游泳','我不想跑步'],ex:"can't 是「不會、不能」，swim 是游泳。"},
      {q:'信的最後寫：「See you at the lake.」lake 是什麼？',say:'See you at the lake.',o:['湖','山','船'],ex:'lake 是湖，日月潭就是一個大湖。'}])},
  lock:{run:()=>hangman([{w:'SWAN',zh:'天鵝（sw 開頭）',emo:'🦢'},{w:'NURSE',zh:'護士（職業單字）',emo:'🧑‍⚕️'},{w:'FARMER',zh:'農夫（職業單字）',emo:'🧑‍🌾'}])},
  magpie:{run:()=>calc('茶葉蛋攤的帳',[{q:'一顆茶葉蛋 15 元，買 7 顆要多少元？',a:105,unit:'元',hint:'15 × 7 ＝ ？'},{q:'鍋子裡有 144 顆蛋，每 8 顆裝一袋，可以裝成幾袋？',a:18,unit:'袋',hint:'144 ÷ 8：先想 14 ÷ 8 商 1 餘 6，再算 64 ÷ 8。'}])},
  moon:{run:async()=>{await seq('月相排序','這次從「滿月」開始，照日期先後把月亮排好。',[{h:moon(2),l:'滿月'},{h:moon(3),l:'下弦月'},{h:moon(0),l:'新月'},{h:moon(1),l:'上弦月'}]);
      await quiz('月亮小測驗',[{q:'滿月大約出現在農曆的哪一天？',pic:`<div style="display:flex;justify-content:center;gap:20px">${moon(2)}</div>`,o:['十五日左右','初一','初八'],ex:'農曆十五左右是滿月，所以中秋節（八月十五）月亮又圓又亮。'}])}},
  gauge:{run:async()=>{await seq('冰塊的變化','冰塊放在太陽下，照順序排出它的變化。',[{l:'冰塊是固態，摸起來冰冰硬硬的'},{l:'冰塊吸收熱，慢慢融化成水'},{l:'水是液態，會到處流動'},{l:'水繼續被太陽照射，蒸發成水蒸氣'}]);
      await quiz('水的三態',[{q:'冬天早上，窗戶玻璃的內側出現許多小水滴，這是什麼現象？',o:['凝結','融化','蒸發'],ex:'屋裡的水蒸氣碰到冰冷的玻璃，凝結成小水滴。'}])}},
  weather:{run:()=>quiz('今天的氣溫折線圖',[
      {q:'16 時（下午 4 點）的溫度是幾度？',pic:chartSvg(),o:['27 度','31 度','25 度'],ex:'找到 16 時，往上對到折線，是 27 度。'},
      {q:'今天什麼時候溫度最低？',pic:chartSvg(),o:['早上 8 點','中午 12 點','下午 4 點'],ex:'折線最低的點在 8 時，只有 22 度。'},
      {q:'從 14 時到 16 時，溫度下降了幾度？',pic:chartSvg(),o:['4 度','2 度','27 度'],ex:'14 時是 31 度，16 時是 27 度，31 − 27 ＝ 4 度。'}])},
  tracks:{run:()=>quiz('動物腳印鑑定',[
      {q:'哪一組腳印的腳趾之間連著一片蹼？',pic:trackSvg(),o:['A','B','C'],ex:'A 的腳趾之間有蹼，是鴨子的腳印。'},
      {q:'狗走路時，腳印常常看得到爪痕，為什麼？',pic:trackSvg(),o:['狗的爪子不能收起來','狗沒有肉墊','狗都用跳的'],ex:'狗的爪子不能像貓一樣收起來，所以腳印常有爪痕。'},
      {q:'鴨子的腳有蹼，對牠有什麼幫助？',o:['方便在水裡划水','方便爬樹','方便挖洞'],ex:'蹼像小船槳，讓鴨子在水裡游得又快又穩。'}])},
  cabin:{run:async()=>{await lens('紫外線手電筒','移動紫色的燈光，照出牆上的隱形字，看清楚再按「我看到了」。',{uv:1,pic:cabinPic(),secret:cabinSecret2});
      await quiz('牆上的隱形字',[{q:'牆上寫：「Look under the big rock.」要去哪裡找鑰匙？',say:'Look under the big rock.',o:['大石頭的下面','大樹的上面','小船的裡面'],ex:'look 是看，under 是「在……下面」，big rock 是大石頭。'}])}},
  shao:{run:()=>quiz('日月潭解說牌',[
      {q:'邵族的獵人，是追著什麼動物發現日月潭的？',pic:passage('傳說很久以前，邵族的獵人在山裡追著一隻白鹿。他們越過一座又一座的山，最後白鹿跳進了一座美麗的大湖。獵人發現湖裡有好多魚，湖邊的土地又肥沃，就帶著族人搬到湖邊住下來。這座湖的北邊圓圓的像太陽，南邊彎彎的像月亮，所以叫做「日月潭」。'),o:['白鹿','黑熊','山豬'],ex:'解說牌說，獵人追著一隻白鹿，發現了日月潭。'},
      {q:'「傳說」的意思最接近哪一個？',o:['很久以來流傳下來的故事','今天的新聞報導','考試的題目'],ex:'傳說是一代一代流傳下來的故事。'},
      {q:'這座湖為什麼叫做「日月潭」？',o:['一邊像太陽，一邊像月亮','白天和晚上都很亮','湖裡有太陽和月亮的石頭'],ex:'湖的北邊像太陽，南邊像月亮，所以叫日月潭。'}])},
  /* ---------- Chapter 3: Anping ---------- */
  deer:{run:()=>calc('古堡的年紀',[{q:'熱蘭遮城在西元 1624 年開始建造，大約花了 10 年才蓋好。大約在西元幾年蓋好？',a:1634,unit:'年',hint:'1624 ＋ 10 ＝ ？'},{q:'城牆上的紅磚，一排有 36 塊，一共疊了 9 排。一共有幾塊紅磚？',a:324,unit:'塊',hint:'36 × 9 ＝ ？'}])},
  turtle:{run:()=>quiz('海龜伯伯的證詞',[
      {q:'他第一次來買蝦捲時，時鐘是這樣。那時候是幾點幾分？',pic:clockSvg(3,25),o:['3 點 25 分','5 點 15 分','3 點 5 分'],ex:'短針在 3 和 4 中間，長針指著 5，5 × 5 ＝ 25，是 3 點 25 分。'},
      {q:'他 3:25 買蝦捲，吃了 40 分鐘後又回來買豆花。那時候是幾點幾分？',o:['4 點 5 分','3 點 65 分','4 點 15 分'],ex:'25 ＋ 40 ＝ 65 分，超過 60 分要進位：65 − 60 ＝ 5，所以是 4 點 5 分。'}])},
  signA:{run:()=>signs([ALT_SIGNS[2],ALT_SIGNS[3]])},
  signB:{run:()=>signs([ALT_SIGNS[4],ALT_SIGNS[5]])},
  chest:{run:()=>chest([{word:'一<u>　</u>大樹',ans:'棵',L:['木','禾','火'],R:['果','早','里'],okL:'木',okR:'果',ex:'木＋果＝棵，一棵樹的「棵」和樹木有關，所以是木字旁！'},
      {word:'一條小<u>　</u>',ans:'河',L:['氵','亻','口'],R:['可','丁','何'],okL:'氵',okR:'可',ex:'氵＋可＝河，河裡有水，所以是三點水！'},
      {word:'打電話<u>　</u>朋友',ans:'給',L:['糹','言','扌'],R:['合','台','今'],okL:'糹',okR:'合',ex:'糹＋合＝給！'},
      {word:'吃<u>　</u>餐',ans:'晚',L:['日','目','月'],R:['免','兔','先'],okL:'日',okR:'免',ex:'日＋免＝晚，晚上和太陽（日）下山有關！'},
      {word:'<u>　</u>足球',ans:'踢',L:['足','扌','口'],R:['易','勿','昜'],okL:'足',okR:'易',ex:'足＋易＝踢，踢球要用腳，所以是足字旁！'}])},
  paper:{run:()=>order([['雖然','偵探多叔','一直追我','但是','我會躲進老街的人群裡'],['等到','天黑以後','我就','換上新衣服','偷偷溜走']])},
  cannon:{intro:[['duo','大砲的砲管被人轉了一個大大的角度。量量看是幾度！']],
    run:()=>quiz('量角器',[
      {q:'砲管轉起來的角度是幾度？（從右邊的 0 開始看）',pic:protSvg(120),o:['120 度','60 度','100 度'],ex:'從右邊的 0 數起，砲管對到 120。'},
      {q:'120 度的角是哪一種角？',o:['鈍角','銳角','直角'],ex:'比 90 度大、比 180 度小的角是鈍角。'},
      {q:'平角是幾度？',o:['180 度','90 度','360 度'],ex:'平角是一直線，180 度；直角是 90 度。'}])},
  bricks:{run:()=>calc('城牆的祕密',[{q:'城牆上每一排的磚塊數是 3、6、12、24、？ 下一排有幾塊？',a:48,unit:'塊',hint:'每一排都是前一排的 2 倍。'},{q:'有一面正方形的城牆，邊長 6 公尺。這面牆的面積是多少平方公尺？',a:36,unit:'平方公尺',hint:'正方形面積 ＝ 邊長 × 邊長'}])},
  tree:{run:()=>quiz('植物觀察',[
      {q:'這種根有一條又粗又長的主根，旁邊長出細細的支根，叫做什麼？',pic:rootSvg('tap'),o:['軸根','鬚根','氣根'],ex:'有一條明顯主根的是軸根，例如蘿蔔、榕樹的小苗。'},
      {q:'1 個節上長 2 片葉子，面對面生長，這種葉序叫做？',o:['對生','互生','輪生'],ex:'一個節長兩片、面對面是對生。'},
      {q:'植物的根有什麼功用？',o:['吸收水分、固定植物','開出花朵','吸收陽光'],ex:'根會吸收水分和養分，還能把植物牢牢固定在土裡。'}])},
  stall:{run:()=>fraction('吃剩的點心',[{q:'一盒蝦捲切成 6 段，怪盜X吃掉了 5/6。點一點，把他吃掉的部分塗起來。',d:6,a:5,shape:'bar'},{q:'一個豆花派平分成 3 份，怪盜X吃掉了 2/3。把吃掉的部分塗起來。',d:3,a:2,shape:'pie'}])},
  pole:{run:()=>quiz('影子時鐘',[
      {q:'早上太陽在東邊，竿子的影子會在哪一邊？',o:['西邊','東邊','北邊'],ex:'影子在太陽的相反方向。太陽在東，影子在西。'},
      {q:'一天之中，什麼時候竿子的影子最短？',o:['中午','早上','傍晚'],ex:'中午太陽最高，影子最短。'},
      {q:'圖中的影子又長又指向東邊，太陽在哪一邊？',pic:shadowSvg(true),o:['西邊','東邊','正上方'],ex:'影子指向東邊，太陽就在相反的西邊，而且很低。'}])},
  compass:{run:()=>quiz('指北針與磁鐵',[
      {q:'指北針藍色的 S 極，會指向哪個方位？',pic:`<div style="display:flex;justify-content:center"><svg viewBox="-60 -60 120 120" width="150" height="150"><circle r="54" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/><path d="M0 -44 L10 0 L-10 0Z" fill="#C86062"/><path d="M0 44 L10 0 L-10 0Z" fill="#2B79B5"/></svg></div>`,o:['南方','北方','西方'],ex:'N 極指北，S 極就指向相反的南方。'},
      {q:'一塊磁鐵的 N 極，靠近另一塊磁鐵的 S 極，會怎麼樣？',pic:magnetSvg(),o:['互相吸引','互相排斥（推開）','沒有反應'],ex:'異極相吸，同極相斥。'},
      {q:'面向北方站好，你的右手邊是哪個方位？',o:['東方','西方','南方'],ex:'面向北方時，右手是東、左手是西、背後是南。'}])}
});
let ALTS_C=null;const ALTS=()=>ALTS_C||(ALTS_C=ALTS_SRC());

/* ================= CHAPTER 1: Taipei 101 ================= */
async function ch1(){
  G.ch=1;save();setCh('第一章　台北101的燈');DUO.coat=true;
  setScene({id:'obs',color:'#2B79B5',bg:bgObs,duo:[440,958,320],ground:()=>958,range:[160,1480],spots:[
    pz('bear',1330,930,{npc:'bear',s:1.1,hint:'先問問電梯前面的熊阿伯，他一直守在那裡。',
      intro:[['bear','偵探先生！我一直守在電梯口。剛剛有個戴著圓圓眼鏡的人，鬼鬼祟祟地走過去。'],['bear','他經過的時候，還抬頭看了一眼牆上的時鐘……']],
      run:()=>quiz('熊阿伯的證詞',[
        {q:'熊阿伯看到可疑的人時，時鐘是這樣。那時候是幾點幾分？',pic:clockSvg(3,45),o:['3 點 45 分','9 點 15 分','4 點 45 分'],ex:'短針在 3 和 4 中間，長針指著 9，就是 3 點 45 分。',hint:'短針看「時」，長針看「分」。長針指著 9，是 45 分。'},
        {q:'那個人 3:45 經過電梯口，4:10 又出現在紀念品店。中間經過了幾分鐘？',o:['25 分鐘','35 分鐘','15 分鐘'],ex:'3:45 到 4:00 是 15 分鐘，4:00 到 4:10 是 10 分鐘，合起來 25 分鐘。',hint:'先算到 4:00 要幾分鐘，再加上後面的 10 分鐘。'}]),
      ev:['熊阿伯的證詞','可疑的人戴著圓圓的眼鏡，3:45 經過電梯口，4:10 到了紀念品店。'],after:'我還是好擔心頂樓的燈啊……'}),
    pz('leo',960,860,{npc:'leo',s:.95,hint:'紀念品店的石虎姐姐好像有話要說。',
      intro:[['leo','歡迎光臨！剛剛有位戴眼鏡的客人，買了 3 個101紀念品，丟下錢就跑了。'],['leo','這是收據，我還沒算清楚……']],
      run:()=>calc('紀念品店的收據',[{q:'一個101紀念品 365 元，客人買了 3 個，一共要多少元？',a:1095,unit:'元',hint:'365 × 3：先算個位 5 × 3 ＝ 15，寫 5 進 1……'},{q:'客人只留下 1000 元就跑走了。他少付了多少元？',a:95,unit:'元',hint:'1095 − 1000 ＝ ？'}]),
      ev:['紀念品店收據','戴眼鏡的客人少付了 95 元就跑走了，非常可疑。'],after:'要不要買一個101小模型？很可愛喔！'}),
    pz('koala',250,960,{npc:'koala',hint:'望遠鏡旁邊的無尾熊先生是外國觀光客，用英文問問看吧。',
      intro:[['koala',"Hello! I'm a tourist. I saw something strange!",{en:1,zh:'哈囉！我是觀光客，我看到奇怪的事！'}]],
      run:()=>quiz('和 Mr. Koala 說英文',[
        {q:'Mr. Koala 指著多叔問：「Is he a police officer?」要怎麼回答？',say:'Is he a police officer?',en:1,pic:`<img src="${FACE}" alt="" style="height:150px;display:block;margin:0 auto;border-radius:50%;border:4px solid ${INK};background:#D4BB49">`,o:["No, he isn't.","Yes, she is.","No, they aren't."],ex:"he 是「他」，只有一個人，所以用 No, he isn't.（不，他不是。）多叔是偵探喔！"},
        {q:'Mr. Koala 指著石虎姐姐問：「What does she do?」',say:'What does she do?',en:1,pic:`<div style="height:170px">${head(CAST.leo.look)}</div>`,o:["She's a shopkeeper.","She's a pilot.","He's a doctor."],ex:'石虎姐姐在紀念品店工作，她是 shopkeeper（店員）。'},
        {q:'Mr. Koala 說：「He wears glasses.」這句話是什麼意思？',say:'He wears glasses.',o:['他戴著眼鏡','他戴著帽子','他穿著外套'],ex:'glasses 是眼鏡，wear 是穿、戴的意思。'}]),
      ev:['Mr. Koala 的證詞','He wears glasses. 外國觀光客也看到可疑的人戴著眼鏡。'],after:"Taipei 101 is so tall! I love Taiwan!"}),
    pz('panel',1220,520,{r:55,hint:'電梯面板上有一個數字密碼鎖。',art:()=>`<g transform="translate(1220 520)"><rect x="-34" y="-50" width="68" height="100" rx="10" fill="#2E384F"/><circle cy="-22" r="16" fill="#7E5FA3"/><text y="-15" text-anchor="middle" font-size="20" font-weight="900" fill="#fff" font-family="Fredoka">X</text><rect x="-20" y="8" width="40" height="30" rx="5" fill="#D4BB49"/></g>`,
      intro:[['duo','電梯被怪盜X鎖住了！要解開三道乘法密碼，電梯才會動。']],
      run:()=>mathLock([{a:365,b:3,q:'第一道密碼：365 × 3'},{a:308,b:5,q:'第二道密碼：怪盜X有 5 箱燈泡，每箱 308 顆。一共有幾顆？'},{a:508,b:2,q:'第三道密碼：台北101 高 508 公尺。2 倍高是幾公尺？'}]),
      ev:['電梯密碼鎖','三道密碼都解開了，電梯可以通往頂樓！']}),
    pz('damper',390,560,{r:150,sy:150,hint:'那顆大金球是什麼？過去看看。',
      intro:[['duo','這是101的「風阻尼器」，重達 660 公噸，就像一個巨大的擺錘。'],['duo','旁邊有三個擺錘玩具……我們來做個實驗！']],
      run:()=>quiz('擺錘實驗',[
        {q:'三個擺錘一起擺動，哪一個擺得最慢（來回一次最久）？',pic:pendSvg(),o:['C','A','B','三個一樣快'],ex:'擺長越長，擺動越慢。C 的繩子最長，所以最慢。',hint:'仔細看動畫，哪一個來回一次花最久的時間？'},
        {q:'擺長不變，把擺錘換成比較重的，擺動的快慢會怎樣？',o:['幾乎不變','變快很多','變慢很多'],ex:'擺動的快慢主要跟擺長有關，跟擺錘的輕重關係不大。'},
        {q:'颱風來的時候，風阻尼器可以幫101做什麼？',o:['減少大樓的搖晃','讓大樓轉圈圈','讓電梯變快'],ex:'大樓被風吹動時，風阻尼器會往反方向擺動，讓大樓的搖晃變小。'}]),
      ev:['欄杆上的刮痕','風阻尼器的欄杆上有新的刮痕，有人爬上去過！']}),
    pz('scope',120,650,{r:70,hint:'望遠鏡旁邊貼著一張地圖。',
      intro:[['duo','望遠鏡旁貼著一張台灣地圖，上面畫了好幾個圈圈……是怪盜X的路線嗎？']],
      run:()=>quiz('地圖上的方位',[
        {q:'一般的地圖，上方是哪一個方位？',pic:compassMap(),o:['北方','南方','東方'],ex:'一般地圖是「上北、下南、左西、右東」。'},
        {q:'從台北101出發，往哪個方向走，可以到台灣最南端的墾丁？',pic:compassMap(),o:['南方','北方','西方'],ex:'墾丁在台灣最南端，在台北的南方。'},
        {q:'澎湖在台灣本島的哪一邊？',pic:compassMap(),o:['西邊','東邊','北邊'],ex:'澎湖在台灣海峽中間，在本島的西邊。'},
        {q:'太魯閣在日月潭的哪一邊？',pic:compassMap(),o:['東邊','西邊','南邊'],ex:'太魯閣在花蓮，靠近太平洋，在日月潭的東邊。'}]),
      ev:['畫了圈的地圖','怪盜X在日月潭和台南畫了圈圈，可能是他接下來的目標！']}),
    pz('steps',870,955,{r:55,sy:40,hint:'地板上有一個鞋印！',art:()=>shoeArt(870,955),
      intro:[['duo','地上有一個沾到灰塵的鞋印。拿尺來量量看！']],
      run:()=>calc('量鞋印',[{q:'把尺放在鞋印旁邊。鞋印有幾公分長？',pic:rulerSvg(),a:24,unit:'公分',hint:'看鞋印最右邊的紅色虛線，對到尺上的哪個數字。'},{q:'熊阿伯的鞋子是 30 公分。鞋印比熊阿伯的鞋子短幾公分？',a:6,unit:'公分',hint:'30 − 24 ＝ ？'}]),
      ev:['24 公分的鞋印','鞋印只有 24 公分，不是熊阿伯的。犯人的腳比較小。']}),
    pz('glass',1020,300,{r:50,hint:'玻璃窗上好像有指紋。',art:()=>smudgeArt(1020,300),
      intro:[['duo','玻璃上留著一枚清楚的指紋。我們來比對指紋資料庫！']],
      run:()=>fingerprint(2),ev:['玻璃上的指紋','指紋和資料庫裡的「怪盜X」完全一樣！']}),
    pz('shelf',870,470,{r:60,sy:40,hint:'紀念品店的櫃子後面黑漆漆的……',
      intro:[['leo','店裡櫃子後面的燈壞了，黑漆漆的。'],['duo','用手電筒照照看，說不定藏著東西。']],
      run:()=>lens('手電筒搜查','在黑暗的櫃子裡移動手電筒，找到 3 樣可疑的東西就點它！',{pic:shelfPic(),targets:[{x:150,y:330,r:60,l:'眼鏡盒'},{x:430,y:180,r:55,l:'X 的卡片'},{x:660,y:368,r:60,l:'頂樓鑰匙'}]}),
      ev:['櫃子裡的東西','眼鏡盒、X 的卡片，還有一把頂樓的鑰匙複製品！']}),
    pz('lamp',650,120,{r:60,sx:70,sy:-20,hint:'天花板的燈不亮了。',
      intro:[['duo','觀景台的燈被拔掉電線了！先把電路接好。']],
      run:()=>circuit(),ev:['被剪斷的電線','電線是被剪斷的。怪盜X想讓觀景台變暗，趁機偷東西。']}),
    pz('note',600,790,{r:55,sy:50,hint:'長椅上有一張寫滿數字的紙條。',art:()=>noteArt(600,790),
      intro:[['duo','長椅上有一張紙條，寫著一串數字……這是密碼！']],
      run:()=>cipher('數字密碼紙條',[{n:[12,9,7,8,20],a:'LIGHT',zh:'燈'},{n:[20,15,16],a:'TOP',zh:'頂端'}]),
      ev:['密碼紙條','LIGHT、TOP：怪盜X要偷的，就是「頂端的燈」！']}),
    pz('poster',1190,800,{r:60,sy:90,hint:'紀念品店旁邊的告示牌，字好像怪怪的。',art:()=>boardArt(1190,800,'告示牌'),
      intro:[['duo','這兩張告示上的字被人偷偷改過了。找出錯字！']],
      run:()=>signs([{s:'觀景台內請勿奔泡。',w:7,ok:'跑',o:['抱','跑','泡'],ex:'「跑」要用腳，所以是足字旁；「泡」和水有關，是三點水。'},{s:'請排隊搭成電梯，不要推擠。',w:4,ok:'乘',o:['乘','城','程'],ex:'坐交通工具要用「乘」，例如搭乘、乘客。'}]),
      ev:['被改過的告示','錯字是用紅筆改的，筆跡和預告信一模一樣。']}),
    {id:'pango',type:'npc',x:770,y:780,s:.6,quest:true,tap:async sp=>{
      if(sp.qdone){await say('pango','我的氣球回來了！謝謝你！');return}
      if(!sp.asked){await say('pango','嗚嗚……我的氣球飛走了，卡在天花板上面……');await say('duo','{n}，你眼力好，幫小朋友找找看吧。',{e:'worry'});sp.asked=true;spot('balloon').hidden=false;return}
      await say('pango','氣球就在天花板上面……');}},
    {id:'balloon',type:'thing',x:1080,y:110,r:60,hidden:true,art:()=>`<g transform="translate(1080 110)"><ellipse rx="40" ry="48" fill="#C86062" stroke="#2E384F" stroke-width="5"/><path d="M0 48 q10 30 -6 60" stroke="#2E384F" stroke-width="3" fill="none"/></g>`,
     tap:async sp=>{sp.hidden=true;spot('pango').qdone=true;CAST.pango.look.mood=null;if(!G.quests.includes('balloon'))G.quests.push('balloon');save();drawSpots();sWin();
       await say('pango','哇！是我的氣球！謝謝你，偵探助手！');toast('完成幫忙任務！')}},
    {id:'b1',type:'badge',bid:'c1a',x:1565,y:640},{id:'b2',type:'badge',bid:'c1b',x:60,y:480},{id:'b3',type:'badge',bid:'c1c',x:1300,y:150}
  ]});
  await chapterCard('第一章','台北101的燈','89 樓觀景台');
  await caseCard(1,'守護101頂端的燈','在怪盜X動手之前，找齊 12 張證物卡，查出他的變裝和目標。','台北市・台北101');
    await say('bear','偵探先生！你終於來了！我是這裡的保全，大家都叫我熊阿伯。');
  await say('bear','怪盜X把通往頂樓的電梯鎖住了，觀景台的燈也被弄壞了！');
  await say('duo','別緊張，熊阿伯。{n}，這次的現場有 12 個破案關卡。');
  await say('duo','點人物可以問話，點有放大鏡的地方可以調查。每破一關，就能拿到一張證物卡。',{e:'point'});
  await say('duo','不知道下一步做什麼，就點我一下。還有，現場藏著三個骨頭徽章，眼睛要放亮喔！',{e:'cheeky'});
  hideDlg();
  await investigate('調查101觀景台');
  await say('duo','12 張證物卡都到手了！{n}，我們來推理吧！',{e:'confident'});
  hideDlg();await clueBoard(true);
  await ask('duo','熊阿伯和 Mr. Koala 都看到的可疑人物，有什麼特徵？',['戴著眼鏡','穿著紅色雨衣','拿著雨傘'],0,{scored:1});
  await ask('duo','鞋印、指紋、密碼紙條……怪盜X這次的目標是什麼？',['101頂端的燈','紀念品店的錢','風阻尼器'],0,{scored:1,wrong:ALT()?'想想密碼紙條：LAMP、UP。':'想想密碼紙條：LIGHT、TOP。'});
  await say('duo','沒錯！戴眼鏡的人就是怪盜X變裝的。快上頂樓！',{e:'point'});
  await say('bear','糟了！電梯又被他弄壞了，只能走樓梯！');
  await say('duo','{n}，我們從走廊和樓梯追上去！',{e:'run'});
  hideDlg();await mazeChase();
  await say('sys','砰！多叔推開頂樓的門——');
  const xg=await actorIn('x',X_LOOK,1000,620,1.3);
  await say('x','呵呵呵～被你們找到啦，偵探多叔！');
  hideDlg();await finisher('線索全部連起來了——戴眼鏡的人，就是你，怪盜X！');
  await say('duo','快把燈還來！',{e:'angry'});
  await say('x','這盞燈……太重了，我搬不動，送你們吧！下一個寶物，你們一定保護不了！');
  setDuo('shock');hideDlg();await actorOut(xg,300,-800);
  await say('sys','怪盜X跳上熱氣球，咻——地飛走了，地上只留下一封信。');
  hideDlg();await chapterResult(1,'台北101的燈');await letter(1);
  await say('duo','一半像太陽，一半像月亮的湖……{n}，在地圖上找找看！',{e:'think'});
  hideDlg();await mapPick('sml',1);
  await say('duo','就是日月潭！它是台灣最大的天然湖泊。出發！',{e:'point'});
  hideDlg();await travel('t101','sml');
}

/* ================= CHAPTER 2: Sun Moon Lake ================= */
async function ch2(){
  G.ch=2;save();setCh('第二章　日月潭的遊船');DUO.coat=true;
  setScene({id:'lake',color:'#599EC4',bg:bgLake,duo:[600,712,300],ground:()=>712,range:[90,930],spots:[
    pz('otter',880,700,{npc:'otter',hint:'先跟碼頭上的水獺船長說說話。',
      intro:[['otter','偵探先生！我的遊船「日月號」被一個英文密碼鎖鎖住了！'],['otter',"I'm a captain. Let's talk in English!",{en:1,zh:'我是船長，我們用英文聊聊吧！'}]],
      run:()=>quiz('和水獺船長說英文',[
        {q:'水獺船長指著藍鵲阿姨問：「What does she do?」',say:'What does she do?',en:1,pic:`<div style="height:170px">${head(CAST.magpie.look)}</div>`,o:["She's a cook.","She's a pilot.","They're nurses."],ex:'藍鵲阿姨戴著廚師帽，她是 cook（廚師）。'},
        {q:'水獺船長問你：「Are you a student?」',say:'Are you a student?',en:1,o:['Yes, I am.','Yes, he is.',"No, they aren't."],ex:'問的是 you（你），所以用 I am 回答。'},
        {q:'湖上有兩位開飛機的人。船長問：「What do they do?」',say:'What do they do?',en:1,o:["They're pilots.","He's a pilot.","She's a cook."],ex:"they（他們）是兩個人以上，所以說 They're pilots."}]),
      ev:['船長的證詞','早上有個戴紅帽子的人在船邊走來走去，一直問船什麼時候開。'],after:"I'm a captain. I love my boat!"}),
    pz('tape',470,660,{r:55,sx:40,hint:'木箱上的錄音機在閃，按下去聽聽看！',art:()=>`<g transform="translate(470 660)"><rect x="-60" y="-10" width="120" height="40" fill="#BB9A7A" stroke="#2E384F" stroke-width="5"/><rect x="-42" y="-50" width="84" height="44" rx="8" fill="#55586F" stroke="#2E384F" stroke-width="4"/><circle cx="-18" cy="-28" r="10" fill="#92C3DB"/><circle cx="18" cy="-28" r="10" fill="#92C3DB"/><circle cx="0" cy="-58" r="10" fill="#7E5FA3"/></g>`,
      intro:[['tape','Hello, detective! Can you find them?',{en:1,zh:'哈囉，偵探！你找得到牠們嗎？'}],['duo','是怪盜X的錄音！仔細聽英文，再到畫面上點出來。',{e:'gasp'}]],
      run:()=>listenHunt(['swan','snail','snake','sloth']),ev:['怪盜X的錄音','錄音最後說：「The boat is mine!」（船是我的！）']}),
    pz('bottle',760,900,{r:55,hint:'湖面上好像漂著一個瓶子……',art:()=>`<g transform="translate(760 900) rotate(-20)"><rect x="-40" y="-16" width="70" height="32" rx="14" fill="#CDE9DF" stroke="#2E384F" stroke-width="4"/><rect x="28" y="-8" width="20" height="16" rx="3" fill="#CDE9DF" stroke="#2E384F" stroke-width="4"/><rect x="-24" y="-8" width="40" height="16" fill="#FFFFFF"/></g>`,
      intro:[['duo','瓶子裡有一張英文信。我們來讀讀看！']],
      run:()=>quiz('瓶中的英文信',[
        {q:'信上寫：「X is not a pilot. He wears a red hat.」怪盜X戴什麼顏色的帽子？',say:'X is not a pilot. He wears a red hat.',o:['紅色','藍色','黃色'],ex:'red 是紅色。'},
        {q:'「X is not a pilot.」是什麼意思？',say:'X is not a pilot.',o:['X 不是飛行員','X 是飛行員','X 是廚師'],ex:'not 是「不是」，pilot 是飛行員。'},
        {q:'信的最後寫：「I like snails.」snail 是哪一種動物？',say:'I like snails.',o:['蝸牛','蛇','天鵝'],ex:'sn 開頭的 snail 是蝸牛；snake 才是蛇。'}]),
      ev:['瓶中信','He wears a red hat. 怪盜X戴著紅色的帽子！']}),
    pz('lock',1240,680,{r:60,hint:'日月號上的英文鎖要打開。',art:()=>`<g transform="translate(1240 680)"><path d="M-22 -10 v-20 a22 22 0 0 1 44 0 v20" fill="none" stroke="#2E384F" stroke-width="8"/><rect x="-32" y="-12" width="64" height="52" rx="8" fill="#D4BB49" stroke="#2E384F" stroke-width="5"/><text y="24" text-anchor="middle" font-family="Fredoka" font-size="26" font-weight="700" fill="#2E384F">ABC</text></g>`,
      intro:[['duo','鎖上有好幾個空格，要拼出三個英文單字才能打開。']],
      run:()=>hangman([{w:'SNAIL',zh:'蝸牛（sn 開頭）',emo:'🐌'},{w:'PILOT',zh:'飛行員（職業單字）',emo:'✈️'},{w:'DOCTOR',zh:'醫生（職業單字）',emo:'🧑‍⚕️'}]),
      ev:['英文密碼鎖','日月號的鎖打開了！可是船上的方向盤不見了。']}),
    pz('magpie',360,690,{npc:'magpie',s:.9,hint:'茶葉蛋攤的藍鵲阿姨看起來很忙。',
      intro:[['magpie','唉呀，偵探先生！要不要吃茶葉蛋？今天生意好到我都算不過來了。']],
      run:()=>calc('茶葉蛋攤的帳',[{q:'一顆茶葉蛋 12 元，買 8 顆要多少元？',a:96,unit:'元',hint:'12 × 8 ＝ ？'},{q:'鍋子裡有 156 顆蛋，每 6 顆裝一盒，可以裝成幾盒？',a:26,unit:'盒',hint:'156 ÷ 6：先想 15 ÷ 6 商 2 餘 3，再算 36 ÷ 6。'}]),
      ev:['藍鵲阿姨的證詞','戴紅帽子的人一次買了 6 顆蛋，邊吃邊往船那邊走。'],
      after:async sp=>{if(sp.qdone){await say('magpie','茶葉蛋都找回來了，送你們一顆！');return}
        if(!sp.asked){await say('magpie','剛剛有人撞到我的攤子，三顆茶葉蛋滾得到處都是！能幫我找回來嗎？');sp.quest=true;sp.asked=true;['e1','e2','e3'].forEach(i=>spot(i).hidden=false);drawSpots();return}
        await say('magpie',`還差 ${3-(sp.eggs||0)} 顆蛋……`)}}),
    {id:'e1',type:'thing',x:820,y:735,r:40,hidden:true,art:()=>`<ellipse cx="820" cy="735" rx="18" ry="22" fill="#AA8B70" stroke="#2E384F" stroke-width="3"/>`,tap:async sp=>egg(sp)},
    {id:'e2',type:'thing',x:240,y:770,r:40,hidden:true,art:()=>`<ellipse cx="240" cy="770" rx="18" ry="22" fill="#AA8B70" stroke="#2E384F" stroke-width="3"/>`,tap:async sp=>egg(sp)},
    {id:'e3',type:'thing',x:1390,y:800,r:40,hidden:true,art:()=>`<ellipse cx="1390" cy="800" rx="18" ry="22" fill="#AA8B70" stroke="#2E384F" stroke-width="3"/>`,tap:async sp=>egg(sp)},
    pz('moon',560,110,{r:55,hint:'白天的天空上，竟然看得到月亮！',art:()=>moonArt(560,110),
      intro:[['duo','白天也看得到月亮呢。咦，怪盜X在碼頭留下了四張月亮照片……']],
      run:async()=>{await seq('月相排序','照日期先後，把月亮的樣子排好（從農曆初一開始）。',[{h:moon(0),l:'新月'},{h:moon(1),l:'上弦月'},{h:moon(2),l:'滿月'},{h:moon(3),l:'下弦月'}]);
        await quiz('月亮小測驗',[{q:'在台灣看到的上弦月，是哪一邊亮？',pic:`<div style="display:flex;justify-content:center;gap:20px">${moon(1)}</div>`,o:['右半邊','左半邊','整個都亮'],ex:'上弦月右半邊亮；下弦月左半邊亮。'}])},
      ev:['怪盜X的日記','日記寫著：「滿月的晚上，我要把船開走。」']}),
    pz('gauge',1000,900,{r:60,sy:170,hint:'湖裡的水位尺，好像比平常低了。',art:()=>gaugeArt(1000,900),
      intro:[['otter','奇怪，最近湖水好像變少了，可是昨晚明明下過雨……'],['duo','這跟水的旅行有關。我們來排排看！']],
      run:async()=>{await seq('水的旅行','照順序排出湖水的循環。',[{l:'太陽照射，湖水蒸發成水蒸氣'},{l:'水蒸氣上升，遇冷凝結成小水滴，變成雲'},{l:'雲裡的小水滴越來越大，變成雨落下'},{l:'雨水流回湖裡'}]);
        await quiz('水的三態',[{q:'湖水蒸發變成水蒸氣，是從哪一種狀態變成哪一種狀態？',o:['液態 → 氣態','固態 → 液態','氣態 → 液態'],ex:'水是液態，水蒸氣是氣態。'}])},
      ev:['泥地上的腳印','昨晚下過雨，湖邊泥地很軟，留下了清楚的腳印。']}),
    pz('weather',105,560,{r:60,sy:80,hint:'湖邊的天氣看板寫著今天的溫度。',art:()=>boardArt(105,560,'天氣','#FFFFFF'),
      intro:[['duo','船屋的管理員說，最熱的時候大家都去休息了。看看天氣圖！']],
      run:()=>quiz('今天的氣溫折線圖',[
        {q:'今天幾點最熱？',pic:chartSvg(),o:['下午 2 點（14 時）','早上 8 點','下午 4 點（16 時）'],ex:'折線最高的點在 14 時，是 31 度。'},
        {q:'從 8 時到 12 時，溫度上升了幾度？',pic:chartSvg(),o:['7 度','29 度','4 度'],ex:'8 時是 22 度，12 時是 29 度，29 − 22 ＝ 7 度。'}]),
      ev:['無人看守的時間','下午 2 點最熱的時候，船邊沒有人看守，怪盜X就是那時候上船的！']}),
    pz('tracks',330,730,{r:55,sy:40,hint:'碼頭上有一串奇怪的腳印。',art:()=>tracksArt(330,730),
      intro:[['duo','碼頭上的腳印一路走到船邊。是誰留下的呢？']],
      run:()=>quiz('動物腳印鑑定',[
        {q:'哪一組腳印有尖尖的爪痕，像是狐狸或狗留下的？',pic:trackSvg(),o:['C','A','B'],ex:'C 的每個腳趾前面都有爪痕，是狐狸或狗這類動物的腳印。'},
        {q:'B 是貓的腳印。貓走路時通常看不到爪痕，為什麼？',pic:trackSvg(),o:['貓會把爪子收起來','貓沒有爪子','貓都用跳的'],ex:'貓走路時會把爪子收起來，所以腳印通常沒有爪痕。'},
        {q:'A 的腳趾之間連著一片蹼，最可能是誰的腳印？',pic:trackSvg(),o:['鴨子','貓','狐狸'],ex:'鴨子的腳有蹼，方便划水。'}]),
      ev:['狐狸的腳印','有爪痕的腳印一路走到船邊——怪盜X會不會是一隻狐狸？']}),
    pz('crate',990,660,{r:55,hint:'碼頭邊的木箱上，夾著撕碎的照片。',art:()=>crateArt(990,660),
      intro:[['duo','木箱上夾著一張被撕碎的照片。把它拼回來！']],
      run:()=>tiles('拼回撕碎的照片',boatPhoto()),ev:['撕碎的照片','照片裡，一個戴紅帽子、戴眼鏡、背著圓包包的人正在偷看日月號！']}),
    pz('cabin',1150,560,{r:50,sy:40,hint:'船艙的牆上好像寫了什麼，但是看不見。',
      intro:[['duo','船艙牆上好像有隱形墨水。用紫外線手電筒照照看！']],
      run:async()=>{await lens('紫外線手電筒','移動紫色的燈光，照出牆上的隱形字，看清楚再按「我看到了」。',{uv:1,pic:cabinPic(),secret:cabinSecret});
        await quiz('牆上的隱形字',[{q:'牆上寫：「The key is under the rock.」方向盤的鑰匙在哪裡？',say:'The key is under the rock.',o:['石頭下面','船底下','樹上面'],ex:'under 是「在……下面」，rock 是石頭。'}])},
      ev:['石頭下的鑰匙','在湖邊石頭下面，找到日月號方向盤的鑰匙！']}),
    pz('shao',1060,420,{r:60,sy:80,hint:'湖邊的解說牌，介紹日月潭的故事。',art:()=>boardArt(1060,420,'解說牌','#FFFFFF'),
      intro:[['duo','這塊解說牌在介紹日月潭和邵族，我們讀讀看。']],
      run:()=>quiz('日月潭解說牌',[
        {q:'湖中央的小島叫什麼名字？',pic:passage('日月潭是台灣最大的天然湖泊。湖中央有一座小島，叫做「拉魯島」，是邵族心中的聖地。邵族人很早以前就住在日月潭邊，他們會用竹子做成「浮嶼」，浮在湖面上種植物、捕魚。'),o:['拉魯島','龜山島','綠島'],ex:'解說牌說，湖中央的小島叫「拉魯島」。'},
        {q:'「聖地」的意思最接近哪一個？',o:['神聖、重要的地方','很熱鬧的地方','很危險的地方'],ex:'聖地是大家心中神聖、重要的地方。'},
        {q:'這段文字主要在介紹什麼？',o:['日月潭和邵族','台北101','台灣的夜市'],ex:'整段都在說日月潭和住在這裡的邵族。'}]),
      ev:['拉魯島','怪盜X的地圖上，在拉魯島旁邊畫了一個圈：他想把船開去那裡！']}),
    {id:'swan',type:'thing',x:1300,y:440,r:60,art:()=>`<g transform="translate(1300 440)"><ellipse cx="0" cy="20" rx="60" ry="26" fill="#FFFFFF" stroke="#2E384F" stroke-width="5"/><path d="M30 10 Q60 -60 20 -70 Q0 -70 6 -50" fill="none" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/><path d="M30 10 Q60 -60 20 -70 Q0 -70 6 -50" fill="none" stroke="#2E384F" stroke-width="3"/><path d="M4 -52 l-14 6 l12 4z" fill="#D29841"/></g>`,tap:async()=>{await say('duo','一艘可愛的天鵝船。')}},
    {id:'snail',type:'thing',x:1490,y:770,r:50,art:()=>`<g transform="translate(1490 770)"><path d="M-30 14 h56 q10 0 10 -10" fill="#E9CFB8" stroke="#2E384F" stroke-width="4"/><circle cx="-4" cy="-6" r="20" fill="#BB9A7A" stroke="#2E384F" stroke-width="4"/><path d="M28 6 l6 -18 M34 6 l10 -14" stroke="#2E384F" stroke-width="3"/></g>`,tap:async()=>{await say('duo','石頭上有一隻慢慢爬的小蝸牛。')}},
    {id:'snake',type:'thing',x:150,y:690,r:55,art:()=>`<g transform="translate(150 690)"><path d="M-50 20 q20 -30 40 0 t40 0 q14 -18 26 -26" fill="none" stroke="#76A960" stroke-width="16" stroke-linecap="round"/><circle cx="58" cy="-8" r="13" fill="#76A960"/><circle cx="62" cy="-11" r="3" fill="#2E384F"/></g>`,tap:async()=>{await say('duo','草叢裡有一條小蛇。牠很害羞，不要嚇牠。')}},
    {id:'sloth',type:'thing',x:280,y:300,r:60,art:()=>`<g transform="translate(280 300)"><ellipse cx="0" cy="10" rx="30" ry="36" fill="#B2A191" stroke="#2E384F" stroke-width="4"/><circle cx="0" cy="-26" r="24" fill="#D4C6B6" stroke="#2E384F" stroke-width="4"/><ellipse cx="-9" cy="-26" rx="8" ry="5" fill="#6E5D50"/><ellipse cx="9" cy="-26" rx="8" ry="5" fill="#6E5D50"/><path d="M-26 -10 L-30 -50 M26 -10 L30 -50" stroke="#B2A191" stroke-width="10" stroke-linecap="round"/></g>`,tap:async()=>{await say('duo','樹上掛著一隻樹懶，牠在睡午覺呢。')}},
    {id:'b1',type:'badge',bid:'c2a',x:330,y:850},{id:'b2',type:'badge',bid:'c2b',x:1540,y:660},{id:'b3',type:'badge',bid:'c2c',x:880,y:330}
  ]});
  await chapterCard('第二章','日月潭的遊船','南投縣・日月潭碼頭');
  await caseCard(2,'保護遊船「日月號」','找出偷偷上船的人，打開英文密碼鎖，讓日月號平安出航。','南投縣・日月潭');
  await say('duo','好美的湖……{n}，你看，湖的一邊圓圓的像太陽，另一邊彎彎的像月亮。',{e:'welcome'});
  await say('otter','偵探先生！這邊這邊！出大事了！');
  await say('duo','{n}，這裡也有 12 個破案關卡。記得，卡住了就點我。',{e:'point'});
  hideDlg();
  await investigate('調查日月潭碼頭');
  await say('duo','12 張證物卡都到手了。{n}，推理時間到！',{e:'confident'});
  hideDlg();await clueBoard(true);
  await ask('duo','瓶中信和照片都說，怪盜X戴著什麼？',['紅色的帽子','藍色的帽子','黃色的雨衣'],0,{scored:1,grid:1});
  await ask('duo','船邊的腳印有爪痕。怪盜X最可能是哪一種動物？',['狐狸','貓','鴨子'],0,{scored:1,wrong:'有爪痕的是 C 組腳印。'});
  await ask('duo','根據天氣圖，怪盜X是幾點趁沒人看守時上船的？',['下午 2 點','早上 8 點','晚上 10 點'],0,{scored:1});
  await say('duo','完全正確！怪盜X：戴眼鏡、戴紅帽子，而且是一隻狐狸！',{e:'victory'});
  await say('otter','你們看！碼頭那邊有個戴紅帽子的人，正往船那邊走！');
  await say('duo','是他！{n}，我們偷偷跟上去，千萬別被發現。',{e:'hmm'});
  hideDlg();await tailGame();
  const xg=await actorIn('x',X_LOOK,1400,520,1);
  hideDlg();await finisher('紅帽子、眼鏡、狐狸的腳印——怪盜X，你逃不掉了！');
  await say('x','哇！連英文密碼都難不倒你們！這艘船太難開了，我暈船……還給你們吧～');
  await say('x','最後一個寶物，在台灣最古老的城市！這次我一定成功！');
  setDuo('shock');hideDlg();await actorOut(xg,200,-700);
  await say('otter','鑰匙找回來了！日月號又可以出航了！謝謝你們！');
  hideDlg();await chapterResult(2,'日月潭的遊船');
  await say('duo','他又丟下一封信……{n}，打開看看。',{e:'oops'});
  hideDlg();await letter(2);
  await say('duo','荷蘭人建造的古堡，在台灣最古老的城市……在地圖上找找看！',{e:'think'});
  hideDlg();await mapPick('anping',2);
  await say('duo','就是台南的安平古堡！這次一定要抓到他！',{e:'angry'});
  hideDlg();await travel('sml','anping');
}
async function egg(sp){sp.hidden=true;const m=spot('magpie');m.eggs=(m.eggs||0)+1;sWin();toast(`找到茶葉蛋 ${m.eggs}/3`);drawSpots();
  if(m.eggs>=3){m.qdone=true;if(!G.quests.includes('eggs'))G.quests.push('eggs');save();await say('magpie','三顆茶葉蛋都找回來了！你真是細心的小偵探！');toast('完成幫忙任務！')}}
function listenHunt(list){
  return new Promise(res=>{
    let k=0,shown=false;
    const bar=document.createElement('div');bar.className='taskpill';bar.style.cssText='left:50%;transform:translateX(-50%);top:12px;display:flex;gap:10px;align-items:center;z-index:12;font-size:20px';
    $('#stage').appendChild(bar);$('#taskPill').hidden=true;
    const idOf=x=>typeof x==='string'?x:x.id,sentence=()=>typeof list[k]==='string'?`Find the ${list[k]}.`:list[k].s,zhOf=()=>typeof list[k]==='string'?'':`（${list[k].zh}）`;
    function ui(){bar.innerHTML=`<span>聽英文，點出來（${k+1}/${list.length}）</span><button class="tool" id="lhP">再聽一次</button><button class="tool" id="lhT">${shown?sentence()+zhOf():'看英文'}</button>`;
      bar.querySelector('#lhP').onclick=()=>speak(sentence(),'en-US');bar.querySelector('#lhT').onclick=()=>{shown=true;ui()};speak(sentence(),'en-US')}
    ui();
    SC.mode=(id)=>{
      if(id===idOf(list[k])){sGood();const sp=spot(id);$('#fxL').innerHTML+=`<circle cx="${sp.x}" cy="${sp.y-10}" r="70" fill="none" stroke="#50A260" stroke-width="10"/>`;speak(`${id}!`,'en-US');k++;shown=false;
        if(k>=list.length){SC.mode=null;bar.remove();setTimeout(()=>{$('#fxL').innerHTML='';res()},900)}else setTimeout(ui,900)}
      else{sBad();const nm={swan:'天鵝 swan',snail:'蝸牛 snail',snake:'蛇 snake',sloth:'樹懶 sloth'}[id];toast(nm?`這是 ${nm}，再聽一次！`:'不是這個，再聽一次！');if(nm)speak(id,'en-US')}
    };
  });
}

/* ================= CHAPTER 3: Anping ================= */
const SIGNS=[
 {s:'歡迎參歡安平古堡，請排隊入場。',w:3,ok:'觀',o:['勸','觀','灌'],ex:'「參觀」是到現場去看，所以用有「見」的「觀」；「歡迎」的「歡」，右邊是「欠」。'},
 {s:'古堡的城牆很高，請不要在上面玩求。',w:15,ok:'球',o:['球','救','秋'],ex:'玩「球」的球有王字旁；請「求」的求沒有偏旁。'},
 {s:'只要大家一起怒力，就能抓到怪盜X！',w:6,ok:'努',o:['奴','如','努'],ex:'「努力」的努，下面是「力」；生氣的「怒」，下面是「心」。這句用了「只要……就……」。'},
 {s:'由於怪盜X壓倦了逃跑，因此躲進人群。',w:5,ok:'厭',o:['燕','厭','晏'],ex:'「厭倦」用「厭」；「氣壓」的「壓」下面多了「土」。這句用了「由於……，因此……」。'}
];
async function ch3(){
  G.ch=3;save();setCh('第三章　安平古堡的寶箱');DUO.coat=true;
  setScene({id:'fort',color:'#92C3DB',bg:bgFort,duo:[960,975,290],ground:()=>975,range:[130,1500],spots:[
    pz('deer',650,980,{npc:'deer',s:.9,hint:'先問問導覽員梅花鹿姐姐發生了什麼事。',
      intro:[['deer','歡迎來到安平古堡！這座城堡以前叫「熱蘭遮城」，是荷蘭人蓋的。'],['deer','可是今天早上，告示牌被亂改，古堡的寶箱也被鎖起來了！']],
      run:()=>calc('古堡的年紀',[{q:'熱蘭遮城大約在西元 1624 年開始建造。到 2026 年，大約過了幾年？',a:402,unit:'年',hint:'2026 − 1624 ＝ ？'},{q:'一個世紀是 100 年。402 年是幾個「完整的」世紀？',a:4,unit:'個',hint:'402 裡面有幾個 100？'}]),
      ev:['導覽員的證詞','告示牌被亂改、寶箱被鎖住——怪盜X想先把大家搞糊塗，再趁亂偷寶物。'],after:'安平古堡的紅磚城牆，已經有四百年的歷史了喔！'}),
    pz('turtle',1250,960,{npc:'turtle',s:.9,hint:'蝦捲攤的海龜伯伯好像看到了什麼。',
      intro:[['turtle','少年仔，要不要來一條蝦捲？……喔，你們是偵探啊？'],['turtle','剛剛有個人一口氣買了三條蝦捲，全部塞進他「圓圓的包包」裡，後來又回來買豆花。']],
      run:()=>quiz('海龜伯伯的證詞',[
        {q:'他第一次來買蝦捲時，時鐘是這樣。那時候是幾點幾分？',pic:clockSvg(1,50),o:['1 點 50 分','10 點 5 分','2 點 50 分'],ex:'短針快到 2，長針指著 10，是 1 點 50 分。'},
        {q:'他 1:50 買蝦捲，2:35 又回來買豆花。中間隔了幾分鐘？',o:['45 分鐘','85 分鐘','35 分鐘'],ex:'1:50 到 2:00 是 10 分鐘，2:00 到 2:35 是 35 分鐘，合起來 45 分鐘。'}]),
      ev:['海龜伯伯的證詞','可疑的人把蝦捲塞進「圓形的包包」裡！'],after:'蝦捲要趁熱吃喔！'}),
    pz('signA',200,700,{r:90,sx:80,sy:110,hint:'告示牌 1 好像被改過了。',art:()=>signPost(200,700,1),
      intro:[['duo','這塊告示牌上有兩句話被改了錯字。']],run:()=>signs([SIGNS[0],SIGNS[1]]),
      ev:['告示牌 1','改錯字的紅筆，和預告信的筆跡一模一樣。']}),
    pz('signB',540,700,{r:90,sx:80,sy:110,hint:'告示牌 2 也被改過了。',art:()=>signPost(540,700,2),
      intro:[['duo','第二塊告示牌也被改了，還寫著奇怪的句子……']],run:()=>signs([SIGNS[2],SIGNS[3]]),
      ev:['告示牌 2','告示上寫著「躲進人群」——怪盜X打算混進人群裡！']}),
    pz('chest',800,850,{r:70,hint:'古堡前面的寶箱，上面有一個組字鎖。',art:()=>`<g transform="translate(800 850)"><rect x="-70" y="-30" width="140" height="80" rx="8" fill="#AE8464" stroke="#2E384F" stroke-width="6"/><path d="M-70 -30 Q0 -90 70 -30Z" fill="#BB9A7A" stroke="#2E384F" stroke-width="6"/><rect x="-14" y="-24" width="28" height="34" rx="5" fill="#D4BB49" stroke="#2E384F" stroke-width="4"/><path d="M-70 10 H70" stroke="#D4BB49" stroke-width="8"/></g>`,
      intro:[['duo','寶箱上有一個「組字鎖」。要把部件拼成正確的字，才能打開。']],
      run:()=>chest([{word:'畫畫用的 顏<u>　</u>',ans:'料',L:['米','禾','火'],R:['斗','十','半'],okL:'米',okR:'斗',ex:'米＋斗＝料，顏料的「料」！'},
         {word:'便利商<u>　</u>',ans:'店',L:['广','厂','尸'],R:['占','古','石'],okL:'广',okR:'占',ex:'广＋占＝店，商店的「店」！'},
         {word:'<u>　</u>起跌倒的小朋友',ans:'扶',L:['扌','亻','木'],R:['夫','天','大'],okL:'扌',okR:'夫',ex:'扌＋夫＝扶，要用手去扶，所以是手字旁！'},
         {word:'猜<u>　</u>語',ans:'謎',L:['言','口','目'],R:['迷','米','述'],okL:'言',okR:'迷',ex:'言＋迷＝謎，猜謎語要用說的，所以是言字旁！'},
         {word:'飛<u>　</u>布',ans:'瀑',L:['氵','火','日'],R:['暴','異','景'],okL:'氵',okR:'暴',ex:'氵＋暴＝瀑，瀑布和水有關，所以是三點水！'}]),
      ev:['古堡寶箱','寶箱打開了！四百年前的古地圖平安無事。']}),
    pz('paper',470,920,{r:55,hint:'地上有幾片撕碎的紙……',art:()=>`<g transform="translate(470 920)"><rect x="-40" y="-20" width="34" height="26" fill="#FFFFFF" stroke="#2E384F" stroke-width="3" transform="rotate(-14)"/><rect x="0" y="-14" width="30" height="24" fill="#FFFFFF" stroke="#2E384F" stroke-width="3" transform="rotate(12)"/><rect x="-14" y="6" width="32" height="22" fill="#FFFFFF" stroke="#2E384F" stroke-width="3" transform="rotate(4)"/></g>`,
      intro:[['duo','是怪盜X寫的紙條，被撕碎了。把它拼回來吧！']],
      run:()=>order([['只要','天一黑','我就可以','躲進老街溜走'],['由於','偵探多叔','太厲害了','因此','我要變裝成別人的樣子']]),
      ev:['撕碎的紙條','天一黑，怪盜X就要變裝、躲進老街溜走！']}),
    pz('cannon',330,740,{r:75,hint:'古時候的大砲，砲管好像被人動過。',
      intro:[['duo','大砲的砲管被人抬高了。量量看是幾度！']],
      run:()=>quiz('量角器',[
        {q:'砲管抬起來的角度是幾度？（從右邊的 0 開始看）',pic:protSvg(60),o:['60 度','120 度','30 度'],ex:'從右邊的 0 數起，砲管對到 60。'},
        {q:'60 度的角是哪一種角？',o:['銳角','直角','鈍角'],ex:'比 90 度小的角是銳角。'},
        {q:'直角是幾度？',o:['90 度','180 度','45 度'],ex:'直角是 90 度，平角是 180 度。'}]),
      ev:['被移動的大砲','大砲被轉向東邊的安平老街——那裡就是怪盜X要逃去的地方！']}),
    pz('bricks',1180,520,{r:60,hint:'城牆上有一塊磚頭鬆鬆的。',
      intro:[['duo','城牆的磚塊排得很有規律……還有一塊是鬆的！']],
      run:()=>calc('城牆的祕密',[{q:'城牆上每一排的磚塊數是 2、4、8、16、？ 下一排有幾塊？',a:32,unit:'塊',hint:'每一排都是前一排的幾倍？'},{q:'有一面城牆是長方形，長 25 公尺、高 4 公尺。這面牆的面積是多少平方公尺？',a:100,unit:'平方公尺',hint:'長方形面積 ＝ 長 × 寬（高）'}]),
      ev:['鬆動的磚塊','磚塊後面藏著一張 X 的貼紙，上面寫：「天黑行動」。']}),
    pz('tree',1500,400,{r:100,sy:120,hint:'大榕樹下好像有東西。',
      intro:[['duo','好大的老榕樹！咦，樹枝上垂下來的那些是什麼？']],
      run:()=>quiz('植物觀察',[
        {q:'榕樹從樹枝垂下來、長在空氣中的根，叫做什麼？',pic:rootSvg('aerial'),o:['氣根','鬚根','軸根'],ex:'長在空氣中的根叫氣根，可以幫忙吸收水分、支撐樹枝。'},
        {q:'蔥和稻子的根，是由許多粗細差不多的細根組成，叫做？',pic:rootSvg('fib'),o:['鬚根','軸根','氣根'],ex:'很多細細的根長在一起，叫做鬚根。'},
        {q:'1 個節上只長 1 片葉子，左右交錯生長，這種葉序叫做？',pic:leafSvg(),o:['互生','對生','輪生'],ex:'一個節長一片、左右交錯是互生；一個節長兩片是對生；三片以上是輪生。'}]),
      ev:['氣根上的毛線','榕樹的氣根上，勾著一根紅色的帽子毛線。']}),
    pz('stall',1360,660,{r:60,hint:'蝦捲攤上有一個吃了一半的盒子。',
      intro:[['duo','這盒蝦捲和豆花派，是怪盜X吃剩的。我們來看看他吃了多少。']],
      run:()=>fraction('吃剩的點心',[{q:'一盒蝦捲切成 8 段，怪盜X吃掉了 3/8。點一點，把他吃掉的部分塗起來。',d:8,a:3,shape:'bar'},{q:'一個豆花派平分成 4 份，怪盜X吃掉了 3/4。把吃掉的部分塗起來。',d:4,a:3,shape:'pie'}]),
      ev:['吃剩的點心','點心盒上有圓形包包壓過的痕跡。']}),
    pz('pole',1120,770,{r:60,sy:170,hint:'旗竿的影子好長。',art:()=>poleArt(1120,770),
      intro:[['duo','旗竿的影子可以告訴我們現在是什麼時間。']],
      run:()=>quiz('影子時鐘',[
        {q:'太陽在西邊，竿子的影子會在哪一邊？',pic:shadowSvg(false),o:['東邊','西邊','南邊'],ex:'影子會出現在太陽的相反方向。太陽在西邊，影子就在東邊。'},
        {q:'影子又長又指向東邊，現在比較可能是什麼時候？',pic:shadowSvg(true),o:['傍晚','中午','半夜'],ex:'中午太陽最高，影子最短；傍晚太陽在西邊而且很低，影子會長長地指向東邊。'}]),
      ev:['長長的影子','天快黑了！怪盜X說「天一黑」就要行動，時間不多了。']}),
    pz('compass',870,340,{r:50,hint:'古堡的牆上掛著一個指北針。',art:()=>compassArt(870,340),
      intro:[['duo','有了指北針，就知道怪盜X往哪個方向逃。']],
      run:()=>quiz('指北針與磁鐵',[
        {q:'指北針紅色的 N 極，會指向哪個方位？',pic:`<div style="display:flex;justify-content:center"><svg viewBox="-60 -60 120 120" width="150" height="150"><circle r="54" fill="#FFFFFF" stroke="${INK}" stroke-width="5"/><path d="M0 -44 L10 0 L-10 0Z" fill="#C86062"/><path d="M0 44 L10 0 L-10 0Z" fill="#2B79B5"/></svg></div>`,o:['北方','南方','東方'],ex:'指北針的 N 極會指向北方。'},
        {q:'兩塊磁鐵的 N 極和 N 極靠近，會怎麼樣？',pic:magnetSvg(),o:['互相排斥（推開）','互相吸引','沒有反應'],ex:'同極相斥，異極相吸。'},
        {q:'安平老街在古堡的東邊。指北針的 N 指向上方時，老街在畫面的哪一邊？',o:['右邊','左邊','下面'],ex:'上北、下南、左西、右東，東邊在右邊。'}]),
      ev:['逃跑的方向','老街在東邊。往右邊走，就能追上怪盜X！']}),
    pz('window',730,240,{r:55,hint:'古堡的窗戶裡黑漆漆的。',
      intro:[['duo','古堡的窗戶裡黑漆漆的，用手電筒照照看！']],
      run:()=>lens('手電筒搜查','在黑暗的窗戶裡移動手電筒，找出怪盜X藏起來的 3 樣東西！',{pic:windowPic(),targets:[{x:160,y:225,r:60,l:'紅帽子'},{x:440,y:290,r:55,l:'圓包包'},{x:650,y:200,r:55,l:'眼鏡'}]}),
      ev:['變裝道具','窗戶裡藏著紅帽子、圓包包和眼鏡——是怪盜X的變裝道具，他就要出發了！']}),
    {id:'b1',type:'badge',bid:'c3a',x:1050,y:372},{id:'b2',type:'badge',bid:'c3b',x:1560,y:780},{id:'b3',type:'badge',bid:'c3c',x:120,y:560}
  ]});
  await chapterCard('第三章','安平古堡的寶箱','台南市・安平古堡');
  await caseCard(3,'守住安平古堡的寶箱','修好被改掉的告示，打開寶箱，查出怪盜X今晚的計畫。','台南市・安平古堡');
  await say('duo','{n}，這裡就是安平古堡。紅磚城牆好漂亮啊。',{e:'welcome'});
  await say('deer','偵探先生！你們終於來了！');
  await say('duo','這是最後一個地點，有 13 個破案關卡。我們一起把怪盜X的計畫全部拆穿！',{e:'confident'});
  hideDlg();
  await investigate('調查安平古堡');
  await say('duo','線索全部到手！{n}，最後的推理時間！',{e:'confident'});
  hideDlg();await clueBoard(true);
  await ask('duo','紙條上說，怪盜X要躲到哪裡去？',['安平老街的人群裡','日月潭的船上','台北101的頂樓'],0,{scored:1});
  await ask('duo','看影子和紙條，怪盜X打算什麼時候行動？',['天一黑的時候','中午','明天早上'],0,{scored:1});
  await multiPick('三個章節的證物，告訴我們怪盜X變裝後有哪些特徵？選出 3 個！',['戴眼鏡','紅色帽子','圓形包包','藍色帽子','方形包包','戴口罩'],[0,1,2]);
  await say('duo','完全正確！怪盜X：戴眼鏡、紅色帽子、圓形包包。',{e:'victory'});
  await say('duo','他變裝了，毛色和臉不一定一樣，只要看這三個特徵就好。走，去東邊的老街！',{e:'point'});
  hideDlg();await chapterResult(3,'安平古堡的寶箱');
}
function multiPick(text,opts,ans){
  return new Promise(async res=>{
    await showLine('duo',text);$('#dlg').onclick=null;
    const c=$('#choices');c.className='choices grid';c.hidden=false;const sel=new Set();
    const draw=()=>{c.innerHTML=opts.map((t,i)=>`<button data-i="${i}" style="${sel.has(i)?'background:#E5D490':''}"><span class="k">${sel.has(i)?'✓':'ABCDEF'[i]}</span>${t}</button>`).join('')+`<button data-ok="1" style="background:#C86062;color:#fff;justify-content:center;min-width:220px">確定（已選 ${sel.size} 個）</button>`};
    draw();
    c.onclick=e=>{const b=e.target.closest('button');if(!b)return;
      if(b.dataset.ok){if(sel.size!==3){toast('要選 3 個喔！');return}
        if(ans.every(a=>sel.has(a))){sGood();c.hidden=true;c.onclick=null;res()}
        else{sBad();G.energy=Math.max(1,G.energy-1);hud();toast('推理力 −1　有的特徵不對，打開偵探筆記看看！');sel.clear();draw()}return}
      const i=+b.dataset.i;sel.has(i)?sel.delete(i):sel.add(i);sPop();draw()};
  });
}

/* ================= FINALE ================= */
const CROWD=[
 ['cat','r',1,'s'],['rabbit','b',1,'o'],['fox','n',1,'o'],['monkey','r',0,'o'],
 ['pig','y',1,'o'],['bear2','b',0,'n'],['sheep','r',1,'n'],['cat2','y',0,'s'],
 ['fox','r',1,'o'],['deer','b',1,'s'],['rabbit','n',0,'o'],['pig','r',0,'s'],
 ['monkey','y',1,'n'],['bear2','b',0,'o'],['fox','r',0,'n'],['sheep','n',1,'s']
];
const SHIRTS=['#8DB36E','#7E5FA3','#D29841','#92C3DB','#C86062','#8DB36E','#D4BB49','#A7B0BE'];
async function finale(){
  G.ch=4;save();setCh('最終章　抓住怪盜X！');
  const pos=[];for(let r=0;r<2;r++)for(let c=0;c<8;c++)pos.push([110+c*196+(r?98:0)-(r?40:0),r?960:720]);
  setScene({id:'street',color:'#92C3DB',bg:bgStreet,spots:CROWD.map((a,i)=>({id:'p'+i,type:'crowd',x:pos[i][0],y:pos[i][1],a,art:()=>`<g transform="translate(${pos[i][0]} ${pos[i][1]}) scale(${i>=8?1.05:.9})">${critter({k:a[0],shirt:SHIRTS[i%8],hat:a[1]!=='n'?{t:'cap',c:HATC[a[1]]}:null,glasses:a[2],bag:a[3]==='n'?null:a[3]})}</g>`,r:90}))});
  // crowd hit areas are drawn by generic thing renderer
  SC.spots.forEach(s=>{s.type='thing';s.y2=s.y;s.y=s.y-110});
  drawSpots();
  await chapterCard('最終章','抓住怪盜X！','台南・安平老街');
  await say('duo','好多人啊……怪盜X一定就混在裡面。');
  await say('duo','{n}，記住三個特徵：戴眼鏡、紅色帽子、圓形包包。找到他就點下去！');
  hideDlg();
  const bar=$('#taskPill');bar.hidden=false;bar.innerHTML='找出怪盜X！<small>特徵：戴眼鏡＋紅色帽子＋圓形包包</small>';
  await new Promise(res=>{
    SC.mode=(id,g)=>{const i=+id.slice(1),[k,h,gl,bg]=CROWD[i];const why=[];
      if(!gl)why.push('沒有戴眼鏡');if(h!=='r')why.push(h==='n'?'沒有戴帽子':'帽子不是紅色');if(bg!=='o')why.push(bg==='n'?'沒有背包包':'包包不是圓形的');
      if(!why.length){SC.mode=null;sWin();res()}else{sBad();toast('不是他！他'+why.join('，也')+'。',2400);g.style.opacity='.35'}};
  });
  bar.hidden=true;
  await finisher('戴眼鏡、紅色帽子、圓形包包——三個特徵全部符合！怪盜X，就是你！');
  await say('x','嗚哇！被發現了！可是我跑得比誰都快——');
  await say('sys','怪盜X一溜煙衝進古堡城牆，在窗戶之間跳來跳去！');
  await say('duo','{n}，看準了！他從窗戶探出頭的時候，點他 5 次就能抓住他！小心不要點到路人喔。');
  hideDlg();
  await whack();
  await say('sys','多叔一個飛撲——抓住了！');
  const xg=await actorIn('x',X_LOOK,900,820,1.2);
  await say('x','嗚嗚……被抓到了……');
  await say('duo','怪盜X，你為什麼要偷台灣的寶物？');
  await say('x','因為……台灣的東西都太美了。101的燈、日月潭的船、古堡的寶物……我想通通放在我家……');
  await say('duo','美麗的東西，要留給大家一起欣賞，才是真正的寶物。');
  await say('x','……對不起。我會把寶物都還回去的。');
  await say('x','哈……哈……哈啾！！');
  $('#fxL').innerHTML=`<g opacity=".95">${[[880,640,120],[980,700,100],[800,720,110],[920,560,90]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#E8EAF0"/>`).join('')}</g>`;
  await say('sys','一陣白煙冒出來——煙，英文叫 smoke（sm 開頭）。等煙散去……');
  xg.remove();$('#fxL').innerHTML='';
  await say('duo','咳咳……他又溜走了！不過，三樣寶物都保住了。');
  await say('sys','地上留著一張小紙條：「下次見！北海岸的女王頭，等著我吧～　—— 怪盜X」');
  await say('duo','{n}，你今天表現得太棒了！你是一位真正的偵探助手。');
  hideDlg();
  ending();
}
function whack(){
  return new Promise(res=>{
    setScene({id:'wall',color:'#92C3DB',bg:()=>{let s=`<rect width="1600" height="1000" fill="#92C3DB"/><rect x="100" y="120" width="1400" height="760" fill="#B87F6D" stroke="#2E384F" stroke-width="8"/><g fill="#B87F6D" stroke="#2E384F" stroke-width="6">${Array.from({length:14},(_,i)=>`<rect x="${110+i*100}" y="76" width="64" height="50"/>`).join('')}</g>`;
      WIN.forEach(([x,y])=>{s+=`<rect x="${x-110}" y="${y-150}" width="220" height="230" rx="110" fill="#413737" stroke="#2E384F" stroke-width="7"/>`});return s},spots:[]});
    const bar=$('#taskPill');bar.hidden=false;let hits=0;const upd=()=>{bar.innerHTML=`抓住怪盜X：${hits}/5<small>他探出頭的時候，快點他！</small>`};upd();
    let cur=null,timer=null,over=false;
    const pop=()=>{if(over)return;const i=Math.floor(Math.random()*WIN.length);const isX=Math.random()<.62;const [x,y]=WIN[i];
      const look=isX?X_LOOK:[CAST.deer.look,CAST.turtle.look,{k:'rabbit',shirt:'#D29841'}][Math.floor(Math.random()*3)];
      $('#spotL').innerHTML=`<g class="spot" data-id="${isX?'X':'N'}"><g transform="translate(${x} ${y+60}) scale(.85)">${critter(look)}</g><rect class="hit" x="${x-110}" y="${y-160}" width="220" height="240"/></g>`;
      cur=isX;clearTimeout(timer);timer=setTimeout(()=>{$('#spotL').innerHTML='';setTimeout(pop,300)},1100)};
    SC.mode=(id)=>{if(id==='X'){hits++;sGood();upd();$('#spotL').innerHTML='';clearTimeout(timer);
        if(hits>=5){over=true;SC.mode=null;bar.hidden=true;setTimeout(res,400)}else setTimeout(pop,350)}
      else{sBad();toast('哎喲！那是路人啦！');$('#spotL').innerHTML='';clearTimeout(timer);setTimeout(pop,400)}};
    setTimeout(pop,600);
  });
}
const WIN=[[340,380],[800,380],[1260,380],[340,740],[800,740],[1260,740]];
function ending(){if(!G.counted){G.counted=1;const m=meta();m.clears=(m.clears||0)+1;setMeta(m);save()}
  setCh('破案成功！');
  const stars=G.energy>=5?3:G.energy>=3?2:1;
  modal(`<div class="card cert" style="width:min(720px,100%)">
    <div style="display:flex;justify-content:center;align-items:flex-end;gap:10px"><img src="${COAT.coat_front.b}" alt="偵探多叔" style="height:190px;display:block"><div style="width:120px;height:120px">${avHead()}</div></div>
    <div style="letter-spacing:6px;font-weight:900;color:var(--ink2)">破案證書</div>
    <h3 style="font-size:36px;margin:6px 0">${fmt('{n}')} 偵探助手</h3>
    <p class="lead" style="margin:0">和偵探多叔一起，保護了台北101的燈、日月潭的遊船和安平古堡的寶物！</p>
    <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
    <div class="stats"><div><b>${G.energy}/5</b>推理力</div><div><b>${G.badges.length}/9</b>骨頭徽章</div><div><b>${G.quests.length}/2</b>幫忙任務</div></div>
    <p class="lead">${G.badges.length<9?'還有骨頭徽章沒找到喔！再玩一次，把它們通通找出來吧。':'哇！所有骨頭徽章都找到了，你是觀察力超強的偵探！'}</p>
    <div class="story" style="text-align:left">下一案預告：怪盜X盯上了北海岸的「女王頭」……</div><p class="lead" style="margin:10px 0 0">再玩一次的話，所有國語、英文、數學、自然、地理題目都會換成新的喔！</p>
    <div class="row" style="justify-content:center;margin-top:14px"><button class="btn c" id="again">再玩一次</button></div></div>`,b=>{
    b.querySelector('#again').onclick=()=>{try{localStorage.removeItem(KEY)}catch(e){}location.reload()}});
  G.ch=5;save();
}
