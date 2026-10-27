/* User-entered arithmetic. Reference values never replace user-entered doses. */
(function(root){
const C=root.ClinicalCore,D=root.ClinicalData,prior=root.ClinicalUI.render;
const fmt=n=>Number(n.toPrecision(9)).toLocaleString('en-US',{maximumFractionDigits:6});
const make=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
// Keep output figures visible; calculation text belongs in the disclosure.
function showResult(result,lines){
 const box=result.closest('section'),details=box.querySelector('.reference-details');let work=details.querySelector('.calculation-work');if(!work){work=make('div',undefined,'calculation-work');details.append(work)}work.replaceChildren();
 const grid=make('div',undefined,'number-grid');
 lines.forEach((text,i)=>{
  const isFigure=i===0||text.startsWith('平均速率：')||text.startsWith('輸注 ')||text.startsWith('稀釋算術：');
  if(isFigure){let display=text.split('（')[0];if(text.startsWith('稀釋算術：'))display=text.replace('稀釋算術：','');const tile=make('p',undefined,'number-tile');const colon=display.indexOf('：');if(colon>=0)tile.append(make('span',display.slice(0,colon),'figure-label'),make('strong',display.slice(colon+1)));else tile.textContent=display;grid.append(tile)}
  else work.append(make('p',text));
 });result.append(grid);
}
function compactReference(box,p){if(!box||!p)return box;const details=make('details',undefined,'reference-details');details.append(make('summary','計算依據與來源'));const keep=[];
 [...box.children].forEach(e=>{if(e.matches('h3,form,.infusion-result'))return;if(e.matches('.answer')||e.tagName==='P'&&e.textContent.startsWith('口管：')){e.classList.add('number-tile');keep.push(e)}else if(e.tagName==='P'&&e.textContent===p.summary)e.remove();else details.append(e)});
 if(!keep.length&&!box.querySelector('form'))keep.push(make('p','此項無自動估算數值；請展開查看量測方式或適用說明。','no-estimate'));
 box.append(...keep,details);const form=box.querySelector('form'),result=box.querySelector('.infusion-result');if(form&&result)box.insertBefore(result,form);return box;
}
function choose(form,label,options){const l=make('label',label),s=make('select');options.forEach(([v,t])=>{const o=make('option',t);o.value=v;s.append(o)});l.append(s);form.append(l);return s}
function number(form,label,hint){const l=make('label',label),i=make('input');Object.assign(i,{type:'number',inputMode:'decimal',step:'any',placeholder:hint});l.append(i);form.append(l);return {l,i}}
function norm(value,from,to){if(from===to)return value;if(from==='mg'&&to==='μg')return value*1000;if(from==='μg'&&to==='mg')return value/1000;throw Error('mmol與mg／μg不能直接互換，請使用相同量綱。')}
function volumeCalculator(name,p){const fluids=['輸液補充／快速輸注','缺損與持續流失補充'],blood=['紅血球濃厚液','新鮮冷凍血漿','血小板','冷凍沉澱品'];if(!fluids.includes(name)&&!blood.includes(name))return null;const box=make('section',undefined,'infusion calculator');box.append(make('h3',name+'換算'));if(!p){box.append(make('p','先套用年齡與體重。'));return box}box.append(make('p',p.summary));const form=make('form',undefined,'infusion-form');form.noValidate=true;box.append(form);
 const method=choose(form,'輸入方式',[['perkg','mL/kg → 總體積'],['volume','總體積mL → 速率'],...(name==='紅血球濃厚液'?[['hb','Hb增幅公式']]:[])]),amount=number(form,'每公斤體積（mL/kg）','自行輸入'),volume=number(form,'總體積（mL）','自行輸入'),hours=number(form,'輸注／補充時間（小時，選填）','填寫後計算mL/hr');let hb=null,target=null;if(name==='紅血球濃厚液'){hb=number(form,'目前Hb（g/dL）','自行輸入');target=number(form,'目標Hb（g/dL）','自行輸入')}
 const result=make('div',undefined,'infusion-result');result.setAttribute('aria-live','polite');const b=make('button','計算','primary');b.type='submit';form.append(b);box.insertBefore(result,form);result.dataset.empty='輸入數值後按「計算」';const clear=()=>{result.replaceChildren();box.querySelector('.calculation-work')?.replaceChildren();delete result.dataset.state};const sync=()=>{amount.l.hidden=method.value!=='perkg';volume.l.hidden=method.value!=='volume';if(hb){hb.l.hidden=target.l.hidden=method.value!=='hb'}clear()};method.onchange=sync;form.addEventListener('input',clear);form.addEventListener('change',clear);sync();
 const details=make('details',undefined,'reference-details');details.append(make('summary','計算依據與來源'),make('p','mL/kg × kg = mL；mL ÷ 小時 = mL/hr。自行決定用量與時間，不依來源範圍自動截限。'));if(hb)details.append(make('p','Hb模式：kg × 0.5 × Hb增幅(g/L)，g/dL增幅需乘10。RCH此參考用於非出血、小於20kg且非新生兒；數值換算不代表判定該情境適用。'));const s=D.sources[blood.includes(name)?'blood':'fluids'],a=make('a',s.title);a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';details.append(a);box.append(details);
 form.onsubmit=e=>{e.preventDefault();clear();try{C.checkPatient(p);let v,formula;if(method.value==='perkg'){if(!Number.isFinite(amount.i.valueAsNumber)||amount.i.valueAsNumber<=0)throw Error('每公斤體積須大於0。');v=amount.i.valueAsNumber*p.weight;formula=amount.i.value+' mL/kg × '+p.weight+' kg'}else if(method.value==='volume'){v=volume.i.valueAsNumber;formula='自行輸入總體積'}else{if(!Number.isFinite(hb.i.valueAsNumber)||!Number.isFinite(target.i.valueAsNumber)||hb.i.valueAsNumber<=0||target.i.valueAsNumber<=hb.i.valueAsNumber)throw Error('Hb須為正數，目標須大於目前值。');v=p.weight*5*(target.i.valueAsNumber-hb.i.valueAsNumber);formula=p.weight+' kg × 0.5 × ('+target.i.value+' − '+hb.i.value+') g/dL × 10'}if(!Number.isFinite(v)||v<=0)throw Error('總體積須為有效正數。');const lines=['總體積：'+fmt(v)+' mL','公式：'+formula];if(hours.i.value!==''){const h=hours.i.valueAsNumber;if(!Number.isFinite(h)||h<=0||!Number.isFinite(v/h))throw Error('時間須為有效正數。');lines.push('平均速率：'+fmt(v/h)+' mL/hr（'+fmt(v)+' ÷ '+hours.i.value+'）。');if(blood.includes(name)&&h>4)lines.push('所填時間超過來源4小時參考；仍顯示算術結果。')}lines.push('依原輸入換算，不自動決定血品單位、液體種類或輸注處方。');showResult(result,lines);result.dataset.state='success'}catch(err){result.append(make('p',err.message));result.dataset.state='error'}};return box}
function render(name,p){const drug=D.drugs[name];if(!drug)return volumeCalculator(name,p)||compactReference(prior(name,p),p);
 const box=make('section',undefined,'infusion calculator');box.append(make('h3','劑量・體積・速率換算'));
 if(!p){box.append(make('p','先在上方套用年齡與體重。'));return box}
 box.append(make('p',p.summary));const form=make('form',undefined,'infusion-form');form.noValidate=true;box.append(form);
 const purpose=choose(form,'參考情境（可不選）',[['','自由換算'],...drug.modes.map(m=>[m.id,m.title])]);
 const units=choose(form,'輸入劑量單位',[['mg/kg','mg/kg／次'],['μg/kg','μg/kg／次'],['mmol/kg','mmol/kg／次'],['mL/kg','mL/kg／次'],['μg/kg/min','μg/kg/min'],['μg/kg/hr','μg/kg/hr'],['mg/kg/min','mg/kg/min'],['mg/kg/hr','mg/kg/hr']]);
 const dose=number(form,'每公斤劑量','自行輸入'),concentration=number(form,'最終給藥濃度','已配好藥液的標示');
 const concUnit=choose(form,'最終濃度單位',[['mg','mg/mL'],['μg','μg/mL'],['mmol','mmol/mL']]);
 const minutes=number(form,'單次輸注時間（分鐘，選填）','填寫後另算mL/hr');
 const stock=number(form,'原液濃度（選填）','需要稀釋換算時填寫');
 const stockUnit=choose(form,'原液濃度單位',[['mg','mg/mL'],['μg','μg/mL'],['mmol','mmol/mL']]);
 const total=number(form,'配製後總體積（mL，選填）','與原液濃度一起填');
 const ref=make('p',undefined,'reference-line');const result=make('div',undefined,'infusion-result');result.setAttribute('aria-live','polite');
 const button=make('button','計算','primary');button.type='submit';form.append(button);box.insertBefore(result,form);result.dataset.empty='輸入數值後按「計算」';
 const info=make('details',undefined,'reference-details');info.append(make('summary','計算依據與來源'),make('p',drug.warning));const sourceArea=make('div');info.append(ref,sourceArea);box.append(info);
 function clear(){result.replaceChildren();box.querySelector('.calculation-work')?.replaceChildren();delete result.dataset.state}
 function sync(){clear();const m=drug.modes.find(m=>m.id===purpose.value),volume=units.value==='mL/kg',infusion=units.value.endsWith('/min')||units.value.endsWith('/hr');for(const e of [concentration.l,concUnit.parentElement,stock.l,stockUnit.parentElement,total.l])e.hidden=volume;minutes.l.hidden=infusion;
  ref.textContent=m?'參考：'+m.min+(m.max===m.min?'':'–'+m.max)+' '+m.unit+(m.cap?'；來源單次上限 '+m.cap+' '+m.unit.split('/')[0]:'')+'。只作比較，不自動更改輸入。':'依自行輸入的劑量與濃度換算；不預填建議值。';
  sourceArea.replaceChildren();const ids=m?[m.source]:drug.sources||[...new Set(drug.modes.map(m=>m.source))];ids.forEach(id=>{const s=D.sources[id];if(!s)return;const a=make('a',s.title);a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';sourceArea.append(a,make('br'))});if(m?.admin)sourceArea.append(make('p',m.admin));}
 purpose.onchange=()=>{const m=drug.modes.find(m=>m.id===purpose.value);if(m){units.value=m.unit;concUnit.value=m.unit.split('/')[0]==='μg'?'μg':m.unit.split('/')[0]==='mmol'?'mmol':'mg';stockUnit.value=concUnit.value==='mmol'?'mmol':'mg'}sync()};units.onchange=sync;
 form.addEventListener('input',clear);form.addEventListener('change',clear);sync();
 form.onsubmit=e=>{e.preventDefault();clear();try{const source=drug.modes.find(m=>m.id===purpose.value),u=units.value,base=u.split('/')[0],infusion=u.endsWith('/min')||u.endsWith('/hr');let m={groups:[p.group],unit:u,kind:infusion?'infusion':'bolus'};if(source&&source.unit===u)m={...source,unit:u,kind:infusion?'infusion':'bolus'};delete m.recipe;delete m.requireCap;delete m.minMinutes;
  const o={dose:dose.i.valueAsNumber};if(base!=='mL')o.concentration=norm(concentration.i.valueAsNumber,concUnit.value,base);
  if(!infusion&&minutes.i.value!==''){o.minutes=minutes.i.valueAsNumber;if(!Number.isFinite(o.minutes)||o.minutes<=0)throw Error('輸注時間須大於0。')}
  if(base!=='mL'&&(stock.i.value!==''||total.i.value!=='')){if(!Number.isFinite(total.i.valueAsNumber)||total.i.valueAsNumber<=0)throw Error('稀釋換算需要大於0的配製後總體積。');const recipeBase=base==='mmol'?'mmol':'mg';o.stock=norm(stock.i.valueAsNumber,stockUnit.value,recipeBase);if(!Number.isFinite(o.stock)||o.stock<=0)throw Error('稀釋換算需要大於0的原液濃度。');o.total=total.i.valueAsNumber;m.recipe={stock:o.stock,c:norm(o.concentration,base,recipeBase),total:o.total,unit:recipeBase};}
  const r=C.dose(m,p,o),lines=[infusion?'輸注速率：'+fmt(r.rate)+' mL/hr':'本次用量：'+fmt(r.amount)+' '+r.unit+(r.volume!==null?' = '+fmt(r.volume)+' mL':''),'公式：'+dose.i.value+' '+u+' × '+p.weight.toFixed(1)+' kg = '+fmt(r.amount)+' '+base+(infusion?(u.endsWith('/min')?'/min':'/hr'):'')];
  if(base!=='mL')lines.push((infusion?'速率':'體積')+'：'+fmt(r.amount)+(infusion&&u.endsWith('/min')?' × 60':'')+' ÷ '+fmt(o.concentration)+' '+base+'/mL = '+fmt(infusion?r.rate:r.volume)+(infusion?' mL/hr':' mL'));
  if(o.minutes)lines.push('輸注 '+minutes.i.value+' 分鐘：'+fmt(r.rate)+' mL/hr。');
  if(r.mix)lines.push('稀釋算術：抽原液 '+fmt(r.mix.draw)+' mL，加稀釋液 '+fmt(r.mix.add)+' mL，配成最終 '+fmt(r.mix.total)+' mL。','C₁V₁=C₂V₂；此處不選擇稀釋液或判定相容性。');
  lines.push(...r.notes,'結果依原輸入計算，未自動截限、提高劑量或按幫浦刻度取整。');showResult(result,lines);result.dataset.state='success';
 }catch(err){result.append(make('p',err.message));result.dataset.state='error'}};return box;
}
root.ClinicalUI.showResult=showResult;
root.ClinicalUI.render=render;
})(window);
