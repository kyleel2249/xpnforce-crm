// /js/pages/activities.js
import { fmt, timeAgo } from './_helpers.js';

export function renderActivities(store) {
  const acts  = store.activities;
  const icons = {email:'📧',call:'📞',meeting:'📅',note:'📝','deal-update':'💼','contact-created':'👤','ticket-opened':'🎫','campaign-sent':'📢'};
  const colors= {email:'indigo',call:'cyan',meeting:'success',note:'slate','deal-update':'warning','contact-created':'cyan','ticket-opened':'danger','campaign-sent':'indigo'};
  const byType = {};
  acts.forEach(a => { byType[a.type] = (byType[a.type]||0)+1; });

  setTimeout(() => {
    document.getElementById('log-activity')?.addEventListener('click', () => {
      openModal(`
        <div class="space-y-4">
          <div class="form-group"><label class="form-label">Activity Type</label>
            <select class="form-select" id="na-type">
              <option>email</option><option>call</option><option>meeting</option><option>note</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Description</label>
            <textarea class="form-textarea" id="na-desc" placeholder="What happened?"></textarea></div>
          <div class="form-group"><label class="form-label">Related Contact / Deal</label>
            <input class="form-input" id="na-related" placeholder="Name or ID" /></div>
          <button class="btn btn-primary w-full" onclick="window.XPN.toast.show('Activity logged!','success');closeModal()">Log Activity</button>
        </div>
      `, 'Log Activity');
    });
  }, 50);

  return `
  <div class="page-header">
    <div><h1 class="page-title">Activity Feed</h1><p class="page-subtitle">${acts.length} activities logged · live updates</p></div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Analyze my team activity patterns. What types of activities correlate most with won deals? Where should we focus effort?')">🧠 Analyze</button>
      <button class="btn btn-primary btn-sm" id="log-activity">+ Log Activity</button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Feed -->
    <div class="lg:col-span-2">
      <!-- Type filter -->
      <div class="flex gap-2 mb-4 flex-wrap">
        <button class="act-filter btn btn-primary btn-sm" data-type="">All</button>
        ${Object.entries(icons).map(([t,i]) => `
        <button class="act-filter btn btn-secondary btn-sm" data-type="${t}">${i} ${t.replace('-',' ')}</button>`).join('')}
      </div>

      <div class="card">
        <div class="flex items-center gap-2 mb-4">
          <div class="dot-live"></div>
          <span class="text-white font-600">Live Activity Stream</span>
        </div>
        <div id="activity-feed" class="space-y-0 max-h-[600px] overflow-y-auto">
          ${acts.map(a => `
          <div class="timeline-item" data-type="${a.type}">
            <div class="timeline-dot text-sm flex-shrink-0" style="background:var(--space-600);border:1px solid var(--space-500)">${icons[a.type]||'•'}</div>
            <div class="pt-0.5 flex-1">
              <div class="text-sm text-slate-light">${a.desc}</div>
              <div class="flex items-center gap-3 mt-1 flex-wrap">
                <span class="text-xs text-slate">${a.user}</span>
                <span class="text-xs text-slate font-mono">${timeAgo(a.time)}</span>
                <span class="badge badge-slate text-xs">${a.entity}</span>
                <span class="badge badge-${colors[a.type]||'slate'} text-xs">${a.type}</span>
              </div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Summary Sidebar -->
    <div class="space-y-4">
      <div class="card">
        <h3 class="font-600 text-white mb-4">Activity Breakdown</h3>
        ${Object.entries(byType).map(([type, count]) => `
        <div class="flex items-center gap-3 mb-3">
          <span class="text-lg w-8 flex-shrink-0 text-center">${icons[type]||'•'}</span>
          <div class="flex-1">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-slate-light capitalize">${type.replace('-',' ')}</span>
              <span class="font-mono text-white">${count}</span>
            </div>
            <div class="progress-bar h-1.5">
              <div class="progress-fill indigo" style="width:${Math.round(count/acts.length*100)}%"></div>
            </div>
          </div>
        </div>`).join('')}
      </div>

      <div class="card">
        <h3 class="font-600 text-white mb-3">Top Team Members</h3>
        ${store.users.slice(0,5).map((u,i) => `
        <div class="flex items-center gap-3 py-2 border-b border-space-500/50 last:border-0">
          <div class="avatar avatar-sm font-700" style="background:${u.color}22;color:${u.color}">${u.avatar}</div>
          <div class="flex-1 min-w-0">
            <div class="text-sm text-white truncate">${u.name}</div>
            <div class="text-xs text-slate">${Math.floor(Math.random()*30+5)} activities</div>
          </div>
          <div class="text-xs font-mono text-indigo-light">#${i+1}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}
