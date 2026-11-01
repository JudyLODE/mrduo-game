# CLAUDE.md — 偵探多叔：台灣大搜查（給 AI 協作者的交接文件）

> 這份文件是給 **Claude、Kimi 或任何接手的 AI／工程師** 看的。動手前請先讀完本檔與 `CHANGELOG.md` 最上面的「進行中」。
> Kimi Code 會讀 `AGENTS.md`，內容只是指回這裡。

## 1. 專案是什麼

- 給台灣**國小 3–6 年級**的偵探解謎網頁遊戲，主要在 **iPad 橫向**玩（Safari「加入主畫面」變成 App）。
- 主角「偵探多叔」是作者原創 IP（灰色貴賓狗、棕色帽子；事務所內穿毛衣，出門穿風衣）。**不可使用屁屁偵探等他人 IP。**
- 發布：GitHub Pages（`main` 分支根目錄）→ https://judylode.github.io/mrduo-game/
- 第一案「消失的台灣三寶」已完成；第二案「怪盜X的魔術環島」設計在 `DESIGN.md`，程式進行中（見 CHANGELOG）。
- 遊戲設計成可以一直延續：每一案是一本「案件簿」的一頁，各自獨立存檔。

## 2. 協作規則（很重要）

1. **同一時間只讓一個 AI 改 repo。** 開工前 `git pull`，收工前更新 `CHANGELOG.md` 再 commit + push。
2. 一個任務一個 commit，訊息用中文寫清楚改了什麼。
3. 改完一定要跑測試（第 6 節）。測試沒過不要 push。
4. 不確定的設計決定，寫進 CHANGELOG 的「待決定」，問使用者，不要自己猜。
5. **隱私**：遊戲裡不能出現任何真實孩子的名字或個資（首頁、存檔預設值、題目都一樣）。

## 3. 檔案結構

```
index.html            骨架（HUD、舞台、對話框、首頁）＋依序載入 js
style.css             全部樣式
js/assets.js          多叔圖片路徑與寬高比（POSES 毛衣 20 種表情、COAT 風衣與半身像、FACE）
js/engine.js          核心：狀態 G、存檔、音效、朗讀、角色繪製 critter()、CAST、對話 say/ask、視窗 modal、場景與鏡頭
js/scenes.js          第一案場景背景、台灣地圖 PLACES/mapPick/travel、預告信
js/minigames.js       小遊戲元件、過場 cutscene、委託卡、決勝特寫、章節結算、線索板、暫停
js/case1.js           第一案劇本、關卡、題目（含第二套題目 ALTS）、結局
js/cases.js           案件系統：CASES 設定（存檔 key、章名、線索板分頁、特徵）、案件簿 caseBook()、startCase()
js/scenes2.js         第二案：新動物種類、新角色 CAST、地圖新地點、五個場景背景
js/minigames2.js      第二案的新玩法元件（g2() 視窗、api.ok/no/solve），和第一案不重複
js/case2.js           第二案：開場、序章、第一章野柳、章節登錄 C2_CH、未完待續、結局 c2Ending()、第二套題目 ALTS2
js/case2_chN.js       第二案第 N 章（之後新增，用 C2_CH[N]=c2chN 註冊；做法見 docs/KIMI.md）
js/main.js            開機：首頁、角色設計、「打開案件簿」（一定最後載入）
assets/duo/*.webp     遊戲用的多叔圖片（由 tools/art/export_duo.py 產生，不要手改）
art-src/duo/*.webp    多叔去背原圖（高解析、無損），要重新輸出圖片時用
tools/bundle.py       打包成單一 HTML（Claude artifact 預覽與測試用）
tools/release.py      發布前更新 sw.js 版本號與離線檔案清單
tools/art/            去背與輸出圖片的工具
tests/                自動試玩測試
docs/KIMI.md          給 Kimi 的接手說明：第二案剩下章節怎麼做
```

所有 js 都是**一般 script（不是 module）**，在同一個全域範圍，所以載入順序很重要：
`assets → engine → scenes → minigames → case1 → cases → scenes2 → minigames2 → case2 → main`。
新案件：在 `js/cases.js` 的 `CASES` 加一筆，新增 `js/caseN.js`（寫 `runN(from)`），在 `startCase()` 加上呼叫，並在 `index.html` 的 `main.js` 前面加 `<script>`。
目前案件由 `CUR`／`CASE()` 決定；`KEY`（存檔）與 `ROUTE`（地圖路線）由 `useCase(n)` 切換。

## 4. 風格規範（使用者明確要求過的）

- 底色米黃 `#F3E8CF`，主題色藍 `--theme #5B84AB`；**低彩度、全部純色、不用漸層**。
- 只有首頁底圖有圖案（1 個放大鏡＋1 個藍色問號），其他頁面純色。
- 角色要站在地面上、和場景空間合理；對話時鏡頭拉近，對話框不能擋住重要角色或線索。
- 多叔對話頭像用半身像；出了事務所一律穿風衣（`DUO.coat=true`）。
- 角色圖完整去背、不能有白邊或缺手。
- 所有文字都要能「唸給我聽」；英文台詞給 `{en:1,zh:'中文'}`。

## 5. 引擎速查（寫劇情和關卡會用到的）

### 狀態與存檔
- `G`：目前遊戲狀態，存在 localStorage。欄位：`name, av(角色), energy(推理力1–5), badges[], quests[], clues[], facts[], ev[](證物), ch(目前章), done{章:[已破解關卡id]}, round(第幾輪), results{}`。
- `save()` 寫入 `KEY`（第一案 `duoshu-case1-v3`）。**不要改既有案件的存檔 key**，會讓小朋友的進度消失。
- `meta()` / `setMeta()`：跨案件資料 `duoshu-meta`，例如 `clears`（第一案破案次數）。
- 第一案通關後再玩，`G.round` 為奇數時會換成 `ALTS` 裡的第二套學科題目（見 `js/case1.js`）。

