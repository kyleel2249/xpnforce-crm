// /js/modules/ai-assistant.js — Claude-backed AI Assistant

export class AIAssistant {
  constructor() {
    this._history = [];
    this._open = false;
    this._init();
  }

  _init() {
    this._addMessage('assistant', `Hello! I'm your **XPNFORCE AI Assistant**, powered by Claude.\n\nI can help you:\n• Analyze your pipeline & forecast revenue\n• Summarize contacts and deal insights\n• Generate reports and recommendations\n• Answer questions about your business data\n\nWhat would you like to know?`);
  }

  togglePanel() {
    const panel = document.getElementById('ai-panel');
    if (this._open) { panel.classList.add('hidden'); this._open = false; }
    else            { panel.classList.remove('hidden'); this._open = true; }
  }

  closePanel() {
    document.getElementById('ai-panel').classList.add('hidden');
    this._open = false;
  }

  async sendMessage() {
    const input = document.getElementById('ai-input');
    const text  = input.value.trim();
    if (!text) return;
    input.value = '';

    this._addMessage('user', text);
    this._history.push({ role: 'user', content: text });

    const typingId = this._addTyping();

    try {
      const reply = await this._callClaude(text);
      this._removeTyping(typingId);
      this._addMessage('assistant', reply);
      this._history.push({ role: 'assistant', content: reply });
    } catch (err) {
      this._removeTyping(typingId);
      this._addMessage('assistant', 'Sorry, I encountered an error. Please check your API connection and try again.\n\n*Error: ' + err.message + '*');
    }
  }

  async _callClaude(userMsg) {
    const store = window.XPN.store;
    const systemPrompt = `You are the AI assistant for XPNFORCE, an enterprise CRM and Business Operating System.

Current business context:
- Total Contacts: ${store.contacts.length}
- Total Deals: ${store.deals.length}
- Open Tickets: ${store.openTickets}
- Revenue (Closed Won): $${store.revenue.toLocaleString()}
- Pipeline Value: $${Math.round(store.pipeline).toLocaleString()}
- Conversion Rate: ${store.conversionRate}%
- Active Campaigns: ${store.campaigns.filter(c=>c.status==='active').length}
- Workflows Running: ${store.workflows.filter(w=>w.status==='active').length}

You have access to this business data and can provide insights, forecasts, recommendations, and analysis. Be concise, data-driven, and actionable. Format responses with markdown where helpful. Never make up specific data not provided in context.`;

    const messages = [
      ...this._history.slice(-8), // Keep last 8 for context window
      { role: 'user', content: userMsg }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'API request failed (' + response.status + ')');
    }

    const data = await response.json();
    return data.content?.map(b => b.text || '').join('') || 'No response received.';
  }

  _addMessage(role, text) {
    const container = document.getElementById('ai-messages');
    const div = document.createElement('div');
    div.className = 'flex ' + (role === 'user' ? 'justify-end' : 'justify-start');

    const formatted = this._format(text);

    div.innerHTML = role === 'user'
      ? `<div class="ai-msg user">${formatted}</div>`
      : `<div class="ai-msg assistant"><div class="ai-label">⬛ XPNFORCE AI</div>${formatted}</div>`;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div.id;
  }

  _addTyping() {
    const container = document.getElementById('ai-messages');
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'flex justify-start';
    div.innerHTML = `<div class="ai-msg assistant"><div class="ai-label">⬛ XPNFORCE AI</div><div class="ai-typing"><span></span><span></span><span></span></div></div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
  }

  _removeTyping(id) {
    document.getElementById(id)?.remove();
  }

  _format(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-light">$1</em>')
      .replace(/`(.*?)`/g, '<code class="font-mono text-cyan bg-space-600 px-1 rounded text-xs">$1</code>')
      .replace(/^• /gm, '<span class="text-indigo-light">•</span> ')
      .replace(/\n/g, '<br>');
  }

  // Quick AI prompts from pages
  async quickAnalyze(topic) {
    const panel = document.getElementById('ai-panel');
    panel.classList.remove('hidden');
    this._open = true;
    document.getElementById('ai-input').value = topic;
    await this.sendMessage();
  }
}
