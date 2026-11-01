import numpy as np,cv2
from PIL import Image
def defringe(im,choke=4,band=10,holeg=249,holesd=0.6,pure=False):
    a=np.array(im.convert('RGBA')).astype(np.float32);rgb=a[...,:3];al=a[...,3]/255
    # 0) drop flat, bright, colourless leftovers of the studio backdrop near the silhouette
    g=cv2.cvtColor(rgb.astype(np.uint8),cv2.COLOR_RGB2GRAY).astype(np.float32);mu=cv2.blur(g,(7,7));sd=np.sqrt(np.maximum(cv2.blur(g*g,(7,7))-mu*mu,0))
    sat=cv2.cvtColor(rgb.astype(np.uint8),cv2.COLOR_RGB2HSV)[...,1]
    dist0=cv2.distanceTransform((al>0.05).astype(np.uint8),cv2.DIST_L2,5)
    fl=((g>min(224,holeg))&(sd<max(1.8,holesd))&(sat<18)&(al>0.05)).astype(np.uint8)
    flat=np.zeros_like(fl)
    nc,lab,st,_=cv2.connectedComponentsWithStats(fl,8)
    for k in range(1,nc):
        reg=lab==k;area=st[k,4]
        if area>300 and g[reg].mean()>holeg and sd[reg].mean()<holesd: flat[reg]=1   # enclosed backdrop hole
    flat|=(fl&(dist0<5)).astype(np.uint8)
    if pure:   # coat photos: fur is grey, so any sizable near-white patch is backdrop
        pw=((g>240)&(sat<16)&(al>0.05)).astype(np.uint8);nc,lab,st,_=cv2.connectedComponentsWithStats(pw,8)
        for k in range(1,nc):
            if st[k,4]>150:flat[lab==k]=1
        flat=cv2.dilate(flat,np.ones((3,3),np.uint8))
    al=al*(1-cv2.GaussianBlur(flat.astype(np.float32),(5,5),0))
    # 1) choke alpha: shrink the silhouette and steepen the soft edge
    al=cv2.erode(al,np.ones((2*choke+1,2*choke+1),np.uint8))
    al=np.clip((al-0.25)/0.6,0,1)
    al=cv2.GaussianBlur(al,(3,3),0)
    # 2) pull edge colours from the interior so no light background survives at the rim
    core=(cv2.erode((al>0.99).astype(np.uint8),np.ones((2*band+1,2*band+1),np.uint8))).astype(np.float32)
    acc=rgb*core[...,None];w=core.copy()
    k=31
    num=cv2.GaussianBlur(acc,(k,k),0);den=cv2.GaussianBlur(w,(k,k),0)[...,None]
    fill=num/np.maximum(den,1e-4)
    # second, wider pass for thin parts (fingers) where the core vanished
    num2=cv2.GaussianBlur(acc,(91,91),0);den2=cv2.GaussianBlur(w,(91,91),0)[...,None]
    fill=np.where(den>0.02,fill,num2/np.maximum(den2,1e-4))
    dist=cv2.distanceTransform((al>0.02).astype(np.uint8),cv2.DIST_L2,5)
    t=np.clip(1-(dist-1)/band,0,1)[...,None]          # 1 at the rim -> 0 inside
    lum=rgb.mean(2,keepdims=True);flum=fill.mean(2,keepdims=True)
    lighter=(lum>flum+4).astype(np.float32)           # only fix pixels brighter than the fur behind them
    out=rgb*(1-t*lighter)+np.minimum(rgb,fill)*(t*lighter)
    al[al<0.08]=0
    return Image.fromarray(np.dstack([np.clip(out,0,255),al*255]).astype(np.uint8),'RGBA')
