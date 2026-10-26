from pathlib import Path
root=Path(__file__).parent
p=root/'dist/index.html';s=p.read_text(encoding='utf-8')
s=s.replace('開發預覽 · v0.2','資料整理版 · v0.3').replace('已加入兩藥的來源資料與持續輸注換算；其餘項目仍待核對。未完成院內臨床驗收。','四區已加入來源參考與可用計算；受來源、年齡或製劑限制的項目會停用。尚未完成院內臨床驗收。').replace('min="0.1" step="0.1"','min="0.1" max="200" step="0.1"')
s=s.replace('<script src="app.js"></script>','<script src="clinical-data.js"></script><script src="clinical-core.js"></script><script src="clinical-ui.js"></script><script src="app-v3.js"></script>')
p.write_text(s,encoding='utf-8')
