#!/usr/bin/env python3
"""
7-day follow-up to notary training schools emailed 2026-06-15.
Reads /tmp/notary_school_outreach_sent.json, sends follow-up via SES.
Usage: notary_school_followup.py [--dry-run]
"""
import json, os, sys, boto3
from datetime import datetime, date

DRY_RUN = "--dry-run" in sys.argv
LOG_PATH = "/tmp/notary_school_outreach_sent.json"
RESULT_PATH = "/tmp/notary_school_followup_sent.json"


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

FROM_ADDR = "nice.shotwell-sparks@quantumsurety.bond"
SUBJECT = "Re: Partnership opportunity - referral link ready when you are"

BODY_TMPL = (
    "Hi {name} team,\n\n"
    "Following up on my note from last week about our referral partnership for Texas notary bonds.\n\n"
    "If you're open to it, we can have your co-branded referral link set up in 24 hours -- no paperwork "
    "or integration required on your end. Your students click a link, get their $50 notary bond, and you earn $5 per bond.\n\n"
    "To get started: reply with your website URL and we'll send your custom link.\n\n"
    "Alternatively, you can view the partner program at:\n"
    "https://quantumsurety.bond/notary-school-partner\n\n"
    "Ted Sparks\n"
    "Quantum Surety Bonds | (214) 666-8718\n"
    "TDI Licensed #3480229\n"
    "Unsubscribe: reply with \"unsubscribe\"\n"
)


def main():
    if not os.path.exists(LOG_PATH):
        print(f"[{datetime.now()}] No sent log at {LOG_PATH} -- nothing to follow up.")
        return

    with open(LOG_PATH) as f:
        raw = json.load(f)

    schools = [s for s in raw if s.get("sent")]
    if not schools:
        print(f"[{datetime.now()}] No sent entries in log.")
        return

    send_date_str = schools[0].get("ts", "2026-06-15")[:10]
    send_date = date.fromisoformat(send_date_str)
    days_since = (date.today() - send_date).days

    if days_since < 7:
        print(f"[{datetime.now()}] Only {days_since} days since initial outreach -- waiting until day 7.")
        return

    print(
        f"[{datetime.now()}] {days_since} days since initial send. "
        f"Sending follow-up to {len(schools)} schools."
        + (" (DRY RUN)" if DRY_RUN else "")
    )

    ses = boto3.client(
        "ses",
        region_name="us-east-2",
        aws_access_key_id=os.environ.get("QS_AWS_KEY"),
        aws_secret_access_key=os.environ.get("QS_AWS_SECRET"),
    )

    results = []
    for school in schools:
        name = school.get("name", "")
        email = school.get("contact", "")
        if not email:
            continue
        body = BODY_TMPL.format(name=name)
        if DRY_RUN:
            print(f"  [dry-run] would send to {email} ({name})")
        else:
            try:
                ses.send_email(
                    Source=FROM_ADDR,
                    Destination={"ToAddresses": [email]},
                    Message={
                        "Subject": {"Data": SUBJECT},
                        "Body": {"Text": {"Data": body}},
                    },
                )
                print(f"  sent to {email} ({name})")
                results.append({"name": name, "email": email, "sent_at": datetime.now().isoformat()})
            except Exception as e:
                print(f"  ERROR sending to {email}: {e}")

    if not DRY_RUN:
        with open(RESULT_PATH, "w") as f:
            json.dump({"date": date.today().isoformat(), "sent": results}, f, indent=2)
        print(f"[{datetime.now()}] Done -- {len(results)} follow-ups sent.")
    else:
        print(f"[{datetime.now()}] Dry-run complete -- {len(schools)} would be emailed.")


if __name__ == "__main__":
    main()
