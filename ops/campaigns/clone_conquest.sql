-- Merchants Bonding (91K customers): stage 1 = upgrade existing #14 with Western's plain template
UPDATE drip_schedules SET
  emails_per_day = 70,
  subject = (SELECT subject FROM drip_schedules WHERE id = 13),
  body    = (SELECT body    FROM drip_schedules WHERE id = 13)
WHERE id = 14;

-- Merchants stage 2 (30d)
INSERT INTO drip_schedules (name, contact_type, filters, emails_per_day, from_name, from_email, subject, body, status)
SELECT 'COMPETE: Merchants Bonding — 30-Day Renewal Window', 'notary',
       '{"surety": "Merchants Bonding", "expiring": "30"}'::jsonb, 35,
       from_name, from_email, subject, body, 'active'
FROM drip_schedules WHERE id = 54;

-- Merchants stage 3 (expiry week)
INSERT INTO drip_schedules (name, contact_type, filters, emails_per_day, from_name, from_email, subject, body, status)
SELECT 'COMPETE: Merchants Bonding — Expiry Week', 'notary',
       '{"surety": "Merchants Bonding", "expiring": "next3"}'::jsonb, 12,
       from_name, from_email, subject, body, 'active'
FROM drip_schedules WHERE id = 55;

-- Travelers (60K customers): stage 1 (90d)
INSERT INTO drip_schedules (name, contact_type, filters, emails_per_day, from_name, from_email, subject, body, status)
SELECT 'COMPETE: Travelers Notaries (90d)', 'notary',
       '{"surety": "Travelers", "expiring": "90"}'::jsonb, 45,
       from_name, from_email, subject, body, 'active'
FROM drip_schedules WHERE id = 13;

-- Travelers stage 2 (30d)
INSERT INTO drip_schedules (name, contact_type, filters, emails_per_day, from_name, from_email, subject, body, status)
SELECT 'COMPETE: Travelers — 30-Day Renewal Window', 'notary',
       '{"surety": "Travelers", "expiring": "30"}'::jsonb, 25,
       from_name, from_email, subject, body, 'active'
FROM drip_schedules WHERE id = 54;

-- Travelers stage 3 (expiry week)
INSERT INTO drip_schedules (name, contact_type, filters, emails_per_day, from_name, from_email, subject, body, status)
SELECT 'COMPETE: Travelers — Expiry Week', 'notary',
       '{"surety": "Travelers", "expiring": "next3"}'::jsonb, 8,
       from_name, from_email, subject, body, 'active'
FROM drip_schedules WHERE id = 55;

SELECT id, name, emails_per_day, filters->>'surety' AS surety, filters->>'expiring' AS window, status
FROM drip_schedules WHERE name LIKE 'COMPETE:%' ORDER BY filters->>'surety', (filters->>'expiring');
