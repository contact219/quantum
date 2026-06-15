#!/usr/bin/env python3
import urllib.request, json

for dsid, label in [("qh8j-6k63", "Procurement Awarded"), ("vmu2-pnrc", "Contracts"), ("s4vu-giwb", "Payments")]:
    url = "https://data.texas.gov/resource/%s.json?$limit=2" % dsid
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
            if data:
                print("\nOK %s (%s):" % (dsid, label))
                print("  keys: %s" % list(data[0].keys()))
                print("  sample: %s" % str(data[0])[:300])
    except Exception as e:
        print("FAIL %s: %s" % (dsid, e))
