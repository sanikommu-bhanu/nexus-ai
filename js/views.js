/* =====================================================================
   VIEWS — each returns { html, mount(rootEl) }
   ===================================================================== */

/* ---------------- ONBOARDING ---------------- */
function viewOnboarding1(){
  const html = `
  <div class="onb-screen">
    <div class="onb-image-wrap">
      <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80" alt="Welcome" class="onb-image" />
    </div>
    <div class="onb-content">
      <div class="onb-progress"><span class="on"></span><span></span><span></span></div>
      <h1 class="onb-title">Welcome to Nexus</h1>
      <p class="onb-body">Your second brain for opportunities, deadlines, and everything worth remembering.</p>
      <button class="btn btn-primary btn-block" data-nav="onboarding2">Continue ${icon('arrowUpRight')}</button>
    </div>
  </div>`;
  return { html, mount(){} };
}

function viewOnboarding2(){
  const html = `
  <div class="onb-screen">
    <div class="onb-image-wrap">
      <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80" alt="Memory" class="onb-image" />
    </div>
    <div class="onb-content">
      <div class="onb-progress"><span class="on"></span><span class="on"></span><span></span></div>
      <h1 class="onb-title">We remember everything</h1>
      <p class="onb-body">Never forget a deadline. Never miss an opportunity. Just talk to Nexa — we'll organize the rest.</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:20px;">
        <button class="btn btn-primary btn-block" data-nav="onboarding3">Continue ${icon('arrowUpRight')}</button>
        <button class="btn btn-ghost btn-block" data-nav="onboarding1">Back</button>
      </div>
    </div>
  </div>`;
  return { html, mount(){} };
}

function viewOnboarding3(){
  const s = Store.get();
  const rows = [
    { key:'google', label:'Google Account', ic:'wifi', tone:'blue' },
    { key:'github', label:'GitHub', ic:'repo', tone:'purple' },
    { key:'linkedin', label:'LinkedIn', ic:'briefcase', tone:'blue' },
    { key:'calendar', label:'Google Calendar', ic:'calendar', tone:'orange' },
    { key:'gmail', label:'Gmail', ic:'mail', tone:'red' },
    { key:'drive', label:'Google Drive', ic:'cloud', tone:'green' },
  ];
  const html = `
  <div class="onb-screen">
    <div class="onb-image-wrap short">
      <img src="https://images.unsplash.com/photo-1512758117926-571de41473d0?auto=format&fit=crop&w=800&q=80" alt="Connect" class="onb-image" />
    </div>
    <div class="onb-content" style="padding-top:16px;">
      <div class="onb-progress"><span class="on"></span><span class="on"></span><span class="on"></span></div>
      <h1 class="onb-title" style="margin-bottom:4px;">Connect your world</h1>
      <p class="onb-body" style="margin-bottom:0;">Nexus reads context from the places you already work.</p>
      <div class="connect-list">
        ${rows.map(r=>`
          <div class="connect-row">
            <div class="ci tone-${r.tone}">${icon(r.ic)}</div>
            <div class="cn">${r.label}</div>
            <button class="toggle ${s.user.connected[r.key]?'on':''}" data-action="toggleConnect" data-id="${r.key}"></button>
          </div>`).join('')}
      </div>
      <button class="btn btn-primary btn-block" style="margin-top:20px;" data-action="finishOnboarding">Enter Nexus AI ${icon('arrowUpRight')}</button>
    </div>
  </div>`;
  return { html, mount(){} };
}

/* ---------------- AUTHENTICATION ---------------- */
function viewLogin(){
  const html = `
  <div class="onb-screen">
    <div class="onb-image-wrap short">
      <img src="https://images.unsplash.com/photo-1512758117926-571de41473d0?auto=format&fit=crop&w=800&q=80" alt="Login" class="onb-image" />
    </div>
    <div class="onb-content" style="padding-top:16px;">
      <h1 class="onb-title" style="margin-bottom:4px;">Welcome Back</h1>
      <p class="onb-body" style="margin-bottom:20px;">Log in to access your second brain.</p>
      
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="input-wrap">${icon('mail','leading')}<input type="email" class="input" id="auth-email" placeholder="Email address" /></div>
        <div class="input-wrap">${icon('key','leading')}<input type="password" class="input" id="auth-pass" placeholder="Password" /></div>
        <button class="btn btn-primary btn-block" style="margin-top:8px;" data-action="doLogin">Log In ${icon('arrowUpRight')}</button>
      </div>
      
      <div style="margin-top:24px;text-align:center;font-size:13px;color:var(--ink-soft);">
        Don't have an account? <span style="font-weight:600;color:var(--brand-dark);cursor:pointer;" data-nav="signup">Sign Up</span>
      </div>
    </div>
  </div>`;
  return { html, mount(){} };
}

