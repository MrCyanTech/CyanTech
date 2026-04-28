/**
 * flowRules.js
 * Responsibility: Contains ALL progression logic, module definitions, and access rules.
 * Purely declarative (data + rule definitions).
 */

const FlowRules = {
  // Constants
  LAB_ALLOWED_USER: "MrCyanTech",

  // Feature Access Policies
  ACCESS_POLICIES: {
    LAB: (user) => {
      // Logic for Lab access progression
      // Currently unrestricted per latest requirements, but centralized here.
      return true; 
    },
    SIMULATION: (user) => {
      return true; // Unrestricted
    }
  },

  // Progression Milestones (Future proofing)
  STEPS: {
    INTRO_LAB_START: "Initializing systems...",
    INTRO_LAB_MID: "Journey mastering semiconductors...",
    INTRO_LAB_END: "Under construction message."
  },

  // Loading Screen Configuration
  LOADING_CONFIG: {
    INITIAL_DURATION: 4000,
    RETURNING_DURATION: 2000
  }
};
