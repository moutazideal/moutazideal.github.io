/* ERP-FIC demo service worker — replays a recorded session with zero backend.
   v3: POST bodies are part of the lookup key, and the fallback for un-recorded
   endpoints returns the SHAPE each Frappe caller destructures, so the desk takes
   its normal path instead of throwing on `undefined.x`.
   (Original bug: a bare {"message":null} made pageview.js crash at
    `r2.docs._dynamic_page`.) */
const CACHE = 'erpfic-demo-mu5p3h7r-gtvy7';
const SHELL = '/index.html';
const PRECACHE = ["/404.html","/__api/all.json","/__assets.json","/_redirects","/apple-touch-icon.png","/assets/erpnext/dist/css/erpnext-web.bundle.6OGR6NMT.css","/assets/erpnext/dist/css-rtl/erpnext.bundle.RHDDTUCK.css","/assets/erpnext/dist/js/erpnext-web.bundle.253I7LT4.js","/assets/erpnext/dist/js/erpnext.bundle.ZO25VGKE.js","/assets/erpnext/images/erpnext-logo.svg","/assets/erpnext/sounds/call-disconnect.mp3","/assets/erpnext/sounds/incoming-call.mp3","/assets/fic_app/css/mobile.css","/assets/fic_app/css/quick_switch.css","/assets/fic_app/images/erp-fic-favicon.svg","/assets/fic_app/images/erp-fic-logo.svg","/assets/fic_app/js/branding.js","/assets/fic_app/js/mobile.js","/assets/fic_app/js/quick_switch.js","/assets/frappe/css/fonts/inter/Inter-Bold.woff2","/assets/frappe/css/fonts/inter/Inter-Medium.woff2","/assets/frappe/css/fonts/inter/Inter-Regular.woff2","/assets/frappe/css/fonts/inter/Inter-SemiBold.woff2","/assets/frappe/css/fonts/inter/InterVariable.woff2","/assets/frappe/dist/css/login.bundle.XEZMKKC5.css","/assets/frappe/dist/css/website.bundle.5DQWEBGP.css","/assets/frappe/dist/css-rtl/desk.bundle.ZHZMOSWP.css","/assets/frappe/dist/css-rtl/report.bundle.H2VGWSNC.css","/assets/frappe/dist/js/billing.bundle.CPRCUCBA.js","/assets/frappe/dist/js/build_events.bundle.3YBJL2VK.js","/assets/frappe/dist/js/controls.bundle.MYWCUMRO.js","/assets/frappe/dist/js/desk.bundle.UBO6BGDN.js","/assets/frappe/dist/js/file_uploader.bundle.PEG3E3ZQ.js","/assets/frappe/dist/js/form.bundle.I73ZTL6H.js","/assets/frappe/dist/js/frappe-web.bundle.VNOKELX3.js","/assets/frappe/dist/js/libs.bundle.LLRFRX7M.js","/assets/frappe/dist/js/list.bundle.2LY27CFR.js","/assets/frappe/dist/js/report.bundle.6TTJHZGN.js","/assets/frappe/dist/js/telemetry.bundle.DQEBDMFO.js","/assets/frappe/dist/js/video_player.bundle.IOEIXC2G.js","/assets/frappe/icons/espresso/icons.svg","/assets/frappe/icons/timeless/icons.svg","/assets/frappe/images/ui-states/event-empty-state.svg","/assets/frappe/images/ui-states/grid-empty-state.svg","/assets/frappe/images/ui-states/list-empty-state.svg","/assets/frappe/images/ui-states/notification-empty-state.svg","/assets/frappe/sounds/alert.mp3","/assets/frappe/sounds/cancel.mp3","/assets/frappe/sounds/click.mp3","/assets/frappe/sounds/delete.mp3","/assets/frappe/sounds/email.mp3","/assets/frappe/sounds/error.mp3","/assets/frappe/sounds/submit.mp3","/icon-192.png","/icon-400.png","/icon-512.png","/icon-maskable-512.png","/index.html","/install.html","/login","/manifest.json","/website_script.js"];

/* Precache with a bounded worker pool.
 *
 * Firing all ~463 c.add() calls at once (Promise.all over the whole list) made
 * the install take 65s on GitHub Pages, while curl fetched 50 of the same files
 * in 1.1s. The browser throttles that many simultaneous requests from a service
 * worker, so the queue just piles up. A fixed pool keeps the request pipeline
 * full without thrashing it.
 *
 * Failures are counted rather than swallowed: a missing file would still leave
 * the app looking fine online but broken offline, so the count is reported to
 * the page. */
const PRECACHE_CONCURRENCY = 24;

async function precache(c) {
  const queue = PRECACHE.slice();
  const failed = [];
  async function worker() {
    for (;;) {
      const url = queue.shift();
      if (url === undefined) return;
      try {
        await c.add(url);
      } catch (e) {
        failed.push(url);
      }
    }
  }
  const n = Math.min(PRECACHE_CONCURRENCY, queue.length);
  await Promise.all(Array.from({ length: n }, worker));
  return { total: PRECACHE.length, failed };
}

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    const res = await precache(c);
    self.__precacheResult = res;
    if (res.failed.length) console.warn('precache: ' + res.failed.length + ' of ' + res.total + ' failed');
    self.skipWaiting();
  })());
});

