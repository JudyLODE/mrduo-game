# 給 Kimi 的接手說明：完成第二案剩下的章節

> 先讀 `CLAUDE.md`（規則、引擎、測試）、`DESIGN.md`（第二案設計，**以它為準**）、`CHANGELOG.md`（進度）。
> 這份文件只講「怎麼做第二案剩下的章節」。

## 0. 目前進度

| 章 | 地點 | 狀態 | 檔案 |
|---|---|---|---|
| 序章 | 多叔偵探事務所 | ✅ 完成 | `js/case2.js` |
| 第一章 | 新北 野柳 | ✅ 完成（11 關＋追逐） | `js/case2.js` 的 `c2ch1()` |
| 第二章 | 新北 九份 | ⬜ 待做 | 新增 `js/case2_ch2.js` |
| 第三章 | 花蓮 太魯閣 | ⬜ 待做 | 新增 `js/case2_ch3.js` |
| 第四章 | 台東 鹿野高台 | ⬜ 待做 | 新增 `js/case2_ch4.js` |
| 最終章 | 屏東 墾丁 | ⬜ 待做 | 新增 `js/case2_ch5.js` |
| 結局 | 鵝鑾鼻燈塔 | ✅ 已寫好 `c2Ending()`（證書、破案次數、第三案預告） | `js/case2.js` |

**一次只做一章。** 做完一章、測試通過、push 之後，再開始下一章。

## 1. 一章要做哪些事（照這個順序）

1. **新玩法元件**：該章表格（DESIGN.md 第 3 節）裡還沒有的玩法，加到 `js/minigames2.js`。
   - 已經有的（可以直接用）：`mirrorRead` 鏡子密信、`spotDiff` 找不同、`clockSet` 撥時鐘、`testimony` 證詞對質、`labBench` 化學實驗台（＋`numberLine` 數線）、`sniffTrail` 嗅一嗅、`hexCount` 蜂巢數字、`wordSearch` 字母方陣、`sortBaskets` 分類籃、`coinPay` 付錢找零、`groupCount` 分組數數、`silhouette` 剪影謎案、`waveRun` 浪來了。
   - 寫法一律用 `g2()`，照 `sortBaskets`／`coinPay` 的樣子：過關 `api.ok()`、答錯 `api.no()`（不扣分）、**一定要寫 `api.solve(...)` 解題掛勾**，自動測試才能玩過去。
   - 計時或動作類：時間到不失敗；失敗兩次自動變簡單；計時器要 `T2.push(id)`，關窗時會自動清掉。
2. **章節劇本**：新增 `js/case2_chN.js`，寫 `async function c2chN(){...}`，最後一行註冊 `C2_CH[N]=c2chN;`。
3. **載入**：在 `index.html` 的 `<script src="js/main.js">` **前面**加 `<script src="js/case2_chN.js"></script>`。
4. **測試**：見第 4 節。
5. **收工**：`python3 tools/release.py` → 更新 `CHANGELOG.md`（勾掉待辦、寫一筆紀錄）→ commit → push。

## 2. 章節劇本的範本（照 `c2ch1()` 改）

```js
"use strict";
/* 第二案 第二章 九份：會變色的芋圓湯 */
async function c2ch2(){
  G.ch=2;save();setCh('第二章　會變色的芋圓湯');DUO.coat=true;
  setScene({id:'jiufen',color:'#EBC9A6',bg:bgJiufen,duo:[800,930,300],ground:()=>930,range:[300,1300],spots:[
    pz2('j_tabby',150,930,{npc:'tabby',s:1,hint:'芋圓店的虎斑貓婆婆看到了魔術。',
      intro:[['tabby','台詞……']],
      run:()=>testimony(...),                 // 任何回傳 Promise 的玩法
      ev:['證物名稱','證物說明（變裝特徵要寫進來，例如「左撇子」）']}),
    // ……一共 11 個 pz2（需要破解的關卡）
    {id:'j_q',type:'thing',x:...,y:...,hidden:true,art:()=>`...`,tap:async sp=>{/* 幫忙任務 */}},
    {id:'b1',type:'badge',bid:'k2a',x:...,y:...},{id:'b2',type:'badge',bid:'k2b',x:...,y:...},{id:'b3',type:'badge',bid:'k2c',x:...,y:...}
  ]});
  await chapterCard('第二章','會變色的芋圓湯','新北市・九份老街');
  await caseCard(2,'找回黃金博物館的小金塊','揭穿「會變色的湯」魔術，找出魔術師逃去哪裡。','新北市・九份');
  // 開場對話……
  hideDlg();await investigate('調查九份老街');
  hideDlg();await clueBoard(true);
  await ask('duo','推理問題……',['正確','錯誤','錯誤'],0,{scored:1,wrong:'提示'});   // 2～3 題
  hideDlg();await lanternSimon(...);           // 章末動作關卡
  const xg=await actorIn('x2',X2_LOOK,1250,900,1);
  hideDlg();await finisher('揭穿魔術的決勝台詞');
  // 怪盜X逃走、留下下一站線索……
  hideDlg();await actorOut(xg,700,-200);
  hideDlg();await chapterResult(2,'會變色的芋圓湯');
  G.ch=3;save();                               // ← 一定要：存檔指向下一章
}
C2_CH[2]=c2ch2;
```

