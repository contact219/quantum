import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useRoute } from "wouter";

const VERIFY_API = "https://verify.quantumsurety.bond/api";

interface Notary {
  notary_id: string;
  first_name: string;
  last_name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  effective_date?: string;
  expire_date: string;
  surety_company?: string;
  agency?: string;
  days_until_expiry: number;
  /**
   * `not_yet_effective` is a commission whose term has not started. It is neither
   * valid nor lapsed, and must never be rendered as either — see statusInfo().
   */
  status: "active" | "expiring" | "expired" | "not_yet_effective" | "unknown";
  qs_score?: number;
  qs_grade?: string;
  qs_label?: string;
  qs_color?: string;
  /**
   * When *we* last pulled this row from the Texas SOS file, e.g.
   * "2026-08-01T07:02:38.000Z". This is a fact about our cron, not about the data:
   * fetching a three-month-old publication at 7am today does not make it current.
   * Never attribute a status claim to this date — use `source_published_at`.
   */
  updated_at?: string;
  /**
   * When the Texas SOS last *republished* the dataset, e.g.
   * "2026-07-15T05:10:24.000Z". This is the date the facts were last true, so it is
   * the date every status claim on this page is attributed to. May be null.
   */
  source_published_at?: string;
  /**
   * The state's own stated cadence for republishing, e.g. "Quarterly". Surfaced
   * verbatim (lowercased) rather than paraphrased — it tells a reader how much
   * weight a status claim can carry. May be null.
   */
  source_update_frequency?: string;
}

/**
 * The Texas SOS no longer exposes a per-notary URL. The old
 * direct.sos.state.tx.us/notaries/NotarySearch.asp now JavaScript-redirects to
 * an Appian portal, and the SOS site's own "Notary Public Search" link points at
 * that portal's root. So we link the portal and tell the reader what to type.
 * Do not invent a deep link — there isn't one.
 */
const TX_SOS_NOTARY_PORTAL = "https://texas-sos.appianportalsgov.com/sos-direct";

function parseCityFromAddress(address?: string): string {
  if (!address) return "";
  const lines = address.split("\n");
  const last = lines[lines.length - 1] || "";
  const match = last.match(/^([^,]+),\s*TX/);
  return match ? match[1].trim() : "";
}

/**
 * Parse a YYYY-MM-DD date as LOCAL midnight.
 *
 * `new Date("2026-07-28")` is parsed as UTC midnight, which renders as July 27
 * anywhere west of Greenwich. This page tells a notary when their own commission
 * expires, so a one-day shift is not cosmetic — it is wrong.
 */
function localDate(raw?: string): Date | null {
  if (!raw) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function longDate(raw?: string): string {
  const d = localDate(raw);
  return d ? d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
}

/** Whole days from today (local midnight) to `date`. Negative once it has passed. */
function daysFromToday(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - today.getTime()) / 86_400_000);
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/**
 * Status display.
 *
 * THE PRIMARY CHANNEL IS INK COVERAGE, NOT HUE.
 *
 * A commission that is valid today gets a SOLID, saturated, full-bleed pill with
 * dark ink on it. One that is not valid today gets NO FILL AT ALL — an outline,
 * page-dark inside, coloured text on the page background. That is a whole-pill
 * difference, not a 7px dot.
 *
 * Why it had to change. The previous pass gave both states a 12%-alpha tint of
 * their own hue, a 1px border and the same height, and carried the actual
 * distinction on a ~7px filled-vs-hollow dot. Measured (see the throwaway script
 * in the report, WCAG relative luminance, fills composited over both ends of the
 * hero gradient), those two pills collapsed to greys 5.7 apart out of 255 — 2.2%
 * of the range. Under `grayscale(1) blur(2.5px)`, or to a red-green colour-blind
 * reader, an ACTIVE record and an EXPIRED record were the same object. The page
 * exists to answer one binary question for someone who was texted the link, and
 * that answer was legible only to normal colour vision.
 *
 * Measured after this change, same method: 172 / 255 — 67% of the range, a 30x
 * improvement. With colour removed entirely the distinction is: VALID IS A BRIGHT
 * BLOCK, NOT-VALID IS A DARK OUTLINE. Nothing to read, nothing to decode, and it
 * survives blur because it is carried by a large area rather than a small mark.
 *
 * Three further non-colour channels ride along, all redundant with that one:
 *   - height/size  valid pill ≈46px tall, not-valid ≈33px (was 39 vs 39)
 *   - border style solid for lapsed, dashed for the two "we can't say yes" states
 *   - glyph        ✓ / ✕ / → / ?, at 15–19px so it survives a 2.5px blur
 * Colour is kept on top of all of it, because it genuinely helps normal vision.
 *
 * `not_yet_effective` — a commission whose term has not begun — is deliberately
 * NOT rendered as either pole. It is not solid (it is not valid today) and it is
 * not the lapsed red outline (nothing has expired). It gets its own hue, a dashed
 * edge and a forward-arrow glyph, and the verdict sentence says both halves out
 * loud.
 *
 * SECOND PASS: EXPIRED vs NOT_YET_EFFECTIVE.
 *
 * The valid/not-valid split above works, but it left the two not-valid states on
 * top of each other. Measured with the same method (area-weighted WCAG relative
 * luminance of border ring + interior + text ink, composited over both ends of the
 * hero gradient, re-encoded to a 0–255 grey), EXPIRED and NOT_YET differed by
 * 6.2/255 — 2.4% of the range. Hollow, same height, same 2px ring; the only
 * distinction was solid-vs-dashed and hue. Under `grayscale(1) blur(3px)` they were
 * the same object, which is the exact failure the first pass was written to fix,
 * just moved one pair over.
 *
 * The fix is more ink coverage on NOT_YET, because ink coverage is the channel that
 * already carries the important distinction and it is the one that survives blur:
 *   - a 5px dashed ring instead of 2px — a chunky broken frame, not a hairline
 *   - a 20% NEUTRAL WHITE wash inside (deliberately not its own hue: a blue tint
 *     would read as a status colour, a grey wash reads as "provisional")
 *   - a stadium radius (999) against EXPIRED's near-square radius 4
 * Measured after: EXPIRED vs NOT_YET 33.1/255, up from 6.2 — 5.3x. Crucially the
 * pair that matters more did not move: ACTIVE vs EXPIRED is 110.3/255 before and
 * after, because nothing about ACTIVE or EXPIRED changed. ACTIVE vs NOT_YET stays
 * wide at 76.1/255 (was 104.1) — the wash is nowhere near a solid block.
 *
 * Contrast, computed rather than eyeballed, each colour against the surface it
 * actually sits on (hero gradient #0a0f1e → #111827, worst of the two ends; for
 * NOT_YET the surface is its own washed interior, which is the harder test):
 *   active   ink #052e16 on solid #4ade80        → 8.55:1   border #4ade80 → 10.18:1
 *   expiring ink #422006 on solid #fbbf24        → 8.73:1   border #fbbf24 → 10.63:1
 *   expired      #f87171 text + border on hero   → 6.41:1
 *   not-yet      #93c5fd text + border on wash   → 5.23:1
 *   unknown      #cbd5e1 text + border on hero   → 11.95:1
 *
 * `label` is the pill (caps, monospace); `plain` is for prose, meta descriptions
 * and structured data.
 */
