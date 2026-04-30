/**
 * aiController.js
 * Responsibility: Centralized intelligence for the CYAN-AI Assistant.
 * Handles intent parsing, context-aware responses, and action suggestions.
 */

const AIController = {
  // --- Knowledge Base ---
  KNOWLEDGE: {
    PLATFORM: {
      keywords: ["cyantech", "what is this", "platform", "plastech"],
      responses: [
        "CyanTech is an advanced engineering environment specialized in semiconductor research and space-grade systems.",
        "You are currently accessing the CyanTech Coordinated Engineering Platform. We specialize in radiation-hardened hardware."
      ]
    },
    GREETINGS: {
      keywords: ["hello", "hi", "hey", "greetings", "yo"],
      responses: [
        "Greetings, Engineer. How can I assist your research today?",
        "System online. Ready for technical queries.",
        "Hello. I am CYAN-AI. Monitoring all systems."
      ]
    }
  },

  // --- Contextual Responses ---
  PAGE_CONTEXTS: {
    "index.html": "You are currently at the Command Center. From here, you can access the Lab, Simulation, or check your Progress Log.",
    "semiconductor-sim.html": "This is the Simulation Environment. You can model hardware characteristics here before physical fabrication.",
    "progress-log.html": "You are viewing the Progress Log. This documents every milestone achieved during your engineering session.",
    "enter-lab.html": "Welcome to the Lab Access Terminal. Please ensure all safety protocols are synchronized.",
    "auth.html": "You are at the Secure Authorization gateway. Identity verification is required for full system access."
  },

  async getResponse(input) {
    // 1. Gather Current Context
    const user = await StateManager.getSessionUser();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageContext = this.PAGE_CONTEXTS[currentPage] || "You are within the CyanTech digital ecosystem.";

    // 2. Construct a "Frontend System Prompt"
    // Since we can't easily modify the Edge Function right now, we inject the persona directly into the message.
    const enrichedPrompt = `
[SYSTEM CONTEXT - HIDDEN FROM USER]
You are CYAN-AI, the central intelligence assistant for the CyanTech Coordinated Engineering Platform.
CyanTech is an advanced engineering environment specialized in semiconductor research and space-grade systems.
Current User Status: ${user ? `Authorized Engineer (ID: ${user})` : 'Unidentified Guest'}
User's Current Location: ${pageContext}
Instructions: Respond concisely in a professional, high-tech engineering tone. Do NOT mention the system context block. Use markdown formatting.

[USER QUERY]
${input}
`.trim();

    console.log(`[CYAN-AI] Sending enriched query to Edge Function for: "${input}"`);
    
    // Call the Supabase Edge Function with the context-aware prompt
    const response = await StateManager.getAIResponse(enrichedPrompt);
    return response;
  },

  /**
   * AI can proactively suggest an action based on context.
   */
  getSuggestion() {
    const user = StateManager.getSessionUser();
    if (!user) return "Recommendation: Proceed to Authorization for full system access.";
    return "Recommendation: Check the Semiconductor Simulator for the latest research modules.";
  }
};
