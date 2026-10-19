/*
  CasinoValues — affichage et interactions du site.
  Les informations à changer souvent vivent dans data.js et codes.js.
  Pour ajouter une page, regarde NAV, la liste dans home et le dispatcher tout en bas.
*/
const $=id=>document.getElementById(id);
const RC={common:"var(--common)",rare:"var(--rare)",epic:"var(--epic)",legendary:"var(--legendary)",mythic:"var(--mythic)",jackpot:"var(--jackpot-c)",heavenly:"#f5e7a3",universal:"var(--universal)"};
const ph=el=>{if(el.id==="dpI"){el.style.opacity=.08;return}const p=document.createElement("div");p.className="ph";p.textContent=(el.alt||"?").replace(/[^A-Za-zÀ-ÿ0-9 ]/g,"").split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase()||"?";el.replaceWith(p)};
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const fv=v=>{if(v==null)return"N/A";if(!isFinite(v))return"INF";if(v>=1e6)return(v/1e6%1===0?v/1e6:(v/1e6).toFixed(1))+"M";if(v>=1000)return(v/1000%1===0?v/1000:(v/1000).toFixed(1))+"K";return String(v)};
const money=n=>n.toLocaleString("fr-FR");
const glc=r=>r==="jackpot"?"cj":r==="heavenly"?"ch":r==="universal"?"cu":"";
const tH=t=>!t?"":t==="up"?'<span class="trend up">↑ Hausse</span>':t==="down"?'<span class="trend down">↓ Baisse</span>':'<span class="trend flat">→ Stable</span>';
const dH=d=>{if(!d)return"";let h="";for(let i=1;i<=5;i++)h+='<div class="dd '+(i<=d?(d>=4?"hi":d>=2?"med":"low"):"")+'"></div>';return'<div class="d-bar" title="Demande '+d+'/5">'+h+"</div>"};
const stockH=it=>it.s==="o"?'<span class="stock o">Rupture de stock</span>':it.s==="u"?'<span class="stock u">Stock illimité</span>':`<span class="stock l">${it.s} restant${it.s>1?"s":""}</span>`;
let tTimer;const toast=m=>{const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(tTimer);tTimer=setTimeout(()=>t.classList.remove("show"),2400)};
const DCP="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z";
const DC=(s,c)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${c}"><path d="${DCP}"/></svg>`;
const LOOP='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';
const NAV=[
  ["index","Accueil"],
  ["values","Value List"],
  ["shop","Boutique"],
  ["battlepass","Battlepass"],
  ["calculator","Calculateur"],
  ["attacks","Attaques"],
  ["souls","Âmes"],
  ["codes","Codes"]
];
const LINK="https://discord.gg/j6rCqxNNgg";

function shell(){
  const p=document.body.dataset.page;
  document.body.innerHTML=`<div class="atmos"></div><div class="noise"></div><div id="toast"></div>
<div class="overlay" id="ov"></div>
<div class="detail-panel" id="dp"><div class="dp-header"><span class="badge" id="dpB">—</span><button class="dp-close" id="dpX">✕</button></div><img class="dp-img" id="dpI" src="" alt="" onerror="ph(this)"><div class="dp-body"><div class="dp-name" id="dpN"></div><div class="dp-desc" id="dpD"></div><div class="dp-stats" id="dpS"></div></div></div>
<div class="modal-bg" id="mbg"><div class="modal"><div class="modal-title">Ajouter un objet</div><div class="modal-search-wrap">${LOOP}<input class="modal-search" id="msr" type="text" placeholder="Rechercher un objet…"></div><div class="modal-list" id="mlist"></div><button class="modal-close" id="mx">Fermer</button></div></div>
<button class="totop" id="totop" aria-label="Haut de page">↑</button><div class="nav-wrap"><nav class="nav"><div style="display:flex;align-items:center;gap:26px"><a class="logo" href="index.html"><div class="logo-mark">🎰</div>Casino<em>Values</em><span class="logo-tag">BETA</span></a><div class="nav-links">${NAV.map(([f,l])=>`<a class="nav-link${f==p?" active":""}" href="${f}.html">${l}</a>`).join("")}</div></div>
<div class="nav-right">${["values","shop","attacks","souls","codes"].includes(p)?`<div class="search-box">${LOOP}<input class="search" id="searchInput" type="text" placeholder="Rechercher…  ( / )"></div>`:""}<a class="disc-btn" href="${LINK}" target="_blank" rel="noopener noreferrer">${DC(15,"currentColor")}Discord</a></div></nav></div>
<div class="shell"><div class="page" id="page"></div><footer style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px"><div><div class="footer-brand">CasinoValues</div><div>Codé et produit par Maël (@offwhite3943) · Officiel</div></div><a href="${LINK}" target="_blank" rel="noopener noreferrer">Discord</a></footer></div>`;
  $("dpX").onclick=$("ov").onclick=closeDetail;
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeDetail()}else if(e.key==="/"&&!/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)){const s=$("searchInput");if(s){e.preventDefault();s.focus()}}});addEventListener("scroll",()=>$("totop").classList.toggle("on",scrollY>600),{passive:true});$("totop").onclick=()=>scrollTo({top:0,behavior:"smooth"});
}
const hookSearch=fn=>{const i=$("searchInput");if(i)i.oninput=()=>fn(i.value)};

