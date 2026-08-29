const IP="stank-usher.tun.ply.gg";
const SUPABASE_URL="https://xtczchawyexaxyvucpkk.supabase.co";
const SUPABASE_KEY="sb_publishable_Qfg-nOubiFTRBrKfgUnmIA_etGLHmu-";

const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const toast=$("#toast");

function showToast(message){
  if(!toast) return;
  toast.textContent=message;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1800);
}

/* IP copy */
$$(".copy").forEach(btn=>{
  btn.addEventListener("click",()=>{
    navigator.clipboard?.writeText(IP)
      .then(()=>showToast("Sunucu IP adresi kopyalandı."))
      .catch(()=>prompt("Sunucu IP adresini kopyala:",IP));
  });
});

/* Mobile menu */
const menu=$("#menu");
const nav=$("#nav");
if(menu && nav){
  menu.addEventListener("click",()=>nav.classList.toggle("open"));
  $$("a",nav).forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
}

/* Header scroll */
const header=$(".header");
addEventListener("scroll",()=>{
  if(header) header.classList.toggle("scrolled",scrollY>40);
});

/* Scroll animations, but never leave the page invisible if JS fails */
try{
  if("IntersectionObserver" in window){
    document.body.classList.add("js-animate");
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:"0px 0px -25px 0px"});

    $$(".reveal").forEach(el=>io.observe(el));

    /* Hero must be visible immediately */
    $$("#home .reveal").forEach(el=>el.classList.add("in"));
  }
}catch(err){
  console.warn("Animation fallback:",err);
  document.body.classList.remove("js-animate");
}

/* Discord placeholder */
const discord=$("#discord");
if(discord){
  discord.addEventListener("click",()=>{
    alert("Discord davet bağlantısını eklediğimizde bu buton doğrudan sunucuya yönlendirecek.");
  });
}

/* Minecraft server status */
async function updateServerStatus(){
  const s=$("#serverStatus"),p=$("#pulse"),st=$("#state"),
        pc=$("#players"),f=$("#fill"),os=$("#onlineStat");
  if(!s||!p||!st||!pc||!f||!os) return;

  try{
    const r=await fetch(`https://api.mcsrvstat.us/3/${IP}`,{cache:"no-store"});
    const d=await r.json();

    if(d.online){
      const online=d.players?.online ?? 0;
      const max=d.players?.max ?? 0;
      s.textContent=`Sunucu çevrimiçi • ${online} oyuncu`;
      p.className="online";
      st.textContent="ÇEVRİMİÇİ";
      pc.textContent=`${online} / ${max || "?"}`;
      os.textContent=online;
      f.style.width=max?`${Math.min(100,online/max*100)}%`:"0%";
    }else{
      s.textContent="Sunucu şu anda çevrimdışı";
      p.className="offline";
      st.textContent="ÇEVRİMDIŞI";
      pc.textContent="0 / —";
      os.textContent="0";
      f.style.width="0%";
    }
  }catch(err){
    s.textContent="Canlı durum alınamadı";
    st.textContent="DURUM BİLİNMİYOR";
  }
}
updateServerStatus();
setInterval(updateServerStatus,60000);

