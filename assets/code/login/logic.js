window.addEventListener("DOMContentLoaded", () => {
  async function checktsout() {
    try {
      const resp = await fetch("/api/tus", { credentials: "include" });
      if (resp.status === 403) return;
      const data = await resp.json();
      if (data && typeof data.status !== "undefined") {
        window.location.href = "/editor";
      }
    } catch (err) {
      console.error("failed to check:", err);
    }
  }

  checktsout();

  document.getElementById("login-btn").addEventListener("click", async function () {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (!user) {
      notify("Please enter a username!", "error", 3500);
      return;
    }
    if (!pass) {
      notify("Enter a valid password!", "error", 3500);
      return;
    }

    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password: pass }),
      });

      const data = await resp.json();

      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        document.getElementById("password").value = "";
        notify("Wrong password or username!", "error", 3500);
      }
    } catch (err) {
      console.error("Login failed:", err);
      document.getElementById("password").value = "";
      notify("Wrong password or username!", "error", 3500);
    }
  });
});
