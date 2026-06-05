import os
#!/usr/bin/env python3
"""
lead_intelligence.py — License-match enrichment for new leads
Runs every 15 min (3 min after sync). For each new notary/dealer/contractor
lead with a real email: search notaries/auto_dealers/tdlr_licenses for a
matching record. If found, send personalized "we found your license" email.
Always logs intel_check so leads are not re-processed.
"""

import psycopg2, boto3, time, re
from datetime import datetime

DB_HOST = "localhost"
DB_PORT = 5433
DB_NAME = "quantum_surety"
DB_USER = "quantum_user"
DB_PASS = "Qs2024Secure!"

AWS_KEY    = os.environ["AWS_SES_KEY"]
AWS_SECRET = os.environ["AWS_SES_SECRET"]
SES_REGION = "us-east-2"
FROM_NAME  = "Shelby at Quantum Surety"
FROM_EMAIL = "info@quantumsurety.bond"
SITE_URL   = "https://quantumsurety.bond"


def normalize_phone(p):
    return re.sub(r'\D', '', str(p)) if p else ""

def first_name(full):
    if not full:
        return "there"
    return full.strip().split()[0].title()

def fmt_date(d):
    if not d:
        return "on file"
    return d.strftime('%B %d, %Y') if hasattr(d, 'strftime') else str(d)

def classify(bond_type):
    if not bond_type:
        return None
    bt = bond_type.lower()
    if 'notary' in bt:
        return 'notary'
    if any(x in bt for x in ['dealer', 'gdn']):
        return 'dealer'
    if any(x in bt for x in ['contractor', 'tdlr']):
        return 'contractor'
    return None


def lookup_notary(cur, email, name):
    if email:
        cur.execute(
            "SELECT first_name, last_name, expire_date, city FROM notaries "
            "WHERE lower(email) = lower(%s) LIMIT 1", (email,)
        )
        row = cur.fetchone()
        if row:
            return row
    if name:
        cur.execute(
            "SELECT first_name, last_name, expire_date, city FROM notaries "
            "WHERE lower(first_name || ' ' || last_name) = lower(%s) LIMIT 1", (name.strip(),)
        )
        return cur.fetchone()
    return None


def lookup_dealer(cur, email, name, phone):
    if email:
        cur.execute(
            "SELECT business_name, dba_name, license_number, license_type, "
            "license_status, license_expiration, city FROM auto_dealers "
            "WHERE lower(email) = lower(%s) LIMIT 1", (email,)
        )
        row = cur.fetchone()
        if row:
            return row
    ph = normalize_phone(phone)
    if ph:
        cur.execute(
            "SELECT business_name, dba_name, license_number, license_type, "
            "license_status, license_expiration, city FROM auto_dealers "
            "WHERE regexp_replace(phone, '[^0-9]', '', 'g') = %s LIMIT 1", (ph,)
        )
        row = cur.fetchone()
        if row:
            return row
    if name:
        cur.execute(
            "SELECT business_name, dba_name, license_number, license_type, "
            "license_status, license_expiration, city FROM auto_dealers "
            "WHERE lower(business_name) = lower(%s) OR lower(dba_name) = lower(%s) LIMIT 1",
            (name.strip(), name.strip())
        )
        return cur.fetchone()
    return None


def lookup_contractor(cur, name, phone):
    ph = normalize_phone(phone)
    if ph:
        cur.execute(
            "SELECT business_name, license_type, license_number, license_subtype, "
            "expire_date, business_county, business_city FROM tdlr_licenses "
            "WHERE regexp_replace(business_phone, '[^0-9]', '', 'g') = %s "
            "OR regexp_replace(owner_phone, '[^0-9]', '', 'g') = %s "
            "ORDER BY expire_date DESC LIMIT 1", (ph, ph)
        )
        row = cur.fetchone()
        if row:
            return row
    if name:
        cur.execute(
            "SELECT business_name, license_type, license_number, license_subtype, "
            "expire_date, business_county, business_city FROM tdlr_licenses "
            "WHERE lower(business_name) = lower(%s) "
            "ORDER BY expire_date DESC LIMIT 1", (name.strip(),)
        )
        return cur.fetchone()
    return None