function viewSignup(){
  const html = `
  <div class="onb-screen">
    <div class="onb-image-wrap short">
      <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80" alt="Signup" class="onb-image" />
    </div>
    <div class="onb-content" style="padding-top:16px;">
      <h1 class="onb-title" style="margin-bottom:4px;">Create Account</h1>
      <p class="onb-body" style="margin-bottom:20px;">Join Nexus AI today.</p>
      
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="input-wrap">${icon('user','leading')}<input type="text" class="input" id="auth-name" placeholder="Full Name" /></div>
        <div class="input-wrap">${icon('mail','leading')}<input type="email" class="input" id="auth-email" placeholder="Email address" /></div>
        <div class="input-wrap">${icon('key','leading')}<input type="password" class="input" id="auth-pass" placeholder="Password" /></div>
        <button class="btn btn-primary btn-block" style="margin-top:8px;" data-action="doSignup">Sign Up ${icon('arrowUpRight')}</button>
      </div>
      
      <div style="margin-top:24px;text-align:center;font-size:13px;color:var(--ink-soft);">
        Already have an account? <span style="font-weight:600;color:var(--brand-dark);cursor:pointer;" data-nav="login">Log In</span>
      </div>
    </div>
  </div>`;
  return { html, mount(){} };
}

/* ---------------- HOME ---------------- */
function greetingWord(){
  const h = new Date().getHours();
  if(h<12) return 'Good Morning';
  if(h<17) return 'Good Afternoon';
  return 'Good Evening';
}
function viewHome(){
  const s = Store.get();
  const upcoming = upcomingMemories(3);
  const events = Store.get().memories.filter(m=>m.kind==='event').length;
  const tasksToday = todaysTaskCount();
  const interviews = Store.get().memories.filter(m=>m.category==='interview').length;
  const docs = Store.get().documents.length;
  const topOpp = [...OPPORTUNITIES].sort((a,b)=>b.match-a.match)[0];

  const html = `
  ${Topbar({
    hideCenter: true,
    actions:`<button class="avatar-small" data-nav="profile">
               <img src="https://i.pravatar.cc/100?img=47" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display=''" alt="Avatar"/>
               <span style="display:none;">${s.user.initials}</span>
             </button>`
  })}
  <div class="screen no-pad-bottom" style="padding-bottom:100px;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <div class="greeting-title">${greetingWord()}, ${s.user.firstName} 👋</div>
        <div class="greeting-sub">Let's achieve something amazing today!</div>
      </div>
      <button class="icon-btn" data-nav="calendar" style="position:relative; margin-top:4px;">
        ${icon('bell')}
        <span class="dot" style="position:absolute;top:8px;right:8px;width:6px;height:6px;background:#D65A5A;border-radius:50%;"></span>
      </button>
    </div>

    <div class="section-head" style="margin-top:6px;"><h2>Today's Overview</h2></div>
    <div class="stat-grid">
      <div class="stat-card purple">
        <div class="sc-top"><div class="num">${events}</div><div class="stat-icon">${icon('calendar')}</div></div>
        <div class="lbl">Upcoming Events</div><div class="sub">Don't miss anything</div>
      </div>
      <div class="stat-card cream">
        <div class="sc-top"><div class="num">${tasksToday}</div><div class="stat-icon">${icon('check')}</div></div>
        <div class="lbl">Tasks Due Today</div><div class="sub">Keep it up!</div>
      </div>
      <div class="stat-card green">
        <div class="sc-top"><div class="num">${interviews}</div><div class="stat-icon">${icon('users')}</div></div>
        <div class="lbl">Interview</div><div class="sub">Prepare well</div>
      </div>
      <div class="stat-card brown">
        <div class="sc-top"><div class="num">${docs}</div><div class="stat-icon">${icon('fileText')}</div></div>
        <div class="lbl">Documents</div><div class="sub">Recently added</div>
      </div>
    </div>

    <div class="section-head"><h2>Upcoming Reminders</h2><span class="view-all" data-nav="calendar">View all</span></div>
    ${upcoming.length ? upcoming.map(m=>ListItem({
      tone:m.tone, iconName:m.icon, title:m.title,
      sub:`${relDay(m.date)}${m.date && fmtTime(m.date)!=='12:00 AM' ? ' • '+fmtTime(m.date):''}`,
      onClickAttr:`data-action="openMemory" data-id="${m.id}"`
    })).join('') : `<div class="empty-state"><h4>Nothing upcoming</h4><p>Tell Nexa about a deadline to see it here.</p></div>`}

    <div class="section-head"><h2>Recommended for You</h2><span class="view-all" data-nav="explore">View all</span></div>
    ${topOpp ? `
    <div class="promo-card" data-nav="explore" style="display:flex; flex-direction:row; align-items:center;">
      <div style="flex:1;">
        <h3>${topOpp.title}</h3>
        <p>Build the future with AI</p>
        <div class="cta">Register by ${relDay(topOpp.deadline)} ${icon('chevronRight')}</div>
      </div>
      <div style="font-size:48px; margin-left:12px;">🤖</div>
    </div>
    ` : `<div class="empty-state"><h4>No recommendations</h4><p>Add some skills to get personalized matches.</p></div>`}
  </div>
  ${BottomNav('home')}`;
  return { html, mount(){} };
}

