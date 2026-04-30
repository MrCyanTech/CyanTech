/**
 * stateManager.js
 * Responsibility: Handles ALL user state management (session persistence, identity).
 * Integration: Supabase (Minimalist)
 */

// --- Supabase Initialization ---
// Replace with your actual credentials
const SUPABASE_URL = "https://fbjolvsdacofrpajpzqm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiam9sdnNkYWNvZnJwYWpwenFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTU4NzAsImV4cCI6MjA5MjU3MTg3MH0.kMldTBWcmdk_l_izQ9g51kdc3czOOJEIKT_FYJxuUys";

let supabaseClient;
try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("CyanTech: Supabase client initialized.");
  } else {
    console.warn("CyanTech: Supabase SDK not found. Falling back to local storage.");
  }
} catch (e) {
  console.error("CyanTech: Failed to initialize Supabase", e);
}

const StateManager = {
  STORAGE_SESSION_KEY: "cyantechSessionUser",

  /**
   * Returns the current session user from Supabase.
   */
  async getSessionUser() {
    if (supabaseClient) {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        // Check for full_name (which populates the Dashboard column), then username
        return session.user.user_metadata?.full_name || session.user.user_metadata?.username || session.user.email;
      }
    }
    return null;
  },

  async signUp(email, password, username = "") {
    if (!supabaseClient) return { success: false, error: "Supabase not initialized" };
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          full_name: username // Supabase Dashboard looks for this specific key to fill the "Display Name" column
        }
      }
    });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  },

  async signIn(email, password) {
    if (!supabaseClient) return { success: false, error: "Supabase not initialized" };
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  },

  /**
   * Clears the current Supabase session.
   */
  async clearSessionUser() {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
  },

  /**
   * Invokes the Supabase Edge Function to get an AI response.
   */
  async getAIResponse(message) {
    if (!supabaseClient) return "Error: AI services are currently disconnected.";

    try {
      // NOTE: Ensure your Edge Function in Supabase is named exactly 'chat' or update the name below
      const { data, error } = await supabaseClient.functions.invoke('chat', {
        body: { message }
      });

      if (error) throw error;
      return data.response || "No response received from AI core.";
    } catch (e) {
      console.error("AI Function Error:", e);
      return "Communication error with AI core. Please try again later.";
    }
  },

  // --- Loading & Initialization State ---
  STORAGE_LOADED_KEY: "cyantechSystemLoaded",

  getIsSystemInitialized() {
    return sessionStorage.getItem(this.STORAGE_LOADED_KEY) === 'true';
  },

  setSystemInitialized() {
    sessionStorage.setItem(this.STORAGE_LOADED_KEY, 'true');
  },

  getNavigationType() {
    const entries = performance.getEntriesByType("navigation");
    if (entries.length > 0) {
      return entries[0].type; // 'navigate', 'reload', 'back_forward', etc.
    }
    return 'navigate';
  }
};
