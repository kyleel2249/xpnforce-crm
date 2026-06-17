// /js/pages/team-chat.js
export function renderTeamChat(store) {
  const channels = [
    {name:'general',   unread:0, members:store.users.length},
    {name:'sales',     unread:3, members:8},
    {name:'support',   unread:1, members:6},
    {name:'marketing', unread:0, members:5},
    {name:'dev',       unread:2, members:4},
    {name:'leadership',unread:0, members:3},
  ];
  const msgs=[
    {user:'Alex Chen',   color:'#4F46E5', time:'10:24 AM', msg:'Q4 pipeline looking strong! Just pushed us to 87% of target 🚀'},
    {user:'Jordan Kim',  color:'#06B6D4', time:'10:31 AM', msg:'Just closed NovaTech — $48K enterprise deal. They want the full suite!'},
    {user:'Demo User',   color:'#10B981', time:'10:33 AM', msg:'Amazing! That deal pushes us over the line. Great work @Jordan 🎉'},
    {user:'Sam Rivera',  color:'#F59E0B', time:'10:41 AM', msg:'Critical ticket from Acme Corp resolved. New KB article published too.'},
    {user:'Casey Williams',color:'#8B5CF6',time:'10:55 AM',msg:'New campaign went live — 41% open rate in the first hour. Best ever!'},
    {user:'Riley Johnson',color:'#EC4899',time:'11:03 AM',msg:'Board deck for Q4 review is ready for review in Google Drive 📊'},
  ];

  return `
  <div class="page-header">
    <div><h1 class="page-title">Team Chat</h1><p class="page-subtitle">${store.users.filter(u=>u.active).length} team members online</p></div>
  </div>
  <div class="card p-0 overflow-hidden flex" style="height:620px">
    <!-- Sidebar -->
    <div class="w-56 bg-space-600 border-r border-space-500 flex flex-col flex-shrink-0">
      <div class="p-4 border-b border-space-500">
        <input type="text" placeholder="Search..." class="form-input text-xs py-2" />
      </div>
      <div class="flex-1 overflow-y-auto p-2">
        <div class="text-xs text-slate uppercase tracking-wider px-2 py-2">Channels</div>
        ${channels.map((ch,i)=>`
        <div class="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer ${i===0?'bg-indigo/20 text-white':'text-slate hover:text-white hover:bg-space-500'} transition-all mb-0.5">
          <span class="text-slate-light text-sm">#</span>
          <span class="flex-1 text-sm">${ch.name}</span>
          ${ch.unread>0?`<span class="badge badge-danger text-xs">${ch.unread}</span>`:''}
        </div>`).join('')}
        <div class="text-xs text-slate uppercase tracking-wider px-2 py-2 mt-3">Direct Messages</div>
        ${store.users.slice(0,5).map(u=>`
        <div class="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-slate hover:text-white hover:bg-space-500 transition-all mb-0.5">
          <div class="relative">
            <div class="avatar avatar-sm" style="background:${u.color}22;color:${u.color};font-weight:700">${u.avatar}</div>
            <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${u.active?'bg-success':'bg-slate'} border border-space-600"></div>
          </div>
          <span class="text-sm truncate">${u.name.split(' ')[0]}</span>
        </div>`).join('')}
      </div>
    </div>

    <!-- Chat Main -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="p-4 border-b border-space-500 flex items-center gap-3">
        <span class="text-slate-light">#</span>
        <span class="text-white font-600">general</span>
        <span class="text-xs text-slate">· ${store.users.length} members</span>
        <div class="ml-auto flex gap-2">
          <button class="btn btn-secondary btn-sm btn-icon" title="Search">🔍</button>
          <button class="btn btn-secondary btn-sm btn-icon" title="Members">👥</button>
        </div>
      </div>
      <div class="flex-1 p-4 space-y-4 overflow-y-auto">
        ${msgs.map(m=>`
        <div class="flex gap-3">
          <div class="avatar avatar-sm flex-shrink-0 font-700" style="background:${m.color}22;color:${m.color};margin-top:2px">${m.user.split(' ').map(w=>w[0]).join('')}</div>
          <div class="flex-1">
            <div class="flex items-baseline gap-2 mb-0.5">
              <span class="text-sm font-600 text-white">${m.user}</span>
              <span class="text-xs text-slate font-mono">${m.time}</span>
            </div>
            <div class="text-sm text-slate-light">${m.msg}</div>
          </div>
        </div>`).join('')}
      </div>
      <div class="p-4 border-t border-space-500">
        <div class="bg-space-600 border border-space-500 rounded-xl flex items-center gap-2 px-3 py-2">
          <input type="text" id="team-chat-input" placeholder="Message #general" class="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate" />
          <div class="flex gap-2">
            <button class="text-slate hover:text-white transition-colors text-lg" title="Emoji">😊</button>
            <button class="text-slate hover:text-white transition-colors text-lg" title="Attach">📎</button>
            <button class="btn btn-primary btn-sm" onclick="sendTeamMsg()">Send</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Members Panel -->
    <div class="w-48 border-l border-space-500 p-3 hidden lg:block bg-space-600">
      <div class="text-xs text-slate uppercase tracking-wider mb-3">Online · ${store.users.filter(u=>u.active).length}</div>
      ${store.users.filter(u=>u.active).slice(0,8).map(u=>`
      <div class="flex items-center gap-2 mb-2">
        <div class="relative">
          <div class="avatar avatar-sm font-700" style="background:${u.color}22;color:${u.color}">${u.avatar}</div>
          <div class="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-success border border-space-600"></div>
        </div>
        <span class="text-xs text-slate-light truncate">${u.name.split(' ')[0]}</span>
      </div>`).join('')}
    </div>
  </div>`;
}

window.sendTeamMsg = function() {
  const input = document.getElementById('team-chat-input');
  if (!input?.value.trim()) return;
  window.XPN.toast.show('Message sent to #general', 'success');
  input.value = '';
};

window.openChat = function(id) {
  window.XPN.toast.show('Opening chat with customer #'+id, 'info');
};
