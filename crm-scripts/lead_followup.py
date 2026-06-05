import os
"""
lead_followup.py — Friendly follow-up emails for site leads.

Targets leads that:
  - have an email
  - arrived via the site (not auto-pipeline)
  - are between 2 and 72 hours old
  - have never received a followup email (tracked in lead_activity)

Runs daily via cron. Sends via AWS SES.
"""

import psycopg2, boto3, time, sys

# ── Config ────────────────────────────────────────────────────────────────────
DB = dict(host="127.0.0.1", port=5433, dbname="quantum_surety",
          user="quantum_user", password="Qs2024Secure!")

SES_REGION   = "us-east-2"
AWS_KEY    = os.environ["AWS_SES_KEY"]
AWS_SECRET = os.environ["AWS_SES_SECRET"]
FROM_EMAIL   = "info@quantumsurety.bond"
FROM_NAME    = "Shelby at Quantum Surety"
PHONE        = "(214) 666-8718"
PHONE_LINK   = "tel:2146668718"

ADMIN_EMAIL  = "administrator@quantumsurety.bond"
TEST_MODE    = "--test" in sys.argv
MAX_SEND     = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1] != "--test" else 200

APPLY_URL_TITLE  = "https://www.mybondapp.com/329034247/DirectNavBond?BondType=R42DAMBA2&State=TX"
APPLY_URL_NOTARY = "https://quantumsurety.bond/get-bond?type=notary"
APPLY_URL_DEALER = "https://quantumsurety.bond/get-bond?type=dealer"
WIZARD_URL       = "https://quantumsurety.bond/texas-title-rescue"

# Sources from auto-pipeline or drip openers — skip these
SKIP_SOURCES = ("auto-pipeline", "drip campaign", "TDLR Monitor")


# ── Email templates ───────────────────────────────────────────────────────────

def classify(bond_type: str, source: str) -> str:
    bt = (bond_type or "").lower()
    src = (source or "").lower()
    if any(k in bt or k in src for k in ("title", "bonded-title", "bonded_title", "certificate")):
        return "title"
    if "notary" in bt or "notary" in src:
        return "notary"
    if any(k in bt or k in src for k in ("dealer", "gdn", "auto dealer")):
        return "dealer"
    if any(k in bt or k in src for k in ("contractor", "license", "performance", "bid", "payment")):
        return "contractor"
    return "general"


def get_first_name(full_name: str) -> str:
    if not full_name:
        return "there"
    return full_name.strip().split()[0].title()


def make_subject(kind: str, first_name: str) -> str:
    return {
        "title":      f"Quick question about your title bond, {first_name}",
        "notary":     f"Your notary bond — any questions, {first_name}?",
        "dealer":     f"Following up on your dealer bond, {first_name}",
        "contractor": f"Your contractor bond request, {first_name}",
        "general":    f"Following up on your bond inquiry, {first_name}",
    }[kind]


def body_title(first_name: str) -> tuple[str, str]:
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;border:1px solid #e5e7eb;max-width:580px;">
<tr><td style="padding:40px 44px 12px;">

<p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.7;">Hi {first_name},</p>

<p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.7;">
  Just checking in — you recently started looking into a <strong>Texas Certificate of Title Bond</strong> on our site.
  I wanted to make sure you didn't get stuck and see if there's anything I can help with.
</p>

<p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.7;">
  Title bond situations can feel a little confusing at first — especially if you're dealing with a rejected title, an
  auction vehicle, or inherited paperwork. That's pretty normal, and we handle cases like these every day.
</p>

<p style="margin:0 0 8px;color:#374151;font-size:15px;font-weight:bold;">Two easy ways to move forward:</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
  <tr>
    <td style="padding:14px 18px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;width:48%;vertical-align:top;">
      <p style="margin:0 0 6px;color:#166534;font-size:13px;font-weight:bold;">Apply in 2 minutes</p>
      <p style="margin:0 0 10px;color:#374151;font-size:13px;line-height:1.5;">No account needed — start your application directly.</p>
      <a href="{APPLY_URL_TITLE}" style="display:inline-block;background:#16a34a;color:#fff;font-size:13px;font-weight:bold;padding:8px 18px;border-radius:6px;text-decoration:none;">Apply Directly &rarr;</a>
    </td>
    <td style="width:4%;"></td>
    <td style="padding:14px 18px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;width:48%;vertical-align:top;">
      <p style="margin:0 0 6px;color:#1e40af;font-size:13px;font-weight:bold;">Talk to someone first</p>
      <p style="margin:0 0 10px;color:#374151;font-size:13px;line-height:1.5;">Call or text — we can confirm eligibility in 5 minutes.</p>
      <a href="{PHONE_LINK}" style="display:inline-block;background:#1d4ed8;color:#fff;font-size:13px;font-weight:bold;padding:8px 18px;border-radius:6px;text-decoration:none;">Call {PHONE}</a>
    </td>
  </tr>
