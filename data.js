/* ===== DONNÉES — v : valeur (null = N/A, Infinity = INF) · s : stock ("u" illimité, "o" rupture, nombre = restants) ===== */
const RL={common:"Commun",rare:"Rare",epic:"Épique",legendary:"Légendaire",mythic:"Mythique",jackpot:"Jackpot",heavenly:"Heavenly",universal:"Universel"};
const RO={common:0,rare:1,epic:2,legendary:3,mythic:4,jackpot:5,heavenly:6,universal:7};
/* img par défaut : images/<Nom>.webp — i = nom de fichier différent */
const ITEMS=[
{n:"Ticket de Loto",r:"common",p:5000,s:"u",x:"8/40 tickets restants",d:"Tente de gagner 500 000 ! 5 numéros entre 1 et 49 te sont attribués au hasard (envoyés en DM). 1 seul ticket par tirage."},
{n:"Ping Restock",r:"common",p:10000,s:"u",d:"Quand un restock est fait vous avez le ping directement."},
{n:"Potion Anti-Rob",r:"common",p:15000,s:"o",d:"Protège contre les vols pendant 20 minutes, quel que soit le nombre de tentatives."},
{n:"Potion Anti-Malus",r:"common",p:20000,s:1,d:"Retire un malus actif au hasard, y compris une brûlure acide White Snake."},
{n:"Ticket Famille",r:"rare",i:"LuckySpin.webp",p:35000,s:"u",d:"=reroll dans le salon reroll"},
{n:"Halloween Box",r:"rare",p:40000,s:"u",x:"9 restantes",d:"Une boîte d'Halloween pleine de surprises ! Ouvre-la avec =open pour tenter ta chance !"},
{n:"Reset Pouvoir",r:"rare",i:"remove.webp",p:100000,s:"o",d:"Utilise cet item pour retirer un de tes pouvoirs. Si tu as la famille Sukuna et 2 pouvoirs, tu choisiras lequel retirer. Le pouvoir Sukuna remet aussi tes doigts à 0."},
{n:"White Snake",r:"rare",w:"whitesnake",p:250000,s:"o",d:"White Snake vole les disques, les souvenirs et la volonté de ses adversaires.",sd:"=whitesnake-info après l'achat"},
{n:"[PIPIS]",r:"epic",i:"Pipis.webp",p:50000,s:"o",d:"UN OBJET DE [BIGSHOT] SIGNER [SPAMLOL D SPAMLOL] — 700/4h"},
{n:"Inverted Spear of Heaven",r:"epic",p:60000,s:"o",d:"L'arme de Toji. Libère un joueur scellé (ou toi-même). Utilisation : =free [@user]"},
{n:"La Lisière Du Supplice",r:"epic",i:"Lisiere.webp",p:100000,s:1,d:"Bloque le pouvoir d'un joueur jusqu'à ce qu'il soit libéré. Utilisation : =sceller @user"},
{n:"VIP",r:"legendary",i:"vip.webp",p:100000,s:"o",d:"Donne le rôle VIP et donne accès au salon luxueux."},
{n:"Spamlol V1",r:"legendary",i:"Spamlol v1.webp",w:"spamlol",p:300000,s:"o",d:"Ne gagne pas par la force — il transforme les actions des autres en opportunités.",sd:"=spamlol-info après l'achat"},
{n:"Flowery",r:"legendary",w:"flowery",p:350000,s:"o",d:"Flowery, Chef des Six Fleurs, utilise ses fleurs pour contrôler le combat.",sd:"=flowery-info après l'achat"},
{n:"The World",r:"legendary",w:"theworld",p:450000,s:"o",d:"Un pouvoir de contrôle absolu : arrête le temps, détruis les défenses et verrouille le champ de bataille.",sd:"=theworld-info après l'achat"},
{n:"Choso",r:"mythic",w:"choso",p:200000,s:1,d:"Techniques de Choso, Sorcier du Sang !",sd:"=choso-info pour plus d'info et /item use pour avoir le pouvoir"},
{n:"Ten Shadow",r:"jackpot",i:"Megumi.webp",w:"megumi",p:400000,s:"o",d:"Invoque les shikigami de Megumi Fushiguro !",sd:"=megumi-info après l'achat"},
{n:"Queen of Curse",r:"jackpot",i:"Yuta.webp",w:"yuta",p:500000,s:"o",d:"Yuta combine la copie, Rika et son Extension du Territoire.",sd:"=yuta-info après l'achat"},
{n:"Mahoraga",r:"universal",i:"mahoraga.webp",w:"megumi",v:Infinity,demand:5,trend:"flat",d:"Seulement 2 copies existent. Tellement rare qu'elle est inestimable. Obtenu lors de l'événement Mahoraga."}
];
ITEMS.forEach(it=>it.img="images/"+(it.i||it.n+".webp"));
const FAQ=[
{q:"Comment sont assignées les valeurs ?",a:"Les valeurs sont fixées par moi, le créateur du site, et reflètent les valeurs du marché entre joueurs du Casino suite à une étude sur les échanges, l'offre et la demande."},
{q:"À quoi correspond 1 unité de valeur ?",a:"Les valeurs sont exprimées en monnaie du Casino (Cubi Coin). Plus la valeur est haute, plus l'objet est rare et demandé."},
{q:"Qu'est-ce que la rareté Heavenly ?",a:"Heavenly est une rareté entre Jackpot et Universel. Elle regroupe des techniques qui n'ont pas encore été ajoutée au Casino pour le moment."},
{q:"Qu'est-ce que Mahoraga / Universel ?",a:"Mahoraga est classé Universel car seulement 2 copies existent. Sa valeur est infinie (INF) car elle est impossible à valoriser avec les standards normaux."},
{q:"Que signifie N/A pour une valeur ?",a:"N/A (not available) signifie que l'objet n'a pas encore de valeur officielle établie. Ces objets sont en cours d'évaluation par la les modérateurs casino et moi même."},
{q:"Les valeurs changent-elles ?",a:"Oui, les valeurs sont mises à jour régulièrement selon l'offre et la demande. Les flèches de tendance (↑ ↓ →) indiquent l'évolution récente."},
{q:"Qui décide des restocks de la boutique ?",a:"Ce sont les référents du casino et Lol0 qui décident s'il y a un restock ou non. L'état du stock affiché sur le site n'est pas encore implémenté mais arriveras le plus rapidement possible."}
];
/* tags : "classe:Libellé" — classes : freeze rob def break passive ult invert special broken poison boost shiki grey (mêmes couleurs que l'ancien site) */
const T=(c,l)=>`<span class="atk-tag t-${c}">${l}</span>`;
const A=(cmd,tg,cd,desc,note,xp)=>({cmd,tags:tg.map(t=>T(...t.split(":"))),cd,desc,note:note||"",xp});
const GROUPS=[["Jujutsu Kaisen",["yuta","megumi","choso"]],["JoJo's Bizarre Adventure",["theworld","whitesnake"]],["Autres",["spamlol","flowery"]]];
const STANDS=[
{id:"yuta",it:"Queen of Curse",name:"Yuta Okkotsu",origin:"Queen of Curse · Le sorcier le plus fort",rarity:"jackpot",acc:"#ff8faa",cc:"#ffb0c8",headerBg:"linear-gradient(135deg,#08001a,#0c1520)",
lore:"<strong>Concept :</strong> Yuta combine la copie, Rika et son Extension du Territoire. <b>Les ultimates ne sont jamais copiables</b> · Copie Améliorée et Domain nécessitent Rika · Jacob Leader : 1 seule utilisation par Domain.",
abilities:[
A("+copie @user",["special:Copie aléatoire"],"4h","Copie une <b>attaque aléatoire</b> de la cible (base uniquement).","<b>Les ultimes ne sont jamais copiables.</b>",0),
A("+rika",["boost:Invoque Rika 24h"],"12h","Invoque Rika pendant <b>24 heures</b> (nécessaire pour certaines techniques).","",120),
A("+copie-plus @user [attaque]",["special:Copie + puissance max"],"6h","Copie l'attaque choisie à <b>puissance maximale</b>.","<b>Nécessite Rika.</b>",25),
A("=domain-yuta",["ult:Domain 1h"],"—","Active le Domain de Yuta pendant <b>1 heure</b>.","<b>Nécessite Rika.</b>",300),
A("=copiemax @user",["special:Menu déroulant"],"5min (normal) / 10min (max)","Menu déroulant : <b>choisis une capacité de la cible et exécute-la</b>. Peut copier de plusieurs personnes différentes.","<b>Chaque pouvoir ne peut être copié qu'une seule fois.</b> Étapes : 1. =domain-yuta (1h) → 2. =copiemax @user → 3. choisis un pouvoir : copie + exécution immédiate. [NORMAL] = cooldown 5 min · [MAX] = cooldown 10 min.","Via le Domaine"),
A("+purelove @user",["invert:Transfert debuffs"],"12h","Transfère <b>tes debuffs actifs</b> vers une autre personne.","",60),
A("+jacob @user",["break:Enlève TOUS les buffs"],"1× par Domain","Enlève <b>TOUS les buffs et protections</b> de la cible.","<b>Uniquement pendant le Domain</b> — 1 seule utilisation par Domain.",500),
A("+purelove-max @user",["ult:Ultime","rob:Casse bank 5min"],"3 jours","Casse la bank d'une personne (max <b>1.5M</b>) pendant <b>5 minutes</b>.","",300)]},
{id:"megumi",it:"Ten Shadow",name:"Megumi Fushiguro",origin:"Ten Shadow · Dix Ombres",rarity:"jackpot",acc:"#888899",cc:"#aaaacc",headerBg:"linear-gradient(135deg,#08080f,#0c1520)",
lore:"<strong>Concept :</strong> Invoque les shikigami de Megumi Fushiguro ! <b>Agito</b> donne un shikigami aléatoire et <b>Mahoraga</b> est son ultime absolu : chaque hit normal = 1 rotation, 3 = adapté / immune.",
abilities:[
A("=frog @user",["freeze:Blocage dépôt"],"2h","Bloque le dépôt de la cible pendant <b>5 minutes</b>.","",0),
A("=chien",["boost:Boost rob ×2"],"16h","Tes <b>2 prochains robs sont en ×2</b>.","",30),
A("=lapin",["def:Anti-rob 2h"],"1 jour","Protection anti-rob pendant <b>2 heures</b>.","",100),
A("=nue @user",["rob:Attaque bank"],"20h","Attaque la banque de la cible (valeur <b>réglable dans le panel</b>).","",70),
A("=agito",["shiki:Shikigami aléatoire"],"3 jours","Donne un shikigami aléatoire :<br><b style='color:var(--tx2)'>Éléphant (24.9%)</b> — =elephant @user<br><b style='color:var(--tx2)'>Serpent (24.9%)</b> — =serpent @user<br><b style='color:var(--tx2)'>Cerf (24.9%)</b> — =cerf<br><b style='color:var(--tx2)'>Tigre (24.9%)</b> — =tigre<br><b style='color:var(--jackpot-c)'>Buffle (0.1%)</b> — =buffle @user<br><b style='color:var(--jackpot-c)'>Max Nue (0.1%)</b> — =maxnue @user","<b>Important :</b> Agito ne recharge pas tant que le pouvoir obtenu n'est pas utilisé !",250),
A("=epee @user",["break:Détruit TOUT"],"8 jours","L'Épée de l'Exorcisme — <b>détruit toutes les protections, techniques, shikigami et Rika</b>. Casse aussi les domains actifs.","<b>Ne casse PAS</b> les buffs (Heian mode, Chien...).",400)],
upgrade:{title:"Upgrade — Mahoraga",img:"images/mahoraga.webp",acc:"#d0d0d0",cc:"#ffffff",intro:"<b style='color:#e8e8e8'>Mahoraga est une upgrade de Ten Shadow.</b> Les techniques ci-dessous s'ajoutent à celles de Megumi. <b>Nécessite le rôle Mahoraga.</b>",
abilities:[A("=mahoraga",["ult:Ultime","passive:Adaptation passive"],"7 jours si mort","Invoque le Général Divin Mahoraga — actif indéfiniment sauf s'il meurt.<br><b>Normales / max :</b> chaque hit = 1 rotation (3 = adapté/immune)<br><b>Ultimes :</b> 20% de s'adapter, 80% meurt<br><b>Si mort :</b> CD 7 jours + toutes adaptations perdues","","Rôle requis")]}},
{id:"choso",it:"Choso",name:"Choso",origin:"Sorcier du Sang · Ressource sang",rarity:"mythic",acc:"#b22222",cc:"#cc3333",headerBg:"linear-gradient(135deg,#0d0000,#0c1520)",
lore:"<strong>Concept :</strong> Techniques de Choso, Sorcier du Sang ! Il possède un réservoir de sang (0–100) : Faible (0–30) = ×0.75, Stable (31–70) = ×1.00, <b>Critique (71–100) = ×1.25</b>. Certaines techniques coûtent du sang.",
abilities:[
A("=sang",["passive:Statut"],"—","Affiche ton niveau de sang, ton buff actif et ton Blood Armor.","",null),
A("=flowingredscale",["boost:+30 sang + buff 45min"],"3h","Gagne <b>+30 sang</b> + buff 45 min (attaques renforcées).","",0),
A("=piercingblood @user",["rob:Attaque bank","poison:Saignant 15min"],"4h","Coût : 20 sang — attaque réglable dans le panel + applique <b>Saignant</b> 15 min.","<b>Buff actif :</b> +30% de dégâts.",30),
A("=supernova @user",["rob:Burst 15%"],"1 jour","Coût : 45 sang — burst sanguin (<b>15%</b> de la banque). Cible saignante → +40%. Buff actif → +20%.","",150),
A("=siphon @user",["rob:Vol cash","boost:+15 sang"],"6h","Vole le cash de la cible (réglable dans le panel) + récupère <b>+15 sang</b>.","",60),
A("=bloodarmor",["def:Anti-rob basique 2h30"],"1 jour","Anti-rob de base pendant <b>2h30</b>.","<b>Cassable par :</b> Épée. Hiérarchie : Blood Armor = anti-rob de base (même niveau que Lapin), cassé par Masse (1 stack), Cleave (normal), Épée, World Slash.",150)]},
{id:"theworld",it:"The World",name:"The World",origin:"Stand du temps",rarity:"legendary",acc:"#f0e060",cc:"#ffe066",headerBg:"linear-gradient(135deg,#0d0b00,#0c1520)",
lore:"<strong>Concept :</strong> Un pouvoir de contrôle absolu : arrête le temps, détruis les défenses et verrouille le champ de bataille. <b>Nécessite le rôle The World</b> (=theworld-info).",
abilities:[
A("=timestop @user",["freeze:Freeze 8min"],"8h","Fige la cible <b>8 minutes</b>.","",0),
A("=mudamuda @user",["rob:Rob ×4"],"1 jour","<b>4 vols de 5 %</b>.","",40),
A("=roadroller @user",["break:Détruit protections","freeze:Stun 5min"],"2 jours","Détruit les protections <b>sauf l'Infini</b> + stun <b>5 minutes</b>.","",120),
A("=zawarudo",["def:Anti-rob 10h","freeze:Counter-freeze"],"1 jour","Anti-rob <b>10 h</b> + freeze du voleur <b>3 min</b>.","",200),
A("=checkmate @user",["ult:Coup final"],"9 jours","Fige le <b>salon 10 min</b> + vol de <b>15 %</b>.","",350)]},
{id:"whitesnake",it:"White Snake",name:"White Snake",origin:"Stand des Disques",rarity:"rare",bc:"gb-grey",acc:"#9db8c8",cc:"#b8d0e0",headerBg:"linear-gradient(135deg,#060a0d,#0c1520)",
lore:"<strong>Concept :</strong> White Snake vole les disques, les souvenirs et la volonté de ses adversaires. <b>Nécessite le rôle White Snake</b> (=whitesnake-info).",
abilities:[
A("=discvol @user",["special:Vol de Stand Disc","grey:Copie & retourne"],"6h","Copie une <b>technique normale aléatoire</b> et l'utilise immédiatement à puissance normale.","<b>Les ultimes ne peuvent pas être copiées.</b> Sans technique active : 5% de banque.",0),
A("=acidblood @user",["rob:–4% bank","poison:Brûlure acide 12h"],"16h","<b>4% de banque</b> puis <b>Brûlure acide</b> : 1.5% de banque toutes les 3h pendant 12h.","Le DoT passif ignore les anti-rob.",30),
A("=memorydisc @user",["break:Retire 1 buff"],"10h","Retire <b>1 buff offensif/passif aléatoire</b>.","Les protections anti-rob restent en place.",60),
A("=snakeveil",["def:Anti-rob 4h","grey:Counter acide"],"1 jour","Anti-rob <b>4h</b>. Un voleur échoue et reçoit <b>Brûlure acide</b> (1.5% de banque).","<b>Cassable par :</b> Red Max, Masse 3+ stacks et Épée de Mahoraga.",120),
A("=whitehell @user",["ult:Ultimate","break:Vol total de Disques"],"8 jours","Stand Disc + Memory Disc : retrait des buffs et <b>Brûlure acide intensive</b> — <b>10% de banque</b> + 2.5% de banque toutes les 2h pendant 12h.","Les protections anti-rob sont conservées.",150)]},
{id:"spamlol",it:"Spamlol V1",name:"Spamlol V1",origin:"Sabotage économique / manipulation",rarity:"legendary",acc:"#ff5ec4",cc:"#ff8fd8",headerBg:"linear-gradient(135deg,#12000d,#0c1520)",
lore:"<strong>Concept :</strong> Personnage de sabotage économique / manipulation. Ne gagne pas par la force — il transforme les actions des autres en opportunités. <b>Nécessite le rôle Spamlol</b> pour utiliser les capacités.",
abilities:[
A("=advertise @user",["rob:Taxe 12h"],"24h","Publicité forcée : <b>taxe réglable dans le panel</b> pendant 12h.","",0),
A("=scam @user",["special:Effet aléatoire"],"18h","Fausse offre à effet aléatoire : <b>faux avantage / dette cachée / arnaque parfaite</b>.","",30),
A("=deal @user",["boost:+10% prochain gain"],"1 jour","<b>+10% sur son prochain gain</b>, remboursable en banque dans 12h si consommé.","",70),
A("=glitch",["special:Mode spécial 30min"],"2 jours","30 min : tes Advertise/Every ont <b>34%</b> de chance d'être doublés, <b>33%</b> renforcés (+50%).","",200),
A("=every @user",["ult:Attaque finale","rob:Attaque bank"],"3 jours","Attaque la banque : <b>pourcentage et plafond réglables dans le panel</b>.","",350)]},
{id:"flowery",it:"Flowery",name:"Flowery",origin:"Chef des Six Fleurs",rarity:"legendary",acc:"#ff7eb6",cc:"#ff9fcb",headerBg:"linear-gradient(135deg,#14000a,#0c1520)",
lore:"<strong>Concept :</strong> Flowery, Chef des Six Fleurs, utilise ses fleurs pour contrôler le combat. Utilise <b>=jardin</b> pour voir ta progression et ta fleur active.",
abilities:[
A("=jarona",["boost:Récolte"],"6h","Récolte une Jarona — <b>90%</b> normale / <b>10%</b> Ja-Orange (compte double).","",0),
A("=vines @user",["freeze:Bloque collect/prod 48h"],"2 jours","Bloque collect/production <b>48h</b>.","",40),
A("=bloom @user",["special:Effet aléatoire"],"14h","Effet aléatoire : <b>perte de banque</b> (réglable dans le panel) / <b>dépôt bloqué</b> / <b>retire un buff</b>.","",90),
A("=omega",["special:Fleur aléatoire"],"2 jours","Invoque une fleur aléatoire pendant <b>30min–8h</b> :<br>Green (25%) · Blue (22%) · Yellow (20%) · Aqua (15%) · Seth (12%) · Orange (6%)","Chaque fleur donne 1 capacité + 1 passif, avec son propre cooldown. Commandes : <b>=blues, =yellow, =green, =aqua, =seth, =orange</b>. Déblocage : Blue de base · Yellow 60 XP · Green 110 XP · Aqua 150 XP · Seth 220 XP · Orange 300 XP.",0),
A("=last-jarona",["ult:Fusion · buff 1h"],"7 jours","Fusion, buff <b>1h</b> (nécessite <b>10 Jarona</b>).","",300),
A("=jardin",["passive:Statut"],"—","Voir ta progression et ta fleur active.","",null)]}
];
STANDS.forEach(s=>s.img=ITEMS.find(i=>i.n===s.it).img);
