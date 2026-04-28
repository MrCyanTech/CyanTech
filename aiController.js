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
    SEMICONDUCTORS: {
      keywords: ["semiconductor", "chip", "wafer", "silicon", "doping", "transistor", "pn junction"],
      responses: [
        "Our core research focuses on wide-bandgap semiconductors for high-thermal applications.",
        "Silicon is our foundation, but we are currently exploring Gallium Nitride (GaN) for next-gen power systems.",
        "A PN junction is the fundamental building block of most semiconductor devices. You can simulate one in our Simulator module."
      ]
    },
    LAB: {
      keywords: ["lab", "research", "hardware", "cleanroom", "equipment"],
      responses: [
        "The CyanTech Lab is a Class 10 cleanroom environment. Unauthorized access is strictly prohibited.",
        "Our Lab features state-of-the-art photolithography and ion implantation systems."
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
   * @returns {string} The AI's response.
   */
  getResponse(input) {
    const query = input.toLowerCase();
    const user = StateManager.getSessionUser();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 1. Identity Check
    if (query.includes("who am i") || query.includes("my name")) {
      return user ? `You are recognized as ${user}, authorized Engineer.` : "You are currently an Anonymous Guest. Please log in for full identification.";
    }

    // 2. Context Check (e.g., "where am i", "what is this place")
    if (query.includes("where am i") || query.includes("current location") || (query.includes("what") && query.includes("here"))) {
      return this.PAGE_CONTEXTS[currentPage] || "You are within the CyanTech digital ecosystem.";
    }

    // 3. Knowledge Base Matching
    for (const category in this.KNOWLEDGE) {
      if (this.KNOWLEDGE[category].keywords.some(k => query.includes(k))) {
        const options = this.KNOWLEDGE[category].responses;
        return options[Math.floor(Math.random() * options.length)];
      }
    }

    // 4. Suggestion Engine (if query is vague)
    if (query.length < 10) {
      return "I require more specific parameters. Would you like to know about our 'Semiconductor' research or access the 'Lab'?";
    }

    // 5. Default Response
    return "Query analyzed, but specific data is missing from my local archives. Try asking about Semiconductors, the Lab, or your current progress.";
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
