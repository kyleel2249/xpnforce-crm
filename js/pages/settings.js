// /js/pages/settings.js
export function renderSettings(store) {
  setTimeout(() => attachSettingsListeners(), 50);
  return `
  <div class="page-header">
    <div><h1 class="page-title">System Settings</h1><p class="page-subtitle">Configure your XPNFORCE workspace</p></div>
    <button class="btn btn-primary btn-sm" id="save-settings">Save All Changes</button>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Sidebar Nav -->
    <div class="space-y-1.5">
      ${[
        {id:'general',    icon:'⚙️', label:'General'},
        {id:'security',   icon:'🔐', label:'Security & Auth'},
        {id:'ai',         icon:'🧠', label:'AI Configuration'},
        {id:'notifs',     icon:'🔔', label:'Notifications'},
        {id:'billing',    icon:'💳', label:'Billing & Plan'},
        {id:'api',        icon:'🔌', label:'API & Webhooks'},
        {id:'data',       icon:'🗄️', label:'Data & Privacy'},
        {id:'audit',      icon:'📋', label:'Audit Logs'},
        {id:'firebase',   icon:'🔥', label:'Firebase Config'},
      ].map((s,i) => `
      <button class="settings-tab w-full text-left px-4 py-3 rounded-xl ${i===0?'bg-indigo/20 border border-indigo/40 text-indigo-light':'text-slate-light hover:bg-space-600 hover:text-white'} transition-all text-sm font-500 flex items-center gap-3"
              data-panel="${s.id}">
        <span>${s.icon}</span>${s.label}
      </button>`).join('')}
    </div>

    <!-- Panels -->
    <div class="lg:col-span-3 space-y-0">
      <!-- General Panel -->
      <div class="settings-panel card" data-panel="general">
        <h3 class="font-display font-600 text-white mb-5">General Settings</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group col-span-2"><label class="form-label">Organization Name</label>
            <input class="form-input" value="XPNFORCE Demo Organization" /></div>
          <div class="form-group"><label class="form-label">Admin Email</label>
            <input class="form-input" type="email" value="admin@xpnforce.com" /></div>
          <div class="form-group"><label class="form-label">Website</label>
            <input class="form-input" value="https://xpnforce.com" /></div>
          <div class="form-group"><label class="form-label">Timezone</label>
            <select class="form-select">
              <option>UTC</option><option selected>America/New_York (EST)</option>
              <option>America/Los_Angeles (PST)</option><option>Europe/London (GMT)</option>
              <option>Asia/Tokyo (JST)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Date Format</label>
            <select class="form-select"><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option></select>
          </div>
          <div class="form-group"><label class="form-label">Currency</label>
            <select class="form-select"><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select>
          </div>
          <div class="form-group"><label class="form-label">Language</label>
            <select class="form-select"><option selected>English (US)</option><option>English (UK)</option><option>Spanish</option><option>French</option></select>
          </div>
        </div>
        <div class="mt-5 space-y-3">
          ${[
            {label:'Dark Mode',  sub:'Use dark theme across the app', on:true},
            {label:'Compact View',sub:'Reduce spacing for more data on screen',on:false},
            {label:'AI Features',sub:'Enable AI-powered insights and automation',on:true},
            {label:'Beta Features',sub:'Get early access to new features',on:false},
          ].map(s=>`
          <div class="flex items-center justify-between p-3 bg-space-600 rounded-xl">
            <div><div class="text-sm text-white font-500">${s.label}</div><div class="text-xs text-slate mt-0.5">${s.sub}</div></div>
            <div class="w-12 h-6 ${s.on?'bg-indigo':'bg-space-500'} rounded-full relative cursor-pointer transition-colors toggle-switch">
              <div class="w-5 h-5 bg-white rounded-full absolute ${s.on?'right-0.5':'left-0.5'} top-0.5 shadow transition-all"></div>
            </div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Security Panel (hidden) -->
      <div class="settings-panel card hidden" data-panel="security">
        <h3 class="font-display font-600 text-white mb-5">Security & Authentication</h3>
        <div class="space-y-4">
          ${[
            {label:'Multi-Factor Authentication',sub:'Require MFA for all users',on:true},
            {label:'SSO / SAML',sub:'Enable Single Sign-On integration',on:false},
            {label:'IP Allowlist',sub:'Restrict access to specific IP ranges',on:false},
            {label:'Session Timeout',sub:'Auto-logout after 30 minutes of inactivity',on:true},
            {label:'Audit Logging',sub:'Log all user actions for compliance',on:true},
            {label:'Password Policy',sub:'Enforce strong password requirements',on:true},
          ].map(s=>`
          <div class="flex items-center justify-between p-4 bg-space-600 rounded-xl">
            <div><div class="text-sm text-white font-600">${s.label}</div><div class="text-xs text-slate mt-0.5">${s.sub}</div></div>
            <div class="w-12 h-6 ${s.on?'bg-indigo':'bg-space-500'} rounded-full relative cursor-pointer toggle-switch">
              <div class="w-5 h-5 bg-white rounded-full absolute ${s.on?'right-0.5':'left-0.5'} top-0.5 shadow"></div>
            </div>
          </div>`).join('')}
          <div class="p-4 bg-success/10 border border-success/30 rounded-xl">
            <div class="text-success font-600 text-sm mb-1">✓ Zero-Trust Security Active</div>
            <div class="text-xs text-slate">AES-256 encryption at rest · TLS 1.3 in transit · WAF enabled · SOC2 compliant</div>
          </div>
        </div>
      </div>

      <!-- AI Panel (hidden) -->
      <div class="settings-panel card hidden" data-panel="ai">
        <h3 class="font-display font-600 text-white mb-5">AI Configuration</h3>
        <div class="space-y-4">
          <div class="form-group"><label class="form-label">AI Model</label>
            <select class="form-select"><option selected>Claude Sonnet 4.6 (Recommended)</option><option>Claude Opus 4.6 (Advanced)</option><option>Claude Haiku 4.5 (Fast)</option></select>
          </div>
          <div class="form-group"><label class="form-label">Anthropic API Key</label>
            <div class="relative">
              <input class="form-input pr-20" type="password" id="anthropic-key" placeholder="sk-ant-..." />
              <button class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-secondary btn-sm" onclick="window.XPN.toast.show('API key saved!','success')">Save</button>
            </div>
            <p class="text-xs text-slate mt-1">Required for AI features. Get yours at console.anthropic.com</p>
          </div>
          ${[
            {label:'Lead Scoring AI',sub:'Automatically score contacts based on behavior',on:true},
            {label:'Deal Win Prediction',sub:'AI forecasts deal close probability',on:true},
            {label:'Sentiment Analysis',sub:'Detect customer sentiment in communications',on:true},
            {label:'Auto-Summarization',sub:'AI summarizes contacts, deals, and tickets',on:true},
            {label:'Churn Prediction',sub:'Identify at-risk customers proactively',on:true},
            {label:'Content Generation',sub:'AI drafts emails, proposals, and reports',on:false},
          ].map(s=>`
          <div class="flex items-center justify-between p-3 bg-space-600 rounded-xl">
            <div><div class="text-sm text-white font-500">${s.label}</div><div class="text-xs text-slate">${s.sub}</div></div>
            <div class="w-12 h-6 ${s.on?'bg-cyan':'bg-space-500'} rounded-full relative cursor-pointer toggle-switch">
              <div class="w-5 h-5 bg-white rounded-full absolute ${s.on?'right-0.5':'left-0.5'} top-0.5 shadow"></div>
            </div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Firebase Panel (hidden) -->
      <div class="settings-panel card hidden" data-panel="firebase">
        <h3 class="font-display font-600 text-white mb-5">🔥 Firebase Configuration</h3>
        <div class="p-4 bg-warning/10 border border-warning/30 rounded-xl mb-4">
          <div class="text-warning font-600 text-sm mb-1">⚠ Configuration Required</div>
          <div class="text-xs text-slate">Replace placeholder values in <code class="font-mono text-cyan">index.html</code> with your Firebase project credentials.</div>
        </div>
        <div class="space-y-3">
          ${['apiKey','authDomain','databaseURL','projectId','storageBucket','messagingSenderId','appId','measurementId'].map(k=>`
          <div class="form-group"><label class="form-label">${k}</label>
            <input class="form-input font-mono" id="fb-${k}" placeholder="your-${k.toLowerCase()}" /></div>`).join('')}
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-secondary flex-1" onclick="window.XPN.toast.show('Test connection...','info')">Test Connection</button>
          <button class="btn btn-primary flex-1" onclick="window.XPN.toast.show('Firebase config saved!','success')">Save Config</button>
        </div>
      </div>

      <!-- Other panels all hidden, show placeholder -->
      ${['notifs','billing','api','data','audit'].map(p=>`
      <div class="settings-panel card hidden" data-panel="${p}">
        <h3 class="font-display font-600 text-white mb-4">${p.charAt(0).toUpperCase()+p.slice(1)} Settings</h3>
        <div class="text-center py-8">
          <div class="text-4xl mb-3">🔧</div>
          <p class="text-slate">This settings panel is configured via your deployment environment.</p>
          <button class="btn btn-secondary btn-sm mt-4" onclick="window.XPN.toast.show('Opening documentation','info')">View Docs</button>
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}

function attachSettingsListeners() {
  // Tab switching
  document.querySelectorAll('.settings-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.settings-tab').forEach(b => {
        b.className = b.className.replace('bg-indigo/20 border border-indigo/40 text-indigo-light','text-slate-light hover:bg-space-600 hover:text-white');
      });
      btn.className = btn.className.replace('text-slate-light hover:bg-space-600 hover:text-white','bg-indigo/20 border border-indigo/40 text-indigo-light');
      const panel = btn.dataset.panel;
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.add('hidden'));
      document.querySelector(`.settings-panel[data-panel="${panel}"]`)?.classList.remove('hidden');
    });
  });

  // Toggle switches
  document.querySelectorAll('.toggle-switch').forEach(sw => {
    sw.addEventListener('click', () => {
      const isOn = sw.classList.contains('bg-indigo') || sw.classList.contains('bg-cyan');
      const onColor = sw.classList.contains('bg-cyan') ? 'bg-cyan' : 'bg-indigo';
      sw.classList.toggle(onColor, !isOn);
      sw.classList.toggle('bg-space-500', isOn);
      const dot = sw.querySelector('div');
      dot.classList.toggle('right-0.5', !isOn);
      dot.classList.toggle('left-0.5', isOn);
    });
  });

  document.getElementById('save-settings')?.addEventListener('click', () => {
    window.XPN.toast.show('Settings saved successfully!', 'success');
  });
}
