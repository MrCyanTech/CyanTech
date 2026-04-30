/**
 * aiController.js
 * Responsibility: Centralized intelligence for the Saartche Assistant.
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
        "Hello. I am Saartche. Monitoring all systems."
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
    console.log(`[Saartche] Sending query: "${input}"`);

    const user = await StateManager.getSessionUser();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageDescription = this.PAGE_CONTEXTS[currentPage] || "Unknown page.";

    const response = await StateManager.getAIResponse(input, {
      systemPrompt: [
        "You are Saartche, a strict in-app assistant for the CyanTech platform.",
        "Help users navigate and use THIS app only.",
        "Only use information explicitly provided below. Never invent features, buttons, or pages.",
        "If something is not known, say: I don't have that information. Can you clarify?",
        "Be concise and structured. Use numbered steps for actions. Keep responses under 10 lines.",
        "Do not be chatty. Do not tell stories. Do not add suggestions unless asked.",
        "Tone: calm, professional, instructional."
      ].join(" "),
      currentPage: currentPage,
      pageDescription: pageDescription,
      user: user ? { loggedIn: true, displayName: user } : { loggedIn: false },
      appPages: {
        "Enter Lab": "Opens the secure research laboratory entry point.",
        "Semiconductor Sim": "Opens a simulation environment to model hardware characteristics before fabrication.",
        "Progress Log": "Opens a tracker documenting milestones achieved during the session.",
        "Data Console": "Under development. Not yet available.",
        "Platform Info": "Under development. Not yet available.",
        "Contact Us": "Opens a communication page to reach the CyanTech team.",
        "Log In": "Opens the authentication page to sign into an existing account.",
        "Sign Up": "Opens the authentication page to create a new account.",
        "Log Out": "Signs the current user out and clears the session."
      }
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
