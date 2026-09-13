
const DB=window.GAME_DB;
const app=document.getElementById("app");
const STORE_KEY="gameIndexProgressV6";
const APP_VERSION="6.0";
let progress=JSON.parse(localStorage.getItem(STORE_KEY)||"null")||{
 dg:{level:0,current:0},
 mastery:{}, stars:{}, obtained:{}, bondLevels:{}, bondFavs:{}, petFood:{cats:{},dogs:{}}, hobbyLevels:{}, hobbyNotes:{}, collectionItems:{}, customEvents:[]
};
progress.dg=progress.dg||{level:0,current:0};
progress.obtained=progress.obtained||{};
progress.pets=progress.pets||[];
progress.bondLevels=progress.bondLevels||{};
progress.bondNotes=progress.bondNotes||{};
function save(){localStorage.setItem(STORE_KEY,JSON.stringify(progress))}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function getId(name){return name.toLowerCase().replace(/[^a-z0-9]+/g,"-")}
function masteryKey(type,name){return `${type}:${name}`}
function obtainedKey(type,name){return `obtained:${type}:${name}`}
function isObtained(type,name){return !!progress.obtained?.[obtainedKey(type,name)]}
function toggleObtained(type,name){
  progress.obtained=progress.obtained||{};
  const k=obtainedKey(type,name);
  progress.obtained[k]=!progress.obtained[k];
  save();
  render(window.currentView);
}
function star(name,type){return progress.stars[masteryKey(type,name)]??1}
function current(type,name){return progress.mastery[masteryKey(type,name)]??0}
function setCurrent(type,name,n){progress.mastery[masteryKey(type,name)]=Math.max(0,Math.floor(Number(n)||0));save()}
function setStar(type,name,n){progress.stars[masteryKey(type,name)]=Math.max(1,Math.min(5,Number(n)||1));save()}
function header(title,sub,backText="Heartopia",back="home"){
return `<header>${back?`<button class="back" onclick="go('${back}')">‹ ${esc(backText)}</button>`:""}<div class="eyebrow">GAME INDEX · V${APP_VERSION}</div><h1>${esc(title)}</h1>${sub?`<p class="subtitle">${esc(sub)}</p>`:""}</header>`}
function go(v){render(v)}
function render(v="home"){window.currentView=v; if(v==="home")home();else if(v==="game")game();else if(v==="mastery")masteryHome();else if(v.startsWith("mastery:"))masteryCategory(v.split(":")[1]);else if(v==="wiki")wikiHome();else if(v.startsWith("wiki:"))wikiCategory(v.split(":")[1]);else if(v==="pets")petsHome();else if(v.startsWith("pet:"))petDetail(v.split(":")[1]);else if(v==="hobbies")hobbies();else if(v.startsWith("hobby:"))hobbyDetail(Number(v.split(":")[1]));else if(v==="collections")collections();else if(v.startsWith("collection:"))collectionCategory(v.split(":")[1]);else if(v==="tasks")tasks();else if(v==="animals")animals();else if(v.startsWith("animal:"))animalDetail(v.slice(7));else if(v==="events")events()}
function home(){app.innerHTML=header("Game Index","Your personal gaming wiki & tracker","",null)+`<main>
<div class="game-card" onclick="go('game')"><div class="game-art">🌸</div><div><div class="eyebrow">GAME</div><h2>Heartopia</h2><p>Personal index, collections & progress</p></div><span>›</span></div>
</main>`}
const sections=[
["tasks","📅","Daily & Weekly Tasks","DG Level and contribution"],
["hobbies","🌿","Hobbies","Proficiency, notable levels & unlocks"],
["collections","🗃️","Collections","Your obtained items"],
["mastery","🏅","Mastery Verifications","Track quantity-based mastery"],
["animals","🐾","Animal Bonds","Bond levels, foods & unlocks"],
["events","✨","Events & Fashionwaves","Limited-time collections & gacha"],
["wiki","📖","Index / Wiki","Searchable game reference"],
["pets","🐶","Pets","Food trials & pinned favourites"]
];
const PREMIUM_HOBBY_TICKET_LEVELS=[51,52,54,55,56,57,58,60,61];
function dgRequirementForNextLevel(){
  const next=DB.dgLevels.find(x=>x.level===progress.dg.level+1);
  return Number(next?.required)||0;
}
function normalizeDG(){
  let levelsGained=0;
  let guard=0;
  while(progress.dg.level>0 && guard++<100){
    const req=dgRequirementForNextLevel();
    if(!req || progress.dg.current<req) break;
    progress.dg.current-=req;
    progress.dg.level+=1;
    levelsGained+=1;
  }
  return levelsGained;
}
function saveDGLevel(){
  progress.dg.level=Math.max(0,Math.floor(Number(document.getElementById("dgLevel")?.value)||0));
  progress.dg.current=Math.max(0,Math.floor(Number(document.getElementById("dgCurrent")?.value)||0));
  const gained=normalizeDG();
  save();
  if(gained) alert(`DG level increased to ${progress.dg.level}!`);
  game();
}
function game(){
  let dg=DB.dgLevels.find(x=>x.level===progress.dg.level+1);
  let req=dg?.required??0,pct=req?Math.min(100,Math.round(progress.dg.current/req*100)):100;
  app.innerHTML=header("Heartopia","Your personal game guide")+`<main>
<div class="hero"><div class="hero-top"><div><div class="eyebrow">DG LEVEL</div><div class="level">${progress.dg.level}</div><div class="subtitle">${progress.dg.current} / ${req} contribution to Level ${progress.dg.level+1}</div></div><div class="hero-icon">🌸</div></div><div class="bar"><i style="width:${pct}%"></i></div></div>
<div class="card"><div class="two">
<label class="field"><span>My DG level</span><input id="dgLevel" type="number" min="0" value="${progress.dg.level}"></label>
<label class="field"><span>Current contribution</span><input id="dgCurrent" type="number" min="0" value="${progress.dg.current}"></label>
</div><button class="primary" onclick="saveDGLevel()">Save DG progress</button>
${dg&&PREMIUM_HOBBY_TICKET_LEVELS.includes(dg.level)?`<p class="badge">⭐ Next level DG ${dg.level} includes a Premium Hobby Upgrade Ticket</p>`:""}
</div>
<div class="section-list">${sections.map(s=>`<button class="nav-card" onclick="go('${s[0]}')"><span class="nav-icon">${s[1]}</span><span class="grow"><b>${s[2]}</b><small>${s[3]}</small></span><span>›</span></button>`).join("")}</div>
</main>`}
function tasks(){let dg=DB.dgLevels.find(x=>x.level===progress.dg.level+1);let req=dg?.required??0;
app.innerHTML=header("Daily & Weekly Tasks","5 daily tasks + 1 weekly task")+`<main><div class="card"><div class="eyebrow">DG LEVEL</div><div class="level">${progress.dg.level}</div><p>${progress.dg.current} / ${req} contribution points</p><div class="bar"><i style="width:${req?Math.min(100,progress.dg.current/req*100):100}%"></i></div><button class="primary" onclick="addContribution()">＋ Add contribution</button></div><div class="section-title"><h2>Daily Tasks</h2></div><div class="card list">${[1,2,3,4,5].map((n,i)=>`<label class="checkrow"><input type="checkbox" ${progress[`daily${i}`]?'checked':''} onchange="daily(${i},this.checked)"><span>Daily Task ${n}</span><em>+10</em></label>`).join("")}</div><div class="section-title"><h2>Weekly Task</h2></div><div class="card"><label class="checkrow"><input type="checkbox" ${progress.weekly?'checked':''} onchange="progress.weekly=this.checked;save()"><span>Weekly Task</span></label></div></main>`}
function daily(i,on){
  progress["daily"+i]=on;
  if(on){
    progress.dg.current+=10;
    const gained=normalizeDG();
    save();
    if(gained) alert(`DG level increased to ${progress.dg.level}!`);
  }else{
    progress.dg.current=Math.max(0,progress.dg.current-10);
    save();
  }
  tasks();
}
function addContribution(){
  let n=prompt("Contribution points to add",10);
  if(n!==null){
    progress.dg.current=Math.max(0,Number(progress.dg.current)+Number(n||0));
    const gained=normalizeDG();
    save();
    if(gained) alert(`DG level increased to ${progress.dg.level}!`);
    tasks();
  }
}

