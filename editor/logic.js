let last_status = null;

function updstatus(status) {
  const dot = document.querySelector(".status-dot");
  const statustxtc = document.querySelector(".status");

  if (!dot || !statustxtc) {
    console.warn("ermmm");
    return;
  }

  let statustxt = [...statustxtc.childNodes].find(
    n => n.nodeType === Node.TEXT_NODE
  );

  if (!statustxt) {
       console.warn("ermmm2");
  }

  if (status) {
    dot.style.backgroundColor = "#64F575";
    statustxt.nodeValue = "Connected";
  } else {
    dot.style.backgroundColor = "#e93f40";
    statustxt.nodeValue = "Not Connected";
  }

  console.log("dot ->", dot, "status text ->", statustxt.nodeValue);
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
