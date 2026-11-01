/* 第二案 第二章 九份：會變色的芋圓湯（設計見 DESIGN.md 第 3 節）。註冊：C2_CH[2]。 */
"use strict";

/* ---------- 現場小道具 ---------- */
const jTableArt=()=>`<g transform="translate(560 870)"><path d="M-64 -10 H64 V6 H-64Z" fill="#A57E5E" stroke="${INK}" stroke-width="4"/><path d="M-52 6 V30 M52 6 V30" stroke="#8E7558" stroke-width="7"/>${[-38,0,38].map((dx,i)=>`<g transform="translate(${dx} -26)"><path d="M-15 0 L-11 20 H11 L15 0Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/><path d="M-12 6 H12 L10 18 H-10Z" fill="${['#F2A9C4','#9B7BC8','#7FB98A'][i]}"/></g>`).join('')}</g>`;
const jBoxArt=()=>`<g transform="translate(620 950)"><rect x="-52" y="-40" width="104" height="56" rx="8" fill="#946F4B" stroke="${INK}" stroke-width="5"/><path d="M-52 -40 H52 V-24 H-52Z" fill="#7A5A3A" stroke="${INK}" stroke-width="4"/>${[-30,0,30].map((dx,i)=>`<circle cx="${dx}" cy="-8" r="11" fill="${['#F2A9C4','#9B7BC8','#7FB98A'][i]}" stroke="${INK}" stroke-width="3"/>`).join('')}</g>`;
const jMenuArt=()=>`<g transform="translate(1420 880)"><path d="M-40 30 L0 -52 L40 30" fill="none" stroke="#8E7558" stroke-width="7"/><rect x="-48" y="-96" width="96" height="60" rx="6" fill="#FFFDF6" stroke="${INK}" stroke-width="5"/><text y="-58" text-anchor="middle" font-size="26" font-weight="900" fill="${INK}">菜單</text></g>`;
const jStairsArt=()=>`<g transform="translate(800 600)"><rect x="-5" y="-10" width="10" height="56" fill="#946F4B" stroke="${INK}" stroke-width="3"/><rect x="-46" y="-54" width="92" height="44" rx="8" fill="#F7EFDE" stroke="${INK}" stroke-width="4"/><text y="-23" text-anchor="middle" font-size="20" font-weight="900" fill="#2B79B5" font-family="Fredoka,sans-serif">GO ▲</text></g>`;
const jSignArt=()=>`<g transform="translate(1470 700)">${[['語',-66],['分',-22],['早',22],['仁',66]].map(([c,dx])=>`<g transform="translate(${dx} 0)"><line x1="0" y1="-66" x2="0" y2="-46" stroke="${INK}" stroke-width="3"/><rect x="-19" y="-46" width="38" height="46" rx="5" fill="#F7EFDE" stroke="${INK}" stroke-width="4"/><text y="-13" text-anchor="middle" font-size="26" font-weight="900" fill="#8C4A3C">${c}</text></g>`).join('')}</g>`;
const jArrowArt=()=>`<g transform="translate(1100 960)"><rect x="-58" y="-32" width="64" height="44" rx="6" fill="#E8A35C" opacity=".55" stroke="${INK}" stroke-width="4" transform="rotate(-8)"/><rect x="-6" y="-26" width="64" height="44" rx="6" fill="#E8A35C" opacity=".55" stroke="${INK}" stroke-width="4" transform="rotate(6)"/><path d="M-42 32 l22 -8 m-9 -5 l9 5 l-5 9 M22 30 l22 -6 m-9 -5 l9 5 l-4 9" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
const jLanternArt=()=>`<g transform="translate(1280 900)"><path d="M-70 20 V-70 M70 20 V-70 M-78 -70 H78" stroke="#8E7558" stroke-width="8" fill="none"/>${[-44,0,44].map((dx,i)=>`<g transform="translate(${dx} -36)"><line x1="0" y1="-34" x2="0" y2="-14" stroke="${INK}" stroke-width="3"/><ellipse rx="18" ry="22" fill="${['#C86062','#D4BB49','#5B84AB'][i]}" stroke="${INK}" stroke-width="4"/></g>`).join('')}</g>`;
const jKitchenArt=()=>`<g transform="translate(400 880)"><rect x="-46" y="-34" width="92" height="52" rx="8" fill="#F2EBDD" stroke="${INK}" stroke-width="5"/><rect x="-14" y="-14" width="28" height="32" fill="#8E7558" stroke="${INK}" stroke-width="4"/><path d="M-24 -44 q6 -10 0 -20 M0 -44 q6 -10 0 -20 M24 -44 q6 -10 0 -20" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/></g>`;
const jGoldArt=()=>`<g transform="translate(80 975)"><path d="M-70 8 q18 -12 36 0 t36 0 t36 0" stroke="#5B9BC2" stroke-width="12" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-8" rx="34" ry="13" fill="#8C6A4E" stroke="${INK}" stroke-width="4"/></g>`;
const jSilArt=()=>`<g transform="translate(960 890)"><ellipse cx="0" cy="4" rx="15" ry="24" fill="#2E384F" opacity=".8"/><path d="M0 -18 q-8 -20 4 -34" stroke="#2E384F" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-6 26 l-4 16 M6 26 l4 16" stroke="#2E384F" stroke-width="4" stroke-linecap="round"/></g>`;

