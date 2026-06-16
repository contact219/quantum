#!/usr/bin/env python3
import os, math, mysql.connector
from datetime import date

conn = mysql.connector.connect(host='127.0.0.1', user='bondverify', password=os.environ['BONDVERIFY_DB_PASS'], database='bondverify')
cursor = conn.cursor()
print('Fetching notary IDs...', flush=True)
cursor.execute('SELECT notary_id FROM notaries ORDER BY notary_id')
rows = cursor.fetchall()
cursor.close(); conn.close()

OUT = '/var/www/bondverify/public/notary-sitemaps'
os.makedirs(OUT, exist_ok=True)
CHUNK = 50000
TODAY = date.today().isoformat()
total = len(rows)
n = math.ceil(total / CHUNK)
print(f'Notaries: {total}, sitemaps: {n}', flush=True)

files = []
for i in range(n):
    chunk = rows[i*CHUNK:(i+1)*CHUNK]
    fname = f'sitemap_notaries_{i+1}.xml'
    with open(f'{OUT}/{fname}', 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for (nid,) in chunk:
            f.write(f'  <url><loc>https://quantumsurety.bond/notary/{nid}</loc><lastmod>{TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.4</priority></url>\n')
        f.write('</urlset>\n')
    files.append(fname)
    print(f'  {fname}: {len(chunk)} URLs', flush=True)

with open(f'{OUT}/sitemap_notaries_index.xml', 'w') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for fn in files:
        f.write(f'  <sitemap><loc>https://verify.quantumsurety.bond/notary-sitemaps/{fn}</loc><lastmod>{TODAY}</lastmod></sitemap>\n')
    f.write('</sitemapindex>\n')

print(f'Done. Index: https://verify.quantumsurety.bond/notary-sitemaps/sitemap_notaries_index.xml')
