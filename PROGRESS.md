# 兒科口袋助手進度

## 目前有效：v0.6.4 記住上次基本資料（2026-10-27）
- 依使用者要求，以此瀏覽器localStorage記住最後成功套用的年齡分類、年齡／胎齡／日齡及體重，不上傳。
- 下次開啟自動帶入；顯示「已帶入上次資料，請確認後套用」，不自動將上次資料視為本次病人。清除資料會清除此專用儲存鍵。
- 無效輸入不覆蓋最後有效資料；損壞或不適用記錄忽略；瀏覽器禁止儲存時仍可正常查詢並顯示提示。
- 更新頁面原「不儲存」文字，service worker升v0.6.4。test-remember.cjs（四族群、還原、清除、無效資料及禁用儲存）、UI、recommendations、offline測試通過；未iPhone實測。
- 私人發布結果待補記。

## 目前有效：v0.6.3 移除五項急救藥物（2026-10-27）
- 依使用者要求移除Amiodarone（使用者拼作admiodarone）、Adenosine、Dextrose、Magnesium sulfate、Naloxone：介面、現用資料與核對模式同步移除。
- 目前19藥50模式；現用急救核對頁剩9藥21模式（20 IV，1 IM資料保留但不顯示）。原28模式核對報告及基準快照作歷史檔保留，不重新產生成目前版本。
- 原始Git歷史與備份保留；service worker升v0.6.3。clinical、UI（86模式／族群）、recommendations、audit及offline測試通過。
- 已成功私人發布，commit 767d675abc9c70a05e34f60f34baf8039a91733d，deployment appgdep_6ae01273513c8191ac98dcac1ce6b332，version appgprj_6adf79fe97c08191a7878e3d6f9e9b8b~appgver_3a1a213c27ac81919f089a7875cb61a2。原網址及owner-only保留。

## 目前有效：v0.6.2 移除三項藥物（2026-10-27）
- 依使用者要求移除Parecoxib (Dynastat)、Dexamethasone、Ondansetron：現用資料、來源、介面清單及舊入口清單同步移除；歷史紀錄與備份保留。
- 目前24藥57模式；急救14藥28模式及其待人工檢視標記未改。
- test-clinical.cjs、test-ui.cjs（100模式／族群）、test-recommendations.cjs、test-audit.cjs、test-offline.cjs通過。test-audit改為驗證急救各模式與備份一致，允許非急救項目按要求移除。
- service worker更新v0.6.2；已成功私人發布，commit aa3abe51c446be2a9defdc4f6b783fb771f66508，deployment appgdep_6ae011bfcbfc8191a9b8e01f33061ef6，version appgprj_6adf79fe97c08191a7878e3d6f9e9b8b~appgver_cda50e31e9a48191912a597068d41b10。原網址及owner-only保留。

## 目前有效：v0.6.1 急救藥物線上比對（2026-10-27）
- 使用者授權接續線上核對、先存檔、衝突標註人工檢視。沿用先前分批約定，本批完成急救14藥28模式（27 IV顯示、1 IM原資料排除）。其他分類尚未在本輪重新線上核對。
- 原v0.6完整來源快照32檔、SHA-256及Git bundle：../Pediatric-assistant-backups/20261027-v06-before-online-audit/。bundle已驗證；restore-to-new-folder.ps1可驗證後還原至新資料夾，不覆蓋現行版。
- 線上比對AHA/AAP 2025、ERC 2025、RCUK 2026-02 V6、CPS 2026及CHEO／LHSC原始院內來源。resuscitation-audit.js保存逐模式結果及來源；audit/RESUSCITATION-REVIEW-20261027.md保存完整對照。
- 11模式待人工檢視、11模式具情境限制、5模式指定來源數值相符、1個非IV排除。這些分類不是臨床認證，沒有把院內來源當作全球唯一標準。
- 優先項目：Amiodarone後續上限150 vs300 mg（RCUK文件內簡表與流程亦不一致）、Atropine上限方案、Dextrose與Magnesium方案、新生兒Dobutamine體重分流濃度、Milrinone青少年分層及腎／累積量。
- 主畫面保留數字並增加人工檢視標記，完整說明及原始連結放展開區；頁尾連audit.html，含僅顯示待檢視的篩選。核對頁及資料納入離線快取。
- clinical-data.js及clinical-core.js未修改，有衝突的劑量未自動更改。原References疑點保留，不重新匯入舊圖表。
- test-audit.cjs、test-clinical.cjs、test-ui.cjs、test-recommendations.cjs、test-offline.cjs通過；核對頁斷網導航及資料可用，語法與diff檢查通過。32檔備份雜湊均相符，clinical-data.js／clinical-core.js與備份逐位元一致。尚未iPhone實機測試。
- 已成功發布v0.6.1（owner-only）：commit 7f9accf51d5f4ee608ee97bb8ef82962434f7b5b；deployment appgdep_6ae0020ac6f08191a2bc0623283c382a；version appgprj_6adf79fe97c08191a7878e3d6f9e9b8b~appgver_04d0cffa3b848191822d0431976fd41e。
- 核對頁：https://pediatric-pocket-prototype.alive-carp-0388.chatgpt.site/audit.html。舊裝置使用頁尾檢查更新套用新版。
- 下一批為麻醉藥物（本次未核對）；人工決定各衝突採用方案後再修改臨床值，不直接拼接不同指引。

