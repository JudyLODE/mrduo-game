"""從 art-src/duo/ 的去背原圖（高解析、無損）輸出遊戲用的 assets/duo/*.webp，並更新 js/assets.js 的寬高比。
用法：python3 tools/art/export_duo.py [名稱 ...]   （不給名稱 = 全部重新輸出）
新增多叔的新表情：把去背好的 PNG/WebP 放進 art-src/duo/，在 SIZES 加一行（高度），再執行本程式。
需要：pip install pillow numpy opencv-contrib-python"""
import sys,os,re,json
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
from defringe import defringe
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC=os.path.join(ROOT,'art-src','duo');DST=os.path.join(ROOT,'assets','duo')
COAT_H={'coat_front':900,'coat_stand':620,'coat_side':620,'coat_tip':720,'coat_pocket':900,'coat_shy':900,'coat_puzzled':900,'bust_coat':440,'bust_sweater':440,'face_ref':260}
def height(n):return COAT_H.get(n,760)
def opts(n):
    if n.startswith('coat') or n=='bust_coat':return dict(holeg=228,holesd=1.3,pure=True,**({'choke':3} if n=='bust_coat' else {}))
    if n=='bust_sweater':return dict(choke=2,band=6)
    return {}
names=sys.argv[1:] or [f.rsplit('.',1)[0] for f in os.listdir(SRC)]
assets=open(os.path.join(ROOT,'js','assets.js'),encoding='utf-8').read()
for n in names:
    src=[f for f in os.listdir(SRC) if f.rsplit('.',1)[0]==n][0]
    im=defringe(Image.open(os.path.join(SRC,src)),**opts(n));h=height(n)
    im=im.resize((round(im.width*h/im.height),h),Image.LANCZOS);a=im.getchannel('A').point(lambda v:0 if v<10 else v);im.putalpha(a);im=im.crop(a.getbbox())
    out='face' if n=='face_ref' else n
    im.save(os.path.join(DST,out+'.webp'),'WEBP',quality=84,method=6)
    r=round(im.width/im.height,4)
    assets,k=re.subn(r'("%s":\{\s*"b":"assets/duo/%s\.webp",\s*"r":)[0-9.]+'%(out,out),r'\g<1>%s'%r,assets)
    print(out,im.size,'r=',r,'(js/assets.js 已更新)' if k else '(新圖片：請手動加進 js/assets.js)')
open(os.path.join(ROOT,'js','assets.js'),'w',encoding='utf-8').write(assets)
