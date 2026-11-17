(function(root){
  const sources={
    elso2014:{title:'ELSO Anticoagulation 2014，p.4（起始劑量參考）',url:'https://www.elso.org/Portals/0/Files/elsoanticoagulationguideline8-2014-table-contents.pdf'},
    elso2021:{title:'ELSO 2021／2022（個別化抗凝；非固定劑量方案）',url:'https://www.elso.org/Portals/0/files/pdf/2021_ELSO_Adult_and_Pediatric_Anticoagulation.1.pdf'},
    heparin:{title:'Heparin Sodium FDA 仿單 §2.5（2026）',url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/019953s050lbl.pdf'},
    heparinPrep:{title:'WACHS 成人重症給藥 v2.02，p.26（2026-10）',url:'https://www.wacountry.health.wa.gov.au/~/media/WACHS/Documents/About-us/Policies/Critical-Care-Medication-Administration-for-Adults-Guideline.pdf?thn=0'},
    stock:{title:'NSW Medicines Formulary：Heparin 25,000 units/5 mL',url:'https://cec.health.nsw.gov.au/__data/assets/pdf_file/0007/934090/Public-Facing-NSW-Medicines-Formulary-List.pdf'},
    cpb:{title:'EACTS/EACTAIC/EBCP 2024，§9.3（2025 發表）',url:'https://cris.unibo.it/retrieve/cd0ea0ea-cb93-4b0f-9de5-ffd19974e612/ezae354.pdf'},
    pbm:{title:'EACTS/EACTAIC 2024 血液管理：Protamine／初始 Heparin 比值',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC12257489/'},
    protamine:{title:'Fresenius Kabi Protamine 10 mg/mL 仿單（DailyMed）',url:'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=c76876da-b9a8-45d0-9278-7df3288d3a06'},
    prosulf:{title:'Prosulf SmPC §4.2：單次給藥與凝血複測',url:'https://www.medicines.org.uk/emc/product/8/smpc'},
    alfred:{title:'Alfred ECMO：Protamine 與迴路血栓限制',url:'https://ecmo.icu/daily-care-anticoagulation-bleeding/'}
  };
  const modes={
    'ecmo-bolus':{label:'ECMO · 起始 IV bolus',min:50,max:100,unit:'units/kg',dose:'50–100 units/kg IV bolus（ELSO 2014 起始參考）',note:'出血、近期手術或剛由CPB轉入ECMO時需個別調整；不可直接套用完整起始量。',sources:['elso2014','elso2021','stock']},
    'ecmo-infusion':{label:'ECMO · 起始持續輸注',min:7.5,max:20,unit:'units/kg/hr',dose:'起始 7.5–20 units/kg/hr（ELSO 2014；成人偏低端）',note:'舊版以ACT降至≤300秒且無明顯出血時考慮啟動；後續依院內ACT／aPTT／anti-Xa方案調整，不是固定維持範圍。',sources:['elso2014','elso2021','heparinPrep','stock']},
    'cpb-bolus':{label:'體外循環機 CPB · 起始 IV bolus',min:300,max:400,unit:'units/kg',dose:'常用起始量 300–400 units/kg IV bolus',note:'FDA仿單例：預計<60分鐘300 units/kg，>60分鐘400 units/kg。上機前須確認足夠抗凝，追加量依ACT／heparin濃度，不只依體重。',sources:['heparin','cpb','stock']}
  };
  const data={date:'2026-11-17',sources,modes,heparinStock:5000,infusion:{amount:25000,volume:50,concentration:500,diluents:['NS','D5W']},protamineStock:10};
  function number(n,min,max,message){if(!Number.isFinite(n)||n<min||n>max)throw Error(message);}
  function heparin(input){
    const m=modes[input.mode];if(!m)throw Error('請選擇ECMO或CPB的給藥方式。');
    number(input.weight,1,300,'請輸入成人體重1–300 kg（工具輸入範圍）。');
    number(input.dose,m.min,m.max,`請輸入${m.min}–${m.max} ${m.unit}；超出本頁起始參考範圍不換算。`);
    if(input.stock!==data.heparinStock)throw Error('請核對原液：本版泡法只支援Heparin 5,000 units/mL。');
    const units=input.weight*input.dose;
    if(input.mode==='ecmo-infusion'){
      const p=data.infusion;if(!p.diluents.includes(input.diluent))throw Error('請選擇NS或D5W。');
      return {kind:'infusion',unitsPerHour:units,rate:units/p.concentration,stockVolume:p.amount/input.stock,diluentVolume:p.volume-p.amount/input.stock,...p};
    }
    return {kind:'bolus',units,stockVolume:units/input.stock};
  }
  function protamine(input){
    if(input.circuit!=='off')throw Error('尚在ECMO／CPB或狀態未確認時，本版不提供Protamine換算；須由體外循環團隊個別決定。');
    if(!['cpb-initial','residual'].includes(input.basis))throw Error('請選擇Heparin劑量依據。');
    number(input.heparinUnits,1,1000000,'請輸入需計算的UFH units（1–1,000,000為工具輸入範圍）。');
    let ratio=1;
    if(input.basis==='cpb-initial'){
      if(!Number.isFinite(input.ratio)||input.ratio<=0||input.ratio>=1)throw Error('CPB本版採Protamine／初始Heparin比值>0且<1.0 mg/100 units，請依處方輸入。');
      ratio=input.ratio;
    }
    const referenceMg=input.heparinUnits*ratio/100;
    const result={referenceMg,ratio};
    // Total neutralisation estimate is not silently capped at a single-dose limit.
    if(input.singleDose===null||input.singleDose===undefined)return result;
    number(input.singleDose,0.001,50,'本次處方量須>0且≤50 mg；本版不自動拆次或安排總量輸注。');
    if(input.singleDose>referenceMg+1e-9)throw Error('本次處方量超過本次參考回補總量，請重新核對。');
    if(input.stock!==data.protamineStock)throw Error('本版泡法只支援Protamine 10 mg/mL。');
    if(!['NS','D5W'].includes(input.diluent))throw Error('請選擇NS或D5W。');
    if(![20,50].includes(input.finalVolume))throw Error('只支援總量20或50 mL的稀釋換算。');
    const stockVolume=input.singleDose/input.stock;
    return {...result,preparation:{doseMg:input.singleDose,stockVolume,diluentVolume:input.finalVolume-stockVolume,finalVolume:input.finalVolume,concentration:input.singleDose/input.finalVolume,minMinutes:10}};
  }
  const api={data,heparin,protamine};root.AdultAnticoag=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