/* Account UI styles */
const extraStyle=document.createElement("style");
extraStyle.textContent=`
.account-btn{border:1px solid #3a414d;color:#fff;background:#171c24;border-radius:9px;padding:11px 15px;font-size:11px;font-weight:900;cursor:pointer;white-space:nowrap}
.account-btn.admin{border-color:#704a1c;color:#f5a33b}
.auth-backdrop{position:fixed;inset:0;background:rgba(4,7,11,.82);backdrop-filter:blur(9px);z-index:1000;display:none;align-items:center;justify-content:center;padding:18px}
.auth-backdrop.open{display:flex}
.auth-box{width:min(460px,100%);max-height:88vh;overflow:auto;background:#151a22;border:1px solid #303742;border-radius:18px;padding:25px;box-shadow:0 30px 90px rgba(0,0,0,.5);color:#fff}
.auth-head{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:20px}
.auth-head h3{font-size:25px;margin:0}.auth-close{width:38px;height:38px;border:1px solid #303742;background:#1e242d;color:#fff;border-radius:9px;font-size:20px;cursor:pointer}
.auth-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px}
.auth-tab{border:1px solid #323946;background:#1a2029;color:#909aa7;border-radius:9px;padding:11px;font-weight:900;font-size:11px;cursor:pointer}
.auth-tab.active{background:#f39a2c;color:#17120c;border-color:#f39a2c}
.auth-form{display:grid;gap:12px}.auth-form label{font-size:10px;color:#8f98a5;font-weight:900;letter-spacing:.06em}
.auth-form input,.auth-form textarea,.auth-form select{width:100%;margin-top:6px;border:1px solid #343b47;background:#10141a;color:#fff;border-radius:9px;padding:12px;outline:none;font:inherit}
.auth-form textarea{min-height:120px;resize:vertical}.auth-form input:focus,.auth-form textarea:focus,.auth-form select:focus{border-color:#f39a2c}
.auth-submit{border:0;background:linear-gradient(135deg,#ffb24d,#ec8214);color:#17120d;border-radius:9px;padding:13px;font-size:11px;font-weight:950;cursor:pointer}
.auth-note{color:#7f8995;font-size:11px;line-height:1.55;margin:12px 0 0}.auth-error{color:#ff8585;font-size:11px;min-height:16px}
.account-panel{display:grid;gap:12px}.account-email{padding:12px;background:#10141a;border:1px solid #2d3440;border-radius:9px;color:#aab2bd;font-size:12px}
.admin-link{border:1px solid #704a1c;background:#251b10;color:#f4a13a;border-radius:9px;padding:12px;font-weight:950;font-size:11px;cursor:pointer}
.logout-btn{border:1px solid #343b47;background:#1b2028;color:#ddd;border-radius:9px;padding:12px;font-weight:900;font-size:11px;cursor:pointer}
.admin-news-list{display:grid;gap:9px;margin-top:18px}.admin-news-item{border:1px solid #2e3540;background:#10141a;border-radius:10px;padding:12px;display:grid;grid-template-columns:1fr auto;gap:10px}
.admin-news-item h4{margin:0 0 4px;font-size:13px}.admin-news-item small{color:#7f8995}.admin-news-actions{display:flex;gap:6px}.admin-news-actions button{border:1px solid #39414d;background:#202630;color:#fff;border-radius:7px;padding:7px 9px;font-size:9px;font-weight:900;cursor:pointer}.admin-news-actions .delete{color:#ff8f8f}
.news-empty{grid-column:1/-1;padding:28px;border:1px dashed #d1d6dc;border-radius:14px;text-align:center;color:#7f8792;background:#fff}
@media(max-width:980px){.account-btn{position:absolute;right:92px}.header .join{display:none}}
@media(max-width:620px){.account-btn{right:88px;padding:9px 10px;font-size:9px}.auth-box{padding:19px}.brand b{font-size:13px}}
`;
document.head.appendChild(extraStyle);

function escapeHtml(v=""){
  return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function formatDate(date){
  return new Intl.DateTimeFormat("tr-TR",{day:"numeric",month:"long",year:"numeric"})
    .format(new Date(date)).toLocaleUpperCase("tr-TR");
}
function humanAuthError(message=""){
  const m=message.toLowerCase();
  if(m.includes("invalid login")) return "E-posta veya şifre yanlış.";
  if(m.includes("email not confirmed")) return "Önce e-posta adresini doğrulaman gerekiyor.";
  if(m.includes("already registered")) return "Bu e-posta ile zaten bir hesap var.";
  if(m.includes("password")) return "Şifre en az 6 karakter olmalı.";
  return "İşlem tamamlanamadı: "+message;
}

let sb=null,currentUser=null,isAdmin=false;

/* Create account button only if header exists */
const accountButton=document.createElement("button");
accountButton.className="account-btn";
accountButton.textContent="GİRİŞ YAP";
if(header) header.appendChild(accountButton);

const modal=document.createElement("div");
modal.className="auth-backdrop";
modal.innerHTML=`
<div class="auth-box">
  <div class="auth-head">
    <div><span class="label">KURABİYESMP HESABI</span><h3 id="authTitle">Giriş Yap</h3></div>
    <button class="auth-close" id="authClose">×</button>
  </div>
  <div id="authContent"></div>
</div>`;
document.body.appendChild(modal);

const authContent=$("#authContent");
const authTitle=$("#authTitle");
$("#authClose")?.addEventListener("click",()=>modal.classList.remove("open"));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});

function updateAccountButton(){
  if(!accountButton) return;
  if(!currentUser){
    accountButton.textContent="GİRİŞ YAP";
    accountButton.classList.remove("admin");
  }else if(isAdmin){
    accountButton.textContent="YÖNETİM";
    accountButton.classList.add("admin");
  }else{
    accountButton.textContent="HESABIM";
    accountButton.classList.remove("admin");
  }
}

