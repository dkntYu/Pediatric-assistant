const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),D=require('./dist/clinical-data.js'),A=require('./dist/resuscitation-audit.js'),B=require('./audit/resuscitation-baseline.json');
// The emergency modes below remain identical; unrelated drug removals are permitted.
assert.equal(Object.keys(A.modes).length,28);assert.equal(new Set(B.modes.map(m=>m.drug)).size,14);
for(const before of B.modes){const {drug,...mode}=before,current=D.drugs[drug].modes.find(m=>m.id===mode.id);assert.deepEqual(current,mode);for(const id of A.modes[mode.id].refs){assert.ok(A.sources[id]);assert.match(A.sources[id][1],/^https:\/\//)}}
const {JSDOM}=require('./.qa/node_modules/jsdom');
function load(file){const html=fs.readFileSync('dist/'+file,'utf8'),dom=new JSDOM(html,{runScripts:'outside-only',url:'http://localhost/'});for(const [,name]of html.matchAll(/<script src="([^"]+)"/g))dom.window.eval(fs.readFileSync('dist/'+name,'utf8'));return dom}
let dom=load('index.html'),w=dom.window,p={group:'child',weight:40,ageMonths:120,summary:'10歲40kg'},box=w.ClinicalUI.render('Amiodarone',p);
assert.match(box.querySelector('.audit-flag').textContent,/人工/);assert.match(box.querySelector('.dose-number').textContent,/200 mg/,'Original numeric dose retained');assert.match(box.querySelector('details').textContent,/150 mg/);assert.equal(box.querySelector('.audit-flag').closest('details'),null);
box=w.ClinicalUI.render('Dobutamine',{...p,weight:10,ageMonths:48});assert.equal(box.querySelector('.dose-number').textContent,'25–150 μg/min');
box=w.ClinicalUI.render('Propofol',p);assert.equal(box.querySelectorAll('.audit-flag,.audit-status').length,0,'Unaudited drugs must not acquire audit labels');dom.window.close();
dom=load('audit.html');const doc=dom.window.document;assert.equal(doc.querySelectorAll('#audit-results article').length,28);doc.getElementById('audit-filter').value='review';doc.getElementById('audit-filter').dispatchEvent(new dom.window.Event('change'));assert.equal(doc.querySelectorAll('article').length,Object.values(A.modes).filter(m=>m.status==='review').length);dom.window.close();
console.log('PASS: 14 drugs / 28 mode coverage, emergency mode values unchanged, source links complete, visible conflict markers, no false labels on unaudited drugs and review filter. Source interpretation is human-review material, not tested clinical truth.');
