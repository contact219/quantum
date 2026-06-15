#!/usr/bin/env python3
# Probe the data.texas.gov catalog for contract/award datasets
import urllib.request, json

# Try catalog search
url = "https://data.texas.gov/api/catalog/v1?q=vendor+contract&limit=10"
try:
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as r:
        data = json.loads(r.read())
        results = data.get("results", [])
        for item in results[:10]:
            resource = item.get("resource", {})
            print("Dataset: %s | ID: %s | Type: %s" % (
                resource.get("name", "?")[:60],
                resource.get("id", "?"),
                resource.get("type", "?")
            ))
except Exception as e:
    print("Catalog error: %s" % e)

# Also try the known working format
print("\nTesting known working resource format:")
url2 = "https://data.texas.gov/resource/7358-krk7.json?$limit=1"
try:
    req2 = urllib.request.Request(url2, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req2, timeout=10) as r:
        data2 = json.loads(r.read())
        print("7358-krk7 OK: keys=%s" % list(data2[0].keys())[:5] if data2 else "empty")
except Exception as e:
    print("7358-krk7 FAIL: %s" % e)