def make_notary_email(lead, match):
    fn        = first_name(lead['name'])
    expire    = fmt_date(match[2])
    city      = match[3] or ''
    apply_url = f"{SITE_URL}/get-bond?type=notary"
    subject   = f"Hi {fn} — we found your TX notary commission, your bond is ready"
    html = f"""<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
<div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0;">
  <h2 style="color:#fff;margin:0;font-size:18px;">Quantum Surety</h2>
</div>
<div style="padding:28px 24px;background:#fff;border:1px solid #e5e7eb;">
  <p style="font-size:16px;">Hi {fn},</p>
  <p>We noticed you were looking into a <strong>Texas Notary Public Bond</strong>. We found your Texas Notary Commission on record:</p>
  <div style="background:#f8fafc;border-left:4px solid #0ea5e9;padding:16px;margin:20px 0;border-radius:0 8px 8px 0;">
    <p style="margin:4px 0;"><strong>Commission expires:</strong> {expire}</p>
    {'<p style="margin:4px 0;"><strong>City:</strong> ' + city + '</p>' if city else ''}
  </div>
  <p>Your $50 bond takes about 60 seconds — no credit check, same-day issue:</p>
  <div style="text-align:center;margin:28px 0;">
    <a href="{apply_url}" style="background:#0ea5e9;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block;">Get My Notary Bond &rarr;</a>
  </div>
  <p style="color:#6b7280;font-size:14px;">Questions? <a href="tel:2146668718" style="color:#0ea5e9;">214-666-8718</a></p>
  <p>&mdash; Shelby at Quantum Surety</p>
</div>
<div style="padding:12px 24px;background:#f8fafc;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;text-align:center;">
  <a href="{SITE_URL}/unsubscribe?email={lead['email']}" style="color:#9ca3af;font-size:12px;text-decoration:none;">Unsubscribe</a>
</div>
</body></html>"""
    text = (f"Hi {fn},\n\nWe found your Texas Notary Commission on record:\n"
            f"  Expires: {expire}\n" + (f"  City: {city}\n" if city else "") +
            f"\nGet your $50 notary bond (60 sec, no credit check):\n{apply_url}\n\n"
            f"Questions? 214-666-8718\n\n— Shelby at Quantum Surety")
    return subject, html, text


