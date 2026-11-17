const assert=require('node:assert/strict'),fs=require('node:fs');
const {JSDOM}=require('./.qa/node_modules/jsdom');
const html=fs.readFileSync('dist/index.html','utf8');
for(const mobile of [true,false]){
 const dom=new JSDOM(html,{runScripts:'outside-only',url:'http://localhost/'}),w=dom.window,d=w.document;
 let scrolls=0;w.matchMedia=()=>({matches:mobile});w.HTMLElement.prototype.scrollIntoView=function(){assert.equal(this.id,'lookup');scrolls++};
 for(const [,file]of html.matchAll(/<script src="([^"]+)"/g))w.eval(fs.readFileSync('dist/'+file,'utf8'));
 assert.equal(d.querySelector('.edit-patient').getAttribute('href'),'#patient');
 assert.ok(d.querySelector('.lookup-nav #tabs'));assert.ok(d.querySelector('.lookup-nav #favorites'));
 d.querySelector('#years').value='4';const weight=d.querySelector('#weight');weight.value='10';weight.focus();
 d.querySelector('#patient-form').dispatchEvent(new w.Event('submit',{cancelable:true}));
 assert.match(d.querySelector('#summary').textContent,/10.0 kg/);
 assert.equal(scrolls,mobile?1:0);if(mobile)assert.notEqual(d.activeElement,weight);
 d.querySelector('#tab-2').click();assert.equal(scrolls,mobile?2:0);
 assert.equal(d.querySelectorAll('#tabs [role=tab][tabindex="0"]').length,1);
 assert.equal(d.activeElement.id,'tab-2');
 d.activeElement.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
 assert.equal(d.activeElement.id,'tab-3');assert.equal(d.querySelector('#results').getAttribute('aria-labelledby'),'tab-3');
 weight.value='20';weight.dispatchEvent(new w.Event('input',{bubbles:true}));
 assert.match(d.querySelector('#summary').textContent,/重新套用/);
 assert.ok(!d.querySelector('#summary').classList.contains('ready'));
 dom.window.close();
}
console.log('PASS: mobile apply blurs input and navigates to results, desktop retains position, tabs restore focus, keyboard navigation and dirty-input invalidation. Simulated DOM; no device/layout validation.');
