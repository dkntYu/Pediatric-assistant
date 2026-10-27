const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('./.qa/node_modules/jsdom');
const html=fs.readFileSync('dist/index.html','utf8'),dom=new JSDOM(html,{runScripts:'outside-only',url:'https://example.test/'}),w=dom.window,d=w.document;
for(const [,f] of html.matchAll(/<script src="([^"]+)"/g))w.eval(fs.readFileSync('dist/'+f,'utf8'));
assert.equal(d.querySelector('#search'),null);
for(let i=0;i<4;i++)d.getElementById('tab-'+i).click();
const p={group:'child',weight:10,ageMonths:48,summary:'test'};
for(const name of ['維持輸液','輸液補充／快速輸注','缺損與持續流失補充']){
 const box=w.ClinicalUI.render(name,p),choice=box.querySelector('.fluid-choice');assert.ok(choice);assert.equal(choice.closest('details'),null);assert.ok(choice.querySelector('details a').href.startsWith('https://www.rch.org.au/'));
}
assert.match(w.ClinicalUI.render('維持輸液',p).querySelector('.fluid-choice>p').textContent,/D5NS/);
const neo={...p,group:'neonate',birthWeeks:38,postnatalDays:0};
assert.match(w.ClinicalUI.render('維持輸液',neo).querySelector('.fluid-choice').textContent,/出生體重 >1.5 kg/);
assert.match(w.ClinicalUI.render('維持輸液',{...neo,group:'preterm',birthWeeks:32}).querySelector('.fluid-choice>p').textContent,/不套用/);
assert.equal(w.ClinicalUI.render('維持輸液',null).querySelector('.fluid-choice'),null);
console.log('PASS: no search, tab navigation, visible fluid types, source links and neonatal scope. DOM only.');dom.window.close();
