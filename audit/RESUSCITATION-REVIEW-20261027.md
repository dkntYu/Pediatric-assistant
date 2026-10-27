# 急救藥物線上核對報告

比對日期：2026-10-27（Asia/Taipei）。基準：v0.6，commit 12359043d62f2b4f49a9aba0ab8137cee9c40fdd。

範圍：急救藥物14種／28模式（27個IV顯示模式，1個IM資料模式不顯示）。沿用先前分批約定，麻醉藥物、呼吸道、輸液與血品尚未在本輪重新線上核對。

本版只新增人工檢視標記與來源，clinical-data.js及clinical-core.js保持原樣。比對方式是逐項閱讀原始指引／院內專業來源，再以程式檢查資料完整性與算術；不是自動取得臨床認證。

## 備份與還原

完整來源快照、逐檔SHA-256及Git歷史：

- C:\Users\dknts\Dropbox\Gdrive\Learning\MyVault\Pediatric-assistant-backups\20261027-v06-before-online-audit
- manifest.json：32個檔案雜湊，包含當時尚未提交的PROGRESS.md。
- repository.bundle：完整Git歷史，已通過git bundle verify。
- restore-to-new-folder.ps1：驗證雜湊後還原至新的資料夾，不覆蓋現行版本。執行後可開啟新資料夾dist/index.html。

還原線上網站另須重新發布，不能以舊service worker識別直接宣稱所有手機已回復。

## 優先人工決策

1. Amiodarone：現模式合併首劑／後續劑量，但上限不同；RCUK同文件簡表與流程亦有差異。
2. Atropine、Calcium gluconate、Adenosine、Dextrose、Magnesium：須決定院內採用哪一套來源方案，不混用。
3. 新生兒Dobutamine：體重分流的濃度不應在速率換算中省略。
4. Dopamine／Isoproterenol新生兒舊來源、Milrinone年齡分層與腎功能／每日累積量須人工補核。

## 逐模式比對

