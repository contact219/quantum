#!/usr/bin/env python3
# Notary Training School Partnership Outreach - one-time blast.
# Proposes preferred bond provider referral arrangement to TX notary training schools.
# Usage: notary_school_outreach.py [--dry-run]
# Log: /tmp/notary_school_outreach_sent.json
import os, sys, json, boto3
from datetime import datetime

def _load_env(path="/usr/local/etc/qs-crm.env"):
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())
    except OSError:
        pass

_load_env()
DRY_RUN = "--dry-run" in sys.argv

SCHOOLS = [
    {"name": "National Notary Association Texas", "contact": "info@nationalnotary.org"},
    {"name": "Notary2Pro", "contact": "info@notary2pro.com"},
    {"name": "Texas Notary Training", "contact": "support@texasnotarytraining.com"},
    {"name": "Notary Learning Center", "contact": "info@notarylearningcenter.com"},
    {"name": "TX Notary Bond Training", "contact": "contact@txnotary.com"},
    {"name": "American Society of Notaries", "contact": "asn@asnotaries.org"},
    {"name": "Loan Signing System", "contact": "support@loansigningsystem.com"},
    {"name": "Notary Rotary", "contact": "info@notaryrotary.com"},
]

SUBJECT = "Partnership opportunity: preferred bond provider for your Texas notary students"

FROM_ADDR = "nice.shotwell-sparks@quantumsurety.bond"
LOG_FILE = "/tmp/notary_school_outreach_sent.json"

def make_body(name):
    return (
        "Hi %s team,\n\n"
        "I'm reaching out from Quantum Surety Bonds, a Texas-licensed surety agency (#3480229) "
        "specializing in notary bonds for Texas notaries.\n\n"
        "We'd love to explore a referral partnership where we become your recommended bond provider "
        "for students completing their Texas notary commission.\n\n"
        "What we offer your students:\n"
        "- $50 flat for a 4-year Texas notary bond (no hidden fees)\n"
        "- Instant PDF certificate, usually same day\n"
        "- SB693-compliant process with guidance\n"
        "- 10%% referral commission for your organization on each bond purchase\n\n"
        "We currently have 461,000+ active Texas notaries in our database, and our AI-powered "
        "renewal reminder system keeps notaries bonded and compliant -- which reflects well on "
        "the training providers who send them our way.\n\n"
        "Interested in learning more? Reply to this email or call (214) 666-8718.\n\n"
        "Ted Sparks\n"
        "Quantum Surety Bonds\n"
        "quantumsurety.bond | (214) 666-8718\n"
        "TDI Licensed Agency #3480229\n"
    ) % name

def send_email(ses, to_addr, name):
    ses.send_email(
        Source=FROM_ADDR,
        Destination={"ToAddresses": [to_addr]},
        Message={
            "Subject": {"Data": SUBJECT, "Charset": "UTF-8"},
            "Body": {"Text": {"Data": make_body(name), "Charset": "UTF-8"}},
        },
    )

def main():
    log = []
    ses = None
    if not DRY_RUN:
        ses = boto3.client(
            "ses",
            region_name="us-east-2",
            aws_access_key_id=os.environ.get("QS_AWS_KEY"),
            aws_secret_access_key=os.environ.get("QS_AWS_SECRET"),
        )

    print("[%s] Notary school outreach -- %d targets%s" % (
        datetime.now(), len(SCHOOLS), " (DRY RUN)" if DRY_RUN else ""))

    sent = 0
    for school in SCHOOLS:
        name = school["name"]
        contact = school["contact"]
        if DRY_RUN:
            print("  would send to: %s (%s)" % (contact, name))
            log.append({"name": name, "contact": contact, "dry_run": True,
                        "ts": datetime.now().isoformat()})
        else:
            try:
                send_email(ses, contact, name)
                print("  sent to %s (%s)" % (contact, name))
                log.append({"name": name, "contact": contact, "sent": True,
                            "ts": datetime.now().isoformat()})
                sent += 1
            except Exception as e:
                print("  error sending to %s: %s" % (contact, e))
                log.append({"name": name, "contact": contact, "sent": False,
                            "error": str(e), "ts": datetime.now().isoformat()})

    with open(LOG_FILE, "w") as f:
        json.dump(log, f, indent=2)
    count = len(SCHOOLS) if DRY_RUN else sent
    print("[%s] Done -- %s %d emails. Log: %s" % (
        datetime.now(), "would send" if DRY_RUN else "sent", count, LOG_FILE))

if __name__ == "__main__":
    main()
