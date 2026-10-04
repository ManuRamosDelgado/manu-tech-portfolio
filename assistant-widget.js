[Reading 102 lines from start (total: 102 lines, 0 remaining)]

(()=>{
const config=window.PORTFOLIO_ASSISTANT_CONFIG||{};
const launcher=document.getElementById("assistantLauncher");
const panel=document.getElementById("assistantPanel");
const close=document.getElementById("assistantClose");
const input=document.getElementById("assistantInput");
const send=document.getElementById("assistantSend");
const messagesEl=document.getElementById("assistantMessages");
const starters=document.getElementById("starterPrompts");
const status=document.getElementById("assistantStatus");
const history=[];

if(config.enabled===false){launcher.hidden=true;return}
launcher.hidden=false;

const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
function formatText(text){
 let safe=escapeHtml(text||"");
 safe=safe.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
 safe=safe.replace(/\n\n+/g,"</p><p>").replace(/\n/g,"<br>");
 return "<p>"+safe+"</p>";
}
function scrollBottom(){requestAnimationFrame(()=>messagesEl.scrollTop=messagesEl.scrollHeight)}
function setOpen(open){
 panel.classList.toggle("open",open);
 panel.setAttribute("aria-hidden",String(!open));
 if(open){setTimeout(()=>input.focus(),80)}
}
launcher.addEventListener("click",()=>setOpen(!panel.classList.contains("open")));
close.addEventListener("click",()=>setOpen(false));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&panel.classList.contains("open"))setOpen(false)});
if(new URLSearchParams(location.search).get("assistant")==="1")setOpen(true);

function appendUser(text){
 const article=document.createElement("article");article.className="message user-message";
 article.innerHTML='<div class="message-body"><p>'+escapeHtml(text).replace(/\n/g,"<br>")+'</p></div>';
 messagesEl.appendChild(article);scrollBottom();
}
function appendTyping(){
 const article=document.createElement("article");article.className="message assistant-message typing-message";article.id="assistantTyping";
 article.innerHTML='<div class="message-body"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
 messagesEl.appendChild(article);scrollBottom();
}
function removeTyping(){document.getElementById("assistantTyping")?.remove()}
function appendAssistant(payload){
 const article=document.createElement("article");article.className="message assistant-message";
 const body=document.createElement("div");body.className="message-body";body.innerHTML=formatText(payload.answer||"");
 if(Array.isArray(payload.fit)&&payload.fit.length){
   const fit=document.createElement("div");fit.className="fit-list";
   payload.fit.forEach(item=>{
     const row=document.createElement("div");row.className="fit-item";
     row.innerHTML='<div class="fit-top"><b>'+escapeHtml(item.requirement)+'</b><span class="fit-status '+escapeHtml(item.status)+'">'+escapeHtml(item.status)+'</span></div><p>'+escapeHtml(item.reason)+'</p>';
     fit.appendChild(row);
   }); body.appendChild(fit);
 }
 if(Array.isArray(payload.evidence)&&payload.evidence.length){
   const strip=document.createElement("div");strip.className="evidence-strip";
   payload.evidence.forEach(item=>{
     const el=item.url?document.createElement("a"):document.createElement("span");
     el.textContent=item.label;
     if(item.url){el.href=item.url}
     strip.appendChild(el);
   });body.appendChild(strip);
 }
 if(payload.degraded){
   const note=document.createElement("div");note.className="degraded-note";note.textContent="Respuesta esencial: el motor conversacional completo no está disponible en este momento.";body.appendChild(note);
 }
 article.appendChild(body);messagesEl.appendChild(article);
 if(Array.isArray(payload.suggestions)&&payload.suggestions.length){
   const wrap=document.createElement("div");wrap.className="suggestion-prompts";
   payload.suggestions.forEach(text=>{
     const button=document.createElement("button");button.type="button";button.textContent=text;button.addEventListener("click",()=>submit(text));wrap.appendChild(button);
   });messagesEl.appendChild(wrap);
 }
 scrollBottom();
}
function autoResize(){input.style.height="auto";input.style.height=Math.min(input.scrollHeight,150)+"px"}
input.addEventListener("input",autoResize);
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit()}});
send.addEventListener("click",()=>submit());
starters?.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>submit(btn.textContent)));

async function submit(preset){
 const text=String(preset||input.value).trim();if(!text||send.disabled)return;
 starters?.remove();
 input.value="";autoResize();appendUser(text);history.push({role:"user",content:text});
 if(history.length>18)history.splice(0,history.length-18);
 send.disabled=true;status.textContent="Pensando";appendTyping();
 try{
   const res=await fetch(config.endpoint,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:history})});
   const data=await res.json();
   const payload=data.fallback||data;
   removeTyping();appendAssistant(payload);
   history.push({role:"assistant",content:payload.answer||""});
   if(history.length>18)history.splice(0,history.length-18);
   status.textContent=data.degraded||data.fallback?"Modo esencial":"Disponible";
 }catch(err){
   removeTyping();appendAssistant({answer:"Ahora mismo no puedo mantener una conversación fiable. Prefiero no improvisar. Puedes seguir explorando el portfolio y volver a intentarlo en unos minutos.",evidence:[],suggestions:[],fit:null,degraded:true});
   status.textContent="No disponible";
 }finally{send.disabled=false;input.focus()}
}
if(new URLSearchParams(location.search).has("open")) setOpen(true);
})();

[executed on device: DESKTOP-9HBEEB9 (427cf2d9-4d61-4b75-9707-549c3e4bd079)]