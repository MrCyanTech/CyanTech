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

enterLabBtn.addEventListener("click", () => {
  const sessionUser = getSessionUser();
  if (sessionUser !== LAB_ALLOWED_USER) {
    setHomeStatus(`Access denied. Log in as ${LAB_ALLOWED_USER} to enter the lab.`, true);
    return;
  }

  window.location.href = LAB_PAGE_PATH;
});

updateTopAuthState();