/* ---------- ACCUEIL ---------- */
function tFaq(i){const b=$("fb"+i),c=$("fc"+i),o=b.classList.toggle("open");c.textContent=o?"−":"+";c.style.transform=o?"rotate(45deg)":""}
function home(){
  const pages=[
    ["values","Value List","Ce que vaut chaque objet et chaque pouvoir. Pour l'instant c'est encore du N/A."],
    ["shop","Boutique","Les prix, et ce qui est en rupture. Les modos gèrent les restocks à la main, donc ça peut avoir du retard."],
    ["battlepass","Battlepass","Les 40 niveaux, gratuit et premium côte à côte. Tape ton XP pour voir où tu en es."],
    ["calculator","Calculateur","Tu hésites sur un échange ? Mets ce que tu donnes et ce que tu reçois."],
    ["attacks","Attaques","Les commandes de chaque pouvoir avec leur cooldown. Un clic sur une commande la copie."],
    ["souls","Âmes","Les 8 âmes avec leur chance de tirage, leur passif et leur commande."],
    ["codes","Codes Discord","Les codes partagés sur le Discord et les récompenses associées. Copie la commande pour les utiliser."]
  ];
    $("page").className="page active";
  $("page").innerHTML=`<div class="hero"><div class="hero-eyebrow">Casino de Cubi Game</div><h1 class="hero-title">Toutes les <em>valeurs</em><br>du <span class="serif">casino</span></h1><p class="hero-sub">Les valeurs, la boutique, les pouvoirs et les codes du Discord. Une valeur te paraît bizarre ? Viens en parler avec nous.</p><div class="legend">${Object.keys(RL).map(r=>`<span class="badge ${r}">${RL[r]}</span>`).join("")}</div></div>
<div class="disc-banner"><div>${DC(30,"#7289da")}</div><div class="disc-info"><div class="disc-info-title">Rejoins le serveur Discord</div><div class="disc-info-sub">Mises à jour de valeurs · Annonces · Communauté · Giveaways</div><div class="disc-milestone">Prochain giveaway à 15 000 membres</div></div><div class="disc-prog"><div class="disc-prog-lbl">12 000 / 15 000 membres</div><div class="disc-prog-track"><div class="disc-prog-fill" style="width:75.5%"></div></div></div><a class="disc-btn" href="${LINK}" target="_blank" rel="noopener noreferrer">${DC(15,"currentColor")}Rejoindre</a></div>
<div class="fh">Les pages</div><div class="plist">${pages.map(([f,t,d])=>`<a href="${f}.html"><b>${t}</b><span>${d}</span></a>`).join("")}</div>
<div class="fh" style="margin:40px 0 14px">Questions</div><div class="faq-list">${FAQ.map((f,i)=>`<div class="faq-item"><button class="faq-btn" onclick="tFaq(${i})"><span class="faq-q">${esc(f.q)}</span><span class="faq-chevron" id="fc${i}">+</span></button><div class="faq-body" id="fb${i}">${esc(f.a)}</div></div>`).join("")}</div>`;
}

/* ---------- CARTES / DÉTAIL ---------- */
function card(it,m){
  const shop=m==="shop";
  return `<div class="card ${glc(it.r)}${shop&&it.s==="o"?" oos":""}" data-n="${esc(it.n)}" style="--rc:${RC[it.r]}"><div class="card-thumb"><img src="${it.img}" alt="${esc(it.n)}" loading="lazy" onerror="ph(this)"><div class="card-fade"></div><span class="rb"><span class="badge ${it.r}">${RL[it.r]}</span></span></div><div class="card-body"><div class="card-top"><div class="card-name">${esc(it.n)}</div></div><p class="card-desc">${esc(shop?(it.sd||it.d):it.d)}${shop&&it.x?` <b style="color:var(--tx2)">· ${esc(it.x)}</b>`:""}</p><div class="card-foot">${shop?`<span class="card-val">${money(it.p)}</span><div class="card-actions">${stockH(it)}</div>`:`<span class="card-val ${it.v==null?"na":"val "+it.r}"${it.v==null?' title="Pas encore évalué"':""}>${fv(it.v)}</span><div class="card-actions">${tH(it.trend)}${dH(it.demand)}<button class="cp-btn" data-t="${fv(it.v)}" title="Copier">⎘</button></div>`}</div></div></div>`;
}
const rowH=it=>`<div class="litem ${glc(it.r)}" data-n="${esc(it.n)}" style="--rc:${RC[it.r]}"><img class="litem-img" src="${it.img}" alt="${esc(it.n)}" onerror="ph(this)"><div class="litem-name">${esc(it.n)}</div><div class="litem-desc">${esc(it.d)}</div><div class="litem-right">${tH(it.trend)}${dH(it.demand)}<span class="badge ${it.r}">${RL[it.r]}</span><span class="litem-val ${it.v==null?"na":"val "+it.r}">${fv(it.v)}</span><button class="cp-btn" data-t="${fv(it.v)}" title="Copier">⎘</button></div></div>`;
function openDetail(it){
  const row=(l,v)=>`<div class="dp-stat"><span class="dp-sl">${l}</span><span class="dp-sv">${v}</span></div>`;
  $("dpB").className="badge "+it.r;$("dpB").textContent=RL[it.r];
  $("dp").style.setProperty("--rc",RC[it.r]);$("dpI").style.opacity=1;$("dpI").src=it.img;$("dpI").alt=it.n;$("dpN").textContent=it.n;$("dpD").textContent=it.d;
  const tc=it.trend==="up"?"var(--up)":it.trend==="down"?"var(--down)":"var(--flat2)";
  $("dpS").innerHTML=(it.p?row("Prix",money(it.p))+row("Stock",stockH(it)+(it.x?` <span style="color:var(--tx3);font-weight:400">${esc(it.x)}</span>`:"")):"")
    +`<div class="dp-stat"><span class="dp-sl">Valeur</span><span class="dp-sv ${it.v==null?"na":"val "+it.r}">${fv(it.v)}</span></div>`+row("Rareté",RL[it.r])
    +(it.trend?row("Tendance",`<span style="color:${tc}">${it.trend==="up"?"↑ Hausse":it.trend==="down"?"↓ Baisse":"→ Stable"}</span>`):"")
    +(it.demand?row("Demande",`${"★".repeat(it.demand)}${"☆".repeat(5-it.demand)} (${it.demand}/5)`):"")
    +(it.w?`<a class="pill on" style="display:block;text-align:center;margin-top:8px" href="attacks.html#${it.w}">⚔️ Voir le guide du pouvoir</a>`:"");
  $("dp").classList.add("open");$("ov").classList.add("open");
}
function closeDetail(){$("dp").classList.remove("open");$("ov").classList.remove("open")}
function wireCards(w){w.onclick=e=>{const b=e.target.closest(".cp-btn");if(b){e.stopPropagation();const t=b.dataset.t;navigator.clipboard&&navigator.clipboard.writeText(t).catch(()=>{});toast("Copié : "+t);return}const c=e.target.closest("[data-n]");if(c){const it=ITEMS.find(i=>i.n===c.dataset.n);if(it)openDetail(it)}}}

