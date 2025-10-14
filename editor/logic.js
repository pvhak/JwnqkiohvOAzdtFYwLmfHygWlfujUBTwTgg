(async () => {
  const resp = await fetch("/api/getstatus");
  if (resp.status === 403) window.location.href = "/";
})();

document.getElementById("clear-btn").addEventListener("click", () => {
  window.editor.setValue("");
});

document.getElementById("execute-btn").addEventListener("click", async () => {
  const code = window.editor.getValue();
  const resp = await fetch(`/api/ccode?code=${encodeURIComponent(code)}`);
  const result = await resp.json();
  console.log(result);
});
