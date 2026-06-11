INSERT INTO drip_schedules (name, contact_type, filters, emails_per_day, from_name, from_email, subject, body, status)
VALUES (
  'TITLE BOND: Used Dealer Referral — Certificate of Title',
  'dealer',
  '{"license_type": "Used"}'::jsonb,
  50,
  'Quantum Surety',
  'info@quantumsurety.bond',
  'No title on a trade-in? The 10-minute fix — plus $20 per referral',
  $body$<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">

  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">Hi {{business_name}},</p>

  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    Every used dealer in Texas runs into it: a trade-in, auction unit, or wholesale buy
    with <strong>no title</strong>. The vehicle sits on your lot, or your customer
    can't register what they bought.
  </p>

  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    The fix is a <strong>Texas Certificate of Title Bond</strong> (bonded title).
    It starts at $50 for a 3-year term, and most people finish the application
    online in about 10 minutes.
  </p>

  <p style="margin:28px 0;text-align:center;">
    <a href="https://quantumsurety.bond/texas-title-rescue?ref=dealer"
       style="background:#1e40af;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
      Send Your Customer This Link &rarr;
    </a>
  </p>

  <p style="font-size:16px;line-height:1.6;margin:0 0 18px;">
    <strong>Earn $20 for every bond issued</strong> from your referrals &mdash; plus 10%
    commission on any other bond business you send us through our
    <a href="https://quantumsurety.bond/partner-program?ref=dealer-drip" style="color:#1e40af;">partner program</a>.
  </p>

  <p style="font-size:14px;line-height:1.6;margin:0 0 18px;color:#4b5563;">
    Customer ready to apply right now? Direct application:
    <a href="https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&amp;State=TX" style="color:#1e40af;">mybondapp.com title bond application</a>
  </p>

  <p style="font-size:16px;line-height:1.6;margin:0 0 6px;">
    Questions? Call <a href="tel:+12146668718" style="color:#1e40af;font-weight:bold;text-decoration:none;">(214) 666-8718</a> &mdash; answered 24/7.
  </p>

  <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:24px 0 0;">
    Quantum Surety &middot; TDI License #3480229<br/>
    <a href="https://quantumsurety.bond" style="color:#6b7280;">quantumsurety.bond</a>
  </p>

  <p style="font-size:12px;color:#9ca3af;margin:24px 0 0;">
    You're receiving this because your dealership holds an active Texas GDN license.
    <a href="{{unsubscribe_url}}" style="color:#9ca3af;">Unsubscribe</a>
  </p>

</div>
</body>
</html>$body$,
  'active'
)
RETURNING id, name, emails_per_day;
