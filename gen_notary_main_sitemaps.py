#!/usr/bin/env python3
# Generate sitemaps for quantumsurety.bond/notary/:id pages
# Hosted at verify.quantumsurety.bond/notary-sitemaps-main/
# Submit index to Google Search Console for quantumsurety.bond property
import mysql.connector
import os
import math

DB = dict(host='127.0.0.1', user='bondverify', password=os.environ['BONDVERIFY_DB_PASS'], database='bondverify')
BASE_URL = 'https://quantumsurety.bond/notary'
OUT_DIR = '/var/www/bondverify/public/notary-sitemaps-main'
SITEMAP_HOST = 'https://verify.quantumsurety.bond/notary-sitemaps-main'
BATCH = 50000

os.makedirs(OUT_DIR, exist_ok=True)

conn = mysql.connector.connect(**DB)
cur = conn.cursor()
cur.execute("SELECT COUNT(*) FROM notaries")
total = cur.fetchone()[0]
print(f"Total notaries: {total}")

num_files = math.ceil(total / BATCH)
files = []

for i in range(num_files):
    offset = i * BATCH
    cur.execute(
        "SELECT notary_id, expire_date FROM notaries ORDER BY notary_id LIMIT %s OFFSET %s",
        (BATCH, offset)
    )
    rows = cur.fetchall()
    fname = f"sitemap_notaries_main_{i+1:02d}.xml"
    fpath = os.path.join(OUT_DIR, fname)
    with open(fpath, 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for notary_id, expire_date in rows:
            priority = '0.7' if expire_date and str(expire_date) >= '2026-01-01' else '0.5'
            f.write(f'  <url><loc>{BASE_URL}/{notary_id}</loc><priority>{priority}</priority></url>\n')
        f.write('</urlset>\n')
    files.append(fname)
    print(f"  Wrote {fpath} ({len(rows)} URLs)")

# Write index
index_path = os.path.join(OUT_DIR, 'sitemap_notaries_main_index.xml')
with open(index_path, 'w') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for fname in files:
        f.write(f'  <sitemap><loc>{SITEMAP_HOST}/{fname}</loc></sitemap>\n')
    f.write('</sitemapindex>\n')
print(f"Index: {index_path}")
print(f"Submit to Search Console: {SITEMAP_HOST}/sitemap_notaries_main_index.xml")

cur.close()
conn.close()
print("Done.")
