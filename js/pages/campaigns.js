// /js/pages/campaigns.js
import { fmt, timeAgo } from './_helpers.js';

export function renderCampaigns(store) {
  const campaigns = store.campaigns;
  const active     = campaigns.filter(c => c.status === 'active');
  const totalSent  = campaigns.reduce((s, c) => s + c.sent, 0);
  const totalRev   = campaigns.reduce((s, c) => s + c.revenue, 0);
  const avgOpen    = campaigns.length
    ? Math.round(campaigns.reduce((s,c)=> s + (c.sent ? c.opens/c.sent : 0), 0) / campaigns.length * 100)
    : 0;

  setTimeout(() => attachCampaignListeners(store), 50);

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Campaigns</h1>
      <p class="page-subtitle">${campaigns.length} campaigns · ${active.length} active · $${fmt(totalRev)} revenue attributed</p>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Analyze all my marketing campaigns. Which have the best ROI? What should I change about the underperforming ones? Suggest 3 new campaign ideas based on my contact data.')">🧠 AI Optimize</button>
      <button class="btn btn-primary btn-sm" id="new-campaign">+ New Campaign</button>
    </div>
  </div>

  <!-- KPIs -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      { label:'Active Campaigns', value: active.length,          color:'success', icon:'📢', change:'+2 this week' },
      { label:'Total Sent',       value: totalSent.toLocaleString(), color:'indigo', icon:'📤', change:'Last 30 days' },
      { label:'Avg Open Rate',    value: avgOpen+'%',            color:'cyan',    icon:'👁',  change:'+3.1% vs avg' },
      { label:'Revenue Attributed', value:'$'+fmt(totalRev),    color:'warning', icon:'💰', change:'All-time' },
    ].map(k => `
    <div class="kpi-card ${k.color}">
      <div class="flex items-center justify-between mb-3">
        <span class="text-2xl">${k.icon}</span>
        <div class="mini-chart">${[55,70,60,80,65,90,85].map((h,i)=>`<div class="mini-bar${i===6?' active':''}" style="height:${h}%"></div>`).join('')}</div>
      </div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="text-xs text-slate mt-1">${k.change}</div>
    </div>`).join('')}
  </div>

  <!-- Tabs -->
  <div class="tabs" id="camp-tabs">
    ${['All','Active','Scheduled','Completed','Draft','Paused'].map((t,i) => `
    <div class="tab ${i===0?'active':''}" data-status="${t.toLowerCase()}">${t}
      <span class="ml-1.5 text-xs opacity-60">(${t==='All'?campaigns.length:campaigns.filter(c=>c.status===t.toLowerCase()).length})</span>
    </div>`).join('')}
  </div>

  <!-- Campaigns Table -->
  <div class="card mb-6">
    <div class="flex flex-wrap gap-3 mb-4">
      <div class="relative flex-1 min-w-48">
        <svg width="14" height="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="camp-search" placeholder="Search campaigns..." class="form-input pl-9" />
      </div>
      <select id="camp-type-filter" class="form-select w-40">
        <option value="">All Types</option>
        <option>email</option><option>sms</option><option>social</option><option>multi-channel</option>
      </select>
    </div>
    <table class="data-table" id="campaigns-table">
      <thead>
        <tr><th>Campaign</th><th>Type</th><th>Status</th><th>Audience</th><th>Sent</th><th>Opens</th><th>Clicks</th><th>Revenue</th><th>Actions</th></tr>
      </thead>
      <tbody id="camps-tbody">
        ${renderCampRows(campaigns)}
      </tbody>
    </table>
  </div>

  <!-- Performance Chart -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <div class="card">
      <h3 class="font-display font-600 text-white mb-4">Channel Performance</h3>
      ${[
        { ch:'Email',       sent:totalSent*0.6, openRate:38, clickRate:8,  color:'#4F46E5' },
        { ch:'SMS',         sent:totalSent*0.2, openRate:91, clickRate:22, color:'#06B6D4' },
        { ch:'Social',      sent:totalSent*0.15,openRate:14, clickRate:4,  color:'#10B981' },
        { ch:'Multi-Channel',sent:totalSent*0.05,openRate:55,clickRate:18, color:'#F59E0B' },
      ].map(c => `
      <div class="mb-4">
        <div class="flex justify-between items-center mb-1.5">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" style="background:${c.color}"></div>
            <span class="text-sm text-slate-light">${c.ch}</span>
          </div>
          <div class="flex gap-4 text-xs font-mono">
            <span class="text-slate">Open: <span class="text-white">${c.openRate}%</span></span>
            <span class="text-slate">Click: <span class="text-white">${c.clickRate}%</span></span>
          </div>
        </div>
        <div class="progress-bar h-2"><div class="progress-fill" style="width:${c.openRate}%;background:${c.color}"></div></div>
      </div>`).join('')}
    </div>

    <div class="card">
      <h3 class="font-display font-600 text-white mb-4">Revenue by Campaign</h3>
      ${[...campaigns].sort((a,b)=>b.revenue-a.revenue).slice(0,5).map((c,i) => `
      <div class="flex items-center gap-3 mb-3">
        <div class="w-6 h-6 rounded-lg text-xs font-700 flex items-center justify-center" style="background:${['#4F46E5','#06B6D4','#10B981','#F59E0B','#8B5CF6'][i]}22;color:${['#4F46E5','#06B6D4','#10B981','#F59E0B','#8B5CF6'][i]}">${i+1}</div>
        <div class="flex-1 min-w-0">
          <div class="text-sm text-white font-500 truncate">${c.name}</div>
          <div class="progress-bar h-1 mt-1"><div class="progress-fill" style="width:${Math.round(c.revenue/campaigns[0].revenue*100)}%;background:${['#4F46E5','#06B6D4','#10B981','#F59E0B','#8B5CF6'][i]}"></div></div>
        </div>
        <span class="font-mono text-success text-sm flex-shrink-0">$${fmt(c.revenue)}</span>
      </div>`).join('')}
    </div>
  </div>

  <!-- AI Insights -->
  <div class="card">
    <div class="flex items-center gap-2 mb-4">
      <span class="w-2 h-2 bg-cyan rounded-full animate-pulse"></span>
      <h3 class="font-display font-600 text-white">Campaign Intelligence</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      ${[
        { icon:'🎯', title:'Best Send Time', text:'Tuesday 10am–11am shows 42% higher open rates. Schedule your next campaign accordingly.' },
        { icon:'📊', title:'Subject Line A/B', text:'Questions in subject lines outperform statements by 31%. Try "Ready to grow your revenue?" format.' },
        { icon:'⚡', title:'Quick Win', text:'${campaigns.filter(c=>c.status==="paused").length} paused campaigns could be reactivated with minor tweaks for immediate pipeline impact.' },
      ].map(i => `
      <div class="insight-card cursor-pointer" onclick="window.XPN.ai?.quickAnalyze('Tell me more about this marketing insight: ${i.title}: ${i.text.replace(/'/g,"\\'").replace(/"/g,'\\"')}')">
        <div class="insight-label"><span>${i.icon}</span>${i.title}</div>
        <p class="text-sm text-slate-light">${i.text}</p>
      </div>`).join('')}
    </div>
  </div>`;
}

function renderCampRows(campaigns) {
  const typeColors = { email:'badge-indigo', sms:'badge-cyan', social:'badge-success', 'multi-channel':'badge-warning' };
  const statusColors = { active:'badge-success', scheduled:'badge-indigo', completed:'badge-slate', draft:'badge-slate', paused:'badge-warning' };
  return campaigns.map(c => `
  <tr>
    <td>
      <div class="text-white font-600 text-sm">${c.name}</div>
      <div class="text-xs text-slate">${new Date(c.startDate).toLocaleDateString()} – ${new Date(c.endDate).toLocaleDateString()}</div>
    </td>
    <td><span class="badge ${typeColors[c.type]||'badge-slate'}">${c.type}</span></td>
    <td><span class="badge ${statusColors[c.status]||'badge-slate'}">${c.status}</span></td>
    <td class="font-mono">${c.audience.toLocaleString()}</td>
    <td class="font-mono">${c.sent.toLocaleString()}</td>
    <td class="font-mono">${c.opens.toLocaleString()} <span class="text-slate text-xs">(${c.sent?Math.round(c.opens/c.sent*100):0}%)</span></td>
    <td class="font-mono">${c.clicks.toLocaleString()} <span class="text-slate text-xs">(${c.sent?Math.round(c.clicks/c.sent*100):0}%)</span></td>
    <td class="font-mono text-success font-600">$${fmt(c.revenue)}</td>
    <td>
      <div class="flex gap-1">
        <button class="btn btn-secondary btn-sm" onclick="window.XPN.toast.show('Opening campaign editor','info')">Edit</button>
        <button class="btn btn-secondary btn-sm btn-icon" onclick="window.XPN.ai?.quickAnalyze('Analyze marketing campaign: ${c.name}. Type: ${c.type}. Sent: ${c.sent}, Opens: ${c.opens}, Clicks: ${c.clicks}, Revenue: $${c.revenue}. How can I improve performance?')">🧠</button>
      </div>
    </td>
  </tr>`).join('');
}

function attachCampaignListeners(store) {
  // New Campaign
  document.getElementById('new-campaign')?.addEventListener('click', () => {
    openModal(`
      <div class="space-y-4">
        <div class="form-group"><label class="form-label">Campaign Name</label><input class="form-input" id="nc-name" placeholder="Q4 Enterprise Push" /></div>
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group"><label class="form-label">Type</label>
            <select class="form-select" id="nc-type">
              <option>email</option><option>sms</option><option>social</option><option>multi-channel</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Audience Size</label>
            <input class="form-input" id="nc-aud" type="number" placeholder="1000" />
          </div>
          <div class="form-group"><label class="form-label">Start Date</label><input class="form-input" id="nc-start" type="date" /></div>
          <div class="form-group"><label class="form-label">End Date</label><input class="form-input" id="nc-end" type="date" /></div>
        </div>
        <div class="form-group"><label class="form-label">Target Segment</label>
          <select class="form-select">
            <option>All Contacts</option><option>Enterprise Accounts</option><option>Trial Users</option>
            <option>Churned Customers</option><option>High-Score Leads</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Goal</label>
          <select class="form-select"><option>Lead Generation</option><option>Upsell</option><option>Retention</option><option>Brand Awareness</option></select>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-secondary flex-1" onclick="window.XPN.ai?.quickAnalyze('Write a campaign brief and subject line ideas for a new ${document.getElementById(\\'nc-type\\')?.value||\\'email\\'} campaign targeting enterprise accounts.');closeModal()">🧠 AI Write Copy</button>
          <button class="btn btn-primary flex-1" onclick="window.XPN.toast.show('Campaign created!','success');closeModal()">Launch Campaign</button>
        </div>
      </div>
    `, 'New Campaign');
  });

  // Tabs
  document.querySelectorAll('#camp-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#camp-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const status = tab.dataset.status;
      const filtered = status === 'all' ? store.campaigns : store.campaigns.filter(c => c.status === status);
      document.getElementById('camps-tbody').innerHTML = renderCampRows(filtered);
    });
  });

  // Search
  document.getElementById('camp-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const f = store.campaigns.filter(c => c.name.toLowerCase().includes(q));
    document.getElementById('camps-tbody').innerHTML = renderCampRows(f);
  });

  // Type filter
  document.getElementById('camp-type-filter')?.addEventListener('change', e => {
    const t = e.target.value;
    const f = t ? store.campaigns.filter(c => c.type === t) : store.campaigns;
    document.getElementById('camps-tbody').innerHTML = renderCampRows(f);
  });
}
