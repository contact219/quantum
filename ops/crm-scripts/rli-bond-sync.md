# RLI Bond Sync Pipeline

Automated daily pipeline that scrapes all bonds from the RLI surety portal (mybondapp) and syncs them to the CRM bookkeeping database.

## Scripts

| Script | Location on CRM VPS | Purpose |
|--------|---------------------|---------|
| `mybondapp_sync.cjs` | `/opt/quantum-ops/mybondapp_sync.cjs` | Puppeteer scraper — logs in, navigates BondList, upserts all bonds |
| `bk_status_sync.cjs` | `/opt/quantum-ops/bk_status_sync.cjs` | Recomputes bond statuses, writes KPI snapshot to `bk_kpi_cache` |

## Cron Schedule (CRM VPS 130.51.22.226, root)

```
5 5 * * *   NODE_PATH=/root/node_modules CRM_DB_PASSWORD=... node /opt/quantum-ops/mybondapp_sync.cjs   >> /var/log/mybondapp-sync.log
6 7 * * *   NODE_PATH=/root/node_modules CRM_DB_PASSWORD=... node /opt/quantum-ops/bk_status_sync.cjs   >> /tmp/bk-status-sync.log
10 7 * * *  NODE_PATH=/root/node_modules ...                node /opt/quantum-ops/bk_revenue_report.cjs >> /tmp/bk-revenue-report.log
```

Order matters: mybondapp_sync (5:05 AM) must complete before bk_status_sync (7:06 AM) reads the fresh data.

## Login Flow

1. Load saved Okta cookies from `/opt/quantum-ops/.rli_session.json`
2. Navigate to `https://myportal.rlicorp.com/en/surety/overview`
3. **Session valid** → skip login, refresh cookie file
4. **Session expired** → SP-initiated SSO to Okta:
   - Enter username (`nice.shotwell-sparks@quantumsurety.bond`) + password
   - Detect MFA screen (buttons contain "Select") → click Phone/SMS factor
   - Wait up to 10 min for OTP written to `/tmp/rli_otp.txt`
   - On success: save 48+ cookies back to `.rli_session.json`

### MFA Re-Authentication (when session expires, ~every 30 days)

```bash
# On CRM VPS — start scraper in background
nohup bash -c 'NODE_PATH=/root/node_modules CRM_DB_PASSWORD=QsCRMV8yNgKOoaNPu67JF! \
  node /opt/quantum-ops/mybondapp_sync.cjs' > /tmp/mybondapp_sync.log 2>&1 &

# Watch for SMS prompt
tail -f /tmp/mybondapp_sync.log | grep -m1 'SMS sent'

# When SMS arrives on phone, enter the code:
echo "XXXXXX" > /tmp/rli_otp.txt
```

## Bond Scraping

- Navigates myportal SPA → "My Bond Center" → `https://rlisurety.rlicorp.com/Agency/BondList`
- Paginates through all pages (typically 15–20 pages, ~10 bonds per page)
- Reads `document.body.innerText` per page, splits on `MBA\n` to get individual bond cards
- Each card parsed for: Bond No, status line, Term dates, Premium, Submission No, Principal name, Bond Description

### Saved / Draft Bonds

Bonds in "Saved" status have no bond number yet. These get a stable synthetic key:

- `DRAFT-{submNo}` — if Submission Number exists (preferred, e.g., `DRAFT-335540656`)
- `DRAFT-{nameSlug}-{YYYYMMDD}` — fallback using first 10 chars of insured name + effective date

This allows them to be upserted and tracked without violating the `bond_number UNIQUE` constraint.

### Status Mapping

| RLI Portal Status | `bk_bonds.status` |
|-------------------|-------------------|
| Active / Issued   | `issued`          |
| Saved             | `saved`           |
| Abandoned         | `abandoned`       |
| Cancelled         | `cancelled`       |
| Expired           | `expired`         |
| Pending           | `pending`         |

## Database

**CRM Postgres** (`scraper-postgres`, port 5433, db `quantum_surety`):

- `bk_bonds` — one row per bond, upserted via `ON CONFLICT (bond_number)`
- `bk_kpi_cache` — daily snapshot: active bonds, MTD/YTD commission, expiring 30d, unpaid bills
- `bk_carriers` — RLI carrier record (id=4)

**Upsert endpoint:** `POST http://localhost:4001/api/bookkeeping/bonds/upsert-from-scraper`

## CRM Dashboard Integration

- `/api/bookkeeping/kpi` — reads latest `bk_kpi_cache` row → shown in Dashboard.jsx BOOKKEEPING SNAPSHOT bar
- `/api/bookkeeping/dashboard` — returns `by_status` breakdown → shown in Bookkeeping.jsx "Bond Portfolio by Status" card

## Typical Portfolio (as of 2026-06-27)

| Status    | Count | Premium    |
|-----------|-------|------------|
| saved     | 154   | $8,531     |
| issued    | 21    | $2,735     |
| abandoned | 10    | $982       |
| cancelled | 5     | $556       |

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Login failed: expected myportal` | Session expired | Run MFA re-auth flow above |
| `MFA timeout: no code provided` | OTP not written in time | Re-run; write code faster to `/tmp/rli_otp.txt` |
| `Found 0 bonds on page N` | BondList page structure changed | Inspect `/tmp/rli_page1.txt` for new format |
| `Upserted: 0` with no error | Session stale mid-run, navigated to wrong page | Clear `.rli_session.json` and re-auth |
| bk_status shows 0 saved bonds | mybondapp_sync ran before fix (pre 2026-06-27) | Re-run sync; saved bonds now get `DRAFT-*` keys |
