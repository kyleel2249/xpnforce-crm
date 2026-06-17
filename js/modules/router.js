// /js/modules/router.js

import { renderDashboard }    from '../pages/dashboard.js';
import { renderContacts }     from '../pages/contacts.js';
import { renderCompanies }    from '../pages/companies.js';
import { renderPipeline }     from '../pages/pipeline.js';
import { renderSupport }      from '../pages/support.js';
import { renderCampaigns }    from '../pages/campaigns.js';
import { renderAnalytics }    from '../pages/analytics.js';
import { renderWorkflows }    from '../pages/workflows.js';
import { renderTasks }        from '../pages/tasks.js';
import { renderInvoices }     from '../pages/invoices.js';
import { renderUsers }        from '../pages/users.js';
import { renderSettings }     from '../pages/settings.js';
import { renderAIHub }        from '../pages/ai-hub.js';
import { renderActivities }   from '../pages/activities.js';
import { renderSegments }     from '../pages/segments.js';
import { renderJourneys }     from '../pages/journeys.js';
import { renderLiveChat }     from '../pages/live-chat.js';
import { renderKnowledge }    from '../pages/knowledge.js';
import { renderForecasting }  from '../pages/forecasting.js';
import { renderReports }      from '../pages/reports.js';
import { renderIntegrations } from '../pages/integrations.js';
import { renderTeamChat }     from '../pages/team-chat.js';

const ROUTES = {
  'dashboard':    renderDashboard,
  'contacts':     renderContacts,
  'companies':    renderCompanies,
  'pipeline':     renderPipeline,
  'support':      renderSupport,
  'campaigns':    renderCampaigns,
  'analytics':    renderAnalytics,
  'workflows':    renderWorkflows,
  'tasks':        renderTasks,
  'invoices':     renderInvoices,
  'users':        renderUsers,
  'settings':     renderSettings,
  'ai-hub':       renderAIHub,
  'activities':   renderActivities,
  'segments':     renderSegments,
  'journeys':     renderJourneys,
  'live-chat':    renderLiveChat,
  'knowledge':    renderKnowledge,
  'forecasting':  renderForecasting,
  'reports':      renderReports,
  'integrations': renderIntegrations,
  'team-chat':    renderTeamChat,
};

export class Router {
  constructor() {
    this.current = null;
    window.addEventListener('popstate', () => {
      const route = location.hash.replace('#', '') || 'dashboard';
      this._render(route, false);
    });
  }

  navigate(route, pushState = true) {
    if (route === this.current) return;
    if (pushState) {
      history.pushState({}, '', '#' + route);
      sessionStorage.setItem('xpn-route', route);
    }
    this._render(route);
  }

  _render(route) {
    this.current = route;
    const container = document.getElementById('page-container');
    container.innerHTML = '<div class="flex items-center justify-center h-32 text-slate">Loading...</div>';

    const fn = ROUTES[route];
    if (fn) {
      try {
        const html = fn(window.XPN.store);
        container.innerHTML = html || '';
        // Run any page-level scripts
        window.XPN.bus.emit('page:rendered', { route });
      } catch (err) {
        console.error('Page render error:', err);
        container.innerHTML = this._errorPage(route, err);
      }
    } else {
      container.innerHTML = this._notFound(route);
    }

    window.XPN.nav.setActive(route);
    window.scrollTo(0, 0);
  }

  _notFound(route) {
    return `
      <div class="flex flex-col items-center justify-center h-64 text-center">
        <div class="text-5xl mb-4">🔭</div>
        <h2 class="font-display text-xl text-white mb-2">Page not found</h2>
        <p class="text-slate mb-4">Route "${route}" doesn't exist yet.</p>
        <button onclick="window.XPN.router.navigate('dashboard')" class="btn btn-primary">Go to Dashboard</button>
      </div>`;
  }

  _errorPage(route, err) {
    return `
      <div class="flex flex-col items-center justify-center h-64 text-center">
        <div class="text-5xl mb-4">⚠️</div>
        <h2 class="font-display text-xl text-white mb-2">Something went wrong</h2>
        <p class="text-slate mb-4 font-mono text-xs">${err.message}</p>
        <button onclick="window.XPN.router.navigate('dashboard')" class="btn btn-primary">Go to Dashboard</button>
      </div>`;
  }
}
