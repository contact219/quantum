#!/usr/bin/env node
// Auto-submitted after every deploy via "npm run deploy"

const KEY  = process.env.INDEXNOW_KEY || "454b42bc1f38f7416497223b5075a278";
const HOST = "quantumsurety.bond";
const BASE = `https://${HOST}`;

async function getSitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl, { signal: AbortSignal.timeout(10_000) });
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map(m => m[1].trim());
}

async function submitIndexNow(urls) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList: urls,
  };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });
  return res.status;
}

async function main() {
  console.log("[IndexNow] Fetching sitemap...");
  const urls = await getSitemapUrls(`${BASE}/sitemap.xml`);
  console.log(`[IndexNow] Submitting ${urls.length} URLs to api.indexnow.org...`);
  const status = await submitIndexNow(urls);
  if (status === 200 || status === 202) {
    console.log(`[IndexNow] Done — HTTP ${status} (accepted)`);
  } else {
    console.warn(`[IndexNow] Unexpected status ${status}`);
  }
}

main().catch(err => {
  console.warn("[IndexNow] Submission failed (non-fatal):", err.message);
});