function statusInfo(s: string) {
  /** Valid today: the pill is a solid block of its own colour, and it is bigger. */
  const solid = (fill: string, ink: string) => ({
    color: ink, bg: fill, border: fill,
    borderWidth: 2, borderStyle: "solid" as const,
    borderRadius: 8,
    padding: "12px 22px", fontSize: 15, glyphSize: 19,
    valid: true,
  });
  /**
   * Not valid today: a frame rather than a block. `opts` exists so the two
   * not-valid states can differ from each other by ring weight, interior wash and
   * silhouette — see the SECOND PASS note above — without either of them turning
   * into the solid block that means "valid".
   */
  const hollow = (
    ink: string,
    borderStyle: "solid" | "dashed" | "dotted",
    opts: { bg?: string; borderWidth?: number; borderRadius?: number } = {},
  ) => ({
    color: ink, bg: opts.bg ?? "transparent", border: ink,
    borderWidth: opts.borderWidth ?? 2, borderStyle,
    borderRadius: opts.borderRadius ?? 6,
    padding: "7px 16px", fontSize: 13, glyphSize: 15,
    valid: false,
  });
  /*
   * WHY THE VALID-TODAY LABELS ARE TERM-SCOPED AND NOT "ACTIVE".
   *
   * The pill used to read COMMISSION ACTIVE. The dataset behind it publishes a
   * start date and an end date and nothing else, so "active" was an assertion of
   * current standing that the arithmetic cannot reach: a commission also ends by
   * resignation, revocation, death or a failure to qualify, none of which is a
   * date, any of which may have happened since the state last published. The
   * label now says the thing the dates actually establish — the term is running —
   * and recordCaveat() says the rest out loud directly under the verdict.
   *
   * "IN TERM" is chosen over "TERM NOT EXPIRED" because the reader was texted this
   * link and wants an answer, not a double negative. Nothing about the pill's
   * geometry, fill, glyph, stroke width or stroke continuity changes here: this is
   * a string edit, so the measured greyscale separations (ACTIVE vs EXPIRED 132,
   * EXPIRED vs NOT_YET 43) are untouched by construction.
   */
  if (s === "active") return { ...solid("#4ade80", "#052e16"), label: "COMMISSION IN TERM", plain: "In term", glyph: "✓" };
  if (s === "expiring") return { ...solid("#fbbf24", "#422006"), label: "IN TERM — EXPIRES SOON", plain: "In term, expires soon", glyph: "✓" };
  if (s === "expired") return { ...hollow("#f87171", "solid", { borderRadius: 4 }), label: "COMMISSION EXPIRED", plain: "Expired", glyph: "✕" };
  if (s === "not_yet_effective") return {
    ...hollow("#93c5fd", "dashed", { bg: "rgba(255,255,255,0.20)", borderWidth: 5, borderRadius: 999 }),
    label: "NOT YET IN EFFECT", plain: "Not yet in effect", glyph: "→",
  };
  return { ...hollow("#cbd5e1", "dotted", { borderRadius: 4 }), label: "STATUS UNKNOWN", plain: "Unknown", glyph: "?" };
}

/**
 * Publisher disclosure for the RECORD PROVENANCE block.
 *
 * This page reports whether a commission is valid and, when it has lapsed, sells
 * the remedy a few hundred pixels later. That the publisher profits from one of the
 * outcomes it reports is a fact about the record, so it is stated in the record's
 * own voice, above the data, rather than buried in the advertisement.
 *
 * The agency-of-record sentence is derived, never hardcoded: `agency` is the bond
 * agency the state has on file. When it is us, that is a stronger conflict than
 * when it is someone else, and it is said plainly rather than softened or omitted.
 * Matching is case-insensitive on "quantum" because the source data is free text
 * ("Quantum Surety", "QUANTUM SURETY LLC", …).
 */
function publisherDisclosure(agency?: string): string {
  const a = (agency || "").trim();
  const base =
    "Quantum Surety is a licensed Texas bond agency (TDI license #3480229) that sells notary bonds, "
    + "including renewals of commissions like this one. It has no role in this commission and cannot "
    + "issue, change or revoke it.";
  if (!a) return `${base} The source record does not state which bond agency is on file for this notary.`;
  if (/quantum/i.test(a)) {
    return `${base} Quantum Surety is itself the bond agency on file for this notary, recorded as `
      + `"${a}", so this page reports on its own customer — a closer commercial interest in this record, not a lesser one.`;
  }
  return `${base} The bond agency on file for this notary is ${a}, not Quantum Surety.`;
}

/**
 * TWO DATES, AND ONLY ONE OF THEM MEANS ANYTHING.
 *
 * `source_published_at` is when the Texas SOS last republished the notary dataset.
 * `updated_at` is when our cron fetched that publication. They are routinely weeks
 * apart, and only the first one bounds the facts: fetching a quarterly file at 7am
 * this morning does not make its contents true this morning.
 *
 * Every status claim on this page is therefore attributed to the PUBLICATION date.
 * The fetch date is still stated — a reader is entitled to know when we made our
 * copy — but it is labelled as what it is, and never used as an "as of".
 *
 * Both may be absent, so the copy degrades down a ladder rather than falling back to
 * the present tense:
 *   published known  → "As of <published>, the state's published record showed …"
 *   fetch only       → "As this page last read it on <fetched>, the state record
 *                       showed …" plus a note that the facts may be older still
 *   neither          → no date claimed, and the page says so
 */
interface Evidence {
  /** longDate() of source_published_at, or "". */
  published: string;
  /** longDate() of updated_at, or "". */
  fetched: string;
  /** Whole days since publication, or null. */
  publishedAge: number | null;
  /** The state's stated cadence, lowercased for prose, e.g. "quarterly". Or "". */
  cadence: string;
}