## 3. 各章的固定資料（不要改名字）

| 章 | 函式 | 檔案 | 關卡 id 前綴 | 場景背景 | 骨頭徽章 bid | 幫忙任務 id | 下一站 |
|---|---|---|---|---|---|---|---|
| 二 九份 | `c2ch2` | `js/case2_ch2.js` | `j_` | `bgJiufen` | k2a k2b k2c | `k2` | 太魯閣 `travel('jiufen','taroko')` |
| 三 太魯閣 | `c2ch3` | `js/case2_ch3.js` | `t_` | `bgTaroko` | k3a k3b k3c | `k3` | 鹿野 `travel('taroko','luye')` |
| 四 鹿野高台 | `c2ch4` | `js/case2_ch4.js` | `l_` | `bgLuye` | k4a k4b k4c | `k4` | 墾丁 `travel('luye','kenting')` |
| 最終 墾丁 | `c2ch5` | `js/case2_ch5.js` | `k_` | `bgKenting` | k5a k5b k5c | `k5` | 結束後 `G.ch=6`，`run2` 會自動呼叫 `c2Ending()` |

- 已經有的角色（`CAST` key）：`pango2` 小穿山甲、`tabby` 虎斑貓婆婆、`heron` 黑冠麻鷺先生、`macaque` 獼猴巡山員、`swallow` 燕子小姐、`serow` 長鬃山羊機長、`pheasant` 帝雉姊姊、`seaturtle` 綠蠵龜守護員、`x2` 魔術師怪盜X（外型 `X2_LOOK`）、`sdeer` 變裝的梅花鹿導覽員；第一案老朋友 `leo` `otter` `deer` `koala` 也能用。
- **變裝特徵一定要出現在證物文字裡**，線索板才會自動顯示（規則在 `js/cases.js` 的 `FEATS2`）：
  第二章要有「左撇子」、第三章「燕子吊飾」、第四章「草帽」、最終章「螢光」。
- 化學魔法卡用證物名稱「化學魔法卡：○○魔法」，結局會數張數（集滿 5 張得「小化學家」）。
- 每章 **11 個以上** `pz2` 關卡（最終章 12 個），另加 1 個章末動作關卡；玩法和第一案**不能重複**（清單見 DESIGN.md 第 1 節）。
- 對象是國小 3–6 年級：三年級靠提示能完成，每章放 2–3 題高年級題材。
- 結局固定：怪盜X被揭穿後還是在白煙中逃走（已寫在 `c2Ending()` 的預告裡）。

## 4. 測試（每一章做完都要跑）

```bash
python3 tools/bundle.py && python3 tests/testbuild.py
CASE=2 python3 tests/autoplay.py      # 要看到 FINISHED 和 errors: []
python3 tests/autoplay.py             # 第一案也要跑一次，確認沒弄壞
```
- 打開 `tests/out/` 的截圖看畫面：角色站在地上、關卡圖示沒有疊在一起、文字沒有被擋住。
- 如果你（Kimi）不能在使用者的電腦上跑指令，就把改好的檔案交給使用者，請 Claude 跑測試與發布。

## 5. 不要做的事

- 不要改 `js/engine.js`、`js/case1.js`、`js/cases.js`、存檔 key（`duoshu-case2-v1`）。需要改引擎時，寫進 CHANGELOG「待決定」請使用者找 Claude。
- 不要改已完成章節的關卡 id（小朋友的存檔記得這些 id）。
- 不要用漸層色、不要用其他作品的角色。
- 第二套題目（`ALTS2`）等五章都完成後再做；格式見 DESIGN.md 第 4 節。
