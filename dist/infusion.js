/* Source-specific reference arithmetic, not a prescribing engine. Checked 2026-10-27. */
(function(root){
 const sources={
  isoPed:['CHEO 兒科注射藥物手冊（2026-05）','https://outreach.cheo.on.ca/manual/1618'],
  isoNeo:['CHEO 新生兒手冊（修訂 2014-01；頁面更新 2022-01）','https://outreach.cheo.on.ca/manual/1363'],
  milPed:['CHEO 兒科注射藥物手冊（2024-01）','https://outreach.cheo.on.ca/manual/1646'],
  milNeo:['CHEO 新生兒手冊（2024-06）','https://outreach.cheo.on.ca/manual/1376'],
  tw:['耕莘醫院：Proternol-L 臺灣藥品資料','https://www.cth.org.tw/?aid=606&iid=1359&page_name=detail&pid=0']
 };
 const configs={
  Isoproterenol:{stock:0.2,min:0.05,max:2,
   warnings:'臺灣 Proternol-L 資料：兒童安全性與有效性尚未確立。以下為國外兒科院內參考，不等同臺灣核准兒科劑量。需持續 ECG、心率與血壓監測；留意心律不整。避免與 sodium bicarbonate、furosemide 同線。',
   purpose:'來源用途包含房室傳導阻斷；新生兒來源列增加心輸出量。須由臨床端確認適應症，本頁不提供一般心跳停止給藥建議。',
   pediatric:{source:'isoPed',c:10,total:50,diluent:'0.9% NaCl',dose:'兒科 IV infusion：0.05–2 μg/kg/min；本頁不指定起始劑量。',loading:'本批不提供 bolus 換算。'},
   neonatal:{source:'isoNeo',c:20,total:20,diluent:'D5W',dose:'來源起始 0.05 μg/kg/min，依反應調整，最高 2 μg/kg/min；來源較舊，須核對現行院內規範。',loading:'本批僅持續輸注，不提供 bolus。'}},
  Milrinone:{stock:1,min:0.25,max:0.75,
   warnings:'可能低血壓與心律不整；監測血壓、心率、ECG、腎功能、電解質與血小板。腎排除，腎功能異常可能累積；本版不提供腎功能調整。避免與 furosemide 同線。',
   purpose:'短期心衰竭／低心輸出量支持；新生兒來源另列 PPHN。先確認適應症，不將本範圍泛用於所有情境。',
   pediatric:{source:'milPed',c:100,total:20,diluent:'D5W',dose:'兒科 IV infusion 範圍 0.25–0.75 μg/kg/min。來源每日上限 1.13 mg/kg/day。',loading:'兒科來源列 loading 50 μg/kg，15 分鐘輸注；不是快速 IV push。本批不計算 loading，以免與持續輸注混用。'},
   neonatal:{source:'milNeo',c:100,total:20,diluent:'D5W',dose:'CHEO 新生兒 IV infusion：0.25–0.75 μg/kg/min。早產兒與特殊生理狀況不可直接套用。',loading:'此新生兒來源不建議 loading dose；本頁不提供 loading 換算。'}}
 };
 function profile(name,group){const c=configs[name];if(!c)return null;if(!['preterm','neonate','infant','child'].includes(group))throw Error('未知年齡分類');if(name==='Milrinone'&&group==='preterm')return {...c,blocked:'早產兒 milrinone：尚待胎齡、日齡及腎功能專用規則核對，本版不計算。',source:'milNeo'};return {...c,...c[['preterm','neonate'].includes(group)?'neonatal':'pediatric']};}
 function calculate({name,group,weight,dose,stock,confirmed,renal}){
  const p=profile(name,group);if(!p)throw Error('尚未建立此藥規則');if(p.blocked)throw Error(p.blocked);
  if(!confirmed)throw Error('請先確認實際藥品濃度與來源適用性');
  if(name==='Milrinone'&&renal!=='normal')throw Error('需先確認腎功能；異常或不明時本版不計算');
  if(!Number.isFinite(weight)||weight<=0||Math.abs(weight*10-Math.round(weight*10))>1e-7)throw Error('需有效且已套用的體重（kg，最多一位小數）');
  if(!Number.isFinite(dose)||dose<p.min||dose>p.max)throw Error('輸入劑量超出本來源範圍 '+p.min+'–'+p.max+' μg/kg/min');
  if(!Number.isFinite(stock)||Math.abs(stock-p.stock)>1e-9)throw Error('本稀釋配方僅支援原液 '+p.stock+' mg/mL，其他規格待核對');
  const mass=p.c*p.total/1000,draw=mass/stock,diluent=p.total-draw,rate=dose*weight*60/p.c;
  if(![mass,draw,diluent,rate].every(Number.isFinite)||diluent<0)throw Error('計算失敗');
  return {mass,draw,diluent,rate,total:p.total,concentration:p.c,perHour:dose*weight*60};
 }
 function render(name,patient){
  const c=configs[name];if(!c)return null;const box=document.createElement('section');box.className='infusion';
  function add(tag,text,cls){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;box.append(n);return n}
  add('span','來源已整理 · 待院內臨床驗收','pending');add('h3','持續輸注換算');add('p',c.purpose);add('p',c.warnings,'clinical-warning');
  const p=patient?profile(name,patient.group):null;
  add('p',patient?'套用資料：'+patient.summary:'請先套用基本資料，才能顯示對應族群與換算。');
  function link(key){const a=document.createElement('a');a.href=sources[key][1];a.textContent=sources[key][0];a.target='_blank';a.rel='noopener noreferrer';box.append(a,document.createElement('br'))}
  if(!p){link(name==='Milrinone'?'milPed':'isoPed');link(name==='Milrinone'?'milNeo':'isoNeo');return box}
  add('p','使用 '+(['preterm','neonate'].includes(patient.group)?'新生兒':'兒科（非新生兒）')+'來源；查閱日期 2026-10-27。');link(p.source);if(name==='Isoproterenol')link('tw');
  if(p.blocked){add('p',p.blocked,'clinical-warning');return box}
  add('p',p.dose);add('p',p.loading);add('p','固定配方：原液 '+p.stock+' mg/mL → 最終 '+p.c+' μg/mL，共 '+p.total+' mL，稀釋液 '+p.diluent+'。此配方為來源選項，未確認為你院內標準。');
  const form=document.createElement('form');form.className='infusion-form';form.noValidate=true;box.append(form);
  function input(label,placeholder){const l=document.createElement('label'),i=document.createElement('input');l.textContent=label;i.type='number';i.inputMode='decimal';i.step='any';i.min='0';i.placeholder=placeholder;i.required=true;l.append(i);form.append(l);return i}
  const dose=input('已決定的輸注劑量（μg/kg/min）',p.min+'–'+p.max),stock=input('確認實際原液濃度（mg/mL）','請查藥瓶標示，不預填');
  let renal=null;if(name==='Milrinone'){const l=document.createElement('label');l.textContent='腎功能';renal=document.createElement('select');[['','請選擇'],['normal','已確認無腎功能異常'],['impaired','異常／需要調整'],['unknown','不明']].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;renal.append(o)});l.append(renal);form.append(l)}
  const label=document.createElement('label');label.className='confirm';const check=document.createElement('input');check.type='checkbox';label.append(check,document.createTextNode('已核對原液標示、年齡來源、適應情境及院內規範；輸入的是已決定的劑量。'+(name==='Milrinone'&&patient.group==='neonate'?' 此新生兒為足月出生；早產兒請改選早產兒分類。':'')));form.append(label);
  const button=document.createElement('button');button.type='submit';button.className='primary';button.textContent='換算稀釋量與 mL/hr';form.append(button);
  const result=add('div','','infusion-result');result.setAttribute('aria-live','polite');
  const fmt=n=>Number(n.toPrecision(7)).toLocaleString('en-US',{maximumFractionDigits:6});
  form.addEventListener('input',()=>result.replaceChildren());form.addEventListener('change',()=>result.replaceChildren());
  form.onsubmit=e=>{e.preventDefault();result.replaceChildren();try{const r=calculate({name,group:patient.group,weight:patient.weight,dose:dose.valueAsNumber,stock:stock.valueAsNumber,confirmed:check.checked,renal:renal?.value});const lines=[
   '持續輸注速率：'+fmt(r.rate)+' mL/hr',
   '藥物量：'+fmt(r.mass)+' mg；抽原液 '+fmt(r.draw)+' mL，加 '+p.diluent+' '+fmt(r.diluent)+' mL，配成最終 '+r.total+' mL（不是再加 '+r.total+' mL）。',
   '速率公式：'+dose.value+' μg/kg/min × '+patient.weight.toFixed(1)+' kg × 60 ÷ '+p.c+' μg/mL = '+fmt(r.rate)+' mL/hr',
   '稀釋公式：'+p.c+' μg/mL × '+r.total+' mL ÷ 1000 ÷ '+stock.value+' mg/mL = '+fmt(r.draw)+' mL 原液',
   '結果未依幫浦最小刻度取整；需確認幫浦精度、抽取精度與液體負荷。本頁不提供輸注穩定性、管路全相容性或個別化處方。'];lines.forEach(t=>{const n=document.createElement('p');n.textContent=t;result.append(n)})}catch(err){result.textContent=err.message}};
  return box;
 }
 root.Infusion={profile,calculate,render};if(typeof module!=='undefined')module.exports=root.Infusion;
})(typeof window!=='undefined'?window:globalThis);
