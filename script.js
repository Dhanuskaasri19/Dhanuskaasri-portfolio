var pages=["home","about","skills","projects","certifications","contact"];
function show(id,push){
  if(pages.indexOf(id)<0)id="home";
  pages.forEach(function(p){document.getElementById(p).classList.toggle("on",p===id)});
  document.querySelectorAll("nav button").forEach(function(b){
    if(b.dataset.go===id)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
  });
  if(push){try{location.hash=id}catch(e){}}
  window.scrollTo(0,0);
}
document.addEventListener("click",function(e){
  var t=e.target.closest("[data-go]");
  if(t)show(t.dataset.go,true);
});
window.addEventListener("hashchange",function(){show(location.hash.slice(1),false)});
show(location.hash.slice(1),false);
