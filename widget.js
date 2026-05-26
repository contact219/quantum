/* Quantum Surety Bond Verification Widget — embed with:
   <script src="https://verify.quantumsurety.bond/widget.js"></script>
   Optional attributes on the script tag:
     data-type="notary|contractor|both"  (default: both)
     data-theme="dark|light"             (default: dark)
*/
(function () {
  'use strict';
  const API = 'https://verify.quantumsurety.bond';

  const scripts = document.getElementsByTagName('script');
  const thisScript = scripts[scripts.length - 1];
  const typeAttr = thisScript.getAttribute('data-type') || 'both';
  const theme = thisScript.getAttribute('data-theme') || 'dark';
  const isDark = theme !== 'light';

  const host = document.createElement('div');
  host.setAttribute('id', 'qs-bond-widget-host');
  thisScript.parentNode.insertBefore(host, thisScript.nextSibling);

  const shadow = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

  const bg      = isDark ? '#0d1117' : '#ffffff';
  const surface = isDark ? '#161b22' : '#f8fafc';
  const border  = isDark ? '#30363d' : '#e2e8f0';
  const text     = isDark ? '#e6edf3' : '#0f172a';
  const textDim  = isDark ? '#8b949e' : '#64748b';
  const gold     = '#f59e0b';
  const green    = isDark ? '#4ade80' : '#16a34a';
  const yellow   = '#fbbf24';
  const red      = isDark ? '#f87171' : '#dc2626';
  const inputBg  = isDark ? '#21262d' : '#ffffff';

  shadow.innerHTML = `
<style>
  *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  .w{background:${bg};border:1px solid ${border};border-radius:12px;padding:20px;max-width:520px;width:100%}
  .hdr{display:flex;align-items:center;gap:10px;margin-bottom:16px}
  .hdr-badge{font-size:9px;font-family:monospace;letter-spacing:3px;color:${gold};background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:4px;padding:3px 7px}
  .hdr-title{font-size:14px;font-weight:700;color:${text}}
  .tabs{display:flex;gap:4px;margin-bottom:14px}
  .tab{flex:1;padding:7px;border-radius:6px;border:1px solid ${border};background:${surface};color:${textDim};font-size:11px;font-family:monospace;cursor:pointer;text-align:center;transition:all 0.15s}
  .tab.active{background:${gold};color:#000;border-color:${gold};font-weight:700}
  .row{display:flex;gap:8px;margin-bottom:10px}
  .inp{flex:1;padding:9px 12px;background:${inputBg};border:1px solid ${border};border-radius:7px;color:${text};font-size:13px;outline:none;transition:border-color 0.15s}
  .inp:focus{border-color:${gold}}
  .inp::placeholder{color:${textDim}}
  .btn{padding:9px 18px;background:${gold};color:#000;border:none;border-radius:7px;font-weight:700;font-size:12px;cursor:pointer;white-space:nowrap;font-family:monospace;letter-spacing:1px}
  .btn:hover{opacity:0.9}
  .results{margin-top:12px;display:flex;flex-direction:column;gap:8px}
  .card{background:${surface};border:1px solid ${border};border-radius:8px;padding:12px 14px}
  .card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
  .card-name{font-size:13px;font-weight:600;color:${text}}
  .card-sub{font-size:11px;color:${textDim};margin-top:2px}
  .badge{font-size:10px;font-family:monospace;padding:3px 9px;border-radius:10px;font-weight:700;white-space:nowrap}
  .badge.active{background:rgba(74,222,128,0.12);color:${green};border:1px solid rgba(74,222,128,0.3)}
  .badge.expiring{background:rgba(251,191,36,0.12);color:${yellow};border:1px solid rgba(251,191,36,0.3)}
  .badge.expired{background:rgba(248,113,113,0.12);color:${red};border:1px solid rgba(248,113,113,0.3)}
  .card-meta{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;font-size:11px;color:${textDim}}
  .card-meta span{display:flex;align-items:center;gap:4px}
  .cta{display:inline-block;margin-top:8px;background:${gold};color:#000;font-size:11px;font-weight:700;padding:5px 12px;border-radius:5px;text-decoration:none;font-family:monospace;letter-spacing:1px}
  .msg{text-align:center;padding:20px;color:${textDim};font-size:12px}
  .spin{display:inline-block;width:14px;height:14px;border:2px solid ${border};border-top-color:${gold};border-radius:50%;animation:spin 0.7s linear infinite;margin-right:6px;vertical-align:middle}
  @keyframes spin{to{transform:rotate(360deg)}}
  .footer{margin-top:14px;padding-top:12px;border-top:1px solid ${border};display:flex;justify-content:space-between;align-items:center}
  .footer a{font-size:10px;color:${textDim};text-decoration:none;font-family:monospace}
  .footer a:hover{color:${gold}}
  .footer-brand{font-size:10px;color:${textDim};font-family:monospace}
  .footer-brand span{color:${gold};font-weight:700}
</style>
<div class="w">
  <div class="hdr">
    <div class="hdr-badge">BOND VERIFY</div>
    <div class="hdr-title">Texas Bond Status Check</div>
  </div>
  <div class="tabs" id="tabs" style="${typeAttr === 'notary' || typeAttr === 'contractor' ? 'display:none' : ''}">
    <button class="tab active" data-t="notary">Notary</button>
    <button class="tab" data-t="contractor">Contractor</button>
  </div>
  <div class="row">
    <input class="inp" id="q" placeholder="Search by name or license number…" autocomplete="off"/>
    <button class="btn" id="go">VERIFY</button>
  </div>
  <div id="results"></div>
  <div class="footer">
    <a href="https://verify.quantumsurety.bond" target="_blank">Full search →</a>
    <div class="footer-brand">Powered by <span>Quantum Surety</span></div>
  </div>
</div>`;

  let activeType = typeAttr === 'contractor' ? 'contractor' : 'notary';

  const tabsEl   = shadow.getElementById('tabs');
  const qEl      = shadow.getElementById('q');
  const goEl     = shadow.getElementById('go');
  const results  = shadow.getElementById('results');

  if (tabsEl) {
    tabsEl.addEventListener('click', e => {
      const t = e.target.dataset.t;
      if (!t) return;
      activeType = t;
      tabsEl.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.t === t));
      qEl.placeholder = t === 'notary' ? 'Search notary by name…' : 'Search contractor by name or license…';
      results.innerHTML = '';
    });
  }

  function statusBadge(s) {
    if (s === 'active')   return '<span class="badge active">● BONDED</span>';
    if (s === 'expiring') return '<span class="badge expiring">⚠ EXPIRING</span>';
    return '<span class="badge expired">✕ EXPIRED</span>';
  }

  function fmtDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  async function doSearch() {
    const q = qEl.value.trim();
    if (!q) return;
    results.innerHTML = '<div class="msg"><span class="spin"></span>Checking bond status…</div>';
    try {
      const endpoint = activeType === 'notary'
        ? `${API}/api/search?q=${encodeURIComponent(q)}`
        : `${API}/api/contractor-search?q=${encodeURIComponent(q)}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      const items = data.results || [];
      if (!items.length) {
        results.innerHTML = `<div class="msg">No results found for "<strong>${q}</strong>".<br>
          <a href="https://quantumsurety.bond" target="_blank" style="color:${gold};text-decoration:none;font-weight:700;margin-top:8px;display:inline-block">
            Get Bonded Instantly →
          </a></div>`;
        return;
      }
      results.innerHTML = '<div class="results">' + items.slice(0, 5).map(r => {
        const isNotary = !!r.notary_id;
        const name = isNotary ? `${r.first_name || ''} ${r.last_name || ''}`.trim() : (r.business_name || r.owner_name || '');
        const sub  = isNotary ? (r.city || '') : (r.business_county ? r.business_county + ' County' : '');
        const exp  = r.expire_date ? fmtDate(r.expire_date) : null;
        const s    = r.status || 'unknown';
        const ctaShow = s === 'expired' || s === 'expiring';
        return `<div class="card">
          <div class="card-top">
            <div>
              <div class="card-name">${name}</div>
              ${sub ? `<div class="card-sub">${sub}</div>` : ''}
            </div>
            ${statusBadge(s)}
          </div>
          <div class="card-meta">
            ${exp ? `<span>Bond expires: <strong style="color:${s==='expired'?red:s==='expiring'?yellow:text}">${exp}</strong></span>` : ''}
            ${r.surety_company ? `<span>Carrier: ${r.surety_company}</span>` : ''}
            ${r.license_number ? `<span>License: ${r.license_number}</span>` : ''}
          </div>
          ${ctaShow ? `<a class="cta" href="https://quantumsurety.bond/get-bond" target="_blank">
            ${s==='expired'?'Renew Bond Now →':'Renew Before Expiration →'}
          </a>` : ''}
        </div>`;
      }).join('') + '</div>';
    } catch (e) {
      results.innerHTML = `<div class="msg">Unable to verify — try <a href="https://verify.quantumsurety.bond" target="_blank" style="color:${gold}">verify.quantumsurety.bond</a></div>`;
    }
  }

  goEl.addEventListener('click', doSearch);
  qEl.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
})();
