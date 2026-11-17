(() => {
  const host=document.getElementById('adult-drugs');if(!host)return;
  const A=window.AdultAnticoag,D=A.data,fmt=n=>Number(n.toPrecision(10)).toLocaleString('en-US',{maximumFractionDigits:4});
  function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
  function select(form,id,title,options){const l=el('label',title),s=el('select');s.id=id;l.htmlFor=id;options.forEach(([value,text])=>{const o=el('option',text);o.value=value;s.append(o);});l.append(s);form.append(l);return s;}
  function input(form,id,title,hint,min,max){const l=el('label',title),i=el('input');Object.assign(i,{id,type:'number',inputMode:'decimal',step:'any',placeholder:hint,min,max});l.htmlFor=id;l.append(i);form.append(l);return i;}
  function resultBox(){const n=el('div',undefined,'adult-result');n.setAttribute('role','status');n.setAttribute('aria-live','polite');return n;}
  function sources(box,keys,notes){box.replaceChildren(el('summary','來源與劑量／泡法備註'));if(notes)box.append(el('p',notes));for(const key of keys){const s=D.sources[key],a=el('a',s.title);a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';box.append(a,el('br'));}box.append(el('p',`查閱：${D.date}。臺灣現用製劑與院內流程尚待核對。`,'adult-small'));}
  const h=el('article',undefined,'adult-drug');h.id='adult-heparin';h.append(el('h3','Heparin'),el('p','未分段肝素 UFH · ECMO／體外循環機 CPB','adult-alias'));
  const hf=el('form',undefined,'adult-form');hf.noValidate=true;
  const mode=select(hf,'adult-heparin-mode','流程／給藥方式',Object.entries(D.modes).map(([id,m])=>[id,m.label]));
  const weight=input(hf,'adult-heparin-weight','成人體重（kg；1–300）','例如70',1,300);
  const hdose=input(hf,'adult-heparin-dose','選用劑量','',0,'');
  const hstock=input(hf,'adult-heparin-stock','實際原液濃度（units/mL）','請填5000',0,'');
  const hdiluent=select(hf,'adult-heparin-diluent','持續輸注稀釋液',[['NS','NS（0.9% NaCl）'],['D5W','D5W']]);
  const hs=el('button','換算劑量／體積','primary');hs.type='submit';hf.append(hs);
  const doseBox=el('div',undefined,'adult-dose'),prep=el('div',undefined,'adult-recipe'),hr=resultBox(),source=el('details',undefined,'adult-sources');
  function clearH(){hr.replaceChildren();hr.classList.remove('error');}
  function changeMode(){
    const m=D.modes[mode.value],inf=mode.value==='ecmo-infusion';clearH();hdose.value='';hdose.min=m.min;hdose.max=m.max;hdose.placeholder=`${m.min}–${m.max} ${m.unit}`;
    hdose.parentElement.firstChild.textContent=`選用劑量（${m.unit}）`;
    hdiluent.parentElement.hidden=!inf;hdiluent.disabled=!inf;
    doseBox.replaceChildren(el('p',m.dose),el('p',m.note,'adult-small'));
    prep.replaceChildren(el('h4',inf?'持續輸注泡法':'IV bolus 體積'));
    prep.append(el('p',inf?`原液5,000 units/mL，抽5 mL（25,000 units），加${hdiluent.value} 45 mL至總量50 mL。`:'以5,000 units/mL原液換算所選bolus的抽取體積；不是從持續輸注50 mL針筒取藥。'));
    if(inf)prep.append(el('strong','最終濃度500 units/mL；劑量單位為每小時，無需再乘60。'));
    sources(source,m.sources,'僅起始參考；本版不判讀ACT／aPTT／anti-Xa、不推薦追加量。HIT或Heparin禁忌者不適用。');
  }
  mode.addEventListener('change',changeMode);hf.addEventListener('input',clearH);hf.addEventListener('change',clearH);
  hdiluent.addEventListener('change',()=>{const value=hdose.value;changeMode();hdose.value=value;});
  hf.addEventListener('submit',e=>{e.preventDefault();clearH();try{
    const r=A.heparin({mode:mode.value,weight:Number(weight.value),dose:Number(hdose.value),stock:Number(hstock.value),diluent:hdiluent.value});
    if(r.kind==='bolus')hr.append(el('strong',`${fmt(r.units)} units`),el('p',`抽原液${fmt(r.stockVolume)} mL（${hstock.value} units/mL）。`),el('p',`${weight.value} kg × ${hdose.value} units/kg；${D.modes[mode.value].label}。`));
    else hr.append(el('strong',`${fmt(r.rate)} mL/hr`),el('p',`${fmt(r.unitsPerHour)} units/hr = ${hdose.value} units/kg/hr × ${weight.value} kg。`),el('p',`25,000 units／50 mL = 500 units/mL；mL/hr = units/hr ÷ 500。`));
  }catch(error){hr.classList.add('error');hr.append(el('p',error.message));}});
  h.append(doseBox,prep,hf,hr,source);host.append(h);changeMode();

  const p=el('article',undefined,'adult-drug');p.id='adult-protamine';p.append(el('h3','Protamine sulfate'),el('p','UFH回補劑量 · mg／100 units','adult-alias'));
  const pd=el('div',undefined,'adult-dose');pd.append(el('p','UFH：1 mg約中和100 units「仍有作用」的Heparin。'),el('p','CPB：選用比值<1.0 mg／100 units初始Heparin；由處方／滴定決定。'),el('p','本次給藥≤50 mg，至少10分鐘；參考總量不等於單次給藥量。'));p.append(pd);
  const pf=el('form',undefined,'adult-form');pf.noValidate=true;
  const circuit=select(pf,'adult-protamine-circuit','體外循環狀態',[['','請選擇'],['off','已脫離ECMO／CPB'],['running','仍在ECMO／CPB'],['unknown','未確認']]);
  const basis=select(pf,'adult-protamine-basis','回補計算依據',[['cpb-initial','CPB：初始Heparin劑量參考'],['residual','經評估需中和的殘餘UFH']]);
  const hu=input(pf,'adult-protamine-heparin','初始Heparin劑量（units；非累積總量）','請填實際初始給藥量',1,1000000);
  const ratio=input(pf,'adult-protamine-ratio','選用比值（mg／100 units；>0且<1）','例如0.8',0,1);
  const single=input(pf,'adult-protamine-single','本次處方Protamine（mg；≤50，可留白）','留白只看總量參考',0,50);
  const ps=input(pf,'adult-protamine-stock','實際Protamine原液（mg/mL）','泡法換算請填10',0,'');
  const vol=select(pf,'adult-protamine-volume','本次稀釋後總量',[['20','20 mL'],['50','50 mL']]);
  const diluent=select(pf,'adult-protamine-diluent','本次稀釋液',[['NS','NS（0.9% NaCl）'],['D5W','D5W']]);
  const button=el('button','換算回補參考／本次泡法','primary');button.type='submit';pf.append(button);
  const pr=resultBox(),pp=el('div',undefined,'adult-recipe');pp.append(el('h4','本次泡法'),el('p','原液10 mg/mL可不稀釋；若稀釋，預設NS。填入本次處方量後換算至20或50 mL，現配即用、不儲存。'),el('p','總量參考>50 mg時，不自動截成50 mg或拆次；給藥計畫與累積量需另外核對。','adult-small'));
  function clearP(){pr.replaceChildren();pr.classList.remove('error');}
  basis.addEventListener('change',()=>{hu.value='';ratio.value='';single.value='';const residual=basis.value==='residual';ratio.disabled=residual;ratio.parentElement.hidden=residual;
    hu.parentElement.firstChild.textContent=residual?'需中和的殘餘UFH（units；非累積總量）':'初始Heparin劑量（units；非累積總量）';});
  pf.addEventListener('input',clearP);pf.addEventListener('change',clearP);
  pf.addEventListener('submit',e=>{e.preventDefault();clearP();try{
    const r=A.protamine({basis:basis.value,circuit:circuit.value,heparinUnits:Number(hu.value),ratio:Number(ratio.value),singleDose:single.value===''?null:Number(single.value),stock:Number(ps.value),finalVolume:Number(vol.value),diluent:diluent.value});
    pr.append(el('strong',`回補總量參考 ${fmt(r.referenceMg)} mg`),el('p',`非單次給藥量：${fmt(Number(hu.value))} units × ${fmt(r.ratio)} mg／100 units。`));
    if(r.preparation){const q=r.preparation;pr.append(el('p',`本次處方${fmt(q.doseMg)} mg：抽10 mg/mL原液${fmt(q.stockVolume)} mL，加${diluent.value} ${fmt(q.diluentVolume)} mL至總量${q.finalVolume} mL（${fmt(q.concentration)} mg/mL），至少10分鐘緩慢給入。`));}
    else pr.append(el('p','尚未輸入本次處方量，未產生給藥泡法。'));
    if(r.referenceMg>50)pr.append(el('p','參考總量超過50 mg，不可作為一次快速注射；本版不自動排程／拆次。'));
  }catch(error){pr.classList.add('error');pr.append(el('p',error.message));}});
  const psource=el('details',undefined,'adult-sources');sources(psource,['protamine','prosulf','cpb','pbm','alfred'],'回補量需隨給藥時間、已回補量及凝血結果重評。本版不按時間自動估算Heparin殘餘量、不處理LMWH、不把ACT延長直接視為殘餘Heparin。在ECMO迴路仍運轉時使用Protamine可能造成迴路血栓，故本版停算。');
  p.append(pp,pf,pr,psource);host.append(p);
})();
