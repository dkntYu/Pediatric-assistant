(function(root){
const S={
 queen:{title:'Queen’s University 兒科麻醉表（2021；較舊院內參考）',url:'https://anesthesiology.queensu.ca/sites/anesthesiology/files/inline-files/Pediatric%20Drug%20Dose%20Chart%20(2021_04_30).pdf'},
 rsi:{title:'CHEO RSI 計算表',url:'https://outreach.cheo.on.ca/emergency-drug-calculator/3'},
 emerg:{title:'CHEO 急救計算表',url:'https://outreach.cheo.on.ca/emergency-drug-calculator/1'},
 rcuk:{title:'Resuscitation Council UK 2026 資源（2025 指引）',url:'https://www.resus.org.uk/sites/default/files/2026-02/RCUK%20Paediatric%20emergency%20algorithms%20and%20resources%20Feb%2026%20V6.pdf'},
 cps:{title:'Canadian Paediatric Society 新生兒插管前用藥',url:'https://cps.ca/en/documents/position/premedication-for-laryngoscopy'},
 cisa:{title:'CHEO Cisatracurium（2020）',url:'https://outreach.cheo.on.ca/manual/1516'},
 sug:{title:'澳洲 Sugammadex Accord 產品資料',url:'https://www.safetyandquality.gov.au/medicine-finder/sugammadex-accord'},
 prop:{title:'建仁醫院 Propacetamol（舊資料，僅保留已明示限制）',url:'https://www.jiannren.org.tw/jiannren/upload/health_area/Propacetamol9801.pdf'},
 ketNeo:{title:'CHEO 新生兒 Ketamine（2024）',url:'https://outreach.cheo.on.ca/manual/1364'},
 fentNeo:{title:'CHEO 新生兒 Fentanyl',url:'https://outreach.cheo.on.ca/manual/1341'},
 morphNeo:{title:'CHEO 新生兒 Morphine（2022）',url:'https://outreach.cheo.on.ca/manual/1377'},
 midNeo:{title:'LHSC NICU Midazolam',url:'https://www.lhsc.on.ca/nicu/midazolam'},
 rocNeo:{title:'LHSC NICU Rocuronium',url:'https://www.lhsc.on.ca/nicu/rocuronium'},
 dob:{title:'CHEO Dobutamine（2024）',url:'https://outreach.cheo.on.ca/manual/1553'},
 dobNeo:{title:'LHSC NICU Dobutamine',url:'https://www.lhsc.on.ca/nicu/dobutamine'},
 dopNeo:{title:'CHEO NICU Dopamine（2024）',url:'https://outreach.cheo.on.ca/manual/1332'},
 nor:{title:'CHEO Norepinephrine（2024；以 base 計）',url:'https://outreach.cheo.on.ca/manual/1658'},
 norNeo:{title:'CHEO 新生兒 Norepinephrine（2024）',url:'https://outreach.cheo.on.ca/manual/2004'},
 epiNeo:{title:'CHEO 新生兒 Epinephrine（2024）',url:'https://outreach.cheo.on.ca/manual/1336'},
 bicarb:{title:'CHEO 新生兒 Sodium bicarbonate（2023）',url:'https://outreach.cheo.on.ca/manual/1407'},
 propofol:{title:'IWK 兒科 Propofol：程序鎮靜',url:'https://www.dir.iwk.nshealth.ca/Home/DDGDetails/fe088276-1fb6-e911-80f4-005056b200d2?PatientPopulation=Ped'},
 airway:{title:'RCH 呼吸道處置',url:'https://www.rch.org.au/trauma-service/manual/airway-procedures/'},
 neonatalETT:{title:'Safer Care Victoria 新生兒插管（頁面提示部分內容過期）',url:'https://www.safercare.vic.gov.au/best-practice-improvement/clinical-guidance/neonatal/intubation'},
 lma:{title:'Teleflex LMA Unique Silicone Cuff 廠商尺寸',url:'https://us.myteleflex.com/en/USD/All-Categories/Anesthesia/Airway/Supraglottic-Airways/LMA%E2%84%A2-Unique%E2%84%A2-%28Silicone-Cuff%29-Airway-with-Cuff-Pilot%E2%84%A2-Technology/p/LMA_Unique'},
 npa:{title:'RCH 鼻咽呼吸道量測',url:'https://www.rch.org.au/rchcpg/hospital_clinical_guideline_index/Nasopharyngeal_Airway_Insertion_and_Management/'},
 fluids:{title:'RCH 兒科靜脈輸液（不適用新生兒）',url:'https://www.rch.org.au/clinicalguide/guideline_index/Intravenous_fluids/'},
 blood:{title:'RCH 血品處方（非出血嬰兒／兒童，不含新生兒）',url:'https://www.rch.org.au/clinicalguide/guideline_index/Blood_product_prescription/'},
 bloodNeo:{title:'RCH 新生兒輸血（含早產）',url:'https://www.rch.org.au/bloodtrans/special_transfusions/Neonatal_transfusions/'},
 fluidNeo:{title:'RCH 新生兒輸液（2026-03；>32週、>1500g，非NICU）',url:'https://www.rch.org.au/clinicalguide/guideline_index/Neonatal_intravenous_fluids/'},
 iso:{title:'CHEO 兒科 Isoproterenol（2026-05）',url:'https://outreach.cheo.on.ca/manual/1618'},
 isoNeo:{title:'CHEO 新生兒 Isoproterenol（2014；頁面2022）',url:'https://outreach.cheo.on.ca/manual/1363'},
 isoTW:{title:'耕莘：Proternol-L（兒童安全性／有效性尚未確立）',url:'https://www.cth.org.tw/?aid=606&iid=1359&page_name=detail&pid=0'},
 mil:{title:'CHEO 兒科 Milrinone（2024）',url:'https://outreach.cheo.on.ca/manual/1646'},
 milNeo:{title:'CHEO 新生兒 Milrinone（2024）',url:'https://outreach.cheo.on.ca/manual/1376'}
};
const PED=['infant','child'],NEO=['preterm','neonate'];
const M=(id,title,min,max,unit,source,extra={})=>({id,title,min,max,unit,source,kind:'bolus',groups:PED,...extra});
const I=(id,title,min,max,source,extra={})=>M(id,title,min,max,'μg/kg/min',source,{kind:'infusion',...extra});
const R=(stock,c,total,diluent,unit='mg')=>({stock,c,total,diluent,unit});
const D={
 'Propofol':{warning:'低血壓、呼吸抑制；需具備氣道處置能力。只提供選定情境，並非通用誘導／長期 ICU 鎮靜處方。',modes:[M('prop6','ED 程序鎮靜：6個月–2歲（含）',1,2,'mg/kg','propofol',{minMonths:6,maxMonths:24}),M('prop2','ED 程序鎮靜：>2歲',0.5,1,'mg/kg','propofol',{aboveMonths:24})]},
 'Ketamine':{warning:'需監測呼吸、血壓與心率；可能喉痙攣、呼吸暫停。新生兒不可快速推注。',modes:[M('ketIV','麻醉誘導 IV',1,2,'mg/kg','queen'),M('ketSed','程序鎮靜 IV',0.5,1,'mg/kg','queen'),M('ketN','NICU 鎮靜／鎮痛 IV',0.5,2,'mg/kg','ketNeo',{groups:NEO,admin:'3–5 分鐘；急迫時仍受來源最大速率限制。',recipe:R(10,1,20,'0.9% NaCl')})]},
 'Midazolam':{warning:'呼吸抑制、低血壓；新生兒尤其早產兒需個別評估。只提供間歇給藥；不套用癲癇重積狀態連續輸注。',modes:[M('midIV','程序鎮靜 IV',0.05,0.1,'mg/kg','queen',{cap:2,admin:'緩慢給藥、滴定並監測呼吸。'}),M('midPO','術前鎮靜 PO',0.5,0.5,'mg/kg','queen',{cap:20}),M('midN','NICU 程序鎮靜 IV',0.05,0.1,'mg/kg','midNeo',{groups:NEO})]},
 'Succinylcholine':{warning:'高血鉀、惡性高熱、神經肌肉疾病等情境禁用／需避免；會造成癱瘓，必須能通氣並有鎮靜與監測。',modes:[M('sux','緊急插管 IV（非新生兒）',1,2,'mg/kg','rsi',{admin:'IV 10–30 秒；嬰兒可能需較高端劑量，依臨床決定。'}),M('suxN','新生兒插管前 IV',2,2,'mg/kg','cps',{groups:NEO,admin:'與適當鎮靜及監測合用；排除來源列出的禁忌。'})]},
 'Cisatracurium (Nimbex)':{warning:'肌鬆不等於鎮靜或止痛；須通氣及 TOF 監測。小於2歲本來源不足，不計算。',modes:[M('cis2','插管 IV：2–12歲（含）',0.1,0.1,'mg/kg','cisa',{minMonths:24,maxMonths:144,admin:'5–10 秒',recipe:R(2,0.1,5,'0.9% NaCl')}),M('cis12','插管 IV：>12歲',0.15,0.2,'mg/kg','cisa',{aboveMonths:144}),M('cisM','維持 IV：2歲以上',0.03,0.03,'mg/kg','cisa',{minMonths:24}),I('cisI','持續肌鬆：>2歲',1,4,'cisa',{aboveMonths:24,recipe:R(2,0.4,50,'0.9% NaCl')})]},
 'Rocuronium':{warning:'需通氣、鎮靜、止痛及神經肌肉監測；一般插管、RSI 與 NICU 肌鬆劑量不可互換。',modes:[M('roc','一般插管 IV',0.6,1,'mg/kg','queen'),M('rocRSI','RSI IV',1,1,'mg/kg','rsi'),M('rocN','NICU 輔助通氣 IV',0.3,0.6,'mg/kg','rocNeo',{groups:NEO,admin:'5–15 秒；依個別反應調整。'}),I('rocNI','NICU 持續肌鬆',7,10,'rocNeo',{groups:NEO})]},
 'Fentanyl':{warning:'呼吸抑制、胸壁僵硬；緩慢給藥並備妥通氣。不可把 μg 當 mg。',modes:[M('fent','鎮痛 IV',0.5,2,'μg/kg','queen'),M('fentRSI','RSI IV',2,2,'μg/kg','rsi',{admin:'3–5 分鐘'}),M('fentN','NICU 鎮痛 IV',0.5,4,'μg/kg','fentNeo',{groups:NEO,admin:'依 NICU 規範緩慢給藥。'}),I('fentI','鎮痛 infusion',0.5,2,'queen',{unit:'μg/kg/hr'}),I('fentNI','NICU 鎮痛 infusion',0.5,4,'fentNeo',{groups:NEO,unit:'μg/kg/hr'})]},
 'Morphine':{warning:'呼吸抑制、低血壓與腎功能相關累積；需呼吸監測。新生兒來源與較大兒童分列。',modes:[M('mor','鎮痛 IV',0.05,0.1,'mg/kg','queen',{admin:'依院內規範緩慢給藥。'}),I('morI','鎮痛 infusion',10,40,'queen',{unit:'μg/kg/hr'}),M('morN','NICU 鎮痛 IV',0.05,0.1,'mg/kg','morphNeo',{groups:NEO,admin:'5 分鐘',recipe:R(2,0.1,10,'0.9% NaCl')}),I('morNI','NICU 鎮痛 infusion',10,20,'morphNeo',{groups:NEO,unit:'μg/kg/hr',recipe:R(2,0.02,20,'D5W')})]},
 'Propacetamol (Acetamol)':{warning:'此為 propacetamol，不是 paracetamol。1 g propacetamol 約相當於0.5 g paracetamol。現有可讀臺灣資料較舊且只明列4歲以上每日量，未確認現行單次劑量／間隔及重配規格，暫不啟用計算。不可直接套用 acetaminophen 單次劑量。',blocked:true,sources:['prop'],modes:[]},
 'Sugammadex':{warning:'本版採所列澳洲製劑2歲以上適用範圍，並非宣稱其他製劑／地區皆相同。需 TOF/PTC 與腎功能；嚴重腎功能異常不建議。未滿2歲及即刻逆轉本版不計算。',modes:[M('sug2','TOF 第2個反應重現；rocuronium／vecuronium 逆轉 IV',2,2,'mg/kg','sug',{minMonths:24,renal:true,admin:'單次 IV；持續監測神經肌肉恢復。',recipe:R(100,10,20,'0.9% NaCl')}),M('sug4','PTC 1–2；rocuronium／vecuronium 深度阻斷逆轉 IV',4,4,'mg/kg','sug',{minMonths:24,renal:true})]},
 'Atropine':{warning:'確認迷走神經性／原發房室阻斷等適應情境；本版採 RCUK 急救表上限，與其他指引可能不同。',modes:[M('atr','兒科急救 IV',0.02,0.02,'mg/kg','rcuk',{cap:0.6}),M('atrN','新生兒插管前 IV',0.01,0.02,'mg/kg','cps',{groups:NEO})]},
 'Epinephrine (Bosmin)':{warning:'心跳停止、過敏性休克 IM、持續輸注是不同濃度與途徑。不得混用！新生兒出生復甦與兒科 PALS 分開；不提供氣管內途徑。需心電圖、血壓及注射部位監測。',modes:[M('epiArrest','兒科心跳停止 IV/IO',0.01,0.01,'mg/kg','rcuk',{cap:1,concentration:0.1,admin:'使用0.1 mg/mL（100 μg/mL）；每3–5分鐘依復甦流程，非持續輸注。',recipe:R(1,0.1,10,'0.9% NaCl')}),M('epiN','新生兒復甦 IV/UVC',0.01,0.03,'mg/kg','epiNeo',{groups:NEO,concentration:0.1,admin:'來源起始0.02 mg/kg；每3–5分鐘視需要，不是IM過敏劑量。'}),M('epiIM','過敏性休克 IM（非新生兒）',0.01,0.01,'mg/kg','rcuk',{cap:0.5,concentration:1,admin:'使用1 mg/mL；只限IM。依過敏性休克流程評估重複。'}),I('epiI','低血壓／休克 infusion',0.05,0.3,'epiNeo',{groups:NEO,recipe:R(0.1,0.006,20,'D5W')})]},
 'Dobutamine':{warning:'先處理低血容量，持續ECG/BP監測並注意外滲。大血管／中央管路優先；高劑量與周邊管路需另行核對。',modes:[I('dob','心肌收縮力支持 infusion',2.5,15,'dob',{recipe:R(12.5,0.8,50,'0.9% NaCl')}),I('dobN','NICU 心輸出量支持 infusion',5,20,'dobNeo',{groups:NEO,recipe:R(12.5,1,50,'D5W'),admin:'中央管路優先；1 kg以上院內可能採不同濃度，需核對。'})]},
 'Dopamine':{warning:'不是腎保護用途的建議；監測血壓、ECG與灌流，注意外滲。新生兒範圍採 CHEO，兒科採 Queen’s 舊表，需核對院內規範。',modes:[I('dop','兒科循環支持 infusion',1,20,'queen',{premix:[0.8,1.6],admin:'使用經確認之藥局預混液；不從未知原液推算配方。'}),I('dopN','NICU 循環支持 infusion',2.5,10,'dopNeo',{groups:NEO,premix:[0.8,1.6],admin:'最大20 μg/kg/min未納入本版一般範圍；需專科評估。'})]},
 'Norepinephrine':{warning:'以 norepinephrine base 計，非bitartrate鹽重量。注意管路、外滲、血壓及末梢灌流；不提供bolus。',modes:[I('nor','兒科急性低血壓 infusion',0.01,1,'nor',{recipe:R(1,0.012,50,'0.9% NaCl')}),I('norN','NICU 休克 infusion',0.01,0.4,'norNeo',{groups:NEO,recipe:R(1,0.012,20,'D5W')})]},
 'Sodium bicarbonate':{warning:'不常規用於一般心跳停止。需確認高血鉀／代謝性酸中毒情境及血氣；通氣不足時可能有害。mmol對單價 bicarbonate 等同mEq；不與鈣劑或catecholamine混合。',modes:[M('bic','代謝性酸中毒／高血鉀 IV',1,1,'mmol/kg','emerg',{concentration:0.5,admin:'4.2%（0.5 mmol/mL），至少2分鐘；需依血氣與病況評估，不自動重複。',recipe:R(1,0.5,20,'注射用水','mmol')}),M('bicN','NICU 代謝性酸中毒間歇輸注',1,2,'mmol/kg','bicarb',{groups:NEO,concentration:0.5,admin:'1–4小時，且不得超過1 mmol/kg/hr；請填輸注分鐘數。',minMinutes:60,maxRateKgHour:1,recipe:R(1,0.5,20,'D5W','mmol')})]},
 'Calcium gluconate':{warning:'只限葡萄糖酸鈣，不可換成氯化鈣；10% = 100 mg/mL「鹽重量」，不是元素鈣。ECG監測、注意外滲；不與bicarbonate混合。',modes:[M('ca','高血鉀導致不穩定心律 IV（10%）',0.5,0.5,'mL/kg','rcuk',{cap:30,admin:'5–10分鐘，必要時依ECG於5–10分鐘後評估；本版不是低血鈣療程。'})]},
 'Amiodarone':{warning:'無脈VF/pVT與有灌流心律給藥速度不同；需ECG、血壓監測。',modes:[M('amio','無脈VF/pVT：第3／5次電擊後 IV/IO',5,5,'mg/kg','rcuk',{cap:300,admin:'心跳停止時bolus；依復甦流程給予，不自動安排重複。'}),M('amioPerf','有灌流心律 IV',5,5,'mg/kg','rcuk',{cap:300,admin:'60分鐘，需專科決策。',minMinutes:60})]},
 'Adenosine':{warning:'僅適用適當的規則窄QRS SVT，不用於不規則寬QRS。美式CHEO／Queen’s與RCUK方案不同，本版固定列0.1→0.2 mg/kg方案。',modes:[M('ade1','SVT 第1劑 IV',0.1,0.1,'mg/kg','queen',{cap:6,admin:'極快速推注後立即flush；flush量依管路與族群核對。'}),M('ade2','SVT 第2劑 IV',0.2,0.2,'mg/kg','queen',{cap:12,admin:'只有第1劑無效且臨床判斷適用時；快速推注後flush。'})]},
 'Dextrose':{warning:'只提供已確認低血糖時的D10W救援，不從D50直接給予嬰兒。需複測血糖；不是維持輸液或持續GIR處方。',modes:[M('glu','低血糖 IV/IO：D10W',2,2,'mL/kg','rcuk',{cap:50,admin:'D10W 100 mg/mL；相當0.2 g/kg，5–10分鐘複測血糖。'})]},
 'Magnesium sulfate':{warning:'劑量是硫酸鎂鹽重量，不是元素鎂或mEq；腎功能異常需調整，監測血壓與ECG。',modes:[M('mag','Torsades de pointes IV',25,25,'mg/kg','emerg',{cap:2000,renal:true,admin:'15–30分鐘；依病況與復甦流程評估。',minMinutes:15,recipe:R(500,40,25,'0.9% NaCl')})]},
 'Naloxone':{warning:'呼吸支持優先。慢性opioid暴露可能誘發急性戒斷；需依反應滴定，作用時間可能短於opioid。',modes:[M('nal','opioid呼吸抑制：滴定 IV',2,2,'μg/kg','emerg',{admin:'慢速IV，可依反應約每2分鐘評估；不是新生兒出生復甦的常規藥物。',recipe:R(0.4,0.04,10,'0.9% NaCl')})]}
};
// Source-specific supplemental modes; do not silently mix age-specific dosages.
D.Isoproterenol={warning:'臺灣Proternol-L資料註明兒童安全性與有效性尚未確立。以下為國外院內參考，不等同臺灣核准用法。持續ECG、心率、血壓監測；留意心律不整。新生兒來源較舊，須核對現行院內規範。',sources:['isoTW'],modes:[I('iso','兒科 infusion',0.05,2,'iso',{recipe:R(0.2,0.01,50,'0.9% NaCl')}),I('isoN','NICU infusion',0.05,2,'isoNeo',{groups:NEO,recipe:R(0.2,0.02,20,'D5W')})]};
D.Milrinone={warning:'監測血壓、心率、ECG、腎功能、電解質與血小板。腎功能異常或不明停止計算。早產兒規則尚未整合，不套用足月來源；新生兒來源不建議loading。每日累積量需另行追蹤，兒科來源上限1.13 mg/kg/day。',modes:[I('mil','兒科心衰竭 infusion',0.25,0.75,'mil',{renal:true,recipe:R(1,0.1,20,'D5W')}),M('milLoad','兒科 loading IV（不是快速push）',50,50,'μg/kg','mil',{renal:true,minMinutes:15,admin:'15分鐘輸注；依血壓與病況評估是否使用。',recipe:R(1,0.1,20,'D5W')}),I('milN','足月新生兒 infusion；不loading',0.25,0.75,'milNeo',{groups:['neonate'],renal:true,recipe:R(1,0.1,20,'D5W')})]};
D['Epinephrine (Bosmin)'].modes.find(m=>m.id==='epiIM').source='emerg';
D['Epinephrine (Bosmin)'].modes.find(m=>m.id==='epiIM').floor=0.1;
D['Epinephrine (Bosmin)'].modes.push(I('epiPedI','兒科循環支持 infusion（非新生兒）',0.01,1,'queen'));
D['Midazolam'].modes.find(m=>m.id==='midN').admin='5分鐘；早產兒慎用。僅鎮靜，不提供止痛。';
D['Dobutamine'].modes[0].centralAbove=5;
root.ClinicalData={sources:S,drugs:D,date:'2026-10-27'};
if(typeof module!=='undefined')module.exports=root.ClinicalData;
})(typeof window!=='undefined'?window:globalThis);
