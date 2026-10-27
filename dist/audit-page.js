(function(){
 const A=ResuscitationAudit,D=ClinicalData,labels={review:'待人工檢視',context:'來源可追溯／有情境限制',matched:'指定來源數值相符',excluded:'非IV模式，介面不顯示'};
 const make=(t,text)=>{const e=document.createElement(t);e.textContent=text;return e};
 document.getElementById('scope').textContent=A.scope+' · 比對日期 '+A.date;
 function render(){const area=document.getElementById('audit-results');area.replaceChildren();let entries=[];for(const [name,d]of Object.entries(D.drugs))for(const m of d.modes)if(A.modes[m.id])entries.push({name,m,a:A.modes[m.id]});entries.sort((a,b)=>(a.m.id==='amio'?-1:a.a.status==='review'?0:1)-(b.m.id==='amio'?-1:b.a.status==='review'?0:1));
  for(const {name,m,a}of entries){if(document.getElementById('audit-filter').value==='review'&&a.status!=='review')continue;const card=make('article','');card.dataset.status=a.status;card.append(make('small',labels[a.status]),make('h2',name),make('h3',m.title),make('p',m.min+(m.min===m.max?'':'–'+m.max)+' '+m.unit+(m.cap?'；原上限 '+m.cap+' '+m.unit.split('/')[0]:'')));card.lastChild.className='current-value';card.append(make('p',a.note));const ul=make('ul','');for(const id of a.refs){const [title,url]=A.sources[id],li=make('li',''),link=make('a',title);link.href=url;link.target='_blank';link.rel='noopener noreferrer';li.append(link);ul.append(li)}card.append(ul);area.append(card)}
 }document.getElementById('audit-filter').onchange=render;render();
})();