self.addEventListener('message', (e) => {
  if (e.data === 'precache-status' && e.source) {
    e.source.postMessage({ type: 'precache-status', result: self.__precacheResult || null });
  }
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

/* ---------- key normalisation (must match recorder.js) ---------- */

function normBody(s) {
  try {
    const clean = (v) => {
      if (Array.isArray(v)) return v.map(clean);
      if (v && typeof v === 'object') {
        const o = {};
        for (const k of Object.keys(v).sort()) { if (k === '_' || k === 'cmd') continue; o[k] = clean(v[k]); }
        return o;
      }
      return v;
    };
    return JSON.stringify(clean(JSON.parse(s)));
  } catch (e) { return String(s).slice(0, 400); }
}
function bh(s) { let x = 5381; for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) >>> 0; return x.toString(36); }

function strip(urlStr) {
  const i = urlStr.indexOf('?');
  if (i === -1) return '';
  const sp = new URLSearchParams(urlStr.slice(i + 1));
  sp.delete('_'); sp.delete('cached_timestamp');
  return [...sp.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([k, v]) => `${k}=${v}`).join('&');
}
function pathOf(s) { const i = s.indexOf('?'); return i === -1 ? s : s.slice(0, i); }
function keyOf(method, pathAndQuery, bodySig) {
  const q = strip(pathAndQuery);
  return method + ' ' + pathOf(pathAndQuery) + (q ? '?' + q : '') + (bodySig ? ' #' + bodySig : '');
}

/* ---------- table ---------- */

let TABLE = null;

async function table() {
  if (TABLE) return TABLE;
  const c = await caches.open(CACHE);
  const r = await c.match('/__api/all.json');
  const all = r ? await r.json() : {};
  const exact = {}, noBody = {}, byPath = {}, anyPath = {};
  for (const [k, v] of Object.entries(all)) {
    const sp = k.indexOf(' ');
    const method = k.slice(0, sp);
    let rest = k.slice(sp + 1);
    let bodySig = '';
    const hi = rest.lastIndexOf(' #');
    if (hi !== -1) { bodySig = rest.slice(hi + 2); rest = rest.slice(0, hi); }

    const ek = keyOf(method, rest, bodySig);
    if (!exact[ek]) exact[ek] = v;
    const nk = keyOf(method, rest, '');
    if (!noBody[nk]) noBody[nk] = v;
    const pk = method + ' ' + pathOf(rest);
    if (!byPath[pk]) byPath[pk] = v;
    const ap = pathOf(rest);
    if (!anyPath[ap]) anyPath[ap] = v;
  }
  TABLE = { exact, noBody, byPath, anyPath };
  return TABLE;
}

/* The fallback must satisfy the specific destructuring of each Frappe caller.
 * Notably `frappe.views.pageview.with_page` does `r.docs._dynamic_page`, so any
 * endpoint whose caller expects `docs` as an OBJECT must not receive null/[].
 * An empty object is the safe reply: the desk proceeds and silently shows the
 * page as empty instead of throwing. */
function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Demo-Fallback': '1',   // lets the audit script list un-recorded endpoints
    },
  });
}

function fallbackFor(pathname) {
  const p = pathname.toLowerCase();
  if (/desk_page\.getpage|desk_page\.get|\.getpage/.test(p)) return json({ docs: {} });
  if (/getdoc\b|\/api\/resource\//.test(p)) return json({ docs: [] });
  if (/get_count/.test(p)) return json({ message: 0 });
  if (/get_list|get_all|get_script|reportview\.get\b|query_report|search_link|search\.link/.test(p))
    return json({ message: [] });
  if (/get_value|get_single_value/.test(p)) return json({ message: null });
  // Generic: keep every commonly-destructured key present (object-shaped) so no
  // caller can hit `Cannot read properties of undefined`.
  return json({ message: {}, docs: {}, _link_titles: {}, exc: null });
}

async function replay(req) {
  const u = new URL(req.url);
  try {
    let bodySig = '';
    if (req.method === 'POST') {
      try { bodySig = bh(normBody(await req.clone().text())); } catch (e) {}
    }
    const pq = u.pathname + u.search;
    const t = await table();
    const entry =
      t.exact[keyOf(req.method, pq, bodySig)] ||
      t.noBody[keyOf(req.method, pq, '')] ||
      t.byPath[req.method + ' ' + u.pathname] ||
      t.anyPath[u.pathname];
    if (!entry) return fallbackFor(u.pathname);
    return new Response(entry.body, {
      status: entry.status || 200,
      headers: {
        'Content-Type': entry.ct || 'application/json; charset=utf-8',
        'X-Demo-Source': 'recording',
      },
    });
  } catch (e) {
    return fallbackFor(u.pathname);
  }
}

/* ---------- routing ---------- */

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const u = new URL(req.url);
  if (u.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(caches.open(CACHE).then((c) => c.match(SHELL)).then((r) => r || fetch(req)));
    return;
  }

  const p = u.pathname;
  if (p.startsWith('/api/') || p.startsWith('/desk/')) { e.respondWith(replay(req)); return; }

  // Realtime is impossible offline. Answer socket.io cleanly instead of letting
  // the generic branch below hand it the HTML shell.
  if (p.startsWith('/socket.io')) {
    e.respondWith(new Response('', { status: 404, statusText: 'demo: realtime disabled' }));
    return;
  }

  // Everything else: cache first, then network. NEVER answer a non-navigation
  // request with the HTML shell — that fed socket.io a 3.5 MB HTML document and
  // produced `Cannot read properties of undefined (reading 'responseText')`.
  e.respondWith(
    caches.open(CACHE)
      .then((c) => c.match(p).then((hit) => hit || c.match(req)))
      .then((hit) => hit || fetch(req))
      .catch(() => new Response('', { status: 504, statusText: 'demo: offline' }))
  );
});
