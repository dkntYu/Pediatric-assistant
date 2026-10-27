const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('./.qa/node_modules/jsdom');
const html=fs.readFileSync('dist/index.html','utf8'),dom=new JSDOM(html,{runScripts:'outside-only'}),w=dom.window;
for(const [,file]of html.matchAll(/<script src="([^"]+)"/g))w.eval(fs.readFileSync('dist/'+file,'utf8'));
const p={group:'child',weight:10,ageMonths:48,summary:'4歲 · 10.0 kg'};
const visible=box=>[...box.querySelectorAll('.dose-number')].map(n=>{assert.equal(n.closest('details'),null);return n.textContent});
assert.deepEqual(visible(w.ClinicalUI.render('Ketamine',p)),['10–20 mg','5–10 mg']);
let box=w.ClinicalUI.render('Epinephrine (Bosmin)',p);assert.deepEqual(visible(box),['0.1 mg','0.1–10 μg/min']);assert.ok(![...box.querySelectorAll('.mode-select option')].some(o=>o.value==='epiIM'));
box=w.ClinicalUI.render('Dobutamine',p);assert.deepEqual(visible(box),['25–150 μg/min']);assert.match(box.querySelector('.dose-volume').textContent,/1.875–11.25 mL\/hr/);assert.match(box.querySelector('details').textContent,/2.5–15 μg\/kg\/min × 10.0 kg/);
box=w.ClinicalUI.render('Midazolam',{...p,weight:40});assert.deepEqual(visible(box),['2 mg']);assert.ok(![...box.querySelectorAll('.mode-select option')].some(o=>o.value==='midPO'));
assert.equal(w.ClinicalUI.render('Milrinone',{...p,group:'preterm',ageMonths:0}).querySelectorAll('.dose-number').length,0);
assert.equal(w.ClinicalUI.render('Propofol',{...p,group:'infant',ageMonths:3}).querySelectorAll('.dose-number').length,0);
for(const name of ['Parecoxib (Dynastat)','Dexamethasone','Ondansetron'])assert.equal(w.ClinicalData.drugs[name],undefined);
for(const group of ['preterm','neonate','infant','child'])for(const name of Object.keys(w.ClinicalData.drugs)){
 box=w.ClinicalUI.render(name,{...p,group,ageMonths:group==='child'?48:group==='infant'?6:0});visible(box);
 for(const o of box.querySelectorAll('.mode-select option'))assert.ok(!/\b(?:PO|IM|SC|IN)\b/.test(o.textContent));
}
const doc=w.document;doc.getElementById('years').value=4;doc.getElementById('weight').value=10;doc.getElementById('patient-form').dispatchEvent(new w.Event('submit',{cancelable:true}));doc.getElementById('tab-1').click();assert.ok(doc.querySelector('.dose-number'));assert.equal(doc.querySelector('.dose-number').closest('details'),null);
doc.getElementById('weight').value=20;doc.getElementById('weight').dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal(doc.querySelectorAll('.dose-number').length,0);
console.log('PASS: immediately visible IV recommendations, weight ranges, caps, recipe-based rates, hidden formulas, age exclusions, no PO/IM choices and stale-patient clearing. DOM only.');dom.window.close();