## 目前有效：v0.6 IV建議數字直接顯示（2026-10-27）
- 使用者再次明確要求：依年齡與體重建議劑量、關鍵數字立即顯示、方法置於展開區，給藥途徑皆IV。
- recommendations.js沿用現有來源範圍及年齡條件，即時計算各適用IV情境總用量／持續給藥量；不是讓使用者先自行輸入每公斤劑量。保留多情境，不擅自選定單一劑量。
- PO、IM、SC、IN模式從建議及換算選單排除；IV/IO與IV/UVC情境僅顯示IV用途，不把非IV劑量改標IV。原始資料保留備查。
- 套用既有單次上限；有來源濃度／配方者顯示對應mL或mL/hr並明示濃度假設。腎功能及需個別上限等條件仍有可見提示。
- 卡片全部常駐；計算依據、來源、濃度及指定劑量換算收在details內。核心資料及公式未變動。
- 備份：../Pediatric-assistant-backups/20261027-before-IV-summary/；service worker更新v0.6。
- 急救藥物全面核對仍暫停；此版不代表新增臨床驗收。
- test-clinical.cjs、test-ui.cjs（104模式／族群）、test-recommendations.cjs、test-offline.cjs通過；未做實際iPhone排版驗證。
- 已成功私人發布：commit 12359043d62f2b4f49a9aba0ab8137cee9c40fdd；deployment appgdep_6adff653498081918f4bd6c155f35388；version appgprj_6adf79fe97c08191a7878e3d6f9e9b8b~appgver_faacc2ee8e6081919543a62f437bc271。
- 原私人網址不變；裝置可用「檢查版本更新」套用v0.6。

## 目前有效：還原建議劑量版（2026-10-27）
- 使用者澄清需要依年齡及體重的藥物建議劑量，要求還原原版。此指示取代下方v0.4／v0.5「計算機模式」方向。
- 已從776ba8094108c8af338f54884a3908ddfe85a935還原index、clinical-core、clinical-ui、app-v3、sw與README。calculator.js／css僅保留存檔，不再由入口載入。
- 回復年齡適用情境、來源每公斤參考範圍、上限與濃度規則；選定情境與劑量後依體重計算，並非所有藥物自動選出單一處方。
- 還原前完整dist及進度備份：../Pediatric-assistant-backups/20261027-before-restore-recommendations/。Git歷史亦保留v0.4及v0.5。
- service worker使用新識別pediatric-v0.3-restored-20261027-b，避免舊計算機快取。
- test-clinical.cjs、test-ui.cjs、test-offline.cjs通過；27藥59模式及108族群／模式DOM檢查，未做iPhone實測。
- 急救藥物自動核對依使用者要求仍暫停，未將調查內容套用到資料。
- 私人網站已還原並成功發布：5a00c86dc095963dda15c8c177829a04e065e9a8；deployment appgdep_6adff4060e7c81918acfeda684d9f24d，succeeded。
- Version：appgprj_6adf79fe97c08191a7878e3d6f9e9b8b~appgver_99fd307b0f0081919f512a0aeb69e1fc。原網址、owner-only保留；使用頁尾檢查更新套用新版。

