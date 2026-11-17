# 成人急救藥物 v0.9.0

查閱日期：2026-11-17。授權範圍為 milrinone、Pitressin（vasopressin）、isoproterenol 三種成人藥物的劑量、≤50 mL 泡法及速率換算；不新增適用情境介紹。來源為國外官方仿單、衛生主管機關與醫院指引；並非臺灣現用製劑或院內配方的驗收。

## Milrinone

- [Wockhardt SmPC §4.2、6.6](https://www.medicines.org.uk/emc/product/2625/smpc)：採成人腎功能正常維持量 0.375–0.75 µg/kg/min；loading 50 µg/kg over 10 min；每日總量含 loading ≤1.13 mg/kg。
- 原液 1 mg/mL，取 10 mL（10 mg）加 D5W 或 0.9% NaCl 40 mL，**總量 50 mL**，200 µg/mL。網頁只採此一濃度。
- [Safer Care Victoria](https://www.safercare.vic.gov.au/best-practice-improvement/clinical-guidance/critical/milrinone) 亦有相同 50 mL syringe 配方，但常用維持範圍較低、loading 常因低血壓而省略。本版明確標示採 SmPC 範圍，未把兩者混成單一通用起始劑量。
- 成人腎功能異常需調整。本批未實作腎調整；腎功能異常或不明時阻擋速率換算。Loading 只呈現來源劑量，沒有 loading 體積／幫浦計算。每日累積量尚未追蹤。

## Pitressin／Vasopressin／Argipressin

- 劑量採 [NSW CEC 成人 Argipressin（2026-09）](https://cec.health.nsw.gov.au/therapeutics-safety/continuous-infusions/adult/argipressin)：0.6–3.6 units/hr，換成 0.01–0.06 units/min。這是該來源的成人持續輸注參考範圍，並非所有用途的絕對上下限，不加入歷史 cardiac-arrest bolus。
- 泡法採 [Safer Care Victoria](https://www.safercare.vic.gov.au/best-practice-improvement/clinical-guidance/critical/vasopressin-argipressin)：原液 20 units/mL，取 1 mL（20 units）加 19 mL 稀釋液，總量 20 mL；或取 2 mL（40 units）加 38 mL 稀釋液，總量 40 mL。兩者均為 1 unit/mL，可用 D5W 或 0.9% NaCl，中央靜脈，室溫 18 小時。
- NSW 原頁另採 20 units/50 mL（0.4 units/mL）；**本版沒有把該濃度當作 1 unit/mL**。資料／介面／測試使用明確的 SCV 20 mL 或 40 mL syringe 配方。
- SCV 網頁註記指引正在複核；本版使用較新的 NSW 劑量來源。現用 Pitressin 製劑、稀釋相容性及院內核准用法需院內確認。

## Isoproterenol／Isoprenaline hydrochloride

- 劑量採 [NSW CEC 成人 Isoprenaline（2026-09）](https://cec.health.nsw.gov.au/therapeutics-safety/continuous-infusions/adult/isoprenaline)：0.5–10 µg/min，2 mg/50 mL＝40 µg/mL。不按公斤。
- 泡法採 [Frimley Health v2，2025-07](https://guidelines.fhft.nhs.uk/Cardiology-Arrhythmias-Isoprenaline_for_Bradycardia) 的 50 mL 濃縮配方：hydrochloride 原液 1 mg/5 mL＝0.2 mg/mL，取 10 mL（2 mg）加 D5W 40 mL，總量 50 mL。此配方中央靜脈、24 小時更換，不採用 0.9% NaCl。
- Frimley 此濃縮方案起始量 1 µg/min，NSW 常用範圍下緣 0.5 µg/min。本版採 NSW 範圍，**沒有自動選定起始劑量**。本版不加入其他適應症／bolus／較高劑量方案，不把各來源上限合併。
- 不同鹽類（如 sulfate）不能直接套用 hydrochloride 的 mg 數。

## 換算與驗證範圍

- 藥量 mg ×1000／最終 mL＝µg/mL；units／最終 mL＝units/mL。
- Milrinone：mL/hr＝µg/kg/min ×kg ×60 ÷µg/mL。
- Isoproterenol：mL/hr＝µg/min ×60 ÷µg/mL。
- Vasopressin：mL/hr＝units/min ×60 ÷units/mL。
- 所有泡法總體積均 ≤50 mL，不是再加入 50 mL。只接受指定原液濃度、稀釋液及中央管路，Milrinone 使用獨立成人體重；修改表單立即移除舊結果與速率表。
- 顯示最多四位小數，沒有幫浦刻度取整。沒有建議治療選擇、累積劑量追蹤或完整交互作用檢查。
- `test-adult.cjs` 涵蓋獨立算術、上下界、輸入單位、禁算條件、兒童／成人資料隔離、修改後失效及配方切換。DOM 測試不能視為手機或臨床驗收。