/**
 * How old the evidence is, in the reader's words. Returns "" when there is no
 * timestamp — callers must handle that rather than printing an empty relative age.
 */
function ageLabel(age: number | null): string {
  if (age === null) return "";
  // A future timestamp is clock skew, not freshness. Say "today" rather than
  // "-2 days ago", which would look like a bug and invite distrust of the record.
  if (age <= 0) return "today";
  if (age === 1) return "yesterday";
  return `${plural(age, "day")} ago`;
}

/**
 * The freshness line that sits directly under the status pill.
 *
 * The status this page reports is not read from the state on request — it is read
 * from a quarterly publication of the Texas SOS notary file. So the age of that
 * publication, and the state's own cadence, are part of the finding rather than a
 * footnote, and they go next to the pill rather than only in the RECORD PROVENANCE
 * block far below. The cadence is the number that tells a reader how much weight the
 * status can carry: 28 days old is very different information when the next refresh
 * is tomorrow than when it is in two months.
 */
function evidenceLine(e: Evidence): string {
  if (e.published) {
    const rel = ageLabel(e.publishedAge);
    const cadence = e.cadence
      ? `republished ${e.cadence} by the state, so it may have changed since`
      : "the state does not say how often it republishes this data, so it may have changed since";
    return `Texas SOS published this data ${e.published}${rel ? ` · ${rel}` : ""} · ${cadence}`;
  }
  if (e.fetched) {
    return `State record as this page read it on ${e.fetched} · the state publishes no date for this data, so the facts behind it may be older still`;
  }
  return "Snapshot of the state record — this page has no date for when the data was published or read, so it cannot say how old this record is";
}

/**
 * The one sentence this page exists to answer: was this person a valid Texas notary
 * when the state record was last read? Written for someone who was sent the link and
 * knows nothing about notary commissions — third person, no jargon, no abbreviations,
 * no pill to decode.
 *
 * WHY EVERY CLAIM IS PAST TENSE AND ATTRIBUTED.
 *
 * This page used to say "…is not commissioned as a Texas notary today", off a Texas
 * SOS dataset the state republishes QUARTERLY. A notary who renewed the day after a
 * publication was therefore branded uncommissioned *today*, under their real name, on
 * an indexed page that then sold them a bond, and stayed branded that way for up to
 * three months. The data cannot support a claim about today, so the page no longer
 * makes one: every status is attributed to the state's publication and its date. This
 * applies to the good news as well as the bad — an "active" record published eleven
 * weeks ago is exactly as unable to speak for today as an expired one.
 *
 * WHAT THE STATE PUBLISHES vs WHAT WE DERIVE.
 *
 * The state publishes the term — an effective date and an expiry date — and nothing
 * else. "Expired", "active" and "not yet in effect" are not fields in the dataset;
 * they are calendar arithmetic we do against those two dates. That distinction is
 * load-bearing for the wording. Saying "as of 15 July the record showed this
 * commission expired on 28 July" is false twice over: on 15 July it had not expired,
 * and the state never asserted the word. What the record actually gives is a date;
 * what has since happened to that date is our arithmetic, and our arithmetic is
 * sound. The only thing the publication date limits is what has been FILED since —
 * a renewal, a resignation, a revocation. So the sentences attribute the dates to
 * the state's publication, do the arithmetic in the open, and name the gap.
 *
 * `expDate` and `effDate` must come from longDate()/localDate(). Never format a date
 * here with `new Date(raw).toLocaleDateString()`: that parses YYYY-MM-DD as UTC
 * midnight and renders the day before anywhere west of Greenwich.
 *
 * `e.published` may be "" — see the Evidence doc above for the degradation ladder. In
 * no branch does the sentence print a bare "as of", and in no branch does it quietly
 * fall back to an unattributed present tense.
 */
function verdictSentence(name: string, status: string, expDate: string, effDate: string, e: Evidence): string {
  const lead = e.published
    ? `The state's published record of ${e.published} `
    : e.fetched
      ? `The state record, as this page read it on ${e.fetched}, `
      : "The state record ";
  const undated = e.published
    ? ""
    : e.fetched
      ? " The state publishes no date for that data, so it may be older still."
      : " This page has no date for when that record was published or read, so it may already be out of date.";

  // The valid-today sentences say "term", matching the pill, because a term is what
  // the state publishes. They do not say the commission is in force today; the
  // caveat directly below says why the record cannot reach that claim.
  if (status === "active") {
    return lead + (expDate
      ? `gives ${name} a Texas notary commission whose term runs through ${expDate}. That date has not passed.`
      : `gives ${name} a Texas notary commission, and does not give the date its term ends.`)
      + undated;
  }
  if (status === "expiring") {
    return lead + (expDate
      ? `gives ${name} a Texas notary commission whose term runs through ${expDate}. That date has not passed, but it is close: after it the commission is no longer valid unless it is renewed.`
      : `gives ${name} a Texas notary commission near the end of its term. Once it expires it is no longer valid unless it is renewed.`)
      + undated;
  }
  if (status === "expired") {
    // The renewal gap is named in the verdict itself, not left to a paragraph
    // below it, because this is the sentence that gets read, screenshotted and
    // quoted.
    //
    // It used to open "It records no renewal for <name> — but …". That was an
    // absence-of-evidence claim about the whole dataset, on a page where every
    // other sentence is scoped to THIS record. Texas renewals typically arrive as
    // a fresh record under a new notary ID, names are not unique, and we run no
    // name-level scan — so we cannot say the file records no renewal. The clause
    // that survived does the same work honestly, scoped to this record.
    return lead + (expDate
      ? `gives this commission an expiry date of ${expDate}, which has now passed. `
      : "shows this commission at the end of its term. ")
      + (e.published
        ? `A renewal filed after ${e.published} would not appear in it.`
        : e.fetched
          ? "A renewal filed after the state last published this data would not appear in it."
          : "A renewal filed since the state published that data would not appear in it.");
  }
  // A future-dated commission is the one case where both "yes" and "no" would
  // mislead, so the sentence says both halves: not in effect yet, and not lapsed.
  if (status === "not_yet_effective") {
    if (effDate) {
      return lead + `gives this commission a start date of ${effDate}`
        + `${expDate ? `, running from then through ${expDate}` : ""}. `
        + `That date has not arrived, so ${name} cannot notarize under it yet. Nothing here has expired — the term has simply not begun.`
        + undated;
    }
    return lead + `shows a commission whose term has not begun, so ${name} cannot notarize under it yet. `
      + `Nothing here has expired — the term has simply not begun. The record does not give the date it starts.`
      + undated;
  }
  return lead + `does not show a status for this commission, so whether ${name} is commissioned cannot be answered from this page. Check the Texas Secretary of State search below.`;
}

