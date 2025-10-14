async function checktsout() {
  try {
    const resp = await fetch("/api/getstatus", { credentials: "include" });
    if (resp.status === 403) return;
    const data = await resp.json();
    if (data && typeof data.status !== "undefined") {
      window.location.href = "/editor";
    }
  } catch (err) {console.error("failed to check:", err);}
}

window.addEventListener("DOMContentLoaded", () => {
  checktsout();
  document.getElementById("login-btn").addEventListener("click", async function () {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    if (!user || !pass) return;
      const resp = await fetch(`/api/login?user=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`, {
        method: "POST",
         credentials: "include",
      });
      const data = await resp.json();
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {alert("wrong key");}
    } catch (err) {
      console.error("fail:", err);
      alert("wrong password or username!");
    }
  });
});