const masteryGroups=[
["flowers","Flowers","🌷",DB.flowers, "Flower"],
["crops","Crops","🌱",DB.crops,"Crop"],
["recipes","Cooking","🍳",DB.recipes,"Recipe"],
["bugs","Insects","🦋",DB.bugs,"Insects"],
["birds","Birds","🐦",DB.birds,"Birds"],
["fish","Fish","🐟",DB.fish,"Fish"],
["shells","Shells","🐚",DB.shells,"Shell"]
];
function masteryHome(){app.innerHTML=header("Mastery Verifications","Current progress starts at 0 for every item")+`<main><div class="section-list">${masteryGroups.map(g=>`<button class="nav-card" onclick="go('mastery:${g[0]}')"><span class="nav-icon">${g[2]}</span><span class="grow"><b>${g[1]}</b><small>${g[3].length} items</small></span><span>›</span></button>`).join("")}</div></main>`}
function itemName(type,r){return type==="shells"?r.Shell:r[type==="flowers"?"Flower":type==="crops"?"Crop":type==="recipes"?"Recipe":type==="bugs"?"Insects":type==="birds"?"Birds":"Fish"]}
function requiredFor(type,r){let x=type==="shells"?r.Mastery:r[type==="bugs"?"Mastery #":type==="fish"?"Mastery (Obtain x times)":type==="birds"?"Mastery (Obtain x times)":type==="crops"||type==="flowers"?type==="crops"?"Mastery Verification":"Mastery Verification":"mastery"];return Number(x)||0}
function masteryCategory(type){let g=masteryGroups.find(x=>x[0]===type), rows=g[3];app.innerHTML=header(g[1],`${rows.length} database entries`,"Mastery","mastery")+`<main><div class="searchbox"><input placeholder="Search ${g[1]}..." oninput="filterCards(this.value,'masteryCards')"></div><div id="masteryCards" class="listcards">${rows.map((r,i)=>masteryCard(type,r,i)).join("")}</div></main>`}
function masteryCard(type,r,i){
  let name=itemName(type,r),req=requiredFor(type,r),cur=current(type,name),pct=req?Math.min(100,Math.round(cur/req*100)):0,s=star(type,name),obt=isObtained(type,name);
  return `<div class="mastery-card">
    <div class="row between"><div><h3>${esc(name)}</h3><small>${req?`${cur.toLocaleString()} / ${req.toLocaleString()} mastered`:"Mastery not applicable"}</small></div><span class="percent">${req?pct+"%":"—"}</span></div>
    ${req?`<div class="bar"><i style="width:${pct}%"></i></div>`:""}
    <div class="meta">${details(type,r)}</div>
    <div class="controls">
      <button onclick="toggleObtained('${type}',${JSON.stringify(name)})">${obt?"☑ Obtained":"☐ Obtained"}</button>
      <select onchange="setStar('${type}','${esc(name)}',this.value);masteryCategory('${type}')">${[1,2,3,4,5].map(n=>`<option ${s===n?"selected":""} value="${n}">⭐ ${n}</option>`).join("")}</select>
      ${req?`<button onclick="changeMastery('${type}',${i},-1)">−</button><button onclick="changeMastery('${type}',${i},1)">＋</button><button class="set" onclick="setMastery('${type}',${i})">Set amount</button>`:""}
    </div>
  </div>`;
}
function details(type,r){let bits=[];if(r.Location)bits.push(`📍 ${r.Location}`);if(r.Time)bits.push(`🕐 ${r.Time}`);if(r.Weather)bits.push(`☁️ ${r.Weather}`);if(r["Growth Time"])bits.push(`⏱ ${r["Growth Time"]}`);return bits.map(x=>`<span>${esc(x)}</span>`).join("")}
function changeMastery(type,i,d){let r=masteryGroups.find(x=>x[0]===type)[3][i],n=itemName(type,r),req=requiredFor(type,r);setCurrent(type,n,Math.min(req,current(type,n)+d));masteryCategory(type)}
function setMastery(type,i){let r=masteryGroups.find(x=>x[0]===type)[3][i],n=itemName(type,r),v=prompt(`How many ${n} have you collected?`,current(type,n));if(v!==null){setCurrent(type,n,v);masteryCategory(type)}}
function filterCards(q,id){q=q.toLowerCase();document.querySelectorAll("#"+id+" > div").forEach(x=>x.style.display=x.innerText.toLowerCase().includes(q)?"":"none")}

