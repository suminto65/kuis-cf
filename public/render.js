const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const unesc=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
function rich(s){return esc(s).replace(/\$\$([^$]+)\$\$|\$([^$]+)\$/g,(m,a,b)=>{try{return katex.renderToString(unesc(a||b),{throwOnError:false,displayMode:!!a})}catch(e){return m}}).replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>')}
const kop=t=>`<div class=kop><img src="/logo.png" alt="Logo"><div><p class=m>Bimbingan Belajar Matematika SUMINTO</p><h2>${esc(t)}</h2></div></div>`;
const ansText=x=>x.type==='us'?x.answer:[].concat(x.answer).map(n=>'ABCDE'[n]).join(',');
function mountQuiz(el,quiz){
 clearInterval(window._qt);const qs=quiz.questions;let done=false;
 el.innerHTML=kop(quiz.title)+`<p class=m>${qs.length} soal • ${quiz.duration?'waktu '+quiz.duration+' menit':'tanpa batas waktu'}</p><input id=nm placeholder="Nama siswa"><div id=tm></div>`+
 qs.map((x,i)=>`<div class=qc><b>${i+1}.</b> ${rich(x.q)}`+(x.type==='us'?`<input class=us data-i=${i} placeholder="Jawaban singkat">`:x.options.map((o,j)=>`<label class=op><input type=${x.type==='cb'?'checkbox':'radio'} name=q${i} value=${j}> ${'ABCDE'[j]}. ${rich(o)}</label>`).join(''))+`</div>`).join('')+
 `<button class=pri id=sb>Kirim Jawaban</button><div id=rs></div>`;
 const finish=()=>{if(done)return;done=true;clearInterval(window._qt);let s=0;
  qs.forEach((x,i)=>{let ok=false;const c=el.querySelectorAll('.qc')[i];
   if(x.type==='us'){const v=c.querySelector('.us').value.trim().toLowerCase();ok=!!v&&String(x.answer).split('|').some(a=>a.trim().toLowerCase()===v)}
   else{ok=[...c.querySelectorAll(':checked')].map(n=>+n.value).sort().join()===[].concat(x.answer).map(Number).sort().join()}
   if(ok)s++;c.classList.add(ok?'ok':'no');
   c.insertAdjacentHTML('beforeend',`<div class=key>${ok?'✔ Benar':'✘ Salah'} — Kunci: ${x.type==='us'?rich(String(x.answer).split('|')[0]):ansText(x)}</div>`)});
  el.querySelector('#rs').innerHTML=`<h3>Skor: ${Math.round(s/qs.length*100)} (${s}/${qs.length} benar)</h3>`;
  el.querySelectorAll('input').forEach(i=>i.disabled=true);el.querySelector('#sb').hidden=true};
 el.querySelector('#sb').onclick=finish;
 if(quiz.duration){let left=quiz.duration*60;const tm=el.querySelector('#tm');
  const tick=()=>{tm.textContent='⏱ '+Math.floor(left/60)+':'+String(left%60).padStart(2,'0');if(left--<=0)finish()};tick();window._qt=setInterval(tick,1000)}
}
