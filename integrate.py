from pathlib import Path
p=Path(__file__).parent/'dist/app.js'
s=p.read_text(encoding='utf-8')
if 'let patient=null;' not in s:
 s=s.replace("let group='child',category=0,applied=null,", "let patient=null;\nlet group='child',category=0,applied=null,")
s=s.replace("function markDirty(){applied=null;", "function markDirty(){patient=null;applied=null;")
s=s.replace("card.append(head,detail);node.append(card)", "const calculator=window.Infusion?.render(name,patient);if(calculator)detail.replaceChildren(calculator);card.append(head,detail);node.append(card)")
if 'patient={group,weight,summary:applied}' not in s:
 s=s.replace("w.value=weight.toFixed(1);", "patient={group,weight,summary:applied};w.value=weight.toFixed(1);")
s=s.replace("$('#reset').onclick=()=>{group=", "$('#reset').onclick=()=>{patient=null;group=")
assert 'patient={group,weight,summary:applied}' in s and 'detail.replaceChildren(calculator)' in s
p.write_text(s,encoding='utf-8')
p=Path(__file__).parent/'dist/index.html'
s=p.read_text(encoding='utf-8').replace('介面原型 · v0.1','開發預覽 · v0.2').replace('目前僅供操作預覽','開發預覽 · 尚未完成臨床驗收').replace('臨床公式、劑量與器材建議尚未載入；本版不產生臨床建議。','已加入兩藥的來源資料與持續輸注換算；其餘項目仍待核對。未完成院內臨床驗收。').replace('資料狀態：待提供參考來源與逐項核對','資料查閱日期：2026-10-27 · 國外參考與臺灣藥品資料分別註明').replace('<script src="app.js">','<script src="infusion.js"></script><script src="app.js">')
while '<script src="infusion.js"></script><script src="infusion.js">' in s:
 s=s.replace('<script src="infusion.js"></script><script src="infusion.js">','<script src="infusion.js">')
p.write_text(s,encoding='utf-8')
