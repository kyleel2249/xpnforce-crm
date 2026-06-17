// /js/pages/knowledge.js
export function renderKnowledge(store) {
  const articles = [
    { title:'Getting Started with XPNFORCE',        cat:'Onboarding',  views:1284, helpful:96, updated:'2d ago' },
    { title:'Setting Up Your Sales Pipeline',        cat:'CRM',         views:892,  helpful:94, updated:'5d ago' },
    { title:'How to Import Contacts (CSV & Excel)',  cat:'Data',        views:754,  helpful:91, updated:'1w ago' },
    { title:'AI Features Overview',                  cat:'AI',          views:621,  helpful:98, updated:'3d ago' },
    { title:'Workflow Automation Guide',             cat:'Automation',  views:543,  helpful:89, updated:'1w ago' },
    { title:'Firebase Integration Setup',            cat:'Technical',   views:478,  helpful:85, updated:'2w ago' },
    { title:'API Reference & Authentication',        cat:'Developers',  views:432,  helpful:92, updated:'4d ago' },
    { title:'GDPR Compliance & Data Privacy',        cat:'Legal',       views:389,  helpful:88, updated:'1w ago' },
    { title:'Billing & Subscription Management',     cat:'Billing',     views:367,  helpful:90, updated:'3d ago' },
  ];

  return `
  <div class="page-header">
    <div><h1 class="page-title">Knowledge Base</h1><p class="page-subtitle">${articles.length} articles · self-service documentation</p></div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Based on my ${store.tickets.length} support tickets, what knowledge base articles should I create first to reduce ticket volume? List the top 8 with suggested content outlines.')">🧠 AI Suggestions</button>
      <button class="btn btn-primary btn-sm" onclick="window.XPN.toast.show('Article editor opening...','info')">+ New Article</button>
    </div>
  </div>
  <div class="relative mb-6">
    <svg width="18" height="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    <input type="text" placeholder="Search knowledge base..." class="form-input pl-12 py-4 text-base" />
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-3">
      ${articles.map(a => `
      <div class="card flex items-center gap-4 hover:border-indigo/40 transition-all cursor-pointer" onclick="window.XPN.toast.show('Opening article...','info')">
        <div class="flex-1 min-w-0">
          <div class="text-white font-600 mb-1">${a.title}</div>
          <div class="flex items-center gap-3 text-xs text-slate">
            <span class="badge badge-indigo">${a.cat}</span>
            <span>${a.views.toLocaleString()} views</span>
            <span>👍 ${a.helpful}% helpful</span>
            <span>Updated ${a.updated}</span>
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate flex-shrink-0"><path d="M9 18l6-6-6-6"/></svg>
      </div>`).join('')}
    </div>
    <div class="space-y-4">
      <div class="card">
        <h3 class="font-600 text-white mb-3">Categories</h3>
        ${[...new Set(articles.map(a=>a.cat))].map(cat=>`
        <div class="flex justify-between items-center py-2 border-b border-space-500/50 last:border-0 cursor-pointer hover:text-white transition-colors text-sm text-slate-light">
          <span>${cat}</span>
          <span class="badge badge-slate">${articles.filter(a=>a.cat===cat).length}</span>
        </div>`).join('')}
      </div>
      <div class="card">
        <h3 class="font-600 text-white mb-3">Most Viewed</h3>
        ${articles.sort((a,b)=>b.views-a.views).slice(0,3).map((a,i)=>`
        <div class="flex items-start gap-3 py-2 border-b border-space-500/50 last:border-0">
          <span class="text-indigo-light font-700 text-sm mt-0.5">${i+1}</span>
          <div>
            <div class="text-sm text-slate-light hover:text-white cursor-pointer">${a.title}</div>
            <div class="text-xs text-slate">${a.views.toLocaleString()} views</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}
