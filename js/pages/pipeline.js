// /js/pages/pipeline.js

export function renderPipeline(store) {
  const stages = [
    { id:'lead',          label:'Lead',         color:'#64748B' },
    { id:'qualified',     label:'Qualified',    color:'#4F46E5' },
    { id:'proposal',      label:'Proposal',     color:'#8B5CF6' },
    { id:'negotiation',   label:'Negotiation',  color:'#06B6D4' },
    { id:'closed-won',    label:'Closed Won',   color:'#10B981' },
    { id:'closed-lost',   label:'Closed Lost',  color:'#EF4444' },
  ];

  const totalValue   = store.deals.reduce((s,d)=>s+d.value,0);
  const wonValue     = store.deals.filter(d=>d.stage==='closed-won').reduce((s,d)=>s+d.value,0);
  const weightedPipe = store.deals.filter(d=>!['closed-won','closed-lost'].includes(d.stage)).reduce((s,d)=>s+d.value*(d.probability/100),0);

  setTimeout(()=>attachPipelineListeners(store),50);

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Sales Pipeline</h1>
      <p class="page-subtitle">${store.deals.length} deals · $${fmt(totalValue)} total value</p>
    </div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Analyze my sales pipeline. Which deals are stagnating? What is my forecast for this quarter?')">🧠 AI Forecast</button>
      <button class="btn btn-primary btn-sm" id="new-deal">+ New Deal</button>
    </div>
  </div>

  <!-- Pipeline Metrics -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      { label:'Total Pipeline', value:'$'+fmt(totalValue),     color:'indigo' },
      { label:'Weighted Value', value:'$'+fmt(weightedPipe),   color:'cyan'   },
      { label:'Closed Won',     value:'$'+fmt(wonValue),       color:'success'},
      { label:'Win Rate',       value:store.conversionRate+'%',color:'warning' },
    ].map(m=>`
    <div class="kpi-card ${m.color}">
      <div class="kpi-value">${m.value}</div>
      <div class="kpi-label">${m.label}</div>
    </div>`).join('')}
  </div>

  <!-- View Toggle -->
  <div class="flex gap-2 mb-4">
    <button id="toggle-kanban" class="btn btn-primary btn-sm">⬛ Kanban</button>
    <button id="toggle-list"   class="btn btn-secondary btn-sm">≡ List</button>
    <button id="toggle-forecast" class="btn btn-secondary btn-sm">📈 Forecast</button>
  </div>

  <!-- Kanban Board -->
  <div id="kanban-view">
    <div class="kanban-board" id="kanban-board">
      ${stages.map(stage=>{
        const deals = store.deals.filter(d=>d.stage===stage.id);
        const val   = deals.reduce((s,d)=>s+d.value,0);
        return `
        <div class="kanban-col" data-stage="${stage.id}">
          <div class="kanban-col-header">
            <div>
              <div class="kanban-col-title" style="color:${stage.color}">${stage.label}</div>
              <div class="text-xs text-slate mt-0.5">${deals.length} deals · $${fmt(val)}</div>
            </div>
            <div class="w-2 h-2 rounded-full" style="background:${stage.color}"></div>
          </div>
          <div class="kanban-cards" data-stage="${stage.id}">
            ${deals.slice(0,5).map(d=>renderKanbanCard(d,stage.color)).join('')}
            ${deals.length > 5 ? `<div class="text-xs text-slate text-center py-2 cursor-pointer hover:text-white">+${deals.length-5} more</div>` : ''}
          </div>
          <button class="w-full mt-2 py-2 text-xs text-slate hover:text-white border border-dashed border-space-500 hover:border-indigo rounded-xl transition-colors" onclick="openDealModal('${stage.id}')">+ Add Deal</button>
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- List View (hidden by default) -->
  <div id="list-view" class="hidden">
    <div class="card">
      <table class="data-table">
        <thead>
          <tr><th>Deal</th><th>Company</th><th>Value</th><th>Stage</th><th>Probability</th><th>Close Date</th><th>Owner</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${[...store.deals].sort((a,b)=>b.value-a.value).map(d=>`
          <tr>
            <td class="text-white font-500">${d.title}</td>
            <td>${d.company}</td>
            <td class="font-mono text-success">$${fmt(d.value)}</td>
            <td><span class="badge ${dealStageBadge(d.stage)}">${d.stage}</span></td>
            <td>
              <div class="flex items-center gap-2">
                <div class="progress-bar w-16"><div class="progress-fill ${d.probability>=70?'success':d.probability>=40?'warning':'danger'}" style="width:${d.probability}%"></div></div>
                <span class="text-xs font-mono">${d.probability}%</span>
              </div>
            </td>
            <td class="text-xs">${new Date(d.closeDate).toLocaleDateString()}</td>
            <td class="text-sm">${d.owner}</td>
            <td>
              <button class="btn btn-secondary btn-sm btn-icon" onclick="viewDeal('${d.id}')">👁</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Forecast View (hidden) -->
  <div id="forecast-view" class="hidden">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h3 class="font-display font-600 text-white mb-4">Q4 Forecast</h3>
        ${stages.filter(s=>!['closed-lost'].includes(s.id)).map(stage=>{
          const deals = store.deals.filter(d=>d.stage===stage.id);
          const val   = deals.reduce((s,d)=>s+d.value*(d.probability/100),0);
          const total = store.deals.reduce((s,d)=>s+d.value,0)||1;
          return `
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-slate-light">${stage.label}</span>
              <span class="font-mono text-white">$${fmt(val)}</span>
            </div>
            <div class="progress-bar h-2">
              <div class="progress-fill" style="width:${Math.round(val/total*100)}%;background:${stage.color}"></div>
            </div>
          </div>`;
        }).join('')}
        <div class="mt-4 pt-4 border-t border-space-500">
          <div class="flex justify-between">
            <span class="text-slate">Weighted Total</span>
            <span class="font-display text-xl font-700 text-white">$${fmt(weightedPipe)}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="font-display font-600 text-white mb-4">Deal Velocity</h3>
        <div class="space-y-4">
          ${[
            { label:'Avg Deal Size',     value:'$'+fmt(store.deals.reduce((s,d)=>s+d.value,0)/(store.deals.length||1)) },
            { label:'Avg Sales Cycle',   value:'28 days' },
            { label:'Deals Stagnating',  value: store.deals.filter(d=>d.stage==='lead').length + ' in lead stage' },
            { label:'Best Stage',        value:'Proposal → 68% conv.' },
            { label:'Top Rep',           value:'Demo User · $'+fmt(wonValue) },
          ].map(r=>`
          <div class="flex justify-between items-center p-3 bg-space-600 rounded-xl">
            <span class="text-slate text-sm">${r.label}</span>
            <span class="text-white font-600 text-sm">${r.value}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function renderKanbanCard(deal, color) {
  return `
  <div class="kanban-card" draggable="true" data-deal-id="${deal.id}" onclick="viewDeal('${deal.id}')">
    <div class="flex items-start justify-between mb-2">
      <div class="text-sm font-500 text-white leading-tight flex-1">${deal.title}</div>
      <div class="score-ring ${deal.score>=70?'high':deal.score>=40?'medium':'low'} w-8 h-8 text-xs ml-2 flex-shrink-0">${deal.score}</div>
    </div>
    <div class="text-xs text-slate mb-2">${deal.company}</div>
    <div class="flex items-center justify-between">
      <span class="font-mono text-sm font-700 text-success">$${fmt(deal.value)}</span>
      <div class="flex items-center gap-1">
        <div class="progress-bar w-12 h-1.5"><div class="progress-fill" style="width:${deal.probability}%;background:${color}"></div></div>
        <span class="text-xs text-slate font-mono">${deal.probability}%</span>
      </div>
    </div>
    <div class="mt-2 pt-2 border-t border-space-500 flex items-center justify-between">
      <span class="text-xs text-slate">Closes ${new Date(deal.closeDate).toLocaleDateString()}</span>
      <div class="flex gap-1">
        <button class="text-xs text-slate hover:text-white transition-colors" onclick="event.stopPropagation();window.XPN.toast.show('Email sent','info')">📧</button>
        <button class="text-xs text-slate hover:text-white transition-colors" onclick="event.stopPropagation();window.XPN.toast.show('Called','info')">📞</button>
      </div>
    </div>
  </div>`;
}

function attachPipelineListeners(store) {
  document.getElementById('new-deal')?.addEventListener('click', ()=>openDealModal('lead'));

  // View toggles
  const views = { kanban:'kanban-view', list:'list-view', forecast:'forecast-view' };
  document.getElementById('toggle-kanban')?.addEventListener('click', ()=>switchView('kanban',views));
  document.getElementById('toggle-list')?.addEventListener('click', ()=>switchView('list',views));
  document.getElementById('toggle-forecast')?.addEventListener('click', ()=>switchView('forecast',views));

  // Drag & drop
  document.querySelectorAll('.kanban-card').forEach(card=>{
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('deal-id', card.dataset.dealId);
      card.classList.add('opacity-50');
    });
    card.addEventListener('dragend', ()=>card.classList.remove('opacity-50'));
  });
  document.querySelectorAll('.kanban-col').forEach(col=>{
    col.addEventListener('dragover', e=>{ e.preventDefault(); col.classList.add('drag-over'); });
    col.addEventListener('dragleave', ()=>col.classList.remove('drag-over'));
    col.addEventListener('drop', e=>{
      e.preventDefault();
      col.classList.remove('drag-over');
      const dealId = e.dataTransfer.getData('deal-id');
      const newStage = col.dataset.stage;
      window.XPN.store.updateDeal(dealId, { stage: newStage });
      window.XPN.toast.show('Deal moved to ' + newStage, 'success');
      window.XPN.router.navigate('pipeline');
    });
  });
}

function switchView(view, views) {
  Object.values(views).forEach(v=>document.getElementById(v)?.classList.add('hidden'));
  document.getElementById(views[view])?.classList.remove('hidden');
  document.querySelectorAll('[id^="toggle-"]').forEach(b=>b.classList.replace?.('btn-primary','btn-secondary'));
  document.getElementById('toggle-'+view)?.classList.replace('btn-secondary','btn-primary');
}

window.openDealModal = function(stage='lead') {
  openModal(`
    <div class="grid grid-cols-2 gap-4">
      <div class="form-group col-span-2"><label class="form-label">Deal Title</label><input class="form-input" id="nd-title" placeholder="Enterprise Suite — Acme Corp" /></div>
      <div class="form-group"><label class="form-label">Company</label><input class="form-input" id="nd-company" placeholder="Company name" /></div>
      <div class="form-group"><label class="form-label">Value ($)</label><input class="form-input" id="nd-value" type="number" placeholder="25000" /></div>
      <div class="form-group">
        <label class="form-label">Stage</label>
        <select class="form-select" id="nd-stage">
          <option value="lead" ${stage==='lead'?'selected':''}>Lead</option>
          <option value="qualified" ${stage==='qualified'?'selected':''}>Qualified</option>
          <option value="proposal" ${stage==='proposal'?'selected':''}>Proposal</option>
          <option value="negotiation" ${stage==='negotiation'?'selected':''}>Negotiation</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Probability (%)</label><input class="form-input" id="nd-prob" type="number" min="0" max="100" placeholder="50" /></div>
      <div class="form-group col-span-2"><label class="form-label">Close Date</label><input class="form-input" id="nd-close" type="date" /></div>
    </div>
    <button class="btn btn-primary w-full mt-4" onclick="saveNewDeal()">Create Deal</button>
  `, 'New Deal');
};

window.saveNewDeal = function() {
  const title = document.getElementById('nd-title')?.value.trim();
  if (!title) { window.XPN.toast.show('Title required','error'); return; }
  window.XPN.store.addDeal({
    title,
    company: document.getElementById('nd-company')?.value||'Unknown',
    value: parseInt(document.getElementById('nd-value')?.value)||0,
    stage: document.getElementById('nd-stage')?.value||'lead',
    probability: parseInt(document.getElementById('nd-prob')?.value)||50,
    closeDate: document.getElementById('nd-close')?.value||new Date(Date.now()+30*86400000).toISOString(),
    owner: 'Demo User', score: 50,
    created: new Date().toISOString(),
    contact: '',
  });
  closeModal();
  window.XPN.toast.show('Deal created: '+title, 'success');
  window.XPN.router.navigate('pipeline');
};

window.viewDeal = function(id) {
  const d = window.XPN.store.deals.find(d=>d.id===id);
  if (!d) return;
  openModal(`
    <div class="space-y-4">
      <div class="p-4 bg-space-600 rounded-xl">
        <h2 class="text-lg font-display font-700 text-white mb-1">${d.title}</h2>
        <p class="text-slate text-sm">${d.company} · ${d.owner}</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        ${[['Value','$'+fmt(d.value)],['Stage',d.stage],['Probability',d.probability+'%'],['Score',d.score+'/100'],['Close Date',new Date(d.closeDate).toLocaleDateString()],['Contact',d.contact||'—']]
          .map(([k,v])=>`<div class="bg-space-600 rounded-xl p-3"><div class="text-xs text-slate uppercase mb-1">${k}</div><div class="text-sm text-white font-600">${v}</div></div>`).join('')}
      </div>
      <div class="flex gap-2">
        <button class="btn btn-primary flex-1" onclick="closeModal()">Update Deal</button>
        <button class="btn btn-secondary flex-1" onclick="window.XPN.ai?.quickAnalyze('Analyze deal: ${d.title} valued at $${d.value} in ${d.stage} stage with ${d.probability}% probability. What should I do next?');closeModal()">🧠 AI Advice</button>
      </div>
    </div>
  `, 'Deal Details');
};

function dealStageBadge(s) {
  const m={lead:'badge-slate',qualified:'badge-indigo',proposal:'badge-cyan',negotiation:'badge-warning','closed-won':'badge-success','closed-lost':'badge-danger'};
  return m[s]||'badge-slate';
}
function fmt(n){return n>=1000000?(n/1000000).toFixed(1)+'M':n>=1000?(n/1000).toFixed(0)+'K':Math.round(n||0).toLocaleString();}
