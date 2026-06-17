// /js/pages/companies.js
import { fmt, timeAgo, stageBadge } from './_helpers.js';

export function renderCompanies(store) {
  const companies = store.companies;
  setTimeout(() => attachCompanyListeners(store), 50);

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Companies</h1>
      <p class="page-subtitle">${companies.length} companies · ${companies.filter(c=>c.stage==='customer').length} customers</p>
    </div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Analyze my company accounts. Which companies have the highest growth potential? What upsell opportunities exist?')">🧠 AI Insights</button>
      <button class="btn btn-secondary btn-sm" id="export-companies">⬇ Export</button>
      <button class="btn btn-primary btn-sm" id="new-company">+ Add Company</button>
    </div>
  </div>

  <!-- KPIs -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      { label:'Total Companies', value: companies.length, color:'indigo', icon:'🏢' },
      { label:'Customers',       value: companies.filter(c=>c.stage==='customer').length, color:'success', icon:'✅' },
      { label:'Total ARR',       value: '$'+fmt(companies.filter(c=>c.stage==='customer').reduce((s,c)=>s+c.revenue,0)), color:'cyan', icon:'💰' },
      { label:'Avg Company Size',value: Math.round(companies.reduce((s,c)=>s+c.employees,0)/companies.length).toLocaleString()+' emp', color:'warning', icon:'👥' },
    ].map(k=>`
    <div class="kpi-card ${k.color}">
      <div class="text-2xl mb-2">${k.icon}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
    </div>`).join('')}
  </div>

  <!-- Filters -->
  <div class="card mb-5">
    <div class="flex flex-wrap gap-3">
      <div class="relative flex-1 min-w-48">
        <svg width="14" height="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="company-search" placeholder="Search companies..." class="form-input pl-9" />
      </div>
      <select id="filter-industry" class="form-select w-44">
        <option value="">All Industries</option>
        ${[...new Set(companies.map(c=>c.industry))].map(i=>`<option>${i}</option>`).join('')}
      </select>
      <select id="filter-company-stage" class="form-select w-36">
        <option value="">All Stages</option>
        <option>lead</option><option>prospect</option><option>customer</option>
      </select>
      <select id="sort-companies" class="form-select w-44">
        <option value="revenue-desc">Revenue: High → Low</option>
        <option value="name-asc">Name: A → Z</option>
        <option value="employees-desc">Size: Largest First</option>
        <option value="score-desc">Score: High → Low</option>
      </select>
    </div>
  </div>

  <!-- Industry breakdown pills -->
  <div class="flex gap-2 mb-5 flex-wrap">
    ${[...new Set(companies.map(c=>c.industry))].slice(0,6).map(ind=>`
    <button class="industry-pill px-3 py-1.5 rounded-xl border border-space-500 text-slate text-sm hover:border-indigo/50 hover:text-white transition-all"
            data-industry="${ind}">${ind} <span class="text-xs ml-1 text-slate">(${companies.filter(c=>c.industry===ind).length})</span></button>`).join('')}
  </div>

  <!-- Companies Grid / Table Toggle -->
  <div class="flex gap-2 mb-4">
    <button id="co-view-table" class="btn btn-primary btn-sm">≡ Table</button>
    <button id="co-view-grid"  class="btn btn-secondary btn-sm">⊞ Cards</button>
  </div>

  <!-- Table View -->
  <div id="co-table-view">
    <div class="card">
      <table class="data-table" id="companies-table">
        <thead>
          <tr><th>Company</th><th>Industry</th><th>Size</th><th>Revenue</th><th>Stage</th><th>Score</th><th>Owner</th><th>Actions</th></tr>
        </thead>
        <tbody id="companies-tbody">
          ${renderCompanyRows(companies.slice(0,20))}
        </tbody>
      </table>
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-space-500">
        <span class="text-sm text-slate">Showing ${Math.min(20,companies.length)} of ${companies.length}</span>
        <button class="btn btn-secondary btn-sm" id="load-more-companies">Load More →</button>
      </div>
    </div>
  </div>

  <!-- Card View (hidden) -->
  <div id="co-grid-view" class="hidden">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${companies.slice(0,12).map(co=>renderCompanyCard(co)).join('')}
    </div>
  </div>`;
}

function renderCompanyRows(companies) {
  const industryColors = {'Technology':'#4F46E5','Finance':'#06B6D4','Healthcare':'#10B981','Retail':'#F59E0B','Manufacturing':'#EF4444','Education':'#8B5CF6','Media':'#EC4899','Real Estate':'#F97316','Energy':'#14B8A6','Transportation':'#6366F1'};
  return companies.map(co => `
  <tr class="cursor-pointer" onclick="viewCompany('${co.id}')">
    <td>
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-800 flex-shrink-0"
             style="background:${industryColors[co.industry]||'#4F46E5'}22;color:${industryColors[co.industry]||'#4F46E5'};border:1px solid ${industryColors[co.industry]||'#4F46E5'}44">
          ${co.name.substring(0,2).toUpperCase()}
        </div>
        <div>
          <div class="text-white font-600 text-sm">${co.name}</div>
          <div class="text-xs text-slate">${co.domain}</div>
        </div>
      </div>
    </td>
    <td><span class="badge badge-slate text-xs">${co.industry}</span></td>
    <td class="font-mono text-sm">${co.employees.toLocaleString()}</td>
    <td class="font-mono text-success">$${fmt(co.revenue)}</td>
    <td><span class="badge ${stageBadge(co.stage)}">${co.stage}</span></td>
    <td><div class="score-ring ${co.score>=70?'high':co.score>=40?'medium':'low'} w-9 h-9 text-xs">${co.score}</div></td>
    <td class="text-sm">${co.owner||'Demo User'}</td>
    <td>
      <div class="flex gap-1">
        <button class="btn btn-secondary btn-sm btn-icon" onclick="event.stopPropagation();viewCompany('${co.id}')">👁</button>
        <button class="btn btn-secondary btn-sm btn-icon" onclick="event.stopPropagation();window.XPN.ai?.quickAnalyze('Analyze company: ${co.name} in ${co.industry} industry with ${co.employees} employees and $${fmt(co.revenue)} revenue. What opportunities exist?')">🧠</button>
      </div>
    </td>
  </tr>`).join('');
}

function renderCompanyCard(co) {
  return `
  <div class="card hover:border-indigo/40 transition-all cursor-pointer" onclick="viewCompany('${co.id}')">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-xl bg-indigo/20 border border-indigo/30 flex items-center justify-center text-lg font-800 text-indigo-light">
        ${co.name.substring(0,2).toUpperCase()}
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-white font-600 truncate">${co.name}</div>
        <div class="text-xs text-slate">${co.domain}</div>
      </div>
      <span class="badge ${stageBadge(co.stage)}">${co.stage}</span>
    </div>
    <div class="grid grid-cols-2 gap-2 mb-3">
      ${[['Industry',co.industry],['Employees',co.employees.toLocaleString()],['Revenue','$'+fmt(co.revenue)],['Score',co.score+'/100']]
        .map(([k,v])=>`<div class="bg-space-600 rounded-lg p-2"><div class="text-xs text-slate">${k}</div><div class="text-sm text-white font-500">${v}</div></div>`).join('')}
    </div>
    <div class="flex gap-2">
      <button class="btn btn-secondary btn-sm flex-1" onclick="event.stopPropagation();viewCompany('${co.id}')">View Details</button>
      <button class="btn btn-secondary btn-sm btn-icon" onclick="event.stopPropagation();window.XPN.toast.show('Email sent','info')">📧</button>
    </div>
  </div>`;
}

function attachCompanyListeners(store) {
  document.getElementById('new-company')?.addEventListener('click', () => {
    openModal(`
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group col-span-2"><label class="form-label">Company Name</label><input class="form-input" id="nco-name" placeholder="Acme Corp" /></div>
        <div class="form-group"><label class="form-label">Domain</label><input class="form-input" id="nco-domain" placeholder="acmecorp.com" /></div>
        <div class="form-group"><label class="form-label">Industry</label>
          <select class="form-select" id="nco-industry">
            ${['Technology','Finance','Healthcare','Retail','Manufacturing','Education','Media','Real Estate','Energy','Transportation'].map(i=>`<option>${i}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Employees</label><input class="form-input" id="nco-size" type="number" placeholder="100" /></div>
        <div class="form-group"><label class="form-label">Annual Revenue ($)</label><input class="form-input" id="nco-rev" type="number" placeholder="1000000" /></div>
        <div class="form-group col-span-2"><label class="form-label">Stage</label>
          <select class="form-select" id="nco-stage"><option>lead</option><option>prospect</option><option>customer</option></select>
        </div>
      </div>
      <button class="btn btn-primary w-full mt-4" onclick="window.XPN.toast.show('Company added!','success');closeModal()">Add Company</button>
    `, 'New Company');
  });

  // Table/Grid toggle
  document.getElementById('co-view-table')?.addEventListener('click', () => {
    document.getElementById('co-table-view').classList.remove('hidden');
    document.getElementById('co-grid-view').classList.add('hidden');
    document.getElementById('co-view-table').classList.replace('btn-secondary','btn-primary');
    document.getElementById('co-view-grid').classList.replace('btn-primary','btn-secondary');
  });
  document.getElementById('co-view-grid')?.addEventListener('click', () => {
    document.getElementById('co-grid-view').classList.remove('hidden');
    document.getElementById('co-table-view').classList.add('hidden');
    document.getElementById('co-view-grid').classList.replace('btn-secondary','btn-primary');
    document.getElementById('co-view-table').classList.replace('btn-primary','btn-secondary');
  });

  // Search
  document.getElementById('company-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const f = store.companies.filter(c=>c.name.toLowerCase().includes(q)||c.domain.toLowerCase().includes(q)||c.industry.toLowerCase().includes(q));
    document.getElementById('companies-tbody').innerHTML = renderCompanyRows(f.slice(0,20));
  });

  // Industry filter
  document.querySelectorAll('.industry-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.industry-pill').forEach(b=>b.classList.remove('border-indigo/50','text-white','bg-indigo/10'));
      btn.classList.add('border-indigo/50','text-white','bg-indigo/10');
      const f = store.companies.filter(c=>c.industry===btn.dataset.industry);
      document.getElementById('companies-tbody').innerHTML = renderCompanyRows(f.slice(0,20));
    });
  });

  // Sort
  document.getElementById('sort-companies')?.addEventListener('change', e => {
    let s = [...store.companies];
    switch(e.target.value) {
      case 'revenue-desc':   s.sort((a,b)=>b.revenue-a.revenue); break;
      case 'name-asc':       s.sort((a,b)=>a.name.localeCompare(b.name)); break;
      case 'employees-desc': s.sort((a,b)=>b.employees-a.employees); break;
      case 'score-desc':     s.sort((a,b)=>b.score-a.score); break;
    }
    document.getElementById('companies-tbody').innerHTML = renderCompanyRows(s.slice(0,20));
  });

  document.getElementById('load-more-companies')?.addEventListener('click', () => {
    const cur = document.getElementById('companies-tbody').querySelectorAll('tr').length;
    document.getElementById('companies-tbody').innerHTML += renderCompanyRows(store.companies.slice(cur, cur+10));
  });

  document.getElementById('export-companies')?.addEventListener('click', () => {
    const csv = ['Name,Domain,Industry,Employees,Revenue,Stage,Score']
      .concat(store.companies.map(c=>`${c.name},${c.domain},${c.industry},${c.employees},${c.revenue},${c.stage},${c.score}`))
      .join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download = 'xpnforce-companies.csv'; a.click();
    window.XPN.toast.show('Companies exported!','success');
  });
}

