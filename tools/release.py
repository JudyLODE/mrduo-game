"""發布前執行：更新 sw.js 的快取版本號與離線檔案清單。之後 commit + push，GitHub Pages 會自動更新。
用法：python3 tools/release.py"""
import os,re
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
files=['./','index.html','style.css','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png']
files+=['js/'+f for f in sorted(os.listdir(os.path.join(ROOT,'js'))) if f.endswith('.js')]
files+=['assets/duo/'+f for f in sorted(os.listdir(os.path.join(ROOT,'assets','duo')))]
p=os.path.join(ROOT,'sw.js');sw=open(p,encoding='utf-8').read()
v=int(re.search(r"mrduo-v(\d+)",sw).group(1))+1
sw=re.sub(r"mrduo-v\d+",f"mrduo-v{v}",sw)
sw=re.sub(r"const FILES=\[.*?\];","const FILES="+repr(files).replace("'",'"')+";",sw,flags=re.S)
open(p,'w',encoding='utf-8').write(sw);print('sw.js -> mrduo-v%d, %d files'%(v,len(files)))
