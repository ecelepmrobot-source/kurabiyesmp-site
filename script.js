const SERVER_IP="stank-usher.tun.ply.gg";
document.querySelectorAll("[data-copy-ip]").forEach(btn=>{
  btn.addEventListener("click",async()=>{
    try{await navigator.clipboard.writeText(SERVER_IP)}
    catch(e){
      const x=document.createElement("textarea");x.value=SERVER_IP;document.body.appendChild(x);x.select();document.execCommand("copy");x.remove();
    }
    const toast=document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),1800);
  });
});
const sections=[...document.querySelectorAll("main section[id]")];
const links=[...document.querySelectorAll("nav a")];
window.addEventListener("scroll",()=>{
  let current="home";
  sections.forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});
  links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+current));
});