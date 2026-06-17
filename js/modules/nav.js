// /js/modules/nav.js

export const NAV_CONFIG = [
  {
    group: 'Overview',
    items: [
      { id: 'dashboard',   label: 'Dashboard',      icon: '⬛', badge: null },
      { id: 'ai-hub',      label: 'AI Command',     icon: '🧠', badge: { text: 'AI', cls: 'cyan' } },
    ]
  },
  {
    group: 'CRM',
    items: [
      { id: 'contacts',    label: 'Contacts',        icon: '👥', badge: null },
      { id: 'companies',   label: 'Companies',       icon: '🏢', badge: null },
      { id: 'pipeline',    label: 'Sales Pipeline',  icon: '💼', badge: { text: '24', cls: '' } },
      { id: 'activities',  label: 'Activities',      icon: '📋', badge: null },
    ]
  },
  {
    group: 'Marketing',
    items: [
      { id: 'campaigns',   label: 'Campaigns',       icon: '📢', badge: null },
      { id: 'segments',    label: 'Segments',        icon: '🎯', badge: null },
      { id: 'journeys',    label: 'Journeys',        icon: '🗺️', badge: null },
    ]
  },
  {
    group: 'Support',
    items: [
      { id: 'support',     label: 'Help Desk',       icon: '🎫', badge: { text: '8', cls: 'danger' } },
      { id: 'live-chat',   label: 'Live Chat',       icon: '💬', badge: { text: '3', cls: 'cyan' } },
      { id: 'knowledge',   label: 'Knowledge Base',  icon: '📚', badge: null },
    ]
  },
  {
    group: 'Finance',
    items: [
      { id: 'invoices',    label: 'Invoices',        icon: '🧾', badge: null },
      { id: 'forecasting', label: 'Forecasting',     icon: '📈', badge: null },
    ]
  },
  {
    group: 'Intelligence',
    items: [
      { id: 'analytics',   label: 'Analytics',       icon: '📊', badge: null },
      { id: 'reports',     label: 'Reports',         icon: '📑', badge: null },
    ]
  },
  {
    group: 'Automation',
    items: [
      { id: 'workflows',   label: 'Workflows',       icon: '⚙️', badge: null },
      { id: 'integrations',label: 'Integrations',    icon: '🔌', badge: null },
    ]
  },
  {
    group: 'Collaboration',
    items: [
      { id: 'tasks',       label: 'Tasks',           icon: '✅', badge: null },
      { id: 'team-chat',   label: 'Team Chat',       icon: '💭', badge: { text: '5', cls: '' } },
    ]
  },
  {
    group: 'Admin',
    items: [
      { id: 'users',       label: 'Users & Roles',   icon: '🔐', badge: null },
      { id: 'settings',    label: 'Settings',        icon: '⚙️', badge: null },
    ]
  },
];

export class NavManager {
  render() {
    const container = document.getElementById('nav-container');
    container.innerHTML = NAV_CONFIG.map(group => `
      <div class="mb-2">
        <div class="nav-group-label">${group.group}</div>
        ${group.items.map(item => this._renderItem(item)).join('')}
      </div>
    `).join('');

    container.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const route = el.dataset.route;
        window.XPN.router.navigate(route);
      });
    });
  }

  _renderItem(item) {
    const badge = item.badge
      ? `<span class="nav-badge ${item.badge.cls}">${item.badge.text}</span>`
      : '';
    return `
      <div class="nav-item" data-route="${item.id}">
        <div class="nav-icon">${item.icon}</div>
        <span class="nav-label">${item.label}</span>
        ${badge}
      </div>`;
  }

  setActive(routeId) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.route === routeId);
    });
    const found = NAV_CONFIG.flatMap(g => g.items).find(i => i.id === routeId);
    if (found) {
      document.getElementById('breadcrumb-page').textContent = found.label;
    }
  }
}