function hobbies(){app.innerHTML=header("Hobbies","Update your current level and keep unlock notes")+`<main><div class="listcards">${DB.hobbies.map((h,i)=>`<button class="nav-card" onclick="go('hobby:${i}')"><span class="nav-icon">🌿</span><span class="grow"><b>${h.name}</b><small>Level ${progress.hobbyLevels[h.name]??0}</small></span><span>›</span></button>`).join("")}</div></main>`}
function hobbyDetail(i){let h=DB.hobbies[i],level=progress.hobbyLevels[h.name]??0,notes=progress.hobbyNotes[h.name]??"";app.innerHTML=header(h.name,"Proficiency level & notable rewards","Hobbies","hobbies")+`<main><div class="card"><label class="field"><span>Current level</span><input id="hlevel" type="number" min="0" value="${level}"></label><button class="primary" onclick="saveHobby('${esc(h.name)}')">Save level & notes</button></div><div class="section-title"><h2>Notable levels & unlocks</h2></div><div class="card"><textarea id="hnotes" placeholder="e.g. Level 10 — unlocks ...">${esc(notes)}</textarea></div></main>`}
function saveHobby(name){progress.hobbyLevels[name]=Number(document.getElementById("hlevel").value)||0;progress.hobbyNotes[name]=document.getElementById("hnotes").value;save();go("hobbies")}

