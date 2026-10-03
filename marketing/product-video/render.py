"""ANU product film. Deterministic Pillow motion design + original synthesized score.

Run with Python 3, Pillow, NumPy and imageio-ffmpeg installed.
All product UI is an illustrative reconstruction, never connected to user data.
"""
from pathlib import Path
from functools import lru_cache
import argparse, json, math, os, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(ROOT / 'scratch/video-deps'))
import imageio_ffmpeg

W, H, FPS, DURATION = 1920, 1080, 30, 45
INK = '#132D32'
MUTED = '#667977'
PAPER = '#F4F5EE'
WHITE = '#FFFFFF'
CYAN = '#0AAFD6'
LIME = '#A8D65D'
GREEN = '#557D2C'
DARK = '#102B30'
FONT_DIR = Path(os.environ.get('WINDIR', 'C:/Windows')) / 'Fonts'
STORY = json.loads((HERE / 'storyboard.json').read_text(encoding='utf-8'))

@lru_cache(None)
def font(size, weight='regular'):
    return ImageFont.truetype(str(FONT_DIR / {'regular':'segoeui.ttf','bold':'segoeuib.ttf','light':'segoeuil.ttf'}[weight]), int(size))

def text(im, xy, value, size=26, fill=INK, weight='regular', anchor=None):
    ImageDraw.Draw(im).text(xy, str(value), font=font(size,weight), fill=fill, anchor=anchor, stroke_width=0)

def box(im, rect, fill=WHITE, radius=24, outline=None, width=1):
    ImageDraw.Draw(im).rounded_rectangle(tuple(map(round,rect)), radius, fill=fill, outline=outline, width=width)

def line(im, pts, fill, width=2):
    ImageDraw.Draw(im).line(pts, fill=fill, width=width, joint='curve')

def ease(x):
    x = max(0,min(1,x))
    return 1-(1-x)**3

def smooth(x):
    x = max(0,min(1,x))
    return x*x*(3-2*x)

def placed(base, layer, x=0, y=0, opacity=1):
    if opacity<=0: return
    if opacity<1:
        layer=layer.copy()
        layer.putalpha(layer.getchannel('A').point(lambda a:round(a*opacity)))
    base.alpha_composite(layer,(round(x),round(y)))

def reveal(base, layer, t, start=0, x=0, y=0, travel=38):
    a=ease((t-start)/.85)
    placed(base,layer,x,y+(1-a)*travel,a)

def label(im,x,y,value,dark=False):
    text(im,(x,y),value,19,LIME if dark else GREEN,'bold')

def pill(im,x,y,value,fill='#EAF0E0',color=GREEN,size=21):
    tw=ImageDraw.Draw(im).textlength(value,font=font(size,'bold'))
    box(im,(x,y,x+tw+36,y+42),fill,21)
    text(im,(x+18,y+6),value,size,color,'bold')

def check(im,x,y,color=GREEN,r=15):
    ImageDraw.Draw(im).ellipse((x-r,y-r,x+r,y+r),fill=color)
    line(im,[(x-6,y),(x-1,y+5),(x+7,y-5)],WHITE,3)

def arrow(im,x,y,color=INK):
    line(im,[(x,y),(x+22,y)],color,3)
    line(im,[(x+14,y-8),(x+22,y),(x+14,y+8)],color,3)

def icon(im,x,y,kind,color=CYAN,size=30):
    d=ImageDraw.Draw(im); s=size
    if kind=='book':
        d.rounded_rectangle((x,y,x+s,y+s),5,outline=color,width=2)
        line(im,[(x+s/2,y),(x+s/2,y+s)],color,2)
        line(im,[(x+5,y+9),(x+10,y+9)],color,2)
    elif kind=='chart':
        for i,h in enumerate([.4,.65,1]): box(im,(x+i*s*.36,y+s*(1-h),x+i*s*.36+s*.22,y+s),color,3)
    elif kind=='play':
        d.ellipse((x,y,x+s,y+s),outline=color,width=2)
        d.polygon([(x+s*.41,y+s*.28),(x+s*.73,y+s*.5),(x+s*.41,y+s*.72)],fill=color)
    elif kind=='people':
        for dx,dy in [(0,5),(s*.6,0)]:
            d.ellipse((x+dx,y+dy,x+dx+12,y+dy+12),outline=color,width=2)
            d.arc((x+dx-4,y+dy+15,x+dx+16,y+dy+34),180,360,fill=color,width=2)
    else:
        d.rounded_rectangle((x,y,x+s,y+s),6,outline=color,width=2)
        line(im,[(x+7,y+15),(x+13,y+21),(x+24,y+8)],color,2)

