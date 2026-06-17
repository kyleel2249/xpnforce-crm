// /js/pages/tasks.js
import { fmt, timeAgo } from './_helpers.js';

export function renderTasks(store) {
  const tasks   = store.tasks;
  const overdue = tasks.filter(t => t.status === 'overdue');
  const todo    = tasks.filter(t => t.status === 'todo');
  const inProg  = tasks.filter(t => t.status === 'in-progress');
  const done    = tasks.filter(t => t.status === 'completed');

  setTimeout(() => attachTaskListeners(store), 50);

  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Tasks & Activities</h1>
      <p class="page-subtitle">${tasks.length} tasks · ${overdue.length} overdue · ${done.length} completed</p>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Review my tasks. Which are most critical to business outcomes? What should I prioritize today and why?')">🧠 Prioritize</button>
      <button class="btn btn-primary btn-sm" id="new-task">+ New Task</button>
    </div>
  </div>

  <!-- KPI Row -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    ${[
      { label:'To Do',      value: todo.length,    color:'indigo',  icon:'📋' },
      { label:'In Progress',value: inProg.length,  color:'cyan',    icon:'⚡' },
      { label:'Completed',  value: done.length,    color:'success', icon:'✅' },
      { label:'Overdue',    value: overdue.length, color:'danger',  icon:'🚨' },
    ].map(k => `
    <div class="kpi-card ${k.color}">
      <div class="text-2xl mb-2">${k.icon}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-label">${k.label}</div>
    </div>`).join('')}
  </div>

  <!-- View toggle -->
  <div class="flex gap-2 mb-4">
    <button id="task-view-list"  class="btn btn-primary btn-sm">≡ List</button>
    <button id="task-view-board" class="btn btn-secondary btn-sm">⊞ Board</button>
  </div>

  <!-- List View -->
  <div id="task-list-view">
    <!-- Filters -->
    <div class="card mb-4">
      <div class="flex flex-wrap gap-3">
        <div class="relative flex-1 min-w-48">
          <svg width="14" height="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" id="task-search" placeholder="Search tasks..." class="form-input pl-9" />
        </div>
        <select id="task-status-filter" class="form-select w-40">
          <option value="">All Status</option>
          <option>todo</option><option>in-progress</option><option>completed</option><option>overdue</option>
        </select>
        <select id="task-priority-filter" class="form-select w-36">
          <option value="">All Priority</option>
          <option>high</option><option>medium</option><option>low</option>
        </select>
        <select id="task-sort" class="form-select w-40">
          <option value="due-asc">Due: Soonest</option>
          <option value="priority-desc">Priority: High First</option>
          <option value="status">By Status</option>
        </select>
      </div>
    </div>

    <!-- Overdue banner -->
    ${overdue.length > 0 ? `
    <div class="flex items-center gap-3 p-4 bg-danger/10 border border-danger/30 rounded-xl mb-4">
      <span class="text-2xl">🚨</span>
      <div class="flex-1">
        <div class="text-white font-600 text-sm">${overdue.length} overdue task${overdue.length>1?'s':''}</div>
        <div class="text-xs text-slate">These tasks need immediate attention</div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="window.XPN.ai?.quickAnalyze('I have ${overdue.length} overdue tasks. Help me create a plan to catch up and prevent future overdue tasks.')">Get AI Help</button>
    </div>` : ''}

    <div class="card">
      <table class="data-table" id="tasks-table">
        <thead>
          <tr>
            <th><input type="checkbox" id="task-select-all" class="rounded" /></th>
            <th>Task</th><th>Assignee</th><th>Due Date</th><th>Priority</th><th>Status</th><th>Related</th><th>Actions</th>
          </tr>
        </thead>
        <tbody id="tasks-tbody">
          ${renderTaskRows(tasks)}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Board View (Kanban) -->
  <div id="task-board-view" class="hidden">
    <div class="kanban-board">
      ${[
        { id:'todo',        label:'To Do',       color:'#64748B', tasks: todo },
        { id:'in-progress', label:'In Progress', color:'#4F46E5', tasks: inProg },
        { id:'completed',   label:'Completed',   color:'#10B981', tasks: done },
        { id:'overdue',     label:'Overdue',     color:'#EF4444', tasks: overdue },
      ].map(col => `
      <div class="kanban-col" style="min-width:260px">
        <div class="kanban-col-header">
          <div>
            <div class="kanban-col-title" style="color:${col.color}">${col.label}</div>
            <div class="text-xs text-slate mt-0.5">${col.tasks.length} tasks</div>
          </div>
          <div class="w-2 h-2 rounded-full" style="background:${col.color}"></div>
        </div>
        ${col.tasks.map(t => `
        <div class="kanban-card">
          <div class="flex items-start justify-between mb-2">
            <span class="text-sm font-500 text-white leading-tight flex-1">${t.title}</span>
            <span class="badge ${t.priority==='high'?'badge-danger':t.priority==='medium'?'badge-warning':'badge-slate'} ml-2 flex-shrink-0 text-xs">${t.priority}</span>
          </div>
          <div class="text-xs text-slate mb-2">${t.related}</div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono ${new Date(t.due) < new Date() && t.status!=='completed' ? 'text-danger' : 'text-slate'}">${new Date(t.due).toLocaleDateString()}</span>
            <span class="text-xs text-slate">${t.assignee}</span>
          </div>
        </div>`).join('')}
        <button class="w-full mt-2 py-2 text-xs text-slate hover:text-white border border-dashed border-space-500 hover:border-indigo rounded-xl transition-colors"
                onclick="quickAddTask('${col.id}')">+ Add task</button>
      </div>`).join('')}
    </div>
  </div>`;
}

function renderTaskRows(tasks) {
  return tasks.map(t => {
    const isOverdue = new Date(t.due) < new Date() && t.status !== 'completed';
    return `
    <tr data-task-id="${t.id}">
      <td><input type="checkbox" class="task-check rounded" data-id="${t.id}" /></td>
      <td>
        <div class="text-white font-500 text-sm ${t.status==='completed'?'line-through opacity-60':''}">${t.title}</div>
      </td>
      <td class="text-sm">${t.assignee}</td>
      <td class="text-xs font-mono ${isOverdue?'text-danger font-600':''}">${new Date(t.due).toLocaleDateString()}${isOverdue?' ⚠':''}
      </td>
      <td><span class="badge ${t.priority==='high'?'badge-danger':t.priority==='medium'?'badge-warning':'badge-slate'}">${t.priority}</span></td>
      <td><span class="badge ${t.status==='completed'?'badge-success':t.status==='overdue'?'badge-danger':t.status==='in-progress'?'badge-indigo':'badge-slate'}">${t.status}</span></td>
      <td class="text-xs text-slate">${t.related}</td>
      <td>
        <div class="flex gap-1">
          ${t.status !== 'completed' ? `<button class="btn btn-secondary btn-sm" onclick="completeTask('${t.id}')">✓ Done</button>` : ''}
          <button class="btn btn-secondary btn-sm btn-icon" onclick="editTask('${t.id}')">✏️</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteTask('${t.id}')">🗑</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function attachTaskListeners(store) {
  // New task
  document.getElementById('new-task')?.addEventListener('click', () => {
    openModal(`
      <div class="space-y-4">
        <div class="form-group"><label class="form-label">Task Title</label>
          <input class="form-input" id="nt-title" placeholder="e.g. Follow up with Acme Corp" /></div>
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group"><label class="form-label">Due Date</label>
            <input class="form-input" id="nt-due" type="date" /></div>
          <div class="form-group"><label class="form-label">Priority</label>
            <select class="form-select" id="nt-priority">
              <option>low</option><option selected>medium</option><option>high</option>
            </select>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Assignee</label>
          <input class="form-input" id="nt-assignee" value="Demo User" /></div>
        <div class="form-group"><label class="form-label">Related To</label>
          <input class="form-input" id="nt-related" placeholder="Deal #, Contact name, etc." /></div>
        <div class="form-group"><label class="form-label">Notes</label>
          <textarea class="form-textarea" id="nt-notes" placeholder="Additional context..."></textarea></div>
        <button class="btn btn-primary w-full" onclick="saveNewTask()">Create Task</button>
      </div>
    `, 'New Task');
  });

  // View toggle
  document.getElementById('task-view-list')?.addEventListener('click', () => {
    document.getElementById('task-list-view').classList.remove('hidden');
    document.getElementById('task-board-view').classList.add('hidden');
    document.getElementById('task-view-list').classList.replace('btn-secondary','btn-primary');
    document.getElementById('task-view-board').classList.replace('btn-primary','btn-secondary');
  });
  document.getElementById('task-view-board')?.addEventListener('click', () => {
    document.getElementById('task-board-view').classList.remove('hidden');
    document.getElementById('task-list-view').classList.add('hidden');
    document.getElementById('task-view-board').classList.replace('btn-secondary','btn-primary');
    document.getElementById('task-view-list').classList.replace('btn-primary','btn-secondary');
  });

  // Search
  document.getElementById('task-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const f = store.tasks.filter(t => t.title.toLowerCase().includes(q) || t.related.toLowerCase().includes(q));
    document.getElementById('tasks-tbody').innerHTML = renderTaskRows(f);
  });

  // Filters
  document.getElementById('task-status-filter')?.addEventListener('change', e => {
    const v = e.target.value;
    const f = v ? store.tasks.filter(t => t.status === v) : store.tasks;
    document.getElementById('tasks-tbody').innerHTML = renderTaskRows(f);
  });
  document.getElementById('task-priority-filter')?.addEventListener('change', e => {
    const v = e.target.value;
    const f = v ? store.tasks.filter(t => t.priority === v) : store.tasks;
    document.getElementById('tasks-tbody').innerHTML = renderTaskRows(f);
  });

  // Sort
  document.getElementById('task-sort')?.addEventListener('change', e => {
    let s = [...store.tasks];
    if (e.target.value === 'due-asc')       s.sort((a,b) => new Date(a.due) - new Date(b.due));
    if (e.target.value === 'priority-desc') s.sort((a,b) => ['high','medium','low'].indexOf(a.priority) - ['high','medium','low'].indexOf(b.priority));
    if (e.target.value === 'status')        s.sort((a,b) => a.status.localeCompare(b.status));
    document.getElementById('tasks-tbody').innerHTML = renderTaskRows(s);
  });
}

