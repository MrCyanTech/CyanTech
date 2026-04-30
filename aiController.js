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

  /**
   * Generates a sophisticated response based on input, context, and state.
   * @param {string} input - The user's query.
   * @returns {Promise<string>} The AI's response.
   */
  async getResponse(input) {
    // Show a small processing log
    console.log(`[CYAN-AI] Sending query to Edge Function: "${input}"`);
    
    // Call the Supabase Edge Function via our StateManager
    const response = await StateManager.getAIResponse(input);
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
