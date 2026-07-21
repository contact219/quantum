# Upload instructions

Everything here is ready to publish. Each platform is self-serve — no gatekeeper, no
pitch, no approval queue. Budget about 90 minutes for all three.

**Do the uploads under a Quantum Surety–branded account, not a personal one.** The
citation value comes from the account being identifiably the company.

---

## 1. data.world (start here — fastest, best for citations)

Highest signal-to-effort of the three. data.world pages rank well and are what
journalists and analysts actually search.

1. Create an account at https://data.world (free tier is fine)
2. **Create a dataset** → name it `Texas Bond Data`
3. Upload all 8 files from `data/`
4. Paste `README.md` into the description field
5. Licence → **CC-BY-4.0**
6. Tags: `texas`, `licensing`, `notary`, `automotive`, `construction`, `public-records`, `government`
7. Visibility → **Open / public**
8. In the dataset summary, link back to https://quantumsurety.bond/texas-bond-data

## 2. Kaggle

Largest audience; also feeds Google Dataset Search.

1. Account at https://kaggle.com
2. **Datasets → New Dataset**
3. Upload the `data/` folder (keep the folder structure)
4. Open `dataset-metadata.json` and replace `REPLACE_WITH_KAGGLE_USERNAME` with your
   actual Kaggle username — the upload fails validation otherwise
5. Either upload that file with the CLI, or copy its `title` / `subtitle` /
   `description` / `keywords` into the web form
6. Licence → **CC BY 4.0**

CLI alternative (faster if you have `kaggle` installed):

```bash
cd datasets/texas-bond-data
# after editing the username in dataset-metadata.json
kaggle datasets create -p . -r zip
```

Updating later:

```bash
kaggle datasets version -p . -m "Monthly refresh $(date +%Y-%m)"
```

## 3. Hugging Face Datasets

Best long-term bet for LLM citation — HF datasets are widely used in training and
retrieval pipelines.

1. Account at https://huggingface.co
2. **New → Dataset**, name it `texas-bond-data`
3. Upload the `data/` folder
4. Rename `HUGGINGFACE_CARD.md` → `README.md` in the repo root
   (**it must be named `README.md`** — the YAML frontmatter at the top is what drives the
   dataset viewer and the config splits; without it you get a plain file listing)
5. Licence is already declared in that frontmatter as `cc-by-4.0`

Git alternative:

```bash
git clone https://huggingface.co/datasets/<user>/texas-bond-data
cp -r data/ texas-bond-data/
cp HUGGINGFACE_CARD.md texas-bond-data/README.md
cd texas-bond-data && git add . && git commit -m "Initial dataset" && git push
```

---

## Regenerating the data — automated

A cron on 130.51.23.147 refreshes the whole package quarterly:

```
0 10 1 1,4,7,10 *   node /var/www/bondverify/scripts/quarterly_dataset_refresh.js
```

It runs on the 1st of Jan/Apr/Jul/Oct at 10:00 UTC — deliberately after the monthly
source imports (notaries 07:00, contractors 08:00 on the 1st), so a refresh always
reflects the newest state data. Each run regenerates all 8 CSVs, republishes them,
diffs row counts against the previous run, and emails a summary to contact219@gmail.com.

Run it by hand any time with `--dry-run` to preview, or without to publish.

### Permanent download URLs (always current)

The refresh publishes to a stable location, so these never go stale:

- Tarball: https://verify.quantumsurety.bond/datasets/texas-bond-data.tar.gz
- Manifest (row counts + totals + generation date): https://verify.quantumsurety.bond/datasets/manifest.json
- Individual CSVs: `https://verify.quantumsurety.bond/datasets/<filename>`

Point the aggregator listings' "source" links at these rather than at the API endpoints.

### The step that is NOT automated

**Re-uploading to data.world, Kaggle and Hugging Face.** Those need per-platform API
tokens which are not on the server, so the cron stops after publishing and emails a
reminder. The quarterly email is the prompt — grab the tarball and re-upload.

If you ever add tokens, Kaggle and Hugging Face are two CLI calls (both shown above) and
the cron could do them directly; data.world would need its API.

Stale data is the one thing that undermines the "live" claim. If a year passes with the
listings unrefreshed, either update them or drop the word "live" from the descriptions.

## After uploading

Add the three dataset URLs to `client/public/llms.txt` under the Open Dataset section, so
LLM crawlers can find the mirrors as well as the origin. That file already lists the hub
and the API endpoints.