</table>

<p style="margin:0 0 18px;color:#374151;font-size:15px;line-height:1.7;">
  Or if you'd like to run through your eligibility again first, the <a href="{WIZARD_URL}" style="color:#1d4ed8;">Title Rescue Wizard</a> takes
  about 2 minutes and gives you a personalized document checklist.
</p>

<p style="margin:0 0 4px;color:#374151;font-size:15px;line-height:1.7;">
  Either way, happy to help — just reply here or give us a call.
</p>

<p style="margin:24px 0 0;color:#374151;font-size:15px;">
  Shelby<br>
  <span style="color:#6b7280;font-size:13px;">Quantum Surety &middot; TDI License #3480229 &middot; {PHONE}</span>
</p>

</td></tr>
<tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 44px;border-radius:0 0 8px 8px;">
  <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
    Quantum Surety LLC &middot; 1416 Bessie Drive, Wylie TX 75098<br>
    You're receiving this because you submitted a bond inquiry on quantumsurety.bond.
  </p>
</td></tr>
</table></td></tr></table>
</body></html>"""

    text = f"""Hi {first_name},

Just checking in — you recently started looking into a Texas Certificate of Title Bond on our site. I wanted to make sure you didn't get stuck.

Two easy ways to move forward:

1. Apply directly (2 min, no account needed):
   {APPLY_URL_TITLE}

2. Call us and we'll confirm eligibility in 5 minutes:
   {PHONE}

Or use the Title Rescue Wizard to check eligibility and get your document checklist:
   {WIZARD_URL}

Happy to help either way — just reply here or give us a call.

Shelby
Quantum Surety | TDI License #3480229 | {PHONE}
"""
    return html, text


def body_notary(first_name: str) -> tuple[str, str]:
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;border:1px solid #e5e7eb;max-width:580px;">
<tr><td style="padding:40px 44px 12px;">

<p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.7;">Hi {first_name},</p>

<p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.7;">
  You recently started a <strong>Texas Notary Bond</strong> on our site — just wanted to check in
  and see if you had any questions or ran into any snags.
</p>

<p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.7;">
  The process is pretty straightforward — $50 flat, instant PDF, and you're covered for your full
  4-year commission. If there's anything holding you up, I'm happy to help.
</p>

<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
  <tr><td align="center">
    <a href="{APPLY_URL_NOTARY}" style="display:inline-block;background:#1d4ed8;color:#fff;font-size:15px;font-weight:bold;padding:12px 32px;border-radius:8px;text-decoration:none;">
      Finish My Notary Bond &rarr;
    </a>
  </td></tr>
</table>

<p style="margin:0 0 18px;color:#374151;font-size:15px;line-height:1.7;">
  Or call us at <a href="{PHONE_LINK}" style="color:#1d4ed8;">{PHONE}</a> — takes about 5 minutes over the phone.
</p>

<p style="margin:24px 0 0;color:#374151;font-size:15px;">
  Shelby<br>
  <span style="color:#6b7280;font-size:13px;">Quantum Surety &middot; TDI License #3480229 &middot; {PHONE}</span>
</p>

</td></tr>
<tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 44px;border-radius:0 0 8px 8px;">
  <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
    Quantum Surety LLC &middot; 1416 Bessie Drive, Wylie TX 75098<br>
    You're receiving this because you submitted a bond inquiry on quantumsurety.bond.
  </p>
</td></tr>
</table></td></tr></table>
</body></html>"""

    text = f"""Hi {first_name},

You recently started a Texas Notary Bond on our site — just wanted to check in and see if you had any questions.

$50 flat, instant PDF, covers your full 4-year commission. If there's anything holding you up, I'm happy to help.

Finish your bond here:
   {APPLY_URL_NOTARY}

Or call us: {PHONE}

Shelby
Quantum Surety | TDI License #3480229 | {PHONE}
"""
    return html, text


