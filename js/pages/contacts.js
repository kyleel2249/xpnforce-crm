// /js/pages/contacts.js

export function renderContacts(store) {
  const contacts = store.contacts;
  const page = 1;
  const perPage = 20;
  const shown = contacts.slice(0, perPage);

  setTimeout(() => attachContactListeners(store), 50);

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Contacts</h1>
      <p class="page-subtitle">${contacts.length.toLocaleString()} total contacts · ${contacts.filter(c=>c.stage==='lead').length} leads</p>
    </div>
    <div class="flex items-center gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Analyze my contacts data. Which contacts should I prioritize this week and why?')">
        🧠 AI Insights
      </button>
      <button class="btn btn-secondary btn-sm" id="import-contacts">⬆ Import</button>
      <button class="btn btn-secondary btn-sm" id="export-contacts">⬇ Export CSV</button>
      <button class="btn btn-primary btn-sm" id="new-contact">+ New Contact</button>
    </div>
  </div>

  <!-- Filters -->
  <div class="card mb-5">
    <div class="flex flex-wrap gap-3 items-center">
      <div class="relative flex-1 min-w-48">
        <svg width="14" height="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="contact-search" placeholder="Search contacts..." class="form-input pl-9" />
      </div>
      <select id="filter-stage" class="form-select w-40">
        <option value="">All Stages</option>
        <option>lead</option><option>prospect</option><option>customer</option><option>retention</option><option>churn</option>
      </select>
      <select id="filter-owner" class="form-select w-40">
        <option value="">All Owners</option>
        <option>Demo User</option>
      </select>
      <select id="sort-contacts" class="form-select w-44">
        <option value="score-desc">Score: High → Low</option>
        <option value="value-desc">Value: High → Low</option>
        <option value="name-asc">Name: A → Z</option>
        <option value="recent">Recently Added</option>
      </select>
      <div class="flex border border-space-500 rounded-lg overflow-hidden">
        <button id="view-table" class="px-3 py-2 bg-space-600 text-slate-light hover:text-white transition-colors text-sm">≡ Table</button>
        <button id="view-cards" class="px-3 py-2 text-slate hover:text-white transition-colors text-sm">⊞ Cards</button>
      </div>
    </div>
  </div>

  <!-- Stage quick-filter pills -->
  <div class="flex gap-2 mb-5 flex-wrap">
    ${[
      { stage:'all', label:'All', count: contacts.length },
      { stage:'lead', label:'Lead', count: contacts.filter(c=>c.stage==='lead').length },
      { stage:'prospect', label:'Prospect', count: contacts.filter(c=>c.stage==='prospect').length },
      { stage:'customer', label:'Customer', count: contacts.filter(c=>c.stage==='customer').length },
      { stage:'retention', label:'Retention', count: contacts.filter(c=>c.stage==='retention').length },
      { stage:'churn', label:'Churn Risk', count: contacts.filter(c=>c.stage==='churn').length },
    ].map(p=>`
    <button class="stage-pill flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-500 transition-all ${p.stage==='all'?'bg-indigo/20 border-indigo/40 text-indigo-light':'border-space-500 text-slate hover:border-slate hover:text-white'}"
            data-stage="${p.stage}">
      ${p.label}
      <span class="bg-space-500 text-slate-light text-xs px-1.5 py-0.5 rounded-lg">${p.count}</span>
    </button>`).join('')}
  </div>

  <!-- Contacts Table -->
  <div class="card" id="contacts-table-wrap">
    <table class="data-table" id="contacts-table">
      <thead>
        <tr>
          <th><input type="checkbox" id="select-all" class="rounded" /></th>
          <th>Contact</th>
          <th>Company</th>
          <th>Stage</th>
          <th>Score</th>
          <th>Value</th>
          <th>Last Contact</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="contacts-tbody">
        ${renderContactRows(shown)}
      </tbody>
    </table>
    <div class="flex items-center justify-between mt-4 pt-4 border-t border-space-500">
      <span class="text-sm text-slate">Showing ${shown.length} of ${contacts.length}</span>
      <div class="flex gap-2">
        <button class="btn btn-secondary btn-sm" disabled>← Prev</button>
        <button class="btn btn-secondary btn-sm" id="load-more-contacts">Next →</button>
      </div>
    </div>
  </div>

  <!-- Bulk Actions Bar (hidden by default) -->
  <div id="bulk-bar" class="hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-space-700 border border-indigo/40 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-2xl z-50">
    <span class="text-sm text-white font-500"><span id="bulk-count">0</span> selected</span>
    <div class="w-px h-5 bg-space-500"></div>
    <button class="btn btn-secondary btn-sm">Assign Owner</button>
    <button class="btn btn-secondary btn-sm">Add Tag</button>
    <button class="btn btn-secondary btn-sm">Export</button>
    <button class="btn btn-danger btn-sm">Delete</button>
    <button onclick="document.getElementById('bulk-bar').classList.add('hidden')" class="text-slate hover:text-white ml-2">✕</button>
  </div>`;
}

function renderContactRows(contacts) {
  return contacts.map(c => `
  <tr data-id="${c.id}">
    <td><input type="checkbox" class="row-check rounded" data-id="${c.id}" /></td>
    <td>
      <div class="flex items-center gap-3">
        <div class="avatar avatar-sm font-600" style="background:${c.color}22;color:${c.color};border:1px solid ${c.color}44">${c.avatar}</div>
        <div>
          <div class="text-white font-500 text-sm">${c.name}</div>
          <div class="text-xs text-slate">${c.email}</div>
        </div>
      </div>
    </td>
    <td>${c.company}</td>
    <td><span class="badge ${stageBadge(c.stage)}">${c.stage}</span></td>
    <td>
      <div class="score-ring ${c.score>=70?'high':c.score>=40?'medium':'low'} w-9 h-9 text-xs">${c.score}</div>
    </td>
    <td class="font-mono text-success">$${fmt(c.value)}</td>
    <td class="text-xs text-slate">${timeAgo(c.lastContact)}</td>
    <td>
      <div class="flex gap-1">
        <button class="btn btn-secondary btn-icon btn-sm" title="View" onclick="viewContact('${c.id}')">👁</button>
        <button class="btn btn-secondary btn-icon btn-sm" title="Email" onclick="window.XPN.toast.show('Email to ${c.name}','info')">📧</button>
        <button class="btn btn-secondary btn-icon btn-sm" title="Call" onclick="window.XPN.toast.show('Calling ${c.name}...','info')">📞</button>
        <button class="btn btn-danger btn-icon btn-sm" title="Delete" onclick="deleteContact('${c.id}')">🗑</button>
      </div>
    </td>
  </tr>`).join('');
}

function attachContactListeners(store) {
  // New contact
  document.getElementById('new-contact')?.addEventListener('click', () => {
    openContactModal(store);
  });

  // Search
  document.getElementById('contact-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = store.contacts.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q)
    );
    document.getElementById('contacts-tbody').innerHTML = renderContactRows(filtered.slice(0,20));
    reattachChecks();
  });

  // Stage pills
  document.querySelectorAll('.stage-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stage-pill').forEach(b => {
        b.className = b.className.replace('bg-indigo/20 border-indigo/40 text-indigo-light','border-space-500 text-slate');
      });
      btn.className = btn.className.replace('border-space-500 text-slate','bg-indigo/20 border-indigo/40 text-indigo-light');
      const stage = btn.dataset.stage;
      const filtered = stage === 'all' ? store.contacts : store.contacts.filter(c=>c.stage===stage);
      document.getElementById('contacts-tbody').innerHTML = renderContactRows(filtered.slice(0,20));
      reattachChecks();
    });
  });

  // Sort
  document.getElementById('sort-contacts')?.addEventListener('change', (e) => {
    let sorted = [...store.contacts];
    switch(e.target.value) {
      case 'score-desc': sorted.sort((a,b)=>b.score-a.score); break;
      case 'value-desc': sorted.sort((a,b)=>b.value-a.value); break;
      case 'name-asc':   sorted.sort((a,b)=>a.name.localeCompare(b.name)); break;
      case 'recent':     sorted.sort((a,b)=>new Date(b.created)-new Date(a.created)); break;
    }
    document.getElementById('contacts-tbody').innerHTML = renderContactRows(sorted.slice(0,20));
    reattachChecks();
  });

  // Select all
  document.getElementById('select-all')?.addEventListener('change', (e) => {
    document.querySelectorAll('.row-check').forEach(cb => cb.checked = e.target.checked);
    updateBulkBar();
  });

  // Export
  document.getElementById('export-contacts')?.addEventListener('click', () => {
    const csv = ['Name,Email,Company,Stage,Score,Value']
      .concat(store.contacts.map(c=>`${c.name},${c.email},${c.company},${c.stage},${c.score},${c.value}`))
      .join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'xpnforce-contacts.csv';
    a.click();
    window.XPN.toast.show('Contacts exported!', 'success');
  });

  // Load more
  document.getElementById('load-more-contacts')?.addEventListener('click', () => {
    const tbody = document.getElementById('contacts-tbody');
    const current = tbody.querySelectorAll('tr').length;
    const more = store.contacts.slice(current, current + 20);
    tbody.innerHTML += renderContactRows(more);
    reattachChecks();
    if (current + 20 >= store.contacts.length) {
      document.getElementById('load-more-contacts').disabled = true;
      document.getElementById('load-more-contacts').textContent = 'All loaded';
    }
  });

  reattachChecks();
}

function reattachChecks() {
  document.querySelectorAll('.row-check').forEach(cb => {
    cb.addEventListener('change', updateBulkBar);
  });
}

function updateBulkBar() {
  const checked = document.querySelectorAll('.row-check:checked').length;
  const bar = document.getElementById('bulk-bar');
  if (checked > 0) {
    bar.classList.remove('hidden');
    document.getElementById('bulk-count').textContent = checked;
  } else {
    bar.classList.add('hidden');
  }
}

window.viewContact = function(id) {
  const c = window.XPN.store.contacts.find(c=>c.id===id);
  if (!c) return;
  openModal(`
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-2 flex items-center gap-4 p-4 bg-space-600 rounded-xl">
        <div class="avatar avatar-lg font-700" style="background:${c.color}22;color:${c.color};border:2px solid ${c.color}44">${c.avatar}</div>
        <div>
          <h2 class="text-xl font-display font-700 text-white">${c.name}</h2>
          <p class="text-slate">${c.title} · ${c.company}</p>
          <p class="text-sm text-slate">${c.email}</p>
        </div>
        <div class="ml-auto">
          <span class="badge ${stageBadge(c.stage)} text-sm px-3 py-1">${c.stage}</span>
        </div>
      </div>
      ${[
        ['Email', c.email],['Phone', c.phone],['Company', c.company],['Title', c.title],
        ['Stage', c.stage],['Score', c.score+'/100'],['Value', '$'+fmt(c.value)],['Owner', c.owner],
        ['Tags', c.tags.join(', ')],['Created', new Date(c.created).toLocaleDateString()],
      ].map(([k,v])=>`
      <div class="bg-space-600 rounded-xl p-3">
        <div class="text-xs text-slate uppercase tracking-wider mb-1">${k}</div>
        <div class="text-sm text-white font-500">${v}</div>
      </div>`).join('')}
    </div>
    <div class="flex gap-2 mt-4">
      <button class="btn btn-primary flex-1" onclick="window.XPN.toast.show('Email drafted','info');closeModal()">📧 Send Email</button>
      <button class="btn btn-secondary flex-1" onclick="window.XPN.ai?.quickAnalyze('Analyze contact ${c.name} from ${c.company} with stage ${c.stage} and score ${c.score}. What actions should I take?');closeModal()">🧠 AI Analysis</button>
    </div>
  `, c.name);
};

window.deleteContact = function(id) {
  if (confirm('Delete this contact?')) {
    window.XPN.store.deleteContact(id);
    document.querySelector(`tr[data-id="${id}"]`)?.remove();
    window.XPN.toast.show('Contact deleted', 'warning');
  }
};

function openContactModal(store) {
  openModal(`
    <div class="grid grid-cols-2 gap-4">
      <div class="form-group"><label class="form-label">First Name</label><input class="form-input" id="nc-first" placeholder="John" /></div>
      <div class="form-group"><label class="form-label">Last Name</label><input class="form-input" id="nc-last" placeholder="Smith" /></div>
      <div class="form-group col-span-2"><label class="form-label">Email</label><input class="form-input" id="nc-email" type="email" placeholder="john@company.com" /></div>
      <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="nc-phone" placeholder="+1 (555) 000-0000" /></div>
      <div class="form-group"><label class="form-label">Company</label><input class="form-input" id="nc-company" placeholder="Acme Corp" /></div>
      <div class="form-group"><label class="form-label">Title</label><input class="form-input" id="nc-title" placeholder="CEO" /></div>
      <div class="form-group">
        <label class="form-label">Stage</label>
        <select class="form-select" id="nc-stage">
          <option>lead</option><option>prospect</option><option>customer</option>
        </select>
      </div>
    </div>
    <button class="btn btn-primary w-full mt-4" onclick="saveNewContact()">Create Contact</button>
  `, 'New Contact');
}

window.saveNewContact = function() {
  const first = document.getElementById('nc-first')?.value.trim();
  const last  = document.getElementById('nc-last')?.value.trim();
  if (!first || !last) { window.XPN.toast.show('Name is required','error'); return; }
  const c = window.XPN.store.addContact({
    name: first + ' ' + last,
    email: document.getElementById('nc-email')?.value,
    phone: document.getElementById('nc-phone')?.value,
    company: document.getElementById('nc-company')?.value,
    title: document.getElementById('nc-title')?.value,
    stage: document.getElementById('nc-stage')?.value || 'lead',
    score: 50, value: 0, tags: [], owner: 'Demo User',
    created: new Date().toISOString(), lastContact: new Date().toISOString(),
    avatar: (first[0]+last[0]).toUpperCase(), color: '#4F46E5',
  });
  closeModal();
  window.XPN.toast.show('Contact created: ' + c.name, 'success');
  window.XPN.router.navigate('contacts');
};

function stageBadge(stage) {
  const map = { lead:'badge-slate', prospect:'badge-indigo', customer:'badge-success', retention:'badge-cyan', churn:'badge-danger' };
  return map[stage] || 'badge-slate';
}
function fmt(n) { return n>=1000000?(n/1000000).toFixed(1)+'M':n>=1000?(n/1000).toFixed(0)+'K':n?.toLocaleString()||'0'; }
function timeAgo(iso) {
  const d=(Date.now()-new Date(iso))/1000;
  if(d<60)return'just now';if(d<3600)return Math.floor(d/60)+'m ago';
  if(d<86400)return Math.floor(d/3600)+'h ago';return Math.floor(d/86400)+'d ago';
}