/* ================= 第二章本體 ================= */
async function c2ch2(){
  G.ch=2;save();setCh('第二章　會變色的芋圓湯');DUO.coat=true;
  setScene({id:'jiufen',color:'#EBC9A6',bg:bgJiufen,duo:[800,930,300],ground:()=>930,range:[300,1300],spots:[
    pz2('j_tabby',210,930,{npc:'tabby',s:1,hint:'芋圓店的虎斑貓婆婆看到魔術，也看到客人借滴管。',
      intro:[['tabby','偵探先生！我是芋圓店的虎斑貓婆婆。剛剛有個客人，把我的紫色地瓜湯變來變去！'],
             ['tabby','他表演「會變色的湯」，大家都看呆了。這時候，黃金博物館的小金塊就不見了！'],
             ['duo','{n}，我們來問問在場的客人，看看有誰注意到什麼。',{e:'think'}]],
      run:()=>testimony('芋圓店的證詞',[
        ['tabby','那個客人跟我借滴管，說要「幫湯變魔術」。'],
        ['heron','那個客人是右撇子，我看他用右手拿滴管！'],
        ['gull','湯變色的時候，我聞到一股檸檬的味道耶。']],
        [['📷','監視器照片（滴管在左手）'],['🧾','點菜單'],['🥄','湯匙']],1,0,
        '找到矛盾了！照片裡滴管在客人的「左手」上——他根本是左撇子，茶樓老闆看錯了！'),
      ev:['監視器照片','照片裡，客人用左手拿滴管——魔術師是左撇子！'],after:'要來一碗芋圓嗎？今天的湯沒有魔術喔。'}),
    pz2('j_table',560,870,{r:55,hint:'芋圓店門口的桌子上有三杯紫色的湯。',art:jTableArt,
      intro:[['duo','桌面上有三杯紫色的地瓜湯，貼著 A、B、C。我們來重做怪盜X 的實驗！真的實驗要有大人陪，桌上的東西都不能喝。']],
      run:()=>labBench({title:'化學實驗台：會變色的湯',predict:{q:'紫色的地瓜湯，加入哪一種東西會變色？',o:['只有檸檬汁','只有小蘇打水','檸檬汁和小蘇打水都會'],ans:2},
        cups:[{label:'A 號杯',res:{color:'#F2A9C4',tag:'變粉紅'}},{label:'B 號杯',res:{color:'#9B7BC8',tag:'還是紫色'}},{label:'C 號杯',res:{color:'#7FB98A',tag:'變綠色'}}],
        tray:[['soup','🍠','紫地瓜湯'],['lemon','🍋','檸檬汁'],['water','💧','清水'],['soda','🧂','小蘇打水']],
        place:[['soup',0],['soup',1],['soup',2],['lemon',0],['water',1],['soda',2]],
        setupTip:'每杯都倒紫地瓜湯：A 加檸檬汁、B 加清水、C 加小蘇打水。',wrongPlace:'看看杯子的標籤，這杯要加什麼？',
        act:'用手指在杯子上面畫圈圈，攪拌湯！',turns:3,
        result:'A 變成粉紅色、B 還是紫色、C 變成綠色！',
        why:'紫地瓜的顏色是「酸鹼指示劑」：遇到酸（檸檬汁）變粉紅，遇到鹼（小蘇打水）變綠，加清水不變色。',
        after:api=>wordToCups(api,{cups:[{label:'A 號杯',color:'#F2A9C4',word:'PINK',zh:'粉紅'},{label:'B 號杯',color:'#9B7BC8',word:'PURPLE',zh:'紫色'},{label:'C 號杯',color:'#7FB98A',word:'GREEN',zh:'綠色'}],okMsg:'三杯都對上了！英文顏色字卡完成！'})}),
      ev:['化學魔法卡：變色魔法','紫色的地瓜湯是酸鹼指示劑：遇酸變粉紅、遇鹼變綠。怪盜X 一滴酸、一滴鹼，湯就聽他的話變色！']}),
    pz2('j_box',620,950,{r:50,hint:'階梯下面有一個上鎖的道具箱。',art:jBoxArt,
      intro:[['duo','道具箱上有三個顏色轉盤……跟剛剛三杯湯的顏色有關！']],
      run:()=>colorDials('道具箱的變色密碼盤','把三個轉盤轉到實驗結果的顏色，旁邊的色卡就會告訴你密碼。',
        [['粉紅','#F2A9C4'],['紫','#9B7BC8'],['綠','#7FB98A'],['黃','#D4BB49']],[0,1,2],
        [['粉紅',3],['紫',8],['綠',5]],'385','喀嚓！密碼 385，道具箱打開了！'),
      ev:['道具箱的收據','箱裡有一支滴管和收據：「檸檬汁 ×3、小蘇打水 ×3——表演用。X」怪盜X 早就準備好變色湯了！']}),
    pz2('j_menu',1420,880,{r:50,hint:'茶樓門口的菜單架，紙上看起來空白一片。',art:jMenuArt,
      intro:[['heron','偵探先生！我茶樓的菜單好像被人動過，白白的什麼都沒寫……'],
             ['duo','不一定什麼都沒寫喔。{n}，白蠟筆寫在白紙上，本來就看不見。',{e:'hmm'}]],
      run:()=>brushReveal('菜單上的白蠟筆字','聽說用白蠟筆寫的字，要用對工具才看得見。要用哪一種呢？',
        '湯變色的祕密＝酸和鹼',[[190,150,120],[450,150,120],[710,150,120]]),
      ev:['菜單上的蠟筆字','白蠟筆的字要用「水彩」才浮現——蠟不吸水！字寫著：「湯變色的祕密＝酸和鹼」。']}),
    pz2('j_stairs',800,600,{r:55,hint:'豎崎路的階梯旁，有一根英文路標。',art:jStairsArt,
      intro:[['pango2','多叔！階梯上的路標都是英文的，我看得好吃力……'],
             ['duo','沒關係，我們一邊唸一邊走。跟著路標走，就能找到怪盜X 做記號的燈籠。',{e:'welcome'}]],
      run:()=>signRoute('豎崎路的英文路標','讀懂每一根路標，選正確的方向，走到怪盜X 做記號的 24 號燈籠！',[
        {en:'Go up the stairs.',zh:'走上樓梯。',dir:0},
        {en:'Turn left at the tea shop.',zh:'在茶樓向左轉。',dir:1},
        {en:'Go straight.',zh:'繼續直走。',dir:0},
        {en:'Turn right at the red lantern.',zh:'在紅燈籠的地方向右轉。',dir:2}]),
      ev:['24 號燈籠下的紙條','燈籠下貼著紙條：「金子藏在水裡，跟著箭頭到金瓜石的小溪。」']}),
    pz2('j_sign',1470,700,{r:55,hint:'茶樓掛著四塊字牌：語、分、早、仁。',art:jSignArt,
      intro:[['duo','這四塊字牌好奇怪，故意挑了四個「藏著數字」的字……'],
             ['duo','把字拆開看看，裡面藏了什麼數字？',{e:'think'}]],
      run:()=>charNums('字裡藏數','每個字裡都藏著一個數字！點一點大字可以看拆開的樣子。找出四個數字、加起來，去點正確的燈籠。',
        [{ch:'語',d:['言','吾'],dk:1,hide:'五',ans:5,opts:[4,5,6]},
         {ch:'分',d:['八','刀'],dk:0,hide:'八',ans:8,opts:[6,8,9]},
         {ch:'早',d:['日','十'],dk:1,hide:'十',ans:10,opts:[4,10,12]},
         {ch:'仁',d:['亻','二'],dk:1,hide:'二',ans:2,opts:[1,2,3]}],
        '五 ＋ 八 ＋ 十 ＋ 二 ＝ ？',[24,25,26],25,'25 號燈籠亮了！數字全部對上！'),
      ev:['25 號燈籠裡的收據','燈籠裡塞著一張收據，字歪歪斜斜的，像是用「左手」寫的：「茶樓包場——魔術表演一位。」']}),
    pz2('j_arrow',1100,960,{r:50,hint:'地上有兩張畫著粉筆箭頭的透明片。',art:jArrowArt,
      intro:[['duo','兩張透明片分開看，只是亂亂的箭頭。要是疊在一起……'],
             ['pango2','我來把它們疊起來！']],
      run:()=>arrowOverlay('疊起來的透明片','把右邊的透明片拖過去，和左邊的疊在一起。','25','疊起來了！箭頭碎片拼出了「25」——和茶樓招牌算出的燈籠號碼一模一樣！'),
      ev:['疊合的數字密碼','兩張透明片疊在一起，拼出了「25」。怪盜X 用這個號碼做記號，和招牌的線索互相印證。']}),
    pz2('j_lanterns',1280,900,{r:55,hint:'燈籠攤的英文卡和老闆弄亂了，需要配對。',art:jLanternArt,
      intro:[['duo','燈籠攤的老闆把「英文顏色卡」和「燈籠」弄亂了。幫忙配成對吧！']],
      run:()=>flipMatch('燈籠攤的顏色配對','一次翻兩張：英文顏色字要找到顏色一樣的燈籠。記住卡片的位置！',
        [['RED','紅色','#C86062'],['BLUE','藍色','#5B84AB'],['GREEN','綠色','#8DB36E'],['YELLOW','黃色','#D4BB49']]),
      ev:['燈籠攤的木箱','攤子後面的木箱貼著標籤：「黃金博物館・小金塊・小心輕放」——怪盜X 早就盯上小金塊了！']}),
    pz2('j_kitchen',400,880,{r:55,hint:'芋圓店廚房的食譜卡被人塗改過。',art:jKitchenArt,
      intro:[['tabby','偵探先生！我今天要煮 6 碗芋圓，食譜卡上的份量卻被蠟筆塗掉了……'],
             ['duo','別擔心。照著 2 碗的份量，把它改成 6 碗吧！',{e:'confident'}]],
      run:()=>recipeScale('把食譜改成 6 碗','2 碗的份量要變成 6 碗，每一種材料各要多少？',
        [{name:'地瓜粉',unit:'匙',base:4,mult:3},{name:'砂糖',unit:'匙',base:2,mult:3},{name:'水',unit:'碗',base:1,mult:3}],
        '6 碗食譜完成了！地瓜粉 12 匙、砂糖 6 匙、水 3 碗，煮出來的芋圓一定 Q 彈！'),
      ev:['被改過的食譜','食譜卡背面有蠟筆簽名：「謝謝婆婆的湯。——X」怪盜X 來過廚房！']}),
    pz2('j_gold',80,975,{r:55,hint:'老街盡頭的小溪，水流嘩啦啦。',art:jGoldArt,
      intro:[['pango2','就是這裡！紙條說「金子藏在水裡」……多叔，我來淘金！'],
             ['duo','好！左右晃動淘金盤，讓輕的沙子流走，重的金子留下來。',{e:'point'}]],
      run:()=>goldPan('金瓜石小溪淘金','按住淘金盤，左右來回晃！沙子比較輕會被水沖走，金子比較重會留在盤子裡。'),
      ev:['找回小金塊！','小溪裡淘到失竊的小金塊！包著金塊的紙寫著：「竟被追到這裡……下一場：會呼吸的石頭，太魯閣見。——X」']}),
    pz2('j_sil',960,890,{r:50,hint:'溪邊有一根會動的「木頭」。',art:jSilArt,
      intro:[['pango2','多叔！溪邊那根木頭……剛剛好像動了一下！']],
      run:()=>silhouette({title:'一動也不動的木頭',clue:'牠站在水邊，一動也不動，像一根木頭。等到小魚游過，牠的長脖子會「咻」地伸出去！',
        sil:`<svg viewBox="0 0 300 220"><rect width="300" height="220" fill="#D9C7A3"/><rect y="168" width="300" height="52" fill="#7FB3CC"/><g fill="#2E384F"><ellipse cx="150" cy="118" rx="28" ry="40"/><path d="M150 82 q-6 -28 6 -42 q10 -10 26 -8" stroke="#2E384F" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M180 30 l28 6 l-28 9z"/><path d="M158 18 q12 -12 26 -7 q-9 5 -11 13z"/><path d="M140 154 l-6 40 M160 154 l6 40" stroke="#2E384F" stroke-width="6" stroke-linecap="round"/></g></svg>`,
        real:`<svg viewBox="0 0 300 220"><rect width="300" height="220" fill="#D9C7A3"/><rect y="168" width="300" height="52" fill="#7FB3CC"/><ellipse cx="150" cy="118" rx="28" ry="40" fill="#8B6C55" stroke="${INK}" stroke-width="4"/><path d="M150 82 q-6 -28 6 -42 q10 -10 26 -8" stroke="#8B6C55" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M180 30 l28 6 l-28 9z" fill="#4B4B52" stroke="${INK}" stroke-width="3"/><path d="M158 18 q12 -12 26 -7 q-9 5 -11 13z" fill="#2E2B33"/><circle cx="176" cy="36" r="3.5" fill="#FFFFFF"/><path d="M140 154 l-6 40 M160 154 l6 40" stroke="#4B4B52" stroke-width="6" stroke-linecap="round"/></svg>`,
        guess:['黑冠麻鷺','白鷺鷥','我先想想'],part:'頭頂的黑色羽冠和長長的脖子',
        opts:[['黑冠麻鷺','🪶',1],['白鷺鷥','🦩',0],['老鷹','🦅',0]],
        fact:'答對了！是黑冠麻鷺先生。牠們站在水邊一動也不動，是為了等魚靠近。牠說看到有人用「左手」把東西丟進溪裡！'}),
      ev:['今日小謎案','原來是黑冠麻鷺先生在等魚！牠說：「剛剛有人用左手把一包東西丟進溪裡，我的長脖子都看到了。」']}),
    {id:'j_q',type:'thing',x:1095,y:227,r:45,hidden:true,
     art:()=>`<g transform="translate(1095 203) rotate(-10)"><rect x="-19" y="-14" width="38" height="30" rx="4" fill="#5B84AB" stroke="${INK}" stroke-width="4"/><rect x="-13" y="-8" width="26" height="18" fill="#FFFDF6"/></g>`,
     tap:async sp=>{sp.hidden=true;if(!G.quests.includes('k2'))G.quests.push('k2');save();drawSpots();sWin();await say('gull','我的集郵冊！九份的郵票一張都沒少，謝謝你！');toast('完成幫忙任務！')}},
    {id:'b1',type:'badge',bid:'k2a',x:330,y:740},{id:'b2',type:'badge',bid:'k2b',x:1540,y:500},{id:'b3',type:'badge',bid:'k2c',x:800,y:180}
  ]});
  await chapterCard('第二章','會變色的芋圓湯','新北市・九份老街');
  await caseCard(2,'找回黃金博物館的小金塊','揭穿「會變色的湯」魔術，找出魔術師逃去哪裡。','新北市・九份');
  await say('tabby','偵探先生！你們終於來了！');
  await say('duo','{n}，九份老街有 11 個破案關卡。怪盜X 說湯會變色——我們用科學拆穿它！',{e:'point'});
  await say('gull','嗚……我的集郵冊被風吹到燈籠那邊了，好高喔……');
  spot('j_q').hidden=false;drawSpots();
  hideDlg();await investigate('調查九份老街');
  await say('duo','證物都釘上線索板了！{n}，推理時間！',{e:'confident'});
  hideDlg();await clueBoard(true);
  await ask('duo','「會變色的芋圓湯」到底是怎麼變色的？',['紫色的湯遇到酸和鹼會變色','湯裡加了彩色的糖','湯根本沒變色，是大家看錯了'],0,{scored:1,wrong:'想想化學實驗台的三杯湯。'});
  await ask('duo','監視照片和收據都指出：怪盜X 慣用哪一隻手？',['左手（左撇子）','右手','兩隻手一樣靈活'],0,{scored:1,wrong:'看看監視器照片裡，滴管在哪一隻手上？'});
  await ask('duo','怪盜X 留下的紙條說，下一場魔術在哪裡？',['太魯閣','鹿野高台','墾丁'],0,{scored:1});
  await say('duo','沒錯！怪盜X 往階梯上跑了！快追！',{e:'run'});
  hideDlg();await lanternSimon('燈籠記憶：追！');
  const xg=await actorIn('x2',X2_LOOK,1250,900,1);
  hideDlg();await finisher('紫色的湯是酸鹼指示劑——你的變色魔術，被科學拆穿了！');
  await say('x2','哼，區區顏色遊戲而已。魔術師的下一個戲法，可沒這麼簡單！');
  await say('sys','砰！白煙升起——怪盜X 的身影又消失了，階梯上只剩一件紫色披風。');
  hideDlg();await actorOut(xg,700,-200);
  await say('pango2','披風口袋裡有一張車票：「太魯閣號，今天出發！」');
  await say('duo','{n}，我們去太魯閣！',{e:'point'});
  hideDlg();await chapterResult(2,'會變色的芋圓湯');
  hideDlg();await travel('jiufen','taroko');
  G.ch=3;save();
}
C2_CH[2]=c2ch2;