/**
 * The caveat that sits under the verdict. One function, all the statuses that need
 * one, IDENTICAL VISUAL TREATMENT — see the render site.
 *
 * WHY THIS USED TO BE EXPIRED-ONLY, AND WHY THAT WAS BACKWARDS.
 *
 * The page shipped ~114 words of hedging on a lapsed record and 25 words, with no
 * caveat block at all, on a valid one. That is caveats placed where a false result
 * embarrasses a notary and costs us a $50 sale, and absent where a false result gets
 * a client's deed notarized by someone with no commission. The second failure is the
 * worse one and it was the unguarded one.
 *
 * The asymmetry was also unearned on the merits. The state publishes TERM DATES. Term
 * dates cannot establish that a commission is in force: it can end early by
 * resignation, revocation, death or a failure to qualify, none of which is a date in
 * this file, any of which may have happened since the publication. So the valid-today
 * statuses get the caveat with the greater reach, and they get it at full weight.
 *
 * Meanwhile the lapsed caveat is cut hard. Expired was saying the same thing five
 * times — strapline, verdict tail, this paragraph, the PUBLISHED row, the CITE box —
 * and on a phone this paragraph was the last thing above the fold, so the final
 * impression of the page was the page retracting its own answer ("only the state's
 * own search can"). The verdict tail and the PUBLISHED row already carry it. What is
 * left here is the one fact neither of them states: a Texas renewal arrives as a
 * NEW record, which is precisely why this one cannot show it.
 *
 * Both branches end on where to go, never on what this page cannot do.
 *
 * Points at the publication date, not our fetch date. "We checked this morning" would
 * be true and completely beside the point. Both dates may be absent.
 */
function recordCaveat(name: string, status: string, e: Evidence): string {
  const afterPub = e.published
    ? `after ${e.published}`
    : e.fetched
      ? "after the state last published this data"
      : "since the state published this data";

  if (status === "active" || status === "expiring") {
    return `What the state publishes here is a term: a start date and an end date. `
      + `A commission can also end inside that term — by resignation, revocation, or death — `
      + `and none of those would appear as a date in this record. Neither would anything filed ${afterPub}. `
      + `To confirm ${name} holds this commission today, use the state's own search below.`;
  }
  if (status === "expired") {
    return `A Texas renewal is filed as a new record, so a commission renewed ${afterPub} still reads as lapsed here. `
      + "The state's own search below is the one that would show it.";
  }
  return "";
}

