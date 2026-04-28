/**
 * stateManager.js
 * Responsibility: Handles ALL user state management (session persistence, identity).
 */

const StateManager = {
  STORAGE_SESSION_KEY: "cyantechSessionUser",
  STORAGE_USERS_KEY: "cyantechUsers",

  getSessionUser() {
    return localStorage.getItem(this.STORAGE_SESSION_KEY);
  },

  setSessionUser(username) {
    localStorage.setItem(this.STORAGE_SESSION_KEY, username);
  },

  clearSessionUser() {
    localStorage.removeItem(this.STORAGE_SESSION_KEY);
  },

  getUsers() {
    try {
      const usersRaw = localStorage.getItem(this.STORAGE_USERS_KEY);
      return usersRaw ? JSON.parse(usersRaw) : {};
    } catch (e) {
      console.error("Failed to parse users from storage", e);
      return {};
    }
  },

  saveUsers(users) {
    localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(users));
  },

  // --- Loading & Initialization State ---
  STORAGE_LOADED_KEY: "cyantechSystemLoaded",

  getIsSystemInitialized() {
    return sessionStorage.getItem(this.STORAGE_LOADED_KEY) === 'true';
  },

  setSystemInitialized() {
    sessionStorage.setItem(this.STORAGE_LOADED_KEY, 'true');
  }
};
