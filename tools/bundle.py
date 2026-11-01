"""把 index.html + style.css + js/*.js + assets 打包成「單一 HTML 檔」。
用途：Claude 的 artifact 預覽、自動測試。GitHub Pages 不需要打包，直接用原始檔。
用法：python3 tools/bundle.py [輸出路徑]（預設 dist/bundle.html）"""
import re,sys,os,base64
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(ROOT,'dist','bundle.html')
html=open(os.path.join(ROOT,'index.html'),encoding='utf-8').read()
def datauri(path):
    ext=path.rsplit('.',1)[1];mime={'webp':'image/webp','png':'image/png','jpg':'image/jpeg','svg':'image/svg+xml'}[ext]
    return f'data:{mime};base64,'+base64.b64encode(open(os.path.join(ROOT,path),'rb').read()).decode()
def inline_js(m):
    src=m.group(1);code=open(os.path.join(ROOT,src),encoding='utf-8').read()
    code=re.sub(r'"(assets/[^"]+\.(?:webp|png|jpg|svg))"',lambda k:'"'+datauri(k.group(1))+'"',code)
    return '<script>\n'+code.replace('</script>','<\\/script>')+'\n</script>'
html=re.sub(r'<script src="([^"]+)"></script>',inline_js,html)
html=html.replace('<link rel="stylesheet" href="style.css">','<style>\n'+open(os.path.join(ROOT,'style.css'),encoding='utf-8').read()+'</style>')
html=re.sub(r'<script>if\(\'serviceWorker\'.*?</script>\n','',html,flags=re.S)
html=html.replace('<link rel="manifest" href="manifest.webmanifest">\n','')
html=re.sub(r'<link rel="(apple-touch-icon|icon)"[^>]*>\n','',html)
html=html.replace('<title>','<meta name="claude:viewport-fit-sides" content="cover">\n<title>',1)
os.makedirs(os.path.dirname(out),exist_ok=True);open(out,'w',encoding='utf-8').write(html)
print('bundle ->',out,len(html)//1024,'KB')
