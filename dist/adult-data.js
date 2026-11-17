(function(root){
  const sources = {
    milrinone: {title:'Wockhardt Milrinone SmPC §4.2、6.6（emc）',url:'https://www.medicines.org.uk/emc/product/2625/smpc'},
    milrinonePractice: {title:'Safer Care Victoria：Milrinone（配方／loading）',url:'https://www.safercare.vic.gov.au/best-practice-improvement/clinical-guidance/critical/milrinone'},
    vasopressinDose: {title:'NSW CEC：成人 Argipressin（2026-09）',url:'https://cec.health.nsw.gov.au/therapeutics-safety/continuous-infusions/adult/argipressin'},
    vasopressinPrep: {title:'Safer Care Victoria：Vasopressin（20／40 mL 配方）',url:'https://www.safercare.vic.gov.au/best-practice-improvement/clinical-guidance/critical/vasopressin-argipressin'},
    isoproterenolDose: {title:'NSW CEC：成人 Isoprenaline（2026-09）',url:'https://cec.health.nsw.gov.au/therapeutics-safety/continuous-infusions/adult/isoprenaline'},
    isoproterenolPrep: {title:'Frimley Health：Isoprenaline v2（2025-07）',url:'https://guidelines.fhft.nhs.uk/Cardiology-Arrhythmias-Isoprenaline_for_Bradycardia'}
  };
  const drugs = [
    {id:'milrinone',name:'Milrinone',alias:'',unit:'µg/kg/min',amountUnit:'mg',stockUnit:'mg/mL',stock:1,
      min:0.375,max:0.75,weightBased:true,examples:[0.375,0.5,0.75],
      dose:['維持：0.375–0.75 µg/kg/min（腎功能正常）','Loading：50 µg/kg，10 分鐘緩慢給入；是否給予由處方決定','每日總量（含 loading）≤1.13 mg/kg'],
      note:'腎功能異常需減量，本版不換算。Loading 可能因低血壓而省略，不是快速 IV push。',
      prepNote:'D5W 或 0.9% NaCl；現配現用。',
      recipes:[{id:'mil-50',amount:10,volume:50,diluents:['0.9% NaCl','D5W']}],
      sources:['milrinone','milrinonePractice']},
    {id:'vasopressin',name:'Pitressin',alias:'Vasopressin／Argipressin',unit:'units/min',amountUnit:'units',stockUnit:'units/mL',stock:20,
      min:0.01,max:0.06,weightBased:false,examples:[0.01,0.02,0.03,0.04,0.06],
      dose:['持續輸注：0.01–0.06 units/min','等於 0.6–3.6 units/hr；不按體重計算'],
      note:'此為本頁參考輸注範圍，非所有用法的通用上限；本版不提供 bolus 換算。',
      prepNote:'D5W 或 0.9% NaCl；室溫配製液最長 18 小時。',
      recipes:[{id:'vaso-20',amount:20,volume:20,diluents:['0.9% NaCl','D5W']},{id:'vaso-40',amount:40,volume:40,diluents:['0.9% NaCl','D5W']}],
      sources:['vasopressinDose','vasopressinPrep']},
    {id:'isoproterenol',name:'Isoproterenol',alias:'Isoprenaline hydrochloride',unit:'µg/min',amountUnit:'mg',stockUnit:'mg/mL',stock:0.2,
      min:0.5,max:10,weightBased:false,examples:[0.5,1,2,5,10],
      dose:['持續輸注：0.5–10 µg/min','固定劑量，不按體重計算'],
      note:'原液須為 hydrochloride 0.2 mg/mL（1 mg/5 mL）；不同鹽類／濃度不套用此泡法。',
      prepNote:'本頁 50 mL 濃縮泡法只用 D5W；24 小時更換，變色或有沉澱即停用。',
      recipes:[{id:'iso-50',amount:2,volume:50,diluents:['D5W']}],
      sources:['isoproterenolDose','isoproterenolPrep']}
  ];
  const api={date:'2026-11-17',sources,drugs};
  root.AdultData=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
