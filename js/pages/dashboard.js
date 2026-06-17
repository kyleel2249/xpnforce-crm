// /js/pages/dashboard.js

export function renderDashboard(store) {
  const wonDeals  = store.deals.filter(d => d.stage === 'closed-won');
  const revenue   = wonDeals.reduce((s,d) => s+d.value, 0);
  const pipeline  = store.deals.filter(d=>!['closed-won','closed-lost'].includes(d.stage)).reduce((s,d)=>s+d.value*(d.probability/100),0);
  const openTix   = store.tickets.filter(t=>t.status==='open').length;
  const critTix   = store.tickets.filter(t=>t.priority==='critical').length;
  const newLeads  = store.contacts.filter(c=>c.stage==='lead').length;
  const activeCamp= store.campaigns.filter(c=>c.status==='active').length;
  const conv      = store.conversionRate;

  // Stage breakdown
  const stageMap = {};
  store.deals.forEach(d => { stageMap[d.stage] = (stageMap[d.stage]||0) + 1; });
  const stages = ['lead','qualified','proposal','negotiation','closed-won','closed-lost'];

  // Recent activities
  const recentActs = store.activities.slice(0, 8);

  // Top deals
  const topDeals = [...store.deals]
    .filter(d=>!['closed-lost'].includes(d.stage))
    .sort((a,b)=>b.value-a.value)
    .slice(0,6);

  // Mini chart data (last 7 days simulated revenue)
  const chartData = [42000,55000,38000,70000,61000,88000,revenue/30].map(v=>Math.round(v));
  const maxChart  = Math.max(...chartData);

  // AI insights
  const insights = [
    { icon:'🔥', text:`${store.deals.filter(d=>d.probability>70&&d.stage!=='closed-won').length} high-probability deals need follow-up this week`, color:'warning' },
    { icon:'⚠️', text:`${store.contacts.filter(c=>c.stage==='churn').length} contacts showing churn signals — immediate action recommended`, color:'danger' },
    { icon:'📈', text:`Revenue trending +18% vs last month. Q4 target achievable at current velocity`, color:'success' },
    { icon:'🎯', text:`Top performing segment: Enterprise — 3.2x higher LTV than SMB segment`, color:'indigo' },
  ];

  setTimeout(() => attachDashboardListeners(), 50);

  return `
  <!-- KPI Row -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      { label:'Total Revenue', value: '$'+fmt(revenue),   change:'+18.4%', up:true,  color:'indigo', icon:'💰' },
      { label:'Pipeline Value', value:'$'+fmt(pipeline),   change:'+24.1%', up:true,  color:'cyan',   icon:'📊' },
      { label:'Open Tickets',  value: openTix,             change: critTix+' critical', up:false,color:'warning',icon:'🎫' },
      { label:'Conversion',    value: conv+'%',            change:'+2.3pp', up:true,  color:'success',icon:'🎯' },
    ].map(k=>`
    <div class="kpi-card ${k.color} cursor-pointer hover:scale-[1.01] transition-transform" onclick="window.XPN.ai?.quickAnalyze('Analyze my ${k.label.toLowerCase()} data and give me 3 actionable insights')">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xl">${k.icon}</span>
        <div class="mini-chart">
          ${[60,75,55,80,70,90,85].map((h,i)=>`<div class="mini-bar${i===6?' active':''}" style="height:${h}%"></div>`).join('')}
        </div>
      </div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-change ${k.up?'up':'down'}">
        ${k.up?'▲':'▼'} ${k.change}
      </div>
    </div>`).join('')}
  </div>

  <!-- Second KPI Row -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      { label:'Total Contacts', value: store.contacts.length.toLocaleString(), icon:'👥', color:'#4F46E5' },
      { label:'Active Campaigns',value: activeCamp,         icon:'📢', color:'#06B6D4' },
      { label:'New Leads',       value: newLeads,           icon:'⚡', color:'#10B981' },
      { label:'AI Tasks Active', value: store.workflows.filter(w=>w.status==='active').length * 3, icon:'🧠', color:'#8B5CF6' },
    ].map(k=>`
    <div class="card flex items-center gap-4">
      <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style="background:${k.color}22; border:1px solid ${k.color}44">${k.icon}</div>
      <div>
        <div class="font-display text-xl font-700 text-white">${k.value}</div>
        <div class="text-xs text-slate font-600 uppercase tracking-wider mt-0.5">${k.label}</div>
      </div>
    </div>`).join('')}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

    <!-- Revenue Chart -->
    <div class="card lg:col-span-2">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h3 class="font-display font-600 text-white">Revenue Overview</h3>
          <p class="text-xs text-slate mt-0.5">Last 7 days · Updated live</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-secondary btn-sm active-chart-btn" data-period="7">7D</button>
          <button class="btn btn-secondary btn-sm" data-period="30">30D</button>
          <button class="btn btn-secondary btn-sm" data-period="90">90D</button>
        </div>
      </div>
      <!-- SVG Bar Chart -->
      <div class="relative" style="height:180px">
        <svg width="100%" height="180" id="revenue-chart" viewBox="0 0 700 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#4F46E5" stop-opacity="0.3"/>
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#4F46E5"/>
              <stop offset="100%" stop-color="#06B6D4"/>
            </linearGradient>
          </defs>
          ${chartData.map((v,i)=>{
            const h = Math.round((v/maxChart)*140);
            const x = 50 + i * 90;
            const y = 155 - h;
            const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
            return `
              <rect x="${x}" y="${y}" width="60" height="${h}" rx="6" fill="url(#barGrad)" opacity="${i===6?1:0.6}"/>
              <text x="${x+30}" y="172" text-anchor="middle" fill="#64748B" font-size="10" font-family="Inter">${days[i]}</text>
              <text x="${x+30}" y="${y-6}" text-anchor="middle" fill="#94A3B8" font-size="9" font-family="JetBrains Mono">$${(v/1000).toFixed(0)}k</text>`;
          }).join('')}
          <!-- Trend line -->
          <polyline points="${chartData.map((v,i)=>`${80+i*90},${155-Math.round((v/maxChart)*140)}`).join(' ')}"
            fill="none" stroke="url(#lineGrad)" stroke-width="2" stroke-dasharray="4,2" opacity="0.5"/>
        </svg>
      </div>
    </div>

    <!-- Pipeline Funnel -->
    <div class="card">
      <div class="flex items-center justify-between mb-5">
        <h3 class="font-display font-600 text-white">Pipeline Stages</h3>
        <button class="btn btn-secondary btn-sm" onclick="window.XPN.router.navigate('pipeline')">View All</button>
      </div>
      <div class="space-y-3">
        ${stages.filter(s=>s!=='closed-lost').map((s,i)=>{
          const count = stageMap[s]||0;
          const total = store.deals.length;
          const pct   = total ? Math.round(count/total*100) : 0;
          const colors= ['#4F46E5','#6366F1','#8B5CF6','#06B6D4','#10B981'];
          const labels= { lead:'Lead',qualified:'Qualified',proposal:'Proposal',negotiation:'Negotiation','closed-won':'Closed Won' };
          return `
          <div>
            <div class="flex justify-between text-xs mb-1.5">
              <span class="text-slate-light">${labels[s]||s}</span>
              <span class="font-mono text-white">${count} <span class="text-slate">(${pct}%)</span></span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${colors[i]}"></div></div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

    <!-- Top Deals -->
    <div class="card lg:col-span-2">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display font-600 text-white">Top Deals</h3>
        <button class="btn btn-secondary btn-sm" onclick="window.XPN.router.navigate('pipeline')">Pipeline →</button>
      </div>
      <table class="data-table">
        <thead>
          <tr><th>Deal</th><th>Company</th><th>Value</th><th>Stage</th><th>Prob</th></tr>
        </thead>
        <tbody>
          ${topDeals.map(d=>`
          <tr class="cursor-pointer" onclick="window.XPN.toast.show('Opening deal: ${d.title}','info')">
            <td class="text-white font-500 max-w-[160px] truncate">${d.title}</td>
            <td>${d.company}</td>
            <td class="font-mono text-success">$${fmt(d.value)}</td>
            <td><span class="badge ${stageBadge(d.stage)}">${d.stage}</span></td>
            <td>
              <div class="flex items-center gap-2">
                <div class="progress-bar w-16"><div class="progress-fill ${d.probability>=70?'success':d.probability>=40?'warning':'danger'}" style="width:${d.probability}%"></div></div>
                <span class="text-xs font-mono">${d.probability}%</span>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display font-600 text-white">Activity Feed</h3>
        <div class="dot-live"></div>
      </div>
      <div class="space-y-0">
        ${recentActs.map(a=>{
          const icons = { email:'📧', call:'📞', meeting:'📅', note:'📝', 'deal-update':'💼', 'contact-created':'👤', 'ticket-opened':'🎫', 'campaign-sent':'📢' };
          const colors= { email:'indigo', call:'cyan', meeting:'success', note:'slate', 'deal-update':'warning', 'contact-created':'cyan', 'ticket-opened':'danger', 'campaign-sent':'indigo' };
          return `
          <div class="timeline-item">
            <div class="timeline-dot bg-space-600 text-sm">${icons[a.type]||'•'}</div>
            <div class="pt-1">
              <div class="text-sm text-slate-light">${a.desc}</div>
              <div class="text-xs text-slate mt-1 font-mono">${timeAgo(a.time)}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>

  <!-- AI Insights -->
  <div class="card mb-6">
    <div class="flex items-center gap-2 mb-4">
      <div class="w-2 h-2 bg-cyan rounded-full animate-pulse"></div>
      <h3 class="font-display font-600 text-white">AI Insights</h3>
      <span class="badge badge-cyan ml-2">Live</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      ${insights.map(ins=>`
      <div class="insight-card cursor-pointer hover:border-indigo/50 transition-colors"
           onclick="window.XPN.ai?.quickAnalyze('${ins.text.replace(/'/g,"\\'")}')">
        <div class="insight-label">
          <span>${ins.icon}</span> AI Recommendation
        </div>
        <p class="text-sm text-slate-light">${ins.text}</p>
        <button class="mt-2 text-xs text-indigo-light hover:text-white transition-colors">Ask AI to elaborate →</button>
      </div>`).join('')}
    </div>
  </div>

  <!-- Bottom Stats Row -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    ${[
      { label:'Avg Deal Size',  value:'$'+fmt(revenue/(wonDeals.length||1)), icon:'💵' },
      { label:'Sales Cycle',   value:'28 days',                              icon:'📅' },
      { label:'Team Members',  value: store.users.length,                    icon:'👤' },
      { label:'Integrations',  value: '14 active',                           icon:'🔌' },
    ].map(s=>`
    <div class="card text-center">
      <div class="text-2xl mb-2">${s.icon}</div>
      <div class="font-display text-lg font-700 text-white">${s.value}</div>
      <div class="text-xs text-slate uppercase tracking-wider">${s.label}</div>
    </div>`).join('')}
  </div>`;
}

function attachDashboardListeners() {
  document.querySelectorAll('[data-period]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active-chart-btn','bg-indigo'));
      btn.classList.add('active-chart-btn','bg-indigo');
      window.XPN.toast.show('Chart updated for ' + btn.dataset.period + 'D view', 'info');
    });
  });
}

function fmt(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1)+'M';
  if (n >= 1000)    return (n/1000).toFixed(0)+'K';
  return n?.toLocaleString() || '0';
}

function stageBadge(stage) {
  const map = { lead:'badge-slate', qualified:'badge-indigo', proposal:'badge-cyan', negotiation:'badge-warning', 'closed-won':'badge-success', 'closed-lost':'badge-danger' };
  return map[stage] || 'badge-slate';
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return Math.floor(diff/60) + 'm ago';
  if (diff < 86400)return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}
