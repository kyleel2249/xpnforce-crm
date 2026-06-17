// /js/modules/notifications.js
export class NotifManager {
  constructor() {
    this._notifs = [];
    this._unread = 0;
  }

  init() {
    this._notifs = [
      { id:1, type:'deal',    text:'Deal "Enterprise Suite" moved to Proposal', time:'2m ago',  read:false, icon:'💼' },
      { id:2, type:'ticket',  text:'Critical ticket #T0043 needs attention',    time:'8m ago',  read:false, icon:'🎫' },
      { id:3, type:'ai',      text:'AI detected churn risk for 3 accounts',     time:'15m ago', read:false, icon:'🧠' },
      { id:4, type:'contact', text:'Sarah Johnson opened your proposal email',  time:'1h ago',  read:false, icon:'📧' },
      { id:5, type:'revenue', text:'Monthly revenue target reached 87%',        time:'2h ago',  read:true,  icon:'📈' },
      { id:6, type:'task',    text:'Follow-up call with Acme Corp is overdue',  time:'3h ago',  read:true,  icon:'✅' },
    ];
    this._unread = this._notifs.filter(n => !n.read).length;
    this._render();
    this._badge();

    // Simulate live notifications
    setInterval(() => this._simulateNew(), 30000);
  }

  _render() {
    const list = document.getElementById('notif-list');
    if (!list) return;
    list.innerHTML = this._notifs.map(n => `
      <div class="flex items-start gap-3 p-3 border-b border-space-500/50 hover:bg-space-600 cursor-pointer transition-colors ${n.read ? 'opacity-60' : ''}"
           onclick="window.XPN.notifs.markRead(${n.id})">
        <div class="text-lg flex-shrink-0 mt-0.5">${n.icon}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-white leading-snug">${n.text}</p>
          <p class="text-xs text-slate mt-1">${n.time}</p>
        </div>
        ${!n.read ? '<div class="w-2 h-2 bg-cyan rounded-full flex-shrink-0 mt-1"></div>' : ''}
      </div>`).join('');
  }

  _badge() {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    badge.style.display = this._unread > 0 ? 'block' : 'none';
  }

  markRead(id) {
    const n = this._notifs.find(n => n.id === id);
    if (n && !n.read) { n.read = true; this._unread = Math.max(0, this._unread - 1); }
    this._render();
    this._badge();
  }

  markAllRead() {
    this._notifs.forEach(n => n.read = true);
    this._unread = 0;
    this._render();
    this._badge();
  }

  _simulateNew() {
    const msgs = [
      { text: 'New lead from website: John Smith', icon: '👤' },
      { text: 'Campaign "Q4 Push" hit 40% open rate', icon: '📢' },
      { text: 'Deal closed: $48,000 with NovaTech', icon: '🎉' },
      { text: 'AI recommendation: Contact Alex Chen now', icon: '🧠' },
    ];
    const m = msgs[Math.floor(Math.random() * msgs.length)];
    this._notifs.unshift({ id: Date.now(), ...m, time: 'Just now', read: false });
    this._unread++;
    this._render();
    this._badge();
    window.XPN.toast?.show(m.text, 'info');
  }
}
