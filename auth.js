/**
 * auth.js
 * Responsibility: Handles ALL authentication logic (login, logout, session validation).
 */

const AuthService = {
  /**
   * Validates credentials and sets session if successful.
   */
  login(username, password) {
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
  signup(username, password) {
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
  logout() {
    StateManager.clearSessionUser();
  },

  /**
   * Checks if a session is currently active.
   */
  isAuthenticated() {
    return !!StateManager.getSessionUser();
  }
};
