const API_BASE =
  "https://locatrix-backend-development.up.railway.app/api/user";

/* ------------------------------------
   LOGIN
------------------------------------- */

async function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!emailInput || !passwordInput) return;

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message);

    const user = result.data.user;

    localStorage.setItem("email", user.email);
    localStorage.setItem("name", user.fullName);
    localStorage.setItem("zohoToken", user.zohoToken);

    window.location.href = "dashboard.html";
  } catch (err) {
    alert("Login failed");
  }
}

/* ------------------------------------
   DASHBOARD
------------------------------------- */

function loadDashboardData() {
  const emailEl = document.getElementById("email");
  const nameEl = document.getElementById("name");
  const tokenEl = document.getElementById("token");

  if (!emailEl || !nameEl || !tokenEl) return;

  emailEl.innerText = "Email: " + localStorage.getItem("email");
  nameEl.innerText = "Name: " + localStorage.getItem("name");
  tokenEl.innerText = "Zoho Token: " + localStorage.getItem("zohoToken");
}

/* ------------------------------------
   ZOHO LOGIN
------------------------------------- */

function zohoLogin() {
  const token = localStorage.getItem("zohoToken");
  if (!token || !window.ZohoDeskAsapReady) return;

  window.ZohoDeskAsapReady(function () {
    window.ZohoDeskAsap.invoke("login", function (success) {
      success(token);
    });
  });
}

/* ------------------------------------
   LOGOUT
------------------------------------- */

async function handleLogout() {
  try {
    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (_) {}

  if (window.ZohoDeskAsapReady) {
    window.ZohoDeskAsapReady(function () {
      window.ZohoDeskAsap.invoke("logout");
    });
  }

  localStorage.clear();
  window.location.href = "index.html";
}

/* ------------------------------------
   INIT
------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  // login page
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // dashboard page
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    loadDashboardData();
    zohoLogin();
    logoutBtn.addEventListener("click", handleLogout);
  }
});
