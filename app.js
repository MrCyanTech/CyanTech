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

function parseMarkdown(text) {
  return text
    // Encode basic HTML entities to prevent XSS attacks
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Code Blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline Code
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Underline (Double underscore)
    .replace(/__([^_]+)__/g, '<u>$1</u>')
    // Italic (Single asterisk or single underscore)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    // Newlines
    .replace(/\n/g, '<br>');
}

function typewriteHTML(element, html, speed = 15) {
  let i = 0;
  
  function type() {
    if (i < html.length) {
      // If we hit an HTML tag, skip the entire tag instantly
      if (html[i] === '<') {
        const tagEnd = html.indexOf('>', i);
        if (tagEnd !== -1) {
          i = tagEnd + 1;
        } else {
          i++;
        }
        // Render up to the current position and immediately continue to next character
        element.innerHTML = html.slice(0, i);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        setTimeout(type, 0);
      } else {
        i++;
        element.innerHTML = html.slice(0, i);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        setTimeout(type, speed);
      }
    }
  }
  type();
}

function addMessage(text, sender, typewrite = false) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `ai-message ${sender}`;
  aiChatMessages.appendChild(msgDiv);
  
  const parsedHTML = parseMarkdown(text);
  
  if (typewrite && sender === 'ai') {
    typewriteHTML(msgDiv, parsedHTML);
  } else {
    msgDiv.innerHTML = parsedHTML;
  }
  
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  return msgDiv;
}


async function handleSendMessage() {
  const text = aiChatInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  aiChatInput.value = "";

  // Show a temporary "thinking" message
  const loadingIndicator = document.createElement("div");
  loadingIndicator.className = "ai-message ai loading-indicator";
  loadingIndicator.innerHTML = "Processing<span class='dots'>...</span>";
  aiChatMessages.appendChild(loadingIndicator);
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

  try {
    const response = await AIController.getResponse(text);
    loadingIndicator.remove(); // Remove loading state
    addMessage(response, "ai", true); // Pass true to enable typewriter effect
  } catch (error) {
    console.error("Chat Error:", error);
    loadingIndicator.remove();
    addMessage("Connection to AI core interrupted.", "ai");
  }
}


aiChatToggle.addEventListener("click", toggleChat);
closeChatBtn.addEventListener("click", toggleChat);

sendChatBtn.addEventListener("click", handleSendMessage);
aiChatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSendMessage();
});
