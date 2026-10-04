const focusData={
  core:{kicker:"Perfil híbrido",title:"No compito por saber una sola cosa mejor que todos.",text:"Compito por ser capaz de conectar negocio, tecnología y ejecución para hacer avanzar un problema real."},
  business:{kicker:"Negocio",title:"Entiendo el coste de que algo no funcione.",text:"Equipos, stock, horarios, costes y clientes me enseñaron a pensar en impacto real, no solo en tecnología."},
  systems:{kicker:"Sistemas",title:"Me interesa lo que pasa después del deploy.",text:"Servicios, logs, entornos, datos y dependencias forman parte del producto, no son un detalle invisible."},
  automation:{kicker:"Automatización",title:"Busco fricción que pueda desaparecer.",text:"Procesos repetitivos, tareas manuales y puntos de integración son oportunidades para ganar tiempo y consistencia."},
  ai:{kicker:"IA aplicada",title:"La IA es un multiplicador dentro del sistema.",text:"La uso para acelerar análisis, desarrollo, testing y operación, con decisiones y validación bajo control humano."},
  product:{kicker:"Producto",title:"Si no mejora la experiencia, no basta con que funcione.",text:"Pienso en utilidad, claridad, adopción y resultado para la persona que terminará usando la solución."}
};
const focusCard=document.getElementById("focusCard");
document.querySelectorAll("[data-focus]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const key=btn.dataset.focus,d=focusData[key];if(!d)return;
    document.querySelectorAll(".orbit-node").forEach(n=>n.classList.remove("active"));
    if(btn.classList.contains("orbit-node"))btn.classList.add("active");
    focusCard.innerHTML='<span class="focus-kicker">'+d.kicker+'</span><h2>'+d.title+'</h2><p>'+d.text+'</p>';
  });
});
const overlay=document.getElementById("recruiterOverlay");
const openOverlay=()=>{overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");document.getElementById("recruiterClose").focus()};
const closeOverlay=()=>{overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")};
["recruiterOpen","recruiterOpen2"].forEach(id=>document.getElementById(id)?.addEventListener("click",openOverlay));
document.getElementById("recruiterClose")?.addEventListener("click",closeOverlay);
overlay?.addEventListener("click",e=>{if(e.target===overlay)closeOverlay()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay?.classList.contains("open"))closeOverlay()});
document.getElementById("recruiterEvidence")?.addEventListener("click",closeOverlay);
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!reduce&&"IntersectionObserver"in window){
  const targets=[...document.querySelectorAll(".impact-card,.cap-map article,.evidence-card,.career-flow article,.rail-step")];
  targets.forEach((el,i)=>{el.classList.add("reveal");el.style.transitionDelay=(i%4)*55+"ms"});
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});
  targets.forEach(el=>io.observe(el));
}
