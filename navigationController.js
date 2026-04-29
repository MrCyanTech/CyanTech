/**
 * navigationController.js
 * Responsibility: Handles ALL navigation behavior and route mapping.
 */

const NavigationController = {
  // Route Registry (Centralized mapping of keys to physical files)
  ROUTES: {
    HOME: "index.html",
    AUTH: "auth.html",
    LAB: "enter-lab.html",
    CONTACT: "contact.html",
    INTRO_LAB: "intro-lab.html",
    SEMICONDUCTOR_SIM: "semiconductor-sim.html",
    SIM_PLACEHOLDER: "sim-placeholder.html",
    PROGRESS_LOG: "progress-log.html",
    UNDER_DEVELOPMENT: "under-development.html",
    LAB_CONSTRUCTION: "lab-construction.html"
  },

  /**
   * Executes navigation after consulting the FlowEngine.
   * @param {string} routeKey - Key from ROUTES or direct URL.
   * @param {Object} params - Query parameters.
   */
  async navigate(routeKey, params = {}) {
    // 1. Prepare current state for decision making
    const currentUser = await StateManager.getSessionUser();
    const state = {
      user: currentUser,
      isAuthenticated: !!currentUser
    };

    // 2. Consult FlowEngine for permission/redirection
    const flowResult = FlowEngine.getFlowAction(state, routeKey);
    
    let targetKey = routeKey;
    if (flowResult.action === 'REDIRECT') {
      targetKey = flowResult.target;
    }

    // 3. Resolve final URL
    let url = this.ROUTES[targetKey] || targetKey;
    
    // 4. Append parameters
    const query = new URLSearchParams(params).toString();
    if (query) {
      url += (url.includes('?') ? '&' : '?') + query;
    }

    // 5. Execute side effect (navigation)
    window.location.href = url;
  },

  /**
   * Shorthand for returning to the main dashboard.
   */
  goHome() {
    this.navigate('HOME');
  }
};
