// /js/pages/ai-hub.js
import { fmt } from './_helpers.js';

export function renderAIHub(store) {
  const agents = [
    { id:'sales',   name:'Sales Agent',       icon:'💼', color:'#4F46E5', desc:'Pipeline analysis, lead scoring, deal forecasting, win/loss insight', status:'active',  runs:1284, tasks:['Score 42 new leads','Flag 3 stagnant deals','Update Q4 forecast'] },
    { id:'mkt',     name:'Marketing Agent',   icon:'📢', color:'#06B6D4', desc:'Campaign optimization, audience segmentation, content generation',    status:'active',  runs:876,  tasks:['Optimize email subject lines','Segment enterprise audience','A/B test analysis'] },
    { id:'support', name:'Support Agent',     icon:'🎫', color:'#10B981', desc:'Ticket routing, auto-responses, sentiment detection, SLA monitoring', status:'active',  runs:3421, tasks:['Route 8 open tickets','Draft 5 responses','Flag 2 critical issues'] },
    { id:'finance', name:'Finance Agent',     icon:'💰', color:'#F59E0B', desc:'Revenue tracking, anomaly detection, cash flow forecasting',          status:'paused',  runs:392,  tasks:['Review overdue invoices','Generate monthly report'] },
    { id:'research',name:'Research Agent',    icon:'🔬', color:'#8B5CF6', desc:'Market intelligence, competitor analysis, trend monitoring',          status:'active',  runs:219,  tasks:['Monitor 12 competitor updates','Compile industry report'] },
    { id:'content', name:'Content Agent',     icon:'✍️', color:'#EC4899', desc:'Email drafting, proposals, reports, social media content',            status:'active',  runs:654,  tasks:['Draft 3 follow-up emails','Write case study outline'] },
    { id:'hr',      name:'HR Agent',          icon:'👥', color:'#14B8A6', desc:'Recruitment workflow, candidate screening, onboarding automation',    status:'paused',  runs:89,   tasks:['Screen 5 applications','Schedule 2 interviews'] },
    { id:'exec',    name:'Executive Agent',   icon:'🎯', color:'#F97316', desc:'Board report generation, executive summaries, KPI monitoring',        status:'active',  runs:156,  tasks:['Prepare weekly summary','Flag 2 board-level risks'] },
    { id:'ops',     name:'Operations Agent',  icon:'⚙️', color:'#6366F1', desc:'System health monitoring, workflow optimization, performance tuning', status:'active',  runs:2100, tasks:['Monitor 8 active workflows','Optimize 3 automations'] },
  ];

  const totalRuns   = agents.reduce((s,a) => s + a.runs, 0);
  const activeCount = agents.filter(a => a.status === 'active').length;

  setTimeout(() => attachAIHubListeners(agents), 50);

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title gradient-text">AI Command Center</h1>
      <p class="page-subtitle">Autonomous AI agents working across your entire business</p>
    </div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Give me a comprehensive status report from all ${activeCount} active AI agents. What are their key findings and recommendations right now?')">📊 Agent Status Report</button>
      <button class="btn btn-primary btn-sm" onclick="window.XPN.ai?.togglePanel()">💬 Open AI Chat</button>
    </div>
  </div>

  <!-- System Status Banner -->
  <div class="card mb-6 border-cyan/30 bg-gradient-to-r from-indigo/10 via-cyan/5 to-transparent">
    <div class="flex flex-wrap items-center gap-6">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center">
            <div class="w-4 h-4 rounded-full bg-cyan animate-pulse"></div>
          </div>
        </div>
        <div>
          <div class="text-white font-600">AI Engine Online</div>
          <div class="text-xs text-slate">All systems operational</div>
        </div>
      </div>
      ${[
        { label:'Active Agents',   value: activeCount },
        { label:'Tasks Running',   value: agents.filter(a=>a.status==='active').reduce((s,a)=>s+a.tasks.length,0) },
        { label:'Total Executions',value: totalRuns.toLocaleString() },
        { label:'Avg Confidence',  value: '97.4%' },
        { label:'Model',           value: 'Claude Sonnet 4.6' },
        { label:'Latency',         value: '312ms avg' },
      ].map(s=>`
      <div class="flex flex-col">
        <span class="text-xs text-slate uppercase tracking-wider">${s.label}</span>
        <span class="text-white font-700 text-lg font-display">${s.value}</span>
      </div>`).join('<div class="w-px h-10 bg-space-500 hidden lg:block"></div>')}
    </div>
  </div>

  <!-- Neural Activity Bar -->
  <div class="card mb-6">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-display font-600 text-white">Neural Processing Activity</h3>
      <div class="flex items-center gap-2 text-xs text-cyan"><div class="dot-live"></div>Live</div>
    </div>
    <div class="grid grid-cols-9 gap-1 h-16" id="neural-bars">
      ${Array.from({length:36},(_,i)=>`<div class="rounded-sm bg-indigo/30 hover:bg-indigo/70 transition-all cursor-pointer animate-pulse" style="animation-delay:${i*80}ms;height:${Math.floor(Math.random()*100)+20}%"></div>`).join('')}
    </div>
    <div class="flex justify-between text-xs text-slate mt-2">
      <span>Sales · Marketing · Support · Finance · Research · Content · HR · Exec · Ops</span>
      <span class="font-mono text-indigo-light">Processing ${agents.filter(a=>a.status==='active').reduce((s,a)=>s+a.tasks.length,0)} tasks</span>
    </div>
  </div>

  <!-- Agents Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    ${agents.map(a => `
    <div class="card hover:scale-[1.01] transition-all cursor-pointer group" data-agent="${a.id}"
         onclick="openAgentDetail('${a.id}')">
      <div class="flex items-start justify-between mb-4">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
             style="background:${a.color}22;border:1px solid ${a.color}44">${a.icon}</div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full ${a.status==='active'?'bg-success animate-pulse':'bg-warning'}"></div>
          <span class="badge ${a.status==='active'?'badge-success':'badge-warning'} text-xs">${a.status}</span>
        </div>
      </div>

      <h3 class="font-display font-600 text-white mb-1">${a.name}</h3>
      <p class="text-xs text-slate mb-3 leading-relaxed">${a.desc}</p>

      <!-- Active tasks -->
      ${a.status==='active' ? `
      <div class="bg-space-600 rounded-xl p-3 mb-3">
        <div class="text-xs text-slate uppercase tracking-wider mb-2">Active Tasks</div>
        ${a.tasks.map(t=>`<div class="flex items-center gap-2 py-1"><div class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background:${a.color}"></div><span class="text-xs text-slate-light truncate">${t}</span></div>`).join('')}
      </div>` : ''}

      <div class="flex items-center justify-between text-xs mb-3">
        <span class="font-mono text-slate">${a.runs.toLocaleString()} executions</span>
        <span class="text-slate">${a.tasks.length} task${a.tasks.length!==1?'s':''} queued</span>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-secondary btn-sm flex-1 group-hover:border-indigo/50 transition-colors"
          onclick="event.stopPropagation();window.XPN.ai?.quickAnalyze('Give me a detailed report from the ${a.name}: ${a.desc}. What are the top insights and recommended actions based on my current business data?')">
          🧠 Get Report
        </button>
        <button class="btn btn-sm flex-1 ${a.status==='active'?'btn-secondary':'btn-primary'}"
          onclick="event.stopPropagation();toggleAgent('${a.id}')">
          ${a.status==='active'?'⏸ Pause':'▶ Activate'}
        </button>
      </div>
    </div>`).join('')}
  </div>

  <!-- Quick Prompts -->
  <div class="card mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-display font-600 text-white">Quick AI Actions</h3>
      <span class="text-xs text-slate">Click any to run instantly</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      ${[
        { icon:'📈', cat:'Sales',     label:'Q4 Revenue Forecast',   prompt:'Generate a detailed Q4 revenue forecast. Use my pipeline data: ${store.deals.length} deals worth $${fmt(store.deals.reduce((s,d)=>s+d.value,0))} total, ${store.conversionRate}% conversion rate. Include confidence range and key assumptions.' },
        { icon:'🎯', cat:'Sales',     label:'Top 10 Lead Priorities', prompt:'Rank my top 10 leads by likelihood to close this month. Consider score, stage, last activity, and deal value. For each, suggest one specific next action.' },
        { icon:'⚠️', cat:'CRM',       label:'Churn Risk Report',      prompt:'Identify customers at high churn risk from my ${store.contacts.filter(c=>c.stage==="churn").length} flagged accounts plus any others showing warning signs. For each, suggest a personalized retention message.' },
        { icon:'📧', cat:'Marketing', label:'5-Email Drip Sequence',   prompt:'Write a 5-email nurture sequence for enterprise prospects in the proposal stage. Make each email specific, value-driven, and under 150 words. Include subject lines.' },
        { icon:'📊', cat:'Reports',   label:'Weekly Board Summary',   prompt:'Generate a concise weekly business summary for board review. Cover: revenue vs target, pipeline health, top deals, support metrics, and 3 strategic recommendations.' },
        { icon:'💡', cat:'Strategy',  label:'Growth Opportunities',    prompt:'Identify the top 5 growth opportunities based on my data: ${store.contacts.length} contacts, $${fmt(store.revenue)} revenue, ${store.campaigns.length} campaigns. Be specific and quantify the potential impact of each.' },
        { icon:'🔍', cat:'Insights',  label:'Competitive Analysis',    prompt:'Based on my customer data and industry patterns, give me a competitive positioning analysis. Where are my strengths? What gaps exist that competitors might exploit?' },
        { icon:'🚀', cat:'Sales',     label:'Deal Acceleration Plan',  prompt:'Which of my ${store.deals.filter(d=>d.stage==="negotiation").length} negotiation-stage deals can close fastest? For each, give a 3-step acceleration plan.' },
        { icon:'🤖', cat:'Automation',label:'Top Automation Ideas',    prompt:'Based on my workflows (${store.workflows.length} active) and business data, suggest 5 additional automations that would have the highest ROI. Include trigger, actions, and expected impact.' },
      ].map(p=>`
      <button class="flex items-start gap-3 p-3.5 bg-space-600 border border-space-500 hover:border-indigo/50 hover:bg-indigo/5 rounded-xl transition-all text-left group"
              onclick="window.XPN.ai?.quickAnalyze(\`${p.prompt.replace(/`/g,'\\`')}\`)">
        <span class="text-xl mt-0.5">${p.icon}</span>
        <div class="flex-1 min-w-0">
          <div class="text-xs text-indigo-light uppercase tracking-wider mb-0.5">${p.cat}</div>
          <div class="text-sm text-slate-light group-hover:text-white transition-colors font-500">${p.label}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate group-hover:text-indigo-light transition-colors flex-shrink-0 mt-1"><path d="M9 18l6-6-6-6"/></svg>
      </button>`).join('')}
    </div>
  </div>

  <!-- AI Performance -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="card">
      <h3 class="font-display font-600 text-white mb-4">Agent Performance</h3>
      ${agents.map(a=>`
      <div class="flex items-center gap-3 mb-3">
        <span class="text-lg w-6 flex-shrink-0">${a.icon}</span>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-light truncate">${a.name}</span>
            <span class="font-mono text-white ml-2">${a.runs.toLocaleString()}</span>
          </div>
          <div class="progress-bar h-1.5">
            <div class="progress-fill" style="width:${Math.round(a.runs/totalRuns*100*agents.length)}%;background:${a.color};max-width:100%"></div>
          </div>
        </div>
        <span class="text-xs ${a.status==='active'?'text-success':'text-warning'} flex-shrink-0">${a.status}</span>
      </div>`).join('')}
    </div>
    <div class="card">
      <h3 class="font-display font-600 text-white mb-4">AI System Metrics</h3>
      <div class="space-y-3">
        ${[
          {label:'Total API Calls Today',   value:'4,829',    trend:'+12%',  up:true},
          {label:'Avg Response Time',        value:'312ms',    trend:'-8%',   up:true},
          {label:'Accuracy Rate',            value:'97.4%',    trend:'+0.3%', up:true},
          {label:'Tasks Completed (24hr)',   value:'1,247',    trend:'+31%',  up:true},
          {label:'Errors / Failures',        value:'3',        trend:'-67%',  up:true},
          {label:'Cost per 1K tokens',       value:'$0.0030',  trend:'stable',up:true},
          {label:'Context Window Used (avg)','value':'34%',    trend:'-5%',   up:true},
          {label:'Human Overrides',          value:'12',       trend:'-20%',  up:true},
        ].map(m=>`
        <div class="flex items-center justify-between p-2.5 bg-space-600 rounded-xl">
          <span class="text-sm text-slate">${m.label}</span>
          <div class="flex items-center gap-3">
            <span class="text-sm font-600 text-white">${m.value}</span>
            <span class="text-xs ${m.up?'text-success':'text-danger'}">${m.trend}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function attachAIHubListeners(agents) {
  // Animate neural bars
  setInterval(() => {
    document.querySelectorAll('#neural-bars > div').forEach(bar => {
      bar.style.height = (Math.floor(Math.random()*80)+20)+'%';
    });
  }, 2000);
}

window.openAgentDetail = function(agentId) {
  const agents = {
    sales:   { name:'Sales Agent',    icon:'💼', desc:'Analyzes your pipeline, scores leads, forecasts revenue, and identifies deal risks.' },
    mkt:     { name:'Marketing Agent',icon:'📢', desc:'Optimizes campaigns, segments audiences, and generates conversion-focused content.' },
    support: { name:'Support Agent',  icon:'🎫', desc:'Routes tickets, drafts responses, detects sentiment, and monitors SLAs.' },
    finance: { name:'Finance Agent',  icon:'💰', desc:'Tracks revenue trends, flags anomalies, and forecasts cash flow.' },
    research:{ name:'Research Agent', icon:'🔬', desc:'Gathers market intelligence and competitive analysis.' },
    content: { name:'Content Agent',  icon:'✍️', desc:'Generates emails, proposals, reports, and social content.' },
    hr:      { name:'HR Agent',       icon:'👥', desc:'Manages recruitment workflows and candidate screening.' },
    exec:    { name:'Executive Agent',icon:'🎯', desc:'Generates board-level summaries and monitors strategic KPIs.' },
    ops:     { name:'Operations Agent',icon:'⚙️',desc:'Monitors system health and optimizes workflow performance.' },
  };
  const a = agents[agentId];
  if (!a) return;
  openModal(`
    <div class="space-y-4">
      <div class="flex items-center gap-4 p-4 bg-space-600 rounded-xl">
        <div class="text-4xl">${a.icon}</div>
        <div><h2 class="text-xl font-display font-700 text-white">${a.name}</h2><p class="text-slate text-sm">${a.desc}</p></div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <button class="btn btn-primary" onclick="window.XPN.ai?.quickAnalyze('I want a full status report and top 5 insights from the ${a.name}. Be specific and data-driven.');closeModal()">🧠 Get Full Report</button>
        <button class="btn btn-secondary" onclick="window.XPN.toast.show('Agent settings saved','success');closeModal()">⚙️ Configure</button>
      </div>
    </div>
  `, a.name);
};

window.toggleAgent = function(id) {
  window.XPN.toast.show(`Agent ${id} status toggled`, 'info');
};
