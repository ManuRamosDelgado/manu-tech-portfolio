
const qaTarget=new URLSearchParams(location.search).get("qaTarget");
if(qaTarget){document.documentElement.classList.add("qa-static");window.addEventListener("load",()=>setTimeout(()=>document.getElementById(qaTarget)?.scrollIntoView({block:"start"}),150));}
[Reading 58 lines from start (total: 58 lines, 0 remaining)]

if(new URLSearchParams(location.search).has("qa")) document.documentElement.classList.add("qa-static");
[Reading 53 lines from start (total: 53 lines, 0 remaining)]

const overlay=document.getElementById("quickOverlay");
const openQuick=()=>{
  overlay?.classList.add("open");
  overlay?.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
  document.getElementById("quickClose")?.focus();
};
const closeQuick=()=>{
  overlay?.classList.remove("open");
  overlay?.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
};
["quickOpen","quickOpen2"].forEach(id=>document.getElementById(id)?.addEventListener("click",openQuick));
document.getElementById("quickClose")?.addEventListener("click",closeQuick);
document.getElementById("quickEvidence")?.addEventListener("click",closeQuick);
overlay?.addEventListener("click",event=>{if(event.target===overlay)closeQuick()});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&overlay?.classList.contains("open"))closeQuick()});

const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!reduced&&"IntersectionObserver" in window){
  const targets=[
    ...document.querySelectorAll(".manifesto-line"),
    ...document.querySelectorAll(".capability-index article"),
    ...document.querySelectorAll(".project-feature,.project-card"),
    ...document.querySelectorAll(".timeline article"),
    ...document.querySelectorAll(".ai-box")
  ];
  targets.forEach((el,index)=>{
    el.classList.add("reveal");
    el.style.transitionDelay=((index%4)*55)+"ms";
  });
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:"0px 0px -4% 0px"});
  targets.forEach(el=>observer.observe(el));
}

if(!reduced){
  document.querySelectorAll(".project-image").forEach(frame=>{
    frame.addEventListener("pointermove",event=>{
      const rect=frame.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width;
      const y=(event.clientY-rect.top)/rect.height;
      frame.style.setProperty("--mx",(x*100).toFixed(1)+"%");
      frame.style.setProperty("--my",(y*100).toFixed(1)+"%");
    });
  });
}

[executed on device: DESKTOP-TIUFLCM (ec4efb57-c0c6-4110-be3b-6f25de69e3ac)]

[executed on device: DESKTOP-TIUFLCM (ec4efb57-c0c6-4110-be3b-6f25de69e3ac)]