// /js/pages/invoices.js
import { fmt, timeAgo } from './_helpers.js';

export function renderInvoices(store) {
  const invoices  = store.invoices;
  const paid      = invoices.filter(i => i.status === 'paid');
  const overdue   = invoices.filter(i => i.status === 'overdue');
  const sent      = invoices.filter(i => i.status === 'sent');
  const totalPaid = paid.reduce((s,i) => s + i.amount, 0);
  const totalOD   = overdue.reduce((s,i) => s + i.amount, 0);
  const totalOut  = sent.reduce((s,i) => s + i.amount, 0);
  const totalAll  = invoices.reduce((s,i) => s + i.amount, 0);

  setTimeout(() => attachInvoiceListeners(store), 50);

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Invoices & Finance</h1>
      <p class="page-subtitle">${invoices.length} invoices · ${overdue.length} overdue · $${fmt(totalOD)} at risk</p>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Analyze my invoicing data. Collection rate, overdue patterns, top paying clients, and cash flow forecast for next 30 days.')">🧠 Finance AI</button>
      <button class="btn btn-secondary btn-sm" id="export-invoices">⬇ Export</button>
      <button class="btn btn-primary btn-sm" id="new-invoice">+ New Invoice</button>
    </div>
  </div>

  <!-- Finance KPIs -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      { label:'Total Invoiced', value:'$'+fmt(totalAll),  color:'indigo', icon:'🧾', sub:'All time' },
      { label:'Collected',      value:'$'+fmt(totalPaid), color:'success',icon:'✅', sub:Math.round(totalPaid/totalAll*100)+'% collection rate' },
      { label:'Outstanding',    value:'$'+fmt(totalOut),  color:'warning',icon:'⏳', sub:sent.length+' invoices pending' },
      { label:'Overdue',        value:'$'+fmt(totalOD),   color:'danger', icon:'🚨', sub:overdue.length+' need attention' },
    ].map(k => `
    <div class="kpi-card ${k.color}">
      <div class="text-2xl mb-2">${k.icon}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="text-xs text-slate mt-1">${k.sub}</div>
    </div>`).join('')}
  </div>

  <!-- Cash Flow Chart -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    <div class="card lg:col-span-2">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display font-600 text-white">Payment Activity</h3>
        <span class="badge badge-success">Last 6 months</span>
      </div>
      <div style="height:160px;position:relative">
        <svg width="100%" height="160" viewBox="0 0 700 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10B981" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="#10B981" stop-opacity="0.1"/>
            </linearGradient>
            <linearGradient id="overdueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#EF4444" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#EF4444" stop-opacity="0.1"/>
            </linearGradient>
          </defs>
          ${['Jan','Feb','Mar','Apr','May','Jun'].map((m, i) => {
            const paidH  = Math.round((0.4 + i * 0.1 + Math.random()*0.15) * 110);
            const odH    = Math.round((0.2 - i*0.02 + Math.random()*0.1) * 60);
            const x      = 30 + i * 110;
            return `
            <rect x="${x}" y="${145-paidH}" width="40" height="${paidH}" rx="4" fill="url(#paidGrad)"/>
            <rect x="${x+45}" y="${145-odH}" width="30" height="${odH}" rx="4" fill="url(#overdueGrad)"/>
            <text x="${x+35}" y="158" text-anchor="middle" fill="#64748B" font-size="10" font-family="Inter">${m}</text>`;
          }).join('')}
        </svg>
      </div>
      <div class="flex gap-4 mt-2">
        <div class="flex items-center gap-2 text-xs"><div class="w-3 h-2 rounded bg-success/70"></div><span class="text-slate">Collected</span></div>
        <div class="flex items-center gap-2 text-xs"><div class="w-3 h-2 rounded bg-danger/60"></div><span class="text-slate">Overdue</span></div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="card">
      <h3 class="font-display font-600 text-white mb-4">Finance Health</h3>
      <div class="space-y-3">
        ${[
          { label:'Collection Rate',  value: Math.round(totalPaid/totalAll*100)+'%',   good: true  },
          { label:'Avg Days to Pay',  value: '23 days',   good: true  },
          { label:'Overdue Rate',     value: Math.round(overdue.length/invoices.length*100)+'%', good: false },
          { label:'Avg Invoice Size', value: '$'+fmt(totalAll/invoices.length), good: true },
          { label:'Recurring Rev.',   value: '$'+fmt(totalPaid/6)+'/mo',  good: true },
        ].map(s => `
        <div class="flex items-center justify-between p-2.5 bg-space-600 rounded-xl">
          <span class="text-sm text-slate">${s.label}</span>
          <span class="text-sm font-600 ${s.good?'text-success':'text-danger'}">${s.value}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Overdue Alert -->
  ${overdue.length > 0 ? `
  <div class="p-4 bg-danger/10 border border-danger/30 rounded-xl mb-5 flex items-center gap-4">
    <span class="text-3xl">🚨</span>
    <div class="flex-1">
      <div class="text-white font-600">$${fmt(totalOD)} in overdue invoices</div>
      <div class="text-sm text-slate">${overdue.length} invoices past due — send automated reminders now</div>
    </div>
    <button class="btn btn-danger btn-sm" onclick="sendAllReminders()">Send All Reminders</button>
  </div>` : ''}

  <!-- Tabs -->
  <div class="tabs" id="inv-tabs">
    ${['All','Paid','Sent','Overdue','Draft'].map((t,i)=>`
    <div class="tab ${i===0?'active':''}" data-status="${t.toLowerCase()}">${t}
      <span class="ml-1 text-xs opacity-60">(${t==='All'?invoices.length:invoices.filter(inv=>inv.status===t.toLowerCase()).length})</span>
    </div>`).join('')}
  </div>

  <!-- Invoices Table -->
  <div class="card">
    <div class="flex flex-wrap gap-3 mb-4">
      <div class="relative flex-1 min-w-48">
        <svg width="14" height="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="inv-search" placeholder="Search by client or invoice #..." class="form-input pl-9" />
      </div>
      <select id="inv-sort" class="form-select w-44">
        <option value="amount-desc">Amount: High → Low</option>
        <option value="due-asc">Due: Soonest First</option>
        <option value="client-asc">Client: A → Z</option>
      </select>
    </div>
    <table class="data-table" id="invoices-table">
      <thead>
        <tr><th>Invoice #</th><th>Client</th><th>Amount</th><th>Status</th><th>Issued</th><th>Due Date</th><th>Items</th><th>Actions</th></tr>
      </thead>
      <tbody id="invoices-tbody">
        ${renderInvoiceRows(invoices)}
      </tbody>
    </table>
  </div>`;
}

function renderInvoiceRows(invoices) {
  return invoices.map(inv => {
    const isOverdue = inv.status === 'overdue';
    const isPaid    = inv.status === 'paid';
    return `
    <tr class="cursor-pointer" onclick="viewInvoice('${inv.id}')">
      <td class="font-mono text-indigo-light font-600">#${inv.id.toUpperCase()}</td>
      <td class="text-white font-500">${inv.client}</td>
      <td class="font-mono font-700 ${isPaid?'text-success':isOverdue?'text-danger':'text-white'}">$${fmt(inv.amount)}</td>
      <td>
        <span class="badge ${inv.status==='paid'?'badge-success':inv.status==='overdue'?'badge-danger':inv.status==='sent'?'badge-warning':'badge-slate'}">
          ${inv.status==='paid'?'✓ ':inv.status==='overdue'?'⚠ ':''}${inv.status}
        </span>
      </td>
      <td class="text-xs text-slate">${new Date(inv.issued).toLocaleDateString()}</td>
      <td class="text-xs ${isOverdue?'text-danger font-600':''}">${new Date(inv.due).toLocaleDateString()}</td>
      <td class="text-sm">${inv.items} item${inv.items!==1?'s':''}</td>
      <td>
        <div class="flex gap-1">
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();downloadInvoicePDF('${inv.id}')">⬇ PDF</button>
          ${!isPaid ? `<button class="btn btn-cyan btn-sm" onclick="event.stopPropagation();sendReminder('${inv.id}')">Send</button>` : ''}
          ${!isPaid ? `<button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();markPaid('${inv.id}')">✓ Paid</button>` : ''}
        </div>
      </td>
    </tr>`;
  }).join('');
}

function attachInvoiceListeners(store) {
  document.getElementById('new-invoice')?.addEventListener('click', () => {
    openModal(`
      <div class="space-y-4">
        <div class="form-group"><label class="form-label">Client</label>
          <select class="form-select" id="ni-client">
            ${store.companies.slice(0,15).map(c=>`<option>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group"><label class="form-label">Due Date</label>
            <input class="form-input" id="ni-due" type="date" /></div>
          <div class="form-group"><label class="form-label">Currency</label>
            <select class="form-select"><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select>
          </div>
        </div>
        <div id="invoice-items">
          <div class="text-xs text-slate uppercase tracking-wider mb-2">Line Items</div>
          <div class="space-y-2" id="inv-item-list">
            <div class="grid grid-cols-12 gap-2 items-center">
              <input class="form-input col-span-6" placeholder="Description" />
              <input class="form-input col-span-2" type="number" placeholder="Qty" value="1" />
              <input class="form-input col-span-3" type="number" placeholder="Price" />
              <button class="text-slate hover:text-danger col-span-1 text-center">✕</button>
            </div>
          </div>
          <button class="mt-2 text-xs text-indigo-light hover:text-white" onclick="addInvItem()">+ Add Line Item</button>
        </div>
        <div class="form-group"><label class="form-label">Notes</label>
          <textarea class="form-textarea" placeholder="Payment terms, notes..." rows="2"></textarea>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-secondary flex-1" onclick="window.XPN.toast.show('Saved as draft','info');closeModal()">Save Draft</button>
          <button class="btn btn-primary flex-1" onclick="window.XPN.toast.show('Invoice sent!','success');closeModal()">Send Invoice</button>
        </div>
      </div>
    `, 'New Invoice');
  });

  // Tabs
  document.querySelectorAll('#inv-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#inv-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const status = tab.dataset.status;
      const f = status === 'all' ? store.invoices : store.invoices.filter(i => i.status === status);
      document.getElementById('invoices-tbody').innerHTML = renderInvoiceRows(f);
    });
  });

  // Search
  document.getElementById('inv-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const f = store.invoices.filter(i => i.client.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
    document.getElementById('invoices-tbody').innerHTML = renderInvoiceRows(f);
  });

  // Sort
  document.getElementById('inv-sort')?.addEventListener('change', e => {
    let s = [...store.invoices];
    if (e.target.value === 'amount-desc') s.sort((a,b) => b.amount - a.amount);
    if (e.target.value === 'due-asc')     s.sort((a,b) => new Date(a.due) - new Date(b.due));
    if (e.target.value === 'client-asc')  s.sort((a,b) => a.client.localeCompare(b.client));
    document.getElementById('invoices-tbody').innerHTML = renderInvoiceRows(s);
  });

  document.getElementById('export-invoices')?.addEventListener('click', () => {
    const csv = ['ID,Client,Amount,Status,Issued,Due']
      .concat(store.invoices.map(i=>`${i.id},${i.client},${i.amount},${i.status},${i.issued},${i.due}`))
      .join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download = 'xpnforce-invoices.csv'; a.click();
    window.XPN.toast.show('Invoices exported!','success');
  });
}

