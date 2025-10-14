document.getElementById("login-btn").addEventListener("click", async function () {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  if (!user || !pass) return;

  const resp = await fetch(`/api/login?user=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`);
  const data = await resp.json();
  if (data.redirect) {window.location.href = data.redirect;} else {alert("wrong key");}
});
