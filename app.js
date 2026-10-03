// ===== إعدادات: عدّلها قبل النشر =====
const CONTACT={telegram:'',whatsapp:''}; // telegram: لينك القناة https://t.me/... | whatsapp: رقم دولي بدون + مثل 2010xxxxxxxx
const SITE_NOTE='موقع مستقل بيجمّع إعلانات قناة يقين وبيرتبها. مش الموقع الرسمي للشركة، والمرجع النهائي هو القناة.';
const TRANSITION_MS=1250; // مدة شاشة الانتقال قبل صفحة التفاصيل (0 = إلغاء)
// =====================================
const D=(window.JOBS||[]).filter(j=>!j.closed);
const CN={f:'مصانع',s:'أمن',g:'محطات بنزين'},DOCS={f:['البطاقة الشخصية (تكفي في أغلب المصانع)'],s:['البطاقة الشخصية','شهادة الميلاد','شهادة الجيش','المؤهل الدراسي','فيش جنائي ساري'],g:['البطاقة الشخصية','شهادة الميلاد','شهادة الجيش','المؤهل','فيش جنائي ساري','جزمة سيفتي','برنت تأمين','كعب عمل','نموذج 111']};
const HS={1:'يوجد',0:'لا يوجد',2:'غير مذكور'};
const S={tab:'jobs',c:'all',q:'',p:'',h:false,m:false,t:false,k:'r',d:-1},$=s=>document.querySelector(s),app=$('#app');
const fmt=n=>n.toLocaleString('en'),hs=j=>j.h?j.h+' ساعة':'غير مذكور';
const norm=s=>String(s).replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/[ىئ]/g,'ي').replace(/ؤ/g,'و').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).toLowerCase();
const rate=j=>j.h?Math.round(j.m/(30*j.h)*10)/10:null; // أعلى عرض ÷ (30 يوم × ساعات اليوم)
const dn=(j,i,k)=>(j.t+'-'+j.p).replace(/[\\\/:*?"<>|]+/g,'').replace(/\s+/g,'-')+(j.img.length>1?'-'+(k+1):'')+'.'+i.split('.').pop(); // اسم ملف الصورة عند التحميل
const hc=j=>j.s==1?'ok':j.s==0?'no':'un';
const ml=j=>/3 وجبات/.test(j.x)?3:/وجبتان/.test(j.x)?2:/وجبة/.test(j.x)?1:0; // عدد الوجبات المذكورة في الإعلان
const mlt=j=>{const n=ml(j);if(!n)return'غير مذكور';const m=j.x.match(/وجبت\S*\s+(بمصنع\s+[^\s،]+|مدعمتان)/);return(n==3?'3 وجبات':n==2?'وجبتان':'وجبة')+(m?` (${m[1]})`:'')};
const tr=j=>{const m=j.x.match(/مواصلات[^،.]*/);if(!m)return null;const s=m[0].trim(),r=s.replace(/^مواصلات\s*/,'');return{k:/داخل|من السكن/.test(s)?'i':/\sمن\s|خط/.test(s)?'e':'u',r}}; // المواصلات: i داخلية، e خارجية (من مناطق بره)، u مجانية بدون تحديد
const trl=t=>t?({i:'داخلية',e:'خارجية',u:'مجانية'})[t.k]:'غير مذكور';
const trs=t=>t&&t.r&&!['داخلية','مجانية'].includes(t.r)?`<br><small>${t.r}</small>`:'';
const hn=j=>{const m=j.x.match(/سكن للمغتربين|السكن بكاميرات|إقامة كاملة|استلام العمل والسكن في نفس اليوم/);return m?m[0]:''};
const fl=j=>{const r=[];
 if(j.a<18)r.push(`بيقبل سن ${j.a} سنة: تشغيل الأقل من 18 مقيّد قانونًا (ساعات أقل، ولا ورديات ليلية ولا أعمال خطرة). اطلب موافقة ولي الأمر`);
 if(j.h>=16)r.push('16 ساعة عمل: أطول بكثير من حد الـ8 ساعات يوميًا المعروف في قانون العمل المصري (راجع النص الساري)، وإرهاقها عالي');
 if(/أصول/.test(j.x))r.push('بيطلب أصول الأوراق مش صور: ما تسلّمش أصل أي ورقة بدون إيصال استلام وعقد واضح');
 if(/فيش باسم/.test(j.x))r.push('الفيش الجنائي لازم يكون باسم شركة معينة: اتأكد من اسم الشركة');
 return r};
const list=()=>{const t=norm(S.q).split(/\s+/).filter(Boolean),mr=norm(S.q).trim().match(/^(?:رقم|الرقم|المرجعي|مرجعي|ref|#|\s)*(\d+)$/),rj=mr&&D.find(j=>j.ref==mr[1]);if(rj)return[rj]; // بحث بالرقم المرجعي: بيطلع الإعلان ده بس
 
 let L=D.filter(j=>(S.c=='all'||j.c==S.c)&&(!S.p||j.p==S.p)&&(!S.h||j.s==1)&&(!S.m||ml(j)>0)&&(!S.t||(tr(j)||{}).k=='e')&&(h=>t.every(w=>h.includes(w)))(norm(j.t+' '+j.p+' '+j.x+' '+CN[j.c])));
 if(S.tab!='cmp')return L;
 const v=j=>S.k=='r'?rate(j):S.k=='m'?j.m:S.k=='a'?j.a:(j.h||null);
 return L.sort((a,b)=>{const x=v(a),y=v(b);return x==null?(y==null?0:1):y==null?-1:S.d*(x-y)})};
const tabs=[['jobs','الوظائف'],['cmp','جدول المقارنة'],['warn','تنبيهات'],['docs','الأوراق والعنوان']];
const nav=()=>$('#nav').innerHTML=tabs.map(t=>`<a href="#/${t[0]=='jobs'?'':t[0]}" class="${S.tab==t[0]?'on':''}" ${S.tab==t[0]?'aria-current="page"':''}>${t[1]}</a>`).join('');
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),3500)}
function bar(){const ps=[...new Set(D.map(j=>j.p))].sort();return`<div class="bar">${[['all','الكل'],['f','مصانع'],['s','أمن'],['g','محطات بنزين']].map(c=>`<button class="chip ${S.c==c[0]?'on':''}" data-c="${c[0]}">${c[1]}</button>`).join('')}<input id="q" type="search" aria-label="بحث" placeholder="ابحث بالاسم أو المكان أو الرقم المرجعي" value="${S.q}"><select id="p" aria-label="المكان"><option value="">كل الأماكن</option>${ps.map(p=>`<option ${S.p==p?'selected':''}>${p}</option>`).join('')}</select><button class="chip ${S.h?'on':''}" id="hh" aria-pressed="${S.h}">فيه سكن فقط</button><button class="chip ${S.m?'on':''}" id="mm" aria-pressed="${S.m}">فيه وجبات فقط</button><button class="chip ${S.t?'on':''}" id="tt" aria-pressed="${S.t}">مواصلات خارجية فقط</button></div>`}
function bind(){app.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{S.c=b.dataset.c;render()});
 const q=$('#q');if(q)q.onkeydown=e=>{if(e.key=='Enter'){const l=list();if(l.length==1)location.hash='#/job/'+l[0].id}};q.oninput=()=>{S.q=q.value;const x=q.selectionStart;render();$('#q').focus();$('#q').setSelectionRange(x,x)};
 const p=$('#p');if(p)p.onchange=()=>{S.p=p.value;render()};
 const h=$('#hh');if(h)h.onclick=()=>{S.h=!S.h;if(S.h&&S.tab=='cmp'){S.k='m';S.d=-1}render()};
 const tt=$('#tt');if(tt)tt.onclick=()=>{S.t=!S.t;if(S.t&&S.tab=='cmp'){S.k='m';S.d=-1}render()};
 const mm=$('#mm');if(mm)mm.onclick=()=>{S.m=!S.m;if(S.m&&S.tab=='cmp'){S.k='m';S.d=-1}render()};
 app.querySelectorAll('[data-i]').forEach(e=>{const o=()=>{location.hash='#/job/'+e.dataset.i};e.onclick=o;e.onkeydown=k=>{if(k.key=='Enter'||k.key==' '){k.preventDefault();o()}}});
 app.querySelectorAll('[data-k]').forEach(t=>t.onclick=()=>{const k=t.dataset.k;S.d=S.k==k?-S.d:(k=='r'||k=='m'?-1:1);S.k=k;render()})}