/* ---------- VALUE LIST ---------- */
function values(){
  const ST=(()=>{try{return JSON.parse(localStorage.getItem("cv-vals"))||{}}catch(e){return{}}})();let cf=ST.cf||"all",cs=ST.cs||"default",cv=ST.cv||"grid",q="";const save=()=>{try{localStorage.setItem("cv-vals",JSON.stringify({cf,cs,cv}))}catch(e){}};
  const PC={common:"rc",rare:"rr",epic:"re",legendary:"rl",mythic:"rm",jackpot:"rj",heavenly:"rh",universal:"ru"};
  $("page").className="page active";
  $("page").innerHTML=`<div class="sec-header"><div><div class="sec-title">Value List</div><div class="sec-sub">Ce que vaut chaque objet et chaque pouvoir. N/A = pas encore évalué.</div></div><span class="sec-badge" id="cnt">—</span></div>
<div class="dist">${Object.keys(RL).filter(r=>ITEMS.some(i=>i.r===r)).map(r=>`<i data-r="${r}" title="${RL[r]} : ${ITEMS.filter(i=>i.r===r).length}" style="flex:${ITEMS.filter(i=>i.r===r).length};background:${RC[r]}"></i>`).join("")}</div><div class="ctrl-bar"><div class="ctrl-pills" id="rf"><button class="pill on" data-r="all">Tous<small>${ITEMS.length}</small></button>${Object.keys(RL).map(r=>`<button class="pill ${PC[r]}" data-r="${r}">${RL[r]}<small>${ITEMS.filter(i=>i.r===r).length}</small></button>`).join("")}</div>
<div class="ctrl-right"><select class="sort-sel" id="sortSel"><option value="default">Tri : Défaut</option><option value="vd">Valeur ↓</option><option value="va">Valeur ↑</option><option value="na">Nom A→Z</option><option value="nz">Nom Z→A</option><option value="rar">Rareté</option></select><div class="view-toggle"><button class="vbtn on" id="vGrid" title="Grille">⊞</button><button class="vbtn" id="vList" title="Liste">☰</button></div></div></div><div id="wrap"></div>`;
  document.querySelectorAll("[data-r]").forEach(x=>x.classList.toggle("on",x.dataset.r===cf));$("sortSel").value=cs;$("vGrid").classList.toggle("on",cv==="grid");$("vList").classList.toggle("on",cv==="list");const nv2=it=>it.v==null?-1:!isFinite(it.v)?1e15:it.v;
  const draw=()=>{
    const lq=q.toLowerCase();
    const arr=ITEMS.filter(it=>(!lq||it.n.toLowerCase().includes(lq)||it.d.toLowerCase().includes(lq)||RL[it.r].toLowerCase().includes(lq))&&(cf==="all"||it.r===cf));
    if(cs==="vd")arr.sort((a,b)=>nv2(b)-nv2(a));else if(cs==="va")arr.sort((a,b)=>(a.v==null?1e16:nv2(a))-(b.v==null?1e16:nv2(b)));else if(cs==="na")arr.sort((a,b)=>a.n.localeCompare(b.n,"fr"));else if(cs==="nz")arr.sort((a,b)=>b.n.localeCompare(a.n,"fr"));else if(cs==="rar")arr.sort((a,b)=>RO[b.r]-RO[a.r]);
    $("cnt").textContent=arr.length+" objet"+(arr.length>1?"s":"");save();
    $("wrap").innerHTML=!arr.length?'<div class="empty">Rien de ce nom ici.</div>':cv==="grid"?'<div class="items-grid">'+arr.map(it=>card(it,"values")).join("")+"</div>":'<div class="items-list">'+arr.map(rowH).join("")+"</div>";
  };
  document.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{cf=b.dataset.r;document.querySelectorAll("[data-r]").forEach(x=>x.classList.toggle("on",x.dataset.r===cf));draw()});
  $("sortSel").onchange=e=>{cs=e.target.value;draw()};
  $("vGrid").onclick=()=>{cv="grid";$("vGrid").classList.add("on");$("vList").classList.remove("on");draw()};
  $("vList").onclick=()=>{cv="list";$("vList").classList.add("on");$("vGrid").classList.remove("on");draw()};
  hookSearch(v=>{q=v;draw()});wireCards($("wrap"));draw();
}