function collectionItems(type){
  const g=masteryGroups.find(x=>x[0]===type);
  return g?g[3]:[];
}
function collections(){
  let groups=[["flowers","Gardening","🌱"],["recipes","Cooking","🍳"],["bugs","Insect Catching","🦋"],["birds","Bird Watching","🐦"],["fish","Fishing","🐟"]];
  app.innerHTML=header("Collections","Track every item as obtained","Heartopia","game")+`<main><div class="listcards">${groups.map(g=>{
    const rows=collectionItems(g[0]);
    const done=rows.filter(r=>isObtained(g[0],itemName(g[0],r))).length;
    return `<button class="nav-card" onclick="go('collection:${g[0]}')"><span class="nav-icon">${g[2]}</span><span class="grow"><b>${g[1]}</b><small>${done} / ${rows.length} obtained</small></span><span>›</span></button>`;
  }).join("")}</div></main>`;
}
function collectionCategory(type){
  const g=masteryGroups.find(x=>x[0]===type); if(!g)return collections();
  const rows=g[3];
  app.innerHTML=header(g[1],`${rows.length} items`,"Collections","collections")+`<main><div class="searchbox"><input placeholder="Search..." oninput="filterCards(this.value,'collectionList')"></div><div id="collectionList" class="listcards">${rows.map(r=>{
    const n=itemName(type,r),obt=isObtained(type,n);
    return `<div class="mastery-card"><div class="row between"><h3>${esc(n)}</h3><button onclick="toggleObtained('${type}',${JSON.stringify(n)});collectionCategory('${type}')">${obt?"☑ Obtained":"☐ Obtained"}</button></div><div class="meta">${details(type,r)}</div></div>`;
  }).join("")}</div></main>`;
}
function wikiHome(){let groups=[["characters","Characters","👥",DB.characters],["places","Notable Places & Shops","📍",[]],["fish","Fish","🐟",DB.fish],["flowers","Flowers & Cross Breeding","🌷",DB.flowers],["recipes","Cooking Recipes","🍳",DB.recipes],["bugs","Insects","🦋",DB.bugs],["birds","Birds","🐦",DB.birds],["crops","Crops","🌱",DB.crops],["shells","Shells","🐚",DB.shells]];app.innerHTML=header("Index / Wiki","Your permanent Heartopia reference")+`<main><div class="searchbox"><input placeholder="Search the wiki..." oninput="wikiSearch(this.value)"></div><div id="wikiGroups" class="listcards">${groups.map(g=>`<button class="nav-card" onclick="go('wiki:${g[0]}')"><span class="nav-icon">${g[2]}</span><span class="grow"><b>${g[1]}</b><small>${g[3].length?g[3].length+" entries":"Coming from database"}</small></span><span>›</span></button>`).join("")}</div></main>`}
function wikiSearch(q){q=q.toLowerCase();document.querySelectorAll("#wikiGroups .nav-card").forEach(x=>x.style.display=x.innerText.toLowerCase().includes(q)?"":"none")}
function wikiCategory(type){
  if(type==="fish")return wikiFish();
  let map={characters:DB.characters,flowers:DB.flowers,recipes:DB.recipes,bugs:DB.bugs,birds:DB.birds,crops:DB.crops,shells:DB.shells};
  let arr=map[type]||[];
  app.innerHTML=header(type==="characters"?"Characters":type==="flowers"?"Flowers & Cross Breeding":type==="recipes"?"Cooking Recipes":type==="bugs"?"Insects":type==="birds"?"Birds":type==="crops"?"Crops":"Shells",`${arr.length} entries`,"Index / Wiki","wiki")+`<main><div class="searchbox"><input placeholder="Search..." oninput="filterCards(this.value,'wikiList')"></div><div id="wikiList" class="listcards">${arr.map((r,i)=>{
    let n=itemName(type,r);
    return `<button class="nav-card" onclick="wikiDetail('${type}',${i})"><span class="nav-icon">•</span><span class="grow"><b>${esc(n)}</b><small>${esc(details(type,r).replace(/<[^>]+>/g," "))}</small></span><span>›</span></button>`;
  }).join("")}</div></main>`;
}
function wikiDetail(type,i){
  let g=masteryGroups.find(x=>x[0]===type),r=g?.[3]?.[i];
  if(!r)return wikiCategory(type);
  let n=itemName(type,r),req=requiredFor(type,r),cur=current(type,n),obt=isObtained(type,n);
  app.innerHTML=header(n,"Reference details","Index / Wiki","wiki:"+type)+`<main><div class="card"><div class="meta">${details(type,r)}</div><p><b>${obt?"☑ Obtained":"☐ Not obtained"}</b></p>${req?`<p><b>Mastery:</b> ${cur.toLocaleString()} / ${req.toLocaleString()}</p><div class="bar"><i style="width:${Math.min(100,cur/req*100)}%"></i></div>`:`<p>Mastery not applicable.</p>`}<div class="controls"><button onclick="toggleObtained('${type}',${JSON.stringify(n)});wikiDetail('${type}',${i})">${obt?"Mark not obtained":"Mark obtained"}</button></div></div></main>`;
}
function wikiFish(){let cats=[["Ocean Fish","🌊",DB.fish.filter(r=>r._group==="Ocean Fish")],["Lake Fish","🏞️",DB.fish.filter(r=>r._group==="Lake Fish")],["River Fish","🌿",DB.fish.filter(r=>r._group==="River Fish")],["Event Fish","✨",DB.fish.filter(r=>r._group==="Event Fish")],["Other Fish","🐟",DB.fish.filter(r=>r._group==="Other Fish")]];app.innerHTML=header("Fish","Choose a habitat/category","Index / Wiki","wiki")+`<main><div class="listcards">${cats.map(c=>`<button class="nav-card" onclick="fishCat('${c[0]}')"><span class="nav-icon">${c[1]}</span><span class="grow"><b>${c[0]}</b><small>${c[2].length} fish</small></span><span>›</span></button>`).join("")}</div></main>`}
function fishCat(name){let arr=DB.fish.filter(r=>r._group===name);app.innerHTML=header(name,`${arr.length} fish`,"Fish","wiki:fish")+`<main><div class="searchbox"><input placeholder="Search fish..." oninput="filterCards(this.value,'fishList')"></div><div id="fishList" class="listcards">${arr.map(r=>`<button class="nav-card" onclick="fishDetail('${esc(r.Fish)}')"><span class="nav-icon">🐟</span><span class="grow"><b>${esc(r.Fish)}</b><small>${esc(r.Location)} • ${esc(r.Time)}</small></span><span>›</span></button>`).join("")}</div></main>`}
function fishDetail(name){let r=DB.fish.find(x=>x.Fish===name),req=requiredFor("fish",r),cur=current("fish",name),s=star("fish",name);app.innerHTML=header(name,"Fish reference","Fish","wiki:fish")+`<main><div class="card"><div class="meta">${details("fish",r)}</div><div class="section-title"><h3>Collection & Mastery</h3></div><p><b>${cur}</b> / ${req||"—"} mastered</p>${req?`<div class="bar"><i style="width:${Math.min(100,cur/req*100)}%"></i></div>`:""}<div class="controls"><button class="set" onclick="setMastery('fish',${DB.fish.indexOf(r)})">Update mastery</button><select onchange="setStar('fish','${esc(name)}',this.value);fishDetail('${esc(name)}')">${[1,2,3,4,5].map(n=>`<option ${s===n?"selected":""}>${n}</option>`).join("")}</select></div></div><div class="section-title"><h3>Star Prices</h3></div><div class="card pricegrid">${[1,2,3,4,5].map(n=>`<span>⭐${n}</span><b>${r[n+"* Price"]??"—"}</b>`).join("")}</div></main>`}