/* ---------------- MEMORY ---------------- */
let memoryFilter = 'All';
let memorySearch = '';
function viewMemory(){
  const filters = ['All','Events','Tasks','Documents','Notes'];
  const kindMap = { Events:'event', Tasks:'task', Documents:'document', Notes:'note' };
  let items = Store.get().memories.slice().sort((a,b)=> new Date(b.date)-new Date(a.date));
  if(memoryFilter!=='All') items = items.filter(m=>m.kind===kindMap[memoryFilter]);
  if(memorySearch) items = items.filter(m=> (m.title+m.sub).toLowerCase().includes(memorySearch.toLowerCase()));

  const html = `
  ${Topbar({ title:'AI Memory', subtitle:'Your memories, safely stored', actions:`<button class="icon-btn" data-action="openAddMemory">${icon('plus')}</button>` })}
  <div class="screen">
    <div class="input-wrap" style="margin-bottom:14px;">
      ${icon('search','leading')}
      <input class="input" id="memory-search" placeholder="Search your memories..." value="${memorySearch}"/>
      <button class="trailing-btn" data-action="toggleMic">${icon('mic')}</button>
    </div>
    <div class="chip-row">
      ${filters.map(f=>`<button class="chip ${memoryFilter===f?'active':''}" data-action="setMemoryFilter" data-id="${f}">${f}</button>`).join('')}
    </div>
    ${items.length ? items.map(m=>ListItem({
      tone:m.tone, iconName:m.icon, title:m.title, sub:m.sub,
      onClickAttr:`data-action="openMemory" data-id="${m.id}"`,
      rightBadge:`<span class="badge tone-${m.tone}" style="text-transform:capitalize;">${m.kind}</span>`
    })).join('') : `<div class="empty-state"><div class="eicon">${icon('memory')}</div><h4>No memories yet</h4><p>Try a different search or ask Nexa to remember something.</p></div>`}
  </div>
  ${BottomNav('memory')}`;
  return { html, mount(root){
    const inp = root.querySelector('#memory-search');
    inp && inp.addEventListener('input', e=>{ memorySearch = e.target.value; rerender(); setTimeout(()=>{ const i=document.getElementById('memory-search'); if(i){ i.focus(); i.setSelectionRange(i.value.length,i.value.length);} },0); });
  }};
}

function memoryDetailSheet(id){
  const m = Store.get().memories.find(x=>x.id===id);
  if(!m) return;
  const metaRows = Object.entries(m.meta||{}).filter(([k,v])=>v).map(([k,v])=>`
    <div class="me-row"><span class="me-k" style="text-transform:capitalize;">${k.replace(/([A-Z])/g,' $1')}</span><span class="me-v">${v}</span></div>`).join('');
  openSheet(`
    <div class="li-icon tone-${m.tone}" style="width:52px;height:52px;border-radius:16px;margin-bottom:12px;">${icon(m.icon)}</div>
    <h3>${m.title}</h3>
    <p style="color:var(--ink-soft);font-size:13px;margin-top:2px;">${relDay(m.date)} • ${fmtDate(m.date)}</p>
    <div class="memory-extract" style="margin-top:16px;">
      <div class="me-head">${icon('sparkles')} Extracted by Nexa</div>
      ${metaRows || '<div class="me-row"><span class="me-k">Details</span><span class="me-v">—</span></div>'}
    </div>
    <div style="display:flex;gap:10px;margin-top:18px;">
      <button class="btn btn-outline" style="flex:1;" data-action="addToCalendarFromMemory" data-id="${m.id}">${icon('calendar')} Add to calendar</button>
      <button class="btn btn-ghost" data-action="deleteMemory" data-id="${m.id}">${icon('trash')}</button>
    </div>
  `);
}

