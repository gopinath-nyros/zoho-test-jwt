const API_BASE =
  "https://locatrix-backend-development.up.railway.app/api/user";

/* --------------------------
   LOGIN
--------------------------- */

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    const user = result.data.user;

    localStorage.setItem("email", user.email);
    localStorage.setItem("name", user.fullName);
    localStorage.setItem("zohoToken", user.zohoToken);

    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed");
  }
}

/* --------------------------
   DASHBOARD LOAD
--------------------------- */

async function loadDashboardData() {
  document.getElementById("email").innerText =
    "Email: " + (localStorage.getItem("email") || "N/A");

  document.getElementById("name").innerText =
    "Name: " + (localStorage.getItem("name") || "N/A");

  document.getElementById("token").innerText =
    "Zoho Token: " + (localStorage.getItem("zohoToken") || "N/A");
}

/* --------------------------
   LOGOUT
--------------------------- */

async function handleLogout() {
  try {
    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });

    localStorage.clear();
    window.location.href = "index.html";
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Logout failed");
  }
}

/* --------------------------
   ROUTING
--------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (window.location.pathname.includes("dashboard")) {
    loadDashboardData();

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", handleLogout);
  }
});
