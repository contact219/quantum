import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// Integration point: OpenAI via Replit AI Integrations for AI Bond Finder conversational intelligence
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export async function generateAIResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const systemPrompt = `You are the Quantum Surety AI Assistant, an expert in construction surety bonds. 
Your role is to help contractors find the right bonds for their projects.

Key information to remember:
- Bid Bonds: Guarantee contractor will honor bid and enter contract if selected
- Performance Bonds: Guarantee project completion according to contract terms
- Payment Bonds: Guarantee payment to subcontractors and suppliers
- Maintenance Bonds: Guarantee correction of defects after completion

Premium ranges:
- Under $100K: 1-3% of contract value
- $100K-$500K: 1-3% of contract value
- $500K-$5M: 1-2.5% of contract value
- $5M+: 0.75-2% of contract value

Be friendly, concise, and guide users toward getting a quote.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
      ],
      max_completion_tokens: 500,
    });

    return response.choices[0]?.message?.content || "I'm here to help you find the right bond. Could you tell me more about your project?";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm having trouble processing your request right now. Please try again or contact support.";
  }
}
