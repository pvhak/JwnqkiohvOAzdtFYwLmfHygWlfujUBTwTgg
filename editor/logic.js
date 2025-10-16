let last_status = null;

function updstatus(status) {
  const dot = document.querySelector(".status-dot");
  const statustxt = document.querySelector(".status-text");

  if (!dot || !statustxt) return;

  if (status) {
    dot.style.backgroundColor = "#64F575";
    statustxt.textContent = "Connected";
  } else {
    dot.style.backgroundColor = "#e93f40";
    statustxt.textContent = "Not Connected";
  }
}

function upd_username(username) {
  const un_span = document.querySelector(".top-right-bar .username");
  if (un_span && username) { un_span.textContent = username; }
}

async function poll_status() {
  try {
    const resp = await fetch("/api/getstatus", { credentials: "include" });

    if (resp.status === 403) {
      window.location.href = "/";
      return;
    }

    const data = await resp.json();
    upd_username(data.user);
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

  document.getElementById("clear-btn")?.addEventListener("click", () => {
    window.editor.setValue("");
  });

  document.getElementById("execute-btn")?.addEventListener("click", async () => {
    if (!last_status) {
      notify("Please connect first.", "info", 4000);
      return;
    }

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
    } catch (err) {
      console.error("failed to exec; ", err);
    }
  });
});

//////////////////////////////////////////////////////////////////////////////

const pfp_frame = document.getElementById("pfp_frame");
const lo_btn = document.getElementById("lu-btn");
let ttip_active = false;

pfp_frame.addEventListener("mouseenter", () => {
  if (!ttip_active) pfp_frame.classList.add("hover");
});
pfp_frame.addEventListener("mouseleave", () => {
  if (!ttip_active) pfp_frame.classList.remove("hover");
});

pfp_frame.addEventListener("click", (e) => {
  e.stopPropagation();
  if (ttip_active) {
    ttip_active = false;
    pfp_frame.classList.remove("active");
    pfp_frame.classList.add("hover");
  } else {
    ttip_active = true;
    pfp_frame.classList.add("active");
    pfp_frame.classList.remove("hover");
  }
});

document.addEventListener("click", () => {
  if (ttip_active) {
    ttip_active = false;
    pfp_frame.classList.remove("active");
    pfp_frame.classList.remove("hover");
  }
});

lo_btn.addEventListener("click", (e) => {
  e.stopPropagation();
  window.location.href = "/api/logout";
});
