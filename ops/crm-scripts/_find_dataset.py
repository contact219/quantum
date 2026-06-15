#!/usr/bin/env python3
import urllib.request, json
# Try known TX Comptroller contract datasets
datasets = [
    ("28fk-fhe6", "TX Vendor Performance"),
    ("3wqb-ygbp", "TexBuy Contracts"),
    ("r52s-rjfm", "TX Expenditures"),
    ("qkzw-8ucs", "TX State Contracts"),
    ("q82j-xhm3", "TX HUB"),
]
for dsid, label in datasets:
    url = "https://data.texas.gov/resource/%s.json?$limit=1" % dsid
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
            keys = list(data[0].keys()) if data else []
            print("OK %s (%s): keys=%s" % (dsid, label, keys[:8]))
    except Exception as e:
        print("FAIL %s (%s): %s" % (dsid, label, e))
