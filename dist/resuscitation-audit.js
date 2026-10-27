/* Online source comparison, 2026-10-27. Review annotations only; no dose overrides. */
(function(root){
const sources={
 ahaArrest:['AHA/AAP 2025 心跳停止流程','https://cpr.heart.org/en/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-CA-250123.pdf'],
 ahaBrady:['AHA/AAP 2025 心跳過緩流程','https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Accessible/Algorithm-PALS-Bradycardia-LngDscrp-250729-Ed.pdf'],
 ahaTachy:['AHA/AAP 2025 心搏過速流程','https://cpr.heart.org/en/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-Tachyarrhythmia-250117.pdf'],
 ahaPals:['AHA/AAP 2025 PALS §7.2、16、17.3','https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support'],
 ahaNeo:['AHA/AAP 2025 新生兒復甦 §15','https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation'],
 rcuk:['RCUK 2026-02 V6（2025指引），第3、6頁','https://www.resus.org.uk/sites/default/files/2026-02/RCUK%20Paediatric%20emergency%20algorithms%20and%20resources%20Feb%2026%20V6.pdf'],
 erc:['ERC 2025 Paediatric Life Support，第11頁','https://www.erc.edu/media/03xnpjmj/gl2025-09-pls-e.pdf'],
 emerg:['CHEO 急救表，2024-03','https://outreach.cheo.on.ca/emergency-drug-calculator/1'],
 cps:['CPS 新生兒插管前用藥，2026-04-20','https://cps.ca/en/documents/position/premedication-for-laryngoscopy'],
 epiPed:['CHEO Epinephrine，2024-11','https://outreach.cheo.on.ca/manual/1563'],
 epiNeo:['CHEO 新生兒 Epinephrine，2024-06','https://outreach.cheo.on.ca/manual/1336'],
 dob:['CHEO Dobutamine，2024-11','https://outreach.cheo.on.ca/manual/1553'],
 dobNeo:['LHSC NICU Dobutamine，頁面未標修訂日期','https://www.lhsc.on.ca/nicu/dobutamine'],
 dopNeo:['CHEO 新生兒 Dopamine，2024-06','https://outreach.cheo.on.ca/manual/1332'],
 nor:['CHEO Norepinephrine，2024-11','https://outreach.cheo.on.ca/manual/1658'],
 norNeo:['CHEO 新生兒 Norepinephrine，2024-06','https://outreach.cheo.on.ca/manual/2004'],
 bicarb:['CHEO 新生兒 Sodium bicarbonate，2023-12','https://outreach.cheo.on.ca/manual/1407'],
 queen:['Queen’s 兒科麻醉表，2021-04-30（舊表）','https://anesthesiology.queensu.ca/sites/anesthesiology/files/inline-files/Pediatric%20Drug%20Dose%20Chart%20(2021_04_30).pdf'],
 iso:['CHEO Isoproterenol，2026-05','https://outreach.cheo.on.ca/manual/1618'],
 isoNeo:['CHEO 新生兒 Isoproterenol，內容2014-01／頁面2022','https://outreach.cheo.on.ca/manual/1363'],
 mil:['CHEO Milrinone，2024-01','https://outreach.cheo.on.ca/manual/1646'],
 milNeo:['CHEO 新生兒 Milrinone，2024-06','https://outreach.cheo.on.ca/manual/1376']
};
// id, disposition, reviewer note, evidence keys. A match is source-specific, never clinical sign-off.
const rows=[
 ['atr','review','上限有指引差異：現值0.6 mg符合RCUK；AHA心跳過緩流程為最低0.1 mg、單次最高0.5 mg。不可與插管前「無最低量」混為一談。',['rcuk','ahaBrady','ahaPals']],
 ['atrN','matched','0.01–0.02 mg/kg符合CPS新生兒插管前用藥；不是出生復甦通用用藥。',['cps']],
 ['epiArrest','matched','0.01 mg/kg、0.1 mg/mL、最高1 mg與AHA相符；用途限所列心跳停止情境。',['ahaArrest','epiPed']],
 ['epiN','matched','0.01–0.03 mg/kg符合AHA新生兒復甦；CHEO列起始0.02 mg/kg。出生復甦流程不能只由日齡判定。',['ahaNeo','epiNeo']],
 ['epiIM','excluded','僅保留原資料，本版IV介面不顯示。IM過敏劑量不能改標為IV；國際來源仍將IM列為過敏反應主要給藥途徑。',['epiPed','emerg']],
 ['epiI','context','0.05–0.3 μg/kg/min符合所列來源範圍；0.05–0.1為強心用途，較高端為升壓用途，不是全範圍皆為起始值。',['epiNeo']],
 ['epiPedI','matched','0.01–1 μg/kg/min亦可在2024 CHEO兒科來源找到，無須只依賴2021舊表；需依反應滴定。',['epiPed','queen']],
 ['dob','context','2.5–15 μg/kg/min與800 μg/mL配方相符；CHEO周邊輸注上限5 μg/kg/min。主畫面尚未輸入管路，不能把全範圍視為任何管路皆適用。',['dob']],
 ['dobN','review','劑量5–20 μg/kg/min相符，但LHSC配方依體重分流：≤1 kg用1 mg/mL，>1 kg用2 mg/mL；現版所有體重都以1 mg/mL換算速率。須人工選定院內標準濃度。',['dobNeo']],
 ['dop','review','1–20 μg/kg/min可追溯2021 Queen’s；一般範圍與院內首選需再決定。AHA兒科液體無反應敗血性休克優先列epinephrine／norepinephrine，不能將dopamine當所有休克的預設首選。',['queen','ahaPals']],
 ['dopN','matched','一般2.5–10 μg/kg/min、預混800／1600 μg/mL相符；來源最大20不是一般起始範圍。',['dopNeo']],
 ['bic','context','1 mmol/kg、4.2%及1:1注射用水配方相符。AHA不建議一般心跳停止常規使用；需核對高血鉀等特定情境，不能僅因酸中毒就當常規復甦藥。',['emerg','ahaPals']],
 ['bicN','context','1–2 mmol/kg為來源在酸鹼資料不明時所列範圍；間歇輸注1–4小時且≤1 mmol/kg/hr。2 mmol/kg不能用1小時；4.2%仍高張，周邊管路有進一步稀釋方案。',['bicarb']],
 ['ca','review','現值10% 0.5 mL/kg（50 mg/kg鹽重量）符合RCUK高血鉀不穩定心律；CHEO列60 mg/kg且稀釋至50 mg/mL。須確認採用方案，不能混用濃度或視為元素鈣。',['rcuk','emerg']],
 ['amio','review','高優先：現模式第3／5次電擊共用最高300 mg；AHA後續劑量最高150 mg，RCUK第6頁也將第5次電擊後上限列150 mg，但同文件第3頁簡表寫300 mg。需分開首劑／後續劑量，原值暫保留。',['ahaArrest','rcuk']],
 ['amioPerf','context','5 mg/kg、60分鐘符合RCUK簡表；有脈且血流動力不穩定時仍須依心律處置流程，不能把慢速輸注作為所有有脈心律的統一方案。',['rcuk','ahaPals']],
 ['ade1','review','0.1 mg/kg、最高6 mg符合AHA首劑；RCUK採不同遞增方案。保留現值，但需人工確定整套SVT方案，不能交叉拼接。',['ahaTachy','rcuk']],
 ['ade2','review','0.2 mg/kg、最高12 mg符合AHA重複劑量；RCUK另列0.3 mg/kg方案。不是兩個可任意交換的首劑。',['ahaTachy','rcuk']],
 ['nor','context','0.01–1 μg/kg/min是CHEO通常維持範圍；起始0.01–0.1，不能把1當起始建議。12 μg/mL配方相符，以base計。',['nor']],
 ['norN','context','0.01–0.4 μg/kg/min及12 μg/mL配方相符；來源起始0.05。需分開起始值、滴定範圍與最高量。',['norNeo']],
 ['glu','review','D10W 2 mL/kg（0.2 g/kg）、最高50 mL符合RCUK表；CHEO急救表用5 mL/kg（0.5 g/kg）、通常最高250 mL。屬方案差異，不自動選較大值；新生兒低血糖未納入本模式。',['rcuk','emerg']],
 ['mag','review','現25 mg/kg、最高2 g、15–30分鐘可追溯CHEO急救表；ERC 2025 torsades列50 mg/kg、最高2 g。需人工決定方案，並區別有脈／無脈情境，不能把慢速時間套用所有復甦。',['emerg','erc']],
 ['iso','context','0.05–2 μg/kg/min及10 μg/mL配方符合CHEO；它是特定情境的持續輸注，不是PALS常規心跳停止藥。海外院內來源不等同臺灣實際製劑核准用法。',['iso','ahaArrest']],
 ['isoN','review','0.05起始、最高2 μg/kg/min及20 μg/mL配方可追溯，但來源內容仍為2014年。需更新新生兒依據，不視為2026新指引。',['isoNeo']],
 ['mil','review','0.25–0.75 μg/kg/min符合CHEO兒科；同來源青少年列0.375–0.75，現版未分青少年。腎功能異常需調整、每日總量含loading須追蹤，主畫面沒有腎功能與累積量資料。',['mil']],
 ['milLoad','context','50 μg/kg、15分鐘及100 μg/mL相符；IV loading不是快速push。是否loading需依血壓／情境決定，不能因為與維持量並列就認定必須合用。',['mil']],
 ['milN','context','0.25–0.75 μg/kg/min、100 μg/mL與不建議loading符合新生兒來源。現版只列足月，沒有因此推定早產兒禁用；腎調整仍須另判斷。',['milNeo']],
 ['nal','context','2 μg/kg、40 μg/mL符合CHEO呼吸抑制滴定方案；不是呼吸停止／嚴重中毒所列的完整救援劑量，亦非出生復甦常規。',['emerg']]
];
const audit={date:'2026-10-27',baseline:'12359043d62f2b4f49a9aba0ab8137cee9c40fdd',scope:'急救藥物14種／28模式（27個IV顯示模式，1個IM資料模式不顯示）',sources,modes:Object.fromEntries(rows.map(([id,status,note,refs])=>[id,{status,note,refs}]))};
root.ResuscitationAudit=audit;if(typeof module!=='undefined')module.exports=audit;
})(typeof window!=='undefined'?window:globalThis);
