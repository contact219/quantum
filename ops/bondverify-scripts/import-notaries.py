#!/usr/bin/env python3
"""
import-notaries.py
Downloads Texas notary database from data.texas.gov and upserts into bondverify.notaries (MariaDB).
"""
import csv, re, os, requests, pymysql, pymysql.cursors
from datetime import datetime

def _load_env(path='/var/www/bondverify/.env'):
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    os.environ.setdefault(k.strip(), v.strip())
    except OSError:
        pass

_load_env()
DB = dict(host=os.environ.get('DB_HOST', '127.0.0.1'), port=3306, db='bondverify',
          user=os.environ.get('DB_USER', 'bondverify'), password=os.environ['DB_PASS'],
          charset='utf8mb4')
URL = 'https://data.texas.gov/api/views/gmd3-bnrd/rows.csv?accessType=DOWNLOAD'
TMP_FILE = '/home/tsparks/notaries_bv.csv' if os.path.isdir('/home/tsparks') else '/tmp/notaries_bv.csv'
BATCH_SIZE = 2000

def parse_address(raw):
    # TX SOS format is usually "street line(s)\nCity, TX 77001" — newlines inside
    # the field, and the street may itself contain commas/suite parts. Parse from
    # the end: state+zip, then city = the last newline/comma-delimited token.
    if not raw: return '', '', 'TX', ''
    raw = raw.strip()
    m = re.search(r'[,\s]+([A-Za-z]{2})\s+(\d{5})(?:-\d{4})?\s*$', raw)
    if not m:
        return re.sub(r'\s+', ' ', raw), '', 'TX', ''
    state, zip_code = m.group(1).upper(), m.group(2)
    head = raw[:m.start()].strip()
    parts = [p.strip() for p in re.split(r'[\n,]', head) if p.strip()]
    city = parts[-1] if parts else ''
    street = re.sub(r'\s+', ' ', ' '.join(parts[:-1])).strip(' ,')
    city = re.sub(r'^(suite|ste\.?|apt\.?|unit|bldg\.?|floor|fl\.?|#)\s*\S*\s*', '', city, flags=re.I).strip()
    return street, city.title(), state, zip_code

def parse_date(s):
    if not s: return None
    try: return datetime.strptime(s.strip(), '%m/%d/%Y').date()
    except: return None

def download():
    print('Downloading Texas notary database...', flush=True)
    with requests.get(URL, stream=True, timeout=600) as resp:
        resp.raise_for_status()
        total = 0
        with open(TMP_FILE, 'wb') as f:
            for chunk in resp.iter_content(chunk_size=1024*256):
                f.write(chunk); total += len(chunk)
                print(f'  {total/1024/1024:.1f} MB...', end='\r', flush=True)
    print(f'\nDownload complete: {os.path.getsize(TMP_FILE)/1024/1024:.1f} MB', flush=True)

def upsert():
    print('Importing into MariaDB...', flush=True)
    conn = pymysql.connect(**DB, cursorclass=pymysql.cursors.Cursor)
    cur = conn.cursor()
    batch, processed = [], 0

    with open(TMP_FILE, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            nid = row.get('Notary ID', '').strip()
            if not nid: continue
            address, city, state, zip_code = parse_address(row.get('Address', ''))
            batch.append((
                nid, row.get('First Name','').strip(), row.get('Last Name','').strip(),
                row.get('Email Address','').strip().lower(),
                address, city, state, zip_code,
                parse_date(row.get('Effective Date')), parse_date(row.get('Expire Date')),
                row.get('Surety Company','').strip(), row.get('Agency','').strip(),
            ))
            if len(batch) >= BATCH_SIZE:
                flush(cur, batch); conn.commit()
                processed += len(batch)
                print(f'  {processed:,} records...', end='\r', flush=True)
                batch = []

    if batch:
        flush(cur, batch); conn.commit(); processed += len(batch)

    cur.execute('SELECT COUNT(*) FROM notaries')
    total = cur.fetchone()[0]
    conn.close()
    print(f'\nDone. Processed {processed:,} rows. Total in DB: {total:,}', flush=True)

def flush(cur, batch):
    sql = """INSERT INTO notaries
        (notary_id, first_name, last_name, email, address, city, state, zip,
         effective_date, expire_date, surety_company, agency)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        ON DUPLICATE KEY UPDATE
            first_name=VALUES(first_name), last_name=VALUES(last_name),
            email=VALUES(email), address=VALUES(address), city=VALUES(city),
            state=VALUES(state), zip=VALUES(zip),
            effective_date=VALUES(effective_date), expire_date=VALUES(expire_date),
            surety_company=VALUES(surety_company), agency=VALUES(agency),
            updated_at=NOW()"""
    cur.executemany(sql, batch)

if __name__ == '__main__':
    download()
    upsert()
    try: os.remove(TMP_FILE)
    except: pass
