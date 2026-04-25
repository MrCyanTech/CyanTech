const STORAGE_SESSION_KEY = "cyantechSessionUser";
const LAB_ALLOWED_USER = "MrCyanTech";
const LAB_PAGE_PATH = "enter-lab.html";
const AUTH_PAGE_PATH = "auth.html";

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const enterLabBtn = document.getElementById("enter-lab-btn");
const homeStatus = document.getElementById("home-status");

function clearSessionUser() {
  localStorage.removeItem(STORAGE_SESSION_KEY);
}

function getSessionUser() {
  return localStorage.getItem(STORAGE_SESSION_KEY);
}

function setHomeStatus(message, isError = false) {
  homeStatus.textContent = message;
  homeStatus.classList.toggle("error", isError);
}

function updateTopAuthState() {
  const sessionUser = getSessionUser();
  if (sessionUser) {
    setHomeStatus(`Logged in as ${sessionUser}.`);
    loginBtn.hidden = true;
    signupBtn.hidden = true;
    logoutBtn.hidden = false;
    return;
  }

  loginBtn.hidden = false;
  signupBtn.hidden = false;
  logoutBtn.hidden = true;
  setHomeStatus("Not logged in.");
}

loginBtn.addEventListener("click", () => {
  window.location.href = `${AUTH_PAGE_PATH}?mode=login&redirect=index.html`;
});

signupBtn.addEventListener("click", () => {
  window.location.href = `${AUTH_PAGE_PATH}?mode=signup&redirect=index.html`;
});

logoutBtn.addEventListener("click", () => {
  clearSessionUser();
  updateTopAuthState();
});


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
