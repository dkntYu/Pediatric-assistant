(() => {
  const host=document.getElementById('adult-drugs');if(!host)return;
  const D=window.AdultData,C=window.AdultCore;
  const fmt=n=>Number(n.toPrecision(10)).toLocaleString('en-US',{maximumFractionDigits:4});
  function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
  function select(form,id,title,options){const label=el('label',title),field=el('select');field.id=id;
    options.forEach(([value,text])=>{const o=el('option',text);o.value=value;field.append(o);});label.htmlFor=id;label.append(field);form.append(label);return field;}
  function input(form,id,title,placeholder,min,max){const label=el('label',title),field=el('input');
    Object.assign(field,{id,type:'number',inputMode:'decimal',step:'any',placeholder,min,max});label.htmlFor=id;label.append(field);form.append(label);return field;}
  for(const d of D.drugs){
    const card=el('article',undefined,'adult-drug');card.id='adult-'+d.id;
    const heading=el('h3',d.name);card.append(heading);if(d.alias)card.append(el('p',d.alias,'adult-alias'));
    const doses=el('div',undefined,'adult-dose');d.dose.forEach(t=>doses.append(el('p',t)));card.append(doses);
    const recipeBox=el('div',undefined,'adult-recipe'),form=el('form',undefined,'adult-form');form.noValidate=true;
    const recipeSelect=select(form,card.id+'-recipe','泡法（最終總量）',d.recipes.map(r=>[r.id,`${r.amount} ${d.amountUnit}／${r.volume} mL`]));
    const diluent=select(form,card.id+'-diluent','稀釋液',d.recipes[0].diluents.map(v=>[v,v==='0.9% NaCl'?'NS（0.9% NaCl）':v]));
    const stock=input(form,card.id+'-stock',`實際原液濃度（${d.stockUnit}）`,`請填 ${d.stock}`,0,'');
    const dose=input(form,card.id+'-dose',`選用劑量（${d.unit}）`,`${d.min}–${d.max}`,d.min,d.max);
    let weight,renal;
    if(d.weightBased){weight=input(form,card.id+'-weight','成人體重（kg；1–300）','例如 70',1,300);
      renal=select(form,card.id+'-renal','腎功能',[['','請選擇'],['normal','已確認正常'],['impaired','異常'],['unknown','尚未確認']]);}
    const line=select(form,card.id+'-line','輸注管路',[['','請選擇'],['central','中央靜脈'],['other','其他／未確認']]);
    const submit=el('button','換算 mL/hr','primary');submit.type='submit';form.append(submit);
    const result=el('div',undefined,'adult-result');result.setAttribute('aria-live','polite');result.setAttribute('role','status');
    const tableBox=el('div',undefined,'adult-rate-table');
    function showRecipe(){const r=C.recipe(d.id,recipeSelect.value);recipeBox.replaceChildren(el('h4','泡法'),
      el('p',`以 ${d.stock} ${d.stockUnit} 原液：抽 ${fmt(r.stockVolume)} mL（${r.amount} ${d.amountUnit}），加 ${diluent.value} ${fmt(r.diluentVolume)} mL 至總量 ${r.volume} mL。`),
      el('strong',`最終濃度 ${fmt(r.concentration)} ${r.concentrationUnit}`),
      el('p',d.prepNote,'adult-small'));}
    function clearResult(){result.replaceChildren();result.classList.remove('error');tableBox.replaceChildren();}
    function showResult(r){
      result.append(el('strong',`${fmt(r.rate)} mL/hr`),el('p',`${dose.value} ${d.unit}${d.weightBased?' × '+weight.value+' kg':''}；${r.amount} ${d.amountUnit}／${r.volume} mL = ${fmt(r.concentration)} ${r.concentrationUnit}`));
      if(d.id==='vasopressin')result.append(el('p',`所選劑量 = ${fmt(Number(dose.value)*60)} units/hr`));
      const details=el('details'),summary=el('summary','速率對照與公式');details.append(summary);
      const table=el('table'),caption=el('caption',`同一泡法${d.weightBased?'，體重 '+weight.value+' kg':''}`),head=el('tr');
      head.append(el('th',d.unit),el('th','mL/hr'));table.append(caption,head);
      for(const value of d.examples){const row=el('tr');row.append(el('td',fmt(value)),el('td',fmt(C.rate(d.id,recipeSelect.value,value,Number(weight?.value)))));table.append(row);}
      details.append(table,el('p',`mL/hr = 劑量${d.weightBased?' × 體重 kg':''} × 60 ÷ ${fmt(r.concentration)}（${r.concentrationUnit}）。顯示至多四位小數，未依幫浦刻度取整。`,'adult-small'));tableBox.append(details);
    }
    form.addEventListener('input',clearResult);form.addEventListener('change',()=>{clearResult();showRecipe();});
    form.addEventListener('submit',event=>{event.preventDefault();clearResult();try{
      const r=C.calculate({id:d.id,recipeId:recipeSelect.value,stock:Number(stock.value),dose:Number(dose.value),weight:Number(weight?.value),renal:renal?.value,line:line.value,diluent:diluent.value});showResult(r);
    }catch(error){result.classList.add('error');result.append(el('p',error.message));}});
    const sources=el('details',undefined,'adult-sources');sources.append(el('summary','來源與劑量／泡法備註'));
    sources.append(el('p',d.note));d.sources.forEach(key=>{const s=D.sources[key],a=el('a',s.title);a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';sources.append(a,el('br'));});
    sources.append(el('p',`查閱：${D.date}。國外配方；臺灣現用製劑及院內配方尚待核對。`,'adult-small'));
    card.append(recipeBox,form,result,tableBox,sources);host.append(card);showRecipe();
  }
})();
