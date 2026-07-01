#!/usr/bin/env node
/**
 * Quantum Surety autonomous lead gen agent.
 * Cron: 30 7 * * 1-5  (7:30 AM CDT weekdays)
 */
import 'dotenv/config';
import Anthropic                from '@anthropic-ai/sdk';
import { Client }               from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath }        from 'url';
import path                     from 'path';
import fs                       from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE  = '/var/log/qs-lead-gen.log';
const MAX_INSERTS_PER_SESSION = 80;  // voice agent enforces 10/day server-side; this is just DB insert cap
const TOOL_TIMEOUT_MS = 150000;      // 2.5 min for slow tools like craigslist

function log(msg) {
  const line = '[' + new Date().toISOString() + '] ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch (_) {}
}

const SYSTEM_PROMPT = `You are the autonomous lead generation agent for Quantum Surety, LLC
(quantumsurety.bond) — a Texas surety bond company.

MISSION: Every session, find net-new leads who need surety bonds right now, verify they are
not already in the CRM, and insert qualified ones. Run ALL three source tools every session.

BOND TYPES WE SELL:
- dealer: TX GDN dealer bond ($100+/yr) — auto dealers, used car lots
- title: Certificate of Title Bond ($50-300) — people with car title problems
- notary: TX Notary Bond ($50 flat) — notary commission holders

NOTE: TDLR contractor renewal lead generation is paused (2026-07-01) — no traction from
contractor outbound calls, resources redirected elsewhere. Do not call any TDLR contractor
tool even if one appears available.

WORKFLOW — follow exactly in this order:
1. Call get_dealer_urgent_renewals(days_ahead=60)
2. Call search_craigslist_title_listings()
3. Call get_txsos_new_filings(days_back=14)
4. INSERT BUDGET — respect these per-source caps (ensures all verticals are represented).
   Contractor budget was reallocated to dealer + title (2026-07-01):
   - GDN dealer renewals:       max 33 inserts
   - Craigslist title listings: max 27 inserts
   - TX SOS new filings:        max 20 inserts
   For each result in each source:
   a. Check quality: dealers/Craigslist need name + (phone OR email); TX SOS needs name only
   b. Call check_lead_exists(phone, email, name, source)
   c. If false AND source budget not exhausted → call insert_lead(...)
   d. Once a source's budget is hit, skip remaining results from that source and move to the next
   e. Skip any TX SOS result where row.bond_type is 'contractor' — we are not generating contractor leads right now
5. End with a plain-text summary: total checked, total inserted, breakdown by bond_type.

LEAD QUALITY RULES:
- Dealers: business_name→name, phone→phone; bond_type=dealer; source='gdn_urgent_renewals'
- Craigslist: extract phone from listing text; use listing title as name; bond_type=title; source='craigslist-title'
- TX SOS: entity name as name; use row.bond_type (dealer only — skip contractor); city if available; source='txsos-new-filing'; NO phone/email — insert anyway, these are outbound research leads
- Keep notes under 200 chars`;

async function main() {
  log('=== Lead gen session starting ===');

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const transport = new StdioClientTransport({
    command: 'node',
    args: [path.join(__dirname, 'mcp-server.js')],
    env: { ...process.env }
  });

  const mcpClient = new Client({ name: 'qs-agent', version: '1.0.0' });
  await mcpClient.connect(transport);
  log('MCP connected — listing tools');

  const { tools: mcpTools } = await mcpClient.listTools();
  log('Tools: ' + mcpTools.map(t => t.name).join(', '));

  const claudeTools = mcpTools.map(t => ({
    name: t.name,
    description: t.description,
    input_schema: t.inputSchema
  }));

  const messages = [{
    role: 'user',
    content: 'Run the full lead generation session now. Process all four sources and insert all new qualified leads (cap at ' + MAX_INSERTS_PER_SESSION + ' inserts).'
  }];

  let iterations = 0;
  while (iterations < 80) {
    iterations++;
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages,
      tools: claudeTools
    });

    messages.push({ role: 'assistant', content: response.content });

    const toolUses = response.content.filter(b => b.type === 'tool_use');
    if (toolUses.length) log('Calling: ' + toolUses.map(t => t.name).join(', '));

    if (response.stop_reason === 'end_turn' || toolUses.length === 0) {
      const finalText = response.content.find(b => b.type === 'text');
      if (finalText) log('SUMMARY: ' + finalText.text);
      break;
    }

    const toolResults = [];
    for (const tu of toolUses) {
      try {
        const res = await mcpClient.callTool(
          { name: tu.name, arguments: tu.input },
          undefined,
          { timeout: TOOL_TIMEOUT_MS }
        );
        const text = (res.content?.[0]?.text) || JSON.stringify(res);
        log(tu.name + ' → ' + text.length + ' chars');
        toolResults.push({ type: 'tool_result', tool_use_id: tu.id, content: text });
      } catch (err) {
        log('ERROR ' + tu.name + ': ' + err.message);
        toolResults.push({
          type: 'tool_result', tool_use_id: tu.id,
          content: 'Error: ' + err.message, is_error: true
        });
      }
    }
    messages.push({ role: 'user', content: toolResults });
  }

  await mcpClient.close();
  log('=== Session complete ===');
}

main().catch(err => { log('FATAL: ' + err.message); process.exit(1); });
