const j=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json'}});
const T={pg:'pilihan ganda: 4 opsi (tanpa huruf awalan), "answer" = nomor indeks opsi benar (0-3)',
cb:'pilihan ganda kompleks (checkbox): 5 opsi, 2 atau 3 jawaban benar, "answer" = array indeks benar, mis. [0,2]',
us:'uraian singkat: tanpa "options", "answer" = jawaban singkat (angka atau kata); alternatif jawaban dipisah |'};
export async function onRequestPost({request,env}){
 if(!env.ACCESS_CODE||request.headers.get('x-code')!==env.ACCESS_CODE)return j({error:'Kode akses salah'},401);
 const {text,url,type,count}=await request.json();const n=Math.min(Math.max(+count||10,1),15);
 if(!T[type])return j({error:'Tipe soal tidak dikenal'},400);
 let src=(text||'').trim();
 if(url){try{const h=await(await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}})).text();
  src+='\n'+h.replace(/<(script|style)[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')}catch(e){return j({error:'URL tidak bisa dibuka'},400)}}
 src=src.slice(0,6000);if(src.length<30)return j({error:'Materi terlalu pendek'},400);
 let r;try{r=await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast',{max_tokens:3000,temperature:0.3,messages:[
  {role:'system',content:'Kamu guru yang menyusun soal. Balas HANYA dengan JSON array, tanpa teks lain.'},
  {role:'user',content:`Materi:\n${src}\n\nBuat ${n} soal ${T[type]}. Format tiap elemen: {"q":"...","options":[...],"answer":...}. Bahasa Indonesia. Rumus matematika ditulis LaTeX di antara $...$ dan setiap garis miring terbalik DITULIS GANDA (misal \\\\frac) agar JSON valid. Teks tebal pakai **...**. Hanya gunakan informasi dari materi.`}]})}
 catch(e){return j({error:'Jatah AI gratis hari ini mungkin habis. Coba lagi besok (reset 07.00 WIB).'},503)}
 const raw=typeof r.response==='string'?r.response:JSON.stringify(r.response);
 const a=raw.slice(raw.indexOf('['),raw.lastIndexOf(']')+1);let arr;
 try{arr=JSON.parse(a)}catch{try{arr=JSON.parse(a.replace(/\\(?!["\\\/bfnrtu])/g,'\\\\'))}catch{return j({error:'AI gagal membuat format yang benar, coba lagi.'},502)}}
 const questions=arr.filter(x=>x&&x.q&&(type==='us'||x.options?.length>1)).map(x=>type==='us'?{type,q:String(x.q),answer:String(x.answer)}:
  {type,q:String(x.q),options:x.options.map(String),answer:type==='cb'?[].concat(x.answer).map(Number):Number(x.answer)});
 return questions.length?j({questions}):j({error:'Soal tidak terbentuk, coba lagi.'},502);}