@lru_cache(None)
def logo(h=100):
    im=Image.open(ROOT/'client/src/assets/image (3).png').convert('RGBA')
    # Original ANU symbol, extracted without changing its geometry or color.
    im=im.crop((96,27,308,225))
    return im.resize((round(im.width*h/im.height),h),Image.Resampling.LANCZOS)

def brand(im,x=96,y=60,dark=False,large=False):
    h=70 if large else 40
    placed(im,logo(h),x,y)
    text(im,(x+h*1.32,y-4 if not large else y-11),'ANU',64 if large else 34,WHITE if dark else INK,'bold')

@lru_cache(None)
def background(dark=False):
    yy,xx=np.mgrid[0:H,0:W]
    base=np.array([16,43,48] if dark else [246,247,239],dtype=np.float32)
    a=np.exp(-(((xx-1610)/650)**2+((yy-810)/590)**2))[:,:,None]
    b=np.exp(-(((xx-200)/680)**2+((yy-190)/540)**2))[:,:,None]
    rgb=base+(np.array([1,23,22]) if dark else np.array([-17,0,-15]))*a+(np.array([0,9,16]) if dark else np.array([-9,0,0]))*b
    im=Image.fromarray(np.uint8(np.clip(rgb,0,255))).convert('RGBA')
    # Fine layout hairlines keep the film architectural and calm.
    d=ImageDraw.Draw(im)
    d.line((96,130,1824,130),fill='#2E494C' if dark else '#DDE3D7',width=1)
    d.line((96,971,1824,971),fill='#2E494C' if dark else '#DDE3D7',width=1)
    return im

def frame(scene,dark=False):
    im=background(dark).copy()
    brand(im,dark=dark)
    text(im,(1824,70),'ULTRASOUND LEARNING',19,'#9BB5B5' if dark else MUTED,anchor='ra')
    text(im,(96,995),'ANU  /  LEARN. PRACTICE. PROGRESS.',17,'#9BB5B5' if dark else MUTED)
    text(im,(1824,995),f'{scene:02d} / 07',17,'#9BB5B5' if dark else MUTED,anchor='ra')
    return im

def panel(w,h):
    im=Image.new('RGBA',(w,h))
    box(im,(1,1,w-2,h-2),WHITE,28,'#DCE5DE',2)
    return im

def shadow_place(im,p,x,y,opacity=1):
    sh=Image.new('RGBA',(p.width+100,p.height+100))
    box(sh,(50,55,p.width+50,p.height+55),(13,44,45,24),28)
    sh=sh.filter(ImageFilter.GaussianBlur(22))
    placed(im,sh,x-50,y-40,opacity)
    placed(im,p,x,y,opacity)

@lru_cache(None)
def learning_panel():
    p=panel(1030,646)
    text(p,(34,23),'My Learning',29,INK,'bold')
    pill(p,841,22,'BTC',size=18)
    line(p,[(0,83),(1030,83)],'#E4E9E1')
    text(p,(32,109),'SECOND TRIMESTER',16,MUTED,'bold')
    text(p,(32,142),'Biometry',29,INK,'bold')
    for i,(name,sub,val) in enumerate([('BPD & HC','Fetal head',.72),('AC','Fetal abdomen',.34),('FL','Femur length',.14)]):
        y=206+i*110
        box(p,(25,y,273,y+93),'#F0F6E6' if i==0 else '#F7F9F5',14,'#99C959' if i==0 else '#E4E9E1')
        text(p,(42,y+12),name,23,INK,'bold');text(p,(42,y+44),sub,17,MUTED)
        box(p,(42,y+76,251,y+81),'#E0E8D8',3)
        box(p,(42,y+76,42+209*val,y+81),LIME,3)
    line(p,[(300,84),(300,646)],'#E4E9E1')
    text(p,(335,109),'BPD & HC',30,INK,'bold')
    text(p,(335,153),'A clear path through every module.',21,MUTED)
    for x,name,active in [(335,'Learn',True),(461,'Practice',False),(620,'Interpret',False),(782,'Test',False)]:
        pill(p,x,205,name,LIME if active else '#F2F5ED',INK if active else MUTED,18)
    for i,(title,sub,kind) in enumerate([('Fetal Head','Learning resources','book'),('Anatomical Landmarks','MindSparks · Quiz','check'),('Imaging the Plane','Interactive activity','play'),('Measurement','Learning resources','book')]):
        y=274+i*81
        box(p,(333,y,996,y+68),'#F9FAF7',13)
        icon(p,354,y+19,kind,GREEN,26)
        text(p,(400,y+7),title,22,INK,'bold');text(p,(400,y+36),sub,16,MUTED)
        if i<2:check(p,962,y+33,r=12)
        else:arrow(p,946,y+33,MUTED)
    text(p,(334,611),'ILLUSTRATIVE PRODUCT VIEW · SAMPLE DATA',13,MUTED)
    return p

