#!/usr/bin/env tsx
// Runs as part of `npm run build`. Hashes each PAGE_META entry's actual content
// (title/description/content/structuredData) and only bumps its lastmod date when
// the hash changed since the last run — instead of the sitemap claiming every URL
// was modified today, every day. Output is gitignored and persists on disk across
// deploys so dates accumulate real history instead of resetting on every build.

import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { PAGE_META } from "../server/seo";

const DATA_FILE = path.join(process.cwd(), "server", "sitemap-lastmod.json");

interface Entry {
  hash: string;
  lastmod: string;
}

function hashEntry(meta: (typeof PAGE_META)[string]): string {
  const payload = JSON.stringify({
    title: meta.title,
    description: meta.description,
    content: meta.content,
    structuredData: meta.structuredData,
  });
  return createHash("sha256").update(payload).digest("hex");
}

function main() {
  const today = new Date().toISOString().split("T")[0];

  let existing: Record<string, Entry> = {};
  try {
    existing = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    // First run — nothing to diff against yet, everything seeds to today.
  }

  const next: Record<string, Entry> = {};
  let added = 0;
  let changed = 0;
  let unchanged = 0;

  for (const [urlPath, meta] of Object.entries(PAGE_META)) {
    const hash = hashEntry(meta);
    const prior = existing[urlPath];
    if (prior && prior.hash === hash) {
      next[urlPath] = prior;
      unchanged++;
    } else {
      next[urlPath] = { hash, lastmod: today };
      if (prior) changed++;
      else added++;
    }
  }

  const removed = Object.keys(existing).filter((k) => !(k in PAGE_META)).length;

  fs.writeFileSync(DATA_FILE, JSON.stringify(next, null, 2) + "\n");
  console.log(
    `[sitemap-lastmod] ${added} new, ${changed} changed, ${unchanged} unchanged` +
      (removed ? `, ${removed} removed` : "")
  );
}

main();
