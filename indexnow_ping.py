#!/usr/bin/env python3
"""
Batch-submit our top pages to IndexNow (Bing/Yandex).
IndexNow limit: 10,000 URLs per request.
We submit the most important pages first: main site pages + first 5K notary/contractor detail pages.
"""
import urllib.request
import urllib.error
import json
import xml.etree.ElementTree as ET
import sys

KEY = "quantumsurety-indexnow-2026"
HOST = "quantumsurety.bond"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
INDEXNOW_URL = "https://api.indexnow.org/indexnow"

# Priority 1: static pages
STATIC_URLS = [
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
    "https://quantumsurety.bond/bonds/plumbing-contractor-bond-texas",
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
    "https://quantumsurety.bond/blog/texas-notary-bond-sb693-2026-requirements",
    "https://quantumsurety.bond/blog/texas-electrical-contractor-bond-requirements",
    "https://quantumsurety.bond/blog/texas-tdlr-contractor-bond-2026",
    "https://quantumsurety.bond/blog/texas-contractor-bond-compliance-report-2026",
]

def fetch_urls_from_sitemap(sitemap_url, limit=5000):
    """Fetch up to `limit` URLs from a remote sitemap XML."""
    urls = []
    try:
        resp = urllib.request.urlopen(sitemap_url, timeout=15)
        tree = ET.parse(resp)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        for loc in tree.findall(".//sm:loc", ns):
            if loc.text:
                urls.append(loc.text.strip())
            if len(urls) >= limit:
                break
    except Exception as e:
        print(f"  WARN fetch {sitemap_url}: {e}", file=sys.stderr)
    return urls

def post_indexnow(urls):
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
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

def batch(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i+n]

print("[IndexNow] Collecting URLs...")

all_urls = list(STATIC_URLS)

# Pull first 4,000 notary detail pages from sitemap 01
print("[IndexNow] Fetching notary sitemap 01...")
notary_urls = fetch_urls_from_sitemap(
    "https://verify.quantumsurety.bond/notary-sitemaps-main/sitemap_notaries_main_01.xml",
    limit=4000
)
print(f"  Got {len(notary_urls)} notary URLs")
all_urls.extend(notary_urls)

# Pull first 4,000 contractor detail pages from sitemap 01
print("[IndexNow] Fetching contractor sitemap 01...")
contractor_urls = fetch_urls_from_sitemap(
    "https://verify.quantumsurety.bond/contractor-sitemaps-main/sitemap_contractors_main_01.xml",
    limit=4000
)
print(f"  Got {len(contractor_urls)} contractor URLs")
all_urls.extend(contractor_urls)

# Deduplicate, cap at 10,000
all_urls = list(dict.fromkeys(all_urls))[:10000]
print(f"[IndexNow] Total unique URLs: {len(all_urls)}")

# Submit in batches of 10,000 (already capped)
total_submitted = 0
for i, chunk in enumerate(batch(all_urls, 10000)):
    print(f"[IndexNow] Submitting batch {i+1} ({len(chunk)} URLs)...")
    status, body = post_indexnow(chunk)
    print(f"  Status: {status} | Response: {body[:200]}")
    if status in (200, 202):
        total_submitted += len(chunk)
    elif status == 422:
        print("  422: Some URLs invalid or host mismatch")
    elif status == 429:
        print("  429: Rate limited — stop here")
        break

print(f"[IndexNow] Done. Submitted {total_submitted} URLs to Bing/Yandex IndexNow.")
