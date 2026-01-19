const API_BASE =
  "https://locatrix-backend-development.up.railway.app/api/user";

/* ---------------- LOGIN ---------------- */

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("[LOGIN] Attempting login...");

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("[LOGIN] Login failed:", result);
      alert("Login failed: " + (result.message || "Unknown error"));
      return;
    }

    const user = result.data.user;

    console.log("[LOGIN] Login successful:", user);

    // Store user data
    localStorage.setItem("email", user.email);
    localStorage.setItem("name", user.fullName);
    localStorage.setItem("zohoToken", user.zohoToken);

    console.log("[LOGIN] Stored zohoToken:", user.zohoToken);

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("[LOGIN] Error:", error);
    alert("Login error: " + error.message);
  }
}

/* ---------------- AUTH GUARD ---------------- */

function requireAuth() {
  const token = localStorage.getItem("zohoToken");
  
  if (!token) {
    console.log("[AUTH] No token found, redirecting to login...");
    window.location.href = "index.html";
    return false;
  }
  
  console.log("[AUTH] Token found, user authenticated");
  return true;
}

/* ---------------- DASHBOARD ---------------- */

function loadDashboard() {
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("zohoToken");

  console.log("[DASHBOARD] Loading dashboard data:", { email, name, token });

  document.getElementById("email").innerText = "Email: " + (email || "N/A");
  document.getElementById("name").innerText = "Name: " + (name || "N/A");
  document.getElementById("token").innerText = "Zoho Token: " + (token || "N/A");
}

/* ---------------- LOGOUT ---------------- */

function handleLogout() {
  console.log("[LOGOUT] Logging out...");
  localStorage.clear();
  window.location.href = "index.html";
}

/* ---------------- INIT ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  console.log("[INIT] Page loaded");

  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginForm) {
    console.log("[INIT] Login page detected");
    loginForm.addEventListener("submit", handleLogin);
    return;
  }

  if (logoutBtn) {
    console.log("[INIT] Dashboard page detected");
    
    if (!requireAuth()) return;
    
    loadDashboard();
    logoutBtn.addEventListener("click", handleLogout);
  }
});