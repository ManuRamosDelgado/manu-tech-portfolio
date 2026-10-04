(()=>{
const params=new URLSearchParams(location.search);
if(params.has("qa")) document.documentElement.classList.add("qa-static");

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

function heroEntrance(){
  if(reduced)return;
  const items=[
    ...document.querySelectorAll(".hero-main > *"),
    ...document.querySelectorAll(".principles-head,.principles li,.principles-foot")
  ];
  items.forEach((el,index)=>{
    el.classList.add("motion-item","motion-hero");
    el.style.setProperty("--motion-delay",Math.min(index*70,560)+"ms");
  });
  requestAnimationFrame(()=>requestAnimationFrame(()=>items.forEach(el=>el.classList.add("in-view"))));
}

function initScrollMotion(){
  if(reduced||!("IntersectionObserver" in window))return;

  const groups=[
    ".section-label",
    ".section-intro h2",
    ".section-intro p",
    ".section-head h2",
    ".section-head > p",
    ".manifesto-line",
    ".capability-index article",
    ".project-feature",
    ".project-card",
    ".other-work",
    ".timeline article",
    ".ai-box",
    ".closing > *",
    ".page-hero > *",
    ".case-card",
    ".public-metric",
    ".thinking",
    ".arch",
    "[data-reveal]"
  ];

  const targets=[...new Set(groups.flatMap(selector=>[...document.querySelectorAll(selector)]))];
  targets.forEach((el,index)=>{
    el.classList.add("motion-item");
    const localIndex=[...el.parentElement?.children||[]].indexOf(el);
    el.style.setProperty("--motion-delay",Math.max(0,Math.min(localIndex,5))*70+"ms");
    if(index%3===1)el.classList.add("motion-soft");
  });

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:"0px 0px -8% 0px"});

  targets.forEach(el=>observer.observe(el));
}

function initProjectMotion(){
  if(reduced)return;

  document.querySelectorAll(".project-image").forEach(frame=>{
    frame.addEventListener("pointermove",event=>{
      const rect=frame.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      frame.style.setProperty("--tilt-x",(x*2.4).toFixed(2)+"deg");
      frame.style.setProperty("--tilt-y",(y*-2.0).toFixed(2)+"deg");
      frame.style.setProperty("--glow-x",((x+.5)*100).toFixed(1)+"%");
      frame.style.setProperty("--glow-y",((y+.5)*100).toFixed(1)+"%");
    });
    frame.addEventListener("pointerleave",()=>{
      frame.style.setProperty("--tilt-x","0deg");
      frame.style.setProperty("--tilt-y","0deg");
    });
  });

  let ticking=false;
  const updateParallax=()=>{
    ticking=false;
    const viewport=window.innerHeight;
    document.querySelectorAll(".project-image img").forEach(img=>{
      const rect=img.parentElement.getBoundingClientRect();
      if(rect.bottom<0||rect.top>viewport)return;
      const progress=(rect.top+rect.height/2-viewport/2)/viewport;
      img.style.setProperty("--parallax",Math.max(-8,Math.min(8,progress*-10)).toFixed(2)+"px");
    });
  };
  window.addEventListener("scroll",()=>{
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(updateParallax);
  },{passive:true});
  updateParallax();
}

function initHeader(){
  let last=0;
  const header=document.querySelector(".site-header");
  if(!header)return;
  const update=()=>{
    const y=window.scrollY;
    header.classList.toggle("scrolled",y>18);
    header.classList.toggle("compact",y>last&&y>220);
    if(y<last-8)header.classList.remove("compact");
    last=y;
  };
  window.addEventListener("scroll",update,{passive:true});
  update();
}

heroEntrance();
initScrollMotion();
initProjectMotion();
initHeader();

const qaTarget=params.get("qaTarget");
if(qaTarget){
  document.documentElement.classList.add("qa-static");
  window.addEventListener("load",()=>setTimeout(()=>document.getElementById(qaTarget)?.scrollIntoView({block:"start"}),180));
}
})();