(function(root){
'use strict';
const original=root.ClinicalUI.render;
const names=['維持輸液','輸液補充／快速輸注','缺損與持續流失補充'];
const node=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e};
root.ClinicalUI.render=function(name,p){
 const box=original(name,p);if(!box||!p||!names.includes(name))return box;
 const neo=['preterm','neonate'].includes(p.group),wrap=document.createElement('section');wrap.className='fluid-choice';
 wrap.append(node('h4','建議輸液種類 · IV'));
 let choice,condition,explanation;
 if(neo){
  condition='條件式參考：出生 >32 週、出生體重 >1.5 kg、非 NICU；目前體重不能代替出生體重確認適用性。';
  if(p.birthWeeks<=32){choice='此早產週數不套用本表';explanation='請依 NICU／早產兒專用輸液規範選擇液體種類。'}
  else if(name==='輸液補充／快速輸注'){choice='0.9% NaCl（生理食鹽水）';explanation='適用條件確認後供休克補液參考；每次輸注後重新評估。含糖維持液不作休克 bolus。'}
  else if(name==='維持輸液'){
   choice='出生前 24–48 小時：10% glucose（D10W）；其後：依場域選擇含鈉／糖液';
   explanation='RCH：急診／兒科病房第2天起可用 0.9% NaCl + 10% glucose；特殊照護嬰兒室配方不同。24–48小時為轉換評估區間，不能只按日齡自動換液或加鉀。';
  }else{choice='依流失來源及電解質個別選液';explanation='新生兒不直接套用一般兒童的流失補充或加鉀配方。需另核對流失成分、血鈉／鉀、腎功能及照護場域。'}
 }else{
  condition='一般滿1個月至18歲兒童參考；重大心／腎／肝疾病、燒傷、DKA或嚴重電解質異常另依專用規範。';
  if(name==='維持輸液'){choice='0.9% NaCl + 5% glucose（D5NS）';explanation='RCH一般維持液優先選擇。是否加鉀需先核對電解質與腎功能，不自動加入；有些病童需要限制維持量。此處未更動既有計算量。'}
  else if(name==='輸液補充／快速輸注'){choice='0.9% NaCl；替代選項：Hartmann’s／Plasma-Lyte 148';explanation='RCH列0.9% NaCl為休克補液，平衡晶體液可依病況及資深醫師建議選擇。含糖液不作休克 bolus；出血性休克另評估血品。'}
  else{choice='依流失成分選液；腸胃道持續流失常用 0.9% NaCl';explanation='補充液與維持液分開計算。RCH腸胃道流失配方可含KCl，但須先評估電解質、腎功能及實際流失量；本工具不自動加鉀，也不將此配方套用所有流失。'}
 }
 wrap.append(node('p',choice),node('small',condition));
 const details=document.createElement('details');details.className='reference-details';details.append(node('summary','液體選擇依據與適用條件'),node('p',explanation));
 const a=node('a',neo?'RCH · Neonatal intravenous fluids':'RCH · Intravenous fluids');a.href='https://www.rch.org.au/clinicalguide/guideline_index/'+(neo?'Neonatal_intravenous_fluids/':'Intravenous_fluids/');a.target='_blank';a.rel='noopener noreferrer';details.append(a,node('p','核對日期：2026-10-27。院內可用製劑及相容性須另核對。'));wrap.append(details);box.prepend(wrap);return box;
};
})(window);
