-- Campaign #3: AUTO Notary Bond Expiry (90d) — early renewal window
UPDATE drip_schedules SET
  subject = '{{first_name}}, your notary bond renewal window is open',
  body = $body$<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Hi {{first_name}},</p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Your Texas notary bond expires on <strong>{{expire_date}}</strong> &mdash; which means your renewal window is open now.
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Renewing online takes about 5 minutes and costs <strong>$50 for the full 4-year term</strong>.
    Your new bond certificate arrives by email, usually the same day &mdash; one less thing on your list.
  </p>
  <p style="margin:28px 0;text-align:center;">
    <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&amp;State=TX"
       style="background:#1e40af;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
      Renew My Notary Bond &rarr;
    </a>
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
    You're receiving this because you hold an active Texas notary commission.
    <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
  </p>
</div>
</body>
</html>$body$
WHERE id = 3;

-- Campaign #40: 3 days to expiry — factual deadline, no shouting
UPDATE drip_schedules SET
  subject = '{{first_name}}, 3 days until your notary bond expires',
  body = $body$<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Hi {{first_name}},</p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    A quick heads-up: your Texas notary bond expires in 3 days, on <strong>{{expire_date}}</strong>.
    After that date you can't legally notarize in Texas until a new bond is in place.
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Renewing online takes about 5 minutes and costs <strong>$50 for the full 4-year term</strong>.
    Your new certificate arrives by email, usually the same day &mdash; no gap in your commission.
  </p>
  <p style="margin:28px 0;text-align:center;">
    <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&amp;State=TX"
       style="background:#1e40af;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
      Renew My Notary Bond &rarr;
    </a>
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Rather handle it by phone? Call <a href="tel:+12146668718" style="color:#1e40af;font-weight:bold;text-decoration:none;">(214) 666-8718</a>
    &mdash; answered 24/7. Or just reply to this email.
  </p>
  <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:24px 0 0;">
    Quantum Surety &middot; TDI License #3480229<br/>
    <a href="https://quantumsurety.bond" style="color:#6b7280;">quantumsurety.bond</a>
  </p>
  <p style="font-size:12px;color:#9ca3af;margin:24px 0 0;">
    You're receiving this because you hold an active Texas notary commission.
    <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
  </p>
</div>
</body>
</html>$body$
WHERE id = 40;

-- Campaign #39: expires today — helpful, fastest path
UPDATE drip_schedules SET
  subject = '{{first_name}}, your notary bond expires today',
  body = $body$<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Hi {{first_name}},</p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Your Texas notary bond expires <strong>today</strong>. If you have notarizations coming up,
    here's the fastest path to staying covered:
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Renew online now &mdash; it takes about 5 minutes, costs <strong>$50 for the full 4-year term</strong>,
    and your new certificate typically lands in your inbox within the hour.
  </p>
  <p style="margin:28px 0;text-align:center;">
    <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&amp;State=TX"
       style="background:#1e40af;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
      Renew Right Now &rarr;
    </a>
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Want help walking through it? Call <a href="tel:+12146668718" style="color:#1e40af;font-weight:bold;text-decoration:none;">(214) 666-8718</a>
    &mdash; answered 24/7. Or just reply to this email.
  </p>
  <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:24px 0 0;">
    Quantum Surety &middot; TDI License #3480229<br/>
    <a href="https://quantumsurety.bond" style="color:#6b7280;">quantumsurety.bond</a>
  </p>
  <p style="font-size:12px;color:#9ca3af;margin:24px 0 0;">
    You're receiving this because you hold an active Texas notary commission.
    <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
  </p>
</div>
</body>
</html>$body$
WHERE id = 39;

-- Campaign #46: referral program — CTA now points at the actual partner program
UPDATE drip_schedules SET
  subject = 'Know a notary? Earn 10% when they bond through us',
  body = $body$<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Hi {{first_name}},</p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Do you know a notary whose bond is coming up for renewal &mdash; a coworker, a friend,
    someone in your network?
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Refer them to Quantum Surety and <strong>you earn 10% of the sale</strong>. We handle
    everything; you just share your link. Signing up takes about a minute.
  </p>
  <p style="margin:28px 0;text-align:center;">
    <a href="https://quantumsurety.bond/partner-program?ref=notary-referral-drip"
       style="background:#1e40af;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
      Get My Referral Link &rarr;
    </a>
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
    You're receiving this because you hold an active Texas notary commission.
    <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
  </p>
</div>
</body>
</html>$body$
WHERE id = 46;

-- Campaign #13: Western Surety switch pitch — plain comparison
UPDATE drip_schedules SET
  subject = '{{first_name}}, before you renew with {{surety_company}} — a quick comparison',
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
    Through Quantum Surety, the same $10,000 bond &mdash; accepted by the Texas Secretary of State,
    underwritten by RLI Insurance &mdash; is <strong>$50 for the full 4-year term</strong>, with an
    instant PDF certificate by email.
  </p>
  <p style="margin:28px 0;text-align:center;">
    <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=N4208MBA2&amp;State=TX"
       style="background:#1e40af;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
      Switch in 5 Minutes &rarr;
    </a>
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
    You're receiving this because you hold an active Texas notary commission.
    <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
  </p>
</div>
</body>
</html>$body$
WHERE id = 13;

SELECT id, name, subject FROM drip_schedules WHERE id IN (3,13,39,40,46) ORDER BY id;
