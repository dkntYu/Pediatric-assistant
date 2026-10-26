const groups=[['preterm','早產兒','Preterm'],['neonate','新生兒','Neonate'],['infant','嬰兒','Infant'],['child','兒童','Child']];
const categories=[
 {name:'呼吸道',en:'AIRWAY',items:['氣管內管','喉頭鏡','喉頭罩','鼻咽呼吸道','口咽呼吸道']},
 {name:'麻醉藥物',en:'ANESTHESIA',items:['Propofol','Ketamine','Midazolam','Succinylcholine','Cisatracurium (Nimbex)','Rocuronium','Fentanyl','Morphine','Propacetamol (Acetamol)','Parecoxib (Dynastat)','Ondansetron','Dexamethasone','Sugammadex']},
 {name:'急救藥物',en:'RESUSCITATION',items:['Atropine','Epinephrine (Bosmin)','Dobutamine','Dopamine','Sodium bicarbonate','Calcium gluconate','Amiodarone','Adenosine','Norepinephrine','Dextrose','Magnesium sulfate','Isoproterenol','Milrinone','Naloxone']},
 {name:'輸液與輸血',en:'FLUIDS / BLOOD',items:['維持輸液','輸液補充／快速輸注','缺損與持續流失補充','紅血球濃厚液','新鮮冷凍血漿','血小板','冷凍沉澱品']}
];
let group='child',category=0,patient=null,onlyFavorites=false;
const favorites=new Set(),opened=new Set(),$=s=>document.querySelector(s);
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
function field(id,label,unit,min,max,placeholder,value){const wrap=el('div');const l=el('label','',label);l.htmlFor=id;l.append(el('span','',unit));const i=el('input');Object.assign(i,{id,type:'number',min:String(min),max:String(max),step:'1',placeholder,required:true});if(value!==undefined)i.value=value;i.inputMode='numeric';wrap.append(l,i);return wrap}
function ageFields(){const a=$('#age-fields');a.replaceChildren();if(['preterm','neonate'].includes(group)){
 a.append(field('gestation','出生胎齡','週',group==='preterm'?20:37,group==='preterm'?36:43,'週'),field('gestation-days','另加天數','天',0,6,'0–6',0),field('days','出生後日齡','天',0,28,'0–28'),el('p','field-note','出生胎齡＋出生後日齡用於校正胎齡。出生已超過28天的早產兒需專用校正年齡規則，本版不套用新生兒劑量。'));
 }else if(group==='infant')a.append(field('months','月齡','個月',0,11,'0–11'),field('extra-days','另加天數','天',0,30,'0–30',0),el('p','field-note','未滿1個月須依日齡；出生0–28天請選新生兒。'));
 else a.append(field('years','年齡','歲',1,17,'1–17'),field('months','另加月數','個月',0,11,'0–11',0));}
