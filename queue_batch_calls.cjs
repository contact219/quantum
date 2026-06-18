#!/usr/bin/env node
const leads = [
  { name: 'Amanda Ragsdale', email: 'amandaragsdale@alphaomegahospice.com', phone: '13256410441', bond_type: 'notary' },
  { name: 'Sandra Jordan', email: 'sgj@atlassiteservices.com', phone: '5128480994', bond_type: 'notary' },
  { name: 'Nancy Zapata-Meandro', email: 'nrzrealestate@sbcglobal.net', phone: '8305913958', bond_type: 'notary' },
  { name: 'Bob Nguyen', email: 'bobnguyenaccounting@comcast.net', phone: '8324880857', bond_type: 'notary' },
  { name: 'Jackqulin Bush', email: 'jaccqque2002@yahoo.com', phone: '9034245049', bond_type: 'notary' },
  { name: 'Brianna Samaniego', email: 'samaniego_brianna505@yahoo.com', phone: '9154789140', bond_type: 'notary' },
  { name: 'Samantha Cantu', email: 'samantha@apc-law.com', phone: '19562036551', bond_type: 'notary' },
  { name: 'Reynold Berra', email: 'renberra@sbcglobal.net', phone: '5127514949', bond_type: 'notary' },
  { name: 'Steve Nunez', email: 'stevenunez@aol.com', phone: '9562860948', bond_type: 'notary' },
  { name: 'Darkisha Becknell', email: 'darkishabecknell@yahoo.com', phone: '2816202680', bond_type: 'notary' },
  { name: 'Guadalupe Gonzalez', email: 'luper12@aol.com', phone: '9564571868', bond_type: 'notary' },
  { name: 'Dale Evere', email: 'dale.evers@yahoo.com', phone: '2547222157', bond_type: 'notary' },
];

const SECRET = '4aa5c579a3cedbf298b5f6717e385e63';

async function main() {
  let queued = 0;
  for (const lead of leads) {
    try {
      const res = await fetch('https://voice-agent.permitpilot.online/outbound-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Outbound-Secret': SECRET },
        body: JSON.stringify(lead)
      });
      const data = await res.json();
      if (data.queued) { console.log(`  Queued: ${lead.name}`); queued++; }
      else console.log(`  Skip (${data.reason}): ${lead.name}`);
    } catch (e) {
      console.error(`  FAIL ${lead.name}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`Done. Queued ${queued}/${leads.length} outbound calls.`);
}
main();