/* ---------- BOUTIQUE ---------- */
function shop(){
  let q="",f="all";$("page").className="page active";
  const F=[["all","Tout"],["p","Pouvoirs"],["o","Objets"],["in","En stock"]];
  $("page").innerHTML=`<div class="sec-header"><div><div class="sec-title">Boutique</div><div class="sec-sub">Pour acheter : <b>/item buy</b>. Pour les détails d'un item : <b>/item info</b>.</div></div><span class="sec-badge" id="cnt">—</span></div><div class="note-bar">Les restocks sont décidés par les modos, donc ce que tu vois ici peut avoir un peu de retard.</div><div class="ctrl-bar"><div class="ctrl-pills">${F.map(([k,l])=>`<button class="pill${k==="all"?" on":""}" data-f="${k}">${l}</button>`).join("")}</div></div><div id="wrap"></div>`;
  const draw=()=>{const a=ITEMS.filter(i=>i.p&&(!q||i.n.toLowerCase().includes(q.toLowerCase()))&&(f==="all"||(f==="p"?i.w:f==="o"?!i.w:i.s!=="o"))).sort((a,b)=>a.p-b.p);
    $("cnt").textContent=a.length+" objet"+(a.length>1?"s":"");
    $("wrap").innerHTML=a.length?'<div class="items-grid">'+a.map(it=>card(it,"shop")).join("")+"</div>":'<div class="empty">Rien de ce nom ici.</div>'};
  document.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{f=b.dataset.f;document.querySelectorAll("[data-f]").forEach(x=>x.classList.toggle("on",x===b));draw()});
  hookSearch(v=>{q=v;draw()});wireCards($("wrap"));draw();
}

/* ---------- CODES DISCORD ---------- */
function codes(){
  let q="";
  const entries=Array.isArray(DISCORD_CODES)?DISCORD_CODES:[];
  const now=new Date();
  const expiryFor=entry=>{
    if(!entry.expiresAt)return null;
    const date=new Date(entry.expiresAt+"T23:59:59");
    return Number.isNaN(date.getTime())?null:date;
  };
  const isExpired=entry=>{
    const expiry=expiryFor(entry);
    return expiry!==null&&expiry<now;
  };
  const expiryLabel=entry=>{
    if(!entry.expiresAt)return"Aucune date annoncée";
    const expiry=expiryFor(entry);
    if(!expiry)return"Date à vérifier";
    return"Expire le "+new Intl.DateTimeFormat("fr-FR",{dateStyle:"long"}).format(expiry);
  };

  $("page").className="page active";
  $("page").innerHTML=`<div class="sec-header"><div><div class="sec-title">Codes Discord</div><div class="sec-sub">Les codes partagés sur le Discord, avec leur récompense et leur date d'expiration.</div></div><span class="sec-badge" id="codeCount">0 code</span></div>
<div class="code-howto"><span class="code-howto-label">Pour utiliser un code</span><span>Dans le Discord, envoie <code>=code LE_CODE</code>. Le bouton d'une carte copie la commande complète.</span></div>
<div class="codes-list" id="codeList"></div>`;

  const draw=()=>{
    const query=q.trim().toLocaleLowerCase("fr");
    const matching=entries.filter(entry=>{
      if(!entry||!entry.code)return false;
      const text=[entry.code,entry.reward,entry.details].filter(Boolean).join(" ").toLocaleLowerCase("fr");
      return !query||text.includes(query);
    });
    $("codeCount").textContent=matching.length+" code"+(matching.length===1?"":"s");

    if(!matching.length){
      $("codeList").innerHTML=entries.length
        ?'<div class="empty code-empty">Aucun code ne correspond à cette recherche.</div>'
        :'<div class="empty code-empty"><span class="empty-icon">🎁</span><b>Aucun code pour le moment.</b><br>Les codes ajoutés dans <code>codes.js</code> apparaîtront ici.</div>';
      return;
    }

    $("codeList").innerHTML=matching.map(entry=>{
      const expired=isExpired(entry);
      const command="=code "+entry.code;
      const status=expired?'<span class="code-status expired">Expiré</span>':'<span class="code-status available">Disponible</span>';
      return `<article class="code-card${expired?" is-expired":""}">
  <div class="code-card-top">${status}<span class="code-expiry">${esc(expiryLabel(entry))}</span></div>
  <div class="code-value"><code>${esc(entry.code)}</code></div>
  <div class="code-reward"><span class="code-label">Récompense</span><p>${esc(entry.reward||"Récompense non précisée")}</p></div>
  ${entry.details?`<p class="code-details">${esc(entry.details)}</p>`:""}
  <button class="code-copy" type="button" data-command="${esc(command)}"${expired?" disabled":""}>${expired?"Code expiré":"Copier =code "+esc(entry.code)}</button>
</article>`;
    }).join("");
  };

  $("codeList").onclick=e=>{
    const button=e.target.closest(".code-copy");
    if(!button||button.disabled)return;
    const command=button.dataset.command;
    if(!navigator.clipboard){toast("Copie indisponible ici : "+command);return}
    navigator.clipboard.writeText(command)
      .then(()=>toast("Commande copiée : "+command))
      .catch(()=>toast("Copie impossible. Commande : "+command));
  };
  hookSearch(value=>{q=value;draw()});
  draw();
}