function markDirty(){patient=null;$('#summary').textContent='資料已變更，請重新套用';$('#summary').className='summary';$('#error').textContent='';renderResults()}
function renderGroups(){const node=$('#groups');node.replaceChildren();groups.forEach(([id,name,en])=>{const b=el('button',id===group?'active':'',name);b.type='button';b.setAttribute('aria-pressed',String(id===group));b.append(el('small','',en));b.onclick=()=>{group=id;ageFields();renderGroups();markDirty()};node.append(b)})}
function renderTabs(){const node=$('#tabs');node.replaceChildren();categories.forEach((c,i)=>{const b=el('button',i===category?'active':'');b.role='tab';b.id='tab-'+i;b.setAttribute('aria-selected',String(i===category));b.setAttribute('aria-controls','results');b.append(el('span','',c.en),el('b','',c.name));b.onclick=()=>{category=i;$('#search').value='';renderTabs();renderResults()};b.onkeydown=e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();category=e.key==='Home'?0:e.key==='End'?3:(category+(e.key==='ArrowRight'?1:3))%4;$('#search').value='';renderTabs();renderResults();$('#tab-'+category).focus()}};node.append(b)});$('#results').setAttribute('aria-labelledby','tab-'+category)}
const aliases={'Epinephrine (Bosmin)':'adrenaline 腎上腺素','Norepinephrine':'noradrenaline 正腎上腺素','Isoproterenol':'isoprenaline','Dextrose':'glucose 葡萄糖','Cisatracurium (Nimbex)':'順式阿曲庫銨','Propacetamol (Acetamol)':'舒疼消熱','Parecoxib (Dynastat)':'止痛'};
function renderResults(){const node=$('#results'),q=$('#search').value.trim().toLowerCase();node.replaceChildren();let count=0;
 categories[category].items.forEach((name,i)=>{const key=name;if(!(name+' '+(aliases[name]||'')).toLowerCase().includes(q)||onlyFavorites&&!favorites.has(key))return;count++;
  const card=el('article','card'),head=el('div','card-head'),b=el('button','expand'),title=el('div');title.append(el('strong','',name));const d=ClinicalData.drugs[name];title.append(el('small','',d?.blocked?'來源限制 · 不啟用計算':'參考資訊與計算'));b.append(title,el('span','arrow',opened.has(key)?'−':'+'));b.setAttribute('aria-expanded',String(opened.has(key)));const id='detail-'+category+'-'+i;b.setAttribute('aria-controls',id);b.onclick=()=>{opened.has(key)?opened.delete(key):opened.add(key);renderResults();node.querySelector('[aria-controls="'+id+'"]').focus()};const star=el('button','star'+(favorites.has(key)?' on':''),favorites.has(key)?'★':'☆');star.setAttribute('aria-label',(favorites.has(key)?'移除常用：':'加入常用：')+name);star.setAttribute('aria-pressed',String(favorites.has(key)));star.onclick=()=>{favorites.has(key)?favorites.delete(key):favorites.add(key);renderResults()};head.append(b,star);
  const detail=el('div','detail');detail.id=id;detail.hidden=!opened.has(key);
  if(opened.has(key)){const content=ClinicalUI.render(name,patient)||Infusion.render(name,patient);if(content)detail.append(content);else detail.append(el('p','','此項尚無可用來源，不計算。'))}
  card.append(head,detail);node.append(card)
 });if(!count)node.append(el('div','empty',onlyFavorites?'本分類沒有符合的常用項目。點 ☆ 可加入常用。':'沒有符合的項目，請換個關鍵字。'));
}
$('#patient-form').onsubmit=e=>{e.preventDefault();const inputs=[...$('#patient-form').querySelectorAll('input')],bad=inputs.find(i=>!i.validity.valid||!Number.isFinite(i.valueAsNumber));if(bad){$('#error').textContent='請填寫所有必要欄位並確認範圍；體重最多小數一位。';bad.focus();return}const weight=$('#weight').valueAsNumber;
 try{const vals=Object.fromEntries(inputs.map(i=>[i.id,i.valueAsNumber]));let ageMonths=0,correctedWeeks=null;if(group==='child')ageMonths=vals.years*12+vals.months;else if(group==='infant'){if(vals.months===0&&vals['extra-days']<=28)throw Error('出生0–28天請選新生兒，避免套用兒科劑量。');ageMonths=vals.months+vals['extra-days']/30.4375;}else{ageMonths=vals.days/30.4375;correctedWeeks=vals.gestation+(vals['gestation-days']+vals.days)/7;}
 const summary=groups.find(g=>g[0]===group)[1]+' · '+(group==='child'?vals.years+'歲'+vals.months+'個月':group==='infant'?vals.months+'個月'+vals['extra-days']+'天':'出生'+vals.gestation+'週'+vals['gestation-days']+'天 · 日齡'+vals.days+'天')+' · '+weight.toFixed(1)+' kg';
 const next={group,weight,ageMonths,correctedWeeks,birthWeeks:vals.gestation+((vals['gestation-days']||0)/7),postnatalDays:vals.days,summary};ClinicalCore.checkPatient(next);patient=next;$('#weight').value=weight.toFixed(1);$('#summary').textContent=summary;$('#summary').className='summary ready';$('#error').textContent='';renderResults();
 }catch(err){patient=null;$('#error').textContent=err.message;renderResults()}
};
$('#patient-form').addEventListener('input',markDirty);$('#search').oninput=renderResults;
$('#favorites').onclick=()=>{onlyFavorites=!onlyFavorites;$('#favorites').classList.toggle('active',onlyFavorites);$('#favorites').setAttribute('aria-pressed',String(onlyFavorites));renderResults()};
$('#reset').onclick=()=>{patient=null;group='child';$('#patient-form').reset();ageFields();renderGroups();$('#summary').textContent='尚未套用基本資料';$('#summary').className='summary';$('#error').textContent='';renderResults()};
renderGroups();ageFields();renderTabs();renderResults();
