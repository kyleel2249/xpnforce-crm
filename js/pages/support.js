// /js/pages/support.js

export function renderSupport(store) {
  const tickets = store.tickets;
  const open    = tickets.filter(t=>t.status==='open').length;
  const inProg  = tickets.filter(t=>t.status==='in-progress').length;
  const crit    = tickets.filter(t=>t.priority==='critical').length;
  const resolved= tickets.filter(t=>t.status==='resolved'||t.status==='closed').length;

  setTimeout(()=>attachSupportListeners(store),50);

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Help Desk</h1>
      <p class="page-subtitle">${tickets.length} total tickets · ${crit} critical</p>
    </div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Analyze my support tickets. What are the most common issues? Which customers need immediate attention?')">🧠 AI Analysis</button>
      <button class="btn btn-primary btn-sm" id="new-ticket">+ New Ticket</button>
    </div>
  </div>

  <!-- KPIs -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      { label:'Open',     value:open,    color:'warning', icon:'🔓' },
      { label:'In Progress', value:inProg, color:'indigo', icon:'⚡' },
      { label:'Critical',  value:crit,   color:'danger',  icon:'🚨' },
      { label:'Resolved',  value:resolved,color:'success', icon:'✅' },
    ].map(k=>`
    <div class="kpi-card ${k.color}">
      <div class="flex items-center gap-3 mb-2">
        <span class="text-2xl">${k.icon}</span>
      </div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
    </div>`).join('')}
  </div>

  <!-- Tabs -->
  <div class="tabs" id="ticket-tabs">
    <div class="tab active" data-tab="all">All Tickets</div>
    <div class="tab" data-tab="open">Open</div>
    <div class="tab" data-tab="in-progress">In Progress</div>
    <div class="tab" data-tab="critical">Critical</div>
    <div class="tab" data-tab="resolved">Resolved</div>
  </div>

  <!-- Filters Row -->
  <div class="flex gap-3 mb-4 flex-wrap">
    <div class="relative flex-1 min-w-48">
      <svg width="14" height="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="text" id="ticket-search" placeholder="Search tickets..." class="form-input pl-9" />
    </div>
    <select id="filter-priority" class="form-select w-40">
      <option value="">All Priority</option>
      <option>critical</option><option>high</option><option>medium</option><option>low</option>
    </select>
    <select id="filter-channel" class="form-select w-40">
      <option value="">All Channels</option>
      <option>email</option><option>chat</option><option>phone</option><option>portal</option>
    </select>
  </div>

  <!-- Tickets Table -->
  <div class="card">
    <table class="data-table" id="tickets-table">
      <thead>
        <tr>
          <th>Ticket</th>
          <th>Customer</th>
          <th>Priority</th>
          <th>Channel</th>
          <th>Status</th>
          <th>SLA</th>
          <th>Assigned</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="tickets-tbody">
        ${renderTicketRows(tickets.slice(0,20))}
      </tbody>
    </table>
  </div>

  <!-- AI Support Insights -->
  <div class="card mt-6">
    <div class="insight-label mb-3"><span class="w-2 h-2 bg-cyan rounded-full animate-pulse inline-block mr-2"></span>AI Support Intelligence</div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-space-600 rounded-xl p-4">
        <div class="text-xs text-slate uppercase tracking-wider mb-2">Top Issues</div>
        ${['Login problems (23%)','Billing questions (18%)','API errors (15%)','Feature requests (12%)'].map(i=>`<div class="text-sm text-slate-light py-1 border-b border-space-500/50">${i}</div>`).join('')}
      </div>
      <div class="bg-space-600 rounded-xl p-4">
        <div class="text-xs text-slate uppercase tracking-wider mb-2">SLA Performance</div>
        ${[{label:'Critical (4hr)',pct:78},{label:'High (8hr)',pct:91},{label:'Medium (24hr)',pct:96},{label:'Low (48hr)',pct:99}].map(s=>`
        <div class="mb-2">
          <div class="flex justify-between text-xs mb-1"><span class="text-slate">${s.label}</span><span class="${s.pct>=90?'text-success':s.pct>=75?'text-warning':'text-danger'}">${s.pct}%</span></div>
          <div class="progress-bar h-1.5"><div class="progress-fill ${s.pct>=90?'success':s.pct>=75?'warning':'danger'}" style="width:${s.pct}%"></div></div>
        </div>`).join('')}
      </div>
      <div class="bg-space-600 rounded-xl p-4">
        <div class="text-xs text-slate uppercase tracking-wider mb-2">Sentiment Analysis</div>
        ${[{label:'Positive',pct:62,cls:'success'},{label:'Neutral',pct:25,cls:'warning'},{label:'Negative',pct:13,cls:'danger'}].map(s=>`
        <div class="mb-3">
          <div class="flex justify-between text-xs mb-1"><span class="text-slate">${s.label}</span><span class="text-${s.cls}">${s.pct}%</span></div>
          <div class="progress-bar h-2"><div class="progress-fill ${s.cls}" style="width:${s.pct}%"></div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderTicketRows(tickets) {
  return tickets.map(t=>`
  <tr class="cursor-pointer" onclick="viewTicket('${t.id}')">
    <td>
      <div class="text-white font-500 text-sm">${t.subject}</div>
      <div class="text-xs text-slate font-mono">#${t.id}</div>
    </td>
    <td>
      <div class="text-sm">${t.customer}</div>
      <div class="text-xs text-slate">${t.email}</div>
    </td>
    <td><span class="badge ${prioBadge(t.priority)}">${t.priority}</span></td>
    <td>
      <span class="text-sm">${channelIcon(t.channel)} ${t.channel}</span>
    </td>
    <td><span class="badge ${statusBadge(t.status)}">${t.status}</span></td>
    <td>
      <div class="text-xs font-mono ${slaColor(t.priority)}">${t.slaHours}hr SLA</div>
    </td>
    <td class="text-sm">${t.assigned}</td>
    <td>
      <div class="flex gap-1">
        <button class="btn btn-secondary btn-sm btn-icon" onclick="event.stopPropagation();viewTicket('${t.id}')">👁</button>
        <button class="btn btn-secondary btn-sm btn-icon" onclick="event.stopPropagation();window.XPN.store.updateTicket('${t.id}',{status:'resolved'});window.XPN.toast.show('Ticket resolved','success');window.XPN.router.navigate('support')">✅</button>
        <button class="btn btn-secondary btn-sm btn-icon" onclick="event.stopPropagation();window.XPN.ai?.quickAnalyze('Help me respond to a support ticket: ${t.subject}. Customer: ${t.customer}. Priority: ${t.priority}.')">🧠</button>
      </div>
    </td>
  </tr>`).join('');
}

function attachSupportListeners(store) {
  document.getElementById('new-ticket')?.addEventListener('click', ()=>{
    openModal(`
      <div class="space-y-4">
        <div class="form-group"><label class="form-label">Subject</label><input class="form-input" id="nt-subject" placeholder="Brief description of the issue" /></div>
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group"><label class="form-label">Customer Name</label><input class="form-input" id="nt-customer" placeholder="Customer name" /></div>
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="nt-email" type="email" placeholder="customer@email.com" /></div>
          <div class="form-group">
            <label class="form-label">Priority</label>
            <select class="form-select" id="nt-priority"><option>low</option><option selected>medium</option><option>high</option><option>critical</option></select>
          </div>
          <div class="form-group">
            <label class="form-label">Channel</label>
            <select class="form-select" id="nt-channel"><option>email</option><option>chat</option><option>phone</option><option>portal</option></select>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="nt-desc" placeholder="Detailed description..."></textarea></div>
        <button class="btn btn-primary w-full" onclick="saveNewTicket()">Create Ticket</button>
      </div>
    `, 'New Support Ticket');
  });

  // Tabs
  document.querySelectorAll('#ticket-tabs .tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('#ticket-tabs .tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.tab;
      let filtered = store.tickets;
      if (filter==='open')        filtered = filtered.filter(t=>t.status==='open');
      if (filter==='in-progress') filtered = filtered.filter(t=>t.status==='in-progress');
      if (filter==='critical')    filtered = filtered.filter(t=>t.priority==='critical');
      if (filter==='resolved')    filtered = filtered.filter(t=>['resolved','closed'].includes(t.status));
      document.getElementById('tickets-tbody').innerHTML = renderTicketRows(filtered.slice(0,20));
    });
  });

  // Search
  document.getElementById('ticket-search')?.addEventListener('input', e=>{
    const q = e.target.value.toLowerCase();
    const filtered = store.tickets.filter(t=>t.subject.toLowerCase().includes(q)||t.customer.toLowerCase().includes(q)||t.id.toLowerCase().includes(q));
    document.getElementById('tickets-tbody').innerHTML = renderTicketRows(filtered.slice(0,20));
  });

  // Priority filter
  document.getElementById('filter-priority')?.addEventListener('change', e=>{
    const p = e.target.value;
    const filtered = p ? store.tickets.filter(t=>t.priority===p) : store.tickets;
    document.getElementById('tickets-tbody').innerHTML = renderTicketRows(filtered.slice(0,20));
  });
}

window.saveNewTicket = function() {
  const subject = document.getElementById('nt-subject')?.value.trim();
  if (!subject) { window.XPN.toast.show('Subject required','error'); return; }
  window.XPN.store.addTicket({
    subject,
    customer: document.getElementById('nt-customer')?.value||'Unknown',
    email:    document.getElementById('nt-email')?.value||'',
    priority: document.getElementById('nt-priority')?.value||'medium',
    channel:  document.getElementById('nt-channel')?.value||'email',
    status:   'open',
    assigned: 'Demo User',
    slaHours: { low:48, medium:24, high:8, critical:4 }[document.getElementById('nt-priority')?.value]||24,
    tags:     [],
    created:  new Date().toISOString(),
    updated:  new Date().toISOString(),
  });
  closeModal();
  window.XPN.toast.show('Ticket created','success');
  window.XPN.router.navigate('support');
};

window.viewTicket = function(id) {
  const t = window.XPN.store.tickets.find(t=>t.id===id);
  if (!t) return;
  openModal(`
    <div class="space-y-4">
      <div class="flex items-start gap-3">
        <span class="badge ${prioBadge(t.priority)} text-sm">${t.priority}</span>
        <span class="badge ${statusBadge(t.status)}">${t.status}</span>
        <span class="text-xs text-slate font-mono ml-auto">#${t.id}</span>
      </div>
      <div class="p-4 bg-space-600 rounded-xl">
        <h3 class="text-white font-600 mb-1">${t.subject}</h3>
        <p class="text-slate text-sm">${t.customer} · ${t.email}</p>
        <p class="text-xs text-slate mt-2">Opened ${timeAgo(t.created)} · ${t.channel} · SLA: ${t.slaHours}hr</p>
      </div>
      <div class="form-group"><label class="form-label">Reply</label><textarea class="form-textarea" id="ticket-reply" placeholder="Type your response..."></textarea></div>
      <div class="flex gap-2">
        <button class="btn btn-primary flex-1" onclick="window.XPN.store.updateTicket('${t.id}',{status:'in-progress'});window.XPN.toast.show('Reply sent','success');closeModal()">Send Reply</button>
        <button class="btn btn-secondary" onclick="window.XPN.ai?.quickAnalyze('Draft a professional customer support reply for: ${t.subject}. Customer: ${t.customer}. Priority: ${t.priority}.');closeModal()">🧠 AI Draft</button>
        <button class="btn btn-cyan" onclick="window.XPN.store.updateTicket('${t.id}',{status:'resolved'});window.XPN.toast.show('Ticket resolved','success');closeModal();window.XPN.router.navigate('support')">Resolve</button>
      </div>
    </div>
  `, 'Ticket: ' + t.subject);
};

function prioBadge(p) { return {critical:'badge-danger',high:'badge-warning',medium:'badge-indigo',low:'badge-slate'}[p]||'badge-slate'; }
function statusBadge(s) { return {open:'badge-warning','in-progress':'badge-indigo',pending:'badge-slate',resolved:'badge-success',closed:'badge-slate'}[s]||'badge-slate'; }
function channelIcon(c) { return {email:'📧',chat:'💬',phone:'📞',portal:'🌐'}[c]||'•'; }
function slaColor(p) { return {critical:'text-danger',high:'text-warning',medium:'text-slate-light',low:'text-slate'}[p]||'text-slate'; }
function timeAgo(iso){const d=(Date.now()-new Date(iso))/1000;if(d<3600)return Math.floor(d/60)+'m ago';if(d<86400)return Math.floor(d/3600)+'h ago';return Math.floor(d/86400)+'d ago';}
