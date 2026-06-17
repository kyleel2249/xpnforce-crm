// /js/pages/forecasting.js
import { fmt } from './_helpers.js';
export function renderForecasting(store) {
  const wonDeals = store.deals.filter(d=>d.stage==='closed-won');
  const pipeline = store.deals.filter(d=>!['closed-won','closed-lost'].includes(d.stage));
  const weighted = pipeline.reduce((s,d)=>s+d.value*(d.probability/100),0);
  const months   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const forecast = months.map((_,i)=>Math.round(weighted/12 * (0.7 + i*0.05 + Math.random()*0.2)));

  return `
  <div class="page-header">
    <div><h1 class="page-title">Revenue Forecasting</h1><p class="page-subtitle">AI-powered predictive revenue modeling</p></div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Generate a detailed 90-day revenue forecast. Current pipeline: $${fmt(pipeline.reduce((s,d)=>s+d.value,0))} across ${pipeline.length} deals. Weighted pipeline: $${fmt(weighted)}. Historical conversion: ${store.conversionRate}%. Include best case, expected, and worst case scenarios.')">🧠 AI Forecast</button>
      <button class="btn btn-primary btn-sm" onclick="window.XPN.toast.show('Exporting forecast...','success')">⬇ Export</button>
    </div>
  </div>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      {label:'Weighted Pipeline',value:'$'+fmt(weighted),     color:'indigo', icon:'📊'},
      {label:'Best Case (Q4)',   value:'$'+fmt(weighted*1.3), color:'success',icon:'🚀'},
      {label:'Expected (Q4)',    value:'$'+fmt(weighted*0.85),color:'cyan',   icon:'🎯'},
      {label:'Worst Case (Q4)', value:'$'+fmt(weighted*0.5), color:'danger', icon:'⚠️'},
    ].map(k=>`
    <div class="kpi-card ${k.color}">
      <div class="text-2xl mb-2">${k.icon}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
    </div>`).join('')}
  </div>
  <div class="card mb-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-display font-600 text-white">12-Month Revenue Forecast</h3>
      <div class="flex gap-3 text-xs">
        <span class="flex items-center gap-1.5"><div class="w-3 h-0.5 bg-indigo rounded"></div>Expected</span>
        <span class="flex items-center gap-1.5"><div class="w-3 h-0.5 bg-success rounded"></div>Best Case</span>
        <span class="flex items-center gap-1.5"><div class="w-3 h-0.5 bg-danger rounded" style="border-style:dashed"></div>Worst Case</span>
      </div>
    </div>
    <div style="height:220px">
      <svg width="100%" height="220" viewBox="0 0 900 220" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#4F46E5" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${forecast.map((v,i)=>{
          const max=Math.max(...forecast)*1.35;
          const h=Math.round((v/max)*160);
          const x=10+i*73;
          return `
          <rect x="${x}" y="${185-h}" width="55" height="${h}" rx="4" fill="url(#fcGrad)" opacity="0.6"/>
          <rect x="${x}" y="${185-h}" width="55" height="3" rx="2" fill="#4F46E5"/>
          <text x="${x+27}" y="202" text-anchor="middle" fill="#64748B" font-size="9" font-family="Inter">${months[i]}</text>
          <text x="${x+27}" y="${180-h}" text-anchor="middle" fill="#94A3B8" font-size="8" font-family="JetBrains Mono">$${(v/1000).toFixed(0)}k</text>`;
        }).join('')}
      </svg>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="card">
      <h3 class="font-display font-600 text-white mb-4">Pipeline by Close Date</h3>
      ${['This Month','Next Month','Q4 2026','2027+'].map((period,i) => {
        const val = [weighted*0.2, weighted*0.3, weighted*0.35, weighted*0.15][i];
        return `
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-slate-light">${period}</span>
          <div class="flex items-center gap-3">
            <div class="progress-bar w-32 h-2"><div class="progress-fill indigo" style="width:${[20,30,35,15][i]}%"></div></div>
            <span class="font-mono text-white text-sm w-20 text-right">$${fmt(val)}</span>
          </div>
        </div>`}).join('')}
    </div>
    <div class="card">
      <h3 class="font-display font-600 text-white mb-4">Rep Performance Forecast</h3>
      ${store.users.filter(u=>u.role==='Sales Rep').slice(0,5).map(u=>`
      <div class="flex items-center gap-3 mb-3">
        <div class="avatar avatar-sm font-700" style="background:${u.color}22;color:${u.color}">${u.avatar}</div>
        <div class="flex-1">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-light">${u.name}</span>
            <span class="font-mono text-success">$${fmt(Math.random()*200000+50000)}</span>
          </div>
          <div class="progress-bar h-1.5"><div class="progress-fill success" style="width:${Math.floor(Math.random()*60+30)}%"></div></div>
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}
