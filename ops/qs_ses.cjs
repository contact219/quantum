// qs_ses.cjs: the one way Quantum Surety marketing and customer mail leaves the CRM VPS.
// Drop-in for @aws-sdk/client-ses { SESClient, SendEmailCommand } (same v1 input shape), sent as
// SendRawEmail so every message carries RFC 8058 one-click unsubscribe headers:
//   List-Unsubscribe: <https://quantumsurety.bond/api/unsubscribe?e=<email>&t=<hmac>>
//   List-Unsubscribe-Post: List-Unsubscribe=One-Click
// Gmail and Yahoo require these for bulk senders. The link is signed (first 16 hex of
// HMAC-SHA256(QS_UNSUB_SECRET, lower(email))) so a GET never unsubscribes anyone and nobody can
// forge one; the main-site handler writes BOTH suppression lists on the POST.
// Secret: env QS_UNSUB_SECRET, else /root/.qs_unsub_secret (same value as the main site's .env).
// Refuses to send without it, and refuses multi-recipient/CC/BCC sends (the link is per person).
// Added 2026-09-26 (outreach gauntlet, deliverability piece).
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const { SESClient: V1Client, SendRawEmailCommand } = require('@aws-sdk/client-ses');

function secret() {
  let s = process.env.QS_UNSUB_SECRET;
  if (!s) { try { s = fs.readFileSync('/root/.qs_unsub_secret', 'utf8').trim(); } catch (_) {} }
  if (!s) throw new Error('qs_ses: QS_UNSUB_SECRET missing; refusing to send mail without a working unsubscribe');
  return s;
}
function unsubUrl(email) {
  const e = String(email).trim().toLowerCase();
  const t = crypto.createHmac('sha256', secret()).update(e).digest('hex').slice(0, 16);
  return 'https://quantumsurety.bond/api/unsubscribe?e=' + encodeURIComponent(e) + '&t=' + t;
}

const hdr = s => /^[\x20-\x7e]*$/.test(s) ? s : '=?UTF-8?B?' + Buffer.from(s, 'utf8').toString('base64') + '?=';
// "Name <addr>" with a non-ASCII display name must be encoded; the address part stays as is.
const addrHdr = s => { const m = String(s).match(/^\s*(.*?)\s*<([^>]+)>\s*$/); return m && m[1] ? hdr(m[1].replace(/^"|"$/g, '')) + ' <' + m[2] + '>' : String(s); };
const b64body = s => Buffer.from(s, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n');

class SendEmailCommand { constructor(input) { this.input = input; this.__qs = true; } }

class SESClient {
  constructor(cfg = {}) { this.v1 = new V1Client(cfg); }   // same { region, credentials }
  async send(cmd) {
    if (!cmd || !cmd.__qs) throw new Error('qs_ses: use SendEmailCommand from qs_ses.cjs');
    const i = cmd.input, d = i.Destination || {};
    const to = d.ToAddresses || [];
    if (to.length !== 1 || (d.CcAddresses || []).length || (d.BccAddresses || []).length)
      throw new Error('qs_ses: exactly one To recipient per message');
    const m = i.Message, b = m.Body || {};
    const bound = 'qs_' + crypto.randomBytes(8).toString('hex');
    const lines = [
      'From: ' + addrHdr(i.Source), 'To: ' + to[0],
      ...((i.ReplyToAddresses || []).length ? ['Reply-To: ' + i.ReplyToAddresses.join(', ')] : []),
      'Subject: ' + hdr(m.Subject.Data),
      'MIME-Version: 1.0',
      'List-Unsubscribe: <' + unsubUrl(to[0]) + '>',
      'List-Unsubscribe-Post: List-Unsubscribe=One-Click',
      ...((i.Tags || []).length ? ['X-SES-MESSAGE-TAGS: ' + i.Tags.map(t => t.Name + '=' + t.Value).join(', ')] : []),
      ...(i.ConfigurationSetName ? ['X-SES-CONFIGURATION-SET: ' + i.ConfigurationSetName] : []),
      'Content-Type: multipart/alternative; boundary="' + bound + '"', '',
    ];
    if (b.Text) lines.push('--' + bound, 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', b64body(b.Text.Data));
    if (b.Html) lines.push('--' + bound, 'Content-Type: text/html; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', b64body(b.Html.Data));
    lines.push('--' + bound + '--', '');
    return this.v1.send(new SendRawEmailCommand({ RawMessage: { Data: Buffer.from(lines.join('\r\n')) } }));
  }
}

module.exports = { SESClient, SendEmailCommand, unsubUrl };
