---
license: cc-by-4.0
language:
  - en
pretty_name: Texas Bond Data — Notary, Dealer & Contractor Licences
size_categories:
  - 1K<n<10K
task_categories:
  - tabular-regression
tags:
  - texas
  - licensing
  - public-records
  - government
  - notary
  - automotive
  - construction
configs:
  - config_name: summary
    data_files: data/texas-bond-data-summary.csv
  - config_name: notary_expirations_by_month
    data_files: data/texas-notary-expirations-by-month.csv
  - config_name: notary_by_city
    data_files: data/texas-notary-commissions-by-city.csv
  - config_name: notary_by_zip
    data_files: data/texas-notary-commissions-by-zip.csv
  - config_name: dealer_expirations_by_month
    data_files: data/texas-gdn-dealer-expirations-by-month.csv
  - config_name: dealers_by_county
    data_files: data/texas-gdn-dealers-by-county.csv
  - config_name: dealers_by_city
    data_files: data/texas-gdn-dealers-by-city.csv
  - config_name: dealers_by_license_type
    data_files: data/texas-gdn-dealers-by-license-type.csv
---

# Texas Bond Data — Notary Commissions, GDN Dealers & Contractor Licences

Aggregate counts derived from Texas state licensing records, covering **558,898 notary
commissions**, **18,811 licensed motor vehicle dealers**, and **852,883 TDLR contractor
licences**.

Texas publishes all three registries, but only as one-record-at-a-time search forms —
there is no official published aggregate. This dataset fills that gap.

**Live version, updated monthly:** https://quantumsurety.bond/texas-bond-data
**JSON API:** https://verify.quantumsurety.bond/api/v1/stats/overview

## Configurations

| Config | Rows | Description |
|---|---|---|
| `summary` | 3 | Statewide totals for all three registries |
| `notary_expirations_by_month` | 64 | Commissions expiring per month, 2020–2031 |
| `notary_by_city` | 1,392 | Commissions per city (≥5) |
| `notary_by_zip` | 2,059 | Commissions per ZIP (≥5) |
| `dealer_expirations_by_month` | 64 | GDN licences expiring per month |
| `dealers_by_county` | 226 | Licensed dealers per county |
| `dealers_by_city` | 544 | Licensed dealers per city (≥3) |
| `dealers_by_license_type` | 13 | Dealers by licence type and category |

## Column definitions

- `commissions_total` / `dealers_total` — all records on file, active or lapsed
- `commissions_active` / `dealers_active` — expiration date is today or later
- `commissions_expired` / `dealers_expired` — expiration date has passed
- `month` — `YYYY-MM`, the month of expiration
- `commissions_expiring` / `licences_expiring` — count expiring that month

## Snapshot (2026-07-21)

```
notary_commissions        558,898 total    445,100 active    113,750 expired
gdn_dealers                18,811 total     16,426 active      2,385 expired
tdlr_contractor_licences  852,883 total
```

## Why the expiration curve matters

Texas notary commissions run **four-year terms**; GDN dealer licences renew **annually**.
Commissions were issued in uneven waves, so the expiration curve is lumpy — **12,599
commissions expire in August 2026** against roughly 8,000 in a typical month. Modelling
renewal demand or compliance workload requires the curve, not the average.

## Sources

| Registry | Source |
|---|---|
| Notary commissions | Texas Secretary of State published notary file |
| GDN motor vehicle dealers | Texas Department of Motor Vehicles (TxDMV) |
| Contractor licences | Texas Department of Licensing and Regulation (TDLR) |

Re-imported monthly, computed against the full record set — no sampling or estimation.

## Limitations

- Records published by the state without a city or ZIP are excluded from geographic
  breakdowns but counted in statewide totals, so geographic tables sum to slightly less
  than the total.
- Small-count thresholds apply (≥5 notary commissions, ≥3 dealers) to avoid a long tail
  of single-record rows.
- Place names appear as the state records them, including inconsistent capitalisation
  (e.g. "Mcallen"). Counts are case-insensitively merged, so no place appears twice.
- 226 of Texas's 254 counties appear in the dealer file; the rest have no licensed GDN
  dealer on record.
- "Active" derives purely from the expiration date and does not reflect suspensions,
  revocations, or voluntary surrender.
- **Aggregate data only** — no individual names, addresses, or contact details.

## Licence

CC-BY-4.0. Attribution: *Quantum Surety, https://quantumsurety.bond/texas-bond-data*

## Contact

**api@quantumsurety.bond** — questions, corrections, or unpublished cuts.

Maintained by [Quantum Surety](https://quantumsurety.bond), a Texas-licensed surety bond
agency (TDI #3480229).
