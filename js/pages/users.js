// /js/pages/users.js
import { timeAgo } from './_helpers.js';

export function renderUsers(store) {
  const users  = store.users;
  const active = users.filter(u => u.active);
  const roles  = [...new Set(users.map(u => u.role))];

  setTimeout(() => attachUserListeners(store), 50);

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Users & Roles</h1>
      <p class="page-subtitle">${users.length} users · ${active.length} active · ${roles.length} roles</p>
    </div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" id="manage-roles">⚙ Manage Roles</button>
      <button class="btn btn-primary btn-sm" id="invite-user">+ Invite User</button>
    </div>
  </div>

  <!-- Role distribution -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      { label:'Total Users',   value: users.length,   color:'indigo', icon:'👥' },
      { label:'Active',        value: active.length,  color:'success',icon:'✅' },
      { label:'Inactive',      value: users.length - active.length, color:'warning', icon:'💤' },
      { label:'Roles Defined', value: roles.length,   color:'cyan',   icon:'🔐' },
    ].map(k=>`
    <div class="kpi-card ${k.color}">
      <div class="text-2xl mb-2">${k.icon}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
    </div>`).join('')}
  </div>

  <!-- Filters -->
  <div class="card mb-4">
    <div class="flex flex-wrap gap-3">
      <div class="relative flex-1 min-w-48">
        <svg width="14" height="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="user-search" placeholder="Search users..." class="form-input pl-9" />
      </div>
      <select id="user-role-filter" class="form-select w-40">
        <option value="">All Roles</option>
        ${roles.map(r=>`<option>${r}</option>`).join('')}
      </select>
      <select id="user-status-filter" class="form-select w-36">
        <option value="">All Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>
  </div>

  <!-- Users Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6" id="users-grid">
    ${renderUserCards(users)}
  </div>

  <!-- Roles & Permissions -->
  <div class="card">
    <h3 class="font-display font-600 text-white mb-4">Role Permissions Matrix</h3>
    <div class="overflow-x-auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Permission</th>
            ${['Admin','Manager','Sales Rep','Support','Analyst','Developer'].map(r=>`<th class="text-center">${r}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${[
            ['View Contacts',      [1,1,1,1,1,1]],
            ['Edit Contacts',      [1,1,1,0,0,0]],
            ['Delete Contacts',    [1,1,0,0,0,0]],
            ['View Deals',         [1,1,1,0,1,0]],
            ['Edit Deals',         [1,1,1,0,0,0]],
            ['View Finance',       [1,1,0,0,1,0]],
            ['Manage Users',       [1,0,0,0,0,0]],
            ['System Settings',    [1,0,0,0,0,1]],
            ['API Access',         [1,1,0,0,1,1]],
            ['AI Features',        [1,1,1,1,1,1]],
          ].map(([perm, access]) => `
          <tr>
            <td class="text-slate-light font-500">${perm}</td>
            ${access.map(a => `<td class="text-center">${a ? '<span class="text-success text-lg">✓</span>' : '<span class="text-slate opacity-30 text-lg">✗</span>'}</td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderUserCards(users) {
  return users.map(u => `
  <div class="card hover:border-indigo/40 transition-all" data-user-id="${u.id}">
    <div class="flex items-center gap-3 mb-3">
      <div class="avatar avatar-md font-700 flex-shrink-0" style="background:${u.color}22;color:${u.color};border:1.5px solid ${u.color}44">${u.avatar}</div>
      <div class="flex-1 min-w-0">
        <div class="text-white font-600 text-sm truncate">${u.name}</div>
        <div class="text-xs text-slate truncate">${u.email}</div>
      </div>
      <div class="flex flex-col items-end gap-1 flex-shrink-0">
        <span class="badge ${u.active?'badge-success':'badge-slate'}">${u.active?'Active':'Inactive'}</span>
      </div>
    </div>
    <div class="flex items-center justify-between p-2 bg-space-600 rounded-xl mb-3">
      <span class="text-xs text-slate">Role</span>
      <span class="badge badge-indigo text-xs">${u.role}</span>
    </div>
    <div class="text-xs text-slate mb-3">Last login: <span class="text-slate-light">${timeAgo(u.lastLogin)}</span></div>
    <div class="flex gap-2">
      <button class="btn btn-secondary btn-sm flex-1" onclick="editUser('${u.id}')">Edit</button>
      <button class="btn ${u.active?'btn-danger':'btn-secondary'} btn-sm flex-1"
        onclick="toggleUser('${u.id}')">${u.active?'Deactivate':'Activate'}</button>
    </div>
  </div>`).join('');
}

function attachUserListeners(store) {
  document.getElementById('invite-user')?.addEventListener('click', () => {
    openModal(`
      <div class="space-y-4">
        <div class="form-group"><label class="form-label">Email Address</label>
          <input class="form-input" id="inv-email" type="email" placeholder="colleague@company.com" /></div>
        <div class="form-group"><label class="form-label">Role</label>
          <select class="form-select" id="inv-role">
            <option>Admin</option><option selected>Sales Rep</option><option>Manager</option>
            <option>Support</option><option>Analyst</option><option>Developer</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Personal Message (optional)</label>
          <textarea class="form-textarea" placeholder="Welcome to XPNFORCE! Here's your invite..." rows="2"></textarea>
        </div>
        <button class="btn btn-primary w-full" onclick="window.XPN.toast.show('Invite sent to '+document.getElementById('inv-email')?.value,'success');closeModal()">Send Invitation</button>
      </div>
    `, 'Invite Team Member');
  });

  document.getElementById('manage-roles')?.addEventListener('click', () => {
    window.XPN.toast.show('Role management panel coming soon','info');
  });

  document.getElementById('user-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const f = store.users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
    document.getElementById('users-grid').innerHTML = renderUserCards(f);
  });

  document.getElementById('user-role-filter')?.addEventListener('change', e => {
    const r = e.target.value;
    const f = r ? store.users.filter(u => u.role === r) : store.users;
    document.getElementById('users-grid').innerHTML = renderUserCards(f);
  });
}

window.editUser = function(id) {
  const u = window.XPN.store.users.find(u => u.id === id);
  if (!u) return;
  openModal(`
    <div class="space-y-4">
      <div class="flex items-center gap-3 p-3 bg-space-600 rounded-xl">
        <div class="avatar avatar-md font-700" style="background:${u.color}22;color:${u.color}">${u.avatar}</div>
        <div><div class="text-white font-600">${u.name}</div><div class="text-xs text-slate">${u.email}</div></div>
      </div>
      <div class="form-group"><label class="form-label">Role</label>
        <select class="form-select">
          ${['Admin','Manager','Sales Rep','Support','Analyst','Developer'].map(r=>`<option ${u.role===r?'selected':''}>${r}</option>`).join('')}
        </select>
      </div>
      <div class="flex items-center justify-between p-3 bg-space-600 rounded-xl">
        <div><div class="text-sm text-white">Account Active</div><div class="text-xs text-slate">User can log in and access the system</div></div>
        <div class="w-12 h-6 ${u.active?'bg-indigo':'bg-space-500'} rounded-full relative cursor-pointer transition-colors" onclick="toggleUser('${u.id}')">
          <div class="w-5 h-5 bg-white rounded-full absolute ${u.active?'right-0.5':'left-0.5'} top-0.5 shadow transition-all"></div>
        </div>
      </div>
      <button class="btn btn-primary w-full" onclick="window.XPN.toast.show('User updated!','success');closeModal()">Save Changes</button>
    </div>
  `, 'Edit User: ' + u.name);
};

window.toggleUser = function(id) {
  const u = window.XPN.store.users.find(u => u.id === id);
  if (u) { u.active = !u.active; }
  window.XPN.toast.show(`User ${u.active?'activated':'deactivated'}: ${u.name}`, u.active?'success':'warning');
  window.XPN.router.navigate('users');
};
