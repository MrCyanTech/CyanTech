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
    DURATION: 4000,
    SHOULD_SHOW_LOADING: (navType, isInitialized) => {
      // Show only on manual reload or first visit of the session
      return navType === 'reload' || (navType === 'navigate' && !isInitialized);
    }
  }
};