@lru_cache(None)
def quiz_panel():
    p=panel(820,570)
    pill(p,32,28,'MindSparks',size=18)
    text(p,(778,38),'01 / 04',19,MUTED,anchor='ra')
    text(p,(34,115),'Make every lesson active.',34,INK,'bold')
    text(p,(34,170),'Move from concepts into practice.',23,MUTED)
    for i,(title,sub) in enumerate([('Anatomical landmarks','Build visual understanding'),('Probe movements','Explore the imaging plane'),('Image diagnosis','Put your knowledge to work')]):
        y=239+i*88
        box(p,(32,y,788,y+70),'#F5F8EF',14)
        icon(p,54,y+19,['book','play','check'][i],GREEN,29)
        text(p,(108,y+8),title,23,INK,'bold');text(p,(108,y+39),sub,17,MUTED)
    text(p,(35,536),'ILLUSTRATIVE PRODUCT VIEW',13,MUTED)
    return p

@lru_cache(None)
def progress_panel():
    p=panel(1040,650)
    text(p,(34,25),'Your progress, in focus.',32,INK,'bold')
    text(p,(35,77),'Performance metrics & skill competency',22,MUTED)
    for i,(value,name) in enumerate([('8 / 12','Modules completed'),('12 h','Training time'),('5 days','Practice streak')]):
        x=32+i*335
        box(p,(x,132,x+309,249),'#F3F6ED',18)
        text(p,(x+22,145),value,40,INK,'bold');text(p,(x+23,207),name,18,MUTED)
    text(p,(35,285),'Attempt history',23,INK,'bold')
    pill(p,827,281,'Sample data',size=15)
    for j in range(4):
        y=350+j*57
        line(p,[(74,y),(976,y)],'#E3E9DF')
        text(p,(32,y-9),str(90-j*20),15,MUTED)
    for j in range(6):text(p,(82+j*176,539),f'{j+1:02}',16,MUTED)
    text(p,(35,601),'ILLUSTRATIVE DATA · NOT MEASURED CUSTOMER OUTCOMES',13,MUTED)
    return p

@lru_cache(None)
def cohort_panel():
    p=panel(1020,615)
    text(p,(34,27),'One shared view of learning.',32,INK,'bold')
    text(p,(34,78),'Batches · Instructors · Trainees',22,MUTED)
    pill(p,35,131,'Batch overview',size=18)
    for x,title in [(36,'TRAINING MODULE'),(550,'PROGRESS'),(824,'STATUS')]: text(p,(x,221),title,15,MUTED,'bold')
    for i,(name,sub,val,status) in enumerate([('Principles of Ultrasound','Foundation',.84,'In progress'),('Knobology','Imaging controls',.65,'In progress'),('BPD & HC','Second trimester · Biometry',.72,'In progress')]):
        y=274+i*99
        line(p,[(33,y-17),(985,y-17)],'#E2E8DE')
        text(p,(35,y),name,24,INK,'bold');text(p,(35,y+36),sub,18,MUTED)
        box(p,(550,y+19,779,y+29),'#E5EBDC',5);box(p,(550,y+19,550+229*val,y+29),LIME,5)
        text(p,(824,y+12),status,20,GREEN)
    text(p,(34,577),'ILLUSTRATIVE PRODUCT VIEW · SAMPLE DATA',13,MUTED)
    return p

def title_layer(lines, size=84, color=INK, leading=100):
    im=Image.new('RGBA',(1800,500))
    for i,l in enumerate(lines):text(im,(0,i*leading),l,size,color,'bold')
    return im