window.viewInvoice = function(id) {
  const inv = window.XPN.store.invoices.find(i => i.id === id);
  if (!inv) return;
  openModal(`
    <div class="space-y-4">
      <div class="flex items-center justify-between p-4 bg-space-600 rounded-xl">
        <div>
          <div class="text-xs text-slate uppercase tracking-wider mb-1">Invoice</div>
          <div class="font-mono text-indigo-light text-xl font-700">#${inv.id.toUpperCase()}</div>
        </div>
        <span class="badge ${inv.status==='paid'?'badge-success':inv.status==='overdue'?'badge-danger':'badge-warning'} text-base px-4 py-2">${inv.status}</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        ${[['Client',inv.client],['Amount','$'+fmt(inv.amount)],['Issued',new Date(inv.issued).toLocaleDateString()],['Due',new Date(inv.due).toLocaleDateString()],['Items',inv.items+' line items'],['Status',inv.status]]
          .map(([k,v])=>`<div class="bg-space-600 rounded-xl p-3"><div class="text-xs text-slate uppercase mb-1">${k}</div><div class="text-sm text-white font-600">${v}</div></div>`).join('')}
      </div>
      <div class="flex gap-2">
        <button class="btn btn-primary flex-1" onclick="downloadInvoicePDF('${inv.id}');closeModal()">⬇ Download PDF</button>
        ${inv.status!=='paid'?`<button class="btn btn-cyan flex-1" onclick="markPaid('${inv.id}');closeModal()">✓ Mark as Paid</button>`:''}
      </div>
    </div>
  `, 'Invoice Details');
};

window.downloadInvoicePDF = function(id) { window.XPN.toast.show('Generating PDF for invoice #'+id+'...','info'); };
window.sendReminder = function(id) { window.XPN.toast.show('Payment reminder sent for invoice #'+id,'success'); };
window.sendAllReminders = function() { window.XPN.toast.show('Reminders sent to all overdue clients','success'); };
window.markPaid = function(id) {
  const inv = window.XPN.store.invoices.find(i => i.id === id);
  if (inv) { inv.status = 'paid'; }
  window.XPN.toast.show('Invoice #'+id+' marked as paid ✓','success');
  window.XPN.router.navigate('invoices');
};
window.addInvItem = function() {
  const list = document.getElementById('inv-item-list');
  if (!list) return;
  const div = document.createElement('div');
  div.className = 'grid grid-cols-12 gap-2 items-center';
  div.innerHTML = `<input class="form-input col-span-6" placeholder="Description" />
    <input class="form-input col-span-2" type="number" placeholder="Qty" value="1" />
    <input class="form-input col-span-3" type="number" placeholder="Price" />
    <button onclick="this.parentElement.remove()" class="text-slate hover:text-danger col-span-1 text-center transition-colors">✕</button>`;
  list.appendChild(div);
};
