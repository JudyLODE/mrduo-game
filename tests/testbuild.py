"""在打包檔裡加入測試掛勾（__T），輸出 tests/out/t.html 給 autoplay.py 用。先執行 tools/bundle.py。"""
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(ROOT,"tests","out");os.makedirs(OUT,exist_ok=True)
s=open(os.path.join(ROOT,'dist','bundle.html'),encoding='utf-8').read()
def R(a,b):
    global s
    assert a in s,a[:80];s=s.replace(a,b,1)
R('const $=s=>document.querySelector(s);','window.__T={};const $=s=>document.querySelector(s);')
R("function calc(title,qs,o={}){return new Promise(res=>{","function calc(title,qs,o={}){__T.calc=qs;return new Promise(res=>{")
R("function lens(title,lead,o){return new Promise(res=>{","function lens(title,lead,o){__T.lens=o;return new Promise(res=>{")
R("function tiles(title,pic){return new Promise(res=>{let ord;do{ord=shuffle([0,1,2,3,4,5,6,7,8])}while(ord.every((v,k)=>v===k));","function tiles(title,pic){return new Promise(res=>{let ord;do{ord=shuffle([0,1,2,3,4,5,6,7,8])}while(ord.every((v,k)=>v===k));__T.ord=()=>ord;")
R("function fraction(title,qs){return new Promise(res=>{","function fraction(title,qs){__T.frac=qs;return new Promise(res=>{")
R("function cipher(title,rounds){return new Promise(res=>{","function cipher(title,rounds){__T.ciph=rounds;return new Promise(res=>{")
R("function signFix(sg,n){","function signFix(sg,n){__T.sign=sg;")
R("function chest(items){","function chest(items){__T.chest=items;")
R("function order(sents){","function order(sents){__T.order=sents;")
R("function hangman(words){","function hangman(words){__T.hang=words;")
R("function listenHunt(list){","function listenHunt(list){__T.listen=list;")
R("      function render(){","      __T.mlw=()=>i<ds.length?ds[i]*bb+c:null;\n      function render(){")
R("let SC=null,busy=false;","let SC=null,busy=false;__T.SC=()=>SC;__T.G=()=>G;")
open(os.path.join(OUT,'t.html'),'w',encoding='utf-8').write('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">'+s)
print('ok')
