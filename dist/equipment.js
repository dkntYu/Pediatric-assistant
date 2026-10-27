(function(root){
const C=root.ClinicalCore;
const sources={
 bc:['BC Children’s Hospital／Child Health BC，初始呼吸機設定表（2024-11）','https://childhealthbc.ca/pcc/hurry/mechanical-ventilator'],
 bcTable:['BCCH 年齡分層原表','https://childhealthbc.ca/sites/default/files/2024-11/initial-settings.png'],
 rcuk:['RCUK 2025：機械通氣及氧合目標','https://www.resus.org.uk/cy/node/36439'],
 rds:['CAHS 新生兒RDS指引，第4頁（2024；下次審查2027）','https://www.cahs.health.wa.gov.au/~/media/HSPs/CAHS/Documents/Health-Professionals/Neonatology-guidelines/Respiratory-Distress-Syndrome.pdf'],
 queen:['Queen’s 2021 兒科麻醉表，第1頁（舊院內器材參考）','https://anesthesiology.queensu.ca/sites/anesthesiology/files/inline-files/Pediatric%20Drug%20Dose%20Chart%20(2021_04_30).pdf'],
 yoon:['Yoon等，2006：右內頸靜脈置入深度研究（60例）','https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1399-6576.2006.00951.x']
};
// BCCH table age bands use completed years. These are starting references, not disease-specific targets.
const ventilationRows=[{max:1,vt:[6,7],rr:[30,35],ti:[0.6,0.6],mv:200},{max:12,vt:[6,8],rr:[25,35],ti:[0.6,0.7],mv:175},{max:48,vt:[6,8],rr:[20,26],ti:[0.7,0.75],mv:150},{max:72,vt:[6,8],rr:[18,24],ti:[0.75,0.8],mv:125},{max:132,vt:[6,8],rr:[16,22],ti:[0.8,0.9],mv:125},{max:216,vt:[6,8],rr:[14,20],ti:[0.8,1],mv:100}];
function ventilation(p,o={}){C.checkPatient(p);const context=o.context||'general';if(!['general','rds'].includes(context))throw Error('請選擇通氣情境。');
 let weight=p.weight;if(o.ibw!==undefined){if(!Number.isFinite(o.ibw)||o.ibw<=0||o.ibw>200)throw Error('IBW／PBW須為有效正數（≤200 kg）。');weight=Math.min(p.weight,o.ibw)}
 if(context==='rds'){if(!['preterm','neonate'].includes(p.group))throw Error('此RDS來源僅限新生兒／早產兒。');const preterm=p.group==='preterm';return {context,weight,vt:[4.5*weight,6*weight],initialVT:4.5*weight,rr:preterm?[40,40]:[30,30],peep:5,ti:preterm?[0.3,0.3]:[0.4,0.4],pip:preterm?18:22,mode:preterm?'SIPPV + VG':'SIMV／SIPPV + VG'}}
 if(p.group==='preterm')throw Error('早產兒不套用一般兒科表；若為RDS，請選專用情境。');
 const row=ventilationRows.find(r=>p.ageMonths<r.max);return {context,weight,vt:row.vt.map(v=>v*weight),rr:row.rr,ti:row.ti,peep:5,targetMV:row.mv*weight/1000};
}
const sizeRows=[[3,5,[4]],[5,10,[4,5]],[10,20,[5]],[20,30,[5]],[30,50,[5]],[50,70,[7]],[70,100,[7,8,9]]];
function cvc(p,o={}){C.checkPatient(p);const site=o.site||'rij';if(!['rij','lij','rsc','lsc','femoral'].includes(site))throw Error('未知置入部位。');const sizes=p.group==='preterm'?[]:[...new Set(sizeRows.filter(([lo,hi])=>p.weight>=lo&&p.weight<=hi).flatMap(r=>r[2]))];let depth=null,reason='';
 if(p.group==='preterm')reason='早產兒未納入本版深度估算。';
 else if(site!=='rij')reason='此部位沒有本版已核對的置入深度公式；不沿用右內頸公式。';
 else if(o.height===undefined)reason='輸入身高後，顯示右內頸靜脈初始深度估算。';
 else if(!Number.isFinite(o.height)||o.height<40||o.height>140)reason='此研究只涵蓋身高40–140 cm；超出範圍不外推。';
 else depth=1.7+0.07*o.height;
 return {site,sizes,depth,reason};
}
const make=(t,text,cls)=>{const e=document.createElement(t);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e},fmt=n=>Number(n.toFixed(2)).toLocaleString('en-US',{maximumFractionDigits:2}),range=v=>fmt(v[0])+(v[0]===v[1]?'':'–'+fmt(v[1]));
function tile(box,label,value){const t=make('div',undefined,'equipment-tile');t.append(make('small',label),make('strong',value));box.append(t)}
function details(box,lines,ids){const d=make('details',undefined,'reference-details');d.append(make('summary','計算依據、適用條件與來源'));lines.forEach(t=>d.append(make('p',t)));for(const id of ids){const [title,url]=sources[id],a=make('a',title);a.href=url;a.target='_blank';a.rel='noopener noreferrer';d.append(a,make('br'))}box.append(d)}
function input(box,label,placeholder){const l=make('label',label),i=make('input');Object.assign(i,{type:'number',inputMode:'decimal',step:'any',placeholder});l.append(i);box.append(l);return i}
function select(box,label,options){const l=make('label',label),s=make('select');options.forEach(([v,t])=>{const o=make('option',t);o.value=v;s.append(o)});l.append(s);box.append(l);return s}
function renderVent(p){const box=make('section',undefined,'equipment');if(!p){box.append(make('p','請先套用年齡與體重。'));return box}const controls=make('div',undefined,'equipment-controls');box.append(controls);
 const options=p.group==='preterm'?[['','請選通氣情境'],['rds','新生兒 RDS · CAHS']]:[['general','一般插管後初始參考 · BCCH'],...(['neonate'].includes(p.group)?[['rds','新生兒 RDS · CAHS']]:[])];
 const context=select(controls,'通氣情境',options),ibw=input(controls,'IBW／PBW（kg，已知時選填）','未填時以基本資料體重暫算');const area=make('div');area.setAttribute('aria-live','polite');box.append(area);
 function refresh(){area.replaceChildren();try{if(!context.value)throw Error('先選擇情境；不由早產標籤推定患有RDS。');const r=ventilation(p,{context:context.value,ibw:ibw.value===''?undefined:ibw.valueAsNumber}),grid=make('div',undefined,'equipment-grid');area.append(grid);tile(grid,r.context==='rds'?'Vt（起始值見下方）':'Tidal volume · Vt',range(r.vt)+' mL');tile(grid,'Respiratory rate · RR',range(r.rr)+' /min');tile(grid,'PEEP（起始參考）',r.peep+' cmH₂O');tile(grid,'Inspiratory time · Ti',range(r.ti)+' s');
 if(r.context==='rds'){tile(grid,'PIP（初始參考，非固定上限）',r.pip+' cmH₂O');tile(grid,'模式',r.mode);area.append(make('p','Vt由 '+fmt(r.initialVT)+' mL 起始，依反應滴定；僅為新生兒RDS來源情境。','dose-condition'))}
 else{tile(grid,'Target minute ventilation · MV',fmt(r.targetMV)+' L/min');tile(grid,'Plateau pressure · Pplat','<30 cmH₂O');area.append(make('p','Pplat不是PIP；PIP依實測Vt、順應性及阻力調整。','dose-condition'))}
 area.append(make('p','本次計量體重 '+fmt(r.weight)+' kg'+(ibw.value===''?'（暫採輸入實際體重，未自動推算理想體重）':'（採實際體重與所填IBW／PBW較小者）'),'dose-condition'));
 if(r.context==='general')area.append(make('p','FiO₂依氧合調整；一般急性照護SpO₂目標94–98%。CPR、ARDS、阻塞性疾病及特殊心臟病另依專用策略。','dose-admin'));else area.append(make('p','FiO₂依新生兒個別SpO₂目標調整，不套用一般兒科目標。','dose-admin'));
 details(area,[r.context==='general'?'Vt＝來源每公斤範圍 × 計量體重；MV＝來源目標mL/kg/min × 體重 ÷ 1000。RR與Ti依BCCH年齡表，不是將生理正常呼吸率直接當呼吸機設定。1–3、4–5、6–10歲以足歲分層，11歲起採>10歲欄。PEEP採RCUK起始5，不將BCCH通用PEEP範圍5–10當固定設定。':'RDS來源Vt起始4.5 mL/kg，必要時調整至6。早產兒RR40、Ti0.3、PIP18；足月RR30、Ti0.4、PIP22；皆PEEP5。VG、漏氣補償及給予surfactant後須重新評估。','參數為初始參考，須依呼出Vt、ETCO₂／血氣、氧合及流速波形調整；I:E與呼氣時間應足以避免氣體滯留。'],r.context==='rds'?['rds']:['bc','bcTable','rcuk']);
 }catch(e){area.append(make('p',e.message,'unavailable'))}}context.onchange=refresh;ibw.oninput=refresh;refresh();return box;
}
function renderCVC(p){const box=make('section',undefined,'equipment');if(!p){box.append(make('p','請先套用年齡與體重。'));return box}const controls=make('div',undefined,'equipment-controls');box.append(controls);const site=select(controls,'置入部位',[['rij','右內頸靜脈'],['lij','左內頸靜脈'],['rsc','右鎖骨下靜脈'],['lsc','左鎖骨下靜脈'],['femoral','股靜脈']]),height=input(controls,'身高（cm；深度估算需填）','右內頸來源限40–140 cm'),area=make('div');area.setAttribute('aria-live','polite');box.append(area);
 function refresh(){area.replaceChildren();const r=cvc(p,{site:site.value,height:height.value===''?undefined:height.valueAsNumber}),grid=make('div',undefined,'equipment-grid');area.append(grid);tile(grid,'CVC 號數候選（舊表）',r.sizes.length?(r.sizes.join('／')+' Fr'):'需個別選擇');tile(grid,'初始置入深度估算',r.depth===null?'未提供':fmt(r.depth)+' cm');if(r.reason)area.append(make('p',r.reason,'dose-condition'));area.append(make('p','待人工檢視：號數為2021院內表候選，須按超音波血管口徑與實際器材選擇；深度估算須以尖端定位確認。','audit-flag'));
 details(area,['號數依Queen’s體重表，交界同時保留相鄰候選；本版不將此表外推至<3 kg、早產兒或>100 kg。Fr為管外徑規格，不是Gauge。','右內頸研究：深度(cm)＝1.7＋0.07 × 身高(cm)，僅限40–140 cm；60例心臟手術嬰兒／兒童，為較舊研究，並非所有病人通用規則。其他部位不套用，也不將器材總長當作應置入深度。','References/CVC1.jpg未標明置入部位，且身高公式未涵蓋100 cm等號，不直接匯入。CVC2.jpg為器材規格，不能由總長推定置入深度。','小於3 kg與早產兒、不同穿刺位置、先天解剖或血管異常均需專用評估。此處不包含UVC、PICC或透析導管。'],['queen','yoon']);
 }site.onchange=refresh;height.oninput=refresh;refresh();return box;
}
const previous=root.ClinicalUI.render;root.ClinicalUI.render=(name,p)=>name==='呼吸機設定'?renderVent(p):name==='CVC 號數與深度'?renderCVC(p):previous(name,p);
root.EquipmentCore={ventilation,cvc};if(typeof module!=='undefined')module.exports={ventilation,cvc};
})(typeof window!=='undefined'?window:globalThis);