## 最新：v0.5 數字優先介面（2026-10-27）
- 所有卡片直接顯示，移除整張卡片的展開步驟。呼吸道尺寸／深度及維持輸液數字常駐；手動計算結果置於輸入欄位上方，以大字呈現用量、體積、速率及稀釋量。
- 公式、計算過程、參考範圍、來源與補充說明集中到「計算依據與來源」。無自動估算的器材保留可見提示。
- 常用星號切換不重建卡片，保留輸入；修改病人資料仍清除過期結果。
- 不改動劑量公式，不預填劑量，不自動截限。仍由使用者填數值並按計算。
- test-calculator.cjs、test-offline.cjs及修改JS語法檢查通過；新增卡片直接可見及公式摺疊的DOM檢查。未做實際瀏覽器／iPhone視覺測試。
- service worker更新為v0.5，已成功發布，維持owner-only。
- Commit：d78930c4256725f0695c1380ab40dcf9d67133b4。
- Deployment：appgdep_6adff13a3a4c8191b0ecd3ca18c86cbd，succeeded。
- Version：appgprj_6adf79fe97c08191a7878e3d6f9e9b8b~appgver_72fb8b433adc8191bc181c6afc481dda。
- 網址：https://pediatric-pocket-prototype.alive-carp-0388.chatgpt.site
- 已快取舊版本的裝置使用頁尾「檢查版本更新」套用新版，確認標示v0.5。下一步：使用者手機試用與離線實測。

## 最新：v0.4 計算機模式（2026-10-27）
- 使用者明確要求作為計算機，由其決定劑量與條件；授權接續簡化，不反覆要求確認。
- 新增dist/calculator.js：27藥自由換算、選填來源情境、mg/μg轉換、每分鐘／每小時、選填稀釋與輸注時間；無來源不預填建議值。
- clinical-core.dose改成保留原輸入，不依來源自動cap/floor；參考範圍與年齡差異只註記，不阻擋算術。保留正數、有限值、量綱與無法稀釋的檢查。
- 輸液／血品提供mL/kg或總體積換算；紅血球另有Hb增幅公式。全頁移除確認勾選。
- 藥物既有資料及來源仍保留，長篇提醒收進可展開說明；Propacetamol等可自行輸入，但未補猜建議劑量。
- 新測試test-calculator.cjs通過：不截限、mg↔μg、min↔hr、自訂稀釋、錯誤量綱、27藥表單、血品及舊結果清除。test-offline.cjs通過；不等於iOS實機測試。
- test-clinical.cjs／test-ui.cjs是v0.3歷史測試，臨床阻擋與自動截限假設已被使用者新需求取代，不再列為v0.4檢查。
- service worker版本已升v0.4並包含calculator.js；私人網站部署結果另記，未成功前不聲稱上線。
- 精確下一步：完成本批版本發布、保存部署識別碼；使用者試算與手機離線實測。

### v0.4 已發布
- Commit：afc6cfb6b81b9e0286b908e65e43c0b4a194d5fa。
- 私人網址：https://pediatric-pocket-prototype.alive-carp-0388.chatgpt.site
- Deployment：appgdep_6adf984bae5c8191a5b8c33d076f55ee，succeeded。
- Version：appgprj_6adf79fe97c08191a7878e3d6f9e9b8b~appgver_e88f17e43d588191ab3f36c62ea772fd。仍只有owner。
- test-calculator.cjs、test-offline.cjs與新JS語法檢查通過；未做實際iPhone／瀏覽器排版驗證。
- 已快取v0.3的裝置需使用頁尾「檢查版本更新」→「套用新版並重新開啟」，再確認標示v0.4。
- 下一步：試用自由換算、濃度單位切換、稀釋及血品；若需調整預設欄位或加入參考數值，依使用者回饋接續。不要恢復v0.3的強制勾選或自動劑量截限。
- 本段為發布後本地紀錄，不改已部署程式內容。

更新：2026-10-27（Asia/Taipei）。目前 v0.3 資料整理版，非臨床驗收完成版本；以下舊批次紀錄保留。

