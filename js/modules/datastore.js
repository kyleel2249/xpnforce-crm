// /js/modules/datastore.js — Local data store with IndexedDB + seed data

export class DataStore {
  constructor() {
    this.contacts   = [];
    this.companies  = [];
    this.deals      = [];
    this.tickets    = [];
    this.tasks      = [];
    this.campaigns  = [];
    this.activities = [];
    this.users      = [];
    this.invoices   = [];
    this.workflows  = [];
    this._db        = null;
  }

  async init() {
    await this._openIDB();
    await this._seed();
  }

  _openIDB() {
    return new Promise((res) => {
      try {
        if (!window.indexedDB) {
          console.warn('IndexedDB not available, using memory only');
          return res();
        }
        const req = indexedDB.open('xpnforce-db', 1);
        req.onupgradeneeded = e => {
          const db = e.target.result;
          ['contacts','companies','deals','tickets','tasks','campaigns','activities','invoices','workflows'].forEach(store => {
            if (!db.objectStoreNames.contains(store)) {
              db.createObjectStore(store, { keyPath: 'id' });
            }
          });
        };
        req.onsuccess = e => { this._db = e.target.result; res(); };
        req.onerror = () => { console.warn('IDB unavailable, using memory only'); res(); };
      } catch (err) {
        console.warn('IndexedDB threw synchronously, using memory only:', err);
        res();
      }
    });
  }
  
  async _seed() {
    // Always generate fresh seed data in memory (demo mode)
    this.contacts = this._genContacts(120);
    this.companies = this._genCompanies(40);
    this.deals    = this._genDeals(80);
    this.tickets  = this._genTickets(60);
    this.tasks    = this._genTasks(50);
    this.campaigns= this._genCampaigns(12);
    this.activities = this._genActivities(200);
    this.invoices = this._genInvoices(45);
    this.workflows= this._genWorkflows(8);
    this.users    = this._genUsers(24);
  }

  // ── Generators ──────────────────────────────────────────────
  _genContacts(n) {
    const first = ['James','Sarah','Michael','Emma','David','Olivia','Robert','Sophia','William','Ava','Daniel','Isabella','Joseph','Mia','Thomas','Charlotte','Charles','Amelia','Christopher','Harper','Andrew','Evelyn','Matthew','Abigail'];
    const last  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Martinez','Anderson','Taylor','Thomas','Moore','Jackson','White','Harris','Martin','Thompson','Young'];
    const companies = ['Acme Corp','TechFlow','GlobalSoft','NovaTech','Apex Solutions','Zenith Digital','Cascade Systems','Vertex AI','Prism Labs','Orbit Technologies'];
    const stages = ['lead','prospect','customer','retention','churn'];
    const out = [];
    for (let i = 0; i < n; i++) {
      const fn = first[i % first.length];
      const ln = last[Math.floor(i / first.length) % last.length];
      const co = companies[i % companies.length];
      out.push({
        id:       'c' + (i + 1).toString().padStart(4,'0'),
        name:     fn + ' ' + ln,
        email:    fn.toLowerCase() + '.' + ln.toLowerCase() + '@' + co.toLowerCase().replace(/\s+/g,'-') + '.com',
        phone:    '+1 (' + (300+i).toString().substring(0,3) + ') ' + Math.floor(Math.random()*900+100) + '-' + Math.floor(Math.random()*9000+1000),
        company:  co,
        title:    ['CEO','CTO','VP Sales','Director','Manager','Engineer','Analyst','Designer'][i%8],
        stage:    stages[i % stages.length],
        score:    Math.floor(Math.random() * 100),
        value:    Math.floor(Math.random() * 500000 + 1000),
        tags:     [['enterprise','vip','priority','trial','at-risk'][i%5]],
        owner:    'Demo User',
        created:  new Date(Date.now() - Math.random()*90*86400000).toISOString(),
        lastContact: new Date(Date.now() - Math.random()*30*86400000).toISOString(),
        avatar:   fn[0] + ln[0],
        color:    ['#4F46E5','#06B6D4','#10B981','#F59E0B','#EF4444','#8B5CF6'][i%6],
      });
    }
    return out;
  }

