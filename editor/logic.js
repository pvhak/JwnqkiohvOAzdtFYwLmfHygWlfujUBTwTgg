function get_coookie() {
  const cookies = document.cookie.split(";").map(c => c.trim());
  for (const c of cookies) {
    if (c.startsWith("auth=")) {
      try {
        const parsed = JSON.parse(decodeURIComponent(c.split("=")[1]));
        return parsed.user;
      } catch {}
    }
  }
  return null;
}

const user = get_coookie();
if (!user) {window.location.href = "/";} // get out nigga

let last_status = null;

function updstatus(status) {
  const dot = document.querySelector(".status-dot");
  const statustxt = document.querySelector(".status");
  if (!dot || !statustxt) return;

  if (status) {
    dot.style.backgroundColor = "#64F575";
    statustxt.innerText = "Connected";
  } else {
    dot.style.backgroundColor = "#e93f40";
    statustxt.innerText = "Not Connected";
  }
}

async function poll_status() {
  try {
    const resp = await fetch("/api/getstatus", { credentials: "include" });
    if (resp.status === 403) {
      window.location.href = "/";
      return;
    }

    const data = await resp.json();
    if (data.status !== last_status) {
      last_status = data.status;
      updstatus(last_status);
    }
  } catch (err) {console.error(err);}
}

poll_status();
setInterval(poll_status, 2000);

document.getElementById("clear-btn").addEventListener("click", () => {window.editor.setValue("");});
document.getElementById("execute-btn").addEventListener("click", async () => {
  const code = window.editor.getValue();
  const resp = await fetch(`/api/ccode?code=${encodeURIComponent(code)}`);
  const result = await resp.json();
  console.log(result);
});
