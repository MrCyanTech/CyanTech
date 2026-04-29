
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
  return StateManager.getUsers();
}

function saveUsers(users) {
  StateManager.saveUsers(users);
}

function setSessionUser(username) {
  StateManager.setSessionUser(username);
}

function setStatus(message, isError = false) {
  authStatus.textContent = message;
  authStatus.classList.toggle("error", isError);
}

function goBackAfterAuth() {
  NavigationController.navigate(redirectPath);
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

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    setStatus("Username and password are required.", true);
    return;
  }

  if (authMode === "signup") {
    const result = await AuthService.signup(username, password);
    if (!result.success) {
      setStatus(result.error, true);
      return;
    }
    setStatus(`Account created. Redirecting as ${username}...`);
    setTimeout(goBackAfterAuth, 350);
    return;
  }

  const result = await AuthService.login(username, password);
  if (!result.success) {
    setStatus(result.error, true);
    return;
  }
  setStatus(`Welcome back, ${username}. Redirecting...`);
  setTimeout(goBackAfterAuth, 350);
});

updateMode(authMode);
