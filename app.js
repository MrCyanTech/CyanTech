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

function updateTopAuthState() {
  const sessionUser = FlowEngine.getSessionUser();
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
    FlowEngine.navigate('AUTH', { mode: 'login', redirect: 'index.html' });
  });
}

if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    FlowEngine.navigate('AUTH', { mode: 'signup', redirect: 'index.html' });
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    FlowEngine.clearSessionUser();
    updateTopAuthState();
  });
}

if (enterLabBtn) {
  enterLabBtn.addEventListener("click", () => {
    if (FlowEngine.canAccessLab()) {
      FlowEngine.navigate('LAB');
    } else {
      setHomeStatus(`Access denied. Log in as ${FlowEngine.LAB_ALLOWED_USER} to enter the lab.`, true);
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

const AI_RESPONSES = {
  "default": "I'm sorry, I don't have information on that specific topic. Try asking about CyanTech, the Lab, COSMOS, or Semiconductor simulation.",
  "greetings": ["hello", "hi", "hey", "greetings"],
  "cyan": {
    keywords: ["cyantech", "what is", "about"],
    response: "CyanTech is a next-generation platform for semiconductor and systems engineering, specializing in high-performance computing and space-grade hardware."
  },
  "lab": {
    keywords: ["lab", "enter", "access"],
    response: "The Lab is where our core research happens. Access is restricted to authorized personnel. Click 'Enter Lab' to check your permissions."
  },
  "cosmos": {
    keywords: ["cosmos", "notes"],
    response: "COSMOS (Coordinated Space Microchip Operating System) notes detail our progress in radiation-hardened chip design."
  },
  "sim": {
    keywords: ["sim", "simulation", "semiconductor"],
    response: "Our Semiconductor Sim tool allows for real-time modeling of electron transport and thermal characteristics in advanced silicon architectures."
  }
};

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

function getAIResponse(input) {
  const query = input.toLowerCase();
  
  if (AI_RESPONSES.greetings.some(g => query.includes(g))) {
    return "Greetings! How can I assist your engineering research today?";
  }
  
  for (const key in AI_RESPONSES) {
    if (key === "default" || key === "greetings") continue;
    if (AI_RESPONSES[key].keywords.some(k => query.includes(k))) {
      return AI_RESPONSES[key].response;
    }
  }
  
  return AI_RESPONSES.default;
}

function handleSendMessage() {
  const text = aiChatInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  aiChatInput.value = "";

  // Simulate AI typing delay
  setTimeout(() => {
    const response = getAIResponse(text);
    addMessage(response, "ai");
  }, 600);
}

aiChatToggle.addEventListener("click", toggleChat);
closeChatBtn.addEventListener("click", toggleChat);

sendChatBtn.addEventListener("click", handleSendMessage);
aiChatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSendMessage();
});
