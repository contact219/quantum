// Texas Active Franchise Taxpayers — dataset 9cir-efmm (data.texas.gov)
// Updated daily; filters by sos_charter_date to find newly registered businesses.
const DATASET  = '9cir-efmm';
const BASE_URL = 'https://data.texas.gov/resource/' + DATASET + '.json';
const SELECT   = 'taxpayer_name,taxpayer_city,taxpayer_state,taxpayer_organizational_type,sos_charter_date';

const CONTRACTOR_KEYWORDS = [
  'contractor', 'electric', 'hvac', 'plumbing', 'construction',
  'roofing', 'mechanical', 'remodeling', 'welding', 'painting contractor'
];
const DEALER_KEYWORDS = [
  'auto dealer', 'car dealer', 'motors llc', 'auto sales',
  'vehicle sales', 'used cars', 'auto group', 'motorsports'
];

export async function getTxSosNewFilings({ days_back = 14, limit = 80 } = {}) {
  const since = new Date(Date.now() - days_back * 86400000)
    .toISOString().split('T')[0] + 'T00:00:00';
  const whereClause = "sos_charter_date >= '" + since + "'";

  const seen  = new Set();
  const leads = [];

  async function queryKeyword(keyword, bondType) {
    const url = BASE_URL
      + '?$where=' + encodeURIComponent(whereClause)
      + '&$q='     + encodeURIComponent(keyword)
      + '&$limit=20'
      + '&$select=' + SELECT;
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(12000)
      });
      if (!res.ok) return;
      const rows = await res.json();
      if (!Array.isArray(rows)) return;
      for (const row of rows) {
        const name = (row.taxpayer_name || '').trim();
        if (!name || seen.has(name)) continue;
        seen.add(name);
        leads.push({
          name,
          city:        row.taxpayer_city  || '',
          state:       row.taxpayer_state || 'TX',
          entity_type: row.taxpayer_organizational_type || '',
          charter_date: (row.sos_charter_date || '').slice(0, 10),
          bond_type:   bondType,
          source:      'txsos-new-filing',
          notes:       'New TX entity via SOS: ' + (row.taxpayer_organizational_type || '') + ' chartered ' + (row.sos_charter_date || '').slice(0, 10)
        });
      }
    } catch (_) { /* skip on timeout or error */ }
  }

  // Run contractor and dealer keyword searches in parallel batches
  const contractorJobs = CONTRACTOR_KEYWORDS.map(kw => queryKeyword(kw, 'contractor'));
  const dealerJobs     = DEALER_KEYWORDS.map(kw => queryKeyword(kw, 'dealer'));
  await Promise.all([...contractorJobs, ...dealerJobs]);

  return leads.slice(0, limit);
}