  _genCompanies(n) {
    const names = ['Acme Corp','TechFlow','GlobalSoft','NovaTech','Apex Solutions','Zenith Digital','Cascade Systems','Vertex AI','Prism Labs','Orbit Technologies','BlueSky Ventures','RedShift Analytics','GreenPath Solutions','IronClad Security','SilverBullet Tech','CopperLeaf Industries','GoldStream Capital','PlatinumEdge','DiamondCore','SapphireCloud','EmeraldAI','RubyStream','TitanForce','NexusCore','QuantumLeap','FusionWave','HorizonAI','PeakPerform','SummitTech','CrystalClear'];
    const industries = ['Technology','Finance','Healthcare','Retail','Manufacturing','Education','Media','Real Estate','Energy','Transportation'];
    return Array.from({length: n}, (_, i) => ({
      id:       'co' + (i+1).toString().padStart(3,'0'),
      name:     names[i] || 'Company ' + (i+1),
      domain:   (names[i]||'company'+i).toLowerCase().replace(/\s+/g,'')+'.com',
      industry: industries[i % industries.length],
      size:     [10,50,200,500,1000,5000,10000][i%7],
      revenue:  Math.floor(Math.random()*50000000 + 100000),
      employees:Math.floor(Math.random()*10000 + 10),
      stage:    ['customer','prospect','lead'][i%3],
      score:    Math.floor(Math.random()*100),
      owner:    'Demo User',
      created:  new Date(Date.now() - Math.random()*365*86400000).toISOString(),
    }));
  }

  _genDeals(n) {
    const stages = ['lead','qualified','proposal','negotiation','closed-won','closed-lost'];
    const products = ['Enterprise Suite','Pro Plan','Starter Pack','API Access','Support Contract','Training Package','Custom Integration','Analytics Add-on'];
    const out = [];
    for (let i = 0; i < n; i++) {
      const stage = stages[Math.floor(Math.random() * stages.length)];
      out.push({
        id:      'd' + (i+1).toString().padStart(4,'0'),
        title:   products[i % products.length] + ' — ' + this._genCompanies(40)[i%40].name,
        company: this._genCompanies(40)[i%40].name,
        contact: this._genContacts(n)[i%n]?.name || 'Unknown',
        value:   Math.floor(Math.random() * 500000 + 5000),
        stage,
        probability: stage === 'closed-won' ? 100 : stage === 'closed-lost' ? 0 : Math.floor(Math.random()*80+10),
        closeDate:   new Date(Date.now() + Math.random()*120*86400000).toISOString(),
        owner:   'Demo User',
        score:   Math.floor(Math.random()*100),
        created: new Date(Date.now() - Math.random()*60*86400000).toISOString(),
      });
    }
    return out;
  }

  _genTickets(n) {
    const subjects = ['Login issue','Billing question','Feature request','Performance problem','API error','Mobile bug','Data export','Integration help','Account upgrade','Password reset','Missing data','UI glitch','Slow loading','Sync issue','Export failed'];
    const statuses = ['open','in-progress','pending','resolved','closed'];
    const priorities = ['low','medium','high','critical'];
    return Array.from({length: n}, (_, i) => ({
      id:       't' + (i+1).toString().padStart(4,'0'),
      subject:  subjects[i % subjects.length],
      customer: this._genContacts(n)[i%n]?.name || 'Customer',
      email:    'customer' + i + '@example.com',
      status:   statuses[i % statuses.length],
      priority: priorities[i % priorities.length],
      channel:  ['email','chat','phone','portal'][i%4],
      assigned: 'Support Agent',
      created:  new Date(Date.now() - Math.random()*30*86400000).toISOString(),
      updated:  new Date(Date.now() - Math.random()*5*86400000).toISOString(),
      slaHours: [4,8,24,48][i%4],
      tags:     [['billing','technical','general'][i%3]],
    }));
  }

  _genTasks(n) {
    const titles = ['Follow up call','Send proposal','Schedule demo','Review contract','Update contact','Send invoice','Prepare presentation','Research competitor','Write case study','Update pipeline'];
    const statuses = ['todo','in-progress','completed','overdue'];
    return Array.from({length: n}, (_, i) => ({
      id:      'task' + (i+1),
      title:   titles[i % titles.length] + ' ' + (i+1),
      assignee:'Demo User',
      due:     new Date(Date.now() + (Math.random()*14-3)*86400000).toISOString(),
      status:  statuses[i%statuses.length],
      priority:['low','medium','high'][i%3],
      related: 'Deal #D' + (i+1).toString().padStart(4,'0'),
    }));
  }

  _genCampaigns(n) {
    const names = ['Q4 Enterprise Push','Holiday Email Blast','Product Launch','Churn Prevention','Upsell Sequence','Welcome Series','Win-Back Campaign','Feature Announcement','Partner Program','Webinar Invitation','Trial Activation','Customer Success','Referral Drive','Brand Awareness'];
    const statuses = ['draft','scheduled','active','paused','completed'];
    return Array.from({length: n}, (_, i) => ({
      id:       'camp' + (i+1),
      name:     names[i] || 'Campaign ' + (i+1),
      type:     ['email','sms','social','multi-channel'][i%4],
      status:   statuses[i%statuses.length],
      audience: Math.floor(Math.random()*5000+100),
      sent:     Math.floor(Math.random()*4500),
      opens:    Math.floor(Math.random()*2000),
      clicks:   Math.floor(Math.random()*800),
      revenue:  Math.floor(Math.random()*250000),
      startDate:new Date(Date.now() - Math.random()*30*86400000).toISOString(),
      endDate:  new Date(Date.now() + Math.random()*30*86400000).toISOString(),
    }));
  }

