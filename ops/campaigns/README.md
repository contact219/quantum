# Drip Campaign Definitions (applied 2026-06-10/11)

SQL applied to the CRM `drip_schedules` table (PostgreSQL `quantum_surety` on
192.168.4.122:5433). The database is the source of truth; these files document
what was applied and allow recreation.

| File | What it did |
|------|-------------|
| `update_campaign2.sql` | Rewrote #2 (30d notary expiry) to plain single-CTA template |
| `rewrite_zero_click.sql` | Rewrote #3, #13, #39, #40, #46 (zero-click campaigns) to plain templates; fixed #46 CTA to partner program; standardized phone to (214) 666-8718 |
| `dealer_title_campaign.sql` | Created #53: used-dealer title bond referral (50/day, 15K dealer audience) |
| `western_conquest.sql` | Scaled #13 to 150/day + reminder-capture CTA; created #54 (30d) and #55 (expiry week) — 3-stage Western Surety conquest |
| `clone_conquest.sql` | Cloned conquest stages for Merchants (#14/56/57) and Travelers (#58/59/60) by SELECTing bodies from the Western stages |

Also applied directly (not in files): #44 "Surety One" — added missing surety
filter (was emailing ALL expiring notaries), then paused (Surety One has 0
active TX notaries).

Also applied 2026-06-11 (direct SQL): #12 lapsed-notary body used
`{{days_lapsed}}`, a variable drip.js never interpolates — recipients saw raw
template syntax. Reworded to use `{{expire_date}}` only. Found by
`ops/crm-scripts/verify_render.py`, which simulates send-time rendering;
run it after ANY campaign body change.

Templates use `{{first_name}}`, `{{surety_company}}`, `{{expire_date}}`,
`{{verify_url}}`, `{{unsubscribe_url}}` — interpolated by
`backend/src/routes/drip.js` in the quantum-surety-crm repo.