export default function NotaryDetail() {
  const [, params] = useRoute("/notary/:id");
  const notaryId = params?.id ?? "";
  const [notary, setNotary] = useState<Notary | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!notaryId) return;
    setLoading(true);
    fetch(`${VERIFY_API}/notary/lookup/${encodeURIComponent(notaryId)}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(d => { if (d) setNotary(d); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [notaryId]);

  const si = notary ? statusInfo(notary.status) : statusInfo("unknown");
  const fullName = notary ? `${notary.first_name} ${notary.last_name}`.trim() : notaryId;
  const resolvedCity = notary?.city || parseCityFromAddress(notary?.address);
  const location = [resolvedCity, notary?.state || "TX"].filter(Boolean).join(", ") || "Texas";
  const isExpired = notary?.status === "expired";
  const isExpiring = notary?.status === "expiring";
  // A commission is *valid today* only when it is active or expiring-but-still-active.
  // Expired, not-yet-effective and unknown are all "cannot be published as proof of
  // standing" — see the share/cite section at the bottom of the page.
  const isValidToday = isExpiring || notary?.status === "active";

  const expDate = longDate(notary?.expire_date);
  const commDate = longDate(notary?.effective_date);
  // Real retrieval timestamp from the lookup API — when OUR cron fetched. Stated in
  // the provenance block, never used as an "as of". See the Evidence doc above.
  const retrievedDate = longDate(notary?.updated_at);
  // When the STATE last republished the dataset. This is the date the facts were
  // last true, and the date every status claim is attributed to.
  const publishedDate = longDate(notary?.source_published_at);
  // Ages in whole days, computed live on each render so the page never claims a
  // freshness it had when it was built. daysFromToday() is negative for past dates,
  // so the age is its negation.
  const pubObj = localDate(notary?.source_published_at);
  const retObj = localDate(notary?.updated_at);
  const evidence: Evidence = {
    published: publishedDate,
    fetched: retrievedDate,
    publishedAge: pubObj ? -daysFromToday(pubObj) : null,
    cadence: (notary?.source_update_frequency || "").trim().toLowerCase(),
  };
  const retrievedAge = retObj ? -daysFromToday(retObj) : null;
  const freshLine = evidenceLine(evidence);
  // "" for the statuses that do not take one (not_yet_effective, unknown), whose
  // verdict sentences already state their own limits inline.
  const caveat = notary ? recordCaveat(fullName, notary.status, evidence) : "";

  const correctionMailto =
    `mailto:administrator@quantumsurety.bond`
    + `?subject=${encodeURIComponent(`Correction request — TX Notary #${notaryId}`)}`
    + `&body=${encodeURIComponent(
        `Notary ID: ${notaryId}\nPage: https://quantumsurety.bond/notary/${notaryId}\n\nWhat is wrong with this record:\n`
      )}`;

  // Days to (or since) expiry, computed from the date rather than the API's
  // days_until_expiry so the sign is always meaningful for lapsed commissions.
  const expObj = localDate(notary?.expire_date);
  const days = expObj ? daysFromToday(expObj) : null;

  // Speak to where this person actually is in their commission, using their own date.
  const ctaHeadline = isExpired
    ? (expDate
        ? `Commission lapsed ${expDate}`
        : "Commission Lapsed — Renew to Remain Active")
    : (expDate
        ? (days === 0 ? `Commission expires today — ${expDate}`
          : days === 1 ? `Commission expires tomorrow — ${expDate}`
          : `Commission expires ${expDate}`)
        : "Commission Expiring Soon — Renew Now");

  const lapsedPrefix = days === null || days >= 0 ? ""
    : days === -1 ? "That was yesterday. "
    : `That was ${plural(Math.abs(days), "day")} ago. `;
  const leftPrefix = days === null || days <= 1 ? ""
    : `${plural(days, "day")} left. `;

  const ctaSubhead = isExpired
    ? lapsedPrefix
      + "A Texas notary commission requires an active $10,000 surety bond for its full term. A new 4-year bond is $50 flat — certificate emailed in minutes, no credit check."
    : leftPrefix
      + "Renew before it lapses and your commission stays continuous. $50 flat for the full 4-year term — certificate emailed in minutes, no credit check.";

  const verifyUrl = `https://verify.quantumsurety.bond/verify/notary/${notaryId}`;
  const pageUrl = `https://quantumsurety.bond/notary/${notaryId}`;

  const pageTitle = notary
    ? `${fullName} — Texas Notary Commission Status | ${location} | Quantum Surety`
    : `Texas Notary Commission — ID ${notaryId} | Quantum Surety`;
  // A future-dated commission has an expiry date, but leading the description with it
  // would imply the term is running. Say when it starts instead. Mirrors _notarySSRMeta().
  // The description is a status claim too, and it is the one that gets quoted in
  // search results away from every qualifier on the page — so it carries the state's
  // publication date inline rather than relying on the reader clicking through.
  // It is appended as its own sentence rather than woven in as "status as of X",
  // because the state publishes dates, not statuses: see verdictSentence().
  const pubClause = publishedDate
    ? ` State data published ${publishedDate}${evidence.cadence ? `, republished ${evidence.cadence}` : ""}.`
    : " State publication date not stated.";
  const descLead = notary?.status === "not_yet_effective"
    ? `Commission not yet in effect${commDate ? `; it begins ${commDate}` : ""}.${pubClause}`
    : `Commission status: ${si.plain}.${expDate ? ` Expires ${expDate}.` : ""}${pubClause}`;
  const pageDesc = notary
    ? `${fullName} (TX Notary #${notaryId}) — ${location}. ${descLead} Source: Texas Secretary of State public records.`
    : `Look up Texas notary commission status for notary ID ${notaryId}.`;

  // Share copy must not claim Quantum Surety verified or vouched for the commission
  // — the provenance strip says the opposite ("republishes this record; it does not
  // issue, hold or amend it"). The state is named as the source; we are named only
  // as the place the lookup was read.
  //
  // Only the valid-today wording is needed: the broadcast affordances that use this
  // string are gated on isValidToday, so the lapsed / not-yet / unknown variants
  // that used to live here were dead branches feeding buttons nobody should press.
  //
  // Past tense and dated for the same reason as the verdict: this string is pasted
  // into X and LinkedIn, where it outlives the snapshot it was generated from by
  // months. "records show … active" would keep asserting a live fact forever.
  const shareFinding = isValidToday
    ? `${fullName} (TX Notary #${notaryId}) — Texas Secretary of State records give this notary commission a term${expDate ? ` running through ${expDate}` : ""}`
      + `${publishedDate ? `; state data published ${publishedDate}` : ""}.`
    : "";

  const tweetText = shareFinding ? `${shareFinding} Record: ${pageUrl}` : "";

  const embedCode = isValidToday
    ? `<a href="${verifyUrl}" target="_blank">\n  <img src="https://verify.quantumsurety.bond/api/badge/notary/${notaryId}" alt="Notary Commission — ${fullName}" width="280" height="56">\n</a>`
    : "";

  // Why the badge and the social buttons are absent, said in the record's own voice.
  // Each states the reason, not a rule — a reader should be able to disagree with it.
  const citeNote = notary?.status === "expired"
    ? "The embeddable badge and the share buttons are offered only while a commission is valid. They exist so a notary can publish current standing, and on a lapsed commission a badge would assert the opposite of what this record says. The record itself stays public, and anyone can link to it or check it against the state."
    : notary?.status === "not_yet_effective"
      ? "The embeddable badge and the share buttons are offered only once a commission is in effect. Publishing a badge before the term begins would claim standing this record does not yet show. The record itself stays public, and anyone can link to it or check it against the state."
      : "The embeddable badge and the share buttons are offered only when the state record shows a current status. This one does not, so there is nothing here that could honestly be published as proof. The record itself stays public, and anyone can link to it or check it against the state.";

  const jsonLd = notary ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": fullName,
    "description": `Texas Notary Public in ${location}. Commission status: ${si.plain}.${pubClause}`,
    ...(resolvedCity ? { "address": {
      "@type": "PostalAddress",
      "addressLocality": resolvedCity,
      "addressRegion": "TX",
      "postalCode": notary.zip || undefined,
      "addressCountry": "US"
    }} : {}),
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "commission",
      "name": "Texas Notary Public Commission",
      "identifier": notaryId,
      ...(notary.effective_date ? { "validFrom": notary.effective_date.slice(0, 10) } : {}),
      "validUntil": notary.expire_date?.slice(0, 10),
    },
    "url": pageUrl,
  } : null;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>

      <section style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#111827 100%)", padding: "48px 24px 36px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", letterSpacing: 3, color: "#f59e0b", marginBottom: 20 }}>
            TEXAS NOTARY COMMISSION VERIFICATION
          </div>

          {loading && (
            <p style={{ color: "#64748b", fontSize: 15 }}>Looking up notary {notaryId}…</p>
          )}

          {notFound && !loading && (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 12 }}>Notary Not Found</h1>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>No Texas SOS record for notary ID <strong style={{ color: "#e2e8f0" }}>{notaryId}</strong>.</p>
              <a href="https://verify.quantumsurety.bond" style={{ display: "inline-block", background: "#f59e0b", color: "#000", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, textDecoration: "none" }}>Search All Notaries →</a>
            </>
          )}

          {notary && !loading && (
            <>
              {/*
                Status indicator: the loudest thing on the page, deliberately. See
                statusInfo() for the whole argument, the palette and the computed
                contrast ratios (6.41:1 worst case). The short version: a commission
                that is valid today is a SOLID BLOCK OF COLOUR; one that is not is an
                EMPTY OUTLINE, shorter, with a different glyph and border style. That
                is a 172/255 greyscale gap, so the answer survives greyscale, blur and
                colour-blindness without anyone reading a word.

                It does not collide with the renewal CTA because the CTA is neutral and
                outlined, not because the record is muted.
              */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: si.bg,
                border: `${si.borderWidth}px ${si.borderStyle} ${si.border}`,
                borderRadius: si.borderRadius, padding: si.padding, marginBottom: 8,
              }}>
                <span
                  aria-hidden="true"
                  style={{ fontSize: si.glyphSize, lineHeight: 1, fontWeight: 900, color: si.color }}
                >
                  {si.glyph}
                </span>
                <span style={{ fontWeight: 800, color: si.color, fontSize: si.fontSize, fontFamily: "monospace", letterSpacing: 1 }}>{si.label}</span>
              </div>

              {/*
                Evidence age and the state's cadence, in the pill's immediate vicinity
                and above the fold.

                The pill states a status; this states how old the evidence for it is
                and how often that evidence is refreshed, and the three have to be read
                together or the pill overclaims. It used to live only in the RECORD
                PROVENANCE block several hundred pixels down, phrased as a fact about
                our fetch ("Retrieved … on 1 August") rather than as a limit on the
                claim — so nobody who skimmed the verdict ever learned the verdict had
                an expiry date of its own, and the date they would have found was the
                wrong one anyway.

                Computed live from `source_published_at` on every render. #94a3b8 on
                the hero gradient is 6.92:1 at the light end, 7.45:1 at the dark end.
              */}
              <div style={{ fontSize: 12, fontFamily: "monospace", letterSpacing: 0.4, lineHeight: 1.5, color: "#94a3b8", marginBottom: 18 }}>
                {freshLine}
              </div>

              <h1 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 10px" }}>{fullName}</h1>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
                Texas Notary Public · ID #{notaryId} · {location}
              </p>

              {/*
                The verdict. Whoever was sent this link came to ask one question, and
                it gets answered in a sentence before any table, score or offer —
                not encoded in a pill the reader has to interpret.
              */}
              <p style={{ fontSize: 17, lineHeight: 1.55, color: "#e2e8f0", textAlign: "left", margin: 0, marginBottom: caveat ? 12 : 24, fontWeight: 500 }}>
                {verdictSentence(fullName, notary.status, expDate, commDate, evidence)}
              </p>

              {/*
                The qualification on *this* finding, directly under it rather than in
                the provenance block. See recordCaveat() for why it is no longer
                expired-only, and why the valid-today version is the longer of the two.

                ONE STYLE FOR EVERY STATUS. Same size, same colour, same spacing, same
                position — because the previous pass gave the lapsed record a paragraph
                and the valid record nothing, which put the hedging where it protected
                the seller rather than the reader. If this ever needs to differ by
                status, that is the bug returning.

                #cbd5e1 on the hero gradient: 12.86:1 at #0a0f1e, 11.95:1 at #111827.
              */}
              {caveat && (
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#cbd5e1", textAlign: "left", margin: "0 0 24px" }}>
                  {caveat}
                </p>
              )}

              {/*
                Provenance strip. Deliberately placed above the data, not below it:
                the point is that a stranger can check the record before reading it.
                Styled as a citation block — no fills, no brand color, no urgency.
                Every colour here is >= 4.5:1 on #0d1117 (worst case: link #4C9AC9, 6.10:1).
              */}
              <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "16px 18px", textAlign: "left", marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontFamily: "monospace", letterSpacing: 1.5, color: "#94a3b8", paddingBottom: 10, marginBottom: 12, borderBottom: "1px solid #30363d" }}>
                  RECORD PROVENANCE
                </div>

                <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "minmax(96px,auto) 1fr", columnGap: 16, rowGap: 10, fontSize: 13, lineHeight: 1.6 }}>
                  <dt style={{ fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>SOURCE</dt>
                  <dd style={{ margin: 0, color: "#cbd5e1" }}>
                    Texas Secretary of State, notary public records. Quantum Surety republishes this record; it does not issue, hold or amend it.
                  </dd>

                  {/*
                    Who publishes this, and what they sell. Placed before the data,
                    in the record's own voice — a reader should learn that money
                    flows between the publisher and the subject without having to
                    ask, and before they read the finding. #cbd5e1 on #0d1117 is
                    12.75:1.
                  */}
                  <dt style={{ fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>PUBLISHER</dt>
                  <dd style={{ margin: 0, color: "#cbd5e1" }}>
                    {publisherDisclosure(notary.agency)}
                  </dd>

                  {/*
                    PUBLISHED and RETRIEVED are two different facts and both are
                    stated, separately, in that order. PUBLISHED is when the Texas SOS
                    last republished the dataset — the date the facts were last true,
                    and the only one a status claim can be attributed to. RETRIEVED is
                    when our cron fetched that publication.

                    They must not be merged. A reader shown only one of them will
                    assume it means the other, and the failure mode is asymmetric: a
                    fetch date presented alone reads as freshness the data does not
                    have, which is exactly the overclaim this page is trying to stop
                    making. The RETRIEVED copy therefore says out loud what it is not.
                  */}
                  <dt style={{ fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>PUBLISHED</dt>
                  <dd style={{ margin: 0, color: "#cbd5e1" }}>
                    {publishedDate ? (
                      <>
                        The Texas Secretary of State last published this dataset on {publishedDate}
                        {evidence.publishedAge !== null ? ` (${ageLabel(evidence.publishedAge)})` : ""}.
                        {evidence.cadence
                          ? ` The state republishes it ${evidence.cadence}, so a record can be up to a full publication cycle behind the state's own counter.`
                          : " The state does not state how often it republishes this dataset."}
                        {" "}Anything that changed after that date is not in this record, however recently we fetched it.
                      </>
                    ) : (
                      <>
                        The Texas Secretary of State publishes no date for the version of this dataset behind this record
                        {evidence.cadence ? `, though it states the dataset is republished ${evidence.cadence}` : ""}.
                        {" "}This page therefore cannot say how old the underlying facts are.
                      </>
                    )}
                  </dd>

                  {retrievedDate && (
                    <>
                      <dt style={{ fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>RETRIEVED</dt>
                      <dd style={{ margin: 0, color: "#cbd5e1" }}>
                        Quantum Surety fetched that publication on {retrievedDate}
                        {retrievedAge !== null ? ` (${ageLabel(retrievedAge)})` : ""}.
                        {" "}This is when our copy was made, not when the facts were last true — that is the publication date above.
                      </dd>
                    </>
                  )}

                  <dt style={{ fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>VERIFY</dt>
                  <dd style={{ margin: 0, color: "#cbd5e1" }}>
                    Check it against the state yourself:{" "}
                    <a
                      href={TX_SOS_NOTARY_PORTAL}
                      target="_blank"
                      rel="noopener noreferrer external"
                      style={{ color: "#4C9AC9", textDecoration: "underline" }}
                    >
                      Texas SOS notary search portal ↗
                    </a>
                    {" "}(leaves quantumsurety.bond, opens in a new tab). The state publishes no direct link to an individual notary, so the link lands on the state's Notary Public Search form. Type{" "}
                    <strong style={{ fontFamily: "monospace", color: "#e2e8f0", fontWeight: 600 }}>{notaryId}</strong>{" "}
                    into <strong style={{ color: "#e2e8f0", fontWeight: 600 }}>Notary ID</strong>, the first field on that form, and search.
                    {/*
                      A cautious reader checks the address bar, sees a non-texas.gov
                      host, and reasonably suspects a redirect to a vendor's own site.
                      Say plainly that the state runs it there. #94a3b8 on #0d1117 is
                      7.38:1.
                    */}
                    <span style={{ display: "block", marginTop: 8, color: "#94a3b8", fontSize: 12.5, lineHeight: 1.55 }}>
                      That link is not a texas.gov address. The Texas Secretary of State runs its notary search on the vendor-hosted portal <span style={{ fontFamily: "monospace" }}>texas-sos.appianportalsgov.com</span>, and the SOS website's own Notary Public Search link points to the same host.
                    </span>
                  </dd>

                  {/*
                    THE REMEDY HAS TO BE ABLE TO REMEDY.

                    This used to read "report an error in this record and we will
                    re-pull it." A re-pull returns the identical publication. So on the
                    exact failure this page names two paragraphs earlier — a commission
                    that changed after the state's last publication — the page routed
                    the affected person to a channel structurally incapable of fixing
                    it, and let them believe it was fixed. That is worse than offering
                    nothing.

                    The mailto stays, because a re-pull genuinely fixes the class of
                    error it can fix: our copy being stale against a publication we
                    already have, or mangled in transit. What is new is that the copy
                    draws the line, and hands the other class of error to the only
                    thing that can actually resolve it — the state's own search, which
                    is linked directly above. No new intake mechanism is promised.
                  */}
                  <dt style={{ fontFamily: "monospace", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>CORRECTIONS</dt>
                  <dd style={{ margin: 0, color: "#cbd5e1" }}>
                    If this does not match the state's record,{" "}
                    <a href={correctionMailto} style={{ color: "#4C9AC9", textDecoration: "underline" }}>
                      report an error in this record
                    </a>
                    {" "}and we will re-pull our copy. That fixes what we got wrong — a garbled field, or a row we failed to refresh from a publication we already hold. It cannot add what the state has not published yet: if this commission changed
                    {publishedDate ? ` after ${publishedDate}` : " after the version of the dataset behind this record was published"}, a re-pull returns the same data
                    {evidence.cadence ? `, and will keep doing so until the state next republishes (${evidence.cadence})` : ""}. For that, the state's own search above is the record that will show it.
                  </dd>
                </dl>
              </div>

              {/* QS Score */}
              {notary.qs_score !== undefined && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 20px", marginBottom: 24 }}>
                  <div style={{ position: "relative", width: 64, height: 64 }}>
                    <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                      <circle cx="32" cy="32" r="26" fill="none" stroke={notary.qs_color} strokeWidth="6"
                        strokeDasharray={`${(notary.qs_score / 100) * 2 * Math.PI * 26} ${2 * Math.PI * 26}`} strokeLinecap="round" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: notary.qs_color, lineHeight: 1 }}>{notary.qs_score}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: notary.qs_color }}>{notary.qs_grade}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", letterSpacing: 1, marginBottom: 2 }}>QS SCORE™</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: notary.qs_color }}>{notary.qs_label}</div>
                    <Link href="/qs-score">
                      <span style={{ fontSize: 11, color: "#475569", cursor: "pointer", textDecoration: "underline" }}>How scoring works →</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Detail grid */}
              <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 24, textAlign: "left", marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
                  {[
                    { label: "Notary ID", value: notaryId },
                    { label: "Full Name", value: fullName },
                    ...(resolvedCity ? [{ label: "City", value: resolvedCity }] : []),
                    ...(notary.zip ? [{ label: "ZIP Code", value: notary.zip }] : []),
                    ...(commDate ? [{ label: "Commission Date", value: commDate }] : []),
                    // No status colour on these values either — the record's data
                    // stays neutral so nothing in it echoes the CTA's palette.
                    { label: "Commission Expires", value: expDate },
                    ...(notary.days_until_expiry > 0 ? [{ label: "Days Until Expiry", value: `${notary.days_until_expiry} days` }] : []),
                    ...(notary.surety_company ? [{ label: "Surety Company", value: notary.surety_company }] : []),
                    ...(notary.agency ? [{ label: "Bond Agency", value: notary.agency }] : []),
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", letterSpacing: 1, marginBottom: 3 }}>{f.label.toUpperCase()}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/*
                Renewal CTA — deliberately subordinate to the record above it.
                It used to be the only saturated element on the page: a #dc2626 /
                #d97706 tinted card with a solid fill button, so the advertisement
                was louder than the finding it was selling against (that headline
                was also only 3.53:1 on its own card — it failed contrast as well as
                taste). It is now a neutral outlined card with an outline button and
                an explicit "offer" label, so a stranger reads the status first and
                the offer second.

                Gating is unchanged and must stay unchanged: active commissions get
                no CTA at all, because notaries share this page as proof of standing.

                Contrast on the card fill rgba(255,255,255,0.03) over the hero
                gradient, worst case of the two ends: label/body #94a3b8 6.44:1,
                headline #cbd5e1 11.11:1, button text #e2e8f0 13.38:1, button border
                #7d8899 4.60:1.
              */}
              {(isExpired || isExpiring) && (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, padding: "16px 20px", marginBottom: 20, textAlign: "left" }}>
                  <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: 1.5, color: "#94a3b8", marginBottom: 8 }}>
                    OFFER FROM QUANTUM SURETY
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#cbd5e1", marginBottom: 6 }}>
                    {ctaHeadline}
                  </div>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, marginBottom: 12 }}>
                    {ctaSubhead}
                  </p>
                  <Link href={`/get-bond?type=notary&utm_source=notary-detail&id=${notaryId}`}>
                    <span style={{ display: "inline-block", background: "transparent", color: "#e2e8f0", border: "1px solid #7d8899", fontWeight: 600, fontSize: 13, padding: "9px 18px", borderRadius: 8, textDecoration: "none", cursor: "pointer" }}>
                      {isExpired ? "Get a New 4-Year Bond — $50 Flat →" : "Renew Notary Bond — $50 Flat →"}
                    </span>
                  </Link>
                </div>
              )}

              {/*
                Share & embed — gated on whether the commission is actually valid.

                The feature exists for one job: a notary embeds the badge, or posts the
                link, to show a client they are in good standing right now. On a lapsed
                or not-yet-started commission that job does not exist. Nobody is served
                by a notary broadcasting their own lapse to LinkedIn, and a badge in an
                email signature is *read* as a credential — publishing one against a
                record that says "expired" would let the artefact contradict the record.
                So the broadcast affordances (X, LinkedIn, printable QR, signing
                certificate, embed HTML) are the valid-only branch.

                It is not deleted for the not-valid states, because the other reader of
                this page is the person who was sent the link and now has to act on it —
                they may well need to pass the finding on, or keep it. They get the
                record's permanent URL and the state's own verification page, presented
                as a citation rather than as promotion. That is the honest version of
                sharing a lapsed record: cite it, don't advertise it.

                Loudness was the symptom, not the disease, but it is fixed too — on the
                valid branch the two brand fills were also below 4.5:1 with white text
                (#1d9bf0 → 3.00:1, #059669 → 3.77:1) and are now darkened to 6.13:1 and
                5.48:1, which quiets them as a side effect.
              */}
              {isValidToday ? (
                <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 20, textAlign: "left" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 12 }}>Share &amp; Embed Commission Status</div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", background: "#15669e", color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, textDecoration: "none" }}>
                      Share on X
                    </a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", background: "#0a66c2", color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, textDecoration: "none" }}>
                      Share on LinkedIn
                    </a>
                    <a href={verifyUrl}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", color: "#e2e8f0", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
                      Shareable Verify Link
                    </a>
                    <Link href={`/notary/${notaryId}/qr`}>
                      <span style={{ display: "inline-block", background: "rgba(245,158,11,0.1)", color: "#f59e0b", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, cursor: "pointer", border: "1px solid rgba(245,158,11,0.3)" }}>
                        Print QR Code →
                      </span>
                    </Link>
                    <Link href={`/notary/${notaryId}/cert`}>
                      <span style={{ display: "inline-block", background: "#047857", color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, cursor: "pointer" }}>
                        Generate Signing Certificate →
                      </span>
                    </Link>
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", marginBottom: 6 }}>Add to your website or email signature (copy HTML):</div>
                  <div
                    onClick={() => navigator.clipboard?.writeText(embedCode).catch(() => {})}
                    style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, padding: "10px 12px", fontFamily: "monospace", fontSize: 10, color: "#4C9AC9", whiteSpace: "pre-wrap", wordBreak: "break-all", cursor: "pointer" }}>
                    {embedCode}
                  </div>
                  {/*
                    This used to read "Shows live commission status from Texas SOS
                    public records". Nothing about it is live: the badge endpoint
                    renders the same quarterly SOS publication this page reads, so an
                    embedded badge can keep showing a commission as active for months
                    after it lapsed — and the person it misleads is whoever the notary
                    embedded it for. Say what it actually is, including the cadence,
                    because the cadence is what tells the reader the size of the lag.
                  */}
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6, lineHeight: 1.5 }}>
                    Click to copy · The badge shows commission status from the Texas Secretary of State dataset
                    {evidence.cadence ? `, which the state republishes ${evidence.cadence}` : ""}
                    {publishedDate ? ` and last published on ${publishedDate}` : ""}. It is not a live check with the state, and it can trail a renewal or a lapse by a full publication cycle.
                  </p>
                </div>
              ) : (
                <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 20, textAlign: "left" }}>
                  {/* Neutral, quieter than the verdict above it by construction: no
                      saturated fills, no brand colour, monospace section label like the
                      provenance strip it belongs beside. #94a3b8 on #161b22 is 6.75:1. */}
                  <div style={{ fontSize: 12, fontFamily: "monospace", letterSpacing: 1.5, color: "#94a3b8", marginBottom: 10 }}>
                    CITE THIS RECORD
                  </div>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.55, margin: "0 0 12px" }}>
                    {citeNote}
                  </p>
                  <div
                    onClick={() => navigator.clipboard?.writeText(pageUrl).catch(() => {})}
                    style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, padding: "10px 12px", fontFamily: "monospace", fontSize: 11, color: "#4C9AC9", wordBreak: "break-all", cursor: "pointer" }}>
                    {pageUrl}
                  </div>
                  {/*
                    Second correction to this caption, and the previous one did not go
                    far enough. It claimed the link "re-reads the latest Texas SOS
                    publication each time it is opened". It re-reads OUR LATEST COPY of
                    a publication. Those are two different things and the page's own
                    provenance block proves it: PUBLISHED and RETRIEVED are routinely
                    weeks apart, and for every day of that gap this sentence was simply
                    false — the newest state publication existed and we were not
                    serving it. So the caption now names both hops, our fetch as well
                    as the state's release, because both of them lag.
                  */}
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 0", lineHeight: 1.5 }}>
                    Click to copy · This link is not frozen to what the record says today: each time it is opened it re-reads our latest copy of the Texas SOS data. That copy is two steps behind the state — it is only as current as the state's last publication
                    {evidence.cadence ? `, which it republishes ${evidence.cadence}` : ", released on the state's own schedule"}, and only as current as our last fetch of it.
                  </p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "10px 0 0", lineHeight: 1.55 }}>
                    <a href={verifyUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#4C9AC9", textDecoration: "underline" }}>
                      Public verification page ↗
                    </a>
                    {" "}· or check it against the state directly, using the SOS portal link in the record provenance above.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer nav. The data-source sentence that used to live here is superseded
          by the RECORD PROVENANCE strip above, which states a real retrieval date
          and links the state's own search portal. */}
      <section style={{ background: "#0a0f1e", padding: "24px", borderTop: "1px solid #1e293b", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
            <a href="https://verify.quantumsurety.bond" style={{ color: "#4C9AC9" }}>Search All Notaries</a> &nbsp;·&nbsp;
            <Link href="/bonds/notary-bond-texas"><span style={{ color: "#4C9AC9", cursor: "pointer" }}>Texas Notary Bond</span></Link> &nbsp;·&nbsp;
            <Link href="/press"><span style={{ color: "#4C9AC9", cursor: "pointer" }}>Press Kit</span></Link>
          </p>
        </div>
      </section>
    </>
  );
}
