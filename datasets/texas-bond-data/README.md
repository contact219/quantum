# Texas Bond Data — Notary Commissions, GDN Dealers & Contractor Licences

Aggregate counts derived from Texas state licensing records, covering **558,898 notary
commissions**, **18,811 licensed motor vehicle dealers**, and **852,883 TDLR contractor
licences**.

Texas publishes all three of these registries, but only as one-record-at-a-time search
forms — there is no official published aggregate. This dataset fills that gap: statewide
totals, expiration curves, and geographic breakdowns down to city and ZIP level.

**Live version, updated monthly:** https://quantumsurety.bond/texas-bond-data
**JSON API:** https://verify.quantumsurety.bond/api/v1/stats/overview

---

## What's in here

| File | Rows | Description |
|---|---|---|
| `texas-bond-data-summary.csv` | 3 | Statewide totals for all three registries |
| `texas-notary-expirations-by-month.csv` | 64 | Notary commissions expiring per month, 2020–2031 |
| `texas-notary-commissions-by-city.csv` | 1,392 | Commissions per city (cities with ≥5) |
| `texas-notary-commissions-by-zip.csv` | 2,059 | Commissions per ZIP code (ZIPs with ≥5) |
| `texas-gdn-dealer-expirations-by-month.csv` | 64 | GDN dealer licences expiring per month |
| `texas-gdn-dealers-by-county.csv` | 226 | Licensed dealers per county |
| `texas-gdn-dealers-by-city.csv` | 544 | Licensed dealers per city (cities with ≥3) |
| `texas-gdn-dealers-by-license-type.csv` | 13 | Dealers by licence type and category |

## Column definitions

- `commissions_total` / `dealers_total` — all records on file, active or lapsed
- `commissions_active` / `dealers_active` — expiration date is today or later
- `commissions_expired` / `dealers_expired` — expiration date has passed
- `month` — `YYYY-MM`, the month in which the commission or licence expires
- `licences_expiring` / `commissions_expiring` — count expiring in that month

## Snapshot (as of 2026-07-21)

```
notary_commissions        558,898 total    445,100 active    113,750 expired
gdn_dealers                18,811 total     16,426 active      2,385 expired
tdlr_contractor_licences  852,883 total
```

Largest notary populations: Houston (58,662), San Antonio (27,304), Dallas (24,244),
Austin (18,411), Fort Worth (16,109).

## Why the expiration curve is the interesting part

Texas notary commissions run **four-year terms**, and GDN dealer licences renew
**annually**. Because commissions were issued in uneven waves, the expiration curve is
lumpy rather than flat — for example, **12,599 notary commissions expire in August 2026**
against roughly 8,000 in a typical month. Anyone modelling renewal demand, compliance
workload, or notary availability by region needs the curve, not the average.

## Sources & methodology

| Registry | Source |
|---|---|
| Notary commissions | Texas Secretary of State published notary file |
| GDN motor vehicle dealers | Texas Department of Motor Vehicles (TxDMV) licensing |
| Contractor licences | Texas Department of Licensing and Regulation (TDLR) |

Each source is re-imported on a monthly schedule and counts are computed directly against
the full record set — no sampling, no estimation, no modelling.

**Known limitations, stated plainly:**

- Records the state publishes without a city or ZIP are excluded from geographic
  breakdowns but still counted in statewide totals, so geographic tables sum to slightly
  less than the total.
- City and ZIP tables apply small-count thresholds (≥5 notary commissions, ≥3 dealers) to
  avoid a long tail of single-record rows; the thresholds are stated per file above.
- Place names are reproduced as the state records them, including inconsistent
  capitalisation (e.g. "Mcallen"). Counts are already case-insensitively merged, so no
  city appears twice.
- 226 of Texas's 254 counties appear in the dealer file; the remainder have no licensed
  GDN dealer on record.
- "Active" is derived purely from the expiration date. It does not account for
  suspensions, revocations, or voluntary surrender.
- This is aggregate data only. No individual names, addresses, or contact details are
  included in this dataset.

## Licence

Creative Commons Attribution 4.0 (CC-BY-4.0). Free for any use, including commercial and
editorial. Attribution: *Quantum Surety, https://quantumsurety.bond/texas-bond-data*

## Contact

Questions, corrections, or a cut of the data that isn't published here:
**api@quantumsurety.bond**

Maintained by [Quantum Surety](https://quantumsurety.bond), a Texas-licensed surety bond
agency (TDI #3480229). We built these mirrors to run bond lookups and renewal reminders;
publishing the aggregates costs us nothing and there was no other public source.
