/* ================= DATE HELPERS ================= */
function addDays(n){ const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString(); }
function fmtDate(iso, opts){
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', opts || { month:'short', day:'numeric', year:'numeric' });
}
function fmtTime(iso){
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
}
function relDay(iso){
  const d = new Date(iso), now = new Date();
  const d0 = new Date(d.getFullYear(),d.getMonth(),d.getDate());
  const n0 = new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const diff = Math.round((d0-n0)/86400000);
  if(diff===0) return 'Today';
  if(diff===1) return 'Tomorrow';
  if(diff===-1) return 'Yesterday';
  if(diff>1 && diff<7) return `In ${diff} days`;
  if(diff<0) return `${Math.abs(diff)}d ago`;
  return fmtDate(iso);
}
function uid(){ return 'id_'+Math.random().toString(36).slice(2,10)+Date.now().toString(36); }

/* ================= SEED DATA ================= */
const SEED = {
  onboarded: false,
  user: {
    name: 'Bhanu Sri',
    firstName: 'Bhanu',
    initials: 'BS',
    email: 'bhanu.sri@example.com',
    interests: ['React','Artificial Intelligence','Machine Learning','Cloud','Python'],
    connected: { google:true, github:true, linkedin:false, calendar:true, gmail:true, drive:false }
  },
  reminderPrefs: { w1:true, d1:true, h1:true, m30:true, voice:true, notif:true },
  memories: [],
  documents: [],
  applications: [],
  chat: [
    { id:uid(), from:'ai', text:"Good morning, Bhanu 🌞 I'm Nexa — I keep track of everything so you don't have to. Tell me about anything you've applied to, registered for, or need to remember." }
  ]
};

/* ================= EXPLORE / OPPORTUNITY FEED (mock aggregation) ================= */
const OPPORTUNITIES = [];

const STATUS_TONE = {
  Applied:'blue', Shortlisted:'purple', Interview:'orange', 'Interview Scheduled':'orange',
  Assessment:'orange', Offer:'green', Rejected:'red', Withdrawn:'red', Completed:'green', Registered:'purple', Pending:'red'
};
