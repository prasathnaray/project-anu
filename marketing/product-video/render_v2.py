"""Screen-led ANU product demo: real React captures, choreographed camera, cursor and sound.
Capture first with capture-product.cjs. No production service or user data is used.
"""
from pathlib import Path
import json, math, subprocess, argparse, wave
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import render as base

P=Path(__file__).resolve().parent
W,H,FPS=1920,1080,30
M=json.loads((P/'captures/manifest.json').read_text())
BG='#0B1214';WHITE='#F8FAF4';LIME='#AAE767'

def ease(t):
    t=max(0,min(1,t));return t*t*t*(t*(t*6-15)+10)

def lerp(a,b,t):return a+(b-a)*t

@lru_cache(None)
def shot(name):return Image.open(P/'captures'/f'{name}.png').convert('RGB')

@lru_cache(None)
def stage():
    yy,xx=np.mgrid[0:H,0:W]
    a=np.exp(-(((xx-1500)/1100)**2+((yy-500)/850)**2))[:,:,None]
    b=np.exp(-(((xx-300)/700)**2+((yy-900)/600)**2))[:,:,None]
    rgb=np.array([10,17,20])+a*np.array([3,23,27])+b*np.array([8,12,1])
    return Image.fromarray(rgb.astype('uint8')).convert('RGBA')

def camera(name,cx,cy,width):
    height=width*H/W
    cx=max(width/2,min(1440-width/2,cx));cy=max(height/2,min(810-height/2,cy))
    # Captures have two device pixels per CSS pixel.
    rect=((cx-width/2)*2,(cy-height/2)*2,(cx+width/2)*2,(cy+height/2)*2)
    return shot(name).resize((W,H),Image.Resampling.BICUBIC,box=rect).convert('RGBA')

def cursor(im,x,y,clickage=None):
    d=ImageDraw.Draw(im)
    if clickage is not None and 0<=clickage<.5:
        t=clickage/.5;r=14+48*t
        d.ellipse((x-r,y-r,x+r,y+r),outline=(141,198,63,round(230*(1-t))),width=4)
    pts=[(x,y),(x+6,y+38),(x+16,y+28),(x+25,y+45),(x+34,y+40),(x+25,y+24),(x+40,y+20)]
    d.polygon([(a+2,b+3) for a,b in pts],fill=(0,0,0,70))
    d.polygon(pts,fill='#172726',outline='white',width=3)

def project(pt,cam):
    cx,cy,width=cam;s=W/width
    height=width*H/W
    cx=max(width/2,min(1440-width/2,cx));cy=max(height/2,min(810-height/2,cy))
    return (pt[0]-(cx-width/2))*s,(pt[1]-(cy-width*H/W/2))*s

def caption(im,message,t,start,end):
    a=ease((t-start)/.35)*(1-ease((t-end+.25)/.25))
    if a<=0:return
    f=base.font(37,'bold');tw=ImageDraw.Draw(im).textlength(message,font=f)
    layer=Image.new('RGBA',(round(tw+90),91))
    base.box(layer,(0,0,layer.width-1,90),(12,24,26,241),24)
    base.text(layer,(45,18),message,37,WHITE,'bold')
    base.placed(im,layer,(W-layer.width)/2,932+22*(1-a),a)

def badge(im):
    layer=Image.new('RGBA',(265,37));base.box(layer,(0,0,264,36),(14,30,30,205),18)
    base.text(layer,(17,6),'ACTUAL PRODUCT · DEMO DATA',14,WHITE,'bold')
    base.placed(im,layer,1620,20)

# Continuous camera path in CSS coordinates. The camera follows actual controls.
# t, center x, center y, viewport width
KEYS=[
 (3,720,405,1440),(5.3,720,405,1440),
 (7.0,550,305,920),(8.3,550,305,920),(9,950,360,930),
 (10.2,1030,394,800),(12.2,1030,394,800),
 (12.8,720,405,1050),(14.0,720,387,890),(17.1,720,427,890),
 (17.5,1030,400,850),(18.8,1120,463,625),
 (19.2,720,405,1040),(21,720,375,895),(23.1,720,440,895),
 (23.5,980,348,960),(26,980,348,920),
 (26.5,1000,330,900),(28.6,1000,330,875),
 (29,720,405,1440),(30.5,835,316,1120),(31.8,835,316,1120),
 (32,805,350,1110),(33.2,650,297,815),(36.5,680,360,825),
 (37,720,380,1110),(39.6,645,272,920),(40,720,405,1440),
 (42,720,405,1440)
]

def cam_at(t):
    for a,b in zip(KEYS,KEYS[1:]):
        if a[0]<=t<b[0]:
            v=ease((t-a[0])/(b[0]-a[0]));return tuple(lerp(a[i],b[i],v) for i in (1,2,3))
    return tuple(KEYS[-1][1:])