def scene0(t):
    im=frame(1,True)
    label(im,98,201,'FOR THE NEXT GENERATION OF ULTRASOUND TRAINING',True)
    reveal(im,title_layer(['Learning is a journey.'],105,WHITE,120),t,.1,96,280)
    reveal(im,title_layer(['Make every step count.'],105,LIME,120),t,.9,96,402)
    lay=Image.new('RGBA',(1720,290))
    for i,(name,sub,kind) in enumerate([('Learn','Build the foundation','book'),('Practice','Put knowledge to work','play'),('Progress','See what comes next','chart')]):
        x=i*560
        box(lay,(x,0,x+515,173),'#1A383C',22,'#365257')
        icon(lay,x+29,30,kind,LIME,32)
        text(lay,(x+85,22),name,31,WHITE,'bold');text(lay,(x+29,102),sub,23,'#B4C8C5')
        if i<2:arrow(lay,x+527,84,'#8CAAAB')
    reveal(im,lay,t,1.7,96,672)
    return im

def scene1(t):
    im=frame(2)
    # Ultrasound-inspired concentric arcs: graphic motif, not clinical imagery.
    arcs=Image.new('RGBA',(950,950));d=ImageDraw.Draw(arcs)
    for i in range(7):
        s=165+i*91
        d.arc((475-s/2,475-s/2,475+s/2,475+s/2),200,520,fill=(10,175,214,max(20,85-i*8)),width=2)
    arcs=arcs.rotate(-t*2.4,Image.Resampling.BICUBIC)
    placed(im,arcs,1080,80)
    reveal(im,title_layer(['Ultrasound learning,','connected.'],96,INK,112),t,.15,96,273)
    desc=Image.new('RGBA',(1450,100));text(desc,(0,0),'Meet ANU. Your learning management system.',31,MUTED)
    reveal(im,desc,t,.65,99,557)
    reveal(im,logo(195),t,.3,1435,350)
    strip=Image.new('RGBA',(1700,120))
    for x,name in [(0,'Structured modules'),(420,'Interactive learning'),(850,'Progress tracking')]:
        check(strip,x+17,29,r=13);text(strip,(x+47,8),name,26,INK)
    reveal(im,strip,t,1.2,101,746)
    return im

def scene2(t):
    im=frame(3)
    label(im,96,230,'01 / STRUCTURED LEARNING')
    reveal(im,title_layer(['A clear path.','At every step.'],74,INK,89),t,.1,92,295)
    l=Image.new('RGBA',(650,270))
    text(l,(0,0),'Courses, modules, and resources.',26,MUTED)
    text(l,(0,42),'Organized around the learner.',26,MUTED)
    pill(l,0,133,'Learn → Practice → Interpret → Test',size=18)
    reveal(im,l,t,.5,97,514)
    p=learning_panel().copy()
    # Moving locator demonstrates the learning sequence without a fake click.
    if t>1.4:
        a=smooth((t-1.4)/.6)
        row=smooth((t-3.8)/1.2)
        y1=352+81*row
        ImageDraw.Draw(p).rounded_rectangle((329,y1,999,y1+75),16,outline=(141,198,63,round(a*255)),width=3)
    y=242+(1-ease(t/.9))*55-7*smooth(t/8)
    shadow_place(im,p,796,y,ease(t/.7))
    return im

def scene3(t):
    im=frame(4,True)
    label(im,96,207,'02 / ACTIVE LEARNING',True)
    reveal(im,title_layer(['Go beyond','watching.'],87,WHITE,102),t,.1,94,284)
    l=Image.new('RGBA',(710,300))
    text(l,(0,0),'Quizzes. Interpretation. Practice.',28,'#B4C8C5')
    text(l,(0,47),'A more active way to learn.',28,'#B4C8C5')
    for i,name in enumerate(['MindSparks','OB Boosters','Practice activities']):
        pill(l,0,131+i*51,name,'#25474A',LIME,20)
    reveal(im,l,t,.5,98,536)
    q=quiz_panel().copy()
    if t>1.3:
        n=min(2,int((t-1.3)/1.5))
        yy=239+n*88
        ImageDraw.Draw(q).rounded_rectangle((32,yy,788,yy+70),14,outline='#8DC63F',width=3)
        check(q,752,yy+35,r=12)
    reveal(im,q,t,.25,968,255-5*math.sin(t*.6))
    tag=panel(475,90);check(tag,39,45);text(tag,(71,25),'Learn. Apply. Repeat.',25,INK,'bold')
    reveal(im,tag,t,2.2,1280,802,travel=22)
    return im

