(function() {
  'use strict';
  var API = 'https://verify.quantumsurety.bond/api';
  var HOST = 'https://quantumsurety.bond';

  var CSS = `
    .qs-widget-wrap { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .qs-widget-head { background: #0a0f1e; color: #f59e0b; padding: 12px 16px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    .qs-widget-head svg { flex-shrink: 0; }
    .qs-widget-body { padding: 14px 16px; }
    .qs-widget-row { display: flex; gap: 8px; }
    .qs-widget-input { flex: 1; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; outline: none; color: #1e293b; }
    .qs-widget-input:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.1); }
    .qs-widget-btn { padding: 9px 16px; background: #f59e0b; color: #0a0f1e; border: none; border-radius: 6px; font-weight: 700; font-size: 13px; cursor: pointer; white-space: nowrap; }
    .qs-widget-btn:hover { background: #d97706; }
    .qs-widget-btn:disabled { opacity: 0.6; cursor: default; }
    .qs-widget-tabs { display: flex; gap: 4px; margin-bottom: 12px; }
    .qs-widget-tab { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; }
    .qs-widget-tab.active { background: #0a0f1e; color: #f59e0b; border-color: #0a0f1e; }
    .qs-widget-result { margin-top: 12px; }
    .qs-badge-active { display: inline-block; background: #dcfce7; color: #166534; border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 700; }
    .qs-badge-expiring { display: inline-block; background: #fef9c3; color: #854d0e; border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 700; }
    .qs-badge-expired { display: inline-block; background: #fee2e2; color: #991b1b; border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 700; }
    .qs-result-name { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .qs-result-row { font-size: 12px; color: #475569; margin-top: 3px; }
    .qs-result-link { display: inline-block; margin-top: 8px; font-size: 12px; color: #2563eb; text-decoration: none; }
    .qs-result-link:hover { text-decoration: underline; }
    .qs-error { color: #dc2626; font-size: 13px; margin-top: 8px; }
    .qs-footer { text-align: right; padding: 6px 16px 8px; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    .qs-footer a { color: #94a3b8; text-decoration: none; }
    .qs-footer a:hover { color: #2563eb; }
  `;

  function injectStyles(doc) {
    if (doc.getElementById('qs-widget-styles')) return;
    var s = doc.createElement('style');
    s.id = 'qs-widget-styles';
    s.textContent = CSS;
    doc.head.appendChild(s);
  }

  function statusBadge(status) {
    if (status === 'active') return '<span class="qs-badge-active">Active</span>';
    if (status === 'expiring') return '<span class="qs-badge-expiring">Expiring Soon</span>';
    return '<span class="qs-badge-expired">Expired</span>';
  }

  function renderResult(data, type, wrap) {
    var resultEl = wrap.querySelector('.qs-widget-result');
    if (!data) { resultEl.innerHTML = '<div class="qs-error">Not found. Check the license/ID and try again.</div>'; return; }

    if (type === 'notary') {
      var name = (data.first_name || '') + ' ' + (data.last_name || '');
      var expiry = data.expire_date ? data.expire_date.substring(0, 10) : '';
      resultEl.innerHTML = `
        <div class="qs-result-name">${name.trim()} ${statusBadge(data.status)}</div>
        <div class="qs-result-row">Commission expires: ${expiry || 'N/A'}</div>
        ${data.surety_company ? '<div class="qs-result-row">Surety: ' + data.surety_company + '</div>' : ''}
        <a class="qs-result-link" href="${HOST}/notary/${data.notary_id}" target="_blank">View full commission page &rarr;</a>
      `;
    } else {
      var cname = data.name || data.business_name || (data.first_name + ' ' + data.last_name) || '';
      var cexpiry = data.expire_date || data.expiry_date || '';
      if (cexpiry.length > 10) cexpiry = cexpiry.substring(0, 10);
      resultEl.innerHTML = `
        <div class="qs-result-name">${cname.trim()} ${statusBadge(data.status)}</div>
        ${data.license_type ? '<div class="qs-result-row">License type: ' + data.license_type + '</div>' : ''}
        <div class="qs-result-row">Bond expires: ${cexpiry || 'N/A'}</div>
        <a class="qs-result-link" href="${HOST}/contractor/${data.license_number || data.tdlr_number}" target="_blank">View full license page &rarr;</a>
      `;
    }
  }

  function buildWidget(container, opts) {
    injectStyles(document);
    var defaultType = opts.type || 'contractor';

    container.innerHTML = `
      <div class="qs-widget-wrap">
        <div class="qs-widget-head">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Verify Texas License / Bond
        </div>
        <div class="qs-widget-body">
          <div class="qs-widget-tabs">
            <div class="qs-widget-tab ${defaultType === 'contractor' ? 'active' : ''}" data-t="contractor">Contractor</div>
            <div class="qs-widget-tab ${defaultType === 'notary' ? 'active' : ''}" data-t="notary">Notary</div>
          </div>
          <div class="qs-widget-row">
            <input class="qs-widget-input" type="text" placeholder="License or ID number..." autocomplete="off" />
            <button class="qs-widget-btn">Check</button>
          </div>
          <div class="qs-widget-result"></div>
        </div>
        <div class="qs-footer">Powered by <a href="${HOST}" target="_blank">Quantum Surety</a></div>
      </div>
    `;

    var activeType = defaultType;
    var input = container.querySelector('.qs-widget-input');
    var btn = container.querySelector('.qs-widget-btn');
    var resultEl = container.querySelector('.qs-widget-result');

    container.querySelectorAll('.qs-widget-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        container.querySelectorAll('.qs-widget-tab').forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        activeType = tab.dataset.t;
        input.placeholder = activeType === 'notary' ? 'Notary ID (e.g. 10000125)...' : 'TDLR license number...';
        resultEl.innerHTML = '';
        input.value = '';
        input.focus();
      });
    });

    async function lookup() {
      var val = input.value.trim();
      if (!val) { input.focus(); return; }
      btn.disabled = true;
      btn.textContent = '...';
      resultEl.innerHTML = '';
      try {
        var url = activeType === 'notary'
          ? API + '/notary/lookup/' + encodeURIComponent(val)
          : API + '/contractor/lookup/' + encodeURIComponent(val);
        var resp = await fetch(url);
        var data = resp.ok ? await resp.json() : null;
        renderResult(data && !data.error ? data : null, activeType, container);
      } catch(e) {
        resultEl.innerHTML = '<div class="qs-error">Lookup failed. Please try again.</div>';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Check';
      }
    }

    btn.addEventListener('click', lookup);
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') lookup(); });
  }

  // Track external embed loads (fires once per page load, only on non-quantumsurety.bond domains)
  function trackEmbed() {
    try {
      var h = window.location.hostname;
      if (h && h !== 'quantumsurety.bond' && h !== 'verify.quantumsurety.bond' && h !== 'localhost') {
        var img = new Image();
        img.src = API + '/widget/embed-ping?host=' + encodeURIComponent(h) + '&t=' + Date.now();
      }
    } catch(e) {}
  }

  // Auto-init: <div data-qs-widget></div>
  function init() {
    var found = document.querySelectorAll('[data-qs-widget]');
    if (found.length > 0) trackEmbed();
    found.forEach(function(el) {
      if (el.dataset.qsInit) return;
      el.dataset.qsInit = '1';
      buildWidget(el, { type: el.dataset.qsType || 'contractor' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();