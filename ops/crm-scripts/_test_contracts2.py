#!/usr/bin/env python3
import urllib.request, csv, io

for dsid, label in [("qh8j-6k63", "Procurement Awarded"), ("vmu2-pnrc", "Contracts")]:
    url = "https://data.texas.gov/api/views/%s/rows.csv?$limit=2" % dsid
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            text = r.read().decode("utf-8", errors="replace")
            reader = csv.reader(io.StringIO(text))
            rows = list(reader)
            print("OK %s (%s): headers=%s" % (dsid, label, rows[0] if rows else []))
            if len(rows) > 1:
                print("  sample row: %s" % rows[1][:5])
    except Exception as e:
        print("FAIL %s (%s): %s" % (dsid, label, e))
