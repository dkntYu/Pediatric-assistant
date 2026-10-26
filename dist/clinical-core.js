(function(root){
const valid=n=>typeof n==='number'&&Number.isFinite(n),positive=n=>valid(n)&&n>0;
function checkPatient(p){if(!p||!['preterm','neonate','infant','child'].includes(p.group)||!positive(p.weight)||p.weight>200||Math.abs(p.weight*10-Math.round(p.weight*10))>1e-7)throw Error('請先套用有效體重：0.1–200.0 kg，最多一位小數。');if(!valid(p.ageMonths)||p.ageMonths<0||p.ageMonths>=216)throw Error('本工具只處理未滿18歲，請確認年齡。');}
function eligibility(mode,p){checkPatient(p);if(!mode.groups.includes(p.group))return '此模式沒有本年齡族群的已整理依據，請選其他模式或參考專用指引。';if(mode.minMonths!==undefined&&p.ageMonths<mode.minMonths)return '未達此模式最低年齡。';if(mode.maxMonths!==undefined&&p.ageMonths>mode.maxMonths)return '超過此模式年齡範圍。';if(mode.aboveMonths!==undefined&&p.ageMonths<=mode.aboveMonths)return '此模式限大於 '+mode.aboveMonths+' 個月。';return '';}
function dilution(recipe,stock){if(!positive(stock)||Math.abs(stock-recipe.stock)>1e-8)throw Error('原液濃度不符來源配方：需 '+recipe.stock+' '+recipe.unit+'/mL。');const draw=recipe.c*recipe.total/stock,add=recipe.total-draw;if(!positive(draw)||add<0)throw Error('不合法的稀釋體積。');return {draw,add,total:recipe.total,c:recipe.c};}
function dose(mode,p,o){const problem=eligibility(mode,p);if(problem)throw Error(problem);if(!o.confirm)throw Error('請核對來源、適應症、病人條件與院內規範。');if(mode.renal&&o.renal!=='normal')throw Error('腎功能異常或不明，本版不執行此模式。');if(!valid(o.dose)||o.dose<mode.min||o.dose>mode.max)throw Error('每公斤劑量必須在 '+mode.min+'–'+mode.max+' '+mode.unit+'。');let cap=mode.cap??Infinity;if(mode.requireCap){if(!positive(o.localCap))throw Error('請輸入已核對的院內單次上限。');cap=o.localCap;}
 if(mode.centralAbove&&o.dose>mode.centralAbove&&o.access!=='central')throw Error('此來源在該劑量需中央管路；周邊或不明時停止計算。');
 const raw=o.dose*p.weight,amount=Math.min(Math.max(raw,mode.floor??0),cap),capped=amount!==raw,unit=mode.unit.split('/')[0];let volume=null,rate=null;
 if(mode.kind==='infusion'){
  if(!positive(o.concentration))throw Error('請輸入最終濃度（μg/mL），不得填原液mg/mL。');
  if(mode.recipe&&Math.abs(o.concentration-mode.recipe.c*1000)>1e-8)throw Error('此模式最終濃度需與來源配方一致。');
  if(mode.premix&&!mode.premix.some(c=>Math.abs(o.concentration-c*1000)<1e-8))throw Error('此模式僅支援所列藥局預混濃度。');
  rate=amount*(mode.unit.endsWith('/min')?60:1)/o.concentration;
 }else if(unit==='mL')volume=amount;
 else{if(!positive(o.concentration))throw Error('請輸入實際給藥濃度（'+unit+'/mL）。');if(mode.concentration!==undefined&&Math.abs(o.concentration-mode.concentration)>1e-8)throw Error('此模式僅支援 '+mode.concentration+' '+unit+'/mL。');volume=amount/o.concentration;}
 if(mode.minMinutes||mode.maxRateKgHour){if(!positive(o.minutes)||o.minutes<(mode.minMinutes||0))throw Error('輸注時間至少 '+mode.minMinutes+' 分鐘。');if(mode.maxRateKgHour&&amount/p.weight/(o.minutes/60)>mode.maxRateKgHour+1e-9)throw Error('超過本模式最大每公斤每小時給藥速率。');rate=volume*60/o.minutes;}
 let mix=null;if(mode.recipe){mix=dilution(mode.recipe,o.stock);const expected=mode.kind==='infusion'?mode.recipe.c*1000:unit==='μg'?mode.recipe.c*1000:mode.recipe.c;if(Math.abs(o.concentration-expected)>1e-8)throw Error('給藥濃度與稀釋配方不一致。');}
 if(mix&&volume!==null&&volume>mix.total+1e-8)throw Error('本次需要的給藥體積超過此配方總量；請由藥師核對較大批次，不直接照此配方給藥。');
 return {raw,amount,unit,capped,cap,floor:mode.floor,volume,rate,mix};
}
function maintenance(p){checkPatient(p);if(!['infant','child'].includes(p.group)||p.ageMonths<1)throw Error('此維持輸液公式限滿1個月，早產／新生兒須依日齡、胎齡與電解質處方。');const w=p.weight;if(w<3)throw Error('小於3 kg需個別評估，本表不自動計算。');return {hour:w>60?100:w<=10?4*w:w<=20?40+2*(w-10):60+w-20,day:w>60?2400:w<=10?100*w:w<=20?1000+50*(w-10):1500+20*(w-20)};}
function bolusFluid(p,mlkg){checkPatient(p);if(!['infant','child'].includes(p.group))throw Error('出生復甦／新生兒補液不套用此兒科模式。');if(mlkg!==10)throw Error('本模式固定10 mL/kg，再評估反應。');return p.weight*mlkg;}
function ongoing(p,loss,hours){checkPatient(p);if(!['infant','child'].includes(p.group))throw Error('新生兒需專用流失補充計畫。');if(!valid(loss)||loss<0||!positive(hours)||hours>24)throw Error('請輸入已量測流失量與有效觀察時間（不超過24小時）。');return loss/hours;}
function neonatalFluid(p,o){checkPatient(p);if(!['preterm','neonate'].includes(p.group))throw Error('此模式只限新生兒／早產兒。');if(!positive(p.birthWeeks)||p.birthWeeks<=32||!positive(o.birthWeight)||o.birthWeight<=1.5)throw Error('此來源僅限出生>32週且出生體重>1.5kg；更早產／更低體重不計算。');if(!Number.isInteger(p.postnatalDays)||p.postnatalDays<0||p.postnatalDays>28)throw Error('請確認出生後完整日齡。');if(!o.confirm||o.setting!=='nonNICU')throw Error('需確認非NICU及此來源適用性。');const day=p.postnatalDays+1,term=p.birthWeeks>=37,range=day===1?[60,60]:day===2?(term?[90,90]:[80,80]):day===3?(term?[100,120]:[100,100]):term?[100,120]:[120,120];if(!valid(o.mlkg)||o.mlkg<range[0]||o.mlkg>range[1])throw Error('此來源第'+day+'天範圍 '+range.join('–')+' mL/kg/day。');if(!valid(o.enteral)||o.enteral<0||!valid(o.other)||o.other<0)throw Error('腸道與其他液體量不可空白／負值。');const dosingWeight=Math.max(p.weight,o.birthWeight),total=dosingWeight*o.mlkg,remaining=total-o.enteral-o.other;if(remaining<0)throw Error('已輸入液體量超過所選總液體目標，不自動開負速率。');return {day,range,dosingWeight,total,remaining,rate:remaining/24};}
function neonatalBlood(p,type,o){checkPatient(p);if(!['preterm','neonate'].includes(p.group))throw Error('本模式僅新生兒／早產兒。');const ranges={rbc:[10,20],platelets:[10,10],ffp:[10,20],cryo:[5,10]},range=ranges[type];if(!range||!valid(o.mlkg)||o.mlkg<range[0]||o.mlkg>range[1])throw Error('輸入量超出此血品來源範圍。');if(!o.confirm)throw Error('請確認血庫規格與個別輸注計畫。');if(!positive(o.hours)||o.hours>4||!valid(o.elapsedMinutes)||o.elapsedMinutes<0||o.hours*60+o.elapsedMinutes>240)throw Error('請核對時間，從出血庫起算不超過4小時。');return {volume:p.weight*o.mlkg,rate:p.weight*o.mlkg/o.hours};}
function neonatalBolus(p,o){checkPatient(p);if(!['preterm','neonate'].includes(p.group)||!positive(p.birthWeeks)||p.birthWeeks<=32||!positive(o.birthWeight)||o.birthWeight<=1.5)throw Error('此來源僅限出生>32週且>1.5kg的新生兒；更早產／NICU出生復甦需專用流程。');if(o.setting!=='nonNICU'||!o.confirm)throw Error('請確認非NICU且有休克／容量不足適應症。');return p.weight*10;}
function blood(p,type,o){checkPatient(p);if(!['infant','child'].includes(p.group)||p.ageMonths<1)throw Error('此血品來源不含新生兒／早產兒，不套用。');if(!o.confirm)throw Error('請確認非重大出血情境及血庫產品規格。');const w=p.weight;let volume,formula;
 if(type==='rbc'){if(w>=20)throw Error('此Hb公式限小於20 kg；≥20 kg先依血庫成人單位處方並重新評估，不猜測單位體積。');if(!positive(o.hb)||!positive(o.target)||o.target<=o.hb||o.target-o.hb>2)throw Error('Hb以g/dL輸入；目標須較目前高，且單次增幅不超過2 g/dL。');volume=w*0.5*(o.target-o.hb)*10;formula='kg × 0.5 × Hb增幅(g/L)；g/dL增幅需乘10';}
 else if(type==='platelets'){if(w>=15)throw Error('≥15 kg依血庫單位處方；不將澳洲單位換成臺灣單位。');volume=w*10;formula='10 mL/kg';}
 else{const range=type==='ffp'?[10,20]:type==='cryo'?[5,10]:null;if(!range)throw Error('未知血品');if(!valid(o.mlkg)||o.mlkg<range[0]||o.mlkg>range[1])throw Error('每公斤用量超出來源範圍');volume=w*o.mlkg;formula=o.mlkg+' mL/kg';}
 if(!positive(o.hours)||o.hours>4)throw Error('請輸入0–4小時內的輸注時間；須扣除出血庫後已經過的時間。');if(!valid(o.elapsedMinutes)||o.elapsedMinutes<0||o.elapsedMinutes+o.hours*60>240)throw Error('從血品出血庫起算總時間不得超過4小時。');
 return {volume,rate:volume/o.hours,formula};
}
function airway(p,type){checkPatient(p);const w=p.weight,y=p.ageMonths/12;
 if(type==='lma'){const rows=[[0,5,'1'],[5,10,'1.5'],[10,20,'2'],[20,30,'2.5'],[30,50,'3'],[50,70,'4'],[70,100,'5'],[100,Infinity,'6']];return {sizes:rows.filter(([a,b])=>w>=a&&w<=b).map(r=>r[2])};}
 if(type==='ett'){
  if(['preterm','neonate'].includes(p.group)){if(!positive(p.correctedWeeks))throw Error('請填寫胎齡；足月新生兒也需要出生胎齡與日齡。');const rows=[[23,25,0.5,0.6,2.5,5.5,6.5],[25,27,0.7,0.8,2.5,6,7],[27,30,0.9,1,2.5,6.5,7.5],[30,33,1.1,1.4,3,7,8],[33,35,1.5,1.8,3,7.5,8.5],[35,38,1.9,2.4,3.5,8,9],[38,41,2.5,3.1,3.5,8.5,9.5],[41,44,3.2,4.2,3.5,9,10]];
   const byAge=rows.find(r=>p.correctedWeeks>=r[0]&&p.correctedWeeks<r[1]);if(!byAge||w<byAge[2]||w>byAge[3])throw Error('校正胎齡與體重未同時落在來源表同一列，停止自動建議；請人工核對新生兒插管表。');return {uncuffed:byAge[4],oral:byAge[5],nasal:byAge[6],neonatal:true};}
  if(y<1)return {uncuffed:p.ageMonths<6?3.5:4,oral:null,nasal:null,infant:true};
  if(y>12)throw Error('本年齡估算式暫限1–12歲；較大兒童依解剖與器材選擇。');return {cuffed:y/4+3.5,uncuffed:y/4+4,oral:y/2+12,nasal:null};
 }
 if(type==='blade'){if(p.group==='preterm')return {text:'來源備片：直片00或0；依實際解剖選擇。'};if(p.group==='neonate')return {text:'來源備片：1號；依實際解剖選擇。'};return {text:y<2?'備1號，直片常用；實際選擇依器材與視野。':y<=8?'備1.5–2號；直／彎片依視野。':'備2–3號；直／彎片依視野。'};}
 throw Error('此器材需實際量測，不以體重推算。');
}
root.ClinicalCore={checkPatient,eligibility,dilution,dose,maintenance,bolusFluid,ongoing,neonatalFluid,neonatalBlood,neonatalBolus,blood,airway};if(typeof module!=='undefined')module.exports=root.ClinicalCore;
})(typeof window!=='undefined'?window:globalThis);
