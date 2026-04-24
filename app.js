const STORAGE_USERS_KEY = "cyantechUsers";
const STORAGE_SESSION_KEY = "cyantechSessionUser";

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const authTitle = document.getElementById("auth-title");
const authForm = document.getElementById("auth-form");
const authSubmit = document.getElementById("auth-submit");
const authStatus = document.getElementById("auth-status");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");

let authMode = "login";

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

function clearSessionUser() {
  localStorage.removeItem(STORAGE_SESSION_KEY);
}

function getSessionUser() {
  return localStorage.getItem(STORAGE_SESSION_KEY);
}

function setStatus(message, isError = false) {
  authStatus.textContent = message;
  authStatus.classList.toggle("error", isError);
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

function updateAuthUIForSession() {
  const sessionUser = getSessionUser();
  if (sessionUser) {
    setStatus(`Logged in as ${sessionUser}.`);
    logoutBtn.hidden = false;
    authForm.querySelectorAll("input, button").forEach((element) => {
      element.disabled = true;
    });
    return;
  }

  logoutBtn.hidden = true;
  authForm.querySelectorAll("input, button").forEach((element) => {
    element.disabled = false;
  });
}

loginBtn.addEventListener("click", () => {
  updateMode("login");
  updateAuthUIForSession();
});

signupBtn.addEventListener("click", () => {
  updateMode("signup");
  updateAuthUIForSession();
});

logoutBtn.addEventListener("click", () => {
  clearSessionUser();
  usernameInput.value = "";
  passwordInput.value = "";
  updateMode("login");
  updateAuthUIForSession();
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
    setStatus(`Account created. Logged in as ${username}.`);
    updateAuthUIForSession();
    return;
  }

  if (!existingPassword || existingPassword !== password) {
    setStatus("Invalid username or password.", true);
    return;
  }

  setSessionUser(username);
  setStatus(`Welcome back, ${username}.`);
  updateAuthUIForSession();
});

updateMode("login");
updateAuthUIForSession();
