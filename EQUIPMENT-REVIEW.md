# 呼吸機與CVC參考資料（2026-10-27）

新增入口：呼吸道 → 呼吸機設定；輸液與輸血 → CVC號數與深度。關鍵數字直接顯示，計算及來源在展開區。原版備份位於同層 `Pediatric-assistant-backups/20261027-before-ventilator-cvc/`。

## 呼吸機

- 一般插管後初始參考採[BC Children’s Hospital／Child Health BC](https://childhealthbc.ca/pcc/hurry/mechanical-ventilator)及其[2024-11年齡表](https://childhealthbc.ca/sites/default/files/2024-11/initial-settings.png)：Vt、RR、Ti與目標MV依年齡分層。年齡以足歲解讀，6–10歲欄涵蓋未滿11歲；此為本工具明示的分層解讀。
- 已知IBW／PBW時可填入，採它與實際體重的較小者；未填時以實際體重暫算並明示，不自稱已估算IBW。目標MV與Vt／RR範圍為不同參考值，不宣稱所有端點組合都達到目標MV。
- PEEP起始5 cmH₂O與一般急性照護SpO₂目標94–98%採[RCUK 2025](https://www.resus.org.uk/cy/node/36439)。BCCH通用表另列PEEP 5–10，並未當作所有病人固定設定。FiO₂需依氧合調整，未填一個通用百分比。
- Pplat <30 cmH₂O來自BCCH原表，不當作PIP上限。PIP、I:E及呼氣時間須依肺力學、實測Vt與波形決定。
- 新生兒RDS是另一個情境，採[CAHS 2024 RDS指引第4頁](https://www.cahs.health.wa.gov.au/~/media/HSPs/CAHS/Documents/Health-Professionals/Neonatology-guidelines/Respiratory-Distress-Syndrome.pdf)：Vt起始4.5 mL/kg，必要時至6；早產RR40、Ti0.3、PIP18，足月RR30、Ti0.4、PIP22；皆PEEP5。這些是VG相關起始參考，不能當成所有新生兒或出生復甦規則。
- 早產標籤不自動推定RDS；需先選專用情境。CPR、PARDS／ARDS、阻塞性疾病、特殊心臟病不直接沿用一般表。

## CVC

- 號數候選採[Queen’s 2021第1頁表](https://anesthesiology.queensu.ca/sites/anesthesiology/files/inline-files/Pediatric%20Drug%20Dose%20Chart%20(2021_04_30).pdf)。來源較舊，主卡標為待人工檢視；須配合超音波血管口徑與實際器材。體重交界保留兩列候選；本版不套至早產兒、<3 kg或>100 kg。3 kg下限是本版保守使用範圍，並非原表有該下限。
- 深度採[Yoon等2006原始研究](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1399-6576.2006.00951.x)：1.7 + 0.07 × 身高(cm)，研究限右內頸靜脈、身高40–140 cm、60例心臟手術嬰兒／兒童。數字只作初始估算，必須確認尖端位置。
- 左內頸、雙側鎖骨下與股靜脈提供部位選擇及號數候選，但沒有本版核對過的通用深度公式，明確顯示「未提供」。不把右內頸數字移植過去。
- 原本References/CVC1.jpg沒有清楚標明部位，身高分段亦漏掉100 cm等號，未直接匯入；CVC2.jpg是器材總長等規格，不當作置入深度。原件未上傳。
- 未將2006研究或2021院內表標成最新國際共識；UVC、PICC與透析導管未納入。

## 驗證範圍

`test-equipment.cjs`檢查年齡、體重與身高邊界、計量體重、RDS分流、部位限制、直接顯示及舊結果清除。既有藥物、核對標記、資料記憶與離線測試亦須通過；不等同iPhone實機或臨床驗收。
