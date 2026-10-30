from pathlib import Path
import re,sys
import pdfplumber
from docx import Document
from docx.shared import Pt
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from lxml import etree

BASE=Path(__file__).resolve().parent
SOURCE=Path('C:/Users/igrs/Downloads/ANU — Simple click flowcharts.pdf')
V='urn:schemas-microsoft-com:vml';O='urn:schemas-microsoft-com:office:office'
def color(v):
    if not isinstance(v,(list,tuple)):v=[v]*3
    return '#'+''.join(f'{max(0,min(255,round(x*255))):02x}' for x in v[:3])

def shape(p,tag,x,y,w,h,uid,stroke=None,fill=None,weight=.75):
    run=OxmlElement('w:r');p._p.append(run);pict=OxmlElement('w:pict');run.append(pict)
    el=etree.SubElement(pict,'{'+V+'}'+tag,nsmap={'v':V,'o':O})
    el.set('id',f'Editable_{uid}')
    el.set('style',f'position:absolute;margin-left:{x:.3f}pt;margin-top:{y:.3f}pt;width:{max(w,.1):.3f}pt;height:{max(h,.1):.3f}pt;z-index:{uid};mso-position-horizontal-relative:page;mso-position-vertical-relative:page')
    el.set('stroked','t' if stroke else 'f');el.set('filled','t' if fill else 'f')
    if stroke:el.set('strokecolor',stroke);el.set('strokeweight',f'{weight:.2f}pt')
    if fill:el.set('fillcolor',fill)
    if tag=='roundrect':el.set('arcsize','10%')
    return el

def text(el,text,size,fontname,colour):
    tb=etree.SubElement(el,'{'+V+'}textbox');tb.set('inset','0,0,0,0')
    content=OxmlElement('w:txbxContent');tb.append(content)
    p=OxmlElement('w:p');content.append(p)
    props=OxmlElement('w:pPr');p.append(props)
    spacing=OxmlElement('w:spacing');spacing.set(qn('w:before'),'0');spacing.set(qn('w:after'),'0');spacing.set(qn('w:line'),str(round(size*1.15*20)));spacing.set(qn('w:lineRule'),'exact');props.append(spacing)
    r=OxmlElement('w:r');p.append(r);rp=OxmlElement('w:rPr');r.append(rp)
    fonts=OxmlElement('w:rFonts')
    for attr in ['ascii','hAnsi','eastAsia','cs']:fonts.set(qn('w:'+attr),'Segoe UI')
    rp.append(fonts)
    sz=OxmlElement('w:sz');sz.set(qn('w:val'),str(round(size*2)));rp.append(sz)
    if 'Bold' in fontname:rp.append(OxmlElement('w:b'))
    if 'Italic' in fontname:rp.append(OxmlElement('w:i'))
    c=OxmlElement('w:color');c.set(qn('w:val'),colour.lstrip('#'));rp.append(c)
    t=OxmlElement('w:t');t.set(qn('xml:space'),'preserve');t.text=text;r.append(t)

doc=Document();sec=doc.sections[0]
sec.top_margin=sec.bottom_margin=sec.left_margin=sec.right_margin=Pt(0)
doc.styles['Normal'].font.size=Pt(1)
doc.styles['Normal'].paragraph_format.space_before=doc.styles['Normal'].paragraph_format.space_after=Pt(0)
doc.core_properties.title='ANU editable click flowcharts'
doc.core_properties.subject='Editable Word text and flowchart shapes from the supplied PDF'
counts={'pages':0,'text_boxes':0,'flow_boxes':0,'side_lines':0};uid=100
with pdfplumber.open(SOURCE) as pdf:
 for page in pdf.pages[:1] if '--sample' in sys.argv else pdf.pages:
    sec.page_width=Pt(page.width);sec.page_height=Pt(page.height)
    p=doc.add_paragraph();p.paragraph_format.page_break_before=counts['pages']>0
    counts['pages']+=1
    for c in page.curves:
        if c['stroke'] and c['width']>80 and c['height']>15:
            uid+=1;shape(p,'roundrect',c['x0'],c['top'],c['width'],c['height'],uid,color(c['stroking_color']),'#ffffff',max(.5,c['linewidth']))
            counts['flow_boxes']+=1
    for c in page.rects:
        col=color(c['non_stroking_color'])
        if c['fill'] and col!='#ffffff':
            uid+=1;shape(p,'rect',c['x0'],c['top'],c['width'],c['height'],uid,None,col)
            counts['side_lines']+=1
    words=page.extract_words(x_tolerance=2,y_tolerance=2,extra_attrs=['fontname','size','non_stroking_color'])
    rows=[]
    for word in sorted(words,key=lambda z:(round(z['top'],1),z['x0'])):
        row=next((r for r in rows if abs(r[0]['top']-word['top'])<1),None)
        if row is None:rows.append([word])
        else:row.append(word)
    for row in rows:
        row.sort(key=lambda z:z['x0']);segments=[];segment=[]
        for word in row:
            if segment and (word['x0']-segment[-1]['x1']>15 or word['fontname']!=segment[-1]['fontname'] or abs(word['size']-segment[-1]['size'])>.25):
                segments.append(segment);segment=[]
            segment.append(word)
        if segment:segments.append(segment)
        for segment in segments:
            first=segment[0];size=first['size'];x=first['x0'];y=min(w['top'] for w in segment)
            width=max(w['x1'] for w in segment)-x
            # Native text boxes retain the PDF line breaks while allowing direct text edits.
            uid+=1;el=shape(p,'rect',x,y-1.25,width+8,size*1.55+3,uid)
            text(el,' '.join(w['text'] for w in segment),size,first['fontname'],color(first['non_stroking_color']))
            counts['text_boxes']+=1
out=BASE/('ANU_Editable_Sample.docx' if '--sample' in sys.argv else 'ANU_Editable_Click_Flowcharts.docx')
doc.save(out)
print(counts);print(out)