  _genActivities(n) {
    const types = ['email','call','meeting','note','deal-update','contact-created','ticket-opened','campaign-sent'];
    const descriptions = [
      'Sent follow-up email','Completed discovery call','Demo scheduled','Left voicemail',
      'Updated deal stage','Created new contact','Opened support ticket','Campaign launched',
      'Contract reviewed','Proposal sent','Meeting completed','Note added',
    ];
    return Array.from({length: n}, (_, i) => ({
      id:    'act' + i,
      type:  types[i%types.length],
      desc:  descriptions[i%descriptions.length],
      user:  'Demo User',
      time:  new Date(Date.now() - i * 15 * 60000).toISOString(),
      entity: ['Contact','Deal','Ticket'][i%3],
    }));
  }

  _genInvoices(n) {
    const statuses = ['draft','sent','paid','overdue','cancelled'];
    return Array.from({length: n}, (_, i) => ({
      id:      'inv' + (i+1).toString().padStart(4,'0'),
      client:  this._genCompanies(40)[i%40].name,
      amount:  Math.floor(Math.random()*50000+500),
      status:  statuses[i%statuses.length],
      due:     new Date(Date.now() + (Math.random()*60-10)*86400000).toISOString(),
      issued:  new Date(Date.now() - Math.random()*30*86400000).toISOString(),
      items:   Math.floor(Math.random()*5+1),
    }));
  }

  _genWorkflows(n) {
    const names = ['Lead Nurture Sequence','Deal Stage Automation','Churn Alert','Ticket Escalation','Welcome Onboarding','Win/Loss Analysis','SLA Monitor','AI Follow-up'];
    const statuses = ['active','paused','draft'];
    return Array.from({length: n}, (_, i) => ({
      id:      'wf' + (i+1),
      name:    names[i],
      trigger: ['Contact created','Deal updated','Ticket opened','Time-based'][i%4],
      actions: Math.floor(Math.random()*8+2),
      runs:    Math.floor(Math.random()*5000),
      status:  statuses[i%statuses.length],
      lastRun: new Date(Date.now() - Math.random()*24*60*60000).toISOString(),
    }));
  }

  _genUsers(n) {
    const names = ['Alex Chen','Jordan Kim','Sam Rivera','Taylor Morgan','Casey Williams','Riley Johnson','Parker Davis','Quinn Martinez'];
    const roles = ['Admin','Sales Rep','Marketing','Support','Finance','Manager','Analyst','Developer'];
    return Array.from({length: n}, (_, i) => ({
      id:    'u' + i,
      name:  names[i%names.length] + (i >= names.length ? ' ' + Math.ceil(i/names.length) : ''),
      role:  roles[i%roles.length],
      email: 'user' + i + '@xpnforce.com',
      active:Math.random() > 0.2,
      lastLogin: new Date(Date.now() - Math.random()*7*86400000).toISOString(),
      avatar: names[i%names.length].split(' ').map(w=>w[0]).join(''),
      color: ['#4F46E5','#06B6D4','#10B981','#F59E0B','#EF4444','#8B5CF6'][i%6],
    }));
  }

  // ── CRUD helpers ──────────────────────────────────────────────
  addContact(c)    { c.id = 'c' + Date.now(); this.contacts.unshift(c); return c; }
  updateContact(id, data) {
    const i = this.contacts.findIndex(c => c.id === id);
    if (i !== -1) this.contacts[i] = { ...this.contacts[i], ...data };
  }
  deleteContact(id){ this.contacts = this.contacts.filter(c => c.id !== id); }

  addDeal(d)    { d.id = 'd' + Date.now(); this.deals.unshift(d); return d; }
  updateDeal(id, data) {
    const i = this.deals.findIndex(d => d.id === id);
    if (i !== -1) this.deals[i] = { ...this.deals[i], ...data };
  }

  addTicket(t)  { t.id = 't' + Date.now(); this.tickets.unshift(t); return t; }
  updateTicket(id, data) {
    const i = this.tickets.findIndex(t => t.id === id);
    if (i !== -1) this.tickets[i] = { ...this.tickets[i], ...data };
  }

  // ── Analytics helpers ──────────────────────────────────────────
  get revenue() {
    return this.deals
      .filter(d => d.stage === 'closed-won')
      .reduce((s, d) => s + d.value, 0);
  }
  get pipeline() {
    return this.deals
      .filter(d => !['closed-won','closed-lost'].includes(d.stage))
      .reduce((s, d) => s + d.value * d.probability / 100, 0);
  }
  get openTickets() { return this.tickets.filter(t => t.status === 'open').length; }
  get conversionRate() {
    const total = this.deals.filter(d => ['closed-won','closed-lost'].includes(d.stage)).length;
    const won   = this.deals.filter(d => d.stage === 'closed-won').length;
    return total ? Math.round(won/total*100) : 0;
  }
}
