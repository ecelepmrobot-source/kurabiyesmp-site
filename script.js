const SERVER_IP="stank-usher.tun.ply.gg";
function copyIp(){
  navigator.clipboard.writeText(SERVER_IP);
  const t=document.getElementById("toast");
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1600);
}