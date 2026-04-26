/**
 * flowEngine.js
 * Centralized navigation and progression logic for CyanTech.
 */

const FlowEngine = {
  // Session Constants
  STORAGE_SESSION_KEY: "cyantechSessionUser",
  LAB_ALLOWED_USER: "MrCyanTech",

  // Route Registry
  ROUTES: {
    HOME: "index.html",
    AUTH: "auth.html",
    LAB: "enter-lab.html",
    CONTACT: "contact.html",
    INTRO_LAB: "intro-lab.html",
    SEMICONDUCTOR_SIM: "semiconductor-sim.html",
    SIM_PLACEHOLDER: "sim-placeholder.html",
    UNDER_DEVELOPMENT: "under-development.html",
    LAB_CONSTRUCTION: "lab-construction.html"
  },

  /**
   * Centralized navigation wrapper.
   * @param {string} routeName - Key from ROUTES or a direct URL.
   * @param {Object} params - Query parameters to append.
   */
  navigate(routeName, params = {}) {
    let url = this.ROUTES[routeName] || routeName;
    
    // Check if it's a known route key or a direct path
    if (!this.ROUTES[routeName] && !routeName.includes('.html')) {
        console.warn(`Route "${routeName}" not found in registry. Falling back to direct string.`);
    }

    const query = new URLSearchParams(params).toString();
    if (query) {
      url += (url.includes('?') ? '&' : '?') + query;
    }
    
    window.location.href = url;
  },

  /**
   * Helper to go back to home.
   */
  goHome() {
    this.navigate('HOME');
  },

  /**
   * Session Management
   */
  getSessionUser() {
    return localStorage.getItem(this.STORAGE_SESSION_KEY);
  },

  clearSessionUser() {
    localStorage.removeItem(this.STORAGE_SESSION_KEY);
  },

  isLoggedIn() {
    return !!this.getSessionUser();
  },

  /**
   * Progression/Access Logic
   */
  canAccessLab() {
    const user = this.getSessionUser();
    // Currently unrestricted by requirement, but centralizing the check here
    // allows for easy future enforcement (e.g., return user === this.LAB_ALLOWED_USER)
    return true; 
  }
};