def body_dealer(first_name: str) -> tuple[str, str]:
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;border:1px solid #e5e7eb;max-width:580px;">
<tr><td style="padding:40px 44px 12px;">

<p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.7;">Hi {first_name},</p>

<p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.7;">
  You recently looked into a <strong>GDN Dealer Bond</strong> on our site. I wanted to follow up
  and see if you had any questions or need help finishing up.
</p>

<p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.7;">
  We offer same-day issuance and work directly with TxDMV. If TxDMV is waiting on your bond,
  we can usually turn it around within a couple of hours.
</p>

<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
  <tr><td align="center">
    <a href="{APPLY_URL_DEALER}" style="display:inline-block;background:#1d4ed8;color:#fff;font-size:15px;font-weight:bold;padding:12px 32px;border-radius:8px;text-decoration:none;">
      Get My Dealer Bond &rarr;
    </a>
  </td></tr>
</table>

<p style="margin:0 0 18px;color:#374151;font-size:15px;line-height:1.7;">
  Questions? Call us at <a href="{PHONE_LINK}" style="color:#1d4ed8;">{PHONE}</a> and we'll get you sorted.
</p>

<p style="margin:24px 0 0;color:#374151;font-size:15px;">
  Shelby<br>
  <span style="color:#6b7280;font-size:13px;">Quantum Surety &middot; TDI License #3480229 &middot; {PHONE}</span>
</p>

</td></tr>
<tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 44px;border-radius:0 0 8px 8px;">
  <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
    Quantum Surety LLC &middot; 1416 Bessie Drive, Wylie TX 75098<br>
    You're receiving this because you submitted a bond inquiry on quantumsurety.bond.
  </p>
</td></tr>
</table></td></tr></table>
</body></html>"""

    text = f"""Hi {first_name},

You recently looked into a GDN Dealer Bond on our site. Same-day issuance, works directly with TxDMV.

Get your bond here:
   {APPLY_URL_DEALER}

Or call us: {PHONE}

Shelby
Quantum Surety | TDI License #3480229 | {PHONE}
"""
    return html, text


def body_general(first_name: str, bond_type: str) -> tuple[str, str]:
    bond_label = bond_type.replace("-", " ").replace("_", " ").title() if bond_type else "surety bond"
    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;border:1px solid #e5e7eb;max-width:580px;">
<tr><td style="padding:40px 44px 12px;">

<p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.7;">Hi {first_name},</p>

<p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.7;">
  You recently submitted a <strong>{bond_label}</strong> inquiry on Quantum Surety. I just wanted
  to reach out and see if you still need help or have any questions.
</p>

<p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.7;">
  We're a TDI-licensed Texas surety bond agency and can typically get bonds issued same-day.
  Whatever you need, we're here to help you get it done.
</p>

<p style="margin:0 0 18px;color:#374151;font-size:15px;line-height:1.7;">
  Just reply to this email or give us a call at <a href="{PHONE_LINK}" style="color:#1d4ed8;">{PHONE}</a>
  and we'll pick up right where you left off.
</p>

<p style="margin:24px 0 0;color:#374151;font-size:15px;">
  Shelby<br>
  <span style="color:#6b7280;font-size:13px;">Quantum Surety &middot; TDI License #3480229 &middot; {PHONE}</span>
</p>

</td></tr>
<tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 44px;border-radius:0 0 8px 8px;">
  <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
    Quantum Surety LLC &middot; 1416 Bessie Drive, Wylie TX 75098<br>
    You're receiving this because you submitted a bond inquiry on quantumsurety.bond.
  </p>
</td></tr>
</table></td></tr></table>
</body></html>"""

    text = f"""Hi {first_name},

You recently submitted a {bond_label} inquiry on Quantum Surety. Just checking in to see if you still need help.

Reply here or call us: {PHONE}

Shelby
Quantum Surety | TDI License #3480229 | {PHONE}
"""
    return html, text