window.saveNewTask = function() {
  const title = document.getElementById('nt-title')?.value.trim();
  if (!title) { window.XPN.toast.show('Title required', 'error'); return; }
  const t = {
    id: 'task' + Date.now(),
    title,
    due: document.getElementById('nt-due')?.value || new Date(Date.now()+7*86400000).toISOString(),
    priority: document.getElementById('nt-priority')?.value || 'medium',
    assignee: document.getElementById('nt-assignee')?.value || 'Demo User',
    related: document.getElementById('nt-related')?.value || '',
    status: 'todo',
  };
  window.XPN.store.tasks.unshift(t);
  closeModal();
  window.XPN.toast.show('Task created: ' + title, 'success');
  window.XPN.router.navigate('tasks');
};

window.completeTask = function(id) {
  const t = window.XPN.store.tasks.find(t => t.id === id);
  if (t) { t.status = 'completed'; }
  document.querySelector(`tr[data-task-id="${id}"]`)?.remove();
  window.XPN.toast.show('Task completed! ✅', 'success');
};

window.deleteTask = function(id) {
  window.XPN.store.tasks = window.XPN.store.tasks.filter(t => t.id !== id);
  document.querySelector(`tr[data-task-id="${id}"]`)?.remove();
  window.XPN.toast.show('Task deleted', 'warning');
};