function animals(){
  app.innerHTML=header("Animal Bonds","Bond levels, favourite foods and unlock notes","Heartopia","game")+`<main>
  <div class="section-title"><h2>Animals</h2></div>
  <div class="listcards">${DB.animals.map(a=>animalCard(a,false)).join("")}</div>
  <div class="section-title"><h2>Limited-Time</h2></div>
  <div class="listcards">${DB.limitedAnimals.map(a=>animalCard(a,true)).join("")}</div>
  </main>`;
}
function animalCard(a,limited){
  return `<button class="nav-card" onclick="go('animal:${esc(a.name)}')"><span class="nav-icon">${limited?"⏳":"🐾"}</span><span class="grow"><b>${esc(a.name)}</b><small>Bond ${progress.bondLevels[a.name]??0} / ${a.maxLevel}</small></span><span>›</span></button>`;
}
function animalDetail(name){
  let a=[...DB.animals,...DB.limitedAnimals].find(x=>x.name===name);
  if(!a)return animals();
  app.innerHTML=header(name,"Animal bond information","Animal Bonds","animals")+`<main>
  <div class="card"><div class="eyebrow">FAVOURITE FOOD</div><h3>${esc(a.favouriteFood||a.food||"See database")}</h3>
  <p>📍 ${esc(a.location||"")}<br>☁️ ${esc(a.weather||"")}</p>
  <div class="two"><label class="field"><span>Bond level</span><input id="bond" type="number" min="0" max="${a.maxLevel}" value="${progress.bondLevels[name]??0}"></label><div><div class="eyebrow">MAX</div><div class="level smalllevel">${a.maxLevel}</div></div></div>
  <button class="primary" onclick="saveBond('${esc(name)}')">Save bond level</button></div>
  <div class="section-title"><h2>Notes & unlocks</h2></div><div class="card"><textarea id="bondnotes" placeholder="Add your notes here...">${esc(progress.bondNotes?.[name]||"")}</textarea><button class="primary" onclick="saveBondNotes('${esc(name)}')">Save notes</button></div>
  </main>`;
}
function saveBond(name){progress.bondLevels[name]=Math.max(0,Number(document.getElementById("bond").value)||0);save();go("animals")}
function saveBondNotes(name){progress.bondNotes=progress.bondNotes||{};progress.bondNotes[name]=document.getElementById("bondnotes").value;save()}

