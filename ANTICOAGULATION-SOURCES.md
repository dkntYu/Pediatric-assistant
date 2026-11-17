# 成人Heparin／Protamine v0.10.0

查閱：2026-11-17。使用者批准本批資料與計算，範圍為成人Heparin（ECMO／CPB）及Protamine，不增加適用情境介紹。程式為 `dist/anticoagulation.js`（來源、資料、純計算）及 `dist/anticoagulation-ui.js`（表單與結果）。外國來源不代表臺灣現用製劑、院內處方或流程已核准；仍需醫師／藥師／灌流與ECMO團隊驗收。

## 採用的資料與版本

### ECMO Heparin

- [ELSO Anticoagulation Guideline 2014，p.4](https://www.elso.org/Portals/0/Files/elsoanticoagulationguideline8-2014-table-contents.pdf)：起始bolus 50–100 units/kg。當ACT降至≤300秒且無過度出血時，起始輸注7.5–20 units/kg/hr，成人偏低端；出血／近期手術可延後開始。UI明示2014版本及起始範圍，不標為最新固定維持量。
- 已檢視 [ELSO 2021 Adult and Pediatric Anticoagulation Guidelines（2022發表）](https://www.elso.org/Portals/0/files/pdf/2021_ELSO_Adult_and_Pediatric_Anticoagulation.1.pdf) 及官方現行索引。新版強調個別化及院內監測策略，沒有將上述2014起始數值重新定義為所有成人的固定維持方案。
- [Alfred ECMO](https://ecmo.icu/daily-care-anticoagulation-bleeding/) 對出血／術後病人另採個別化策略；HIT時停用Heparin。ECMO運轉中Protamine有迴路血栓風險，須專家決定。網頁不把其流程與ELSO數值合併成通用處方。

### CPB Heparin

- [FDA Heparin Sodium仿單（2026），§2.5](https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/019953s050lbl.pdf)：常用300或400 units/kg，分別為預計<60及>60分鐘的例子。本版顯示常用起始參考300–400 units/kg，不依時間自動選量。
- [EACTS/EACTAIC/EBCP 2024 CPB指引，§9.3（2025發表）](https://cris.unibo.it/retrieve/cd0ea0ea-cb93-4b0f-9de5-ffd19974e612/ezae354.pdf)：起始與追加需依ACT／個別Heparin反應。本版不由體重推斷已足夠上機，不產生追加劑量建議。
- CPB只實作起始IV bolus；不套用ECMO units/kg/hr，也不將其顯示成CPB持續維持方案。

### Heparin原液與持續輸注泡法

- [NSW Medicines Formulary（2026）](https://cec.health.nsw.gov.au/__data/assets/pdf_file/0007/934090/Public-Facing-NSW-Medicines-Formulary-List.pdf) 列25,000 units/5 mL製劑；本版只接受5,000 units/mL原液，不將其與100、500或10,000 units/mL混用。
- [WACHS Critical Care Medication Administration for Adults v2.02（2026-10-27），p.26](https://www.wacountry.health.wa.gov.au/~/media/WACHS/Documents/About-us/Policies/Critical-Care-Medication-Administration-for-Adults-Guideline.pdf?thn=0)：低容量持續輸注25,000 units/50 mL，可用NS或D5W。本版取5 mL上述原液加45 mL稀釋液至總量50 mL＝500 units/mL，預設NS。採用的是濃度與相容稀釋液，**不是將WACHS一般Heparin nomogram當作ECMO劑量來源**。
- Bolus結果顯示5,000 units/mL原液抽取量，不從500 units/mL持續輸注針筒取藥；也不自動提出新的bolus稀釋方案。

### Protamine

- [Fresenius Kabi仿單（DailyMed）](https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=c76876da-b9a8-45d0-9278-7df3288d3a06)：原液10 mg/mL，約1 mg中和100 units仍有作用的UFH；慢速給藥，10分鐘劑量不超過50 mg。可不稀釋，若稀釋可用NS或D5W，稀釋後不儲存。
- [Prosulf SmPC §4.2](https://www.medicines.org.uk/emc/product/8/smpc)：單次不超過50 mg、約10分鐘；需依給Heparin後經過時間與凝血結果調整。本版不由「距離上次給藥時間」自動估算多次大劑量或CPB後殘餘量。
- 上述EACTS 2024 CPB指引建議Protamine／Heparin比值<1.0，且精確比值與監測方式尚無一致答案。[2024 EACTS/EACTAIC血液管理指引](https://pmc.ncbi.nlm.nih.gov/articles/PMC12257489/) 明示以**初始**Heparin為分母的比值<1.0策略。本版CPB模式用「實際初始Heparin units × 使用者處方比值 mg/100 units」，比值必須>0且<1，沒有預選治療比值，也不使用所有歷次累積量。
- 另一模式使用「經評估需中和的殘餘UFH units」÷100，不能填入未扣除代謝、回補或其他因素的歷次累積總量。兩個模式切換清空依據、比值與本次劑量，不沿用舊值。
- **總量參考與本次給藥分開**：例如21,000 units ×0.8/100＝168 mg，仍顯示168 mg參考總量，不暗中截成50 mg。只有使用者再輸入本次處方量>0且≤50 mg、且不超過該參考量時，才換算本次20或50 mL稀釋泡法。這是依仿單可用NS/D5W所作的體積換算，非原始文獻的固定Protamine濃度配方。
- 本次50 mg例：抽10 mg/mL原液5 mL加NS 15 mL至20 mL，至少10分鐘；選50 mL時則加45 mL。預設NS。不自動分次、不排整個CPB回補時程、不追蹤累積已回補量。不產生高劑量總量的幫浦速率。
- ECMO／CPB尚在運轉或未確認狀態時，本版停止Protamine換算；不是宣稱專業團隊在特定情況絕不能使用。LMWH、其他抗凝藥、持續出血的自動追加與非Heparin性凝血異常均不在本版計算範圍。

## 量綱與驗證

- Bolus units＝kg ×units/kg；原液mL＝units ÷5,000。
- ECMO輸注units/hr＝kg ×units/kg/hr；mL/hr＝units/hr ÷500，**不再乘60**。
- Protamine mg＝所選依據的Heparin units ×比值 ÷100；本次原液mL＝本次mg ÷10；稀釋液mL＝選定總mL－本次原液mL。
- `test-anticoagulation.cjs`：獨立算術、邊界、濃度錯誤、bolus／輸注／CPB隔離、NS預設、劑量每小時單位、總量不被50 mg截斷、本次≤50 mg、狀態禁算、切換清除與輸入失效。原成人及兒童互動與離線測試一併執行。
- 尚未完成真實瀏覽器／手機排版、iPhone離線實測或臨床驗收；沒有以測試通過宣稱臨床安全性已獲確認。
