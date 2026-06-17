// /js/pages/analytics.js

export function renderAnalytics(store) {
  const revenue = store.revenue;
  const wonDeals = store.deals.filter(d=>d.stage==='closed-won');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const revByMonth = months.map((_,i)=>Math.round(Math.random()*150000+30000*(i+1)));
  const maxRev = Math.max(...revByMonth);

  const topCompanies = [...store.companies].sort((a,b)=>b.revenue-a.revenue).slice(0,5);
  const stageConv = [
    { from:'Lead→Qualified', rate:62 },
    { from:'Qualified→Proposal', rate:74 },
    { from:'Proposal→Negotiation', rate:58 },
    { from:'Negotiation→Won', rate:81 },
  ];

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Business Analytics</h1>
      <p class="page-subtitle">Real-time intelligence across all business units</p>
    </div>
    <div class="flex gap-3">
      <select class="form-select w-36">
        <option>Last 30 Days</option><option>Last 90 Days</option><option>This Year</option><option>Custom</option>
      </select>
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Give me a comprehensive business analytics summary: revenue trends, pipeline health, conversion rates, and top 3 recommendations for growth.')">🧠 AI Summary</button>
      <button class="btn btn-primary btn-sm">⬇ Export Report</button>
    </div>
  </div>

  <!-- Top KPIs -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      { label:'Total Revenue',  value:'$'+fmt(revenue), change:'+18.4%', up:true,  color:'indigo' },
      { label:'MRR',            value:'$'+fmt(revenue/12), change:'+12.1%', up:true, color:'cyan' },
      { label:'Avg Deal Value', value:'$'+fmt(revenue/(wonDeals.length||1)), change:'+8.3%', up:true, color:'success' },
      { label:'CAC',            value:'$'+fmt(2840), change:'-5.2%', up:true, color:'warning' },
    ].map(k=>`
    <div class="kpi-card ${k.color}">
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-change ${k.up?'up':'down'}">${k.up?'▲':'▼'} ${k.change} vs last period</div>
    </div>`).join('')}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

    <!-- Revenue Bar Chart -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display font-600 text-white">Monthly Revenue</h3>
        <span class="badge badge-success">↑ Growing</span>
      </div>
      <div style="height:200px;position:relative">
        <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#4F46E5" stop-opacity="0.2"/>
            </linearGradient>
          </defs>
          ${revByMonth.map((v,i)=>{
            const h = Math.round((v/maxRev)*150);
            const x = 10 + i * 48;
            return `
            <rect x="${x}" y="${185-h}" width="36" height="${h}" rx="4" fill="url(#revGrad)"/>
            <text x="${x+18}" y="198" text-anchor="middle" fill="#64748B" font-size="9" font-family="Inter">${months[i]}</text>`;
          }).join('')}
        </svg>
      </div>
    </div>

    <!-- Conversion Funnel -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display font-600 text-white">Conversion Funnel</h3>
        <span class="text-sm text-slate">Overall: ${store.conversionRate}%</span>
      </div>
      <div class="space-y-4">
        ${stageConv.map((s,i)=>`
        <div>
          <div class="flex justify-between text-sm mb-1.5">
            <span class="text-slate-light">${s.from}</span>
            <span class="font-600 ${s.rate>=70?'text-success':s.rate>=50?'text-warning':'text-danger'}">${s.rate}%</span>
          </div>
          <div class="progress-bar h-3">
            <div class="progress-fill ${s.rate>=70?'success':s.rate>=50?'warning':'danger'}" style="width:${s.rate}%"></div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

    <!-- CRM Breakdown -->
    <div class="card">
      <h3 class="font-display font-600 text-white mb-4">Contact Lifecycle</h3>
      ${[
        { stage:'Lead',      count:store.contacts.filter(c=>c.stage==='lead').length,      color:'#64748B' },
        { stage:'Prospect',  count:store.contacts.filter(c=>c.stage==='prospect').length,  color:'#4F46E5' },
        { stage:'Customer',  count:store.contacts.filter(c=>c.stage==='customer').length,  color:'#10B981' },
        { stage:'Retention', count:store.contacts.filter(c=>c.stage==='retention').length, color:'#06B6D4' },
        { stage:'Churn Risk',count:store.contacts.filter(c=>c.stage==='churn').length,     color:'#EF4444' },
      ].map(s=>{
        const pct = Math.round(s.count/store.contacts.length*100);
        return `
        <div class="flex items-center gap-3 mb-3">
          <div class="w-3 h-3 rounded-full flex-shrink-0" style="background:${s.color}"></div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-slate-light">${s.stage}</span>
              <span class="font-mono text-white">${s.count}</span>
            </div>
            <div class="progress-bar h-1.5"><div class="progress-fill" style="width:${pct}%;background:${s.color}"></div></div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- Channel Performance -->
    <div class="card">
      <h3 class="font-display font-600 text-white mb-4">Support Channels</h3>
      ${[
        { channel:'Email',  tickets:28, resolved:25, rate:89, icon:'📧' },
        { channel:'Chat',   tickets:18, resolved:17, rate:94, icon:'💬' },
        { channel:'Phone',  tickets:12, resolved:10, rate:83, icon:'📞' },
        { channel:'Portal', tickets:9,  resolved:9,  rate:100,icon:'🌐' },
      ].map(c=>`
      <div class="flex items-center gap-3 mb-4">
        <span class="text-xl">${c.icon}</span>
        <div class="flex-1">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-white font-500">${c.channel}</span>
            <span class="${c.rate>=90?'text-success':c.rate>=80?'text-warning':'text-danger'} font-mono">${c.rate}%</span>
          </div>
          <div class="progress-bar h-1.5">
            <div class="progress-fill ${c.rate>=90?'success':c.rate>=80?'warning':'danger'}" style="width:${c.rate}%"></div>
          </div>
          <div class="text-xs text-slate mt-1">${c.tickets} tickets · ${c.resolved} resolved</div>
        </div>
      </div>`).join('')}
    </div>

    <!-- Top Companies -->
    <div class="card">
      <h3 class="font-display font-600 text-white mb-4">Top Accounts by Revenue</h3>
      <div class="space-y-3">
        ${topCompanies.map((co,i)=>`
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 rounded-lg bg-indigo/20 text-indigo-light text-xs flex items-center justify-center font-700">${i+1}</div>
          <div class="flex-1 min-w-0">
            <div class="text-sm text-white font-500 truncate">${co.name}</div>
            <div class="text-xs text-slate">${co.industry}</div>
          </div>
          <div class="text-sm font-mono text-success">$${fmt(co.revenue)}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- AI Insights Grid -->
  <div class="card">
    <div class="flex items-center gap-2 mb-4">
      <span class="w-2 h-2 bg-cyan rounded-full animate-pulse"></span>
      <h3 class="font-display font-600 text-white">AI-Generated Insights</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${[
        { icon:'📈', title:'Revenue Momentum', text:'Revenue grew 18.4% this period. At this trajectory, Q4 target will be reached 12 days early.', color:'success' },
        { icon:'⚠️', title:'Churn Alert',      text:store.contacts.filter(c=>c.stage==='churn').length+' accounts show high churn probability. Immediate outreach could save $'+fmt(store.contacts.filter(c=>c.stage==='churn').reduce((s,c)=>s+c.value,0))+'.', color:'danger' },
        { icon:'🎯', title:'Best Channel',     text:'Chat support has the highest resolution rate (94%). Consider routing more tickets through this channel.', color:'cyan' },
        { icon:'💡', title:'Deal Opportunity', text:`${store.deals.filter(d=>d.probability>60&&d.stage==='proposal').length} proposals with >60% win probability haven't been followed up in 7+ days.`, color:'warning' },
        { icon:'🚀', title:'Growth Lever',    text:'Enterprise segment (companies >1000 employees) generates 3.2x more LTV. Focus acquisition here.', color:'indigo' },
        { icon:'📊', title:'Campaign ROI',    text:'Email campaigns delivering 4.2x ROI. SMS campaigns underperforming at 1.8x — review messaging.', color:'success' },
      ].map(ins=>`
      <div class="insight-card cursor-pointer" onclick="window.XPN.ai?.quickAnalyze('Explain this insight in more detail: ${ins.title}: ${ins.text.replace(/'/g,"\\'")}')">
        <div class="insight-label"><span>${ins.icon}</span>${ins.title}</div>
        <p class="text-sm text-slate-light">${ins.text}</p>
      </div>`).join('')}
    </div>
  </div>`;
}

function fmt(n){return n>=1000000?(n/1000000).toFixed(1)+'M':n>=1000?(n/1000).toFixed(0)+'K':Math.round(n||0).toLocaleString();}
