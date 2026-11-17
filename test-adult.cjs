const assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('./dist/adult-data.js'),C=require('./dist/adult-core.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const base={line:'central',diluent:'D5W'};
const mil={...base,id:'milrinone',recipeId:'mil-50',stock:1,dose:0.5,weight:70,renal:'normal'};
const vaso={...base,id:'vasopressin',recipeId:'vaso-20',stock:20,dose:0.03};
const iso={...base,id:'isoproterenol',recipeId:'iso-50',stock:0.2,dose:5};
// Independent arithmetic examples, including minutes/hours and mg/micrograms.
near(C.calculate(mil).rate,10.5);near(C.calculate(mil).concentration,200);
near(C.calculate(vaso).rate,1.8);near(C.calculate({...vaso,recipeId:'vaso-40'}).rate,1.8);
near(C.calculate(iso).rate,7.5);near(C.calculate({...iso,dose:0.5}).rate,0.75);
near(C.calculate({...mil,diluent:'0.9% NaCl'}).rate,10.5);
for(const d of D.drugs){
  for(const r of d.recipes){
    assert.ok(r.volume<=50);const p=C.recipe(d.id,r.id);
    near(p.stockVolume+p.diluentVolume,r.volume);
    near(p.stockVolume*d.stock,r.amount);
    const valid={...base,id:d.id,recipeId:r.id,stock:d.stock,dose:d.min,weight:70,renal:'normal'};
    assert.ok(C.calculate(valid).rate>0);assert.ok(C.calculate({...valid,dose:d.max}).rate>0);
    for(const value of [NaN,Infinity,0,-1,d.min-0.0001,d.max+0.0001])assert.throws(()=>C.calculate({...valid,dose:value}));
    for(const value of [NaN,0,d.stock*10])assert.throws(()=>C.calculate({...valid,stock:value}));
    assert.throws(()=>C.calculate({...valid,recipeId:'custom-51'}));
    assert.throws(()=>C.calculate({...valid,line:'peripheral'}));
  }
  for(const source of d.sources)assert.ok(/^https:\/\//.test(D.sources[source].url));
}
for(const renal of ['',undefined,'unknown','impaired'])assert.throws(()=>C.calculate({...mil,renal}));
for(const weight of [undefined,NaN,0,-1,301,Infinity])assert.throws(()=>C.calculate({...mil,weight}));
near(C.calculate({...iso,weight:NaN}).rate,7.5);near(C.calculate({...vaso,weight:NaN}).rate,1.8);
assert.throws(()=>C.calculate({...iso,diluent:'0.9% NaCl'}));

const {JSDOM}=require('./.qa/node_modules/jsdom');
const html=fs.readFileSync('dist/index.html','utf8');
const dom=new JSDOM(html,{runScripts:'outside-only',url:'http://localhost/'}),w=dom.window,d=w.document;
for(const [,file] of html.matchAll(/<script src="([^"]+)"/g))w.eval(fs.readFileSync('dist/'+file,'utf8'));
assert.equal(d.querySelectorAll('.adult-drug').length,5);
d.getElementById('population-adult').click();assert.equal(d.getElementById('population-child-panel').hidden,true);
assert.equal(d.getElementById('population-adult-panel').hidden,false);
const set=(id,value)=>{d.getElementById(id).value=value;};
const form=id=>d.querySelector('#adult-'+id+' form');
const result=id=>d.querySelector('#adult-'+id+' .adult-result');
const submit=id=>form(id).dispatchEvent(new w.Event('submit',{cancelable:true}));
set('weight','10');set('adult-milrinone-stock','1');set('adult-milrinone-dose','0.5');set('adult-milrinone-renal','normal');set('adult-milrinone-line','central');
submit('milrinone');assert.match(result('milrinone').textContent,/成人體重/); // Never inherits the child's 10 kg.
set('adult-milrinone-weight','70');submit('milrinone');assert.match(result('milrinone').textContent,/10.5 mL\/hr/);
set('adult-milrinone-weight','80');d.getElementById('adult-milrinone-weight').dispatchEvent(new w.Event('input',{bubbles:true}));
assert.equal(result('milrinone').textContent,'');assert.equal(d.querySelector('#adult-milrinone table'),null);
submit('milrinone');assert.match(result('milrinone').textContent,/12 mL\/hr/);
set('adult-milrinone-renal','impaired');d.getElementById('adult-milrinone-renal').dispatchEvent(new w.Event('change',{bubbles:true}));
assert.equal(result('milrinone').textContent,'');submit('milrinone');assert.match(result('milrinone').textContent,/停止換算/);
for(const [id,stock,dose,expected] of [['vasopressin','20','0.03','1.8'],['isoproterenol','0.2','5','7.5']]){
  set('adult-'+id+'-stock',stock);set('adult-'+id+'-dose',dose);set('adult-'+id+'-line','central');submit(id);
  assert.ok(result(id).textContent.includes(expected+' mL/hr'));
  assert.equal(d.querySelectorAll('#adult-'+id+' table').length,1);
}
set('adult-vasopressin-recipe','vaso-40');d.getElementById('adult-vasopressin-recipe').dispatchEvent(new w.Event('change',{bubbles:true}));
assert.equal(result('vasopressin').textContent,'');assert.match(d.querySelector('#adult-vasopressin .adult-recipe').textContent,/38 mL.*40 mL/);
assert.equal(d.getElementById('adult-isoproterenol-diluent').options.length,1);
d.getElementById('population-child').click();assert.equal(d.getElementById('population-adult-panel').hidden,true);
assert.equal(d.getElementById('weight').value,'10');assert.equal(d.querySelectorAll('[id]').length,new Set([...d.querySelectorAll('[id]')].map(n=>n.id)).size);
assert.ok(d.querySelectorAll('#population-adult-panel a[href^="https://"]').length>=6);
dom.window.close();
console.log('PASS: adult preparation mass/volume, mcg/mg and minute/hour calculations, dose boundaries, renal/stock/line/diluent blocks, independent patient data, invalidation, recipe switching and panel isolation. DOM only.');
