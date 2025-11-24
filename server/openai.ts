import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// Integration point: OpenAI via Replit AI Integrations for AI Bond Finder conversational intelligence
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

// Hardcoded expert recommendations for specific scenarios
const expertResponses: Record<string, string> = {
  "dock": `For a private residential dock project, here's what you likely need:

✅ **Performance Bond (Most Common)**
Purpose: Guarantees you'll complete the dock according to specifications
Required If: Homeowner is financing, concerned about quality, or contract is $50K+
Premium: 1.5-2.5% of contract value
Covers: Incomplete work, poor construction, not meeting specs

✅ **Payment Bond (If Using Subcontractors)**
Purpose: Guarantees you'll pay suppliers and subs (prevent mechanic's liens on their property)
Required If: You're hiring concrete crews, welders, carpenters, electricians, etc.
Premium: 1-2% of contract value
Common In: Texas (TX allows mechanic's liens)

❌ **Bid Bond** 
NOT needed for private residential work

❌ **License Bond**
NOT required for private dock building unless county requires it near public waterways

💡 **Bottom Line**: Most likely Performance Bond minimum. Add Payment Bond if using subs. Which applies to your situation?`,

  "government": `For government construction projects, you ALWAYS need all three bonds:

✅ **Bid Bond** (Mandatory)
Guarantees you'll honor your bid and enter the contract
1-3% of bid amount

✅ **Performance Bond** (Mandatory)
Guarantees project completion per contract
1-3% of contract value

✅ **Payment Bond** (Mandatory)
Guarantees payment to subs, suppliers, and workers
1-2% of contract value

⚠️ **Government bonds are NOT optional** - these are required by federal, state, county, or city regulations.

What's your estimated project value and location?`,
};

export async function generateAIResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    // Check for common keywords in user messages
    const lastUserMessage = messages.reverse().find(m => m.role === "user")?.content.toLowerCase() || "";
    
    // Check for dock/waterfront projects
    if ((lastUserMessage.includes("dock") || lastUserMessage.includes("waterfront") || lastUserMessage.includes("boat")) && lastUserMessage.includes("home")) {
      return expertResponses.dock;
    }
    
    // Check for government projects
    if (lastUserMessage.includes("government") || lastUserMessage.includes("city") || lastUserMessage.includes("county") || lastUserMessage.includes("federal") || lastUserMessage.includes("state project")) {
      return expertResponses.government;
    }

    const systemPrompt = `You are the Quantum Surety AI Assistant, an expert in construction surety bonds.

Be specific and actionable. For each recommendation:
1. Say what bond they likely need with ✅ or ❌
2. Explain WHY (purpose, legal requirement, protection)
3. Give premium ranges based on their project size
4. Ask clarifying questions about: project type (gov vs private), cost, subs, financing

Bond Summary:
- BID BOND: Government bids only (0.5-2% of bid)
- PERFORMANCE BOND: Most common - guarantees completion (1-3% of contract)
- PAYMENT BOND: Protects subs/suppliers (1-2% of contract)
- MAINTENANCE BOND: Post-completion defects (0.5-1%)
- LICENSE BOND: Some states for contractors ($1000-5000/yr)

Key Rules:
- GOVERNMENT WORK: Bid + Performance + Payment (ALL THREE, always required)
- PRIVATE RESIDENTIAL: Performance if high-value, lender-financed, or owner requests
- PRIVATE COMMERCIAL: Performance + Payment if over $25K
- PRIVATE RESIDENTIAL UNDER $50K: Usually no bonds needed
- Using subcontractors? Add Payment Bond

Be conversational, specific, and guide toward getting a quote.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
      ],
      max_completion_tokens: 600,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content || content.trim().length < 50) {
      console.warn("Short/empty response from OpenAI API", { content });
      // Return a helpful default if the AI doesn't give a good response
      return "I can help you find the right bond! To give you the best recommendation, could you tell me:\n1. Is this a government project or private work?\n2. What's your estimated project value?\n3. Will you be using subcontractors?\n4. What state are you in?\n\nThat'll help me guide you to the exact bonds you need.";
    }
    
    return content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm having trouble connecting to our AI service right now. Please try again in a moment or contact support.";
  }
}
