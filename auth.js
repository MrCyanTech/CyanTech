/**
 * auth.js
 * Responsibility: Handles ALL authentication logic (login, logout, session validation).
 */

const AuthService = {
  /**
   * Validates credentials and sets session if successful.
   */
  async login(username, password) {
    // If username is an email, use Supabase, otherwise fallback to local users
    if (username.includes("@")) {
      const result = await StateManager.signIn(username, password);
      if (result.success) {
        return { success: true, username: result.user.email };
      }
      return { success: false, error: result.error };
    }

    // Legacy Fallback
    const users = StateManager.getUsers();
    const storedPassword = users[username];

    if (storedPassword && storedPassword === password) {
      StateManager.setSessionUser(username);
      return { success: true, username };
    }
    return { success: false, error: "Invalid username or password" };
  },

  /**
   * Registers a new user and sets session.
   */
  async signup(username, password) {
    if (username.includes("@")) {
      const result = await StateManager.signUp(username, password);
      if (result.success) {
        return { success: true, username: result.user.email };
      }
      return { success: false, error: result.error };
    }

    // Legacy Fallback
    const users = StateManager.getUsers();
    if (users[username]) {
      return { success: false, error: "Username already exists" };
    }

    users[username] = password;
    StateManager.saveUsers(users);
    StateManager.setSessionUser(username);
    return { success: true, username };
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
