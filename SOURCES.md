# 第一批：Isoproterenol / Milrinone

> 更新：v0.3 已擴充全四區。完整可機讀來源索引與每個模式對應位於 `dist/clinical-data.js`，均附連結與查閱日期。以下第一批紀錄保留；最新臨床疑點、停用與資料缺口見 `CLINICAL-REVIEW.md`。來源數量不代表專業驗收。

## v0.3 來源使用原則
- 本地26頁PDF可讀文字定位與2頁PDF渲染完成，但未宣稱完成全部原始資料專業校對；舊PPT尚未完整解析。
- 藥物主要使用CHEO、LHSC、IWK院內兒科／NICU資料，另參考CPS新生兒插管用藥、Queen’s兒科麻醉表。Queen’s表為2021資料，來源名稱已提示較舊。
- 急救另採RCUK 2026資源（2025指引）。不同地域復甦流程有差異，不把不同劑量方案合併成一條。
- 新生兒器材採Safer Care Victoria胎齡與體重表；頁面提示可能過期，UI明示需核對現行院內規範。非新生兒呼吸道、輸液、兒科與新生兒血品採RCH對應頁面；LMA限Teleflex指定型號。
- Parecoxib採EMA兒科限制；Sugammadex採指定澳洲製劑資料2歲以上範圍，不推論其他製劑的核准年齡。
- Propacetamol臺灣舊院內資料與其他搜尋結果年齡／用法不一致；未把搜尋摘要或paracetamol劑量直接填入計算器。
- 原液／最終濃度配方經單位守恆驗證，但相容性、穩定性、院內製備方式與可抽取精度仍需專業核對。沒有配方者只提供已製備液體的體積換算。

查閱：2026-10-27。國外院內參考不是臺灣核准兒科仿單，尚待使用者院內驗收。提供者本地 References 尚未全文影像辨識與簡報解析，不宣稱全部搜尋完畢。

## 採用來源
- CHEO Isoproterenol pediatric：https://outreach.cheo.on.ca/manual/1618 （修訂 2026-05）。0.05–2 μg/kg/min。0.2 mg/mL 原液 2.5 mL + NS 47.5 mL = 50 mL，10 μg/mL。
- CHEO Isoproterenol neonatal：https://outreach.cheo.on.ca/manual/1363 （修訂 2014-01，頁面更新 2022-01）。起始 0.05 μg/kg/min、最高 2。0.2 mg/mL 原液 2 mL + D5W 18 mL = 20 mL，20 μg/mL。來源較舊，畫面明示。
- CHEO Milrinone pediatric：https://outreach.cheo.on.ca/manual/1646 （修訂 2024-01）。0.25–0.75 μg/kg/min；loading 50 μg/kg / 15 min 僅文字，未開計算；上限 1.13 mg/kg/day。
- CHEO Milrinone neonatal：https://outreach.cheo.on.ca/manual/1376 （修訂 2024-06）。0.25–0.75 μg/kg/min，不建議 loading。1 mg/mL 原液 2 mL + D5W 18 mL = 20 mL，100 μg/mL。兒科來源也支持此濃度與稀釋液。
- 耕莘 Proternol-L：https://www.cth.org.tw/?aid=606&iid=1359&page_name=detail&pid=0 。0.2 mg/mL，兒童安全性與有效性尚未確立；不可呈現為臺灣核准兒科劑量。

## 差異與未完成
- ANMF Milrinone neonatal 搜尋結果提示足月／早產、腎功能應區分；未將該表與 CHEO 混合。早產 Milrinone 禁止計算；腎功能異常／不明禁止 Milrinone 計算。
- 臺中榮總 Dosebook 搜尋結果 Isoproterenol 範圍較窄，尚未驗證版本，不採其上限。本版明列 CHEO 為來源，沒有合併成通用規則。
- 實際藥瓶濃度需手填且符合已核對配方，不支援任意濃度／體積的自行調配。
- 不提供 Bolus 自動建議，不做腎調整、不推算適應症、不自動選起始劑量、不依幫浦刻度取整。
- 數值計算與單位測試不等同藥師／醫師臨床驗收；瀏覽器操作與手機仍需實測。
