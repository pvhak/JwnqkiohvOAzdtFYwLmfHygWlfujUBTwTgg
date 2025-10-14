let last_status = null;

function updstatus(status) {
  const dot = document.querySelector(".status-dot");
  const statustxt = document.querySelector(".status");

  console.log("dot ->", dot, "statustxt ->", statustxt, "status ->", status);

  if (!dot || !statustxt) {
    console.warn("no status elements");
    return;
  }

  if (status) {
    dot.style.backgroundColor = "#64F575";
    statustxt.innerText = "Connected";
    console.log("Connected");
  } else {
    dot.style.backgroundColor = "#e93f40";
    statustxt.innerText = "Not Connected";
    console.log("Not Connected");
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
    console.log("fetched status ->", data);

    if (data.status !== last_status) {
      last_status = data.status;
      updstatus(last_status);
    }
  } catch (err) {
    console.error("failed to fetch status:", err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  poll_status();
  setInterval(poll_status, 2000);
  document.getElementById("clear-btn")?.addEventListener("click", () => {window.editor.setValue("");});
  document.getElementById("execute-btn")?.addEventListener("click", async () => {
    const code = window.editor.getValue();
    try {
      const resp = await fetch(`/api/ccode?code=${encodeURIComponent(code)}`, {
        credentials: "include",
      });

      if (!resp.ok) {
        console.error("error..", resp.status);
        return;
      }

      const result = await resp.json();
      console.log(result);
    } catch (err) {console.error("failed to exec; ", err);}
  });
});