## 最新授權與狀態（優先於下方歷史紀錄）
- 使用者已授權補齊其餘全部計算，找不到可網搜，持續保存、不逐批詢問；無可靠帳戶剩餘tokens資料，不宣稱即將耗盡。
- 已接四區：5項呼吸道、27個藥物條目（含2個停用）、59個用途／途徑／族群模式、3項輸液及4種血品。
- 核心作者檔：dist/clinical-data.js（來源與規則）、clinical-core.js（純計算／限制）、clinical-ui.js（結果卡片）、app-v3.js（目前入口）。index.html載入新入口；舊app.js與infusion.js保留歷史相容性，不要用舊integrate.py重建新版入口。
- 來源不足／不適用直接停止。Propacetamol單次／現行重配待確認；Dynastat兒科不計算。早產Milrinone等仍有族群限制；不是所有藥物可套用所有年齡。
- 各模式有公式、來源、年齡、單位、部分上限及監測提醒；單次每公斤劑量由使用者選擇，未自動開處方。已加入部分稀釋配方；未確認的配方不猜測，只換算實際已配藥液。
- 新生兒／早產血品獨立來源；新生兒輸液另要求出生體重、日齡及照護環境。鼻／口咽呼吸道用實際量測，較大兒童鼻管深度來源不足停算。
- 測試：test-clinical.cjs通過27藥／59模式的邊界、量綱、上限、濃度、腎／管路、輸液、血品與ETT測試。test-ui.cjs以jsdom通過表單、修改清除、族群切換與108組適用模式／族群生成檢查；不是實際瀏覽器／排版測試。
- 新增manifest、service worker及手動版本更新；test-offline.cjs測快取邏輯，仍需iPhone實際安裝、飛航與重新開啟驗證。
- 使用者References原件與工作中間資料均排除Git與dist；沒有對外上傳原件。CLINICAL-REVIEW.md記錄本地表格疑點，不直接沿用疑有重大單位問題的欄位。
- 精確下一步：完成本批離線測試、私人部署嘗試與checkpoint；院內醫師／藥師逐項驗收、Propacetamol現行來源與所有缺項、實際手機驗證仍必須明確列出，不能宣稱臨床可直接使用。

## v0.3 交付 checkpoint（2026-10-27）
- test-clinical.cjs、test-ui.cjs、test-offline.cjs、test-infusion.cjs 全部通過，JS語法與git diff --check通過。DOM與快取邏輯測試不等於實際瀏覽器／iPhone測試。
- Sites 原始碼已推送，commit `776ba8094108c8af338f54884a3908ddfe85a935`；未包含References／work／.qa。
- 私人部署成功：https://pediatric-pocket-prototype.alive-carp-0388.chatgpt.site
- Site：appgprj_6adf79fe97c08191a7878e3d6f9e9b8b；version：appgprj_6adf79fe97c08191a7878e3d6f9e9b8b~appgver_3d40a1ed5c248191815e0341be4bc470；deployment：appgdep_6adf8fa4c7508191a8d9d21135a174ab（succeeded）。只有owner，沒有外部viewer。
- 已定位先前部署失敗原因：檔案由CodexSandboxOffline建立，發布程序為dknts，Git擁有者檢查阻擋。以僅本次程序的GIT_CONFIG_COUNT追加精確safe.directory修復，值必須用`C:/Users/dknts/Dropbox/Gdrive/Learning/MyVault/Pediatric-assistant`正斜線；未修改全域設定。
- 以官方site-workflow.mjs打包發布；下次保留本Site身份，不重建Site。新credential只放記憶體並經stdin傳遞，不寫檔。
- 當前精確下一步：使用者在手機登入私人網站，逐項試算並依CLINICAL-REVIEW.md核對；確認頁尾離線檔案備妥後加入主畫面、飛航模式關閉重開實測。實際iOS、完整臨床／濃度／處方驗收仍未完成。Propacetamol、缺乏來源族群與模式繼續停用，不為求項目全亮而猜數值。
- 本段checkpoint為發布成功後本地補記；已部署程式版本仍是776ba80，沒有改動網站程式或資料。

