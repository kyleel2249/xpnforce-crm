// /js/pages/live-chat.js
export function renderLiveChat(store) {
  const chats = [
    { id:1, name:'James Smith',    company:'Acme Corp',    msg:'I need help with my API integration',   time:'2m', status:'active',   urgent:true  },
    { id:2, name:'Sarah Johnson',  company:'TechFlow',     msg:'How do I export my contacts to CSV?',  time:'5m', status:'active',   urgent:false },
    { id:3, name:'Michael Chen',   company:'NovaTech',     msg:'Billing question about my invoice',    time:'8m', status:'waiting',  urgent:false },
    { id:4, name:'Emma Wilson',    company:'GlobalSoft',   msg:'The dashboard isn\'t loading properly', time:'12m',status:'waiting',  urgent:true  },
    { id:5, name:'David Martinez', company:'Apex Solutions',msg:'Can I upgrade my plan?',              time:'18m',status:'resolved', urgent:false },
  ];

  return `
  <div class="page-header">
    <div><h1 class="page-title">Live Chat</h1>
      <p class="page-subtitle">${chats.filter(c=>c.status!=='resolved').length} active chats · avg response 2.4 min</p>
    </div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Generate 10 quick-reply templates for the most common customer questions: API help, billing, data export, plan upgrades, and performance issues.')">🧠 Generate Replies</button>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 card p-0 overflow-hidden" style="height:600px">
    <!-- Chat List -->
    <div class="border-r border-space-500 overflow-y-auto">
      <div class="p-3 border-b border-space-500">
        <input type="text" placeholder="Search chats..." class="form-input text-sm py-2" />
      </div>
      ${chats.map(c => `
      <div class="p-4 border-b border-space-500/50 cursor-pointer hover:bg-space-600 transition-colors ${c.status==='active'?'bg-indigo/5':''}" onclick="openChat(${c.id})">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="avatar avatar-sm bg-indigo/20 text-indigo-light font-700">${c.name[0]}</div>
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-space-700 ${c.status==='active'?'bg-success':c.status==='waiting'?'bg-warning':'bg-slate'}"></div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-sm font-600 text-white">${c.name}</span>
              <span class="text-xs text-slate">${c.time}</span>
            </div>
            <div class="text-xs text-slate truncate">${c.msg}</div>
          </div>
          ${c.urgent?'<div class="w-2 h-2 bg-danger rounded-full flex-shrink-0"></div>':''}
        </div>
      </div>`).join('')}
    </div>

    <!-- Chat Window -->
    <div class="lg:col-span-2 flex flex-col">
      <div class="p-4 border-b border-space-500 flex items-center gap-3">
        <div class="avatar avatar-sm bg-indigo/20 text-indigo-light font-700">J</div>
        <div>
          <div class="text-white font-600 text-sm">James Smith</div>
          <div class="text-xs text-slate">Acme Corp · Online · API Integration issue</div>
        </div>
        <div class="ml-auto flex gap-2">
          <button class="btn btn-secondary btn-sm btn-icon" onclick="window.XPN.ai?.quickAnalyze('Draft a helpful reply for a customer asking about API integration. Include a quick explanation and link to docs.')">🧠</button>
          <button class="btn btn-secondary btn-sm" onclick="window.XPN.toast.show('Ticket created','success')">Create Ticket</button>
        </div>
      </div>
      <div class="flex-1 p-4 space-y-4 overflow-y-auto">
        ${[
          {from:'customer',msg:'Hi, I need help with my API integration. Getting a 401 error.',time:'10:22 AM'},
          {from:'agent',   msg:'Hello James! I\'m here to help. A 401 error means authentication issue. Can you check if your API key is included in the Authorization header?',time:'10:23 AM'},
          {from:'customer',msg:'Oh I see, let me check... yes it was missing the Bearer prefix!',time:'10:25 AM'},
          {from:'agent',   msg:'That\'s the fix! Your header should be: Authorization: Bearer YOUR_API_KEY. Let me know if you need anything else 👍',time:'10:26 AM'},
        ].map(m=>`
        <div class="flex ${m.from==='agent'?'justify-end':'justify-start'}">
          <div class="max-w-[75%] rounded-2xl px-4 py-2.5 ${m.from==='agent'?'bg-indigo/30 border border-indigo/40':'bg-space-600 border border-space-500'}">
            <p class="text-sm text-white">${m.msg}</p>
            <span class="text-xs text-slate mt-1 block">${m.time}</span>
          </div>
        </div>`).join('')}
      </div>
      <div class="p-4 border-t border-space-500">
        <div class="flex gap-2">
          <input type="text" id="chat-msg" placeholder="Type a message... or press 🧠 for AI draft" class="form-input flex-1" />
          <button class="btn btn-secondary btn-sm btn-icon" onclick="window.XPN.ai?.quickAnalyze('Draft a professional, empathetic customer support reply for an API integration issue with a 401 error. Keep it under 2 sentences.')">🧠</button>
          <button class="btn btn-primary btn-sm" onclick="window.XPN.toast.show('Message sent','success')">Send</button>
        </div>
      </div>
    </div>
  </div>`;
}
