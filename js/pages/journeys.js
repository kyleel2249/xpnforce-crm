// /js/pages/journeys.js
export function renderJourneys(store) {
  const journeys = [
    { name:'Enterprise Onboarding',  steps:7, active:23, completed:156, conv:'68%', color:'#4F46E5' },
    { name:'Trial → Paid Conversion',steps:5, active:41, completed:89,  conv:'34%', color:'#06B6D4' },
    { name:'Churn Prevention',        steps:4, active:12, completed:45,  conv:'71%', color:'#10B981' },
    { name:'Upsell Campaign',         steps:6, active:8,  completed:34,  conv:'28%', color:'#F59E0B' },
    { name:'Win-Back Sequence',       steps:5, active:19, completed:67,  conv:'19%', color:'#8B5CF6' },
  ];

  return `
  <div class="page-header">
    <div><h1 class="page-title">Customer Journeys</h1><p class="page-subtitle">${journeys.length} journeys · visual automation builder</p></div>
    <div class="flex gap-3">
      <button class="btn btn-secondary btn-sm" onclick="window.XPN.ai?.quickAnalyze('Design an optimal customer journey for new enterprise trial users. Include touchpoints, timing, content suggestions, and conversion goals for each stage.')">🧠 AI Design</button>
      <button class="btn btn-primary btn-sm" onclick="window.XPN.toast.show('Journey builder opening...','info')">+ New Journey</button>
    </div>
  </div>
  <div class="space-y-4">
    ${journeys.map(j => `
    <div class="card hover:border-indigo/40 transition-all cursor-pointer" onclick="window.XPN.ai?.quickAnalyze('Analyze customer journey: ${j.name}. It has ${j.steps} steps, ${j.active} active users, ${j.completed} completed, ${j.conv} conversion rate. How can I improve it?')">
      <div class="flex items-center gap-4 flex-wrap">
        <div>
          <div class="text-white font-600 mb-1">${j.name}</div>
          <div class="text-xs text-slate">${j.steps} steps · ${j.active} active · ${j.completed} completed</div>
        </div>
        <div class="flex-1 min-w-[200px]">
          <!-- Journey step visualization -->
          <div class="flex items-center gap-1">
            ${Array.from({length:j.steps},(_,i)=>`
            <div class="flex items-center gap-1 flex-1">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                   style="background:${j.color}${i<3?'':'44'};color:${i<3?'white':j.color}">${i+1}</div>
              ${i<j.steps-1?`<div class="flex-1 h-0.5 rounded" style="background:${j.color}${i<2?'':'22'}"></div>`:''}
            </div>`).join('')}
          </div>
        </div>
        <div class="flex items-center gap-6 flex-shrink-0">
          <div class="text-center">
            <div class="font-display text-xl font-700" style="color:${j.color}">${j.conv}</div>
            <div class="text-xs text-slate">Conv. Rate</div>
          </div>
          <div class="text-center">
            <div class="font-display text-xl font-700 text-white">${j.active}</div>
            <div class="text-xs text-slate">Active</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();window.XPN.toast.show('Opening journey editor','info')">Edit</button>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}
