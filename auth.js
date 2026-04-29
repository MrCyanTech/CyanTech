/**
 * auth.js
 * Responsibility: Handles ALL authentication logic (login, logout, session validation).
 */

const AuthService = {
  /**
   * Validates credentials and sets session if successful.
   */
  async login(username, password) {
    const result = await StateManager.signIn(username, password);
    if (result.success) {
      return { success: true, username: result.user.email };
    }
    return { success: false, error: result.error };
  },

  /**
   * Registers a new user and sets session.
   */
  async signup(email, password, username = "") {
    const result = await StateManager.signUp(email, password, username);
    if (result.success) {
      return { success: true, username: result.user.email };
    }
    return { success: false, error: result.error };
  },

  /**
   * Terminates the current session.
   */
  async logout() {
    await StateManager.clearSessionUser();
  },

  /**
   * Checks if a session is currently active.
   */
  async isAuthenticated() {
    return !!(await StateManager.getSessionUser());
  }
};
