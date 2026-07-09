/* ================= ESCAPE HELPER ================= */
function esc(str){
  return String(str==null?'':str).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

/* ================= TOASTS ================= */
function toast(msg, tone){
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${icon(tone==='error'?'x':'check','')}<span>${msg}</span>`;
  root.appendChild(el);
  setTimeout(()=> el.remove(), 2800);
}

/* ================= SHEET (bottom modal) ================= */
function openSheet(innerHtml, onMount){
  closeSheet();
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'active-overlay';
  overlay.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">
    <div class="sheet-handle"></div>
    <button class="icon-btn" data-action="closeSheetOnly" style="position:absolute;top:14px;right:20px;" aria-label="Close">${icon('x')}</button>
    ${innerHtml}
  </div>`;
  overlay.addEventListener('click', (e)=>{ if(e.target===overlay) closeSheet(); });
  document.body.appendChild(overlay);
  document.body.style.overflow='hidden';
  if(onMount) onMount(overlay);
}
function closeSheet(){
  const el = document.getElementById('active-overlay');
  if(el){ el.remove(); document.body.style.overflow=''; }
}

/* ================= TOPBAR ================= */
function Topbar({ title, subtitle, back, actions, hideCenter }){
  return `
  <div class="topbar">
    <div style="flex:1;">
      ${back ? `<button class="icon-btn" data-nav="${back}">${icon('chevronLeft')}</button>` :
      `<button class="icon-btn" aria-label="Menu">${icon('menu')}</button>`}
    </div>
    ${hideCenter ? '' : `<div style="text-align:center;">
      <div style="font-size:16px; font-weight:600;">${title}</div>
      ${subtitle?`<div style="font-size:11px; color:var(--ink-soft); font-weight:500;">${subtitle}</div>`:''}
    </div>`}
    <div style="flex:1; display:flex; justify-content:flex-end; gap:8px;">${actions||''}</div>
  </div>`;
}

/* ================= BOTTOM NAV ================= */
const NAV_ITEMS = [
  { route:'home', label:'Home', icon:'home' },
  { route:'memory', label:'Memory', icon:'memory' },
  { route:'chat', label:'', icon:'plus', fab:true },
  { route:'explore', label:'Explore', icon:'search' },
  { route:'profile', label:'Profile', icon:'user' },
];
function BottomNav(active){
  return `<nav class="bottom-nav">
    ${NAV_ITEMS.map(it=>{
      if(it.fab) return `<button class="nav-fab" data-nav="${it.route}" aria-label="Ask Nexa">${icon('plus')}</button>`;
      return `<button class="nav-btn ${active===it.route?'active':''}" data-nav="${it.route}">${icon(it.icon)}<span>${it.label}</span></button>`;
    }).join('')}
  </nav>`;
}

/* ================= REUSABLE CARDS ================= */
function ListItem({ tone, iconName, title, sub, onClickAttr, rightBadge }){
  return `<div class="list-item" ${onClickAttr||''}>
    <div class="li-icon tone-${tone}">${icon(iconName)}</div>
    <div class="li-body">
      <div class="li-title">${title}</div>
      <div class="li-sub">${sub}</div>
    </div>
    ${rightBadge ? rightBadge : `<div class="li-chev">${icon('chevronRight')}</div>`}
  </div>`;
}

function StatusBadge(status){
  const tone = STATUS_TONE[status] || 'purple';
  return `<span class="badge tone-${tone}">${status}</span>`;
}

/* ================= AI TEXT PARSER (on-device heuristic NLU) =================
   Simulates entity extraction so the app is fully interactive offline.
   Swap this for a real Gemini API call server-side once credentials are configured. */
function parseMemoryFromText(text){
  const lower = text.toLowerCase();

  const typeMap = [
    { re:/hackathon/, category:'hackathon', icon:'sparkles', tone:'purple' },
    { re:/intern(ship)?/, category:'internship', icon:'briefcase', tone:'blue' },
    { re:/interview/, category:'interview', icon:'users', tone:'orange' },
    { re:/scholarship/, category:'scholarship', icon:'award', tone:'green' },
    { re:/assignment|homework/, category:'assignment', icon:'fileText', tone:'red' },
    { re:/exam|test/, category:'exam', icon:'target', tone:'red' },
    { re:/certificat/, category:'certificate', icon:'award', tone:'green' },
    { re:/meeting|call/, category:'meeting', icon:'users', tone:'blue' },
    { re:/birthday/, category:'birthday', icon:'star', tone:'orange' },
    { re:/job|offer/, category:'job', icon:'briefcase', tone:'blue' },
  ];
  let match = typeMap.find(t=> t.re.test(lower)) || { category:'note', icon:'sparkles', tone:'purple' };

  // organization: word(s) after "at"/"for"/"with"/"to" that look capitalized, else null
  let org = null;
  const orgMatch = text.match(/\b(?:at|for|with|to)\s+([A-Z][A-Za-z0-9&.\- ]{2,30})/);
  if(orgMatch) org = esc(orgMatch[1].trim().replace(/[.,]$/,''));

  // date detection
  let dateIso = addDays(7);
  if(/\btoday\b/.test(lower)) dateIso = addDays(0);
  else if(/\btomorrow\b/.test(lower)) dateIso = addDays(1);
  else if(/\bnext week\b/.test(lower)) dateIso = addDays(7);
  else{
    const inDays = lower.match(/in (\d+) days?/);
    if(inDays) dateIso = addDays(parseInt(inDays[1],10));
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const dayMatch = days.findIndex(d=> lower.includes(d));
    if(dayMatch>-1){
      const now = new Date(); const cur = now.getDay();
      let diff = (dayMatch - cur + 7) % 7; if(diff===0) diff=7;
      dateIso = addDays(diff);
    }
  }

  // title: first sentence, trimmed, capitalized nicely
  let title = text.trim().split(/[.!?\n]/)[0];
  if(title.length>62) title = title.slice(0,60)+'…';
  if(!title) title = 'New memory';
  title = esc(title);

  // team name
  let team = null;
  const teamMatch = text.match(/team\s+(?:name\s+)?(?:is\s+)?["']?([A-Za-z0-9 _-]{2,24})["']?/i);
  if(teamMatch) team = esc(teamMatch[1].trim());

  return {
    id: uid(),
    kind: /interview|meeting|hackathon|birthday/.test(match.category) ? 'event' : (/assignment|exam/.test(match.category) ? 'task':'event'),
    category: match.category,
    title,
    sub: `${org?org+' • ':''}${relDay(dateIso)}`,
    date: dateIso,
    tone: match.tone,
    icon: match.icon,
    meta: {
      organization: org || '—',
      status: /interview/.test(match.category) ? 'Interview Scheduled' : 'Registered',
      appliedOn: fmtDate(addDays(0)),
      team: team || undefined,
    }
  };
}

/* ================= FILE ICON HELPER ================= */
function docIconFor(type){
  if(type==='pdf') return { name:'fileText', tone:'red' };
  if(type==='id') return { name:'shield', tone:'blue' };
  if(type==='cert') return { name:'award', tone:'green' };
  if(type==='image') return { name:'image', tone:'orange' };
  return { name:'fileText', tone:'purple' };
}