def screen_at(t):
    for start,name in reversed([(3,'learning'),(9,'anatomy'),(12.8,'questions'),(17.5,'anatomy'),(19.2,'score'),(23.5,'practice'),(26.5,'interpret'),(29,'dashboard'),(32,'competency'),(37,'path'),(40,'learning'),(40.65,'questions'),(41.3,'competency')]):
        if t>=start:return name
    return 'learning'

def motion_cursor(t,cam):
    A=M['actions'];q=lambda key:(A[key]['x'],A[key]['y'])
    paths=[(5.5,8.9,(430,500),q('anatomy')),(9,12.65,q('anatomy'),q('questions')),(17.5,19.1,q('questions'),q('score')),(23.5,26.4,q('practice'),q('interpret'))]
    for start,end,a,b in paths:
        if start<=t<=end+.5:
            e=ease((t-start)/(end-start-.4));p=(lerp(a[0],b[0],e),lerp(a[1],b[1],e))
            return (*project(p,cam),t-end if t>=end else None)
    return None

def intro(t):
    im=stage().copy()
    # UI detail flashes carry the hook into the live interface in under 3 seconds.
    i=min(2,int(t/.82));word=['Learn.','Practice.','Progress.'][i]
    names=['learning','questions','competency']
    v=ease((t-i*.82)/.55)
    layer=shot(names[i]).resize((1536,864),Image.Resampling.LANCZOS).convert('RGBA')
    layer=layer.rotate(-6+i*4,Image.Resampling.BICUBIC,expand=True)
    base.placed(im,layer,680+90*(1-v),205,.23)
    base.placed(im,base.logo(61),96,85)
    base.text(im,(181,85),'ANU',47,WHITE,'bold')
    base.text(im,(102,429+60*(1-v)),word,166,LIME if i==2 else WHITE,'bold')
    base.text(im,(110,674),'ULTRASOUND TRAINING. CONNECTED.',25,'#9BB2B3','bold')
    return im

def outro(t):
    im=stage().copy();a=ease((t-42)/.65)
    # The application recedes into the final ANU lockup.
    s=lerp(.92,.34,a);ui=shot('learning').resize((round(1920*s),round(1080*s)),Image.Resampling.LANCZOS).convert('RGBA')
    base.placed(im,ui,lerp(77,1150,a),lerp(43,338,a),1-a*.65)
    l=Image.new('RGBA',(1500,850));base.placed(l,base.logo(95),0,0)
    base.text(l,(134,7),'ANU',78,WHITE,'bold')
    base.text(l,(0,165),'One place.',100,WHITE,'bold')
    base.text(l,(0,285),'Every next step.',100,LIME,'bold')
    base.text(l,(5,471),'Ultrasound learning, connected.',32,'#B3C5C3')
    base.box(l,(0,574,307,646),LIME,36);base.text(l,(33,588),'Discover ANU',29,'#152B27','bold');base.arrow(l,261,611,'#152B27')
    base.placed(im,l,105,155,a)
    return im

CAPS=[(3.3,8.6,'Find your next module.'),(9.4,12.5,'Open a topic. Go deeper.'),(13.2,17.2,'Review MindSparks.'),(19.6,23.2,'See the score. Review the answers.'),(23.8,26.2,'Keep practice in the same workflow.'),(26.8,28.8,'Track image interpretation.'),(29.4,31.7,'Bring it all into focus.'),(32.5,36.8,'See strengths. Find the next focus.'),(37.4,39.8,'Keep your learning path in view.')]

def render(t):
    if t<3:im=intro(t)
    elif t>=42:im=outro(t)
    else:
        cam=cam_at(t);im=camera(screen_at(t),*cam)
        if t<4:
            # Accelerating reveal from a floating application into a full-screen demo.
            a=ease(t-3);s=lerp(.84,1,a)
            lay=im.resize((round(W*s),round(H*s)),Image.Resampling.BICUBIC)
            im=stage().copy();base.placed(im,lay,(W-lay.width)/2,(H-lay.height)/2)
        cur=motion_cursor(t,cam)
        if cur:cursor(im,*cur)
        badge(im)
        for start,end,message in CAPS:
            if start<=t<=end:caption(im,message,t,start,end)
        # Match cuts use brief dissolves rather than repeated slide entrances.
        for cut in [12.8,19.2,23.5,26.5,29,32,37]:
            if cut<=t<cut+.12:
                old=camera(screen_at(cut-.02),*cam_at(cut-.02))
                im=Image.blend(old,im,ease((t-cut)/.12))
    return im.convert('RGB')