window.editTask = function(id) {
  const t = window.XPN.store.tasks.find(t => t.id === id);
  if (!t) return;
  openModal(`
    <div class="space-y-4">
      <div class="form-group"><label class="form-label">Title</label>
        <input class="form-input" id="et-title" value="${t.title}" /></div>
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group"><label class="form-label">Due Date</label>
          <input class="form-input" id="et-due" type="date" value="${new Date(t.due).toISOString().split('T')[0]}" /></div>
        <div class="form-group"><label class="form-label">Priority</label>
          <select class="form-select" id="et-priority">
            <option ${t.priority==='low'?'selected':''}>low</option>
            <option ${t.priority==='medium'?'selected':''}>medium</option>
            <option ${t.priority==='high'?'selected':''}>high</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-select" id="et-status">
          <option ${t.status==='todo'?'selected':''}>todo</option>
          <option ${t.status==='in-progress'?'selected':''}>in-progress</option>
          <option ${t.status==='completed'?'selected':''}>completed</option>
        </select>
      </div>
      <button class="btn btn-primary w-full" onclick="
        window.XPN.store.tasks.find(x=>x.id==='${id}').title = document.getElementById('et-title').value;
        window.XPN.store.tasks.find(x=>x.id==='${id}').priority = document.getElementById('et-priority').value;
        window.XPN.store.tasks.find(x=>x.id==='${id}').status = document.getElementById('et-status').value;
        window.XPN.toast.show('Task updated!','success');closeModal();window.XPN.router.navigate('tasks')
      ">Save Changes</button>
    </div>
  `, 'Edit Task');
};

window.quickAddTask = function(status) {
  openModal(`
    <div class="space-y-4">
      <div class="form-group"><label class="form-label">Task Title</label>
        <input class="form-input" id="qa-title" placeholder="Quick task..." /></div>
      <input type="hidden" id="qa-status" value="${status}" />
      <button class="btn btn-primary w-full" onclick="
        const title=document.getElementById('qa-title').value.trim();
        if(!title){window.XPN.toast.show('Title required','error');return;}
        window.XPN.store.tasks.unshift({id:'task'+Date.now(),title,status:'${status}',priority:'medium',assignee:'Demo User',due:new Date(Date.now()+7*86400000).toISOString(),related:''});
        window.XPN.toast.show('Task added!','success');closeModal();window.XPN.router.navigate('tasks')
      ">Add Task</button>
    </div>
  `, 'Quick Add Task');
};