const dated=()=>`<p class="note">آخر تحديث للبيانات: ${DATA_UPDATED}. الإعلانات بتتقفل بسرعة، فتأكد من القناة قبل ما تروح. ${SITE_NOTE}</p>`;
function render(){nav();const L=list(),n=c=>D.filter(j=>j.c==c).length;let h='';
 if(S.tab=='jobs'||S.tab=='cmp')h+=`<div class="hero"><div class="w"><h1>${S.tab=='jobs'?'وظيفتك الجاية بتبدأ من هنا':'قارن الأجر والساعات قبل ما تقدّم'}</h1><p>إعلانات قناة يقين في مكان واحد، مرتبة وواضحة، ومعلّم عليها اللي محتاج حذر.</p><div class="sb"><div><b>${D.length}</b><span>وظيفة</span></div><div><b>${n('f')}</b><span>مصانع</span></div><div><b>${n('s')}</b><span>أمن</span></div><div><b>${n('g')}</b><span>بنزين</span></div></div></div></div>`;
 h+='<main><div class="w">';
 if(S.tab=='jobs')h+=dated()+bar()+`<p aria-live="polite" style="margin-bottom:12px;color:var(--mut)">${L.length} وظيفة</p><div class="grid">${L.map(j=>`<article class="card ${j.c}" tabindex="0" role="link" data-i="${j.id}">${fl(j).length?'<span class="warn">تحذير</span>':''}${j.img.length?`<img class="th" src="images/${j.img[0]}" width="900" height="490" loading="lazy" decoding="async" alt="">`:''}<span class="tag">${CN[j.c]}</span><h3>${j.t}</h3><div class="pl">${j.p}</div><div class="pay">${j.pay}</div><div class="chips"><span>رقم مرجعي ${j.ref}</span><span>${hs(j)}</span><span>سكن: ${HS[j.s]}</span>${ml(j)?`<span>${mlt(j)}</span>`:''}${(tr(j)||{}).k=='e'?'<span>مواصلات خارجية</span>':''}<span>${j.a}–${j.b} سنة</span></div></article>`).join('')||'<p>مفيش نتائج. جرّب تشيل فلتر.</p>'}</div>`;
 if(S.tab=='cmp')h+=dated()+bar()+`<div class="tw"><table><tr><th>رقم</th><th>الوظيفة</th><th>المكان</th><th data-k="m" tabindex="0">الأجر في الإعلان ⇅</th><th data-k="r" tabindex="0">ج/ساعة تقريبي ⇅</th><th data-k="h">الساعات ⇅</th><th>السكن</th><th>الوجبات</th><th>المواصلات</th><th data-k="a">السن ⇅</th><th>الأوراق</th><th>تحذير</th></tr>${L.map(j=>`<tr class="r" tabindex="0" role="link" data-i="${j.id}"><td>${j.ref}</td><td><b>${j.t}</b></td><td>${j.p}</td><td>${j.pay}</td><td>${rate(j)==null?'<span class="un">—</span>':rate(j)}</td><td class="${j.h>=16?'no':''}">${hs(j)}</td><td class="${hc(j)}">${HS[j.s]}${hn(j)?`<br><small>${hn(j)}</small>`:''}</td><td class="${ml(j)?'ok':'un'}">${mlt(j)}</td><td class="${(tr(j)||{}).k=='e'?'ok':'un'}">${trl(tr(j))}${trs(tr(j))}</td><td class="${j.a<18?'no':''}">${j.a}–${j.b}</td><td>${j.c=='f'&&!/فيش|ملف/.test(j.x)?'بطاقة':j.c=='f'?'ملف كامل':j.c=='s'?'ملف كامل + فيش':'ملف كامل + 9 أوراق'}</td><td class="no">${fl(j).length?'⚠':''}</td></tr>`).join('')}</table></div><p style="color:var(--mut);margin-top:8px;font-size:13px">ترتيب \"الأجر في الإعلان\" بيعتمد على أعلى رقم مذكور في الإعلان (اضغط على العنوان يقلب الترتيب). ج/ساعة = أعلى أجر في الإعلان ÷ (30 يوم × ساعات اليوم)، وبيفترض شغل كل الأيام بدون إجازة. تقدير للمقارنة بس، والمرجع هو نص الإعلان. اضغط أي صف للتفاصيل.</p>`;
 if(S.tab=='warn'){const w=D.filter(j=>fl(j).length);h+=`<h1 style="margin:10px 0 16px">تنبيهات قبل ما تقدّم</h1>${dated()}<div class="box red"><h2>مصانع مكتملة: ممنوع الإرسال عليها</h2><ul><li>كرتون العبور</li><li>فراولة العاشر من رمضان</li><li>مصنع التكييفات</li><li>بيبسي 6 أكتوبر</li><li>آيس كريم 6 أكتوبر</li><li>مصنع الورق والكتب بالعبور</li><li>أمن المقرمشات 6 أكتوبر</li></ul></div><div class="box red"><h2>${w.length} إعلان فيهم مخاطر</h2><ul>${w.map(j=>`<li><a href="#/job/${j.id}"><b>${j.t} (${j.p}):</b></a> ${fl(j).join('، ')}</li>`).join('')}</ul></div><div class="box"><h2>قواعد عامة للأمان</h2><ul><li>الإعلانات من شركة توريد عمالة، فاسأل مين صاحب العمل الفعلي (المصنع ولا الشركة الوسيطة) واطلب عقد وتأمينات قبل الاستلام.</li><li>أرقام التواصل في الإعلانات الأصلية فاضية، فاتأكد من الرقم أو الرابط من القناة نفسها.</li><li>لو أقل من 18، اطلب موافقة ولي الأمر وارفض الورديات الطويلة أو الليلية.</li></ul></div>`}
 if(S.tab=='docs')h+=`<h1 style="margin:10px 0 16px">الأوراق وعنوان الشركة</h1>${['f','s','g'].map(c=>`<div class="box"><h2>${CN[c]}</h2><ul>${DOCS[c].map(d=>`<li>${d}</li>`).join('')}</ul>${c=='s'?'<p>الطلبة: بطاقة + ميلاد + كارنيه/إثبات قيد + فيش. أقل مؤهل: الإعدادية حسب الملخص، لكن إعلان مدينة نصر بيقول ابتدائية، فاسأل القناة.</p>':''}${c=='g'?'<p><b>لا استلام عمل بدون الملف كاملًا.</b> الطالب يقدم إثبات قيد بدل المؤهل والجيش.</p>':''}${c=='f'?'<p>مصنع شيبسي يشترط ملفًا كاملًا (بطاقة، ميلاد، جيش، مؤهل) ولا يقبل الطلبة.</p>':''}</div>`).join('')}<div class="box"><h2>الوصول لمقر الشركة</h2><ul><li>مترو اتجاه حلوان، النزول في محطة المعادي.</li><li>ركوب "فايدة كامل" لآخر الخط.</li><li>اسأل عن شركة الزهور للمنظفات سابقًا (كافيه العتاولة) أو توكيل WE، ثم شارع الجمهورية، ثالث شارع يمين.</li><li>عمارة 12، مجدي شمس المحامي، الدور الأول علوي.</li><li><b>المواعيد:</b> السبت إلى الأربعاء 11:00 – 2:30 (حد أقصى 3:00). الخميس والجمعة إجازة.</li></ul></div>`;
 app.innerHTML=h+'</div></main>';bind()}
