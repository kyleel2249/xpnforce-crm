// /js/pages/workflows.js
import { fmt, timeAgo } from './_helpers.js';

export function renderWorkflows(store) {
  const workflows = store.workflows;
  const active    = workflows.filter(w => w.status === 'active');
  const totalRuns = workflows.reduce((s, w) => s + w.runs, 0);

  setTimeout(() => attachWorkflowListeners(store), 50);

  const triggerIcons = { 'Contact created':'👤', 'Deal updated':'💼', 'Ticket opened':'🎫', 'Time-based':'⏰', 'AI recommendation':'🧠' };
  const gradients = [
    'from-indigo/20 to-purple-500/10 border-indigo/30',
    'from-cyan/20 to-blue-500/10 border-cyan/30',
    'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
    'from-amber-500/20 to-orange-500/10 border-amber-500/30',
    'from-rose-500/20 to-red-500/10 border-rose-500/30',
    'from-violet-500/20 to-purple-500/10 border-violet-500/30',
    'from-sky-500/20 to-blue-500/10 border-sky-500/30',
    'from-green-500/20 to-emerald-500/10 border-green-500/30',
  ];

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Workflow Automation</h1>
      <p class="page-subtitle">${workflows.length} workflows · ${active.length} running · ${totalRuns.toLocaleString()} total executions</p>
    </div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Suggest 5 powerful workflow automations I should implement in my CRM. Consider my current data: ${store.contacts.length} contacts, ${store.deals.length} deals, ${store.tickets.length} tickets. Make each suggestion specific and actionable.')">🧠 AI Suggestions</button>
      <button class="btn btn-primary btn-sm" id="new-workflow">+ New Workflow</button>
    </div>
  </div>

  <!-- Metrics -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      { label:'Active',       value: active.length,          color:'success', icon:'▶' },
      { label:'Paused',       value: workflows.filter(w=>w.status==='paused').length, color:'warning', icon:'⏸' },
      { label:'Total Runs',   value: totalRuns.toLocaleString(), color:'indigo', icon:'🔄' },
      { label:'Avg Actions',  value: Math.round(workflows.reduce((s,w)=>s+w.actions,0)/workflows.length), color:'cyan', icon:'⚡' },
    ].map(k=>`
    <div class="kpi-card ${k.color}">
      <div class="text-2xl mb-2">${k.icon}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
    </div>`).join('')}
  </div>

  <!-- Workflow Cards Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6" id="workflows-grid">
    ${workflows.map((w, i) => `
    <div class="card bg-gradient-to-br ${gradients[i % gradients.length]} hover:scale-[1.01] transition-all cursor-pointer" data-wf-id="${w.id}">
      <div class="flex items-start justify-between mb-4">
        <div class="w-11 h-11 rounded-xl bg-space-600/80 flex items-center justify-center text-2xl">
          ${triggerIcons[w.trigger] || '⚙️'}
        </div>
        <div class="flex items-center gap-2">
          <span class="badge ${w.status==='active'?'badge-success':w.status==='paused'?'badge-warning':'badge-slate'}">${w.status}</span>
        </div>
      </div>

      <h3 class="font-display font-600 text-white mb-1 text-base">${w.name}</h3>
      <p class="text-xs text-slate mb-4">Trigger: <span class="text-slate-light">${w.trigger}</span></p>

      <!-- Action pipeline visualization -->
      <div class="flex items-center gap-1 mb-4 overflow-hidden">
        ${Array.from({length: Math.min(w.actions, 6)}, (_, i) => `
        <div class="h-1.5 flex-1 rounded-full ${i<w.actions-1?'bg-indigo/60':'bg-cyan/60'}"></div>
        ${i < Math.min(w.actions,6)-1 ? '<div class="w-1.5 h-1.5 rounded-full bg-space-500 flex-shrink-0"></div>' : ''}`).join('')}
        ${w.actions > 6 ? `<span class="text-xs text-slate ml-1">+${w.actions-6}</span>` : ''}
      </div>

      <div class="flex items-center justify-between text-xs mb-4">
        <span class="text-slate">${w.actions} actions</span>
        <span class="font-mono text-indigo-light">${w.runs.toLocaleString()} runs</span>
        <span class="text-slate">Last: ${timeAgo(w.lastRun)}</span>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-secondary btn-sm flex-1" onclick="event.stopPropagation();openWorkflowEditor('${w.id}')">✏️ Edit</button>
        <button class="btn ${w.status==='active'?'btn-secondary':'btn-primary'} btn-sm flex-1"
          onclick="event.stopPropagation();toggleWorkflow('${w.id}')">
          ${w.status==='active'?'⏸ Pause':'▶ Run'}
        </button>
        <button class="btn btn-secondary btn-sm btn-icon" onclick="event.stopPropagation();window.XPN.ai?.quickAnalyze('Analyze workflow: ${w.name}. Trigger: ${w.trigger}. It has ${w.actions} actions and ran ${w.runs} times. How can I optimize it? What conditions or actions should I add?')">🧠</button>
      </div>
    </div>`).join('')}

    <!-- Add New -->
    <div class="card border-dashed border-2 border-space-500 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo/50 hover:bg-indigo/5 transition-all min-h-[220px]"
         onclick="document.getElementById('new-workflow')?.click()">
      <div class="text-4xl mb-3 opacity-40">+</div>
      <div class="text-slate font-500">Build New Workflow</div>
      <div class="text-xs text-slate mt-1">No-code automation builder</div>
    </div>
  </div>

  <!-- Workflow Log -->
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="dot-live"></div>
        <h3 class="font-display font-600 text-white">Execution Log</h3>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.toast.show('Full log exported','success')">Export Log</button>
    </div>
    <table class="data-table">
      <thead><tr><th>Workflow</th><th>Trigger</th><th>Status</th><th>Duration</th><th>Timestamp</th></tr></thead>
      <tbody>
        ${workflows.slice(0,8).map(w => `
        <tr>
          <td class="text-white font-500">${w.name}</td>
          <td class="text-sm">${w.trigger}</td>
          <td><span class="badge badge-success">✓ success</span></td>
          <td class="font-mono text-xs">${Math.floor(Math.random()*800+50)}ms</td>
          <td class="text-xs text-slate font-mono">${timeAgo(w.lastRun)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function attachWorkflowListeners(store) {
  document.getElementById('new-workflow')?.addEventListener('click', () => {
    openModal(`
      <div class="space-y-4">
        <div class="form-group"><label class="form-label">Workflow Name</label>
          <input class="form-input" id="nwf-name" placeholder="e.g. Lead Nurture Sequence" /></div>
        <div class="form-group"><label class="form-label">Trigger Event</label>
          <select class="form-select" id="nwf-trigger">
            <option>Contact created</option><option>Deal updated</option><option>Ticket opened</option>
            <option>Time-based</option><option>AI recommendation</option><option>Field change</option>
            <option>Webhook received</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Condition</label>
          <select class="form-select">
            <option>Contact stage is Lead</option><option>Deal value > $10,000</option>
            <option>Ticket priority is Critical</option><option>No activity for 7 days</option>
            <option>AI score > 70</option>
          </select>
        </div>
        <div class="bg-space-600 rounded-xl p-4">
          <div class="text-xs text-slate uppercase tracking-wider mb-3">Actions</div>
          <div class="space-y-2" id="action-list">
            <div class="flex items-center gap-2 p-2 bg-space-500/50 rounded-lg text-sm">
              <span class="text-indigo-light">①</span>
              <select class="form-select flex-1 py-1.5">
                <option>Send email</option><option>Send SMS</option><option>Create task</option>
                <option>Update field</option><option>Assign owner</option><option>Add tag</option><option>Wait / Delay</option>
              </select>
            </div>
          </div>
          <button class="mt-2 text-xs text-indigo-light hover:text-white" onclick="addWorkflowAction()">+ Add Action</button>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-secondary flex-1" onclick="closeModal()">Save as Draft</button>
          <button class="btn btn-primary flex-1" onclick="window.XPN.toast.show('Workflow activated!','success');closeModal()">Activate</button>
        </div>
      </div>
    `, '⚙️ Workflow Builder');
  });
}

window.addWorkflowAction = function() {
  const list = document.getElementById('action-list');
  if (!list) return;
  const count = list.children.length + 1;
  const div = document.createElement('div');
  div.className = 'flex items-center gap-2 p-2 bg-space-500/50 rounded-lg text-sm';
  div.innerHTML = `<span class="text-indigo-light">${count <= 9 ? '0'+count : count}</span>
    <select class="form-select flex-1 py-1.5">
      <option>Send email</option><option>Send SMS</option><option>Create task</option>
      <option>Update field</option><option>Assign owner</option><option>Add tag</option><option>Wait / Delay</option>
    </select>
    <button onclick="this.parentElement.remove()" class="text-slate hover:text-danger transition-colors text-xs">✕</button>`;
  list.appendChild(div);
};

window.toggleWorkflow = function(id) {
  const wf = window.XPN.store.workflows.find(w => w.id === id);
  if (!wf) return;
  wf.status = wf.status === 'active' ? 'paused' : 'active';
  window.XPN.toast.show(`Workflow ${wf.status === 'active' ? 'activated' : 'paused'}: ${wf.name}`, 'success');
  window.XPN.router.navigate('workflows');
};

window.openWorkflowEditor = function(id) {
  const wf = window.XPN.store.workflows.find(w => w.id === id);
  if (!wf) return;
  openModal(`
    <div class="space-y-4">
      <div class="p-4 bg-space-600 rounded-xl">
        <h3 class="text-white font-600 mb-1">${wf.name}</h3>
        <p class="text-xs text-slate">Trigger: ${wf.trigger} · ${wf.actions} actions · ${wf.runs.toLocaleString()} runs</p>
      </div>
      <div class="form-group"><label class="form-label">Workflow Name</label>
        <input class="form-input" value="${wf.name}" /></div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-select">
          <option ${wf.status==='active'?'selected':''}>active</option>
          <option ${wf.status==='paused'?'selected':''}>paused</option>
          <option ${wf.status==='draft'?'selected':''}>draft</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-primary flex-1" onclick="window.XPN.toast.show('Changes saved!','success');closeModal()">Save Changes</button>
        <button class="btn btn-danger btn-sm" onclick="window.XPN.toast.show('Workflow deleted','warning');closeModal()">Delete</button>
      </div>
    </div>
  `, 'Edit Workflow');
};
