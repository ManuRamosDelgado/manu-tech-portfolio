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

if(!launcher||!panel||!input||!send||!messagesEl)return;
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
  if(open)setTimeout(()=>input.focus(),80);
}

launcher.addEventListener("click",()=>setOpen(!panel.classList.contains("open")));
close.addEventListener("click",()=>setOpen(false));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&panel.classList.contains("open"))setOpen(false)});
if(new URLSearchParams(location.search).get("assistant")==="1")setOpen(true);

function appendUser(text){
  const article=document.createElement("article");
  article.className="message user-message";
  article.innerHTML='<div class="message-body"><p>'+escapeHtml(text).replace(/\n/g,"<br>")+'</p></div>';
  messagesEl.appendChild(article);
  scrollBottom();
}

function appendTyping(){
  const article=document.createElement("article");
  article.className="message assistant-message typing-message";
  article.id="assistantTyping";
  article.innerHTML='<div class="message-body"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
  messagesEl.appendChild(article);
  scrollBottom();
}

function removeTyping(){document.getElementById("assistantTyping")?.remove()}

function conversationSummary(){
  return history.slice(-10).map(m=>(m.role==="user"?"Visitante":"Asistente")+": "+m.content).join("\n\n").slice(0,4800);
}

function appendContactOffer(){
  if(document.getElementById("assistantContactCard"))return;
  const card=document.createElement("section");
  card.className="assistant-contact-card";
  card.id="assistantContactCard";
  card.innerHTML=
    '<span class="contact-card-kicker">CONTACTO</span>'+
    '<h3>¿Quieres que Manu reciba tus datos?</h3>'+
    '<p>Puedo enviarle un resumen de esta conversación junto con tus datos de contacto. Solo lo haré cuando tú lo confirmes.</p>'+
    '<div class="contact-card-actions">'+
    '<button type="button" class="contact-primary" id="assistantContactStart">Enviar mis datos a Manu</button>'+
    '<a class="contact-secondary" href="mailto:'+escapeHtml(config.publicEmail||"")+'">Escribir directamente</a>'+
    '</div>';
  messagesEl.appendChild(card);
  document.getElementById("assistantContactStart")?.addEventListener("click",showContactForm);
  scrollBottom();
}

function showContactForm(){
  const card=document.getElementById("assistantContactCard");
  if(!card)return;
  card.innerHTML=
    '<span class="contact-card-kicker">ENVIAR A MANU</span>'+
    '<h3>Déjale tus datos</h3>'+
    '<form class="assistant-contact-form" id="assistantContactForm">'+
    '<label>Nombre<input name="name" required maxlength="120" autocomplete="name"></label>'+
    '<label>Empresa <small>opcional</small><input name="company" maxlength="160" autocomplete="organization"></label>'+
    '<label>Email<input name="email" type="email" required maxlength="180" autocomplete="email"></label>'+
    '<label>Teléfono <small>opcional</small><input name="phone" maxlength="60" autocomplete="tel"></label>'+
    '<label>Mensaje<textarea name="message" required maxlength="4000" rows="3">Me gustaría hablar con Manu sobre una posible oportunidad.</textarea></label>'+
    '<label class="consent-row"><input name="consent" type="checkbox" required><span>Confirmo que quiero enviar estos datos y un resumen de esta conversación a Manu.</span></label>'+
    '<button type="submit" class="contact-primary">Enviar información</button>'+
    '<div class="contact-form-status" id="contactFormStatus"></div>'+
    '</form>';
  document.getElementById("assistantContactForm")?.addEventListener("submit",submitContact);
  scrollBottom();
}

