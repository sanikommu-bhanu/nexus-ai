/* ================= ROUTER ================= */
const ROUTES = {
  onboarding1: viewOnboarding1,
  onboarding2: viewOnboarding2,
  onboarding3: viewOnboarding3,
  home: viewHome,
  memory: viewMemory,
  chat: viewChat,
  explore: viewExplore,
  calendar: viewCalendar,
  documents: viewDocuments,
  analytics: viewAnalytics,
  profile: viewProfile,
  settings: viewSettings,
};

let currentMount = null;

function currentRoute(){
  const h = (location.hash || '').replace('#','').trim();
  return ROUTES[h] ? h : null;
}

function navigate(route){
  if(location.hash === '#'+route){ rerender(); return; }
  location.hash = route;
}

function render(){
  const s = Store.get();
  let route = currentRoute();

  if(!s.onboarded){
    if(!route || !route.startsWith('onboarding')) route = 'onboarding1';
  } else if(!route){
    route = 'home';
  }
  if(location.hash !== '#'+route) history.replaceState(null,'','#'+route);

  const view = ROUTES[route]();
  const appEl = document.getElementById('app');
  appEl.innerHTML = `<div class="device" id="device-root">${view.html}</div>`;
  currentMount = view.mount;
  const root = document.getElementById('device-root');
  if(view.mount) view.mount(root);
  root.scrollTop = 0;
  window.scrollTo(0,0);
}

function rerender(){ render(); }

window.addEventListener('hashchange', render);
