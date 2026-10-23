/* =====================================================
   PAGE SWITCHING (your original code, with 2 small
   additions marked "NEW")
   ===================================================== */
var pages=["home","about","skills","projects","certifications","contact"];
var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function show(id,push){
  if(pages.indexOf(id)<0)id="home";
  pages.forEach(function(p){document.getElementById(p).classList.toggle("on",p===id)});
  document.querySelectorAll("nav button").forEach(function(b){
    if(b.dataset.go===id)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
  });
  if(push){try{location.hash=id}catch(e){}}
  window.scrollTo(0,0);
  updateScroll();                 // NEW: reset the progress bar
  if(id==="about")runCounters();  // NEW: start counters when About opens
}

document.addEventListener("click",function(e){
  var t=e.target.closest("[data-go]");
  if(t)show(t.dataset.go,true);
  var c=e.target.closest(".copy");   // NEW: copy buttons
  if(c)copyText(c);
});
window.addEventListener("hashchange",function(){show(location.hash.slice(1),false)});


/* =====================================================
   INTERACTION 1: TYPING EFFECT (Home page)
   Types a role, pauses, deletes it, then types the next.
   ===================================================== */
var roles=["Computer Science student","Python & Java learner","Web developer in the making","Problem solver"];
var typed=document.getElementById("typed");
var roleIndex=0,charIndex=roles[0].length,deleting=true;

function typeLoop(){
  var word=roles[roleIndex];
  if(!deleting){
    charIndex++;
    typed.textContent=word.slice(0,charIndex);
    if(charIndex===word.length){deleting=true;setTimeout(typeLoop,1600);return}
    setTimeout(typeLoop,80);
  }else{
    charIndex--;
    typed.textContent=word.slice(0,charIndex);
    if(charIndex===0){deleting=false;roleIndex=(roleIndex+1)%roles.length;setTimeout(typeLoop,350);return}
    setTimeout(typeLoop,40);
  }
}
if(!reduce)setTimeout(typeLoop,1800);   // starts by deleting the first role


/* =====================================================
   INTERACTION 2: DARK / LIGHT THEME TOGGLE
   Remembers your choice using localStorage.
   ===================================================== */
var root=document.documentElement;
var themeBtn=document.getElementById("themeBtn");

function isDark(){
  if(root.dataset.theme)return root.dataset.theme==="dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function paintThemeBtn(){
  var dark=isDark();
  themeBtn.textContent=dark?"☀":"☾";
  themeBtn.setAttribute("aria-label",dark?"Switch to light theme":"Switch to dark theme");
  themeBtn.title=dark?"Switch to light theme":"Switch to dark theme";
}
try{var savedTheme=localStorage.getItem("theme");if(savedTheme)root.dataset.theme=savedTheme}catch(e){}
themeBtn.addEventListener("click",function(){
  var next=isDark()?"light":"dark";
  root.dataset.theme=next;
  try{localStorage.setItem("theme",next)}catch(e){}
  paintThemeBtn();
});
paintThemeBtn();


/* =====================================================
   INTERACTION 3: SCROLL PROGRESS BAR + BACK-TO-TOP
   ===================================================== */
var progress=document.getElementById("progress");
var toTop=document.getElementById("toTop");

function updateScroll(){
  var max=document.documentElement.scrollHeight-window.innerHeight;
  var y=window.scrollY;
  progress.style.transform="scaleX("+(max>0?Math.min(y/max,1):0)+")";
  toTop.classList.toggle("show",y>400);
}
window.addEventListener("scroll",updateScroll,{passive:true});
window.addEventListener("resize",updateScroll);
toTop.addEventListener("click",function(){
  window.scrollTo({top:0,behavior:reduce?"auto":"smooth"});
});


/* =====================================================
   INTERACTION 4: ANIMATED COUNTERS (About page)
   Numbers count up from 0 each time About is opened.
   ===================================================== */
function runCounters(){
  document.querySelectorAll("[data-count]").forEach(function(el){
    var end=parseFloat(el.dataset.count);
    var decimals=parseInt(el.dataset.dec||"0",10);
    var suffix=el.dataset.suffix||"";
    var run=(el._run=(el._run||0)+1);   // cancels an older animation on the same number

    if(reduce){el.textContent=end.toFixed(decimals)+suffix;return}

    var start=null,duration=1200;
    function step(ts){
      if(el._run!==run)return;
      if(start===null)start=ts;
      var t=Math.min((ts-start)/duration,1);
      var eased=1-Math.pow(1-t,3);              // starts fast, slows down
      el.textContent=(end*eased).toFixed(decimals)+suffix;
      if(t<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}


/* =====================================================
   INTERACTION 5: CERTIFICATION FILTER
   Show All / Coursera / NPTEL with a live count.
   ===================================================== */
var filterBtns=document.querySelectorAll(".filters button");
var certCards=document.querySelectorAll(".cert");
var certCount=document.getElementById("certCount");

filterBtns.forEach(function(btn){
  btn.addEventListener("click",function(){
    var filter=btn.dataset.filter,shown=0;
    filterBtns.forEach(function(b){b.setAttribute("aria-pressed",b===btn?"true":"false")});
    certCards.forEach(function(card){
      var match=filter==="all"||card.dataset.org===filter;
      card.hidden=!match;
      if(match)shown++;
    });
    certCount.textContent="Showing "+shown+" of "+certCards.length+" certifications";
  });
});


/* =====================================================
   INTERACTION 6: CLICK-TO-COPY + TOAST MESSAGE (Contact)
   ===================================================== */
var toast=document.getElementById("toast");
var toastTimer;

function say(message){
  toast.textContent=message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){toast.classList.remove("show")},2000);
}
function fallbackCopy(text){
  var box=document.createElement("textarea");
  box.value=text;
  box.style.position="fixed";
  box.style.opacity="0";
  document.body.appendChild(box);
  box.select();
  var ok=false;
  try{ok=document.execCommand("copy")}catch(e){}
  document.body.removeChild(box);
  return ok;
}
function copyText(btn){
  var text=btn.dataset.copy,label=btn.dataset.label;
  function done(ok){
    say(ok?label+" copied to clipboard":"Could not copy. Please select the text manually.");
    if(ok){btn.textContent="Copied";setTimeout(function(){btn.textContent="Copy"},1500)}
  }
  if(navigator.clipboard&&window.isSecureContext){
    navigator.clipboard.writeText(text).then(function(){done(true)},function(){done(fallbackCopy(text))});
  }else{
    done(fallbackCopy(text));
  }
}


/* =====================================================
   START
   ===================================================== */
show(location.hash.slice(1),false);
