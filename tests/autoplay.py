"""自動把整個遊戲玩一遍（第一案），印出 FINISHED 代表全部關卡都能過。
用法：python3 tools/bundle.py && python3 tests/testbuild.py && python3 tests/autoplay.py
環境變數 ROUND=1 可測第二套題目。截圖存在 tests/out/。"""
import asyncio,json,time,os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out')
from playwright.async_api import async_playwright
SHOTS={};PEEKED={};DL={}
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1180,'height':820})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('file://'+os.path.join(OUT,'t.html'));await pg.wait_for_timeout(500)

    if os.environ.get('ROUND'):
      await pg.evaluate("localStorage.setItem('duoshu-meta',JSON.stringify({clears:%s}))"%os.environ['ROUND']);await pg.reload();await pg.wait_for_timeout(500);await pg.screenshot(path=os.path.join(OUT,'r_title.png'))
    await pg.fill('#pname','測試');await pg.click('#goBtn');await pg.wait_for_timeout(2500)
    ev=lambda js:pg.evaluate(js)
    async def shot(key):
      if key in SHOTS:return
      SHOTS[key]=os.path.join(OUT,f'a_{len(SHOTS):02d}_{key}.png');await pg.screenshot(path=SHOTS[key])
    async def click(sel):
      el=await pg.query_selector(sel)
      if el:
        try: await el.click(timeout=2000)
        except Exception: await ev(f"document.querySelector({json.dumps(sel)})&&document.querySelector({json.dumps(sel)}).click()")
        return True
      return False
    async def vis(sel):return await ev(f"(()=>{{const e=document.querySelector({json.dumps(sel)});return !!e&&!e.closest('[hidden]')&&getComputedStyle(e).display!=='none'}})()")
    t0=time.time();last=''
    for step in range(4000):
      if time.time()-t0>900:print('TIMEOUT');break
      if await pg.query_selector('.cert'):await shot('cert');print('FINISHED at step',step);break
      if await pg.query_selector('.chap'):await pg.click('.chap');await pg.wait_for_timeout(200);continue
      if await pg.query_selector('.cut'):await shot('cut'+str(step//50));await pg.click('.cut');await pg.wait_for_timeout(300);continue
      if await pg.query_selector('.fin'):await pg.wait_for_timeout(900);await shot('finisher'+str(await ev('__T.G().ch')));await pg.click('.fin');await pg.wait_for_timeout(300);continue
      if await vis('#modal2'):
        await shot('board');await click('#nbOk');await pg.wait_for_timeout(200);continue
      if await vis('#peekBtn'):await shot('peek');await click('#peekBtn');await pg.wait_for_timeout(300);continue
      modal=await vis('#modal')
      if modal:
        if await pg.query_selector('#ccOk'):await pg.wait_for_timeout(500);await shot('case'+str(await ev('__T.G().ch')));await click('#ccOk');await pg.wait_for_timeout(200);continue
        if await pg.query_selector('#brOk'):await pg.wait_for_timeout(600);await shot('result'+str(await ev('__T.G().ch')));await click('#brOk');await pg.wait_for_timeout(200);continue
        if await pg.query_selector('#mzS'):
          await shot('maze')
          for d in [(0,1),(0,1),(0,1),(0,1),(1,0),(1,0),(1,0),(1,0),(1,0),(0,1),(1,0),(1,0),(1,0)]:
            await ev(f"__mz.move({d[0]},{d[1]})");await pg.wait_for_timeout(60)
          await pg.wait_for_timeout(1800);continue
        if await pg.query_selector('#tlS'):
          await shot('tail')
          for i in range(400):
            if not await pg.query_selector('#tlS'):break
            await ev("__tl.set(!__tl.look())");await pg.wait_for_timeout(50)
          continue
        if not PEEKED.get(1) and await pg.query_selector('#mBody [data-peek]'):
          PEEKED[1]=1;await click('#mBody [data-peek]');await pg.wait_for_timeout(500);continue
        if not PEEKED.get(2) and await pg.query_selector('#mBody [data-board]'):
          PEEKED[2]=1;await click('#mBody [data-board]');await pg.wait_for_timeout(500);await shot('board_over_puzzle');await click('#nbOk');await pg.wait_for_timeout(200);continue
        if await pg.query_selector('#evOk'):await shot('evidence');await click('#evOk');await pg.wait_for_timeout(150);continue
        if await pg.query_selector('#lOk'):await shot('letter');await click('#lOk');continue
        if await pg.query_selector('#walker'):await pg.wait_for_timeout(800);await shot('travel'+str(await ev('__T.G().ch')));await pg.wait_for_timeout(2400);continue
        if await pg.query_selector('#mapS'):
          await shot('map')
          for k in ['t101','sml','anping','yeliu','taroko','alishan','kenting','penghu']:
            if not await pg.query_selector('#mapS'):break
            await ev(f"document.querySelector('#mapS .pin[data-k=\"{k}\"]').dispatchEvent(new MouseEvent('click',{{bubbles:true}}))");await click('#mapGo');await pg.wait_for_timeout(200)
          continue
        if await pg.query_selector('#qb .qopts'):
          await shot('quiz_'+(await ev("document.querySelector('#mBody h3').textContent")))
          if not await click('#qn'):await click('#qb button[data-k="0"]')
          await pg.wait_for_timeout(150);continue
        if await pg.query_selector('#cp'):
          await shot('calc_'+(await ev("document.querySelector('#mBody h3').textContent")))
          a=await ev("(()=>{const t=document.querySelector('#cq .story').textContent;const Q=__T.calc.find(q=>q.q===t);return Q?Q.a:null})()")
          if a is None:await pg.wait_for_timeout(300);continue
          for d in str(a):await click(f'#cp button[data-k="{d}"]')
          if not PEEKED.get('dbl'):
            PEEKED['dbl']=1;bb=await (await pg.query_selector('#cp button[data-k="ok"]')).bounding_box();cx,cy=bb['x']+bb['width']/2,bb['y']+bb['height']/2
            await pg.mouse.click(cx,cy);await pg.wait_for_timeout(60)
            for d in str(a):
              bd=await (await pg.query_selector(f'#cp button[data-k="{d}"]')).bounding_box();await pg.mouse.click(bd['x']+5,bd['y']+5)
            await pg.mouse.click(cx,cy);await pg.mouse.click(cx,cy)
            await pg.wait_for_timeout(1800);print('DOUBLE-TAP CHECK ticks=',await ev("document.querySelectorAll('#pk .on').length"),flush=True);continue
          await click('#cp button[data-k="ok"]');await pg.wait_for_timeout(1700);continue
        if await pg.query_selector('#mPad'):
          await shot('mathlock');w=await ev("__T.mlw()")
          if w is None:await pg.wait_for_timeout(500);continue
          for d in str(w):await click(f'#mPad button[data-k="{d}"]')
          await click('#mPad button[data-k="ok"]');await pg.wait_for_timeout(500);continue
        if await pg.query_selector('#hK'):
          await shot('hangman')
          w=await ev("(()=>{const z=document.querySelector('#hZ').textContent;return __T.hang.find(x=>x.zh===z).w})()")
          for ch in sorted(set(w)):
            if await pg.query_selector(f'#hK button[data-c="{ch}"]:not([disabled])'):await click(f'#hK button[data-c="{ch}"]')
          await pg.wait_for_timeout(1700);continue
        if await pg.query_selector('#sB'):
          await shot('sign')
          if await click('#sOk'):continue
          sg=await ev("__T.sign")
          if await vis('#sO'):await ev(f"[...document.querySelectorAll('#sO button')].find(b=>b.textContent==={json.dumps(sg['ok'])}).click()")
          else:await click(f'#sB button[data-i="{sg["w"]}"]')
          await pg.wait_for_timeout(200);continue
        if await pg.query_selector('#cL'):
          await shot('chest')
          await ev("(()=>{const w=document.querySelector('#cW').innerHTML;const it=__T.chest.find(x=>x.word===w);[...document.querySelectorAll('#cL button')].find(b=>b.textContent===it.okL).click();[...document.querySelectorAll('#cR button')].find(b=>b.textContent===it.okR).click()})()")
          await pg.wait_for_timeout(2100);continue
        if await pg.query_selector('#oS'):
          await shot('order')
          await ev("(()=>{const have=[...document.querySelectorAll('#oA button,#oS button')].map(b=>b.textContent).sort().join('|');const s=__T.order.find(x=>x.slice().sort().join('|')===have);if(!s)return;for(const w of s){const b=[...document.querySelectorAll('#oS button')].find(b=>b.textContent===w);if(b)b.click()}document.querySelector('#oC').click()})()")
          await pg.wait_for_timeout(2200);continue
        if await pg.query_selector('#lsv'):
          await shot('lens_'+(await ev("document.querySelector('#mBody h3').textContent")))
          if await pg.query_selector('#lDone'):await pg.wait_for_timeout(300);await click('#lDone');continue
          tg=await ev("__T.lens.targets")
          for t in tg:
            await ev(f"(()=>{{const sv=document.querySelector('#lsv');const p=sv.createSVGPoint();p.x={t['x']};p.y={t['y']};const q=p.matrixTransform(sv.getScreenCTM());sv.dispatchEvent(new PointerEvent('pointerdown',{{clientX:q.x,clientY:q.y,bubbles:true}}))}})()")
            await pg.wait_for_timeout(150)
          await pg.wait_for_timeout(1500);continue
        if await pg.query_selector('.fpopts'):
          await shot('finger');await click('.fpopts button[data-ok="1"]');await pg.wait_for_timeout(1500);continue
        if await pg.query_selector('#tg'):
          await shot('tiles')
          await ev("(()=>{const o=__T.ord;for(let k=0;k<9;k++){const ord=o();if(ord[k]===k)continue;const j=ord.indexOf(k);document.querySelector(`#tg button[data-k='${k}']`).click();document.querySelector(`#tg button[data-k='${j}']`).click()}})()")
          await pg.wait_for_timeout(1800);continue
        if await pg.query_selector('#fs'):
          await shot('fraction')
          await ev("(()=>{const t=document.querySelector('#fq').innerHTML;const Q=__T.frac.find(q=>q.q===t);for(let k=0;k<Q.a;k++)document.querySelector(`#fs [data-k='${k}']`).dispatchEvent(new MouseEvent('click',{bubbles:true}));document.querySelector('#fok').click()})()")
          await pg.wait_for_timeout(1800);continue
        if await pg.query_selector('#cz'):
          await shot('circuit')
          if await click('#czok'):continue
          for k in [0,1,2]:
            await ev(f"(()=>{{const g=document.querySelector('#cz [data-k=\"{k}\"]');if(g)g.dispatchEvent(new MouseEvent('click',{{bubbles:true}}))}})()");await pg.wait_for_timeout(100)
          continue
        if await pg.query_selector('#ck'):
          await shot('cipher')
          await ev("(()=>{const t=document.querySelector('#cn').textContent;const R=__T.ciph.find(r=>r.n.join(' - ')===t);const filled=[...document.querySelectorAll('#cs .slot')].filter(s=>s.textContent).length;for(const c of R.a.slice(filled))document.querySelector(`#ck button[data-c='${c}']`).click()})()")
          await pg.wait_for_timeout(2000);continue
        if await pg.query_selector('#sS'):
          await shot('seq_'+(await ev("document.querySelector('#mBody h3').textContent")))
          await ev("(()=>{const n=document.querySelectorAll('#sS button').length;for(let k=0;k<n;k++)document.querySelector(`#sS button[data-k='${k}']`).click();document.querySelector('#sC').click()})()")
          await pg.wait_for_timeout(1700);continue
        await pg.wait_for_timeout(300);continue
      if await vis('#choices'):
        await shot('choices')
        btns=await pg.query_selector_all('#choices button:not([disabled])')
        if await pg.query_selector('#choices button[data-ok]'):
          for i in range(3):await click(f'#choices button[data-i="{i}"]')
          await click('#choices button[data-ok]');await pg.wait_for_timeout(300);continue
        if btns:await btns[0].click()
        await pg.wait_for_timeout(250);continue
      if await vis('#dlg'):
        sid=await ev("(()=>{const S=__T.SC();return S&&S.inv?S.id:null})()")
        if sid:
          DL[sid]=DL.get(sid,0)+1
          if DL[sid] in (3,9):await pg.wait_for_timeout(600);await shot(f'dlg_{sid}_{DL[sid]}')
        await click('#dlg');await pg.wait_for_timeout(120);continue
      st=await ev("(()=>{const S=__T.SC();if(!S)return null;return {id:S.id,mode:!!S.mode,inv:!!S.inv,need:S.spots.filter(s=>s.need&&!s.done&&!s.hidden).map(s=>s.id)}})()")
      if not st:await pg.wait_for_timeout(200);continue
      key=st['id'];await shot('scene_'+key)
      if st['mode']:
        if key=='wall':
          await ev("(()=>{const e=document.querySelector('#spotL .spot[data-id=\"X\"]');if(e)e.dispatchEvent(new MouseEvent('click',{bubbles:true}))})()");await pg.wait_for_timeout(150);continue
        if key=='street':
          await ev("document.querySelector('#spotL .spot[data-id=\"p8\"]').dispatchEvent(new MouseEvent('click',{bubbles:true}))");await pg.wait_for_timeout(300);continue
        lst=await ev("__T.listen")
        await shot('listen')
        for k in lst:
          k=k if isinstance(k,str) else k['id']
          await ev(f"(()=>{{const e=document.querySelector('#spotL .spot[data-id=\"{k}\"]');if(e)e.dispatchEvent(new MouseEvent('click',{{bubbles:true}}))}})()");await pg.wait_for_timeout(1000)
        continue
      if st['inv'] and key=='obs' and not PEEKED.get('save'):
        nd=await ev("__T.SC().spots.filter(s=>s.need&&s.done).length")
        if nd>=3:
          PEEKED['save']=nd;await click('#pauseBtn');await pg.wait_for_timeout(400);await shot('pause');await click('#pzHome');await pg.wait_for_timeout(1500)
          await shot('title_resume');await click('#resBtn');await pg.wait_for_timeout(1500);continue
      if PEEKED.get('save') and not PEEKED.get('chk') and st['inv'] and key=='obs':
        nd=await ev("__T.SC().spots.filter(s=>s.need&&s.done).length");PEEKED['chk']=1;print('RESUME CHECK saved',PEEKED['save'],'restored',nd,flush=True)
      if st['inv']:
        if st['need']:
          nid=st['need'][0]
          if last!=nid:print(key,'->',nid,flush=True);last=nid
          await ev(f"document.querySelector('#spotL .spot[data-id=\"{nid}\"]').dispatchEvent(new MouseEvent('click',{{bubbles:true}}))");await pg.wait_for_timeout(300)
        else:await click('#deduceBtn');await pg.wait_for_timeout(300)
        continue
      await pg.wait_for_timeout(200)
    print('errors:',errs[:5]);print('G:',await ev("JSON.stringify({e:__T.G().energy,c:__T.G().clues.length,ch:__T.G().ch})"))
    json.dump(SHOTS,open(os.path.join(OUT,'shots.json'),'w'));print('ROUND G:',await ev('JSON.stringify(__T.G().round)'),'meta',await ev("localStorage.getItem('duoshu-meta')"))
    await b.close()
asyncio.run(main())
