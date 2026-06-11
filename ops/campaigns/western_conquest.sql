-- Stage 1 (90d): scale #13 to 150/day and add the renewal-reminder capture CTA
UPDATE drip_schedules SET
  emails_per_day = 150,
  body = $body$<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Hi {{first_name}},</p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Your Texas notary bond through {{surety_company}} expires on <strong>{{expire_date}}</strong>.
    Before you renew, it's worth a 30-second comparison.
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Texas requires the same $10,000 bond no matter who writes it &mdash; coverage is identical and the
    Secretary of State accepts both. Through Quantum Surety it's <strong>$50 flat for the full 4-year term</strong>,
    underwritten by RLI Insurance, with an instant PDF certificate by email. No package, no add-ons, no waiting.
  </p>
  <p style="margin:28px 0;text-align:center;">
    <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&amp;State=TX"
       style="background:#1e40af;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
      Switch in 5 Minutes &rarr;
    </a>
  </p>
  <p style="font-size:15px;line-height:1.6;margin:0 0 18px;color:#374151;">
    Not renewing yet? <a href="{{verify_url}}" style="color:#1e40af;font-weight:bold;">View your commission record
    and set a free renewal reminder</a> &mdash; we'll email you 60 days before your bond lapses, whoever you renew with.
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Questions? Call <a href="tel:+12146668718" style="color:#1e40af;font-weight:bold;text-decoration:none;">(214) 666-8718</a>
    &mdash; answered 24/7. Or just reply to this email.
  </p>
  <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:24px 0 0;">
    Quantum Surety &middot; TDI License #3480229<br/>
    <a href="https://quantumsurety.bond" style="color:#6b7280;">quantumsurety.bond</a>
  </p>
  <p style="font-size:12px;color:#9ca3af;margin:24px 0 0;">
    You're receiving this because you hold an active Texas notary commission (public record).
    Quantum Surety is not affiliated with {{surety_company}}.
    <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
  </p>
</div>
</body>
</html>$body$
WHERE id = 13;

-- Stage 2 (30d): reminder touch
INSERT INTO drip_schedules (name, contact_type, filters, emails_per_day, from_name, from_email, subject, body, status)
VALUES (
  'COMPETE: Western Surety — 30-Day Renewal Window',
  'notary',
  '{"surety": "Western Surety", "expiring": "30"}'::jsonb,
  75,
  'Quantum Surety',
  'info@quantumsurety.bond',
  '{{first_name}}, 30 days left on your notary bond — your renewal options',
  $body$<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Hi {{first_name}},</p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Your Texas notary bond expires on <strong>{{expire_date}}</strong> &mdash; about 30 days from now.
    This is the week most notaries get a renewal notice from their old vendor.
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Before you pay it, know your options: the state-required $10,000 bond is identical from every surety.
    Through Quantum Surety it's <strong>$50 flat for the full 4-year term</strong> &mdash; renew online in
    about 5 minutes and your new certificate arrives by email, usually the same day.
  </p>
  <p style="margin:28px 0;text-align:center;">
    <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&amp;State=TX"
       style="background:#1e40af;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
      Renew for $50 &rarr;
    </a>
  </p>
  <p style="font-size:15px;line-height:1.6;margin:0 0 18px;color:#374151;">
    Want to double-check your dates first? <a href="{{verify_url}}" style="color:#1e40af;font-weight:bold;">Your
    commission record is here</a> &mdash; free, no login.
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Questions? Call <a href="tel:+12146668718" style="color:#1e40af;font-weight:bold;text-decoration:none;">(214) 666-8718</a>
    &mdash; answered 24/7. Or just reply to this email.
  </p>
  <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:24px 0 0;">
    Quantum Surety &middot; TDI License #3480229<br/>
    <a href="https://quantumsurety.bond" style="color:#6b7280;">quantumsurety.bond</a>
  </p>
  <p style="font-size:12px;color:#9ca3af;margin:24px 0 0;">
    You're receiving this because you hold an active Texas notary commission (public record).
    Quantum Surety is not affiliated with your current surety.
    <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
  </p>
</div>
</body>
</html>$body$,
  'active'
);

-- Stage 3 (expiry week): final touch
INSERT INTO drip_schedules (name, contact_type, filters, emails_per_day, from_name, from_email, subject, body, status)
VALUES (
  'COMPETE: Western Surety — Expiry Week',
  'notary',
  '{"surety": "Western Surety", "expiring": "next3"}'::jsonb,
  25,
  'Quantum Surety',
  'info@quantumsurety.bond',
  '{{first_name}}, your notary commission expires this week',
  $body$<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Hi {{first_name}},</p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    A final heads-up: your Texas notary bond expires on <strong>{{expire_date}}</strong>.
    After that date you can't legally notarize until a new bond is on file.
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    There's still time to renew without a gap &mdash; the application takes about 5 minutes,
    costs <strong>$50 for the full 4-year term</strong>, and your certificate typically lands
    in your inbox within the hour.
  </p>
  <p style="margin:28px 0;text-align:center;">
    <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&amp;State=TX"
       style="background:#1e40af;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
      Renew Right Now &rarr;
    </a>
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Rather do it by phone? Call <a href="tel:+12146668718" style="color:#1e40af;font-weight:bold;text-decoration:none;">(214) 666-8718</a>
    &mdash; answered 24/7.
  </p>
  <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:24px 0 0;">
    Quantum Surety &middot; TDI License #3480229<br/>
    <a href="https://quantumsurety.bond" style="color:#6b7280;">quantumsurety.bond</a>
  </p>
  <p style="font-size:12px;color:#9ca3af;margin:24px 0 0;">
    You're receiving this because you hold an active Texas notary commission (public record).
    <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
  </p>
</div>
</body>
</html>$body$,
  'active'
);

SELECT id, name, emails_per_day, filters, status FROM drip_schedules WHERE name LIKE 'COMPETE: Western%' ORDER BY id;
