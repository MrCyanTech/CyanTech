const STORAGE_USERS_KEY = "cyantechUsers";
const STORAGE_SESSION_KEY = "cyantechSessionUser";

const authTitle = document.getElementById("auth-title");
const authForm = document.getElementById("auth-form");
const authSubmit = document.getElementById("auth-submit");
const authStatus = document.getElementById("auth-status");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const switchLoginBtn = document.getElementById("switch-login-btn");
const switchSignupBtn = document.getElementById("switch-signup-btn");

const queryParams = new URLSearchParams(window.location.search);
const redirectPath = queryParams.get("redirect") || "index.html";
let authMode = queryParams.get("mode") === "signup" ? "signup" : "login";

function getUsers() {
  try {
    const usersRaw = localStorage.getItem(STORAGE_USERS_KEY);
    return usersRaw ? JSON.parse(usersRaw) : {};
  } catch (error) {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function setSessionUser(username) {
  localStorage.setItem(STORAGE_SESSION_KEY, username);
}

function setStatus(message, isError = false) {
  authStatus.textContent = message;
  authStatus.classList.toggle("error", isError);
}

function goBackAfterAuth() {
  window.location.href = redirectPath;
}

function updateMode(mode) {
  authMode = mode;
  const isLogin = mode === "login";
  authTitle.textContent = isLogin ? "Log In" : "Sign Up";
  authSubmit.textContent = isLogin ? "Log In" : "Create Account";
  passwordInput.autocomplete = isLogin ? "current-password" : "new-password";
  setStatus(
    isLogin
      ? "Enter your credentials to log in."
      : "Create a test account for this browser."
  );
}

switchLoginBtn.addEventListener("click", () => {
  updateMode("login");
});

switchSignupBtn.addEventListener("click", () => {
  updateMode("signup");
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    setStatus("Username and password are required.", true);
    return;
  }

  const users = getUsers();
  const existingPassword = users[username];

  if (authMode === "signup") {
    if (existingPassword) {
      setStatus("That username already exists. Try logging in.", true);
      return;
    }

    users[username] = password;
    saveUsers(users);
    setSessionUser(username);
    setStatus(`Account created. Redirecting as ${username}...`);
    setTimeout(goBackAfterAuth, 350);
    return;
  }

  if (!existingPassword || existingPassword !== password) {
    setStatus("Invalid username or password.", true);
    return;
  }

  setSessionUser(username);
  setStatus(`Welcome back, ${username}. Redirecting...`);
  setTimeout(goBackAfterAuth, 350);
});

updateMode(authMode);
const STORAGE_USERS_KEY = "cyantechUsers";
const STORAGE_SESSION_KEY = "cyantechSessionUser";

const authTitle = document.getElementById("auth-title");
const authForm = document.getElementById("auth-form");
const authSubmit = document.getElementById("auth-submit");
const authStatus = document.getElementById("auth-status");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const switchLoginBtn = document.getElementById("switch-login-btn");
const switchSignupBtn = document.getElementById("switch-signup-btn");

const queryParams = new URLSearchParams(window.location.search);
const redirectPath = queryParams.get("redirect") || "index.html";
let authMode = queryParams.get("mode") === "signup" ? "signup" : "login";

function getUsers() {
  try {
    const usersRaw = localStorage.getItem(STORAGE_USERS_KEY);
    return usersRaw ? JSON.parse(usersRaw) : {};
  } catch (error) {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function setSessionUser(username) {
  localStorage.setItem(STORAGE_SESSION_KEY, username);
}

function setStatus(message, isError = false) {
  authStatus.textContent = message;
  authStatus.classList.toggle("error", isError);
}

function goBackAfterAuth() {
  window.location.href = redirectPath;
}

function updateMode(mode) {
  authMode = mode;
  const isLogin = mode === "login";
  authTitle.textContent = isLogin ? "Log In" : "Sign Up";
  authSubmit.textContent = isLogin ? "Log In" : "Create Account";
  passwordInput.autocomplete = isLogin ? "current-password" : "new-password";
  setStatus(
    isLogin
      ? "Enter your credentials to log in."
      : "Create a test account for this browser."
  );
}

switchLoginBtn.addEventListener("click", () => {
  updateMode("login");
});

switchSignupBtn.addEventListener("click", () => {
  updateMode("signup");
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    setStatus("Username and password are required.", true);
    return;
  }

  const users = getUsers();
  const existingPassword = users[username];

  if (authMode === "signup") {
    if (existingPassword) {
      setStatus("That username already exists. Try logging in.", true);
      return;
    }

    users[username] = password;
    saveUsers(users);
    setSessionUser(username);
    setStatus(`Account created. Redirecting as ${username}...`);
    setTimeout(goBackAfterAuth, 350);
    return;
  }

  if (!existingPassword || existingPassword !== password) {
    setStatus("Invalid username or password.", true);
    return;
  }

  setSessionUser(username);
  setStatus(`Welcome back, ${username}. Redirecting...`);
  setTimeout(goBackAfterAuth, 350);
});

updateMode(authMode);