/* ---------- BATTLEPASS ---------- */
function bp(){
  let xp=0;try{xp=+localStorage.getItem("cv-bpxp")||0}catch(e){}
  const rw=s=>{if(!s)return'<span class="rw none">Rien à ce niveau</span>';
    const t=s[0],l=s.slice(2).replace(/^(\d+)–\1 coins$/,"$1 coins");let im="";
    if(t==="i"||t==="a"){const b=t==="a"?"Ticket de Loto":l.replace(/ ×\d+$/,""),it=ITEMS.find(x=>x.n===b);im=`<img src="${it?it.img:"images/"+(BPIMG[b]||b+".webp")}" alt="${esc(b)}" loading="lazy" onerror="ph(this)">`}
    return `<span class="rw k-${t}">${im}<i>${BPT[t]}</i>${esc(l)}</span>`};
  $("page").className="page active";
  $("page").innerHTML=`<div class="sec-header"><div><div class="sec-title">Battlepass</div><div class="sec-sub">Deux voies, gratuite et premium. Il manque encore les niveaux 41 à 50 et les paliers extras.</div></div><span class="sec-badge">${BP.length} niveaux</span></div>
<div class="mast" style="--acc:var(--legendary);--cc:#ffe066"><div class="mast-top"><label>Où j'en suis</label><span><input class="mast-in" id="bpIn" type="number" min="0" placeholder="0" inputmode="numeric"> <span class="cmd-cd">XP</span></span></div><div class="track" style="margin-bottom:12px"><b id="bpFill"></b></div><div class="sec-sub" id="bpTxt" style="margin:0"></div></div>
<div class="ctrl-bar"><div class="ctrl-pills">${[["b","Les deux"],["f","Gratuit"],["p","Premium"]].map(([k,l])=>`<button class="pill${k==="b"?" on":""}" data-m="${k}">${l}</button>`).join("")}</div></div>
<div class="bp show-b" id="bp"><div class="bprow head"><div class="lv">Niveau</div><div class="cell f">Gratuit</div><div class="cell p">Premium</div></div>${BP.map(([x,f,p],i)=>`<div class="bprow" data-x="${x}"><div class="lv"><b>${i+1}</b><small>${money(x)} XP</small></div><div class="cell f">${rw(f)}</div><div class="cell p">${rw(p)}</div></div>`).join("")}<div class="bprow soon"><div class="lv"><b>41-50</b></div><div class="cell">Les 10 niveaux suivants arrivent plus tard.</div></div></div>
<div class="fh" style="margin:36px 0 4px">La dernière récompense</div><p class="sec-sub">À la fin du pass tu prends AD BREAK ou My King, pas les deux.</p><div class="items-grid" id="fin">${["AD BREAK","My King"].map(n=>card(ITEMS.find(i=>i.n===n),"values")).join("")}</div>`;
  const upd=()=>{let d=0,nx=null;document.querySelectorAll(".bprow[data-x]").forEach(r=>{const ok=+r.dataset.x<=xp;r.classList.toggle("done",ok);if(ok)d++;else if(nx===null)nx=+r.dataset.x});
    $("bpFill").style.width=Math.min(xp/BP[BP.length-1][0],1)*100+"%";
    $("bpTxt").textContent=!xp?"Tape ton XP pour voir les niveaux que tu as déjà.":nx===null?"Tu as tout débloqué jusqu'au niveau "+BP.length+".":(d?"Niveau "+d+" atteint. ":"")+"Encore "+money(nx-xp)+" XP pour le niveau "+(d+1)+"."};
  const inp=$("bpIn");inp.value=xp||"";inp.oninput=()=>{xp=Math.max(0,+inp.value||0);try{localStorage.setItem("cv-bpxp",xp)}catch(e){}upd()};
  document.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{$("bp").className="bp show-"+b.dataset.m;document.querySelectorAll("[data-m]").forEach(x=>x.classList.toggle("on",x===b))});
  upd();wireCards($("fin"));
}

/* ---------- ÂMES ---------- */
const HEART="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
function souls(){
  let f="all",q="",o="default";const PC={common:"rc",rare:"rr",epic:"re",legendary:"rl",mythic:"rm"},RK=Object.keys(RL).filter(r=>SOULS.some(s=>s.r===r));
  $("page").className="page active";
  $("page").innerHTML=`<div class="sec-header"><div><div class="sec-title">Âmes</div><div class="sec-sub">Les âmes tombent au tirage, avec un pourcentage de chance chacune. Chacune a un passif automatique et une commande à lancer.</div></div><span class="sec-badge" id="cnt">—</span></div>
<div class="dist" id="dist">${SOULS.map(s=>`<i data-s="${s.id}" title="${s.n} : ${s.p} %" style="flex:${s.p};background:${s.c}"></i>`).join("")}</div>
<div class="ctrl-bar"><div class="ctrl-pills"><button class="pill on" data-r="all">Toutes<small>${SOULS.length}</small></button>${RK.map(r=>`<button class="pill ${PC[r]}" data-r="${r}">${RL[r]}<small>${SOULS.filter(s=>s.r===r).length}</small></button>`).join("")}</div><div class="ctrl-right"><select class="sort-sel" id="sortSel"><option value="default">Tri : Défaut</option><option value="hi">Les plus fréquentes</option><option value="lo">Les plus rares</option></select></div></div><div class="items-grid soulgrid" id="wrap"></div>`;
  const draw=()=>{const lq=q.toLowerCase(),a=SOULS.filter(s=>(f==="all"||s.r===f)&&(!lq||(s.n+" "+s.lore+" "+s.pas.join(" ")+" "+s.cmd.join(" ")).toLowerCase().includes(lq)));
    if(o==="hi")a.sort((x,y)=>y.p-x.p);else if(o==="lo")a.sort((x,y)=>x.p-y.p);
    $("cnt").textContent=a.length+" âme"+(a.length>1?"s":"");
    $("wrap").innerHTML=a.length?a.map(s=>`<div class="card soul" id="soul-${s.id}" style="--rc:${s.c}"><div class="card-thumb"><svg class="heart" viewBox="0 0 24 24"><path d="${HEART}"/></svg><span class="rb"><span class="badge ${s.r}">${RL[s.r]}</span></span><span class="pc"><b>${s.p}</b> % des tirages</span></div><div class="card-body"><div class="card-top"><div class="card-name">${esc(s.n)}</div></div><p class="lore">${esc(s.lore)}</p><div class="sb"><small>Passif · ${esc(s.pas[0])}</small><p>${esc(s.pas[1])}</p></div><div class="sb"><small>Commande · ${esc(s.cmd[0])}</small><span class="cmd-code" style="--cc:${s.c}">${esc(s.cmd[1])}</span><p>${esc(s.cmd[2])}</p></div></div></div>`).join(""):'<div class="empty">Rien de ce nom ici.</div>'};
  document.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{f=b.dataset.r;document.querySelectorAll("[data-r]").forEach(x=>x.classList.toggle("on",x.dataset.r===f));draw()});
  $("sortSel").onchange=e=>{o=e.target.value;draw()};
  $("dist").onclick=e=>{const i=e.target.closest("[data-s]");if(!i)return;f="all";q="";document.querySelectorAll("[data-r]").forEach(x=>x.classList.toggle("on",x.dataset.r==="all"));draw();const c=$("soul-"+i.dataset.s);c&&c.scrollIntoView({behavior:"smooth",block:"center"})};
  $("wrap").onclick=e=>{const c=e.target.closest(".cmd-code");if(c){const t=c.textContent.trim();navigator.clipboard&&navigator.clipboard.writeText(t).catch(()=>{});toast("Copié : "+t)}};
  hookSearch(v=>{q=v;draw()});draw();
}

