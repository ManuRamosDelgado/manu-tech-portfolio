const overlay=document.getElementById("quickOverlay");
const openQuick=()=>{overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");document.getElementById("quickClose")?.focus()};
const closeQuick=()=>{overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")};
["quickOpen","quickOpen2"].forEach(id=>document.getElementById(id)?.addEventListener("click",openQuick));
document.getElementById("quickClose")?.addEventListener("click",closeQuick);
overlay?.addEventListener("click",e=>{if(e.target===overlay)closeQuick()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay?.classList.contains("open"))closeQuick()});
document.getElementById("quickEvidence")?.addEventListener("click",closeQuick);

const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!reduced&&"IntersectionObserver"in window){
  const items=[...document.querySelectorAll(".story-block,.capability,.evidence-row,.timeline article,.ai-panel")];
  items.forEach((el,i)=>{el.classList.add("reveal");el.style.transitionDelay=((i%4)*55)+"ms"});
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}
    });
  },{threshold:.12});
  items.forEach(el=>observer.observe(el));
}

if(!reduced){
  const wb=document.querySelector(".workbench");
  wb?.addEventListener("pointermove",e=>{
    const r=wb.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*5;
    const y=((e.clientY-r.top)/r.height-.5)*5;
    wb.style.transform="perspective(1200px) rotateX("+(-y)+"deg) rotateY("+x+"deg)";
  });
  wb?.addEventListener("pointerleave",()=>{wb.style.transform=""});
}