def audio():
    sr=48000;n=45*sr;rng=np.random.default_rng(72);out=np.zeros((n,2))
    def add(sig,st,pan=0):
        i=int(st*sr);end=min(n,i+len(sig))
        if i<0 or end<=i:return
        out[i:end,0]+=sig[:end-i]*math.sqrt((1-pan)/2);out[i:end,1]+=sig[:end-i]*math.sqrt((1+pan)/2)
    beat=.5;chords=[[50,57,61,64],[47,54,57,62],[43,50,54,57],[45,52,57,59]]
    for bar in range(12):
        chord=chords[bar%4]
        for j,midi in enumerate(chord):
            t=np.arange(sr*5)/sr;freq=440*2**((midi-69)/12)
            add(np.sin(2*np.pi*freq*t)*(1-np.exp(-t*3))*np.exp(-t*.55)*np.minimum(1,(5-t)/.8)*.048,bar*4,(j-1.5)*.35)
        for step in range(16):
            st=bar*4+step*.25
            if st>42:continue
            midi=chord[[0,2,1,3,2,1,3,2][step%8]]+12
            t=np.arange(int(sr*.9))/sr;freq=440*2**((midi-69)/12)
            sig=(np.sin(2*np.pi*freq*t)+.15*np.sin(2*np.pi*freq*2*t))*np.exp(-t*7)*(1-np.exp(-t*350))*.07
            add(sig,st,.3 if step%2 else -.3);add(sig*.18,st+.375,-.3)
    for i in range(6,84):
        st=i*beat;t=np.arange(int(sr*.25))/sr
        add(np.sin(2*np.pi*(48*t+2*(1-np.exp(-35*t))))*np.exp(-t*23)*.19,st)
        if i%2:
            noise=rng.normal(0,1,len(t));add(noise*np.exp(-t*50)*.017,st,.1)
        t=np.arange(int(sr*.05))/sr;noise=rng.normal(0,1,len(t));add(np.diff(noise,prepend=0)*np.exp(-t*90)*.012,st+.25,.35)
    for st in [8.9,12.65,19.1,23.4,26.4]:
        t=np.arange(int(sr*.07))/sr;sig=np.sin(2*np.pi*1150*t)*np.exp(-t*95)*.08
        add(sig,st)
    for st in [3,9,12.8,19.2,29,32,37,42]:
        t=np.arange(int(sr*.5))/sr;noise=rng.normal(0,1,len(t));noise=np.convolve(noise,np.ones(16)/16,mode='same')
        add(noise*np.sin(np.pi*t/.5)**2*.1,st-.18,-.25)
    t=np.arange(n)/sr;out*=np.minimum(1,t/.25)[:,None]*np.minimum(1,(45-t)/1.7)[:,None]
    out=np.tanh(out);out*=.8/abs(out).max()
    with wave.open(str(P/'anu-v2-score.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((out*32767).astype('<i2').tobytes())

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--preview',action='store_true');a=parser.parse_args()
    if a.preview:
        ts=[1.9,4.2,7.5,10.8,15.4,21,25,27.7,30.5,34.5,38.5,43.7]
        out=Image.new('RGB',(1440,4*270))
        for i,t in enumerate(ts):
            im=render(t);im.save(P/f'v2-frame-{i:02}.jpg',quality=94);out.paste(im.resize((480,270)),((i%3)*480,(i//3)*270))
        out.save(P/'v2-contact-sheet.jpg',quality=94);render(4.5).save(P/'poster-v2.jpg',quality=95);return
    audio();ff=base.imageio_ffmpeg.get_ffmpeg_exe()
    cmd=[ff,'-y','-hide_banner','-loglevel','warning','-f','rawvideo','-pix_fmt','rgb24','-s','1920x1080','-r','30','-i','-','-i',str(P/'anu-v2-score.wav'),'-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-af','loudnorm=I=-17:TP=-1.5:LRA=8','-ar','48000','-movflags','+faststart','-t','45','-metadata','title=ANU | Product in motion',str(P/'anu-product-demo-v2-1080p.mp4')]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        for i in range(1350):
            proc.stdin.write(render(i/FPS).tobytes())
            if i%150==0:print(f'Rendered {i/FPS:.0f}s / 45s',flush=True)
    finally:proc.stdin.close()
    if proc.wait():raise RuntimeError('Encode failed')
    subprocess.run([ff,'-y','-hide_banner','-loglevel','warning','-i',str(P/'anu-product-demo-v2-1080p.mp4'),'-c:v','libx264','-preset','fast','-crf','24','-c:a','aac','-b:a','128k','-ar','48000','-movflags','+faststart',str(P/'anu-product-demo-v2-web.mp4')],check=True)
    print('V2 complete.',flush=True)

if __name__=='__main__':main()