| 藥物／模式 | 原始範圍 | 結果 | 發現及來源 |
|---|---|---|---|
| Atropine / atr | 0.02 mg/kg；上限 0.6 mg | 待人工檢視 | 上限有指引差異：現值0.6 mg符合RCUK；AHA心跳過緩流程為最低0.1 mg、單次最高0.5 mg。不可與插管前「無最低量」混為一談。 [RCUK 2026-02 V6（2025指引），第3、6頁](https://www.resus.org.uk/sites/default/files/2026-02/RCUK%20Paediatric%20emergency%20algorithms%20and%20resources%20Feb%2026%20V6.pdf)、[AHA/AAP 2025 心跳過緩流程](https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Accessible/Algorithm-PALS-Bradycardia-LngDscrp-250729-Ed.pdf)、[AHA/AAP 2025 PALS §7.2、16、17.3](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support) |
| Atropine / atrN | 0.01–0.02 mg/kg | 指定來源數值相符 | 0.01–0.02 mg/kg符合CPS新生兒插管前用藥；不是出生復甦通用用藥。 [CPS 新生兒插管前用藥，2026-04-20](https://cps.ca/en/documents/position/premedication-for-laryngoscopy) |
| Epinephrine (Bosmin) / epiArrest | 0.01 mg/kg；上限 1 mg | 指定來源數值相符 | 0.01 mg/kg、0.1 mg/mL、最高1 mg與AHA相符；用途限所列心跳停止情境。 [AHA/AAP 2025 心跳停止流程](https://cpr.heart.org/en/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-CA-250123.pdf)、[CHEO Epinephrine，2024-11](https://outreach.cheo.on.ca/manual/1563) |
| Epinephrine (Bosmin) / epiN | 0.01–0.03 mg/kg | 指定來源數值相符 | 0.01–0.03 mg/kg符合AHA新生兒復甦；CHEO列起始0.02 mg/kg。出生復甦流程不能只由日齡判定。 [AHA/AAP 2025 新生兒復甦 §15](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation)、[CHEO 新生兒 Epinephrine，2024-06](https://outreach.cheo.on.ca/manual/1336) |
| Epinephrine (Bosmin) / epiIM | 0.01 mg/kg；上限 0.5 mg | 非IV，不顯示 | 僅保留原資料，本版IV介面不顯示。IM過敏劑量不能改標為IV；國際來源仍將IM列為過敏反應主要給藥途徑。 [CHEO Epinephrine，2024-11](https://outreach.cheo.on.ca/manual/1563)、[CHEO 急救表，2024-03](https://outreach.cheo.on.ca/emergency-drug-calculator/1) |
| Epinephrine (Bosmin) / epiI | 0.05–0.3 μg/kg/min | 來源可追溯／情境限制 | 0.05–0.3 μg/kg/min符合所列來源範圍；0.05–0.1為強心用途，較高端為升壓用途，不是全範圍皆為起始值。 [CHEO 新生兒 Epinephrine，2024-06](https://outreach.cheo.on.ca/manual/1336) |
| Epinephrine (Bosmin) / epiPedI | 0.01–1 μg/kg/min | 指定來源數值相符 | 0.01–1 μg/kg/min亦可在2024 CHEO兒科來源找到，無須只依賴2021舊表；需依反應滴定。 [CHEO Epinephrine，2024-11](https://outreach.cheo.on.ca/manual/1563)、[Queen’s 兒科麻醉表，2021-04-30（舊表）](https://anesthesiology.queensu.ca/sites/anesthesiology/files/inline-files/Pediatric%20Drug%20Dose%20Chart%20(2021_04_30).pdf) |
| Dobutamine / dob | 2.5–15 μg/kg/min | 來源可追溯／情境限制 | 2.5–15 μg/kg/min與800 μg/mL配方相符；CHEO周邊輸注上限5 μg/kg/min。主畫面尚未輸入管路，不能把全範圍視為任何管路皆適用。 [CHEO Dobutamine，2024-11](https://outreach.cheo.on.ca/manual/1553) |
| Dobutamine / dobN | 5–20 μg/kg/min | 待人工檢視 | 劑量5–20 μg/kg/min相符，但LHSC配方依體重分流：≤1 kg用1 mg/mL，>1 kg用2 mg/mL；現版所有體重都以1 mg/mL換算速率。須人工選定院內標準濃度。 [LHSC NICU Dobutamine，頁面未標修訂日期](https://www.lhsc.on.ca/nicu/dobutamine) |
| Dopamine / dop | 1–20 μg/kg/min | 待人工檢視 | 1–20 μg/kg/min可追溯2021 Queen’s；一般範圍與院內首選需再決定。AHA兒科液體無反應敗血性休克優先列epinephrine／norepinephrine，不能將dopamine當所有休克的預設首選。 [Queen’s 兒科麻醉表，2021-04-30（舊表）](https://anesthesiology.queensu.ca/sites/anesthesiology/files/inline-files/Pediatric%20Drug%20Dose%20Chart%20(2021_04_30).pdf)、[AHA/AAP 2025 PALS §7.2、16、17.3](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support) |
| Dopamine / dopN | 2.5–10 μg/kg/min | 指定來源數值相符 | 一般2.5–10 μg/kg/min、預混800／1600 μg/mL相符；來源最大20不是一般起始範圍。 [CHEO 新生兒 Dopamine，2024-06](https://outreach.cheo.on.ca/manual/1332) |
| Norepinephrine / nor | 0.01–1 μg/kg/min | 來源可追溯／情境限制 | 0.01–1 μg/kg/min是CHEO通常維持範圍；起始0.01–0.1，不能把1當起始建議。12 μg/mL配方相符，以base計。 [CHEO Norepinephrine，2024-11](https://outreach.cheo.on.ca/manual/1658) |
| Norepinephrine / norN | 0.01–0.4 μg/kg/min | 來源可追溯／情境限制 | 0.01–0.4 μg/kg/min及12 μg/mL配方相符；來源起始0.05。需分開起始值、滴定範圍與最高量。 [CHEO 新生兒 Norepinephrine，2024-06](https://outreach.cheo.on.ca/manual/2004) |
| Sodium bicarbonate / bic | 1 mmol/kg | 來源可追溯／情境限制 | 1 mmol/kg、4.2%及1:1注射用水配方相符。AHA不建議一般心跳停止常規使用；需核對高血鉀等特定情境，不能僅因酸中毒就當常規復甦藥。 [CHEO 急救表，2024-03](https://outreach.cheo.on.ca/emergency-drug-calculator/1)、[AHA/AAP 2025 PALS §7.2、16、17.3](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support) |
| Sodium bicarbonate / bicN | 1–2 mmol/kg | 來源可追溯／情境限制 | 1–2 mmol/kg為來源在酸鹼資料不明時所列範圍；間歇輸注1–4小時且≤1 mmol/kg/hr。2 mmol/kg不能用1小時；4.2%仍高張，周邊管路有進一步稀釋方案。 [CHEO 新生兒 Sodium bicarbonate，2023-12](https://outreach.cheo.on.ca/manual/1407) |
| Calcium gluconate / ca | 0.5 mL/kg；上限 30 mL | 待人工檢視 | 現值10% 0.5 mL/kg（50 mg/kg鹽重量）符合RCUK高血鉀不穩定心律；CHEO列60 mg/kg且稀釋至50 mg/mL。須確認採用方案，不能混用濃度或視為元素鈣。 [RCUK 2026-02 V6（2025指引），第3、6頁](https://www.resus.org.uk/sites/default/files/2026-02/RCUK%20Paediatric%20emergency%20algorithms%20and%20resources%20Feb%2026%20V6.pdf)、[CHEO 急救表，2024-03](https://outreach.cheo.on.ca/emergency-drug-calculator/1) |
| Amiodarone / amio | 5 mg/kg；上限 300 mg | 待人工檢視 | 高優先：現模式第3／5次電擊共用最高300 mg；AHA後續劑量最高150 mg，RCUK第6頁也將第5次電擊後上限列150 mg，但同文件第3頁簡表寫300 mg。需分開首劑／後續劑量，原值暫保留。 [AHA/AAP 2025 心跳停止流程](https://cpr.heart.org/en/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-CA-250123.pdf)、[RCUK 2026-02 V6（2025指引），第3、6頁](https://www.resus.org.uk/sites/default/files/2026-02/RCUK%20Paediatric%20emergency%20algorithms%20and%20resources%20Feb%2026%20V6.pdf) |
| Amiodarone / amioPerf | 5 mg/kg；上限 300 mg | 來源可追溯／情境限制 | 5 mg/kg、60分鐘符合RCUK簡表；有脈且血流動力不穩定時仍須依心律處置流程，不能把慢速輸注作為所有有脈心律的統一方案。 [RCUK 2026-02 V6（2025指引），第3、6頁](https://www.resus.org.uk/sites/default/files/2026-02/RCUK%20Paediatric%20emergency%20algorithms%20and%20resources%20Feb%2026%20V6.pdf)、[AHA/AAP 2025 PALS §7.2、16、17.3](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support) |
| Adenosine / ade1 | 0.1 mg/kg；上限 6 mg | 待人工檢視 | 0.1 mg/kg、最高6 mg符合AHA首劑；RCUK採不同遞增方案。保留現值，但需人工確定整套SVT方案，不能交叉拼接。 [AHA/AAP 2025 心搏過速流程](https://cpr.heart.org/en/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-Tachyarrhythmia-250117.pdf)、[RCUK 2026-02 V6（2025指引），第3、6頁](https://www.resus.org.uk/sites/default/files/2026-02/RCUK%20Paediatric%20emergency%20algorithms%20and%20resources%20Feb%2026%20V6.pdf) |
| Adenosine / ade2 | 0.2 mg/kg；上限 12 mg | 待人工檢視 | 0.2 mg/kg、最高12 mg符合AHA重複劑量；RCUK另列0.3 mg/kg方案。不是兩個可任意交換的首劑。 [AHA/AAP 2025 心搏過速流程](https://cpr.heart.org/en/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-Tachyarrhythmia-250117.pdf)、[RCUK 2026-02 V6（2025指引），第3、6頁](https://www.resus.org.uk/sites/default/files/2026-02/RCUK%20Paediatric%20emergency%20algorithms%20and%20resources%20Feb%2026%20V6.pdf) |
| Dextrose / glu | 2 mL/kg；上限 50 mL | 待人工檢視 | D10W 2 mL/kg（0.2 g/kg）、最高50 mL符合RCUK表；CHEO急救表用5 mL/kg（0.5 g/kg）、通常最高250 mL。屬方案差異，不自動選較大值；新生兒低血糖未納入本模式。 [RCUK 2026-02 V6（2025指引），第3、6頁](https://www.resus.org.uk/sites/default/files/2026-02/RCUK%20Paediatric%20emergency%20algorithms%20and%20resources%20Feb%2026%20V6.pdf)、[CHEO 急救表，2024-03](https://outreach.cheo.on.ca/emergency-drug-calculator/1) |
| Magnesium sulfate / mag | 25 mg/kg；上限 2000 mg | 待人工檢視 | 現25 mg/kg、最高2 g、15–30分鐘可追溯CHEO急救表；ERC 2025 torsades列50 mg/kg、最高2 g。需人工決定方案，並區別有脈／無脈情境，不能把慢速時間套用所有復甦。 [CHEO 急救表，2024-03](https://outreach.cheo.on.ca/emergency-drug-calculator/1)、[ERC 2025 Paediatric Life Support，第11頁](https://www.erc.edu/media/03xnpjmj/gl2025-09-pls-e.pdf) |
| Naloxone / nal | 2 μg/kg | 來源可追溯／情境限制 | 2 μg/kg、40 μg/mL符合CHEO呼吸抑制滴定方案；不是呼吸停止／嚴重中毒所列的完整救援劑量，亦非出生復甦常規。 [CHEO 急救表，2024-03](https://outreach.cheo.on.ca/emergency-drug-calculator/1) |
| Isoproterenol / iso | 0.05–2 μg/kg/min | 來源可追溯／情境限制 | 0.05–2 μg/kg/min及10 μg/mL配方符合CHEO；它是特定情境的持續輸注，不是PALS常規心跳停止藥。海外院內來源不等同臺灣實際製劑核准用法。 [CHEO Isoproterenol，2026-05](https://outreach.cheo.on.ca/manual/1618)、[AHA/AAP 2025 心跳停止流程](https://cpr.heart.org/en/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-CA-250123.pdf) |
| Isoproterenol / isoN | 0.05–2 μg/kg/min | 待人工檢視 | 0.05起始、最高2 μg/kg/min及20 μg/mL配方可追溯，但來源內容仍為2014年。需更新新生兒依據，不視為2026新指引。 [CHEO 新生兒 Isoproterenol，內容2014-01／頁面2022](https://outreach.cheo.on.ca/manual/1363) |
| Milrinone / mil | 0.25–0.75 μg/kg/min | 待人工檢視 | 0.25–0.75 μg/kg/min符合CHEO兒科；同來源青少年列0.375–0.75，現版未分青少年。腎功能異常需調整、每日總量含loading須追蹤，主畫面沒有腎功能與累積量資料。 [CHEO Milrinone，2024-01](https://outreach.cheo.on.ca/manual/1646) |
| Milrinone / milLoad | 50 μg/kg | 來源可追溯／情境限制 | 50 μg/kg、15分鐘及100 μg/mL相符；IV loading不是快速push。是否loading需依血壓／情境決定，不能因為與維持量並列就認定必須合用。 [CHEO Milrinone，2024-01](https://outreach.cheo.on.ca/manual/1646) |
| Milrinone / milN | 0.25–0.75 μg/kg/min | 來源可追溯／情境限制 | 0.25–0.75 μg/kg/min、100 μg/mL與不建議loading符合新生兒來源。現版只列足月，沒有因此推定早產兒禁用；腎調整仍須另判斷。 [CHEO 新生兒 Milrinone，2024-06](https://outreach.cheo.on.ca/manual/1376) |

## 未宣稱完成的項目

- 未將來源吻合等同全球唯一標準、臺灣核准適應症或院內製劑驗收。
- 未完整稽核所有交互作用、安定性、容器、管路、配伍、肥胖用藥體重及肝腎調整。
- 未加入給藥紀錄與重複／每日累積劑量追蹤。
- 本輪未重新抄錄References中的舊圖表；既有CLINICAL-REVIEW.md的重大單位疑點繼續保留。
- 藥物模式具有情境條件；新生兒日齡並不等同出生復甦情境，維持範圍不等同起始劑量。

## 驗證

執行node test-audit.cjs、node test-clinical.cjs、node test-ui.cjs、node test-recommendations.cjs及node test-offline.cjs。執行結果另見PROGRESS.md；DOM／快取測試不是iPhone實機或臨床驗收。
