/* ================= STORE ================= */
let STORE_KEY = 'nexus_ai_state_guest';

const Store = (function(){
  let state = load();
  const listeners = new Set();

  function load(){
    try{
      const raw = localStorage.getItem(STORE_KEY);
      if(raw) return JSON.parse(raw);
    }catch(e){ console.warn('Store load failed', e); }
    return JSON.parse(JSON.stringify(SEED));
  }
  function persist(){
    try{ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }catch(e){ console.warn('Store persist failed', e); }
  }
  function get(){ return state; }
  function set(mutator){
    mutator(state);
    persist();
    listeners.forEach(fn=>fn(state));
  }
  function subscribe(fn){ listeners.add(fn); return ()=>listeners.delete(fn); }
  function reset(){ state = JSON.parse(JSON.stringify(SEED)); persist(); listeners.forEach(fn=>fn(state)); }

  function init(uid) {
    STORE_KEY = `nexus_ai_state_${uid}`;
    state = load();
    listeners.forEach(fn=>fn(state));
  }

  return { init, get, set, subscribe, reset };
})();

/* ================= DERIVED HELPERS ================= */
function upcomingMemories(limit){
  const now = Date.now();
  return Store.get().memories
    .filter(m=> m.kind!=='note')
    .filter(m=> new Date(m.date).getTime() >= now - 86400000)
    .sort((a,b)=> new Date(a.date)-new Date(b.date))
    .slice(0, limit || 999);
}
function todaysTaskCount(){
  const now = new Date();
  return Store.get().memories.filter(m=>{
    const d = new Date(m.date);
    return d.toDateString()===now.toDateString();
  }).length;
}
function categoryCounts(){
  const apps = Store.get().applications;
  const cats = {};
  apps.forEach(a=>{
    const c = /hackathon/i.test(a.title) ? 'Hackathons' : /intern|job/i.test(a.title) ? 'Internships' : /gsoc|outreachy|fellowship/i.test(a.title) ? 'Open Source' : 'Contests';
    cats[c] = (cats[c]||0)+1;
  });
  return cats;
}
