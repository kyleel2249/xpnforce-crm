// /js/app.js — XPNFORCE App Bootstrap

import { Router }       from './modules/router.js';
import { AuthManager }  from './modules/auth.js';
import { NavManager }   from './modules/nav.js';
import { AIAssistant }  from './modules/ai-assistant.js';
import { NotifManager } from './modules/notifications.js';
import { ToastManager } from './modules/toast.js';
import { DataStore }    from './modules/datastore.js';
import { EventBus }     from './utils/eventbus.js';

// ── Global singletons (accessible across modules) ──────────────
window.XPN = {
  router:   null,
  auth:     null,
  nav:      null,
  ai:       null,
  notifs:   null,
  toast:    null,
  store:    null,
  bus:      new EventBus(),
  user:     null,
};

async function bootstrap() {
  const { bus } = window.XPN;

  // Toast is ready immediately
  window.XPN.toast = new ToastManager();

  // Auth first — the login screen shouldn't depend on the data layer
  window.XPN.auth = new AuthManager();

  // Data store (local + firebase) — wrapped so a failure here can't kill auth
  window.XPN.store = new DataStore();
  try {
    await window.XPN.store.init();
  } catch (err) {
    console.error('DataStore init failed, continuing with empty store:', err);
  }

  // Wait for auth state
  window.XPN.auth.onReady(async (user) => {
    if (!user) return; // stays on auth screen

    window.XPN.user = user;

    // Boot rest of app
    window.XPN.nav    = new NavManager();
    window.XPN.router = new Router();
    window.XPN.ai     = new AIAssistant();
    window.XPN.notifs = new NotifManager();

    window.XPN.nav.render();
    window.XPN.notifs.init();

    // Show app
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');

    // Navigate to last route or dashboard
    const saved = sessionStorage.getItem('xpn-route') || 'dashboard';
    window.XPN.router.navigate(saved, false);

    // AI sidebar events
    document.getElementById('ai-toggle').addEventListener('click', () => {
      window.XPN.ai.togglePanel();
    });
    document.getElementById('ai-close').addEventListener('click', () => {
      window.XPN.ai.closePanel();
    });
    document.getElementById('ai-send').addEventListener('click', () => {
      window.XPN.ai.sendMessage();
    });
    document.getElementById('ai-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') window.XPN.ai.sendMessage();
    });

    // Sidebar collapse
    document.getElementById('sidebar-collapse').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
    });

    // Mobile menu
    document.getElementById('mobile-menu').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    });

    // Notifications
    document.getElementById('notif-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('notif-panel').classList.toggle('hidden');
    });
    document.getElementById('mark-all-read').addEventListener('click', () => {
      window.XPN.notifs.markAllRead();
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#notif-panel') && !e.target.closest('#notif-btn')) {
        document.getElementById('notif-panel').classList.add('hidden');
      }
    });

    // Global search
    const searchInput = document.getElementById('global-search');
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => globalSearch(searchInput.value), 300);
    });
    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        const res = document.getElementById('search-results');
        if (res) res.remove();
      }, 200);
    });

    // Modal close
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal-overlay')) closeModal();
    });

    // Neural activity animation
    startNeuralAnimation();

    window.XPN.toast.show('Welcome back, ' + (user.displayName || 'Demo User') + '!', 'success');
  });
}

function globalSearch(query) {
  const parent = document.querySelector('.relative.hidden.md\\:block');
  let res = document.getElementById('search-results');
  if (!res) {
    res = document.createElement('div');
    res.id = 'search-results';
    parent.appendChild(res);
  }
  if (!query.trim()) { res.remove(); return; }

  const allItems = [
    ...window.XPN.store.contacts.slice(0, 5).map(c => ({ type: 'Contact', label: c.name, icon: '👤', route: 'contacts' })),
    ...window.XPN.store.deals.slice(0, 5).map(d => ({ type: 'Deal', label: d.title, icon: '💼', route: 'pipeline' })),
    ...window.XPN.store.tickets.slice(0, 5).map(t => ({ type: 'Ticket', label: t.subject, icon: '🎫', route: 'support' })),
  ].filter(i => i.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

  res.innerHTML = allItems.length
    ? allItems.map(i => `
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-space-600 cursor-pointer transition-colors text-slate-light hover:text-white"
             onclick="window.XPN.router.navigate('${i.route}')">
          <span>${i.icon}</span>
          <div>
            <div class="text-xs font-600 text-slate uppercase">${i.type}</div>
            <div class="text-sm">${i.label}</div>
          </div>
        </div>`).join('')
    : '<div class="p-3 text-sm text-slate text-center">No results for "' + query + '"</div>';
}

function startNeuralAnimation() {
  let tick = 0;
  const tasks = [3, 7, 12, 5, 9, 2, 15, 8];
  const conf  = ['98.2%', '96.5%', '99.1%', '97.8%', '95.3%', '98.9%'];
  setInterval(() => {
    tick++;
    document.getElementById('ai-tasks-count').textContent = tasks[tick % tasks.length] + ' tasks';
    document.getElementById('ai-confidence').textContent = conf[tick % conf.length];
  }, 4000);
}

// ── Modal helpers (global) ─────────────────────────────────────
window.openModal = function(html, title = '') {
  const overlay = document.getElementById('modal-overlay');
  const box     = document.getElementById('modal-box');
  box.innerHTML = `
    <div class="flex items-center justify-between p-5 border-b border-space-500">
      <h2 class="font-display font-600 text-white text-base">${title}</h2>
      <button onclick="closeModal()" class="text-slate hover:text-white transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="p-5">${html}</div>`;
  overlay.classList.remove('hidden');
};
window.closeModal = function() {
  document.getElementById('modal-overlay').classList.add('hidden');
};

bootstrap().catch(err => console.error('Bootstrap failed:', err));