def scene4(t):
    im=frame(5)
    label(im,96,228,'03 / VISIBLE PROGRESS')
    reveal(im,title_layer(['See progress.','Find focus.'],78,INK,94),t,.1,92,295)
    l=Image.new('RGBA',(700,250))
    for i,s in enumerate(['Review attempts and scores.','Understand skill competency.','Choose the next step.']):text(l,(0,i*46),s,27,MUTED)
    reveal(im,l,t,.5,97,540)
    p=progress_panel().copy()
    pts=[(82,491),(258,462),(434,477),(610,412),(786,382),(962,367)]
    growth=smooth((t-.7)/3.5);n=growth*(len(pts)-1);j=int(n)
    drawpts=pts[:j+1]
    if j<len(pts)-1:
        f=n-j;drawpts.append((pts[j][0]+(pts[j+1][0]-pts[j][0])*f,pts[j][1]+(pts[j+1][1]-pts[j][1])*f))
    if len(drawpts)>1:
        ImageDraw.Draw(p).polygon(drawpts+[(drawpts[-1][0],521),(82,521)],fill='#EDF5E3')
        line(p,drawpts,GREEN,5)
    for px,py in drawpts:
        ImageDraw.Draw(p).ellipse((px-6,py-6,px+6,py+6),fill=GREEN)
    shadow_place(im,p,785,235+(1-ease(t/.85))*45,ease(t/.7))
    return im

def scene5(t):
    im=frame(6)
    label(im,96,217,'04 / CONNECTED TEAMS')
    reveal(im,title_layer(['For learners.','For educators.'],73,INK,88),t,.1,92,281)
    l=Image.new('RGBA',(690,230))
    text(l,(0,0),'Coordinate batches and instructors.',25,MUTED)
    text(l,(0,45),'Keep the learning journey in view.',25,MUTED)
    for i,(name,kind) in enumerate([('Trainees','book'),('Instructors','people'),('Admins','chart')]):
        x=i*212;icon(l,x,133,kind,GREEN,28);text(l,(x,179),name,23,INK,'bold')
    reveal(im,l,t,.5,98,516)
    shadow_place(im,cohort_panel(),805,252+(1-ease(t/.85))*50,ease(t/.7))
    return im

def scene6(t):
    im=frame(7,True)
    b=Image.new('RGBA',(500,140));brand(b,0,10,True,True)
    reveal(im,b,t,.05,98,214)
    reveal(im,title_layer(['Build the next chapter','of ultrasound learning.'],95,WHITE,113),t,.3,93,370)
    l=Image.new('RGBA',(1600,160));text(l,(0,0),'One platform. A clearer learning journey.',31,'#B4C8C5')
    reveal(im,l,t,.85,99,640)
    c=Image.new('RGBA',(500,100));box(c,(0,0,316,74),LIME,37);text(c,(31,15),'Discover ANU',28,INK,'bold');arrow(c,265,38)
    reveal(im,c,t,1.3,98,757)
    # Small repeating orbit resolves into the original mark.
    placed(im,logo(185),1540,700,ease((t-.5)/1.5))
    return im

SCENES=[scene0,scene1,scene2,scene3,scene4,scene5,scene6]
STARTS=[s['start'] for s in STORY['scenes']]

def render_frame(t):
    idx=max(i for i,st in enumerate(STARTS) if t>=st)
    local=t-STARTS[idx]
    im=SCENES[idx](local)
    # Short cross-dissolves preserve readability and carry the visual rhythm.
    if idx>0 and local<.4:
        prev=SCENES[idx-1](STARTS[idx]-STARTS[idx-1]+local)
        im=Image.blend(prev,im,smooth(local/.4))
    if t<.45:im=Image.blend(Image.new('RGBA',(W,H),DARK),im,smooth(t/.45))
    # A quiet continuous timeline ties every scene together.
    line(im,[(96,971),(96+1728*t/DURATION,971)],LIME,3)
    return im.convert('RGB')

