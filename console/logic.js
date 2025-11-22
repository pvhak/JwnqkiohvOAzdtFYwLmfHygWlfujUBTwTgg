// no real logic here yet!

function rprint(type, msg) {
  const cel = document.getElementById("console");

  const entry = document.createElement("div");
  entry.classList.add("loge");

  if (type === "warning") entry.classList.add("l_warning");
  else if (type === "error") entry.classList.add("l_error");
  else entry.classList.add("l_info");

  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const time = `[${hours}:${minutes}${ampm}]:`;

  entry.innerHTML = `<span class="logt">${time}</span><span>${msg}</span>`;
  cel.appendChild(entry);
  cel.scrollTop = cel.scrollHeight;
}

// rinput
const input = document.getElementById("rcinput");
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const command = input.value.trim();
    if (command) {
      rprint("info", command);
      input.value = "";
    }
  }
});


rprint("info", "ur console loaded.. i hate rconsole..... just use the normal print....");
rprint("info", "rprint");
rprint("error", "rerror");
rprint("warning", "rwarn");
