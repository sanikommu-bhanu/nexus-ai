/* ================= SPEECH: TEXT TO SPEECH ================= */
function speakText(text){
  if(!('speechSynthesis' in window)){ toast('Voice not supported in this browser', 'error'); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.98; u.pitch = 1.02;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v=>/female|samantha|victoria|zira/i.test(v.name)) || voices[0];
  if(preferred) u.voice = preferred;
  window.speechSynthesis.speak(u);
}

function dailyBriefingText(){
  const s = Store.get();
  const upcoming = upcomingMemories(3);
  let parts = [`${greetingWord()}, ${s.user.firstName}.`];
  if(upcoming.length===0){ parts.push("You have a clear schedule. Nothing urgent is on your plate today."); }
  else{
    parts.push("Here is your briefing.");
    upcoming.forEach(m=>{
      parts.push(`${m.title}, ${relDay(m.date).toLowerCase()}${m.date ? ' at '+fmtTime(m.date) : ''}.`);
    });
  }
  parts.push("Have a wonderful day.");
  return parts.join(' ');
}

/* ================= SPEECH: SPEECH TO TEXT ================= */
let recognizer = null;
function toggleMic(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ toast('Voice input not supported in this browser', 'error'); return; }
  if(recognizing){ recognizer && recognizer.stop(); return; }
  recognizer = new SR();
  recognizer.lang = 'en-US';
  recognizer.interimResults = false;
  recognizer.onstart = ()=>{ recognizing = true; rerender(); };
  recognizer.onend = ()=>{ recognizing = false; rerender(); };
  recognizer.onerror = ()=>{ recognizing = false; rerender(); toast('Could not hear you — try again', 'error'); };
  recognizer.onresult = (e)=>{
    const text = e.results[0][0].transcript;
    const inp = document.getElementById('chat-input');
    if(inp) inp.value = text;
  };
  recognizer.start();
}