function addMemorySheet(){
  openSheet(`
    <h3>Tell Nexa what to remember</h3>
    <p style="color:var(--ink-soft);font-size:13px;margin-top:2px;">Write naturally — Nexa extracts the details automatically.</p>
    <textarea class="input" id="add-memory-text" rows="4" style="margin-top:14px;padding-left:14px;" placeholder="e.g. I applied for the Microsoft internship today, interview is next Friday"></textarea>
    <button class="btn btn-primary btn-block" style="margin-top:14px;" data-action="submitAddMemory">${icon('sparkles')} Save memory</button>
  `, (root)=>{
    const t = root.querySelector('#add-memory-text'); t && t.focus();
  });
}

/* ---------------- AI CHAT ---------------- */
let recognizing = false;
function viewChat(){
  const s = Store.get();
  const suggestions = [
    "I registered for Smart India Hackathon",
    "Interview with Amazon next Tuesday",
    "Uploaded my updated resume",
    "Assignment due tomorrow night",
  ];
  const html = `
  ${Topbar({ title:'Nexa', subtitle:'Your AI memory assistant', actions:`<button class="icon-btn" data-nav="memory">${icon('memory')}</button>` })}
  <div class="screen" style="padding-bottom:170px;">
    <div class="chat-scroll" id="chat-scroll">
      ${s.chat.map(c=>`
        <div class="bubble-row ${c.from}">
          <div class="bubble-avatar ${c.from}">${c.from==='ai'?icon('sparkles'):s.user.initials}</div>
          <div>
            <div class="bubble">${c.text}</div>
            ${c.extract ? `<div class="memory-extract">
              <div class="me-head">${icon('sparkles')} Saved to memory</div>
              <div class="me-row"><span class="me-k">Title</span><span class="me-v">${c.extract.title}</span></div>
              <div class="me-row"><span class="me-k">Category</span><span class="me-v" style="text-transform:capitalize;">${c.extract.category}</span></div>
              <div class="me-row"><span class="me-k">Organization</span><span class="me-v">${c.extract.meta.organization}</span></div>
              <div class="me-row"><span class="me-k">Date</span><span class="me-v">${relDay(c.extract.date)}</span></div>
            </div>` : ''}
          </div>
        </div>`).join('')}
    </div>
  </div>
  <div style="position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:center;pointer-events:none;">
    <div style="width:100%;max-width:460px;padding:0 20px calc(96px + env(safe-area-inset-bottom));pointer-events:auto;">
      <div class="suggestion-row">${suggestions.map(sg=>`<button class="suggestion-chip" data-action="fillChat" data-id="${sg}">${sg}</button>`).join('')}</div>
      <div class="chat-input-bar">
        <button class="chat-round-btn mic ${recognizing?'recording':''}" id="mic-btn" data-action="toggleMic">${icon('mic')}</button>
        <input id="chat-input" placeholder="Tell Nexa anything..." autocomplete="off"/>
        <button class="chat-round-btn send" data-action="sendChat">${icon('send')}</button>
      </div>
    </div>
  </div>
  ${BottomNav('chat')}`;
  return { html, mount(root){
    const scroll = root.querySelector('#chat-scroll');
    if(scroll) scroll.scrollTop = scroll.scrollHeight;
    const inp = root.querySelector('#chat-input');
    if(inp){
      inp.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendChatMessage(); } });
    }
  }};
}

