/**
 * flowEngine.js
 * Responsibility: Lightweight orchestrator. Coordinates decisions by calling other modules.
 */

const FlowEngine = {
  /**
   * Orchestrates the next action based on state and request.
   * @param {Object} state - Current user state (user identity, etc.)
   * @param {string} routeRequest - The requested route/action
   * @returns {Object} { action: 'PROCEED' | 'REDIRECT', target?: string }
   */
  getFlowAction(state, routeRequest) {
    // Coordinate Lab access decision
    if (routeRequest === 'LAB') {
      const isAllowed = FlowRules.ACCESS_POLICIES.LAB(state.user);
      if (!isAllowed) {
        return { action: 'REDIRECT', target: 'HOME', reason: 'ACCESS_DENIED' };
      }
    }

    // Default: allow navigation to proceed
    return { action: 'PROCEED' };
  }
};