window.viewCompany = function(id) {
  const co = window.XPN.store.companies.find(c=>c.id===id);
  if (!co) return;
  openModal(`
    <div class="space-y-4">
      <div class="flex items-center gap-4 p-4 bg-space-600 rounded-xl">
        <div class="w-14 h-14 rounded-xl bg-indigo/20 border border-indigo/30 flex items-center justify-center text-xl font-800 text-indigo-light">${co.name.substring(0,2).toUpperCase()}</div>
        <div><h2 class="text-xl font-display font-700 text-white">${co.name}</h2><p class="text-slate">${co.domain} · ${co.industry}</p></div>
        <span class="badge ${stageBadge(co.stage)} ml-auto">${co.stage}</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        ${[['Employees',co.employees.toLocaleString()],['Annual Revenue','$'+fmt(co.revenue)],['Industry',co.industry],['Score',co.score+'/100']]
          .map(([k,v])=>`<div class="bg-space-600 rounded-xl p-3"><div class="text-xs text-slate uppercase mb-1">${k}</div><div class="text-sm text-white font-600">${v}</div></div>`).join('')}
      </div>
      <div class="flex gap-2">
        <button class="btn btn-primary flex-1" onclick="closeModal()">View Contacts</button>
        <button class="btn btn-secondary flex-1" onclick="window.XPN.ai?.quickAnalyze('Analyze ${co.name}: ${co.industry} company, ${co.employees} employees, $${fmt(co.revenue)} revenue, stage: ${co.stage}. What is the best strategy for this account?');closeModal()">🧠 AI Strategy</button>
      </div>
    </div>
  `, co.name);
};
