(function(root){
  const data=typeof module==='object'&&module.exports?require('./adult-data.js'):root.AdultData;
  function drug(id){const d=data.drugs.find(x=>x.id===id);if(!d)throw Error('找不到成人藥物。');return d;}
  function recipe(id,recipeId){
    const d=drug(id),r=d.recipes.find(x=>x.id===recipeId);
    if(!r||!Number.isFinite(r.volume)||r.volume<=0||r.volume>50)throw Error('只支援已核對且總量 ≤50 mL 的配方。');
    const stockVolume=r.amount/d.stock,diluentVolume=r.volume-stockVolume;
    if(!(stockVolume>0)||diluentVolume<0)throw Error('配方體積無效。');
    return {...r,stockVolume,diluentVolume,concentration:r.amount*(d.amountUnit==='mg'?1000:1)/r.volume,
      concentrationUnit:d.amountUnit==='mg'?'µg/mL':'units/mL'};
  }
  function rate(id,recipeId,dose,weight){
    const d=drug(id),r=recipe(id,recipeId);
    if(!Number.isFinite(dose)||dose<d.min||dose>d.max)throw Error(`請輸入 ${d.min}–${d.max} ${d.unit}；超出本頁參考範圍不換算。`);
    if(d.weightBased&&(!Number.isFinite(weight)||weight<1||weight>300))throw Error('請輸入成人體重 1–300 kg；此為本工具輸入範圍。');
    return dose*(d.weightBased?weight:1)*60/r.concentration;
  }
  function calculate(input){
    const d=drug(input.id),r=recipe(input.id,input.recipeId);
    if(!Number.isFinite(input.stock)||Math.abs(input.stock-d.stock)>1e-9)throw Error(`請核對實際原液；此配方僅支援 ${d.stock} ${d.stockUnit}。`);
    if(!r.diluents.includes(input.diluent))throw Error('此配方未支援所選稀釋液。');
    if(input.line!=='central')throw Error('本頁濃縮配方以中央靜脈給藥；其他管路不換算。');
    if(d.weightBased&&input.renal!=='normal')throw Error('Milrinone 腎功能異常或未確認時，請先核對調整劑量；本版停止換算。');
    return {...r,rate:rate(input.id,input.recipeId,input.dose,input.weight)};
  }
  const api={drug,recipe,rate,calculate};root.AdultCore=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