### 場景
```js
setScene({id:'obs', color:'#2B79B5', bg:bgObs,   // bg() 回傳 1600×1000 的 SVG 內容
  duo:[x, y腳底, 身高], ground:()=>958, range:[160,1480],   // 多叔站的位置與可走範圍
  spots:[ pz(...), {id:'b1',type:'badge',bid:'c1a',x:1565,y:640}, ... ]});
await investigate('調查101觀景台');   // 等玩家把所有 need 的關卡破完並按「開始推理」
```

### 關卡（調查點）`pz(id, x, y, o)`
```js
pz('bear', 1330, 930, {
  npc:'bear', s:1.1,              // 有 npc＝人物（頭上有「！」）；沒有＝物品（放大鏡圖示），可給 art:()=>SVG
  hint:'卡關時多叔的提示',
  intro:[['bear','台詞'],['duo','台詞',{e:'think'}]],   // 開始前的對話
  run:()=>quiz('標題',[...]),      // 任何回傳 Promise 的小遊戲
  ev:['證物名稱','證物說明'],       // 過關後得到的證物卡（會釘到線索板）
  after:'破完後再點的台詞'          // 也可以是 async 函式
})
```
- 破完的關卡 id 會存進 `G.done`，玩家中途離開再回來不用重玩。**同一案件內 id 不可重複。**

### 對話
- `await say(who, text, {e:'表情', en:1, zh:'中文翻譯'})`；`who` 是 `CAST` 的 key、`'duo'`、`'me'`(玩家)、`'sys'`(旁白)。`{n}` 會換成玩家名字。
- `await ask(who, text, [選項...], 正確索引, {scored:1, wrong:'答錯提示'})`：推理問題；`scored` 答錯扣 1 推理力（最低 1，不會歸零）。
- 多叔表情（`e`）：think teary shock greet run walk angry laugh confused hmm gasp welcome worry point victory cheer cheeky confident jump oops。
- 新角色：在 `CAST` 加 `{name, look:{k:'種類', shirt, hat:{t,c}, top, mood}}`；種類在 `KINDS`。

### 小遊戲元件規範（新增玩法一定要遵守）
1. 函式回傳 `Promise`，過關時 `closeModal(); res()`。
2. 用 `modal(html, bind)` 開視窗；卡片加 `data-duo="think"` 會自動出現多叔頭像、「看現場」「線索板」按鈕。
3. **答對後到換題前，用 `lockFor(fn, ms)` 取代 `setTimeout`**，否則小朋友連點會跳題（曾經發生過的 bug）。
4. 答錯不懲罰、沒有「失敗結束」；給分層提示（先提醒、再指出位置、最後示範一半）。
5. 計時類遊戲時間到不會失敗，只是不給額外星星；連續失敗兩次要自動降低難度。
6. 為了自動測試，每個新玩法要提供「解題掛勾」：`window.__solve=()=>{...}`，讓測試程式能自動完成它。
7. 第二案的新玩法請用 `js/minigames2.js` 的 `g2(標題, 多叔表情, html, api=>{...})`：過關 `api.ok(訊息)`（內建連點鎖與關窗）、答錯 `api.no(提示)`、`api.solve(fn)` 設定解題掛勾。範例：`sortBaskets`、`coinPay`。
8. 第二案關卡用 `pz2()`（會自動套用 `ALTS2` 第二套題目），id 用章節前綴：野柳 `y_`、九份 `j_`、太魯閣 `t_`、鹿野 `l_`、墾丁 `k_`。

### 常用流程元件
`chapterCard(小標,大標,副標)`、`caseCard(no,標題,目標,地點)`、`openingCut()`/`cutscene(panels)`、`finisher('決勝台詞')`、`chapterResult(no,標題)`、`clueBoard(true)`、`mapPick(地點key, 已完成數)`、`travel(from,to)`、`letter(i)`、`actorIn/actorOut`。

## 6. 測試（每次改完都要跑）

需要：Python 3、`pip install playwright`、`playwright install chromium`。

```bash
python3 tools/bundle.py                 # 打包成 dist/bundle.html
python3 tests/testbuild.py              # 加測試掛勾 → tests/out/t.html
python3 tests/autoplay.py               # 自動玩完第一案，最後要看到 FINISHED 和 errors: []
ROUND=1 python3 tests/autoplay.py       # 測第一案第二套題目
CASE=2 python3 tests/autoplay.py        # 自動玩第二案（目前玩到「未完待續」就算完成）
```
截圖會存在 `tests/out/`，改了畫面要打開看。只想在瀏覽器試玩：`python3 -m http.server 8000` 後開 http://localhost:8000 。

## 7. 發布

1. 跑完測試。
2. `python3 tools/release.py`（更新離線快取版本，iPad 才會拿到新版）。
3. 更新 `CHANGELOG.md`，commit，push 到 `main`。GitHub Pages 約 1 分鐘後更新。
4. （Claude 專用）用 `tools/bundle.py` 打包後可發布成 Claude artifact 預覽。

## 8. 不要做的事
- 不要直接改 `assets/duo/*.webp`（用 `tools/art/export_duo.py`）。
- 不要改既有存檔 key、不要刪 `G` 既有欄位。
- 不要用 ES module、打包器或框架；保持「打開 index.html 就能玩」。
- 不要重寫 git 歷史（除非使用者明確同意）。