/* ---------- CALCULATEUR (ancien style) ---------- */
function calc(){
  const MAX=9;let youArr=[],themArr=[],mTarget=null;
  $("page").className="page active";
  const side=(k,l)=>`<div class="calc-side ${k}"><div class="calc-head"><span class="calc-label"><span class="calc-dot ${k}"></span>${l}</span><span class="calc-total" id="${k}Total">0</span></div><div class="slots" id="${k}Slots"></div></div>`;
  $("page").innerHTML=`<div class="sec-header"><div><div class="sec-title">Calculateur de Trade</div><div class="sec-sub">Ce que tu donnes d'un côté, ce que tu reçois de l'autre. 9 objets maximum par côté.</div></div></div>
<div class="calc-grid">${side("you","Tu donnes")}${side("them","Tu reçois")}</div>
<div class="result" id="resultPanel"><div class="result-top"><span class="verdict fair" id="verdict">À peu près équitable</span><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="pill" id="swapBtn">⇄ Inverser</button><button class="pill" id="linkBtn">Copier le lien</button><button class="reset-btn" id="resetBtn">Vider</button></div></div>
<div class="vs-row"><div class="vs-side"><div class="vs-lbl">Tu donnes</div><div class="vs-num you" id="vsYou">0</div></div><div class="vs-sep">VS</div><div class="vs-side"><div class="vs-lbl">Tu reçois</div><div class="vs-num them" id="vsThem">0</div></div></div>
<div class="bar-track"><div class="bar-you" id="barYou" style="width:50%"></div><div class="bar-them" id="barThem" style="width:50%"></div></div><div class="bar-lbls"><span id="bpYou">50%</span><span id="bpThem">50%</span></div>
<div class="diff-row"><span class="diff-lbl">Différence de valeur</span><span class="diff-val" id="diffVal">—</span></div></div>
<div style="font-size:12px;color:var(--tx4);display:flex;gap:10px;flex-wrap:wrap;align-items:center"><span>Clique sur une case vide pour ajouter un objet, survole un objet pour l'enlever.</span></div>`;
  const nv=it=>(it.v==null||!isFinite(it.v))?0:it.v;
  const renderSlots=side=>{
    const arr=side==="you"?youArr:themArr,g=$(side+"Slots");g.innerHTML="";
    for(let i=0;i<MAX;i++){const s=document.createElement("div");
      if(i<arr.length){const it=arr[i];s.className="slot full";s.innerHTML=`<img src="${it.img}" alt="${esc(it.n)}" onerror="ph(this)"><div class="s-name">${esc(it.n)}</div><div class="s-val">${fv(it.v)}</div><button class="s-rm" data-side="${side}" data-i="${i}">✕</button>`}
      else if(i===arr.length&&arr.length<MAX){s.className="slot";s.innerHTML='<span class="s-plus">+</span><span>Ajouter</span>';s.addEventListener("click",()=>openModal(side))}
      else s.className="slot dim";
      g.appendChild(s)}
    g.querySelectorAll(".s-rm").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();(b.dataset.side==="you"?youArr:themArr).splice(+b.dataset.i,1);renderSlots(b.dataset.side);updateResult()}));
    updateResult();
  };
  function updateResult(){persist();
    const has=youArr.length>0||themArr.length>0,yInf=youArr.some(i=>i.v!=null&&!isFinite(i.v)),tInf=themArr.some(i=>i.v!=null&&!isFinite(i.v));
    const yt=youArr.reduce((a,b)=>a+nv(b),0),tt=themArr.reduce((a,b)=>a+nv(b),0),set=(id,t)=>{$(id).textContent=t};
    set("youTotal",yInf?"INF":fv(yt));set("themTotal",tInf?"INF":fv(tt));set("vsYou",yInf?"INF":fv(yt));set("vsThem",tInf?"INF":fv(tt));
    let yp=50,tp=50;
    if(!yInf&&!tInf){const tot=yt+tt;if(tot>0){yp=Math.round(yt/tot*100);tp=100-yp}}else if(yInf&&!tInf){yp=83;tp=17}else if(!yInf&&tInf){yp=17;tp=83}
    $("barYou").style.width=yp+"%";$("barThem").style.width=tp+"%";set("bpYou",yp+"%");set("bpThem",tp+"%");
    const dv=$("diffVal"),cl=(t,c)=>{dv.textContent=t;dv.style.color=c};
    if(!has)cl("—","var(--tx4)");else if(yInf&&tInf)cl("Les deux côtés ont un objet INF","var(--blue2)");else if(yInf)cl("Tu donnes un objet INF, fais attention","var(--down)");else if(tInf)cl("Tu reçois un objet INF, très bon pour toi","var(--up)");
    else{const d=yt-tt;if(d===0)cl("Échange parfaitement équilibré","var(--tx3)");else if(d>0)cl("Tu donnes "+fv(d)+" de plus","var(--down)");else cl("Tu reçois "+fv(Math.abs(d))+" de plus","var(--up)")}
    const v=$("verdict"),rp=$("resultPanel"),R=(c,t,r)=>{v.className="verdict "+c;v.textContent=t;rp.className="result"+r};
    if(!has)return R("fair","À peu près équitable","");
    if(yInf&&!tInf)R("lose","Tu y perds"," lose");else if(!yInf&&tInf)R("win","Tu y gagnes"," win");
    else if(yInf&&tInf){if(yt===tt)R("fair","À peu près équitable","");else if(yt>tt)R("lose","Tu y perds"," lose");else R("win","Tu y gagnes"," win")}
    else{const d=yt-tt,pct=(yt+tt)>0?Math.abs(d)/(yt+tt):0;if(Math.abs(d)<1||pct<.05)R("fair","À peu près équitable","");else if(d>0)R("lose","Tu y perds"," lose");else R("win","Tu y gagnes"," win")}
  }
  const renderModalList=q=>{const lq=(q||"").toLowerCase(),f=ITEMS.filter(it=>it.n.toLowerCase().includes(lq)||RL[it.r].toLowerCase().includes(lq));
    $("mlist").innerHTML=f.length?f.map(it=>`<div class="mitem" data-idx="${ITEMS.indexOf(it)}"><img src="${it.img}" alt="${esc(it.n)}" onerror="ph(this)"><div><div class="mitem-name">${esc(it.n)}</div><div class="mitem-val">${fv(it.v)}</div></div><span class="badge ${it.r}" style="margin-left:auto">${RL[it.r]}</span></div>`).join(""):'<div style="text-align:center;padding:24px;color:var(--tx4);font-size:12px">Aucun résultat</div>';
    $("mlist").querySelectorAll(".mitem").forEach(el=>el.addEventListener("click",()=>{const it=ITEMS[+el.dataset.idx],arr=mTarget==="you"?youArr:themArr;if(arr.length<MAX){arr.push(it);renderSlots(mTarget);toast(it.n+" ajouté");closeModal()}}))};
  window.openModal=side=>{mTarget=side;$("msr").value="";renderModalList("");$("mbg").classList.add("open");setTimeout(()=>$("msr").focus(),60)};
  $("mx").onclick=closeModal;$("mbg").onclick=e=>{if(e.target===$("mbg"))closeModal()};$("msr").oninput=e=>renderModalList(e.target.value);
  $("resetBtn").onclick=()=>{youArr=[];themArr=[];renderSlots("you");renderSlots("them");toast("Trade vidé")};
  $("swapBtn").onclick=()=>{[youArr,themArr]=[themArr,youArr];renderSlots("you");renderSlots("them")};
  $("linkBtn").onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(location.href).catch(()=>{});toast("Lien du trade copié")};
  const KEY="cv-trade",nm=a=>a.map(i=>i.n).join("|");
  function persist(){const s=youArr.length||themArr.length?"toi="+encodeURIComponent(nm(youArr))+"&eux="+encodeURIComponent(nm(themArr)):"";try{history.replaceState(null,"",s?"#"+s:location.pathname+location.search);localStorage.setItem(KEY,s)}catch(e){}}
  try{const p=new URLSearchParams((location.hash||"#"+(localStorage.getItem(KEY)||"")).slice(1)),g=k=>(p.get(k)||"").split("|").map(n=>ITEMS.find(i=>i.n===n)).filter(Boolean).slice(0,MAX);youArr=g("toi");themArr=g("eux")}catch(e){}
  renderSlots("you");renderSlots("them");
}
function closeModal(){$("mbg").classList.remove("open")}

