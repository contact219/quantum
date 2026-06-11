UPDATE drip_schedules SET
  subject = '{{first_name}}, your notary bond expires {{expire_date}} — 5-minute renewal',
  body = $body$<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">

  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Hi {{first_name}},</p>

  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Your Texas notary bond expires on <strong>{{expire_date}}</strong>.
  </p>

  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Renewing online takes about 5 minutes and costs <strong>$50 for the full 4-year term</strong>.
    Your new bond certificate arrives by email, usually the same day.
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
WHERE id = 2
RETURNING id, name, subject;
