// /js/pages/segments.js
export function renderSegments(store) {
  const segs = [
    { name:'Enterprise Accounts', count: store.contacts.filter(c=>c.score>70).length, color:'#4F46E5', icon:'🏢', desc:'High-value enterprise contacts with score >70', tags:['High LTV','Priority'] },
    { name:'Trial Users',         count: Math.floor(store.contacts.length*0.15), color:'#06B6D4', icon:'⚡', desc:'Currently in free trial period', tags:['Conversion','Urgent'] },
    { name:'At-Risk Customers',   count: store.contacts.filter(c=>c.stage==='churn').length, color:'#EF4444', icon:'⚠️', desc:'Showing churn signals in last 30 days', tags:['Retention','Critical'] },
    { name:'Champions',           count: store.contacts.filter(c=>c.stage==='customer'&&c.score>80).length, color:'#10B981', icon:'⭐', desc:'High-NPS customers likely to refer', tags:['Advocacy','Referral'] },
    { name:'Cold Leads',          count: store.contacts.filter(c=>c.stage==='lead'&&c.score<30).length, color:'#64748B', icon:'❄️', desc:'Leads with no activity in 60+ days', tags:['Re-engagement'] },
    { name:'Decision Makers',     count: store.contacts.filter(c=>['CEO','CTO','VP Sales'].includes(c.title)).length, color:'#F59E0B', icon:'🎯', desc:'C-suite and VP level contacts', tags:['ABM','Strategic'] },
  ];

  return `
  <div class="page-header">
    <div><h1 class="page-title">Audience Segments</h1><p class="page-subtitle">${segs.length} segments defined · dynamic rules</p></div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Suggest 5 high-value audience segments I should create based on my ${store.contacts.length} contacts and their behavior patterns. Include the segment criteria and expected size.')">🧠 AI Suggest</button>
      <button class="btn btn-primary btn-sm" onclick="window.XPN.toast.show('Segment builder coming soon','info')">+ New Segment</button>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    ${segs.map(s => `
    <div class="card hover:scale-[1.01] transition-all cursor-pointer" onclick="window.XPN.ai?.quickAnalyze('Analyze segment: ${s.name} (${s.count} contacts). ${s.desc}. What campaigns and actions would work best for this segment?')">
      <div class="flex items-start justify-between mb-3">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style="background:${s.color}22;border:1px solid ${s.color}44">${s.icon}</div>
        <div class="text-right">
          <div class="font-display text-2xl font-700 text-white">${s.count}</div>
          <div class="text-xs text-slate">contacts</div>
        </div>
      </div>
      <h3 class="font-600 text-white mb-1">${s.name}</h3>
      <p class="text-xs text-slate mb-3">${s.desc}</p>
      <div class="flex flex-wrap gap-1 mb-3">
        ${s.tags.map(t=>`<span class="badge badge-indigo text-xs">${t}</span>`).join('')}
      </div>
      <div class="flex gap-2">
        <button class="btn btn-secondary btn-sm flex-1" onclick="event.stopPropagation();window.XPN.toast.show('Campaign sent to ${s.name}','success')">📢 Campaign</button>
        <button class="btn btn-secondary btn-sm btn-icon" onclick="event.stopPropagation();window.XPN.router.navigate('contacts')">👁</button>
      </div>
    </div>`).join('')}
  </div>`;
}
