(function(root){
const original=root.ClinicalUI.render,C=root.ClinicalCore,D=root.ClinicalData;
const make=(t,text,cls)=>{const e=document.createElement(t);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
const fmt=n=>Number(n.toPrecision(7)).toLocaleString('en-US',{maximumFractionDigits:6});
const iv=m=>!/(?:\bPO\b|\bIM\b|\bSC\b|\bIN\b)/.test(m.title);
const range=(a,b)=>fmt(a)+(a===b?'':'–'+fmt(b));
function render(name,p){
 const d=D.drugs[name];if(!d){const box=original(name,p);if(!box||!p)return box;const details=make('details',undefined,'reference-details');details.append(make('summary','計算依據與來源'));[...box.children].forEach(e=>{if(e.tagName==='P'&&e.textContent.startsWith('口管：'))e.classList.add('answer');if(e.matches('form,.infusion-result,.answer,h3'))return;if(e.matches('.clinical-warning'))return;details.append(e)});box.append(details);return box}
 const box=make('section',undefined,'recommendations');
 if(!p){box.append(make('p','請先套用年齡與體重。'));return box}
 if(d.blocked){box.append(make('p',d.warning,'unavailable'));return box}
 const modes=d.modes.filter(m=>iv(m)&&!C.eligibility(m,p));
 if(!modes.length){box.append(make('p','此年齡族群沒有可用的 IV 建議劑量。','unavailable'));return box}
 for(const m of modes){
  const row=make('section',undefined,'dose-row');
  row.append(make('h4',m.title.replace(/IV\/IO|IV\/UVC/g,'IV')));
  const unit=m.unit.split('/')[0],suffix=m.kind==='infusion'?(m.unit.endsWith('/min')?'/min':'/hr'):'';
  const adjust=v=>Math.max(m.floor??0,Math.min(v*p.weight,m.cap??Infinity));
  const low=adjust(m.min),high=adjust(m.max);
  row.append(make('p',range(low,high)+' '+unit+suffix,'dose-number'));
  row.append(make('p',m.kind==='infusion'?'持續靜脈輸注':'靜脈給藥','dose-label'));
  if(m.concentration&&unit!=='mL')row.append(make('p',range(low/m.concentration,high/m.concentration)+' mL · '+m.concentration+' '+unit+'/mL','dose-volume'));
  else if(m.recipe&&unit!=='mL'){const conc=m.recipe.c*(unit==='μg'?1000:1),factor=m.kind==='infusion'&&m.unit.endsWith('/min')?60:1;row.append(make('p',range(low*factor/conc,high*factor/conc)+(m.kind==='infusion'?' mL/hr':' mL'),'dose-volume'));row.append(make('p','依來源配方 '+conc+' '+unit+'/mL；實際濃度不同須重新換算','dose-condition'))}
  if(m.admin)row.append(make('p',m.admin,'dose-admin'));
  if(m.renal)row.append(make('p','腎功能異常需另行調整','dose-condition'));
  if(m.requireCap)row.append(make('p','須另核對院內單次上限','dose-condition'));
  if(m.centralAbove)row.append(make('p','周邊管路用量限制需另核對','dose-condition'));
  if(m.minMinutes&&!m.admin)row.append(make('p','輸注時間至少 '+m.minMinutes+' 分鐘','dose-admin'));
  const detail=make('details',undefined,'reference-details');detail.append(make('summary','計算依據與來源'));
  detail.append(make('p',m.min+(m.min===m.max?'':'–'+m.max)+' '+m.unit+' × '+p.weight.toFixed(1)+' kg'));
  if(m.cap)detail.append(make('p','來源單次上限：'+m.cap+' '+unit+'；顯示值已套用上限。'));
  if(m.floor)detail.append(make('p','本來源最低量：'+m.floor+' '+unit+'；顯示值已套用。'));
  detail.append(make('p',d.warning));
  if(m.recipe){const r=m.recipe;detail.append(make('p','來源配方：原液 '+r.stock+' '+r.unit+'/mL → '+r.c+' '+r.unit+'/mL；最終 '+r.total+' mL，稀釋液 '+r.diluent+'。'))}
  if(m.premix)detail.append(make('p','來源預混液：'+m.premix.join('／')+' mg/mL。'));
  const s=D.sources[m.source];if(s){const a=make('a',s.title);a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';detail.append(a)}
  row.append(detail);box.append(row);
 }
 const tools=make('details',undefined,'reference-details conversion-tools');tools.append(make('summary','濃度、稀釋與指定劑量換算'));
 const old=original(name,p);const select=old.querySelector('.mode-select');if(select){[...select.options].forEach(o=>{if(o.value&&!modes.some(m=>m.id===o.value))o.remove()});}
 tools.append(old);box.append(tools);return box;
}
root.ClinicalUI.render=render;
})(window);
