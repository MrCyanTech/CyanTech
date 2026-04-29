const authTitle = document.getElementById("auth-title");
const authForm = document.getElementById("auth-form");
const authSubmit = document.getElementById("auth-submit");
const authStatus = document.getElementById("auth-status");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const confirmPasswordInput = document.getElementById("confirm-password-input");
const switchLoginBtn = document.getElementById("switch-login-btn");
const switchSignupBtn = document.getElementById("switch-signup-btn");

const queryParams = new URLSearchParams(window.location.search);
const redirectPath = queryParams.get("redirect") || "index.html";
let authMode = queryParams.get("mode") === "signup" ? "signup" : "login";

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
  
  // Toggle Confirm Password field visibility
  if (confirmPasswordInput) {
    confirmPasswordInput.classList.toggle("hidden", isLogin);
    confirmPasswordInput.required = !isLogin;
  }

  passwordInput.autocomplete = isLogin ? "current-password" : "new-password";
  setStatus(
    isLogin
      ? "Enter your email and password to log in."
      : "Create your CyanTech account."
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

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

  if (!email || !password) {
    setStatus("Email and password are required.", true);
    return;
  }

  if (authMode === "signup") {
    if (password !== confirmPassword) {
      setStatus("Passwords do not match.", true);
      return;
    }
    
    const result = await AuthService.signup(email, password);
    if (!result.success) {
      setStatus(result.error, true);
      return;
    }
    setStatus(`Account created. Redirecting as ${email}...`);
    setTimeout(goBackAfterAuth, 350);
    return;
  }

  const result = await AuthService.login(email, password);
  if (!result.success) {
    setStatus(result.error, true);
    return;
  }
  setStatus(`Welcome back, ${email}. Redirecting...`);
  setTimeout(goBackAfterAuth, 350);
});

updateMode(authMode);