/* ---------------- EXPLORE / OPPORTUNITY HUB ---------------- */
let exploreFilter = 'All';
function viewExplore(){
  const filters = ['All','Hackathons','Internships','Contests','Fellowships'];
  const catMap = { Hackathons:'AI', Internships:'Internship', Contests:'ML', Fellowships:'Fellowship' };
  let items = [...OPPORTUNITIES].sort((a,b)=> b.match-a.match);
  if(exploreFilter==='Hackathons') items = items.filter(o=>/hackathon/i.test(o.title));
  if(exploreFilter==='Internships') items = items.filter(o=>/intern|product manager/i.test(o.title));
  if(exploreFilter==='Contests') items = items.filter(o=>/challenge|gsoc|outreachy/i.test(o.title));
  if(exploreFilter==='Fellowships') items = items.filter(o=>/fellowship/i.test(o.title));

  const toneGrad = { purple:'var(--card-purple)', blue:'var(--card-cream)', orange:'var(--card-brown)', green:'var(--card-green)', red:'var(--card-brown)' };
  const applied = new Set(Store.get().applications.map(a=>a.title));

  const html = `
  ${Topbar({ title:'Explore Opportunities', subtitle:'Filtered for your skills' })}
  <div class="screen">
    <div class="input-wrap" style="margin-bottom:14px;">
      ${icon('search','leading')}
      <input class="input" placeholder="Search hackathons, internships..." />
      <button class="trailing-btn" data-action="toggleMic">${icon('mic')}</button>
    </div>
    <div class="chip-row">${filters.map(f=>`<button class="chip ${exploreFilter===f?'active':''}" data-action="setExploreFilter" data-id="${f}">${f}</button>`).join('')}</div>
    ${items.length ? items.map(o=>`
      <div class="opp-card">
        <div class="opp-banner" style="background:${toneGrad[o.tone]};">
          ${icon('sparkles')}
          <div class="opp-match">${o.match}% match</div>
        </div>
        <div class="opp-body">
          <div class="opp-title">${o.title}</div>
          <div class="opp-meta">${o.org} • ${o.mode} • ${o.dateRange}</div>
          <div class="opp-tags">${o.tags.map(t=>`<span class="opp-tag">${t}</span>`).join('')}<span class="opp-tag">via ${o.source}</span></div>
          <div class="opp-why">${icon('sparkles')} ${o.why}</div>
          <div class="opp-foot">
            <span class="opp-deadline">Register by ${fmtDate(o.deadline)}</span>
            ${applied.has(o.title)
              ? `<span class="badge tone-green">Tracked</span>`
              : `<button class="btn btn-sm btn-primary" data-action="trackOpportunity" data-id="${o.id}">Track it</button>`}
          </div>
        </div>
      </div>`).join('') : `<div class="empty-state"><div class="eicon">${icon('compass')}</div><h4>No opportunities found</h4><p>We'll find some that match your skills soon.</p></div>`}
  </div>
  ${BottomNav('explore')}`;
  return { html, mount(){} };
}

/* ---------------- CALENDAR ---------------- */
let calState = (function(){ const d=new Date(); return { year:d.getFullYear(), month:d.getMonth(), selected: d.toISOString() }; })();
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function viewCalendar(){
  const { year, month } = calState;
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();

  const memoriesByDate = {};
  Store.get().memories.forEach(m=>{
    const d = new Date(m.date); const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    (memoriesByDate[key] = memoriesByDate[key]||[]).push(m);
  });

  let cells = '';
  for(let i=startDow-1;i>=0;i--){ cells += `<div class="cal-cell muted">${daysInPrevMonth-i}</div>`; }
  for(let d=1; d<=daysInMonth; d++){
    const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===d;
    const cellDate = new Date(year, month, d);
    const isSelected = new Date(calState.selected).toDateString() === cellDate.toDateString();
    const key = `${year}-${month}-${d}`;
    const evts = memoriesByDate[key] || [];
    cells += `<div class="cal-cell ${isToday?'today':''} ${isSelected&&!isToday?'selected':''}" data-action="selectCalDay" data-id="${cellDate.toISOString()}">
      <span>${d}</span>
      <div class="cal-dots">${evts.slice(0,3).map(e=>`<span class="cal-dot" style="background:var(--${e.tone}-500);"></span>`).join('')}</div>
    </div>`;
  }
  const totalCells = startDow + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for(let d=1; d<=trailing; d++){ cells += `<div class="cal-cell muted">${d}</div>`; }

  const selKey = (()=>{ const d=new Date(calState.selected); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; })();
  const selEvents = (memoriesByDate[selKey]||[]).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const upcoming = upcomingMemories(5);

  const html = `
  ${Topbar({ title:'Calendar', subtitle:'All your events and deadlines' })}
  <div class="screen">
    <div class="card" style="padding:16px;">
      <div class="cal-head">
        <h2>${MONTH_NAMES[month]} ${year}</h2>
        <div class="cal-nav">
          <button class="icon-btn" data-action="calPrev">${icon('chevronLeft')}</button>
          <button class="icon-btn" data-action="calNext">${icon('chevronRight')}</button>
        </div>
      </div>
      <div class="cal-grid">
        ${['S','M','T','W','T','F','S'].map(d=>`<div class="cal-dow">${d}</div>`).join('')}
        ${cells}
      </div>
    </div>

    <div class="section-head"><h2>${selEvents.length? fmtDate(calState.selected):'Selected day'}</h2></div>
    ${selEvents.length ? selEvents.map(m=>ListItem({ tone:m.tone, iconName:m.icon, title:m.title, sub:fmtTime(m.date), onClickAttr:`data-action="openMemory" data-id="${m.id}"` })).join('')
      : `<div class="empty-state" style="padding:24px 20px;"><div class="eicon">${icon('calendar')}</div><h4>No events this day</h4><p>Tap another date or add a new memory.</p></div>`}

    <div class="section-head"><h2>Upcoming</h2><span class="view-all" data-nav="memory">View all</span></div>
    ${upcoming.map(m=>ListItem({ tone:m.tone, iconName:m.icon, title:m.title, sub:`${relDay(m.date)}, ${fmtTime(m.date)}`, onClickAttr:`data-action="openMemory" data-id="${m.id}"` })).join('')}
  </div>
  ${BottomNav('calendar')}`;
  return { html, mount(){} };
}

/* ---------------- DOCUMENTS ---------------- */
let docFilter = 'All';
let docSearch = '';
function viewDocuments(){
  const filters = ['All','Resumes','ID Proofs','Certificates'];
  let docs = Store.get().documents.slice().sort((a,b)=> new Date(b.date)-new Date(a.date));
  if(docFilter!=='All') docs = docs.filter(d=>d.tag===docFilter);
  if(docSearch) docs = docs.filter(d=> d.name.toLowerCase().includes(docSearch.toLowerCase()));

  const html = `
  ${Topbar({ title:'Documents', subtitle:'Your important files', actions:`<button class="icon-btn" data-action="triggerUpload">${icon('upload')}</button>` })}
  <div class="screen">
    <div class="input-wrap" style="margin-bottom:14px;">
      ${icon('search','leading')}
      <input class="input" id="doc-search" placeholder="Search documents..." value="${docSearch}"/>
      <div style="position:absolute; right:16px; top:50%; transform:translateY(-50%); color:var(--ink-soft);">${icon('filter')}</div>
    </div>
    <div class="chip-row">${filters.map(f=>`<button class="chip ${docFilter===f?'active':''}" data-action="setDocFilter" data-id="${f}">${f}</button>`).join('')}</div>
    <input type="file" id="doc-upload-input" class="hidden" multiple />
    ${docs.length ? docs.map(d=>{
      const di = docIconFor(d.type);
      return `<div class="doc-row" data-action="openDoc" data-id="${d.id}">
        <div class="doc-icon tone-${di.tone}">${icon(di.name)}</div>
        <div style="flex:1;min-width:0;">
          <div class="doc-name">${d.name}</div>
          <div class="doc-meta">${fmtDate(d.date)} • ${d.size}</div>
        </div>
        <div class="li-chev">${icon('chevronRight')}</div>
      </div>`;
    }).join('') : `<div class="empty-state"><div class="eicon">${icon('fileText')}</div><h4>No documents found</h4><p>Upload your resume, ID, or certificates.</p></div>`}
    <button class="btn btn-outline btn-block" style="margin-top:6px;" data-action="triggerUpload">${icon('upload')} Upload document</button>
  </div>
  ${BottomNav('memory')}`;
  return { html, mount(root){
    const inp = root.querySelector('#doc-search');
    inp && inp.addEventListener('input', e=>{ docSearch = e.target.value; rerender(); setTimeout(()=>{ const i=document.getElementById('doc-search'); if(i){ i.focus(); i.setSelectionRange(i.value.length,i.value.length);} },0); });
    const up = root.querySelector('#doc-upload-input');
    up && up.addEventListener('change', handleDocUpload);
  }};
}

/* ---------------- ANALYTICS ---------------- */
function viewAnalytics(){
  const apps = Store.get().applications;
  const byMonth = {};
  apps.forEach(a=>{ const d=new Date(a.appliedOn); const k = MONTH_NAMES[d.getMonth()].slice(0,3); byMonth[k]=(byMonth[k]||0)+1; });
  const months = Object.keys(byMonth);
  const maxV = Math.max(1, ...Object.values(byMonth));
  const cats = categoryCounts();
  const total = Object.values(cats).reduce((a,b)=>a+b,0) || 1;
  const catColors = { Hackathons:'#8FA491', Internships:'#C2CEB7', 'Open Source':'#D3BA9E', Contests:'#8C7CA5' };
  let acc = 0;
  const donutStops = Object.entries(cats).map(([k,v])=>{
    const pct = v/total*100; const start = acc; acc += pct;
    return `${catColors[k]||'#999'} ${start}% ${acc}%`;
  }).join(', ');

  const statuses = ['Applied','Shortlisted','Interview','Offer','Rejected'];
  const statusCounts = statuses.map(s=> apps.filter(a=>a.status===s).length);

  const html = `
  ${Topbar({ title:'Analytics', subtitle:'Your growth, your journey' })}
  <div class="screen">
    <div class="card chart-card" style="margin-bottom:16px;">
      <div style="display:flex;align-items:baseline;justify-content:space-between;">
        <div>
          <div style="font-size:12px;color:var(--ink-soft);font-weight:600;">Opportunities Applied</div>
          <div style="font-family:var(--font-display);font-size:28px;font-weight:600;">${apps.length}</div>
        </div>
        <span class="badge tone-green">+${Math.max(1,Math.round(apps.length*0.3))} this month</span>
      </div>
      <div class="bars">
        ${months.length? months.map(m=>`<div class="bar-col"><div class="bar" style="height:${(byMonth[m]/maxV*100)}%;"></div><div class="bar-lbl">${m}</div></div>`).join('') : '<div class="empty-state" style="padding:10px;">No data yet</div>'}
      </div>
    </div>

    <div class="card chart-card" style="margin-bottom:16px;">
      <div style="font-size:12px;color:var(--ink-soft);font-weight:600;margin-bottom:14px;">By Category</div>
      <div class="donut-wrap">
        <div style="width:110px;height:110px;border-radius:50%;background:conic-gradient(${donutStops});box-shadow:var(--shadow-soft);flex-shrink:0;position:relative;">
          <div style="position:absolute;inset:18px;background:var(--paper);border-radius:50%;"></div>
        </div>
        <div class="legend">
          ${Object.entries(cats).map(([k,v])=>`<div class="legend-row"><span class="legend-dot" style="background:${catColors[k]||'#999'};"></span>${k}<span class="legend-pct">${Math.round(v/total*100)}%</span></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="card chart-card">
      <div style="font-size:12px;color:var(--ink-soft);font-weight:600;margin-bottom:14px;">Application Pipeline</div>
      ${statuses.map((s,i)=>`
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="width:70px;font-size:11.5px;color:var(--ink-soft);font-weight:600;">${s}</span>
          <div style="flex:1;height:8px;border-radius:4px;background:var(--cream-deep);overflow:hidden;">
            <div style="height:100%;width:${(statusCounts[i]/Math.max(1,apps.length)*100)}%;background:var(--gradient-brand);border-radius:4px;"></div>
          </div>
          <span style="font-family:var(--font-mono);font-size:11.5px;font-weight:700;width:16px;text-align:right;">${statusCounts[i]}</span>
        </div>`).join('')}
    </div>
  </div>
  ${BottomNav('profile')}`;
  return { html, mount(){} };
}

/* ---------------- PROFILE ---------------- */
function viewProfile(){
  const s = Store.get();
  const html = `
  ${Topbar({ title:'Profile', subtitle:'Your personal space' })}
  <div class="screen">
    <div class="profile-head">
      <div class="avatar-lg">${s.user.initials}</div>
      <div style="font-family:var(--font-display);font-size:19px;font-weight:600;">${s.user.name}</div>
      <div style="font-size:12.5px;color:var(--ink-soft);">${s.user.email}</div>
      <div class="profile-stats">
        <div class="pstat"><div class="n">${Store.get().applications.length}</div><div class="l">Opportunities</div></div>
        <div class="pstat"><div class="n">${Store.get().memories.filter(m=>m.category==='interview').length + Store.get().applications.filter(a=>a.status==='Interview').length}</div><div class="l">Interviews</div></div>
        <div class="pstat"><div class="n">${Store.get().applications.filter(a=>a.status==='Offer').length}</div><div class="l">Wins</div></div>
      </div>
    </div>

    <div class="menu-row" data-nav="analytics"><div class="mi">${icon('pieChart')}</div><div class="mt">Analytics</div>${icon('chevronRight')}</div>
    <div class="menu-row" data-nav="documents"><div class="mi">${icon('fileText')}</div><div class="mt">Document Vault</div>${icon('chevronRight')}</div>
    <div class="menu-row" data-nav="settings"><div class="mi">${icon('settings')}</div><div class="mt">Settings & Reminders</div>${icon('chevronRight')}</div>
    <div class="divider"></div>
    <div class="menu-row" data-action="openConnections"><div class="mi">${icon('wifi')}</div><div class="mt">Connected Accounts</div>${icon('chevronRight')}</div>
    <div class="menu-row" data-action="exportData"><div class="mi">${icon('download')}</div><div class="mt">Backup & Export Data</div>${icon('chevronRight')}</div>
    <div class="menu-row" data-action="doLogout"><div class="mi">${icon('logout')}</div><div class="mt">Log Out</div></div>
    <div class="menu-row danger" data-action="confirmReset" style="margin-top:24px; border-top:1px solid var(--hairline);"><div class="mi">${icon('trash')}</div><div class="mt">Reset Local Data</div></div>
  </div>
  ${BottomNav('profile')}`;
  return { html, mount(){} };
}

/* ---------------- SETTINGS ---------------- */
function viewSettings(){
  const p = Store.get().reminderPrefs;
  const configured = (typeof FIREBASE_CONFIGURED !== 'undefined') && FIREBASE_CONFIGURED;
  const items = [
    { key:'w1', label:'1 week before', sub:'Stay prepared' },
    { key:'d1', label:'1 day before', sub:'Final preparation' },
    { key:'h1', label:'1 hour before', sub:'Get set' },
    { key:'m30', label:'30 minutes before', sub:'Last call' },
  ];
  const html = `
  ${Topbar({ title:'Reminder Settings', subtitle:'Get reminded, always', back:'profile' })}
  <div class="screen">
    <div class="card" style="padding:14px 16px;margin-bottom:16px;border-color:${configured?'rgba(95,143,110,.3)':'rgba(217,154,78,.35)'};background:${configured?'var(--green-100)':'var(--orange-100)'};">
      <div style="display:flex;gap:10px;align-items:flex-start;">
        <div style="flex-shrink:0;margin-top:1px;">${icon(configured?'wifi':'info')}</div>
        <div style="font-size:12.5px;line-height:1.5;color:var(--ink);">
          ${configured
            ? `<b>Firebase connected.</b> Turning on Push notifications below will request permission and register this device for real background reminders — delivered even when Nexus AI is closed.`
            : `<b>Background push isn't connected yet.</b> Reminders currently only fire while this tab is open. Add your Firebase project keys to <code>js/firebase-config.js</code> and deploy the Cloud Function to unlock real background push — see <code>README-PUSH.md</code>.`}
        </div>
      </div>
    </div>

    ${items.map(it=>`
      <div class="reminder-toggle-row">
        <div><div class="rt-title">${it.label}</div><div class="rt-sub">${it.sub}</div></div>
        <button class="toggle ${p[it.key]?'on':''}" data-action="togglePref" data-id="${it.key}"></button>
      </div>`).join('')}
    <div class="divider"></div>
    <div class="reminder-toggle-row">
      <div><div class="rt-title">Voice reminders</div><div class="rt-sub">Nexa speaks it out loud (while app is open)</div></div>
      <button class="toggle ${p.voice?'on':''}" data-action="togglePref" data-id="voice"></button>
    </div>
    <div class="reminder-toggle-row">
      <div><div class="rt-title">Background push notifications</div><div class="rt-sub">${configured ? 'Real alerts, even when the app is closed' : 'Needs Firebase — see banner above'}</div></div>
      <button class="toggle ${p.notif?'on':''}" data-action="togglePref" data-id="notif"></button>
    </div>
    <p style="font-size:11.5px;color:var(--ink-faint);margin-top:14px;line-height:1.5;">Voice uses your browser's built-in speech engine and only works in the foreground. Background push uses Firebase Cloud Messaging and a scheduled Cloud Function that checks for due reminders every few minutes.</p>
    <button class="btn btn-primary btn-block" style="margin-top:20px;" data-action="savePrefs">Save preferences</button>
  </div>
  ${BottomNav('profile')}`;
  return { html, mount(){} };
}