## 已確定需求
- 個人臺灣臨床工作助手；最終需要離線查詢。
- 早產兒／新生兒／infant／child 分類輸入；體重 kg 最多小數點一位。
- 四區：呼吸道器材、麻醉藥物、急救藥物（bolus/infusion/稀釋）、輸血。
- 學名 dexamethasone、propacetamol；propacetamol 不套用 paracetamol 劑量。
- 無來源、不建議或無適用證據時明確顯示，不猜測。

## 本批成果
- dist/index.html、style.css、app.js：可切換年齡欄位、驗證基本輸入、套用與清除、四區切換、分類搜尋、展開項目與本次使用的常用標記。
- 不儲存病人資料、不載入公式或劑量；所有結果欄位標示待核對。
- 尚未實作離線快取或安裝設定，不宣稱可離線使用。
- 年齡分類與欄位範圍是介面原型限制，非臨床適用規則；後續需依來源調整。

## 下一步
讓使用者試用介面並回饋；等待參考資料。下一批開始前另報範圍與用量估計，未授權大量臨床查證。

## 驗證
- node --check dist/app.js 通過；本機 HTTP 回應 200。
- 環境沒有可用的受支援瀏覽器（browser inventory 為空），未完成互動與手機畫面的實機驗證；不能視為已通過。
- 已建立 owner-private Sites，部署狀態另見後續紀錄。

## 部署限制
- Sites project_id：appgprj_6adf79fe97c08191a7878e3d6f9e9b8b（私人，未發布）。
- 官方 site-workflow.mjs 回報 Git metadata is unreadable；直接 git status 與 rev-parse 正常。本地提交 041f10e。未取得可用部署網址，不宣稱上線。
- 可直接開啟 dist/index.html，所有依賴均在本地，不使用外部字型或 CDN。這不等於手機 PWA 離線安裝已完成。

## 介面修訂：輸液與輸血（2026-10-27）
- 第四區改為「輸液與輸血」，新增維持輸液、輸液補充／快速輸注、缺損與持續流失補充，保留四種血品。
- 只有待核對欄位，未加入臨床數值或計算。
- JS 語法與七項資料結構檢查通過；未新增瀏覽器驗證或部署。

## 急救藥物增補與參考資料（2026-10-27）
- 急救區新增 Isoproterenol、Milrinone，可搜尋、展開與標記常用；保留待核對狀態，未啟用臨床計算。
- 使用者指定 References 為後續換算參考。共有兩份 PDF、一份舊版 PPT、七張 JPG；原始參考文件不放入 dist 或網站發布內容。
- 已目視查看 Resuscitation.jpg、NICU.jpg；不能將原表直接視為已核對公式。
- 兩份 PDF 用 pypdf 做文字搜尋，未找到 isopro/milrin 字串；不代表來源內沒有，後續需影像／簡報定位。尚未完整審閱全部來源。
- 下一步：在來源中定位兩藥適應情境、年齡、劑量單位、原液濃度、最終濃度與稀釋方式，交叉核對後再實作計算。若進入大量來源審閱，先報估量取得同意。

## 第一批來源換算（2026-10-27）
- 使用者授權找不到時網搜並開始製作。本批限 Isoproterenol、Milrinone；其他三十餘項仍待處理，不能視為全工具完成。
- dist/infusion.js、infusion.css：CHEO 兒科與新生兒來源分流、輸入已決定劑量及實際原液濃度，換算固定配方與 infusion mL/hr。來源、版本、公式與臺灣 Isoproterenol 兒童限制列於畫面。
- 早產 Milrinone、腎功能異常或不明阻擋計算。Bolus/loading 僅顯示差異，不開計算；足月新生兒需核對出生族群。未核對全部適應症與禁忌，不替代處方。
- SOURCES.md 保存來源與差異；未上傳使用者原始 References。
- node --check app.js/infusion.js 通過；test-infusion.cjs 的單位、稀釋、邊界、無效輸入、腎功能與早產限制通過。未新增實際瀏覽器／手機驗證；不宣稱臨床驗收完成。
- 仍為本地檔案，既有 Sites 部署錯誤未解決；未啟用 PWA 快取。
- 精確下一步：使用者試用急救區兩藥換算；下一批先報估量，再整理 References 的其他急救藥物及來源缺項。仍需完整適應症／禁忌核對、院內配方確認與實機驗證。
