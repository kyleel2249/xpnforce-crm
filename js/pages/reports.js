// /js/pages/reports.js
import { fmt } from './_helpers.js';

// /js/pages/reports.js
export function renderReports(store) {
  const reports=[
    {name:'Monthly Revenue Report',   type:'Finance',    icon:'💰', last:'2 days ago',  format:'PDF'},
    {name:'Pipeline Health Report',   type:'Sales',      icon:'📊', last:'1 week ago',  format:'PDF'},
    {name:'Campaign Performance',     type:'Marketing',  icon:'📢', last:'3 days ago',  format:'CSV'},
    {name:'Support SLA Report',       type:'Support',    icon:'🎫', last:'1 day ago',   format:'PDF'},
    {name:'Contact Growth Report',    type:'CRM',        icon:'👥', last:'5 days ago',  format:'PDF'},
    {name:'AI Activity Summary',      type:'AI',         icon:'🧠', last:'Today',       format:'PDF'},
    {name:'User Adoption Report',     type:'Admin',      icon:'👤', last:'1 week ago',  format:'PDF'},
    {name:'Executive Dashboard',      type:'Board',      icon:'🎯', last:'Yesterday',   format:'PDF'},
  ];
  return `
  <div class="page-header">
    <div><h1 class="page-title">Reports</h1><p class="page-subtitle">Custom reporting & scheduled exports</p></div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Generate a comprehensive monthly business performance report. Include: revenue vs target ($${fmt(store.revenue)}), pipeline health (${store.deals.length} deals, $${fmt(store.pipeline)} weighted), top 5 contacts by value, support metrics (${store.tickets.length} tickets, ${store.openTickets} open), campaign summary, and 5 strategic recommendations.')">🧠 AI Report</button>
      <button class="btn btn-primary btn-sm" onclick="window.XPN.toast.show('Report builder opening...','info')">+ Build Report</button>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    ${reports.map(r=>`
    <div class="card hover:border-indigo/40 transition-all cursor-pointer group" onclick="window.XPN.toast.show('Generating ${r.name}...','info')">
      <div class="flex items-start gap-3">
        <div class="text-3xl">${r.icon}</div>
        <div class="flex-1 min-w-0">
          <div class="text-white font-600 mb-1">${r.name}</div>
          <div class="flex items-center gap-2 mb-3">
            <span class="badge badge-indigo text-xs">${r.type}</span>
            <span class="badge badge-slate text-xs">${r.format}</span>
          </div>
          <div class="text-xs text-slate">Last generated: ${r.last}</div>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button class="btn btn-secondary btn-sm flex-1 group-hover:border-indigo/50" onclick="event.stopPropagation();window.XPN.toast.show('Downloading ${r.name}','success')">⬇ Download</button>
        <button class="btn btn-secondary btn-sm btn-icon" onclick="event.stopPropagation();window.XPN.toast.show('Schedule set','success')" title="Schedule">🕐</button>
      </div>
    </div>`).join('')}
  </div>`;
}