def make_email(lead: dict) -> tuple[str, str, str]:
    first_name = get_first_name(lead["name"])
    kind = classify(lead["bond_type"], lead["source"])
    subject = make_subject(kind, first_name)
    if kind == "title":
        html, text = body_title(first_name)
    elif kind == "notary":
        html, text = body_notary(first_name)
    elif kind == "dealer":
        html, text = body_dealer(first_name)
    else:
        html, text = body_general(first_name, lead["bond_type"])
    return subject, html, text


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    conn = psycopg2.connect(**DB)
    cur  = conn.cursor()

    # Pull eligible leads: have email, not auto-pipeline, 2–72 hrs old, no followup yet
    cur.execute("""
        SELECT l.id, l.name, l.email, l.bond_type, l.source, l.notes
        FROM leads l
        WHERE l.email IS NOT NULL AND l.email != ''
          AND l.status = 'new'
          AND l.source NOT ILIKE 'auto-pipeline%%'
          AND l.source NOT ILIKE 'drip campaign%%'
          AND l.source NOT ILIKE 'TDLR Monitor%%'
          AND l.created_at >= NOW() - INTERVAL '72 hours'
          AND l.created_at <= NOW() - INTERVAL '2 hours'
          AND NOT EXISTS (
            SELECT 1 FROM lead_activity la
            WHERE la.lead_id = l.id
              AND la.action = 'followup_email_sent'
          )
          AND l.email NOT LIKE '%%@noemail.%%'
          AND l.email NOT ILIKE 'voice-%%'
          AND l.email NOT IN (SELECT email FROM unsubscribes)
        ORDER BY l.created_at DESC
        LIMIT %s
    """, (MAX_SEND,))

    leads = [
        {"id": r[0], "name": r[1], "email": r[2],
         "bond_type": r[3], "source": r[4], "notes": r[5]}
        for r in cur.fetchall()
    ]

    print(f"Eligible leads: {len(leads)}")

    if TEST_MODE:
        for l in leads[:3]:
            subj, _, _ = make_email(l)
            kind = classify(l["bond_type"], l["source"])
            print(f"  WOULD SEND [{kind}] to {l['email']} ({l['name']}) — \"{subj}\"")
        cur.close(); conn.close()
        return

    ses   = boto3.client("ses", region_name=SES_REGION,
                         aws_access_key_id=AWS_KEY,
                         aws_secret_access_key=AWS_SECRET)
    sent  = 0
    errors = 0

    sent_log = []  # [(name, email, bond_type, subject)]
    error_log = []

    for lead in leads:
        subject, html, text = make_email(lead)
        try:
            ses.send_email(
                Source=f"{FROM_NAME} <{FROM_EMAIL}>",
                Destination={"ToAddresses": [lead["email"]]},
                Message={
                    "Subject": {"Data": subject, "Charset": "UTF-8"},
                    "Body": {
                        "Text": {"Data": text,  "Charset": "UTF-8"},
                        "Html": {"Data": html,  "Charset": "UTF-8"},
                    },
                },
            )
            # Log to lead_activity
            cur.execute(
                "INSERT INTO lead_activity (lead_id, action, notes) VALUES (%s, %s, %s)",
                (lead["id"], "followup_email_sent", f"Subject: {subject}")
            )
            # Mark as contacted
            cur.execute(
                "UPDATE leads SET status = 'contacted', updated_at = NOW() WHERE id = %s",
                (lead["id"],)
            )
            conn.commit()
            sent += 1
            sent_log.append((lead["name"], lead["email"], lead["bond_type"] or "—", subject))
            time.sleep(0.1)

        except Exception as e:
            errors += 1
            conn.rollback()
            error_log.append((lead["email"], str(e)))
            if errors <= 5:
                print(f"  ERR {lead['email']}: {e}")

    cur.close()
    conn.close()
    print(f"Done. Sent: {sent} | Errors: {errors}")

    # ── Admin report ──────────────────────────────────────────────────────────
    send_admin_report(ses, sent_log, error_log)