/* ---------- ATTAQUES (ancien style) ---------- */
const xpH=x=>x==null?"":`<span class="cmd-xp">${x===0?"Base":typeof x==="number"?x+" XP":x}</span>`;
const renderAbility=(ab,acc,cc)=>`<div class="cmd" data-xp="${typeof ab.xp==="number"?ab.xp:0}" style="--acc:${acc};--cc:${cc}"><div class="cmd-top"><span class="cmd-code">${esc(ab.cmd)}</span>${ab.tags.join("")}${xpH(ab.xp)}<span class="cmd-cd">${esc(ab.cd)}</span></div><div class="cmd-desc">${ab.desc}</div>${ab.note?`<div class="cmd-note">${ab.note}</div>`:""}</div>`;
function selectStand(id){
  const s=STANDS.find(x=>x.id===id);if(!s)return;
  document.querySelectorAll(".stand-btn").forEach(b=>b.classList.toggle("active",b.dataset.id===id));document.title=s.name+" · CasinoValues";
  const up=s.upgrade;
  $("guideWrap").innerHTML=`<div class="guide-content" id="guide-${id}"><div class="guide-header-atk" style="background:${s.headerBg}"><div class="guide-icon-img"><img src="${s.img}" alt="${esc(s.name)}" onerror="ph(this)"></div><div><div class="guide-name">${esc(s.name)}</div><div class="guide-origin">${esc(s.origin)}</div><span class="guide-badge ${s.bc||"gb-"+s.rarity}">${RL[s.rarity]}</span></div></div>
<div class="lore-box" style="--acc:${s.acc}">${s.lore}</div>${masteryH(s)}
<div class="atk-section"><div class="atk-sec-title">Commandes</div><div class="cmd-list">${s.abilities.map(a=>renderAbility(a,s.acc,s.cc)).join("")}</div></div>
${up?`<div class="upgrade-block ub-mahoraga"><div class="upgrade-title"><img class="upgrade-title-img" src="${up.img}" alt="" onerror="this.style.display='none'">${esc(up.title)}</div><div style="font-size:12px;color:var(--tx3);margin-bottom:14px;line-height:1.7">${up.intro}</div><div class="cmd-list">${up.abilities.map(a=>renderAbility(a,up.acc,up.cc)).join("")}</div></div>`:""}</div>`;bindGuide(s);
}
const xpNums=s=>[...new Set([...s.abilities,...(s.upgrade?s.upgrade.abilities:[])].map(a=>a.xp).filter(x=>typeof x==="number"&&x>0))].sort((a,b)=>a-b);
const masteryH=s=>{const n=xpNums(s),mx=n[n.length-1]||1;return `<div class="mast" style="--acc:${s.acc};--cc:${s.cc}"><div class="mast-top"><label>Ma maîtrise</label><span><input class="mast-in" id="xpIn" type="number" min="0" placeholder="0" inputmode="numeric"> <span class="cmd-cd">XP</span></span></div><div class="track"><b id="xpFill"></b>${n.map(x=>`<i data-x="${x}" style="left:${x/mx*100}%"><span>${x}</span></i>`).join("")}</div><div class="sec-sub" id="xpTxt" style="margin:0"></div></div>`};
function bindGuide(s){
  const n=xpNums(s),mx=n[n.length-1]||1,inp=$("xpIn");let xp=0;
  try{xp=+localStorage.getItem("cv-xp-"+s.id)||0}catch(e){}
  const apply=()=>{$("xpFill").style.width=Math.min(xp/mx,1)*100+"%";document.querySelectorAll(".track i").forEach(i=>i.classList.toggle("on",xp>=+i.dataset.x));
    let k=0,t=0;document.querySelectorAll("#guideWrap .cmd").forEach(c=>{t++;const lock=+c.dataset.xp>xp,x=c.querySelector(".cmd-xp");c.classList.toggle("locked",lock);x&&x.classList.toggle("lock",lock);if(!lock)k++});
    $("xpTxt").textContent=k+" technique"+(k>1?"s":"")+" sur "+t+" accessible"+(k>1?"s":"")+" avec "+xp+" XP"};
  if(inp){inp.value=xp||"";inp.oninput=()=>{xp=Math.max(0,+inp.value||0);try{localStorage.setItem("cv-xp-"+s.id,xp)}catch(e){}apply()}}
  apply();
}
function attacks(){
  $("page").className="page active";
  $("page").innerHTML=`<div class="sec-header"><div><div class="sec-title">Attaques</div><div class="sec-sub">Les commandes de chaque pouvoir, leurs cooldowns et l'XP à avoir pour les débloquer. Clique sur une commande pour la copier.</div></div></div><div class="atk-layout"><div class="stand-picker"><div class="stand-picker-title">Pouvoirs</div><div class="stand-list" id="standList"></div></div><div id="guideWrap"><div class="atk-empty"><div class="atk-empty-title">Choisis un pouvoir</div><div class="atk-empty-sub">Clique sur un nom dans la liste pour voir ses commandes.</div></div></div></div>`;
  $("standList").innerHTML=GROUPS.map(([g,ids])=>`<div class="stand-section-label">— ${g} —</div>`+STANDS.filter(s=>ids.includes(s.id)).sort((a,b)=>RO[b.rarity]-RO[a.rarity]).map(s=>`<button class="stand-btn stand-btn--${s.rarity}" data-id="${s.id}" data-s="${esc((s.name+" "+s.origin+" "+s.abilities.concat(s.upgrade?s.upgrade.abilities:[]).map(a=>a.cmd).join(" ")).toLowerCase())}" style="--acc:${s.acc}"><div class="stand-btn-img"><img src="${s.img}" alt="${esc(s.name)}" onerror="ph(this)"></div><div class="stand-btn-info"><div class="stand-btn-name">${esc(s.name)}</div><div class="stand-btn-origin">${esc(s.origin.split("·")[0].trim())}</div></div><span class="stand-btn-badge ${s.bc||"gb-"+s.rarity}">${RL[s.rarity]}</span></button>`).join("")).join("");
  $("standList").onclick=e=>{const b=e.target.closest(".stand-btn");if(b){selectStand(b.dataset.id);history.replaceState(null,"","#"+b.dataset.id);if(innerWidth<800)$("guideWrap").scrollIntoView({behavior:"smooth",block:"start"})}};
  $("guideWrap").onclick=e=>{const c=e.target.closest(".cmd-code");if(c){const t=c.textContent.trim();navigator.clipboard&&navigator.clipboard.writeText(t).catch(()=>{});toast("Copié : "+t)}};
  const si=$("searchInput");if(si){si.placeholder="Une commande, un pouvoir…";si.onkeydown=e=>{if(e.key==="Enter"){const b=[...document.querySelectorAll(".stand-btn")].find(x=>!x.hidden);b&&b.click()}}}
  hookSearch(v=>{v=v.toLowerCase().trim();document.querySelectorAll(".stand-btn").forEach(b=>b.hidden=!!v&&!b.dataset.s.includes(v))});
  const fromHash=()=>{if(location.hash)selectStand(location.hash.slice(1))};addEventListener("hashchange",fromHash);fromHash();
}

shell();
({index:home,values,shop,battlepass:bp,calculator:calc,attacks,souls,codes})[document.body.dataset.page]();
