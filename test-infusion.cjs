const assert=require('node:assert/strict');
const {calculate,profile}=require('./dist/infusion.js');
const base={name:'Isoproterenol',group:'child',weight:10,dose:0.1,stock:0.2,confirmed:true};
let r=calculate(base);assert.equal(r.rate,6);assert.equal(r.draw,2.5);assert.equal(r.diluent,47.5);
r=calculate({...base,group:'neonate',weight:3});assert.ok(Math.abs(r.rate-0.9)<1e-12);assert.equal(r.draw,2);assert.equal(r.diluent,18);
r=calculate({...base,name:'Milrinone',dose:0.5,stock:1,renal:'normal'});assert.equal(r.rate,3);assert.equal(r.draw,2);assert.equal(r.diluent,18);
for(const edit of [{dose:NaN},{weight:0},{weight:8.55},{dose:2.01},{dose:0.049},{stock:1},{confirmed:false},{group:'invalid'}])assert.throws(()=>calculate({...base,...edit}));
for(const edit of [{group:'preterm',renal:'normal'},{group:'child',renal:'impaired'},{group:'neonate',renal:'unknown'},{group:'child',renal:''}])assert.throws(()=>calculate({...base,name:'Milrinone',stock:1,dose:0.5,...edit}));
for(const group of ['preterm','neonate','infant','child']){const p=profile('Isoproterenol',group);for(const dose of [p.min,p.max]){const out=calculate({...base,group,dose});assert.ok(Math.abs(out.rate*out.concentration-out.perHour)<1e-8);assert.ok(Math.abs(out.draw*0.2*1000/out.total-out.concentration)<1e-8)}}
console.log('PASS: unit conversion, source recipes, age profiles, range boundaries, invalid inputs and renal/prematurity blocking');