/* ================= ICS EXPORT ================= */
function downloadBlob(filename, content, type){
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
function generateICS(m){
  const dt = new Date(m.date);
  const pad = n=> String(n).padStart(2,'0');
  const stamp = `${dt.getUTCFullYear()}${pad(dt.getUTCMonth()+1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;
  return `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Nexus AI//EN\r\nBEGIN:VEVENT\r\nUID:${m.id}@nexusai\r\nDTSTAMP:${stamp}\r\nDTSTART:${stamp}\r\nSUMMARY:${m.title}\r\nDESCRIPTION:${(m.sub||'').replace(/\n/g,' ')}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
}

/* ================= CHAT ================= */
function sendChatMessage(){
  const inp = document.getElementById('chat-input');
  if(!inp) return;
  const text = inp.value.trim();
  if(!text) return;
  inp.value = '';

  Store.set(s=>{ s.chat.push({ id: uid(), from:'user', text: esc(text) }); });

  const extract = parseMemoryFromText(text);
  const replyText = `Got it — I've saved <b>${extract.title}</b> and set a reminder for ${relDay(extract.date).toLowerCase()}. You can find it in Memory anytime.`;

  Store.set(s=>{
    s.memories.push(extract);
    s.chat.push({ id: uid(), from:'ai', text: replyText, extract });
  });

  rerender();
  const prefs = Store.get().reminderPrefs;
  if(prefs.voice) speakText(`Saved. ${extract.title}, ${relDay(extract.date)}.`);
}

/* ================= DOC UPLOAD ================= */
const UPLOADED_BLOBS = {}; // in-memory only (not persisted) — real File objects for this session's uploads
function handleDocUpload(e){
  const files = Array.from(e.target.files || []);
  if(!files.length) return;
  files.forEach(f=>{
    const lower = f.name.toLowerCase();
    let type = 'pdf', tag = 'Certificates';
    if(/resume|cv/.test(lower)){ type='pdf'; tag='Resumes'; }
    else if(/aadhaar|pan|passport|licen[cs]e|id/.test(lower)){ type='id'; tag='ID Proofs'; }
    else if(/jpg|jpeg|png/.test(lower)){ type='image'; tag='Certificates'; }
    else { type='cert'; tag='Certificates'; }
    const sizeKB = f.size/1024;
    const sizeStr = sizeKB>1024 ? (sizeKB/1024).toFixed(1)+' MB' : Math.max(1,Math.round(sizeKB))+' KB';
    const docId = uid();
    Store.set(s=>{
      s.documents.push({ id:docId, name:esc(f.name), type, tag, size:sizeStr, date:new Date().toISOString() });
    });
    UPLOADED_BLOBS[docId] = f;
  });
  toast(`Uploaded ${files.length} document${files.length>1?'s':''}`);
  rerender();
}

/* ================= ACTION HANDLER ================= */
function handleAction(action, ds, el){
  const store = Store;
  switch(action){
    case 'toggleConnect': {
      store.set(s=>{ s.user.connected[ds.id] = !s.user.connected[ds.id]; });
      rerender();
      break;
    }
    case 'finishOnboarding': {
      store.set(s=>{ s.onboarded = true; });
      navigate('home');
      toast(`Welcome, ${store.get().user.firstName}!`);
      break;
    }
    case 'speakBriefing': {
      speakText(dailyBriefingText());
      toast('Nexa is speaking your briefing');
      break;
    }
    case 'openMemory': memoryDetailSheet(ds.id); break;
    case 'openAddMemory': addMemorySheet(); break;
    case 'submitAddMemory': {
      const t = document.getElementById('add-memory-text');
      const text = t ? t.value.trim() : '';
      if(!text){ toast('Write something first', 'error'); return; }
      const extract = parseMemoryFromText(text);
      store.set(s=>{ s.memories.push(extract); });
      closeSheet();
      toast('Memory saved');
      rerender();
      break;
    }
    case 'deleteMemory': {
      store.set(s=>{ s.memories = s.memories.filter(m=>m.id!==ds.id); });
      closeSheet();
      toast('Memory deleted');
      rerender();
      break;
    }
    case 'addToCalendarFromMemory': {
      const m = store.get().memories.find(x=>x.id===ds.id);
      if(m){ downloadBlob(`${m.title}.ics`, generateICS(m), 'text/calendar'); toast('Calendar file downloaded'); }
      break;
    }
    case 'setMemoryFilter': memoryFilter = ds.id; rerender(); break;
    case 'fillChat': {
      const inp = document.getElementById('chat-input');
      if(inp){ inp.value = ds.id; inp.focus(); }
      break;
    }
    case 'toggleMic': toggleMic(); break;
    case 'sendChat': sendChatMessage(); break;
    case 'setExploreFilter': exploreFilter = ds.id; rerender(); break;
    case 'trackOpportunity': {
      const o = OPPORTUNITIES.find(x=>x.id===ds.id);
      if(o){
        store.set(s=>{
          s.applications.push({ id:uid(), title:o.title, org:o.org, status:'Applied', appliedOn:new Date().toISOString() });
          s.memories.push({ id:uid(), kind:'event', category:/hackathon/i.test(o.title)?'hackathon':'internship', title:o.title, sub:`${o.org} • Register by ${relDay(o.deadline)}`, date:o.deadline, tone:o.tone, icon:'sparkles', meta:{ organization:o.org, status:'Applied', appliedOn:fmtDate(new Date()) } });
        });
        toast(`Tracking ${o.title}`);
        rerender();
      }
      break;
    }
    case 'calPrev': {
      calState.month--; if(calState.month<0){ calState.month=11; calState.year--; }
      rerender();
      break;
    }
    case 'calNext': {
      calState.month++; if(calState.month>11){ calState.month=0; calState.year++; }
      rerender();
      break;
    }
    case 'selectCalDay': calState.selected = ds.id; rerender(); break;
    case 'setDocFilter': docFilter = ds.id; rerender(); break;
    case 'triggerUpload': {
      const inp = document.getElementById('doc-upload-input');
      if(inp) inp.click();
      else { const tmp=document.createElement('input'); tmp.type='file'; tmp.multiple=true; tmp.addEventListener('change',handleDocUpload); tmp.click(); }
      break;
    }
    case 'openDoc': {
      const d = store.get().documents.find(x=>x.id===ds.id);
      if(!d) return;
      const di = docIconFor(d.type);
      const hasRealFile = !!UPLOADED_BLOBS[d.id];
      openSheet(`
        <div class="li-icon tone-${di.tone}" style="width:52px;height:52px;border-radius:16px;margin-bottom:12px;">${icon(di.name)}</div>
        <h3>${d.name}</h3>
        <p style="color:var(--ink-soft);font-size:13px;margin-top:2px;">${d.tag} • ${d.size} • Uploaded ${fmtDate(d.date)}</p>
        ${!hasRealFile ? `<p style="font-size:11.5px;color:var(--ink-faint);margin-top:8px;">This is sample data — upload your own file to enable a real download.</p>` : ''}
        <div style="display:flex;gap:10px;margin-top:18px;">
          <button class="btn btn-outline" style="flex:1;" data-action="downloadDoc" data-id="${d.id}">${icon('download')} Download</button>
          <button class="btn btn-ghost" data-action="deleteDoc" data-id="${d.id}">${icon('trash')}</button>
        </div>
      `);
      break;
    }
    case 'downloadDoc': {
      const file = UPLOADED_BLOBS[ds.id];
      if(file){
        const url = URL.createObjectURL(file);
        const a = document.createElement('a'); a.href = url; a.download = file.name;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
      } else {
        toast('Sample document — nothing to download', 'error');
      }
      break;
    }
    case 'deleteDoc': {
      store.set(s=>{ s.documents = s.documents.filter(d=>d.id!==ds.id); });
      delete UPLOADED_BLOBS[ds.id];
      closeSheet(); toast('Document removed'); rerender();
      break;
    }
    case 'closeSheetOnly': closeSheet(); break;
    case 'openConnections': {
      const s = store.get();
      const rows = [
        { key:'google', label:'Google Account', ic:'wifi', tone:'blue' },
        { key:'github', label:'GitHub', ic:'repo', tone:'purple' },
        { key:'linkedin', label:'LinkedIn', ic:'briefcase', tone:'blue' },
        { key:'calendar', label:'Google Calendar', ic:'calendar', tone:'orange' },
        { key:'gmail', label:'Gmail', ic:'mail', tone:'red' },
        { key:'drive', label:'Google Drive', ic:'cloud', tone:'green' },
      ];
      openSheet(`
        <h3>Connected Accounts</h3>
        <p style="color:var(--ink-soft);font-size:13px;margin-top:2px;margin-bottom:14px;">Manage what Nexa can read from.</p>
        <div class="connect-list">
          ${rows.map(r=>`<div class="connect-row"><div class="ci tone-${r.tone}">${icon(r.ic)}</div><div class="cn">${r.label}</div><button class="toggle ${s.user.connected[r.key]?'on':''}" data-action="toggleConnect" data-id="${r.key}"></button></div>`).join('')}
        </div>
      `);
      break;
    }
    case 'exportData': {
      downloadBlob('nexus-ai-backup.json', JSON.stringify(store.get(), null, 2), 'application/json');
      toast('Data exported');
      break;
    }
    case 'confirmReset': {
      openSheet(`
        <h3>Reset Nexus AI?</h3>
        <p style="color:var(--ink-soft);font-size:13px;margin-top:6px;">This clears all memories, documents, and preferences from this device. This can't be undone.</p>
        <div style="display:flex;gap:10px;margin-top:18px;">
          <button class="btn btn-ghost" style="flex:1;" data-action="closeSheetOnly">Cancel</button>
          <button class="btn btn-primary" style="flex:1;background:var(--red-500);" data-action="doReset">Reset</button>
        </div>
      `);
      break;
    }
    case 'doReset': {
      store.reset();
      closeSheet();
      location.hash = 'onboarding1';
      rerender();
      break;
    }
    case 'togglePref': {
      store.set(s=>{ s.reminderPrefs[ds.id] = !s.reminderPrefs[ds.id]; });
      rerender();
      break;
    }
    case 'savePrefs': {
      const prefs = store.get().reminderPrefs;
      if(prefs.notif){
        if(typeof FIREBASE_CONFIGURED === 'undefined' || !FIREBASE_CONFIGURED){
          toast('Add your Firebase keys to enable background push — see README-PUSH.md', 'error');
          navigate('profile');
          break;
        }
        toast('Enabling background reminders…');
        NexusPush.enable().then(()=>{
          toast('Background push enabled — reminders will arrive even when the app is closed');
          navigate('profile');
        }).catch(err=>{
          const msgs = {
            permission_denied: 'Notification permission was denied in your browser settings.',
            messaging_unsupported: 'This browser does not support push messaging.',
            not_configured: 'Firebase is not configured yet.',
            no_token: 'Could not get a push token — check your Firebase Web Push certificate (VAPID key).',
          };
          toast(msgs[err.message] || 'Could not enable background push', 'error');
        });
      } else {
        NexusPush.disable();
        toast('Preferences saved');
        navigate('profile');
      }
      break;
    }
  }
}

/* ================= GLOBAL EVENT DELEGATION ================= */
document.addEventListener('click', (e)=>{
  const navEl = e.target.closest('[data-nav]');
  if(navEl){ navigate(navEl.dataset.nav); return; }
  const actEl = e.target.closest('[data-action]');
  if(actEl){ handleAction(actEl.dataset.action, actEl.dataset, actEl); return; }
});

/* ================= INIT ================= */
if('speechSynthesis' in window){
  window.speechSynthesis.onvoiceschanged = ()=>{ window.speechSynthesis.getVoices(); };
}
if(typeof NexusPush !== 'undefined'){
  NexusPush.registerServiceWorker();
}
Store.subscribe(()=>{
  if(typeof FIREBASE_CONFIGURED !== 'undefined' && FIREBASE_CONFIGURED){
    NexusPush.syncAllReminders().catch(e=> console.warn('Reminder sync failed', e));
  }
});
render();
