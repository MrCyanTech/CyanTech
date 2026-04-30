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
    console.log(`[CYAN-AI] Sending query to Edge Function: "${input}"`);
    
    // Gather rich context from the frontend
    const user = await StateManager.getSessionUser();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageDescription = this.PAGE_CONTEXTS[currentPage] || "You are within the CyanTech digital ecosystem.";
    
    // Pass a heavily enriched context object so the backend AI knows exactly what is going on
    const response = await StateManager.getAIResponse(input, {
      currentPage: currentPage,
      pageDescription: pageDescription,
      userStatus: user ? `Authorized Engineer (ID: ${user})` : 'Unidentified Guest',
      platformInfo: `
CyanTech is an advanced engineering environment specialized in semiconductor research and space-grade systems. Tone should be concise, professional, and sci-fi high-tech.
AVAILABLE PLATFORM NAVIGATION OPTIONS:
1. Enter Lab: The main entry point to the secure research laboratory.
2. Semiconductor Sim: A simulation environment to model hardware characteristics before physical fabrication.
3. Progress Log: A tracking system documenting every milestone achieved during the engineering session.
4. Data Console: Advanced telemetry and data visualization (Currently Under Development).
5. Platform Info: Detailed specifications of the CyanTech architecture (Currently Under Development).
6. Contact Us: Communication relay to reach the CyanTech administrative team.
      `.trim()
    });
    
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
