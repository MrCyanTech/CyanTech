// --- Loading Screen Logic ---
const initLoadingScreen = () => {
  console.log("CyanTech: Initializing loading screen...");
  const loadingScreen = document.getElementById('loading-screen');
  const progressBar = document.getElementById('progress-bar');
  const loadingPercent = document.getElementById('loading-percent');
  const loadingStatus = document.getElementById('loading-status');
  const body = document.body;

  if (!loadingScreen) {
    console.error("CyanTech: Loading screen element not found!");
    return;
  }

  // Consult FlowRules policy based on navigation type and session state
  const navType = StateManager.getNavigationType();
  const isInitialized = StateManager.getIsSystemInitialized();
  
  if (!FlowRules.LOADING_CONFIG.SHOULD_SHOW_LOADING(navType, isInitialized)) {
    console.log("CyanTech: Bypassing loading screen (Internal navigation or back button detected).");
    loadingScreen.remove();
    body.classList.remove('loading');
    return;
  }

  // Mark as initialized for future internal navigations
  StateManager.setSystemInitialized();

  const statusMessages = [
    { threshold: 0, text: "INITIALIZING SYSTEM CORE..." },
    { threshold: 20, text: "ACCESSING QUANTUM MODULES..." },
    { threshold: 45, text: "CALIBRATING NEURAL INTERFACE..." },
    { threshold: 70, text: "SYNCHRONIZING DATA CONSOLE..." },
    { threshold: 90, text: "AUTHORIZING SECURE LINK..." }
  ];

  let progress = 0;
  const duration = FlowRules.LOADING_CONFIG.DURATION;
  const interval = 30; 
  const step = 100 / (duration / interval);

  const loadingInterval = setInterval(() => {
    progress += step;
    if (progress > 100) progress = 100;

    if (progressBar) progressBar.style.width = progress + "%";
    if (loadingPercent) loadingPercent.textContent = Math.floor(progress) + "%";

    // Traditional loop for status messages (better compatibility than findLast)
    let currentStatus = statusMessages[0];
    for (let i = statusMessages.length - 1; i >= 0; i--) {
      if (progress >= statusMessages[i].threshold) {
        currentStatus = statusMessages[i];
        break;
      }
    }

    if (currentStatus && loadingStatus && loadingStatus.textContent !== currentStatus.text) {
      loadingStatus.textContent = currentStatus.text;
    }

    if (progress >= 100) {
      clearInterval(loadingInterval);
      console.log("CyanTech: Loading complete, revealing home screen...");
      
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        body.classList.remove('loading');
        
        setTimeout(() => {
          loadingScreen.remove();
          console.log("CyanTech: Loading screen removed from DOM.");
        }, 800);
      }, 500);
    }
  }, interval);
};

initLoadingScreen();

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const enterLabBtn = document.getElementById("enter-lab-btn");
const homeStatus = document.getElementById("home-status");

function setHomeStatus(message, isError = false) {
  if (homeStatus) {
    homeStatus.textContent = message;
    homeStatus.classList.toggle("error", isError);
  }
}

async function updateTopAuthState() {
  const sessionUser = await StateManager.getSessionUser();
  if (sessionUser) {
    setHomeStatus(`Logged in as ${sessionUser}.`);
    if (loginBtn) loginBtn.hidden = true;
    if (signupBtn) signupBtn.hidden = true;
    if (logoutBtn) logoutBtn.hidden = false;
    return;
  }

  if (loginBtn) loginBtn.hidden = false;
  if (signupBtn) signupBtn.hidden = false;
  if (logoutBtn) logoutBtn.hidden = true;
  setHomeStatus("Not logged in.");
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    NavigationController.navigate('AUTH', { mode: 'login', redirect: 'index.html' });
  });
}

if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    NavigationController.navigate('AUTH', { mode: 'signup', redirect: 'index.html' });
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await AuthService.logout();
    await updateTopAuthState();
  });
}

if (enterLabBtn) {
  enterLabBtn.addEventListener("click", async () => {
    const user = await StateManager.getSessionUser();
    if (FlowRules.ACCESS_POLICIES.LAB(user)) {
      NavigationController.navigate('LAB');
    } else {
      setHomeStatus(`Access denied. Log in as ${FlowRules.LAB_ALLOWED_USER} to enter the lab.`, true);
    }
  });
}

updateTopAuthState();

// --- AI Assistant Logic ---
const aiChatToggle = document.getElementById("ai-chat-toggle");
const aiChatContainer = document.getElementById("ai-chat-container");
const closeChatBtn = document.getElementById("close-chat");
const aiChatInput = document.getElementById("ai-chat-input");
const sendChatBtn = document.getElementById("send-chat");
const aiChatMessages = document.getElementById("ai-chat-messages");

function toggleChat() {
  aiChatContainer.classList.toggle("hidden");
  if (!aiChatContainer.classList.contains("hidden")) {
    aiChatInput.focus();
  }
}

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `ai-message ${sender}`;
  msgDiv.textContent = text;
  aiChatMessages.appendChild(msgDiv);
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

function handleSendMessage() {
  const text = aiChatInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  aiChatInput.value = "";

  // Simulate AI typing delay
  setTimeout(() => {
    const response = AIController.getResponse(text);
    addMessage(response, "ai");
  }, 600);
}

aiChatToggle.addEventListener("click", toggleChat);
closeChatBtn.addEventListener("click", toggleChat);

sendChatBtn.addEventListener("click", handleSendMessage);
aiChatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSendMessage();
});
