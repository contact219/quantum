#!/usr/bin/env python3
"""
Submit verify.quantumsurety.bond pages to IndexNow.
Key file is confirmed at https://verify.quantumsurety.bond/quantumsurety-indexnow-2026.txt
"""
import urllib.request
import urllib.error
import json

KEY = "quantumsurety-indexnow-2026"
HOST = "verify.quantumsurety.bond"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
INDEXNOW_URL = "https://api.indexnow.org/indexnow"

VERIFY_PAGES = [
    f"https://{HOST}/",
    f"https://{HOST}/api-docs.html",
    f"https://{HOST}/notary-sitemaps-main/sitemap_notaries_main_01.xml",
    f"https://{HOST}/contractor-sitemaps-main/sitemap_contractors_main_01.xml",
]

# Also submit quantumsurety.bond pages (key now accessible there too via proxy)
QS_PAGES = [
    "https://quantumsurety.bond/",
    "https://quantumsurety.bond/texas-bond-watch",
    "https://quantumsurety.bond/bond-compliance-leaderboard",
    "https://quantumsurety.bond/bond-compliance-by-trade",
    "https://quantumsurety.bond/press",
    "https://quantumsurety.bond/bond-ticker",
    "https://quantumsurety.bond/embed-widget",
    "https://quantumsurety.bond/bonds/notary-bond-texas",
    "https://quantumsurety.bond/bonds/tdlr-bond-texas",
    "https://quantumsurety.bond/bonds/electrical-contractor-bond-texas",
    "https://quantumsurety.bond/bonds/hvac-bond-texas",
    "https://quantumsurety.bond/bonds/texas-contractor",
    "https://quantumsurety.bond/bonds/contractor-bond-dallas",
    "https://quantumsurety.bond/bonds/contractor-bond-houston",
    "https://quantumsurety.bond/bonds/contractor-bond-austin",
    "https://quantumsurety.bond/bonds/contractor-bond-san-antonio",
    "https://quantumsurety.bond/bonds/notary-bond-dallas",
    "https://quantumsurety.bond/bonds/notary-bond-houston",
    "https://quantumsurety.bond/bonds/notary-bond-austin",
    "https://quantumsurety.bond/bonds/gdn-bond-texas",
    "https://quantumsurety.bond/blog",
    "https://quantumsurety.bond/blog/texas-electrical-contractor-bond-requirements",
    "https://quantumsurety.bond/blog/texas-tdlr-contractor-bond-2026",
    "https://quantumsurety.bond/blog/texas-notary-bond-sb693-2026-requirements",
    "https://quantumsurety.bond/blog/texas-contractor-bond-compliance-report-2026",
    "https://quantumsurety.bond/blog/best-texas-surety-bond-company-2026",
    "https://quantumsurety.bond/blog/texas-contractor-bond-market-data-2026",
]

def post_indexnow(host, urls, key_host=None):
    kh = key_host or HOST
    payload = {
        "host": host,
        "key": KEY,
        "keyLocation": f"https://{kh}/{KEY}.txt",
        "urlList": urls,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        INDEXNOW_URL,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        return resp.status, resp.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()
    except Exception as e:
        return 0, str(e)

print(f"[IndexNow] Submitting {HOST} pages...")
status, body = post_indexnow(HOST, VERIFY_PAGES)
print(f"  {HOST}: HTTP {status} | {body[:200]}")

print(f"[IndexNow] Submitting quantumsurety.bond pages (key served from quantumsurety.bond)...")
status2, body2 = post_indexnow("quantumsurety.bond", QS_PAGES, key_host="quantumsurety.bond")
print(f"  quantumsurety.bond: HTTP {status2} | {body2[:200]}")
