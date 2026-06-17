// /js/pages/integrations.js
export function renderIntegrations(store) {
  const cats = ['All','Email','Chat','Payments','Analytics','CRM','Video','Finance','Automation'];
  const integrations=[
    {name:'Gmail',              cat:'Email',      icon:'📧', connected:true,  users:1200000, desc:'Sync emails, track opens, log conversations'},
    {name:'Outlook',            cat:'Email',      icon:'📮', connected:false, users:800000,  desc:'Microsoft email integration'},
    {name:'Slack',              cat:'Chat',       icon:'💬', connected:true,  users:2000000, desc:'Real-time team notifications and alerts'},
    {name:'Microsoft Teams',    cat:'Chat',       icon:'🔷', connected:false, users:1500000, desc:'Collaborate and receive CRM alerts in Teams'},
    {name:'Stripe',             cat:'Payments',   icon:'💳', connected:true,  users:900000,  desc:'Sync payments, invoices, and subscriptions'},
    {name:'PayPal',             cat:'Payments',   icon:'🅿️', connected:false, users:700000,  desc:'Accept and track PayPal payments'},
    {name:'Google Analytics',   cat:'Analytics',  icon:'📊', connected:false, users:1100000, desc:'Track website visitors and conversions'},
    {name:'HubSpot',            cat:'CRM',        icon:'🔶', connected:false, users:500000,  desc:'Import contacts and deal history'},
    {name:'Salesforce',         cat:'CRM',        icon:'☁️', connected:false, users:600000,  desc:'Bi-directional CRM data sync'},
    {name:'Zoom',               cat:'Video',      icon:'📹', connected:false, users:800000,  desc:'Schedule and log video meetings'},
    {name:'QuickBooks',         cat:'Finance',    icon:'📒', connected:false, users:400000,  desc:'Sync invoices and financial data'},
    {name:'Xero',               cat:'Finance',    icon:'🔵', connected:false, users:300000,  desc:'Accounting and invoice sync'},
    {name:'Zapier',             cat:'Automation', icon:'⚡', connected:true,  users:2500000, desc:'Connect with 5000+ apps via Zapier'},
    {name:'Shopify',            cat:'Automation', icon:'🛍️', connected:false, users:700000,  desc:'Sync e-commerce customers and orders'},
    {name:'Intercom',           cat:'Chat',       icon:'💭', connected:false, users:500000,  desc:'Import conversation history and contacts'},
  ];

  setTimeout(()=>{
    document.querySelectorAll('.int-cat-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('.int-cat-btn').forEach(b=>b.classList.replace('btn-primary','btn-secondary'));
        btn.classList.replace('btn-secondary','btn-primary');
        const cat=btn.dataset.cat;
        document.querySelectorAll('.integration-card').forEach(card=>{
          const show = cat==='All' || card.dataset.cat===cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  },50);

  return `
  <div class="page-header">
    <div><h1 class="page-title">Integrations</h1><p class="page-subtitle">${integrations.filter(i=>i.connected).length} connected · ${integrations.length} available</p></div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.toast.show('Opening API docs','info')">📄 API Docs</button>
      <button class="btn btn-primary btn-sm" onclick="window.XPN.toast.show('Custom integration builder opening...','info')">+ Custom Integration</button>
    </div>
  </div>
  <!-- Category Filter -->
  <div class="flex gap-2 mb-6 flex-wrap">
    ${cats.map((c,i)=>`<button class="int-cat-btn btn ${i===0?'btn-primary':'btn-secondary'} btn-sm" data-cat="${c}">${c}</button>`).join('')}
  </div>
  <!-- Connected Banner -->
  <div class="p-4 bg-success/10 border border-success/30 rounded-xl mb-6">
    <div class="flex items-center gap-3">
      <span class="text-2xl">✅</span>
      <div>
        <div class="text-white font-600">${integrations.filter(i=>i.connected).length} Integrations Active</div>
        <div class="text-sm text-slate">Gmail, Slack, Stripe, and Zapier are syncing your data</div>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    ${integrations.map(int=>`
    <div class="card integration-card hover:border-indigo/40 transition-all ${int.connected?'border-success/30':''}" data-cat="${int.cat}">
      <div class="flex items-start gap-3 mb-3">
        <span class="text-3xl">${int.icon}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <div class="text-white font-600">${int.name}</div>
            ${int.connected?'<span class="badge badge-success text-xs">Connected</span>':''}
          </div>
          <div class="text-xs text-slate">${(int.users/1000).toFixed(0)}K+ users · ${int.cat}</div>
        </div>
      </div>
      <p class="text-xs text-slate mb-4">${int.desc}</p>
      <button class="btn ${int.connected?'btn-danger':'btn-primary'} btn-sm w-full"
        onclick="window.XPN.toast.show('${int.name} ${int.connected?'disconnected':'connected'}!','${int.connected?'warning':'success'}')">
        ${int.connected?'Disconnect':'Connect'}
      </button>
    </div>`).join('')}
  </div>`;
}
