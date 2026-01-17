document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await axios.post(
        // "http://localhost:3001/api/user/login",
        "https://locatrix-backend-development.up.railway.app/api/user/login",
        { email, password }
      );

      const user = res.data?.data?.user;
      const zohoToken = res.data?.data?.user?.zohoToken;

      if (!user || !zohoToken) {
        throw new Error("Invalid login response");
      }
      localStorage.setItem("zoho_asap_token", zohoToken);

      window.location.href =
        `dashboard.html?name=${encodeURIComponent(user.firstname)}`;
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  });
});
