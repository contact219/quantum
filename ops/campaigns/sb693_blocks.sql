DO $$
DECLARE blk TEXT := '<div style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:4px;padding:12px 16px;margin:18px 0;">
<p style="font-size:14px;line-height:1.6;margin:0;color:#374151;font-family:Arial,sans-serif;"><strong>SB693 reminder:</strong> Since Jan 1, 2026, Texas requires every new and renewing notary to pass a 2-hour state course ($20, sos.texas.gov) &mdash; plus new journal and penalty rules. <a href="https://quantumsurety.bond/blog/texas-notary-bond-sb693-2026-requirements" style="color:#1e40af;font-weight:bold;">See what changed &rarr;</a></p>
</div>
';
BEGIN
  -- Plain-template family: insert above the footer block
  UPDATE drip_schedules
  SET body = REPLACE(body,
    '<p style="font-size:14px;color:#6b7280;line-height:1.6;margin:24px 0 0;">',
    blk || '  <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:24px 0 0;">')
  WHERE id IN (2,3,13,14,39,40,46,54,55,56,57,58,59,60) AND body NOT ILIKE '%sb693%';

  -- Legacy templates with the #eee hr footer divider
  UPDATE drip_schedules
  SET body = regexp_replace(body, '(<hr style="border:none;border-top:1px solid #eee;)', blk || '\1')
  WHERE id IN (8,11,12,15) AND body NOT ILIKE '%sb693%';

  -- Legacy templates with the #e5e7eb bordered footer paragraph
  UPDATE drip_schedules
  SET body = regexp_replace(body, '(<p style="[^"]*border-top:1px solid #e5e7eb)', blk || '\1')
  WHERE id IN (5,51) AND body NOT ILIKE '%sb693%';

  -- Standardize the stale (972) 379-9216 number wherever it remains
  UPDATE drip_schedules
  SET body = REPLACE(REPLACE(body, 'tel:+19723799216', 'tel:+12146668718'), '972-379-9216', '(214) 666-8718')
  WHERE body LIKE '%9723799216%' OR body LIKE '%972-379-9216%';
END $$;

SELECT id, LEFT(name,42), body ILIKE '%sb693%' AS has_sb693, body LIKE '%972-379%' AS old_phone
FROM drip_schedules
WHERE status='active' AND contact_type IN ('notary','notary_followup','lapsed_notary','notary_opener')
ORDER BY id;
