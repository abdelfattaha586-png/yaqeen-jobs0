# يضيف شريط "الرقم المرجعي" أسفل كل صورة إعلان. بيقرأ من originals/ ويكتب في images/ (آمن تشغيله أكتر من مرة).
# الاستخدام: python3 stamp.py   (محتاج Pillow مع raqm لدعم العربي)
import json,re,glob,os
from PIL import Image,ImageDraw,ImageFont
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
s=open('data.js',encoding='utf8').read()
jobs=json.loads(s[s.index('window.JOBS=')+12:].rstrip().rstrip(';'))
ref={}
for j in jobs:
    for i in j['img']: ref[i]=j['ref']
def stamp(src,dst,n):
    im=Image.open(src).convert('RGB');w,h=im.size
    sh=max(40,round(w*0.115));out=Image.new('RGB',(w,h+sh),(14,42,71));out.paste(im,(0,0))
    d=ImageDraw.Draw(out);fs=round(sh*0.56)
    a,b,c=f'الرقم المرجعي: ',str(n),'  (اذكره عند التواصل)'
    while True:
        f=ImageFont.truetype(FONT,fs);f2=ImageFont.truetype(FONT,round(fs*1.25))
        wa=d.textlength(a,font=f,direction='rtl',language='ar');wb=d.textlength(b,font=f2);wc=d.textlength(c,font=f,direction='rtl',language='ar')
        if wa+wb+wc<w*0.94 or fs<10:break
        fs-=1
    # ترتيب من اليمين لليسار: الرقم المرجعي ثم الرقم ثم الملاحظة
    x=(w+(wa+wb+wc))/2;y=h+sh/2
    d.text((x,y),a,font=f,fill=(255,255,255),anchor='rm',direction='rtl',language='ar');x-=wa
    d.text((x,y),b,font=f2,fill=(255,200,30),anchor='rm');x-=wb
    d.text((x,y),c,font=f,fill=(184,199,216),anchor='rm',direction='rtl',language='ar')
    out.save(dst,quality=92)
for p in sorted(glob.glob('originals/*.jpg')):
    name=os.path.basename(p);stamp(p,'images/'+name,ref[name])
print('done',len(ref))