async function refreshRole(){
  isAdmin=false;
  if(!currentUser||!sb) return;
  const {data,error}=await sb.from("profiles").select("role").eq("id",currentUser.id).maybeSingle();
  if(!error) isAdmin=data?.role==="admin";
  updateAccountButton();
}

function openAuth(mode="login"){
  modal.classList.add("open");
  currentUser ? renderAccount() : renderAuth(mode);
}
accountButton.addEventListener("click",()=>openAuth());

function renderAuth(mode="login"){
  const signup=mode==="signup";
  authTitle.textContent=signup?"Hesap Oluştur":"Giriş Yap";
  authContent.innerHTML=`
  <div class="auth-tabs">
    <button class="auth-tab ${!signup?"active":""}" id="loginTab">GİRİŞ YAP</button>
    <button class="auth-tab ${signup?"active":""}" id="signupTab">HESAP OLUŞTUR</button>
  </div>
  <form class="auth-form" id="authForm">
    <label>E-POSTA<input id="authEmail" type="email" autocomplete="email" required></label>
    <label>ŞİFRE<input id="authPassword" type="password" autocomplete="${signup?"new-password":"current-password"}" minlength="6" required></label>
    <div class="auth-error" id="authError"></div>
    <button class="auth-submit" type="submit">${signup?"HESAP OLUŞTUR":"GİRİŞ YAP"}</button>
  </form>
  <p class="auth-note">${signup?"Hesap oluşturduktan sonra e-posta doğrulaması istenebilir.":"KurabiyeSMP hesabınla giriş yap."}</p>`;

  $("#loginTab")?.addEventListener("click",()=>renderAuth("login"));
  $("#signupTab")?.addEventListener("click",()=>renderAuth("signup"));

  $("#authForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!sb) return;
    const email=$("#authEmail").value.trim();
    const password=$("#authPassword").value;
    const err=$("#authError");
    err.textContent="";
    try{
      if(signup){
        const {data,error}=await sb.auth.signUp({email,password});
        if(error) throw error;
        if(data.session){
          currentUser=data.user;
          await refreshRole();
          renderAccount();
          showToast("Hesabın oluşturuldu.");
        }else{
          err.textContent="Hesap oluşturuldu. E-postana gelen doğrulama bağlantısını aç.";
        }
      }else{
        const {data,error}=await sb.auth.signInWithPassword({email,password});
        if(error) throw error;
        currentUser=data.user;
        await refreshRole();
        modal.classList.remove("open");
        showToast("Giriş yapıldı.");
      }
    }catch(error){
      err.textContent=humanAuthError(error.message);
    }
  });
}

function renderAccount(){
  authTitle.textContent=isAdmin?"Yönetici Hesabı":"Hesabım";
  authContent.innerHTML=`
  <div class="account-panel">
    <div class="account-email">${escapeHtml(currentUser?.email||"")}</div>
    ${isAdmin?'<button class="admin-link" id="openAdmin">YÖNETİM PANELİNİ AÇ</button>':""}
    <button class="logout-btn" id="logoutBtn">ÇIKIŞ YAP</button>
  </div>`;

  $("#openAdmin")?.addEventListener("click",()=>renderAdmin());
  $("#logoutBtn")?.addEventListener("click",async()=>{
    await sb?.auth.signOut();
    currentUser=null;isAdmin=false;
    updateAccountButton();
    modal.classList.remove("open");
    showToast("Çıkış yapıldı.");
  });
}

