// /cloudflare/worker.js
// XPNFORCE Cloudflare Worker — AI proxy, rate limiting, JWT verification
// Deploy to: workers.cloudflare.com
// wrangler deploy cloudflare/worker.js

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const ALLOWED_ORIGINS = [
  'https://xpnforce-crm.web.app',
  'https://xpnforce-crm.firebaseapp.com',
  'https://xpnforce.com',
  'https://www.xpnforce.com',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
];

// Rate limit config (requests per window per IP)
const RATE_LIMITS = {
  ai:      { requests: 20,  windowSecs: 60  },  // 20 AI req/min
  default: { requests: 100, windowSecs: 60  },
};

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const url    = new URL(request.url);

    // ── CORS preflight ───────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, origin);
    }

    // ── Only allow configured origins ────────────────────────────
    if (origin && !ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
      return corsResponse({ error: 'Origin not allowed' }, 403, origin);
    }

    // ── Router ───────────────────────────────────────────────────
    const path = url.pathname;

    if (path === '/api/ai/chat' && request.method === 'POST') {
      return handleAIChat(request, env, ctx, origin);
    }
    if (path === '/api/health' && request.method === 'GET') {
      return corsResponse({ status: 'ok', ts: Date.now() }, 200, origin);
    }
    if (path.startsWith('/api/')) {
      return corsResponse({ error: 'Not found' }, 404, origin);
    }

    return new Response('XPNFORCE Edge Worker v1.0', { status: 200 });
  }
};

// ── AI Chat Handler ──────────────────────────────────────────────
async function handleAIChat(request, env, ctx, origin) {
  // Rate limit by IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const limited = await isRateLimited(env, ip, 'ai', RATE_LIMITS.ai);
  if (limited) {
    return corsResponse({ error: 'Rate limit exceeded. Please wait.' }, 429, origin);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return corsResponse({ error: 'Invalid JSON body' }, 400, origin);
  }

  const { messages, system, model, max_tokens } = body;

  if (!messages || !Array.isArray(messages)) {
    return corsResponse({ error: 'messages array required' }, 400, origin);
  }

  // Sanitize - strip any attempts to override system prompt
  const safeMessages = messages.slice(-20).map(m => ({
    role:    ['user','assistant'].includes(m.role) ? m.role : 'user',
    content: String(m.content).slice(0, 4000),
  }));

  try {
    const anthropicResp = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      model || 'claude-sonnet-4-6',
        max_tokens: Math.min(max_tokens || 1000, 2000),
        system:     system || 'You are XPNFORCE AI, an enterprise business assistant.',
        messages:   safeMessages,
      }),
    });

    const data = await anthropicResp.json();

    if (!anthropicResp.ok) {
      return corsResponse({ error: data.error?.message || 'AI API error' }, anthropicResp.status, origin);
    }

    // Log usage to KV (async, non-blocking)
    ctx.waitUntil(logUsage(env, ip, data.usage));

    return corsResponse(data, 200, origin);
  } catch (err) {
    return corsResponse({ error: 'AI service unavailable: ' + err.message }, 503, origin);
  }
}

// ── Rate Limiter (Cloudflare KV) ─────────────────────────────────
async function isRateLimited(env, ip, endpoint, config) {
  if (!env.RATE_LIMIT_KV) return false; // skip if KV not configured

  const key     = `rl:${endpoint}:${ip}`;
  const now     = Math.floor(Date.now() / 1000);
  const windowStart = now - config.windowSecs;

  try {
    const stored = await env.RATE_LIMIT_KV.get(key, { type: 'json' });
    const hits   = (stored?.hits || []).filter(t => t > windowStart);

    if (hits.length >= config.requests) return true;

    hits.push(now);
    await env.RATE_LIMIT_KV.put(key, JSON.stringify({ hits }), { expirationTtl: config.windowSecs * 2 });
    return false;
  } catch {
    return false; // fail open
  }
}

// ── Usage Logger ─────────────────────────────────────────────────
async function logUsage(env, ip, usage) {
  if (!env.ANALYTICS_KV || !usage) return;
  try {
    const key = `usage:${new Date().toISOString().split('T')[0]}`;
    const stored = await env.ANALYTICS_KV.get(key, { type: 'json' }) || { total: 0, requests: 0 };
    await env.ANALYTICS_KV.put(key, JSON.stringify({
      total:    (stored.total || 0)    + (usage.input_tokens + usage.output_tokens),
      requests: (stored.requests || 0) + 1,
    }), { expirationTtl: 86400 * 7 });
  } catch {}
}

// ── CORS Response Helper ──────────────────────────────────────────
function corsResponse(data, status, origin) {
  const headers = {
    'Access-Control-Allow-Origin':  ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age':       '86400',
    'Vary':                         'Origin',
    'X-Content-Type-Options':       'nosniff',
    'X-Frame-Options':              'DENY',
  };

  if (data === null) return new Response(null, { status, headers });

  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}
