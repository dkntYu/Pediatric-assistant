from pathlib import Path
root=Path(__file__).parent
p=root/'dist/index.html';s=p.read_text(encoding='utf-8').replace('資料整理版 · v0.3','計算機模式 · v0.4').replace('開發預覽 · 尚未完成臨床驗收','依輸入數值換算').replace('四區已加入來源參考與可用計算；受來源、年齡或製劑限制的項目會停用。尚未完成院內臨床驗收。','你輸入劑量、濃度與時間，工具計算用量和速率。參考資料另列，超出範圍只提示，不自動修改數值。')
p.write_text(s,encoding='utf-8')
p=root/'dist/app-v3.js';s=p.read_text(encoding='utf-8').replace("d?.blocked?'來源限制 · 不啟用計算':'參考資訊與計算'","d?.blocked?'自由換算 · 參考資料有限':'自由換算與參考資訊'")
p.write_text(s,encoding='utf-8')
