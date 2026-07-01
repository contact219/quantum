import 'dotenv/config';
import { Server }               from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

import { getDealerUrgentRenewals }       from './tools/dealers.js';
import { searchCraigslistTitleListings } from './tools/craigslist.js';
import { getTxSosNewFilings }            from './tools/txsos.js';
import { checkLeadExists, insertLead }   from './tools/leads.js';

const TOOLS = [
  {
    name: 'get_dealer_urgent_renewals',
    description:
      'Returns Texas GDN auto dealer license holders whose license/bond expires '
      + 'within days_ahead days. These dealers need a $25K surety bond renewal.',
    inputSchema: {
      type: 'object',
      properties: {
        days_ahead: { type: 'number', description: 'Days ahead to look (default 60)' },
        limit:      { type: 'number', description: 'Max results (default 50)' }
      }
    }
  },
  {
    name: 'search_craigslist_title_listings',
    description:
      'Scrapes Craigslist in Texas cities for car listings mentioning "no title", '
      + '"bonded title", "lost title", etc. These sellers need a Certificate of '
      + 'Title Bond ($50-300) to transfer ownership.',
    inputSchema: {
      type: 'object',
      properties: {
        cities: {
          type: 'array',
          items: { type: 'string' },
          description: 'Craigslist city slugs (default: houston, dallas, sanantonio, austin)'
        }
      }
    }
  },
  {
    name: 'get_txsos_new_filings',
    description:
      'Queries data.texas.gov for newly registered Texas business entities '
      + '(contractors, construction cos, auto dealers) filed in the last days_back days.',
    inputSchema: {
      type: 'object',
      properties: {
        days_back: { type: 'number', description: 'Days back to search (default 14)' },
        limit:     { type: 'number', description: 'Max results (default 80)' }
      }
    }
  },
  {
    name: 'check_lead_exists',
    description: 'Returns true if this lead already exists in our CRM (90-day window). '
      + 'For TX SOS leads with no phone/email, pass name+source and it deduplicates by name.',
    inputSchema: {
      type: 'object',
      properties: {
        phone:  { type: 'string', description: 'Phone number (use for TDLR/dealer/Craigslist leads)' },
        email:  { type: 'string', description: 'Email address' },
        name:   { type: 'string', description: 'Business name (used as fallback dedup key when phone+email absent)' },
        source: { type: 'string', description: 'Lead source — required when deduping by name' }
      }
    }
  },
  {
    name: 'insert_lead',
    description:
      'Saves a new qualified lead to Quantum Surety CRM. '
      + 'Automatically triggers a personalized email + AI outbound sales call to the lead.',
    inputSchema: {
      type: 'object',
      properties: {
        name:      { type: 'string', description: 'Full name or business name' },
        email:     { type: 'string', description: 'Email address (optional)' },
        phone:     { type: 'string', description: 'Phone number (optional but preferred)' },
        bond_type: {
          type: 'string',
          enum: ['notary','contractor','dealer','title','construction','performance'],
          description: 'Bond type needed'
        },
        source:    { type: 'string', description: 'Lead source identifier' },
        notes:     { type: 'string', description: 'Additional context' }
      },
      required: ['name','bond_type','source']
    }
  }
];

const server = new Server(
  { name: 'qs-lead-gen', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;
  try {
    let result;
    switch (name) {
      case 'get_dealer_urgent_renewals':
        result = await getDealerUrgentRenewals(args); break;
      case 'search_craigslist_title_listings':
        result = await searchCraigslistTitleListings(args); break;
      case 'get_txsos_new_filings':
        result = await getTxSosNewFilings(args); break;
      case 'check_lead_exists':
        result = await checkLeadExists(args); break;
      case 'insert_lead':
        result = await insertLead(args); break;
      default:
        throw new Error('Unknown tool: ' + name);
    }
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (err) {
    return {
      content: [{ type: 'text', text: 'Error: ' + err.message }],
      isError: true
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