async function submitContact(event){
  event.preventDefault();
  const form=event.currentTarget;
  const formStatus=document.getElementById("contactFormStatus");
  const button=form.querySelector('button[type="submit"]');
  const data=new FormData(form);
  const payload={
    name:String(data.get("name")||"").trim(),
    company:String(data.get("company")||"").trim(),
    email:String(data.get("email")||"").trim(),
    phone:String(data.get("phone")||"").trim(),
    message:String(data.get("message")||"").trim(),
    conversationSummary:conversationSummary(),
    consent:data.get("consent")==="on"
  };
  if(!payload.consent){formStatus.textContent="Necesito tu confirmación antes de enviar.";return}
  button.disabled=true;
  formStatus.textContent="Enviando…";
  try{
    const endpoint=config.contactEndpoint||(config.endpoint?config.endpoint.replace(/\/v1\/chat(?:\?.*)?$/,"/v1/contact"):"");
    if(!endpoint)throw new Error("contact_endpoint_missing");
    const res=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
    const body=await res.json().catch(()=>({}));
    if(!res.ok)throw Object.assign(new Error(body.error||"contact_failed"),{body});
    form.innerHTML='<div class="contact-success"><b>Enviado.</b><p>Manu recibirá un correo con tus datos y el contexto de la conversación.</p></div>';
  }catch(err){
    const email=err?.body?.fallback?.email||config.publicEmail||"";
    const phone=err?.body?.fallback?.phone||config.publicPhone||"";
    formStatus.innerHTML='No he podido enviar el correo automáticamente. '+(email?'<a href="mailto:'+escapeHtml(email)+'">Escribir a Manu</a>':"")+(phone?' · <a href="tel:'+escapeHtml(phone.replace(/\s+/g,""))+'">Llamar</a>':"");
    button.disabled=false;
  }
  scrollBottom();
}

function appendAssistant(payload){
  const article=document.createElement("article");
  article.className="message assistant-message";
  const body=document.createElement("div");
  body.className="message-body";
  body.innerHTML=formatText(payload.answer||"");

  if(Array.isArray(payload.fit)&&payload.fit.length){
    const fit=document.createElement("div");
    fit.className="fit-list";
    payload.fit.forEach(item=>{
      const row=document.createElement("div");
      row.className="fit-item";
      row.innerHTML='<div class="fit-top"><b>'+escapeHtml(item.requirement)+'</b><span class="fit-status '+escapeHtml(item.status)+'">'+escapeHtml(item.status)+'</span></div><p>'+escapeHtml(item.reason)+'</p>';
      fit.appendChild(row);
    });
    body.appendChild(fit);
  }

  if(Array.isArray(payload.evidence)&&payload.evidence.length){
    const strip=document.createElement("div");
    strip.className="evidence-strip";
    payload.evidence.forEach(item=>{
      const el=item.url?document.createElement("a"):document.createElement("span");
      el.textContent=item.label;
      if(item.url)el.href=item.url;
      strip.appendChild(el);
    });
    body.appendChild(strip);
  }

  if(payload.degraded){
    const note=document.createElement("div");
    note.className="degraded-note";
    note.textContent="Respuesta esencial: el motor conversacional completo no está disponible en este momento.";
    body.appendChild(note);
  }

  article.appendChild(body);
  messagesEl.appendChild(article);

  if(Array.isArray(payload.suggestions)&&payload.suggestions.length){
    const wrap=document.createElement("div");
    wrap.className="suggestion-prompts";
    payload.suggestions.forEach(text=>{
      const button=document.createElement("button");
      button.type="button";
      button.textContent=text;
      button.addEventListener("click",()=>submit(text));
      wrap.appendChild(button);
    });
    messagesEl.appendChild(wrap);
  }

  if(payload.contact_offer)appendContactOffer();
  scrollBottom();
}

function autoResize(){
  input.style.height="auto";
  input.style.height=Math.min(input.scrollHeight,150)+"px";
}

input.addEventListener("input",autoResize);
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit()}});
send.addEventListener("click",()=>submit());
starters?.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>submit(btn.textContent)));

async function submit(preset){
  const text=String(preset||input.value).trim();
  if(!text||send.disabled)return;
  starters?.remove();
  input.value="";
  autoResize();
  appendUser(text);
  history.push({role:"user",content:text});
  if(history.length>18)history.splice(0,history.length-18);
  send.disabled=true;
  status.textContent="Pensando";
  appendTyping();

  try{
    const res=await fetch(config.endpoint,{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({messages:history})
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok)throw Object.assign(new Error(data.error||"assistant_failed"),{body:data});
    removeTyping();
    appendAssistant(data);
    history.push({role:"assistant",content:data.answer||""});
    if(history.length>18)history.splice(0,history.length-18);
    status.textContent=data.degraded?"Modo esencial":"Disponible";
  }catch(err){
    removeTyping();
    appendAssistant({
      answer:"Ahora mismo no puedo mantener una conversación fiable. Prefiero no improvisar. Puedes contactar directamente con Manu o volver a intentarlo en unos minutos.",
      evidence:[],
      suggestions:[],
      fit:null,
      degraded:true,
      contact_offer:true
    });
    status.textContent="No disponible";
  }finally{
    send.disabled=false;
    input.focus();
  }
}
})();