function petsHome(){
  progress.pets=progress.pets||[];
  app.innerHTML=header("My Pets","Each pet has its own food trials and favourites","Heartopia","game")+`<main>
  <div class="card"><div class="two"><label class="field"><span>Type</span><select id="newPetType"><option>Dog</option><option>Cat</option></select></label><label class="field"><span>Name</span><input id="newPetName" placeholder="e.g. Dot"></label></div><button class="primary" onclick="addPet()">＋ Add Pet</button></div>
  <div class="section-title"><h2>My Pets</h2></div>
  <div class="listcards">${progress.pets.map((p,i)=>`<button class="nav-card" onclick="go('pet:${i}')"><span class="nav-icon">${p.type==="Dog"?"🐶":"🐱"}</span><span class="grow"><b>${esc(p.name)}</b><small>${p.type}</small></span><span>›</span></button>`).join("") || '<div class="empty card">No pets added yet.</div>'}</div>
  </main>`;
}
function addPet(){
  const name=document.getElementById("newPetName").value.trim(),type=document.getElementById("newPetType").value;
  if(!name)return;
  progress.pets=progress.pets||[];
  progress.pets.push({name,type,tried:[],favourites:[]});
  save();petsHome();
}
function petDetail(index){
  let p=progress.pets?.[Number(index)];
  if(!p)return petsHome();
  let foods=p.type==="Cat"?DB.petFoods.cats:DB.petFoods.dogs;
  p.tried=p.tried||[];p.favourites=p.favourites||[];
  app.innerHTML=header(p.name,`${p.type} food trials and pinned favourites`,"My Pets","pets")+`<main>
  <div class="card"><div class="eyebrow">${p.type.toUpperCase()}</div><h2>${esc(p.name)}</h2>
  <h3>Pinned favourites</h3><div class="pills">${p.favourites.length?p.favourites.map(f=>`<span class="pill">📌 ${esc(f)}</span>`).join(""):'<span class="muted">None pinned yet</span>'}</div></div>
  <div class="section-title"><h2>Food Trials</h2></div>
  <div class="card list">${foods.map(f=>`<div class="checkrow"><button onclick="togglePetFood(${index},'${esc(f)}')">${p.tried.includes(f)?"☑":"☐"} ${esc(f)}</button><button onclick="togglePetFavourite(${index},'${esc(f)}')">${p.favourites.includes(f)?"📌 Pinned":"Pin"}</button></div>`).join("")}</div>
  </main>`;
}
function togglePetFood(index,food){
  let p=progress.pets[index];p.tried=p.tried||[];
  p.tried=p.tried.includes(food)?p.tried.filter(x=>x!==food):[...p.tried,food];
  save();petDetail(index);
}
function togglePetFavourite(index,food){
  let p=progress.pets[index];p.favourites=p.favourites||[];
  p.favourites=p.favourites.includes(food)?p.favourites.filter(x=>x!==food):[...p.favourites,food];
  save();petDetail(index);
}

function events(){app.innerHTML=header("Events & Fashionwaves","Each event can become its own collection","Heartopia","game")+`<main><div class="empty card">No event records have been added from the database yet.</div><button class="primary" onclick="addEvent()">＋ Add Event</button></main>`}
function addEvent(){let n=prompt("Event / Festival / Fashionwave name");if(n){progress.customEvents.push({name:n,collections:[],gacha:[]});save();events()}}

render("home");