function applyTo(j){const m=`السلام عليكم، عايز أقدّم على وظيفة: ${j.t} – ${j.p}. ممكن تفاصيل التقديم؟`;
 try{navigator.clipboard&&navigator.clipboard.writeText(m)}catch(e){}
 const u=CONTACT.whatsapp?`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(m)}`:CONTACT.telegram;
 if(u)window.open(u,'_blank','noopener');else toast('اتنسخت رسالة التقديم، ابعتها في قناة يقين.')}

// ===== نصوص النشر على المواقع الخمسة (سوق العمل / Skatch / الإعلانات النشطة / مرجان / فرص مصر) =====
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const CAT={s:{ar:'فرد أمن',en:'Security Guard',edu:'مؤهل متوسط',sp:'أمن وسلامة',sub:'حراسة وأمن',act:'خدمات أمنية'},f:{ar:'عامل مصنع',en:'Factory Worker',edu:'بدون مؤهل',sp:'تصنيع وإنتاج',sub:'مصانع وإنتاج',act:'تصنيع'},g:{ar:'عامل محطة بنزين',en:'Gas Station Attendant',edu:'مؤهل متوسط',sp:'خدمات',sub:'محطات وقود',act:'محطات وقود'}};
const GOV=p=>{const f=p.split('/')[0];return /أكتوبر|زايد/.test(f)?'الجيزة':/العاشر|بدر/.test(f)?'الشرقية':/السادات/.test(f)?'المنوفية':/العبور/.test(f)?'القليوبية':/الساحل/.test(f)?'مطروح':/السخنة/.test(f)?'السويس':'القاهرة'};
const NOEMO=s=>s.replace(/[\u{1F000}-\u{1FFFF}\u{2190}-\u{27BF}\u{FE0F}\u{200D}]/gu,'');
const payT=j=>{let r=j.pay.replace(/(\d),(?=\d)/g,'$1').replace(/(\d)\s+صافي/,'$1 جنيه صافي').replace(/(^|\s)ج(?=\s|$)/g,'$1جنيه').replace(/ج\//g,'جنيه/');if(!/جنيه/.test(r)&&/\d/.test(r))r+=' جنيه';return r};
const body=j=>{const L=[j.ptitle||`مطلوب ${j.t} في ${j.p}`,'الراتب: '+payT(j)];
 if(j.h)L.push(`ساعات العمل: ${j.h} ${j.h<=10?'ساعات':'ساعة'}`);
 if(j.ex)L.push(...j.ex);else{if(j.s==1)L.push('يوجد سكن');if(j.s==0)L.push('لا يوجد سكن');(j.x||'').split('،').map(s=>s.trim().replace(/\//g,' ')).filter(Boolean).forEach(s=>L.push(s))}
 L.push(`السن من ${j.a} إلى ${j.b} سنة`,'الأوراق المطلوبة: '+(j.dc||DOCS[j.c].map(d=>d.replace(/\s*\(.*?\)/g,'')).join('، ')));
 return NOEMO(L.join('\n'))};
function posts(j){const C=CAT[j.c],g=GOV(j.p),b=body(j),t=NOEMO(j.ptitle||`مطلوب ${j.t} في ${j.p}`),sal=j.m+' جنيه',pt=payT(j),ph=pt.replace(/\D/g,'')==String(j.m)?'':'الأجر الأصلي في الإعلان: '+pt,role=j.role||j.t;
 return[
 {n:'سوق العمل',f:[['المسمى الوظيفي بالعربية',role],['المسمى الوظيفي بالإنجليزية',j.en||C.en],['المستوى التعليمي',C.edu],['القسم / التخصص',C.sp],['عدد سنوات الخبرة','بدون خبرة'],['مكان العمل','حضوري'],['المدينة',g,'أو '+j.p],['الراتب',sal,ph],['الوصف / التفاصيل',b]]},
 {n:'Skatch',f:[['نص المنشور',b],['المسمى الوظيفي',C.ar],['البلد','مصر'],['المنطقة / الولاية',g],['المدينة',j.p,'أو '+g],['الراتب',sal,ph]]},
 {n:'الإعلانات النشطة',f:[['اسم الإعلان / العنوان',t],['الوصف',b],['التخصص / المجال',C.sp],['المستوى التعليمي',C.edu],['سنوات الخبرة','بدون خبرة'],['الراتب',sal,ph],['المدينة / المنطقة',g+' / '+j.p]]},
 {n:'مرجان',f:[['العنوان',t],['الوصف',b],['التصنيف','وظائف شاغرة / '+C.sp],['المحافظة',g],['السعر / الراتب',sal,ph],['الخصائص','نوع الوظيفة: دوام كامل | المسمى: '+C.ar]]},
 {n:'فرص مصر',f:[['القسم الرئيسي','اعلان عن وظيفة شاغرة'],['القسم الفرعي',C.sub],['الموقع',g],['نشاط الشركة',C.act],['موقع الوظيفة',j.p],['نص الاعلان',b]]}]}
let P=[];
function pubHtml(j){P=posts(j);
 return`<div class="box pub"><h2>انشر الإعلان على المواقع الخمسة</h2><p style="margin-bottom:10px">النصوص جاهزة بدون رموز تعبيرية. اضغط "نسخ" على أي حقل، أو انسخ كل حقول الموقع مرة واحدة. حمّل الصورة الأول وارفعها مع الإعلان.</p>${j.img.map((i,k)=>`<a class="dl" href="images/${i}" download="${dn(j,i,k)}">⬇ تحميل صورة الإعلان على الجهاز${j.img.length>1?' '+(k+1):''}</a>`).join('')}${P.map((a,i)=>`<details ${i?'':'open'}><summary>${i+1}. ${a.n}</summary><div class="pf">${a.f.map((f,k)=>`<div class="fr"><small>${f[0]}</small><pre>${esc(f[1])}</pre>${f[2]?`<em>${esc(f[2])}</em>`:''}<button class="cp" data-a="${i}" data-f="${k}">نسخ</button></div>`).join('')}<button class="cp all" data-a="${i}">نسخ كل حقول ${a.n}</button></div></details>`).join('')}</div>`}
async function copyT(t){try{await navigator.clipboard.writeText(t)}catch(e){const x=document.createElement('textarea');x.value=t;x.style.cssText='position:fixed;opacity:0';document.body.appendChild(x);x.select();try{document.execCommand('copy')}catch(_){}x.remove()}toast('اتنسخ')}
function saveImg(e,a){e.preventDefault();fetch(a.href).then(r=>{if(!r.ok)throw 0;return r.blob()}).then(b=>{const u=URL.createObjectURL(b),l=document.createElement('a');l.href=u;l.download=a.getAttribute('download');document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('الصورة اتحمّلت على الجهاز')}).catch(()=>{window.open(a.href,'_blank','noopener');toast('افتح الصورة واضغط مطولًا واحفظها')})}
function bindPub(){app.querySelectorAll('.cp').forEach(b=>b.onclick=()=>{const a=P[b.dataset.a];copyT(b.dataset.f===undefined?a.f.map(f=>f[0]+':\n'+f[1]).join('\n\n'):a.f[b.dataset.f][1])});
 app.querySelectorAll('a.dl').forEach(l=>l.onclick=e=>saveImg(e,l))}
function detail(j){S.tab='';nav();const f=fl(j),d=DOCS[j.c],r=rate(j);
 app.innerHTML=`<main><div class="w"><button class="back" id="bk">رجوع للوظائف</button><div class="dh ${j.c}"><span>${CN[j.c]}</span><h1>${j.t}</h1><div>${j.p}</div><div class="pay">${j.pay}</div></div><div class="facts"><div><small>الرقم المرجعي</small><b>${j.ref}</b></div><div><small>ج/ساعة تقريبي (أعلى أجر)</small><b>${r==null?'غير مذكور':r}</b></div><div><small>ساعات العمل</small><b>${hs(j)}</b></div><div><small>السكن</small><b>${HS[j.s]}</b></div>${tr(j)?`<div><small>المواصلات</small><b>${trl(tr(j))}${tr(j).r&&!['داخلية','مجانية'].includes(tr(j).r)?': '+tr(j).r:''}</b></div>`:''}<div><small>السن</small><b>${j.a} – ${j.b}</b></div>${j.d?`<div><small>تاريخ الإعلان</small><b>${j.d}</b></div>`:''}</div>${f.map(x=>`<div class="fl">⚠ ${x}</div>`).join('')}${j.x?`<div class="box"><h2>تفاصيل إضافية</h2><p>${j.x}</p></div>`:''}<div class="box"><h2>الأوراق المطلوبة</h2><ul>${d.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="box"><h2>قبل ما تقدّم</h2><p>الإعلان ما بيذكرش صاحب العمل الفعلي. اسأل: مين الشركة المتعاقدة؟ فيه عقد وتأمينات؟.</p></div>${j.img.length?`<div class="gal">${j.img.map((i,k)=>`<figure><a href="images/${i}" target="_blank" rel="noopener"><img src="images/${i}" loading="lazy" alt="صورة الإعلان: ${j.t} – ${j.p} – ${j.pay}"></a><a class="dl" href="images/${i}" download="${dn(j,i,k)}">⬇ تحميل الصورة${j.img.length>1?' '+(k+1):''}</a></figure>`).join('')}</div>`:''}${pubHtml(j)}<button class="cta" id="ap">طريقة التقديم</button><button class="sec" id="sh">شارك على واتساب</button></div></main>`;
 $('#bk').onclick=()=>location.hash='#/';bindPub();$('#ap').onclick=()=>applyTo(j);
 $('#sh').onclick=()=>window.open('https://wa.me/?text='+encodeURIComponent(`${j.t} – ${j.p} – ${j.pay}\n${location.href}`),'_blank','noopener')}
let trT=null,pend=null,first=true;
function trHide(){clearTimeout(trT);trT=null;pend=null;const e=$('#tr');if(e)e.classList.remove('on')}
function trShow(j){const e=$('#tr');pend=j;e.classList.remove('on');
 e.innerHTML=`<div class="logo">يقين<i>وظائف</i></div><div>جاري فتح: ${j.t}</div><div class="pb"><i></i></div><small>اضغط في أي مكان أو Esc للتخطي</small>`;
 void e.offsetWidth;e.classList.add('on');trT=setTimeout(trSkip,TRANSITION_MS)}
function trSkip(){const j=pend;if(!j)return;trHide();detail(j);scrollTo(0,0)}
function route(){const h=location.hash.replace(/^#\/?/,''),m=h.match(/^job\/(\d+)/),j=m&&D.find(x=>x.id==m[1]);
 trHide();
 if(j&&!first&&TRANSITION_MS&&!matchMedia('(prefers-reduced-motion:reduce)').matches){first=false;trShow(j);return}
 first=false;
 if(j)detail(j);else{S.tab=['cmp','warn','docs'].includes(h)?h:'jobs';render()}scrollTo(0,0)}
$('#tr').onclick=trSkip;addEventListener('keydown',e=>{if(e.key=='Escape')trSkip()});
$('#ft').innerHTML=SITE_NOTE+'<br>مصدر الإعلانات: قناة يقين للتوريدات العمومية والعمالة الداخلية. الأرقام تقريبية وقد تتغير؛ تأكد من القناة قبل التقديم.';
addEventListener('hashchange',route);route();
