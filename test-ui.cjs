const assert=require('node:assert/strict'),fs=require('node:fs');
const {JSDOM}=require('./.qa/node_modules/jsdom');
const html=fs.readFileSync('./dist/index.html','utf8');
const dom=new JSDOM(html,{runScripts:'outside-only',url:'http://localhost/'}),w=dom.window,doc=w.document;
for(const [,file]of html.matchAll(/<script src="([^"]+)"/g))w.eval(fs.readFileSync('./dist/'+file,'utf8'));
const change=n=>n.dispatchEvent(new w.Event('change',{bubbles:true}));
const set=(id,val)=>{doc.getElementById(id).value=val};
const submit=f=>f.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
const expand=name=>{const card=[...doc.querySelectorAll('.card')].find(n=>n.querySelector('.card-title').textContent===name);assert.ok(card,name);assert.equal(card.querySelector('.detail').hidden,false);return card.querySelector('.detail')};
function fillLabel(box,prefix,value){const l=[...box.querySelectorAll('label')].find(l=>l.firstChild?.textContent.startsWith(prefix));assert.ok(l,prefix);const field=l.querySelector('input,select');assert.ok(field,prefix);field.value=value;return field}
set('years','4');set('weight','10');submit(doc.getElementById('patient-form'));assert.match(doc.getElementById('summary').textContent,/10.0 kg/);
doc.getElementById('tab-2').click();let detail=expand('Dobutamine'),choose=detail.querySelector('.mode-select');choose.value='dob';change(choose);
fillLabel(detail,'選用劑量','5');fillLabel(detail,'實際最終','800');fillLabel(detail,'實際原液','12.5');fillLabel(detail,'輸注管路','central');detail.querySelector('input[type=checkbox]').checked=true;submit(detail.querySelector('form'));
assert.match(detail.querySelector('.infusion-result').textContent,/3.75 mL\/hr/);assert.match(detail.querySelector('.infusion-result').textContent,/3.2 mL/);
fillLabel(detail,'選用劑量','6').dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal(detail.querySelector('.infusion-result').textContent,'');
set('weight','20');doc.getElementById('weight').dispatchEvent(new w.Event('input',{bubbles:true}));assert.match(doc.getElementById('summary').textContent,/重新套用/);assert.equal(doc.querySelectorAll('.infusion-result p').length,0);
submit(doc.getElementById('patient-form'));
doc.getElementById('tab-1').click();detail=expand('Propacetamol (Acetamol)');assert.equal(detail.querySelectorAll('form').length,0);assert.match(detail.textContent,/暫不啟用/);
doc.getElementById('tab-3').click();detail=expand('維持輸液');assert.match(detail.textContent,/60 mL\/hr/);assert.match(detail.textContent,/1,500 mL\/day/);
// Neonatal data has birth gestation and day of life; switch removes prior clinical results.
[...doc.querySelectorAll('#groups button')].find(b=>b.textContent.startsWith('新生兒')).click();set('gestation','38');set('days','0');set('weight','2.8');submit(doc.getElementById('patient-form'));
doc.getElementById('tab-0').click();detail=expand('氣管內管');assert.match(detail.textContent,/8.5 cm/);assert.match(detail.textContent,/9.5 cm/);
doc.getElementById('tab-3').click();detail=expand('紅血球濃厚液');fillLabel(detail,'已決定的輸注量','15');fillLabel(detail,'已決定的輸注時間','3');fillLabel(detail,'出血庫','0');detail.querySelector('input[type=checkbox]').checked=true;submit(detail.querySelector('form'));assert.match(detail.querySelector('.infusion-result').textContent,/42 mL/);assert.match(detail.querySelector('.infusion-result').textContent,/14 mL\/hr/);
// Render every listed drug across all four cohorts, and exercise all eligible mode changes.
const data=require('./dist/clinical-data.js');let modeCount=0;
for(const group of ['preterm','neonate','infant','child'])for(const [name,d]of Object.entries(data.drugs)){
 const age=group==='child'?48:group==='infant'?6:0,p={group,weight:group==='child'?10:3,ageMonths:age,birthWeeks:group==='preterm'?30:38,correctedWeeks:38,postnatalDays:0,summary:'DOM test'};
 const box=w.ClinicalUI.render(name,p);assert.ok(box,name);const select=box.querySelector('.mode-select');if(select){for(const o of [...select.options].filter(o=>o.value)){select.value=o.value;change(select);assert.ok(box.querySelector('form'),name+o.value);assert.ok(box.querySelector('input[type=checkbox]'));modeCount++}}
}
doc.getElementById('reset').click();assert.match(doc.getElementById('summary').textContent,/尚未/);assert.equal(doc.querySelectorAll('.infusion-result p').length,0);
assert.ok(!html.includes('https://'),'app shell must not require CDN');
console.log(`PASS: DOM form entry, dose/dilution output, edited-input invalidation, patient change, blocked drugs, neonatal ETT/blood, reset; ${modeCount} eligible mode/cohort render checks. Not a real-browser or layout test.`);
dom.window.close();