def make_dealer_email(lead, match):
    fn          = first_name(lead['name'])
    biz         = match[0] or match[1] or lead['name']
    license_num = match[2] or ''
    license_typ = match[3] or 'GDN'
    status      = match[4] or ''
    expire      = fmt_date(match[5])
    city        = match[6] or ''
    apply_url   = f"{SITE_URL}/get-bond?type=dealer"
    subject     = f"Hi {fn} — we found your GDN license, your dealer bond is ready"
    biz_row  = f'<p style="margin:4px 0;"><strong>Business:</strong> {biz}</p>' if biz else ''
    num_row  = f'<p style="margin:4px 0;"><strong>GDN License #:</strong> {license_num}</p>' if license_num else ''
    typ_row  = f'<p style="margin:4px 0;"><strong>License type:</strong> {license_typ}</p>' if license_typ else ''
    stat_row = f'<p style="margin:4px 0;"><strong>Status:</strong> {status}</p>' if status else ''
    city_row = f'<p style="margin:4px 0;"><strong>City:</strong> {city}</p>' if city else ''
    html = f"""<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
<div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0;">
  <h2 style="color:#fff;margin:0;font-size:18px;">Quantum Surety</h2>
</div>
<div style="padding:28px 24px;background:#fff;border:1px solid #e5e7eb;">
  <p style="font-size:16px;">Hi {fn},</p>
  <p>We saw you came to Quantum Surety for a <strong>GDN Dealer Bond</strong>. We found your license on file:</p>
  <div style="background:#f8fafc;border-left:4px solid #f59e0b;padding:16px;margin:20px 0;border-radius:0 8px 8px 0;">
    {biz_row}{num_row}{typ_row}
    <p style="margin:4px 0;"><strong>Expires:</strong> {expire}</p>
    {stat_row}{city_row}
  </div>
  <p>Your dealer bond application takes about 2 minutes:</p>
  <div style="text-align:center;margin:28px 0;">
    <a href="{apply_url}" style="background:#f59e0b;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block;">Get My GDN Bond &rarr;</a>
  </div>
  <p style="color:#6b7280;font-size:14px;">Questions? <a href="tel:2146668718" style="color:#0ea5e9;">214-666-8718</a></p>
  <p>&mdash; Shelby at Quantum Surety</p>
</div>
<div style="padding:12px 24px;background:#f8fafc;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;text-align:center;">
  <a href="{SITE_URL}/unsubscribe?email={lead['email']}" style="color:#9ca3af;font-size:12px;text-decoration:none;">Unsubscribe</a>
</div>
</body></html>"""
    text = (f"Hi {fn},\n\nWe found your GDN Dealer License on file:\n"
            f"  Business: {biz}\n  License #: {license_num}\n  Expires: {expire}\n\n"
            f"Get your dealer bond (2 min):\n{apply_url}\n\n"
            f"Questions? 214-666-8718\n\n— Shelby at Quantum Surety")
    return subject, html, text


def make_contractor_email(lead, match):
    fn       = first_name(lead['name'])
    biz      = match[0] or lead['name']
    lic_type = match[1] or 'Contractor'
    lic_num  = match[2] or ''
    lic_sub  = match[3] or ''
    expire   = fmt_date(match[4])
    county   = match[5] or ''
    city     = match[6] or ''
    location = city or county
    label    = lic_sub or lic_type
    apply_url = f"{SITE_URL}/get-bond?type=contractor"
    subject   = f"Hi {fn} — we found your TDLR license, your contractor bond is ready"
    biz_row  = f'<p style="margin:4px 0;"><strong>Business:</strong> {biz}</p>' if biz else ''
    num_str  = f' #{lic_num}' if lic_num else ''
    loc_row  = f'<p style="margin:4px 0;"><strong>Location:</strong> {location}, TX</p>' if location else ''
    html = f"""<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
<div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0;">
  <h2 style="color:#fff;margin:0;font-size:18px;">Quantum Surety</h2>
</div>
<div style="padding:28px 24px;background:#fff;border:1px solid #e5e7eb;">
  <p style="font-size:16px;">Hi {fn},</p>
  <p>We saw you were looking into a <strong>Texas Contractor License Bond</strong>. We found your TDLR license on file:</p>
  <div style="background:#f8fafc;border-left:4px solid #10b981;padding:16px;margin:20px 0;border-radius:0 8px 8px 0;">
    {biz_row}
    <p style="margin:4px 0;"><strong>License:</strong> {label}{num_str}</p>
    <p style="margin:4px 0;"><strong>Expires:</strong> {expire}</p>
    {loc_row}
  </div>
  <p>Your contractor bond application is ready — most complete in under 2 minutes:</p>
  <div style="text-align:center;margin:28px 0;">
    <a href="{apply_url}" style="background:#10b981;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block;">Get My Contractor Bond &rarr;</a>
  </div>
  <p style="color:#6b7280;font-size:14px;">Questions? <a href="tel:2146668718" style="color:#0ea5e9;">214-666-8718</a></p>
  <p>&mdash; Shelby at Quantum Surety</p>
</div>
<div style="padding:12px 24px;background:#f8fafc;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;text-align:center;">
  <a href="{SITE_URL}/unsubscribe?email={lead['email']}" style="color:#9ca3af;font-size:12px;text-decoration:none;">Unsubscribe</a>
</div>
</body></html>"""
    text = (f"Hi {fn},\n\nWe found your TDLR license on file:\n"
            f"  Business: {biz}\n  License: {label}{num_str}\n  Expires: {expire}\n"
            + (f"  Location: {location}, TX\n" if location else "") +
            f"\nGet your contractor bond (2 min):\n{apply_url}\n\n"
            f"Questions? 214-666-8718\n\n— Shelby at Quantum Surety")
    return subject, html, text