def send_admin_report(ses, sent_log, error_log):
    NL = chr(10)
    from datetime import datetime
    import zoneinfo
    now_cdt = datetime.now(zoneinfo.ZoneInfo("America/Chicago")).strftime("%b %d, %Y %I:%M %p CDT")

    sent_rows_html = "".join(
        f"""<tr style="border-bottom:1px solid #f3f4f6;">
          <td style="padding:8px 10px;color:#374151;font-size:13px;">{name}</td>
          <td style="padding:8px 10px;color:#6b7280;font-size:13px;">{email}</td>
          <td style="padding:8px 10px;color:#6b7280;font-size:13px;">{bond}</td>
          <td style="padding:8px 10px;color:#374151;font-size:13px;font-style:italic;">{subj}</td>
        </tr>"""
        for name, email, bond, subj in sent_log
    ) if sent_log else '<tr><td colspan="4" style="padding:12px;color:#9ca3af;text-align:center;">No emails sent</td></tr>'

    error_rows_html = "".join(
        f'<li style="color:#dc2626;font-size:13px;">{email}: {err}</li>'
        for email, err in error_log
    ) if error_log else '<li style="color:#6b7280;font-size:13px;">None</li>'

    sent_rows_text = NL.join(
        f"  {name} <{email}> | {bond} | {subj}"
        for name, email, bond, subj in sent_log
    ) or "  (none)"

    html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:24px 16px;">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;border:1px solid #e5e7eb;max-width:640px;">

  <tr><td style="background:#1e293b;padding:22px 32px;border-radius:8px 8px 0 0;">
    <p style="margin:0;color:#94a3b8;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Quantum Surety CRM</p>
    <h1 style="margin:6px 0 0;color:#f1f5f9;font-size:20px;font-weight:700;">Lead Follow-Up Report</h1>
    <p style="margin:4px 0 0;color:#64748b;font-size:13px;">{now_cdt}</p>
  </td></tr>

  <tr><td style="padding:28px 32px 8px;">

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;text-align:center;width:30%;">
          <p style="margin:0;color:#166534;font-size:28px;font-weight:800;">{len(sent_log)}</p>
          <p style="margin:4px 0 0;color:#15803d;font-size:12px;font-weight:600;">Emails Sent</p>
        </td>
        <td style="width:4%;"></td>
        <td style="background:{"#fef2f2" if error_log else "#f9fafb"};border:1px solid {"#fecaca" if error_log else "#e5e7eb"};border-radius:8px;padding:16px 20px;text-align:center;width:30%;">
          <p style="margin:0;color:{"#dc2626" if error_log else "#9ca3af"};font-size:28px;font-weight:800;">{len(error_log)}</p>
          <p style="margin:4px 0 0;color:{"#dc2626" if error_log else "#9ca3af"};font-size:12px;font-weight:600;">Errors</p>
        </td>
        <td style="width:4%;"></td>
        <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 20px;text-align:center;width:30%;">
          <p style="margin:0;color:#1e40af;font-size:28px;font-weight:800;">{len(sent_log) + len(error_log)}</p>
          <p style="margin:4px 0 0;color:#1e40af;font-size:12px;font-weight:600;">Leads Eligible</p>
        </td>
      </tr>
    </table>

    <h2 style="margin:0 0 12px;color:#111827;font-size:15px;font-weight:700;">Emails Sent</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <tr style="background:#f9fafb;">
        <th style="padding:9px 10px;text-align:left;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Name</th>
        <th style="padding:9px 10px;text-align:left;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Email</th>
        <th style="padding:9px 10px;text-align:left;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Bond Type</th>
        <th style="padding:9px 10px;text-align:left;font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Subject Sent</th>
      </tr>
      {sent_rows_html}
    </table>

    {'<h2 style="margin:0 0 10px;color:#dc2626;font-size:15px;font-weight:700;">Errors</h2><ul style="margin:0 0 24px;padding-left:20px;">' + error_rows_html + '</ul>' if error_log else ''}

  </td></tr>
  <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:14px 32px;border-radius:0 0 8px 8px;text-align:center;">
    <p style="margin:0;color:#9ca3af;font-size:11px;">Quantum Surety CRM &middot; Automated lead follow-up system</p>
  </td></tr>

</table></td></tr></table>
</body></html>"""

    text = f"""Lead Follow-Up Report — {now_cdt}

Sent:   {len(sent_log)}
Errors: {len(error_log)}

EMAILS SENT:
{sent_rows_text}

ERRORS:
{"\n".join(f"  {e}: {err}" for e, err in error_log) or "  None"}

— Quantum Surety CRM automated report
"""

    if not sent_log and not error_log:
        print("No activity — skipping admin report.")
        return

    try:
        ses.send_email(
            Source=f"Quantum Surety CRM <{FROM_EMAIL}>",
            Destination={"ToAddresses": [ADMIN_EMAIL]},
            Message={
                "Subject": {"Data": f"Lead Follow-Up Report — {len(sent_log)} sent ({now_cdt})", "Charset": "UTF-8"},
                "Body": {
                    "Text": {"Data": text, "Charset": "UTF-8"},
                    "Html": {"Data": html, "Charset": "UTF-8"},
                },
            },
        )
        print(f"Admin report sent to {ADMIN_EMAIL}")
    except Exception as e:
        print(f"ERR sending admin report: {e}")


if __name__ == "__main__":
    main()