def soundtrack():
    sr=48000;n=sr*DURATION;mix=np.zeros((n,2),np.float64)
    rng=np.random.default_rng(41)
    def add(signal,start,pan=0):
        i=round(start*sr);end=min(n,i+len(signal))
        if i>=n or end<=i:return
        mix[i:end,0]+=signal[:end-i]*math.sqrt((1-pan)/2)
        mix[i:end,1]+=signal[:end-i]*math.sqrt((1+pan)/2)
    def tone(midi,dur,amp=.1,pluck=True):
        t=np.arange(round(dur*sr))/sr;f=440*2**((midi-69)/12)
        sig=np.sin(2*np.pi*f*t)+.19*np.sin(2*np.pi*2*f*t)+.06*np.sin(2*np.pi*3*f*t)
        env=(1-np.exp(-t/(.008 if pluck else .7)))*np.exp(-t/(.65 if pluck else 5))
        env*=np.minimum(1,(dur-t)/(.1 if pluck else 1.2))
        return amp*sig*env
    beat=60/96
    chords=[[50,57,61,64,69],[47,54,57,62,66],[43,50,54,57,62],[45,52,57,59,64]]
    for bar in range(9):
        start=bar*5;chord=chords[bar%4]
        for j,midi in enumerate(chord):add(tone(midi,6,.055,False),start,(j-2)*.23)
        for step in range(16):
            st=start+step*beat/2
            if st>41.5:continue
            note=chord[[0,2,4,1,3,2,4,2][step%8]]+12
            sig=tone(note,1.7,.067 if step%2==0 else .034)
            add(sig,st,(-.42 if step%2==0 else .42))
            add(sig*.19,st+beat*.75,.35)
    for b in range(8,66):
        st=b*beat
        if b%2==0:
            t=np.arange(int(.23*sr))/sr
            kick=np.sin(2*np.pi*(44*t+2.3*(1-np.exp(-t*35))))*np.exp(-t*20)*.12
            add(kick,st)
        if b%2==1:
            t=np.arange(int(.065*sr))/sr;noise=rng.normal(0,1,len(t));noise=np.diff(noise,prepend=0)
            add(noise*np.exp(-t*95)*.01,st+.3125,.35)
    # Soft transition accents.
    for st in STARTS[1:]:
        t=np.arange(int(.65*sr))/sr;noise=rng.normal(0,1,len(t))
        noise=np.convolve(noise,np.ones(24)/24,mode='same')
        add(noise*np.sin(np.pi*t/.65)**2*.033,st-.35,-.2)
    time=np.arange(n)/sr
    mix*=np.minimum(1,time/1.5)[:,None]*np.minimum(1,(DURATION-time)/2.8)[:,None]
    mix=np.tanh(mix*1.25);mix*=.77/max(.001,np.max(np.abs(mix)))
    with wave.open(str(HERE/'anu-original-score.wav'),'wb') as f:
        f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((mix*32767).astype('<i2').tobytes())

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--preview',action='store_true');args=parser.parse_args()
    if args.preview:
        samples=[2.8,7,14.5,22,29.5,36,42.3]
        contact=Image.new('RGB',(1280,4*360),'#E4E8DF')
        for i,t in enumerate(samples):
            im=render_frame(t);im.save(HERE/f'frame-{i+1:02}.jpg',quality=95)
            contact.paste(im.resize((640,360),Image.Resampling.LANCZOS),((i%2)*640,(i//2)*360))
        contact.save(HERE/'contact-sheet.jpg',quality=92)
        render_frame(7.4).save(HERE/'poster.jpg',quality=95)
        print('Preview frames saved.',flush=True);return
    soundtrack()
    ff=imageio_ffmpeg.get_ffmpeg_exe()
    cmd=[ff,'-y','-hide_banner','-loglevel','warning','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-i',str(HERE/'anu-original-score.wav'),'-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-af','loudnorm=I=-18:TP=-1.5:LRA=9','-movflags','+faststart','-t',str(DURATION),'-metadata','title=ANU | Every step counts','-metadata','comment=Illustrative product visuals with sample data. Original synthesized score.',str(HERE/'anu-product-film-1080p.mp4')]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        for i in range(DURATION*FPS):
            proc.stdin.write(render_frame(i/FPS).tobytes())
            if i%150==0:print(f'Rendered {i/FPS:.0f}s / {DURATION}s',flush=True)
    finally:proc.stdin.close()
    if proc.wait()!=0:raise RuntimeError('Video encode failed')
    subprocess.run([ff,'-y','-hide_banner','-loglevel','warning','-i',str(HERE/'anu-product-film-1080p.mp4'),'-c:v','libx264','-preset','slow','-crf','25','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',str(HERE/'anu-product-film-web.mp4')],check=True)
    print('Both MP4 exports complete.',flush=True)

if __name__=='__main__':main()