def main():
    conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
                            user=DB_USER, password=DB_PASS)
    ses  = boto3.client("ses", region_name=SES_REGION,
                        aws_access_key_id=AWS_KEY, aws_secret_access_key=AWS_SECRET)
    cur  = conn.cursor()

    cur.execute("""
        SELECT l.id, l.name, l.email, l.phone, l.bond_type, l.source
        FROM leads l
        WHERE l.email IS NOT NULL
          AND l.email NOT LIKE '%%@noemail.%%'
          AND l.email NOT ILIKE 'voice-%%'
          AND (
            l.bond_type ILIKE '%%notary%%'
            OR l.bond_type ILIKE '%%dealer%%'
            OR l.bond_type ILIKE '%%gdn%%'
            OR l.bond_type ILIKE '%%contractor%%'
          )
          AND l.created_at > NOW() - INTERVAL '48 hours'
          AND NOT EXISTS (
            SELECT 1 FROM lead_activity
            WHERE lead_id = l.id AND action = 'intel_check'
          )
          AND NOT EXISTS (
            SELECT 1 FROM unsubscribes WHERE email = l.email
          )
    """)
    rows = cur.fetchall()
    leads = [dict(id=r[0], name=r[1], email=r[2], phone=r[3],
                  bond_type=r[4], source=r[5]) for r in rows]
    print(f"Eligible leads: {len(leads)}")

    matched = 0
    for lead in leads:
        kind  = classify(lead['bond_type'])
        match = None

        if kind == 'notary':
            match = lookup_notary(cur, lead['email'], lead['name'])
            if match:
                subject, html, text = make_notary_email(lead, match)
        elif kind == 'dealer':
            match = lookup_dealer(cur, lead['email'], lead['name'], lead['phone'])
            if match:
                subject, html, text = make_dealer_email(lead, match)
        elif kind == 'contractor':
            match = lookup_contractor(cur, lead['name'], lead['phone'])
            if match:
                subject, html, text = make_contractor_email(lead, match)

        if match:
            try:
                ses.send_email(
                    Source=f"{FROM_NAME} <{FROM_EMAIL}>",
                    Destination={"ToAddresses": [lead['email']]},
                    Message={
                        "Subject": {"Data": subject, "Charset": "UTF-8"},
                        "Body": {
                            "Text": {"Data": text, "Charset": "UTF-8"},
                            "Html": {"Data": html, "Charset": "UTF-8"},
                        },
                    },
                )
                cur.execute(
                    "INSERT INTO lead_activity (lead_id, action, notes) VALUES (%s, %s, %s)",
                    (lead['id'], 'intel_match',
                     f"Matched {kind} record. Subject: {subject}")
                )
                matched += 1
                print(f"  Matched [{kind}]: {lead['name']} <{lead['email']}>")
            except Exception as e:
                print(f"  ERROR {lead['email']}: {e}")
            time.sleep(0.1)

        # Always mark checked so this lead is never re-processed
        cur.execute(
            "INSERT INTO lead_activity (lead_id, action, notes) VALUES (%s, %s, %s)",
            (lead['id'], 'intel_check',
             f"Checked {kind or 'unknown'}: {'match found' if match else 'no match'}")
        )
        conn.commit()

    print(f"Done. Matched+emailed: {matched} / {len(leads)} checked")
    cur.close()
    conn.close()


if __name__ == '__main__':
    main()
