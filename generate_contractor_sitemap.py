#!/usr/bin/env python3
"""
Generate contractor sitemap index for quantumsurety.bond.
Creates /var/www/bondverify/public/contractor-sitemaps/ directory with
sitemap_contractors_1.xml through sitemap_contractors_N.xml,
each containing up to 50,000 URLs.
Also creates sitemap_contractors_index.xml.

These are served from verify.quantumsurety.bond but point to quantumsurety.bond URLs.
"""
import sys
import os
import math
import mysql.connector
from datetime import date

DB_CONFIG = {
    'host': '127.0.0.1',
    'user': 'bondverify',
    'password': os.environ['BONDVERIFY_DB_PASS'],
    'database': 'bondverify',
    'port': 3306,
}

OUT_DIR = '/var/www/bondverify/public/contractor-sitemaps'
BASE_URL = 'https://quantumsurety.bond'
TODAY = date.today().isoformat()
CHUNK = 50000

os.makedirs(OUT_DIR, exist_ok=True)

conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor()

# Get all license numbers
print('Fetching license numbers...', flush=True)
cursor.execute('SELECT license_number FROM contractors ORDER BY id')
rows = cursor.fetchall()
cursor.close()
conn.close()

total = len(rows)
n_chunks = math.ceil(total / CHUNK)
print(f'Total: {total} contractors, {n_chunks} sitemaps', flush=True)

sitemap_files = []
for i in range(n_chunks):
    chunk = rows[i*CHUNK:(i+1)*CHUNK]
    fname = f'sitemap_contractors_{i+1}.xml'
    fpath = os.path.join(OUT_DIR, fname)
    with open(fpath, 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for (lic,) in chunk:
            f.write(f'  <url><loc>{BASE_URL}/contractor/{lic}</loc><lastmod>{TODAY}</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url>\n')
        f.write('</urlset>\n')
    sitemap_files.append(fname)
    print(f'  Wrote {fname} ({len(chunk)} URLs)', flush=True)

# Write sitemap index
index_path = os.path.join(OUT_DIR, 'sitemap_contractors_index.xml')
with open(index_path, 'w') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for fname in sitemap_files:
        f.write(f'  <sitemap><loc>https://verify.quantumsurety.bond/contractor-sitemaps/{fname}</loc><lastmod>{TODAY}</lastmod></sitemap>\n')
    f.write('</sitemapindex>\n')

print(f'Done. Index at {index_path}')
print('Submit to Google Search Console: https://verify.quantumsurety.bond/contractor-sitemaps/sitemap_contractors_index.xml')