function renderAdmin(editItem=null){
  if(!isAdmin||!sb) return;
  authTitle.textContent=editItem?"Haberi Düzenle":"Yönetim Paneli";
  authContent.innerHTML=`
  <form class="auth-form" id="newsForm">
    <label>BAŞLIK<input id="newsTitle" maxlength="120" required value="${escapeHtml(editItem?.title||"")}"></label>
    <label>KATEGORİ<select id="newsCategory">
      ${["DUYURU","SURVIVAL","ETKİNLİKLER","GÜNCELLEME"].map(x=>`<option ${editItem?.category===x?"selected":""}>${x}</option>`).join("")}
    </select></label>
    <label>HABER METNİ<textarea id="newsContent" maxlength="1000" required>${escapeHtml(editItem?.content||"")}</textarea></label>
    <div class="auth-error" id="newsError"></div>
    <button class="auth-submit" type="submit">${editItem?"DEĞİŞİKLİKLERİ KAYDET":"HABERİ YAYINLA"}</button>
  </form>
  <div class="admin-news-list" id="adminNewsList"></div>`;

  $("#newsForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    const title=$("#newsTitle").value.trim();
    const category=$("#newsCategory").value;
    const content=$("#newsContent").value.trim();
    const err=$("#newsError");
    try{
      const result=editItem
        ? await sb.from("news").update({title,category,content}).eq("id",editItem.id)
        : await sb.from("news").insert({title,category,content,created_by:currentUser.id});
      if(result.error) throw result.error;
      showToast(editItem?"Haber güncellendi.":"Haber yayınlandı.");
      await loadNews();
      renderAdmin();
    }catch(error){
      err.textContent="Haber kaydedilemedi: "+error.message;
    }
  });

  loadAdminNews();
}

async function loadAdminNews(){
  const list=$("#adminNewsList");
  if(!list||!sb) return;
  const {data,error}=await sb.from("news").select("*").order("published_at",{ascending:false});
  if(error){
    list.innerHTML='<div class="auth-error">Haberler yüklenemedi.</div>';
    return;
  }

  list.innerHTML=(data||[]).map(n=>`
  <div class="admin-news-item">
    <div><h4>${escapeHtml(n.title)}</h4><small>${escapeHtml(n.category)} • ${formatDate(n.published_at)}</small></div>
    <div class="admin-news-actions">
      <button data-edit="${n.id}">DÜZENLE</button>
      <button class="delete" data-delete="${n.id}">SİL</button>
    </div>
  </div>`).join("") || '<div class="auth-note">Henüz haber yok.</div>';

  $$("[data-edit]",list).forEach(btn=>btn.addEventListener("click",()=>{
    const item=data.find(x=>String(x.id)===btn.dataset.edit);
    if(item) renderAdmin(item);
  }));

  $$("[data-delete]",list).forEach(btn=>btn.addEventListener("click",async()=>{
    if(!confirm("Bu haberi silmek istediğine emin misin?")) return;
    const {error}=await sb.from("news").delete().eq("id",btn.dataset.delete);
    if(error){showToast("Haber silinemedi.");return;}
    showToast("Haber silindi.");
    await loadNews();
    renderAdmin();
  }));
}

async function loadNews(){
  if(!sb) return;
  const grid=$("#news .newsgrid");
  if(!grid) return;

  const {data,error}=await sb.from("news").select("*").order("published_at",{ascending:false}).limit(3);
  if(error){
    console.warn("News load error:",error);
    return; /* Keep the existing sample news if Supabase cannot load */
  }

  if(!data||!data.length){
    /* Do not blank the section. Keep the existing sample cards until first real news is published. */
    return;
  }

  grid.innerHTML=data.map((n,i)=>{
    if(i===0){
      return `<article class="feature reveal in">
        <div class="art city"><i></i><i></i><i></i><i></i><i></i><span>${escapeHtml(n.category)}</span></div>
        <div class="body"><small>${formatDate(n.published_at)}</small><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.content)}</p></div>
      </article>`;
    }
    const miniClass=n.category==="SURVIVAL"?"survival":"event";
    return `<article class="smallcard reveal in">
      <div class="mini ${miniClass}"></div>
      <div class="body"><small>${escapeHtml(n.category)} • ${formatDate(n.published_at)}</small><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.content)}</p></div>
    </article>`;
  }).join("");
}

function loadSupabaseLibrary(){
  return new Promise((resolve,reject)=>{
    if(window.supabase) return resolve();
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.onload=resolve;
    s.onerror=()=>reject(new Error("Supabase kütüphanesi yüklenemedi."));
    document.head.appendChild(s);
  });
}

(async()=>{
  try{
    await loadSupabaseLibrary();
    sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

    const {data:{session}}=await sb.auth.getSession();
    currentUser=session?.user||null;
    if(currentUser) await refreshRole();
    else updateAccountButton();

    sb.auth.onAuthStateChange(async(_event,session)=>{
      currentUser=session?.user||null;
      if(currentUser) await refreshRole();
      else{
        isAdmin=false;
        updateAccountButton();
      }
    });

    await loadNews();
  }catch(error){
    console.error("Supabase init:",error);
    updateAccountButton();
    showToast("Hesap sistemi yüklenemedi.");
  }
})();
